import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import axios from "axios";

const SUBJECTS = [
  "Engineering Mathematics",
  "Computer Networks",
  "Digital Electronics",
  "Data Structures",
  "Signals & Systems",
];

export default function QuizMaker() {
  const [screen, setScreen] = useState("setup"); // setup | quiz | result
  const [subject, setSubject] = useState("");
  const [numQ, setNumQ] = useState(5);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [warnings, setWarnings] = useState([]);
  const [cheats, setCheats] = useState(0);
  const [answerTimes, setAnswerTimes] = useState([]);
  const [questionStart, setQuestionStart] = useState(null);
  const timerRef = useRef();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Anti-cheat: detect alt-tab / window blur
  const handleVisibility = useCallback(() => {
    if (screen === "quiz" && document.hidden) {
      setCheats((c) => c + 1);
      setWarnings((w) => [...w, {
        type: "Tab Switch",
        q: current + 1,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }
  }, [screen, current]);

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [handleVisibility]);

  // Timer per question
  useEffect(() => {
    if (screen !== "quiz") return;
    setTimeLeft(30);
    setQuestionStart(Date.now());
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen, current]);

  const handleTimeout = () => {
    const elapsed = (Date.now() - questionStart) / 1000;
    setAnswerTimes((a) => [...a, elapsed]);
    moveNext(null, false);
  };

  const generateQuestions = async () => {
    if (!subject) { setError("Please select a subject."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost/focused-api/quiz-gen.php", {
        subject,
        count: numQ,
        userName: user?.name || "Student",
      });
      if (res.data.success) {
        setQuestions(res.data.questions);
        setAnswers([]);
        setCurrent(0);
        setScore(0);
        setSelected(null);
        setWarnings([]);
        setCheats(0);
        setAnswerTimes([]);
        setScreen("quiz");
      } else {
        setError(res.data.message || "Could not generate questions.");
      }
    } catch {
      setError("Connection error. Make sure XAMPP is running.");
    }
    setLoading(false);
  };

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    const elapsed = (Date.now() - questionStart) / 1000;

    // Detect too-fast answers (under 2 seconds)
    if (elapsed < 2) {
      setCheats((c) => c + 1);
      setWarnings((w) => [...w, {
        type: "Too Fast",
        q: current + 1,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }

    setAnswerTimes((a) => [...a, elapsed]);
    setSelected(idx);
    const correct = idx === questions[current]?.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => moveNext(idx, correct), 900);
  };

  const moveNext = (idx, correct) => {
    clearInterval(timerRef.current);
    setAnswers((a) => [...a, { idx, correct, q: questions[current] }]);
    if (current + 1 >= questions.length) {
      setScreen("result");
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const avgTime = answerTimes.length > 0 ? (answerTimes.reduce((a, b) => a + b, 0) / answerTimes.length).toFixed(1) : 0;

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6">

        {/* SETUP */}
        {screen === "setup" && (
          <div className="flex gap-5 h-full fade-up">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Maker</h1>
                <p className="text-sm text-muted mt-0.5">AI-generated questions based on your subject</p>
              </div>

              <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
                <p className="text-sm font-semibold text-gray-900 mb-4">Quiz Settings</p>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 block mb-1.5">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full border border-line bg-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition"
                    >
                      <option value="">Select a subject</option>
                      {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1.5">
                      <label className="text-xs font-semibold text-gray-600">Number of Questions</label>
                      <span className="text-xs font-bold tabular-nums text-gray-900">{numQ}</span>
                    </div>
                    <input
                      type="range" min={3} max={15} step={1}
                      value={numQ}
                      onChange={(e) => setNumQ(Number(e.target.value))}
                      className="w-full accent-brand"
                    />
                    <div className="flex justify-between mt-1">
                      <span className="text-2xs text-subtle">3</span>
                      <span className="text-2xs text-subtle">15</span>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={generateQuestions}
                    disabled={loading || !subject}
                    className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded-lg text-sm font-semibold transition disabled:opacity-40"
                  >
                    {loading ? "Generating questions..." : "Start Quiz"}
                  </button>
                </div>
              </div>

              {/* Anti-cheat notice */}
              <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
                <p className="text-sm font-semibold text-gray-900 mb-3">Academic Integrity</p>
                <div className="space-y-2">
                  {[
                    "This quiz monitors tab switching and window focus",
                    "Answers completed under 2 seconds are flagged",
                    "All suspicious activity is logged in your results",
                    "Results reflect your actual knowledge level",
                  ].map((r, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-muted mt-1.5 flex-shrink-0" />
                      <p className="text-xs text-muted">{r}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right info */}
            <div className="w-64 flex flex-col gap-4">
              <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">How it works</p>
                <div className="space-y-4">
                  {[
                    { step: "01", title: "Pick a subject", desc: "Choose from your enrolled subjects" },
                    { step: "02", title: "Set question count", desc: "Choose between 3 and 15 questions" },
                    { step: "03", title: "Answer carefully", desc: "You have 30 seconds per question" },
                    { step: "04", title: "Review results", desc: "See your score and feedback" },
                  ].map((s) => (
                    <div key={s.step} className="flex gap-3">
                      <span className="text-2xs font-bold text-subtle mt-0.5 flex-shrink-0">{s.step}</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{s.title}</p>
                        <p className="text-2xs text-muted mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-5 flex-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Reminder</p>
                <p className="text-sm text-white leading-relaxed">
                  The goal of this quiz is to help you identify what you know and what you need to review — not to trick you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* QUIZ */}
        {screen === "quiz" && questions.length > 0 && (
          <div className="flex gap-5 h-full fade-up">
            <div className="flex-1 flex flex-col gap-4">

              {/* Progress */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted">{subject}</p>
                  <p className="text-sm font-bold text-gray-900 mt-0.5">
                    Question {current + 1} of {questions.length}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xs text-muted">Time left</p>
                  <p className={`text-2xl font-bold tabular-nums ${timeLeft <= 10 ? "text-red-600" : "text-gray-900"}`}>
                    {timeLeft}s
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-base rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all duration-300"
                  style={{ width: `${((current) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question */}
              <div className="bg-surface border border-line rounded-xl p-6 shadow-card flex-1">
                <p className="text-base font-semibold text-gray-900 leading-relaxed mb-6">
                  {questions[current]?.question}
                </p>
                <div className="space-y-2.5">
                  {questions[current]?.options.map((opt, i) => {
                    let style = "border-line bg-base text-gray-700 hover:border-gray-300 hover:bg-surface";
                    if (selected !== null) {
                      if (i === questions[current].answer) style = "border-emerald-500 bg-emerald-50 text-emerald-700";
                      else if (i === selected) style = "border-red-400 bg-red-50 text-red-700";
                      else style = "border-line bg-base text-gray-400";
                    }
                    return (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i)}
                        disabled={selected !== null}
                        className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition ${style}`}
                      >
                        <span className="font-semibold mr-2 text-xs opacity-50">
                          {String.fromCharCode(65 + i)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Right — Live Stats */}
            <div className="w-56 flex flex-col gap-4">
              <div className="bg-surface border border-line rounded-xl p-4 shadow-card">
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">Live Stats</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xs text-muted">Current score</p>
                    <p className="text-2xl font-bold tabular-nums text-gray-900">{score}<span className="text-sm text-muted font-normal">/{current}</span></p>
                  </div>
                  <div className="h-px bg-line" />
                  <div>
                    <p className="text-2xs text-muted">Flags</p>
                    <p className={`text-2xl font-bold tabular-nums ${cheats > 0 ? "text-red-600" : "text-gray-900"}`}>{cheats}</p>
                  </div>
                  <div className="h-px bg-line" />
                  <div>
                    <p className="text-2xs text-muted">Avg answer time</p>
                    <p className="text-2xl font-bold tabular-nums text-gray-900">{avgTime}s</p>
                  </div>
                </div>
              </div>

              {/* Timer visual */}
              <div className="bg-surface border border-line rounded-xl p-4 shadow-card">
                <p className="text-2xs text-muted mb-2">Time remaining</p>
                <div className="h-2 bg-base rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${timeLeft <= 10 ? "bg-red-500" : "bg-brand"}`}
                    style={{ width: `${(timeLeft / 30) * 100}%` }}
                  />
                </div>
                <p className={`text-xs font-semibold mt-1.5 tabular-nums ${timeLeft <= 10 ? "text-red-600" : "text-muted"}`}>
                  {timeLeft} seconds left
                </p>
              </div>

              {/* Flags log */}
              {warnings.length > 0 && (
                <div className="bg-surface border border-red-200 rounded-xl p-4 shadow-card">
                  <p className="text-xs font-semibold text-red-600 mb-2">Flags ({warnings.length})</p>
                  <div className="space-y-1.5">
                    {warnings.map((w, i) => (
                      <div key={i} className="text-2xs text-muted">
                        Q{w.q} — {w.type} at {w.time}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* RESULT */}
        {screen === "result" && (
          <div className="flex gap-5 fade-up">
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Complete</h1>
                <p className="text-sm text-muted mt-0.5">{subject}</p>
              </div>

              {/* Score Card */}
              <div className="bg-surface border border-line rounded-xl p-6 shadow-card">
                <div className="flex items-center gap-6 mb-6 pb-6 border-b border-line">
                  <div className="text-center">
                    <p className={`text-5xl font-bold tabular-nums ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-500" : "text-red-600"}`}>
                      {pct}%
                    </p>
                    <p className="text-xs text-muted mt-1">{score} of {questions.length} correct</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[
                      { label: "Correct", value: score, color: "bg-emerald-500" },
                      { label: "Wrong", value: questions.length - score, color: "bg-red-400" },
                    ].map((r) => (
                      <div key={r.label}>
                        <div className="flex justify-between mb-1">
                          <span className="text-2xs text-muted">{r.label}</span>
                          <span className="text-2xs font-semibold tabular-nums text-gray-700">{r.value}</span>
                        </div>
                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${r.color}`} style={{ width: `${(r.value / questions.length) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Per-question review */}
                <p className="text-xs font-semibold text-gray-700 mb-3">Question Review</p>
                <div className="space-y-2">
                  {answers.map((a, i) => (
                    <div key={i} className={`px-4 py-3 rounded-lg border text-sm ${a.correct ? "border-emerald-200 bg-emerald-50" : "border-red-200 bg-red-50"}`}>
                      <div className="flex justify-between items-start gap-3">
                        <p className={`text-xs font-medium leading-relaxed ${a.correct ? "text-emerald-700" : "text-red-700"}`}>
                          {i + 1}. {a.q?.question}
                        </p>
                        <span className={`text-2xs font-bold flex-shrink-0 ${a.correct ? "text-emerald-600" : "text-red-600"}`}>
                          {a.correct ? "Correct" : "Wrong"}
                        </span>
                      </div>
                      {!a.correct && a.q && (
                        <p className="text-2xs text-emerald-700 mt-1.5 font-medium">
                          Answer: {a.q.options[a.q.answer]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — Integrity Report + Actions */}
            <div className="w-64 flex flex-col gap-4">

              <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
                <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Performance</p>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xs text-muted">Average answer time</p>
                    <p className="text-2xl font-bold tabular-nums text-gray-900">{avgTime}s</p>
                  </div>
                  <div className="h-px bg-line" />
                  <div>
                    <p className="text-2xs text-muted">Flags detected</p>
                    <p className={`text-2xl font-bold tabular-nums ${cheats > 0 ? "text-red-600" : "text-emerald-600"}`}>{cheats}</p>
                  </div>
                  <div className="h-px bg-line" />
                  <div>
                    <p className="text-2xs text-muted">Integrity status</p>
                    <p className={`text-sm font-semibold mt-0.5 ${cheats === 0 ? "text-emerald-600" : cheats <= 2 ? "text-amber-500" : "text-red-600"}`}>
                      {cheats === 0 ? "Clean" : cheats <= 2 ? "Minor flags" : "Review flagged"}
                    </p>
                  </div>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="bg-surface border border-red-200 rounded-xl p-5 shadow-card">
                  <p className="text-xs font-semibold text-red-600 mb-3">Flag Report</p>
                  <div className="space-y-2">
                    {warnings.map((w, i) => (
                      <div key={i} className="text-2xs text-muted border-l-2 border-red-300 pl-2">
                        Q{w.q} — {w.type}<br />
                        <span className="text-subtle">{w.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`rounded-xl p-5 ${pct >= 80 ? "bg-emerald-50 border border-emerald-200" : pct >= 60 ? "bg-amber-50 border border-amber-200" : "bg-red-50 border border-red-200"}`}>
                <p className={`text-xs font-semibold mb-2 ${pct >= 80 ? "text-emerald-700" : pct >= 60 ? "text-amber-700" : "text-red-700"}`}>
                  Feedback
                </p>
                <p className={`text-xs leading-relaxed ${pct >= 80 ? "text-emerald-600" : pct >= 60 ? "text-amber-600" : "text-red-600"}`}>
                  {pct >= 80
                    ? "Excellent work. You have a strong grasp of this subject. Keep reviewing to maintain it."
                    : pct >= 60
                    ? "Good effort. Review the questions you got wrong and try again in a few days."
                    : "This topic needs more attention. Use the Note Reviewer and study before retaking."}
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => { setScreen("setup"); setQuestions([]); }}
                  className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition"
                >
                  New Quiz
                </button>
                <button
                  onClick={() => window.location.href = "/reviewer"}
                  className="w-full py-2.5 bg-surface border border-line text-gray-700 text-sm font-medium rounded-lg hover:bg-base transition"
                >
                  Go to Note Reviewer
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}