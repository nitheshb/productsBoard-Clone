'use client';

import { useCallback, useEffect, useState } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import SprintFormSheet from './_components/SprintFormSheet';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowPathIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  CalendarDaysIcon,
} from '@heroicons/react/24/outline';
import type { Sprint, SprintStatus, SprintWithStats } from '@/app/types';

const STATUS_STYLES: Record<SprintStatus, string> = {
  Upcoming: 'bg-amber-100 text-amber-700 border-amber-200',
  Active: 'bg-blue-100 text-blue-700 border-blue-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

function formatDate(value: string): string {
  if (!value) return '';
  const d = new Date(value.length === 10 ? `${value}T00:00:00` : value);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function durationDays(start: string, end: string): number {
  const s = new Date(`${start}T00:00:00`);
  const e = new Date(`${end}T00:00:00`);
  const diff = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(diff, 0);
}

export default function SprintsPage() {
  const [sprints, setSprints] = useState<SprintWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingSprint, setEditingSprint] = useState<Sprint | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<SprintWithStats | null>(null);
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null);
  const [deleteForce, setDeleteForce] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchSprints = useCallback(async () => {
    try {
      const res = await fetch('/api/sprints');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load sprints');
      }
      const data = await res.json();
      setSprints(data.sprints || []);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sprints');
      setSprints([]);
    }
  }, []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      await fetchSprints();
      setIsLoading(false);
    }
    load();
  }, [fetchSprints]);

  const openCreate = () => {
    setEditingSprint(null);
    setSheetOpen(true);
  };

  const openEdit = (sprint: Sprint) => {
    setEditingSprint(sprint);
    setSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) setEditingSprint(null);
  };

  const requestDelete = (sprint: SprintWithStats) => {
    setDeleteTarget(sprint);
    setDeleteWarning(null);
    setDeleteForce(false);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const url = `/api/sprints/${deleteTarget.id}${deleteForce ? '?force=true' : ''}`;
      const res = await fetch(url, { method: 'DELETE' });

      if (!res.ok) {
        const data = await res.json();
        if (res.status === 409 && typeof data.assigned_task_count === 'number') {
          setDeleteWarning(
            `${data.assigned_task_count} task${data.assigned_task_count === 1 ? '' : 's'} ${
              data.assigned_task_count === 1 ? 'is' : 'are'
            } assigned to this sprint. Confirm again to unassign and delete.`
          );
          setDeleteForce(true);
          setIsDeleting(false);
          return;
        }
        throw new Error(data.error || 'Failed to delete sprint');
      }

      setDeleteTarget(null);
      setDeleteWarning(null);
      setDeleteForce(false);
      await fetchSprints();
    } catch (err) {
      setDeleteWarning(err instanceof Error ? err.message : 'Failed to delete sprint');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-full mx-auto">
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center gap-2">
              <ArrowPathIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Sprints</h1>
            </div>
            <Button onClick={openCreate} className="bg-blue-500 hover:bg-blue-600">
              <PlusIcon className="h-4 w-4 mr-1.5" />
              Create Sprint
            </Button>
          </header>

          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center h-64 text-sm text-gray-400">
                Loading sprints...
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <ArrowPathIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">Unable to load sprints</h2>
                <p className="text-gray-500 text-sm max-w-md mb-4">{error}</p>
                <p className="text-gray-400 text-xs max-w-md">
                  If this is your first time, run the migration in{' '}
                  <code className="bg-gray-100 px-1 rounded">database_pb_sprints_migration.sql</code>{' '}
                  in your Supabase SQL editor.
                </p>
              </div>
            ) : sprints.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ArrowPathIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">No sprints yet</h2>
                <p className="text-gray-500 text-sm mb-4">
                  Create your first sprint to start grouping tasks.
                </p>
                <Button onClick={openCreate} className="bg-blue-500 hover:bg-blue-600">
                  <PlusIcon className="h-4 w-4 mr-1.5" />
                  Create Sprint
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {sprints.map((sprint) => (
                  <div
                    key={sprint.id}
                    className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  >
                    <div className="flex items-start justify-between gap-3 p-4 border-b border-gray-100">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{sprint.name}</h3>
                          <Badge
                            className={`text-xs border ${STATUS_STYLES[sprint.status]}`}
                            variant="outline"
                          >
                            {sprint.status}
                          </Badge>
                        </div>
                        {sprint.description && (
                          <p className="text-xs text-gray-500 line-clamp-2">{sprint.description}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEdit(sprint)}
                          className="p-1.5 rounded text-gray-400 hover:text-blue-500 hover:bg-blue-50"
                          title="Edit sprint"
                        >
                          <PencilSquareIcon className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => requestDelete(sprint)}
                          className="p-1.5 rounded text-gray-400 hover:text-red-500 hover:bg-red-50"
                          title="Delete sprint"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <CalendarDaysIcon className="h-4 w-4" />
                        <span>
                          {formatDate(sprint.start_date)} – {formatDate(sprint.end_date)}
                        </span>
                        <span className="ml-auto text-gray-400">
                          {durationDays(sprint.start_date, sprint.end_date)} days
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-gray-500">Progress</span>
                          <span className="font-medium text-gray-900">
                            {sprint.stats.completion_percentage}%
                          </span>
                        </div>
                        <Progress
                          value={sprint.stats.completion_percentage}
                          className="h-2 bg-gray-100 [&>div]:bg-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center">
                        <Stat label="Total" value={sprint.stats.total} color="text-gray-900" />
                        <Stat
                          label="Done"
                          value={sprint.stats.completed}
                          color="text-green-600"
                        />
                        <Stat
                          label="In Progress"
                          value={sprint.stats.in_progress}
                          color="text-blue-600"
                        />
                        <Stat
                          label="Pending"
                          value={sprint.stats.pending}
                          color="text-gray-600"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <SprintFormSheet
        open={sheetOpen}
        onOpenChange={handleSheetOpenChange}
        sprint={editingSprint}
        onSaved={fetchSprints}
      />

      <ConfirmationDialog
        isOpen={Boolean(deleteTarget)}
        onClose={() => {
          if (isDeleting) return;
          setDeleteTarget(null);
          setDeleteWarning(null);
          setDeleteForce(false);
        }}
        onConfirm={handleDelete}
        title={deleteForce ? 'Unassign tasks and delete?' : `Delete ${deleteTarget?.name}?`}
        description={
          deleteWarning ||
          `This will permanently remove the sprint "${deleteTarget?.name}". This action cannot be undone.`
        }
        confirmText={deleteForce ? 'Unassign & Delete' : 'Delete'}
        isLoading={isDeleting}
      />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className={`text-sm font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400">{label}</div>
    </div>
  );
}
