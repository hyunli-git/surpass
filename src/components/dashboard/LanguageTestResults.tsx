'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Target,
  Award,
  BookOpen,
  Headphones,
  FileText,
  Volume2,
  Flag
} from 'lucide-react';

interface TestResult {
  id: string;
  language: string;
  languageFlag: string;
  testType: string;
  date: string;
  overallScore: number;
  maxScore: number;
  sections: {
    reading?: number;
    listening?: number;
    writing?: number;
    speaking?: number;
    vocabulary?: number;
    grammar?: number;
  };
  level: string;
  targetScore: number;
  improvement: number; // percentage change from previous attempt
}

interface LanguageTestResultsProps {
  results?: TestResult[];
}

const mockResults: TestResult[] = [
  {
    id: '1',
    language: 'English',
    languageFlag: '🇺🇸',
    testType: 'IELTS',
    date: '2024-09-01',
    overallScore: 7.5,
    maxScore: 9.0,
    sections: {
      reading: 8.0,
      listening: 7.5,
      writing: 7.0,
      speaking: 7.5
    },
    level: 'Band 7.5',
    targetScore: 8.0,
    improvement: 8.7
  },
  {
    id: '2',
    language: 'English',
    languageFlag: '🇺🇸',
    testType: 'IELTS',
    date: '2024-08-15',
    overallScore: 6.9,
    maxScore: 9.0,
    sections: {
      reading: 7.0,
      listening: 7.5,
      writing: 6.5,
      speaking: 6.5
    },
    level: 'Band 6.5',
    targetScore: 8.0,
    improvement: 4.5
  },
  {
    id: '3',
    language: 'French',
    languageFlag: '🇫🇷',
    testType: 'TEF Canada',
    date: '2024-08-30',
    overallScore: 315,
    maxScore: 450,
    sections: {
      reading: 280,
      listening: 305,
      writing: 325,
      speaking: 350
    },
    level: 'B2',
    targetScore: 350,
    improvement: 12.3
  },
  {
    id: '4',
    language: 'French',
    languageFlag: '🇫🇷',
    testType: 'TEF Canada',
    date: '2024-07-20',
    overallScore: 281,
    maxScore: 450,
    sections: {
      reading: 260,
      listening: 275,
      writing: 290,
      speaking: 300
    },
    level: 'B1-B2',
    targetScore: 350,
    improvement: -2.1
  },
  {
    id: '5',
    language: 'Korean',
    languageFlag: '🇰🇷',
    testType: 'OPIc',
    date: '2024-08-10',
    overallScore: 0,
    maxScore: 0,
    sections: {
      speaking: 0
    },
    level: 'IH (Intermediate High)',
    targetScore: 0,
    improvement: 0
  }
];

export default function LanguageTestResults({ results = mockResults }: LanguageTestResultsProps) {
  const getScoreIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'reading':
        return <BookOpen className="w-4 h-4" />;
      case 'listening':
        return <Headphones className="w-4 h-4" />;
      case 'writing':
        return <FileText className="w-4 h-4" />;
      case 'speaking':
        return <Volume2 className="w-4 h-4" />;
      case 'vocabulary':
        return <BookOpen className="w-4 h-4" />;
      case 'grammar':
        return <FileText className="w-4 h-4" />;
      default:
        return <Target className="w-4 h-4" />;
    }
  };

  const getTrendIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (improvement < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getProgressPercentage = (score: number, maxScore: number, targetScore?: number) => {
    if (targetScore && targetScore > 0) {
      return Math.min((score / targetScore) * 100, 100);
    }
    return (score / maxScore) * 100;
  };

  const groupedResults = results.reduce((acc, result) => {
    const key = `${result.language}-${result.testType}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(result);
    return acc;
  }, {} as Record<string, TestResult[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flag className="w-6 h-6" />
          Language Test Results
        </h2>
        <div className="text-sm text-gray-600">
          {results.length} total test results
        </div>
      </div>

      {Object.entries(groupedResults).map(([key, testResults]) => {
        const [language, testType] = key.split('-');
        const latestResult = testResults[0];
        const previousResult = testResults[1];
        
        return (
          <div key={key} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{latestResult.languageFlag}</span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {language} - {testType}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Latest test: {new Date(latestResult.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  {getTrendIcon(latestResult.improvement)}
                  <span className="text-2xl font-bold text-gray-900">
                    {latestResult.overallScore > 0 
                      ? latestResult.overallScore 
                      : latestResult.level
                    }
                  </span>
                  {latestResult.maxScore > 0 && (
                    <span className="text-gray-500">/{latestResult.maxScore}</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">{latestResult.level}</div>
              </div>
            </div>

            {/* Progress to Target */}
            {latestResult.targetScore > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress to target</span>
                  <span className="font-medium">
                    {latestResult.overallScore} / {latestResult.targetScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${getProgressPercentage(
                        latestResult.overallScore, 
                        latestResult.maxScore, 
                        latestResult.targetScore
                      )}%`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Section Scores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {Object.entries(latestResult.sections).map(([section, score]) => {
                const previousScore = previousResult?.sections[section as keyof typeof previousResult.sections];
                const change = previousScore ? score - previousScore : 0;
                
                return (
                  <div key={section} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getScoreIcon(section)}
                        <span className="text-sm font-medium capitalize text-gray-700">
                          {section}
                        </span>
                      </div>
                      {change !== 0 && (
                        <span className={`text-xs ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {change > 0 ? '+' : ''}{change.toFixed(1)}
                        </span>
                      )}
                    </div>
                    <div className="text-lg font-bold text-gray-900">{score}</div>
                  </div>
                );
              })}
            </div>

            {/* Test History */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Test History ({testResults.length} attempts)
              </h4>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {testResults.map((result, index) => (
                  <div key={result.id} className="flex-shrink-0">
                    <div className={`px-3 py-2 rounded-lg text-xs ${
                      index === 0 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <div className="font-medium">
                        {result.overallScore > 0 ? result.overallScore : result.level}
                      </div>
                      <div>{new Date(result.date).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Badge */}
            {latestResult.improvement > 0 && (
              <div className="mt-4 flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-green-500" />
                <span className="text-green-700">
                  {latestResult.improvement.toFixed(1)}% improvement from previous test!
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}