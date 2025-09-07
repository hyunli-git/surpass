'use client';

import { useState } from 'react';
import { Trophy, Award, Star, Zap, Target, Calendar, Flame, Medal } from 'lucide-react';

interface Achievement {
  id: number;
  name: string;
  description: string;
  type: 'milestone' | 'streak' | 'improvement' | 'special';
  icon: string;
  color: string;
  earnedAt: string;
  difficulty: 'bronze' | 'silver' | 'gold' | 'platinum';
  testType?: string;
  skill?: string;
  value?: number;
}

interface AchievementsBadgesProps {
  achievementCount: number;
}

export default function AchievementsBadges({ achievementCount }: AchievementsBadgesProps) {
  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      name: 'First Steps',
      description: 'Complete your first practice test',
      type: 'milestone',
      icon: '🎯',
      color: 'bronze',
      earnedAt: '2024-01-01',
      difficulty: 'bronze'
    },
    {
      id: 2,
      name: 'Week Warrior',
      description: 'Study for 7 consecutive days',
      type: 'streak',
      icon: '🔥',
      color: 'gold',
      earnedAt: '2024-01-08',
      difficulty: 'gold'
    },
    {
      id: 3,
      name: 'Reading Master',
      description: 'Achieve Band 8+ in Reading',
      type: 'milestone',
      icon: '📚',
      color: 'platinum',
      earnedAt: '2024-01-15',
      difficulty: 'platinum',
      testType: 'IELTS',
      skill: 'Reading',
      value: 8.5
    },
    {
      id: 4,
      name: 'Rapid Improvement',
      description: 'Improve by 1.0 band score in a single skill',
      type: 'improvement',
      icon: '⚡',
      color: 'silver',
      earnedAt: '2024-01-18',
      difficulty: 'silver',
      skill: 'Writing'
    },
    {
      id: 5,
      name: 'Practice Devotee',
      description: 'Complete 50 practice tests',
      type: 'milestone',
      icon: '🏆',
      color: 'gold',
      earnedAt: '2024-01-20',
      difficulty: 'gold'
    },
    {
      id: 6,
      name: 'Perfect Score',
      description: 'Achieve a perfect score in any skill',
      type: 'special',
      icon: '⭐',
      color: 'platinum',
      earnedAt: '2024-01-22',
      difficulty: 'platinum',
      testType: 'IELTS',
      skill: 'Reading',
      value: 9.0
    },
    {
      id: 7,
      name: 'Consistency Champion',
      description: 'Study for 30 consecutive days',
      type: 'streak',
      icon: '📅',
      color: 'platinum',
      earnedAt: '2024-02-01',
      difficulty: 'platinum'
    },
    {
      id: 8,
      name: 'Speed Demon',
      description: 'Complete a reading test in under 45 minutes',
      type: 'special',
      icon: '💨',
      color: 'silver',
      earnedAt: '2024-01-25',
      difficulty: 'silver'
    }
  ]);

  // Available achievements (not yet earned)
  const [availableAchievements] = useState<Achievement[]>([
    {
      id: 101,
      name: 'Speaking Superstar',
      description: 'Achieve Band 8+ in Speaking',
      type: 'milestone',
      icon: '🎤',
      color: 'platinum',
      earnedAt: '',
      difficulty: 'platinum',
      testType: 'IELTS',
      skill: 'Speaking'
    },
    {
      id: 102,
      name: 'Marathon Runner',
      description: 'Study for 100 consecutive days',
      type: 'streak',
      icon: '🏃',
      color: 'platinum',
      earnedAt: '',
      difficulty: 'platinum'
    },
    {
      id: 103,
      name: 'Multi-Skill Master',
      description: 'Achieve Band 7+ in all four skills',
      type: 'milestone',
      icon: '🎖️',
      color: 'platinum',
      earnedAt: '',
      difficulty: 'platinum'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState<'all' | 'milestone' | 'streak' | 'improvement' | 'special'>('all');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return 'from-amber-600 to-amber-800 border-amber-500';
      case 'silver':
        return 'from-gray-400 to-gray-600 border-gray-500';
      case 'gold':
        return 'from-yellow-400 to-yellow-600 border-yellow-500';
      case 'platinum':
        return 'from-purple-500 to-purple-700 border-purple-500';
      default:
        return 'from-gray-400 to-gray-600 border-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'bronze':
        return <Medal className="w-4 h-4 text-amber-700" />;
      case 'silver':
        return <Award className="w-4 h-4 text-gray-600" />;
      case 'gold':
        return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 'platinum':
        return <Star className="w-4 h-4 text-purple-600" />;
      default:
        return <Trophy className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone':
        return <Target className="w-4 h-4" />;
      case 'streak':
        return <Flame className="w-4 h-4" />;
      case 'improvement':
        return <Zap className="w-4 h-4" />;
      case 'special':
        return <Star className="w-4 h-4" />;
      default:
        return <Trophy className="w-4 h-4" />;
    }
  };

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(achievement => achievement.type === selectedCategory);

  const earnedByDifficulty = {
    bronze: achievements.filter(a => a.difficulty === 'bronze').length,
    silver: achievements.filter(a => a.difficulty === 'silver').length,
    gold: achievements.filter(a => a.difficulty === 'gold').length,
    platinum: achievements.filter(a => a.difficulty === 'platinum').length
  };

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6 text-yellow-500" />
          <h3 className="text-lg font-semibold text-gray-800">Achievements</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-yellow-600">{achievements.length}</div>
          <div className="text-sm text-gray-600">Earned</div>
        </div>
      </div>

      {/* Achievement Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {Object.entries(earnedByDifficulty).map(([difficulty, count]) => (
          <div key={difficulty} className="text-center">
            <div className="flex justify-center mb-1">
              {getDifficultyIcon(difficulty)}
            </div>
            <div className="text-lg font-bold text-gray-800">{count}</div>
            <div className="text-xs text-gray-600 capitalize">{difficulty}</div>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(['all', 'milestone', 'streak', 'improvement', 'special'] as const).map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1 text-sm rounded-full flex-shrink-0 transition-colors ${
              selectedCategory === category
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="flex items-center gap-1 capitalize">
              {category !== 'all' && getTypeIcon(category)}
              {category}
            </span>
          </button>
        ))}
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
        {filteredAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`relative p-4 rounded-lg border-2 bg-gradient-to-br ${getDifficultyColor(achievement.difficulty)} text-white cursor-pointer hover:scale-105 transition-transform`}
            title={achievement.description}
          >
            {/* Achievement Icon */}
            <div className="text-2xl mb-2 text-center">
              {achievement.icon}
            </div>
            
            {/* Achievement Name */}
            <div className="text-xs font-medium text-center mb-1 leading-tight">
              {achievement.name}
            </div>
            
            {/* Earned Date */}
            <div className="text-xs text-center opacity-90">
              {new Date(achievement.earnedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            
            {/* Difficulty Badge */}
            <div className="absolute top-1 right-1">
              {getDifficultyIcon(achievement.difficulty)}
            </div>

            {/* Value Badge (for score achievements) */}
            {achievement.value && (
              <div className="absolute top-1 left-1 bg-white bg-opacity-20 rounded px-1 text-xs">
                {achievement.value}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Recently Earned */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-800 mb-3">Recently Earned</h4>
        <div className="space-y-2">
          {achievements
            .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
            .slice(0, 3)
            .map((achievement) => (
              <div key={achievement.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border">
                <div className="text-lg">{achievement.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Next Achievements to Unlock */}
      <div>
        <h4 className="font-medium text-gray-800 mb-3">Next to Unlock</h4>
        <div className="space-y-2">
          {availableAchievements.slice(0, 2).map((achievement) => (
            <div key={achievement.id} className="flex items-center gap-3 bg-gray-100 p-3 rounded-lg border border-gray-200 opacity-75">
              <div className="text-lg grayscale">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-medium text-gray-700">{achievement.name}</div>
                <div className="text-sm text-gray-600">{achievement.description}</div>
              </div>
              <div className="flex items-center gap-1">
                {getDifficultyIcon(achievement.difficulty)}
                <span className="text-xs text-gray-500 capitalize">{achievement.difficulty}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="mt-4 text-center">
        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          View All Achievements
        </button>
      </div>
    </div>
  );
}