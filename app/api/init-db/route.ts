import { pool } from '../../../lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        note TEXT NOT NULL,
        goal TEXT,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id),
        title TEXT,
        target_date DATE,
        status TEXT DEFAULT 'pending'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        milestone_id INTEGER REFERENCES milestones(id),
        task TEXT,
        scheduled_time TIMESTAMP,
        duration_minutes INTEGER,
        status TEXT DEFAULT 'pending'
      );
    `);

    return Response.json({ success: true, message: "DB initialized" });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
