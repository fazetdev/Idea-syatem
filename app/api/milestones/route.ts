import { sql } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/milestones?ideaId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const ideaId = searchParams.get('ideaId');

    if (!ideaId) {
      return Response.json(
        { error: 'ideaId is required' },
        { status: 400 }
      );
    }

    const milestones = await sql`
      SELECT *
      FROM milestones
      WHERE idea_id = ${parseInt(ideaId)}
      ORDER BY order_index ASC, created_at ASC
    `;

    return Response.json({ milestones });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/milestones
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { ideaId, title, description, targetDate } = body;

    if (!ideaId || !title) {
      return Response.json(
        { error: 'ideaId and title are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO milestones (idea_id, title, description, target_date)
      VALUES (${ideaId}, ${title}, ${description || ''}, ${targetDate || null})
      RETURNING *
    `;

    return Response.json({ 
      success: true, 
      milestone: result[0] 
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
