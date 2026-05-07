import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    await sql`UPDATE ideas SET status = ${status} WHERE id = ${id}`;
    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
