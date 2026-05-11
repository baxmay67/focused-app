import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const TOPICS = [
  { subject: "Signals & Systems", topic: "Fourier Transform", score: 38, target: 75 },
  { subject: "Data Structures", topic: "Binary Search Trees", score: 45, target: 75 },
  { subject: "Signals & Systems", topic: "Laplace Transform", score: 52, target: 75 },
  { subject: "Data Structures", topic: "Graph Algorithms", score: 58, target: 75 },
  { subject: "Digital Electronics", topic: "Flip Flops & Latches", score: 67, target: 75 },
  { subject: "Computer Networks", topic: "Subnetting", score: 70, target: 75 },
];

const priority = (score) => {
  if (score < 50) return { label: "High", bar: "#dc2626", badge: "text-red-600 bg-red-50 border-red-200" };
  if (score < 65) return { label: "Medium", bar: "#d97706", badge: "text-amber-600 bg-amber-50 border-amber-200" };
  return { label: "Low", bar: "#2563eb", badge: "text-blue-600 bg-blue-50 border-blue-200" };
};

export default function WeakTopics() {
  const [sort, setSort] = useState("score");
  const sorted = [...TOPICS].sort((a, b) => sort === "score" ? a.score - b.score : a.subject.localeCompare(b.subject));

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex flex-col gap-5">

        <div className="flex items-start justify-between fade-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Weak Topics</h1>
            <p className="text-sm text-muted mt-0.5">Topics that need the most review time</p>
          </div>
          <div className="flex border border-line rounded-lg overflow-hidden bg-surface shadow-card">
            {[{ label: "By Score", val: "score" }, { label: "By Subject", val: "subject" }].map((s) => (
              <button
                key={s.val}
                onClick={() => setSort(s.val)}
                className={`px-4 py-2 text-xs font-semibold transition ${
                  sort === s.val ? "bg-gray-900 text-white" : "text-muted hover:bg-base"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 fade-up d1">
          {[
            { label: "High Priority", value: TOPICS.filter((t) => t.score < 50).length, sub: "below 50%", color: "text-red-600" },
            { label: "Medium Priority", value: TOPICS.filter((t) => t.score >= 50 && t.score < 65).length, sub: "50–64%", color: "text-amber-600" },
            { label: "Low Priority", value: TOPICS.filter((t) => t.score >= 65).length, sub: "65–74%", color: "text-blue-600" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-line rounded-xl p-5 shadow-card">
              <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2">{s.label}</p>
              <p className={`text-3xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Topics + Study Plan */}
        <div className="grid grid-cols-3 gap-4 flex-1 fade-up d2">

          <div className="col-span-2 bg-surface border border-line rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">All Weak Topics</p>
              <p className="text-xs text-muted">{TOPICS.length} topics</p>
            </div>
            <div className="divide-y divide-line">
              {sorted.map((t, i) => {
                const p = priority(t.score);
                const gap = t.target - t.score;
                return (
                  <div key={i} className="px-5 py-4 flex items-center gap-4 hover:bg-base transition">
                    <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: p.bar }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-gray-800">{t.topic}</p>
                        <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded border ${p.badge}`}>
                          {p.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted">{t.subject}</p>
                    </div>
                    <div className="w-32">
                      <div className="flex justify-between mb-1">
                        <span className="text-2xs text-muted">Current</span>
                        <span className="text-2xs font-bold tabular-nums" style={{ color: p.bar }}>{t.score}%</span>
                      </div>
                      <div className="h-1.5 bg-base rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${t.score}%`, background: p.bar }} />
                      </div>
                    </div>
                    <div className="text-right w-20 flex-shrink-0">
                      <p className="text-xs text-muted">Need</p>
                      <p className="text-sm font-bold tabular-nums text-gray-900">+{gap}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Study Plan */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-line rounded-xl p-5 shadow-card flex-1">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Suggested Study Plan</p>
              <div className="space-y-3">
                {sorted.slice(0, 4).map((t, i) => (
                  <div key={i} className="border-l-2 pl-3" style={{ borderColor: priority(t.score).bar }}>
                    <p className="text-xs font-semibold text-gray-700">{t.topic}</p>
                    <p className="text-2xs text-muted mt-0.5">{t.subject}</p>
                    <p className="text-2xs font-medium mt-0.5" style={{ color: priority(t.score).bar }}>
                      {t.score < 50 ? "90 min daily" : t.score < 65 ? "60 min daily" : "30 min daily"}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Reminder</p>
              <p className="text-sm text-white leading-relaxed">
                Focus your energy on high priority topics first. Even 30 minutes of focused daily review makes a measurable difference within a week.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}