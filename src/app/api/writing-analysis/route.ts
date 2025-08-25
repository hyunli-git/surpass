// src/app/api/writing-analysis/route.ts

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface WritingFeedback {
  overallScore: number;
  targetScore: number;
  scores: {
    taskAchievement?: number; // Task 1
    taskResponse?: number;    // Task 2
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
  };
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
    taskResponse: string;
    organization: string;
    vocabulary: string;
    grammar: string;
  };
  wordCount: number;
  suggestedRevisions: string[];
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API not configured' }, { status: 503 });
    }

    const { task, text, question } = await request.json();

    if (!text || !task) {
      return NextResponse.json({ error: 'Text and task type are required' }, { status: 400 });
    }

    const wordCount = text.trim().split(/\s+/).filter((word: string) => word.length > 0).length;

    console.log(`Processing ${task} writing analysis:`, wordCount, 'words');

    // Create task-specific analysis prompts
    const getAnalysisPrompt = () => {
      if (task === 'task1') {
        return `
You are an expert IELTS Writing examiner. Analyze this IELTS Writing Task 1 response and provide detailed feedback.

Question: "${question}"
Student Response: "${text}"
Word Count: ${wordCount}

Please provide your analysis in the following JSON format:
{
  "overallScore": (number 4.0-9.0),
  "targetScore": (next achievable band score - typically +0.5 or +1.0),
  "scores": {
    "taskAchievement": (number 4.0-9.0),
    "coherenceCohesion": (number 4.0-9.0),
    "lexicalResource": (number 4.0-9.0),
    "grammaticalRange": (number 4.0-9.0)
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "nextLevelGuide": {
    "currentLevel": "Band X.X description",
    "targetLevel": "Band X.X description for next level",
    "keyFocus": ["Primary skill 1", "Primary skill 2", "Primary skill 3"],
    "specificActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
    "practiceActivities": ["Practice 1", "Practice 2", "Practice 3"],
    "timeline": "Realistic timeframe"
  },
  "detailedAnalysis": {
    "taskResponse": "Analysis of how well the task requirements were met",
    "organization": "Analysis of structure and coherence",
    "vocabulary": "Analysis of lexical resource",
    "grammar": "Analysis of grammatical range and accuracy"
  },
  "wordCount": ${wordCount},
  "suggestedRevisions": ["Revision suggestion 1", "Revision suggestion 2", "Revision suggestion 3"]
}

IELTS Writing Task 1 Criteria:
- Task Achievement: Overview, key features, data accuracy, word count (150+)
- Coherence & Cohesion: Logical organization, paragraphing, linking
- Lexical Resource: Vocabulary for describing data, trends, comparisons
- Grammatical Range: Variety of structures, accuracy, complex sentences

Focus on data description accuracy, trend analysis, and appropriate academic register.`;
      } else {
        return `
You are an expert IELTS Writing examiner. Analyze this IELTS Writing Task 2 essay response and provide detailed feedback.

Question: "${question}"
Student Essay: "${text}"
Word Count: ${wordCount}

Please provide your analysis in the following JSON format:
{
  "overallScore": (number 4.0-9.0),
  "targetScore": (next achievable band score - typically +0.5 or +1.0),
  "scores": {
    "taskResponse": (number 4.0-9.0),
    "coherenceCohesion": (number 4.0-9.0),
    "lexicalResource": (number 4.0-9.0),
    "grammaticalRange": (number 4.0-9.0)
  },
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "nextLevelGuide": {
    "currentLevel": "Band X.X description",
    "targetLevel": "Band X.X description for next level",
    "keyFocus": ["Primary skill 1", "Primary skill 2", "Primary skill 3"],
    "specificActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
    "practiceActivities": ["Practice 1", "Practice 2", "Practice 3"],
    "timeline": "Realistic timeframe"
  },
  "detailedAnalysis": {
    "taskResponse": "Analysis of how well the question was answered and arguments developed",
    "organization": "Analysis of essay structure, paragraphing, and flow",
    "vocabulary": "Analysis of vocabulary range, accuracy, and sophistication",
    "grammar": "Analysis of grammatical structures, complexity, and accuracy"
  },
  "wordCount": ${wordCount},
  "suggestedRevisions": ["Revision suggestion 1", "Revision suggestion 2", "Revision suggestion 3"]
}

IELTS Writing Task 2 Criteria:
- Task Response: Address all parts, clear position, relevant ideas, developed arguments (250+ words)
- Coherence & Cohesion: Logical structure, clear progression, effective paragraphing
- Lexical Resource: Range, accuracy, appropriateness, sophisticated vocabulary
- Grammatical Range: Variety, accuracy, complex structures

Focus on argument development, position clarity, and academic essay conventions.`;
      }
    };

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert IELTS Writing examiner with years of experience. Provide detailed, constructive feedback that helps students improve. Be accurate with band scores and realistic with improvement suggestions.'
        },
        {
          role: 'user',
          content: getAnalysisPrompt()
        }
      ],
      temperature: 0.3,
    });

    const analysisText = completion.choices[0].message.content;
    
    if (!analysisText) {
      throw new Error('No analysis generated');
    }

    // Parse the JSON response
    let feedback: WritingFeedback;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? jsonMatch[0] : analysisText;
      const analysis = JSON.parse(jsonStr);
      
      feedback = {
        ...analysis,
        wordCount,
      };
    } catch (parseError) {
      console.error('Failed to parse analysis JSON:', parseError);
      throw new Error('Failed to parse analysis');
    }

    console.log('Writing analysis completed successfully');

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Writing analysis error:', error);
    
    return NextResponse.json({ 
      error: 'Failed to analyze writing',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}