
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical, Loader2, Pencil } from 'lucide-react';
import { Component as ComponentType, Feature } from '@/app/types'; // Assuming these types exist
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/app/hooks/use-toast";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ComponentDetailsPageProps {
  componentId: string;
  isOpen: boolean;
  onClose: () => void;
  onComponentDeleted?: () => void;
  onComponentUpdated?: (updatedComponent: ComponentType) => void;
}

function ComponentDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
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

function DetailsTabContent({
  component,
  draftComponent,
  editingField,
  setEditingField,
  editInputRef,
  handleFieldHover,
  handleInputChange,
  handleInputBlur,
  handleInputKeyPress,
  onSave, // <-- new prop
  saving, // <-- new prop
}: {
  component: ComponentType;
  draftComponent: ComponentType;
  editingField: keyof ComponentType | null;
  setEditingField: React.Dispatch<React.SetStateAction<keyof ComponentType | null>>;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof ComponentType) => void;
  handleInputChange: (field: keyof ComponentType, value: any) => void;
  handleInputBlur: (field: keyof ComponentType) => Promise<void>;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof ComponentType) => Promise<void>;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="mt-4 flex flex-col gap-6 w-full">
      {/* Other fields */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex items-center gap-8 w-full">
          <span className="text-gray-700 w-40 font-medium text-base">Status</span>
          <div className="flex-1">
            {editingField === 'status' ? (
              <select
                ref={editInputRef as any}
                value={draftComponent.status || ''}
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
              <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('status')}>{component.status || 'Not assigned'}</span>
            )}
          </div>
        </div>
      <div className="flex items-center gap-8 w-full">
          <span className="text-gray-700 w-40 font-medium text-base">Progress (%)</span>
          <div className="flex-1">
            {editingField === 'progress' ? (
              <Input
                ref={editInputRef}
              type="number"
              min={0}
              max={100}
                value={draftComponent.progress === null || draftComponent.progress === undefined ? '' : draftComponent.progress}
                onChange={e => handleInputChange('progress', e.target.value)}
              onBlur={() => handleInputBlur('progress')}
              onKeyDown={e => handleInputKeyPress(e, 'progress')}
                className="w-full text-base h-10"
            />
            ) : (
              <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('progress')}>{component.progress !== undefined && component.progress !== null ? component.progress : 'Not assigned'}</span>
            )}
          </div>
        </div>
      </div>


      <div className="flex flex-col gap-6 w-full">
        {(Object.keys(component) as (keyof ComponentType)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'features' && key !== 'progress' && key !== 'status' && key !== 'description' && key !== 'version_progress').map((key) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const isDateField = (key: string) => ['startdate', 'targetdate', 'completedon'].includes(key);
          return (
          <div key={key} className="flex items-center gap-8 w-full">
              <span className="text-gray-700 w-40 font-medium text-base">{label}</span>
              <div className="flex-1 relative">
              {editingField === key ? (
                  isDateField(key) ? (
                    <Input
                      ref={editInputRef}
                      type="date"
                      value={typeof draftComponent[key] === 'string' ? draftComponent[key].slice(0, 10) : draftComponent[key] ? String(draftComponent[key]).slice(0, 10) : ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onBlur={() => handleInputBlur(key)}
                      onKeyDown={(e) => handleInputKeyPress(e, key)}
                      className="w-full text-base h-10"
                    />
                  ) : (
                <Input
                  ref={editInputRef}
                  type="text"
                  value={draftComponent[key] !== null && draftComponent[key] !== undefined ? String(draftComponent[key]) : ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onBlur={() => handleInputBlur(key)}
                  onKeyDown={(e) => handleInputKeyPress(e, key)}
                      className="w-full text-base h-10"
                />
                  )
              ) : (
                  <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField(key)}>{component[key] !== null && component[key] !== undefined ? String(component[key]) : 'Not assigned'}</span>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightsTabContent() {
  return <div>Content for Component Insights tab</div>;
}

function PortalTabContent() {
  return <div>Content for Component Portal tab</div>;
}

export function ComponentDetailsPage({ componentId, isOpen, onClose, onComponentDeleted, onComponentUpdated }: ComponentDetailsPageProps) {
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof ComponentType | null>(null);
  const [draftComponent, setDraftComponent] = useState<ComponentType | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast: showToast } = useToast();

  useEffect(() => {
    if (isOpen && componentId) {
      const fetchComponentDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/component/${componentId}`);

          if (!response.ok) {
            const errorText = await response.text();
            let errorMessage;
            try {
              const errorData = JSON.parse(errorText);
              errorMessage = errorData?.error || `Failed to fetch component (status ${response.status})`;
            } catch (parseError) {
              errorMessage = `Failed to fetch component (status ${response.status}): ${errorText.substring(0, 100)}`;
            }
            throw new Error(errorMessage);
          }

          const data: ComponentType = await response.json();
          setComponent(data);
          setDraftComponent({ ...data, id: data.id || '' });
        } catch (err: any) {
          console.error('Error fetching component details:', err);
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchComponentDetails();
    } else {
      setComponent(null);
      setDraftComponent(null);
      setEditingField(null);
      setActiveTab('details');
    }
  }, [isOpen, componentId]);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  const handleFieldHover = (field: keyof ComponentType) => {
    setEditingField(field);
  };

  const handleInputChange = (field: keyof ComponentType, value: any) => {
    setDraftComponent(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleInputBlur = async (field: keyof ComponentType) => {
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

  const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof ComponentType) => {
    if (event.key === 'Enter') {
      // Auto-save for title and description fields
      if (field === 'name' || field === 'description') {
        await saveChanges(true);
      }
      setEditingField(null);
    } else if (event.key === 'Escape') {
      setDraftComponent(component ? { ...component, id: component.id || '' } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async (autoSave = false) => {
    if (!draftComponent || !componentId) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/component/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draftComponent,
          startDate: draftComponent.startdate,
          targetDate: draftComponent.targetdate,
          completedOn: draftComponent.completedon,
          updateProductProgress: true,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update component`);
      }
      const data: ComponentType = await response.json();
      setComponent(data);
      setDraftComponent(data);
      
      // Call the callback to update parent component
      if (typeof onComponentUpdated === 'function') {
        onComponentUpdated(data);
      }
      
      // Only show toast and close form if not auto-saving
      if (!autoSave) {
        toast("Component updated successfully!");
        onClose();
      }
    } catch (error) {
      console.error('Error updating component:', error);
      if (error instanceof Error) {
        if (!autoSave) {
          toast.error("Error updating component: " + error.message);
        }
      } else {
        if (!autoSave) {
          toast.error("Error updating component: An unknown error occurred.");
        }
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!componentId) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!componentId) return;
    setDeleting(true);
      try {
        const response = await fetch(`/api/component/${componentId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete component`);
        }
      toast("Component deleted successfully!");
      if (typeof onComponentDeleted === 'function') onComponentDeleted();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
        toast.error("Error deleting component: " + error.message);
        } else {
        toast.error("Error deleting component: An unknown error occurred.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;
  if (loading) return null;
  if (error) return null;
  if (!component || !draftComponent) return null;

  return (
    <div className="p-6">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-2xl w-full max-w-2xl p-0 rounded-lg shadow-lg flex flex-col h-full">
          {/* Fixed Header */}
          <div className="flex-shrink-0 p-8 pb-4">
            <SheetHeader className="flex flex-col items-start gap-4">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="relative w-full flex items-center">
                                    <div className="flex-1 flex items-center">
                    {editingField === 'name' ? (
                      <Input
                        ref={editInputRef}
                        type="text"
                        value={draftComponent?.name || ''}
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
                          {component?.name}
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
                    value={draftComponent?.description || ''}
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
                    {component?.description || 'Click to add description'}
                  </p>
                )}
              </div>
              {/* Tab Navigation */}
              <div className="mt-2 border-b w-full flex gap-6">
                <ComponentDetailsTab
                  label="Details"
                  isActive={activeTab === 'details'}
                  onClick={() => handleTabChange('details')}
                />
                <ComponentDetailsTab
                  label="Insights"
                  isActive={activeTab === 'insights'}
                  onClick={() => handleTabChange('insights')}
                />
                <ComponentDetailsTab
                  label="Portal"
                  isActive={activeTab === 'portal'}
                  onClick={() => handleTabChange('portal')}
                />
              </div>
            </SheetHeader>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-0">
            {loading ? (
              <div className="mt-2 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="animate-pulse h-4 w-full bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-4 p-4 bg-red-50 text-red-500 rounded-md">
                {error}
              </div>
            ) : component && draftComponent ? (
              <DetailsTabContent
                component={component}
                draftComponent={draftComponent}
                editingField={editingField}
                setEditingField={setEditingField}
                editInputRef={editInputRef}
                handleFieldHover={handleFieldHover}
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                handleInputKeyPress={handleInputKeyPress}
                onSave={() => saveChanges(false)}
                saving={saving}
              />
            ) : (
              <div className="mt-4">No component data available</div>
            )}
            {activeTab === 'insights' && <InsightsTabContent />}
            {activeTab === 'portal' && <PortalTabContent />}
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
        title="Delete Component"
        description="Are you sure you want to delete this component? This action cannot be undone."
        confirmText="Delete Component"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}

export default ComponentDetailsPage;



