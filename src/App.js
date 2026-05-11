import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import FocusTimer from "./pages/FocusTimer";
import Schedule from "./pages/Schedule";
import Subjects from "./pages/Subjects";
import Progress from "./pages/Progress";
import WeakTopics from "./pages/WeakTopics";
import QuizMaker from "./pages/QuizMaker";
import AIReviewer from "./pages/AIReviewer";
import Achievements from "./pages/Achievements";
import Companion from "./components/Companion";

function AppContent() {
  const { pathname } = useLocation();
  const hide = pathname === "/" || pathname === "/register";
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timer" element={<FocusTimer />} />
        <Route path="/schedule" element={<Schedule />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/weak" element={<WeakTopics />} />
        <Route path="/quiz" element={<QuizMaker />} />
        <Route path="/reviewer" element={<AIReviewer />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
      {!hide && <Companion />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}