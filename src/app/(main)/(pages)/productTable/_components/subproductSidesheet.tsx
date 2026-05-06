
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TeamDropdown } from '@/components/ui/team-dropdown';
import { toast } from "sonner";
import { Loader2, Trash2, Flag, Gauge, Users, Timer, CalendarDays, StickyNote, Tag, Info, Box } from "lucide-react";
import { Subproduct } from '@/app/types';
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface SubproductSidesheetProps {
  isOpen: boolean;
  onClose: () => void;
  subproductId?: string | null;
  productId: string;
  onSubproductCreated: (subproduct: Subproduct) => void;
  onSubproductUpdated: (subproduct: Subproduct) => void;
  onSubproductDeleted?: (id: string) => void;
  initialData?: Partial<Subproduct> | null;
}

function SubproductTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
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

// Mode 1: Create Form Content (Active Inputs)
function CreateFormContent({
  formData,
  handleInputChange,
  loading,
  nameInputRef,
}: {
  formData: Partial<Subproduct>;
  handleInputChange: (field: keyof Subproduct, value: any) => void;
  loading: boolean;
  nameInputRef: React.RefObject<HTMLInputElement>;
}) {
  return (
    <div className="mt-4 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Name</span>
        <Input
          ref={nameInputRef}
          value={formData.name || ''}
          onChange={e => handleInputChange('name', e.target.value)}
          placeholder="Subproduct Name"
          className="flex-1"
          required
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Status</span>
        <select
          value={formData.status || 'Todo'}
          onChange={e => handleInputChange('status', e.target.value)}
          className="flex-1 px-3 h-[32px] border text-[14px] border-gray-300 rounded bg-white"
          disabled={loading}
        >
          <option value="Todo">Todo</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="Blocked">Blocked</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Progress (%)</span>
        <Input
          type="number"
          value={formData.progress ?? 0}
          onChange={e => handleInputChange('progress', e.target.value)}
          min={0}
          max={100}
          className="flex-1"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Version</span>
        <Input
          value={formData.version || ''}
          onChange={e => handleInputChange('version', e.target.value)}
          placeholder="1.0.0"
          className="flex-1"
          disabled={loading}
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Team</span>
        <div className="flex-1">
          <TeamDropdown
            value={formData.team || ""}
            onChange={(value) => {
              if (typeof value === 'string') {
                handleInputChange('team', value);
              } else {
                handleInputChange('team', value.name);
              }
            }}
            placeholder="Select team member"
            disabled={loading}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-500 text-sm w-24 flex-shrink-0">Description</span>
        <Input
          value={formData.description || ''}
          onChange={e => handleInputChange('description', e.target.value)}
          placeholder="Enter subproduct description"
          className="flex-1"
          disabled={loading}
        />
      </div>
    </div>
  );
}

// Mode 2: Details Tab Content (Click-to-Edit Card)
function DetailsTabContent({
  draftSubproduct,
  editingField,
  setEditingField,
  editInputRef,
  handleInputChange,
  handleInputBlur,
  handleInputKeyPress,
  saving,
  productName,
}: {
  draftSubproduct: Partial<Subproduct>;
  editingField: keyof Subproduct | null;
  setEditingField: React.Dispatch<React.SetStateAction<keyof Subproduct | null>>;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleInputChange: (field: keyof Subproduct, value: any) => void;
  handleInputBlur: (field: keyof Subproduct) => void;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Subproduct) => void;
  saving: boolean;
  productName?: string | null;
}) {
  const fieldIconFor = (key: string) => {
    const iconClass = "h-4 w-4 text-gray-500 shrink-0";
    switch (key.toLowerCase()) {
      case 'status': return <Flag className={iconClass} />;
      case 'progress': return <Gauge className={iconClass} />;
      case 'product': return <Box className={iconClass} />;
      case 'team': return <Users className={iconClass} />;
      case 'days': return <Timer className={iconClass} />;
      case 'startdate':
      case 'targetdate':
      case 'completedon': return <CalendarDays className={iconClass} />;
      case 'remarks': return <StickyNote className={iconClass} />;
      case 'version': return <Tag className={iconClass} />;
      default: return <Info className={iconClass} />;
    }
  };

  const renderField = (label: string, field: keyof Subproduct, type: 'text' | 'number' | 'date' | 'select' | 'team' | 'readonly' = 'text') => (
    <div className="flex items-center gap-4 w-full">
      <div className="flex items-center w-40 min-w-[120px] gap-2 text-[13px] text-[#30363c] font-medium">
        {fieldIconFor(String(field))}
        <span>{label}</span>
      </div>
      <div className="flex-1">
        {type === 'readonly' ? (
          <span className="block text-gray-800 min-h-[28px] text-sm">{productName || 'Not assigned'}</span>
        ) : editingField === field ? (
          type === 'select' ? (
            <select
              ref={editInputRef as any}
              value={draftSubproduct[field] as string || ''}
              onChange={e => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              className="w-full px-3 py-1 border border-gray-300 rounded-md text-sm h-8"
              disabled={saving}
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Blocked">Blocked</option>
            </select>
          ) : type === 'team' ? (
            <TeamDropdown
              value={draftSubproduct.team || ""}
              onChange={(value) => {
                if (typeof value === 'string') {
                  handleInputChange('team', value);
                  handleInputChange('team_id', null);
                } else {
                  handleInputChange('team', value.name);
                  handleInputChange('team_id', value.id || null);
                }
              }}
              placeholder="Select team member"
              className="w-full"
              disabled={saving}
            />
          ) : (
            <Input
              ref={editInputRef}
              type={type}
              value={draftSubproduct[field] === null || draftSubproduct[field] === undefined ? '' : (type === 'date' ? String(draftSubproduct[field]).split('T')[0] : draftSubproduct[field] as any)}
              onChange={e => handleInputChange(field, e.target.value)}
              onBlur={() => handleInputBlur(field)}
              onKeyDown={e => handleInputKeyPress(e, field)}
              className="w-full text-sm h-8"
              disabled={saving}
            />
          )
        ) : (
          <span 
            className="block text-gray-800 min-h-[28px] text-sm cursor-pointer hover:bg-gray-50 rounded px-1 -ml-1 py-1 transition-colors" 
            onClick={() => setEditingField(field)}
          >
            {(draftSubproduct[field] as any) || 'Not assigned'}
          </span>
        )}
      </div>
    </div>
  );

  return (
    <div className="mt-2 flex flex-col gap-4 w-full">
      {renderField('Status', 'status', 'select')}
      {renderField('Progress (%)', 'progress', 'number')}
      {renderField('Product', 'product_id', 'readonly')}
      {renderField('Team', 'team', 'team')}
      {renderField('Days', 'days', 'number')}
      {renderField('Start Date', 'startdate', 'date')}
      {renderField('Target Date', 'targetdate', 'date')}
      {renderField('Completed On', 'completedon', 'date')}
      {renderField('Remarks', 'remarks', 'text')}
      {renderField('Version', 'version', 'text')}

      <div className="w-full mt-2">
        <Textarea
          value={draftSubproduct.description || ''}
          onChange={(e) => handleInputChange('description', e.target.value)}
          className="w-full text-sm min-h-[100px] bg-rose-50 border border-rose-200 focus:border-rose-300 focus:outline-none p-3"
          placeholder="Add a description..."
        />
      </div>
    </div>
  );
}

export const SubproductSidesheet: React.FC<SubproductSidesheetProps> = ({
  isOpen,
  onClose,
  subproductId,
  productId,
  onSubproductCreated,
  onSubproductUpdated,
  onSubproductDeleted,
  initialData
}) => {
  const [subproduct, setSubproduct] = useState<Partial<Subproduct> | null>(initialData || null);
  const [draftSubproduct, setDraftSubproduct] = useState<Partial<Subproduct>>(initialData || {
    name: '', status: 'Todo', progress: 0, version: '1.0.0', team: '', team_id: null, description: '', product_id: productId
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editingField, setEditingField] = useState<keyof Subproduct | null>(null);
  const [productName, setProductName] = useState<string | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  useEffect(() => {
    if (isOpen && nameInputRef.current && !subproductId) {
      nameInputRef.current.focus();
    }
  }, [isOpen, subproductId]);

  useEffect(() => {
    if (subproductId && isOpen) {
      if (initialData) {
        setSubproduct(initialData);
        setDraftSubproduct(initialData);
        if (initialData.product_id) fetchProductName(initialData.product_id);
      }
      fetchSubproduct();
    } else if (!subproductId && isOpen) {
      const emptyData = {
        name: '', status: 'Todo', progress: 0, version: '1.0.0', team: '', team_id: null, description: '', product_id: productId
      };
      setSubproduct(emptyData);
      setDraftSubproduct(emptyData);
      setActiveTab('details');
      fetchProductName(productId);
    }
  }, [subproductId, isOpen, productId, initialData]);

  const fetchProductName = async (id: string) => {
    try {
      const response = await fetch(`/api/product/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProductName(data.name);
      }
    } catch (error) {}
  };

  const fetchSubproduct = async () => {
    // Only show fetching spinner if we don't have initial data
    if (!initialData) {
      setFetching(true);
    }
    
    try {
      const response = await fetch(`/api/subproduct/${subproductId}`);
      if (!response.ok) throw new Error('Failed to fetch subproduct');
      const data = await response.json();
      
      // Update both original and draft
      setSubproduct(data);
      setDraftSubproduct(data);
      
      if (data.product_id) fetchProductName(data.product_id);
    } catch (error) {
      if (!initialData) {
        toast.error("Error fetching subproduct details");
      }
    } finally {
      setFetching(false);
    }
  };

  const handleInputChange = (field: keyof Subproduct, value: any) => {
    setDraftSubproduct(prev => {
      const updatedData = {
        ...prev,
        [field]: field === 'progress' ? parseInt(value) || 0 : value,
      };
      if (field === 'progress') {
        const progressValue = parseInt(value) || 0;
        let newStatus = prev.status;
        if (progressValue === 0) newStatus = 'Todo';
        else if (progressValue === 100) newStatus = 'Completed';
        else if (progressValue > 0 && progressValue < 100) newStatus = 'In Progress';
        updatedData.status = newStatus;
      }
      return updatedData;
    });
  };

  const handleInputBlur = (field: keyof Subproduct) => {
    setTimeout(() => {
      const activeElement = document.activeElement;
      const isSwitchingToEditableField = activeElement && 
        (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'SELECT');
      if (!isSwitchingToEditableField) {
        setEditingField(null);
      }
    }, 50);
  };

  const handleInputKeyPress = (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Subproduct) => {
    if (event.key === 'Enter') setEditingField(null);
    else if (event.key === 'Escape') {
      setDraftSubproduct(subproduct || {});
      setEditingField(null);
    }
  };

  const handleSubmit = async () => {
    if (!draftSubproduct.name) {
      toast.error("Subproduct name is required");
      return;
    }
    setLoading(true);
    try {
      const method = subproductId ? 'PUT' : 'POST';
      const url = subproductId ? `/api/subproduct/${subproductId}` : '/api/subproduct';
      const response = await fetch(url, {
        method, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draftSubproduct, product_id: productId }),
      });
      if (!response.ok) throw new Error(`Failed to ${subproductId ? 'update' : 'create'} subproduct`);
      const data = await response.json();
      if (subproductId) {
        onSubproductUpdated(data);
        toast.success("Subproduct updated successfully!");
      } else {
        onSubproductCreated(data);
        toast.success("Subproduct created successfully!");
      }
      onClose();
    } catch (error) {
      toast.error(`Error: ${error instanceof Error ? error.message : 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/subproduct/${subproductId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete subproduct');
      if (onSubproductDeleted) onSubproductDeleted(subproductId!);
      toast.success("Subproduct deleted successfully!");
      onClose();
    } catch (error) {
      toast.error("Error deleting subproduct");
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-lg w-full p-0 flex flex-col h-full overflow-hidden shadow-xl rounded-l-xl border-none">
          {/* Header */}
          <div className="flex-shrink-0 p-6 pb-2">
            <SheetHeader className="flex flex-col items-start gap-3">
              <div className="flex items-center justify-between w-full mb-2">
                <div className="relative w-full flex items-center">
                  {!subproductId ? (
                    <SheetTitle className="text-xl font-semibold text-blue-900">
                      Create New Subproduct
                    </SheetTitle>
                  ) : editingField === 'name' ? (
                    <Input
                      ref={editInputRef}
                      type="text"
                      value={draftSubproduct.name || ''}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      onBlur={() => handleInputBlur('name')}
                      onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                      className="w-full text-2xl font-bold border-2 border-blue-200 focus:border-blue-500 bg-blue-50 px-4 py-2 rounded h-12"
                    />
                  ) : (
                    <SheetTitle 
                      className="text-2xl font-bold text-blue-900 w-full cursor-pointer hover:text-blue-700 transition-colors"
                      onClick={() => setEditingField('name')}
                    >
                      {draftSubproduct.name || 'Loading...'}
                    </SheetTitle>
                  )}
                </div>
              </div>

              <div className="mt-2 border-b w-full flex gap-6">
                <SubproductTab label="Details" isActive={activeTab === 'details'} onClick={() => setActiveTab('details')} />
                <SubproductTab label="Insights" isActive={activeTab === 'insights'} onClick={() => setActiveTab('insights')} />
                <SubproductTab label="Portal" isActive={activeTab === 'portal'} onClick={() => setActiveTab('portal')} />
              </div>
            </SheetHeader>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 pb-4">
            {fetching && subproductId ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-6">
                {activeTab === 'details' && (
                  subproductId ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-4">
                      <DetailsTabContent
                        draftSubproduct={draftSubproduct}
                        editingField={editingField}
                        setEditingField={setEditingField}
                        editInputRef={editInputRef}
                        handleInputChange={handleInputChange}
                        handleInputBlur={handleInputBlur}
                        handleInputKeyPress={handleInputKeyPress}
                        saving={loading}
                        productName={productName}
                      />
                    </div>
                  ) : (
                    <CreateFormContent
                      formData={draftSubproduct}
                      handleInputChange={handleInputChange}
                      loading={loading}
                      nameInputRef={nameInputRef}
                    />
                  )
                )}

                {activeTab === 'insights' && (
                  <div className="p-8 text-gray-400 text-center italic border-2 border-dashed border-gray-100 rounded-xl mt-4">
                    Insights will appear after analysis.
                  </div>
                )}

                {activeTab === 'portal' && (
                  <div className="p-8 text-gray-400 text-center italic border-2 border-dashed border-gray-100 rounded-xl mt-4">
                    Portal configuration.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex-shrink-0 p-4 border-t bg-gray-50/50 flex justify-between items-center px-8">
            {subproductId && (
              <Button 
                type="button" 
                variant="destructive" 
                className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition-all flex items-center gap-2" 
                onClick={() => setShowDeleteDialog(true)} 
                disabled={loading}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            )}
            <div className="flex gap-3 ml-auto">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                disabled={loading}
                className="px-6 py-2 rounded-lg border-gray-300 hover:bg-white transition-all"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="px-8 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-200"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {subproductId ? 'Save Changes' : 'Create Subproduct'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Subproduct"
        description="Are you sure you want to delete this subproduct? This will also delete all its components and features. This action cannot be undone."
        confirmText="Delete Subproduct"
        variant="destructive"
        isLoading={loading}
      />
    </>
  );
};
