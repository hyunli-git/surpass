'use client';

import { useState } from 'react';
import { 
  User, 
  BarChart3, 
  Target, 
  Trophy, 
  Clock,
  Download,
  Plus
} from 'lucide-react';
import LanguageTestResults from '@/components/dashboard/LanguageTestResults';

interface UserProfile {
  id: number;
  name: string;
  email: string;
  targetTestType: string;
  targetScore: string;
  joinDate: string;
  totalStudyTime: number;
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

export default function MyPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'languages' | 'results' | 'progress' | 'goals' | 'settings'>('overview');
  
  // Mock data
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

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
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
              {(['overview', 'languages', 'results', 'progress'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab === 'languages' ? 'Languages' : tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Welcome to your dashboard!</h3>
                  <p className="text-gray-600">Your learning journey starts here. Track your progress across different languages and tests.</p>
                </div>
              </div>
            )}

            {/* Languages Tab */}
            {activeTab === 'languages' && (
              <LanguageTestResults />
            )}

            {/* Results Tab */}
            {activeTab === 'results' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Results</h3>
                  <p className="text-gray-600">Detailed results and analytics coming soon.</p>
                </div>
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="space-y-6">
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Progress Tracking</h3>
                  <p className="text-gray-600">Visual progress charts and analytics coming soon.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}