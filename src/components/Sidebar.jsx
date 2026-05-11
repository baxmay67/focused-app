import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { section: "Overview", links: [
    { label: "Dashboard",    path: "/dashboard" },
    { label: "Subjects",     path: "/subjects"  },
    { label: "Schedule",     path: "/schedule"  },
    { label: "Focus Timer",  path: "/timer"     },
  ]},
  { section: "Analytics", links: [
    { label: "Progress",     path: "/progress"      },
    { label: "Weak Topics",  path: "/weak"          },
    { label: "Achievements", path: "/achievements"  },
  ]},
  { section: "Study Tools", links: [
    { label: "Note Reviewer", path: "/reviewer" },
    { label: "Quiz Maker",    path: "/quiz"     },
  ]},
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (path) => {
    navigate(path);
    setMobileOpen(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 pt-5 pb-4 border-b border-line">
        <p className="text-lg font-bold text-ink tracking-tight select-none">
          Focus<span className="text-brand">ED</span>
        </p>
        <p className="text-2xs text-subtle mt-0.5">Study Assistant</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {NAV.map((group) => (
          <div key={group.section} className="mb-4">
            <p className="text-2xs font-semibold text-subtle uppercase tracking-widest px-2 mb-1">
              {group.section}
            </p>
            {group.links.map((link) => {
              const active = pathname === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-medium mb-0.5 transition-colors
                    ${active
                      ? "bg-brand-light text-brand"
                      : "text-muted hover:bg-base hover:text-ink"
                    }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-line p-3">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-ink truncate">{user?.name || "Student"}</p>
            <p className="text-2xs text-subtle truncate">{user?.course || ""}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full text-2xs text-subtle hover:text-red-500 transition py-1 rounded hover:bg-red-50 text-center"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 w-52 bg-surface border-r border-line flex-col z-40 shadow-card">
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-surface border-b border-line px-4 py-3 flex items-center justify-between">
        <p className="text-base font-bold text-ink">
          Focus<span className="text-brand">ED</span>
        </p>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-8 h-8 flex items-center justify-center rounded bg-base border border-line"
        >
          {mobileOpen ? (
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 fade-in">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-surface shadow-lg z-50 fade-up">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-line px-2 py-2 flex justify-around">
        {[
          { label: "Home",     path: "/dashboard" },
          { label: "Subjects", path: "/subjects"  },
          { label: "Timer",    path: "/timer"      },
          { label: "Progress", path: "/progress"  },
          { label: "Quiz",     path: "/quiz"       },
        ].map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded transition ${
                active ? "text-brand" : "text-subtle"
              }`}
            >
              <div className={`w-1 h-1 rounded-full mb-0.5 ${active ? "bg-brand" : "bg-transparent"}`} />
              <span className="text-2xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}