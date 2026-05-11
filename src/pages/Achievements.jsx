import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

const ACHIEVEMENTS = [
  {
    category: "Study Streaks",
    items: [
      { id: 1, title: "First Day", desc: "Complete your first study session", target: 1, current: 1, unit: "session" },
      { id: 2, title: "One Week", desc: "Study 7 days in a row", target: 7, current: 7, unit: "days" },
      { id: 3, title: "Two Weeks", desc: "Study 14 days in a row", target: 14, current: 12, unit: "days" },
      { id: 4, title: "One Month", desc: "Study 30 days in a row", target: 30, current: 12, unit: "days" },
    ],
  },
  {
    category: "Quiz Performance",
    items: [
      { id: 5, title: "First Quiz", desc: "Complete your first quiz", target: 1, current: 1, unit: "quiz" },
      { id: 6, title: "Perfect Score", desc: "Score 100% on any quiz", target: 1, current: 0, unit: "quiz" },
      { id: 7, title: "Quiz Veteran", desc: "Complete 25 quizzes", target: 25, current: 18, unit: "quizzes" },
      { id: 8, title: "Quiz Master", desc: "Complete 50 quizzes", target: 50, current: 18, unit: "quizzes" },
    ],
  },
  {
    category: "Study Hours",
    items: [
      { id: 9, title: "First Hour", desc: "Log 1 hour of study time", target: 60, current: 60, unit: "min" },
      { id: 10, title: "Ten Hours", desc: "Log 10 hours of study time", target: 600, current: 600, unit: "min" },
      { id: 11, title: "Full Day", desc: "Log 24 hours of study time", target: 1440, current: 1080, unit: "min" },
      { id: 12, title: "Dedicated", desc: "Log 50 hours of study time", target: 3000, current: 1080, unit: "min" },
    ],
  },
  {
    category: "Subject Mastery",
    items: [
      { id: 13, title: "Rising Star", desc: "Score above 80% in any subject", target: 1, current: 1, unit: "subject" },
      { id: 14, title: "Well Rounded", desc: "Score above 75% in all subjects", target: 5, current: 2, unit: "subjects" },
      { id: 15, title: "Top Student", desc: "Score above 90% in any subject", target: 1, current: 1, unit: "subject" },
      { id: 16, title: "Scholar", desc: "Score above 90% in all subjects", target: 5, current: 1, unit: "subjects" },
    ],
  },
];

export default function Achievements() {
  const [filter, setFilter] = useState("all");

  const allItems = ACHIEVEMENTS.flatMap((g) => g.items);
  const earned = allItems.filter((a) => a.current >= a.target).length;
  const total = allItems.length;
  const pct = Math.round((earned / total) * 100);

  const filtered = filter === "earned"
    ? ACHIEVEMENTS.map((g) => ({ ...g, items: g.items.filter((i) => i.current >= i.target) })).filter((g) => g.items.length > 0)
    : filter === "locked"
    ? ACHIEVEMENTS.map((g) => ({ ...g, items: g.items.filter((i) => i.current < i.target) })).filter((g) => g.items.length > 0)
    : ACHIEVEMENTS;

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-start justify-between fade-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Achievements</h1>
            <p className="text-sm text-muted mt-0.5">Track your study milestones and progress</p>
          </div>
          <div className="flex border border-line rounded-lg overflow-hidden bg-surface shadow-card">
            {["all", "earned", "locked"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 text-xs font-semibold capitalize transition ${
                  filter === f
                    ? "bg-gray-900 text-white"
                    : "text-muted hover:bg-base"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Row */}
        <div className="grid grid-cols-4 gap-4 fade-up d1">
          <div className="col-span-2 bg-surface border border-line rounded-xl p-5 shadow-card">
            <div className="flex items-end justify-between mb-3">
              <div>
                <p className="text-2xs font-semibold text-subtle uppercase tracking-wider">Overall Progress</p>
                <p className="text-3xl font-bold text-gray-900 tabular-nums mt-1">{earned}<span className="text-base font-medium text-muted">/{total}</span></p>
              </div>
              <p className="text-3xl font-bold tabular-nums text-brand">{pct}%</p>
            </div>
            <div className="h-2 bg-base rounded-full overflow-hidden">
              <div
                className="h-full bg-brand rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">{total - earned} achievements remaining</p>
          </div>

          {[
            { label: "Earned", value: earned, sub: "achievements unlocked" },
            { label: "Locked", value: total - earned, sub: "achievements remaining" },
            { label: "Categories", value: ACHIEVEMENTS.length, sub: "total categories" },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-line rounded-xl p-5 shadow-card">
              <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Achievement Groups */}
        <div className="space-y-5 fade-up d2">
          {filtered.map((group) => (
            <div key={group.category} className="bg-surface border border-line rounded-xl shadow-card overflow-hidden">
              <div className="px-5 py-3.5 border-b border-line">
                <p className="text-sm font-semibold text-gray-900">{group.category}</p>
              </div>
              <div className="divide-y divide-line">
                {group.items.map((item) => {
                  const done = item.current >= item.target;
                  const progress = Math.min((item.current / item.target) * 100, 100);
                  return (
                    <div
                      key={item.id}
                      className={`px-5 py-4 flex items-center gap-5 ${done ? "" : "opacity-60"}`}
                    >
                      {/* Status indicator */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        done ? "bg-brand text-white" : "bg-base border border-line"
                      }`}>
                        {done ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-line" />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                          {done && (
                            <span className="text-2xs font-semibold text-brand bg-brand-light px-1.5 py-0.5 rounded">
                              Earned
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted">{item.desc}</p>
                        {!done && (
                          <div className="mt-2">
                            <div className="flex justify-between mb-1">
                              <span className="text-2xs text-subtle">{item.current} / {item.target} {item.unit}</span>
                              <span className="text-2xs text-subtle tabular-nums">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-1 bg-base rounded-full overflow-hidden">
                              <div
                                className="h-full bg-brand rounded-full"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Progress fraction */}
                      <div className="text-right flex-shrink-0">
                        <p className={`text-sm font-bold tabular-nums ${done ? "text-brand" : "text-muted"}`}>
                          {item.current}<span className="text-subtle font-normal">/{item.target}</span>
                        </p>
                        <p className="text-2xs text-subtle">{item.unit}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}