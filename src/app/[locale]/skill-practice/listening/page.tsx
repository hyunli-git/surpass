'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  type: 'multiple-choice' | 'form-completion' | 'note-completion' | 'table-completion' | 'flow-chart' | 'map-labeling' | 'plan-labeling' | 'matching' | 'short-answer';
  question: string;
  options?: string[];
  answer: string | string[];
  explanation?: string;
  startTime?: number; // seconds from start of audio
  endTime?: number;
}

interface Section {
  id: number;
  title: string;
  description: string;
  context: string;
  audioUrl: string; // In real implementation, would have actual audio files
  duration: number; // in seconds
  questions: Question[];
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestSet {
  id: number;
  name: string;
  description: string;
  sections: Section[];
  totalTime: number;
  totalQuestions: number;
  year: string;
  topics: string[];
}

export default function IELTSListeningPractice() {
  const [selectedTest, setSelectedTest] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | string[] }>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(2400); // 40 minutes (30 + 10 transfer)
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Comprehensive IELTS Listening test sets reflecting current trends
  const testSets: TestSet[] = [
    {
      id: 1,
      name: "Test Set 1: Academic & Social Situations",
      description: "University life, study groups, and social arrangements",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["University Life", "Social Plans", "Academic Discussions", "Travel Planning"],
      sections: [
        {
          id: 1,
          title: "Section 1: Booking a Language Course",
          description: "Conversation between a student and language school receptionist",
          context: "A student calls a language school to inquire about English courses and make a booking.",
          audioUrl: "/audio/test1-section1.mp3", // Placeholder - would be actual audio
          duration: 360, // 6 minutes
          difficulty: "easy",
          questions: [
            {
              id: 1,
              type: "form-completion",
              question: "Complete the form below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.\n\nSTUDENT REGISTRATION FORM\n\nName: Sarah (1) _______\nNationality: (2) _______\nCourse type: (3) _______ English\nStart date: (4) _______\nAccommodation: (5) _______ family",
              answer: ["Martinez", "Spanish", "General", "September 15th", "host"],
              startTime: 30,
              endTime: 180,
              explanation: "Listen for personal details and course information at the beginning of the conversation"
            },
            {
              id: 2,
              type: "multiple-choice",
              question: "The student chooses the General English course because:",
              options: [
                "A) it's cheaper than other courses",
                "B) it focuses on everyday communication",
                "C) it includes business English",
                "D) it's available in the evenings"
              ],
              answer: "B",
              startTime: 120,
              endTime: 160,
              explanation: "The student mentions wanting to improve everyday communication skills"
            },
            {
              id: 3,
              type: "note-completion",
              question: "Complete the notes. Write NO MORE THAN THREE WORDS for each answer.\n\nCOURSE DETAILS:\n- Duration: (6) _______ weeks\n- Class size: maximum (7) _______ students\n- Price includes: course book and (8) _______\n- Additional cost: (9) _______ fee $25\n- Payment method: (10) _______",
              answer: ["twelve", "fifteen", "online materials", "registration", "credit card"],
              startTime: 200,
              endTime: 340,
              explanation: "Course details are discussed in the middle section of the conversation"
            }
          ]
        },
        {
          id: 2,
          title: "Section 2: University Campus Tour Information",
          description: "Monologue about campus facilities and services",
          context: "A university guide provides information about campus facilities for new international students.",
          audioUrl: "/audio/test1-section2.mp3",
          duration: 420, // 7 minutes
          difficulty: "medium",
          questions: [
            {
              id: 4,
              type: "map-labeling",
              question: "Label the map below. Write the correct letter, A-H, next to questions 11-15.\n\n11. Library _______\n12. Student Center _______\n13. Sports Complex _______\n14. International Office _______\n15. Cafeteria _______",
              answer: ["C", "F", "A", "E", "B"],
              startTime: 60,
              endTime: 300,
              explanation: "Follow the guide's directions to locate each building on the campus map"
            },
            {
              id: 5,
              type: "table-completion",
              question: "Complete the table below. Write NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.\n\nFACILITY OPENING HOURS:\n\nLibrary: (16) _______ - 10 PM weekdays\nGym: 6 AM - (17) _______ daily\nStudent Services: 9 AM - (18) _______ Monday to Friday\nHealth Center: (19) _______ appointment only\nCafeteria: 7 AM - (20) _______ every day",
              answer: ["8 AM", "11 PM", "5 PM", "by", "9 PM"],
              startTime: 300,
              endTime: 400,
              explanation: "Opening hours are provided systematically for each facility"
            }
          ]
        },
        {
          id: 3,
          title: "Section 3: Study Group Discussion",
          description: "Three students discussing a research project",
          context: "Three university students (Maria, John, and Amy) discuss their group project on renewable energy.",
          audioUrl: "/audio/test1-section3.mp3",
          duration: 480, // 8 minutes
          difficulty: "medium",
          questions: [
            {
              id: 6,
              type: "multiple-choice",
              question: "Questions 21-26: Choose the correct letter, A, B, or C.\n\n21. The group's main research topic is:",
              options: [
                "A) solar energy efficiency",
                "B) wind power technology",
                "C) renewable energy storage"
              ],
              answer: "C",
              startTime: 45,
              endTime: 75,
              explanation: "Maria introduces the topic at the beginning of the discussion"
            },
            {
              id: 7,
              type: "matching",
              question: "Questions 27-30: Which student will research each topic?\nA) Maria  B) John  C) Amy\n\n27. Battery technology _______\n28. Government policies _______\n29. Cost analysis _______\n30. Environmental impact _______",
              answer: ["B", "A", "C", "A"],
              startTime: 180,
              endTime: 300,
              explanation: "The students divide responsibilities in the middle of the discussion"
            }
          ]
        },
        {
          id: 4,
          title: "Section 4: Lecture on Urban Wildlife",
          description: "Academic lecture about wildlife adaptation in cities",
          context: "Professor Dr. Wilson gives a lecture on how wildlife species adapt to urban environments.",
          audioUrl: "/audio/test1-section4.mp3",
          duration: 600, // 10 minutes
          difficulty: "hard",
          questions: [
            {
              id: 8,
              type: "note-completion",
              question: "Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.\n\nURBAN WILDLIFE ADAPTATION\n\nCommon urban species:\n- Birds: (31) _______ and pigeons most successful\n- Mammals: (32) _______ and urban foxes\n- Problems: (33) _______ pollution affects reproduction\n\nAdaptation strategies:\n- Changed (34) _______ patterns to avoid traffic\n- Modified (35) _______ calls due to noise\n- Altered (36) _______ behavior in response to artificial lighting",
              answer: ["house sparrows", "urban raccoons", "noise", "feeding", "mating", "sleeping"],
              startTime: 120,
              endTime: 450,
              explanation: "Key adaptation points are spread throughout the lecture"
            },
            {
              id: 9,
              type: "flow-chart",
              question: "Complete the flow-chart below. Write NO MORE THAN TWO WORDS for each answer.\n\nURBAN HABITAT CREATION PROCESS:\n\nUrban planning → Create (37) _______ → Install (38) _______ → Monitor (39) _______ → Assess (40) _______",
              answer: ["green corridors", "nesting boxes", "wildlife populations", "adaptation success"],
              startTime: 480,
              endTime: 570,
              explanation: "The process is outlined in the final part of the lecture"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      name: "Test Set 2: Daily Life & Work Situations",
      description: "Job interviews, shopping, health consultations, and workplace discussions",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Job Applications", "Healthcare", "Shopping", "Workplace Communication"],
      sections: [] // Would contain 4 full sections with audio and questions
    },
    {
      id: 3,
      name: "Test Set 3: Academic Contexts",
      description: "University lectures, seminars, and academic procedures",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Research Methods", "Academic Writing", "Scientific Discoveries", "Study Skills"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 4,
      name: "Test Set 4: Social & Travel Situations",
      description: "Travel arrangements, social events, and cultural activities",
      year: "2025",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Travel Planning", "Cultural Events", "Social Activities", "Tourism"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 5,
      name: "Test Set 5: Technology & Environment",
      description: "Environmental issues, technology discussions, and sustainability",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Climate Change", "Green Technology", "Digital Innovation", "Sustainability"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 6,
      name: "Test Set 6: Health & Lifestyle",
      description: "Medical consultations, fitness programs, and lifestyle choices",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Healthcare", "Fitness", "Nutrition", "Mental Health"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 7,
      name: "Test Set 7: Education & Career",
      description: "Career planning, professional development, and educational choices",
      year: "2025",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Career Development", "Professional Training", "Skills Assessment", "Job Market"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 8,
      name: "Test Set 8: Arts & Culture",
      description: "Cultural events, art exhibitions, and entertainment",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Art Exhibitions", "Cultural Events", "Music", "Literature"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 9,
      name: "Test Set 9: Business & Finance",
      description: "Business meetings, financial planning, and commercial activities",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Business Planning", "Financial Services", "Marketing", "Customer Relations"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 10,
      name: "Test Set 10: Science & Research",
      description: "Scientific research, laboratory procedures, and academic conferences",
      year: "2025",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Scientific Method", "Research Findings", "Laboratory Work", "Academic Conferences"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 11,
      name: "Test Set 11: Housing & Accommodation",
      description: "Rental arrangements, housing searches, and living situations",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Rental Properties", "Accommodation Services", "Housing Problems", "Living Arrangements"],
      sections: [] // Would contain 4 full sections
    },
    {
      id: 12,
      name: "Test Set 12: Sports & Recreation",
      description: "Sports facilities, recreational activities, and leisure planning",
      year: "2024",
      totalTime: 40,
      totalQuestions: 40,
      topics: ["Sports Facilities", "Recreation Programs", "Leisure Activities", "Club Membership"],
      sections: [] // Would contain 4 full sections
    }
  ];

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isTimerActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(time => time - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitTest();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeRemaining]);

  // Audio time tracking
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const updateTime = () => setAudioCurrentTime(audio.currentTime);
      const handleLoad = () => setAudioLoaded(true);
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      
      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadeddata', handleLoad);
      audio.addEventListener('play', handlePlay);
      audio.addEventListener('pause', handlePause);
      
      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadeddata', handleLoad);
        audio.removeEventListener('play', handlePlay);
        audio.removeEventListener('pause', handlePause);
      };
    }
  }, [selectedTest, currentSection]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartTest = (testId: number) => {
    setSelectedTest(testId);
    setCurrentSection(0);
    setUserAnswers({});
    setShowResults(false);
    setTimeRemaining(2400); // 40 minutes
    setIsTimerActive(true);
    setAudioCurrentTime(0);
    setIsPlaying(false);
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    }
  };

  const handleSeekTo = (time: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = time;
    }
  };

  const handleSubmitTest = () => {
    setIsTimerActive(false);
    setShowResults(true);
    // Calculate score
    const test = testSets.find(t => t.id === selectedTest);
    if (!test) return;
    
    let correctAnswers = 0;
    test.sections.forEach(section => {
      section.questions.forEach(question => {
        const userAnswer = userAnswers[`${section.id}-${question.id}`];
        if (Array.isArray(question.answer)) {
          if (JSON.stringify(userAnswer) === JSON.stringify(question.answer)) {
            correctAnswers++;
          }
        } else if (typeof userAnswer === 'string' && typeof question.answer === 'string') {
          if (userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim()) {
            correctAnswers++;
          }
        }
      });
    });
    
    console.log(`Score: ${correctAnswers}/${test.totalQuestions}`);
  };

  if (selectedTest) {
    const test = testSets.find(t => t.id === selectedTest);
    if (!test || test.sections.length === 0) {
      return (
        <div className="listening-practice-container">
          <div className="test-placeholder">
            <h2>Test Under Construction</h2>
            <p>This test set is being developed with audio files and comprehensive questions.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setSelectedTest(null)}
            >
              Back to Test Selection
            </button>
          </div>
        </div>
      );
    }

    const currentSectionData = test.sections[currentSection];

    return (
      <div className="listening-practice-container">
        {/* Test Header */}
        <div className="test-header">
          <div className="test-info">
            <h2>{test.name}</h2>
            <div className="test-meta">
              <span>Section {currentSection + 1} of {test.sections.length}</span>
              <span className="separator">|</span>
              <span>{currentSectionData.title}</span>
            </div>
          </div>
          
          <div className="test-controls">
            <div className="timer">
              <span className="timer-icon">⏱️</span>
              <span className={timeRemaining < 600 ? 'time-warning' : ''}>
                {formatTime(timeRemaining)}
              </span>
            </div>
          </div>
        </div>

        {/* Audio Player */}
        <div className="audio-player">
          <div className="audio-info">
            <h3>{currentSectionData.title}</h3>
            <p className="audio-description">{currentSectionData.description}</p>
            <div className="audio-context">{currentSectionData.context}</div>
          </div>
          
          <div className="audio-controls">
            <button 
              className="play-pause-btn"
              onClick={handlePlayPause}
              disabled={!audioLoaded}
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
            
            <div className="audio-progress">
              <div className="time-display">
                {formatTime(Math.floor(audioCurrentTime))} / {formatTime(currentSectionData.duration)}
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${(audioCurrentTime / currentSectionData.duration) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Hidden audio element (in real implementation, would have actual audio files) */}
          <audio
            ref={audioRef}
            src={currentSectionData.audioUrl}
            preload="metadata"
          />
        </div>

        {/* Instructions */}
        <div className="instructions-panel">
          <h4>Instructions</h4>
          <p>Listen to the audio and answer the questions. You will hear each section only once. 
             Write your answers directly in the spaces provided.</p>
          <div className="section-difficulty">
            <span className="difficulty-label">Difficulty:</span>
            <span className={`difficulty-badge ${currentSectionData.difficulty}`}>
              {currentSectionData.difficulty}
            </span>
          </div>
        </div>

        {/* Questions Section */}
        <div className="questions-section">
          {currentSectionData.questions.map((question) => (
            <div key={question.id} className="question-block">
              <div className="question-header">
                <span className="question-number">Question {question.id}</span>
                <span className="question-type">{question.type.replace('-', ' ')}</span>
                {question.startTime && (
                  <button 
                    className="audio-cue-btn"
                    onClick={() => handleSeekTo(question.startTime!)}
                    title={`Jump to ${formatTime(question.startTime)}`}
                  >
                    🔊 {formatTime(question.startTime)}
                  </button>
                )}
              </div>
              
              <div className="question-content">
                {question.question.split('\n').map((line, idx) => (
                  <div key={idx} className="question-line">
                    {line}
                  </div>
                ))}
              </div>
              
              {/* Render different input types based on question type */}
              {question.type === 'multiple-choice' && question.options && (
                <div className="options-list">
                  {question.options.map((option, idx) => (
                    <label key={idx} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option}
                        checked={userAnswers[`${currentSectionData.id}-${question.id}`] === option}
                        onChange={(e) => handleAnswerChange(`${currentSectionData.id}-${question.id}`, e.target.value)}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
              )}
              
              {(question.type === 'form-completion' || 
                question.type === 'note-completion' ||
                question.type === 'table-completion' ||
                question.type === 'short-answer') && (
                <div className="completion-inputs">
                  {Array.isArray(question.answer) ? 
                    question.answer.map((_, idx) => (
                      <div key={idx} className="input-group">
                        <label>Answer {idx + 1}:</label>
                        <input
                          type="text"
                          className="answer-input"
                          placeholder="Type your answer..."
                          value={
                            Array.isArray(userAnswers[`${currentSectionData.id}-${question.id}`]) 
                              ? (userAnswers[`${currentSectionData.id}-${question.id}`] as string[])[idx] || ''
                              : idx === 0 ? userAnswers[`${currentSectionData.id}-${question.id}`] || '' : ''
                          }
                          onChange={(e) => {
                            const currentAnswers = Array.isArray(userAnswers[`${currentSectionData.id}-${question.id}`]) 
                              ? [...(userAnswers[`${currentSectionData.id}-${question.id}`] as string[])]
                              : new Array(question.answer.length).fill('');
                            currentAnswers[idx] = e.target.value;
                            handleAnswerChange(`${currentSectionData.id}-${question.id}`, currentAnswers);
                          }}
                        />
                      </div>
                    )) :
                    <input
                      type="text"
                      className="answer-input"
                      placeholder="Type your answer..."
                      value={userAnswers[`${currentSectionData.id}-${question.id}`] || ''}
                      onChange={(e) => handleAnswerChange(`${currentSectionData.id}-${question.id}`, e.target.value)}
                    />
                  }
                </div>
              )}
              
              {question.type === 'matching' && (
                <div className="matching-section">
                  <div className="matching-instructions">
                    Match each item with the correct letter (A, B, C, etc.)
                  </div>
                  {question.question.split('\n').slice(1).map((item, idx) => {
                    if (item.includes('_______')) {
                      return (
                        <div key={idx} className="matching-item">
                          <span className="matching-text">{item.replace('_______', '')}</span>
                          <input
                            type="text"
                            className="matching-input"
                            maxLength={1}
                            placeholder="A"
                            value={
                              Array.isArray(userAnswers[`${currentSectionData.id}-${question.id}`])
                                ? (userAnswers[`${currentSectionData.id}-${question.id}`] as string[])[idx] || ''
                                : ''
                            }
                            onChange={(e) => {
                              const currentAnswers = Array.isArray(userAnswers[`${currentSectionData.id}-${question.id}`])
                                ? [...(userAnswers[`${currentSectionData.id}-${question.id}`] as string[])]
                                : new Array((question.answer as string[]).length).fill('');
                              currentAnswers[idx] = e.target.value.toUpperCase();
                              handleAnswerChange(`${currentSectionData.id}-${question.id}`, currentAnswers);
                            }}
                          />
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
              
              {/* Show answer feedback if test is completed */}
              {showResults && (
                <div className={`answer-feedback ${
                  Array.isArray(question.answer) 
                    ? JSON.stringify(userAnswers[`${currentSectionData.id}-${question.id}`]) === JSON.stringify(question.answer) ? 'correct' : 'incorrect'
                    : userAnswers[`${currentSectionData.id}-${question.id}`] === question.answer ? 'correct' : 'incorrect'
                }`}>
                  <div className="feedback-header">
                    {Array.isArray(question.answer) 
                      ? JSON.stringify(userAnswers[`${currentSectionData.id}-${question.id}`]) === JSON.stringify(question.answer) ? '✓ Correct' : '✗ Incorrect'
                      : userAnswers[`${currentSectionData.id}-${question.id}`] === question.answer ? '✓ Correct' : '✗ Incorrect'
                    }
                  </div>
                  <div className="correct-answer">
                    Correct answer: {Array.isArray(question.answer) ? question.answer.join(', ') : question.answer}
                  </div>
                  {question.explanation && (
                    <div className="explanation">
                      Explanation: {question.explanation}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div className="test-navigation">
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentSection(prev => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
          >
            Previous Section
          </button>
          
          <div className="section-indicators">
            {test.sections.map((section, idx) => (
              <button
                key={idx}
                className={`section-indicator ${idx === currentSection ? 'active' : ''} ${
                  section.questions.some(q => userAnswers[`${section.id}-${q.id}`]) ? 'has-answers' : ''
                }`}
                onClick={() => setCurrentSection(idx)}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          
          {currentSection < test.sections.length - 1 ? (
            <button 
              className="btn btn-primary"
              onClick={() => setCurrentSection(prev => prev + 1)}
            >
              Next Section
            </button>
          ) : (
            <button 
              className="btn btn-success"
              onClick={handleSubmitTest}
            >
              Submit Test
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="listening-practice-container">
      {/* Page Header */}
      <div className="page-header">
        <Link href="/skill-practice" className="back-link">
          ← Back to Skills
        </Link>
        <h1>IELTS Listening Practice</h1>
        <p className="page-description">
          Comprehensive listening tests with authentic audio materials and current question formats
        </p>
      </div>

      {/* Test Sets Grid */}
      <div className="test-sets-grid">
        {testSets.map(test => (
          <div key={test.id} className="test-card">
            <div className="test-card-header">
              <h3>{test.name}</h3>
              <span className="test-year">{test.year}</span>
            </div>
            
            <p className="test-description">{test.description}</p>
            
            <div className="test-topics">
              {test.topics.map((topic, idx) => (
                <span key={idx} className="topic-badge">{topic}</span>
              ))}
            </div>
            
            <div className="test-stats">
              <div className="stat">
                <span className="stat-icon">📝</span>
                <span className="stat-value">{test.totalQuestions} questions</span>
              </div>
              <div className="stat">
                <span className="stat-icon">⏱️</span>
                <span className="stat-value">{test.totalTime} minutes</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🎵</span>
                <span className="stat-value">4 sections</span>
              </div>
            </div>
            
            <button 
              className="btn btn-primary start-test-btn"
              onClick={() => handleStartTest(test.id)}
            >
              Start Test
            </button>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="info-section">
        <h2>About IELTS Listening Test</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Test Structure</h3>
            <ul>
              <li>30 minutes listening + 10 minutes transfer</li>
              <li>40 questions across 4 sections</li>
              <li>Increasing difficulty (Sections 1-4)</li>
              <li>Each section heard once only</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Section Types</h3>
            <ul>
              <li>Section 1: Social conversation (2 people)</li>
              <li>Section 2: Monologue in social context</li>
              <li>Section 3: Educational conversation (up to 4 people)</li>
              <li>Section 4: Academic lecture/monologue</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Question Types</h3>
            <ul>
              <li>Form/note/table/flow-chart completion</li>
              <li>Multiple choice</li>
              <li>Matching</li>
              <li>Plan/map/diagram labeling</li>
              <li>Short-answer questions</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3>Scoring</h3>
            <ul>
              <li>Band score 1-9</li>
              <li>39-40 correct = Band 9</li>
              <li>37-38 correct = Band 8.5</li>
              <li>35-36 correct = Band 8</li>
              <li>32-34 correct = Band 7.5</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}