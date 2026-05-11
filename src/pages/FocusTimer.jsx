import axios from "axios";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";

export default function FocusTimer() {
  const [studyMin, setStudyMin] = useState(25);
  const [breakMin, setBreakMin] = useState(5);
  const [mode, setMode] = useState("study");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [editing, setEditing] = useState(false);
  const [log, setLog] = useState([]);
  const intervalRef = useRef();

  const studyTime = studyMin * 60;
  const breakTime = breakMin * 60;
  const total = mode === "study" ? studyTime : breakTime;
  const progress = ((total - timeLeft) / total) * 100;

  const switchMode = useCallback(async () => {
    setRunning(false);
    if (mode === "study") {
      setSessions((s) => s + 1);
      setLog((l) => [
        { label: `Session ${sessions + 1}`, mins: studyMin, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) },
        ...l,
      ]);
    
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        await axios.post("http://fwh.is/sessions.php", {
          user_id: user.id,
          duration_minutes: studyMin,
          completed: 1,
        });
      } catch {}
      setMode("break");
      setTimeLeft(breakMin * 60);
    } else {
      setMode("study");
      setTimeLeft(studyMin * 60);
    }
  }, [mode, sessions, studyMin, breakMin]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) { clearInterval(intervalRef.current); switchMode(); return 0; }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, switchMode]);

  const reset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setMode("study");
    setTimeLeft(studyMin * 60);
  };

  const applySettings = () => {
    reset();
    setTimeLeft(studyMin * 60);
    setEditing(false);
  };

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const circumference = 2 * Math.PI * 88;

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex gap-5">

        {/* Left — Timer */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="fade-up">
            <h1 className="text-2xl font-bold text-gray-900">Focus Timer</h1>
            <p className="text-sm text-muted mt-0.5">
              {mode === "study" ? `Study session — ${studyMin} minutes` : `Break time — ${breakMin} minutes`}
            </p>
          </div>

          {/* Timer Card */}
          <div className="bg-surface border border-line rounded-xl p-8 shadow-card flex flex-col items-center flex-1 fade-up d1">

            {/* Mode Toggle */}
            <div className="flex w-full max-w-xs mb-8">
              <button
                onClick={() => { if (mode !== "study") { setMode("study"); setTimeLeft(studyMin * 60); setRunning(false); } }}
                className={`flex-1 py-2 text-sm font-semibold rounded-l-lg border transition ${
                  mode === "study"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-surface text-muted border-line hover:bg-base"
                }`}
              >
                Study
              </button>
              <button
                onClick={() => { if (mode !== "break") { setMode("break"); setTimeLeft(breakMin * 60); setRunning(false); } }}
                className={`flex-1 py-2 text-sm font-semibold rounded-r-lg border-t border-b border-r transition ${
                  mode === "break"
                    ? "bg-gray-900 text-white border-gray-900"
                    : "bg-surface text-muted border-line hover:bg-base"
                }`}
              >
                Break
              </button>
            </div>

            {/* Circle */}
            <div className="relative mb-8" style={{ width: 200, height: 200 }}>
              <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="100" cy="100" r="88" fill="none" stroke="#f5f5f7" strokeWidth="8" />
                <circle
                  cx="100" cy="100" r="88"
                  fill="none"
                  stroke={mode === "study" ? "#2563eb" : "#059669"}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress / 100)}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900 tabular-nums tracking-tight">
                  {fmt(timeLeft)}
                </span>
                <span className="text-xs text-muted mt-1">
                  {mode === "study" ? "Stay focused" : "Take a rest"}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setRunning(!running)}
                className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition ${
                  running
                    ? "bg-base border border-line text-gray-700 hover:bg-line"
                    : "bg-gray-900 text-white hover:bg-gray-700"
                }`}
              >
                {running ? "Pause" : "Start"}
              </button>
              <button
                onClick={reset}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-base border border-line text-muted hover:text-gray-700 hover:bg-line transition"
              >
                Reset
              </button>
              <button
                onClick={switchMode}
                className="px-5 py-2.5 rounded-lg text-sm font-medium bg-base border border-line text-muted hover:text-gray-700 hover:bg-line transition"
              >
                Skip
              </button>
            </div>

          </div>

          {/* Session Log */}
          <div className="bg-surface border border-line rounded-xl shadow-card fade-up d3">
            <div className="px-5 py-3.5 border-b border-line">
              <p className="text-sm font-semibold text-gray-900">Session Log</p>
            </div>
            {log.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-xs text-subtle">No sessions yet. Start the timer!</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {log.map((l, i) => (
                  <div key={i} className="px-5 py-3 flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-700">{l.label}</p>
                    <div className="flex items-center gap-4">
                      <p className="text-xs text-muted">{l.mins} min</p>
                      <p className="text-xs font-mono text-subtle">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right — Settings + Stats */}
        <div className="w-64 flex flex-col gap-4">

          {/* Stats */}
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up d1">
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Today</p>
            <div className="space-y-4">
              <div>
                <p className="text-2xs text-muted mb-0.5">Sessions done</p>
                <p className="text-3xl font-bold text-gray-900 tabular-nums">{sessions}</p>
              </div>
              <div className="h-px bg-line" />
              <div>
                <p className="text-2xs text-muted mb-0.5">Total study time</p>
                <p className="text-3xl font-bold text-gray-900 tabular-nums">{sessions * studyMin}<span className="text-base font-medium text-muted ml-1">min</span></p>
              </div>
              <div className="h-px bg-line" />
              <div>
                <p className="text-2xs text-muted mb-0.5">Current mode</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{mode}</p>
              </div>
            </div>
          </div>

          {/* Timer Settings */}
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up d2">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider">Timer Settings</p>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="text-xs text-brand font-semibold hover:text-brand-dark transition"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={applySettings}
                  className="text-xs text-emerald-600 font-semibold hover:text-emerald-700 transition"
                >
                  Apply
                </button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-gray-700">Study duration</p>
                  <p className="text-xs font-bold tabular-nums text-gray-900">{studyMin} min</p>
                </div>
                {editing ? (
                  <input
                    type="range"
                    min={5}
                    max={90}
                    step={5}
                    value={studyMin}
                    onChange={(e) => setStudyMin(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                ) : (
                  <div className="h-1.5 bg-base rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${(studyMin / 90) * 100}%` }} />
                  </div>
                )}
                {editing && (
                  <div className="flex justify-between mt-1">
                    <span className="text-2xs text-subtle">5 min</span>
                    <span className="text-2xs text-subtle">90 min</span>
                  </div>
                )}
              </div>

              <div className="h-px bg-line" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-medium text-gray-700">Break duration</p>
                  <p className="text-xs font-bold tabular-nums text-gray-900">{breakMin} min</p>
                </div>
                {editing ? (
                  <input
                    type="range"
                    min={1}
                    max={30}
                    step={1}
                    value={breakMin}
                    onChange={(e) => setBreakMin(Number(e.target.value))}
                    className="w-full accent-brand"
                  />
                ) : (
                  <div className="h-1.5 bg-base rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(breakMin / 30) * 100}%` }} />
                  </div>
                )}
                {editing && (
                  <div className="flex justify-between mt-1">
                    <span className="text-2xs text-subtle">1 min</span>
                    <span className="text-2xs text-subtle">30 min</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up d3 flex-1">
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Study Tips</p>
            <div className="space-y-3">
              {[
                { title: "Remove distractions", desc: "Put your phone face down and close unnecessary tabs before starting." },
                { title: "One topic at a time", desc: "Focus on a single subject per session for better retention." },
                { title: "Use your break", desc: "Stand up, stretch, and look away from the screen during breaks." },
                { title: "Stay consistent", desc: "4 sessions a day is better than one long cramming session." },
              ].map((tip, i) => (
                <div key={i} className="border-l-2 border-line pl-3">
                  <p className="text-xs font-semibold text-gray-700">{tip.title}</p>
                  <p className="text-2xs text-muted mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}