import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const COURSES = [
  "Computer Engineering", "Computer Science",
  "Information Technology", "Electronics Engineering",
  "Civil Engineering", "Mechanical Engineering",
  "Nursing", "Education", "Business Administration",
  "Accountancy", "Other",
];

const STEPS = ["Account", "Profile", "Done"];

export default function Register() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: "", email: "", password: "", confirm: "",
    course: "", year_level: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const change = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep = () => {
    if (step === 0) {
      if (!form.email || !form.password || !form.confirm) {
        setError("Please fill in all fields."); return false;
      }
      if (form.password !== form.confirm) {
        setError("Passwords do not match."); return false;
      }
      if (form.password.length < 6) {
        setError("Password must be at least 6 characters."); return false;
      }
    }
    if (step === 1) {
      if (!form.name || !form.course || !form.year_level) {
        setError("Please fill in all fields."); return false;
      }
    }
    setError("");
    return true;
  };

  const next = () => { if (validateStep()) setStep((s) => s + 1); };
  const back = () => { setStep((s) => s - 1); setError(""); };

  const submit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost/focused-api/register.php", form);
      if (res.data.success) {
        setStep(2);
        setTimeout(() => navigate("/"), 2500);
      } else {
        setError(res.data.message);
        setStep(1);
      }
    } catch {
      setError("Connection failed. Make sure XAMPP is running.");
      setStep(1);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base flex">

      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-2/5 bg-gray-900 flex-col justify-between p-12">
        <p className="text-white text-lg font-bold tracking-tight">
          Focus<span className="text-brand">ED</span>
        </p>
        <div>
          <p className="text-white text-3xl font-bold leading-tight mb-3">
            Start your<br />study journey.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Join thousands of Filipino college students using FocusED to study smarter and perform better.
          </p>
        </div>
        <div className="space-y-2">
          {[
            "AI-generated reviewers from your notes",
            "Smart quiz maker with integrity detection",
            "Focus timer with custom durations",
            "Performance tracking per subject",
          ].map((f) => (
            <div key={f} className="flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
              <p className="text-gray-400 text-sm">{f}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm fade-up">

          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              {STEPS.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i < step ? "bg-brand text-white"
                      : i === step ? "bg-brand text-white"
                      : "bg-line text-subtle"
                    }`}>
                      {i < step ? (
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        i + 1
                      )}
                    </div>
                    <p className={`text-2xs mt-1 font-medium ${i <= step ? "text-brand" : "text-subtle"}`}>{s}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-colors ${i < step ? "bg-brand" : "bg-line"}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Step 0 — Account */}
          {step === 0 && (
            <div className="fade-up">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink">Create your account</h1>
                <p className="text-sm text-muted mt-1">Set up your login credentials</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Email Address</label>
                  <input
                    name="email" type="email" value={form.email} onChange={change}
                    placeholder="you@school.edu"
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Password</label>
                  <input
                    name="password" type="password" value={form.password} onChange={change}
                    placeholder="Minimum 6 characters"
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Confirm Password</label>
                  <input
                    name="confirm" type="password" value={form.confirm} onChange={change}
                    placeholder="Repeat your password"
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  />
                </div>
                <button onClick={next} className="w-full bg-brand hover:bg-brand-dark text-white py-2.5 rounded text-sm font-semibold transition mt-1">
                  Continue
                </button>
              </div>

              <p className="text-center text-xs text-muted mt-5">
                Already have an account?{" "}
                <a href="/" className="text-brand font-semibold hover:underline">Sign in</a>
              </p>
            </div>
          )}

          {/* Step 1 — Profile */}
          {step === 1 && (
            <div className="fade-up">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink">Your profile</h1>
                <p className="text-sm text-muted mt-1">Tell us about yourself</p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2.5 rounded mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Full Name</label>
                  <input
                    name="name" value={form.name} onChange={change}
                    placeholder="Juan Dela Cruz"
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Course / Degree</label>
                  <select
                    name="course" value={form.course} onChange={change}
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  >
                    <option value="">Select your course</option>
                    {COURSES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 block mb-1">Year Level</label>
                  <select
                    name="year_level" value={form.year_level} onChange={change}
                    className="w-full border border-line bg-surface rounded px-3 py-2.5 text-sm focus:outline-none focus:border-brand focus:shadow-input transition"
                  >
                    <option value="">Select year level</option>
                    {["1st Year","2nd Year","3rd Year","4th Year","5th Year"].map((y, i) => (
                      <option key={y} value={i + 1}>{y}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-2 mt-1">
                  <button onClick={back} className="flex-1 py-2.5 bg-base border border-line text-sm text-muted rounded font-medium hover:bg-line transition">
                    Back
                  </button>
                  <button onClick={submit} disabled={loading} className="flex-1 py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded transition disabled:opacity-50">
                    {loading ? "Creating..." : "Create Account"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Done */}
          {step === 2 && (
            <div className="text-center fade-up">
              <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-xl font-bold text-ink mb-2">Account created!</p>
              <p className="text-sm text-muted mb-1">Welcome to FocusED, {form.name.split(" ")[0]}.</p>
              <p className="text-xs text-subtle">Redirecting to login...</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}