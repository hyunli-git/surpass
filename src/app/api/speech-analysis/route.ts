// src/app/api/speech-analysis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IELTSFeedback {
  overallScore: number;
  targetScore: number;
  scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  transcript: string;
  strengths: string[];
  improvements: string[];
  nextLevelGuide: {
    currentLevel: string;
    targetLevel: string;
    keyFocus: string[];
    specificActions: string[];
    practiceActivities: string[];
    timeline: string;
  };
  detailedAnalysis: {
    fluency: string;
    vocabulary: string;
    grammar: string;
    pronunciation: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 503 });
    }

    const formData = await request.formData();
    const audioFile = formData.get('audio') as File;
    const question = formData.get('question') as string || "Describe a book you enjoyed reading";

    if (!audioFile) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    console.log('Processing audio file:', audioFile.name, audioFile.size, 'bytes');

    // Step 1: Convert speech to text using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    const transcript = transcription.text;
    console.log('Transcription completed:', transcript.substring(0, 100) + '...');

    // Step 2: Analyze the transcript for IELTS scoring
    const analysisPrompt = `
You are an expert IELTS Speaking examiner. Analyze this IELTS Part 2 response and provide detailed feedback with a personalized next-level improvement guide.

Question: "${question}"
Response: "${transcript}"

Please provide your analysis in the following JSON format:
{
  "overallScore": (number 4.0-9.0),
  "targetScore": (next achievable band score - typically +0.5 or +1.0),
  "scores": {
    "fluencyCoherence": (number 4.0-9.0),
    "lexicalResource": (number 4.0-9.0), 
    "grammaticalRange": (number 4.0-9.0),
    "pronunciation": (estimated number 4.0-9.0)
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "nextLevelGuide": {
    "currentLevel": "Band X.X description (e.g., 'Band 5.5 - Limited User')",
    "targetLevel": "Band X.X description for next level",
    "keyFocus": ["Primary skill 1 to work on", "Primary skill 2 to work on", "Primary skill 3 to work on"],
    "specificActions": ["Concrete action 1", "Concrete action 2", "Concrete action 3", "Concrete action 4"],
    "practiceActivities": ["Practice activity 1", "Practice activity 2", "Practice activity 3"],
    "timeline": "Realistic timeframe to reach next level (e.g., '2-3 months with daily practice')"
  },
  "detailedAnalysis": {
    "fluency": "detailed fluency analysis",
    "vocabulary": "detailed vocabulary analysis", 
    "grammar": "detailed grammar analysis",
    "pronunciation": "pronunciation feedback based on transcript patterns"
  }
}

For the Next Level Guide, consider these IELTS band descriptors:
- Band 4: Very limited user, frequent breakdowns
- Band 5: Limited user, copes with simple situations  
- Band 6: Competent user, occasional inaccuracies
- Band 7: Good user, occasional inappropriate usage
- Band 8: Very good user, occasional unsystematic inaccuracies
- Band 9: Expert user, fully operational command

Focus the next level guide on:
1. The MOST important areas that will move them to the next band
2. Specific, actionable steps they can take immediately
3. Realistic practice activities they can do daily
4. A reasonable timeline based on their current level

Be constructive, specific, and motivating in your guidance.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert IELTS examiner. Provide detailed, constructive feedback in the requested JSON format only.'
        },
        {
          role: 'user',
          content: analysisPrompt
        }
      ],
      temperature: 0.3,
    });

    const analysisText = completion.choices[0].message.content;
    
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse the JSON response
    let feedback: IELTSFeedback;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
      const analysis = JSON.parse(jsonStr);
      
      feedback = {
        ...analysis,
        transcript,
      };
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      throw new Error('Failed to parse analysis');
    }

    console.log('Analysis completed successfully');

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Speech analysis error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to analyze speech',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}