
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
import { ChevronDown, CheckCircle, Clock, Circle } from "lucide-react";

interface StatusFilterProps {
  selectedStatuses: string[];
  onStatusSelect: (statuses: string[]) => void;
}

const STATUS_OPTIONS = [
  { value: "Todo", label: "Todo", icon: Circle, color: "text-gray-500" },
  { value: "In Progress", label: "In Progress", icon: Clock, color: "text-yellow-500" },
  { value: "Completed", label: "Completed", icon: CheckCircle, color: "text-green-500" },
];

export function StatusFilter({ selectedStatuses, onStatusSelect }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleStatusToggle = (status: string) => {
    const updatedStatuses = selectedStatuses.includes(status) 
      ? selectedStatuses.filter((s) => s !== status)
      : [...selectedStatuses, status];

    onStatusSelect(updatedStatuses);
  };

  const getStatusIcon = (status: string) => {
    const statusOption = STATUS_OPTIONS.find(option => option.value === status);
    if (statusOption) {
      const IconComponent = statusOption.icon;
      return <IconComponent className={`h-4 w-4 ${statusOption.color}`} />;
    }
    return null;
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300">
          <CheckCircle className="h-4 w-4" />
          Status {selectedStatuses.length > 0 && `(${selectedStatuses.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56 bg-white">
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Filter by Status
        </DropdownMenuLabel>
        
        <div className="max-h-48 overflow-y-auto">
          {STATUS_OPTIONS.map((status) => {
            const IconComponent = status.icon;
            return (
              <DropdownMenuCheckboxItem
                key={status.value}
                checked={selectedStatuses.includes(status.value)}
                onSelect={(e) => {
                  e.preventDefault();
                  handleStatusToggle(status.value);
                }}
                className="px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <IconComponent className={`h-4 w-4 ${status.color}`} />
                  {status.label}
                </div>
              </DropdownMenuCheckboxItem>
            );
          })}
        </div>
        
        {selectedStatuses.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStatusSelect([])}
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