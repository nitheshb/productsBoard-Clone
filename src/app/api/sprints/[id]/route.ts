import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { attachStatsToSprints, deriveSprintStatus } from '@/lib/sprintUtils';
import { syncSprintStatusesInDb } from '@/lib/sprintSync';
import type { BoardTask, Sprint } from '@/app/types';

function isValidDate(value: unknown): value is string {
  if (typeof value !== 'string' || !value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const [sprintRes, tasksRes] = await Promise.all([
      supabase.from('pb_sprints').select('*').eq('id', id).single(),
      supabase.from('pb_tasks').select('id, status, sprint_id').eq('sprint_id', id),
    ]);

    if (sprintRes.error) throw sprintRes.error;
    if (tasksRes.error) throw tasksRes.error;

    const [synced] = await syncSprintStatusesInDb([sprintRes.data as Sprint]);
    const [withStats] = attachStatsToSprints(
      [synced],
      (tasksRes.data || []) as BoardTask[]
    );

    return NextResponse.json(withStats);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch sprint';
    console.error('Error fetching sprint:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { id } = params;

    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (body.name !== undefined) {
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      if (!name) {
        return NextResponse.json({ error: 'Sprint name cannot be empty' }, { status: 400 });
      }

      const { data: existing, error: existingErr } = await supabase
        .from('pb_sprints')
        .select('id')
        .ilike('name', name)
        .neq('id', id)
        .maybeSingle();

      if (existingErr && existingErr.code !== 'PGRST116') throw existingErr;
      if (existing) {
        return NextResponse.json(
          { error: 'A sprint with this name already exists' },
          { status: 409 }
        );
      }
      updateData.name = name;
    }

    if (body.description !== undefined) {
      updateData.description = body.description?.trim() || null;
    }

    const { data: current, error: currentErr } = await supabase
      .from('pb_sprints')
      .select('start_date, end_date')
      .eq('id', id)
      .single();
    if (currentErr) throw currentErr;

    const startDate = body.start_date ?? current.start_date;
    const endDate = body.end_date ?? current.end_date;

    if (body.start_date !== undefined || body.end_date !== undefined) {
      if (!isValidDate(startDate) || !isValidDate(endDate)) {
        return NextResponse.json(
          { error: 'Valid start_date and end_date are required' },
          { status: 400 }
        );
      }
      if (new Date(endDate) < new Date(startDate)) {
        return NextResponse.json(
          { error: 'End date cannot be before start date' },
          { status: 400 }
        );
      }

      if (body.start_date !== undefined) updateData.start_date = startDate;
      if (body.end_date !== undefined) updateData.end_date = endDate;
    }

    // Always reconcile status from the sprint's date range (unless explicitly overridden).
    if (body.status !== undefined && body.start_date === undefined && body.end_date === undefined) {
      updateData.status = body.status;
    } else {
      updateData.status = deriveSprintStatus(startDate, endDate);
    }

    const { data, error } = await supabase
      .from('pb_sprints')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to update sprint';
    console.error('Error updating sprint:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get('force') === 'true';

    const { count, error: countErr } = await supabase
      .from('pb_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('sprint_id', id);

    if (countErr) throw countErr;

    if ((count ?? 0) > 0 && !force) {
      return NextResponse.json(
        {
          error: 'Sprint has assigned tasks',
          assigned_task_count: count,
        },
        { status: 409 }
      );
    }

    if ((count ?? 0) > 0 && force) {
      const { error: unassignErr } = await supabase
        .from('pb_tasks')
        .update({ sprint_id: null, updated_at: new Date().toISOString() })
        .eq('sprint_id', id);
      if (unassignErr) throw unassignErr;
    }

    const { error } = await supabase.from('pb_sprints').delete().eq('id', id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete sprint';
    console.error('Error deleting sprint:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
