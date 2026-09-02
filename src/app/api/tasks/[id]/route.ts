import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { parseProductIds, replaceTaskProducts } from '@/lib/taskProducts';

const VALID_DAYS = new Set([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]);

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

    if (body.summary !== undefined) updateData.summary = body.summary;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.issue_type !== undefined) updateData.issue_type = body.issue_type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.assignee !== undefined) updateData.assignee = body.assignee;
    if (body.assignee_id !== undefined) updateData.assignee_id = body.assignee_id;
    if (body.sprint_id !== undefined) updateData.sprint_id = body.sprint_id || null;

    const productIds =
      body.product_ids !== undefined || body.product_id !== undefined
        ? parseProductIds(body)
        : undefined;
    if (productIds) updateData.product_id = productIds[0] || null;

    const trimOrNull = (v: unknown): string | null => {
      if (v === null) return null;
      if (typeof v !== 'string') return null;
      const t = v.trim();
      return t.length > 0 ? t : null;
    };
    for (const key of ['pr_url', 'approach', 'acceptance_criteria', 'repro_steps'] as const) {
      if (body[key] !== undefined) updateData[key] = trimOrNull(body[key]);
    }

    if (body.estimated_minutes !== undefined) {
      if (body.estimated_minutes === null) {
        updateData.estimated_minutes = null;
      } else if (
        typeof body.estimated_minutes !== 'number' ||
        !isFinite(body.estimated_minutes) ||
        body.estimated_minutes <= 0
      ) {
        return NextResponse.json(
          { error: 'Estimated time must be greater than zero' },
          { status: 400 }
        );
      } else {
        updateData.estimated_minutes = Math.round(body.estimated_minutes);
      }
    }

    if (body.actual_minutes !== undefined) {
      if (body.actual_minutes === null) {
        updateData.actual_minutes = null;
      } else if (
        typeof body.actual_minutes !== 'number' ||
        !isFinite(body.actual_minutes) ||
        body.actual_minutes < 0
      ) {
        return NextResponse.json(
          { error: 'Actual time cannot be negative' },
          { status: 400 }
        );
      } else {
        updateData.actual_minutes = Math.round(body.actual_minutes);
      }
    }

    for (const key of ['start_day', 'end_day'] as const) {
      if (body[key] === undefined) continue;
      const raw = body[key];
      if (raw === null || raw === '') {
        updateData[key] = null;
        continue;
      }
      if (typeof raw !== 'string' || !VALID_DAYS.has(raw)) {
        return NextResponse.json(
          { error: `${key} must be one of Monday–Sunday` },
          { status: 400 }
        );
      }
      updateData[key] = raw;
    }

    const { data, error } = await supabase
      .from('pb_tasks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (productIds) {
      try {
        await replaceTaskProducts(id, productIds);
      } catch (linkError) {
        console.error('Error saving task products:', linkError);
      }
    }

    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update task';
    console.error('Error updating task:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error } = await supabase
      .from('pb_tasks')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete task';
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
