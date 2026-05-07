export function IdeaVault({ ideas, viewMode, onActivate, onDelete, openExecutionModal, onPromoteToTask }: any) {
  const filtered = ideas.filter((i: any) => {
    if (viewMode === "Ideas") return i.status === "captured";
    if (viewMode === "Execution Plans") return i.status === "active";
    if (viewMode === "Milestones") return i.status === "milestone";
    if (viewMode === "Tasks") return i.status === "task";
    return false;
  });

  return (
    <div className="vault-list" style={{ marginTop: '20px' }}>
      {filtered.length === 0 ? (
        <p style={{ opacity: 0.5, textAlign: 'center', padding: '20px', border: '1px dashed #ccc', borderRadius: '12px' }}>
          No projects in {viewMode} phase.
        </p>
      ) : (
        filtered.map((idea: any) => (
          <div key={idea.id} className="idea-card" style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px', color: '#000', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>{idea.title}</span>
              <button onClick={() => onDelete(idea.id)} style={{ background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' }}>DELETE</button>
            </div>
            <div style={{ fontSize: '13px', color: '#666', marginTop: '8px', lineHeight: '1.4' }}>{idea.refinedIdea}</div>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '8px' }}>
              {viewMode === "Ideas" && (
                <button 
                  onClick={() => onActivate(idea.id)}
                  style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                >
                  🚀 ACTIVATE PRODUCTION
                </button>
              )}

              {viewMode === "Execution Plans" && (
                <button 
                  onClick={() => openExecutionModal(idea.id)}
                  style={{ width: '100%', background: '#DAA520', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                >
                  ⚡ OPEN WORKSTATION
                </button>
              )}

              {viewMode === "Milestones" && (
                <>
                  <button 
                    onClick={() => openExecutionModal(idea.id)}
                    style={{ flex: 1, background: '#eee', color: '#333', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    VIEW ROADMAP
                  </button>
                  <button 
                    onClick={() => onPromoteToTask(idea.id)}
                    style={{ flex: 1, background: '#000', color: '#fff', border: 'none', padding: '10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}
                  >
                    INITIATE TASKS →
                  </button>
                </>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
