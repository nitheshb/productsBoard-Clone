import type { Sprint, SprintStats, SprintStatus, BoardTask } from '@/app/types';

export function deriveSprintStatus(
  startDate: string,
  endDate: string,
  today: Date = new Date()
): SprintStatus {
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59`);
  const now = new Date(today);

  if (now < start) return 'Upcoming';
  if (now > end) return 'Completed';
  return 'Active';
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
