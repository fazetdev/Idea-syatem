import { sql } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ideaId = searchParams.get('ideaId');
  if (!ideaId) return Response.json({ milestones: [] });

  const milestones = await sql`
    SELECT * FROM milestones WHERE idea_id = ${parseInt(ideaId)} ORDER BY id ASC
  `;
  return Response.json({ milestones });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaId, title, description, targetDate, method, outcome } = body;

    const result = await sql`
      INSERT INTO milestones (idea_id, title, description, target_date, method, outcome, status)
      VALUES (${ideaId}, ${title}, ${description || ''}, ${targetDate || null}, ${method || ''}, ${outcome || ''}, 'pending')
      RETURNING *
    `;
    return Response.json({ milestone: result[0] });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
