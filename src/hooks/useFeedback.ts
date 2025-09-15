'use client';

import { useState } from 'react';

interface FeedbackRequest {
  type: 'writing' | 'speaking';
  response?: string;
  audioUrl?: string;
  transcript?: string;
  testType: 'ielts' | 'tef' | 'opic';
  taskType: string;
  prompt: string;
  duration?: number;
  targetDuration?: number;
  targetWordCount?: number;
  timeSpent?: number;
}

interface FeedbackState {
  isLoading: boolean;
  feedback: unknown | null;
  error: string | null;
}

export function useFeedback() {
  const [state, setState] = useState<FeedbackState>({
    isLoading: false,
    feedback: null,
    error: null,
  });

  const analyzeFeedback = async (request: FeedbackRequest) => {
    setState({ isLoading: true, feedback: null, error: null });

    try {
      const endpoint = request.type === 'writing' 
        ? '/api/feedback/writing' 
        : '/api/feedback/speaking';

      const body = request.type === 'writing' 
        ? {
            response: request.response,
            testType: request.testType,
            taskType: request.taskType,
            prompt: request.prompt,
            targetWordCount: request.targetWordCount,
            timeSpent: request.timeSpent,
          }
        : {
            audioUrl: request.audioUrl,
            transcript: request.transcript,
            testType: request.testType,
            taskType: request.taskType,
            prompt: request.prompt,
            duration: request.duration,
            targetDuration: request.targetDuration,
          };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze response');
      }

      setState({ 
        isLoading: false, 
        feedback: data.feedback, 
        error: null 
      });

      return data.feedback;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      setState({ 
        isLoading: false, 
        feedback: null, 
        error: errorMessage 
      });
      throw error;
    }
  };

  const reset = () => {
    setState({ isLoading: false, feedback: null, error: null });
  };

  return {
    ...state,
    analyzeFeedback,
    reset,
  };
}