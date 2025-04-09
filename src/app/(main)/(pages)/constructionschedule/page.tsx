

// "use client";

// import { useState, useEffect } from "react";
// import { Search, Filter, ChevronDown, ChevronUp, RotateCcw, RefreshCw, Home as HomeIcon, Settings, LayoutGrid, LayoutList, ChevronLeft, ChevronRight, MessageSquare } from "lucide-react";
// import { Switch } from "@/components/ui/switch";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { format, addDays, eachDayOfInterval, startOfWeek, endOfWeek, parseISO, isWithinInterval } from "date-fns";
// import { Calendar as CalendarIcon } from "lucide-react";
// import { Calendar } from "@/components/ui/calendar";
// import { CircularProgressbar } from 'react-circular-progressbar';
// import 'react-circular-progressbar/dist/styles.css';
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { DateRange } from "react-day-picker";

// interface Task {
//   id: string;
//   name: string;
//   status: number;
//   workDays: number;
//   startDate: string;
//   color: string;
//   endDate?: string; // Calculated field
// }

// interface Phase {
//   id: string;
//   name: string;
//   status: number;
//   workDays: number;
//   tasks: Task[];
//   isExpanded: boolean;
//   color: string;
//   visibleInRange?: boolean; // Added to track if phase has visible tasks
// }

// export default function Home() {
//   const initialPhases: Phase[] = [
//     {
//       id: "1",
//       name: "Pre-Construction",
//       status: 96,
//       workDays: 22,
//       color: "rgb(14, 165, 233)",
//       isExpanded: true,
//       tasks: [
//         {
//           id: "1-1",
//           name: "Architectural Review Board",
//           status: 100,
//           workDays: 14,
//           startDate: "2024-10-18",
//           color: "rgb(14, 165, 233)"
//         },
//         {
//           id: "1-2",
//           name: "Building Permit",
//           status: 86,
//           workDays: 5,
//           startDate: "2024-10-20",
//           color: "rgb(14, 165, 233)"
//         }
//       ]
//     },
//     {
//       id: "2",
//       name: "Lot / Foundation",
//       status: 25,
//       workDays: 21,
//       color: "rgb(124, 58, 237)",
//       isExpanded: true,
//       tasks: [
//         {
//           id: "2-1",
//           name: "Clear Lot / Tree Removal",
//           status: 60,
//           workDays: 12,
//           startDate: "2024-10-21",
//           color: "rgb(124, 58, 237)"
//         },
//         {
//           id: "2-2",
//           name: "Install Silt Fence",
//           status: 0,
//           workDays: 2,
//           startDate: "2024-10-22",
//           color: "rgb(124, 58, 237)"
//         },
//         {
//           id: "2-3",
//           name: "Install Construction Driveway",
//           status: 0,
//           workDays: 7,
//           startDate: "2024-10-23",
//           color: "rgb(124, 58, 237)"
//         }
//       ]
//     },
//     {
//       id: "3",
//       name: "Rough-Ins",
//       status: 0,
//       workDays: 54,
//       color: "rgb(234, 179, 8)",
//       isExpanded: true,
//       tasks: [
//         {
//           id: "3-1",
//           name: "Stake Lot For Excavation",
//           status: 0,
//           workDays: 5,
//           startDate: "2024-10-24",
//           color: "rgb(234, 179, 8)"
//         },
//         {
//           id: "3-2",
//           name: "Excavate Basement",
//           status: 0,
//           workDays: 19,
//           startDate: "2024-10-25",
//           color: "rgb(234, 179, 8)"
//         },
//         {
//           id: "3-3",
//           name: "Footings Inspection",
//           status: 0,
//           workDays: 5,
//           startDate: "2024-10-26",
//           color: "rgb(234, 179, 8)"
//         },
//         {
//           id: "3-4",
//           name: "Pin Wall Corners",
//           status: 0,
//           workDays: 3,
//           startDate: "2024-10-26",
//           color: "rgb(234, 179, 8)"
//         }
//       ]
//     }
//   ];

//   const [showCriticalPath, setShowCriticalPath] = useState(false);
//   const [date, setDate] = useState<DateRange | undefined>({
//     from: new Date(2024, 9, 18),
//     to: new Date(2024, 9, 26),
//   });
//   const [phases, setPhases] = useState<Phase[]>([]);
//   const [filteredPhases, setFilteredPhases] = useState<Phase[]>([]);

//   // Calculate end dates for each task and filter visible tasks based on date range
//   useEffect(() => {
//     if (!date?.from || !date?.to) return;

//     // First calculate end dates for all tasks
//     const phasesWithEndDates = initialPhases.map(phase => {
//       const updatedTasks = phase.tasks.map(task => {
//         const startDate = parseISO(task.startDate);
//         const endDate = addDays(startDate, task.workDays - 1);
//         return {
//           ...task,
//           endDate: format(endDate, 'yyyy-MM-dd')
//         };
//       });
//       return {
//         ...phase,
//         tasks: updatedTasks
//       };
//     });

//     // Then filter tasks based on date range
//     const filtered = phasesWithEndDates.map(phase => {
//       const visibleTasks = phase.tasks.filter(task => {
//         const taskStart = parseISO(task.startDate);
//         const taskEnd = parseISO(task.endDate as string);
        
//         // Check if task overlaps with selected date range
//         return (
//           isWithinInterval(taskStart, { start: date.from as Date, end: date.to as Date }) ||
//           isWithinInterval(taskEnd, { start: date.from as Date, end: date.to as Date }) ||
//           (date.from && date.to && taskStart <= date.from && taskEnd >= date.to)
//         );
//       });

//       return {
//         ...phase,
//         tasks: visibleTasks,
//         visibleInRange: visibleTasks.length > 0
//       };
//     });

//     setPhases(phasesWithEndDates);
//     setFilteredPhases(filtered);
//   }, [date]);

//   const dateRange = date?.from && date?.to 
//     ? eachDayOfInterval({ start: date.from, end: date.to })
//     : [];

//   // Calculate the date ranges for the header
//   const getDateRangeHeaders = () => {
//     if (!date?.from || !date?.to) return [];

//     const startDay = date.from;
//     const endDay = date.to;
    
//     // Create a week-based date range header
//     const weekStartDate = startOfWeek(startDay, { weekStartsOn: 0 });
//     const weekEndDate = endOfWeek(startDay, { weekStartsOn: 0 });
    
//     const nextWeekStartDate = addDays(weekStartDate, 7);

    
//     // Create header ranges based on the dates
//     const firstRange = {
//       label: `Oct ${format(startDay, 'd')}-${format(weekEndDate < endDay ? weekEndDate : endDay, 'd')}`,
//       days: eachDayOfInterval({ 
//         start: startDay, 
//         end: weekEndDate < endDay ? weekEndDate : endDay 
//       })
//     };
    
//     // If our date range crosses to next week
//     let secondRange = null;
//     if (endDay > weekEndDate) {
//       secondRange = {
//         label: `Oct ${format(nextWeekStartDate > startDay ? nextWeekStartDate : startDay, 'd')}-${format(endDay, 'd')}`,
//         days: eachDayOfInterval({ 
//           start: nextWeekStartDate > startDay ? nextWeekStartDate : startDay, 
//           end: endDay 
//         })
//       };
//     }
    
//     return secondRange ? [firstRange, secondRange] : [firstRange];
//   };

//   const dateRangeHeaders = getDateRangeHeaders();

//   const togglePhase = (phaseId: string) => {
//     setFilteredPhases(prevPhases => prevPhases.map(phase => 
//       phase.id === phaseId 
//         ? { ...phase, isExpanded: !phase.isExpanded }
//         : phase
//     ));
//   };

//   const scrollContainer = (direction: 'left' | 'right') => {
//     const container = document.getElementById('dateRangeContainer');
//     if (container) {
//       const scrollAmount = 200;
//       container.scrollLeft += direction === 'left' ? -scrollAmount : scrollAmount;
//     }
//   };

//   // Function to get task position relative to visible date range
//   const getTaskPosition = (task: Task) => {
//     if (!date?.from || !date?.to) return { left: 0, width: 0 };
    
//     const startDate = parseISO(task.startDate);
//     const endDate = parseISO(task.endDate as string);
//     const rangeStart = date.from;
//     const rangeEnd = date.to;
    
//     // Calculate where in the visible range this task falls
//     const visibleStart = startDate < rangeStart ? rangeStart : startDate;
//     const visibleEnd = endDate > rangeEnd ? rangeEnd : endDate;
    
//     // Calculate position as percentage of visible range
//     const totalDays = dateRange.length;
//     const startDayDiff = Math.max(0, (visibleStart.getTime() - rangeStart.getTime()) / (1000 * 60 * 60 * 24));
//     const taskVisibleDays = (visibleEnd.getTime() - visibleStart.getTime()) / (1000 * 60 * 60 * 24) + 1;
    
//     return {
//       left: `${(startDayDiff / totalDays) * 100}%`,
//       width: `${(taskVisibleDays / totalDays) * 100}%`
//     };
//   };

//   const handleDateSelect = (newDateRange: DateRange | undefined) => {
//     setDate(newDateRange);
//   };

//   // Expand/collapse all phases
//   const expandAll = () => {
//     setFilteredPhases(prevPhases => prevPhases.map(phase => ({ ...phase, isExpanded: true })));
//   };

//   const collapseAll = () => {
//     setFilteredPhases(prevPhases => prevPhases.map(phase => ({ ...phase, isExpanded: false })));
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {/* Top Navigation */}
//       <div className="border-b">
//         <div className="max-w-[1400px] mx-auto px-4 py-2">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <HomeIcon className="h-5 w-5 text-gray-500" />
//               <div className="flex items-center gap-2">
//                 <div>
//                   <h1 className="text-sm font-medium">John Black Residence</h1>
//                   <p className="text-xs text-gray-500">2223 S Main St, Wake Forest...</p>
//                 </div>
//                 <ChevronDown className="h-4 w-4 text-gray-400" />
//               </div>
//             </div>
            
//             <div className="flex items-center gap-4">
//               <div className="flex -space-x-2">
//                 <Avatar className="h-6 w-6 border-2 border-white">
//                   <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" />
//                   <AvatarFallback>JB</AvatarFallback>
//                 </Avatar>
//                 <Avatar className="h-6 w-6 border-2 border-white">
//                   <AvatarImage src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" />
//                   <AvatarFallback>JD</AvatarFallback>
//                 </Avatar>
//               </div>
//               <Settings className="h-5 w-5 text-gray-400" />
//               <div className="flex items-center gap-2">
//               <MessageSquare className="h-5 w-5 text-gray-400" />
//                 <div className="bg-gray-100 rounded-full px-2 py-0.5">
//                   <span className="text-xs">2</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-[1400px] mx-auto p-4">
//         {/* Schedule Header */}
//         <div className="flex items-center justify-between mb-6">
//           <div className="flex items-center gap-6">
//             <h2 className="text-lg font-medium">Construction Schedule</h2>
//             <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-md">
//               <Button variant="ghost" size="sm" className="h-8">
//                 <LayoutList className="h-4 w-4" />
//               </Button>
//               <Button variant="ghost" size="sm" className="h-8">
//                 <LayoutGrid className="h-4 w-4" />
//               </Button>
              
//             </div>
//           </div>
          
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//               <Input
//                 className="pl-10 h-9 w-64"
//                 placeholder="Search"
//               />
//             </div>
//             <Popover>
//               <PopoverTrigger asChild>
//                 <Button variant="outline" size="sm" className="h-9">
//                   <CalendarIcon className="mr-2 h-4 w-4" />
//                   {date?.from ? (
//                     date.to ? (
//                       <>
//                         {format(date.from, "LLL dd, y")} -{" "}
//                         {format(date.to, "LLL dd, y")}
//                       </>
//                     ) : (
//                       format(date.from, "LLL dd, y")
//                     )
//                   ) : (
//                     <span>Pick a date</span>
//                   )}
//                 </Button>
//               </PopoverTrigger>
//               <PopoverContent className="w-auto p-0" align="end">
//                 <Calendar
//                   initialFocus
//                   mode="range"
//                   defaultMonth={date?.from}
//                   selected={date}
//                   onSelect={handleDateSelect}
//                   numberOfMonths={2}
//                 />
//               </PopoverContent>
//             </Popover>
//             <Button variant="outline" size="sm" className="h-9">
//               <Filter className="h-4 w-4 mr-2" />
//               Filters
//             </Button>
//           </div>
//         </div>

//         {/* Controls */}
//         <div className="flex items-center gap-4 mb-6">
//           <Button variant="outline" size="sm" onClick={collapseAll}>
//             <ChevronUp className="h-4 w-4 mr-2" />
//             Collapse
//           </Button>
//           <Button variant="outline" size="sm" onClick={expandAll}>
//             <ChevronDown className="h-4 w-4 mr-2" />
//             Expand
//           </Button>
//           <Button variant="outline" size="sm">
//             <RotateCcw className="h-4 w-4" />
//           </Button>
//           <Button variant="outline" size="sm">
//             <RefreshCw className="h-4 w-4" />
//           </Button>
//           <div className="flex items-center gap-2">
//             <Switch
//               checked={showCriticalPath}
//               onCheckedChange={setShowCriticalPath}
//               className="data-[state=checked]:bg-blue-500"
//             />
//             <span className="text-sm">Show Critical Path</span>
//           </div>
//         </div>

//         {/* Schedule Grid */}
//         <div className="border rounded-lg">
//           {/* Date Range Headers */}
//           <div className="grid grid-cols-[1fr,100px,100px,auto] gap-4">
//             {/* Column headers - Phase, Status, Work Days */}
//             <div className="p-4 bg-gray-50 border-b">
//               <span className="text-sm font-medium">Phase</span>
//             </div>
//             <div className="p-4 bg-gray-50 border-b">
//               <span className="text-sm font-medium">Status</span>
//             </div>
//             <div className="p-4 bg-gray-50 border-b">
//               <span className="text-sm font-medium">Work Days</span>
//             </div>

//             {/* Date Range Headers */}
//             <div className="relative">
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
//                 onClick={() => scrollContainer('left')}
//               >
//                 <ChevronLeft className="h-4 w-4" />
//               </Button>

//               <div 
//                 id="dateRangeContainer"
//                 className="overflow-x-auto scrollbar-hide"
//                 style={{ scrollBehavior: 'smooth' }}
//               >
//                 <div className="min-w-[720px] flex flex-col border-l">
//                   {/* Date Range Headers */}
//                   <div className="flex border-b bg-gray-50">
//                     {dateRangeHeaders.map((range, index) => (
//                       <div 
//                         key={index} 
//                         className="p-4 font-medium text-sm"
//                         style={{ 
//                           width: `${(range.days.length / dateRange.length) * 100}%` 
//                         }}
//                       >
//                         {range.label}
//                       </div>
//                     ))}
//                   </div>

//                   {/* Weekdays */}
//                   <div className="flex bg-gray-50 border-b">
//                     {dateRange.map((day, index) => (
//                       <div 
//                         key={index} 
//                         className="text-center py-2 text-xs text-gray-500"
//                         style={{ width: `${100 / dateRange.length}%` }}
//                       >
//                         {format(day, 'E')} {format(day, 'd')}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <Button
//                 variant="ghost"
//                 size="icon"
//                 className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
//                 onClick={() => scrollContainer('right')}
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
          
//           {filteredPhases.filter(phase => phase.visibleInRange).map(phase => (
//             <div key={phase.id}>
//               <div className="grid grid-cols-[1fr,100px,100px,auto] gap-4 px-4 py-3 border-b hover:bg-gray-50">
//                 <div className="flex items-center gap-2">
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     className="h-6 w-6 p-0"
//                     onClick={() => togglePhase(phase.id)}
//                   >
//                     {phase.isExpanded ? (
//                       <ChevronUp className="h-4 w-4" />
//                     ) : (
//                       <ChevronDown className="h-4 w-4" />
//                     )}
//                   </Button>
//                   <div className="w-2 h-2 rounded-full" style={{ backgroundColor: phase.color }} />
//                   <span className="text-sm">{phase.name}</span>
//                 </div>
//                 {/* <div>
//                   <Progress value={phase.status} className="h-2" />
//                   <span className="text-xs text-gray-500">{phase.status}%</span>
//                 </div> */}
//                  <div className="flex items-center">
//       <div className="w-10 h-10 ml-10">
//         <CircularProgressbar
//           value={phase.status}
//           text={`${phase.status}%`}
//           styles={{
//             path: {
//               stroke: '#4caf50',
//               strokeLinecap: 'round',
//             },
//             trail: {
//               stroke: '#d6d6d6',
//             },
//             text: {
//               fontSize: '16px',
//               fill: '#4caf50',
//               dominantBaseline: 'middle',
//             },
//           }}
//         />
//         {/* {phase.status}% */}
//       </div>
//     </div>
//                 <div className="text-sm ml-14">{phase.workDays}</div>
//                 <div className="min-w-[720px]"></div>
//               </div>
              
//               {phase.isExpanded && phase.tasks.map(task => (
//                 <div
//                   key={task.id}
//                   className="grid grid-cols-[1fr,100px,100px,auto] gap-4 px-4 py-3 pl-12 border-b bg-gray-50"
//                 >
//                   <div className="flex items-center gap-2">
//                     <div className="w-2 h-2 rounded-full" style={{ backgroundColor: task.color }} />
//                     <span className="text-sm">{task.name}</span>
//                   </div>
//                   <div className="flex items-center">
//       <div className="w-10 h-10 ml-10">
//         <CircularProgressbar
//           value={phase.status}
//           text={`${task.status}%`}
//           styles={{
//             path: {
//               stroke: '#4caf50',
//               strokeLinecap: 'round',
//             },
//             trail: {
//               stroke: '#d6d6d6',
//             },
//             text: {
//               fontSize: '16px',
//               fill: '#4caf50',
//               dominantBaseline: 'middle',
//             },
//           }}
//         />
        
//       </div>
//     </div>
//                   {/* <div>
//                     <Progress value={task.status} className="h-2" />
//                     <span className="text-xs text-gray-500">{task.status}%</span>
//                   </div> */}
                  
                  
//                   <div className="text-sm ml-14">{task.workDays}</div>
//                   <div className="min-w-[720px] relative">
//                     <div 
//                       className="absolute h-5 rounded"
//                       style={{
//                         backgroundColor: task.color,
//                         opacity: 0.2,
//                         ...getTaskPosition(task)
//                       }}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }