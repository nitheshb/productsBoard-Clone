import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar as CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateFilterProps {
  startDate?: Date;
  endDate?: Date;
  onDateSelect: (startDate?: Date, endDate?: Date) => void;
}

export function DateFilter({ startDate, endDate, onDateSelect }: DateFilterProps) {
  const today = new Date();
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<[Date | null, Date | null]>([
    startDate ?? today,
    endDate ?? today,
  ]);

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setTempRange(update);
    onDateSelect(update[0] || undefined, update[1] || undefined);
    setIsOpen(false);
  };

  const getDisplayText = () => {
    if (startDate && endDate) {
      return `${format(startDate, 'MMM dd')} - ${format(endDate, 'MMM dd, yyyy')}`;
    } else if (startDate) {
      return `From ${format(startDate, 'MMM dd, yyyy')}`;
    }
    return "Date Range";
  };

  const hasActiveFilter = startDate || endDate;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300">
          <CalendarIcon className="h-4 w-4" />
          {getDisplayText()}
          {hasActiveFilter && (
            <span className="ml-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          )}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-auto p-0 bg-white shadow-none border-none">
        <DropdownMenuLabel className="px-4 py-3 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Date Range
        </DropdownMenuLabel>
        <div className="flex justify-center">
          <DatePicker
            selectsRange
            startDate={tempRange[0]}
            endDate={tempRange[1]}
            onChange={handleDateChange}
            inline
          />
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}