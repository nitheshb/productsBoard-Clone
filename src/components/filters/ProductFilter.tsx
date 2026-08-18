import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ChevronDown, Package } from 'lucide-react';
import type { Product } from '@/app/types';

interface ProductFilterProps {
  selectedProductIds: string[];
  availableProducts: Product[];
  onProductSelect: (ids: string[]) => void;
}

const NO_PRODUCT_VALUE = '__no_product__';

export function ProductFilter({
  selectedProductIds,
  availableProducts,
  onProductSelect,
}: ProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = (id: string) => {
    const next = selectedProductIds.includes(id)
      ? selectedProductIds.filter((p) => p !== id)
      : [...selectedProductIds, id];
    onProductSelect(next);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 bg-white hover:bg-gray-50 border-gray-300"
        >
          <Package className="h-4 w-4" />
          Product {selectedProductIds.length > 0 && `(${selectedProductIds.length})`}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className="w-64 max-h-80 overflow-y-auto bg-white"
      >
        <DropdownMenuLabel className="px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">
          Select Products
        </DropdownMenuLabel>

        <div className="max-h-56 overflow-y-auto">
          <DropdownMenuCheckboxItem
            checked={selectedProductIds.includes(NO_PRODUCT_VALUE)}
            onSelect={(e) => {
              e.preventDefault();
              toggle(NO_PRODUCT_VALUE);
            }}
            className="px-3 py-2 text-sm pl-8"
          >
            <span className="text-xs text-gray-500 italic">No Product</span>
          </DropdownMenuCheckboxItem>

          {availableProducts
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((product) => (
            <DropdownMenuCheckboxItem
              key={product.id}
              checked={selectedProductIds.includes(product.id)}
              onSelect={(e) => {
                e.preventDefault();
                toggle(product.id);
              }}
              className="px-3 py-2 text-sm pl-8"
            >
              <span className="text-sm truncate">{product.name}</span>
            </DropdownMenuCheckboxItem>
          ))}

          {availableProducts.length === 0 && (
            <div className="px-3 py-2 text-sm text-gray-500">No products yet</div>
          )}
        </div>

        {selectedProductIds.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="p-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onProductSelect([])}
                className="w-full text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Clear All
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export { NO_PRODUCT_VALUE };
