interface IdeaFormProps {
  form: { title: string; refinedIdea: string; goal: string };
  setForm: (form: any) => void;
  handleSave: () => void;
  saving: boolean;
  saved: boolean;
}

export function IdeaForm({ form, setForm, handleSave, saving, saved }: IdeaFormProps) {
  return (
    <div className="panel">
      <div className="panel-header"><div className="panel-title">New Idea</div></div>
      <div className="panel-body">
        <div className="field">
          <label>Title</label>
          <input type="text" placeholder="Name this idea..." value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>
        <div className="field">
          <label>Refined Idea</label>
          <textarea placeholder="What's the refined concept?" rows={3} value={form.refinedIdea} onChange={(e) => setForm({ ...form, refinedIdea: e.target.value })} />
        </div>
        <div className="field">
          <label>Goal / Outcome</label>
          <input type="text" placeholder="What does success look like?" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} />
        </div>
        <button className="btn-save" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : saved ? "✓ Saved" : "Save Idea"}
        </button>
      </div>
    </div>
  );
}
