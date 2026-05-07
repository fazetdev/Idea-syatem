import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');

    if (!ideaId) {
      return Response.json(
        { error: 'ideaId is required' },
        { status: 400 }
      );
    }

    const milestones = await sql`
      SELECT 
        id,
        idea_id,
        title,
        description,
        target_date,
        status,
        created_at
      FROM milestones
      WHERE idea_id = ${parseInt(ideaId)}
      ORDER BY order_index ASC, id ASC
    `;

    return Response.json({ milestones });
  } catch (error: any) {
    console.error('GET /api/milestones error:', error);
    return Response.json(
      { error: error.message || 'Failed to fetch milestones' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
  } catch (error: any) {
    console.error('POST /api/milestones error:', error);
    return Response.json(
      { error: error.message || 'Failed to create milestone' },
      { status: 500 }
    );
  }
}
