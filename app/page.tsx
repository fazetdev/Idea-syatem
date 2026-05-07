"use client";

import { useState, useEffect } from "react";
import { IdeaOSStyles } from "./components/IdeaOSStyles";
import { IdeaForm } from "./components/IdeaForm";
import { IdeaVault } from "./components/IdeaVault";
import { ExecutionModal } from "./components/ExecutionModal";

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

  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", targetDate: "" });
  const [newTask, setNewTask] = useState({ task: "", durationMinutes: "", scheduledTime: "" });
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [editingTask, setEditingTask] = useState<{ task: Task; milestoneId: number } | null>(null);

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

  if (!mounted) {
    return null;
  }

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
          <IdeaForm form={form} setForm={setForm} handleSave={handleSave} saving={saving} saved={saved} />
          <IdeaVault loading={loading} ideas={ideas} openExecutionModal={openExecutionModal} />
        </div>
      </div>

      {activeExecution && (
        <ExecutionModal 
          setActiveExecution={setActiveExecution}
          activeExecution={activeExecution}
          milestones={milestones}
          editingMilestone={editingMilestone}
          setEditingMilestone={setEditingMilestone}
          updateMilestone={updateMilestone}
          deleteMilestone={deleteMilestone}
          selectedMilestone={selectedMilestone}
          setSelectedMilestone={setSelectedMilestone}
          tasks={tasks}
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          updateTask={updateTask}
          deleteTask={deleteTask}
          newTask={newTask}
          setNewTask={setNewTask}
          addTask={addTask}
          addingTask={addingTask}
          newMilestone={newMilestone}
          setNewMilestone={setNewMilestone}
          addMilestone={addMilestone}
          addingMilestone={addingMilestone}
        />
      )}
    </div>
  );
}
