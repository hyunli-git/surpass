"use client";

import { useEffect, useMemo, useState } from "react";
import { promptManager } from "@/utils/promptManager";

type TaskKey = "task1" | "task2";

const GT_TASKS: Record< TaskKey, { title: string; instructions: string; targetWords: number } > = {
  task1: {
    title: "General Training – Writing Task 1 (Letter)",
    targetWords: 150,
    instructions:
      `You recently bought a kitchen appliance but it does not work properly.\n\n` +
      `Write a letter to the shop manager. In your letter:\n` +
      `• describe the problem with the appliance\n` +
      `• explain what happened when you contacted the shop\n` +
      `• state what you would like the manager to do\n\n` +
      `Write at least 150 words. Use an appropriate tone (formal).`,
  },
  task2: {
    title: "General Training – Writing Task 2 (Essay)",
    targetWords: 250,
    instructions:
      `Some people think governments should invest more in public transport than building new roads.\n` +
      `To what extent do you agree or disagree?\n\n` +
      `Give reasons for your answer and include relevant examples from your own knowledge or experience.\n` +
      `Write at least 250 words. Maintain a formal, academic style.`,
  },
};

export default function IeltsGTWritingPracticePage() {
  const [task, setTask] = useState<TaskKey>("task1");
  const [text, setText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [band, setBand] = useState<number>(9);
  const [sample, setSample] = useState<null | { response: string; justification?: string }>(null);
  const [tips, setTips] = useState<string[]>([]);
  const [genLoading, setGenLoading] = useState(false);

  const target = GT_TASKS[task].targetWords;
  const words = useMemo(() => text.trim().split(/\s+/).filter(Boolean).length, [text]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const startOrPause = () => setRunning((r) => !r);
  const resetTimer = () => { setRunning(false); setSeconds(0); };

  const submitForFeedback = async () => {
    if (text.trim().length < 10) return;
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/feedback/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: text,
          testType: "ielts",
          taskType: task === "task1" ? "GT-Task1" : "GT-Task2",
          prompt: GT_TASKS[task].instructions,
          targetWordCount: GT_TASKS[task].targetWords,
          timeSpent: seconds,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setResult(json.feedback);
        // Scroll to feedback section after a short delay
        setTimeout(() => {
          const feedbackElement = document.querySelector('.feedback-section');
          if (feedbackElement) {
            feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        setResult({ error: json.error || "Failed to analyze" });
      }
    } catch (e) {
      setResult({ error: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2, "0")}`;

  // Load sample answer + tips for selected band and task from DB (scoring_examples, score_benchmarks)
  useEffect(() => {
    const load = async () => {
      try {
        const partName = task;
        const examples = await promptManager.getScoringExamples('IELTS', 'writing', partName, [band]);
        const benchmarks = await promptManager.getScoreBenchmarks('IELTS', 'writing', partName);
        const ex = examples?.[0];
        setSample(ex ? { response: ex.example_response, justification: ex.score_justification } : null);
        // Aggregate improvement tips for the chosen band level
        const levelTips = (benchmarks || [])
          .filter(b => b.score_level === band)
          .flatMap(b => Array.isArray(b.improvement_tips) ? b.improvement_tips : [])
          .slice(0, 8);
        setTips(levelTips);
      } catch (e) {
        setSample(null);
        setTips([]);
      }
    };
    load();
  }, [task, band]);

  const generateSampleFromMyAnswer = async (targetBand?: number) => {
    if (text.trim().length < 10) return;
    setGenLoading(true);
    const bandToUse = targetBand || band;
    try {
      const res = await fetch('/api/writing/sample', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response: text, band: bandToUse, task, prompt: GT_TASKS[task].instructions }),
      });
      const json = await res.json();
      if (json.success && json.sample) {
        setSample({ response: json.sample });
        // Scroll to sample section after a short delay
        setTimeout(() => {
          const sampleElement = document.querySelector('.sample-section');
          if (sampleElement) {
            sampleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      }
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: "50px", paddingBottom: "50px", width: "100%", maxWidth: "none" }}>
      <section className="hero">
        <div className="container">
          <h1>IELTS General Training – Writing Practice</h1>
          <p>Choose Task 1 or Task 2, write your response, and get instant AI feedback.</p>
        </div>
      </section>

      <section className="practice-section">
        <div className="container">
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div className="filter-pills" style={{ marginBottom: 16 }}>
              <button className={`filter-pill ${task === "task1" ? "active" : ""}`} onClick={() => setTask("task1")}>Task 1 – Letter</button>
              <button className={`filter-pill ${task === "task2" ? "active" : ""}`} onClick={() => setTask("task2")}>Task 2 – Essay</button>
            </div>

            <div className="task-prompt" style={{ whiteSpace: "pre-wrap" }}>
              <h3 style={{ marginTop: 0 }}>{GT_TASKS[task].title}</h3>
              {GT_TASKS[task].instructions}
            </div>

            <div className="editor-toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "12px 0" }}>
              <div className="word-count">Words: {words} / {target}</div>
              <div className="timer">Time: {fmt(seconds)}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn" onClick={startOrPause}>{running ? "Pause" : "Start"}</button>
                <button className="btn" onClick={resetTimer}>Reset</button>
              </div>
            </div>

            <textarea
              className="writing-textarea"
              style={{ minHeight: 400, width: '100%' }}
              placeholder={task === "task1" ? "Write your formal letter here…" : "Write your essay here…"}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
              <button className="btn btn-primary" disabled={submitting || text.trim().length < 10} onClick={submitForFeedback}>
                {submitting ? "Analyzing…" : "Get AI Feedback"}
              </button>
              <button className="btn" onClick={() => setText("")}>Clear</button>
            </div>

            {/* Improvement Tabs */}
            {text.trim().length >= 10 && (
              <div style={{ marginTop: "24px" }}>
                <h4 style={{ marginBottom: "16px", color: "var(--text-primary)" }}>Show My Text Improved to Band Level</h4>
                <div className="filter-pills" style={{ marginBottom: "16px" }}>
                  {[6, 7, 8, 9].map((bandLevel) => (
                    <button
                      key={bandLevel}
                      className={`filter-pill ${band === bandLevel ? 'active' : ''}`}
                      onClick={() => {
                        setBand(bandLevel);
                        generateSampleFromMyAnswer(bandLevel);
                      }}
                      disabled={genLoading}
                    >
                      {genLoading && band === bandLevel ? `Improving to Band ${bandLevel}...` : `Improve to Band ${bandLevel}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Improved Text Section - appears when generated */}
            {sample && sample.response && (
              <div className="sample-section" style={{ marginTop: "32px", padding: "24px", border: "1px solid var(--border)", borderRadius: "8px", backgroundColor: "var(--bg-tertiary)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--accent-primary)" }}>Your Text Improved to Band {band}</h3>
                
                {/* Before/After Comparison */}
                <div style={{ display: "grid", gap: "20px", marginBottom: "20px" }}>
                  <div>
                    <h4 style={{ marginTop: 0, marginBottom: "8px", fontSize: "14px", color: "var(--text-secondary)" }}>Your Original:</h4>
                    <div style={{ 
                      padding: "16px", 
                      backgroundColor: "var(--bg-secondary)", 
                      borderRadius: "4px", 
                      borderLeft: "4px solid #e74c3c",
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'inherit', 
                      lineHeight: "1.6", 
                      fontSize: "14px",
                      opacity: 0.8
                    }}>
                      {text}
                    </div>
                  </div>
                  
                  <div>
                    <h4 style={{ marginTop: 0, marginBottom: "8px", fontSize: "14px", color: "var(--accent-primary)" }}>Improved Version (Band {band}):</h4>
                    <div style={{ 
                      padding: "16px", 
                      backgroundColor: "var(--bg-primary)", 
                      border: "1px solid var(--accent-primary)",
                      borderRadius: "4px", 
                      borderLeft: "4px solid var(--accent-primary)",
                      whiteSpace: 'pre-wrap', 
                      fontFamily: 'inherit', 
                      lineHeight: "1.6", 
                      fontSize: "16px"
                    }}>
                      {sample.response}
                    </div>
                  </div>
                </div>

                {sample.justification && (
                  <div style={{ marginTop: "16px", padding: "16px", backgroundColor: "var(--bg-secondary)", borderRadius: "4px", borderLeft: "4px solid #27ae60" }}>
                    <h4 style={{ marginTop: 0, marginBottom: "8px", fontSize: "14px", color: "#27ae60" }}>Key Improvements Made:</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: "14px", lineHeight: "1.5" }}>
                      {sample.justification}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Section - appears below the writing area after submission */}
            {result && (
              <div className="feedback-section" style={{ marginTop: "32px", padding: "24px", border: "1px solid var(--border)", borderRadius: "8px", backgroundColor: "var(--bg-secondary)" }}>
                <h3 style={{ marginTop: 0, marginBottom: "24px" }}>Your Feedback Results</h3>
                
                {result?.error ? (
                  <div style={{ padding: "16px", backgroundColor: "var(--accent-red)", color: "white", borderRadius: "4px" }}>
                    <strong>Error:</strong> {result.error}
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: "24px" }}>
                    {/* Overall Score Card */}
                    <div className="test-card" style={{ padding: "20px" }}>
                      <h4 style={{ marginTop: 0, marginBottom: "16px", color: "var(--accent-primary)" }}>Overall Assessment</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "16px" }}>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--accent-primary)" }}>{result.bandScore}</div>
                          <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Band Score</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--accent-primary)" }}>{result.overallScore}</div>
                          <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Overall Score</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <div style={{ fontSize: "24px", fontWeight: "bold", color: "var(--accent-primary)" }}>{result.wordCount}</div>
                          <div style={{ fontSize: "14px", color: "var(--text-secondary)" }}>Word Count</div>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Criteria Breakdown */}
                    <div className="test-card" style={{ padding: "20px" }}>
                      <h4 style={{ marginTop: 0, marginBottom: "16px", color: "var(--accent-primary)" }}>Detailed Criteria Scores</h4>
                      <div style={{ display: "grid", gap: "12px" }}>
                        {result.criteria?.taskResponse && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <span>Task Response</span>
                            <span style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{result.criteria.taskResponse.score}</span>
                          </div>
                        )}
                        {result.criteria?.coherenceCohesion && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <span>Coherence & Cohesion</span>
                            <span style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{result.criteria.coherenceCohesion.score}</span>
                          </div>
                        )}
                        {result.criteria?.lexicalResource && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
                            <span>Lexical Resource</span>
                            <span style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{result.criteria.lexicalResource.score}</span>
                          </div>
                        )}
                        {result.criteria?.grammaticalAccuracy && (
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}>
                            <span>Grammatical Accuracy</span>
                            <span style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{result.criteria.grammaticalAccuracy.score}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Detailed Feedback for each criteria */}
                    {result.criteria && (
                      <div style={{ display: "grid", gap: "16px" }}>
                        {result.criteria.taskResponse?.feedback && (
                          <div className="test-card" style={{ padding: "16px" }}>
                            <h5 style={{ marginTop: 0, color: "var(--accent-primary)" }}>Task Response Feedback</h5>
                            <p style={{ margin: 0, lineHeight: "1.6" }}>{result.criteria.taskResponse.feedback}</p>
                          </div>
                        )}
                        {result.criteria.coherenceCohesion?.feedback && (
                          <div className="test-card" style={{ padding: "16px" }}>
                            <h5 style={{ marginTop: 0, color: "var(--accent-primary)" }}>Coherence & Cohesion Feedback</h5>
                            <p style={{ margin: 0, lineHeight: "1.6" }}>{result.criteria.coherenceCohesion.feedback}</p>
                          </div>
                        )}
                        {result.criteria.lexicalResource?.feedback && (
                          <div className="test-card" style={{ padding: "16px" }}>
                            <h5 style={{ marginTop: 0, color: "var(--accent-primary)" }}>Lexical Resource Feedback</h5>
                            <p style={{ margin: 0, lineHeight: "1.6" }}>{result.criteria.lexicalResource.feedback}</p>
                          </div>
                        )}
                        {result.criteria.grammaticalAccuracy?.feedback && (
                          <div className="test-card" style={{ padding: "16px" }}>
                            <h5 style={{ marginTop: 0, color: "var(--accent-primary)" }}>Grammatical Accuracy Feedback</h5>
                            <p style={{ margin: 0, lineHeight: "1.6" }}>{result.criteria.grammaticalAccuracy.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Overall Suggestions */}
                    {result.suggestions && result.suggestions.length > 0 && (
                      <div className="test-card" style={{ padding: "20px" }}>
                        <h4 style={{ marginTop: 0, marginBottom: "16px", color: "var(--accent-primary)" }}>Improvement Suggestions</h4>
                        <ul style={{ margin: 0, paddingLeft: "20px" }}>
                          {result.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} style={{ marginBottom: "8px", lineHeight: "1.6" }}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            {/* Quick Reference Section - now inline */}
            <div className="test-card" style={{ marginTop: "32px", padding: "20px" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0 }}>Quick Reference</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Current: {words} words</span>
                  <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Target: {task === 'task1' ? '150+' : '250+'} words
                  </span>
                </div>
              </div>
              
              {tips.length > 0 && (
                <div>
                  <h4 style={{ marginTop: 0, marginBottom: '12px', color: 'var(--accent-primary)' }}>Tips to Reach Band {band}:</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '8px' }}>
                    {tips.slice(0, 4).map((t, i) => (
                      <div key={i} style={{ 
                        padding: '8px 12px', 
                        backgroundColor: 'var(--bg-secondary)', 
                        borderRadius: '4px', 
                        fontSize: '0.9rem',
                        color: 'var(--text-secondary)'
                      }}>
                        • {t}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
