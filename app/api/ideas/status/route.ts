import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const result = await sql`
      UPDATE ideas 
      SET status = ${status} 
      WHERE id = ${id}
      RETURNING id, status
    `;

    return NextResponse.json({ success: true, idea: result[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
