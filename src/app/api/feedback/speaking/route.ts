import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const SpeakingFeedbackRequest = z.object({
  audioUrl: z.string().optional(), // Base64 encoded audio or URL
  transcript: z.string().optional(), // If speech-to-text already done
  testType: z.enum(['ielts', 'tef', 'opic']),
  taskType: z.string(),
  prompt: z.string(),
  duration: z.number(), // Duration in seconds
  targetDuration: z.number().optional(), // Expected duration
});

interface SpeakingFeedback {
  overallScore: number;
  bandScore: string;
  duration: {
    actual: number;
    target?: number;
    feedback: string;
  };
  transcript: string;
  criteria: {
    fluency: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    pronunciation: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    vocabulary: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    grammar: {
      score: number;
      feedback: string;
      suggestions: string[];
    };
    taskResponse?: {
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
  pronunciationAnalysis: {
    problematicSounds: string[];
    wordStress: string[];
    intonationFeedback: string;
  };
  vocabularyAnalysis: {
    complexity: string;
    accuracy: string;
    range: string;
    suggestions: string[];
  };
  fluencyAnalysis: {
    pace: string;
    pauses: string;
    hesitation: string;
    coherence: string;
  };
  grammarAnalysis: {
    accuracy: string;
    complexity: string;
    commonErrors: string[];
  };
}

// Simulated AI analysis for speaking (replace with actual speech analysis AI)
async function analyzeSpeakingResponse(
  audioUrl: string | undefined,
  transcript: string | undefined,
  testType: string,
  taskType: string,
  prompt: string,
  duration: number,
  targetDuration?: number
): Promise<SpeakingFeedback> {
  // Simulate transcript if not provided
  const responseTranscript = transcript || generateSimulatedTranscript(testType, taskType);
  
  const feedback: SpeakingFeedback = {
    overallScore: Math.floor(Math.random() * 4) + 6, // 6-9 range
    bandScore: getBandScore(testType, Math.floor(Math.random() * 4) + 6),
    duration: {
      actual: duration,
      target: targetDuration,
      feedback: getDurationFeedback(duration, targetDuration)
    },
    transcript: responseTranscript,
    criteria: {
      fluency: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateFluencyFeedback(responseTranscript, duration),
        suggestions: generateFluencySuggestions(testType)
      },
      pronunciation: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generatePronunciationFeedback(responseTranscript),
        suggestions: generatePronunciationSuggestions(testType)
      },
      vocabulary: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateVocabularyFeedback(responseTranscript),
        suggestions: generateVocabularySuggestions(testType)
      },
      grammar: {
        score: Math.floor(Math.random() * 4) + 6,
        feedback: generateGrammarFeedback(responseTranscript),
        suggestions: generateGrammarSuggestions(testType)
      }
    },
    detailedFeedback: {
      strengths: generateSpeakingStrengths(responseTranscript, testType),
      areasForImprovement: generateSpeakingImprovementAreas(responseTranscript, testType),
      specificSuggestions: generateSpeakingSpecificSuggestions(testType, taskType)
    },
    pronunciationAnalysis: {
      problematicSounds: generateProblematicSounds(),
      wordStress: generateWordStressIssues(),
      intonationFeedback: generateIntonationFeedback()
    },
    vocabularyAnalysis: {
      complexity: generateVocabularyComplexityFeedback(responseTranscript),
      accuracy: generateVocabularyAccuracyFeedback(responseTranscript),
      range: generateVocabularyRangeFeedback(responseTranscript),
      suggestions: generateVocabularyImprovementSuggestions()
    },
    fluencyAnalysis: {
      pace: generatePaceFeedback(duration, responseTranscript.split(' ').length),
      pauses: generatePausesFeedback(),
      hesitation: generateHesitationFeedback(),
      coherence: generateCoherenceFeedback(responseTranscript)
    },
    grammarAnalysis: {
      accuracy: generateGrammarAccuracyFeedback(responseTranscript),
      complexity: generateGrammarComplexityFeedback(responseTranscript),
      commonErrors: generateCommonErrors()
    }
  };

  // Add task response criteria for IELTS
  if (testType === 'ielts') {
    feedback.criteria.taskResponse = {
      score: Math.floor(Math.random() * 4) + 6,
      feedback: generateTaskResponseFeedback(responseTranscript, prompt),
      suggestions: generateTaskResponseSuggestions()
    };
  }

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

function getDurationFeedback(actual: number, target?: number): string {
  if (!target) return "Monitor your response time to ensure you address all points adequately.";
  
  const ratio = actual / target;
  if (ratio < 0.8) {
    return "Your response is shorter than recommended. Try to elaborate more on your points.";
  } else if (ratio > 1.3) {
    return "Your response is longer than necessary. Practice being more concise while maintaining content quality.";
  }
  return "Good time management. Your response length is appropriate for the task.";
}

function generateSimulatedTranscript(testType: string, taskType: string): string {
  const transcripts = {
    ielts: "Well, I think this is quite an interesting question. In my opinion, there are several factors to consider. First of all, I believe that... um... technology has really changed the way we communicate. For example, social media platforms have made it easier to connect with people from different countries. However, there are also some disadvantages, such as the risk of miscommunication.",
    tef: "Alors, pour répondre à cette question, je dirais que... euh... c'est un sujet assez complexe. D'un côté, on peut voir que les nouvelles technologies ont vraiment transformé notre quotidien. Par exemple, avec les smartphones, on peut maintenant... comment dire... rester en contact avec notre famille et nos amis même quand on voyage.",
    opic: "That's a great question! So, let me tell you about my favorite place. It's actually this little coffee shop near my university. I discovered it during my first year, and it's become like my second home. The atmosphere is really cozy, with comfortable chairs and soft music playing in the background."
  };
  
  return transcripts[testType as keyof typeof transcripts] || transcripts.ielts;
}

function generateFluencyFeedback(transcript: string, duration: number): string {
  const feedbacks = [
    "Your speech flows naturally with appropriate pauses and rhythm.",
    "Generally fluent delivery with minor hesitations that don't impede communication.",
    "Good pace and rhythm, though some areas could benefit from smoother transitions.",
    "Consider reducing filler words and hesitations to improve overall fluency."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateFluencySuggestions(testType: string): string[] {
  const suggestions = {
    ielts: [
      "Practice speaking without notes to improve spontaneous fluency",
      "Work on reducing filler words (um, uh, like)",
      "Practice chunking ideas into natural speech groups",
      "Record yourself speaking to identify areas for improvement"
    ],
    tef: [
      "Pratiquez l'expression spontanée sans notes",
      "Réduisez les mots de liaison inutiles (euh, alors, bon)",
      "Travaillez sur le débit et la prosodie",
      "Enregistrez-vous pour identifier les points à améliorer"
    ],
    opic: [
      "Practice telling stories and describing experiences naturally",
      "Work on connecting ideas smoothly",
      "Develop confidence through regular speaking practice",
      "Focus on maintaining natural conversation flow"
    ]
  };
  
  return suggestions[testType as keyof typeof suggestions] || suggestions.ielts;
}

function generatePronunciationFeedback(transcript: string): string {
  const feedbacks = [
    "Your pronunciation is clear and easy to understand.",
    "Generally accurate pronunciation with good stress patterns.",
    "Most sounds are produced clearly, with minor issues that don't affect comprehension.",
    "Focus on specific sound distinctions to improve clarity."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generatePronunciationSuggestions(testType: string): string[] {
  return [
    "Practice problematic sounds with minimal pairs exercises",
    "Work on word stress patterns in multi-syllable words",
    "Focus on sentence-level intonation patterns",
    "Use pronunciation apps or tools for targeted practice"
  ];
}

function generateVocabularyFeedback(transcript: string): string {
  const feedbacks = [
    "Good range of vocabulary appropriate for the topic.",
    "Effective use of topic-specific vocabulary with minor inaccuracies.",
    "Vocabulary is generally appropriate, though could be more varied.",
    "Consider expanding your vocabulary range for more precise expression."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateVocabularySuggestions(testType: string): string[] {
  return [
    "Study topic-specific vocabulary lists",
    "Practice using synonyms to avoid repetition",
    "Learn collocations and idiomatic expressions",
    "Read extensively to encounter vocabulary in context"
  ];
}

function generateGrammarFeedback(transcript: string): string {
  const feedbacks = [
    "Good control of grammar structures with varied sentence patterns.",
    "Generally accurate grammar with some minor errors.",
    "Solid basic grammar, though complex structures need improvement.",
    "Focus on accuracy in more sophisticated grammatical forms."
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function generateGrammarSuggestions(testType: string): string[] {
  return [
    "Practice using complex sentence structures accurately",
    "Review tense consistency in narrative speech",
    "Work on conditional and subjunctive forms",
    "Practice spoken grammar through conversation exercises"
  ];
}

function generateSpeakingStrengths(transcript: string, testType: string): string[] {
  const strengths = [
    "Clear articulation and good pronunciation",
    "Effective use of examples and personal experiences",
    "Good organization of ideas",
    "Natural intonation and rhythm",
    "Appropriate vocabulary for the context",
    "Confident delivery"
  ];
  
  return strengths.slice(0, 3);
}

function generateSpeakingImprovementAreas(transcript: string, testType: string): string[] {
  const areas = [
    "Reduce hesitation and filler words",
    "Improve grammatical accuracy in complex structures",
    "Expand vocabulary range",
    "Work on specific pronunciation sounds",
    "Enhance fluency and natural flow",
    "Provide more detailed examples"
  ];
  
  return areas.slice(0, 3);
}

function generateSpeakingSpecificSuggestions(testType: string, taskType: string): string[] {
  const suggestions = [
    "Practice speaking about familiar topics daily",
    "Record and analyze your own speech regularly",
    "Engage in conversation practice with native speakers",
    "Study model responses for similar tasks",
    "Focus on time management during responses"
  ];
  
  return suggestions.slice(0, 3);
}

// Additional analysis functions
function generateProblematicSounds(): string[] {
  return ["/θ/ and /ð/ sounds", "/r/ and /l/ distinction", "/v/ and /w/ sounds"];
}

function generateWordStressIssues(): string[] {
  return ["photography", "communicate", "university"];
}

function generateIntonationFeedback(): string {
  return "Good use of rising and falling intonation to convey meaning and maintain listener interest.";
}

function generateVocabularyComplexityFeedback(transcript: string): string {
  return "You use a good mix of basic and intermediate vocabulary with some attempts at more sophisticated terms.";
}

function generateVocabularyAccuracyFeedback(transcript: string): string {
  return "Most vocabulary is used accurately, with minor issues in word choice that don't impede understanding.";
}

function generateVocabularyRangeFeedback(transcript: string): string {
  return "Adequate vocabulary range for the task, though could benefit from more variety in expression.";
}

function generateVocabularyImprovementSuggestions(): string[] {
  return [
    "Learn topic-specific vocabulary for common IELTS themes",
    "Practice using synonyms and paraphrasing",
    "Study collocations and natural word combinations"
  ];
}

function generatePaceFeedback(duration: number, wordCount: number): string {
  const wordsPerMinute = (wordCount / duration) * 60;
  if (wordsPerMinute < 120) {
    return "Your speaking pace is slower than average. Consider speaking slightly faster while maintaining clarity.";
  } else if (wordsPerMinute > 180) {
    return "Your speaking pace is quite fast. Slow down slightly to improve clarity and comprehension.";
  }
  return "Good speaking pace that allows for clear communication.";
}

function generatePausesFeedback(): string {
  return "Natural use of pauses for emphasis and to organize thoughts.";
}

function generateHesitationFeedback(): string {
  return "Minor hesitations present but they don't significantly impact communication.";
}

function generateCoherenceFeedback(transcript: string): string {
  return "Ideas are generally well-connected with appropriate linking devices.";
}

function generateGrammarAccuracyFeedback(transcript: string): string {
  return "Good grammatical accuracy with minor errors that don't impede communication.";
}

function generateGrammarComplexityFeedback(transcript: string): string {
  return "Uses a mix of simple and complex structures, with room for more sophisticated grammar.";
}

function generateCommonErrors(): string[] {
  return [
    "Article usage (a, an, the)",
    "Subject-verb agreement",
    "Preposition choice"
  ];
}

function generateTaskResponseFeedback(transcript: string, prompt: string): string {
  return "You address the main points of the task effectively with relevant examples and explanations.";
}

function generateTaskResponseSuggestions(): string[] {
  return [
    "Ensure you address all parts of the question",
    "Provide specific examples to support your points",
    "Organize your response with clear introduction and conclusion"
  ];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = SpeakingFeedbackRequest.parse(body);

    const feedback = await analyzeSpeakingResponse(
      validatedData.audioUrl,
      validatedData.transcript,
      validatedData.testType,
      validatedData.taskType,
      validatedData.prompt,
      validatedData.duration,
      validatedData.targetDuration
    );

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Speaking feedback error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze speaking response' },
      { status: 500 }
    );
  }
}