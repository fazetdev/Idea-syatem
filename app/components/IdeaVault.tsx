export function IdeaVault({ loading, ideas, viewMode, onActivate, openExecutionModal }: any) {
  const filtered = ideas.filter((i: any) => 
    viewMode === "Ideas" ? i.status === "captured" : i.status === "active"
  );

  return (
    <div className="vault-list">
      {loading ? <p>Syncing...</p> : filtered.map((idea: any) => (
        <div key={idea.id} className="idea-card" style={{ background: '#fff', border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
          <div style={{ fontWeight: 'bold' }}>{idea.title}</div>
          <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>{idea.goal}</div>
          
          <div style={{ marginTop: '10px' }}>
            {viewMode === "Ideas" ? (
              <button 
                onClick={() => onActivate(idea.id)}
                style={{ width: '100%', background: 'var(--accent-gold)', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}
              >
                🚀 ACTIVATE PRODUCTION
              </button>
            ) : (
              <button 
                onClick={() => openExecutionModal(idea.id)}
                style={{ width: '100%', background: '#2C2A28', color: '#fff', border: 'none', padding: '8px', borderRadius: '6px', fontWeight: 'bold', fontSize: '11px' }}
              >
                ⚡ OPEN WORKSPACE
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
