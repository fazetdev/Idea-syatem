export function ExecutionModal({
  setActiveExecution,
  activeExecution,
  milestones,
  editingMilestone,
  setEditingMilestone,
  updateMilestone,
  deleteMilestone,
  selectedMilestone,
  setSelectedMilestone,
  tasks,
  editingTask,
  setEditingTask,
  updateTask,
  deleteTask,
  newTask,
  setNewTask,
  addTask,
  addingTask,
  newMilestone,
  setNewMilestone,
  addMilestone,
  addingMilestone
}: any) {
  return (
    <div className="modal-overlay" onClick={() => setActiveExecution(null)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={() => setActiveExecution(null)}>✕</button>
        <h2>Execution Blueprint</h2>
        <div className="modal-sub">Build your system with milestones and tasks</div>

        <div style={{ marginBottom: "24px" }}>
          <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--accent-gold)" }}>📌 Milestones</h3>
          {milestones.length === 0 && <p style={{ color: "var(--text-muted)", fontSize: "13px", marginBottom: "12px" }}>No milestones yet. Add your first milestone below.</p>}

          {milestones.map((ms: any) => (
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

                  <div className="task-list">
                    {tasks[ms.id]?.map((tsk: any) => (
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

        <div className="add-section">
          <h3 style={{ fontSize: "14px", marginBottom: "12px", color: "var(--accent-gold-light)" }}>➕ New Milestone</h3>
          <input type="text" placeholder="Milestone title" value={newMilestone.title} onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })} className="input-group" />
          <textarea placeholder="Description (optional)" value={newMilestone.description} onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })} rows={2} className="input-group" />
          <input type="date" placeholder="Target date" value={newMilestone.targetDate} onChange={(e) => setNewMilestone({ ...newMilestone, targetDate: e.target.value })} className="input-group" />
          <button className="btn-primary" onClick={addMilestone} disabled={addingMilestone} style={{ width: "100%" }}>{addingMilestone ? "Adding..." : "Add Milestone"}</button>
        </div>
      </div>
    </div>
  );
}
