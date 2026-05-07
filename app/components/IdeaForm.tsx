interface IdeaFormProps {
  form: { title: string; refinedIdea: string; goal: string };
  setForm: (form: any) => void;
  handleSave: () => void;
  saving: boolean;
  saved?: boolean;
}

export function IdeaForm({ form, setForm, handleSave, saving }: IdeaFormProps) {
  return (
    <div className="panel idea-form-container" style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
      <h2 style={{ marginTop: 0, fontSize: '18px', borderBottom: '2px solid #000', paddingBottom: '10px' }}>Capture New Concept</h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div className="input-field">
          <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#888' }}>PROJECT TITLE</label>
          <input
            type="text"
            placeholder="e.g. Aminchi Logistics MVP"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }}
          />
        </div>

        <div className="input-field">
          <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#888' }}>REFINED IDEA (THE CORE 20%)</label>
          <textarea
            placeholder="Describe the functional logic..."
            value={form.refinedIdea}
            onChange={(e) => setForm({ ...form, refinedIdea: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px', marginTop: '5px' }}
          />
        </div>

        <div className="input-field">
          <label style={{ fontSize: '10px', fontWeight: 'bold', color: '#888' }}>PRIMARY BUSINESS GOAL</label>
          <input
            type="text"
            placeholder="e.g. 50 verified riders in Kano"
            value={form.goal}
            onChange={(e) => setForm({ ...form, goal: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '5px' }}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || !form.title || !form.refinedIdea}
          style={{
            background: '#000',
            color: '#fff',
            padding: '15px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            opacity: (saving || !form.title || !form.refinedIdea) ? 0.5 : 1
          }}
        >
          {saving ? "PROCESSING..." : "SAVE TO INBOX"}
        </button>
      </div>
    </div>
  );
}
