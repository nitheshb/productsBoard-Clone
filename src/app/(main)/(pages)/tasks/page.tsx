'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import TaskFormSheet from './_components/TaskFormSheet';
import { BoardTask, Sprint, TaskIssueType, TaskPriority, TaskStatus } from '@/app/types';
import { fetchExistingTeamMembers, teamEventEmitter, TeamMember } from '@/utils/teamUtils';
import { FilterContainer } from '@/components/filters/filtercontainer';
import { NO_SPRINT_VALUE } from '@/components/filters/SprintFilter';
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

function IssueTypeIcon({ type }: { type: TaskIssueType }) {
  if (type === 'Story') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
        <rect width="16" height="16" rx="2" fill="#36B37E" />
        <path d="M5 4h6v1.5H5V4zm0 3h6v1.5H5V7zm0 3h4v1.5H5V10z" fill="white" />
      </svg>
    );
  }
  if (type === 'Bug') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
        <rect width="16" height="16" rx="2" fill="#FF5630" />
        <circle cx="8" cy="8" r="3" fill="white" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="flex-shrink-0">
      <rect width="16" height="16" rx="2" fill="#2684FF" />
      <path d="M5 8.5l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}


function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config: Record<TaskPriority, { icon: string; color: string }> = {
    Highest: { icon: '↑↑', color: 'text-red-600' },
    High: { icon: '↑', color: 'text-orange-500' },
    Medium: { icon: '=', color: 'text-yellow-600' },
    Low: { icon: '↓', color: 'text-green-600' },
    Lowest: { icon: '↓↓', color: 'text-gray-400' },
  };

  const { icon, color } = config[priority];

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${color}`}>
      <span className="text-sm leading-none">{icon}</span>
      {priority}
    </span>
  );
}

interface MemberGroup {
  name: string;
  tasks: BoardTask[];
}

function getSearchKeywords(query: string): string[] {
  return query.toLowerCase().trim().split(/\s+/).filter(Boolean);
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  if (keywords.length === 0) return true;
  const lower = text.toLowerCase();
  return keywords.every((keyword) => lower.includes(keyword));
}

function getTaskSearchText(task: BoardTask): string {
  return [
    task.ticket_key,
    task.summary,
    task.description || '',
    task.assignee,
    task.status,
    task.priority,
    task.issue_type,
  ]
    .join(' ')
    .toLowerCase();
}

function normalizeTaskStatusForFilter(status: string): string {
  if (status === 'To Do') return 'Todo';
  if (status === 'Done') return 'Completed';
  return status;
}

function taskMatchesTeamFilter(
  task: BoardTask,
  selectedTeams: Array<string | TeamMember>
): boolean {
  if (selectedTeams.length === 0) return true;
  const names = selectedTeams.map((t) => (typeof t === 'string' ? t : t.name));
  return names.includes(task.assignee);
}

function taskMatchesStatusFilter(task: BoardTask, selectedStatuses: string[]): boolean {
  if (selectedStatuses.length === 0) return true;
  return selectedStatuses.includes(normalizeTaskStatusForFilter(task.status));
}

function taskMatchesPriorityFilter(task: BoardTask, selectedPriorities: string[]): boolean {
  if (selectedPriorities.length === 0) return true;
  return selectedPriorities.includes(task.priority);
}

function taskMatchesIssueTypeFilter(task: BoardTask, selectedTypes: string[]): boolean {
  if (selectedTypes.length === 0) return true;
  return selectedTypes.includes(task.issue_type);
}

function taskMatchesSprintFilter(task: BoardTask, selectedSprintIds: string[]): boolean {
  if (selectedSprintIds.length === 0) return true;
  if (!task.sprint_id) return selectedSprintIds.includes(NO_SPRINT_VALUE);
  return selectedSprintIds.includes(task.sprint_id);
}

function taskMatchesDateFilter(
  task: BoardTask,
  startDate?: Date,
  endDate?: Date
): boolean {
  if (!startDate && !endDate) return true;

  const taskDate = new Date(task.created_at);
  taskDate.setHours(0, 0, 0, 0);

  if (startDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    if (taskDate < start) return false;
  }

  if (endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    if (taskDate > end) return false;
  }

  return true;
}

const TASK_PRIORITIES = ['Highest', 'High', 'Medium', 'Low', 'Lowest'];
const TASK_ISSUE_TYPES = ['Story', 'Task', 'Bug'];

export default function TasksPage() {
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedMembers, setExpandedMembers] = useState<Record<string, boolean>>({});
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<BoardTask | null>(null);
  const [createForMember, setCreateForMember] = useState<string | undefined>();
  const [fetchError, setFetchError] = useState('');

  const [selectedTeams, setSelectedTeams] = useState<Array<string | TeamMember>>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [selectedTaskTypes, setSelectedTaskTypes] = useState<string[]>([]);
  const [selectedSprintIds, setSelectedSprintIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [availableTeams, setAvailableTeams] = useState<Array<string | TeamMember>>([]);
  const [sprints, setSprints] = useState<Sprint[]>([]);

  const fetchSprints = useCallback(async () => {
    try {
      const res = await fetch('/api/sprints');
      if (!res.ok) return;
      const data = await res.json();
      setSprints(data.sprints || []);
    } catch {
      // Sprint table may not exist yet; the Sprints page surfaces the migration hint.
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to fetch tasks');
      }
      const data = await res.json();
      setTasks(data.tasks || []);
      setFetchError('');
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Failed to load tasks');
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [membersData] = await Promise.all([
        fetchExistingTeamMembers(true),
        fetchTasks(),
        fetchSprints(),
      ]);
      setMembers(membersData);
      setAvailableTeams(membersData);
      setIsLoading(false);
    }
    load();
  }, [fetchTasks, fetchSprints]);

  useEffect(() => {
    const unsubscribe = teamEventEmitter.subscribe((teamName: string) => {
      setAvailableTeams((prev) => {
        const exists = prev.some((t) =>
          typeof t === 'string' ? t === teamName : t.name === teamName
        );
        if (!exists) return [...prev, teamName];
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  const hasActiveFilters =
    selectedTeams.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedVersions.length > 0 ||
    selectedTaskTypes.length > 0 ||
    selectedSprintIds.length > 0 ||
    Boolean(startDate) ||
    Boolean(endDate);

  const filterAppliedTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        taskMatchesTeamFilter(task, selectedTeams) &&
        taskMatchesStatusFilter(task, selectedStatuses) &&
        taskMatchesPriorityFilter(task, selectedVersions) &&
        taskMatchesIssueTypeFilter(task, selectedTaskTypes) &&
        taskMatchesSprintFilter(task, selectedSprintIds) &&
        taskMatchesDateFilter(task, startDate, endDate)
    );
  }, [
    tasks,
    selectedTeams,
    selectedStatuses,
    selectedVersions,
    selectedTaskTypes,
    selectedSprintIds,
    startDate,
    endDate,
  ]);

  const filteredTasks = useMemo(() => {
    const keywords = getSearchKeywords(searchQuery);
    if (keywords.length === 0) return filterAppliedTasks;

    return filterAppliedTasks.filter((task) =>
      matchesKeywords(getTaskSearchText(task), keywords)
    );
  }, [filterAppliedTasks, searchQuery]);

  const isSearching = searchQuery.trim().length > 0;
  const isFiltering = isSearching || hasActiveFilters;

  const memberGroups = useMemo((): MemberGroup[] => {
    if (isFiltering) {
      const keywords = getSearchKeywords(searchQuery);
      const groups: MemberGroup[] = [];

      const selectedTeamNames =
        selectedTeams.length > 0
          ? selectedTeams.map((t) => (typeof t === 'string' ? t : t.name))
          : null;

      const membersToShow = selectedTeamNames
        ? members.filter((m) => selectedTeamNames.includes(m.name))
        : members;

      membersToShow.forEach((member) => {
        const memberTasks = filteredTasks.filter((task) => task.assignee === member.name);
        const nameMatches = keywords.length > 0 && matchesKeywords(member.name, keywords);

        if (selectedTeamNames || nameMatches || memberTasks.length > 0) {
          groups.push({ name: member.name, tasks: memberTasks });
        }
      });

      filteredTasks.forEach((task) => {
        if (!groups.some((group) => group.name === task.assignee)) {
          groups.push({
            name: task.assignee,
            tasks: filteredTasks.filter((t) => t.assignee === task.assignee),
          });
        }
      });

      return groups.sort((a, b) => a.name.localeCompare(b.name));
    }

    const groupMap = new Map<string, BoardTask[]>();

    members.forEach((m) => {
      groupMap.set(m.name, []);
    });

    filterAppliedTasks.forEach((task) => {
      const list = groupMap.get(task.assignee) || [];
      list.push(task);
      groupMap.set(task.assignee, list);
    });

    return Array.from(groupMap.entries())
      .map(([name, memberTasks]) => ({ name, tasks: memberTasks }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [
    filteredTasks,
    members,
    filterAppliedTasks,
    isFiltering,
    searchQuery,
    selectedTeams,
  ]);

  useEffect(() => {
    setExpandedMembers((prev) => {
      const next = { ...prev };
      memberGroups.forEach((g) => {
        if (isFiltering) {
          next[g.name] = true;
        } else if (next[g.name] === undefined) {
          next[g.name] = true;
        }
      });
      return next;
    });
  }, [memberGroups, isFiltering]);

  const toggleMember = (name: string) => {
    setExpandedMembers((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      await fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const openCreateFor = (memberName?: string) => {
    setSelectedTask(null);
    setCreateForMember(memberName);
    setIsSheetOpen(true);
  };

  const openEditTask = (task: BoardTask) => {
    setSelectedTask(task);
    setCreateForMember(undefined);
    setIsSheetOpen(true);
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setSelectedTask(null);
      setCreateForMember(undefined);
    }
  };

  const clearFilters = () => {
    setSelectedTeams([]);
    setSelectedStatuses([]);
    setSelectedVersions([]);
    setSelectedTaskTypes([]);
    setSelectedSprintIds([]);
    setStartDate(undefined);
    setEndDate(undefined);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-full mx-auto">
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center gap-2">
              <ListBulletIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Tasks</h1>
            </div>

            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  placeholder="Search by member name, key, summary, status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                    aria-label="Clear search"
                  >
                    ✕
                  </button>
                )}
              </div>
              {isSearching && (
                <p className="mt-1 text-xs text-gray-500">
                  {memberGroups.length} member{memberGroups.length === 1 ? '' : 's'}
                  {filteredTasks.length > 0 && (
                    <>, {filteredTasks.length} task{filteredTasks.length === 1 ? '' : 's'}</>
                  )}
                  {' '}found
                </p>
              )}
            </div>

            <button
              onClick={() => openCreateFor()}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              Create Task
            </button>
          </header>

          <div className="px-6 py-3 border-b bg-white">
            <FilterContainer
              selectedTeams={selectedTeams}
              selectedStatuses={selectedStatuses}
              selectedVersions={selectedVersions}
              selectedTaskTypes={selectedTaskTypes}
              selectedSprintIds={selectedSprintIds}
              availableSprints={sprints}
              onSprintSelect={setSelectedSprintIds}
              startDate={startDate}
              endDate={endDate}
              availableTeams={availableTeams}
              availableStatuses={['Todo', 'In Progress', 'Completed']}
              availableVersions={TASK_PRIORITIES}
              availableTaskTypes={TASK_ISSUE_TYPES}
              onTeamSelect={setSelectedTeams}
              onStatusSelect={setSelectedStatuses}
              onVersionSelect={setSelectedVersions}
              onTaskTypeSelect={setSelectedTaskTypes}
              onDateChange={(start, end) => {
                setStartDate(start);
                setEndDate(end);
              }}
              onClearFilters={clearFilters}
            />
          </div>

          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-gray-400 text-sm">Loading tasks...</div>
              </div>
            ) : fetchError ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <ListBulletIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">Unable to load tasks</h2>
                <p className="text-gray-500 text-sm max-w-md mb-4">{fetchError}</p>
                <p className="text-gray-400 text-xs max-w-md">
                  If this is your first time, run the migration in{' '}
                  <code className="bg-gray-100 px-1 rounded">database_pb_tasks_migration.sql</code>{' '}
                  in your Supabase SQL editor.
                </p>
              </div>
            ) : memberGroups.length === 0 && isFiltering ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MagnifyingGlassIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">No matching results</h2>
                <p className="text-gray-500 text-sm mb-4">
                  {isSearching
                    ? `No members or tasks found for "${searchQuery}".`
                    : 'No tasks match the selected filters.'}
                </p>
                <div className="flex gap-3">
                  {isSearching && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Clear search
                    </button>
                  )}
                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            ) : memberGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <ListBulletIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">No tasks yet</h2>
                <p className="text-gray-500 text-sm mb-4">Create your first task to get started.</p>
                <button
                  onClick={() => openCreateFor()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Task
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {memberGroups.map((group) => (
                  <div key={group.name} className="border border-gray-200 rounded-lg overflow-hidden">
                    {/* Collapsible member header */}
                    <button
                      onClick={() => toggleMember(group.name)}
                      className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-500 text-white text-xs font-medium">
                            {getInitials(group.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">{group.name}</span>
                        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                          {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openCreateFor(group.name);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                          title={`Add task for ${group.name}`}
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                        {expandedMembers[group.name] ? (
                          <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                    </button>

                    {/* Task list table */}
                    {expandedMembers[group.name] && (
                      <div className="overflow-x-auto">
                        {group.tasks.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-gray-400">
                            No tasks assigned.{' '}
                            <button
                              onClick={() => openCreateFor(group.name)}
                              className="text-blue-500 hover:underline"
                            >
                              Create one
                            </button>
                          </div>
                        ) : (
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-100 bg-white">
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-24">Key</th>
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500">Summary</th>
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-32">Issue Type</th>
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-36">Status</th>
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-28">Priority</th>
                                <th className="py-2.5 px-4 text-left text-xs font-medium text-gray-500 w-32">Sprint</th>
                              </tr>
                            </thead>
                            <tbody>
                              {group.tasks.map((task) => (
                                <tr
                                  key={task.id}
                                  onClick={() => openEditTask(task)}
                                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-blue-600 font-medium hover:underline">
                                      {task.ticket_key}
                                    </span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <span className="text-sm text-gray-900">{task.summary}</span>
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center gap-2">
                                      <IssueTypeIcon type={task.issue_type} />
                                      <span className="text-sm text-gray-700">{task.issue_type}</span>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                                    <select
                                      value={task.status}
                                      onChange={(e) =>
                                        handleStatusChange(task.id, e.target.value as TaskStatus)
                                      }
                                      className={`text-xs font-medium uppercase tracking-wide rounded px-2 py-0.5 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-400 ${
                                        task.status === 'To Do'
                                          ? 'bg-gray-100 text-gray-700'
                                          : task.status === 'In Progress'
                                          ? 'bg-blue-100 text-blue-700'
                                          : 'text-green-600 bg-green-50'
                                      }`}
                                    >
                                      {(['To Do', 'In Progress', 'Done'] as TaskStatus[]).map((s) => (
                                        <option key={s} value={s}>
                                          {s}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td className="py-3 px-4">
                                    <PriorityBadge priority={task.priority} />
                                  </td>
                                  <td className="py-3 px-4">
                                    {task.sprint_name ? (
                                      <span className="inline-flex items-center text-xs font-medium text-sky-700 bg-sky-50 border border-sky-200 rounded px-2 py-0.5">
                                        {task.sprint_name}
                                      </span>
                                    ) : (
                                      <span className="text-xs text-gray-400 italic">No Sprint</span>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <TaskFormSheet
        open={isSheetOpen}
        onOpenChange={handleSheetOpenChange}
        members={members}
        sprints={sprints}
        task={selectedTask}
        defaultAssignee={createForMember}
        onSaved={fetchTasks}
      />
    </div>
  );
}
