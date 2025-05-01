
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Trash2, MoreVertical } from 'lucide-react';
import { Product, Component as ComponentType } from '@/app/types'; // Assuming you have a Component type
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface ProductDetailsPageProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onProductUpdated: (updatedProduct: Product) => void;
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

function DetailsTabContent({ product, draftProduct, editingField, editInputRef, handleFieldHover, handleInputChange, handleInputBlur, handleInputKeyPress, handleComponentsInputChange }: {
  product: Product;
  draftProduct: Product;
  editingField: keyof Product | null;
  editInputRef: React.RefObject<HTMLInputElement>;
  handleFieldHover: (field: keyof Product) => void;
  handleInputChange: (field: keyof Product, value: any) => void;
  handleInputBlur: (field: keyof Product) => Promise<void>;
  handleInputKeyPress: (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Product) => Promise<void>;
  handleComponentsInputChange: (value: string) => void;
}) {
  return (
    <div className="mt-4 space-y-3">
      {(Object.keys(product) as (keyof Product)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'components').map((key) => (
        <div key={key} className="flex items-center gap-2">
          <span className="text-gray-500 w-24">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
          <div
            className="relative w-full"
            onMouseEnter={() => handleFieldHover(key)}
            onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
          >
            {editingField === key ? (
              <Input
                ref={editInputRef}
                type="text" // Adjust type based on the field
                value={draftProduct[key] !== null && draftProduct[key] !== undefined ? String(draftProduct[key]) : ''}
                onChange={(e) => handleInputChange(key, e.target.value)}
                onBlur={() => handleInputBlur(key)}
                onKeyDown={(e) => handleInputKeyPress(e, key)}
                className="w-full"
              />
            ) : (
              <span>{product[key] !== null && product[key] !== undefined ? String(product[key]) : 'Not assigned'}</span>
            )}
          </div>
        </div>
      ))}

      {product.components && (
        <div className="flex items-start gap-2">
          <span className="text-gray-500 w-24">Components</span>
          {editingField === 'components' ? (
            <Input
              type="text"
              value={(draftProduct.components ?? []).map((comp: ComponentType) => comp.name).join(', ') || ''}
              onChange={(e) => handleComponentsInputChange(e.target.value)}
              onBlur={() => handleInputBlur('components')}
              onKeyDown={(e) => handleInputKeyPress(e, 'components')}
              className="w-full"
            />
          ) : (
            <ul>
              {product.components.map((component: ComponentType) => (
                <li key={component.id}>{component.name}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function InsightsTabContent() {
  return <div>Content for Insights tab</div>;
}

function PortalTabContent() {
  return <div>Content for Portal tab</div>;
}

export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<keyof Product | null>(null);
  const [draftProduct, setDraftProduct] = useState<Product | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState('details');

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
    if (editingField === field && product && draftProduct && product[field] !== draftProduct[field]) {
      await saveChanges();
    }
    setEditingField(null);
  };

  const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Product) => {
    if (event.key === 'Enter' && editingField === field && product && draftProduct && product[field] !== draftProduct[field]) {
      await saveChanges();
      setEditingField(null);
    } else if (event.key === 'Escape') {
      setDraftProduct(product ? { ...product, id: product.id || '' } : null); // Revert changes
      setEditingField(null);
    }
  };

  const saveChanges = async () => {
    if (!draftProduct || !productId) return;
    try {
      // Optimistic update
      setProduct(draftProduct);
  
      const response = await fetch(`/api/product/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftProduct),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update product`);
      }
  
      const updatedProduct: Product = await response.json();
      setProduct(updatedProduct);
      setDraftProduct(updatedProduct);
    } catch (error) {
      if (error instanceof Error) {
        alert('Error updating product: ' + error.message);
      } else {
        alert('Error updating product: An unknown error occurred.');
      }
    }
  };
  

  const handleDelete = async () => {
    if (!productId) return;
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData?.error || `Failed to delete product`);
        }
        alert('Product deleted successfully!');
        onClose();
      } catch (error) {
        if (error instanceof Error) {
          alert('Error deleting product: ' + error.message);
        } else {
          alert('Error deleting product: An unknown error occurred.');
        }
      }
    }
  };

  const handleComponentsInputChange = (value: string) => {
    handleInputChange('components', value);
  };

  const handleTabChange = (tab: 'details' | 'insights' | 'portal') => {
    setActiveTab(tab);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product || !draftProduct) return <div>No product found</div>;

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
                {editingField === 'name' ? (
                  <Input
                    ref={editInputRef}
                    type="text"
                    value={draftProduct.name || ''}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    onBlur={() => handleInputBlur('name')}
                    onKeyDown={(e) => handleInputKeyPress(e, 'name')}
                    className="w-full text-lg font-semibold"
                  />
                ) : (
                  <SheetTitle className="text-lg font-semibold">{product.name}</SheetTitle>
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
                    Delete product
                  </DropdownMenuItem>
                  {/* Add other dropdown menu items here if needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Tab Navigation */}
            <div className="mt-2 border-b">
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
            <DetailsTabContent
              product={product}
              draftProduct={draftProduct}
              editingField={editingField}
              editInputRef={editInputRef}
              handleFieldHover={handleFieldHover}
              handleInputChange={handleInputChange}
              handleInputBlur={handleInputBlur}
              handleInputKeyPress={handleInputKeyPress}
              handleComponentsInputChange={handleComponentsInputChange}
            />
          )}
          {activeTab === 'insights' && <InsightsTabContent />}
          {activeTab === 'portal' && <PortalTabContent />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default ProductDetailsPage;