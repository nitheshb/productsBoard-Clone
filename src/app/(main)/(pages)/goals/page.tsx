'use client';

import { useState, useEffect, useRef } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, MagnifyingGlassIcon, ChevronDownIcon, CheckCircleIcon, PlusIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface Goal {
  id: string;
  componentName: string;
  progress: number;
  startDate: string;
  targetDate: string;
  status: string;
  color: string;
  created_at: string;
}

interface GoalsBoardProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  goals: Goal[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  granularity: 'quarterly' | 'months' | 'weeks';
  setGranularity: (granularity: 'quarterly' | 'months' | 'weeks') => void;
}

const GoalsBoard = ({ 
  currentDate, 
  setCurrentDate, 
  goals, 
  searchQuery, 
  setSearchQuery, 
  granularity,
  setGranularity
}: GoalsBoardProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    'Todo': false,
    'In Progress': true,
    'Completed': false
  } as Record<string, boolean>);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.board-controls-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);
  
  // Get timeline data based on granularity
  const getTimelineData = (date: Date, granularity: 'quarterly' | 'months' | 'weeks') => {
    const timeline = [];
    
    if (granularity === 'quarterly') {
      const year = date.getFullYear();
      const currentMonth = date.getMonth();
      const currentQuarter = Math.floor(currentMonth / 3);
      
      // Previous quarter
      const prevQuarter = currentQuarter === 0 ? 3 : currentQuarter - 1;
      const prevYear = currentQuarter === 0 ? year - 1 : year;
      const prevQuarterStart = new Date(prevYear, prevQuarter * 3, 1);
      const prevQuarterEnd = new Date(prevYear, (prevQuarter + 1) * 3, 0);
      
      // Current quarter
      const currentQuarterStart = new Date(year, currentQuarter * 3, 1);
      const currentQuarterEnd = new Date(year, (currentQuarter + 1) * 3, 0);
      
      // Next quarter
      const nextQuarter = currentQuarter === 3 ? 0 : currentQuarter + 1;
      const nextYear = currentQuarter === 3 ? year + 1 : year;
      const nextQuarterStart = new Date(nextYear, nextQuarter * 3, 1);
      const nextQuarterEnd = new Date(nextYear, (nextQuarter + 1) * 3, 0);
      
      timeline.push({
        start: prevQuarterStart,
        end: prevQuarterEnd,
        label: `Q${prevQuarter + 1} ${prevYear}`,
        type: 'previous'
      });
      
      timeline.push({
        start: currentQuarterStart,
        end: currentQuarterEnd,
        label: `Q${currentQuarter + 1} ${year}`,
        type: 'current'
      });
      
      timeline.push({
        start: nextQuarterStart,
        end: nextQuarterEnd,
        label: `Q${nextQuarter + 1} ${nextYear}`,
        type: 'next'
      });
    } else if (granularity === 'months') {
      const year = date.getFullYear();
      const currentMonth = date.getMonth();
      
      // Show 4 months: last month, this month, next month, next+1 month
      for (let i = -1; i <= 2; i++) {
        const monthIndex = currentMonth + i;
        const monthYear = monthIndex < 0 ? year - 1 : monthIndex > 11 ? year + 1 : year;
        const adjustedMonth = monthIndex < 0 ? 12 + monthIndex : monthIndex > 11 ? monthIndex - 12 : monthIndex;
        
        const monthStart = new Date(monthYear, adjustedMonth, 1);
        const monthEnd = new Date(monthYear, adjustedMonth + 1, 0);
        
        let type = 'current';
        if (i === -1) type = 'last';
        else if (i === 0) type = 'current';
        else if (i === 1) type = 'next';
        else if (i === 2) type = 'next2';
        
        timeline.push({
          start: monthStart,
          end: monthEnd,
          label: monthStart.toLocaleDateString('en', { month: 'short' }),
          type: type
        });
      }
    } else {
      // Weeks view - show 3 months worth of weeks
      const year = date.getFullYear();
      const currentMonth = date.getMonth();
      
      // Calculate weeks for 3 months: previous, current, next
      for (let monthOffset = -1; monthOffset <= 1; monthOffset++) {
        const monthIndex = currentMonth + monthOffset;
        const monthYear = monthIndex < 0 ? year - 1 : monthIndex > 11 ? year + 1 : year;
        const adjustedMonth = monthIndex < 0 ? 12 + monthIndex : monthIndex > 11 ? monthIndex - 12 : monthIndex;
        
        const monthStart = new Date(monthYear, adjustedMonth, 1);
        const monthEnd = new Date(monthYear, adjustedMonth + 1, 0);
        
        // Get all weeks in this month
        const current = new Date(monthStart);
        while (current <= monthEnd) {
          const weekStart = new Date(current);
          const weekEnd = new Date(current);
          weekEnd.setDate(weekEnd.getDate() + 6);
          
          // Only include weeks that are within the month
          if (weekStart.getMonth() === adjustedMonth) {
            let type = 'current';
            if (monthOffset === -1) type = 'previous';
            else if (monthOffset === 0) type = 'current';
            else if (monthOffset === 1) type = 'next';
            
            timeline.push({
              start: weekStart,
              end: weekEnd,
              label: `Week ${Math.ceil((weekStart.getDate() - 1) / 7) + 1}`,
              type: type,
              month: monthStart.toLocaleDateString('en', { month: 'short' }),
              monthYear: monthYear
            });
          }
          
          current.setDate(current.getDate() + 7);
        }
      }
    }
    
    return timeline;
  };

  const timelineData = getTimelineData(currentDate, granularity);

  // Group weeks by month for weeks view
  const getWeeksByMonth = () => {
    if (granularity !== 'weeks') return {};
    
    const monthGroups: { [key: string]: any[] } = {};
    timelineData.forEach(period => {
      const monthKey = `${period.month} ${period.monthYear}`;
      if (!monthGroups[monthKey]) {
        monthGroups[monthKey] = [];
      }
      monthGroups[monthKey].push(period);
    });
    
    return monthGroups;
  };

  const weeksByMonth = getWeeksByMonth();

  // Organize goals by status
  const goalsByStatus = {
    'In Progress': goals.filter(goal => goal.status === 'In Progress'),
    'Todo': goals.filter(goal => goal.status === 'Todo'),
    'Completed': goals.filter(goal => goal.status === 'Completed')
  };

  // Calculate task position and width
  const getTaskPosition = (goal: Goal) => {
    const startDate = new Date(goal.startDate);
    const endDate = new Date(goal.targetDate);
    
    // For all granularities, only show tasks in the current period
    const currentPeriod = timelineData.find(p => p.type === 'current');
    if (!currentPeriod) return { left: '0%', width: '0%' };
    
    // Check if task overlaps with current period
    const taskStart = Math.max(startDate.getTime(), currentPeriod.start.getTime());
    const taskEnd = Math.min(endDate.getTime(), currentPeriod.end.getTime());
    
    if (taskStart > taskEnd) {
      return { left: '0%', width: '0%' }; // Task doesn't overlap with current period
    }
    
    const periodStart = currentPeriod.start.getTime();
    const periodEnd = currentPeriod.end.getTime();
    const periodDuration = periodEnd - periodStart;
    
    // Calculate position based on task start relative to period start
    const leftPercent = ((taskStart - periodStart) / periodDuration) * 100;
    
    // Calculate width based on task's actual duration, not clipped duration
    const fullTaskDuration = endDate.getTime() - startDate.getTime();
    const widthPercent = (fullTaskDuration / periodDuration) * 100;
    
    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.min(100, widthPercent)}%`
    };
  };

  const getGoalColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'Todo': 'bg-gray-100 text-gray-700',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Completed': 'bg-green-100 text-green-800',
      'Overdue': 'bg-red-100 text-red-800',
      'Blocked': 'bg-red-100 text-red-800',
      'Review': 'bg-blue-100 text-blue-800',
      'Testing': 'bg-purple-100 text-purple-800'
    };
    return statusColorMap[status] || 'bg-gray-100 text-gray-700';
  };

  const getBorderColor = (status: string) => {
    const borderColorMap: { [key: string]: string } = {
      'Todo': 'border-l-gray-500',
      'In Progress': 'border-l-yellow-500',
      'Completed': 'border-l-green-500',
      'Overdue': 'border-l-red-500',
      'Blocked': 'border-l-red-500',
      'Review': 'border-l-blue-500',
      'Testing': 'border-l-purple-500'
    };
    return borderColorMap[status] || 'border-l-gray-500';
  };

  const getStatusColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'Todo': 'bg-gray-500',
      'In Progress': 'bg-yellow-500',
      'Completed': 'bg-green-500',
      'Overdue': 'bg-red-500',
      'Blocked': 'bg-red-500',
      'Review': 'bg-blue-500',
      'Testing': 'bg-purple-500'
    };
    return statusColorMap[status] || 'bg-gray-500';
  };

  const formatDateRange = (startDate: string, targetDate: string) => {
    const start = new Date(startDate);
    const end = new Date(targetDate);
    return `${start.toLocaleDateString('en', { month: 'short', day: 'numeric' })} → ${end.toLocaleDateString('en', { month: 'short', day: 'numeric' })}`;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (granularity) {
      case 'quarterly':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 3 : -3));
        break;
      case 'months':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'weeks':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
    }
    
    setCurrentDate(newDate);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-full mx-auto relative">
          {/* Header */}
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b overflow-visible">
            <div className="flex items-center gap-2">
              <CheckCircleIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Goals Roadmap</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search goals..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Board Controls Button */}
              <div className="relative board-controls-dropdown">
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  Board Controls
                  <ChevronDownIcon className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                 {/* Dropdown Menu */}
                 {isDropdownOpen && (
                   <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30">
                     <div className="p-2">
                       <div className="text-sm font-medium text-gray-900 mb-2">Granularity</div>
                       <div className="space-y-1">
                         <button
                           onClick={() => {
                             setGranularity('quarterly');
                             setIsDropdownOpen(false);
                           }}
                           className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                             granularity === 'quarterly' 
                               ? 'bg-blue-100 text-blue-700' 
                               : 'text-gray-700 hover:bg-gray-100'
                           }`}
                         >
                           Quarterly
                         </button>
                         <button
                           onClick={() => {
                             setGranularity('months');
                             setIsDropdownOpen(false);
                           }}
                           className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                             granularity === 'months' 
                               ? 'bg-blue-100 text-blue-700' 
                               : 'text-gray-700 hover:bg-gray-100'
                           }`}
                         >
                           Months
                         </button>
                         <button
                           onClick={() => {
                             setGranularity('weeks');
                             setIsDropdownOpen(false);
                           }}
                           className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                             granularity === 'weeks' 
                               ? 'bg-blue-100 text-blue-700' 
                               : 'text-gray-700 hover:bg-gray-100'
                           }`}
                         >
                           Weeks
                         </button>
                       </div>
                     </div>
                   </div>
                 )}
              </div>
              
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => navigateDate('prev')}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => navigateDate('next')}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                {granularity === 'quarterly' ? `Q${Math.floor(currentDate.getMonth() / 3) + 1} ${currentDate.getFullYear()}` :
                 granularity === 'months' ? currentDate.toLocaleDateString('en', { month: 'long', year: 'numeric' }) :
                 currentDate.toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
          </header>

          <div className="p-4">
            {/* Roadmap Timeline */}
            <div className="w-full" ref={timelineRef}>
              <div className="w-full">
                {/* Timeline Header */}
                <div className="sticky top-0 z-10 bg-white border-b-2 border-gray-200">
                  {granularity === 'weeks' ? (
                    <div>
                      {/* Month Headers */}
                      <div className="flex">
                        {Object.entries(weeksByMonth).map(([monthKey, weeks]) => {
                          const totalWeeks = timelineData.length;
                          const monthWidth = (weeks.length / totalWeeks) * 100;
                          
                          return (
                            <div 
                              key={monthKey} 
                              className="border-r border-gray-200"
                              style={{ width: `${monthWidth}%` }}
                            >
                              <div className="p-2 bg-blue-50 text-center">
                                <div className="font-bold text-sm text-blue-800">{monthKey}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      {/* Week Headers */}
                      <div className="flex w-full">
                        {timelineData.map((period, index) => (
                          <div key={index} className="flex-1 min-w-[80px] border-r border-gray-200">
                            <div className="p-1 bg-gray-50 text-center">
                              <div className="font-semibold text-xs text-gray-700">{period.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      {/* Timeline Headers */}
                      <div className={`flex-1 ${granularity === 'quarterly' ? 'grid grid-cols-[80px_1fr_80px]' : granularity === 'months' ? 'grid grid-cols-4' : 'flex'}`}>
                        {timelineData.map((period, index) => (
                           <div key={index} className="border-r border-gray-200">
                             <div className="p-2 bg-gray-50 text-center">
                               <div className="font-semibold text-sm text-gray-700">{period.label}</div>
                             </div>
                           </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Rows */}
                {Object.entries(goalsByStatus).map(([status, statusGoals]) => (
                  <div key={status} className="border-b border-gray-100">
                    {/* Section Header */}
                    <div className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">{status}</span>
                        <span className="text-xs text-gray-500">({statusGoals.length})</span>
                        <div 
                          onClick={() => toggleSection(status)}
                          className="cursor-pointer p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          {expandedSections[status] ? (
                            <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Rows */}
                    {expandedSections[status] && (
                      <div className="space-y-2">
                        {statusGoals.map((goal, index) => (
                          <div key={goal.id} className="flex">
                            {/* Timeline Row */}
                            <div className="flex-1 relative">
                             {granularity === 'quarterly' ? (
                               <div className="grid grid-cols-[80px_1fr_80px] h-20">
                                 {/* Previous Period Column - Empty */}
                                 <div className="relative">
                                   {/* No tasks shown in previous period */}
                                 </div>
                                 
                                 {/* Current Period Column */}
                                 <div className="relative">
                                   {/* Single task for current period */}
                                   {(() => {
                                     const startDate = new Date(goal.startDate);
                                     const endDate = new Date(goal.targetDate);
                                     const currentPeriod = timelineData.find(p => p.type === 'current');
                                     
                                     if (!currentPeriod) return null;
                                     
                                     // Check if task overlaps with current period
                                     const taskStart = Math.max(startDate.getTime(), currentPeriod.start.getTime());
                                     const taskEnd = Math.min(endDate.getTime(), currentPeriod.end.getTime());
                                     
                                     if (taskStart > taskEnd) return null;
                                     
                                     const periodStart = currentPeriod.start.getTime();
                                     const periodEnd = currentPeriod.end.getTime();
                                     const periodDuration = periodEnd - periodStart;
                                     
                                     // Calculate position based on task start relative to period start
                                     const leftPercent = ((taskStart - periodStart) / periodDuration) * 100;
                                     
                                     // Calculate width - show full task duration within current period
                                     let widthPercent;
                                     if (startDate.getTime() < currentPeriod.start.getTime()) {
                                       // Task started in previous period, start from beginning of current period
                                       const adjustedLeft = 0;
                                       const taskDuration = taskEnd - currentPeriod.start.getTime();
                                       widthPercent = (taskDuration / periodDuration) * 100;
                                     } else if (endDate.getTime() > currentPeriod.end.getTime()) {
                                       // Task extends to next period, show full width to edge
                                       widthPercent = 100 - leftPercent;
                                     } else {
                                       // Task is fully within current period
                                       const taskDuration = taskEnd - taskStart;
                                       widthPercent = (taskDuration / periodDuration) * 100;
                                     }
                                     
                                     return (
                                       <div
                                         className={`absolute top-2 h-16 rounded-md border-l-4 ${getGoalColor(goal.status)} ${getBorderColor(goal.status)} cursor-pointer hover:shadow-md transition-shadow`}
                                         style={{
                                           left: `${Math.max(0, leftPercent)}%`,
                                           width: `${Math.min(100, widthPercent)}%`,
                                           minWidth: '120px'
                                         }}
                                         title={`${goal.componentName} - ${formatDateRange(goal.startDate, goal.targetDate)}`}
                                       >
                                         <div className="p-2 h-full flex flex-col justify-between">
                                           <div className="font-medium text-xs leading-tight truncate">{goal.componentName}</div>
                                           <div className="text-xs opacity-75 leading-tight">
                                             {formatDateRange(goal.startDate, goal.targetDate)}
                                           </div>
                                           <div className="flex items-center gap-2 mt-1">
                                             <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                               <div 
                                                 className="h-1.5 rounded-full transition-all duration-300 bg-blue-500"
                                                 style={{ width: `${goal.progress}%` }}
                                               ></div>
                                             </div>
                                             <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{goal.progress}%</span>
                                           </div>
                                         </div>
                                       </div>
                                     );
                                   })()}
                                 </div>
                                 
                                 {/* Next Period Column - Empty */}
                                 <div className="relative">
                                   {/* No tasks shown in next period */}
                                 </div>
                               </div>
                            ) : (
                              <div className={`${granularity === 'months' ? 'grid grid-cols-4' : 'flex w-full'} h-20 relative`}>
                                {/* Single task as continuous bar across the full timeline */}
                                {(() => {
                                  const startDate = new Date(goal.startDate);
                                  const endDate = new Date(goal.targetDate);
                                  
                                  // Calculate position relative to the entire timeline
                                  const timelineStart = timelineData[0]?.start || new Date();
                                  const timelineEnd = timelineData[timelineData.length - 1]?.end || new Date();
                                  const totalTimelineDuration = timelineEnd.getTime() - timelineStart.getTime();
                                  
                                  // Only show tasks that overlap with the visible timeline
                                  if (endDate.getTime() < timelineStart.getTime() || startDate.getTime() > timelineEnd.getTime()) {
                                    return null;
                                  }
                                  
                                  // Calculate task position and width relative to entire timeline
                                  // Clamp task start and end to timeline boundaries
                                  const clampedTaskStart = Math.max(startDate.getTime(), timelineStart.getTime());
                                  const clampedTaskEnd = Math.min(endDate.getTime(), timelineEnd.getTime());
                                  
                                  const taskStartPercent = ((clampedTaskStart - timelineStart.getTime()) / totalTimelineDuration) * 100;
                                  const taskEndPercent = ((clampedTaskEnd - timelineStart.getTime()) / totalTimelineDuration) * 100;
                                  const taskWidthPercent = taskEndPercent - taskStartPercent;
                                  
                                  return (
                                    <div
                                      className={`absolute top-2 h-16 rounded-md border-l-4 ${getGoalColor(goal.status)} ${getBorderColor(goal.status)} cursor-pointer hover:shadow-md transition-shadow`}
                                      style={{
                                        left: `${Math.max(0, taskStartPercent)}%`,
                                        width: `${Math.min(100, taskWidthPercent)}%`,
                                        minWidth: '120px'
                                      }}
                                      title={`${goal.componentName} - ${formatDateRange(goal.startDate, goal.targetDate)}`}
                                    >
                                       <div className="p-2 h-full flex flex-col justify-between">
                                         <div className="font-medium text-xs leading-tight truncate">{goal.componentName}</div>
                                         <div className="text-xs opacity-75 leading-tight">
                                           {formatDateRange(goal.startDate, goal.targetDate)}
                                         </div>
                                        <div className="flex items-center gap-2 mt-1">
                                          <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                            <div 
                                              className="h-1.5 rounded-full transition-all duration-300 bg-blue-500"
                                              style={{ width: `${goal.progress}%` }}
                                            ></div>
                                          </div>
                                          <span className="text-xs font-medium text-gray-600 whitespace-nowrap">{goal.progress}%</span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function GoalsPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [granularity, setGranularity] = useState<'quarterly' | 'months' | 'weeks'>('quarterly');

  useEffect(() => {
    const fetchData = async () => {
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 10000);
      
      try {
        const { data: goalData, error: goalError } = await supabase
          .from('components')
          .select('id, name, description, startdate, targetdate, status, progress, created_at')
          .not('startdate', 'is', null)
          .not('targetdate', 'is', null);

        if (goalError) throw goalError;

        const formattedGoals: Goal[] = goalData.length > 0 ? goalData.map(goal => ({
          id: goal.id,
          componentName: goal.name,
          progress: goal.progress || 0,
          startDate: goal.startdate,
          targetDate: goal.targetdate,
          status: goal.status || 'Todo',
          color: 'blue',
          created_at: goal.created_at || new Date().toISOString()
        })) : [];

        const sortedGoals = formattedGoals.sort((a, b) => a.componentName.localeCompare(b.componentName));
        setGoals(sortedGoals);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error fetching goals:', error);
        setGoals([]);
        clearTimeout(timeoutId);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading goals roadmap...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-full mx-auto">
            <header className="flex justify-between items-center p-4 bg-white border-b">
              <div className="flex items-center gap-2">
                <CheckCircleIcon className="h-6 w-6 text-blue-500" />
                <h1 className="text-xl font-semibold">Goals Roadmap</h1>
              </div>
            </header>
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <CheckCircleIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No Goals Found</h2>
                <p className="text-gray-500">Create some components with start and target dates to see the goals roadmap.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <GoalsBoard 
      currentDate={currentDate}
      setCurrentDate={setCurrentDate}
      goals={goals}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      granularity={granularity}
      setGranularity={setGranularity}
    />
  );
}