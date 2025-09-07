'use client';

import { useState } from 'react';
import { BarChart3, TrendingUp, Calendar } from 'lucide-react';

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

interface ProgressChartProps {
  skillProgress: SkillProgressData[];
}

interface ChartDataPoint {
  date: string;
  reading: number;
  writing: number;
  listening: number;
  speaking: number;
}

export default function ProgressChart({ skillProgress }: ProgressChartProps) {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');
  const [chartType, setChartType] = useState<'scores' | 'attempts'>('scores');

  // Mock chart data - replace with actual data
  const [chartData] = useState<ChartDataPoint[]>([
    { date: '2024-01-01', reading: 6.0, writing: 5.5, listening: 6.2, speaking: 5.8 },
    { date: '2024-01-08', reading: 6.3, writing: 5.8, listening: 6.5, speaking: 6.0 },
    { date: '2024-01-15', reading: 6.8, writing: 6.2, listening: 6.8, speaking: 6.2 },
    { date: '2024-01-22', reading: 7.2, writing: 6.5, listening: 6.9, speaking: 6.4 }
  ]);

  const skillColors = {
    reading: 'rgb(59, 130, 246)', // blue
    writing: 'rgb(16, 185, 129)', // green
    listening: 'rgb(139, 69, 193)', // purple
    speaking: 'rgb(245, 101, 101)' // orange
  };

  const maxScore = 9; // Maximum possible score
  const chartHeight = 300;
  const chartWidth = 600;
  const padding = 40;

  const getYPosition = (score: number) => {
    return chartHeight - padding - ((score / maxScore) * (chartHeight - 2 * padding));
  };

  const getXPosition = (index: number, total: number) => {
    return padding + (index * (chartWidth - 2 * padding)) / (total - 1);
  };

  const createPath = (skill: keyof typeof skillColors) => {
    const points = chartData.map((point, index) => {
      const x = getXPosition(index, chartData.length);
      const y = getYPosition(point[skill]);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
    
    return points;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">Progress Over Time</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="scores">Scores</option>
            <option value="attempts">Attempts</option>
          </select>
          
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
            <option value="quarter">Past Quarter</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          width={chartWidth}
          height={chartHeight}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-auto"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="60"
              height="30"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 60 0 L 0 0 0 30"
                fill="none"
                stroke="#f3f4f6"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Y-axis labels */}
          {[0, 3, 6, 9].map((score) => (
            <g key={score}>
              <line
                x1={padding}
                y1={getYPosition(score)}
                x2={chartWidth - padding}
                y2={getYPosition(score)}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={getYPosition(score) + 5}
                textAnchor="end"
                fontSize="12"
                fill="#6b7280"
              >
                {score}
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {chartData.map((point, index) => (
            <text
              key={index}
              x={getXPosition(index, chartData.length)}
              y={chartHeight - 10}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </text>
          ))}

          {/* Lines for each skill */}
          {Object.entries(skillColors).map(([skill, color]) => (
            <g key={skill}>
              <path
                d={createPath(skill as keyof typeof skillColors)}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Data points */}
              {chartData.map((point, index) => (
                <circle
                  key={index}
                  cx={getXPosition(index, chartData.length)}
                  cy={getYPosition(point[skill as keyof typeof skillColors])}
                  r="4"
                  fill={color}
                  className="hover:r-6 cursor-pointer transition-all"
                >
                  <title>
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}: {point[skill as keyof typeof skillColors]} on {new Date(point.date).toLocaleDateString()}
                  </title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
        {Object.entries(skillColors).map(([skill, color]) => {
          const skillData = skillProgress.find(s => s.skill.toLowerCase() === skill);
          return (
            <div key={skill} className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: color }}
              />
              <div className="text-sm">
                <div className="font-medium capitalize text-gray-800">{skill}</div>
                {skillData && (
                  <div className="text-gray-500 flex items-center gap-1">
                    <span>{skillData.latestScore.toFixed(1)}</span>
                    <TrendingUp 
                      className={`w-3 h-3 ${
                        skillData.trend === 'up' ? 'text-green-500' : 
                        skillData.trend === 'down' ? 'text-red-500 rotate-180' : 
                        'text-gray-400'
                      }`} 
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
        {skillProgress.map((skill) => (
          <div key={`${skill.skill}-${skill.testType}`} className="text-center">
            <div className="text-2xl font-bold text-gray-800">{skill.latestScore.toFixed(1)}</div>
            <div className="text-sm text-gray-600">{skill.skill}</div>
            <div className="text-xs text-gray-500 mt-1">
              Best: {skill.bestScore.toFixed(1)} | Avg: {skill.averageScore.toFixed(1)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}