import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Adding missing columns to milestones table...');
    
    // Add description column
    await sql`
      ALTER TABLE milestones 
      ADD COLUMN IF NOT EXISTS description TEXT
    `;
    
    console.log('Added description column');
    
    // Add order_index column
    await sql`
      ALTER TABLE milestones 
      ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0
    `;
    
    console.log('Added order_index column');
    
    return Response.json({ 
      success: true, 
      message: "Added 'description' column to milestones table" 
    });
  } catch (error: any) {
    console.error('Error adding column:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
