import { useState } from "react";

export function IdeaVault({ ideas, viewMode, onActivate, onDelete, onPromoteToTask, handleStatusChange }: any) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [newM, setNewM] = useState({ title: "", date: "", method: "", outcome: "" });

  const filtered = ideas.filter((i: any) => {
    if (viewMode === "Ideas") return i.status === "captured";
    if (viewMode === "Execution Plans") return i.status === "active";
    if (viewMode === "Milestones") return i.status === "milestone";
    if (viewMode === "Tasks") return i.status === "task";
    return false;
  });

  async function fetchMilestones(id: number) {
    const res = await fetch(`/api/milestones?ideaId=${id}`);
    const data = await res.json();
    setMilestones(data.milestones || []);
  }

  const toggleExpand = (id: number) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      fetchMilestones(id);
    }
  };

  async function saveMilestone(ideaId: number) {
    if (!newM.title) return;
    try {
      const res = await fetch("/api/milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ideaId, ...newM, targetDate: newM.date }),
      });
      if (res.ok) {
        // LOCK IN: Clear the form so it hides the previous entry and readies for a new one
        setNewM({ title: "", date: "", method: "", outcome: "" });
        // Refresh the list to show the newly added step
        await fetchMilestones(ideaId);
      }
    } catch (e) { console.error(e); }
  }

  return (
    <div className="vault-container">
      {filtered.length === 0 ? (
        <p style={{textAlign:'center', opacity:0.5, padding:'20px'}}>Queue Empty</p>
      ) : filtered.map((idea: any) => (
        <div key={idea.id} className="collapsible-card">
          <div className="card-header" onClick={() => toggleExpand(idea.id)}>
            <div className="title-group">
              <span className="status-dot" style={{ background: viewMode === 'Tasks' ? '#2ecc71' : '#000' }}></span>
              <span className="title-text">{idea.title}</span>
            </div>
            <span className="chevron">{expandedId === idea.id ? "▲" : "▼"}</span>
          </div>

          {expandedId === idea.id && (
            <div className="card-body">
              <div className="meta-block">
                <label>STRATEGIC CONCEPT</label>
                <div className="scroll-box">
                  <p className="idea-text">{idea.refinedIdea}</p>
                </div>
                {idea.goal && <div className="goal-tag">GOAL: {idea.goal}</div>}
              </div>

              {(viewMode !== "Ideas") && (
                <div className="roadmap-container">
                  <label>PRODUCTION ROADMAP</label>
                  
                  {viewMode === "Execution Plans" && (
                    <div className="planner-box">
                      <div className="input-group">
                        <input type="text" placeholder="Step Name (e.g. API Integration)" value={newM.title} onChange={e => setNewM({...newM, title: e.target.value})} />
                        <input type="date" value={newM.date} onChange={e => setNewM({...newM, date: e.target.value})} />
                      </div>
                      <textarea placeholder="The Method: How will you execute this?" value={newM.method} onChange={e => setNewM({...newM, method: e.target.value})} />
                      <textarea placeholder="Expected Outcome: What is the proof of success?" value={newM.outcome} onChange={e => setNewM({...newM, outcome: e.target.value})} />
                      <button className="add-step-btn" onClick={() => saveMilestone(idea.id)}>LOCK IN STRATEGIC STEP</button>
                    </div>
                  )}

                  <div className="m-list">
                    {milestones.map((m: any) => (
                      <div key={m.id} className="m-card">
                        <div className="m-header">
                          <span className="m-title">◈ {m.title}</span>
                          <span className="m-date">{m.target_date ? new Date(m.target_date).toLocaleDateString() : "PENDING"}</span>
                        </div>
                        {m.method && <div className="m-detail"><strong>METHOD:</strong> {m.method}</div>}
                        {m.outcome && <div className="m-detail"><strong>OUTCOME:</strong> {m.outcome}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bottom-actions">
                {viewMode === "Ideas" && <button onClick={() => onActivate(idea.id)} className="primary-action">ACTIVATE PRODUCTION</button>}
                {viewMode === "Execution Plans" && (
                  <button 
                    onClick={() => handleStatusChange(idea.id, 'milestone')} 
                    className="primary-action"
                    disabled={milestones.length === 0}
                    style={{ opacity: milestones.length === 0 ? 0.5 : 1 }}
                  >
                    PROMOTE TO ROADMAP
                  </button>
                )}
                {viewMode === "Milestones" && <button onClick={() => onPromoteToTask(idea.id)} className="primary-action">START FINAL PRODUCTION</button>}
                <button onClick={() => onDelete(idea.id)} className="delete-action">DELETE</button>
              </div>
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        .vault-container { display: flex; flex-direction: column; gap: 10px; margin-top: 10px; }
        .collapsible-card { background: #fff; border: 1px solid #eee; border-radius: 8px; overflow: hidden; }
        .card-header { padding: 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
        .title-group { display: flex; align-items: center; gap: 12px; }
        .status-dot { width: 8px; height: 8px; border-radius: 50%; }
        .title-text { font-weight: 700; color: #000; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; }
        .card-body { padding: 16px; border-top: 1px solid #f5f5f5; background: #fff; }
        .meta-block label, .roadmap-container label { font-size: 9px; font-weight: 900; color: #bbb; letter-spacing: 1.5px; display: block; margin-bottom: 8px; }
        .scroll-box { max-height: 150px; overflow-y: auto; margin-bottom: 10px; padding-right: 5px; }
        .idea-text { font-size: 13px; color: #444; line-height: 1.6; white-space: pre-wrap; }
        .goal-tag { display: inline-block; background: #000; color: #fff; font-size: 10px; padding: 4px 8px; border-radius: 4px; font-weight: 700; margin-bottom: 20px; }
        .planner-box { background: #fafafa; padding: 12px; border: 1px solid #eee; border-radius: 6px; display: flex; flex-direction: column; gap: 8px; margin-bottom: 20px; }
        .input-group { display: flex; gap: 8px; }
        .input-group input:first-child { flex: 2; }
        .input-group input:last-child { flex: 1; }
        .planner-box input, .planner-box textarea { padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; font-family: inherit; }
        .add-step-btn { background: #000; color: #fff; border: none; padding: 12px; border-radius: 4px; font-weight: 800; font-size: 11px; cursor: pointer; }
        .m-card { background: #fff; padding: 12px; border-radius: 4px; border: 1px solid #eee; margin-bottom: 8px; }
        .m-header { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; font-weight: 800; color: #000; }
        .m-detail { font-size: 11px; color: #666; margin-top: 4px; line-height: 1.4; border-top: 1px solid #f9f9f9; paddingTop: 4px; }
        .bottom-actions { display: flex; gap: 8px; margin-top: 20px; border-top: 1px solid #eee; paddingTop: 15px; }
        .primary-action { flex: 3; background: #000; color: #fff; border: none; padding: 12px; border-radius: 6px; font-weight: 800; font-size: 12px; }
        .delete-action { flex: 1; background: #fff; color: #ff4d4d; border: 1px solid #ff4d4d; padding: 12px; border-radius: 6px; font-size: 11px; font-weight: 700; }
      `}</style>
    </div>
  );
}
