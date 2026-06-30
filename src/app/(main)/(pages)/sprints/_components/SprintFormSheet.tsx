'use client';

import { useEffect, useState } from 'react';
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
import type { Sprint } from '@/app/types';
import { deriveSprintStatus } from '@/lib/sprintUtils';

interface SprintFormSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sprint?: Sprint | null;
  onSaved: () => void;
}

function toDateInputValue(value: string | undefined): string {
  if (!value) return '';
  return value.length >= 10 ? value.substring(0, 10) : value;
}

export default function SprintFormSheet({
  open,
  onOpenChange,
  sprint,
  onSaved,
}: SprintFormSheetProps) {
  const isEditMode = Boolean(sprint);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (sprint) {
      setName(sprint.name);
      setDescription(sprint.description || '');
      setStartDate(toDateInputValue(sprint.start_date));
      setEndDate(toDateInputValue(sprint.end_date));
    } else {
      setName('');
      setDescription('');
      const today = new Date();
      const inAWeek = new Date(today);
      inAWeek.setDate(inAWeek.getDate() + 6);
      setStartDate(today.toISOString().substring(0, 10));
      setEndDate(inAWeek.toISOString().substring(0, 10));
    }
    setError('');
  }, [open, sprint]);

  const previewStatus =
    startDate && endDate ? deriveSprintStatus(startDate, endDate) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('Sprint name is required');
      return;
    }
    if (!startDate || !endDate) {
      setError('Start and end dates are required');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        name: trimmedName,
        description: description.trim() || null,
        start_date: startDate,
        end_date: endDate,
      };

      const res = await fetch(
        isEditMode ? `/api/sprints/${sprint!.id}` : '/api/sprints',
        {
          method: isEditMode ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `Failed to ${isEditMode ? 'update' : 'create'} sprint`);
      }

      onOpenChange(false);
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : `Failed to ${isEditMode ? 'update' : 'create'} sprint`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-full sm:!w-[560px] md:!w-[640px] sm:max-w-[90vw] flex flex-col overflow-hidden box-border p-6"
      >
        <SheetHeader className="mb-4 pr-10 shrink-0">
          <SheetTitle>
            {isEditMode ? `Edit Sprint — ${sprint?.name}` : 'Create Sprint'}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col min-h-0 min-w-0 w-full overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto overflow-x-hidden min-w-0 w-full pr-1">
            <div className="space-y-2">
              <Label htmlFor="sprint-name">Sprint Name</Label>
              <Input
                id="sprint-name"
                placeholder="Sprint 1"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus={!isEditMode}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sprint-description">Description</Label>
              <Textarea
                id="sprint-description"
                placeholder="What is this sprint about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sprint-start">Start Date</Label>
                <Input
                  id="sprint-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sprint-end">End Date</Label>
                <Input
                  id="sprint-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {previewStatus && (
              <div className="rounded-md bg-gray-50 border border-gray-200 px-3 py-2 text-xs text-gray-600">
                Auto-derived status: <strong className="text-gray-900">{previewStatus}</strong>
              </div>
            )}

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
                  : 'Create Sprint'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
