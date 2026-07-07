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

export async function GET() {
  try {
    const [sprintsRes, tasksRes] = await Promise.all([
      supabase.from('pb_sprints').select('*').order('start_date', { ascending: true }),
      supabase.from('pb_tasks').select('id, status, sprint_id'),
    ]);

    if (sprintsRes.error) throw sprintsRes.error;
    if (tasksRes.error) throw tasksRes.error;

    const rawSprints = (sprintsRes.data || []) as Sprint[];
    const tasks = (tasksRes.data || []) as BoardTask[];

    const sprints = await syncSprintStatusesInDb(rawSprints);
    const sprintsWithStats = attachStatsToSprints(sprints, tasks);

    return NextResponse.json({ sprints: sprintsWithStats });
  } catch (error) {
    console.error('Error fetching sprints:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sprints' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return NextResponse.json({ error: 'Sprint name is required' }, { status: 400 });
    }

    if (!isValidDate(body.start_date) || !isValidDate(body.end_date)) {
      return NextResponse.json(
        { error: 'Valid start_date and end_date are required' },
        { status: 400 }
      );
    }

    if (new Date(body.end_date) < new Date(body.start_date)) {
      return NextResponse.json(
        { error: 'End date cannot be before start date' },
        { status: 400 }
      );
    }

    const { data: existing, error: existingErr } = await supabase
      .from('pb_sprints')
      .select('id')
      .ilike('name', name)
      .maybeSingle();

    if (existingErr && existingErr.code !== 'PGRST116') throw existingErr;
    if (existing) {
      return NextResponse.json(
        { error: 'A sprint with this name already exists' },
        { status: 409 }
      );
    }

    const status = deriveSprintStatus(body.start_date, body.end_date);

    const { data, error } = await supabase
      .from('pb_sprints')
      .insert([
        {
          name,
          description: body.description?.trim() || null,
          start_date: body.start_date,
          end_date: body.end_date,
          status,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create sprint';
    console.error('Error creating sprint:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
