
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical, Loader2, Pencil, Flag, Gauge, Users, Timer, CalendarDays, StickyNote, Tag, Info } from 'lucide-react';
import { Component as ComponentType, Feature } from '@/app/types'; // Assuming these types exist
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
  productName,
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
  productName?: string | null;
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
      {/* Status */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('status')}
          <span>Status</span>
        </div>
        <div className="flex-1">
          {editingField === 'status' ? (
            <select
              ref={editInputRef as any}
              value={draftComponent.status || ''}
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
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('status')}>{draftComponent.status || component.status || 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Progress */}
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
              value={draftComponent.progress === null || draftComponent.progress === undefined ? '' : draftComponent.progress}
              onChange={e => handleInputChange('progress', e.target.value)}
              onBlur={() => handleInputBlur('progress')}
              onKeyDown={e => handleInputKeyPress(e, 'progress')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('progress')}>{draftComponent.progress !== undefined && draftComponent.progress !== null ? draftComponent.progress : component.progress !== undefined && component.progress !== null ? component.progress : 'Not assigned'}</span>
          )}
        </div>
      </div>

      {/* Product (read-only name) */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
          {fieldIconFor('product_id')}
          <span>Product</span>
        </div>
        <div className="flex-1">
          <span className="block text-gray-800 min-h-[28px] text-sm">
            {productName ?? (component as any)?.product_id ?? 'Not assigned'}
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
              value={draftComponent?.team ?? ''}
              onChange={e => handleInputChange('team', e.target.value)}
              onBlur={() => handleInputBlur('team')}
              onKeyDown={e => handleInputKeyPress(e, 'team')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('team')}>{component?.team ?? 'Not assigned'}</span>
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
              value={draftComponent?.days ?? ''}
              onChange={e => handleInputChange('days', e.target.value)}
              onBlur={() => handleInputBlur('days')}
              onKeyDown={e => handleInputKeyPress(e, 'days')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('days')}>{component?.days ?? 'Not assigned'}</span>
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
              value={typeof draftComponent?.startdate === 'string' ? draftComponent.startdate.slice(0, 10) : draftComponent?.startdate ? String(draftComponent.startdate).slice(0, 10) : ''}
              onChange={e => handleInputChange('startdate', e.target.value)}
              onBlur={() => handleInputBlur('startdate')}
              onKeyDown={e => handleInputKeyPress(e, 'startdate')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('startdate')}>{component?.startdate ?? 'Not assigned'}</span>
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
              value={typeof draftComponent?.targetdate === 'string' ? draftComponent.targetdate.slice(0, 10) : draftComponent?.targetdate ? String(draftComponent.targetdate).slice(0, 10) : ''}
              onChange={e => handleInputChange('targetdate', e.target.value)}
              onBlur={() => handleInputBlur('targetdate')}
              onKeyDown={e => handleInputKeyPress(e, 'targetdate')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('targetdate')}>{component?.targetdate ?? 'Not assigned'}</span>
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
              value={typeof draftComponent?.completedon === 'string' ? draftComponent.completedon.slice(0, 10) : draftComponent?.completedon ? String(draftComponent.completedon).slice(0, 10) : ''}
              onChange={e => handleInputChange('completedon', e.target.value)}
              onBlur={() => handleInputBlur('completedon')}
              onKeyDown={e => handleInputKeyPress(e, 'completedon')}
              className="w-full text-sm h-9"
            />
          ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('completedon')}>{component?.completedon ?? 'Not assigned'}</span>
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
              value={draftComponent?.remarks ?? ''}
              onChange={e => handleInputChange('remarks', e.target.value)}
              onBlur={() => handleInputBlur('remarks')}
              onKeyDown={e => handleInputKeyPress(e, 'remarks')}
                    className="w-full text-sm h-9"
                  />
                ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('remarks')}>{component?.remarks ?? 'Not assigned'}</span>
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
              value={draftComponent?.version ?? ''}
              onChange={e => handleInputChange('version', e.target.value)}
              onBlur={() => handleInputBlur('version')}
              onKeyDown={e => handleInputKeyPress(e, 'version')}
                    className="w-full text-sm h-9"
                  />
              ) : (
            <span className="block text-gray-800 min-h-[28px] text-sm cursor-pointer" onClick={() => setEditingField('version')}>{component?.version ?? 'Not assigned'}</span>
              )}
            </div>
          </div>

      {/* Description full-width textbox with light pink background (no title) */}
      <div className="w-full mt-2">
        <Textarea
          value={draftComponent?.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full text-sm min-h-[80px] bg-rose-50 border border-rose-200 focus:border-rose-300 focus:outline-none"
          placeholder="Add a description..."
        />
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
  const [productName, setProductName] = useState<string | null>(null);

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

          // Fetch and set the parent product name for display
          try {
            if ((data as any)?.product_id) {
              const productResp = await fetch(`/api/product/${(data as any).product_id}`);
              if (productResp.ok) {
                const productData = await productResp.json();
                setProductName(productData?.name ?? null);
              } else {
                setProductName(null);
              }
            } else {
              setProductName(null);
            }
          } catch {
            setProductName(null);
          }
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
      setProductName(null);
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
    setDraftComponent(prev => {
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

  const handleInputBlur = async (field: keyof ComponentType) => {
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
              <div className="bg-white rounded-lg shadow p-6 mt-2">
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
                  productName={productName}
                />
              </div>
            ) : (
              <div className="mt-4">No component data available</div>
            )}
            {activeTab === 'insights' && <InsightsTabContent />}
            {activeTab === 'portal' && <PortalTabContent />}
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



