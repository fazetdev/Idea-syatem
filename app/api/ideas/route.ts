import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    // Mapping created_at to createdAt for the frontend
    const ideas = await sql`SELECT id, title, note as "refinedIdea", goal, status, created_at as "createdAt" FROM ideas ORDER BY created_at DESC`;
    return NextResponse.json({ ideas });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, refinedIdea, goal } = await req.json();
    
    // Mapping refinedIdea from frontend to 'note' in DB
    const result = await sql`
      INSERT INTO ideas (title, note, goal, status) 
      VALUES (${title}, ${refinedIdea}, ${goal}, 'captured')
      RETURNING id
    `;
    
    return NextResponse.json({ id: result[0].id });
  } catch (error: any) {
    console.error("POST Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
