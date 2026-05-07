import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const ideas = await sql`
      SELECT 
        id, 
        title, 
        note as "refinedIdea", 
        goal, 
        status, 
        created_at as "createdAt" 
      FROM ideas 
      ORDER BY created_at DESC
    `;
    return NextResponse.json({ ideas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, refinedIdea, goal } = await req.json();
    
    // Using 'note' to match your schema's NOT NULL column
    const result = await sql`
      INSERT INTO ideas (title, note, goal, status) 
      VALUES (${title}, ${refinedIdea || ''}, ${goal || ''}, 'captured')
      RETURNING id
    `;
    
    return NextResponse.json({ id: result[0].id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
    
    await sql`DELETE FROM ideas WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
