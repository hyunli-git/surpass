'use client';

import { useState } from 'react';
import { Flame, Calendar, Target, Trophy } from 'lucide-react';

interface StudyStreakProps {
  currentStreak: number;
}

export default function StudyStreak({ currentStreak }: StudyStreakProps) {
  // Mock data for the calendar view (past 7 weeks)
  const [weeklyData] = useState<boolean[][]>([
    [true, true, false, true, true, true, false], // Week 1
    [true, true, true, false, true, true, true],  // Week 2
    [false, true, true, true, true, false, true], // Week 3
    [true, true, true, true, true, true, true],   // Week 4
    [true, false, true, true, true, true, true],  // Week 5
    [true, true, true, true, true, true, false],  // Week 6
    [true, true, true, true, true, false, false], // Week 7 (current)
  ]);

  const [streakStats] = useState({
    longestStreak: 18,
    totalStudyDays: 42,
    weeklyGoal: 5,
    monthlyGoal: 20,
    currentWeekDays: 5,
    currentMonthDays: 16
  });

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const getStreakColor = (streak: number) => {
    if (streak >= 14) return 'text-purple-600 bg-purple-100';
    if (streak >= 7) return 'text-blue-600 bg-blue-100';
    if (streak >= 3) return 'text-green-600 bg-green-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getStreakIcon = (streak: number) => {
    if (streak >= 14) return '🔥';
    if (streak >= 7) return '⚡';
    if (streak >= 3) return '📈';
    return '🌱';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Flame className="w-6 h-6 text-orange-500" />
        <h3 className="text-xl font-semibold text-gray-800">Study Streak</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Streak */}
        <div className="text-center">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${getStreakColor(currentStreak)}`}>
            <span className="text-3xl">{getStreakIcon(currentStreak)}</span>
            <div>
              <div className="text-3xl font-bold">{currentStreak}</div>
              <div className="text-sm font-medium">Day Streak</div>
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Longest Streak:</span>
              <span className="font-medium text-gray-800">{streakStats.longestStreak} days</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Total Study Days:</span>
              <span className="font-medium text-gray-800">{streakStats.totalStudyDays} days</span>
            </div>
          </div>
        </div>

        {/* Weekly Calendar */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Past 7 Weeks
          </h4>
          
          <div className="space-y-1">
            {/* Day labels */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayLabels.map((day, index) => (
                <div key={index} className="text-xs text-gray-500 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>
            
            {/* Calendar grid */}
            {weeklyData.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1">
                {week.map((hasStudied, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`aspect-square rounded text-xs flex items-center justify-center ${
                      hasStudied
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                    title={`${hasStudied ? 'Studied' : 'No study'} on day ${dayIndex + 1} of week ${weekIndex + 1}`}
                  >
                    {hasStudied ? '✓' : ''}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Goals Progress */}
        <div>
          <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
            <Target className="w-4 h-4" />
            Goals Progress
          </h4>
          
          <div className="space-y-4">
            {/* Weekly Goal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Weekly Goal</span>
                <span className="text-sm font-medium">
                  {streakStats.currentWeekDays}/{streakStats.weeklyGoal} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (streakStats.currentWeekDays / streakStats.weeklyGoal) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              {streakStats.currentWeekDays >= streakStats.weeklyGoal && (
                <div className="flex items-center gap-1 mt-1 text-green-600 text-xs">
                  <Trophy className="w-3 h-3" />
                  Goal completed!
                </div>
              )}
            </div>

            {/* Monthly Goal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Monthly Goal</span>
                <span className="text-sm font-medium">
                  {streakStats.currentMonthDays}/{streakStats.monthlyGoal} days
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (streakStats.currentMonthDays / streakStats.monthlyGoal) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {streakStats.monthlyGoal - streakStats.currentMonthDays} days to go
              </div>
            </div>
          </div>

          {/* Motivation Message */}
          <div className="mt-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
            <div className="text-sm font-medium text-gray-800">
              {currentStreak >= 7
                ? `Amazing! You're on fire with a ${currentStreak}-day streak! 🔥`
                : currentStreak >= 3
                ? `Great job! Keep it up to reach a weekly streak! 📈`
                : currentStreak >= 1
                ? `Good start! Try to study again tomorrow! 🌱`
                : `Ready to start your study streak? Begin today! 💪`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}