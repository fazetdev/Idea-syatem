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
  const [mounted, setMounted] = useState(false);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [form, setForm] = useState({ title: "", refinedIdea: "", goal: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeExecution, setActiveExecution] = useState<string | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [tasks, setTasks] = useState<Record<number, Task[]>>({});
  
  // Form states
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", targetDate: "" });
  const [newTask, setNewTask] = useState({ task: "", durationMinutes: "", scheduledTime: "" });
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);
  
  // Edit states
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingTask, setEditingTask] = useState<{ task: Task; milestoneId: number } | null>(null);
  
  // Loading states
  const [addingMilestone, setAddingMilestone] = useState(false);
  const [addingTask, setAddingTask] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  async function updateMilestone() {
    if (!editingMilestone) return;
    try {
      const res = await fetch(`/api/milestones/${editingMilestone.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editingMilestone.title,
          description: editingMilestone.description,
          target_date: editingMilestone.target_date
        })
      });
      if (res.ok) {
        setEditingMilestone(null);
        await fetchExecutionData(activeExecution!);
      }
    } catch (error) {
      console.error("Error updating milestone:", error);
    }
  }

  async function deleteMilestone(id: number) {
    if (!confirm("Are you sure you want to delete this milestone and all its tasks?")) return;
    try {
      const res = await fetch(`/api/milestones/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchExecutionData(activeExecution!);
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
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

  async function updateTask() {
    if (!editingTask) return;
    try {
      const res = await fetch(`/api/tasks/${editingTask.task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: editingTask.task.task,
          duration_minutes: editingTask.task.duration_minutes
        })
      });
      if (res.ok) {
        setEditingTask(null);
        await fetchExecutionData(activeExecution!);
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function deleteTask(taskId: number) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        await fetchExecutionData(activeExecution!);
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  function openExecutionModal(ideaId: string) {
    setActiveExecution(ideaId);
    fetchExecutionData(ideaId);
    setSelectedMilestone(null);
    setEditingMilestone(null);
    setEditingTask(null);
  }

  const totalMilestones = milestones.length;
  const totalTasks = Object.values(tasks).reduce((acc, curr) => acc + curr.length, 0);

  const statsCards = [
    { label: "Ideas", value: ideas.length, icon: "◈", color: "var(--accent-gold)" },
    { label: "Execution Plans", value: activeExecution ? 1 : 0, icon: "⬡", color: "var(--accent-gold-light)" },
    { label: "Milestones", value: totalMilestones, icon: "◎", color: "var(--accent-green)" },
    { label: "Tasks", value: totalTasks, icon: "▦", color: "var(--accent-green-light)" },
  ];

  // Don't render anything until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a1208" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
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
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }
        body { background: var(--bg); color: var(--text-primary); font-family: var(--font-display); margin: 0; padding: 0; }
        .shell { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; margin-bottom: 72px; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        .logo-mark { width: 30px; height: 30px; border: 1.5px solid var(--accent-gold); border-radius: 6px; display: grid; place-items: center; font-size: 14px; color: var(--accent-gold); }
        .nav-pill { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--surface); }
        .nav-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-green-light); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .hero { margin-bottom: 64px; }
        .hero-eyebrow { display: inline-flex; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 20px; padding: 5px 12px; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 4px; background: rgba(212, 175, 55, 0.05); }
        .hero h1 { font-size: clamp(42px, 7vw, 72px); font-weight: 800; line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 18px; }
        .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 16px; color: var(--text-secondary); max-width: 480px; line-height: 1.7; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 56px; }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; position: relative; transition: all 0.2s; cursor: pointer; }
        .stat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color), transparent); opacity: 0.6; }
        .stat-icon { font-size: 18px; color: var(--color); margin-bottom: 12px; display: block; }
        .stat-value { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
        .stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 820px) { .main-grid { grid-template-columns: 1fr; } }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .panel-header { padding: 20px 24px 0; }
        .panel-title { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
        .panel-title::before { content: ''; display: block; width: 3px; height: 14px; background: var(--accent-gold); border-radius: 2px; }
        .panel-body { padding: 20px 24px 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; }
        .field input, .field textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-family: var(--font-display); font-size: 14px; color: var(--text-primary); outline: none; }
        .field input:focus, .field textarea:focus { border-color: rgba(212, 175, 55, 0.4); }
        .btn-save { width: 100%; padding: 13px; border: none; border-radius: 9px; font-family: var(--font-display); font-size: 14px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%); color: #0a1208; margin-top: 4px; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .ideas-feed { display: flex; flex-direction: column; gap: 10px; max-height: 480px; overflow-y: auto; }
        .idea-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; }
        .idea-card:hover { border-color: var(--border-hover); transform: translateX(4px); }
        .idea-card-title { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
        .idea-card-goal { font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .idea-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .idea-date { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
        .btn-execute { padding: 5px 11px; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 6px; background: rgba(212, 175, 55, 0.06); color: var(--accent-gold); font-family: var(--font-mono); font-size: 10px; cursor: pointer; transition: all 0.2s; }
        .btn-execute:hover { background: rgba(212, 175, 55, 0.12); transform: translateY(-1px); }
        .btn-icon { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 6px; transition: all 0.2s; }
        .btn-edit { background: var(--accent-gold); color: #0a1208; }
        .btn-edit:hover { opacity: 0.8; }
        .btn-delete { background: #dc3545; color: white; }
        .btn-delete:hover { opacity: 0.8; }
        .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10, 18, 8, 0.95); backdrop-filter: blur(8px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border: 1px solid var(--border-hover); border-radius: 20px; width: 100%; max-width: 750px; max-height: 85vh; overflow-y: auto; padding: 32px; position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface-2); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .modal-close:hover { border-color: var(--border-hover); }
        .modal h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .modal-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 28px; text-transform: uppercase; }
        .milestone-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 12px; transition: all 0.2s; }
        .milestone-item:hover { border-color: var(--border-hover); }
        .milestone-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .milestone-title { font-weight: 700; font-size: 15px; }
        .milestone-actions { display: flex; gap: 6px; align-items: center; }
        .milestone-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
        .task-list { margin-top: 12px; margin-left: 16px; }
        .task-item { background: var(--surface-3); border-radius: 6px; padding: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
        .task-text { font-size: 13px; flex: 1; }
        .task-meta { font-size: 10px; color: var(--text-muted); margin-left: 12px; }
        .add-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .input-group { margin-bottom: 12px; }
        .input-group input, .input-group textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 10px; color: var(--text-primary); font-family: var(--font-display); }
        .button-group { display: flex; gap: 8px; margin-top: 8px; }
        .btn-primary { padding: 8px 16px; background: var(--accent-gold); color: #0a1208; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.8; transform: translateY(-1px); }
        .btn-secondary { padding: 8px 16px; background: var(--surface-3); color: var(--text-primary); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--border-hover); }
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
              <div className="field"><label>Refined Idea</label><textarea placeholder="What's the refined concept?" rows={3} value={form.refinedIdea} onChange={(e) => setForm({ ...form, refinedIdea: e.target.value })} /></div>
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
            
            {/* Milestones Section */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--accent-gold)" }}>📌 Milestones</h3>
              {milestones.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "12px" }}>No milestones yet. Add your first milestone below.</p>}
              
              {milestones.map((ms) => (
                <div key={ms.id} className="milestone-item">
                  {editingMilestone?.id === ms.id ? (
                    <div>
                      <input type="text" value={editingMilestone.title} onChange={(e) => setEditingMilestone({ ...editingMilestone, title: e.target.value })} className="input-group" style={{ marginBottom: "8px" }} />
                      <textarea value={editingMilestone.description || ''} onChange={(e) => setEditingMilestone({ ...editingMilestone, description: e.target.value })} rows={2} className="input-group" style={{ marginBottom: "8px" }} placeholder="Description" />
                      <input type="date" value={editingMilestone.target_date?.split('T')[0] || ''} onChange={(e) => setEditingMilestone({ ...editingMilestone, target_date: e.target.value })} className="input-group" style={{ marginBottom: "8px" }} />
                      <div className="button-group">
                        <button className="btn-primary" onClick={updateMilestone}>Save Changes</button>
                        <button className="btn-secondary" onClick={() => setEditingMilestone(null)}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="milestone-header">
                        <div className="milestone-title">
                          {ms.title} 
                          {ms.target_date && <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "8px" }}>📅 {new Date(ms.target_date).toLocaleDateString()}</span>}
                        </div>
                        <div className="milestone-actions">
                          <button className="btn-icon btn-edit" onClick={() => setEditingMilestone(ms)}>✏️ Edit</button>
                          <button className="btn-icon btn-delete" onClick={() => deleteMilestone(ms.id)}>🗑️ Delete</button>
                          <button className="btn-execute" onClick={() => setSelectedMilestone(selectedMilestone === ms.id ? null : ms.id)}>
                            {selectedMilestone === ms.id ? "Cancel" : "+ Add Task"}
                          </button>
                        </div>
                      </div>
                      {ms.description && <div className="milestone-desc">{ms.description}</div>}
                      
                      {/* Tasks */}
                      <div className="task-list">
                        {tasks[ms.id]?.map((tsk) => (
                          <div key={tsk.id} className="task-item">
                            {editingTask?.task.id === tsk.id ? (
                              <div style={{ flex: 1 }}>
                                <input type="text" value={editingTask.task.task} onChange={(e) => setEditingTask({ ...editingTask, task: { ...editingTask.task, task: e.target.value } })} style={{ width: "100%", marginBottom: "8px", padding: "6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-primary)" }} />
                                <input type="number" value={editingTask.task.duration_minutes || ''} onChange={(e) => setEditingTask({ ...editingTask, task: { ...editingTask.task, duration_minutes: parseInt(e.target.value) } })} placeholder="Duration (minutes)" style={{ width: "100%", padding: "6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "4px", color: "var(--text-primary)" }} />
                                <div className="button-group" style={{ marginTop: "8px" }}>
                                  <button className="btn-primary" onClick={updateTask}>Save</button>
                                  <button className="btn-secondary" onClick={() => setEditingTask(null)}>Cancel</button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="task-text">{tsk.task}</div>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {tsk.duration_minutes && <span className="task-meta">⏱ {tsk.duration_minutes} min</span>}
                                  <button className="btn-icon btn-edit" onClick={() => setEditingTask({ task: tsk, milestoneId: ms.id })} style={{ fontSize: "10px", padding: "2px 6px" }}>✏️</button>
                                  <button className="btn-icon btn-delete" onClick={() => deleteTask(tsk.id)} style={{ fontSize: "10px", padding: "2px 6px" }}>🗑️</button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Add Task Form */}
                      {selectedMilestone === ms.id && (
                        <div className="add-section">
                          <input type="text" placeholder="Task name" value={newTask.task} onChange={(e) => setNewTask({ ...newTask, task: e.target.value })} className="input-group" />
                          <div style={{ display: "flex", gap: "8px" }}>
                            <input type="number" placeholder="Duration (minutes)" value={newTask.durationMinutes} onChange={(e) => setNewTask({ ...newTask, durationMinutes: e.target.value })} style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "6px", padding: "8px" }} />
                            <button className="btn-primary" onClick={addTask} disabled={addingTask}>{addingTask ? "Adding..." : "Add Task"}</button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Milestone */}
            <div className="add-section">
              <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "var(--accent-gold-light)" }}>➕ New Milestone</h3>
              <input type="text" placeholder="Milestone title" value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} className="input-group" />
              <textarea placeholder="Description (optional)" value={newMilestone.description} onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} rows={2} className="input-group" />
              <input type="date" placeholder="Target date" value={newMilestone.targetDate} onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })} className="input-group" />
              <button className="btn-primary" onClick={addMilestone} disabled={addingMilestone} style={{ width: "100%" }}>{addingMilestone ? "Adding..." : "Add Milestone"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
