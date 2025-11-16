'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { useTestMode } from '@/contexts/TestModeContext';

interface Test {
  id: string;
  code: string;
  name: string;
  description: string;
  total_duration: number;
}

interface MockTest {
  id: string;
  test_id: string;
  title: string;
  difficulty_level: string;
  is_active: boolean;
}

interface TestSection {
  id: string;
  mock_test_id: string;
  section_type: string;
  section_title: string;
  duration: number;
  total_questions: number;
  section_order: number;
  instructions: string;
}

interface Question {
  id: string;
  section_id: string;
  question_number: number;
  question_type: string;
  question_text: string;
  audio_url?: string;
  passage_text?: string;
  options?: Record<string, string>;
  correct_answer: string;
  points: number;
}

interface DynamicMockTestProps {
  testCode?: string; // Optional test code to filter by
}

export default function DynamicMockTest({ testCode }: DynamicMockTestProps) {
  const router = useRouter();
  const { selectedTest } = useTestMode();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Data state
  const [test, setTest] = useState<Test | null>(null);
  const [mockTests, setMockTests] = useState<MockTest[]>([]);
  const [selectedMockTest, setSelectedMockTest] = useState<MockTest | null>(null);
  const [sections, setSections] = useState<TestSection[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  
  // Test state
  const [currentSection, setCurrentSection] = useState<string>('');
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isStarted, setIsStarted] = useState(false);

  // Determine which test to load
  const effectiveTestCode = testCode || selectedTest?.name || 'IELTS';
  
  console.log('DynamicMockTest props:', { testCode, selectedTestName: selectedTest?.name, effectiveTestCode });

  useEffect(() => {
    loadTestData();
  }, [effectiveTestCode]);

  const loadTestData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading test data for:', effectiveTestCode);
      
      // 1. Get test by code
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .select('*')
        .eq('code', effectiveTestCode)
        .single();

      console.log('Supabase test query result:', { testData, testError });

      if (testError || !testData) {
        console.error('Test query error:', testError);
        throw new Error(`Test not found: ${effectiveTestCode}. Error: ${testError?.message || 'Unknown error'}`);
      }

      setTest(testData);

      // 2. Get mock tests for this test
      const { data: mockTestsData, error: mockTestsError } = await supabase
        .from('mock_tests')
        .select('*')
        .eq('test_id', testData.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (mockTestsError) {
        throw new Error('Failed to load mock tests');
      }

      setMockTests(mockTestsData || []);
      
      // Auto-select first mock test
      if (mockTestsData && mockTestsData.length > 0) {
        setSelectedMockTest(mockTestsData[0]);
        await loadMockTestData(mockTestsData[0].id);
      }

    } catch (err) {
      console.error('Error loading test data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load test data');
    } finally {
      setLoading(false);
    }
  };

  const loadMockTestData = async (mockTestId: string) => {
    try {
      // Get sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('test_sections')
        .select('*')
        .eq('mock_test_id', mockTestId)
        .order('section_order', { ascending: true });

      if (sectionsError) {
        throw new Error('Failed to load test sections');
      }

      setSections(sectionsData || []);
      
      if (sectionsData && sectionsData.length > 0) {
        setCurrentSection(sectionsData[0].section_type);
        
        // Get questions for all sections
        const sectionIds = sectionsData.map(s => s.id);
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .in('section_id', sectionIds)
          .order('question_number', { ascending: true });

        if (questionsError) {
          throw new Error('Failed to load questions');
        }

        setQuestions(questionsData || []);
      }

    } catch (err) {
      console.error('Error loading mock test data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load mock test data');
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const getCurrentSectionData = () => {
    return sections.find(s => s.section_type === currentSection);
  };

  const getCurrentQuestions = () => {
    const sectionData = getCurrentSectionData();
    if (!sectionData) return [];
    return questions.filter(q => q.section_id === sectionData.id);
  };

  const handleStartTest = () => {
    setIsStarted(true);
  };

  const handleNextSection = () => {
    const currentIndex = sections.findIndex(s => s.section_type === currentSection);
    if (currentIndex < sections.length - 1) {
      setCurrentSection(sections[currentIndex + 1].section_type);
      setCurrentQuestion(1);
    } else {
      // Test completed
      alert('Test completed! Results will be available soon.');
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="page-container" style={{ 
        paddingTop: '100px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh'
      }}>
        <div>Loading {effectiveTestCode} mock test...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container" style={{ paddingTop: '100px' }}>
        <div className="container container-narrow">
          <div className="error-card" style={{
            background: 'var(--bg-secondary)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2>Error Loading Test</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              {error}
            </p>
            <button 
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!test || !selectedMockTest || sections.length === 0) {
    return (
      <div className="page-container" style={{ paddingTop: '100px' }}>
        <div className="container container-narrow">
          <div className="empty-state" style={{
            background: 'var(--bg-secondary)',
            padding: '40px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h2>No Mock Tests Available</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Mock tests for {effectiveTestCode} are not yet available. Check back later!
            </p>
            <button 
              onClick={() => router.push('/get-started')}
              className="btn btn-primary"
            >
              Browse Other Tests
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="page-container" style={{ paddingTop: '100px', paddingBottom: '50px' }}>
        <div className="container container-narrow">
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <h1>{selectedMockTest.title}</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem' }}>
                {test.description}
              </p>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '24px',
                marginTop: '16px',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)'
              }}>
                <span>⏱️ {test.total_duration} minutes</span>
                <span>📝 {sections.reduce((sum, s) => sum + s.total_questions, 0)} questions</span>
                <span>📊 {selectedMockTest.difficulty_level}</span>
              </div>
            </div>

            <div className="test-overview">
              <h2 style={{ marginBottom: '24px' }}>Test Sections</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {sections.map((section, index) => (
                  <div 
                    key={section.id}
                    style={{
                      background: 'var(--bg-secondary)',
                      padding: '20px',
                      borderRadius: '8px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <h3 style={{ marginBottom: '4px' }}>
                        {index + 1}. {section.section_title}
                      </h3>
                      <p style={{ 
                        color: 'var(--text-secondary)', 
                        fontSize: '0.9rem',
                        margin: 0
                      }}>
                        {section.instructions}
                      </p>
                    </div>
                    <div style={{ 
                      textAlign: 'right', 
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <div>{section.duration} min</div>
                      <div>{section.total_questions} questions</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ 
              textAlign: 'center', 
              marginTop: '40px',
              padding: '24px',
              background: 'var(--bg-secondary)',
              borderRadius: '8px'
            }}>
              <h3 style={{ marginBottom: '16px' }}>Ready to Begin?</h3>
              <p style={{ 
                color: 'var(--text-secondary)', 
                marginBottom: '24px',
                fontSize: '0.9rem'
              }}>
                Make sure you have a stable internet connection and a quiet environment.
                The test will start immediately when you click the button below.
              </p>
              <button 
                onClick={handleStartTest}
                className="btn btn-primary"
                style={{ fontSize: '1.1rem', padding: '12px 32px' }}
              >
                Start {test.name} Test
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render test interface (simplified for now)
  const currentSectionData = getCurrentSectionData();
  const currentQuestions = getCurrentQuestions();
  const currentQuestionData = currentQuestions[currentQuestion - 1];

  return (
    <div className="mock-test-interface">
      <div className="test-header" style={{
        background: 'white',
        borderBottom: '1px solid var(--border-color)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem' }}>
              {currentSectionData?.section_title}
            </h2>
            <p style={{ 
              margin: 0, 
              color: 'var(--text-secondary)',
              fontSize: '0.875rem'
            }}>
              Question {currentQuestion} of {currentQuestions.length}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>
              Section Time: {currentSectionData?.duration}:00
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Total: {test.total_duration} minutes
            </div>
          </div>
        </div>
      </div>

      <div className="test-content" style={{ padding: '40px 0' }}>
        <div className="container">
          {currentQuestionData ? (
            <div className="question-content">
              <h3 style={{ marginBottom: '16px' }}>
                Question {currentQuestionData.question_number}
              </h3>
              
              {currentQuestionData.passage_text && (
                <div style={{
                  background: 'var(--bg-secondary)',
                  padding: '24px',
                  borderRadius: '8px',
                  marginBottom: '24px'
                }}>
                  <div dangerouslySetInnerHTML={{ 
                    __html: currentQuestionData.passage_text 
                  }} />
                </div>
              )}

              <div style={{ marginBottom: '24px' }}>
                <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                  {currentQuestionData.question_text}
                </p>

                {currentQuestionData.question_type === 'multiple_choice' && currentQuestionData.options && (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {Object.entries(currentQuestionData.options).map(([key, value]) => (
                      <label 
                        key={key}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          border: '1px solid var(--border-color)',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          background: answers[currentQuestionData.id] === key ? 'var(--bg-active)' : 'white'
                        }}
                      >
                        <input 
                          type="radio"
                          name={currentQuestionData.id}
                          value={key}
                          checked={answers[currentQuestionData.id] === key}
                          onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                        />
                        <span style={{ fontWeight: '600' }}>{key})</span>
                        <span>{value}</span>
                      </label>
                    ))}
                  </div>
                )}

                {currentQuestionData.question_type === 'fill_blank' && (
                  <input 
                    type="text"
                    className="text-input"
                    value={answers[currentQuestionData.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                    placeholder="Enter your answer"
                    style={{ width: '100%', maxWidth: '400px' }}
                  />
                )}

                {currentQuestionData.question_type === 'essay' && (
                  <textarea 
                    className="text-input"
                    value={answers[currentQuestionData.id] || ''}
                    onChange={(e) => handleAnswerChange(currentQuestionData.id, e.target.value)}
                    placeholder="Write your response here..."
                    rows={10}
                    style={{ width: '100%', minHeight: '200px' }}
                  />
                )}
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginTop: '40px'
              }}>
                <button 
                  className="btn"
                  disabled={currentQuestion === 1}
                  onClick={() => setCurrentQuestion(prev => Math.max(1, prev - 1))}
                >
                  Previous
                </button>
                
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    if (currentQuestion < currentQuestions.length) {
                      setCurrentQuestion(prev => prev + 1);
                    } else {
                      handleNextSection();
                    }
                  }}
                >
                  {currentQuestion < currentQuestions.length ? 'Next' : 'Next Section'}
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
              <h3>No questions available for this section</h3>
              <button 
                className="btn btn-primary"
                onClick={handleNextSection}
              >
                Continue to Next Section
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}