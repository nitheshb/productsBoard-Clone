'use client';

import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { BoardTask, Sprint, TaskIssueType, TaskPriority, TaskStatus } from '@/app/types';
import { TeamMember } from '@/utils/teamUtils';
import { parseDuration, formatDuration } from '@/lib/timeUtils';

interface TaskFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: TeamMember[];
  sprints?: Sprint[];
  task?: BoardTask | null;
  defaultAssignee?: string;
  onSaved: () => void;
}

const ISSUE_TYPES: TaskIssueType[] = ['Story', 'Task', 'Bug'];
const STATUSES: TaskStatus[] = ['To Do', 'In Progress', 'Done'];
const PRIORITIES: TaskPriority[] = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export default function TaskFormSheet({
  open,
  onOpenChange,
  members,
  sprints = [],
  task,
  defaultAssignee,
  onSaved,
}: TaskFormSheetProps) {
  const isEditMode = Boolean(task);

  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState<TaskIssueType>('Task');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [assignee, setAssignee] = useState('');
  const [sprintId, setSprintId] = useState<string>('');
  const [estimatedInput, setEstimatedInput] = useState('');
  const [actualInput, setActualInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;

    if (task) {
      setSummary(task.summary);
      setDescription(task.description || '');
      setIssueType(task.issue_type);
      setStatus(task.status);
      setPriority(task.priority);
      setAssignee(task.assignee);
      setSprintId(task.sprint_id || '');
      setEstimatedInput(
        task.estimated_minutes != null ? formatDuration(task.estimated_minutes) : ''
      );
      setActualInput(task.actual_minutes != null ? formatDuration(task.actual_minutes) : '');
    } else {
      setSummary('');
      setDescription('');
      setIssueType('Task');
      setStatus('To Do');
      setPriority('Medium');
      setAssignee(defaultAssignee || '');
      setSprintId('');
      setEstimatedInput('');
      setActualInput('');
    }
    setError('');
  }, [open, task, defaultAssignee]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!summary.trim() || !assignee) {
      setError('Summary and assigned member are required');
      return;
    }

    const estimatedMinutes = parseDuration(estimatedInput);
    if (estimatedMinutes === null || estimatedMinutes <= 0) {
      setError('Estimated time is required (e.g. 30 min, 1 hr, 2 hours, 1 day)');
      return;
    }

    let actualMinutes: number | null = null;
    const trimmedActual = actualInput.trim();
    if (trimmedActual) {
      const parsed = parseDuration(trimmedActual);
      if (parsed === null || parsed < 0) {
        setError('Actual time format is invalid (e.g. 45 min, 2 hr, 1 day)');
        return;
      }
      actualMinutes = parsed;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const member = members.find((m) => m.name === assignee);
      const payload = {
        summary: summary.trim(),
        description: description.trim() || null,
        issue_type: issueType,
        status,
        priority,
        assignee,
        assignee_id: member?.id || null,
        sprint_id: sprintId || null,
        estimated_minutes: estimatedMinutes,
        actual_minutes: actualMinutes,
      };

      const res = await fetch(isEditMode ? `/api/tasks/${task!.id}` : '/api/tasks', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} task`);
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'create'} task`);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-full sm:!w-[700px] md:!w-[800px] lg:!w-[900px] sm:max-w-[90vw] flex flex-col overflow-hidden box-border p-6"
      >
        <SheetHeader className="mb-4 pr-10 shrink-0">
          <SheetTitle>{isEditMode ? `Edit Task — ${task?.ticket_key}` : 'Create Task'}</SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col min-h-0 min-w-0 w-full overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden min-w-0 w-full pr-1">
            {/* Assigned to section */}
            <div className="rounded-lg border border-blue-100 bg-blue-50/50 p-4 space-y-3 w-full min-w-0">
              <div>
                <Label htmlFor="assignee" className="text-sm font-semibold text-gray-900">
                  Assigned to
                </Label>
                <p className="text-xs text-gray-500 mt-0.5">
                  This task will appear under the selected member&apos;s list.
                </p>
              </div>

              <select
                id="assignee"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select member</option>
                {members.map((member) => (
                  <option key={member.name} value={member.name}>
                    {member.name}
                  </option>
                ))}
              </select>

              {assignee && (
                <div className="flex items-center gap-3 pt-1">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                      {getInitials(assignee)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{assignee}</p>
                    <p className="text-xs text-gray-500">
                      {isEditMode && task && assignee !== task.assignee
                        ? `Will move from ${task.assignee} to ${assignee}`
                        : 'Assignee'}
                    </p>
                  </div>
                </div>
              )}

              {isEditMode && task && assignee && assignee !== task.assignee && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
                  Saving will move this task from <strong>{task.assignee}</strong> to{' '}
                  <strong>{assignee}</strong>.
                </p>
              )}
            </div>

            <div className="space-y-2 w-full min-w-0">
              <Label htmlFor="summary">Summary</Label>
              <Input
                id="summary"
                placeholder="What needs to be done?"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                autoFocus={!isEditMode}
                className="w-full max-w-full box-border focus-visible:ring-offset-0"
              />
            </div>

            <div className="space-y-2 w-full min-w-0">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Add more details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full max-w-full box-border resize-none"
              />
            </div>

            <div className="space-y-2 w-full min-w-0">
              <Label htmlFor="sprint">Sprint</Label>
              <select
                id="sprint"
                value={sprintId}
                onChange={(e) => setSprintId(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Unassigned (no sprint) —</option>
                {sprints.map((sprint) => (
                  <option key={sprint.id} value={sprint.id}>
                    {sprint.name} ({sprint.status})
                  </option>
                ))}
              </select>
              {sprints.length === 0 && (
                <p className="text-xs text-gray-500">
                  No sprints exist yet. Create one from the Sprints page to assign tasks to it.
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-0">
              <div className="space-y-2">
                <Label htmlFor="estimated">Estimated Time *</Label>
                <Input
                  id="estimated"
                  placeholder="e.g. 30 min, 1 hr, 2 hours, 1 day"
                  value={estimatedInput}
                  onChange={(e) => setEstimatedInput(e.target.value)}
                />
                <p className="text-[11px] text-gray-500">
                  Accepts min / hr / day (or m / h / d). 1 day = 8 hours. You can combine, e.g.
                  &quot;1 day 2 hours&quot;.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="actual">
                  Actual Time {status === 'Done' && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="actual"
                  placeholder={status === 'Done' ? 'e.g. 45 min, 2 hr' : '—'}
                  value={actualInput}
                  onChange={(e) => setActualInput(e.target.value)}
                />
                <p className="text-[11px] text-gray-500">
                  {status === 'Done'
                    ? 'Fill this in when completing the task.'
                    : 'Leave empty until the task is completed.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full min-w-0">
              <div className="space-y-2">
                <Label htmlFor="issueType">Issue Type</Label>
                <select
                  id="issueType"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value as TaskIssueType)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {ISSUE_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as TaskPriority)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <SheetFooter className="pt-4 mt-4 border-t shrink-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? 'Saving...'
                  : 'Creating...'
                : isEditMode
                  ? 'Save Changes'
                  : 'Create Task'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
