import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Companion() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your study assistant. Ask me anything about your subjects, study tips, or anything you're confused about.",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const inputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      inputRef.current?.focus();
    }
  }, [open, messages]);

  const send = async () => {
    const msg = input.trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.slice(1).slice(-10);
      const res = await axios.post("http://focused-app-api.fwh.is/companion.php", {
        message: msg,
        history: history.slice(0, -1),
        userName: user?.name || "Student",
        course: user?.course || "College",
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: res.data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, I couldn't process that. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection error. Make sure XAMPP is running." },
      ]);
    }

    setLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quickQuestions = [
    "How do I study more effectively?",
    "Explain Fourier Transform simply",
    "Give me tips for exam day",
    "How to avoid distractions?",
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-5 w-11 h-11 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-dropdown z-50 transition-all hover:bg-gray-700 ${open ? "rotate-45" : ""}`}
        style={{ transition: "transform 0.2s ease, background 0.15s ease" }}
      >
        {open ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-20 right-5 w-80 bg-surface border border-line rounded-xl shadow-modal z-50 flex flex-col overflow-hidden fade-up"
          style={{ height: "420px" }}
        >

          {/* Header */}
          <div className="px-4 py-3 border-b border-line flex items-center justify-between bg-surface flex-shrink-0">
            <div>
              <p className="text-sm font-semibold text-gray-900">Study Assistant</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-2xs text-muted">Online</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{
                role: "assistant",
                content: "Hi! I'm your study assistant. Ask me anything about your subjects, study tips, or anything you're confused about.",
              }])}
              className="text-2xs text-muted hover:text-gray-700 transition px-2 py-1 rounded hover:bg-base"
            >
              Clear
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${
                    msg.role === "user"
                      ? "bg-brand text-white"
                      : "bg-base border border-line text-gray-700"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-base border border-line px-3 py-2 rounded-xl">
                  <div className="flex gap-1 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick Questions — only show at start */}
            {messages.length === 1 && (
              <div className="space-y-1.5 pt-1">
                <p className="text-2xs text-subtle">Quick questions</p>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => { setInput(q); inputRef.current?.focus(); }}
                    className="w-full text-left text-2xs text-muted bg-base border border-line px-2.5 py-1.5 rounded-lg hover:border-gray-300 hover:text-gray-700 transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2.5 border-t border-line bg-surface flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask anything..."
                rows={1}
                className="flex-1 resize-none border border-line rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-brand transition bg-base placeholder-subtle"
                style={{ maxHeight: "80px" }}
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-8 h-8 bg-brand hover:bg-brand-dark text-white rounded-lg flex items-center justify-center flex-shrink-0 transition disabled:opacity-40 self-end"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-2xs text-subtle mt-1.5 text-center">Enter to send · Shift+Enter for new line</p>
          </div>

        </div>
      )}
    </>
  );
}