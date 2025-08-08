"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, MoreVertical, Loader2, Pencil, Flag, Gauge, Users, Timer, CalendarDays, StickyNote, Tag, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Feature } from "@/app/types"; // Assuming this type exists
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, parseISO } from "date-fns";
import { useToast } from "@/app/hooks/use-toast";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

// Enum for status
enum Status {
  TODO = "Todo",
  IN_PROGRESS = "In Progress",
  COMPLETED = "Completed",
}

interface FeatureDetailsPageProps {
  featureId: string;
  isOpen: boolean;
  onClose: () => void;
  onFeatureUpdated?: (updatedFeature: Feature) => void; // Add this prop
  onFeatureDeleted?: () => void;
}

function FeatureDetailsTab({
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
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-500"
          : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
    </button>
  );
}

// Format date properly for input type="date" (YYYY-MM-DD)
function formatDateForInput(dateString: string | undefined): string {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  } catch (error) {
    return "";
  }
}

// Format date for display in readable format
function formatDateForDisplay(dateString: string | undefined): string {
  if (!dateString) return "Not assigned";
  try {
    return format(parseISO(dateString), "dd MMM yyyy");
  } catch (error) {
    return "Invalid date";
  }
}

function DetailsTabContent({
  feature,
  draftFeature,
  editingField,
  setEditingField,
  editInputRef,
  handleFieldHover,
  handleInputChange,
  handleDateChange,
  handleInputBlur,
  handleInputKeyPress,
  onSave, // <-- new prop
  saving, // <-- new prop
  componentName,
}: {
  feature: Feature;
  draftFeature: Feature;
  editingField: keyof Feature | null;
  setEditingField: React.Dispatch<React.SetStateAction<keyof Feature | null>>;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof Feature) => void;
  handleInputChange: (field: keyof Feature, value: any) => void;
  handleDateChange: (field: keyof Feature, value: string) => void;
  handleInputBlur: (field: keyof Feature) => Promise<void>;
  handleInputKeyPress: (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Feature
  ) => Promise<void>;
  onSave: () => Promise<void>;
  saving: boolean;
  componentName?: string | null;
}) {
  const fieldIconFor = (key: string) => {
    const iconClass = "h-4 w-4 text-gray-500 shrink-0";
    switch (key.toLowerCase()) {
      case 'status':
        return <Flag className={iconClass} />;
      case 'progress':
        return <Gauge className={iconClass} />;
      case 'team':
        return <Users className={iconClass} />;
      case 'days':
        return <Timer className={iconClass} />;
      case 'startdate':
      case 'targetdate':
      case 'completedon':
        return <CalendarDays className={iconClass} />;
      case 'remarks':
        return <StickyNote className={iconClass} />;
      case 'version':
        return <Tag className={iconClass} />;
      default:
        return <Info className={iconClass} />;
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-4 w-full">
      {/* Status field */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('status')}
          <span>Status</span>
        </div>
        <div className="flex-1">
          {editingField === 'status' ? (
            <select
              ref={editInputRef as any}
              value={draftFeature.status || ''}
              onChange={e => handleInputChange('status', e.target.value)}
              onBlur={() => handleInputBlur('status')}
              onKeyDown={e => handleInputKeyPress(e as any, 'status')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm h-9"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('status')}>{draftFeature.status || feature.status || 'Not assigned'}</span>
          )}
        </div>
      </div>
      {/* Progress field */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('progress')}
          <span>Progress (%)</span>
        </div>
        <div className="flex-1">
          {editingField === 'progress' ? (
            <Input
              ref={editInputRef}
              type="number"
              min={0}
              max={100}
              value={draftFeature.progress === null || draftFeature.progress === undefined ? '' : draftFeature.progress}
              onChange={e => handleInputChange('progress', e.target.value)}
              onBlur={() => handleInputBlur('progress')}
              onKeyDown={e => handleInputKeyPress(e, 'progress')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('progress')}>{draftFeature.progress !== undefined && draftFeature.progress !== null ? draftFeature.progress : feature.progress !== undefined && feature.progress !== null ? feature.progress : 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Component (read-only name) */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('component_id')}
          <span>Component</span>
        </div>
        <div className="flex-1">
          <span className="block text-gray-800 min-h-[28px] text-sm">
            {componentName ?? (feature as any)?.component_id ?? 'Not assigned'}
          </span>
        </div>
      </div>

      {/* Team */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('team')}
          <span>Team</span>
        </div>
        <div className="flex-1">
          {editingField === 'team' ? (
            <Input
              ref={editInputRef}
              type="text"
              value={draftFeature?.team ?? ''}
              onChange={e => handleInputChange('team', e.target.value)}
              onBlur={() => handleInputBlur('team')}
              onKeyDown={e => handleInputKeyPress(e, 'team')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('team')}>{feature?.team ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Days */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('days')}
          <span>Days</span>
        </div>
        <div className="flex-1">
          {editingField === 'days' ? (
            <Input
              ref={editInputRef}
              type="number"
              value={draftFeature?.days ?? ''}
              onChange={e => handleInputChange('days', e.target.value)}
              onBlur={() => handleInputBlur('days')}
              onKeyDown={e => handleInputKeyPress(e, 'days')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('days')}>{feature?.days ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Start Date */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('startdate')}
          <span>Start Date</span>
        </div>
        <div className="flex-1">
          {editingField === 'startdate' ? (
            <Input
              ref={editInputRef}
              type="date"
              value={typeof draftFeature?.startdate === 'string' ? draftFeature.startdate.slice(0, 10) : draftFeature?.startdate ? String(draftFeature.startdate).slice(0, 10) : ''}
              onChange={e => handleInputChange('startdate', e.target.value)}
              onBlur={() => handleInputBlur('startdate')}
              onKeyDown={e => handleInputKeyPress(e, 'startdate')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('startdate')}>{feature?.startdate ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Target Date */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('targetdate')}
          <span>Target Date</span>
        </div>
        <div className="flex-1">
          {editingField === 'targetdate' ? (
            <Input
              ref={editInputRef}
              type="date"
              value={typeof draftFeature?.targetdate === 'string' ? draftFeature.targetdate.slice(0, 10) : draftFeature?.targetdate ? String(draftFeature.targetdate).slice(0, 10) : ''}
              onChange={e => handleInputChange('targetdate', e.target.value)}
              onBlur={() => handleInputBlur('targetdate')}
              onKeyDown={e => handleInputKeyPress(e, 'targetdate')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('targetdate')}>{feature?.targetdate ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Completed On */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('completedon')}
          <span>Completed On</span>
        </div>
        <div className="flex-1">
          {editingField === 'completedon' ? (
            <Input
              ref={editInputRef}
              type="date"
              value={typeof draftFeature?.completedon === 'string' ? draftFeature.completedon.slice(0, 10) : draftFeature?.completedon ? String(draftFeature.completedon).slice(0, 10) : ''}
              onChange={e => handleInputChange('completedon', e.target.value)}
              onBlur={() => handleInputBlur('completedon')}
              onKeyDown={e => handleInputKeyPress(e, 'completedon')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('completedon')}>{feature?.completedon ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Remarks */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('remarks')}
          <span>Remarks</span>
        </div>
        <div className="flex-1">
          {editingField === 'remarks' ? (
            <Input
              ref={editInputRef}
              type="text"
              value={draftFeature?.remarks ?? ''}
              onChange={e => handleInputChange('remarks', e.target.value)}
              onBlur={() => handleInputBlur('remarks')}
              onKeyDown={e => handleInputKeyPress(e, 'remarks')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('remarks')}>{feature?.remarks ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Version */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('version')}
          <span>Version</span>
        </div>
        <div className="flex-1">
          {editingField === 'version' ? (
            <Input
              ref={editInputRef}
              type="text"
              value={draftFeature?.version ?? ''}
              onChange={e => handleInputChange('version', e.target.value)}
              onBlur={() => handleInputBlur('version')}
              onKeyDown={e => handleInputKeyPress(e, 'version')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('version')}>{feature?.version ?? 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Description full-width textbox with light pink background (no title) */}
      <div className="w-full mt-2">
        <Textarea
          value={draftFeature?.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full text-sm min-h-[80px] bg-rose-50 border border-rose-200 focus:border-rose-300 focus:outline-none"
          placeholder="Add a description..."
        />
      </div>
    </div>
  );
}

function InsightsTabContent() {
  return (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"
        src="https://cdn.productboard.com/nucleus/images/illustrations/empty-states/insight-tab.svg"
        alt="No insights yet"
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px]  font-bold">
          No direct insights just yet
        </h3>
        <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]">
          Find relevant insights with search, or start adding insights manually
        </span>
      </section>
    </section>
  );
}

function PortalHealthContent() {
  return (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"
        src="https://cdn.productboard.com/nucleus/images/illustrations/pricing/health.svg"
        alt="Validate this idea"
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px]  font-bold">
          Validate this idea
        </h3>
        <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]">
          Collect votes and feedback by adding this idea to your portal{" "}
        </span>
      </section>
    </section>
  );
}

function PortalTabContent() {
  return (
    <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
      <img
        className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"
        src="https://cdn.productboard.com/nucleus/images/illustrations/empty-states/portal-tab.svg"
        alt="Validate this idea"
      />
      <section className="flex flex-col items-center justify-center mt-4">
        <h3 className="text-[#202428] text-[20px]  font-bold">
          Validate this idea
        </h3>
        <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]">
          Collect votes and feedback by adding this idea to your portal{" "}
        </span>
      </section>
    </section>
  );
}

export function FeatureDetailsPage({
  featureId,
  isOpen,
  onClose,
  onFeatureUpdated,
  onFeatureDeleted,
}: FeatureDetailsPageProps) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Feature | null>(null);
  const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("details");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast: showToast } = useToast();
  const [componentName, setComponentName] = useState<string | null>(null);

  // Helper function to calculate progress based on status
  const calculateProgressFromStatus = (status: Status): number => {
    switch (status) {
      case Status.COMPLETED:
        return 100;
      case Status.IN_PROGRESS:
        return 50;
      case Status.TODO:
      default:
        return 0;
    }
  };

  useEffect(() => {
    if (isOpen && featureId) {
      const fetchFeatureDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/features/${featureId}`);

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage =
                errorData?.error ||
                `Failed to fetch feature (status ${response.status})`;
            } catch (parseError) {
              errorMessage = `Failed to fetch feature (status ${
                response.status
              }): ${errorText.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
          }

          const data: Feature = await response.json();
          setFeature(data);
          setDraftFeature({ ...data });

          // Fetch and set the parent component name for display
          try {
            if ((data as any)?.component_id) {
              const componentResp = await fetch(`/api/component/${(data as any).component_id}`);
              if (componentResp.ok) {
                const componentData = await componentResp.json();
                setComponentName(componentData?.name ?? null);
              } else {
                setComponentName(null);
              }
            } else {
              setComponentName(null);
            }
          } catch {
            setComponentName(null);
          }
        } catch (err: any) {
          console.error("Error fetching feature details:", err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchFeatureDetails();
    } else {
      setFeature(null);
      setDraftFeature(null);
      setEditingField(null);
      setActiveTab("details");
      setComponentName(null);
    }
  }, [isOpen, featureId]);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  const handleFieldHover = (field: keyof Feature) => {
    setEditingField(field);
  };

  const handleInputChange = (field: keyof Feature, value: any) => {
    setDraftFeature((prev) => {
      if (!prev) return null;
      
      const updatedDraft = { ...prev, [field]: value };
      
      // Automatically update status based on progress
      if (field === 'progress') {
        const progressValue = parseInt(value) || 0;
        let newStatus = prev.status;
        
        if (progressValue === 0) {
          newStatus = 'Todo';
        } else if (progressValue === 100) {
          newStatus = 'Completed';
        } else if (progressValue > 0 && progressValue < 100) {
          newStatus = 'In Progress';
        }
        
        updatedDraft.status = newStatus;
      }
      
      return updatedDraft;
    });
  };

  // Handler for date changes
  const handleDateChange = (field: keyof Feature, value: string) => {
    setDraftFeature((prev) => (prev ? { ...prev, [field]: value } : null));
    // Remove auto-save on date change
    // setTimeout(() => {
    //   saveChanges();
    // }, 100);
  };

  const handleInputBlur = async (field: keyof Feature) => {
    // Only close the field if we're not switching to another field
    // Use a small delay to check if focus moved to another editable field
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isSwitchingToEditableField = activeElement && 
        (activeElement.tagName === 'INPUT' || 
         activeElement.tagName === 'TEXTAREA' || 
         activeElement.tagName === 'SELECT' ||
         activeElement.getAttribute('contenteditable') === 'true');
      
      if (!isSwitchingToEditableField) {
        setEditingField(null);
      }
    }, 50);
  };

  const handleInputKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Feature
  ) => {
    if (event.key === "Enter") {
      setEditingField(null);
    } else if (event.key === "Escape") {
      setDraftFeature(feature ? { ...feature, id: feature.id || "" } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async (autoSave = false) => {
    if (!draftFeature || !featureId) return;
    setSaving(true);
    try {
      const requestBody = {
        name: draftFeature.name || null,
        status: draftFeature.status || null,
        progress: draftFeature.progress || null,
        team: draftFeature.team || null,
        days: draftFeature.days || null,
        startdate: draftFeature.startdate || null,
        targetdate: draftFeature.targetdate || null,
        completedon: draftFeature.completedon || null,
        remarks: draftFeature.remarks || null,
        description: draftFeature.description || null,
        version: draftFeature.version || null,
        component_id: draftFeature.component_id || null,
        updateComponentProgress: true,
      };
      
      console.log('Sending feature update request:', requestBody);
      
      const response = await fetch(`/api/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData?.error || `Failed to update feature (status ${response.status})`;
        } catch (parseError) {
          errorMessage = `Failed to update feature (status ${response.status}): ${errorText.substring(0, 200)}`;
        }
        throw new Error(errorMessage);
      }
      const data: Feature = await response.json();
      setFeature(data);
      setDraftFeature(data);
      
      // Call the callback with updated feature
      if (onFeatureUpdated) {
        onFeatureUpdated(data);
      }
      
      // Only show toast and close form if not auto-saving
      if (!autoSave) {
        toast("Feature updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error("Error updating feature:", error);
      setDraftFeature(feature);
      if (!autoSave) {
        toast.error("Error updating feature: " + (error instanceof Error ? error.message : "An unknown error occurred."));
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!featureId) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!featureId) return;
    setDeleting(true);
      try {
        const response = await fetch(
          `/api/features/${featureId}?updateComponentProgress=true`,
          {
            method: "DELETE",
          });
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Failed to delete feature`);
          }
      toast("Feature deleted successfully!");
      if (typeof onFeatureDeleted === 'function') onFeatureDeleted();
      onClose();
        } catch (error) {
      toast.error("Error deleting feature: " + (error instanceof Error ? error.message : "An unknown error occurred."));
    } finally {
      setDeleting(false);
      }
    };

    const handleTabChange = (tab: "details" | "insights" | "portal") => {
      setActiveTab(tab);
    };

    const handleStatusChange = async (featureId: string, newStatus: string) => {
      setUpdatingProgress(true);
      try {
        // Update local state - keep existing progress, don't calculate from status
        const updatedDraft = {
          ...draftFeature,
          id: draftFeature?.id || featureId,
          component_id: draftFeature?.component_id || "",
          status: newStatus as Status,
          progress: draftFeature?.progress || 0, // Keep existing progress
          name: draftFeature?.name,
          team: draftFeature?.team,
          days: draftFeature?.days,
          startdate: draftFeature?.startdate,
          targetdate: draftFeature?.targetdate,
          completedon: draftFeature?.completedon,
          remarks: draftFeature?.remarks,
        };

        setDraftFeature({
          ...updatedDraft,
          name: updatedDraft.name || "",
          team: updatedDraft.team || "",
          days: updatedDraft.days || 0,
          startdate: updatedDraft.startdate || "",
          targetdate: updatedDraft.targetdate || "",
          completedon: updatedDraft.completedon || "",
          remarks: updatedDraft.remarks || "",
          created_at: updatedDraft.created_at || "",
        });

        // Send to server - always update component progress when status changes
        const response = await fetch(`/api/features/${featureId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            progress: draftFeature?.progress, // Use existing progress
            updateComponentProgress: true, // Always update component progress when status changes
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update feature status");
        }

        const updatedFeature = await response.json();
        setFeature(updatedFeature);
        setDraftFeature(updatedFeature);

        // Call the callback with updated feature
        if (onFeatureUpdated) {
          onFeatureUpdated(updatedFeature);
        }
      } catch (error) {
        console.error("Error updating feature status:", error);
        // Reset draftFeature if there was an error
        setDraftFeature(feature);
      } finally {
        setUpdatingProgress(false);
      }
    };

    if (loading) return null;
    if (error) return null;
    if (!feature || !draftFeature) return null;

    return (
      <div className="p-6">
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent className="sm:max-w-lg w-full max-w-lg p-0 rounded-lg shadow-lg flex flex-col h-full">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-4 pb-2">
              <SheetHeader className="flex flex-col items-start gap-3">
                <div className="flex items-center justify-between w-full mb-2">
                  <div className="relative w-full flex items-center">
                    <div className="flex-1 flex items-center">
                      {editingField === 'name' ? (
                        <Input
                          ref={editInputRef}
                          type="text"
                          value={draftFeature?.name || ''}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          onBlur={() => handleInputBlur('name')}
                          onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                          className="w-full text-2xl font-bold border-2 border-blue-200 focus:border-blue-500 bg-blue-50 px-4 py-2 rounded"
                        />
                      ) : (
                        <SheetTitle 
                          className="text-2xl font-bold text-blue-900 w-full cursor-pointer hover:text-blue-700 transition-colors"
                          onClick={() => setEditingField('name')}
                        >
                          {feature?.name}
                        </SheetTitle>
                      )}
                    </div>
                  </div>
                </div>

                {/* Tab Navigation */}
                <div className="mt-2 border-b w-full flex gap-6">
                  <FeatureDetailsTab
                    label="Details"
                    isActive={activeTab === "details"}
                    onClick={() => handleTabChange("details")}
                  />
                  <FeatureDetailsTab
                    label="Insights"
                    isActive={activeTab === "insights"}
                    onClick={() => handleTabChange("insights")}
                  />
                  <FeatureDetailsTab
                    label="Portal"
                    isActive={activeTab === "portal"}
                    onClick={() => handleTabChange("portal")}
                  />
                </div>
              </SheetHeader>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-0">
              {activeTab === "details" && (
                <div className="bg-white rounded-lg shadow p-6 mt-2">
                  <DetailsTabContent
                    feature={feature}
                    draftFeature={draftFeature}
                    editingField={editingField}
                    setEditingField={setEditingField}
                    editInputRef={editInputRef}
                    handleFieldHover={handleFieldHover}
                    handleInputChange={handleInputChange}
                    handleDateChange={handleDateChange}
                    handleInputBlur={handleInputBlur}
                    handleInputKeyPress={handleInputKeyPress}
                    onSave={() => saveChanges(false)}
                    saving={saving}
                    componentName={componentName}
                  />
                </div>
              )}
              {activeTab === "insights" && <InsightsTabContent />}
              {activeTab === "health" && <PortalHealthContent />}
              {activeTab === "portal" && <PortalTabContent />}

              {updatingProgress && (
                <div className="mt-4 p-2 bg-blue-50 text-blue-700 rounded text-sm">
                  Updating progress and recalculating component and product
                  metrics...
                </div>
              )}
            </div>

            {/* Fixed Footer with Save Button */}
            <div className="flex-shrink-0 p-3">
              <div className="flex justify-between items-center">
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="px-6 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition flex items-center justify-center"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={onClose}
                    variant="outline"
                    className="px-6 py-2 rounded border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => saveChanges(false)}
                    disabled={saving}
                    className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
                  >
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          title="Delete Feature"
          description="Are you sure you want to delete this feature? This action cannot be undone."
          confirmText="Delete Feature"
          cancelText="Cancel"
          variant="destructive"
          isLoading={deleting}
        />
      </div>
    );
  }

  export default FeatureDetailsPage





