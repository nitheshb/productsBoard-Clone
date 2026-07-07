import type { Sprint, SprintStats, SprintStatus, BoardTask } from '@/app/types';

/** Normalize Supabase DATE / ISO strings to YYYY-MM-DD. */
export function toDateOnly(value: string): string {
  return value.length >= 10 ? value.substring(0, 10) : value;
}

function parseLocalDate(value: string): Date {
  return new Date(`${toDateOnly(value)}T00:00:00`);
}

function startOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date): Date {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

export function deriveSprintStatus(
  startDate: string,
  endDate: string,
  today: Date = new Date()
): SprintStatus {
  const sprintStart = startOfDay(parseLocalDate(startDate));
  const sprintEnd = endOfDay(parseLocalDate(endDate));
  const now = startOfDay(today);

  if (now < sprintStart) return 'Upcoming';
  if (now > sprintEnd) return 'Completed';
  return 'Active';
}

/** Returns sprints with status corrected from their date range (in-memory only). */
export function applyDerivedSprintStatuses(
  sprints: Sprint[],
  today: Date = new Date()
): Sprint[] {
  return sprints.map((sprint) => {
    const derived = deriveSprintStatus(sprint.start_date, sprint.end_date, today);
    return derived === sprint.status ? sprint : { ...sprint, status: derived };
  });
}

export function getSprintStatusUpdates(
  sprints: Sprint[],
  today: Date = new Date()
): Array<{ id: string; status: SprintStatus }> {
  return sprints
    .map((sprint) => ({
      id: sprint.id,
      status: deriveSprintStatus(sprint.start_date, sprint.end_date, today),
      current: sprint.status,
    }))
    .filter((row) => row.status !== row.current)
    .map(({ id, status }) => ({ id, status }));
}

export function calculateSprintStats(tasks: BoardTask[]): SprintStats {
  const total = tasks.length;
  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  for (const task of tasks) {
    if (task.status === 'Done') completed += 1;
    else if (task.status === 'In Progress') inProgress += 1;
    else pending += 1;
  }

  return {
    total,
    completed,
    in_progress: inProgress,
    pending,
    completion_percentage: total === 0 ? 0 : Math.round((completed / total) * 100),
  };
}

export function attachStatsToSprints(
  sprints: Sprint[],
  tasks: BoardTask[]
): Array<Sprint & { stats: SprintStats }> {
  const tasksBySprint = new Map<string, BoardTask[]>();
  for (const task of tasks) {
    if (!task.sprint_id) continue;
    const list = tasksBySprint.get(task.sprint_id) || [];
    list.push(task);
    tasksBySprint.set(task.sprint_id, list);
  }

  return sprints.map((sprint) => ({
    ...sprint,
    stats: calculateSprintStats(tasksBySprint.get(sprint.id) || []),
  }));
}
