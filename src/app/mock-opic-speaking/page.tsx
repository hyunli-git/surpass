'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Mic, MicOff, Play, Pause, Clock, User, Settings, Volume2, SkipForward } from 'lucide-react';

interface OPIcTask {
  id: number;
  type: 'warm-up' | 'self-introduction' | 'task' | 'role-play' | 'discussion';
  title: string;
  instruction: string;
  preparationTime: number;
  responseTime: number;
  prompt: string;
  context?: string;
  image?: string;
}

interface OPIcSession {
  id: string;
  name: string;
  totalTime: number;
  tasks: OPIcTask[];
  level: string;
}

export default function MockOPIcSpeakingPage() {
  const t = useTranslations();
  const [currentTask, setCurrentTask] = useState(0);
  const [phase, setPhase] = useState<'instruction' | 'preparation' | 'recording'>('instruction');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [sessionStarted, setSessionStarted] = useState(false);

  // Mock OPIc session
  const session: OPIcSession = {
    id: 'opic-sample-1',
    name: 'OPIc Speaking Assessment',
    totalTime: 2400, // 40 minutes
    level: 'Intermediate Mid',
    tasks: [
      {
        id: 1,
        type: 'warm-up',
        title: 'Background Survey Warm-up',
        instruction: 'This is a warm-up question to help you get comfortable with the system.',
        preparationTime: 30,
        responseTime: 60,
        prompt: 'Please tell me about yourself. What do you like to do in your free time?'
      },
      {
        id: 2,
        type: 'self-introduction',
        title: 'Self-Introduction',
        instruction: 'Please introduce yourself. Talk about your background, interests, and what you do.',
        preparationTime: 60,
        responseTime: 120,
        prompt: 'Please introduce yourself. Tell me about your background, what you do for work or study, and your interests.'
      },
      {
        id: 3,
        type: 'task',
        title: 'Describing a Place',
        instruction: 'You will describe a place that is important to you.',
        preparationTime: 60,
        responseTime: 120,
        prompt: 'Describe a place where you like to spend time. Tell me about what this place looks like, why it\'s important to you, and what you usually do there.',
        context: 'Think about a specific place that has meaning for you - it could be your home, a park, a coffee shop, or anywhere else.'
      },
      {
        id: 4,
        type: 'role-play',
        title: 'Making Plans with a Friend',
        instruction: 'You will have a conversation with your friend about making weekend plans.',
        preparationTime: 60,
        responseTime: 120,
        prompt: 'Your friend wants to make plans for this weekend, but you already have some commitments. Try to find a time that works for both of you. Start the conversation.',
        context: 'Scenario: Your friend calls you to make plans for the weekend. You have some things you need to do, but you want to spend time together.'
      },
      {
        id: 5,
        type: 'discussion',
        title: 'Discussing Travel Preferences',
        instruction: 'Discuss your thoughts about different ways to travel and vacation.',
        preparationTime: 90,
        responseTime: 180,
        prompt: 'Some people prefer to travel to new places they\'ve never been before, while others like to return to familiar destinations. What are your thoughts on this? Discuss the advantages and disadvantages of both approaches.',
        context: 'Consider your own travel experiences and preferences. Think about what factors influence people\'s travel choices.'
      }
    ]
  };

  // Timer effect
  useEffect(() => {
    if (!sessionStarted || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handlePhaseTransition();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionStarted, timeRemaining, phase, currentTask]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhaseTransition = () => {
    if (phase === 'instruction') {
      setPhase('preparation');
      setTimeRemaining(session.tasks[currentTask].preparationTime);
    } else if (phase === 'preparation') {
      setPhase('recording');
      setTimeRemaining(session.tasks[currentTask].responseTime);
      setIsRecording(true);
    } else if (phase === 'recording') {
      setIsRecording(false);
      if (currentTask < session.tasks.length - 1) {
        setCurrentTask(currentTask + 1);
        setPhase('instruction');
        setTimeRemaining(0);
        setTestProgress(((currentTask + 1) / session.tasks.length) * 100);
      } else {
        // Test complete
        setTestProgress(100);
      }
    }
  };

  const startTest = () => {
    setSessionStarted(true);
    setPhase('instruction');
    setTimeRemaining(0);
  };

  const continueToNextPhase = () => {
    if (phase === 'instruction') {
      setPhase('preparation');
      setTimeRemaining(session.tasks[currentTask].preparationTime);
    }
  };

  const currentTaskData = session.tasks[currentTask];

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-lg inline-block mb-4">
              <span className="font-bold">OPIc</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Oral Proficiency Interview - computer
            </h1>
            <p className="text-gray-600">Computer-based Speaking Assessment</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-3">Test Information</h3>
              <ul className="space-y-2 text-blue-700">
                <li>• <strong>Duration:</strong> Approximately 40 minutes</li>
                <li>• <strong>Format:</strong> Computer-based speaking tasks</li>
                <li>• <strong>Tasks:</strong> {session.tasks.length} speaking activities</li>
                <li>• <strong>Target Level:</strong> {session.level}</li>
              </ul>
            </div>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
              <h3 className="font-semibold text-amber-800 mb-2">Before You Begin</h3>
              <ul className="text-sm text-amber-700 space-y-1">
                <li>• Ensure your microphone is working properly</li>
                <li>• Find a quiet environment</li>
                <li>• Speak clearly and at a normal pace</li>
                <li>• You will have time to prepare for each task</li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <Settings className="w-5 h-5 text-gray-600" />
                <span className="font-medium">Audio Settings</span>
              </div>
              <div className="flex items-center gap-4">
                <Volume2 className="w-4 h-4 text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm text-gray-600 w-12">{volume}%</span>
              </div>
            </div>
          </div>

          <button
            onClick={startTest}
            className="w-full bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Start OPIc Assessment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* OPIc Header */}
      <div className="bg-blue-700 text-white px-6 py-4 shadow-lg">
        <div className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="bg-white text-blue-700 px-3 py-1 rounded font-bold">
              OPIc
            </div>
            <h1 className="text-xl font-semibold">Oral Proficiency Interview</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-sm">
              Task {currentTask + 1} of {session.tasks.length}
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${testProgress}%` }}
                />
              </div>
              <span className="text-xs">{Math.round(testProgress)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Current Task Display */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Task Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentTaskData.title}</h2>
                <div className="flex items-center gap-4 text-blue-100">
                  <span className="bg-blue-800 px-2 py-1 rounded text-sm">
                    {currentTaskData.type.replace('-', ' ').toUpperCase()}
                  </span>
                  <span>Prep: {currentTaskData.preparationTime}s</span>
                  <span>Response: {formatTime(currentTaskData.responseTime)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatTime(timeRemaining)}</div>
                <div className="text-sm text-blue-200">
                  {phase === 'instruction' && 'Ready to begin'}
                  {phase === 'preparation' && 'Preparation time'}
                  {phase === 'recording' && 'Recording time'}
                </div>
              </div>
            </div>
          </div>

          {/* Task Content */}
          <div className="p-8">
            {phase === 'instruction' && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg border-l-4 border-blue-400">
                  <h3 className="font-semibold text-blue-800 mb-3">Instructions</h3>
                  <p className="text-blue-700">{currentTaskData.instruction}</p>
                </div>

                {currentTaskData.context && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-800 mb-2">Context</h4>
                    <p className="text-gray-700">{currentTaskData.context}</p>
                  </div>
                )}

                <div className="text-center">
                  <button
                    onClick={continueToNextPhase}
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Continue to Preparation
                  </button>
                </div>
              </div>
            )}

            {phase === 'preparation' && (
              <div className="space-y-6">
                <div className="bg-amber-50 p-6 rounded-lg border-l-4 border-amber-400">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <h3 className="font-semibold text-amber-800">Preparation Time</h3>
                  </div>
                  <p className="text-amber-700 mb-4">Use this time to think about your response. You may take notes if needed.</p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Your Task:</h4>
                  <p className="text-gray-700 text-lg leading-relaxed">{currentTaskData.prompt}</p>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600 mb-2">
                    {formatTime(timeRemaining)}
                  </div>
                  <p className="text-gray-600">Recording will begin automatically when preparation time ends</p>
                </div>
              </div>
            )}

            {phase === 'recording' && (
              <div className="space-y-6">
                <div className={`p-6 rounded-lg border-l-4 ${
                  isRecording ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'
                }`}>
                  <div className="flex items-center gap-3 mb-3">
                    {isRecording ? (
                      <Mic className="w-6 h-6 text-red-600 animate-pulse" />
                    ) : (
                      <MicOff className="w-6 h-6 text-gray-500" />
                    )}
                    <h3 className={`font-semibold ${
                      isRecording ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {isRecording ? 'Recording in Progress' : 'Recording Complete'}
                    </h3>
                  </div>
                  <p className={`${
                    isRecording ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {isRecording 
                      ? 'Speak clearly into your microphone. Your response is being recorded.'
                      : 'Thank you! Your response has been recorded.'
                    }
                  </p>
                </div>

                <div className="bg-white border-2 border-gray-200 p-6 rounded-lg">
                  <p className="text-gray-700 text-lg leading-relaxed">{currentTaskData.prompt}</p>
                </div>

                <div className="text-center">
                  <div className={`text-3xl font-bold mb-2 ${
                    timeRemaining <= 30 ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {formatTime(timeRemaining)}
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className={`w-4 h-4 rounded-full ${
                      isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-400'
                    }`} />
                    <p className="text-gray-600">
                      {isRecording ? 'Recording...' : 'Recording stopped'}
                    </p>
                  </div>
                </div>

                {!isRecording && timeRemaining <= 0 && currentTask < session.tasks.length - 1 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handlePhaseTransition}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Continue to Next Task
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Task Progress Indicator */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Assessment Progress</h3>
          <div className="grid grid-cols-5 gap-4">
            {session.tasks.map((task, index) => (
              <div
                key={task.id}
                className={`p-3 rounded-lg text-center text-sm ${
                  index === currentTask
                    ? 'bg-blue-600 text-white'
                    : index < currentTask
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                <div className="font-medium">Task {index + 1}</div>
                <div className="text-xs mt-1 opacity-80">{task.type}</div>
              </div>
            ))}
          </div>
        </div>

        {testProgress >= 100 && (
          <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <h3 className="text-xl font-bold text-green-800 mb-2">Assessment Complete!</h3>
            <p className="text-green-700 mb-4">
              Thank you for completing the OPIc assessment. Your responses have been recorded and will be evaluated.
            </p>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
              View Results Summary
            </button>
          </div>
        )}
      </div>
    </div>
  );
}