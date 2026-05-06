import { Pool } from '@neondatabase/serverless';

export const runtime = 'nodejs';

export async function GET() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  if (!process.env.DATABASE_URL) {
    return Response.json({ error: "DB not configured" });
  }

  const result = await pool.query('SELECT NOW() as time');
  return Response.json(result.rows[0]);
}
