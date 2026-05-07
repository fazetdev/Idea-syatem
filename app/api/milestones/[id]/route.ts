import { sql } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

/**
 * DELETE milestone + its tasks (IMPORTANT FIX)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return Response.json(
        { error: 'Invalid milestone id' },
        { status: 400 }
      );
    }

    // cascade delete tasks first (prevents orphan data)
    await sql`DELETE FROM tasks WHERE milestone_id = ${id}`;
    await sql`DELETE FROM milestones WHERE id = ${id}`;

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('DELETE milestone error:', error);

    return Response.json(
      { error: 'Failed to delete milestone' },
      { status: 500 }
    );
  }
}

/**
 * UPDATE milestone (safe overwrite handling)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (!id || Number.isNaN(id)) {
      return Response.json(
        { error: 'Invalid milestone id' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, target_date } = body;

    const result = await sql`
      UPDATE milestones 
      SET 
        title = COALESCE(NULLIF(${title}, ''), title),
        description = COALESCE(NULLIF(${description}, ''), description),
        target_date = COALESCE(${target_date}, target_date)
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({
      success: true,
      milestone: result[0]
    });
  } catch (error: any) {
    console.error('PUT milestone error:', error);

    return Response.json(
      { error: 'Failed to update milestone' },
      { status: 500 }
    );
  }
}
