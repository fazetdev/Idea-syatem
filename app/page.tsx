"use client";

import { useState, useEffect } from "react";
import { IdeaOSStyles } from "./components/IdeaOSStyles";
import { IdeaForm } from "./components/IdeaForm";
import { IdeaVault } from "./components/IdeaVault";
import { ExecutionModal } from "./components/ExecutionModal";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("Ideas");
  const [isInboxOpen, setIsInboxOpen] = useState(false); // Controls the drawer
  const [activeExecution, setActiveExecution] = useState(null);
  const [form, setForm] = useState({ title: "", refinedIdea: "", goal: "" });

  useEffect(() => {
    setMounted(true);
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleActivate(id: string) {
    const res = await fetch("/api/ideas/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "active" }),
    });
    if (res.ok) {
      await fetchIdeas();
      setActiveView("Execution Plans");
      setIsInboxOpen(false);
    }
  }

  const statsCards = [
    { label: "Ideas", value: ideas.filter((i: any) => i.status === 'captured').length, icon: "◈" },
    { label: "Execution Plans", value: ideas.filter((i: any) => i.status === 'active').length, icon: "⬡" },
    { label: "Milestones", value: 0, icon: "◎" },
    { label: "Tasks", value: 0, icon: "▦" },
  ];

  if (!mounted) return null;

  return (
    <div className="main-wrapper">
      <IdeaOSStyles />
      <div className="shell">
        <nav>
          <div className="logo"><div className="logo-mark">◈</div>Idea OS</div>
          <div className="nav-pill"><span className="dot" />System Active</div>
        </nav>

        <div className="stats-grid">
          {statsCards.map((s) => (
            <div 
              key={s.label} 
              className={`stat-card ${activeView === s.label ? 'active-box' : ''}`}
              onClick={() => {
                setActiveView(s.label);
                if (s.label === "Ideas") setIsInboxOpen(!isInboxOpen);
              }}
            >
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="main-content">
          {activeView === "Ideas" && (
            <div className="panel">
              <IdeaForm form={form} setForm={setForm} handleSave={fetchIdeas} />
              
              {/* This is the "Inbox Folder" that only opens on touch */}
              <div className="inbox-drawer" style={{ marginTop: '20px' }}>
                <button 
                  className="drawer-trigger"
                  onClick={() => setIsInboxOpen(!isInboxOpen)}
                >
                  {isInboxOpen ? "▼ CLOSE INBOX" : "▶ VIEW INBOX (" + ideas.filter((i:any)=>i.status==='captured').length + ")"}
                </button>
                
                {isInboxOpen && (
                  <div className="drawer-content" style={{ marginTop: '15px' }}>
                    <IdeaVault 
                      loading={loading} 
                      ideas={ideas} 
                      viewMode="Ideas"
                      onActivate={handleActivate}
                      openExecutionModal={() => {}}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeView === "Execution Plans" && (
            <IdeaVault 
              loading={loading} 
              ideas={ideas} 
              viewMode="Execution Plans"
              onActivate={() => {}}
              openExecutionModal={(id) => setActiveExecution(id)} 
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .drawer-trigger {
          width: 100%;
          background: var(--surface-subtle);
          border: 1px dashed var(--border);
          padding: 12px;
          border-radius: 8px;
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-secondary);
          cursor: pointer;
          font-weight: bold;
        }
        .active-box {
          border: 2px solid var(--accent-gold) !important;
          background: var(--accent-gold-light) !important;
        }
      `}</style>
    </div>
  );
}
