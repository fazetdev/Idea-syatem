import { sql } from '@/lib/db';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await sql`DELETE FROM tasks WHERE id = ${id}`;
    return Response.json({ success: true });
  } catch (error: any) {
    console.error('DELETE error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
