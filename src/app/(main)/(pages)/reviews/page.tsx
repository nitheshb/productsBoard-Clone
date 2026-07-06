'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import type {
  AssigneeSprintSummary,
  SprintStatus,
  SprintWithStats,
} from '@/app/types';
import { formatDuration } from '@/lib/timeUtils';

const STATUS_STYLES: Record<SprintStatus, string> = {
  Upcoming: 'bg-amber-100 text-amber-700 border-amber-200',
  Active: 'bg-blue-100 text-blue-700 border-blue-200',
  Completed: 'bg-green-100 text-green-700 border-green-200',
};

function formatDateRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const s = new Date(`${start.slice(0, 10)}T00:00:00`);
  const e = new Date(`${end.slice(0, 10)}T00:00:00`);
  return `${s.toLocaleDateString(undefined, opts)} – ${e.toLocaleDateString(
    undefined,
    { ...opts, year: 'numeric' }
  )}`;
}

interface ReviewDraft {
  what_did: string;
  blockers: string;
  improvements: string;
  dirty: boolean;
  saving: boolean;
  submitting: boolean;
  error: string | null;
  submitted_at: string | null;
}

function emptyDraft(): ReviewDraft {
  return {
    what_did: '',
    blockers: '',
    improvements: '',
    dirty: false,
    saving: false,
    submitting: false,
    error: null,
    submitted_at: null,
  };
}

function draftFromSummary(summary: AssigneeSprintSummary): ReviewDraft {
  return {
    what_did: summary.review?.what_did ?? '',
    blockers: summary.review?.blockers ?? '',
    improvements: summary.review?.improvements ?? '',
    dirty: false,
    saving: false,
    submitting: false,
    error: null,
    submitted_at: summary.review?.submitted_at ?? null,
  };
}

export default function ReviewsPage() {
  const [sprints, setSprints] = useState<SprintWithStats[]>([]);
  const [sprintsLoading, setSprintsLoading] = useState(true);
  const [sprintsError, setSprintsError] = useState('');

  const [openSprintId, setOpenSprintId] = useState<string | null>(null);
  const [summariesBySprint, setSummariesBySprint] = useState<
    Record<string, AssigneeSprintSummary[]>
  >({});
  const [loadingSprintId, setLoadingSprintId] = useState<string | null>(null);
  const [sprintErrors, setSprintErrors] = useState<Record<string, string>>({});

  // Editable drafts keyed by `${sprintId}::${assignee}`.
  const [drafts, setDrafts] = useState<Record<string, ReviewDraft>>({});
  // Which assignee cards are expanded, keyed by `${sprintId}::${assignee}`.
  const [expandedAssignees, setExpandedAssignees] = useState<Record<string, boolean>>({});

  const draftKey = (sprintId: string, assignee: string) =>
    `${sprintId}::${assignee}`;

  const fetchSprints = useCallback(async () => {
    setSprintsLoading(true);
    try {
      const res = await fetch('/api/sprints');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to load sprints');
      }
      const data = await res.json();
      setSprints(data.sprints || []);
      setSprintsError('');
    } catch (err) {
      setSprintsError(err instanceof Error ? err.message : 'Failed to load sprints');
      setSprints([]);
    } finally {
      setSprintsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSprints();
  }, [fetchSprints]);

  const loadSummaries = useCallback(
    async (sprintId: string) => {
      setLoadingSprintId(sprintId);
      try {
        const res = await fetch(`/api/reviews?sprint_id=${sprintId}`);
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || 'Failed to load reviews');
        }
        const data = await res.json();
        const summaries = (data.summaries || []) as AssigneeSprintSummary[];
        setSummariesBySprint((prev) => ({ ...prev, [sprintId]: summaries }));
        setSprintErrors((prev) => ({ ...prev, [sprintId]: '' }));
        setDrafts((prev) => {
          const next = { ...prev };
          summaries.forEach((s) => {
            const key = draftKey(sprintId, s.assignee);
            if (!next[key] || !next[key].dirty) {
              next[key] = draftFromSummary(s);
            }
          });
          return next;
        });
      } catch (err) {
        setSprintErrors((prev) => ({
          ...prev,
          [sprintId]: err instanceof Error ? err.message : 'Failed to load reviews',
        }));
      } finally {
        setLoadingSprintId((current) => (current === sprintId ? null : current));
      }
    },
    []
  );

  const handleToggleSprint = (sprintId: string) => {
    if (openSprintId === sprintId) {
      setOpenSprintId(null);
      return;
    }
    setOpenSprintId(sprintId);
    if (!summariesBySprint[sprintId]) {
      loadSummaries(sprintId);
    }
  };

  const updateDraft = (
    sprintId: string,
    assignee: string,
    patch: Partial<ReviewDraft>
  ) => {
    setDrafts((prev) => {
      const key = draftKey(sprintId, assignee);
      const existing = prev[key] ?? emptyDraft();
      return { ...prev, [key]: { ...existing, ...patch } };
    });
  };

  const saveReview = async (
    sprintId: string,
    assignee: string,
    opts: { submit?: boolean } = {}
  ) => {
    const key = draftKey(sprintId, assignee);
    const current = drafts[key];
    if (!current) return;

    updateDraft(sprintId, assignee, {
      saving: !opts.submit,
      submitting: !!opts.submit,
      error: null,
    });

    try {
      const res = await fetch('/api/reviews', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sprint_id: sprintId,
          assignee,
          what_did: current.what_did,
          blockers: current.blockers,
          improvements: current.improvements,
          ...(opts.submit === true ? { submitted: true } : {}),
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save review');
      }
      const saved = await res.json();
      updateDraft(sprintId, assignee, {
        saving: false,
        submitting: false,
        dirty: false,
        error: null,
        submitted_at: saved.submitted_at ?? null,
      });
      // Refresh summaries so review state is authoritative.
      loadSummaries(sprintId);
    } catch (err) {
      updateDraft(sprintId, assignee, {
        saving: false,
        submitting: false,
        error: err instanceof Error ? err.message : 'Failed to save',
      });
    }
  };

  const sprintsSorted = useMemo(
    () =>
      [...sprints].sort((a, b) => {
        const orderScore = (s: SprintStatus) =>
          s === 'Active' ? 0 : s === 'Upcoming' ? 1 : 2;
        const diff = orderScore(a.status) - orderScore(b.status);
        if (diff !== 0) return diff;
        return a.start_date.localeCompare(b.start_date);
      }),
    [sprints]
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center gap-2">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Sprint Reviews</h1>
            </div>
            <p className="text-xs text-gray-500 max-w-md text-right">
              Per-sprint reflections from each assignee — what they shipped, what blocked
              them, and what they&apos;ll improve.
            </p>
          </header>

          <div className="p-6 space-y-4">
            {sprintsLoading ? (
              <div className="flex items-center justify-center h-64 text-sm text-gray-400">
                Loading sprints…
              </div>
            ) : sprintsError ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <ArrowPathIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">
                  Unable to load sprints
                </h2>
                <p className="text-gray-500 text-sm max-w-md mb-4">{sprintsError}</p>
                <p className="text-gray-400 text-xs max-w-md">
                  If this is your first time using reviews, run{' '}
                  <code className="bg-gray-100 px-1 rounded">
                    database_pb_sprint_reviews_migration.sql
                  </code>{' '}
                  in your Supabase SQL editor.
                </p>
              </div>
            ) : sprintsSorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center bg-white rounded-lg border border-dashed">
                <ClipboardDocumentCheckIcon className="h-10 w-10 text-gray-300 mb-3" />
                <p className="text-sm text-gray-500">
                  No sprints yet — create one from the Sprints page first.
                </p>
              </div>
            ) : (
              sprintsSorted.map((sprint) => {
                const isOpen = openSprintId === sprint.id;
                const summaries = summariesBySprint[sprint.id];
                const err = sprintErrors[sprint.id];
                return (
                  <section
                    key={sprint.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleSprint(sprint.id)}
                      className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isOpen ? (
                          <ChevronDownIcon className="h-4 w-4 text-gray-400 shrink-0" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4 text-gray-400 shrink-0" />
                        )}
                        <h2 className="font-semibold text-gray-900 truncate">
                          {sprint.name}
                        </h2>
                        <Badge
                          variant="outline"
                          className={`text-xs border ${STATUS_STYLES[sprint.status]}`}
                        >
                          {sprint.status}
                        </Badge>
                        <span className="text-xs text-gray-500 hidden sm:inline">
                          {formatDateRange(sprint.start_date, sprint.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                        <span>
                          <span className="font-semibold text-gray-900">
                            {sprint.stats.total}
                          </span>{' '}
                          tasks
                        </span>
                        <span>
                          <span className="font-semibold text-green-600">
                            {sprint.stats.completed}
                          </span>{' '}
                          done
                        </span>
                        <span>
                          <span className="font-semibold text-gray-900">
                            {sprint.stats.completion_percentage}%
                          </span>
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 border-t border-gray-100 bg-gray-50/40">
                        {loadingSprintId === sprint.id && !summaries ? (
                          <div className="py-8 text-center text-sm text-gray-400">
                            Loading reviews…
                          </div>
                        ) : err ? (
                          <div className="py-8 text-center text-sm text-red-500">
                            {err}
                          </div>
                        ) : !summaries || summaries.length === 0 ? (
                          <div className="py-8 text-center text-sm text-gray-500">
                            No assignees have tasks in this sprint yet.
                          </div>
                        ) : (
                          <div className="space-y-4 mt-4">
                            {summaries.map((summary) => {
                              const key = draftKey(sprint.id, summary.assignee);
                              const draft = drafts[key] ?? draftFromSummary(summary);
                              const pct =
                                summary.total > 0
                                  ? Math.round(
                                      (summary.completed / summary.total) * 100
                                    )
                                  : 0;
                              return (
                                <ReviewCard
                                  key={key}
                                  summary={summary}
                                  draft={draft}
                                  completionPct={pct}
                                  expanded={!!expandedAssignees[key]}
                                  onToggleExpanded={() =>
                                    setExpandedAssignees((prev) => ({
                                      ...prev,
                                      [key]: !prev[key],
                                    }))
                                  }
                                  onChange={(patch) =>
                                    updateDraft(sprint.id, summary.assignee, {
                                      ...patch,
                                      dirty: true,
                                    })
                                  }
                                  onSaveDraft={() =>
                                    saveReview(sprint.id, summary.assignee)
                                  }
                                  onSubmit={() =>
                                    saveReview(sprint.id, summary.assignee, {
                                      submit: true,
                                    })
                                  }
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

interface ReviewCardProps {
  summary: AssigneeSprintSummary;
  draft: ReviewDraft;
  completionPct: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  onChange: (patch: Partial<ReviewDraft>) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
}

function ReviewCard({
  summary,
  draft,
  completionPct,
  expanded,
  onToggleExpanded,
  onChange,
  onSaveDraft,
  onSubmit,
}: ReviewCardProps) {
  const initials = summary.assignee
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  const busy = draft.saving || draft.submitting;
  const submittedAt = draft.submitted_at;

  const statusBadge = submittedAt ? (
    <Badge
      variant="outline"
      className="text-[10px] border-green-200 bg-green-50 text-green-700"
    >
      Submitted
    </Badge>
  ) : draft.dirty ? (
    <Badge
      variant="outline"
      className="text-[10px] border-amber-200 bg-amber-50 text-amber-700"
    >
      Unsaved
    </Badge>
  ) : (
    <Badge
      variant="outline"
      className="text-[10px] border-gray-200 bg-gray-50 text-gray-600"
    >
      Draft
    </Badge>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onToggleExpanded}
        className="w-full flex items-center justify-between gap-3 px-5 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          {expanded ? (
            <ChevronDownIcon className="h-4 w-4 text-gray-400 shrink-0" />
          ) : (
            <ChevronRightIcon className="h-4 w-4 text-gray-400 shrink-0" />
          )}
          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium shrink-0">
            {initials}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 truncate">
            {summary.assignee}
          </h3>
          {statusBadge}
        </div>
        <span className="text-[11px] text-gray-500 shrink-0">
          <span className="font-semibold text-gray-900">
            {summary.completed}
          </span>
          /{summary.total} done
        </span>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <MiniStat label="Assigned" value={summary.total} color="text-gray-900" />
            <MiniStat
              label="Done"
              value={summary.completed}
              color="text-green-600"
            />
            <MiniStat
              label="In Progress"
              value={summary.in_progress}
              color="text-blue-600"
            />
            <MiniStat
              label="Pending"
              value={summary.pending}
              color="text-amber-600"
            />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-500">Completion</span>
              <span className="font-medium text-gray-900">{completionPct}%</span>
            </div>
            <Progress
              value={completionPct}
              className="h-2 bg-gray-100 [&>div]:bg-blue-500"
            />
          </div>
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-gray-500">
            <div>
              <span className="uppercase tracking-wide text-[10px] text-gray-400">
                Estimated
              </span>{' '}
              <span className="font-mono text-gray-700">
                {formatDuration(summary.estimated_minutes || null)}
              </span>
            </div>
            <div>
              <span className="uppercase tracking-wide text-[10px] text-gray-400">
                Logged
              </span>{' '}
              <span className="font-mono text-gray-700">
                {formatDuration(summary.actual_minutes || null)}
              </span>
            </div>
          </div>

          {(summary.completed_titles.length > 0 ||
            summary.pending_titles.length > 0) && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <TaskList
                title="Completed"
                items={summary.completed_titles}
                emptyLabel="Nothing completed yet"
                tone="green"
              />
              <TaskList
                title="Pending / In progress"
                items={summary.pending_titles}
                emptyLabel="No open tasks"
                tone="amber"
              />
            </div>
          )}

          <div className="mt-5 space-y-4 border-t border-gray-100 pt-4">
            <ReviewField
              label="What did you get done?"
              placeholder="Highlights — features shipped, bugs fixed, decisions made…"
              value={draft.what_did}
              onChange={(v) => onChange({ what_did: v })}
              disabled={busy}
            />
            <ReviewField
              label="What blocked you? Why were tasks left pending?"
              placeholder="Dependencies, unclear requirements, sick days, scope creep…"
              value={draft.blockers}
              onChange={(v) => onChange({ blockers: v })}
              disabled={busy}
            />
            <ReviewField
              label="How can you improve next sprint?"
              placeholder="Process fixes, tooling, better estimation, focus areas…"
              value={draft.improvements}
              onChange={(v) => onChange({ improvements: v })}
              disabled={busy}
            />

            {draft.error && <p className="text-xs text-red-500">{draft.error}</p>}

            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onSaveDraft}
                disabled={busy || !draft.dirty}
              >
                {draft.saving ? 'Saving…' : 'Save draft'}
              </Button>
              <Button
                size="sm"
                className="bg-blue-500 hover:bg-blue-600"
                onClick={onSubmit}
                disabled={busy}
              >
                {draft.submitting
                  ? 'Submitting…'
                  : submittedAt
                    ? 'Resubmit'
                    : 'Submit review'}
              </Button>
              {submittedAt && (
                <span className="text-[11px] text-gray-500">
                  Last submitted {new Date(submittedAt).toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className={`text-lg font-semibold ${color}`}>{value}</div>
      <div className="text-[10px] uppercase tracking-wide text-gray-400">{label}</div>
    </div>
  );
}

function TaskList({
  title,
  items,
  emptyLabel,
  tone,
}: {
  title: string;
  items: string[];
  emptyLabel: string;
  tone: 'green' | 'amber';
}) {
  const dot = tone === 'green' ? 'bg-green-500' : 'bg-amber-500';
  return (
    <div className="bg-gray-50/60 border border-gray-100 rounded-md p-3">
      <h4 className="text-xs font-semibold text-gray-700 mb-2">
        {title}{' '}
        <span className="text-gray-400 font-normal">({items.length})</span>
      </h4>
      {items.length === 0 ? (
        <p className="text-xs text-gray-400 italic">{emptyLabel}</p>
      ) : (
        <ul className="space-y-1.5">
          {items.slice(0, 8).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-gray-700">
              <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dot} shrink-0`} />
              <span className="line-clamp-2">{item}</span>
            </li>
          ))}
          {items.length > 8 && (
            <li className="text-[10px] text-gray-400 pl-3.5">
              +{items.length - 8} more…
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

function ReviewField({
  label,
  placeholder,
  value,
  onChange,
  disabled,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className="text-sm resize-none"
      />
    </div>
  );
}
