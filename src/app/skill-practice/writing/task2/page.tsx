// src/app/skill-practice/writing/task2/page.tsx

"use client";

import { useState, useRef, useEffect } from 'react';

interface WritingFeedback {
  overallScore: number;
  targetScore: number;
  scores: {
    taskResponse: number;
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

export default function WritingTask2Page() {
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [text, setText] = useState('');
  const [feedback, setFeedback] = useState<WritingFeedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Sample Task 2 questions (rotate randomly)
  const task2Questions = [
    {
      title: "Technology and Education",
      prompt: `Some people believe that technology has made learning easier and more accessible, while others think it has created more distractions and reduced the quality of education.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`
    },
    {
      title: "Work-Life Balance",
      prompt: `Many people nowadays work longer hours and have less free time than previous generations.

What are the causes of this trend, and what effects does it have on individuals and society?

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`
    },
    {
      title: "Environmental Protection",
      prompt: `Some people think that environmental problems should be solved by the government, while others believe that individuals are responsible.

Discuss both views and give your own opinion.

Give reasons for your answer and include any relevant examples from your own knowledge or experience.

Write at least 250 words.`
    }
  ];

  const [currentQuestion] = useState(task2Questions[Math.floor(Math.random() * task2Questions.length)]);

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
    if (text.trim().length < 200) {
      alert('Please write at least 200 words before submitting.');
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
          task: 'task2',
          text: text,
          question: currentQuestion.prompt
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
      <div className="container" style={{ maxWidth: '800px', margin: '50px auto' }}>
        <div className="writing-instructions">
          <h1>📝 IELTS Writing Task 2 - Essay Practice</h1>
          
          <div className="task-overview">
            <h3>Task Overview:</h3>
            <ul>
              <li>⏱️ <strong>Time:</strong> 40 minutes</li>
              <li>📏 <strong>Word count:</strong> At least 250 words</li>
              <li>📝 <strong>Task:</strong> Write an argumentative essay</li>
              <li>🎯 <strong>Focus:</strong> Clear position, well-developed arguments, examples</li>
            </ul>
          </div>

          <div className="essay-structure">
            <h3>📋 Essay Structure Guide:</h3>
            <div className="structure-steps">
              <div className="structure-step">
                <h4>1. Introduction (50 words)</h4>
                <p>• Paraphrase the question<br/>• State your thesis/position</p>
              </div>
              <div className="structure-step">
                <h4>2. Body Paragraph 1 (80 words)</h4>
                <p>• First main argument<br/>• Supporting evidence/example</p>
              </div>
              <div className="structure-step">
                <h4>3. Body Paragraph 2 (80 words)</h4>
                <p>• Second main argument<br/>• Supporting evidence/example</p>
              </div>
              <div className="structure-step">
                <h4>4. Conclusion (40 words)</h4>
                <p>• Summarize main points<br/>• Restate your position</p>
              </div>
            </div>
          </div>

          <div className="scoring-criteria">
            <h3>Scoring Criteria:</h3>
            <div className="criteria-grid">
              <div className="criteria-item">
                <h4>Task Response (25%)</h4>
                <p>How well you answer the question and develop your arguments</p>
              </div>
              <div className="criteria-item">
                <h4>Coherence & Cohesion (25%)</h4>
                <p>Organization, paragraphing, and linking ideas</p>
              </div>
              <div className="criteria-item">
                <h4>Lexical Resource (25%)</h4>
                <p>Vocabulary range, accuracy, and appropriateness</p>
              </div>
              <div className="criteria-item">
                <h4>Grammatical Range (25%)</h4>
                <p>Grammar variety, accuracy, and complexity</p>
              </div>
            </div>
          </div>

          <div className="writing-tips">
            <h3>💡 Quick Tips:</h3>
            <ul>
              <li>Plan your essay (5 minutes) before you start writing</li>
              <li>Use topic sentences to start each paragraph</li>
              <li>Support your points with specific examples</li>
              <li>Use a variety of linking words and phrases</li>
              <li>Leave time to review and edit (5 minutes)</li>
            </ul>
          </div>

          <button onClick={startWriting} className="btn btn-primary start-writing-btn">
            🚀 Start Writing Task 2
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="writing-practice-container">
      {/* Header with timer */}
      <div className="writing-header">
        <div className="task-info">
          <h2>Writing Task 2 - {currentQuestion.title}</h2>
          <div className="task-stats">
            <span className="word-count">Words: {wordCount}/250</span>
            <span className="timer">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="writing-workspace">
        {/* Question Panel */}
        <div className="question-panel">
          <div className="question-content">
            <h3>Essay Question:</h3>
            <div className="task-prompt">
              {currentQuestion.prompt.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            
            <div className="quick-planner">
              <h4>📝 Quick Planning Space:</h4>
              <div className="planner-sections">
                <div className="planner-item">
                  <strong>Position:</strong>
                  <div className="planner-box"></div>
                </div>
                <div className="planner-item">
                  <strong>Main Arguments:</strong>
                  <div className="planner-box"></div>
                </div>
                <div className="planner-item">
                  <strong>Examples:</strong>
                  <div className="planner-box"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Writing Panel */}
        <div className="writing-panel">
          {!feedback ? (
            <div className="writing-area">
              <h3>Your Essay:</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Begin your essay here... 

Example structure:
Introduction: In today's digital age, the role of technology in education has become a topic of significant debate...

Body Paragraph 1: On one hand, proponents of educational technology argue that...

Body Paragraph 2: However, critics contend that...

Conclusion: In conclusion, while technology offers valuable opportunities..."
                className="writing-textarea essay-textarea"
                disabled={isAnalyzing}
              />
              
              <div className="writing-actions">
                <button 
                  onClick={submitForAnalysis}
                  className="btn btn-primary submit-btn"
                  disabled={isAnalyzing || wordCount < 200}
                >
                  {isAnalyzing ? (
                    <>🧠 Analyzing your essay...</>
                  ) : (
                    <>📊 Get AI Feedback</>
                  )}
                </button>
                {wordCount < 250 && (
                  <small className="word-warning">
                    ⚠️ Minimum 250 words recommended
                  </small>
                )}
              </div>
            </div>
          ) : (
            <div className="writing-feedback">
              <h3>🎉 Your Essay Analysis</h3>
              
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
                    <span className="score-category">Task Response</span>
                    <span className="score-value">{feedback.scores.taskResponse}</span>
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
                  🔄 Try New Topic
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
  );
}