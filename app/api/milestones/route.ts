import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ideaId = searchParams.get('ideaId');

    if (!ideaId) {
      return Response.json({ milestones: [] });
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
      ORDER BY id DESC
    `;

    return Response.json({ milestones });
  } catch (error: any) {
    console.error('GET milestones error:', error);
    return Response.json({ milestones: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { ideaId, title, description, targetDate } = body;

    if (!ideaId || !title) {
      return Response.json(
        { error: 'ideaId and title required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO milestones (idea_id, title, description, target_date, status)
      VALUES (${ideaId}, ${title}, ${description || ''}, ${targetDate || null}, 'pending')
      RETURNING *
    `;

    return Response.json({ milestone: result[0] });
  } catch (error: any) {
    console.error('POST milestones error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
