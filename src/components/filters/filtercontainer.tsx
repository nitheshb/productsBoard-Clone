
// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarIcon } from "lucide-react";
// import { format } from "date-fns";
// import { Badge } from "@/components/ui/badge";

// interface FilterContainerProps {
//   selectedTeams: string[];
//   selectedStatuses: string[];
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   availableTeams: string[];
//   availableStatuses: string[];
//   onTeamSelect: (teams: string[]) => void;
//   onStatusSelect: (statuses: string[]) => void;
//   onDateChange: (start: Date | undefined, end: Date | undefined) => void;
//   onClearFilters: () => void;
// }

// export const FilterContainer: React.FC<FilterContainerProps> = ({
//   selectedTeams,
//   selectedStatuses,
//   startDate,
//   endDate,
//   availableTeams,
//   availableStatuses,
//   onTeamSelect,
//   onStatusSelect,
//   onDateChange,
//   onClearFilters,
// }) => {
//   const handleTeamToggle = (team: string) => {
//     const updatedTeams = selectedTeams.includes(team)
//       ? selectedTeams.filter(t => t !== team)
//       : [...selectedTeams, team];
//     onTeamSelect(updatedTeams);
//   };

//   const handleStatusToggle = (status: string) => {
//     const updatedStatuses = selectedStatuses.includes(status)
//       ? selectedStatuses.filter(s => s !== status)
//       : [...selectedStatuses, status];
//     onStatusSelect(updatedStatuses);
//   };

//   const handleDateSelect = (range: { from: Date; to?: Date }) => {
//     onDateChange(range.from, range.to);
//   };

//   return (
//     <div className="flex flex-wrap gap-3 items-center">
//       {/* Team Filter */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" className="flex items-center gap-2">
//             Team
//             {selectedTeams.length > 0 && (
//               <Badge variant="secondary" className="ml-1">
//                 {selectedTeams.length}
//               </Badge>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-56 p-2">
//           {availableTeams.map(team => (
//             <div key={team} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id={`team-${team}`}
//                 checked={selectedTeams.includes(team)}
//                 onChange={() => handleTeamToggle(team)}
//                 className="mr-2"
//               />
//               <label htmlFor={`team-${team}`} className="text-sm">{team}</label>
//             </div>
//           ))}
//         </PopoverContent>
//       </Popover>

//       {/* Status Filter */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" className="flex items-center gap-2">
//             Status
//             {selectedStatuses.length > 0 && (
//               <Badge variant="secondary" className="ml-1">
//                 {selectedStatuses.length}
//               </Badge>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-56 p-2">
//           {availableStatuses.map(status => (
//             <div key={status} className="flex items-center mb-2">
//               <input
//                 type="checkbox"
//                 id={`status-${status}`}
//                 checked={selectedStatuses.includes(status)}
//                 onChange={() => handleStatusToggle(status)}
//                 className="mr-2"
//               />
//               <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
//             </div>
//           ))}
//         </PopoverContent>
//       </Popover>

//       {/* Date Filter */}
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button variant="outline" className="flex items-center gap-2">
//             <CalendarIcon className="h-4 w-4" />
//             {startDate && endDate ? (
//               <span>
//                 {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
//               </span>
//             ) : startDate ? (
//               <span>From {format(startDate, "MMM d")}</span>
//             ) : endDate ? (
//               <span>Until {format(endDate, "MMM d")}</span>
//             ) : (
//               "Date"
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-0" align="start">
//           <Calendar
//             mode="range"
//             selected={{
//               from: startDate as Date,
//               to: endDate as Date,
//             }}
//             onSelect={(range) => {
//               if (range) {
//                 if (range.from) {
//                   handleDateSelect(range as { from: Date; to?: Date });
//                 } else {
//                   onDateChange(undefined, undefined);
//                 }
//               } else {
//                 onDateChange(undefined, undefined);
//               }
//             }}
//             initialFocus
//             className="p-3 pointer-events-auto"
//           />
//         </PopoverContent>
//       </Popover>

//       {/* Clear Filters */}
//       {(selectedTeams.length > 0 || selectedStatuses.length > 0 || startDate || endDate) && (
//         <Button variant="ghost" onClick={onClearFilters} size="sm">
//           Clear Filters
//         </Button>
//       )}

//       {/* Filter Badges */}
//       <div className="flex flex-wrap gap-2">
//         {selectedTeams.map(team => (
//           <Badge key={team} variant="outline" className="text-xs">
//             {team}
//             <button 
//               onClick={() => handleTeamToggle(team)}
//               className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </Badge>
//         ))}
        
//         {selectedStatuses.map(status => (
//           <Badge key={status} variant="outline" className="text-xs">
//             {status}
//             <button 
//               onClick={() => handleStatusToggle(status)}
//               className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </Badge>
//         ))}
        
//         {(startDate || endDate) && (
//           <Badge variant="outline" className="text-xs">
//             {startDate && endDate ? (
//               <span>
//                 {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
//               </span>
//             ) : startDate ? (
//               <span>From {format(startDate, "MMM d")}</span>
//             ) : endDate && (
//               <span>Until {format(endDate, "MMM d")}</span>
//             )}
//             <button 
//               onClick={() => onDateChange(undefined, undefined)}
//               className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
//             >
//               ×
//             </button>
//           </Badge>
//         )}
//       </div>
//     </div>
//   );
// };



import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface FilterContainerProps {
  selectedTeams: string[];
  selectedStatuses: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  availableTeams: string[];
  availableStatuses: string[];
  onTeamSelect: (teams: string[]) => void;
  onStatusSelect: (statuses: string[]) => void;
  onDateChange: (start: Date | undefined, end: Date | undefined) => void;
  onClearFilters: () => void;
}

export const FilterContainer: React.FC<FilterContainerProps> = ({
  selectedTeams,
  selectedStatuses,
  startDate,
  endDate,
  availableTeams,
  availableStatuses,
  onTeamSelect,
  onStatusSelect,
  onDateChange,
  onClearFilters,
}) => {
  const handleTeamToggle = (team: string) => {
    const updatedTeams = selectedTeams.includes(team)
      ? selectedTeams.filter(t => t !== team)
      : [...selectedTeams, team];
    onTeamSelect(updatedTeams);
  };

  const handleStatusToggle = (status: string) => {
    const updatedStatuses = selectedStatuses.includes(status)
      ? selectedStatuses.filter(s => s !== status)
      : [...selectedStatuses, status];
    onStatusSelect(updatedStatuses);
  };

  const handleDateSelect = (range: { from: Date; to?: Date }) => {
    onDateChange(range.from, range.to);
  };
  
  // Set today's date as default on first render
  useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date();
      onDateChange(today, undefined);
    }
  }, []);

  // Special handling for "today" date selection
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear();
  };

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Team Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Team
            {selectedTeams.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedTeams.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          {availableTeams.map(team => (
            <div key={team} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`team-${team}`}
                checked={selectedTeams.includes(team)}
                onChange={() => handleTeamToggle(team)}
                className="mr-2"
              />
              <label htmlFor={`team-${team}`} className="text-sm">{team}</label>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* Status Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            Status
            {selectedStatuses.length > 0 && (
              <Badge variant="secondary" className="ml-1">
                {selectedStatuses.length}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          {availableStatuses.map(status => (
            <div key={status} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`status-${status}`}
                checked={selectedStatuses.includes(status)}
                onChange={() => handleStatusToggle(status)}
                className="mr-2"
              />
              <label htmlFor={`status-${status}`} className="text-sm">{status}</label>
            </div>
          ))}
        </PopoverContent>
      </Popover>

      {/* Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            {startDate ? (
              isToday(startDate) && !endDate ? (
                <span>Today's Tasks</span>
              ) : endDate ? (
                <span>
                  {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
                </span>
              ) : (
                <span>From {format(startDate, "MMM d")}</span>
              )
            ) : endDate ? (
              <span>Until {format(endDate, "MMM d")}</span>
            ) : (
              "Date"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={{
              from: startDate as Date,
              to: endDate as Date,
            }}
            onSelect={(range) => {
              if (range) {
                if (range.from) {
                  handleDateSelect(range as { from: Date; to?: Date });
                } else {
                  onDateChange(undefined, undefined);
                }
              } else {
                onDateChange(undefined, undefined);
              }
            }}
            initialFocus
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>

      {/* Clear Filters */}
      {(selectedTeams.length > 0 || selectedStatuses.length > 0 || startDate || endDate) && (
        <Button variant="ghost" onClick={onClearFilters} size="sm">
          Clear Filters
        </Button>
      )}

      {/* Filter Badges */}
      <div className="flex flex-wrap gap-2">
        {selectedTeams.map(team => (
          <Badge key={team} variant="outline" className="text-xs">
            {team}
            <button 
              onClick={() => handleTeamToggle(team)}
              className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {selectedStatuses.map(status => (
          <Badge key={status} variant="outline" className="text-xs">
            {status}
            <button 
              onClick={() => handleStatusToggle(status)}
              className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
            >
              ×
            </button>
          </Badge>
        ))}
        
        {(startDate || endDate) && (
          <Badge variant="outline" className="text-xs">
            {startDate && isToday(startDate) && !endDate ? (
              <span>Today's Tasks</span>
            ) : startDate && endDate ? (
              <span>
                {format(startDate, "MMM d")} - {format(endDate, "MMM d")}
              </span>
            ) : startDate ? (
              <span>From {format(startDate, "MMM d")}</span>
            ) : endDate && (
              <span>Until {format(endDate, "MMM d")}</span>
            )}
            <button 
              onClick={() => onDateChange(undefined, undefined)}
              className="ml-1 rounded-full hover:bg-gray-200 h-4 w-4 flex items-center justify-center"
            >
              ×
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};