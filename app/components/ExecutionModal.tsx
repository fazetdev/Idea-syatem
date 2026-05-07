import { useState, useEffect } from "react";

export function ExecutionModal({ idea, onClose }: any) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchMilestones();
  }, [idea.id]);

  async function fetchMilestones() {
    setLoading(true);
    try {
      const res = await fetch(`/api/milestones?ideaId=${idea.id}`);
      const data = await res.json();
      setMilestones(data.milestones || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function addMilestone() {
    if (!newMilestone.title) return;
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: idea.id,
          title: newMilestone.title,
          description: newMilestone.description
        }),
      });
      if (res.ok) {
        setNewMilestone({ title: "", description: "" });
        fetchMilestones();
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Workstation: {idea.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="milestone-form">
          <h3>Add Project Milestone</h3>
          <input 
            type="text" 
            placeholder="Milestone Title (e.g., MVP Launch)" 
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
          />
          <textarea 
            placeholder="Brief description..." 
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
          />
          <button onClick={addMilestone}>ADD MILESTONE</button>
        </div>

        <div className="milestone-list">
          <h3>Project Roadmap</h3>
          {loading ? <p>Loading milestones...</p> : milestones.length === 0 ? <p>No milestones yet.</p> : (
            milestones.map((m: any) => (
              <div key={m.id} className="milestone-item">
                <span className={`status-dot ${m.status}`} />
                <div className="m-info">
                  <strong>{m.title}</strong>
                  <p>{m.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:2000; padding: 20px; }
        .modal-content { background: #fff; color: #000; width: 100%; max-width: 500px; border-radius: 12px; padding: 20px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px; }
        .close-btn { background: #eee; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; }
        .milestone-form { display: flex; flex-direction: column; gap: 10px; background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        .milestone-form input, .milestone-form textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-family: sans-serif; }
        .milestone-form button { background: #000; color: #fff; border: none; padding: 10px; border-radius: 4px; font-weight: bold; cursor: pointer; }
        .milestone-item { display: flex; align-items: flex-start; gap: 10px; padding: 10px; border-bottom: 1px solid #eee; }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #ccc; margin-top: 5px; }
        .status-dot.pending { background: #ffd700; }
        .m-info p { margin: 0; font-size: 13px; color: #666; }
      `}</style>
    </div>
  );
}
