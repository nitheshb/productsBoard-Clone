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

function normalizeDayInput(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string' || !VALID_DAYS.has(value)) {
    return '__invalid__';
  }
  return value;
}

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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'object' && error && 'message' in error) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message) return message;
  }
  return '';
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pb_tasks')
      .select('*, sprint:pb_sprints(id, name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    const rows = (data || []) as Record<string, unknown>[];
    const taskIds = rows
      .map((row) => row.id)
      .filter((id): id is string => typeof id === 'string');

    const productIdsByTask = new Map<string, string[]>();
    if (taskIds.length > 0) {
      const { data: links, error: linkError } = await supabase
        .from('pb_task_products')
        .select('task_id, product_id')
        .in('task_id', taskIds);

      if (!linkError && links) {
        for (const link of links) {
          const taskId = link.task_id as string | undefined;
          const productId = link.product_id as string | undefined;
          if (!taskId || !productId) continue;
          const list = productIdsByTask.get(taskId) || [];
          list.push(productId);
          productIdsByTask.set(taskId, list);
        }
      }
    }

    const allProductIds = new Set<string>();
    for (const ids of productIdsByTask.values()) {
      ids.forEach((id) => allProductIds.add(id));
    }
    for (const row of rows) {
      if (typeof row.product_id === 'string' && row.product_id) {
        allProductIds.add(row.product_id);
      }
    }

    const nameById = new Map<string, string>();
    if (allProductIds.size > 0) {
      const { data: products } = await supabase
        .from('pb_products')
        .select('id, name')
        .in('id', [...allProductIds]);
      for (const product of products || []) {
        if (product.id && product.name) nameById.set(product.id, product.name);
      }
    }

    const tasks = rows.map((row) => {
      const sprint = row.sprint as { id: string; name: string } | null | undefined;
      const { sprint: _sprint, ...rest } = row;
      void _sprint;

      const linkedIds = productIdsByTask.get(row.id as string);
      const ids =
        linkedIds && linkedIds.length > 0
          ? linkedIds
          : typeof row.product_id === 'string' && row.product_id
            ? [row.product_id]
            : [];
      const products = ids
        .map((id) => {
          const name = nameById.get(id);
          return name ? { id, name } : null;
        })
        .filter((p): p is { id: string; name: string } => Boolean(p));

      return {
        ...rest,
        sprint_name: sprint?.name ?? null,
        product_ids: ids,
        products,
        product_id: ids[0] ?? null,
        product_name: products.map((p) => p.name).join(', ') || null,
      };
    });

    return NextResponse.json({ tasks });
  } catch (error: unknown) {
    console.error('Error fetching tasks:', error);
    const raw = getErrorMessage(error);
    return NextResponse.json(
      { error: raw || 'Failed to fetch tasks' },
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

    if (
      body.estimated_minutes === undefined ||
      body.estimated_minutes === null ||
      typeof body.estimated_minutes !== 'number' ||
      !isFinite(body.estimated_minutes) ||
      body.estimated_minutes <= 0
    ) {
      return NextResponse.json(
        { error: 'Estimated time is required and must be greater than zero' },
        { status: 400 }
      );
    }

    if (
      body.actual_minutes !== undefined &&
      body.actual_minutes !== null &&
      (typeof body.actual_minutes !== 'number' ||
        !isFinite(body.actual_minutes) ||
        body.actual_minutes < 0)
    ) {
      return NextResponse.json(
        { error: 'Actual time cannot be negative' },
        { status: 400 }
      );
    }

    const dayFields: Record<string, string | null> = {};
    for (const key of ['start_day', 'end_day'] as const) {
      const normalized = normalizeDayInput(body[key]);
      if (normalized === '__invalid__') {
        return NextResponse.json(
          { error: `${key} must be one of Monday–Sunday` },
          { status: 400 }
        );
      }
      if (normalized !== undefined) dayFields[key] = normalized;
    }

    const ticketKey = await generateTicketKey();
    const productIds = parseProductIds(body);

    const trimOrNull = (v: unknown): string | null => {
      if (typeof v !== 'string') return null;
      const t = v.trim();
      return t.length > 0 ? t : null;
    };

    const trimOrNull = (v: unknown): string | null => {
      if (typeof v !== 'string') return null;
      const t = v.trim();
      return t.length > 0 ? t : null;
    };

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
        product_id: productIds[0] || null,
        estimated_minutes: Math.round(body.estimated_minutes),
        actual_minutes:
          typeof body.actual_minutes === 'number' ? Math.round(body.actual_minutes) : null,
        pr_url: trimOrNull(body.pr_url),
        approach: trimOrNull(body.approach),
        acceptance_criteria: trimOrNull(body.acceptance_criteria),
        repro_steps: trimOrNull(body.repro_steps),
        ...dayFields,
      }])
      .select()
      .single();

    if (error) throw error;

    try {
      await replaceTaskProducts(data.id, productIds);
    } catch (linkError) {
      console.error('Error saving task products:', linkError);
    }

    return NextResponse.json(
      { ...data, product_ids: productIds, product_id: productIds[0] || null },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create task';
    console.error('Error creating task:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
