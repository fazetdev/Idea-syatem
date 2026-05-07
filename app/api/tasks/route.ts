import { sql } from '@/lib/db';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get('milestoneId');

    if (!milestoneId) {
      return Response.json({ tasks: [] });
    }

    const tasks = await sql`
      SELECT 
        id,
        milestone_id,
        task,
        duration_minutes,
        scheduled_time,
        status
      FROM tasks
      WHERE milestone_id = ${parseInt(milestoneId)}
      ORDER BY id ASC
    `;

    return Response.json({ tasks });
  } catch (error: any) {
    console.error('GET tasks error:', error);
    return Response.json({ tasks: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { milestoneId, task, durationMinutes, scheduledTime } = body;

    if (!milestoneId || !task) {
      return Response.json(
        { error: 'milestoneId and task required' },
        { status: 400 }
      );
    }

    const result = await sql`
      INSERT INTO tasks (milestone_id, task, duration_minutes, scheduled_time, status)
      VALUES (${milestoneId}, ${task}, ${durationMinutes || null}, ${scheduledTime || null}, 'pending')
      RETURNING *
    `;

    return Response.json({ task: result[0] });
  } catch (error: any) {
    console.error('POST tasks error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
