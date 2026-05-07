interface Idea {
  id: string;
  title: string;
  refinedIdea: string;
  goal: string;
  createdAt: string;
}

interface IdeaVaultProps {
  loading: boolean;
  ideas: Idea[];
  openExecutionModal: (id: string) => void;
}

export function IdeaVault({ loading, ideas, openExecutionModal }: IdeaVaultProps) {
  return (
    <div className="panel">
      <div className="panel-header"><div className="panel-title">Idea Vault</div></div>
      <div className="panel-body">
        {loading ? (
          <div className="empty-state"><div className="stat-icon">◈</div><p>Loading ideas...</p></div>
        ) : ideas.length === 0 ? (
          <div className="empty-state"><div className="stat-icon">◈</div><p>No ideas yet. Create one →</p></div>
        ) : (
          <div className="ideas-feed">
            {ideas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <div className="idea-card-title">{idea.title}</div>
                <div className="idea-card-goal">{idea.goal}</div>
                <div className="idea-card-footer">
                  <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
                  <button className="btn-execute" onClick={() => openExecutionModal(idea.id)}>⚡ Plan Execution</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
