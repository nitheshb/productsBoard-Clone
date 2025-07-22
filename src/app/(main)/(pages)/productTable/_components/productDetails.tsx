
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Product, Component as ComponentType } from '@/app/types'; // Assuming you have a Component type
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from "@/app/hooks/use-toast";
import { toast } from "sonner";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

interface ProductDetailsPageProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
  onProductDeleted?: () => void;
}

function ProductDetailsTab({ label, isActive, onClick }: { label: string; isActive: boolean; onClick: () => void }) {
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
  product,
  draftProduct,
  editingField,
  setEditingField,
  editInputRef,
  handleFieldHover,
  handleInputChange,
  handleInputBlur,
  handleInputKeyPress,
  handleComponentsInputChange,
  onSave, // <-- new prop
  saving, // <-- new prop
}: {
  product: Product;
  draftProduct: Product;
  editingField: keyof Product | null;
  setEditingField: React.Dispatch<React.SetStateAction<keyof Product | null>>;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof Product) => void;
  handleInputChange: (field: keyof Product, value: any) => void;
  handleInputBlur: (field: keyof Product) => Promise<void>;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Product) => Promise<void>;
  handleComponentsInputChange: (value: string) => void;
  onSave: () => Promise<void>;
  saving: boolean;
}) {
  return (
    <div className="mt-4 flex flex-col gap-6 w-full">
      {/* Status and Progress fields */}
      <div className="flex flex-col gap-6 w-full">
      <div className="flex items-center gap-8 w-full">
          <span className="text-black w-40 font-medium text-base">Status</span>
          <div className="flex-1">
            {editingField === 'status' ? (
              <select
                ref={editInputRef as any}
                value={draftProduct.status || ''}
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
              <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('status')}>{product.status || 'Not assigned'}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-8 w-full">
          <span className="text-black w-40 font-medium text-base">Progress (%)</span>
          <div className="flex-1">
            {editingField === 'progress' ? (
              <Input
                ref={editInputRef}
                type="number"
                min={0}
                max={100}
                value={draftProduct.progress === null || draftProduct.progress === undefined ? '' : draftProduct.progress}
                onChange={e => handleInputChange('progress', e.target.value)}
                onBlur={() => handleInputBlur('progress')}
                onKeyDown={e => handleInputKeyPress(e, 'progress')}
                className="w-full text-base h-10"
              />
            ) : (
              <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField('progress')}>{product.progress !== undefined && product.progress !== null ? product.progress : 'Not assigned'}</span>
            )}
          </div>
        </div>
      </div>
      {/* Other fields */}
      <div className="flex flex-col gap-6 w-full">
        {(Object.keys(product) as (keyof Product)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'components' && key !== 'progress' && key !== 'status').map((key) => {
          const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          const isDateField = ['startdate', 'targetdate', 'completedon'].includes(key.toLowerCase());
          return (
          <div key={key} className="flex items-center gap-8 w-full">
              <span className="text-black w-40 font-medium text-base">{label}</span>
              <div className="flex-1 relative">
              {editingField === key ? (
                  isDateField ? (
                    <Input
                      ref={editInputRef}
                      type="date"
                      value={typeof draftProduct[key] === 'string' ? draftProduct[key].slice(0, 10) : draftProduct[key] ? String(draftProduct[key]).slice(0, 10) : ''}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                      onBlur={() => handleInputBlur(key)}
                      onKeyDown={(e) => handleInputKeyPress(e, key)}
                      className="w-full text-base h-10"
                    />
                  ) : (
                <Input
                  ref={editInputRef}
                  type="text"
                  value={draftProduct[key] !== null && draftProduct[key] !== undefined ? String(draftProduct[key]) : ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  onBlur={() => handleInputBlur(key)}
                  onKeyDown={(e) => handleInputKeyPress(e, key)}
                      className="w-full text-base h-10"
                />
                  )
              ) : (
                  <span className="block text-gray-800 min-h-[28px] text-base cursor-pointer" onClick={() => setEditingField(key)}>{product[key] !== null && product[key] !== undefined ? String(product[key]) : 'Not assigned'}</span>
              )}
            </div>
          </div>
          );
        })}
      </div>
      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <Button
          onClick={onSave}
          disabled={saving}
          className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}

function InsightsTabContent() {
  return <div>Content for Insights tab</div>;
}

function PortalTabContent() {
  return <div>Content for Portal tab</div>;
}

export function ProductDetailsPage({ productId, isOpen, onClose, onProductUpdated, onProductDeleted }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Product | null>(null);
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { toast: showToast } = useToast();

  useEffect(() => {
    if (isOpen && productId) {
      const fetchProductDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`/api/product/${productId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
          }
          const data: Product = await response.json();
          setProduct(data);
          setDraftProduct({ ...data });
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    } else {
      setProduct(null);
      setDraftProduct(null);
      setEditingField(null);
      setActiveTab('details');
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if (editingField && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [editingField]);

  const handleFieldHover = (field: keyof Product) => {
    setEditingField(field);
  };

  const handleInputChange = (field: keyof Product, value: any) => {
    setDraftProduct(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleInputBlur = async (field: keyof Product) => {
    // Remove auto-save on blur
    setEditingField(null);
  };

  const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Product) => {
    if (event.key === 'Enter') {
      setEditingField(null);
    } else if (event.key === 'Escape') {
      setDraftProduct(product ? { ...product, id: product.id || '' } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async () => {
    if (!draftProduct || !productId) return;
    setSaving(true);
    try {
      // Optimistic update
      setProduct(draftProduct);
  
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draftProduct,
          startDate: draftProduct.startdate,
          targetDate: draftProduct.targetdate,
          completedOn: draftProduct.completedon,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update product`);
      }
  
      const updatedProduct: Product = await response.json();
      setProduct(updatedProduct);
      setDraftProduct(updatedProduct);
      if (onProductUpdated) {
        onProductUpdated(updatedProduct);
      }
      toast("Product updated successfully!");
      onClose();
    } catch (error) {
      if (error instanceof Error) {
        toast.error("Error updating product: " + error.message);
      } else {
        toast.error("Error updating product: An unknown error occurred.");
      }
    } finally {
      setSaving(false);
    }
  };
  

  const handleDelete = async () => {
    if (!productId) return;
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (!productId) return;
    setDeleting(true);
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete product`);
        }
      toast("Product deleted successfully!");
      if (typeof onProductDeleted === 'function') onProductDeleted();
        onClose();
      } catch (error) {
        if (error instanceof Error) {
        toast.error("Error deleting product: " + error.message);
        } else {
        toast.error("Error deleting product: An unknown error occurred.");
      }
    } finally {
      setDeleting(false);
    }
  };

  const handleComponentsInputChange = (value: string) => {
    handleInputChange('components', value);
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  if (loading) return null;
  if (error) return null;
  if (!product || !draftProduct) return null;

  return (
    <div className="p-6">
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="sm:max-w-2xl w-full max-w-2xl overflow-y-auto p-8 rounded-lg shadow-lg">
          <SheetHeader className="flex flex-col items-start gap-4 mb-4">
            <div className="flex items-center justify-between w-full mb-2">
              <div className="relative w-full flex items-center">
                <div className="flex-1 flex items-center">
                {editingField === 'name' ? (
                  <Input
                    ref={editInputRef}
                    type="text"
                    value={draftProduct.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                    className="w-full text-2xl font-bold border-2 border-blue-200 focus:border-blue-500 bg-blue-50 px-4 py-2 rounded"
                  />
                ) : (
                    <>
                      <SheetTitle className="text-2xl font-bold text-blue-900 w-full">{product.name}</SheetTitle>
                      <button
                        onClick={() => setEditingField('name')}
                        className="ml-2 p-2 rounded-full bg-gray-100 hover:bg-blue-100 text-blue-600 hover:text-blue-800 transition"
                        aria-label="Edit product name"
                        type="button"
                      >
                        <Pencil className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={handleDelete}
                        className="ml-2 p-2 rounded-full bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-800 transition"
                        aria-label="Delete product"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      Delete product
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="mt-2 border-b w-full flex gap-6">
              <ProductDetailsTab
                label="Details"
                isActive={activeTab === 'details'}
                onClick={() => handleTabChange('details')}
              />
              <ProductDetailsTab
                label="Insights"
                isActive={activeTab === 'insights'}
                onClick={() => handleTabChange('insights')}
              />
              <ProductDetailsTab
                label="Portal"
                isActive={activeTab === 'portal'}
                onClick={() => handleTabChange('portal')}
              />
            </div>
          </SheetHeader>

          {/* Tab Content */}
          {activeTab === 'details' && (
            <div className="bg-white rounded-lg shadow p-6 mt-2">
              <DetailsTabContent
                product={product}
                draftProduct={draftProduct}
                editingField={editingField}
                setEditingField={setEditingField}
                editInputRef={editInputRef}
                handleFieldHover={handleFieldHover}
                handleInputChange={handleInputChange}
                handleInputBlur={handleInputBlur}
                handleInputKeyPress={handleInputKeyPress}
                handleComponentsInputChange={handleComponentsInputChange}
                onSave={saveChanges}
                saving={saving}
              />
            </div>
          )}
          {activeTab === 'insights' && <InsightsTabContent />}
          {activeTab === 'portal' && <PortalTabContent />}
        </SheetContent>
      </Sheet>
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete Product"
        cancelText="Cancel"
        variant="destructive"
        isLoading={deleting}
      />
    </div>
  );
}

export default ProductDetailsPage;


