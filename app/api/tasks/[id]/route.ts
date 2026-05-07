import { sql } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

// UPDATE task (toggle completion / edit)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const { task, duration_minutes, status } = body;

    const result = await sql`
      UPDATE tasks
      SET 
        task = COALESCE(${task}, task),
        duration_minutes = COALESCE(${duration_minutes}, duration_minutes),
        status = COALESCE(${status}, status)
      WHERE id = ${id}
      RETURNING *
    `;

    return Response.json({ task: result[0] });
  } catch (error: any) {
    console.error('TASK PUT error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
