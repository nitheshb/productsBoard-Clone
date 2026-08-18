'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, Package, X } from 'lucide-react';
import type { Product } from '@/app/types';

interface ProductSelectProps {
  products: Product[];
  value: string[];
  onChange: (productIds: string[]) => void;
  onProductCreated?: (product: Product) => void;
}

function mergeProducts(a: Product[], b: Product[]): Product[] {
  const map = new Map<string, Product>();
  [...a, ...b].forEach((p) => {
    if (p?.id) map.set(p.id, p);
  });
  return Array.from(map.values());
}

export default function ProductSelect({
  products,
  value,
  onChange,
  onProductCreated,
}: ProductSelectProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [newName, setNewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  const allProducts = useMemo(
    () => mergeProducts(products, fetchedProducts),
    [products, fetchedProducts]
  );

  const selectedProducts = useMemo(
    () => allProducts.filter((p) => value.includes(p.id)),
    [allProducts, value]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));
    if (!q) return list;
    return list.filter((p) => p.name.toLowerCase().includes(q));
  }, [allProducts, query]);

  useEffect(() => {
    if (!open) {
      setQuery('');
      setNewName('');
      setCreateError('');
      return;
    }

    let cancelled = false;
    fetch('/api/product')
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && Array.isArray(data)) setFetchedProducts(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      setOpen(false);
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const toggleProduct = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((p) => p !== id));
      return;
    }
    onChange([...value, id]);
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      setCreateError('Product name is required');
      nameInputRef.current?.focus();
      return;
    }

    const existing = allProducts.find((p) => p.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      if (!value.includes(existing.id)) onChange([...value, existing.id]);
      setNewName('');
      return;
    }

    setIsCreating(true);
    setCreateError('');
    try {
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status: 'Todo' }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to create product');
      }
      if (!data?.id) {
        throw new Error('Product was created but no id was returned');
      }
      setFetchedProducts((prev) => mergeProducts(prev, [data]));
      onProductCreated?.(data);
      if (!value.includes(data.id)) onChange([...value, data.id]);
      setNewName('');
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create product');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="w-full min-h-10 px-3 py-1.5 rounded-md border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between gap-2"
      >
        <span className="flex flex-wrap items-center gap-1 min-w-0 flex-1 text-left">
          {selectedProducts.length === 0 ? (
            <span className="text-gray-500">Select products</span>
          ) : (
            selectedProducts.map((product) => (
              <span
                key={product.id}
                className="inline-flex items-center gap-1 max-w-[140px] text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded px-1.5 py-0.5"
              >
                <span className="truncate">{product.name}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleProduct(product.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleProduct(product.id);
                    }
                  }}
                  className="text-teal-500 hover:text-teal-800"
                  aria-label={`Remove ${product.name}`}
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <div className="p-2 border-b border-gray-100">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full h-8 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            <button
              type="button"
              onClick={() => onChange([])}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              <span className="text-gray-500 italic">No product</span>
              {value.length === 0 && <Check className="h-4 w-4 text-blue-600" />}
            </button>

            {filtered.map((product) => {
              const checked = value.includes(product.id);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => toggleProduct(product.id)}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between gap-2"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={`h-4 w-4 rounded border flex items-center justify-center shrink-0 ${
                        checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'
                      }`}
                    >
                      {checked && <Check className="h-3 w-3 text-white" />}
                    </span>
                    <Package className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="truncate">{product.name}</span>
                  </span>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <p className="px-3 py-2 text-sm text-gray-500">No products found.</p>
            )}
          </div>

          <div className="border-t border-gray-200 p-2 space-y-2">
            <input
              ref={nameInputRef}
              type="text"
              value={newName}
              onChange={(e) => {
                setNewName(e.target.value);
                if (createError) setCreateError('');
              }}
              placeholder="New product name"
              className="w-full h-8 px-3 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === 'Enter') {
                  e.preventDefault();
                  void handleCreate();
                }
              }}
            />
            {createError && <p className="text-xs text-red-500">{createError}</p>}
            <button
              type="button"
              disabled={isCreating}
              onClick={() => void handleCreate()}
              className="w-full h-8 inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isCreating ? 'Adding...' : 'Add new product'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
