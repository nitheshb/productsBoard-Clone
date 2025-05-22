
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusSelect: (statuses: string[]) => void;
  availableStatuses: string[];
}

export function StatusFilter({ 
  selectedStatuses, 
  onStatusSelect, 
  availableStatuses 
}: StatusFilterProps) {
  const handleStatusToggle = (status: string) => {
    if (selectedStatuses.includes(status)) {
      onStatusSelect(selectedStatuses.filter((s) => s !== status));
    } else {
      onStatusSelect([...selectedStatuses, status]);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white">
          Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-48 bg-white">
        {availableStatuses.map((status) => (
          <DropdownMenuCheckboxItem
            key={status}
            checked={selectedStatuses.includes(status)}
            onSelect={(e) => {
              e.preventDefault();
              handleStatusToggle(status);
            }}
          >
            <div className="flex items-center gap-2">
              {status === 'Completed' && (
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              )}
              {status === 'In Progress' && (
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              )}
              {status === 'Todo' && (
                <div className="w-2 h-2 rounded-full bg-gray-500"></div>
              )}
              {status}
            </div>
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}