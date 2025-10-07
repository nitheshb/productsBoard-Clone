
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Tag } from "lucide-react";

interface TaskTypeFilterProps {
  selectedTaskTypes: string[];
  availableTaskTypes: string[];
  onTaskTypeSelect: (taskTypes: string[]) => void;
  selectedSubTaskTypes?: string[];
  availableSubTaskTypes?: string[];
  onSubTaskTypeSelect?: (subTaskTypes: string[]) => void;
}

export function TaskTypeFilter({ 
  selectedTaskTypes, 
  availableTaskTypes, 
  onTaskTypeSelect,
  selectedSubTaskTypes = [],
  availableSubTaskTypes = [],
  onSubTaskTypeSelect
}: TaskTypeFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTaskTypeToggle = (taskType: string) => {
    const updatedTaskTypes = selectedTaskTypes.includes(taskType) 
      ? selectedTaskTypes.filter((t) => t !== taskType)
      : [...selectedTaskTypes, taskType];

    onTaskTypeSelect(updatedTaskTypes);
  };

  const handleSubTaskTypeToggle = (subTaskType: string) => {
    if (onSubTaskTypeSelect) {
      const updatedSubTaskTypes = selectedSubTaskTypes.includes(subTaskType) 
        ? selectedSubTaskTypes.filter((t) => t !== subTaskType)
        : [...selectedSubTaskTypes, subTaskType];

      onSubTaskTypeSelect(updatedSubTaskTypes);
    }
  };

  const getTaskTypeColor = (taskType: string) => {
    // Assign colors based on task type
    const colorMap: Record<string, string> = {
      'dev': 'text-blue-600',
      'Development': 'text-blue-600',
      'testing': 'text-green-600',
      'Testing': 'text-green-600',
      'ux': 'text-orange-600',
      'UX/UI': 'text-orange-600',
      'research': 'text-purple-600',
      'Research': 'text-purple-600',
      'documentation': 'text-teal-600',
      'Documentation': 'text-teal-600',
      'review': 'text-pink-600',
      'Review': 'text-pink-600',
    };
    return colorMap[taskType] || 'text-gray-600';
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300">
          <Tag className="h-4 w-4" />
          Task Type {selectedTaskTypes.length > 0 || selectedSubTaskTypes.length > 0 ? `(${selectedTaskTypes.length + selectedSubTaskTypes.length})` : ''}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Filter by Task Type
        </DropdownMenuLabel>
        
        <div className="max-h-48 overflow-y-auto">
          {/* Task Types Section */}
          {availableTaskTypes.length > 0 && (
            <div className="px-3 py-2">
              <div className="text-xs font-medium text-gray-500 mb-2">Main Task Types</div>
              {availableTaskTypes.map((taskType) => (
                <DropdownMenuCheckboxItem
                  key={taskType}
                  checked={selectedTaskTypes.includes(taskType)}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleTaskTypeToggle(taskType);
                  }}
                  className="px-3 py-2 text-sm pl-8"
                >
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${getTaskTypeColor(taskType)}`} />
                    {taskType}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          )}

          {/* Sub Task Types Section */}
          {availableSubTaskTypes.length > 0 && onSubTaskTypeSelect && (
            <div className="px-3 py-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500 mb-2">Sub Task Types</div>
              {availableSubTaskTypes.map((subTaskType) => (
                <DropdownMenuCheckboxItem
                  key={subTaskType}
                  checked={selectedSubTaskTypes.includes(subTaskType)}
                  onSelect={(e) => {
                    e.preventDefault();
                    handleSubTaskTypeToggle(subTaskType);
                  }}
                  className="px-3 py-2 text-sm pl-8"
                >
                  <div className="flex items-center gap-2">
                    <Tag className={`h-4 w-4 ${getTaskTypeColor(subTaskType)}`} />
                    {subTaskType}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
            </div>
          )}

          {availableTaskTypes.length === 0 && availableSubTaskTypes.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">
              No task types available
            </div>
          )}
        </div>
        
        {(selectedTaskTypes.length > 0 || selectedSubTaskTypes.length > 0) && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  onTaskTypeSelect([]);
                  if (onSubTaskTypeSelect) {
                    onSubTaskTypeSelect([]);
                  }
                }}
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

