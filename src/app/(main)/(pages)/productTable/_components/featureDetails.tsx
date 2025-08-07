"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, MoreVertical, Loader2, Pencil } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Feature } from "@/app/types"; // Assuming this type exists
import { Input } from "@/components/ui/input";
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
          ? "border-b-2 border-[#2693ff] text-[#2693ff]"
          : "text-gray-500 hover:text-gray-700 "
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
}) {
  // Array of date fields
  const dateFields = ["startdate", "targetdate", "completedon"];

  return (
    <div className="mt-4 flex flex-col gap-6 w-full">
      {/* Status field */}
      <div className="flex items-center gap-8 w-full">
        <span className="text-black w-40 font-medium text-base">Status</span>
        <div className="flex-1">
          {editingField === 'status' ? (
        <select
              ref={editInputRef as any}
              value={draftFeature.status || ''}
              onChange={e => handleInputChange('status', e.target.value)}
              onBlur={() => handleInputBlur('status')}
              onKeyDown={e => handleInputKeyPress(e as any, 'status')}
              className="w-full p-2 border border-gray-300 rounded-md text-base h-10"
        >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
        </select>
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('status')}>{feature.status || 'Not assigned'}</span>
          )}
        </div>
      </div>
      {/* Progress field */}
      <div className="flex items-center gap-8 w-full">
        <span className="text-black w-40 font-medium text-base">Progress (%)</span>
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
              className="w-full text-base h-10"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('progress')}>{feature.progress !== undefined && feature.progress !== null ? feature.progress : 'Not assigned'}</span>
          )}
        </div>
      </div>


      {/* Other fields */}
      {(Object.keys(feature) as (keyof Feature)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'status' && key !== 'progress' && key !== 'description').map((key) => {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const isDateField = ['startdate', 'targetdate', 'completedon', 'start_date', 'target_date', 'completed_on'].includes(key.toLowerCase());
        return (
            <div key={key} className="flex items-center gap-8 w-full">
            <span className="text-black w-40 font-medium text-base">{label}</span>
            <div className="flex-1 relative">
                {editingField === key ? (
                isDateField ? (
                    <Input
                    ref={editInputRef}
                      type="date"
                    value={typeof draftFeature[key] === 'string' ? draftFeature[key].slice(0, 10) : draftFeature[key] ? String(draftFeature[key]).slice(0, 10) : ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                    onBlur={() => handleInputBlur(key)}
                    onKeyDown={(e) => handleInputKeyPress(e, key)}
                    className="w-full text-base h-10"
                    />
                  ) : (
                    <Input
                      ref={editInputRef}
                      type="text"
                    value={draftFeature[key] !== null && draftFeature[key] !== undefined ? String(draftFeature[key]) : ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onBlur={() => handleInputBlur(key)}
                      onKeyDown={(e) => handleInputKeyPress(e, key)}
                    className="w-full text-base h-10"
                    />
                  )
                ) : (
                <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField(key)}>{feature[key] !== null && feature[key] !== undefined ? String(feature[key]) : 'Not assigned'}</span>
                )}
              </div>
            </div>
        );
      })}
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
    setDraftFeature((prev) => (prev ? { ...prev, [field]: value } : null));
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
    // Auto-save for title and description fields
    if (field === 'name' || field === 'description') {
      await saveChanges(true);
    }
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
      // Auto-save for title and description fields
      if (field === 'name' || field === 'description') {
        await saveChanges(true);
      }
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
      const response = await fetch(`/api/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draftFeature,
          startDate: draftFeature.startdate,
          targetDate: draftFeature.targetdate,
          completedOn: draftFeature.completedon,
          updateComponentProgress: true,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update feature`);
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
          color: draftFeature?.color,
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
          color: updatedDraft.color || "",
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
      <div className="">
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent className="sm:max-w-2xl w-full max-w-2xl p-0 rounded-lg shadow-lg flex flex-col h-full bg-white">
            {/* Fixed Header */}
            <div className="flex-shrink-0 p-8 pb-4">
              <SheetHeader className="flex flex-col items-start gap-2">
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

                {/* Description subtitle */}
                <div className="w-full mt-1">
                  {editingField === 'description' ? (
                    <Input
                      ref={editInputRef}
                      type="text"
                      value={draftFeature?.description || ''}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      onBlur={() => handleInputBlur('description')}
                      onKeyDown={(e) => handleInputKeyPress(e, 'description')}
                      className="w-full text-sm font-semibold text-gray-600 border-2 border-gray-200 focus:border-gray-400 bg-gray-50 px-4 py-2 rounded"
                      placeholder="Enter description"
                    />
                  ) : (
                    <p 
                      className="text-sm font-semibold text-gray-600 w-full cursor-pointer hover:text-gray-800 transition-colors"
                      onClick={() => setEditingField('description')}
                    >
                      {feature?.description || 'Click to add description'}
                    </p>
                  )}
                </div>

                {/* Tab Navigation */}
                <div className="mt-[16px] border-b w-full">
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
                />
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
            <div className="flex-shrink-0 p-4">
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





