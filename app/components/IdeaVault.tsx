interface Idea {
  id: string;
  title: string;
  refinedIdea: string;
  goal: string;
  status: string;
  createdAt: string;
}

interface IdeaVaultProps {
  loading: boolean;
  ideas: Idea[];
  openExecutionModal: (id: string) => void;
  onActivate: (id: string) => void;
  viewMode: string;
}

export function IdeaVault({ loading, ideas, openExecutionModal, onActivate, viewMode }: IdeaVaultProps) {
  const filteredIdeas = ideas.filter(idea => 
    viewMode === "Ideas" ? idea.status === "captured" : idea.status === "active"
  );

  return (
    <div className="panel">
      <div className="panel-header">
        <div className="panel-title">{viewMode === "Ideas" ? "Inbox" : "Active Production"}</div>
      </div>
      <div className="panel-body">
        {loading ? (
          <div className="empty-state"><div className="stat-icon">◈</div><p>Loading ideas...</p></div>
        ) : filteredIdeas.length === 0 ? (
          <div className="empty-state">
            <div className="stat-icon">{viewMode === "Ideas" ? "◈" : "⬡"}</div>
            <p>{viewMode === "Ideas" ? "Inbox is clear." : "No active projects. Activate one from the Inbox."}</p>
          </div>
        ) : (
          <div className="ideas-feed">
            {filteredIdeas.map((idea) => (
              <div key={idea.id} className="idea-card">
                <div className="idea-card-title">{idea.title}</div>
                <div className="idea-card-goal">{idea.goal}</div>
                <div className="idea-card-footer">
                  <span className="idea-date">{new Date(idea.createdAt).toLocaleDateString()}</span>
                  {idea.status === "captured" ? (
                    <button className="btn-execute" onClick={() => onActivate(idea.id)}>🚀 Activate</button>
                  ) : (
                    <button className="btn-execute" onClick={() => openExecutionModal(idea.id)}>⚡ Plan Execution</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
