import { useState, useEffect } from "react";

export function ExecutionModal({ idea, onClose, onPromote, isReadOnly }: any) {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMilestone, setNewMilestone] = useState({ title: "", description: "", targetDate: "" });

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
          description: newMilestone.description,
          targetDate: newMilestone.targetDate || null
        }),
      });
      if (res.ok) {
        setNewMilestone({ title: "", description: "", targetDate: "" });
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
            <span style={{fontSize:'10px', color: isReadOnly ? '#2ecc71' : '#999', fontWeight:'bold'}}>
              {isReadOnly ? "● PRODUCTION VIEW" : "ID: " + idea.id + " | CONFIGURATION"}
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Full Details Section */}
        <div className="project-blueprint" style={{background: '#f4f4f4', padding: '15px', borderRadius: '8px', marginBottom: '20px', borderLeft: '4px solid #000'}}>
           <h4 style={{margin:'0 0 5px 0', fontSize:'11px', color:'#666', letterSpacing:'1px'}}>ORIGINAL CONCEPT</h4>
           <p style={{margin:0, fontSize:'14px', fontWeight:'500'}}>{idea.refinedIdea}</p>
           {idea.goal && (
             <>
               <h4 style={{margin:'15px 0 5px 0', fontSize:'11px', color:'#666', letterSpacing:'1px'}}>ULTIMATE GOAL</h4>
               <p style={{margin:0, fontSize:'14px', color: '#333'}}>{idea.goal}</p>
             </>
           )}
        </div>

        {!isReadOnly && (
          <div className="milestone-form" style={{background:'#fffcf0', border:'1px solid #ffeeba', padding:'15px', borderRadius:'8px', marginBottom:'20px'}}>
            <h3 style={{marginTop:0, fontSize:'14px'}}>Add Milestone & Deadline</h3>
            <input 
              type="text" 
              placeholder="Milestone Title" 
              value={newMilestone.title}
              onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
            />
            <input 
              type="date" 
              value={newMilestone.targetDate}
              onChange={(e) => setNewMilestone({...newMilestone, targetDate: e.target.value})}
              style={{marginTop:'8px'}}
            />
            <textarea 
              placeholder="Details..." 
              value={newMilestone.description}
              onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
              style={{marginTop:'8px'}}
            />
            <button onClick={addMilestone} style={{marginTop:'10px', background:'#000'}}>SAVE TO ROADMAP</button>
          </div>
        )}

        <div className="milestone-list">
          <h3 style={{fontSize:'14px', borderBottom:'1px solid #eee', paddingBottom:'10px'}}>PROJECT ROADMAP</h3>
          {milestones.length === 0 ? <p style={{opacity:0.5, fontSize:'13px'}}>No milestones set.</p> : milestones.map((m: any) => (
            <div key={m.id} className="milestone-item" style={{padding:'12px 0', borderBottom:'1px solid #f9f9f9'}}>
               <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <strong>{m.title}</strong>
                  {m.target_date && <span style={{fontSize:'11px', background:'#eee', padding:'2px 6px', borderRadius:'4px'}}>{new Date(m.target_date).toLocaleDateString()}</span>}
               </div>
               <p style={{fontSize:'13px', color:'#666', margin:'5px 0 0 0'}}>{m.description}</p>
            </div>
          ))}
        </div>

        {onPromote && !isReadOnly && (
          <div style={{marginTop:'30px', borderTop:'1px solid #eee', paddingTop:'20px'}}>
            <button 
              onClick={() => onPromote(idea.id)}
              disabled={milestones.length === 0}
              style={{
                width:'100%', background: milestones.length > 0 ? '#000' : '#ccc', color:'#fff', padding:'15px', borderRadius:'8px', fontWeight:'bold'
              }}
            >
              FINALIZE & MOVE TO MILESTONES →
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.95); display:flex; align-items:center; justify-content:center; z-index:2000; padding: 20px; }
        .modal-content { background: #fff; color: #000; width: 100%; max-width: 500px; border-radius: 16px; padding: 24px; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .close-btn { background: #eee; border: none; border-radius: 50%; width: 30px; height: 30px; cursor:pointer; }
        .milestone-form input, .milestone-form textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box; }
        .milestone-form button { width: 100%; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight:bold; cursor:pointer; }
      `}</style>
    </div>
  );
}
