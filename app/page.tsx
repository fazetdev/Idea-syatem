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
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [activeExecutionId, setActiveExecutionId] = useState(null);
  const [viewingTaskId, setViewingTaskId] = useState(null);
  const [form, setForm] = useState({ title: "", refinedIdea: "", goal: "" });
  const [saving, setSaving] = useState(false);

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
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function handleSave() {
    if (!form.title || !form.refinedIdea) return;
    setSaving(true);
    try {
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setForm({ title: "", refinedIdea: "", goal: "" });
        await fetchIdeas();
      }
    } catch (e) { console.error(e); } finally { setSaving(false); }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    const res = await fetch("/api/ideas/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    });
    if (res.ok) {
      await fetchIdeas();
      setActiveView(newStatus === 'active' ? "Execution Plans" : newStatus === 'milestone' ? "Milestones" : "Tasks");
      setActiveExecutionId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete permanently?")) return;
    const res = await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchIdeas();
  }

  const selectedIdea = ideas.find((i: any) => i.id === (activeExecutionId || viewingTaskId));

  const statsCards = [
    { label: "Ideas", value: ideas.filter((i: any) => i.status === 'captured').length, icon: "◈" },
    { label: "Execution Plans", value: ideas.filter((i: any) => i.status === 'active').length, icon: "⬡" },
    { label: "Milestones", value: ideas.filter((i: any) => i.status === 'milestone').length, icon: "◎" },
    { label: "Tasks", value: ideas.filter((i: any) => i.status === 'task').length, icon: "▦" },
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
              onClick={() => setActiveView(s.label)}
              style={{ cursor: 'pointer' }}
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
              <IdeaForm form={form} setForm={setForm} handleSave={handleSave} saving={saving} />
              <button className="drawer-trigger" onClick={() => setIsInboxOpen(!isInboxOpen)} style={{marginTop:'20px', width:'100%', padding:'10px', background:'#eee', border:'none', borderRadius:'8px', fontWeight:'bold'}}>
                {isInboxOpen ? "CLOSE INBOX" : "VIEW INBOX"}
              </button>
              {isInboxOpen && (
                <IdeaVault ideas={ideas} viewMode="Ideas" onActivate={(id:any) => handleStatusChange(id, 'active')} onDelete={handleDelete} />
              )}
            </div>
          )}

          {activeView === "Execution Plans" && (
            <IdeaVault 
              ideas={ideas} 
              viewMode="Execution Plans" 
              openExecutionModal={(id:any) => setActiveExecutionId(id)} 
              onDelete={handleDelete}
            />
          )}

          {activeView === "Milestones" && (
            <IdeaVault 
              ideas={ideas} 
              viewMode="Milestones" 
              onDelete={handleDelete}
              openExecutionModal={(id:any) => setActiveExecutionId(id)}
              onPromoteToTask={(id:any) => handleStatusChange(id, 'task')}
            />
          )}

          {activeView === "Tasks" && (
            <div className="panel">
              <h2 style={{borderBottom:'1px solid #eee', paddingBottom:'10px'}}>Production Line</h2>
              <IdeaVault 
                ideas={ideas} 
                viewMode="Tasks" 
                onDelete={handleDelete}
                openExecutionModal={(id:any) => setViewingTaskId(id)}
              />
            </div>
          )}
        </div>
      </div>

      {(activeExecutionId || viewingTaskId) && selectedIdea && (
        <ExecutionModal 
          idea={selectedIdea} 
          onClose={() => { setActiveExecutionId(null); setViewingTaskId(null); }} 
          onPromote={activeExecutionId ? (id:any) => handleStatusChange(id, 'milestone') : null}
          isReadOnly={!!viewingTaskId}
        />
      )}
    </div>
  );
}
