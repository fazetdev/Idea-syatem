export function IdeaOSStyles() {
  return (
    <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --bg: #0a1208;
          --surface: #0e1a0c;
          --surface-2: #142810;
          --surface-3: #1a3515;
          --border: rgba(212, 175, 55, 0.15);
          --border-hover: rgba(212, 175, 55, 0.3);
          --text-primary: #e8ead8;
          --text-secondary: #9ba88d;
          --text-muted: #4a5a3d;
          --accent-gold: #d4af37;
          --accent-gold-light: #f0c45a;
          --accent-gold-dark: #b8941e;
          --accent-green: #2e7d32;
          --accent-green-light: #4caf50;
          --font-display: 'Syne', sans-serif;
          --font-mono: 'DM Mono', monospace;
        }
        body { background: var(--bg); color: var(--text-primary); font-family: var(--font-display); margin: 0; padding: 0; }
        .shell { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }
        nav { display: flex; align-items: center; justify-content: space-between; padding: 28px 0 0; margin-bottom: 72px; }
        .logo { display: flex; align-items: center; gap: 10px; font-size: 15px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; }
        .logo-mark { width: 30px; height: 30px; border: 1.5px solid var(--accent-gold); border-radius: 6px; display: grid; place-items: center; font-size: 14px; color: var(--accent-gold); }
        .nav-pill { display: flex; align-items: center; gap: 6px; padding: 7px 14px; border: 1px solid var(--border); border-radius: 999px; font-size: 12px; font-family: var(--font-mono); color: var(--text-secondary); background: var(--surface); }
        .nav-pill .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent-green-light); animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .hero { margin-bottom: 64px; }
        .hero-eyebrow { display: inline-flex; gap: 8px; font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent-gold); margin-bottom: 20px; padding: 5px 12px; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 4px; background: rgba(212, 175, 55, 0.05); }
        .hero h1 { font-size: clamp(42px, 7vw, 72px); font-weight: 800; line-height: 1.0; letter-spacing: -0.03em; margin-bottom: 18px; }
        .hero h1 em { font-style: normal; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-light) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 16px; color: var(--text-secondary); max-width: 480px; line-height: 1.7; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 56px; }
        @media (max-width: 700px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
        .stat-card { background: var(--surface); border: 1px solid var(--border); border-radius: 12px; padding: 20px 22px; position: relative; transition: all 0.2s; cursor: pointer; }
        .stat-card:hover { border-color: var(--border-hover); transform: translateY(-2px); }
        .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, var(--color), transparent); opacity: 0.6; }
        .stat-icon { font-size: 18px; color: var(--color); margin-bottom: 12px; display: block; }
        .stat-value { font-size: 32px; font-weight: 800; margin-bottom: 4px; }
        .stat-label { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); letter-spacing: 0.1em; text-transform: uppercase; }
        .main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media (max-width: 820px) { .main-grid { grid-template-columns: 1fr; } }
        .panel { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
        .panel-header { padding: 20px 24px 0; }
        .panel-title { font-size: 13px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); display: flex; align-items: center; gap: 8px; }
        .panel-title::before { content: ''; display: block; width: 3px; height: 14px; background: var(--accent-gold); border-radius: 2px; }
        .panel-body { padding: 20px 24px 24px; }
        .field { margin-bottom: 16px; }
        .field label { display: block; font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-muted); margin-bottom: 7px; }
        .field input, .field textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 8px; padding: 11px 14px; font-family: var(--font-display); font-size: 14px; color: var(--text-primary); outline: none; }
        .field input:focus, .field textarea:focus { border-color: rgba(212, 175, 55, 0.4); }
        .btn-save { width: 100%; padding: 13px; border: none; border-radius: 99px; font-family: var(--font-display); font-size: 14px; font-weight: 700; cursor: pointer; background: linear-gradient(135deg, var(--accent-gold) 0%, var(--accent-gold-dark) 100%); color: #0a1208; margin-top: 4px; }
        .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .ideas-feed { display: flex; flex-direction: column; gap: 10px; max-height: 480px; overflow-y: auto; }
        .idea-card { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; cursor: pointer; transition: all 0.2s; }
        .idea-card:hover { border-color: var(--border-hover); transform: translateX(4px); }
        .idea-card-title { font-size: 14px; font-weight: 600; margin-bottom: 5px; }
        .idea-card-goal { font-size: 12px; color: var(--text-secondary); margin-bottom: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .idea-card-footer { display: flex; justify-content: space-between; align-items: center; }
        .idea-date { font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); }
        .btn-execute { padding: 5px 11px; border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 6px; background: rgba(212, 175, 55, 0.06); color: var(--accent-gold); font-family: var(--font-mono); font-size: 10px; cursor: pointer; transition: all 0.2s; }
        .btn-execute:hover { background: rgba(212, 175, 55, 0.12); transform: translateY(-1px); }
        .btn-icon { padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; margin-left: 6px; transition: all 0.2s; }
        .btn-edit { background: var(--accent-gold); color: #0a1208; }
        .btn-edit:hover { opacity: 0.8; }
        .btn-delete { background: #dc3545; color: white; }
        .btn-delete:hover { opacity: 0.8; }
        .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
        .modal-overlay { position: fixed; inset: 0; background: rgba(10, 18, 8, 0.95); backdrop-filter: blur(8px); z-index: 50; display: flex; align-items: center; justify-content: center; padding: 24px; }
        .modal { background: var(--surface); border: 1px solid var(--border-hover); border-radius: 20px; width: 100%; max-width: 750px; max-height: 85vh; overflow-y: auto; padding: 32px; position: relative; }
        .modal-close { position: absolute; top: 20px; right: 20px; width: 30px; height: 30px; border: 1px solid var(--border); border-radius: 6px; background: var(--surface-2); color: var(--text-secondary); cursor: pointer; transition: all 0.2s; }
        .modal-close:hover { border-color: var(--border-hover); }
        .modal h2 { font-size: 22px; font-weight: 800; margin-bottom: 6px; }
        .modal-sub { font-family: var(--font-mono); font-size: 11px; color: var(--text-muted); margin-bottom: 28px; text-transform: uppercase; }
        .milestone-item { background: var(--surface-2); border: 1px solid var(--border); border-radius: 10px; padding: 16px; margin-bottom: 12px; transition: all 0.2s; }
        .milestone-item:hover { border-color: var(--border-hover); }
        .milestone-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; flex-wrap: wrap; gap: 8px; }
        .milestone-title { font-weight: 700; font-size: 15px; }
        .milestone-actions { display: flex; gap: 6px; align-items: center; }
        .milestone-desc { font-size: 12px; color: var(--text-secondary); margin-bottom: 8px; }
        .task-list { margin-top: 12px; margin-left: 16px; }
        .task-item { background: var(--surface-3); border-radius: 6px; padding: 10px; margin-bottom: 6px; display: flex; justify-content: space-between; align-items: center; }
        .task-text { font-size: 13px; flex: 1; }
        .task-meta { font-size: 10px; color: var(--text-muted); margin-left: 12px; }
        .add-section { margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .input-group { margin-bottom: 12px; }
        .input-group input, .input-group textarea { width: 100%; background: var(--surface-2); border: 1px solid var(--border); border-radius: 6px; padding: 10px; color: var(--text-primary); font-family: var(--font-display); }
        .button-group { display: flex; gap: 8px; margin-top: 8px; }
        .btn-primary { padding: 8px 16px; background: var(--accent-gold); color: #0a1208; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; transition: all 0.2s; }
        .btn-primary:hover { opacity: 0.8; transform: translateY(-1px); }
        .btn-secondary { padding: 8px 16px; background: var(--surface-3); color: var(--text-primary); border: 1px solid var(--border); border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--border-hover); }
      `}</style>
  );
}
