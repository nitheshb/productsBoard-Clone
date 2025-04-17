

// page.tsx
'use client';
import { useState } from 'react';
import ProductTable from '@/app/(main)/(pages)/productTable/page';
import { Search } from 'lucide-react';
import ProductDropdown from '@/app/(main)/(pages)/productDropdown/page'; // Import the dropdown

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const handleProductsSelect = (productId: string) => {
        setSelectedProductIds([productId]);
    };

    return (
        <main className="min-h-screen bg-white">
            <div className="max-w-8xl mx-auto">
                <header className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-gray-100 rounded-md">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" />
                            </svg>
                        </div>
                        <ProductDropdown onProductSelect={handleProductsSelect} /> {/* Use the dropdown */}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-64"
                            />
                        </div>

                        <button className="p-2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                            </svg>
                        </button>
                    </div>
                </header>

                <div className="flex items-center p-4 border-b">
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-1 px-3 py-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="4" y1="6" x2="20" y2="6" />
                                <line x1="4" y1="12" x2="20" y2="12" />
                                <line x1="4" y1="18" x2="20" y2="18" />
                            </svg>
                            Board controls
                        </button>

                        <button className="flex items-center gap-1 px-3 py-1.5">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                            </svg>
                            Filter
                        </button>
                    </div>
                </div>

                <div className="p-4">
                    <ProductTable selectedProductIds={selectedProductIds} /> {/* Pass selectedProductIds to ProductTable */}
                </div>
            </div>
        </main>
    );
}