import React, { useState, useRef } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

export default function AIReviewer() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewer, setReviewer] = useState(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (f) => {
    if (!f) return;
    const ext = f.name.split(".").pop().toLowerCase();
    if (!["txt", "pdf", "docx"].includes(ext)) {
      setError("Please upload a TXT, PDF, or DOCX file.");
      return;
    }
    setFile(f);
    setError("");
  };

  const generate = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setReviewer(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await axios.post("http://localhost/focused-api/upload-notes.php", fd);
      if (!up.data.success) throw new Error(up.data.message);
      const ai = await axios.post("http://localhost/focused-api/ai-reviewer.php", {
        content: up.data.content,
        fileName: up.data.fileName,
      });
      if (!ai.data.success) throw new Error(ai.data.message);
      setReviewer(ai.data.reviewer);
    } catch (e) {
      setError(e.message || "Something went wrong.");
    }
    setLoading(false);
  };

  const sections = reviewer
    ? reviewer.split(/\n(?=[A-Z ]+:)/).map((p) => {
        const i = p.indexOf(":");
        return i > -1 ? { title: p.slice(0, i).trim(), body: p.slice(i + 1).trim() } : null;
      }).filter(Boolean)
    : [];

  return (
    <div className="flex min-h-screen bg-base">
      <Sidebar />
      <main className="ml-52 flex-1 p-6 flex gap-5">

        {/* Left — Upload panel */}
        <div className="w-72 flex-shrink-0 flex flex-col gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Note Reviewer</h1>
            <p className="text-xs text-muted mt-1">Upload your notes and get a complete reviewer</p>
          </div>

          {/* Drop Zone */}
          <div
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              dragOver ? "border-brand bg-brand-light" : "border-line hover:border-gray-300 bg-surface"
            }`}
          >
            <input ref={fileRef} type="file" accept=".txt,.pdf,.docx" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
            {file ? (
              <div>
                <div className="w-10 h-10 bg-brand-light rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-brand text-lg font-bold">{file.name.split(".").pop().toUpperCase()}</span>
                </div>
                <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-muted mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                <p className="text-2xs text-brand mt-2">Click to change file</p>
              </div>
            ) : (
              <div>
                <div className="w-10 h-10 bg-base border border-line rounded-lg flex items-center justify-center mx-auto mb-3">
                  <svg className="w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-700 mb-1">Drop your file here</p>
                <p className="text-xs text-muted">TXT, PDF, or DOCX — up to 20MB</p>
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
              {error}
            </div>
          )}

          <button
            onClick={generate}
            disabled={!file || loading}
            className="w-full py-2.5 bg-brand hover:bg-brand-dark text-white text-sm font-semibold rounded-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate Reviewer"}
          </button>

          {reviewer && (
            <button
              onClick={() => {
                const blob = new Blob([reviewer], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `reviewer-${file?.name}.txt`;
                a.click();
              }}
              className="w-full py-2.5 bg-surface border border-line text-gray-700 text-sm font-medium rounded-lg hover:bg-base transition"
            >
              Save Reviewer
            </button>
          )}

          {reviewer && (
            <button
              onClick={() => { setFile(null); setReviewer(null); setError(""); }}
              className="w-full py-2 text-xs text-muted hover:text-gray-700 transition"
            >
              Start over
            </button>
          )}

          {/* Info */}
          <div className="bg-surface border border-line rounded-xl p-4 mt-auto">
            <p className="text-xs font-semibold text-gray-700 mb-3">What you get</p>
            <div className="space-y-2">
              {["Summary of key topics", "Important concepts explained", "Key terms and definitions", "5 practice questions", "Personalized study tips"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-brand flex-shrink-0" />
                  <p className="text-xs text-muted">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Reviewer Output */}
        <div className="flex-1 min-w-0">
          {!reviewer && !loading && (
            <div className="h-full bg-surface border border-line rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-base border border-line rounded-xl flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-gray-500">Your reviewer will appear here</p>
                <p className="text-xs text-subtle mt-1">Upload a file and click Generate</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="h-full bg-surface border border-line rounded-xl flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full spin mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-700">Generating your reviewer...</p>
                <p className="text-xs text-muted mt-1">This may take a few seconds</p>
              </div>
            </div>
          )}

          {reviewer && sections.length > 0 && (
            <div className="space-y-3 fade-in">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className="text-lg font-bold text-gray-900">Your Reviewer</p>
                  <p className="text-xs text-muted mt-0.5">Based on: {file?.name}</p>
                </div>
                <button onClick={() => window.location.href = '/quiz'} className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-lg hover:bg-brand-dark transition">
                  Take a Quiz
                </button>
              </div>

              {sections.map((s, i) => (
                <div key={i} className="bg-surface border border-line rounded-xl p-5 shadow-card fade-up" style={{ animationDelay: `${i * 0.07}s` }}>
                  <p className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-line">{s.title}</p>
                  <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{s.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}