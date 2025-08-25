// src/components/MockTest.tsx

"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import AuthProtection from '@/components/AuthProtection';

// 간단한 예시 문제 데이터 (나중에 이 부분도 DB에서 가져올 수 있습니다)
const sampleQuestions = [
  { id: 1, text: "What are the library's opening hours on weekdays?", answer: "8:00 AM - 9:00 PM" },
  { id: 2, text: "How many items can a library member borrow at once?", answer: "10 items" },
  { id: 3, text: "Which languages are taught in the free workshops?", answer: "Spanish, French, and Mandarin" },
];

export default function MockTest() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const router = useRouter();

  const handleAnswer = (answer: string) => {
    // 사용자의 답변을 저장합니다.
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);

    // 다음 문제로 넘어갑니다.
    if (currentQuestionIndex < sampleQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 문제라면 시험을 종료합니다.
      finishTest(newAnswers);
    }
  };

  const finishTest = async (finalAnswers: string[]) => {
    // 점수를 채점합니다.
    let correctAnswers = 0;
    sampleQuestions.forEach((question, index) => {
      if (question.answer === finalAnswers[index]) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setIsFinished(true);

    // --- Supabase에 결과 저장 ---
    // 1. 현재 로그인한 사용자의 정보를 가져옵니다.
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // 2. 저장할 데이터 객체를 만듭니다.
      const resultData = {
        user_id: user.id, // 사용자 ID
        score: correctAnswers,
        answered_count: finalAnswers.length,
        total_questions: sampleQuestions.length,
        test_type: 'Sample Library Test',
      };
      
      // 3. 'test_results' 테이블에 데이터를 삽입(저장)합니다.
      const { error } = await supabase.from('test_results').insert(resultData);

      if (error) {
        alert('결과 저장에 실패했습니다: ' + error.message);
      } else {
        alert('시험이 종료되었습니다! 결과가 저장되었습니다.');
      }
    }
  };

  if (isFinished) {
    return (
      <AuthProtection feature="mock test results">
        <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h1>시험 종료!</h1>
          <p style={{ fontSize: '1.5rem' }}>
            당신의 점수는: **{score} / {sampleQuestions.length}**
          </p>
          <button onClick={() => router.push('/')} className="btn">홈으로 돌아가기</button>
        </div>
      </AuthProtection>
    );
  }

  return (
    <AuthProtection feature="mock test">
      <div className="container" style={{ maxWidth: '600px', margin: '50px auto' }}>
        <h1>모의고사</h1>
        <div className="question-box">
          <h3 className="question-title">문제 {currentQuestionIndex + 1}</h3>
          <p className="question-text">{sampleQuestions[currentQuestionIndex].text}</p>
          <div className="answer-options">
            {/* 간단한 예시를 위해 버튼으로 답변을 만듭니다. */}
            <button onClick={() => handleAnswer("8:00 AM - 9:00 PM")} className="btn">8:00 AM - 9:00 PM</button>
            <button onClick={() => handleAnswer("10 items")} className="btn">10 items</button>
            <button onClick={() => handleAnswer("Spanish, French, and Mandarin")} className="btn">Spanish, French, and Mandarin</button>
            <button onClick={() => handleAnswer("Wrong Answer")} className="btn">Wrong Answer</button>
          </div>
        </div>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          {currentQuestionIndex + 1} / {sampleQuestions.length}
        </p>
      </div>
    </AuthProtection>
  );
}