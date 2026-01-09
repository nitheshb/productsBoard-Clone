'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import { supabase } from '@/lib/supabaseClient';
import { ChevronLeftIcon, ChevronRightIcon, CalendarIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import React from 'react';
import FeatureDetailsPage from '@/app/(main)/(pages)/productTable/_components/featureDetails';

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
  pb_components?: {
    id: string;
    name: string;
    product_id: string;
    pb_products?: {
      id: string;
      name: string;
    };
  };
}

interface Product {
  id: string;
  name: string;
}

export default function CalendarPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleDays, setVisibleDays] = useState<number[]>([1, 2, 3, 4, 5]); // Default to weekdays

  // Product filter state
  const [selectedProductId, setSelectedProductId] = useState<string>('all');
  const [availableProducts, setAvailableProducts] = useState<Array<{id: string, name: string}>>([]);

  interface Product {
    id: string;
    name: string;
  }

  // Modal state
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<string>('');

  // Fetch available products
  const fetchProducts = async () => {
    try {
      const { data: productsData, error } = await supabase
        .from('pb_products')
        .select('id, name')
        .order('name');

      if (error) throw error;

      setAvailableProducts(productsData || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Add timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 10 second timeout
      
      try {
        // Fetch actual team names from the database
        const { data: teamData, error: teamError } = await supabase
          .from('pb_features')
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
        const { data: allTaskData, error: fetchError } = await supabase
          .from('pb_features')
          .select(`
            id, name, description, team, startdate, targetdate, status, created_at,
            pb_components!inner (
              id,
              name,
              product_id,
              pb_products!inner (
                id,
                name
              )
            )
          `)
          .not('team', 'is', null);

        if (fetchError) throw fetchError;

        // Apply product filter in JavaScript if a specific product is selected
        let filteredTaskData = allTaskData;
        if (selectedProductId !== 'all') {
          filteredTaskData = allTaskData?.filter(task =>
            (task.pb_components as any)?.product_id === selectedProductId
          ) || [];
        }

        // Format tasks from database
        const formattedTasks: Task[] = filteredTaskData && filteredTaskData.length > 0
          ? filteredTaskData
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
                created_at: task.created_at || new Date().toISOString(),
                pb_components: task.pb_components
              } as unknown as Task))
          : [];

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
  }, [selectedProductId]);

  if (isLoading) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading calendar...</p>
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
                <p className="text-gray-500">Create some features with team assignments to see the calendar.</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Handle task click to open feature details
  const handleTaskClick = (taskId: string) => {
    setSelectedFeatureId(taskId);
    setIsFeatureDetailOpen(true);
  };

  // Handle feature update
  const handleFeatureUpdated = () => {
    // Refresh the tasks data
    // This will trigger a re-fetch of tasks in the useEffect
    window.location.reload();
  };

  // Handle feature deletion
  const handleFeatureDeleted = () => {
    setIsFeatureDetailOpen(false);
    setSelectedFeatureId('');
    // Refresh the tasks data
    window.location.reload();
  };

  // Handle close feature details
  const handleCloseFeatureDetails = () => {
    setIsFeatureDetailOpen(false);
    setSelectedFeatureId('');
  };

  // Helper functions from EmployeeBoard
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

  // Filter team members based on search query and selected product
  const filteredTeamMembers = teamMembers.filter(member => {
    // First check search query
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase());

    // If a specific product is selected, check if this team member has tasks for that product
    if (selectedProductId !== 'all') {
      const hasTasksForProduct = tasks.some(task =>
        task.team === member.team && (task.pb_components as any)?.product_id === selectedProductId
      );
      return matchesSearch && hasTasksForProduct;
    }

    return matchesSearch;
  });

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

  // Calculate statistics for a specific date
  const getDayStats = (date: Date) => {
    const dayTasks = tasks.filter(task => {
      if (!task.startDate || !task.targetDate) return false;

      const taskStartDate = new Date(task.startDate);
      const taskEndDate = new Date(task.targetDate);

      if (isNaN(taskStartDate.getTime()) || isNaN(taskEndDate.getTime())) return false;

      const currentDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const startDate = new Date(taskStartDate.getFullYear(), taskStartDate.getMonth(), taskStartDate.getDate());
      const endDate = new Date(taskEndDate.getFullYear(), taskEndDate.getMonth(), taskEndDate.getDate());

      return currentDate >= startDate && currentDate <= endDate;
    });

    const total = dayTasks.length;
    const completed = dayTasks.filter(task => task.status === 'Completed').length;
    const inProgress = dayTasks.filter(task => task.status === 'In Progress').length;
    const notStarted = dayTasks.filter(task => task.status === 'Todo').length;

    const progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      notStarted,
      progressPercentage
    };
  };

  // Progress color function for day stats (same as circular progress bars)
  const getProgressColor = (progress: number): string => {
    if (progress === 100) return '#059669'; // Emerald-600: Complete success (green)
    if (progress >= 76) return '#2563eb'; // Blue-600: Almost there (76-99%)
    if (progress >= 51) return '#7c3aed'; // Violet-600: Good progress (51-75%)
    if (progress >= 26) return '#d97706'; // Amber-600: Moderate progress (26-50%)
    return '#dc2626'; // Red-600: Needs attention (0-25%)
  };

  const weekDates = getWeekDates(currentWeek);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  return (
    <>
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
        <main className="flex-1 bg-white">
          <div className="max-w-8xl mx-auto h-full flex flex-col">
          {/* Header */}
            <header className="flex justify-between items-center p-4 bg-white border-b flex-shrink-0">
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

              {/* Product Filter Dropdown */}
              <div className="flex items-center gap-4 mr-8">
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                >
                  <option value="all">All Products</option>
                  {availableProducts.map((product: Product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
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

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-auto">
          <div className="p-4">
            {/* Calendar Grid */}
                <div className="w-full">
              <div className={`grid gap-1 min-w-[800px]`} style={{ gridTemplateColumns: `200px repeat(${visibleDays.length}, 1fr)` }}>
                    {/* Header row - Sticky */}
                    <div className="p-2 font-semibold text-gray-700 bg-white sticky top-0 z-10 border-b-2 border-gray-200 min-w-[200px] flex items-center justify-center">Team Members</div>
                {weekDates.map((date, index) => {
                  const dayOfWeek = date.getDay();
                  if (!visibleDays.includes(dayOfWeek)) return null;
                  
                  const dayStats = getDayStats(date);
                  
                  return (
                    <div key={index} className="p-2 border-b border-r border-gray-200 bg-white sticky top-0 z-10 min-w-[200px] flex flex-col items-center">
                      {/* Date */}
                      <div className="text-center mb-1">
                      <div className="text-xs font-medium text-gray-500">
                        {date.toLocaleDateString('en', { weekday: 'short' }).toUpperCase()}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {date.getDate()}
                        </div>
                      </div>

                      {/* Statistics in horizontal layout */}
                      <div className="flex items-center justify-center gap-1 text-[13px] mb-1 flex-wrap">
                        <span className="text-green-600 font-semibold">✓{dayStats.completed}</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-blue-600 font-semibold">⟳{dayStats.inProgress}</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-500 font-semibold">○{dayStats.notStarted}</span>
                        <span className="text-gray-400">-</span>
                        <span className="text-gray-900 font-bold">Σ{dayStats.total}</span>
                      </div>

                      {/* Circular Progress Bar - Same as products page */}
                      <div className="flex justify-center">
                        <div className="relative w-8 h-8">
                          <svg className="w-8 h-8 transform -rotate-90 overflow-visible" viewBox="0 0 50 50">
                            <circle
                              cx="25"
                              cy="25"
                              r="18"
                              fill="none"
                              stroke="#e5e7eb"
                              strokeWidth="10"
                            />
                            <circle
                              cx="25"
                              cy="25"
                              r="18"
                              fill="none"
                              stroke={getProgressColor(dayStats.progressPercentage)}
                              strokeWidth="10"
                              strokeDasharray={`${(dayStats.progressPercentage / 100) * 113.04}, 113.04`}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
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
                                  className={`p-2 rounded border text-xs cursor-pointer hover:opacity-80 transition-opacity ${getTaskColor(task.status)} relative`}
                                  onClick={() => handleTaskClick(task.id)}
                              >
                                {/* Product Label */}
                                {task.pb_components?.pb_products?.name && (
                                  <div className="absolute -top-2 left-2 bg-blue-600 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full border border-white shadow-sm">
                                    {task.pb_components.pb_products.name}
                                  </div>
                                )}

                                {/* Task Content */}
                                <div className="mt-3">
                                <div className="font-medium">{task.name}</div>
                                <div className="text-xs opacity-75">{task.description}</div>
                                {task.status === 'Overdue' && (
                                  <div className="text-red-500 text-xs">⚠️</div>
                                )}
                                </div>
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
          </div>
        </main>
      </div>

      {selectedFeatureId && (
        <FeatureDetailsPage
          featureId={selectedFeatureId}
          isOpen={isFeatureDetailOpen}
          onClose={handleCloseFeatureDetails}
          onFeatureUpdated={handleFeatureUpdated}
          onFeatureDeleted={handleFeatureDeleted}
        />
      )}
    </>
  );
}
