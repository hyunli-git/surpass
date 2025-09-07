'use client';

import { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Headphones, 
  Volume2,
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  Clock,
  Award
} from 'lucide-react';

interface SkillProgressData {
  skill: string;
  testType: string;
  attempts: number;
  averageScore: number;
  bestScore: number;
  latestScore: number;
  trend: 'up' | 'down' | 'stable';
  lastAttempt: string;
}

interface SkillProgressProps {
  skills: SkillProgressData[];
}

export default function SkillProgress({ skills }: SkillProgressProps) {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'reading':
        return <BookOpen className="w-6 h-6 text-blue-500" />;
      case 'writing':
        return <FileText className="w-6 h-6 text-green-500" />;
      case 'listening':
        return <Headphones className="w-6 h-6 text-purple-500" />;
      case 'speaking':
        return <Volume2 className="w-6 h-6 text-orange-500" />;
      default:
        return <Target className="w-6 h-6 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-500" />;
      default:
        return <Minus className="w-5 h-5 text-gray-400" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressPercentage = (current: number, target: number = 9) => {
    return Math.min((current / target) * 100, 100);
  };

  const getSkillColor = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'reading':
        return 'blue';
      case 'writing':
        return 'green';
      case 'listening':
        return 'purple';
      case 'speaking':
        return 'orange';
      default:
        return 'gray';
    }
  };

  // Mock detailed data for selected skill
  const getSkillDetails = (skillName: string) => ({
    recentScores: [6.0, 6.2, 6.5, 6.8, 7.0, 7.2, 7.5],
    strengths: [
      'Strong vocabulary usage',
      'Good understanding of main ideas',
      'Effective time management'
    ],
    improvements: [
      'Work on complex sentence structures',
      'Practice identifying implied meaning',
      'Focus on detail comprehension'
    ],
    nextRecommendations: [
      'Try advanced level practice sets',
      'Focus on academic vocabulary',
      'Practice with time pressure'
    ]
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Detailed Skill Analysis</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {skills.map((skill) => {
          const color = getSkillColor(skill.skill);
          const isSelected = selectedSkill === skill.skill;
          
          return (
            <div
              key={`${skill.skill}-${skill.testType}`}
              onClick={() => setSelectedSkill(isSelected ? null : skill.skill)}
              className={`cursor-pointer transition-all duration-200 rounded-xl p-6 border-2 ${
                isSelected
                  ? `border-${color}-500 bg-${color}-50 shadow-lg`
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getSkillIcon(skill.skill)}
                  <div>
                    <h4 className="font-semibold text-gray-800">{skill.skill}</h4>
                    <p className="text-sm text-gray-500">{skill.testType}</p>
                  </div>
                </div>
                {getTrendIcon(skill.trend)}
              </div>

              {/* Current Score */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Current Score</span>
                  <span className={`text-2xl font-bold ${getScoreColor(skill.latestScore)}`}>
                    {skill.latestScore.toFixed(1)}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`bg-${color}-500 h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${getProgressPercentage(skill.latestScore)}%` }}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Score:</span>
                  <span className="font-medium">{skill.bestScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average:</span>
                  <span className="font-medium">{skill.averageScore.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Attempts:</span>
                  <span className="font-medium">{skill.attempts}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Practice:</span>
                  <span className="font-medium">{new Date(skill.lastAttempt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              {/* Improvement Indicator */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center gap-2 text-xs">
                  {skill.trend === 'up' && (
                    <div className="flex items-center gap-1 text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>Improving</span>
                    </div>
                  )}
                  {skill.trend === 'down' && (
                    <div className="flex items-center gap-1 text-red-600">
                      <TrendingDown className="w-3 h-3" />
                      <span>Needs attention</span>
                    </div>
                  )}
                  {skill.trend === 'stable' && (
                    <div className="flex items-center gap-1 text-gray-600">
                      <Minus className="w-3 h-3" />
                      <span>Stable</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Analysis for Selected Skill */}
      {selectedSkill && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            {getSkillIcon(selectedSkill)}
            <h4 className="text-lg font-semibold text-gray-800">
              {selectedSkill} - Detailed Analysis
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Progress */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Recent Progress
              </h5>
              
              <div className="space-y-2">
                {getSkillDetails(selectedSkill).recentScores.slice(-5).map((score, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Attempt {index + 1}:</span>
                    <span className={`font-medium ${getScoreColor(score)}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Strengths
              </h5>
              
              <ul className="space-y-2">
                {getSkillDetails(selectedSkill).strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-green-700">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div>
              <h5 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Focus Areas
              </h5>
              
              <ul className="space-y-2">
                {getSkillDetails(selectedSkill).improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-orange-700">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-800 mb-3">Recommended Next Steps</h5>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {getSkillDetails(selectedSkill).nextRecommendations.map((recommendation, index) => (
                <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 text-center">
            <button 
              className={`px-6 py-3 bg-${getSkillColor(selectedSkill)}-600 text-white rounded-lg hover:bg-${getSkillColor(selectedSkill)}-700 transition-colors`}
            >
              Practice {selectedSkill} Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}