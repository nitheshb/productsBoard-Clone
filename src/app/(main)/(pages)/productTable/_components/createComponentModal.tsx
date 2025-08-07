
'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface CreateComponentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string | null;
  onComponentCreated: (component: any, productId: string) => void;
  componentId?: string | null; // <-- new prop for update
}

function ComponentCreateTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`inline-block py-2 px-4 font-medium text-sm ${
        isActive ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500 hover:text-gray-700'
      }`}
    >
      {label}
    </button>
  );
}

export function CreateComponentModal({
  isOpen,
  onClose,
  productId,
  onComponentCreated,
  componentId = null,
}: CreateComponentModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    progress: 0,
    version: "1.0.0",
    status: "Todo", // Added status field
    product_id: productId,
    startDate: null,
    targetDate: null,
    completedOn: null,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (productId) {
      setFormData(prev => ({
        ...prev,
        product_id: productId
      }));
    }
  }, [productId]);

  // Fetch component data if editing
  useEffect(() => {
    if (componentId && isOpen) {
      setLoading(true);
      fetch(`/api/component/${componentId}`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            name: data.name || "",
            progress: data.progress || 0,
            version: data.version || "1.0.0",
            status: data.status || "Todo", // Fetch status
            product_id: data.product_id || productId,
            startDate: data.startDate || null,
            targetDate: data.targetDate || null,
            completedOn: data.completedOn || null,
            description: data.description || "",
          });
        })
        .finally(() => setLoading(false));
    } else if (!componentId && isOpen) {
      setFormData({
        name: "",
        progress: 0,
        version: "1.0.0",
        status: "Todo", // Default status for new component
        product_id: productId,
        startDate: null,
        targetDate: null,
        completedOn: null,
        description: "",
      });
    }
  }, [componentId, isOpen, productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "progress" ? parseInt(value) || 0 : value,
    }));
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  const handleSubmit = async () => {
    if (!formData.product_id) {
      toast.error("Product ID is null, cannot create/update component.");
      return;
    }
    try {
      let data, error;
      if (componentId) {
        // Update
        const response = await fetch(`/api/component/${componentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            updateProductProgress: true,
          }),
        });
        if (!response.ok) throw new Error('Failed to update component');
        data = [await response.json()];
        toast.success("Component updated successfully!");
      } else {
        // Create via API (changed from direct Supabase insert to match server-side remapping)
        const response = await fetch('/api/component', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            updateProductProgress: true,
          }),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create component');
        }
        const newComponent = await response.json();
        data = [newComponent];
        toast.success("Component created successfully!");
      }
      if (data && data.length > 0) {
        onComponentCreated(data[0], formData.product_id);
        onClose();
        setFormData({
          name: "",
          progress: 0,
          version: "1.0.0",
          status: "Todo", // Reset status
          product_id: formData.product_id,
          startDate: null,
          targetDate: null,
          completedOn: null,
          description: "",
        });
      }
    } catch (error) {
      toast.error("Error creating/updating component: " + (error instanceof Error ? error.message : String(error)));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      progress: 0,
      version: "1.0.0",
      status: "Todo", // Reset status
      product_id: productId,
      startDate: null,
      targetDate: null,
      completedOn: null,
      description: "",
    });
    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={resetForm}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="flex flex-col items-start gap-2">
          <div className="flex items-center justify-between w-full">
            <div className="relative w-full">
              <SheetTitle className="text-lg font-semibold mb-2">
                {componentId ? 'Edit Component' : 'Create New Component'}
              </SheetTitle>
              {/* Removed Component Name input from header */}
            </div>
          </div>
          {/* Tab Navigation */}
          <div className="mt-2 border-b w-full">
            <ComponentCreateTab
              label="Details"
              isActive={activeTab === 'details'}
              onClick={() => handleTabChange('details')}
            />
            <ComponentCreateTab
              label="Insights"
              isActive={activeTab === 'insights'}
              onClick={() => handleTabChange('insights')}
            />
            <ComponentCreateTab
              label="Portal"
              isActive={activeTab === 'portal'}
              onClick={() => handleTabChange('portal')}
            />
          </div>
        </SheetHeader>
        {/* Tab Content */}
        {activeTab === 'details' && (
          <div className="mt-4 space-y-3">
            {/* Component Name */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Name</span>
              <div className="relative w-full">
                <Input
                  ref={nameInputRef}
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Component Name"
                  className="w-full"
                  required
                  disabled={loading}
                />
              </div>
            </div>
            {/* Status */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Status</span>
              <div className="relative w-full">
                <select
                  name="status"
                  value={formData.status || 'Todo'}
                  onChange={handleChange}
                  className="w-full px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
                  disabled={loading}
                >
                  <option value="Todo">Todo</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Blocked">Blocked</option>
                </select>
              </div>
            </div>
            {/* Progress */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Progress</span>
              <div className="relative w-full">
                <Input
                  name="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={handleChange}
                  placeholder="0-100"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
            {/* Version */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Version</span>
              <div className="relative w-full">
                <Input
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  placeholder="e.g., 1.0.0"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
            
            {/* Description */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 w-24">Description</span>
              <div className="relative w-full">
                <Input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter component description"
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="mt-4 p-4 text-gray-500 text-center">
            Insights will be available after component creation.
          </div>
        )}

        {activeTab === 'portal' && (
          <div className="mt-4 p-4 text-gray-500 text-center">
            Portal options will be available after component creation.
          </div>
        )}

        {/* Footer with Actions */}
        <div className="absolute bottom-0 right-0 p-2 flex justify-end gap-2 w-full border-t bg-white">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? (componentId ? 'Updating...' : 'Creating...') : (componentId ? 'Update Component' : 'Create Component')}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
