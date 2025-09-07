'use client';

import { useState } from 'react';
import { Target, Plus, CheckCircle, Clock, TrendingUp, Calendar, Edit, Trash2 } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  description: string;
  type: 'score_target' | 'practice_frequency' | 'skill_improvement';
  testType?: 'ielts' | 'tef' | 'opic';
  skill?: 'reading' | 'writing' | 'listening' | 'speaking';
  targetValue: number;
  currentValue: number;
  targetDate: string;
  status: 'active' | 'completed' | 'paused';
  createdAt: string;
}

interface GoalsWidgetProps {
  completedGoals: number;
  detailed?: boolean;
}

export default function GoalsWidget({ completedGoals, detailed = false }: GoalsWidgetProps) {
  const [goals] = useState<Goal[]>([
    {
      id: 1,
      title: 'Achieve Band 7.5 in IELTS Reading',
      description: 'Improve reading comprehension and speed to reach Band 7.5',
      type: 'score_target',
      testType: 'ielts',
      skill: 'reading',
      targetValue: 7.5,
      currentValue: 7.2,
      targetDate: '2024-03-15',
      status: 'active',
      createdAt: '2024-01-01'
    },
    {
      id: 2,
      title: 'Practice Writing 3 Times Per Week',
      description: 'Maintain consistent writing practice schedule',
      type: 'practice_frequency',
      testType: 'ielts',
      skill: 'writing',
      targetValue: 3,
      currentValue: 2,
      targetDate: '2024-02-29',
      status: 'active',
      createdAt: '2024-01-08'
    },
    {
      id: 3,
      title: 'Improve Speaking Fluency',
      description: 'Reduce hesitations and improve natural flow',
      type: 'skill_improvement',
      testType: 'ielts',
      skill: 'speaking',
      targetValue: 7.0,
      currentValue: 6.5,
      targetDate: '2024-04-01',
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: 4,
      title: 'Complete 50 Listening Exercises',
      description: 'Build listening stamina and accuracy',
      type: 'practice_frequency',
      testType: 'ielts',
      skill: 'listening',
      targetValue: 50,
      currentValue: 50,
      targetDate: '2024-01-31',
      status: 'completed',
      createdAt: '2023-12-01'
    },
    {
      id: 5,
      title: 'Reach Band 6.5 in TEF Writing',
      description: 'Improve French writing skills for TEF exam',
      type: 'score_target',
      testType: 'tef',
      skill: 'writing',
      targetValue: 6.5,
      currentValue: 6.8,
      targetDate: '2024-02-15',
      status: 'completed',
      createdAt: '2023-11-01'
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);

  const activeGoals = goals.filter(goal => goal.status === 'active');
  const completedGoalsList = goals.filter(goal => goal.status === 'completed');

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'score_target':
        return <Target className="w-4 h-4 text-blue-500" />;
      case 'practice_frequency':
        return <Calendar className="w-4 h-4 text-green-500" />;
      case 'skill_improvement':
        return <TrendingUp className="w-4 h-4 text-purple-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'paused':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!detailed) {
    return (
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-600" />
            Learning Goals
          </h3>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
        </div>

        <div className="space-y-3">
          {activeGoals.slice(0, 3).map((goal) => (
            <div key={goal.id} className="bg-white p-3 rounded-lg border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-800 truncate">
                  {goal.title}
                </span>
                {getGoalTypeIcon(goal.type)}
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{goal.currentValue}/{goal.targetValue}</span>
                <span>{getDaysRemaining(goal.targetDate)} days left</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Learning Goals</h3>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{activeGoals.length}</div>
          <div className="text-sm text-blue-700">Active Goals</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{completedGoalsList.length}</div>
          <div className="text-sm text-green-700">Completed Goals</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">
            {completedGoalsList.length > 0 ? Math.round((completedGoalsList.length / goals.length) * 100) : 0}%
          </div>
          <div className="text-sm text-purple-700">Success Rate</div>
        </div>
      </div>

      {/* Active Goals */}
      <div>
        <h4 className="font-medium text-gray-800 mb-4">Active Goals</h4>
        <div className="space-y-4">
          {activeGoals.map((goal) => (
            <div key={goal.id} className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getGoalTypeIcon(goal.type)}
                  <div>
                    <h5 className="font-medium text-gray-800">{goal.title}</h5>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                    {goal.status}
                  </span>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Progress</span>
                  <span className="text-sm font-medium">
                    {goal.currentValue}/{goal.targetValue}
                    {goal.type === 'score_target' ? '' : goal.type === 'practice_frequency' ? ' sessions' : ' points'}
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      getProgressPercentage(goal.currentValue, goal.targetValue) >= 100
                        ? 'bg-green-500'
                        : getProgressPercentage(goal.currentValue, goal.targetValue) >= 75
                        ? 'bg-blue-500'
                        : 'bg-yellow-500'
                    }`}
                    style={{ width: `${getProgressPercentage(goal.currentValue, goal.targetValue)}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  {goal.testType && (
                    <span className="capitalize">{goal.testType} {goal.skill}</span>
                  )}
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Target: {new Date(goal.targetDate).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span className={getDaysRemaining(goal.targetDate) <= 7 ? 'text-red-600 font-medium' : ''}>
                    {getDaysRemaining(goal.targetDate)} days left
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Completed Goals */}
      {completedGoalsList.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Completed Goals
          </h4>
          <div className="space-y-3">
            {completedGoalsList.map((goal) => (
              <div key={goal.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <div>
                      <h5 className="font-medium text-green-800">{goal.title}</h5>
                      <p className="text-sm text-green-600">
                        Completed on {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-green-700 font-medium">
                    {goal.currentValue}/{goal.targetValue} ✓
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create New Goal Form */}
      {showCreateForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h4 className="font-medium text-gray-800 mb-4">Create New Goal</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Achieve Band 8.0 in IELTS Reading"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Type</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="score_target">Score Target</option>
                <option value="practice_frequency">Practice Frequency</option>
                <option value="skill_improvement">Skill Improvement</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="ielts">IELTS</option>
                  <option value="tef">TEF</option>
                  <option value="opic">OPIc</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skill</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="listening">Listening</option>
                  <option value="speaking">Speaking</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your goal and motivation..."
              />
            </div>
            
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Goal
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}