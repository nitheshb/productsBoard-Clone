// components/CreateFeatureModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TeamFilter } from "@/components/filters/TeamFilter";
import React from "react"; // Added missing import
import { toast } from "sonner";
import { Loader2, Plus, Target, Users, ChevronDown, Code, TestTube } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { MultiTaskItem, TaskType } from "@/app/types";
import { fetchExistingTeamMembers } from '@/utils/teamUtils';

interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentId: string | null;
  onFeatureCreated: (feature: any, componentId: string) => void;
  featureId?: string | null; // <-- new prop for update
}

function FeatureTab({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${
        isActive
          ? "border-b-2 border-[#2693ff] text-[#2693ff]"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

// Task categories and their associated task types
  const TASK_TYPES = [
    { id: 'development', name: 'Development', color: '#3B82F6' },
    { id: 'testing', name: 'Testing', color: '#10B981' }
  ];

  const SUB_TASK_TYPES = {
    development: [
      { id: 'ui', name: 'UI', color: '#3B82F6' },
      { id: 'ux', name: 'UX', color: '#8B5CF6' },
      { id: 'integration', name: 'Integration', color: '#06B6D4' },
    ],
    testing: [
      { id: 'unit-testing', name: 'Unit Testing', color: '#10B981' },
      { id: 'integration-testing', name: 'Integration Testing', color: '#059669' },
      { id: 'e2e-testing', name: 'E2E Testing', color: '#047857' },
    ]
  };

export function CreateFeatureModal({
  isOpen,
  onClose,
  componentId,
  onFeatureCreated,
  featureId = null,
}: CreateFeatureModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    status: "Todo",
    progress: 0,
    team: "",
    days: null,
    startdate: null,
    targetdate: null,
    completedon: null,
    remarks: "",
    description: "",
    version: "1.0.0",
  });
  const [activeTab, setActiveTab] = useState("multi-task");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [savedData, setSavedData] = useState<any>(null);
  
  // Multi-task state (only for the new tab)
  const [selectedTaskType, setSelectedTaskType] = useState<string>('');
  const [selectedSubTaskTypes, setSelectedSubTaskTypes] = useState<string[]>([]);
  const [taskItems, setTaskItems] = useState<MultiTaskItem[]>([]);
  const [availableTeams, setAvailableTeams] = useState<string[]>([]);
  const [selectedTeamForTask, setSelectedTeamForTask] = useState<{[key: string]: string}>({});

  // Fetch available teams
  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const teamMembers = await fetchExistingTeamMembers();
        setAvailableTeams(teamMembers.map(member => member.name));
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };
    
    if (isOpen) {
      fetchTeams();
    }
  }, [isOpen]);

  // Reset sub task types when main task type changes
  React.useEffect(() => {
    if (activeTab === "multi-task") {
      setSelectedSubTaskTypes([]);
      setTaskItems([]);
    }
  }, [selectedTaskType, activeTab]);

  // Initialize task items when sub task types are selected (only for multi-task tab)
  React.useEffect(() => {
    if (activeTab === "multi-task" && selectedSubTaskTypes.length > 0) {
      const newTaskItems = selectedSubTaskTypes.map(subTaskType => ({
        task_type: subTaskType,
        name: '',
        status: 'Todo',
        progress: 0,
        team: '',
        days: null,
        startdate: null,
        targetdate: null,
        completedon: null,
        remarks: '',
        description: '',
        version: '1.0.0',
      }));
      setTaskItems(newTaskItems);
    } else {
      setTaskItems([]);
    }
  }, [selectedSubTaskTypes, activeTab]);

  // Reset form when modal is closed and reopened
  React.useEffect(() => {
    if (isOpen) {
      // Reset all form states when modal opens
      setFormData({
        name: "",
        status: "Todo",
        progress: 0,
        team: "",
        days: null,
        startdate: null,
        targetdate: null,
        completedon: null,
        remarks: "",
        description: "",
        version: "1.0.0",
      });
      setActiveTab("multi-task");
      setIsCollapsed(false);
      setSavedData(null);
      setSelectedTaskType('');
      setSelectedSubTaskTypes([]);
      setTaskItems([]);
      setSelectedTeamForTask({});
    }
  }, [isOpen]);

  // Fetch feature data if editing (ORIGINAL FUNCTIONALITY - UNCHANGED)
  React.useEffect(() => {
    if (featureId && isOpen) {
      setLoading(true);
      fetch(`/api/features/${featureId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            status: data.status || "Todo",
            progress: data.progress || 0,
            team: data.team || "",
            days: data.days ?? null,
            startdate: data.startdate || null,
            targetdate: data.targetdate || null,
            completedon: data.completedon || null,
            remarks: data.remarks || "",
            description: data.description || "",
            version: data.version || "1.0.0",
          });
        })
        .finally(() => setLoading(false));
    }
  }, [featureId, isOpen]);

  // ORIGINAL handleChange function - UNCHANGED
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedData = {
        ...prev,
        [name]: value === "" ? null : value,
      };
      
      // Automatically update status based on progress
      if (name === 'progress') {
        const progressValue = parseInt(value) || 0;
        let newStatus = prev.status;
        
        if (progressValue === 0) {
          newStatus = 'Todo';
        } else if (progressValue === 100) {
          newStatus = 'Completed';
        } else if (progressValue > 0 && progressValue < 100) {
          newStatus = 'In Progress';
        }
        
        updatedData.status = newStatus;
      }
      
      return updatedData;
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateMore = () => {
    setIsCollapsed(false);
    setSavedData(null);
    setFormData({
      name: "",
      status: "Todo",
      progress: 0,
      team: "",
      days: null,
      startdate: null,
      targetdate: null,
      completedon: null,
      remarks: "",
      description: "",
      version: "1.0.0",
    });
    setSelectedTaskType('');
    setSelectedSubTaskTypes([]);
    setTaskItems([]);
    setSelectedTeamForTask({});
  };

  // Reset form when modal is closed
  const handleClose = () => {
    // Reset all form states when modal closes
    setFormData({
      name: "",
      status: "Todo",
      progress: 0,
      team: "",
      days: null,
      startdate: null,
      targetdate: null,
      completedon: null,
      remarks: "",
      description: "",
      version: "1.0.0",
    });
    setActiveTab("multi-task");
    setIsCollapsed(false);
    setSavedData(null);
    setSelectedTaskType('');
    setSelectedSubTaskTypes([]);
    setTaskItems([]);
    setSelectedTeamForTask({});
    onClose();
  };

  // Multi-task handlers (only for the new tab)

  const updateTaskItem = (taskType: string, field: keyof MultiTaskItem, value: any) => {
    setTaskItems(prev => 
      prev.map(item => 
        item.task_type === taskType 
          ? { ...item, [field]: value }
          : item
      )
    );
  };


  // Calculate progress based on status (ORIGINAL FUNCTIONALITY - UNCHANGED)
  const calculateProgressFromStatus = (status: string): number => {
    switch (status) {
      case "Completed":
        return 100;
      case "In Progress":
        return 50;
      case "Todo":
      default:
        return 0;
    }
  };

  // Replace with simple status change (ORIGINAL FUNCTIONALITY - UNCHANGED)
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setFormData(prev => ({
      ...prev,
      status: newStatus
      // Don't automatically update progress
    }));
  };

  // ORIGINAL handleSubmit function - MODIFIED to handle both single and multi-task
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    
    if (!componentId && !featureId) {
      toast.error("Component ID is null, cannot create feature.");
      setIsCreating(false);
      return;
    }

    try {
      if (activeTab === "multi-task") {
        // Handle multi-task creation (NEW FUNCTIONALITY)
        if (taskItems.length === 0) {
          toast.error("Please select at least one task type.");
          setIsCreating(false);
          return;
        }

        // Check if all tasks have names
        const tasksWithoutNames = taskItems.filter(task => !task.name.trim());
        if (tasksWithoutNames.length > 0) {
          toast.error("Please enter names for all tasks.");
          setIsCreating(false);
          return;
        }

        const createdTasks = [];
        
        // Create each task individually
        for (const taskItem of taskItems) {
          const response = await fetch('/api/features', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ...taskItem,
              component_id: componentId,
              updateComponentProgress: true
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to create ${taskItem.task_type} task: ${errorText}`);
          }

          const createdTask = await response.json();
          createdTasks.push(createdTask);
        }

        // Call onFeatureCreated for each created task
        createdTasks.forEach(task => {
          onFeatureCreated(task, componentId!);
        });

        toast.success(`Successfully created ${createdTasks.length} tasks!`);
        setSavedData({ tasks: createdTasks, type: 'multi-task' });
        setIsCollapsed(true);
        resetForm();
      } else {
        // ORIGINAL single feature creation/update logic - UNCHANGED
      let feature;
      if (featureId) {
        // Update
        const response = await fetch(`/api/features/${featureId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...formData, updateComponentProgress: true }),
        });
        if (!response.ok) throw new Error('Failed to update feature');
        feature = await response.json();
        toast.success("Feature updated successfully!");
      } else {
        // Create
        const response = await fetch('/api/features', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            component_id: componentId,
            updateComponentProgress: true
          }),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to create feature: ${errorText}`);
        }
        feature = await response.json();
        toast.success("Feature created successfully!");
      }
      onFeatureCreated(feature, componentId!);
        setSavedData({ feature, type: 'single' });
        setIsCollapsed(true);
        resetForm();
      }
    } catch (error) {
      toast.error("Error creating/updating feature: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreating(false);
    }
  };

  const resetForm = () => {
      setFormData({
        name: "",
        status: "Todo",
        progress: 0,
        team: "",
        days: null,
        startdate: null,
        targetdate: null,
        completedon: null,
        remarks: "",
        description: "",
        version: "1.0.0",
      });
    // Reset multi-task state
    setSelectedTaskType('');
    setSelectedSubTaskTypes([]);
    setTaskItems([]);
    // Reset collapse state
    setIsCollapsed(false);
    setSavedData(null);
  };

  // ORIGINAL renderDetailsTab function - UNCHANGED
  const renderDetailsTab = () => (
    <div className="mt-4 mr-2 space-y-3">
      {/* Feature Name */}
      <div className="flex items-center">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Feature Name</span>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Status dropdown - positioned at the top */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Status</span>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleStatusChange}
          className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {/* Progress field (automatically calculated based on status) */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Progress</span>
        <Input
          id="progress"
          name="progress"
          type="number"
          min={0}
          max={100}
          value={formData.progress}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="0-100"
        />
      </div>
      

      {/* Team */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Team</span>
        <TeamFilter
          selectedTeams={formData.team ? [formData.team] : []}
          availableTeams={availableTeams}
          onTeamSelect={(teams) => setFormData(prev => ({ ...prev, team: teams[0] || "" }))}
        />
      </div>

      {/* Days */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Days</span>
        <Input
          type="number"
          id="days"
          name="days"
          value={formData.days === null ? "" : formData.days}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="Estimated days"
        />
      </div>

      {/* Start Date */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Start Date</span>
        <Input
          type="date"
          id="startdate"
          name="startdate"
          value={formData.startdate === null ? "" : formData.startdate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Target Date */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Target Date</span>
        <Input
          type="date"
          id="targetdate"
          name="targetdate"
          value={formData.targetdate === null ? "" : formData.targetdate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Completed On */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Completed On</span>
        <Input
          type="date"
          id="completedon"
          name="completedon"
          value={formData.completedon === null ? "" : formData.completedon}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Remarks */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Remarks</span>
        <Input
          id="remarks"
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="Add remarks"
        />
      </div>

      {/* Version */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Version</span>
        <Input
          id="version"
          name="version"
          value={formData.version}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="e.g., 1.0.0"
        />
      </div>

      {/* Description */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Description</span>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:outline-none"
          placeholder="Enter feature description"
        />
      </div>
    </div>
  );

  // NEW Multi-task tab content
  const renderMultiTaskTab = () => (
    <div className="mt-4 mr-2 space-y-6 animate-in fade-in-0 slide-in-from-left-4 duration-300">
      {/* Task Type and Sub Task Type Selection */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Task Type Dropdown */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Task Type</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between h-9">
                  {selectedTaskType ? TASK_TYPES.find(t => t.id === selectedTaskType)?.name : "Select task type..."}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white" align="start">
                <DropdownMenuLabel>Select Task Type</DropdownMenuLabel>
                {TASK_TYPES.map((taskType) => (
                  <DropdownMenuItem
                    key={taskType.id}
                    onClick={() => {
                      setSelectedTaskType(taskType.id);
                      setSelectedSubTaskTypes([]);
                      setTaskItems([]);
                    }}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: taskType.color }}
                    />
                    {taskType.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Sub Task Type Dropdown */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Sub Task Type</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between h-9"
                  disabled={!selectedTaskType}
                >
                  Add sub task type...
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)] bg-white" align="start">
                <DropdownMenuLabel>Select Sub Task Type</DropdownMenuLabel>
                {selectedTaskType && SUB_TASK_TYPES[selectedTaskType as keyof typeof SUB_TASK_TYPES]?.map((subTaskType) => (
                  <DropdownMenuItem
                    key={subTaskType.id}
                    onClick={() => {
                      if (!selectedSubTaskTypes.includes(subTaskType.id)) {
                        setSelectedSubTaskTypes(prev => [...prev, subTaskType.id]);
                      }
                    }}
                    disabled={selectedSubTaskTypes.includes(subTaskType.id)}
                    className="flex items-center gap-2"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: subTaskType.color }}
                    />
                    {subTaskType.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        {/* Selected Sub Task Types */}
        {selectedSubTaskTypes.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Selected Sub Task Types</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSubTaskTypes.map((subTaskTypeId) => {
                const subTaskType = selectedTaskType && SUB_TASK_TYPES[selectedTaskType as keyof typeof SUB_TASK_TYPES]?.find((t: any) => t.id === subTaskTypeId);
                return (
                  <div
                    key={subTaskTypeId}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-100 border border-blue-200 rounded-md text-sm"
                  >
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: (subTaskType as any)?.color || '#3B82F6' }}
                    />
                    <span>{(subTaskType as any)?.name || subTaskTypeId}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedSubTaskTypes(prev => prev.filter(id => id !== subTaskTypeId))}
                      className="text-blue-600 hover:text-blue-800 ml-1"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Task Configuration Table */}
      {taskItems.length > 0 && (
        <div className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
          <h3 className="text-sm font-medium text-gray-700">Configure Tasks</h3>
          
          <div className="overflow-x-auto border border-gray-200 rounded-md scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <table className="w-full border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Task Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32 min-w-[128px] max-w-[128px]">Team</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Target Date</th>
                </tr>
              </thead>
              <tbody>
                {taskItems.map((taskItem, index) => {
                  const subTaskTypeInfo = selectedTaskType && SUB_TASK_TYPES[selectedTaskType as keyof typeof SUB_TASK_TYPES]?.find((t: any) => t.id === taskItem.task_type);
                  const taskColor = subTaskTypeInfo ? (subTaskTypeInfo as any).color : '#3B82F6';
                  const taskName = subTaskTypeInfo ? (subTaskTypeInfo as any).name : taskItem.task_type;
                  return (
                    <tr key={taskItem.task_type} className="border-b border-gray-100">
                      <td className="px-4 py-3 w-24">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: taskColor }}
                          />
                          <span className="text-sm font-medium text-gray-900">{taskName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 w-64">
                        <Input
                          value={taskItem.name}
                          onChange={(e) => updateTaskItem(taskItem.task_type, 'name', e.target.value)}
                          className="w-full h-9 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter task name"
                          required
                        />
                      </td>
                      <td className="px-4 py-3 w-32 min-w-[128px] max-w-[128px]">
                        <div className="w-full">
                          <TeamFilter
                            selectedTeams={selectedTeamForTask[taskItem.task_type] ? [selectedTeamForTask[taskItem.task_type]] : []}
                            availableTeams={availableTeams}
                            onTeamSelect={(teams) => {
                              const team = teams[0] || '';
                              setSelectedTeamForTask(prev => ({
                                ...prev,
                                [taskItem.task_type]: team
                              }));
                              updateTaskItem(taskItem.task_type, 'team', team || null);
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3 w-28">
                        <Input
                          type="number"
                          value={taskItem.days || ''}
                          onChange={(e) => updateTaskItem(taskItem.task_type, 'days', e.target.value ? parseInt(e.target.value) : null)}
                          className="w-full h-9 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Days"
                        />
                      </td>
                      <td className="px-4 py-3 w-40">
                        <Input
                          type="date"
                          value={taskItem.startdate || ''}
                          onChange={(e) => updateTaskItem(taskItem.task_type, 'startdate', e.target.value || null)}
                          className="w-full h-9 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                      <td className="px-4 py-3 w-40">
                        <Input
                          type="date"
                          value={taskItem.targetdate || ''}
                          onChange={(e) => updateTaskItem(taskItem.task_type, 'targetdate', e.target.value || null)}
                          className="w-full h-9 text-sm border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );

  // ORIGINAL renderInsightsTab function - UNCHANGED
  const renderInsightsTab = () => (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img 
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
        src="/api/placeholder/230/172" 
        alt="No insights yet"
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px] font-bold">No direct insights just yet</h3>
        <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
          Find relevant insights with search, or start adding insights manually
        </span>
      </section>
    </section>
  );

  // ORIGINAL renderPortalTab function - UNCHANGED
  const renderPortalTab = () => (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img 
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]" 
        src="/api/placeholder/230/172" 
        alt="Portal features" 
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px] font-bold">Validate this idea</h3>
        <span className="text-[#939da7] text-[12px] font-semibold mt-[4px]">
          Collect votes and feedback by adding this idea to your portal
        </span>
      </section>
    </section>
  );

  return (
    <Sheet open={isOpen} onOpenChange={handleClose}>
      <SheetContent className="overflow-y-auto w-full mx-auto rounded-lg shadow-lg scroll-smooth scrollbar-hide max-w-4xl animate-in slide-in-from-right-5 duration-300">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex flex-col justify-between w-full">
              <SheetTitle className="text-lg font-semibold text-[#202428] mt-2">
                {featureId ? 'Edit Feature' : 'Create New Feature'}
              </SheetTitle>
            </div>

            {/* Tab Navigation */}
            <div className="mt-[16px] border-b w-full">
              <FeatureTab
                label="Details"
                isActive={activeTab === "multi-task"}
                onClick={() => handleTabChange("multi-task")}
              />
              <FeatureTab
                label="Insights"
                isActive={activeTab === "insights"}
                onClick={() => handleTabChange("insights")}
              />
              <FeatureTab
                label="Portal"
                isActive={activeTab === "portal"}
                onClick={() => handleTabChange("portal")}
              />
            </div>
          </SheetHeader>

          {/* Collapsed View */}
          {isCollapsed && savedData && (
            <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide p-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <h3 className="text-lg font-semibold text-green-800">
                      {savedData.type === 'multi-task' ? 'Tasks Created Successfully!' : 'Feature Created Successfully!'}
                    </h3>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCreateMore}
                    className="text-green-700 border-green-300 hover:bg-green-100"
                  >
                    Create More
                  </Button>
                </div>
                
                {savedData.type === 'multi-task' ? (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700 mb-3">
                      Created {savedData.tasks.length} tasks:
                    </p>
                    <div className="space-y-1">
                      {savedData.tasks.map((task: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {task.task_type}
                          </span>
                          <span className="text-gray-700">{task.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm text-green-700">
                      Feature: <span className="font-medium">{savedData.feature.name}</span>
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Status: <span className="font-medium">{savedData.feature.status}</span></span>
                      <span>Team: <span className="font-medium">{savedData.feature.team || 'Not assigned'}</span></span>
                    </div>
                  </div>
                )}
                
                <div className="mt-4 pt-3 border-t border-green-200">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-green-600">
                      The {savedData.type === 'multi-task' ? 'tasks' : 'feature'} has been added to your board.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClose}
                      className="text-green-700 border-green-300 hover:bg-green-100"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab Content */}
          {!isCollapsed && (
          <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
              <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
                {activeTab === "multi-task" && renderMultiTaskTab()}
            {activeTab === "insights" && renderInsightsTab()}
            {activeTab === "portal" && renderPortalTab()}
          </div>
            </div>
          )}

          {/* Action Buttons - show on multi-task tab when not collapsed */}
          {!isCollapsed && activeTab === "multi-task" && (
            <SheetFooter className="flex justify-end gap-2 py-4 mt-4">
              <SheetClose asChild>
                
              </SheetClose>
              <div className="absolute bottom-0 right-0 p-2 flex justify-end gap-2 w-full border-t bg-white">
              <Button type="button" variant="outline" disabled={isCreating} onClick={onClose}>
                  Cancel
                </Button>
              <Button type="submit" disabled={isCreating || (activeTab === "multi-task" && taskItems.length === 0)} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating 
                  ? (featureId ? 'Updating...' : (activeTab === "multi-task" ? 'Creating Tasks...' : 'Creating...'))
                  : (featureId ? 'Update Feature' : (activeTab === "multi-task" ? `Create ${taskItems.length} Tasks` : 'Create Feature'))
                }
              </Button>
              </div>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}