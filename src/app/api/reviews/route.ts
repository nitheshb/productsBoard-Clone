import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import type {
  AssigneeSprintSummary,
  BoardTask,
  SprintReview,
} from '@/app/types';

// GET /api/reviews?sprint_id=xxx
//   → returns { summaries: AssigneeSprintSummary[] } for that sprint.
//     Combines pb_tasks aggregates + existing pb_sprint_reviews rows.
// GET /api/reviews  (no sprint_id)
//   → returns { reviews: SprintReview[] } for use across sprints.
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sprintId = searchParams.get('sprint_id');

    if (!sprintId) {
      const { data, error } = await supabase
        .from('pb_sprint_reviews')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json({ reviews: (data || []) as SprintReview[] });
    }

    const [tasksRes, reviewsRes] = await Promise.all([
      supabase
        .from('pb_tasks')
        .select(
          'id, summary, status, assignee, estimated_minutes, actual_minutes'
        )
        .eq('sprint_id', sprintId),
      supabase.from('pb_sprint_reviews').select('*').eq('sprint_id', sprintId),
    ]);

    if (tasksRes.error) throw tasksRes.error;
    if (reviewsRes.error) throw reviewsRes.error;

    const tasks = (tasksRes.data || []) as Array<
      Pick<
        BoardTask,
        'id' | 'summary' | 'status' | 'assignee' | 'estimated_minutes' | 'actual_minutes'
      >
    >;
    const reviews = (reviewsRes.data || []) as SprintReview[];

    const reviewByAssignee = new Map<string, SprintReview>();
    reviews.forEach((r) => reviewByAssignee.set(r.assignee, r));

    const summaries = new Map<string, AssigneeSprintSummary>();
    const getBucket = (name: string): AssigneeSprintSummary => {
      let bucket = summaries.get(name);
      if (!bucket) {
        bucket = {
          assignee: name,
          total: 0,
          completed: 0,
          in_progress: 0,
          pending: 0,
          estimated_minutes: 0,
          actual_minutes: 0,
          completed_titles: [],
          pending_titles: [],
          review: reviewByAssignee.get(name) ?? null,
        };
        summaries.set(name, bucket);
      }
      return bucket;
    };

    for (const task of tasks) {
      if (!task.assignee) continue;
      const bucket = getBucket(task.assignee);
      bucket.total += 1;
      bucket.estimated_minutes += task.estimated_minutes ?? 0;
      bucket.actual_minutes += task.actual_minutes ?? 0;

      if (task.status === 'Done') {
        bucket.completed += 1;
        bucket.completed_titles.push(task.summary);
      } else if (task.status === 'In Progress') {
        bucket.in_progress += 1;
        bucket.pending_titles.push(task.summary);
      } else {
        bucket.pending += 1;
        bucket.pending_titles.push(task.summary);
      }
    }

    // Include reviewers who no longer have tasks in the sprint (kept so their
    // written reflection isn't hidden).
    for (const review of reviews) {
      if (!summaries.has(review.assignee)) {
        summaries.set(review.assignee, {
          assignee: review.assignee,
          total: 0,
          completed: 0,
          in_progress: 0,
          pending: 0,
          estimated_minutes: 0,
          actual_minutes: 0,
          completed_titles: [],
          pending_titles: [],
          review,
        });
      }
    }

    const sorted = Array.from(summaries.values()).sort((a, b) =>
      a.assignee.localeCompare(b.assignee)
    );

    return NextResponse.json({ summaries: sorted });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch reviews';
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// PUT /api/reviews  { sprint_id, assignee, what_did?, blockers?, improvements?, submitted? }
//   Upserts a review by (sprint_id, assignee). If `submitted` is true,
//   stamps submitted_at with the server clock; if false, clears it back to
//   a draft.
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const sprintId = typeof body.sprint_id === 'string' ? body.sprint_id : '';
    const assignee = typeof body.assignee === 'string' ? body.assignee.trim() : '';

    if (!sprintId || !assignee) {
      return NextResponse.json(
        { error: 'sprint_id and assignee are required' },
        { status: 400 }
      );
    }

    const normalizeText = (v: unknown): string | null => {
      if (v === undefined) return undefined as unknown as null; // sentinel: leave column alone
      if (v === null) return null;
      if (typeof v !== 'string') return null;
      const t = v.trim();
      return t.length === 0 ? null : t;
    };

    const payload: Record<string, unknown> = {
      sprint_id: sprintId,
      assignee,
      updated_at: new Date().toISOString(),
    };

    const whatDid = normalizeText(body.what_did);
    const blockers = normalizeText(body.blockers);
    const improvements = normalizeText(body.improvements);
    if (whatDid !== undefined) payload.what_did = whatDid;
    if (blockers !== undefined) payload.blockers = blockers;
    if (improvements !== undefined) payload.improvements = improvements;

    if (body.submitted === true) {
      payload.submitted_at = new Date().toISOString();
    } else if (body.submitted === false) {
      payload.submitted_at = null;
    }

    const { data, error } = await supabase
      .from('pb_sprint_reviews')
      .upsert(payload, { onConflict: 'sprint_id,assignee' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to save review';
    console.error('Error saving review:', error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
