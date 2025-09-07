// src/app/skill-practice/speaking/page.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import AuthProtection from '@/components/AuthProtection';

// 컴포넌트의 여러 상태를 정의합니다.
type PracticeStatus = 'loading' | 'ready' | 'preparing' | 'speaking' | 'finished';

interface SpeakingQuestion {
  part: number;
  topic: string;
  prompt: string;
}

interface IELTSFeedback {
  overallScore: number;
  targetScore: number;
  scores: {
    fluencyCoherence: number;
    lexicalResource: number;
    grammaticalRange: number;
    pronunciation: number;
  };
  transcript: string;
  strengths: string[];
  improvements: string[];
  nextLevelGuide: {
    currentLevel: string;
    targetLevel: string;
    keyFocus: string[];
    specificActions: string[];
    practiceActivities: string[];
    timeline: string;
  };
  detailedAnalysis: {
    fluency: string;
    vocabulary: string;
    grammar: string;
    pronunciation: string;
  };
}

export default function SpeakingPracticePage() {
  const searchParams = useSearchParams();
  const testType = searchParams.get('test') || 'ielts';
  const language = searchParams.get('lang') || 'en';
  const isTEF = testType === 'tef';
  
  const [status, setStatus] = useState<PracticeStatus>('loading');
  const [question, setQuestion] = useState<SpeakingQuestion | null>(null);
  const [audioURL, setAudioURL] = useState('');
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [timer, setTimer] = useState(60); // 타이머 초기값은 60초
  const [feedback, setFeedback] = useState<IELTSFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 텍스트를 음성으로 변환하는 함수 (OpenAI TTS 사용)
  const speak = async (text: string) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          text, 
          voice: 'nova' // 여성 목소리, 자연스러운 톤
        }),
      });

      if (!response.ok) {
        console.warn('TTS API failed, falling back to browser TTS');
        fallbackSpeak(text);
        return;
      }

      const audioBuffer = await response.arrayBuffer();
      const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      audio.play();

      // Clean up the object URL after playing
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
      };

    } catch (error) {
      console.error('TTS Error:', error);
      fallbackSpeak(text);
    }
  };

  // 브라우저 기본 TTS (백업용)
  const fallbackSpeak = (text: string) => {
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
      if (isTEF) {
        // TEF Questions authentiques
        const tefQuestions: SpeakingQuestion[] = [
          {
            part: 1,
            topic: "Section A - Entretien dirigé",
            prompt: "L'examinateur va vous poser des questions sur vous-même, votre famille, vos études, votre travail, vos loisirs et vos projets.\n\nExemple de questions :\n• Pouvez-vous vous présenter ?\n• Parlez-moi de votre famille\n• Que faites-vous dans la vie ?\n• Quels sont vos loisirs ?\n• Avez-vous des projets pour l'avenir ?\n\nDurée : 2-3 minutes\nConsignes : Répondez de manière naturelle et développée"
          },
          {
            part: 2,
            topic: "Section B - Expression libre",
            prompt: "Sujet : L'utilisation des smartphones chez les jeunes\n\n📱 Situation :\nDe plus en plus de jeunes passent plusieurs heures par jour sur leur smartphone. Certains parents s'inquiètent de cette dépendance, tandis que d'autres y voient un outil moderne d'apprentissage.\n\n🎯 Votre tâche :\n• Exprimez votre opinion sur ce sujet\n• Donnez 2-3 arguments pour soutenir votre point de vue\n• Illustrez avec des exemples personnels ou observés\n• Proposez des solutions si nécessaire\n\nTemps de préparation : 2 minutes\nTemps de parole : 3 minutes"
          },
          {
            part: 2,
            topic: "Section B - Expression libre", 
            prompt: "Sujet : Le télétravail après la pandémie\n\n🏠 Situation :\nDepuis la pandémie, beaucoup d'entreprises ont adopté le télétravail. Certains employés préfèrent travailler de chez eux, d'autres souhaitent retourner au bureau.\n\n🎯 Votre tâche :\n• Quelle est votre position sur le télétravail ?\n• Quels sont les avantages et inconvénients ?\n• Comment voyez-vous l'avenir du travail ?\n• Donnez des exemples concrets\n\nTemps de préparation : 2 minutes\nTemps de parole : 3 minutes"
          },
          {
            part: 2,
            topic: "Section B - Expression libre",
            prompt: "Sujet : L'écologie et les gestes du quotidien\n\n🌱 Situation :\nFace au changement climatique, chacun est appelé à modifier ses habitudes quotidiennes. Certains font de gros efforts, d'autres pensent que les actions individuelles sont insuffisantes.\n\n🎯 Votre tâche :\n• Que pensez-vous de la responsabilité individuelle en écologie ?\n• Quels gestes écologiques adoptez-vous ?\n• Les efforts individuels suffisent-ils ?\n• Proposez des solutions concrètes\n\nTemps de préparation : 2 minutes\nTemps de parole : 3 minutes"
          }
        ];
        const randomQuestion = tefQuestions[Math.floor(Math.random() * tefQuestions.length)];
        setQuestion(randomQuestion);
        setStatus('ready');
        return;
      }

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
        setStatus('ready'); // 바로 preparing으로 가지 않고 ready 상태로
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
        setAudioBlob(audioBlob);
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

  const handleGetFeedback = async () => {
    if (!audioBlob || !question) {
      alert("Recording not available for analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('question', question.prompt || question.topic);

      const response = await fetch('/api/speech-analysis', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const feedbackData: IELTSFeedback = await response.json();
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Feedback analysis error:', error);
      alert('Failed to analyze your recording. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startPractice = () => {
    if (!question) return;
    
    const textToSpeak = `Part ${question.part}. The topic is ${question.topic}. Please, describe a book that you enjoyed reading. You have one minute to prepare.`;
    speak(textToSpeak);
    setStatus('preparing');
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
  };

  const renderStatusUI = () => {
    switch (status) {
      case 'ready':
        return (
          <div className="ready-state">
            <div className="practice-instructions">
              <h4>🎤 Speaking Practice Instructions</h4>
              <ul>
                <li>Make sure your microphone is working</li>
                <li>Find a quiet place to practice</li>
                <li>You&apos;ll have 1 minute to prepare, then 2 minutes to speak</li>
                <li>The system will provide audio instructions</li>
              </ul>
            </div>
            <button 
              onClick={startPractice} 
              className="btn btn-primary"
              style={{ fontSize: '1.125rem', padding: 'var(--space-md) var(--space-xl)' }}
            >
              🎯 Start Speaking Practice
            </button>
          </div>
        );
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
    <AuthProtection feature="speaking practice">
      <div className="container" style={{ margin: '50px auto' }}>
        <h1>{isTEF ? 'TEF Expression orale Practice' : 'IELTS Speaking Practice (Part 2)'}</h1>
        
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

          {status === 'finished' && audioURL && !feedback && (
            <div>
              <h4>Listen to your recording:</h4>
              <audio src={audioURL} controls style={{ width: '100%' }} />
              <button 
                onClick={handleGetFeedback} 
                className="btn btn-primary" 
                style={{ marginTop: '20px', width: '100%' }}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <span>🧠 Analyzing your speech...</span>
                  </>
                ) : (
                  <>
                    <span>🎯 Get AI Feedback & Score</span>
                  </>
                )}
              </button>
            </div>
          )}

          {feedback && (
            <div className="feedback-container">
              <h3>🎉 Your {isTEF ? 'TEF Expression orale' : 'IELTS Speaking'} Analysis</h3>
              
              {/* Overall Score */}
              <div className="score-overview">
                <div className="overall-score">
                  <div className="score-circle">
                    <span className="score-number">{feedback.overallScore}</span>
                    <span className="score-label">Overall</span>
                  </div>
                </div>
                
                <div className="detailed-scores">
                  <div className="score-item">
                    <span className="score-category">Fluency & Coherence</span>
                    <span className="score-value">{feedback.scores.fluencyCoherence}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-category">Lexical Resource</span>
                    <span className="score-value">{feedback.scores.lexicalResource}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-category">Grammar Range</span>
                    <span className="score-value">{feedback.scores.grammaticalRange}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-category">Pronunciation</span>
                    <span className="score-value">{feedback.scores.pronunciation}</span>
                  </div>
                </div>
              </div>

              {/* Transcript */}
              <div className="transcript-section">
                <h4>📝 What you said:</h4>
                <div className="transcript-box">
                  {feedback.transcript}
                </div>
              </div>

              {/* Strengths */}
              <div className="feedback-section">
                <h4>✅ Your Strengths:</h4>
                <ul className="strength-list">
                  {feedback.strengths.map((strength, index) => (
                    <li key={index}>{strength}</li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div className="feedback-section">
                <h4>🎯 Areas for Improvement:</h4>
                <ul className="improvement-list">
                  {feedback.improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                  ))}
                </ul>
              </div>

              {/* Next Level Guide */}
              <div className="next-level-guide">
                <h4>🚀 Your Path to {feedback.nextLevelGuide.targetLevel}</h4>
                
                <div className="level-progress">
                  <div className="current-level">
                    <span className="level-badge current">Current: {feedback.nextLevelGuide.currentLevel}</span>
                  </div>
                  <div className="progress-arrow">→</div>
                  <div className="target-level">
                    <span className="level-badge target">Target: {feedback.nextLevelGuide.targetLevel}</span>
                  </div>
                </div>

                <div className="guide-content">
                  <div className="guide-section">
                    <h5>🎯 Key Focus Areas</h5>
                    <ul className="focus-list">
                      {feedback.nextLevelGuide.keyFocus.map((focus, index) => (
                        <li key={index}>{focus}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="guide-section">
                    <h5>✅ Specific Actions to Take</h5>
                    <ul className="action-list">
                      {feedback.nextLevelGuide.specificActions.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="guide-section">
                    <h5>📚 Daily Practice Activities</h5>
                    <ul className="practice-list">
                      {feedback.nextLevelGuide.practiceActivities.map((activity, index) => (
                        <li key={index}>{activity}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="timeline-box">
                    <h5>⏰ Expected Timeline</h5>
                    <p>{feedback.nextLevelGuide.timeline}</p>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="detailed-analysis">
                <h4>📊 Detailed Analysis:</h4>
                <div className="analysis-grid">
                  <div className="analysis-item">
                    <h5>🗣️ Fluency & Coherence</h5>
                    <p>{feedback.detailedAnalysis.fluency}</p>
                  </div>
                  <div className="analysis-item">
                    <h5>📚 Vocabulary</h5>
                    <p>{feedback.detailedAnalysis.vocabulary}</p>
                  </div>
                  <div className="analysis-item">
                    <h5>🔤 Grammar</h5>
                    <p>{feedback.detailedAnalysis.grammar}</p>
                  </div>
                  <div className="analysis-item">
                    <h5>🎤 Pronunciation</h5>
                    <p>{feedback.detailedAnalysis.pronunciation}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button 
                  onClick={() => window.location.reload()} 
                  className="btn btn-outline"
                  style={{ width: '48%' }}
                >
                  🔄 Try Again
                </button>
                <button 
                  onClick={() => window.print()} 
                  className="btn btn-primary"
                  style={{ width: '48%' }}
                >
                  📄 Save Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthProtection>
  );
}