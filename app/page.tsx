"use client";

import { useState, useEffect } from "react";
import { IdeaOSStyles } from "./components/IdeaOSStyles";
import { IdeaForm } from "./components/IdeaForm";
import { IdeaVault } from "./components/IdeaVault";
import { ExecutionModal } from "./components/ExecutionModal";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({ title: "", refinedIdea: "", goal: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeExecution, setActiveExecution] = useState(null);
  const [activeView, setActiveView] = useState("Ideas"); // Tracks which box is clicked

  useEffect(() => {
    setMounted(true);
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    setLoading(true);
    try {
      const res = await fetch("/api/ideas");
      const data = await res.json();
      setIdeas(data.ideas || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!form.title || !form.refinedIdea || !form.goal) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", refinedIdea: "", goal: "" });
        setSaved(true);
        await fetchIdeas();
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  async function handleActivate(id: string) {
    try {
      const res = await fetch("/api/ideas/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "active" }),
      });
      if (res.ok) {
        await fetchIdeas();
        setActiveView("Execution Plans"); // Automatically switch to show the active idea
      }
    } catch (e) {
      console.error(e);
    }
  }

  const statsCards = [
    { label: "Ideas", value: ideas.filter((i: any) => i.status === 'captured').length, icon: "◈", color: "var(--accent-gold)" },
    { label: "Execution Plans", value: ideas.filter((i: any) => i.status === 'active').length, icon: "⬡", color: "var(--accent-gold-light)" },
    { label: "Milestones", value: 0, icon: "◎", color: "var(--accent-green)" },
    { label: "Tasks", value: 0, icon: "▦", color: "var(--accent-green-light)" },
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

        <section className="hero">
          <div className="hero-eyebrow">◈ Execution Layer v1</div>
          <h1>Capture Ideas.<br /><em>Build Systems.</em></h1>
          <p>Your production environment. Click the boxes above to navigate between your Inbox and Active projects.</p>
        </section>

        <div className="stats-grid">
          {statsCards.map((s) => (
            <div 
              key={s.label} 
              className={`stat-card ${activeView === s.label ? 'active-box' : ''}`}
              onClick={() => setActiveView(s.label)}
              style={{ cursor: 'pointer', border: activeView === s.label ? '2px solid var(--accent-gold)' : '1px solid var(--border)' }}
            >
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="main-grid">
          {activeView === "Ideas" ? (
            <>
              <IdeaForm form={form} setForm={setForm} handleSave={handleSave} saving={saving} saved={saved} />
              <IdeaVault 
                loading={loading} 
                ideas={ideas} 
                viewMode="Ideas"
                onActivate={handleActivate}
                openExecutionModal={(id) => setActiveExecution(id)} 
              />
            </>
          ) : (
            <div style={{ gridColumn: 'span 2' }}>
              <IdeaVault 
                loading={loading} 
                ideas={ideas} 
                viewMode="Execution Plans"
                onActivate={handleActivate}
                openExecutionModal={(id) => setActiveExecution(id)} 
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
