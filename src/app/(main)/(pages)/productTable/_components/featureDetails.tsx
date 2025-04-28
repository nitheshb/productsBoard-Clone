"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Trash2, MoreVertical } from "lucide-react";
import { Feature } from "@/app/types"; // Assuming this type exists
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

function DetailsTabContent({
  feature,
  draftFeature,
  editingField,
  editInputRef,
  handleFieldHover,
  handleInputChange,
  handleInputBlur,
  handleInputKeyPress,
  handleStatusChange,
}: {
  feature: Feature;
  draftFeature: Feature;
  editingField: keyof Feature | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof Feature) => void;
  handleInputChange: (field: keyof Feature, value: any) => void;
  handleInputBlur: (field: keyof Feature) => Promise<void>;
  handleInputKeyPress: (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Feature
  ) => Promise<void>;
  handleStatusChange: (featureId: string, newStatus: Status) => Promise<void>;
}) {
  return (
    <div className="mt-4 space-y-3">
      {/* Status dropdown - positioned at the top */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Status</span>
        <select
          value={draftFeature?.status || feature?.status || Status.TODO}
          onChange={(e) =>
            handleStatusChange(feature.id, e.target.value as Status)
          }
          className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded"
        >
          {Object.values(Status).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {/* Progress field (now showing automatically calculated value) */}
      <div className="flex items-center gap-2">
        <span className="text-[#30363c] w-32 text-[14px] min-h-[32px] py-2 capitalize min-w-[140px] max-w-[200px]">Progress</span>
        <div className="w-full flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#68b4ff] h-2.5 "
              style={{ width: `${draftFeature.progress || 0}%` }}
            ></div>
          </div>
          <span className="ml-2">{draftFeature.progress || 0}%</span>
        </div>
      </div>

      {/* Filter out status field since we're handling it separately above */}
      {(Object.keys(feature || {}) as (keyof Feature)[])
        .filter(
          (key) =>
            key !== "id" &&
            key !== "name" &&
            key !== "created_at" &&
            key !== "status" &&
            key !== "progress"
        )
        .map((key) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-[#30363c] text-[14px] min-h-[32px] py-2 w-32 capitalize min-w-[140px] max-w-[200px]">
              {key.replace(/_/g, " ")}
            </span>
            <div
              className="relative w-full"
              // onMouseEnter={() => handleFieldHover(key)}
              onClick={() => handleFieldHover(key)}
              onMouseLeave={() =>
                editingField === key &&
                editInputRef.current !== document.activeElement &&
                handleInputBlur(key)
              }
            >
              {editingField === key ? ( 
                <Input
                  ref={editInputRef}
                  type="text" // Adjust type based on the field
                  value={
                    draftFeature[key] !== null &&
                    draftFeature[key] !== undefined
                      ? String(draftFeature[key])
                      : ""
                  }
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onBlur={() => handleInputBlur(key)}
                  onKeyDown={(e) => handleInputKeyPress(e, key)}
                  className="w-full h-[32px]"
                />
              ) : (
                <span className="text-[#68707b] text-[12px] capitalize ">
                  {feature[key] !== null && feature[key] !== undefined
                    ? String(feature[key])
                    : "Not assigned"}
                </span>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

function InsightsTabContent() {
  return <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
<img className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"src="https://cdn.productboard.com/nucleus/images/illustrations/empty-states/insight-tab.svg"></img>
<section className="flex flex-col items-center justify-center mt-4">
  <h3 className="text-[#202428] text-[20px]  font-bold">No direct insights just yet</h3>
  <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]" >Find relevant insights with search, or start adding insights manually</span>

</section>
  </section>;
}

function PortalHealthContent() {
  return <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
  <img className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"src="https://cdn.productboard.com/nucleus/images/illustrations/pricing/health.svg"></img>
  <section className="flex flex-col items-center justify-center mt-4">
    <h3 className="text-[#202428] text-[20px]  font-bold">Validate this idea</h3>
    <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]" >Collect votes and feedback by adding this idea to your portal </span>
  
  </section>
    </section>;
}
function PortalTabContent() {
  return <section className="flex flex-col items-center justify-center py-[32px] px-[16px]">
  <img className="mt-[20px] w-[230px] h-auto aspect-[4/3] max-w-[100%]"src="https://cdn.productboard.com/nucleus/images/illustrations/empty-states/portal-tab.svg"></img>
  <section className="flex flex-col items-center justify-center mt-4">
    <h3 className="text-[#202428] text-[20px]  font-bold">Validate this idea</h3>
    <span className="text-[#939da7] text-[12px]  font-semibold mt-[4px]" >Collect votes and feedback by adding this idea to your portal </span>
  
  </section>
    </section>;
}

export function FeatureDetailsPage({
  featureId,
  isOpen,
  onClose,
  onFeatureUpdated,
}: FeatureDetailsPageProps) {
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Feature | null>(null);
  const [draftFeature, setDraftFeature] = useState<Feature | null>(null);
  const [updatingProgress, setUpdatingProgress] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("details");

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

  const handleInputBlur = async (field: keyof Feature) => {
    if (
      editingField === field &&
      feature &&
      draftFeature &&
      feature[field] !== draftFeature[field]
    ) {
      await saveChanges();
    }
    setEditingField(null);
  };

  const handleInputKeyPress = async (
    event: React.KeyboardEvent<HTMLInputElement>,
    field: keyof Feature
  ) => {
    if (
      event.key === "Enter" &&
      editingField === field &&
      feature &&
      draftFeature &&
      feature[field] !== draftFeature[field]
    ) {
      await saveChanges();
      setEditingField(null);
    } else if (event.key === "Escape") {
      setDraftFeature(feature ? { ...feature, id: feature.id || "" } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async () => {
    if (!draftFeature || !featureId) return;
    setFeature(draftFeature);
    try {
      const response = await fetch(`/api/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draftFeature),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update feature`);
      }
      const data: Feature = await response.json();
      setFeature(data);
      setDraftFeature(data);
      console.log("Feature updated successfully");

      // Call the callback with updated feature
      if (onFeatureUpdated) {
        onFeatureUpdated(data);
      }
    } catch (error) {
      console.error("Error updating feature:", error);
      setDraftFeature(feature);
    }
  };

  const handleDelete = async () => {
    if (!featureId) return;
    if (window.confirm("Are you sure you want to delete this feature?")) {
      try {
        const response = await fetch(`/api/features/${featureId}`, {
          method: "DELETE",
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete feature`);
        }
        console.log("Feature deleted successfully");
        onClose();
      } catch (error) {
        console.error("Error deleting feature:", error);
      }
    }
  };

  const handleTabChange = (tab: "details" | "insights" | "portal") => {
    setActiveTab(tab);
  };

  const handleStatusChange = async (featureId: string, newStatus: string) => {
    setUpdatingProgress(true);
    try {
      // Calculate progress based on status
      const statusProgress = calculateProgressFromStatus(newStatus as Status);

      // Update local state immediately for better UX
      setDraftFeature((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus as Status,
              progress: statusProgress,
            }
          : null
      );

      // Send to server
      const response = await fetch(`/api/features/${featureId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          progress: statusProgress, // Send the calculated progress
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

      console.log("Feature status updated successfully:", updatedFeature);
    } catch (error) {
      console.error("Error updating feature status:", error);
      // Reset draftFeature if there was an error
      setDraftFeature(feature);
    } finally {
      setUpdatingProgress(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!feature || !draftFeature) return <div>No feature found</div>;

  return (
    <div className="">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className=" overflow-y-auto">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex flex-col justify-between w-full">
              <section className="flex  gap-2 flex-row justify-between">
                <div className="flex flex-row">
                  <span className="text-[#ffc600] mt-[2px] mr-[8px]">
                    {" "}
                    <svg
                      height="16px"
                      width="16px"
                      viewBox="0 0 16 16"
                      role="img"
                      aria-label="FeatureIcon"
                      className="sc-fQpRED iffMI ui-icon"
                      data-testid="Status-Switcher-Icon-Detail"
                    >
                      <path
                        fill="currentColor"
                        d="M1.25 4.85c0-1.26 0-1.89.245-2.371a2.25 2.25 0 0 1 .984-.984c.48-.245 1.11-.245 2.371-.245h6.3c1.26 0 1.89 0 2.371.245.424.216.768.56.984.984.245.48.245 1.11.245 2.371v6.3c0 1.26 0 1.89-.245 2.371-.216.424-.56.768-.984.984-.48.245-1.11.245-2.371.245h-6.3c-1.26 0-1.89 0-2.371-.245a2.25 2.25 0 0 1-.984-.984c-.245-.48-.245-1.11-.245-2.371z"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-[14px] text-[#68707b]">
                    {" "}
                    {draftFeature?.status || feature?.status || Status.TODO}
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" sideOffset={4}>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-red-500 focus:bg-red-100"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete feature
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </section>
              <div
                className="relative w-full flex flex-row justify-between"
                onMouseEnter={() => handleFieldHover("name")}
                onMouseLeave={() =>
                  editingField === "name" &&
                  editInputRef.current !== document.activeElement &&
                  handleInputBlur("name")
                }
              >
                {editingField === "name" ? (
                  <Input
                    ref={editInputRef}
                    type="text"
                    value={draftFeature.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    onBlur={() => handleInputBlur("name")}
                    onKeyDown={(e) => handleInputKeyPress(e, "name")}
                    className="w-full text-lg font-semibold"
                  />
                ) : (
                  <SheetTitle className="text-lg font-semibold text-[#202428]">
                    {feature.name}
                  </SheetTitle>
                )}
              </div>
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
                label="Health"
                isActive={activeTab === "health"}
                onClick={() => handleTabChange("health")}
              />
              <FeatureDetailsTab
                label="Portal"
                isActive={activeTab === "portal"}
                onClick={() => handleTabChange("portal")}
              />
            </div>
          </SheetHeader>

          {/* Tab Content */}
          {activeTab === "details" && (
            <DetailsTabContent
              feature={feature}
              draftFeature={draftFeature}
              editingField={editingField}
              editInputRef={editInputRef}
              handleFieldHover={handleFieldHover}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              handleInputKeyPress={handleInputKeyPress}
              handleStatusChange={handleStatusChange}
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
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default FeatureDetailsPage;
