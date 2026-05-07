import { sql } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await sql`DELETE FROM milestones WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { title, description, target_date } = body;
    
    const result = await sql`
      UPDATE milestones 
      SET title = COALESCE(${title}, title),
          description = COALESCE(${description}, description),
          target_date = COALESCE(${target_date}, target_date)
      WHERE id = ${id}
      RETURNING *
    `;
    
    return Response.json({ success: true, milestone: result[0] });
  } catch (error: any) {
    console.error('PUT error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
