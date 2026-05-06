import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET() {
  const result = await pool.query('SELECT NOW() as time');
  return Response.json(result.rows[0]);
}
