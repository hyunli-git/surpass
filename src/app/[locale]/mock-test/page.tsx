'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MockTestPage() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<'listening' | 'reading' | 'writing' | 'speaking'>('listening');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(165 * 60); // 2h 45m in seconds
  const [sectionTimeRemaining, setSectionTimeRemaining] = useState(30 * 60); // 30 minutes for listening
  const [isStarted, setIsStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<string>('');

  // Mock test data
  const testSections = {
    listening: {
      title: 'Listening',
      duration: 30,
      questions: 40,
      parts: [
        { part: 1, questions: '1-10', description: 'Conversation in an everyday context' },
        { part: 2, questions: '11-20', description: 'Monologue in an everyday context' },
        { part: 3, questions: '21-30', description: 'Conversation in academic context' },
        { part: 4, questions: '31-40', description: 'Academic lecture or talk' }
      ]
    },
    reading: {
      title: 'Reading',
      duration: 60,
      questions: 40,
      parts: [
        { part: 1, questions: '1-13', description: 'Reading Passage 1' },
        { part: 2, questions: '14-26', description: 'Reading Passage 2' },
        { part: 3, questions: '27-40', description: 'Reading Passage 3' }
      ]
    },
    writing: {
      title: 'Writing',
      duration: 60,
      questions: 2,
      parts: [
        { part: 1, questions: 'Task 1', description: 'Report writing (150 words, 20 minutes)' },
        { part: 2, questions: 'Task 2', description: 'Essay writing (250 words, 40 minutes)' }
      ]
    },
    speaking: {
      title: 'Speaking',
      duration: 15,
      questions: 3,
      parts: [
        { part: 1, questions: 'Part 1', description: 'Introduction and interview (4-5 minutes)' },
        { part: 2, questions: 'Part 2', description: 'Individual long turn (3-4 minutes)' },
        { part: 3, questions: 'Part 3', description: 'Two-way discussion (4-5 minutes)' }
      ]
    }
  };

  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit test
          alert('Test completed! Results will be available soon.');
          router.push('/');
          return 0;
        }
        return prev - 1;
      });

      setSectionTimeRemaining(prev => {
        if (prev <= 1) {
          // Auto-advance to next section
          const nextSection = getNextSection();
          if (nextSection === 'speaking' && currentSection === 'writing') {
            // Complete test
            alert('Test completed! Results will be available soon.');
            router.push('/');
            return 0;
          }
          
          setCurrentSection(nextSection as 'listening' | 'reading' | 'writing' | 'speaking');
          setCurrentQuestion(1);
          return getSectionDuration(nextSection);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted, currentSection, router, getNextSection, getSectionDuration]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getSectionDuration = (section: string) => {
    switch (section) {
      case 'listening': return 30 * 60;
      case 'reading': return 60 * 60;
      case 'writing': return 60 * 60;
      case 'speaking': return 15 * 60;
      default: return 30 * 60;
    }
  };

  const getNextSection = () => {
    const sections = ['listening', 'reading', 'writing', 'speaking'];
    const currentIndex = sections.indexOf(currentSection);
    return sections[currentIndex + 1] || 'speaking';
  };

  const handleStartTest = () => {
    setIsStarted(true);
  };

  const handleNextSection = () => {
    const nextSection = getNextSection();
    if (nextSection === 'speaking' && currentSection === 'writing') {
      // Complete test
      handleSubmitTest();
      return;
    }
    
    setCurrentSection(nextSection as 'listening' | 'reading' | 'writing' | 'speaking');
    setSectionTimeRemaining(getSectionDuration(nextSection));
    setCurrentQuestion(1);
  };

  const handleSubmitTest = () => {
    alert('Test completed! Results will be available soon.');
    router.push('/');
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  if (!isStarted) {
    return (
      <div className="mock-test-container">
        <div className="test-instructions">
          <div className="container container-narrow">
            <h1>IELTS General Training Mock Test</h1>
            
            <div className="test-overview">
              <h2>Test Overview</h2>
              <div className="section-cards">
                {Object.entries(testSections).map(([key, section]) => (
                  <div key={key} className="section-card">
                    <h3>{section.title}</h3>
                    <div className="section-info">
                      <div className="info-item">
                        <span className="label">Duration:</span>
                        <span className="value">{section.duration} minutes</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Questions:</span>
                        <span className="value">{section.questions}</span>
                      </div>
                    </div>
                    <div className="section-parts">
                      {section.parts.map((part, index) => (
                        <div key={index} className="part-item">
                          <strong>{part.questions}:</strong> {part.description}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="instructions-section">
              <h2>Important Instructions</h2>
              <ul className="instruction-list">
                <li>You have <strong>2 hours and 45 minutes</strong> to complete the entire test</li>
                <li>Each section has a specific time limit - you cannot return to previous sections</li>
                <li>Use the highlighting and note-taking features to help you</li>
                <li>All questions must be answered - there is no penalty for wrong answers</li>
                <li>The Speaking section will be conducted separately</li>
              </ul>
            </div>

            <div className="start-section">
              <button 
                onClick={handleStartTest}
                className="btn btn-primary start-test-btn"
              >
                Start Test
              </button>
              <p className="start-note">
                Make sure you have a quiet environment and stable internet connection
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = testSections[currentSection];

  return (
    <div className="mock-test-interface">
      {/* Test Header */}
      <div className="test-header">
        <div className="test-progress">
          <div className="section-indicator">
            {Object.keys(testSections).map((section) => (
              <div 
                key={section}
                className={`section-dot ${section === currentSection ? 'active' : ''} ${
                  Object.keys(testSections).indexOf(section) < Object.keys(testSections).indexOf(currentSection) ? 'completed' : ''
                }`}
              >
                {section.charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          <div className="current-section">
            {currentSectionData.title} - Question {currentQuestion} of {currentSectionData.questions}
          </div>
        </div>
        
        <div className="test-timers">
          <div className="section-timer">
            Section: {formatTime(sectionTimeRemaining)}
          </div>
          <div className="total-timer">
            Total: {formatTime(timeRemaining)}
          </div>
        </div>
      </div>

      {/* Test Content */}
      <div className="test-content">
        <div className="test-main">
          <div className="question-panel">
            {currentSection === 'listening' && (
              <ListeningSection 
                currentQuestion={currentQuestion}
                onAnswerChange={handleAnswerChange}
                answers={answers}
              />
            )}
            {currentSection === 'reading' && (
              <ReadingSection 
                currentQuestion={currentQuestion}
                onAnswerChange={handleAnswerChange}
                answers={answers}
              />
            )}
            {currentSection === 'writing' && (
              <WritingSection 
                currentQuestion={currentQuestion}
                onAnswerChange={handleAnswerChange}
                answers={answers}
              />
            )}
          </div>
        </div>

        <div className="test-sidebar">
          <div className="notes-panel">
            <h4>Notes</h4>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Take notes here..."
              className="notes-textarea"
            />
          </div>

          <div className="navigation-panel">
            <h4>Question Navigation</h4>
            <div className="question-grid">
              {Array.from({ length: currentSectionData.questions }, (_, i) => (
                <button
                  key={i + 1}
                  className={`question-nav-btn ${
                    currentQuestion === i + 1 ? 'current' : ''
                  } ${
                    answers[`${currentSection}_${i + 1}`] ? 'answered' : ''
                  }`}
                  onClick={() => setCurrentQuestion(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Test Footer */}
      <div className="test-footer">
        <div className="footer-left">
          <button 
            className="btn"
            disabled={currentQuestion === 1}
            onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
          >
            Previous
          </button>
        </div>
        
        <div className="footer-center">
          <button 
            className="btn btn-outline"
            onClick={() => {
              if (confirm('Are you sure you want to end this section?')) {
                handleNextSection();
              }
            }}
          >
            End Section
          </button>
        </div>
        
        <div className="footer-right">
          <button 
            className="btn btn-primary"
            onClick={() => {
              if (currentQuestion < currentSectionData.questions) {
                setCurrentQuestion(prev => prev + 1);
              } else {
                handleNextSection();
              }
            }}
          >
            {currentQuestion < currentSectionData.questions ? 'Next' : 'Next Section'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Component for Listening Section
function ListeningSection({ 
  currentQuestion, 
  onAnswerChange, 
  answers 
}: { 
  currentQuestion: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  answers: Record<string, string>;
}) {
  const questionId = `listening_${currentQuestion}`;
  
  return (
    <div className="listening-section">
      <div className="audio-player">
        <div className="audio-controls">
          <button className="play-btn">▶</button>
          <div className="audio-progress">
            <div className="progress-bar"></div>
          </div>
          <span className="audio-time">0:00 / 2:30</span>
        </div>
        <div className="audio-info">
          Part 1: Questions 1-10 - Conversation about booking a hotel room
        </div>
      </div>
      
      <div className="question-content">
        <h3>Question {currentQuestion}</h3>
        <div className="question-text">
          Complete the notes below. Write NO MORE THAN TWO WORDS for each answer.
        </div>
        
        <div className="question-form">
          <div className="form-completion">
            <p>Hotel Booking Details</p>
            <div className="completion-item">
              Name: John {currentQuestion === 1 && (
                <input 
                  type="text"
                  className="completion-input"
                  value={answers[questionId] || ''}
                  onChange={(e) => onAnswerChange(questionId, e.target.value)}
                  placeholder="Answer"
                />
              )}
              {currentQuestion !== 1 && <span className="blank-line">________________</span>}
            </div>
            <div className="completion-item">
              Room type: {currentQuestion === 2 && (
                <input 
                  type="text"
                  className="completion-input"
                  value={answers[questionId] || ''}
                  onChange={(e) => onAnswerChange(questionId, e.target.value)}
                  placeholder="Answer"
                />
              )}
              {currentQuestion !== 2 && <span className="blank-line">________________</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Reading Section  
function ReadingSection({ 
  currentQuestion, 
  onAnswerChange, 
  answers 
}: { 
  currentQuestion: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  answers: Record<string, string>;
}) {
  const questionId = `reading_${currentQuestion}`;
  
  return (
    <div className="reading-section">
      <div className="reading-passage">
        <h3>Reading Passage 1</h3>
        <div className="passage-content">
          <h4>The History of Urban Planning</h4>
          <p>
            Urban planning is a complex process that involves the design and organization of urban space to create 
            sustainable, functional, and aesthetically pleasing cities. The practice of urban planning has evolved 
            significantly over the centuries, from ancient civilizations to modern metropolises.
          </p>
          <p>
            In ancient times, cities were often planned around religious or administrative centers. The Greeks and 
            Romans developed sophisticated urban planning techniques, including grid systems and public spaces that 
            influenced city design for centuries to come.
          </p>
        </div>
      </div>
      
      <div className="question-content">
        <h3>Questions 1-5</h3>
        <div className="question-text">
          Choose the correct answer A, B, or C.
        </div>
        
        <div className="question-item">
          <p><strong>{currentQuestion}.</strong> According to the passage, urban planning is primarily concerned with:</p>
          <div className="multiple-choice">
            {['Creating sustainable cities', 'Religious centers', 'Ancient civilizations'].map((option, index) => (
              <label key={index} className="choice-option">
                <input 
                  type="radio"
                  name={questionId}
                  value={String.fromCharCode(65 + index)}
                  checked={answers[questionId] === String.fromCharCode(65 + index)}
                  onChange={(e) => onAnswerChange(questionId, e.target.value)}
                />
                <span className="choice-letter">{String.fromCharCode(65 + index)}</span>
                {option}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for Writing Section
function WritingSection({ 
  currentQuestion, 
  onAnswerChange, 
  answers 
}: { 
  currentQuestion: number;
  onAnswerChange: (questionId: string, answer: string) => void;
  answers: Record<string, string>;
}) {
  const questionId = `writing_${currentQuestion}`;
  const isTask1 = currentQuestion === 1;
  
  return (
    <div className="writing-section">
      <div className="writing-task">
        <h3>Writing Task {currentQuestion}</h3>
        <div className="task-info">
          <div className="task-requirements">
            {isTask1 ? (
              <>
                <p><strong>Time:</strong> 20 minutes</p>
                <p><strong>Words:</strong> at least 150 words</p>
                <p><strong>Task type:</strong> Letter writing</p>
              </>
            ) : (
              <>
                <p><strong>Time:</strong> 40 minutes</p>
                <p><strong>Words:</strong> at least 250 words</p>
                <p><strong>Task type:</strong> Essay writing</p>
              </>
            )}
          </div>
        </div>
        
        <div className="task-prompt">
          {isTask1 ? (
            <div>
              <p>You recently bought a piece of equipment for your kitchen but it did not work. You phoned the shop but no action was taken.</p>
              <p>Write a letter to the shop manager. In your letter:</p>
              <ul>
                <li>describe the problem with the equipment</li>
                <li>explain what happened when you phoned the shop</li>
                <li>say what you would like the manager to do</li>
              </ul>
            </div>
          ) : (
            <div>
              <p>Some people think that all teenagers should be required to do unpaid work in their free time to help the local community.</p>
              <p>To what extent do you agree or disagree with this statement?</p>
              <p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="writing-editor">
        <div className="editor-toolbar">
          <div className="word-count">
            Word count: {(answers[questionId] || '').split(' ').filter(word => word.length > 0).length}
          </div>
          <div className="editor-tools">
            <button className="tool-btn">Bold</button>
            <button className="tool-btn">Italic</button>
            <button className="tool-btn">Underline</button>
          </div>
        </div>
        <textarea 
          className="writing-textarea"
          value={answers[questionId] || ''}
          onChange={(e) => onAnswerChange(questionId, e.target.value)}
          placeholder="Start writing your response here..."
        />
      </div>
    </div>
  );
}