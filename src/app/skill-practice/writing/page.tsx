// src/app/skill-practice/writing/page.tsx

"use client";

import Link from 'next/link';

export default function WritingPracticePage() {
  const writingTasks = [
    {
      id: 'task1',
      title: 'Writing Task 1',
      subtitle: 'Academic Writing - Data Analysis',
      description: 'Describe visual information (graphs, charts, diagrams) in 150+ words',
      timeLimit: '20 minutes',
      icon: '📊',
      difficulty: 'Intermediate',
      link: '/skill-practice/writing/task1'
    },
    {
      id: 'task2', 
      title: 'Writing Task 2',
      subtitle: 'Academic Writing - Essay',
      description: 'Write an argumentative essay on a given topic in 250+ words',
      timeLimit: '40 minutes',
      icon: '📝',
      difficulty: 'Advanced',
      link: '/skill-practice/writing/task2'
    }
  ];

  return (
    <div className="container" style={{ maxWidth: '900px', margin: '50px auto' }}>
      <div className="writing-hero">
        <h1>IELTS Writing Practice</h1>
        <p>Master both tasks with AI-powered feedback and detailed scoring analysis</p>
      </div>

      <div className="writing-tasks-grid">
        {writingTasks.map((task) => (
          <div key={task.id} className="writing-task-card">
            <div className="task-header">
              <div className="task-icon">{task.icon}</div>
              <div className="task-info">
                <h3>{task.title}</h3>
                <p className="task-subtitle">{task.subtitle}</p>
              </div>
              <div className="difficulty-badge">
                {task.difficulty}
              </div>
            </div>

            <div className="task-details">
              <p className="task-description">{task.description}</p>
              
              <div className="task-specs">
                <div className="spec-item">
                  <span className="spec-icon">⏱️</span>
                  <span>Time: {task.timeLimit}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">🎯</span>
                  <span>AI Evaluation</span>
                </div>
                <div className="spec-item">
                  <span className="spec-icon">📈</span>
                  <span>Band Scoring</span>
                </div>
              </div>
            </div>

            <div className="task-footer">
              <Link href={task.link} className="btn btn-primary task-btn">
                Start {task.title}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="writing-features">
        <h2>What You&apos;ll Get:</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>AI-Powered Analysis</h4>
            <p>Comprehensive evaluation using GPT-4 for accurate IELTS scoring</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h4>Detailed Band Scores</h4>
            <p>Individual scores for Task Achievement, Coherence, Lexical Resource, Grammar</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💡</div>
            <h4>Improvement Guide</h4>
            <p>Specific suggestions to reach your target band score</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Instant Feedback</h4>
            <p>Get your results immediately after submission</p>
          </div>
        </div>
      </div>
    </div>
  );
}