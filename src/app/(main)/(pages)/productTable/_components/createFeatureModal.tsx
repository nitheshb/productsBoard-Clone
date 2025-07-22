
// components/CreateFeatureModal.tsx

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react"; // Added missing import
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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
    startDate: null,
    targetDate: null,
    completedOn: null,
    remarks: "",
    version: "1.0.0",
  });
  const [activeTab, setActiveTab] = useState("details");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  // const { toast: showToast } = useToast(); // Removed useToast

  // Fetch feature data if editing
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
            startDate: data.startDate || null,
            targetDate: data.targetDate || null,
            completedOn: data.completedOn || null,
            remarks: data.remarks || "",
            version: data.version || "1.0.0",
          });
        })
        .finally(() => setLoading(false));
    } else if (!featureId && isOpen) {
      setFormData({
        name: "",
        status: "Todo",
        progress: 0,
        team: "",
        days: null,
        startDate: null,
        targetDate: null,
        completedOn: null,
        remarks: "",
        version: "1.0.0",
      });
    }
  }, [featureId, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }));
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Calculate progress based on status
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

  // Update progress when status changes - REMOVE THIS FUNCTION
  // const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const newStatus = e.target.value;
  //   const newProgress = calculateProgressFromStatus(newStatus);
  //   setFormData(prev => ({
  //     ...prev,
  //     status: newStatus,
  //     progress: newProgress
  //   }));
  // };

  // Replace with simple status change
  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setFormData(prev => ({
      ...prev,
      status: newStatus
      // Don't automatically update progress
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsCreating(true);
    if (!componentId && !featureId) {
      toast.error("Component ID is null, cannot create feature.");
      setIsCreating(false);
      return;
    }
    try {
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
      onClose();
      setFormData({
        name: "",
        status: "Todo",
        progress: 0,
        team: "",
        days: null,
        startDate: null,
        targetDate: null,
        completedOn: null,
        remarks: "",
        version: "1.0.0",
      });
    } catch (error) {
      toast.error("Error creating/updating feature: " + (error instanceof Error ? error.message : String(error)));
    } finally {
      setIsCreating(false);
    }
  };

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
        <Input
          id="team"
          name="team"
          value={formData.team || ""}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
          placeholder="Assign team"
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
          id="startDate"
          name="startDate"
          value={formData.startDate === null ? "" : formData.startDate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Target Date */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Target Date</span>
        <Input
          type="date"
          id="targetDate"
          name="targetDate"
          value={formData.targetDate === null ? "" : formData.targetDate}
          onChange={handleChange}
          className="w-full h-[32px] bg-white border border-gray-300 focus:border-blue-500 focus:outline-none"
        />
      </div>

      {/* Completed On */}
      <div className="flex items-center gap-1">
        <span className="text-[#30363c] w-24 text-[14px] min-h-[32px] py-2 capitalize min-w-[100px] max-w-[140px] mr-5">Completed On</span>
        <Input
          type="date"
          id="completedOn"
          name="completedOn"
          value={formData.completedOn === null ? "" : formData.completedOn}
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
    </div>
  );

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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto max-w-md w-full mx-auto rounded-lg shadow-lg scroll-smooth scrollbar-hide">
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex flex-col justify-between w-full">
              <section className="flex gap-2 flex-row justify-between">
                <div className="flex flex-row">
                  <span className="text-[#ffc600] mt-[2px] mr-[8px]">
                    <svg
                      height="16px"
                      width="16px"
                      viewBox="0 0 16 16"
                      role="img"
                      aria-label="FeatureIcon"
                      className="ui-icon"
                    >
                      <path
                        fill="currentColor"
                        d="M1.25 4.85c0-1.26 0-1.89.245-2.371a2.25 2.25 0 0 1 .984-.984c.48-.245 1.11-.245 2.371-.245h6.3c1.26 0 1.89 0 2.371.245.424.216.768.56.984.984.245.48.245 1.11.245 2.371v6.3c0 1.26 0 1.89-.245 2.371-.216.424-.56.768-.984.984-.48.245-1.11.245-2.371.245h-6.3c-1.26 0-1.89 0-2.371-.245a2.25 2.25 0 0 1-.984-.984c-.245-.48-.245-1.11-.245-2.371z"
                      ></path>
                    </svg>
                  </span>
                  <span className="text-[14px] text-[#68707b]">
                    {featureId ? 'Edit Feature' : 'New Feature'}
                  </span>
                </div>
              </section>
              <SheetTitle className="text-lg font-semibold text-[#202428] mt-2">
                {featureId ? 'Edit Feature' : 'Create New Feature'}
              </SheetTitle>
            </div>

            {/* Tab Navigation */}
            <div className="mt-[16px] border-b w-full">
              <FeatureTab
                label="Details"
                isActive={activeTab === "details"}
                onClick={() => handleTabChange("details")}
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

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto scroll-smooth scrollbar-hide">
            {activeTab === "details" && renderDetailsTab()}
            {activeTab === "insights" && renderInsightsTab()}
            {activeTab === "portal" && renderPortalTab()}
          </div>

          {/* Action Buttons - only show on details tab */}
          {activeTab === "details" && (
            <SheetFooter className="flex justify-end gap-2 py-4 mt-4 border-t">
              <SheetClose asChild>
                <Button type="button" variant="outline" disabled={isCreating}>
                  Cancel
                </Button>
              </SheetClose>
              <Button type="submit" disabled={isCreating} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isCreating ? (featureId ? 'Updating...' : 'Creating...') : (featureId ? 'Update Feature' : 'Create Feature')}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
