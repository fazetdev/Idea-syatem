import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const ideas = await sql`
      SELECT 
        id::text as id,
        title,
        note as "refinedIdea",
        goal,
        created_at as "createdAt"
      FROM ideas
      ORDER BY created_at DESC
    `;

    return Response.json({ ideas });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, refinedIdea, goal } = body;

    if (!title || !refinedIdea || !goal) {
      return Response.json(
        { error: 'Missing fields' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO ideas (title, note, goal, tags)
      VALUES (${title}, ${refinedIdea}, ${goal}, ARRAY[]::text[])
      RETURNING 
        id::text as id,
        title,
        note as "refinedIdea",
        goal,
        created_at as "createdAt"
    `;

    return Response.json({
      success: true,
      idea: result[0]
    });

  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
