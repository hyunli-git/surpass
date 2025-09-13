'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Clock, 
  FileText, 
  Send, 
  RotateCcw, 
  Save,
  AlertCircle,
  CheckCircle,
  Loader2 
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import FeedbackResults from '@/components/feedback/FeedbackResults';
import { TestService } from '@/lib/database/testService';
import type { SkillPracticeSet } from '@/lib/database/types';

interface WritingTask {
  id: string;
  title: string;
  description: string;
  prompt: string;
  instructions: string[];
  timeLimit: number; // in minutes
  minWords: number;
  maxWords: number;
  tips: string[];
  testType: 'ielts' | 'tef' | 'opic';
  taskType: string;
}

export default function WritingPracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  
  const taskId = params.id as string;
  const testType = (searchParams.get('test') || 'ielts') as 'ielts' | 'tef' | 'opic';
  
  const [task, setTask] = useState<WritingTask | null>(null);
  const [response, setResponse] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isLoading, feedback, error, analyzeFeedback, reset } = useFeedback();

  // Prefer DB-backed practice set if available; fall back to mock content
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      const numericId = Number(taskId);
      if (!Number.isFinite(numericId)) return;
      try {
        const set: SkillPracticeSet | null = await TestService.getSkillPracticeSetWithContent(numericId);
        if (!set) throw new Error('No set');
        const c = (set.content && set.content[0]) as any;
        const title = set.title || getTaskTitle(testType);
        const prompt = (c?.instructions || c?.content_text || getTaskPrompt(testType)) as string;
        const tLimit = set.estimated_duration || getTimeLimit(testType);
        const min = set.title?.toLowerCase().includes('task 1') ? 150 : 250;
        const max = min + 200;
        const concrete: WritingTask = {
          id: taskId,
          title,
          description: set.description || '',
          prompt,
          instructions: [prompt],
          timeLimit: tLimit,
          minWords: min,
          maxWords: max,
          tips: getTaskTips(testType),
          testType,
          taskType: getTaskType(testType)
        };
        if (!cancelled) {
          setTask(concrete);
          setTimeRemaining(concrete.timeLimit * 60);
          return;
        }
      } catch {
        // fall through to mock
      }
      if (!cancelled) {
        const mockTask: WritingTask = {
          id: taskId,
          title: getTaskTitle(testType),
          description: getTaskDescription(testType),
          prompt: getTaskPrompt(testType),
          instructions: getTaskInstructions(testType),
          timeLimit: getTimeLimit(testType),
          minWords: getMinWords(testType),
          maxWords: getMaxWords(testType),
          tips: getTaskTips(testType),
          testType,
          taskType: getTaskType(testType)
        };
        setTask(mockTask);
        setTimeRemaining(mockTask.timeLimit * 60);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [taskId, testType]);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isTimerActive, timeRemaining]);

  // Word count
  useEffect(() => {
    const words = response.trim() === '' ? 0 : response.trim().split(/\s+/).length;
    setWordCount(words);
  }, [response]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setIsTimerActive(true);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    setIsTimerActive(false);
  };

  const resetTimer = () => {
    setIsTimerActive(false);
    if (task) {
      setTimeRemaining(task.timeLimit * 60);
    }
    setStartTime(null);
  };

  const handleTimeUp = () => {
    alert('Time is up! Your response will be submitted automatically.');
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!task || !response.trim()) {
      alert('Please write your response before submitting.');
      return;
    }

    const timeSpent = startTime ? Math.floor((new Date().getTime() - startTime.getTime()) / 1000) : 0;

    try {
      await analyzeFeedback({
        type: 'writing',
        response: response.trim(),
        testType: task.testType,
        taskType: task.taskType,
        prompt: task.prompt,
        targetWordCount: task.minWords,
        timeSpent
      });
      
      setShowFeedback(true);
      setIsTimerActive(false);
    } catch (error) {
      console.error('Failed to analyze response:', error);
    }
  };

  const handleRetry = () => {
    setResponse('');
    setShowFeedback(false);
    setWordCount(0);
    reset();
    resetTimer();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const getWordCountColor = () => {
    if (!task) return 'text-gray-600';
    
    if (wordCount < task.minWords * 0.8) {
      return 'text-red-600';
    } else if (wordCount >= task.minWords && wordCount <= task.maxWords) {
      return 'text-green-600';
    } else if (wordCount > task.maxWords) {
      return 'text-orange-600';
    }
    return 'text-yellow-600';
  };

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (showFeedback && feedback) {
    return (
      <FeedbackResults
        type="writing"
        feedback={feedback}
        testType={task.testType}
        originalResponse={response}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                <p className="text-gray-600 uppercase">{task.testType} Writing Practice</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining <= 300 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
              </div>
              
              {/* Timer Controls */}
              <div className="flex gap-2">
                {!isTimerActive ? (
                  <button
                    onClick={startTimer}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                  >
                    Start
                  </button>
                ) : (
                  <button
                    onClick={pauseTimer}
                    className="px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                  >
                    Pause
                  </button>
                )}
                <button
                  onClick={resetTimer}
                  className="p-2 text-gray-600 hover:text-gray-800"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Word Count */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">{task.description}</p>
            <div className={`text-sm font-medium ${getWordCountColor()}`}>
              {wordCount} words
              <span className="text-gray-400 ml-2">
                ({task.minWords}-{task.maxWords} recommended)
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Instructions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Instructions</h3>
              
              {/* Prompt */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 mb-2">Task</h4>
                <p className="text-blue-700 text-sm leading-relaxed">{task.prompt}</p>
              </div>

              {/* Instructions List */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {task.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tips */}
              {task.tips.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    Tips
                  </h4>
                  <ul className="space-y-2">
                    {task.tips.map((tip, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-amber-700">
                        <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Writing Area */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Response</h3>
                <button
                  onClick={() => {
                    const saved = localStorage.setItem(`writing-draft-${taskId}`, response);
                    alert('Draft saved!');
                  }}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <Save className="w-4 h-4" />
                  Save Draft
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Start writing your response here..."
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 leading-relaxed"
              />

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-6">
                <div className="text-sm text-gray-500">
                  {isTimerActive ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      Timer active
                    </span>
                  ) : startTime ? (
                    <span className="flex items-center gap-1 text-yellow-600">
                      <AlertCircle className="w-4 h-4" />
                      Timer paused
                    </span>
                  ) : (
                    "Start the timer when you begin writing"
                  )}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setResponse('')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!response.trim() || isLoading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Get AI Feedback
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions for different test types
function getTaskTitle(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'IELTS Writing Task 1 - Describing Trends';
    case 'tef':
      return 'TEF Expression Écrite - Rédaction';
    case 'opic':
      return 'OPIc Writing Sample';
    default:
      return 'Writing Practice';
  }
}

function getTaskDescription(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'Analyze the chart and describe the main trends, comparing data where relevant.';
    case 'tef':
      return 'Rédigez un texte argumentatif sur le sujet proposé en respectant la structure demandée.';
    case 'opic':
      return 'Write a detailed response about your personal experience with the given topic.';
    default:
      return 'Complete the writing task according to the instructions provided.';
  }
}

function getTaskPrompt(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'The chart below shows the percentage of households in different income brackets that owned smartphones between 2015 and 2023. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.';
    case 'tef':
      return 'De nos jours, de plus en plus de personnes travaillent à distance depuis leur domicile. Certains considèrent que c\'est un avantage, d\'autres y voient des inconvénients. Quel est votre point de vue sur cette question? Rédigez un texte argumentatif d\'environ 250 mots.';
    case 'opic':
      return 'Describe your favorite way to spend a weekend. Include details about what you like to do, who you spend time with, and why these activities are meaningful to you. Provide specific examples from your own experience.';
    default:
      return 'Write your response based on the topic provided.';
  }
}

function getTaskInstructions(testType: string): string[] {
  switch (testType) {
    case 'ielts':
      return [
        'Write at least 150 words',
        'Spend about 20 minutes on this task',
        'Include an introduction and overview',
        'Describe the main trends and patterns',
        'Make relevant comparisons',
        'Use appropriate academic vocabulary'
      ];
    case 'tef':
      return [
        'Rédigez environ 250 mots',
        'Respectez la structure: introduction, développement, conclusion',
        'Présentez votre point de vue avec des arguments',
        'Utilisez des exemples concrets',
        'Employez un registre de langue approprié',
        'Soignez la cohérence et la cohésion'
      ];
    case 'opic':
      return [
        'Write 200-300 words',
        'Use specific personal examples',
        'Organize your response clearly',
        'Show your personality and preferences',
        'Use descriptive language',
        'Connect your ideas logically'
      ];
    default:
      return ['Follow the instructions provided', 'Write clearly and coherently'];
  }
}

function getTimeLimit(testType: string): number {
  switch (testType) {
    case 'ielts':
      return 20; // minutes
    case 'tef':
      return 30;
    case 'opic':
      return 25;
    default:
      return 30;
  }
}

function getMinWords(testType: string): number {
  switch (testType) {
    case 'ielts':
      return 150;
    case 'tef':
      return 200;
    case 'opic':
      return 200;
    default:
      return 150;
  }
}

function getMaxWords(testType: string): number {
  switch (testType) {
    case 'ielts':
      return 200;
    case 'tef':
      return 300;
    case 'opic':
      return 300;
    default:
      return 250;
  }
}

function getTaskTips(testType: string): string[] {
  switch (testType) {
    case 'ielts':
      return [
        'Don\'t just list numbers - identify trends and patterns',
        'Use a variety of language to describe increases/decreases',
        'Group information logically rather than describing each year',
        'Check your grammar and spelling before submitting'
      ];
    case 'tef':
      return [
        'Commencez par présenter le sujet dans l\'introduction',
        'Développez deux ou trois arguments principaux',
        'Utilisez des connecteurs logiques pour structurer votre texte',
        'Terminez par une conclusion qui reprend votre position'
      ];
    case 'opic':
      return [
        'Be specific about your experiences rather than speaking generally',
        'Use sensory details to make your writing more engaging',
        'Show rather than tell - use examples to illustrate your points',
        'Let your personality shine through your writing'
      ];
    default:
      return ['Plan your response before writing', 'Review your work before submitting'];
  }
}

function getTaskType(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'task1-chart';
    case 'tef':
      return 'argumentative-essay';
    case 'opic':
      return 'personal-experience';
    default:
      return 'general-writing';
  }
}
