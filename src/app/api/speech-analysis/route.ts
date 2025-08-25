// src/app/api/speech-analysis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface IELTSFeedback {
  overallScore: number;
  scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  transcript: string;
  strengths: string[];
  improvements: string[];
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
You are an expert IELTS Speaking examiner. Analyze this IELTS Part 2 response and provide detailed feedback.

Question: "${question}"
Response: "${transcript}"

Please provide your analysis in the following JSON format:
{
  "overallScore": (number 4.0-9.0),
  "scores": {
    "fluencyCoherence": (number 4.0-9.0),
    "lexicalResource": (number 4.0-9.0), 
    "grammaticalRange": (number 4.0-9.0),
    "pronunciation": (estimated number 4.0-9.0)
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "detailedAnalysis": {
    "fluency": "detailed fluency analysis",
    "vocabulary": "detailed vocabulary analysis", 
    "grammar": "detailed grammar analysis",
    "pronunciation": "pronunciation feedback based on transcript patterns"
  }
}

Consider:
- Fluency & Coherence: Natural flow, hesitations, linking ideas
- Lexical Resource: Vocabulary range, accuracy, appropriateness
- Grammatical Range: Sentence variety, accuracy, complexity
- Pronunciation: Based on transcript quality and patterns
- Overall coherence and task achievement

Be constructive but honest in your assessment.`;

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