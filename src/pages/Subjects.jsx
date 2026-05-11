import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const COLORS = ["#2563eb","#059669","#7c3aed","#d97706","#dc2626","#0891b2"];

export default function Subjects() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", score: "", target: "" });
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      const res = await axios.get(`http://fw.is/subjects.php?user_id=${user.id}`);
      if (res.data.success) setSubjects(res.data.subjects);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await axios.post("http://fw.is/subjects.php", {
        user_id: user.id,
        name: form.name,
        score: parseInt(form.score),
        target: parseInt(form.target),
        color: COLORS[subjects.length % COLORS.length],
      });
      if (res.data.success) {
        setForm({ name: "", score: "", target: "" });
        setShowForm(false);
        load();
      }
    } catch {}
    setSaving(false);
  };

  const remove = async (id) => {
    try {
      await axios.delete("http://fw.is/subjects.php", {
        data: { id },
      });
      setSubjects(subjects.filter((s) => s.id !== id));
    } catch {}
  };

  const getScore = (s) => Math.round(parseFloat(s.avg_score || s.score || 0));
  const getTarget = (s) => parseInt(s.target_score || s.target || 75);

  const statusOf = (score, target) => {
    if (score >= target) return { label: "On Track", cls: "text-emerald-600 bg-emerald-50 border-emerald-200" };
    if (score >= target - 10) return { label: "Almost", cls: "text-amber-600 bg-amber-50 border-amber-200" };
    return { label: "Needs Work", cls: "text-red-600 bg-red-50 border-red-200" };
  };

  const avg = subjects.length > 0
    ? Math.round(subjects.reduce((a, s) => a + getScore(s), 0) / subjects.length)
    : 0;

  const onTrack = subjects.filter((s) => getScore(s) >= getTarget(s)).length;

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex flex-col gap-5">

        <div className="flex items-start justify-between fade-up">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
            <p className="text-sm text-muted mt-0.5">Track your performance across all subjects</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition shadow-card"
          >
            Add Subject
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 fade-up d1">
          {[
            { label: "Subjects Enrolled", value: subjects.length },
            { label: "Average Score", value: `${avg}%` },
            { label: "On Track", value: `${onTrack}/${subjects.length}` },
          ].map((s) => (
            <div key={s.label} className="bg-surface border border-line rounded-xl p-4 shadow-card">
              <p className="text-2xs font-semibold text-subtle uppercase tracking-wider mb-1">{s.label}</p>
              <p className="text-3xl font-bold text-gray-900 tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up">
            <p className="text-sm font-semibold text-gray-900 mb-4">Add New Subject</p>
            <form onSubmit={add} className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Subject Name</label>
                <input
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required placeholder="e.g. Engineering Math"
                  className="w-full border border-line bg-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Current Score (%)</label>
                <input
                  type="number" min={0} max={100}
                  value={form.score} onChange={(e) => setForm({ ...form, score: e.target.value })}
                  required placeholder="e.g. 75"
                  className="w-full border border-line bg-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 block mb-1">Target Score (%)</label>
                <input
                  type="number" min={0} max={100}
                  value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}
                  required placeholder="e.g. 85"
                  className="w-full border border-line bg-base rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-brand transition"
                />
              </div>
              <div className="col-span-3 flex gap-2">
                <button type="submit" disabled={saving}
                  className="px-5 py-2 bg-brand text-white text-sm font-semibold rounded-lg hover:bg-brand-dark transition disabled:opacity-50">
                  {saving ? "Saving..." : "Save"}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-5 py-2 bg-base border border-line text-sm text-muted rounded-lg hover:bg-line transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 flex-1 fade-up d2">
          <div className="col-span-2 bg-surface border border-line rounded-xl shadow-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-900">All Subjects</p>
              <p className="text-xs text-muted">{subjects.length} enrolled</p>
            </div>

            {loading ? (
              <div className="px-5 py-8 text-center">
                <p className="text-xs text-muted">Loading subjects...</p>
              </div>
            ) : subjects.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <p className="text-sm text-muted">No subjects yet.</p>
                <p className="text-xs text-subtle mt-1">Click Add Subject to get started.</p>
              </div>
            ) : (
              <div className="divide-y divide-line">
                {subjects.map((s) => {
                  const score = getScore(s);
                  const target = getTarget(s);
                  const st = statusOf(score, target);
                  const gap = target - score;
                  return (
                    <div key={s.id} className="px-5 py-4 hover:bg-base transition">
                      <div className="flex items-center gap-4 mb-3">
                        <div className="w-1 h-10 rounded-full flex-shrink-0" style={{ background: s.color || "#2563eb" }} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-sm font-semibold text-gray-800 truncate">{s.subject_name || s.name}</p>
                            <span className={`text-2xs font-semibold px-1.5 py-0.5 rounded border flex-shrink-0 ${st.cls}`}>
                              {st.label}
                            </span>
                          </div>
                          <p className="text-xs text-muted">
                            Target: {target}% ·{" "}
                            {gap > 0
                              ? <span className="text-red-500">{gap} points to go</span>
                              : <span className="text-emerald-500">Target reached</span>
                            }
                          </p>
                        </div>
                        <p className="text-2xl font-bold tabular-nums text-gray-900">{score}%</p>
                        <button onClick={() => remove(s.id)} className="text-subtle hover:text-red-500 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div className="ml-5">
                        <div className="h-1.5 bg-base rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: s.color || "#2563eb" }} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-surface border border-line rounded-xl p-5 shadow-card">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Score Distribution</p>
              <div className="space-y-3">
                {[
                  { label: "90–100%", count: subjects.filter((s) => getScore(s) >= 90).length, color: "#2563eb" },
                  { label: "80–89%", count: subjects.filter((s) => getScore(s) >= 80 && getScore(s) < 90).length, color: "#059669" },
                  { label: "70–79%", count: subjects.filter((s) => getScore(s) >= 70 && getScore(s) < 80).length, color: "#d97706" },
                  { label: "Below 70%", count: subjects.filter((s) => getScore(s) < 70).length, color: "#dc2626" },
                ].map((r) => (
                  <div key={r.label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs text-muted">{r.label}</span>
                      <span className="text-xs font-semibold tabular-nums text-gray-700">{r.count}</span>
                    </div>
                    <div className="h-1.5 bg-base rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: subjects.length > 0 ? `${(r.count / subjects.length) * 100}%` : "0%", backgroundColor: r.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface border border-line rounded-xl p-5 shadow-card flex-1">
              <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">Needs Attention</p>
              {subjects.filter((s) => getScore(s) < getTarget(s)).length === 0 ? (
                <p className="text-xs text-muted">All subjects are on track.</p>
              ) : (
                <div className="space-y-2">
                  {subjects
                    .filter((s) => getScore(s) < getTarget(s))
                    .sort((a, b) => getScore(a) - getScore(b))
                    .map((s) => (
                      <div key={s.id} className="flex items-center justify-between px-3 py-2.5 bg-base border border-line rounded-lg">
                        <div>
                          <p className="text-xs font-semibold text-gray-700 truncate max-w-28">{s.subject_name || s.name}</p>
                          <p className="text-2xs text-muted mt-0.5">Need +{getTarget(s) - getScore(s)}%</p>
                        </div>
                        <p className="text-sm font-bold tabular-nums text-red-600">{getScore(s)}%</p>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}