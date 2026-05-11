import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from "chart.js";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import SubjectBar from "../components/SubjectBar";
import { SkeletonCard, Skeleton } from "../components/ui/Skeleton";
import Empty from "../components/ui/Empty";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function StatCard({ label, value, change, up, delay = 1, loading }) {
  if (loading) return <SkeletonCard />;
  return (
    <div className={`bg-surface border border-line rounded-xl p-4 shadow-card fade-up d${delay}`}>
      <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-2">{label}</p>
      <p className="text-3xl font-bold text-ink tabular-nums tracking-tight leading-none mb-1.5">{value}</p>
      <p className={`text-xs font-medium ${up ? "text-emerald-600" : "text-muted"}`}>{change}</p>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { navigate("/"); return; }
    axios.get(`http://localhost/focused-api/scores.php?user_id=${user.id}`)
      .then((res) => { if (res.data.success) setData(res.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!user?.id) return null;

  const subjects = data?.subjects || [];
  const stats = data?.stats || {};
  const streak = data?.streak || 0;
  const overallAvg = Math.round(parseFloat(stats.overall_avg || 0));
  const totalHours = Math.round(parseInt(stats.total_minutes || 0) / 60);
  const totalQuizzes = parseInt(stats.total_quizzes || 0);

  const weeklyScores = DAYS.map((day) => {
    const found = data?.weekly?.find((w) => w.day?.startsWith(day.slice(0,3)));
    return found ? Math.round(parseFloat(found.avg)) : 0;
  });

  const maxScore = Math.max(...weeklyScores, 1);

  const chartData = {
    labels: DAYS,
    datasets: [{
      data: weeklyScores,
      backgroundColor: weeklyScores.map((s) =>
        s === maxScore && s > 0 ? "#2563eb" : "#dbeafe"
      ),
      hoverBackgroundColor: "#2563eb",
      borderRadius: 4,
      borderSkipped: false,
    }],
  };

  const chartOpts = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.raw}%` } } },
    scales: {
      x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 11, family: "Inter" }, color: "#9ca3af" } },
      y: { display: false },
    },
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  const suggestions = [
    subjects.length > 0 && subjects[subjects.length - 1]
      ? { level: "Review", text: `${subjects[subjects.length - 1]?.subject_name} has your lowest score. Schedule extra study time this week.`, color: "text-amber-600 bg-amber-50 border-amber-200" }
      : null,
    { level: "Tip", text: "Consistent daily review compounds into massive improvement over weeks. Even 30 minutes helps.", color: "text-blue-600 bg-blue-50 border-blue-200" },
    streak >= 7
      ? { level: "Streak", text: `${streak} day streak! Keep the momentum going — consistency is your biggest advantage.`, color: "text-emerald-600 bg-emerald-50 border-emerald-200" }
      : { level: "Streak", text: "Start a study streak today. Logging sessions daily builds long-term retention.", color: "text-muted bg-base border-line" },
  ].filter(Boolean);

  return (
    <div className="sidebar-layout">
      <Sidebar />
      <main className="sidebar-content p-5 md:p-6 flex flex-col gap-5 md:mt-0 mt-12">

        {/* Header */}
        <div className="flex items-start justify-between fade-up">
          <div>
            <h1 className="text-2xl font-bold text-ink tracking-tight">
              {greeting}, {user.name?.split(" ")[0]}.
            </h1>
            <p className="text-sm text-muted mt-0.5">{today}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/reviewer")}
              className="hidden sm:block px-3 py-2 bg-surface border border-line text-gray-700 text-xs font-semibold rounded transition shadow-card hover:bg-base"
            >
              Note Reviewer
            </button>
            <button
              onClick={() => navigate("/timer")}
              className="px-3 py-2 bg-brand text-white text-xs font-semibold rounded transition shadow-card hover:bg-brand-dark"
            >
              Start Session
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard loading={loading} label="Overall Score" value={`${overallAvg}%`} change="All quizzes average" up={overallAvg >= 75} delay={1} />
          <StatCard loading={loading} label="Study Hours" value={`${totalHours}h`} change="Total logged" up={totalHours > 0} delay={2} />
          <StatCard loading={loading} label="Quizzes Done" value={totalQuizzes} change="All time" up={totalQuizzes > 0} delay={3} />
          <StatCard loading={loading} label="Day Streak" value={`${streak}d`} change="Keep going!" delay={4} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          {/* Weekly Chart */}
          <div className="md:col-span-3 bg-surface border border-line rounded-xl p-5 shadow-card fade-up d2">
            {loading ? (
              <div>
                <Skeleton className="h-3.5 w-36 mb-1" />
                <Skeleton className="h-3 w-48 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">Weekly Performance</p>
                    <p className="text-xs text-muted mt-0.5">Average quiz scores this week</p>
                  </div>
                  <span className="text-2xs font-semibold text-brand bg-brand-light px-2 py-0.5 rounded">
                    This Week
                  </span>
                </div>
                <Bar data={chartData} options={chartOpts} height={90} />
              </>
            )}
          </div>

          {/* Subject Performance */}
          <div className="md:col-span-2 bg-surface border border-line rounded-xl p-5 shadow-card fade-up d3">
            {loading ? (
              <div>
                <Skeleton className="h-3.5 w-32 mb-1" />
                <Skeleton className="h-3 w-40 mb-4" />
                {[1,2,3,4].map((i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between mb-1"><Skeleton className="h-3 w-28" /><Skeleton className="h-3 w-8" /></div>
                    <Skeleton className="h-1.5 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm font-semibold text-ink">Subjects</p>
                    <p className="text-xs text-muted mt-0.5">Average scores</p>
                  </div>
                  <span className="text-2xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Live</span>
                </div>
                {subjects.length === 0 ? (
                  <Empty
                    heading="No subjects yet"
                    sub="Add your subjects to start tracking performance"
                    cta="Add Subject"
                    onCta={() => navigate("/subjects")}
                  />
                ) : (
                  subjects.map((s) => (
                    <SubjectBar
                      key={s.id}
                      name={s.subject_name}
                      score={Math.round(parseFloat(s.avg_score || 0))}
                      color={s.color || "#2563eb"}
                    />
                  ))
                )}
              </>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Quick Actions */}
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up d3">
            <p className="text-sm font-semibold text-ink mb-1">Quick Actions</p>
            <p className="text-xs text-muted mb-4">Jump to what you need</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Note Reviewer", path: "/reviewer", desc: "Upload and review" },
                { label: "Quiz Maker", path: "/quiz", desc: "Test yourself" },
                { label: "Focus Timer", path: "/timer", desc: "Start a session" },
                { label: "Weak Topics", path: "/weak", desc: "What to study" },
                { label: "My Subjects", path: "/subjects", desc: "Manage subjects" },
                { label: "Progress", path: "/progress", desc: "See your growth" },
              ].map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="text-left px-3 py-2.5 bg-base border border-line rounded hover:border-brand hover:bg-brand-light transition"
                >
                  <p className="text-xs font-semibold text-ink">{item.label}</p>
                  <p className="text-2xs text-muted mt-0.5">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up d4">
            <p className="text-sm font-semibold text-ink mb-1">Study Suggestions</p>
            <p className="text-xs text-muted mb-4">Based on your performance</p>
            {loading ? (
              <div className="space-y-2">
                {[1,2,3].map((i) => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : (
              <div className="space-y-2">
                {suggestions.map((s, i) => s && (
                  <div key={i} className={`flex gap-3 px-3 py-2.5 rounded border text-xs ${s.color}`}>
                    <span className="font-bold flex-shrink-0 border px-1.5 py-0.5 rounded h-fit mt-0.5"
                      style={{ borderColor: "currentColor", opacity: 0.7 }}>
                      {s.level}
                    </span>
                    <p className="text-gray-600 leading-relaxed">{s.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dark CTA */}
            <div className="mt-4 bg-gray-900 rounded p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-white">Focus Timer</p>
                <p className="text-2xs text-gray-400 mt-0.5">Set your own duration</p>
              </div>
              <button
                onClick={() => navigate("/timer")}
                className="bg-brand hover:bg-brand-dark text-white text-xs font-semibold px-3 py-1.5 rounded transition"
              >
                Start
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}