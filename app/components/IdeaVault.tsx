export function IdeaVault({ ideas, viewMode, onActivate, onDelete, openExecutionModal }: any) {
  const filtered = ideas.filter((i: any) => 
    viewMode === "Ideas" ? i.status === "captured" : i.status === "active"
  );

  return (
    <div className="vault-list" style={{ marginTop: '20px' }}>
      {filtered.length === 0 ? <p style={{opacity:0.5}}>Empty</p> : filtered.map((idea: any) => (
        <div key={idea.id} className="idea-card" style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px', color: '#000' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold' }}>{idea.title}</span>
            <button onClick={() => onDelete(idea.id)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', fontSize: '12px' }}>DELETE</button>
          </div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{idea.refinedIdea}</div>
          
          <div style={{ marginTop: '10px' }}>
            {viewMode === "Ideas" ? (
              <button 
                onClick={() => onActivate(idea.id)}
                style={{ width: '100%', background: '#222', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}
              >
                🚀 ACTIVATE PRODUCTION
              </button>
            ) : (
              <button 
                onClick={() => openExecutionModal(idea.id)}
                style={{ width: '100%', background: 'var(--accent-gold, #DAA520)', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}
              >
                ⚡ OPEN WORKSTATION
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
