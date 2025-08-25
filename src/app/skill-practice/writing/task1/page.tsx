// src/app/skill-practice/writing/task1/page.tsx

"use client";

import { useState, useRef, useEffect } from 'react';
import AuthProtection from '@/components/AuthProtection';

interface WritingFeedback {
  overallScore: number;
  targetScore: number;
  scores: {
    taskAchievement: number;
    coherenceCohesion: number;
    lexicalResource: number;
    grammaticalRange: number;
  };
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
    taskResponse: string;
    organization: string;
    vocabulary: string;
    grammar: string;
  };
  wordCount: number;
  suggestedRevisions: string[];
}

export default function WritingTask1Page() {
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample Task 1 question
  const task1Question = {
    title: "Line Graph Analysis",
    prompt: `The graph below shows the number of tourists visiting a particular Caribbean island between 2010 and 2017.

Summarise the information by selecting and reporting the main features, and make comparisons where relevant.

Write at least 150 words.`,
    imageUrl: "/api/placeholder/600/400" // We'll add chart images later
  };

  // Timer logic
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const startWriting = () => {
    setShowInstructions(false);
    setIsActive(true);
  };

  const submitForAnalysis = async () => {
    if (text.trim().length < 100) {
      alert('Please write at least 100 words before submitting.');
      return;
    }

    setIsAnalyzing(true);
    setIsActive(false);

    try {
      const response = await fetch('/api/writing-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: 'task1',
          text: text,
          question: task1Question.prompt
        }),
      });

      if (!response.ok) {
        throw new Error(`Analysis failed: ${response.status}`);
      }

      const feedbackData: WritingFeedback = await response.json();
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Writing analysis error:', error);
      alert('Failed to analyze your writing. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;

  if (showInstructions) {
    return (
      <div className="container" style={{ margin: '50px auto' }}>
        <div className="writing-instructions">
          <h1>📊 IELTS Writing Task 1 - Practice</h1>
          
          <div className="task-overview">
            <h3>Task Overview:</h3>
            <ul>
              <li>⏱️ <strong>Time:</strong> 20 minutes</li>
              <li>📏 <strong>Word count:</strong> At least 150 words</li>
              <li>📊 <strong>Task:</strong> Describe visual data (graph, chart, diagram)</li>
              <li>🎯 <strong>Focus:</strong> Accuracy, clarity, and data interpretation</li>
            </ul>
          </div>

          <div className="scoring-criteria">
            <h3>Scoring Criteria:</h3>
            <div className="criteria-grid">
              <div className="criteria-item">
                <h4>Task Achievement (25%)</h4>
                <p>How well you address the task requirements and present key features</p>
              </div>
              <div className="criteria-item">
                <h4>Coherence & Cohesion (25%)</h4>
                <p>Organization and logical flow of ideas</p>
              </div>
              <div className="criteria-item">
                <h4>Lexical Resource (25%)</h4>
                <p>Vocabulary range and accuracy</p>
              </div>
              <div className="criteria-item">
                <h4>Grammatical Range (25%)</h4>
                <p>Grammar variety and accuracy</p>
              </div>
            </div>
          </div>

          <div className="writing-tips">
            <h3>💡 Quick Tips:</h3>
            <ul>
              <li>Start with an overview of the main trends</li>
              <li>Use specific data points to support your description</li>
              <li>Compare and contrast different elements</li>
              <li>Use varied vocabulary for describing trends</li>
              <li>Don&apos;t give opinions - just describe what you see</li>
            </ul>
          </div>

          <button onClick={startWriting} className="btn btn-primary start-writing-btn">
            🚀 Start Writing Task 1
          </button>
        </div>
      </div>
    );
  }

  return (
    <AuthProtection feature="writing practice">
      <div className="writing-practice-container">
        {/* Header with timer */}
        <div className="writing-header">
          <div className="task-info">
            <h2>Writing Task 1 - {task1Question.title}</h2>
            <div className="task-stats">
              <span className="word-count">Words: {wordCount}/150</span>
              <span className="timer">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        <div className="writing-workspace">
          {/* Question Panel */}
          <div className="question-panel">
            <div className="question-content">
              <h3>Question:</h3>
              <div className="task-prompt">
                {task1Question.prompt.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              
              {/* Placeholder for chart image */}
              <div className="chart-placeholder">
                <div className="chart-icon">📈</div>
                <p>Chart/Graph would appear here</p>
                <small>Sample data visualization</small>
              </div>
            </div>
          </div>

          {/* Writing Panel */}
          <div className="writing-panel">
            {!feedback ? (
              <div className="writing-area">
                <h3>Your Response:</h3>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Begin your response here... 

Example start:
The line graph illustrates the number of tourists visiting a Caribbean island over a seven-year period from 2010 to 2017..."
                  className="writing-textarea"
                  disabled={isAnalyzing}
                />
                
                <div className="writing-actions">
                  <button 
                    onClick={submitForAnalysis}
                    className="btn btn-primary submit-btn"
                    disabled={isAnalyzing || wordCount < 100}
                  >
                    {isAnalyzing ? (
                      <>🧠 Analyzing your writing...</>
                    ) : (
                      <>📊 Get AI Feedback</>
                    )}
                  </button>
                  {wordCount < 150 && (
                    <small className="word-warning">
                      ⚠️ Minimum 150 words recommended
                    </small>
                  )}
                </div>
              </div>
            ) : (
              <div className="writing-feedback">
                <h3>🎉 Your Writing Analysis</h3>
                
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
                      <span className="score-category">Task Achievement</span>
                      <span className="score-value">{feedback.scores.taskAchievement}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-category">Coherence & Cohesion</span>
                      <span className="score-value">{feedback.scores.coherenceCohesion}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-category">Lexical Resource</span>
                      <span className="score-value">{feedback.scores.lexicalResource}</span>
                    </div>
                    <div className="score-item">
                      <span className="score-category">Grammar Range</span>
                      <span className="score-value">{feedback.scores.grammaticalRange}</span>
                    </div>
                  </div>
                </div>

                {/* Next Level Guide */}
                {feedback.nextLevelGuide && (
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
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button 
                    onClick={() => window.location.reload()} 
                    className="btn btn-outline"
                    style={{ width: '48%' }}
                  >
                    🔄 Try Another Task
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
      </div>
    </AuthProtection>
  );
}