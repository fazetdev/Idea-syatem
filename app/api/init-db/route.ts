import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS ideas (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        note TEXT NOT NULL,
        goal TEXT,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS milestones (
        id SERIAL PRIMARY KEY,
        idea_id INTEGER REFERENCES ideas(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        description TEXT,
        target_date DATE,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        milestone_id INTEGER REFERENCES milestones(id) ON DELETE CASCADE,
        task TEXT NOT NULL,
        scheduled_time TIMESTAMP,
        duration_minutes INTEGER,
        status TEXT DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    return Response.json({
      success: true,
      message: 'Database initialized',
    });

  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
