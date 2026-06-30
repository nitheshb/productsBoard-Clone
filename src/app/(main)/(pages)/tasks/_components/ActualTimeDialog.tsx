'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { formatDuration, parseDuration } from '@/lib/timeUtils';

interface ActualTimeDialogProps {
  isOpen: boolean;
  taskKey?: string;
  estimatedMinutes?: number | null;
  onCancel: () => void;
  onConfirm: (actualMinutes: number) => Promise<void> | void;
}

export function ActualTimeDialog({
  isOpen,
  taskKey,
  estimatedMinutes,
  onCancel,
  onConfirm,
}: ActualTimeDialogProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValue('');
      setError('');
      setIsLoading(false);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    const minutes = parseDuration(value);
    if (minutes === null || minutes < 0) {
      setError('Enter a valid time (e.g. 45m, 2h, 1d)');
      return;
    }
    setIsLoading(true);
    try {
      await onConfirm(minutes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isLoading && onCancel()}>
      <DialogContent className="sm:max-w-[440px] bg-white">
        <DialogHeader>
          <DialogTitle>Log actual time{taskKey ? ` — ${taskKey}` : ''}</DialogTitle>
          <DialogDescription>
            How long did this task take? This is used for sprint reviews and planning.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="actual-time-input">Actual Time</Label>
          <Input
            id="actual-time-input"
            placeholder="e.g. 45m, 2h, 1d"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleConfirm();
              }
            }}
          />
          <p className="text-[11px] text-gray-500">
            Use m / h / d (1d = 8h).
            {estimatedMinutes != null && (
              <> Estimated was <strong>{formatDuration(estimatedMinutes)}</strong>.</>
            )}
          </p>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Mark Completed
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
