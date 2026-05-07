import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    // Add missing columns to tasks table
    await sql`
      ALTER TABLE tasks 
      ADD COLUMN IF NOT EXISTS description TEXT
    `;
    
    await sql`
      ALTER TABLE tasks 
      ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0
    `;
    
    await sql`
      ALTER TABLE tasks 
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW()
    `;
    
    return Response.json({ 
      success: true, 
      message: "Tasks table columns added successfully" 
    });
  } catch (error: any) {
    console.error('Error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
