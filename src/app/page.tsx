
"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Filter, ChevronDown, ChevronUp, RotateCcw, RefreshCw, Home as HomeIcon, Settings, LayoutGrid, LayoutList, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { format, addDays, eachDayOfInterval,  parseISO, isWithinInterval } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

interface Task {
  id: string;
  name: string;
  status: number;
  workDays: number;
  startDate: string;
  color: string;
  endDate?: string; // Calculated field
}

interface Phase {
  id: string;
  name: string;
  status: number;
  workDays: number;
  tasks: Task[];
  isExpanded: boolean;
  color: string;
  visibleInRange?: boolean; // Added to track if phase has visible tasks
}

export default function Home() {
  const initialPhases: Phase[] = [
    {
      id: "1",
      name: "Pre-Construction",
      status: 96,
      workDays: 22,
      color: "rgb(14, 165, 233)",
      isExpanded: true,
      tasks: [
        {
          id: "1-1",
          name: "Architectural Review Board",
          status: 100,
          workDays: 14,
          startDate: "2024-10-18",
          color: "rgb(14, 165, 233)"
        },
        {
          id: "1-2",
          name: "Building Permit",
          status: 86,
          workDays: 5,
          startDate: "2024-10-20",
          color: "rgb(14, 165, 233)"
        }
      ]
    },
    {
      id: "2",
      name: "Lot / Foundation",
      status: 25,
      workDays: 21,
      color: "rgb(124, 58, 237)",
      isExpanded: true,
      tasks: [
        {
          id: "2-1",
          name: "Clear Lot / Tree Removal",
          status: 60,
          workDays: 12,
          startDate: "2024-10-21",
          color: "rgb(124, 58, 237)"
        },
        {
          id: "2-2",
          name: "Install Silt Fence",
          status: 0,
          workDays: 2,
          startDate: "2024-10-22",
          color: "rgb(124, 58, 237)"
        },
        {
          id: "2-3",
          name: "Install Construction Driveway",
          status: 0,
          workDays: 7,
          startDate: "2024-10-23",
          color: "rgb(124, 58, 237)"
        }
      ]
    },
    {
      id: "3",
      name: "Rough-Ins",
      status: 0,
      workDays: 54,
      color: "rgb(234, 179, 8)",
      isExpanded: true,
      tasks: [
        {
          id: "3-1",
          name: "Stake Lot For Excavation",
          status: 0,
          workDays: 5,
          startDate: "2024-10-24",
          color: "rgb(234, 179, 8)"
        },
        {
          id: "3-2",
          name: "Excavate Basement",
          status: 0,
          workDays: 19,
          startDate: "2024-10-25",
          color: "rgb(234, 179, 8)"
        },
        {
          id: "3-3",
          name: "Footings Inspection",
          status: 0,
          workDays: 5,
          startDate: "2024-10-26",
          color: "rgb(234, 179, 8)"
        },
        {
          id: "3-4",
          name: "Pin Wall Corners",
          status: 0,
          workDays: 3,
          startDate: "2024-10-26",
          color: "rgb(234, 179, 8)"
        }
      ]
    }
  ];

  const [showCriticalPath, setShowCriticalPath] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 9, 18),
    to: new Date(2024, 9, 24),
  });
  const [phases, setPhases] = useState<Phase[]>([]);
  const [filteredPhases, setFilteredPhases] = useState<Phase[]>([]);
  const [pageTitle, setPageTitle] = useState("Construction Schedule");
  const timelineScrollRef = useRef<HTMLDivElement>(null);
  const taskContainerRef = useRef<HTMLDivElement>(null);
  const dateHeadersRef = useRef<HTMLDivElement>(null);

  // Calculate end dates for each task and filter visible tasks based on date range
  useEffect(() => {
    if (!date?.from || !date?.to) return;

    // Update page title dynamically based on selected date range
    setPageTitle(`Construction Schedule (${format(date.from, "MMM d")} - ${format(date.to, "MMM d")})`);

    // First calculate end dates for all tasks
    const phasesWithEndDates = initialPhases.map(phase => {
      const updatedTasks = phase.tasks.map(task => {
        const startDate = parseISO(task.startDate);
        const endDate = addDays(startDate, task.workDays - 1);
        return {
          ...task,
          endDate: format(endDate, 'yyyy-MM-dd')
        };
      });
      return {
        ...phase,
        tasks: updatedTasks
      };
    });

    // Then filter tasks based on date range
    const filtered = phasesWithEndDates.map(phase => {
      const visibleTasks = phase.tasks.filter(task => {
        const taskStart = parseISO(task.startDate);
        const taskEnd = parseISO(task.endDate as string);
        
        // Check if task overlaps with selected date range
        return (
          isWithinInterval(taskStart, { start: date.from as Date, end: date.to as Date }) ||
          isWithinInterval(taskEnd, { start: date.from as Date, end: date.to as Date }) ||
          (date.from && date.to && taskStart <= date.from && taskEnd >= date.to)
        );
      });

      return {
        ...phase,
        tasks: visibleTasks,
        visibleInRange: visibleTasks.length > 0
      };
    });

    setPhases(phasesWithEndDates);
    setFilteredPhases(filtered);
  }, [date]);

  // Initialize horizontal scrolling for timeline
  useEffect(() => {
    const handleScrollSync = () => {
      if (timelineScrollRef.current && taskContainerRef.current) {
        taskContainerRef.current.scrollLeft = timelineScrollRef.current.scrollLeft;
        // Do NOT sync the dateHeadersRef scroll position - this keeps headers fixed
      }
    };

    const currentTimelineRef = timelineScrollRef.current;
    if (currentTimelineRef) {
      currentTimelineRef.addEventListener('scroll', handleScrollSync);
    }

    return () => {
      if (currentTimelineRef) {
        currentTimelineRef.removeEventListener('scroll', handleScrollSync);
      }
    };
  }, []);

  const dateRange = date?.from && date?.to 
    ? eachDayOfInterval({ start: date.from, end: date.to })
    : [];

  // Calculate the date ranges for the header
  const getDateRangeHeaders = () => {
    if (!date?.from || !date?.to) return [];

    // Group dates by ranges like in the screenshot
    // First, get the first day of the range
    const firstDay = date.from;
    const lastDay = date.to;
    
    // First range - from start date to 19th (if within range)
    const oct19 = new Date(2024, 9, 19);
    const hasOct19Range = oct19 >= firstDay && oct19 <= lastDay;
    
    const ranges = [];
    
    if (hasOct19Range) {
      // Add Oct 18-19 range if it's in the selected dates
      const firstRangeEnd = new Date(Math.min(oct19.getTime(), lastDay.getTime()));
      ranges.push({
        label: `${format(firstDay, "MMM d")}-${format(firstRangeEnd, "d")}`,
        days: eachDayOfInterval({ start: firstDay, end: firstRangeEnd })
      });
      
      // If there are more days after Oct 19
      if (lastDay > oct19) {
        const oct20 = new Date(2024, 9, 20);
        const secondRangeStart = new Date(Math.max(oct20.getTime(), firstDay.getTime()));
        ranges.push({
          label: `${format(secondRangeStart, "MMM d")}-${format(lastDay, "d")}`,
          days: eachDayOfInterval({ start: secondRangeStart, end: lastDay })
        });
      }
    } else {
      // If date range doesn't include Oct 19, use a single range
      // Use the month name for the first date
      if (firstDay.getMonth() === lastDay.getMonth()) {
        ranges.push({
          label: `${format(firstDay, "MMM d")}-${format(lastDay, "d")}`,
          days: dateRange
        });
      } else {
        ranges.push({
          label: `${format(firstDay, "MMM d")} - ${format(lastDay, "MMM d")}`,
          days: dateRange
        });
      }
    }
    
    return ranges;
  };

  const dateRangeHeaders = getDateRangeHeaders();

  const togglePhase = (phaseId: string) => {
    setFilteredPhases(prevPhases => prevPhases.map(phase => 
      phase.id === phaseId 
        ? { ...phase, isExpanded: !phase.isExpanded }
        : phase
    ));
  };

  // Function to get task position relative to visible date range
  const getTaskPosition = (task: Task) => {
    if (!date?.from || !date?.to) return { left: 0, width: 0 };
    
    const startDate = parseISO(task.startDate);
    const endDate = parseISO(task.endDate as string);
    const rangeStart = date.from;
    const rangeEnd = date.to;
    
    // Calculate where in the visible range this task falls
    const visibleStart = startDate < rangeStart ? rangeStart : startDate;
    const visibleEnd = endDate > rangeEnd ? rangeEnd : endDate;
    
    // Calculate position as percentage of visible range
    const totalDays = dateRange.length;
    const startDayDiff = Math.max(0, (visibleStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
    const taskVisibleDays = (visibleEnd.getTime() - visibleStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    
    return {
      left: `${(startDayDiff / totalDays) * 100}%`,
      width: `${(taskVisibleDays / totalDays) * 100}%`
    };
  };

  const handleDateSelect = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange);
  };

  // Expand/collapse all phases
  const expandAll = () => {
    setFilteredPhases(prevPhases => prevPhases.map(phase => ({ ...phase, isExpanded: true })));
  };

  const collapseAll = () => {
    setFilteredPhases(prevPhases => prevPhases.map(phase => ({ ...phase, isExpanded: false })));
  };

  // Format the date string for the date picker display


  // Functions for horizontal scrolling
  const scrollLeft = () => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      // Task container scroll is synchronized via the useEffect
    }
  };

  const scrollRight = () => {
    if (timelineScrollRef.current) {
      timelineScrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      // Task container scroll is synchronized via the useEffect
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <HomeIcon className="h-5 w-5 text-gray-500" />
              <div className="flex items-center gap-2">
                <div>
                  <h1 className="text-sm font-medium">John Black Residence</h1>
                  <p className="text-xs text-gray-500">2223 S Main St, Wake Forest...</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <Avatar className="h-6 w-6 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" />
                  <AvatarFallback>JB</AvatarFallback>
                </Avatar>
                <Avatar className="h-6 w-6 border-2 border-white">
                  <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </div>
              <Settings className="h-5 w-5 text-gray-400" />
              <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-400" />
                <div className="bg-gray-100 rounded-full px-2 py-0.5">
                  <span className="text-xs">2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto p-4">
        {/* Schedule Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-medium">{pageTitle}</h2>
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
              <Button variant="ghost" size="sm" className="h-8">
                <LayoutList className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8">
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                className="pl-10 h-9 w-64"
                placeholder="Search"
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 bg-white hover:bg-gray-100 transition-colors duration-200 relative"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from && date?.to ? (
                    <>
                      {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                    </>
                  ) : (
                    "Select dates"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="rounded-md border bg-white p-3"
                  classNames={{
                    head_cell: "text-center w-10 font-normal text-sm",
                    day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                    table: "border-collapse",
                    caption: "flex justify-center pt-1 relative items-center",
                    cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-gray-100"
                  }}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="sm" className="h-9 bg-white hover:bg-gray-100 transition-colors duration-200">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="sm" onClick={collapseAll} className="hover:bg-gray-100 transition-colors duration-200">
            <ChevronUp className="h-4 w-4 mr-2" />
            Collapse
          </Button>
          <Button variant="outline" size="sm" onClick={expandAll} className="hover:bg-gray-100 transition-colors duration-200">
            <ChevronDown className="h-4 w-4 mr-2" />
            Expand
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors duration-200">
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="hover:bg-gray-100 transition-colors duration-200">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={showCriticalPath}
              onCheckedChange={setShowCriticalPath}
              className="data-[state=checked]:bg-blue-500"
            />
            <span className="text-sm">Show Critical Path</span>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="border border-gray-200 rounded-lg">
          {/* Table Header */}
          <div className="flex border-b border-gray-200">
            {/* Phase column */}
            <div className="w-[500px] p-4 bg-gray-50">
              <span className="text-sm font-medium">Phase</span>
            </div>
            
            {/* Status column */}
            <div className="w-20 p-4 bg-gray-50 flex justify-center">
              <span className="text-sm font-medium">Status</span>
            </div>
            
            {/* Work Days column */}
            <div className="w-24 p-4 bg-gray-50 flex justify-center">
              <span className="text-sm font-medium">Work Days</span>
            </div>
            
            {/* Date columns */}
            <div className="flex-1 bg-gray-50 border-l border-gray-200 relative overflow-hidden">
              {/* Date range headers - FIXED, won't scroll */}
              <div 
                ref={dateHeadersRef}
                className="flex border-b border-gray-200 min-w-max relative"
              >
                {/* Left scroll button positioned at the left edge with sticky positioning */}
                <div className="sticky left-0 z-10 flex items-center h-full pl-2 pr-1 bg-gradient-to-r from-gray-50 to-transparent">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 rounded-full shadow-sm hover:bg-gray-100"
                    onClick={scrollLeft}
                  >
                    <ChevronLeft className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
                
                {dateRangeHeaders.map((range, index) => (
                  <div 
                    key={index} 
                    className="py-4 font-medium text-sm flex-1 text-center"
                    style={{ 
                      width: `${(range.days.length / dateRange.length) * 100}%`,
                      minWidth: `${range.days.length * 80}px`
                    }}
                  >
                    {range.label}
                  </div>
                ))}
                
                {/* Right scroll button positioned at the right edge with sticky positioning */}
                <div className="sticky right-0 z-10 flex items-center h-full pl-1 pr-2 bg-gradient-to-l from-gray-50 to-transparent">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/90 rounded-full shadow-sm hover:bg-gray-100"
                    onClick={scrollRight}
                  >
                    <ChevronRight className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </div>
              
              {/* Day headers - THIS WILL SCROLL */}
              <div 
                ref={timelineScrollRef}
                className="flex bg-white min-w-max overflow-auto"
                style={{ scrollbarWidth: 'thin' }}
              >
                {dateRange.map((day, index) => (
                  <div 
                    key={index} 
                    className="text-center py-2 text-xs text-gray-500"
                    style={{ 
                      width: "80px",
                      borderRight: index < dateRange.length - 1 ? '1px solid #f3f4f6' : 'none'
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-400 font-normal">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-xs font-medium">
                        {format(day, 'd')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Phase and Task rows */}
          <div ref={taskContainerRef} className="overflow-auto">
            {filteredPhases.filter(phase => phase.visibleInRange).map((phase, phaseIndex) => (
              <div key={phase.id}>
                {/* Phase row */}
                <div className={`flex border-b border-gray-200 hover:bg-gray-50 ${phaseIndex === filteredPhases.length - 1 ? 'border-b-0' : ''}`}>
                  {/* Phase name */}
                  <div className="w-[500px] p-4 flex items-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 mr-2"
                      onClick={() => togglePhase(phase.id)}
                    >
                      {phase.isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: phase.color }} />
                    <span className="text-sm">{phase.name}</span>
                  </div>
                  
                  {/* Status */}
                  <div className="w-20 p-4 flex justify-center items-center">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                      <div 
                        className="absolute inset-0 rounded-full border-4 border-green-500" 
                        style={{ 
                          clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                          opacity: phase.status / 100 
                        }}
                      ></div>
                      <span className="text-xs font-medium">{phase.status}%</span>
                    </div>
                  </div>
                  
                  {/* Work Days */}
                  <div className="w-24 p-4 flex justify-center items-center">
                    <span className="text-sm">{phase.workDays}</span>
                  </div>
                  
                  {/* Timeline - empty for phase row */}
                  <div className="flex-1 border-l border-gray-200 min-w-max" style={{ width: `${dateRange.length * 80}px` }}></div>
                </div>
                
                {/* Task rows */}
                {phase.isExpanded && phase.tasks.map((task, taskIndex) => (
                  <div 
                    key={task.id} 
                    className={`flex bg-gray-50 ${taskIndex === phase.tasks.length - 1 && phaseIndex === filteredPhases.length - 1 ? '' : 'border-b border-gray-200'}`}
                  >
                    {/* Task name */}
                    <div className="w-[500px] p-4 pl-12 flex items-center">
                      <div className="w-2 h-2 rounded-full mr-2" style={{ backgroundColor: task.color }} />
                      <span className="text-sm">{task.name}</span>
                    </div>
                    
                    {/* Status */}
                    <div className="w-20 p-4 flex justify-center items-center">
                      <div className="relative w-10 h-10 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                        <div 
                          className="absolute inset-0 rounded-full border-4 border-green-500" 
                          style={{ 
                            clipPath: `polygon(0 0, 100% 0, 100% 100%, 0% 100%)`,
                            opacity: task.status / 100 
                          }}
                        ></div>
                        <span className="text-xs font-medium">{task.status}%</span>
                      </div>
                    </div>
                    
                    {/* Work Days */}
                    <div className="w-24 p-4 flex justify-center items-center">
                      <span className="text-sm">{task.workDays}</span>
                    </div>
                    
                    {/* Timeline bar */}
                    <div className="flex-1 relative border-l border-gray-200 bg-white min-w-max" style={{ width: `${dateRange.length * 80}px` }}>
                      <div className="absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${dateRange.length}, 80px)` }}>
                        {dateRange.map((_, i) => (
                          <div key={i} className="h-full border-r border-gray-100 last:border-r-0"></div>
                        ))}
                      </div>
                      <div 
                        className="absolute top-1/2 transform -translate-y-1/2 h-6 rounded"
                        style={{
                          backgroundColor: task.color,
                          opacity: 0.2,
                          ...getTaskPosition(task)
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}