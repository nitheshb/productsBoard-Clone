import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, RefreshCw } from 'lucide-react';
import type { Sprint } from '@/app/types';

interface SprintFilterProps {
  selectedSprintIds: string[];
  availableSprints: Sprint[];
  onSprintSelect: (ids: string[]) => void;
}

const NO_SPRINT_VALUE = '__no_sprint__';

export function SprintFilter({
  selectedSprintIds,
  availableSprints,
  onSprintSelect,
}: SprintFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (id: string) => {
    const next = selectedSprintIds.includes(id)
      ? selectedSprintIds.filter((s) => s !== id)
      : [...selectedSprintIds, id];
    onSprintSelect(next);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300"
        >
          <RefreshCw className="h-4 w-4" />
          Sprint {selectedSprintIds.length > 0 && `(${selectedSprintIds.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 max-h-80 overflow-y-auto bg-white"
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Sprints
        </DropdownMenuLabel>

        <div className="max-h-56 overflow-y-auto">
          <DropdownMenuCheckboxItem
            checked={selectedSprintIds.includes(NO_SPRINT_VALUE)}
            onSelect={(e) => {
              e.preventDefault();
              toggle(NO_SPRINT_VALUE);
            }}
            className="px-3 py-2 text-sm pl-8"
          >
            <span className="text-xs text-gray-500 italic">No Sprint</span>
          </DropdownMenuCheckboxItem>

          {availableSprints.map((sprint) => (
            <DropdownMenuCheckboxItem
              key={sprint.id}
              checked={selectedSprintIds.includes(sprint.id)}
              onSelect={(e) => {
                e.preventDefault();
                toggle(sprint.id);
              }}
              className="px-3 py-2 text-sm pl-8"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm">{sprint.name}</span>
                <span className="text-[10px] uppercase text-gray-400">{sprint.status}</span>
              </div>
            </DropdownMenuCheckboxItem>
          ))}
        </div>

        {selectedSprintIds.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onSprintSelect([])}
                className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { NO_SPRINT_VALUE };
