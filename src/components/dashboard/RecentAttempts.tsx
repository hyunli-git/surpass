'use client';

import { useState } from 'react';
import { 
  FileText, 
  Volume2, 
  BookOpen, 
  Headphones, 
  Calendar,
  Clock,
  TrendingUp,
  Eye,
  Filter,
  ChevronDown
} from 'lucide-react';

interface TestAttempt {
  id: number;
  date: string;
  testType: 'IELTS' | 'TEF' | 'OPIc';
  skill: 'Reading' | 'Writing' | 'Listening' | 'Speaking';
  taskTitle: string;
  score: number;
  bandScore: string;
  duration: number; // in minutes
  status: 'completed' | 'in_progress';
}

interface RecentAttemptsProps {
  detailed?: boolean;
  filters?: {
    timeFilter: string;
    testTypeFilter: string;
  };
}

export default function RecentAttempts({ detailed = false, filters }: RecentAttemptsProps) {
  // Mock data - replace with actual API call
  const [attempts] = useState<TestAttempt[]>([
    {
      id: 1,
      date: '2024-01-20T10:30:00Z',
      testType: 'IELTS',
      skill: 'Reading',
      taskTitle: 'Academic Reading Practice Set 3',
      score: 7.5,
      bandScore: 'Band 7.5',
      duration: 60,
      status: 'completed'
    },
    {
      id: 2,
      date: '2024-01-19T14:15:00Z',
      testType: 'IELTS',
      skill: 'Writing',
      taskTitle: 'Task 1: Describing Charts and Graphs',
      score: 6.8,
      bandScore: 'Band 6.5',
      duration: 20,
      status: 'completed'
    },
    {
      id: 3,
      date: '2024-01-18T16:45:00Z',
      testType: 'IELTS',
      skill: 'Listening',
      taskTitle: 'Academic Listening Practice Set 2',
      score: 7.0,
      bandScore: 'Band 7.0',
      duration: 30,
      status: 'completed'
    },
    {
      id: 4,
      date: '2024-01-17T11:20:00Z',
      testType: 'TEF',
      skill: 'Speaking',
      taskTitle: 'Expression Orale - Présentation',
      score: 6.5,
      bandScore: 'Niveau B2',
      duration: 15,
      status: 'completed'
    },
    {
      id: 5,
      date: '2024-01-16T09:00:00Z',
      testType: 'OPIc',
      skill: 'Speaking',
      taskTitle: 'Personal Experience Task',
      score: 6.2,
      bandScore: 'Intermediate Mid',
      duration: 12,
      status: 'completed'
    }
  ]);

  const getSkillIcon = (skill: string) => {
    switch (skill) {
      case 'Reading':
        return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'Writing':
        return <FileText className="w-4 h-4 text-green-500" />;
      case 'Listening':
        return <Headphones className="w-4 h-4 text-purple-500" />;
      case 'Speaking':
        return <Volume2 className="w-4 h-4 text-orange-500" />;
      default:
        return <Eye className="w-4 h-4 text-gray-500" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 7) return 'text-blue-600 bg-blue-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (detailed) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredAttempts = detailed ? attempts : attempts.slice(0, 5);

  return (
    <div className="space-y-4">
      {!detailed && (
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-800">Recent Attempts</h4>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            View All <ChevronDown className="w-3 h-3" />
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filteredAttempts.map((attempt) => (
          <div
            key={attempt.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getSkillIcon(attempt.skill)}
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">
                    {attempt.taskTitle}
                  </h5>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(attempt.date)}
                    </span>
                    <span>{attempt.testType} {attempt.skill}</span>
                    {detailed && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {attempt.duration}min
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(attempt.score)}`}>
                  {attempt.score.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {attempt.bandScore}
                </div>
              </div>
            </div>

            {detailed && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4 text-gray-600">
                    <span>Status: <span className="text-green-600 capitalize">{attempt.status}</span></span>
                    <span>Duration: {attempt.duration} minutes</span>
                  </div>
                  <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                    <Eye className="w-3 h-3" />
                    View Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {detailed && filteredAttempts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No test attempts found for the selected filters.</p>
          <p className="text-sm mt-1">Try adjusting your filter criteria or start practicing!</p>
        </div>
      )}

      {detailed && (
        <div className="flex justify-center pt-4">
          <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50">
            Load More Results
          </button>
        </div>
      )}
    </div>
  );
}