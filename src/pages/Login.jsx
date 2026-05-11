import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("http://localhost/focused-api/login.php", { email, password });
      if (res.data.success) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard");
      } else {
        setError(res.data.message || "Invalid credentials.");
      }
    } catch {
      setError("Connection failed. Make sure XAMPP is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base flex">

      {/* Left — Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-900 flex-col">
        {/* Subtle mesh using only CSS — no gradients on content */}
        <div className="flex-1 flex flex-col justify-between p-12">
          <p className="text-white text-lg font-bold tracking-tight">
            Focus<span className="text-brand">ED</span>
          </p>

          <div>
            <p className="text-4xl font-bold text-white leading-tight tracking-tight mb-4">
              Study smarter,<br />not harder.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-8">
              FocusED helps Filipino college students study more effectively with smart tools, AI-powered reviewers, and real performance tracking.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 border-t border-gray-800 pt-6">
              {[
                { label: "Students", value: "2,400+" },
                { label: "Study Hours", value: "18k+" },
                { label: "Quizzes Taken", value: "95k+" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-xl font-bold text-white">{s.value}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Features list */}
          <div className="space-y-2">
            {[
              "AI reviewer from your own notes",
              "Smart quiz with integrity detection",
              "Editable focus timer",
              "Subject performance tracking",
            ].map((f) => (
              <div key={f} className="flex items-center gap-2.5">
                <div className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                <p className="text-gray-500 text-xs">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Auth form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-up">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8 text-center">
            <p className="text-2xl font-bold text-ink">
              Focus<span className="text-brand">ED</span>
            </p>
            <p className="text-sm text-muted mt-1">Study Assistant</p>
          </div>

          <div className="mb-7">
            <h1 className="text-2xl font-bold text-ink">Welcome back</h1>
            <p className="text-sm text-muted mt-1">Sign in to continue studying</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Email</label>
              <input
                type="email" value={email} required
                onChange={(e) => { setEmail(e.target.value); setError(""); }}
                placeholder="you@school.edu"
                className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
              <input
                type="password" value={password} required
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="••••••••"
                className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center text-xs text-muted mt-5">
            No account?{" "}
            <a href="/register" className="text-brand font-semibold hover:underline">Create one</a>
          </p>

          {/* Mobile feature list */}
          <div className="lg:hidden mt-8 pt-6 border-t border-line">
            <p className="text-xs font-semibold text-subtle uppercase tracking-wider mb-3">What you get</p>
            <div className="space-y-2">
              {["AI reviewer from your notes","Smart quiz maker","Focus timer","Subject tracking"].map((f) => (
                <div key={f} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                  <p className="text-xs text-muted">{f}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}