"use client";

import { useState, useEffect } from "react";

interface Idea {
  id: string;
  title: string;
  refinedIdea: string;
  goal: string;
  createdAt: string;
}

interface Milestone {
  id: number;
  title: string;
  description: string;
  target_date: string;
  status: string;
}

interface Task {
  id: number;
  task: string;
  duration_minutes: number;
  scheduled_time: string;
  status: string;
}

export default function HomePage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [form, setForm] = useState({ title: "", refinedIdea: "", goal: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeExecution, setActiveExecution] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", targetDate: "" });
  const [newTask, setNewTask] = useState({ task: "", durationMinutes: "", scheduledTime: "" });
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
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

  async function fetchExecutionData(ideaId: string) {
    try {
      const milestonesRes = await fetch(`/api/milestones?ideaId=${ideaId}`);
      const milestonesData = await milestonesRes.json();
      setMilestones(milestonesData.milestones || []);
      
      const tasksMap: Record<number, Task[]> = {};
      for (const milestone of milestonesData.milestones || []) {
        const tasksRes = await fetch(`/api/tasks?milestoneId=${milestone.id}`);
        const tasksData = await tasksRes.json();
        tasksMap[milestone.id] = tasksData.tasks || [];
      }
      setTasks(tasksMap);
    } catch (error) {
      console.error("Error fetching execution data:", error);
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

  async function addMilestone() {
    if (!newMilestone.title || !activeExecution) return;
    setAddingMilestone(true);
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: parseInt(activeExecution),
          title: newMilestone.title,
          description: newMilestone.description,
          targetDate: newMilestone.targetDate
        })
      });
      if (res.ok) {
        setNewMilestone({ title: "", description: "", targetDate: "" });
        await fetchExecutionData(activeExecution);
      }
    } catch (error) {
      console.error("Error adding milestone:", error);
    } finally {
      setAddingMilestone(false);
    }
  }

  async function addTask() {
    if (!newTask.task || !selectedMilestone) return;
    setAddingTask(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          milestoneId: selectedMilestone,
          task: newTask.task,
          durationMinutes: parseInt(newTask.durationMinutes) || null,
          scheduledTime: newTask.scheduledTime || null
        })
      });
      if (res.ok) {
        setNewTask({ task: "", durationMinutes: "", scheduledTime: "" });
        await fetchExecutionData(activeExecution!);
      }
    } catch (error) {
      console.error("Error adding task:", error);
    } finally {
      setAddingTask(false);
    }
  }

  function openExecutionModal(ideaId: string) {
    setActiveExecution(ideaId);
    fetchExecutionData(ideaId);
    setSelectedMilestone(null);
  }

  const totalMilestones = milestones.length;
  const totalTasks = Object.values(tasks).reduce((acc, curr) => acc + curr.length, 0);

  const statsCards = [
    { label: "Ideas", value: ideas.length, icon: "◈", color: "var(--accent-gold)" },
    { label: "Execution Plans", value: ideas.filter(i => i.id === activeExecution).length, icon: "⬡", color: "var(--accent-gold-light)" },
    { label: "Milestones", value: totalMilestones, icon: "◎", color: "var(--accent-green)" },
    { label: "Tasks", value: totalTasks, icon: "▦", color: "var(--accent-green-light)" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a1208;
          --surface: #0e1a0c;
          --surface-2: #142810;
          --surface-3: #1a3515;
          --border: rgba(212, 175, 55, 0.15);
          --border-hover: rgba(212, 175, 55, 0.3);
          --text-primary: #e8ead8;
          --text-secondary: #9ba88d;
          --text-muted: #4a5a3d;
          --accent-gold: #d4af37;
          --accent-gold-light: #f0c45a;
          --accent-gold-dark: #b8941e;
          --accent-green: #2e7d32;
          --accent-green-light: #4caf50;
          --accent-green-dark: #1b5e20;
          --accent-main: #d4af37;
          --glow-main: rgba(212, 175, 55, 0.15);
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }
        html { scroll-behavior: smooth; }
        body {
          background: var(--bg);
          color: var(--text-primary);
          font-family: var(--font-display);
          min-height: 100vh;
          overflow-x: hidden;
        }
        body::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: linear-gradient(rgba(212, 175, 55, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212, 175, 55, 0.03) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
          z-index: 0;
        }
        .shell { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; margin-bottom: 72px; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-primary); }
        .logo-mark { width: 30px; height: 30px; border: 1.5px solid var(--accent-gold); border-radius: 6px; display: grid; place-items: center; font-size: 14px; color: var(--accent-gold); box-shadow: 0 0 12px var(--glow-main); }
        .nav-pill { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--surface); }
        .nav-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-green-light); box-shadow: 0 0 6px var(--accent-green-light); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .hero { margin-bottom: 64px; animation: fadeUp 0.6s ease both; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 20px; padding: 5px 12px; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 4px; background: rgba(212, 175, 55, 0.05); }
        .hero h1 { font-size: clamp(42px, 7vw, 72px); font-weight: 800; line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 18px; }
        .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero p { font-size: 16px; color: var(--text-secondary); max-width: 480px; line-height: 1.7; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 56px; animation: fadeUp 0.6s 0.1s ease both; }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; position: relative; transition: border-color 0.2s, transform 0.2s; }
        .stat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color), transparent); opacity: 0.6; }
        .stat-icon { font-size: 18px; color: var(--color); margin-bottom: 12px; display: block; filter: drop-shadow(0 0 6px var(--color)); }
        .stat-value { font-size: 32px; font-weight: 800; line-height: 1; letter-spacing: -0.03em; margin-bottom: 4px; }
        .stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; animation: fadeUp 0.6s 0.2s ease both; }
        @media (max-width: 820px) { .main-grid { grid-template-columns: 1fr; } }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .panel-header { padding: 20px 24px 0; display: flex; align-items: center; justify-content: space-between; }
        .panel-title { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
        .panel-title::before { content: ''; display: block; width: 3px; height: 14px; background: var(--accent-gold); border-radius: 2px; box-shadow: 0 0 8px var(--accent-gold); }
        .panel-body { padding: 20px 24px 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; }
        .field input, .field textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-family: var(--font-display); font-size: 14px; color: var(--text-primary); outline: none; transition: border-color 0.2s; resize: none; }
        .field input:focus, .field textarea:focus { border-color: rgba(212, 175, 55, 0.4); box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.08); }
        .field textarea { min-height: 80px; line-height: 1.6; }
        .btn-save { width: 100%; padding: 13px; border: none; border-radius: 9px; font-family: var(--font-display); font-size: 14px; font-weight: 700; letter-spacing: 0.04em; cursor: pointer; transition: opacity 0.2s; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%); color: #0a1208; box-shadow: 0 4px 20px rgba(212, 175, 55, 0.3); margin-top: 4px; }
        .btn-save:hover:not(:disabled) { opacity: 0.9; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .ideas-feed { display: flex; flex-direction: column; gap: 10px; max-height: 480px; overflow-y: auto; padding-right: 4px; }
        .ideas-feed::-webkit-scrollbar { width: 4px; }
        .ideas-feed::-webkit-scrollbar-thumb { background: var(--border); border-radius: 2px; }
        .idea-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; transition: border-color 0.2s; }
        .idea-card:hover { border-color: var(--border-hover); }
        .idea-card-title { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
        .idea-card-goal { font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .idea-card-footer { display: flex; align-items: center; justify-content: space-between; }
        .idea-date { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
        .btn-execute { padding: 5px 11px; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 6px; background: rgba(212, 175, 55, 0.06); color: var(--accent-gold); font-family: var(--font-mono); font-size: 10px; cursor: pointer; transition: all 0.2s; }
        .btn-execute:hover { background: rgba(212, 175, 55, 0.12); border-color: rgba(212, 175, 55, 0.5); }
        .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10, 18, 8, 0.95); backdrop-filter: blur(8px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border: 1px solid var(--border-hover); border-radius: 20px; width: 100%; max-width: 700px; max-height: 80vh; overflow-y: auto; padding: 32px; position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface-2); color: var(--text-secondary); cursor: pointer; }
        .modal h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .modal-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 28px; text-transform: uppercase; }
        .milestone-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 12px; }
        .milestone-title { font-weight: 700; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
        .task-item { background: var(--surface-3); border-radius: 6px; padding: 10px; margin-top: 8px; margin-left: 16px; font-size: 13px; display: flex; justify-content: space-between; align-items: center; }
        .add-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .small-input { margin-top: 8px; display: flex; gap: 8px; flex-wrap: wrap; }
        .small-input input { flex: 1; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 8px 12px; color: var(--text-primary); }
        .small-btn { padding: 8px 16px; background: var(--accent-gold); color: #0a1208; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="shell">
        <nav>
          <div className="logo"><div className="logo-mark">◈</div>Idea OS</div>
          <div className="nav-pill"><span className="dot" />System Active</div>
        </nav>

        <section className="hero">
          <div className="hero-eyebrow">◈ Execution Layer v1</div>
          <h1>Capture Ideas.<br /><em>Build Systems.</em></h1>
          <p>Refine raw thoughts into executable frameworks. Every idea becomes a milestone-driven operating plan.</p>
        </section>

        <div className="stats-grid">
          {statsCards.map((s) => (
            <div className="stat-card" key={s.label} style={{ "--color": s.color } as React.CSSProperties}>
              <span className="stat-icon">{s.icon}</span>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="main-grid">
          <div className="panel">
            <div className="panel-header"><div className="panel-title">New Idea</div></div>
            <div className="panel-body">
              <div className="field"><label>Title</label><input type="text" placeholder="Name this idea..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div className="field"><label>Refined Idea</label><textarea placeholder="What's the refined concept?" value={form.refinedIdea} onChange={(e) => setForm({ ...form, refinedIdea: e.target.value })} /></div>
              <div className="field"><label>Goal / Outcome</label><input type="text" placeholder="What does success look like?" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} /></div>
              <button className="btn-save" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : saved ? "✓ Saved" : "Save Idea"}</button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header"><div className="panel-title">Idea Vault</div></div>
            <div className="panel-body">
              {loading ? (<div className="empty-state"><div className="stat-icon">◈</div><p>Loading ideas...</p></div>)
              : ideas.length === 0 ? (<div className="empty-state"><div className="stat-icon">◈</div><p>No ideas yet. Create one →</p></div>)
              : (<div className="ideas-feed">{ideas.map((idea) => (
                <div key={idea.id} className="idea-card">
                  <div className="idea-card-title">{idea.title}</div>
                  <div className="idea-card-goal">{idea.goal}</div>
                  <div className="idea-card-footer">
                    <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
                    <button className="btn-execute" onClick={() => openExecutionModal(idea.id)}>⚡ Plan Execution</button>
                  </div>
                </div>
              ))}</div>)}
            </div>
          </div>
        </div>
      </div>

      {activeExecution && (
        <div className="modal-overlay" onClick={() => setActiveExecution(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveExecution(null)}>✕</button>
            <h2>Execution Blueprint</h2>
            <div className="modal-sub">Build your system with milestones and tasks</div>
            
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--accent-gold)" }}>📌 Milestones</h3>
              {milestones.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No milestones yet. Add your first milestone below.</p>}
              {milestones.map((ms) => (
                <div key={ms.id} className="milestone-item">
                  <div className="milestone-title">
                    <span><strong>{ms.title}</strong> {ms.target_date && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>📅 {ms.target_date}</span>}</span>
                    <button className="btn-execute" onClick={() => setSelectedMilestone(selectedMilestone === ms.id ? null : ms.id)} style={{ fontSize: "9px" }}>+ Add Task</button>
                  </div>
                  {ms.description && <p style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "8px" }}>{ms.description}</p>}
                  {tasks[ms.id]?.map((tsk) => (
                    <div key={tsk.id} className="task-item">
                      <span>{tsk.task}</span>
                      {tsk.duration_minutes && <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{tsk.duration_minutes} min</span>}
                    </div>
                  ))}
                  {selectedMilestone === ms.id && (
                    <div className="add-section">
                      <input type="text" placeholder="Task name" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} style={{ width: "100%", background: "var(--surface-3)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px", marginBottom: "8px", color: "var(--text-primary)" }} />
                      <div className="small-input">
                        <input type="number" placeholder="Duration (min)" value={newTask.durationMinutes} onChange={(e) => setNewTask({ ...newTask, durationMinutes: e.target.value })} />
                        <button className="small-btn" onClick={addTask} disabled={addingTask}>{addingTask ? "Adding..." : "Add Task"}</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="add-section">
              <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "var(--accent-gold-light)" }}>➕ New Milestone</h3>
              <input type="text" placeholder="Milestone title" value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", marginBottom: "8px", color: "var(--text-primary)" }} />
              <input type="text" placeholder="Description (optional)" value={newMilestone.description} onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", marginBottom: "8px", color: "var(--text-primary)" }} />
              <input type="date" placeholder="Target date" value={newMilestone.targetDate} onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })} style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "8px", padding: "10px", marginBottom: "12px", color: "var(--text-primary)" }} />
              <button className="btn-save" onClick={addMilestone} disabled={addingMilestone} style={{ width: "100%" }}>{addingMilestone ? "Adding..." : "Add Milestone"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
