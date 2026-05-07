import { pool } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

// GET /api/ideas/:id
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid idea ID' },
        { status: 400 }
      );
    }
    
    const result = await pool.query(
      `SELECT id, title, note, goal, tags, created_at 
       FROM ideas 
       WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Idea not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (error: any) {
    console.error('GET idea error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE /api/ideas/:id
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid idea ID' },
        { status: 400 }
      );
    }
    
    await pool.query('DELETE FROM ideas WHERE id = $1', [id]);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Idea deleted successfully'
    });
  } catch (error: any) {
    console.error('DELETE idea error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}