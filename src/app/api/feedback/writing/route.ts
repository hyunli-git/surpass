import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const WritingFeedbackRequest = z.object({
  response: z.string().min(10, 'Response must be at least 10 characters'),
  testType: z.enum(['ielts', 'tef', 'opic']),
  taskType: z.string(),
  prompt: z.string(),
  targetWordCount: z.number().optional(),
  timeSpent: z.number().optional(), // in seconds
});

interface WritingFeedback {
  overallScore: number;
  bandScore: string;
  wordCount: number;
  timeManagement: {
    timeSpent: number;
    recommendation: string;
  };
  criteria: {
    taskResponse: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    coherenceCohesion: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    lexicalResource: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    grammaticalAccuracy: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
  };
  detailedFeedback: {
    strengths: string[];
    areasForImprovement: string[];
    specificSuggestions: string[];
  };
  correctedVersion: string;
  vocabularyEnhancements: {
    original: string;
    enhanced: string;
    explanation: string;
  }[];
  grammarCorrections: {
    original: string;
    corrected: string;
    rule: string;
  }[];
}

// Simulated AI analysis (replace with actual AI service)
async function analyzeWritingResponse(
  response: string,
  testType: string,
  taskType: string,
  prompt: string,
  targetWordCount?: number
): Promise<WritingFeedback> {
  const wordCount = response.split(/\s+/).length;
  
  // Simulate AI analysis based on test type and response
  const feedback: WritingFeedback = {
    overallScore: Math.floor(Math.random() * 4) + 6, // 6-9 range
    bandScore: getBandScore(testType, Math.floor(Math.random() * 4) + 6),
    wordCount,
    timeManagement: {
      timeSpent: 0,
      recommendation: getTimeRecommendation(wordCount, targetWordCount)
    },
    criteria: {
      taskResponse: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateTaskResponseFeedback(response, prompt, testType),
        suggestions: generateTaskResponseSuggestions(testType, taskType)
      },
      coherenceCohesion: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateCoherenceFeedback(response),
        suggestions: generateCoherenceSuggestions()
      },
      lexicalResource: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateLexicalFeedback(response),
        suggestions: generateLexicalSuggestions()
      },
      grammaticalAccuracy: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateGrammarFeedback(response),
        suggestions: generateGrammarSuggestions()
      }
    },
    detailedFeedback: {
      strengths: generateStrengths(response, testType),
      areasForImprovement: generateImprovementAreas(response, testType),
      specificSuggestions: generateSpecificSuggestions(testType, taskType)
    },
    correctedVersion: generateCorrectedVersion(response),
    vocabularyEnhancements: generateVocabularyEnhancements(response),
    grammarCorrections: generateGrammarCorrections(response)
  };

  return feedback;
}

function getBandScore(testType: string, score: number): string {
  switch (testType) {
    case 'ielts':
      return `Band ${score}`;
    case 'tef':
      return `Niveau ${['A1', 'A2', 'B1', 'B2', 'C1', 'C2'][Math.min(score - 4, 5)]}`;
    case 'opic':
      return ['Novice Low', 'Novice Mid', 'Novice High', 'Intermediate Low', 'Intermediate Mid', 'Intermediate High'][Math.min(score - 4, 5)];
    default:
      return `Score ${score}`;
  }
}

function getTimeRecommendation(wordCount: number, targetWordCount?: number): string {
  if (!targetWordCount) return "Monitor your time to ensure you complete the task within the allocated time.";
  
  if (wordCount < targetWordCount * 0.8) {
    return "Your response is shorter than recommended. Try to develop your ideas more fully.";
  } else if (wordCount > targetWordCount * 1.2) {
    return "Your response is longer than necessary. Focus on being more concise while maintaining quality.";
  }
  return "Good word count management. You've met the target length effectively.";
}

function generateTaskResponseFeedback(response: string, prompt: string, testType: string): string {
  const feedbacks = [
    "Your response addresses the main aspects of the task effectively.",
    "You've covered most of the required points, but could develop some ideas further.",
    "Your response is relevant to the prompt and shows good understanding of the task.",
    "Consider expanding on your main points to provide more comprehensive coverage."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateTaskResponseSuggestions(testType: string, taskType: string): string[] {
  const suggestions = {
    ielts: [
      "Include a clear introduction and conclusion",
      "Support your main points with specific examples",
      "Address all parts of the question fully",
      "Maintain a formal academic tone throughout"
    ],
    tef: [
      "Respectez la structure demandée (introduction, développement, conclusion)",
      "Utilisez des exemples concrets pour illustrer vos idées",
      "Variez vos expressions et votre vocabulaire",
      "Maintenez un registre de langue approprié"
    ],
    opic: [
      "Provide specific details and examples",
      "Use descriptive language to paint a clear picture",
      "Connect your ideas logically",
      "Show personality in your response"
    ]
  };
  
  return suggestions[testType as keyof typeof suggestions] || suggestions.ielts;
}

function generateCoherenceFeedback(response: string): string {
  const feedbacks = [
    "Your ideas flow logically from one to the next.",
    "Good use of linking words to connect your ideas.",
    "Your paragraphs are well-organized with clear topic sentences.",
    "Consider using more varied transitional phrases to improve flow."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateCoherenceSuggestions(): string[] {
  return [
    "Use a wider range of cohesive devices (however, furthermore, in addition)",
    "Ensure each paragraph has a clear central topic",
    "Use pronoun reference effectively to avoid repetition",
    "Structure your argument logically from general to specific"
  ];
}

function generateLexicalFeedback(response: string): string {
  const feedbacks = [
    "You demonstrate a good range of vocabulary appropriate to the task.",
    "Your word choice is generally accurate with some minor errors.",
    "Good attempt at using sophisticated vocabulary, though some usage could be more precise.",
    "Consider using more varied and precise vocabulary to express your ideas."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateLexicalSuggestions(): string[] {
  return [
    "Use more sophisticated synonyms to avoid repetition",
    "Incorporate topic-specific vocabulary more effectively",
    "Pay attention to word formation and collocation",
    "Use idiomatic expressions appropriately"
  ];
}

function generateGrammarFeedback(response: string): string {
  const feedbacks = [
    "Your grammar is generally accurate with good sentence variety.",
    "You use a mix of simple and complex sentences effectively.",
    "Some minor grammatical errors don't impede communication.",
    "Focus on accuracy in complex grammatical structures."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateGrammarSuggestions(): string[] {
  return [
    "Review subject-verb agreement in complex sentences",
    "Practice using conditional sentences more accurately",
    "Pay attention to article usage (a, an, the)",
    "Use passive voice appropriately in formal writing"
  ];
}

function generateStrengths(response: string, testType: string): string[] {
  const strengths = [
    "Clear understanding of the task requirements",
    "Good organization and structure",
    "Relevant examples and supporting details",
    "Appropriate tone and register",
    "Effective use of linking devices",
    "Varied sentence structures"
  ];
  
  return strengths.slice(0, 3);
}

function generateImprovementAreas(response: string, testType: string): string[] {
  const areas = [
    "Expand on main ideas with more specific details",
    "Use more sophisticated vocabulary",
    "Improve grammatical accuracy",
    "Enhance coherence between paragraphs",
    "Provide stronger conclusion",
    "Use more varied sentence beginnings"
  ];
  
  return areas.slice(0, 3);
}

function generateSpecificSuggestions(testType: string, taskType: string): string[] {
  const suggestions = [
    "Practice timed writing to improve efficiency",
    "Read more academic texts to expand vocabulary",
    "Review grammar rules for complex structures",
    "Practice paraphrasing skills",
    "Study model answers for similar tasks"
  ];
  
  return suggestions.slice(0, 3);
}

function generateCorrectedVersion(response: string): string {
  // Simple corrections simulation
  return response
    .replace(/\bthere\b/g, 'their')
    .replace(/\bits\b/g, "it's")
    .replace(/\. ([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`)
    .trim();
}

function generateVocabularyEnhancements(response: string): { original: string; enhanced: string; explanation: string; }[] {
  const enhancements = [
    {
      original: "good",
      enhanced: "excellent",
      explanation: "More precise and emphatic adjective"
    },
    {
      original: "people think",
      enhanced: "individuals believe",
      explanation: "More formal and specific language"
    },
    {
      original: "very important",
      enhanced: "crucial",
      explanation: "Single word replaces adverb + adjective combination"
    }
  ];
  
  return enhancements.filter(e => response.toLowerCase().includes(e.original));
}

function generateGrammarCorrections(response: string): { original: string; corrected: string; rule: string; }[] {
  const corrections = [
    {
      original: "There are many people thinks",
      corrected: "There are many people who think",
      rule: "Relative clause formation"
    },
    {
      original: "Its important to",
      corrected: "It's important to",
      rule: "Contraction usage (it is = it's)"
    }
  ];
  
  return corrections.filter(c => response.includes(c.original));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = WritingFeedbackRequest.parse(body);

    const feedback = await analyzeWritingResponse(
      validatedData.response,
      validatedData.testType,
      validatedData.taskType,
      validatedData.prompt,
      validatedData.targetWordCount
    );

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Writing feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze writing response' },
      { status: 500 }
    );
  }
}