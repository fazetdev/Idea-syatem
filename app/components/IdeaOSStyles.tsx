export function IdeaOSStyles() {
  return (
    <style>{`
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&display=swap');

:root {
  /* The "Ivory & Gold" Palette - Light, Clean, Professional */
  --bg: #f8f9fa; 
  --surface: #ffffff;
  --surface-subtle: #f1f5f9;
  
  --border: #e2e8f0;
  --border-gold: #d4af37;

  --text-primary: #0f172a;
  --text-secondary: #475569;
  --text-gold: #926e12;
  
  --accent-gold: #d4af37;
  --accent-gold-dark: #b8860b;

  --font-display: 'Syne', sans-serif;
  --font-mono: 'DM Mono', monospace;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

.main-wrapper {
  min-height: 100vh;
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: var(--font-display);
}

.shell { max-width: 1100px; margin: 0 auto; padding: 0 24px 80px; }

nav { display: flex; justify-content: space-between; align-items: center; padding: 30px 0 50px; }
.logo { display: flex; align-items: center; gap: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-primary); }
.logo-mark { width: 32px; height: 32px; background: var(--accent-gold); border-radius: 6px; display: grid; place-items: center; color: #fff; font-size: 18px; }

.hero h1 { font-size: clamp(34px, 8vw, 64px); font-weight: 800; line-height: 1.1; margin-bottom: 18px; color: var(--text-primary); }
.hero h1 em { font-style: normal; color: var(--accent-gold); }
.hero p { font-size: 18px; color: var(--text-secondary); max-width: 600px; line-height: 1.6; }

.stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }

.stat-card {
  background: var(--surface);
  border: 2px solid var(--border);
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.stat-value { font-size: 32px; font-weight: 800; display: block; color: var(--text-primary); }
.stat-label { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--accent-gold-dark); font-weight: 700; }

.main-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 24px; }
@media (max-width: 900px) { .main-grid { grid-template-columns: 1fr; } }

.panel {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

.panel-header { padding: 18px 24px; border-bottom: 2px solid var(--border); background: var(--surface-subtle); }
.panel-title { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-primary); }

.panel-body { padding: 24px; }

.field label { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--text-secondary); margin-bottom: 8px; text-transform: uppercase; font-weight: 700; }
.field input, .field textarea {
  width: 100%; background: #fff; border: 2px solid var(--border); border-radius: 12px; padding: 14px;
  color: var(--text-primary); font-family: var(--font-display); font-size: 16px; transition: 0.2s;
}
.field input:focus { border-color: var(--accent-gold); outline: none; }

.btn-save, .btn-primary {
  width: 100%; padding: 16px; border-radius: 12px; border: none; font-weight: 800;
  background: var(--accent-gold); color: #fff; cursor: pointer; text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}
.btn-save:hover { background: var(--accent-gold-dark); transform: translateY(-1px); }

.idea-card { background: var(--surface-subtle); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 12px; cursor: pointer; }
.idea-card:hover { border-color: var(--accent-gold); }
.idea-card-title { font-weight: 700; color: var(--text-primary); font-size: 16px; }
.idea-card-goal { font-size: 13px; color: var(--text-secondary); margin-top: 4px; }

.modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(8px); z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--surface); border-top: 6px solid var(--accent-gold); border-radius: 24px; width: 100%; max-width: 800px; padding: 30px; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }

::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
      `}</style>
  );
}
