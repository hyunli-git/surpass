'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { 
  User, 
  BarChart3, 
  Calendar, 
  Target, 
  Trophy, 
  BookOpen,
  TrendingUp,
  Clock,
  FileText,
  Volume2,
  Eye,
  Headphones,
  Filter,
  Download,
  Settings,
  Plus
} from 'lucide-react';
import ProgressChart from '@/components/dashboard/ProgressChart';
import RecentAttempts from '@/components/dashboard/RecentAttempts';
import StudyStreak from '@/components/dashboard/StudyStreak';
import SkillProgress from '@/components/dashboard/SkillProgress';
import GoalsWidget from '@/components/dashboard/GoalsWidget';
import AchievementsBadges from '@/components/dashboard/AchievementsBadges';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  targetTestType: string;
  targetScore: string;
  joinDate: string;
  totalStudyTime: number; // in minutes
  totalAttempts: number;
}

interface DashboardStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  totalStudyTime: number;
  currentStreak: number;
  completedGoals: number;
  achievements: number;
}

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

export default function MyPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'overview' | 'results' | 'progress' | 'goals' | 'settings'>('overview');
  const [timeFilter, setTimeFilter] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [testTypeFilter, setTestTypeFilter] = useState<'all' | 'ielts' | 'tef' | 'opic'>('all');
  
  // Mock data (replace with actual API calls)
  const [userProfile] = useState<UserProfile>({
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    targetTestType: 'IELTS',
    targetScore: 'Band 7.5',
    joinDate: '2024-01-15',
    totalStudyTime: 4320, // 72 hours
    totalAttempts: 48
  });

  const [dashboardStats] = useState<DashboardStats>({
    totalAttempts: 48,
    averageScore: 6.8,
    bestScore: 8.0,
    totalStudyTime: 4320,
    currentStreak: 12,
    completedGoals: 5,
    achievements: 8
  });

  const [skillProgress] = useState<SkillProgressData[]>([
    {
      skill: 'Reading',
      testType: 'IELTS',
      attempts: 15,
      averageScore: 7.2,
      bestScore: 8.5,
      latestScore: 7.5,
      trend: 'up',
      lastAttempt: '2024-01-20'
    },
    {
      skill: 'Writing',
      testType: 'IELTS',
      attempts: 12,
      averageScore: 6.5,
      bestScore: 7.0,
      latestScore: 6.8,
      trend: 'up',
      lastAttempt: '2024-01-19'
    },
    {
      skill: 'Listening',
      testType: 'IELTS',
      attempts: 10,
      averageScore: 6.9,
      bestScore: 7.5,
      latestScore: 7.0,
      trend: 'stable',
      lastAttempt: '2024-01-18'
    },
    {
      skill: 'Speaking',
      testType: 'IELTS',
      attempts: 11,
      averageScore: 6.4,
      bestScore: 7.0,
      latestScore: 6.5,
      trend: 'up',
      lastAttempt: '2024-01-17'
    }
  ]);

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getSkillIcon = (skill: string) => {
    switch (skill.toLowerCase()) {
      case 'reading':
        return <BookOpen className="w-5 h-5" />;
      case 'writing':
        return <FileText className="w-5 h-5" />;
      case 'listening':
        return <Headphones className="w-5 h-5" />;
      case 'speaking':
        return <Volume2 className="w-5 h-5" />;
      default:
        return <Eye className="w-5 h-5" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-600 mt-2">Track your progress and improve your test performance</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Set New Goal
              </button>
            </div>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>Target: {userProfile.targetTestType} {userProfile.targetScore}</span>
                  <span>•</span>
                  <span>Joined: {new Date(userProfile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{dashboardStats.currentStreak}</div>
              <div className="text-sm text-gray-600">day study streak</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.totalAttempts}</div>
                <div className="text-sm text-gray-600">Total Attempts</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.averageScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{dashboardStats.bestScore.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Best Score</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{formatStudyTime(dashboardStats.totalStudyTime)}</div>
                <div className="text-sm text-gray-600">Study Time</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {(['overview', 'results', 'progress', 'goals', 'settings'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Skills Progress */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Skills Progress</h3>
                    <div className="space-y-4">
                      {skillProgress.map((skill) => (
                        <div key={`${skill.skill}-${skill.testType}`} className="bg-white p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              {getSkillIcon(skill.skill)}
                              <div>
                                <div className="font-medium">{skill.skill}</div>
                                <div className="text-sm text-gray-500">{skill.attempts} attempts</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {getTrendIcon(skill.trend)}
                              <span className="text-lg font-bold">{skill.latestScore.toFixed(1)}</span>
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Avg: {skill.averageScore.toFixed(1)}</span>
                            <span>Best: {skill.bestScore.toFixed(1)}</span>
                            <span>Last: {new Date(skill.lastAttempt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                    <RecentAttempts />
                  </div>
                </div>

                {/* Study Streak */}
                <StudyStreak currentStreak={dashboardStats.currentStreak} />

                {/* Goals and Achievements */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GoalsWidget completedGoals={dashboardStats.completedGoals} />
                  <AchievementsBadges achievementCount={dashboardStats.achievements} />
                </div>
              </div>
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Filters:</span>
                  </div>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="week">Past Week</option>
                    <option value="month">Past Month</option>
                    <option value="quarter">Past Quarter</option>
                    <option value="year">Past Year</option>
                  </select>
                  <select
                    value={testTypeFilter}
                    onChange={(e) => setTestTypeFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="all">All Tests</option>
                    <option value="ielts">IELTS</option>
                    <option value="tef">TEF</option>
                    <option value="opic">OPIc</option>
                  </select>
                </div>

                <RecentAttempts detailed={true} filters={{ timeFilter, testTypeFilter }} />
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <ProgressChart skillProgress={skillProgress} />
                <SkillProgress skills={skillProgress} />
              </div>
            )}

            {/* Goals Tab */}
            {activeTab === 'goals' && (
              <div className="space-y-6">
                <GoalsWidget completedGoals={dashboardStats.completedGoals} detailed={true} />
                <div className="text-center py-8">
                  <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mx-auto">
                    <Plus className="w-4 h-4" />
                    Create New Goal
                  </button>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="max-w-2xl">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Profile Settings
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <input
                        type="text"
                        value={userProfile.name}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Test</label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option value="ielts">IELTS</option>
                        <option value="tef">TEF Canada</option>
                        <option value="opic">OPIc</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Target Score</label>
                      <input
                        type="text"
                        value={userProfile.targetScore}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    
                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}