
'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  created_at: string;
  type?: string;
}

interface ProductDropdownProps {
  onProductSelect: (productId: any) => void;
}

const ProductDropdown: React.FC<ProductDropdownProps> = ({ onProductSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      setLoading(true);
      const res = await fetch('/api/product');
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data: Product[] = await res.json();
      setProducts(data.map(product => ({
        ...product,
        type: 'Product',
      })));
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product.name);
    onProductSelect([product.id]);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-lg font-medium cursor-pointer"
      >
        {selectedProduct || 'Products'} <ChevronDown className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10">
          {loading ? (
            <div className="p-2 text-sm text-gray-500">Loading...</div>
          ) : products.length > 0 ? (
            <>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  onProductSelect(products.map((product) => product.id));
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
              >
                All Products
              </button>
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
                >
                  {product.name}
                </button>
              ))}
            </>
          ) : (
            <div className="p-2 text-sm text-gray-500">No products found.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDropdown;