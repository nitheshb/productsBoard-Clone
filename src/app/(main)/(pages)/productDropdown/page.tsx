// // ProductDropdown.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { ChevronDown } from 'lucide-react';
// import { Product } from '@/app/types';

// interface ProductDropdownProps {
//     onProductSelect: (productIds: string) => void;
   
// }

// const ProductDropdown: React.FC<ProductDropdownProps> = ({ onProductSelect }) => {
//     const [isOpen, setIsOpen] = useState(false);
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         fetchProducts();
//     }, []);



//     async function fetchProducts() {
//         try {
//             setLoading(true);
//             const { data: productsData, error: productsError } = await supabase
//                 .from('products')
//                 .select('id, name, created_at')
//                 .neq('name', 'Sample Product 1');
//             if (productsError) throw productsError;
//             setProducts(
//                 (productsData || []).map(product => ({
//                     ...product,
//                     created_at: product.created_at || new Date().toISOString(), // Add default created_at
//                     type: 'Product', // Set to 'Product' instead of 'defaultType'
//                 }))
//             );
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     }
    
//     return (
//         <div className="relative">
//             <button
//                 onClick={() => setIsOpen(!isOpen)}
//                 className="flex items-center gap-1 text-lg font-medium cursor-pointer"
//             >
//                 Products <ChevronDown className="h-4 w-4" />
//             </button>
//             {isOpen && (
//                 <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-10">
//                     {loading ? (
//                         <div className="p-2 text-sm text-gray-500">Loading...</div>
//                     ) : products.length > 0 ? (
//                         products.map((product) => (
//                             <button
//                                 key={product.id}
//                                 onClick={() => {
//                                     onProductSelect(product.id);
//                                     setIsOpen(false);
//                                 }}
//                                 className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 focus:outline-none"
//                             >
//                                 {product.name}
//                             </button>
//                         ))
//                     ) : (
//                         <div className="p-2 text-sm text-gray-500">No products found.</div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default ProductDropdown;

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  created_at: string;
  type?: string;
}

interface ProductDropdownProps {
  onProductSelect: (productId: string) => void;
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
      // In this example, we're using a local client-side mock
      // In a real app, you would use your supabase client
      const mockProducts = [
        { id: '1', name: 'Product 1', created_at: new Date().toISOString() },
        { id: '2', name: 'Product 2', created_at: new Date().toISOString() },
        { id: '3', name: 'Product 3', created_at: new Date().toISOString() },
      ];
      
      setProducts(mockProducts.map(product => ({
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
    onProductSelect(product.id);
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
                  onProductSelect('');
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