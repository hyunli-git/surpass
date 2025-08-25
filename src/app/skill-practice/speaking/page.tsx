// src/app/skill-practice/speaking/page.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';

// 컴포넌트의 여러 상태를 정의합니다.
type PracticeStatus = 'loading' | 'preparing' | 'speaking' | 'finished';

interface SpeakingQuestion {
  part: number;
  topic: string;
  prompt: string;
}

export default function SpeakingPracticePage() {
  const [status, setStatus] = useState<PracticeStatus>('loading');
  const [question, setQuestion] = useState<SpeakingQuestion | null>(null);
  const [audioURL, setAudioURL] = useState('');
  const [timer, setTimer] = useState(60); // 타이머 초기값은 60초
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 텍스트를 음성으로 변환하는 함수
  const speak = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Browser does not support Speech Synthesis.");
      return;
    }
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  // 페이지 로드 시 질문을 가져옵니다.
  useEffect(() => {
    const fetchQuestion = async () => {
      const { data, error } = await supabase
        .from('practice_questions')
        .select('*')
        .eq('skill_type', 'Speaking')
        .eq('part', 2)
        .limit(1)
        .single();

      if (error || !data) {
        alert('질문을 불러오는 데 실패했습니다.');
      } else {
        setQuestion(data);
        // ▼▼▼ TTS 기능 호출 ▼▼▼
        const textToSpeak = `Part ${data.part}. The topic is ${data.topic}. Please, describe a book that you enjoyed reading. You have one minute to prepare.`;
        speak(textToSpeak);
        // ▲▲▲ TTS 기능 호출 ▲▲▲
        setStatus('preparing');
      }
    };
    fetchQuestion();

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // 상태(status)가 변경될 때마다 타이머 로직을 실행합니다.
  useEffect(() => {
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (status === 'preparing') {
      setTimer(60); // 1분 준비 시간
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            speak("Your preparation time is over. Please start speaking now.");
            startRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (status === 'speaking') {
      setTimer(120); // 2분 답변 시간
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            stopRecording();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [status]);

  const startRecording = async () => {
    setStatus('speaking');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        setStatus('finished');
        speak("Your speaking time is over.");
      };
      mediaRecorder.start();
    } catch (err) {
      alert('마이크 접근 권한이 필요합니다.');
      setStatus('preparing');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
    }
  };

  const handleGetFeedback = () => alert("AI 분석 기능은 곧 추가될 예정입니다!");

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const renderStatusUI = () => {
    switch (status) {
      case 'preparing':
        return <div>준비 시간: {formatTime(timer)}</div>;
      case 'speaking':
        return <div style={{color: 'var(--accent-red)'}}>답변 시간: {formatTime(timer)} (녹음 중...)</div>;
      case 'finished':
        return <div>시험 종료</div>;
      default:
        return <div>질문 로딩 중...</div>;
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px', margin: '50px auto' }}>
      <h1>IELTS Speaking Practice (Part 2)</h1>
      
      <div className="question-box" style={{ marginBottom: 'var(--space-xl)' }}>
        {question ? (
          <>
            <h3>{question.topic}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: '0', color: 'var(--text-secondary)' }}>
              {question.prompt}
            </pre>
          </>
        ) : (
          <p>Loading question...</p>
        )}
      </div>

      <div className="question-box">
        <h3>Your Response</h3>
        <div style={{ padding: '20px 0', fontSize: '1.5rem', fontWeight: '600' }}>
          {renderStatusUI()}
        </div>

        {status === 'finished' && audioURL && (
          <div>
            <h4>Listen to your recording:</h4>
            <audio src={audioURL} controls style={{ width: '100%' }} />
            <button onClick={handleGetFeedback} className="btn btn-success" style={{ marginTop: '20px', width: '100%' }}>
              Get AI Feedback
            </button>
          </div>
        )}
      </div>
    </div>
  );
}