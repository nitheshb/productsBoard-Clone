'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import React from 'react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  initials: string;
  team: string;
}

interface Task {
  id: string;
  name: string;
  description: string;
  estimatedTime: string;
  status: string;
  startDate: string;
  targetDate: string;
  color: string;
  team: string;
  created_at: string;
}

interface EmployeeBoardProps {
  currentWeek: Date;
  setCurrentWeek: (date: Date) => void;
  teamMembers: TeamMember[];
  tasks: Task[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  visibleDays: number[];
  setVisibleDays: (days: number[]) => void;
}

const EmployeeBoard = ({ currentWeek, setCurrentWeek, teamMembers, tasks, searchQuery, setSearchQuery, visibleDays, setVisibleDays }: EmployeeBoardProps) => {
  const getWeekDates = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const formatDateRange = (start: Date, end: Date) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[start.getMonth()]} ${start.getDate()} - ${months[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  };

  const getTasksForMemberAndDate = (member: TeamMember, date: Date) => {
    return tasks.filter(task => {
      // Match tasks by team name
      if (task.team !== member.team) return false;
      
      // Only show tasks that have valid start and end dates
      if (!task.startDate || !task.targetDate) return false;
      
      // Check if the current date falls within the task's date range
      const taskStartDate = new Date(task.startDate);
      const taskEndDate = new Date(task.targetDate);
      
      // Validate that the dates are valid
      if (isNaN(taskStartDate.getTime()) || isNaN(taskEndDate.getTime())) return false;
      
      // Normalize dates to compare only date parts (ignore time)
      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startDate = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate());
      const endDate = new Date(taskEndDate.getFullYear(), taskEndDate.getMonth(), taskEndDate.getDate());
      
      // Check if current date is within the task's date range (inclusive)
      return currentDate >= startDate && currentDate <= endDate;
    }).sort((a, b) => a.name.localeCompare(b.name)); // Sort tasks alphabetically
  };

  // Filter team members based on search query
  const filteredTeamMembers = teamMembers.filter(member => 
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTaskColor = (status: string) => {
    const statusColorMap: { [key: string]: string } = {
      'Todo': 'bg-gray-100 border-gray-300 text-gray-700',
      'In Progress': 'bg-yellow-100 border-yellow-300 text-yellow-800',
      'Completed': 'bg-green-100 border-green-300 text-green-800',
      'Overdue': 'bg-red-100 border-red-300 text-red-800',
      'Blocked': 'bg-red-100 border-red-300 text-red-800',
      'Review': 'bg-blue-100 border-blue-300 text-blue-800',
      'Testing': 'bg-purple-100 border-purple-300 text-purple-800'
    };
    return statusColorMap[status] || 'bg-gray-100 border-gray-300 text-gray-700';
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-8xl mx-auto">
          {/* Header */}
          <header className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Dev Calendar</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search team members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Day Selection Dropdown */}
              <select
                value={visibleDays.join(',')}
                onChange={(e) => {
                  const selectedDays = e.target.value.split(',').map(Number);
                  setVisibleDays(selectedDays);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
              >
                <option value="1,2,3,4,5">Weekdays (Mon-Fri)</option>
                <option value="1,2,3,4,5,6">Mon-Sat</option>
                <option value="1,2,3,4,5,6,0">Full Week</option>
                <option value="1,2,3">Mon-Wed</option>
                <option value="4,5">Thu-Fri</option>
              </select>
              
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(newWeek.getDate() - 7);
                  setCurrentWeek(newWeek);
                }}
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <button 
                className="p-2 hover:bg-gray-100 rounded-lg"
                onClick={() => {
                  const newWeek = new Date(currentWeek);
                  newWeek.setDate(newWeek.getDate() + 7);
                  setCurrentWeek(newWeek);
                }}
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">
                {formatDateRange(weekStart, weekEnd)}
              </span>
            </div>
          </header>

          <div className="p-4">
            {/* Calendar Grid */}
            <div className="w-full overflow-x-auto">
              <div className={`grid gap-1 min-w-[800px]`} style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 1fr)` }}>
                {/* Header row */}
                <div className="p-2 font-semibold text-gray-700">Team Members</div>
                {weekDates.map((date, index) => {
                  const dayOfWeek = date.getDay();
                  if (!visibleDays.includes(dayOfWeek)) return null;
                  
                  return (
                    <div key={index} className="p-2 text-center border-b border-r border-gray-200">
                      <div className="text-xs font-medium text-gray-500">
                        {date.toLocaleDateString('en', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {date.getDate()}
                      </div>
                    </div>
                  );
                })}

                {/* Team member rows */}
                {filteredTeamMembers.map((member) => (
                  <React.Fragment key={member.id}>
                    {/* Member info column */}
                    <div className="p-2 border-r bg-gray-50 flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {member.initials}
                      </div>
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </div>

                    {/* Task columns for each day */}
                    {weekDates.map((date, dayIndex) => {
                      const dayOfWeek = date.getDay();
                      if (!visibleDays.includes(dayOfWeek)) return null;
                      
                      const dayTasks = getTasksForMemberAndDate(member, date);
                      return (
                        <div key={dayIndex} className="p-1 border-b border-r border-gray-200 min-h-[80px] bg-white">
                          <div className="space-y-1">
                            {dayTasks.map((task) => (
                              <div
                                key={task.id}
                                className={`p-2 rounded border text-xs ${getTaskColor(task.status)}`}
                              >
                                <div className="font-medium">{task.name}</div>
                                <div className="text-xs opacity-75">{task.description}</div>
                                {task.status === 'Overdue' && (
                                  <div className="text-red-500 text-xs">⚠️</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default function EmployeesPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleDays, setVisibleDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default to weekdays

  useEffect(() => {
    const fetchData = async () => {
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 10 second timeout
      
      try {
        // Fetch actual team names from the database
        const { data: teamData, error: teamError } = await supabase
          .from('features')
          .select('team')
          .not('team', 'is', null);

        if (teamError) throw teamError;

        // Get unique team names from database
        const uniqueTeams = [...new Set(teamData.map(item => item.team).filter(Boolean))];
        
        // Create team members from actual team names in database
        const teamMembers: TeamMember[] = uniqueTeams.map((team: string, index: number) => {
          const initials = team.split(' ').map((word: string) => word.charAt(0)).join('').toUpperCase();
          return {
            id: (index + 1).toString(),
            name: team,
            role: 'Developer',
            initials: initials,
            team: team
          };
        });

        // Sort team members alphabetically by name
        const sortedTeamMembers = teamMembers.sort((a, b) => a.name.localeCompare(b.name));
        setTeamMembers(sortedTeamMembers);

        // Fetch tasks from features table
        const { data: taskData, error: taskError } = await supabase
          .from('features')
          .select('id, name, description, team, startdate, targetdate, status, created_at')
          .not('team', 'is', null);

        if (taskError) throw taskError;

        // Format tasks from database
        // Create sample tasks with proper date ranges for demonstration
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfterTomorrow = new Date(today);
        dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
        const threeDaysFromNow = new Date(today);
        threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);
        
        const sampleTasks: Task[] = [
          {
            id: '1',
            name: 'User Authentication',
            description: 'Implement login and registration',
            estimatedTime: '4h',
            status: 'In Progress',
            startDate: today.toISOString(),
            targetDate: dayAfterTomorrow.toISOString(), // 3-day span
            color: 'yellow',
            team: uniqueTeams[0] || 'Sharuk',
            created_at: today.toISOString()
          },
          {
            id: '2',
            name: 'API Development',
            description: 'Create REST API endpoints',
            estimatedTime: '6h',
            status: 'Completed',
            startDate: tomorrow.toISOString(),
            targetDate: threeDaysFromNow.toISOString(), // 3-day span
            color: 'green',
            team: uniqueTeams[1] || 'Jignesh',
            created_at: today.toISOString()
          },
          {
            id: '3',
            name: 'Database Design',
            description: 'Design and implement database schema',
            estimatedTime: '3h',
            status: 'Todo',
            startDate: today.toISOString(),
            targetDate: tomorrow.toISOString(), // 2-day span
            color: 'gray',
            team: uniqueTeams[2] || 'Nithesh',
            created_at: today.toISOString()
          }
        ];

        const formattedTasks: Task[] = taskData.length > 0 ? taskData
          .filter(task => task.startdate && task.targetdate) // Only include tasks with both dates
          .map(task => ({
            id: task.id,
            name: task.name,
            description: task.description || '',
            estimatedTime: '4h', // Default estimated time
            status: task.status || 'Todo',
            startDate: task.startdate,
            targetDate: task.targetdate,
            color: 'blue', // Default color since it's not in database
            team: task.team,
            created_at: task.created_at || new Date().toISOString()
          })) : sampleTasks;

        // Sort tasks alphabetically by name
        const sortedTasks = formattedTasks.sort((a, b) => a.name.localeCompare(b.name));
        setTasks(sortedTasks);
        clearTimeout(timeoutId);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Set empty arrays on error to prevent infinite loading
        setTeamMembers([]);
        setTasks([]);
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
              <p className="mt-2 text-gray-600">Loading employee board...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="max-w-8xl mx-auto">
            <header className="flex justify-between items-center p-4 bg-white border-b">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-blue-500" />
                <h1 className="text-xl font-semibold">Dev Calendar</h1>
              </div>
            </header>
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 mb-2">No Team Members Found</h2>
                <p className="text-gray-500">Create some features with team assignments to see the employee board.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <EmployeeBoard 
      currentWeek={currentWeek}
      setCurrentWeek={setCurrentWeek}
      teamMembers={teamMembers}
      tasks={tasks}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      visibleDays={visibleDays}
      setVisibleDays={setVisibleDays}
    />
  );
}
