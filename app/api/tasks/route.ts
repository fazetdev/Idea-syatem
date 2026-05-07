import { sql } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/tasks?milestoneId=123
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const milestoneId = searchParams.get('milestoneId');

    if (!milestoneId) {
      return Response.json(
        { error: 'milestoneId is required' },
        { status: 400 }
      );
    }

    const tasks = await sql`
      SELECT *
      FROM tasks
      WHERE milestone_id = ${parseInt(milestoneId)}
      ORDER BY order_index ASC, created_at ASC
    `;

    return Response.json({ tasks });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}

// POST /api/tasks
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { milestoneId, task, durationMinutes, scheduledTime } = body;

    if (!milestoneId || !task) {
      return Response.json(
        { error: 'milestoneId and task are required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO tasks (milestone_id, task, duration_minutes, scheduled_time)
      VALUES (${milestoneId}, ${task}, ${durationMinutes || null}, ${scheduledTime || null})
      RETURNING *
    `;

    return Response.json({ 
      success: true, 
      task: result[0] 
    });
  } catch (err: any) {
    return Response.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
