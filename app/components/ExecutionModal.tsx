import { useState, useEffect } from "react";

export function ExecutionModal({ idea, onClose, onPromote }: any) {
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
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }

  async function addMilestone() {
    if (!newMilestone.title) return;
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaId: parseInt(idea.id),
          title: newMilestone.title,
          description: newMilestone.description
        }),
      });
      if (res.ok) {
        setNewMilestone({ title: "", description: "" });
        fetchMilestones();
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div>
            <h2 style={{margin:0}}>{idea.title}</h2>
            <span style={{fontSize:'10px', color:'#999'}}>ID: {idea.id} | EXECUTION PHASE</span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="milestone-form">
          <h3>1. Define Roadmap</h3>
          <input 
            type="text" 
            placeholder="Milestone Title" 
            value={newMilestone.title}
            onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
          />
          <textarea 
            placeholder="Details..." 
            value={newMilestone.description}
            onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
          />
          <button onClick={addMilestone}>ADD TO ROADMAP</button>
        </div>

        <div className="milestone-list">
          <h3>2. Current Roadmap ({milestones.length})</h3>
          {milestones.map((m: any) => (
            <div key={m.id} className="milestone-item">
               <strong>{m.title}</strong>
               <p style={{fontSize:'12px', color:'#666', margin:'4px 0'}}>{m.description}</p>
            </div>
          ))}
        </div>

        <div style={{marginTop:'30px', borderTop:'2px solid #eee', paddingTop:'20px'}}>
          <button 
            onClick={() => onPromote(idea.id)}
            disabled={milestones.length === 0}
            style={{
              width:'100%', 
              background: milestones.length > 0 ? '#000' : '#ccc', 
              color:'#fff', 
              padding:'15px', 
              borderRadius:'8px', 
              fontWeight:'bold',
              cursor: milestones.length > 0 ? 'pointer' : 'not-allowed'
            }}
          >
            PROMOTING TO MILESTONES BOX →
          </button>
          {milestones.length === 0 && <p style={{fontSize:'10px', color:'red', textAlign:'center', marginTop:'5px'}}>Add at least one milestone to promote.</p>}
        </div>
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.9); display:flex; align-items:center; justify-content:center; z-index:2000; padding: 20px; }
        .modal-content { background: #fff; color: #000; width: 100%; max-width: 500px; border-radius: 12px; padding: 20px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-btn { background: #eee; border: none; border-radius: 50%; width: 30px; height: 30px; }
        .milestone-form { display: flex; flex-direction: column; gap: 8px; background: #f8f8f8; padding: 12px; border-radius: 8px; margin-bottom: 20px; }
        .milestone-form input, .milestone-form textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        .milestone-form button { background: #444; color: #fff; border: none; padding: 10px; border-radius: 4px; }
        .milestone-item { padding: 10px; border-bottom: 1px solid #eee; }
      `}</style>
    </div>
  );
}
