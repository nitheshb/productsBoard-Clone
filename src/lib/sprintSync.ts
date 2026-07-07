import { supabase } from '@/lib/supabaseClient';
import {
  applyDerivedSprintStatuses,
  getSprintStatusUpdates,
} from '@/lib/sprintUtils';
import type { Sprint } from '@/app/types';

/**
 * Reconcile stored sprint statuses with each sprint's date range and persist changes.
 */
export async function syncSprintStatusesInDb(
  sprints: Sprint[],
  today: Date = new Date()
): Promise<Sprint[]> {
  const updates = getSprintStatusUpdates(sprints, today);

  if (updates.length > 0) {
    const updatedAt = new Date().toISOString();
    await Promise.all(
      updates.map(({ id, status }) =>
        supabase
          .from('pb_sprints')
          .update({ status, updated_at: updatedAt })
          .eq('id', id)
      )
    );
  }

  return applyDerivedSprintStatuses(sprints, today);
}
