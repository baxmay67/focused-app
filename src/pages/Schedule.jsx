import React, { useState } from "react";
import Sidebar from "../components/Sidebar";

function Schedule() {
  const [sessions, setSessions] = useState([
    { id: 1, subject: "Signals & Systems", topic: "Fourier Transform", time: "07:00", duration: "90", color: "#E24B4A" },
    { id: 2, subject: "Data Structures", topic: "Binary Trees & Graphs", time: "14:00", duration: "60", color: "#BA7517" },
    { id: 3, subject: "Engineering Math", topic: "Review & Practice Quiz", time: "19:00", duration: "45", color: "#639922" },
  ]);

  const [form, setForm] = useState({
    subject: "", topic: "", time: "", duration: "",
  });

  const [showForm, setShowForm] = useState(false);

  const colors = ["#E24B4A", "#BA7517", "#639922", "#378ADD", "#888780", "#7C3AED"];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newSession = {
      id: Date.now(),
      ...form,
      color: colors[Math.floor(Math.random() * colors.length)],
    };
    setSessions([...sessions, newSession]);
    setForm({ subject: "", topic: "", time: "", duration: "" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  const formatTime = (time) => {
    const [h, m] = time.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${m} ${ampm}`;
  };

  const sorted = [...sessions].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-52 flex-1 px-8 py-7">

        {/* Header */}
        <div className="flex items-start justify-between mb-7">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Study Schedule</h2>
            <p className="text-sm text-gray-400 mt-0.5">Plan your study sessions for today</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            + Add Session
          </button>
        </div>

        {/* Add Session Form */}
        {showForm && (
          <div className="bg-white border border-gray-100 rounded-xl px-6 py-5 shadow-sm mb-6">
            <p className="text-sm font-semibold text-gray-800 mb-4">New Study Session</p>
            <form onSubmit={handleAdd} className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Subject</label>
                <input name="subject" value={form.subject} onChange={handleChange} required
                  placeholder="e.g. Engineering Math"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Topic</label>
                <input name="topic" value={form.topic} onChange={handleChange} required
                  placeholder="e.g. Fourier Transform"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Start Time</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Duration (minutes)</label>
                <input name="duration" type="number" value={form.duration} onChange={handleChange} required
                  placeholder="e.g. 60"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400" />
              </div>
              <div className="col-span-2 flex gap-3">
                <button type="submit"
                  className="bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-700 transition">
                  Save Session
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="bg-gray-100 text-gray-500 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-200 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Schedule List */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <p className="text-sm font-semibold text-gray-800">
              Today's Sessions
              <span className="ml-2 text-xs font-normal text-gray-400">
                {sorted.length} scheduled
              </span>
            </p>
          </div>

          {sorted.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-400 text-sm">No sessions yet. Click + Add Session to start!</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {sorted.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition">
                  <span className="text-xs font-mono text-gray-400 w-16 flex-shrink-0">
                    {formatTime(item.time)}
                  </span>
                  <div className="w-0.5 h-8 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.subject}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.topic}</p>
                  </div>
                  <span className="text-xs font-mono text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                    {item.duration} min
                  </span>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-gray-300 hover:text-red-400 transition ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Total Study Time */}
        <div className="mt-4 bg-gray-900 rounded-xl px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">Total study time today</p>
          <p className="text-sm font-semibold text-white">
            {sorted.reduce((acc, s) => acc + parseInt(s.duration || 0), 0)} minutes
          </p>
        </div>

      </main>
    </div>
  );
}

export default Schedule;