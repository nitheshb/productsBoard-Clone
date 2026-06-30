import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

async function generateTicketKey(): Promise<string> {
  const { data, error } = await supabase
    .from('pb_tasks')
    .select('ticket_key')
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;

  if (!data || data.length === 0) {
    return 'PB-1';
  }

  const lastKey = data[0].ticket_key as string;
  const match = lastKey.match(/PB-(\d+)/);
  const nextNum = match ? parseInt(match[1], 10) + 1 : 1;
  return `PB-${nextNum}`;
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pb_tasks')
      .select('*, sprint:pb_sprints(id, name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const tasks = (data || []).map((row: Record<string, unknown>) => {
      const sprint = row.sprint as { id: string; name: string } | null | undefined;
      const { sprint: _sprint, ...rest } = row;
      void _sprint;
      return {
        ...rest,
        sprint_name: sprint?.name ?? null,
      };
    });

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.summary || !body.assignee) {
      return NextResponse.json(
        { error: 'Summary and assignee are required' },
        { status: 400 }
      );
    }

    const ticketKey = await generateTicketKey();

    const { data, error } = await supabase
      .from('pb_tasks')
      .insert([{
        ticket_key: ticketKey,
        summary: body.summary,
        description: body.description || null,
        issue_type: body.issue_type || 'Task',
        status: body.status || 'To Do',
        priority: body.priority || 'Medium',
        assignee: body.assignee,
        assignee_id: body.assignee_id || null,
        sprint_id: body.sprint_id || null,
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    console.error('Error creating task:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
