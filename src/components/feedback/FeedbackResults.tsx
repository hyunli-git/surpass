'use client';

import { useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  MessageSquare, 
  Volume2, 
  FileText,
  Clock,
  Target,
  BookOpen,
  Lightbulb,
  BarChart3,
  Edit3,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface WritingFeedback {
  overallScore: number;
  bandScore: string;
  wordCount: number;
  timeManagement: {
    timeSpent: number;
    recommendation: string;
  };
  criteria: {
    taskResponse: { score: number; feedback: string; suggestions: string[]; };
    coherenceCohesion: { score: number; feedback: string; suggestions: string[]; };
    lexicalResource: { score: number; feedback: string; suggestions: string[]; };
    grammaticalAccuracy: { score: number; feedback: string; suggestions: string[]; };
  };
  detailedFeedback: {
    strengths: string[];
    areasForImprovement: string[];
    specificSuggestions: string[];
  };
  correctedVersion: string;
  vocabularyEnhancements: { original: string; enhanced: string; explanation: string; }[];
  grammarCorrections: { original: string; corrected: string; rule: string; }[];
}

interface SpeakingFeedback {
  overallScore: number;
  bandScore: string;
  duration: { actual: number; target?: number; feedback: string; };
  transcript: string;
  criteria: {
    fluency: { score: number; feedback: string; suggestions: string[]; };
    pronunciation: { score: number; feedback: string; suggestions: string[]; };
    vocabulary: { score: number; feedback: string; suggestions: string[]; };
    grammar: { score: number; feedback: string; suggestions: string[]; };
    taskResponse?: { score: number; feedback: string; suggestions: string[]; };
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

interface FeedbackResultsProps {
  type: 'writing' | 'speaking';
  feedback: WritingFeedback | SpeakingFeedback;
  testType: 'ielts' | 'tef' | 'opic';
  originalResponse?: string;
  onRetry?: () => void;
  onNextTask?: () => void;
}

export default function FeedbackResults({ 
  type, 
  feedback, 
  testType,
  onRetry,
  onNextTask 
}: FeedbackResultsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'detailed' | 'corrections'>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6.5) return 'text-blue-600 bg-blue-100';
    if (score >= 5) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 7) return <CheckCircle className="w-5 h-5 text-green-500" />;
    return <AlertCircle className="w-5 h-5 text-yellow-500" />;
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            {type === 'writing' ? (
              <FileText className="w-8 h-8 text-blue-600" />
            ) : (
              <Volume2 className="w-8 h-8 text-green-600" />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 capitalize">
                {type} Assessment Results
              </h1>
              <p className="text-gray-600 uppercase">{testType} Test</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-4xl font-bold px-4 py-2 rounded-lg ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore.toFixed(1)}
            </div>
            <div className="text-lg font-medium text-gray-700 mt-1">
              {feedback.bandScore}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {type === 'writing' && 'wordCount' in feedback && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Edit3 className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{feedback.wordCount}</div>
              <div className="text-sm text-gray-600">Words</div>
            </div>
          )}
          
          {type === 'speaking' && 'duration' in feedback && (
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <Clock className="w-6 h-6 text-gray-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800">{formatDuration(feedback.duration.actual)}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Target className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{feedback.detailedFeedback.strengths.length}</div>
            <div className="text-sm text-gray-600">Strengths</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <TrendingUp className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{feedback.detailedFeedback.areasForImprovement.length}</div>
            <div className="text-sm text-gray-600">To Improve</div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <Lightbulb className="w-6 h-6 text-gray-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-800">{feedback.detailedFeedback.specificSuggestions.length}</div>
            <div className="text-sm text-gray-600">Tips</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b">
          <nav className="flex space-x-8 px-6">
            {(['overview', 'detailed', 'corrections'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'overview' && 'Overview'}
                {tab === 'detailed' && 'Detailed Analysis'}
                {tab === 'corrections' && 'Corrections & Tips'}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Criteria Scores */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Assessment Criteria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(feedback.criteria).map(([key, criterion]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <div className="flex items-center gap-2">
                          {getScoreIcon(criterion.score)}
                          <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(criterion.score)}`}>
                            {criterion.score.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{criterion.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths and Areas for Improvement */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {feedback.detailedFeedback.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start gap-2 text-green-700">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Areas for Improvement
                  </h3>
                  <ul className="space-y-2">
                    {feedback.detailedFeedback.areasForImprovement.map((area, index) => (
                      <li key={index} className="flex items-start gap-2 text-orange-700">
                        <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Analysis Tab */}
          {activeTab === 'detailed' && (
            <div className="space-y-6">
              {type === 'speaking' && 'pronunciationAnalysis' in feedback && (
                <>
                  {/* Pronunciation Analysis */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <button
                      onClick={() => toggleSection('pronunciation')}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-blue-800 flex items-center gap-2">
                        <Volume2 className="w-5 h-5" />
                        Pronunciation Analysis
                      </h3>
                      {expandedSections.has('pronunciation') ? 
                        <ChevronUp className="w-5 h-5" /> : 
                        <ChevronDown className="w-5 h-5" />
                      }
                    </button>
                    
                    {expandedSections.has('pronunciation') && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">Problematic Sounds</h4>
                          <div className="flex flex-wrap gap-2">
                            {feedback.pronunciationAnalysis.problematicSounds.map((sound, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {sound}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">Word Stress Issues</h4>
                          <div className="flex flex-wrap gap-2">
                            {feedback.pronunciationAnalysis.wordStress.map((word, index) => (
                              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-blue-700 mb-2">Intonation Feedback</h4>
                          <p className="text-blue-700 text-sm">{feedback.pronunciationAnalysis.intonationFeedback}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fluency Analysis */}
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <button
                      onClick={() => toggleSection('fluency')}
                      className="w-full flex items-center justify-between text-left"
                    >
                      <h3 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Fluency Analysis
                      </h3>
                      {expandedSections.has('fluency') ? 
                        <ChevronUp className="w-5 h-5" /> : 
                        <ChevronDown className="w-5 h-5" />
                      }
                    </button>
                    
                    {expandedSections.has('fluency') && (
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium text-green-700 mb-1">Pace</h4>
                          <p className="text-green-600 text-sm">{feedback.fluencyAnalysis.pace}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700 mb-1">Pauses</h4>
                          <p className="text-green-600 text-sm">{feedback.fluencyAnalysis.pauses}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700 mb-1">Hesitation</h4>
                          <p className="text-green-600 text-sm">{feedback.fluencyAnalysis.hesitation}</p>
                        </div>
                        <div>
                          <h4 className="font-medium text-green-700 mb-1">Coherence</h4>
                          <p className="text-green-600 text-sm">{feedback.fluencyAnalysis.coherence}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Transcript */}
                  {feedback.transcript && (
                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">Speech Transcript</h3>
                      <div className="bg-white p-4 rounded border border-gray-300 max-h-64 overflow-y-auto">
                        <p className="text-gray-700 leading-relaxed">{feedback.transcript}</p>
                      </div>
                    </div>
                  )}
                </>
              )}

              {type === 'writing' && (
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Time Management</h3>
                  <p className="text-gray-700">{'timeManagement' in feedback && feedback.timeManagement.recommendation}</p>
                </div>
              )}
            </div>
          )}

          {/* Corrections Tab */}
          {activeTab === 'corrections' && (
            <div className="space-y-6">
              {type === 'writing' && 'correctedVersion' in feedback && feedback.correctedVersion && (
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Corrected Version
                  </h3>
                  <div className="bg-white p-4 rounded border border-green-300 max-h-64 overflow-y-auto">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{feedback.correctedVersion}</p>
                  </div>
                </div>
              )}

              {type === 'writing' && 'vocabularyEnhancements' in feedback && feedback.vocabularyEnhancements.length > 0 && (
                <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Vocabulary Enhancements
                  </h3>
                  <div className="space-y-3">
                    {feedback.vocabularyEnhancements.map((enhancement, index) => (
                      <div key={index} className="bg-white p-4 rounded border border-blue-200">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-red-600 line-through">{enhancement.original}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 font-medium">{enhancement.enhanced}</span>
                        </div>
                        <p className="text-sm text-blue-700">{enhancement.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {type === 'writing' && 'grammarCorrections' in feedback && feedback.grammarCorrections.length > 0 && (
                <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                  <h3 className="text-lg font-semibold text-orange-800 mb-4 flex items-center gap-2">
                    <Edit3 className="w-5 h-5" />
                    Grammar Corrections
                  </h3>
                  <div className="space-y-3">
                    {feedback.grammarCorrections.map((correction, index) => (
                      <div key={index} className="bg-white p-4 rounded border border-orange-200">
                        <div className="flex items-center gap-4 mb-2">
                          <span className="text-red-600 line-through">{correction.original}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-green-600 font-medium">{correction.corrected}</span>
                        </div>
                        <p className="text-sm text-orange-700 font-medium">Rule: {correction.rule}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specific Suggestions */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-4 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />
                  Specific Improvement Suggestions
                </h3>
                <ul className="space-y-3">
                  {feedback.detailedFeedback.specificSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-200 text-purple-800 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-purple-700">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        )}
        {onNextTask && (
          <button
            onClick={onNextTask}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Next Task
          </button>
        )}
        <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          Save Results
        </button>
      </div>
    </div>
  );
}