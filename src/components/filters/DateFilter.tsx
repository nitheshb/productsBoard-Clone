
// // import React, { useEffect } from "react";
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@/components/ui/popover";
// // import { Button } from "@/components/ui/button";
// // import { Calendar } from "@/components/ui/calendar";
// // import { CalendarDays, ChevronDown } from "lucide-react";
// // import { format } from "date-fns";
// // import { cn } from "@/lib/utils";

// // interface DateFilterProps {
// //   startDate: Date | undefined;
// //   endDate: Date | undefined;
// //   onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
// // }

// // export function DateFilter({ startDate, endDate, onDateChange }: DateFilterProps) {
// //   const [date, setDate] = React.useState<{
// //     from: Date | undefined;
// //     to: Date | undefined;
// //   }>({
// //     from: startDate || new Date(), // Default to today
// //     to: endDate,
// //   });

// //   // Set today's date as default on first render
// //   useEffect(() => {
// //     if (!startDate && !endDate) {
// //       const today = new Date();
// //       setDate({ from: today, to: undefined });
// //       onDateChange(today, undefined);
// //     }
// //   }, []);

// //   // Update local state when props change
// //   useEffect(() => {
// //     if (startDate !== date.from || endDate !== date.to) {
// //       setDate({
// //         from: startDate,
// //         to: endDate,
// //       });
// //     }
// //   }, [startDate, endDate]);

// //   const handleSelect = (selectedDate: any) => {
// //     setDate(selectedDate);
// //     onDateChange(selectedDate.from, selectedDate.to);
// //   };

// //   return (
// //     <Popover>
// //       <PopoverTrigger asChild>
// //         <Button variant="outline" size="sm" className="h-8 gap-1 bg-black">
// //           <CalendarDays className="h-4 w-4 mr-1" />
// //           {date.from ? (
// //             date.to ? (
// //               <>
// //                 {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
// //               </>
// //             ) : (
// //               format(date.from, "MMM d, yyyy")
// //             )
// //           ) : (
// //             "Select date"
// //           )}
// //           <ChevronDown className="h-4 w-4 ml-1" />
// //         </Button>
// //       </PopoverTrigger>
// //       <PopoverContent align="start" className="w-auto p-0 bg-black">
// //         <Calendar
// //           mode="range"
// //           selected={date}
// //           onSelect={handleSelect}
// //           initialFocus
// //           className={cn("p-3 pointer-events-auto")}
// //         />
// //       </PopoverContent>
// //     </Popover>
// //   );
// // }



// import React, { useEffect } from "react";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { CalendarDays, ChevronDown } from "lucide-react";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";

// interface DateFilterProps {
//   startDate: Date | undefined;
//   endDate: Date | undefined;
//   onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
// }

// export function DateFilter({ startDate, endDate, onDateChange }: DateFilterProps) {
//   const [date, setDate] = React.useState<{
//     from: Date | undefined;
//     to: Date | undefined;
//   }>({
//     from: startDate || new Date(), // Default to today
//     to: endDate,
//   });

//   // Set today's date as default on first render
//   useEffect(() => {
//     if (!startDate && !endDate) {
//       const today = new Date();
//       setDate({ from: today, to: undefined });
//       onDateChange(today, undefined);
//     }
//   }, []);

//   // Update local state when props change
//   useEffect(() => {
//     if (startDate !== date.from || endDate !== date.to) {
//       setDate({
//         from: startDate,
//         to: endDate,
//       });
//     }
//   }, [startDate, endDate]);

//   const handleSelect = (selectedDate: any) => {
//     setDate(selectedDate);
//     onDateChange(selectedDate?.from, selectedDate?.to);
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild>
//         <Button variant="outline" size="sm" className="h-8 gap-1">
//           <CalendarDays className="h-4 w-4 mr-1" />
//           {date.from ? (
//             date.to ? (
//               <>
//                 {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
//               </>
//             ) : (
//               format(date.from, "MMM d, yyyy")
//             )
//           ) : (
//             "Select date"
//           )}
//           <ChevronDown className="h-4 w-4 ml-1" />
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent align="start" className="w-auto p-0">
//         <Calendar
//           mode="range"
//           selected={date}
//           onSelect={handleSelect}
//           initialFocus
//           className="p-3 pointer-events-auto"
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }



import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarDays, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateFilterProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onDateChange: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export function DateFilter({ startDate, endDate, onDateChange }: DateFilterProps) {
  const [date, setDate] = React.useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate || new Date(), // Default to today
    to: endDate,
  });

  // Set today's date as default on component mount
  useEffect(() => {
    if (!startDate && !endDate) {
      const today = new Date();
      setDate({ from: today, to: undefined });
      onDateChange(today, undefined);
    }
  }, []);

  // Update local state when props change
  useEffect(() => {
    if (startDate !== date.from || endDate !== date.to) {
      setDate({
        from: startDate,
        to: endDate,
      });
    }
  }, [startDate, endDate]);

  const handleSelect = (selectedDate: any) => {
    setDate(selectedDate);
    onDateChange(selectedDate.from, selectedDate.to);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 gap-1 bg-black">
          <CalendarDays className="h-4 w-4 mr-1" />
          {date.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM d")} - {format(date.to, "MMM d, yyyy")}
              </>
            ) : (
              format(date.from, "MMM d, yyyy")
            )
          ) : (
            "Select date"
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0 bg-black">
        <Calendar
          mode="range"
          selected={date}
          onSelect={handleSelect}
          initialFocus
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}