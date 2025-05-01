
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import { Component as ComponentType, Feature } from '@/app/types'; // Assuming these types exist
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ComponentDetailsPageProps {
  componentId: string;
  isOpen: boolean;
  onClose: () => void;
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

function DetailsTabContent({ component, draftComponent, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress }: {
  component: ComponentType;
  draftComponent: ComponentType;
  editingField: keyof ComponentType | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof ComponentType) => void;
  handleInputChange: (field: keyof ComponentType, value: any) => void;
  handleInputBlur: (field: keyof ComponentType) => Promise<void>;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof ComponentType) => Promise<void>;
}) {
  return (
    <div className="mt-4 space-y-3">
      {(Object.keys(component) as (keyof ComponentType)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'features').map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-gray-500 w-24">{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</span>
          <div
            className="relative w-full"
            onMouseEnter={() => handleFieldHover(key)}
            onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
          >
            {editingField === key ? (
              <Input
                ref={editInputRef}
                type="text" // Adjust type based on the field if necessary
                value={draftComponent[key] !== null && draftComponent[key] !== undefined ? String(draftComponent[key]) : ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onBlur={() => handleInputBlur(key)}
                onKeyDown={(e) => handleInputKeyPress(e, key)}
                className="w-full"
              />
            ) : (
              <span>{component[key] !== null && component[key] !== undefined ? String(component[key]) : 'Not assigned'}</span>
            )}
          </div>
        </div>
      ))}

      {component.features && component.features.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Features</h3>
          <ul className="space-y-1">
            {component.features.map((feature: Feature) => (
              <li key={feature.id} className="text-gray-600 p-2 hover:bg-gray-50 rounded-md">
                {feature.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function InsightsTabContent() {
  return <div>Content for Component Insights tab</div>;
}

function PortalTabContent() {
  return <div>Content for Component Portal tab</div>;
}

export function ComponentDetailsPage({ componentId, isOpen, onClose }: ComponentDetailsPageProps) {
  const [component, setComponent] = useState<ComponentType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof ComponentType | null>(null);
  const [draftComponent, setDraftComponent] = useState<ComponentType | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');

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
    if (editingField === field && component && draftComponent && component[field] !== draftComponent[field]) {
      await saveChanges();
    }
    setEditingField(null);
  };

  const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof ComponentType) => {
    if (event.key === 'Enter' && editingField === field && component && draftComponent && component[field] !== draftComponent[field]) {
      await saveChanges();
      setEditingField(null);
    } else if (event.key === 'Escape') {
      setDraftComponent(component ? { ...component, id: component.id || '' } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async () => {
    if (!draftComponent || !componentId) return;
    try {
      const response = await fetch(`/api/component/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftComponent),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update component`);
      }
      const data: ComponentType = await response.json();
      setComponent(data);
      setDraftComponent(data);
    } catch (error) {
      console.error('Error updating component:', error);
      if (error instanceof Error) {
        alert('Error updating component: ' + error.message);
      } else {
        alert('Error updating component: An unknown error occurred.');
      }
    }
  };

  const handleDelete = async () => {
    if (!componentId) return;
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        const response = await fetch(`/api/component/${componentId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete component`);
        }
        alert('Component deleted successfully!');
        onClose();
      } catch (error) {
        console.error('Error deleting component:', error);
        if (error instanceof Error) {
          alert('Error deleting component: ' + error.message);
        } else {
          alert('Error deleting component: An unknown error occurred.');
        }
      }
    }
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  if (!isOpen) return null;

  return (
    <div className="p-6">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          <SheetHeader className="flex flex-col items-start gap-2">
            <div className="flex items-center justify-between w-full">
              <div
                className="relative w-full"
                onMouseEnter={() => handleFieldHover('name')}
                onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
              >
                {loading ? (
                  <div className="animate-pulse h-6 w-2/3 bg-gray-200 rounded"></div>
                ) : error ? (
                  <div className="text-red-500">Error loading component</div>
                ) : editingField === 'name' ? (
                  <Input
                    ref={editInputRef}
                    type="text"
                    value={draftComponent?.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                    className="w-full text-lg font-semibold"
                  />
                ) : (
                  <SheetTitle className="text-lg font-semibold">{component?.name}</SheetTitle>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={4}>
                  <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete component
                  </DropdownMenuItem>
                  {/* Add other dropdown menu items here if needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tab Navigation */}
            <div className="mt-2 border-b">
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

          {/* Tab Content */}
          {loading ? (
            <div className="mt-4 space-y-3">
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
              editInputRef={editInputRef}
              handleFieldHover={handleFieldHover}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              handleInputKeyPress={handleInputKeyPress}
            />
          ) : (
            <div className="mt-4">No component data available</div>
          )}
          {activeTab === 'insights' && <InsightsTabContent />}
          {activeTab === 'portal' && <PortalTabContent />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ComponentDetailsPage;