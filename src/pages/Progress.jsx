import React from "react";
import Sidebar from "../components/Sidebar";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, LineElement, PointElement, Tooltip, Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Tooltip, Legend);

const WEEK_DATA = {
  labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
  datasets: [
    { label: "Eng. Math", data: [78, 82, 88, 92], backgroundColor: "#2563eb", borderRadius: 4, borderSkipped: false },
    { label: "Data Structures", data: [50, 55, 60, 65], backgroundColor: "#d97706", borderRadius: 4, borderSkipped: false },
    { label: "Signals", data: [40, 45, 50, 54], backgroundColor: "#dc2626", borderRadius: 4, borderSkipped: false },
  ],
};

const HOURS_DATA = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  datasets: [{
    label: "Study Hours",
    data: [2.5, 3, 1.5, 4, 2, 3.5, 1],
    borderColor: "#2563eb",
    backgroundColor: "rgba(37,99,235,0.08)",
    tension: 0.3,
    fill: true,
    pointBackgroundColor: "#2563eb",
    pointRadius: 3,
  }],
};

const chartOpts = (yLabel) => ({
  responsive: true,
  plugins: { legend: { position: "bottom", labels: { font: { size: 11, family: "Inter" }, color: "#6b7280", boxWidth: 10, padding: 16 } } },
  scales: {
    x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, family: "Inter" }, color: "#9ca3af" } },
    y: { grid: { color: "#f5f5f7" }, border: { display: false }, ticks: { font: { size: 11, family: "Inter" }, color: "#9ca3af" }, title: { display: !!yLabel, text: yLabel, color: "#9ca3af", font: { size: 11 } } },
  },
});

const milestones = [
  { label: "First quiz completed", done: true },
  { label: "7 day study streak", done: true },
  { label: "Scored 80%+ in Eng. Math", done: true },
  { label: "10 focus sessions done", done: true },
  { label: "75%+ in all subjects", done: false },
  { label: "30 day study streak", done: false },
  { label: "50 quizzes completed", done: false },
  { label: "90%+ average overall", done: false },
];

export default function Progress() {
  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex flex-col gap-5">

        <div className="fade-up">
          <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
          <p className="text-sm text-muted mt-0.5">Your improvement over time across all subjects</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-4 gap-4 fade-up d1">
          {[
            { label: "Study Hours Total", value: "24h", change: "+3h this week", up: true },
            { label: "Quizzes Completed", value: "42", change: "+8 this week", up: true },
            { label: "Overall Average", value: "74%", change: "+5% this week", up: true },
            { label: "Milestones Done", value: "4/8", change: "4 remaining", up: false },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-line rounded-xl p-4 shadow-card">
              <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums leading-none mb-1.5">{s.value}</p>
              <p className={`text-xs font-medium ${s.up ? "text-emerald-600" : "text-muted"}`}>{s.change}</p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-2 gap-4 fade-up d2">
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Score Improvement</p>
            <p className="text-xs text-muted mb-4">Per subject over 4 weeks</p>
            <Bar data={WEEK_DATA} options={chartOpts()} height={160} />
          </div>
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
            <p className="text-sm font-semibold text-gray-900 mb-0.5">Daily Study Hours</p>
            <p className="text-xs text-muted mb-4">Hours logged this week</p>
            <Line data={HOURS_DATA} options={chartOpts("Hours")} height={160} />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-3 gap-4 fade-up d3 flex-1">

          {/* Milestones */}
          <div className="col-span-2 bg-surface border border-line rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-line">
              <p className="text-sm font-semibold text-gray-900">Milestones</p>
            </div>
            <div className="divide-y divide-line">
              {milestones.map((m, i) => (
                <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${
                    m.done ? "bg-brand" : "bg-base border border-line"
                  }`}>
                    {m.done && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <p className={`text-sm flex-1 ${m.done ? "text-gray-800 font-medium" : "text-muted"}`}>
                    {m.label}
                  </p>
                  <span className={`text-2xs font-semibold px-2 py-0.5 rounded ${
                    m.done ? "bg-brand-light text-brand" : "bg-base text-subtle border border-line"
                  }`}>
                    {m.done ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Summary */}
          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">This Week</p>
              <div className="space-y-3">
                {[
                  { label: "Sessions completed", value: "8" },
                  { label: "Quizzes taken", value: "12" },
                  { label: "Study hours", value: "17.5h" },
                  { label: "Best subject", value: "Eng. Math" },
                  { label: "Needs attention", value: "Signals" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between items-center">
                    <span className="text-xs text-muted">{r.label}</span>
                    <span className="text-xs font-semibold text-gray-800 tabular-nums">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-xl p-5 flex-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Keep Going</p>
              <p className="text-sm text-white leading-relaxed">
                Consistent daily review, even just 30 minutes, compounds into massive improvement over weeks.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}