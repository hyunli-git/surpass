"use client";

import { useEffect, useMemo, useState } from "react";

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
      if (json.success) setResult(json.feedback);
      else setResult({ error: json.error || "Failed to analyze" });
    } catch (e) {
      setResult({ error: "Network error" });
    } finally {
      setSubmitting(false);
    }
  };

  const fmt = (s: number) => `${Math.floor(s/60)}:${String(s%60).padStart(2, "0")}`;

  return (
    <div className="container" style={{ margin: "50px auto" }}>
      <section className="hero">
        <div className="container container-narrow">
          <h1>IELTS General Training – Writing Practice</h1>
          <p>Choose Task 1 or Task 2, write your response, and get instant AI feedback.</p>
        </div>
      </section>

      <section className="practice-section">
        <div className="container" style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: 24 }}>
          <div>
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
              style={{ minHeight: 280 }}
              placeholder={task === "task1" ? "Write your formal letter here…" : "Write your essay here…"}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
              <button className="btn btn-primary" disabled={submitting || text.trim().length < 10} onClick={submitForFeedback}>
                {submitting ? "Analyzing…" : "Get AI Feedback"}
              </button>
              <button className="btn" onClick={() => setText("")}>Clear</button>
            </div>
          </div>

          <aside className="test-sidebar" style={{ position: "sticky", top: 24, alignSelf: "start" }}>
            <div className="notes-panel">
              <h4>Feedback</h4>
              {!result && <p style={{ color: "var(--text-secondary)" }}>Submit your response to see detailed scoring and suggestions.</p>}
              {result?.error && (
                <p style={{ color: "var(--accent-red)" }}>{result.error}</p>
              )}
              {result && !result.error && (
                <div style={{ display: "grid", gap: 12 }}>
                  <div className="test-card">
                    <h3 style={{ marginTop: 0 }}>Overall</h3>
                    <div>Band: <strong>{result.bandScore}</strong></div>
                    <div>Estimated Score: <strong>{result.overallScore}</strong></div>
                    <div>Words: <strong>{result.wordCount}</strong></div>
                  </div>
                  <div className="test-card">
                    <h3 style={{ marginTop: 0 }}>Criteria</h3>
                    <ul className="test-card-features">
                      <li>Task Response: {result.criteria?.taskResponse?.score}</li>
                      <li>Coherence & Cohesion: {result.criteria?.coherenceCohesion?.score}</li>
                      <li>Lexical Resource: {result.criteria?.lexicalResource?.score}</li>
                      <li>Grammatical Accuracy: {result.criteria?.grammaticalAccuracy?.score}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

