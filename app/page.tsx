"use client";

import { useState, useEffect } from "react";
import { IdeaOSStyles } from "./components/IdeaOSStyles";
import { IdeaForm } from "./components/IdeaForm";
import { IdeaVault } from "./components/IdeaVault";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState("Ideas");
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [activeExecution, setActiveExecution] = useState(null);
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

  async function handleActivate(id: string) {
    const res = await fetch("/api/ideas/status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "active" }),
    });
    if (res.ok) {
      await fetchIdeas();
      setActiveView("Execution Plans");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete permanently?")) return;
    const res = await fetch(`/api/ideas?id=${id}`, { method: "DELETE" });
    if (res.ok) fetchIdeas();
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
              onClick={() => setActiveView(s.label)}
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
              <button className="drawer-trigger" onClick={() => setIsInboxOpen(!isInboxOpen)} style={{marginTop:'20px', width:'100%', padding:'10px', background:'#eee', border:'none', borderRadius:'8px'}}>
                {isInboxOpen ? "CLOSE INBOX" : "VIEW INBOX"}
              </button>
              {isInboxOpen && (
                <IdeaVault ideas={ideas} viewMode="Ideas" onActivate={handleActivate} onDelete={handleDelete} />
              )}
            </div>
          )}

          {activeView === "Execution Plans" && (
            <IdeaVault 
              ideas={ideas} 
              viewMode="Execution Plans" 
              openExecutionModal={(id:any) => setActiveExecution(id)} 
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {activeExecution && (
        <div className="modal" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.9)', color:'#fff', padding:'20px', zIndex:2000}}>
          <h2>Workstation: {ideas.find((i:any)=>i.id === activeExecution)?.title}</h2>
          <button onClick={() => setActiveExecution(null)} style={{background:'red', color:'#fff', padding:'10px', border:'none', borderRadius:'5px'}}>CLOSE</button>
          <div style={{marginTop:'20px'}}>Production Logic Ready for Deployment.</div>
        </div>
      )}
    </div>
  );
}
