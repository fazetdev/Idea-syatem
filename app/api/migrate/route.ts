import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    await sql`
      ALTER TABLE ideas 
      ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'captured'
    `;
    return NextResponse.json({ message: "Migration successful: status column added." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
