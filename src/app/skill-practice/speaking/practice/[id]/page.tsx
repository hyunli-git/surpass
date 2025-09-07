'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  Square, 
  Clock, 
  Volume2,
  RotateCcw,
  Send,
  AlertTriangle,
  CheckCircle,
  Loader2,
  FileAudio
} from 'lucide-react';
import { useFeedback } from '@/hooks/useFeedback';
import FeedbackResults from '@/components/feedback/FeedbackResults';

interface SpeakingTask {
  id: string;
  title: string;
  description: string;
  prompt: string;
  instructions: string[];
  preparationTime: number; // in seconds
  responseTime: number; // in seconds
  tips: string[];
  testType: 'ielts' | 'tef' | 'opic';
  taskType: string;
}

type Phase = 'instructions' | 'preparation' | 'speaking' | 'completed';

export default function SpeakingPracticePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const t = useTranslations();
  
  const taskId = params.id as string;
  const testType = (searchParams.get('test') || 'ielts') as 'ielts' | 'tef' | 'opic';
  
  const [task, setTask] = useState<SpeakingTask | null>(null);
  const [phase, setPhase] = useState<Phase>('instructions');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedUrl, setRecordedUrl] = useState<string>('');
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null);
  const [transcript, setTranscript] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isLoading, feedback, error, analyzeFeedback, reset } = useFeedback();

  // Mock task data
  useEffect(() => {
    const mockTask: SpeakingTask = {
      id: taskId,
      title: getTaskTitle(testType),
      description: getTaskDescription(testType),
      prompt: getTaskPrompt(testType),
      instructions: getTaskInstructions(testType),
      preparationTime: getPreparationTime(testType),
      responseTime: getResponseTime(testType),
      tips: getTaskTips(testType),
      testType,
      taskType: getTaskType(testType)
    };
    
    setTask(mockTask);
  }, [taskId, testType]);

  // Request microphone permission
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setAudioPermission(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the stream
      } catch (error) {
        console.error('Microphone permission denied:', error);
        setAudioPermission(false);
      }
    };

    requestPermission();
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (timeRemaining > 0 && (phase === 'preparation' || phase === 'speaking')) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handlePhaseTransition();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [timeRemaining, phase]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePhaseTransition = () => {
    if (phase === 'preparation') {
      setPhase('speaking');
      setTimeRemaining(task?.responseTime || 120);
      startRecording();
    } else if (phase === 'speaking') {
      setPhase('completed');
      stopRecording();
    }
  };

  const startPreparation = () => {
    if (task) {
      setPhase('preparation');
      setTimeRemaining(task.preparationTime);
    }
  };

  const startRecording = async () => {
    if (!audioPermission) {
      alert('Microphone permission is required to record your response.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setRecordedBlob(blob);
        setRecordedUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Failed to start recording. Please check your microphone.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const restartTask = () => {
    setPhase('instructions');
    setTimeRemaining(0);
    setIsRecording(false);
    setRecordedBlob(null);
    setRecordedUrl('');
    setTranscript('');
    setShowFeedback(false);
    reset();
    
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
  };

  const handleSubmit = async () => {
    if (!task || !recordedBlob) {
      alert('Please record your response before submitting.');
      return;
    }

    // Simulate transcript generation (in real app, use speech-to-text API)
    const simulatedTranscript = generateSimulatedTranscript(testType);
    setTranscript(simulatedTranscript);

    try {
      await analyzeFeedback({
        type: 'speaking',
        audioUrl: recordedUrl, // In real app, upload to storage first
        transcript: simulatedTranscript,
        testType: task.testType,
        taskType: task.taskType,
        prompt: task.prompt,
        duration: task.responseTime,
        targetDuration: task.responseTime
      });
      
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to analyze response:', error);
    }
  };

  const generateSimulatedTranscript = (testType: string): string => {
    const transcripts: Record<string, string> = {
      ielts: "Well, I'd like to talk about my favorite hobby, which is photography. I've been interested in photography for about five years now, ever since I got my first camera as a birthday gift. What I really enjoy about photography is that it allows me to capture special moments and beautiful scenes. I usually go out on weekends to take photos in different locations around my city, like parks, old buildings, and sometimes I travel to nearby towns to find interesting subjects. The reason I find photography so appealing is that it combines creativity with technical skills, and every photo tells a different story.",
      tef: "Alors, pour répondre à votre question sur mes activités de week-end, je dois dire que j'aime vraiment passer du temps avec ma famille et mes amis. Le samedi matin, j'ai l'habitude de faire du sport, généralement du jogging dans le parc près de chez moi. L'après-midi, je retrouve souvent mes amis pour aller au cinéma ou simplement prendre un café en ville. Le dimanche, c'est plutôt consacré à la famille - nous préparons un grand repas ensemble et parfois nous faisons des excursions à la campagne quand il fait beau.",
      opic: "That's a great question about my favorite place to relax. I'd have to say it's this small coffee shop downtown called The Blue Cup. I discovered it about two years ago when I was looking for a quiet place to study. What makes it special is the atmosphere - they have these comfortable leather chairs, soft jazz music playing in the background, and the smell of freshly roasted coffee beans. I usually go there on Sunday afternoons with a book or my laptop. The staff is really friendly, and they make the best cappuccino I've ever tasted. It's become my go-to place when I need to unwind after a stressful week."
    };
    
    return transcripts[testType] || transcripts.ielts;
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
        type="speaking"
        feedback={feedback}
        testType={task.testType}
        onRetry={restartTask}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Volume2 className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{task.title}</h1>
                <p className="text-gray-600 uppercase">{task.testType} Speaking Practice</p>
              </div>
            </div>
            
            {phase !== 'instructions' && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining <= 30 ? 'bg-red-100 text-red-700' : 
                phase === 'preparation' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
              }`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600">{task.description}</p>
            <div className="text-sm text-gray-500">
              Phase: <span className="capitalize font-medium">{phase}</span>
            </div>
          </div>
        </div>

        {/* Instructions Phase */}
        {phase === 'instructions' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Task Instructions</h3>
              
              <div className="bg-blue-50 p-4 rounded-lg mb-6 border-l-4 border-blue-400">
                <h4 className="font-medium text-blue-800 mb-2">Speaking Prompt</h4>
                <p className="text-blue-700 text-sm leading-relaxed">{task.prompt}</p>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-800 mb-3">Requirements</h4>
                <ul className="space-y-2">
                  {task.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center">
                <button
                  onClick={startPreparation}
                  disabled={!audioPermission}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {audioPermission ? 'Start Preparation' : 'Microphone Access Required'}
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Tips for Success
              </h3>
              
              <div className="space-y-4">
                {task.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
              </div>

              {audioPermission === false && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm">
                    Microphone access is required for this exercise. Please refresh the page and allow microphone access when prompted.
                  </p>
                </div>
              )}

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Preparation time:</span>
                  <span className="font-medium">{formatTime(task.preparationTime)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600 mt-2">
                  <span>Speaking time:</span>
                  <span className="font-medium">{formatTime(task.responseTime)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preparation Phase */}
        {phase === 'preparation' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Preparation Time</h3>
              <p className="text-gray-600">Use this time to think about your response</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-6 border-l-4 border-blue-400">
              <p className="text-blue-700 leading-relaxed">{task.prompt}</p>
            </div>

            <div className="text-4xl font-bold text-blue-600 mb-4">
              {formatTime(timeRemaining)}
            </div>

            <p className="text-gray-600">Recording will start automatically when preparation time ends</p>
          </div>
        )}

        {/* Speaking Phase */}
        {(phase === 'speaking' || phase === 'completed') && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              <div className={`w-16 h-16 ${isRecording ? 'bg-red-100' : 'bg-gray-100'} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {isRecording ? (
                  <Mic className="w-8 h-8 text-red-600 animate-pulse" />
                ) : (
                  <MicOff className="w-8 h-8 text-gray-600" />
                )}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {phase === 'speaking' ? 'Recording in Progress' : 'Recording Complete'}
              </h3>
              
              {phase === 'speaking' && (
                <p className="text-gray-600">Speak clearly into your microphone</p>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <p className="text-gray-700 leading-relaxed">{task.prompt}</p>
            </div>

            {phase === 'speaking' && (
              <div className="text-center mb-6">
                <div className={`text-3xl font-bold mb-2 ${timeRemaining <= 30 ? 'text-red-600' : 'text-green-600'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-600 font-medium">Recording...</span>
                </div>
              </div>
            )}

            {phase === 'completed' && recordedUrl && (
              <div className="space-y-6">
                <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-medium text-green-800">Recording Complete!</h4>
                  <p className="text-green-700 text-sm">Your response has been captured successfully.</p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex items-center gap-4 mb-4">
                    <FileAudio className="w-6 h-6 text-gray-600" />
                    <span className="font-medium text-gray-800">Your Recording</span>
                  </div>
                  
                  <audio
                    ref={audioRef}
                    src={recordedUrl}
                    controls
                    className="w-full"
                  />
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={restartTask}
                    className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Again
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Get AI Feedback
                  </button>
                </div>

                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper functions for different test types
function getTaskTitle(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'IELTS Speaking Part 2 - Long Turn';
    case 'tef':
      return 'TEF Expression Orale - Présentation';
    case 'opic':
      return 'OPIc Speaking Task';
    default:
      return 'Speaking Practice';
  }
}

function getTaskDescription(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'Speak about the given topic for 1-2 minutes after 1 minute of preparation time.';
    case 'tef':
      return 'Présentez votre point de vue sur le sujet proposé de manière structurée.';
    case 'opic':
      return 'Speak naturally about your personal experience with the given topic.';
    default:
      return 'Complete the speaking task according to the instructions provided.';
  }
}

function getTaskPrompt(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'Describe a hobby or activity that you enjoy doing in your free time. You should say: what the hobby or activity is, when you started doing it, how often you do it now, and explain why you enjoy doing this hobby or activity.';
    case 'tef':
      return 'Parlez d\'une tradition de votre pays que vous trouvez importante. Vous devriez expliquer en quoi consiste cette tradition, pourquoi elle est importante pour votre culture, et donner votre opinion personnelle à ce sujet.';
    case 'opic':
      return 'Tell me about your favorite place to relax or unwind. Describe this place in detail, explain what you like to do there, and tell me why it\'s special to you.';
    default:
      return 'Speak about the given topic following the instructions provided.';
  }
}

function getTaskInstructions(testType: string): string[] {
  switch (testType) {
    case 'ielts':
      return [
        'You have 1 minute to prepare your response',
        'Speak for 1-2 minutes on the given topic',
        'Address all the points mentioned in the task',
        'Speak clearly and at a natural pace',
        'Use a variety of vocabulary and grammar',
        'Organize your response logically'
      ];
    case 'tef':
      return [
        'Vous avez 1 minute pour préparer votre réponse',
        'Parlez pendant 2-3 minutes sur le sujet donné',
        'Structurez votre présentation clairement',
        'Utilisez un vocabulaire approprié',
        'Donnez des exemples concrets',
        'Exprimez votre opinion personnelle'
      ];
    case 'opic':
      return [
        'Take a moment to think about your response',
        'Speak naturally about your personal experience',
        'Provide specific details and examples',
        'Show your personality in your response',
        'Speak for 1-2 minutes',
        'Be descriptive and engaging'
      ];
    default:
      return ['Prepare your response', 'Speak clearly and coherently'];
  }
}

function getPreparationTime(testType: string): number {
  switch (testType) {
    case 'ielts':
      return 60; // seconds
    case 'tef':
      return 60;
    case 'opic':
      return 30;
    default:
      return 60;
  }
}

function getResponseTime(testType: string): number {
  switch (testType) {
    case 'ielts':
      return 120; // seconds
    case 'tef':
      return 180;
    case 'opic':
      return 120;
    default:
      return 120;
  }
}

function getTaskTips(testType: string): string[] {
  switch (testType) {
    case 'ielts':
      return [
        'Make notes during preparation time to organize your thoughts',
        'Address all parts of the question systematically',
        'Use personal examples to make your response more engaging',
        'Vary your vocabulary and avoid repetition',
        'Speak at a natural pace - don\'t rush'
      ];
    case 'tef':
      return [
        'Structurez votre réponse avec une introduction et une conclusion',
        'Utilisez des connecteurs logiques pour organiser vos idées',
        'Donnez des exemples personnels ou de votre culture',
        'Variez votre vocabulaire et vos structures grammaticales',
        'Parlez clairement et à un rythme naturel'
      ];
    case 'opic':
      return [
        'Be authentic and speak from personal experience',
        'Use descriptive language to paint a clear picture',
        'Don\'t worry about being perfect - focus on communication',
        'Show enthusiasm about the topic',
        'Connect your ideas smoothly'
      ];
    default:
      return ['Prepare your thoughts before speaking', 'Speak clearly and confidently'];
  }
}

function getTaskType(testType: string): string {
  switch (testType) {
    case 'ielts':
      return 'part2-long-turn';
    case 'tef':
      return 'presentation';
    case 'opic':
      return 'personal-experience';
    default:
      return 'general-speaking';
  }
}