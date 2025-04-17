

// 'use client';
// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Product, Component, Feature } from '@/app/types';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation'; // Import the router
// import CreateProductModal from './_components/createModal'; // Import the modal

// interface TableItem {
//     type: 'product' | 'component' | 'feature';
//     id: string;
//     name: string;
//     level: number;
//     data: Product | Component | Feature;
//     children?: TableItem[];
// }

// interface ProductTableProps {
//     selectedProductIds: string[];
// }

// export default function ProductTable({ selectedProductIds }: ProductTableProps) {
//     const [allTableData, setAllTableData] = useState<TableItem[]>([]); // Store all fetched data
//     const [tableData, setTableData] = useState<TableItem[]>([]); // Data to be displayed
//     const [loading, setLoading] = useState(true);
//     const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//     const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);
//     const [newProductName, setNewProductName] = useState('');
//     const router = useRouter(); // Get the router instance
//     const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

//     useEffect(() => {
//         fetchProducts();
//     }, []);

//     useEffect(() => {
//         if (selectedProductIds.length > 0) {
//             const filteredData = allTableData.filter(item =>
//                 item.type === 'product' && selectedProductIds.includes(item.id)
//             );
//             setTableData(filteredData);
//         } else {
//             setTableData(allTableData);
//         }
//     }, [selectedProductIds, allTableData]);

//     const handleCreateProductClick = () => {
//         setIsCreatingNewProduct(true);
//         setIsModalOpen(true); // Open the modal
//     };

//     const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setNewProductName(e.target.value);
//     };

//     const handleCancelCreate = () => {
//         setIsCreatingNewProduct(false);
//         setNewProductName('');
//         setIsModalOpen(false); // Close the modal
//     };

//     async function fetchProducts() {
//         try {
//             setLoading(true);
//             const { data: productsData, error: productsError } = await supabase
//                 .from('products')
//                 .select('*')
//                 .neq('name', 'Sample Product 1');
//             if (productsError) throw productsError;
//             const initialTableData: TableItem[] = productsData.map(product => ({
//                 type: 'product' as const,
//                 id: product.id,
//                 name: product.name || 'Product',
//                 level: 0,
//                 data: product,
//             }));
//             setAllTableData(initialTableData); // Store all fetched products
//             setTableData(initialTableData); // Initially display all products
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function createNewProduct() {
//         if (newProductName.trim()) {
//             try {
//                 const { data, error } = await supabase
//                     .from('products')
//                     .insert([{ name: newProductName }])
//                     .select();

//                 if (error) throw error;

//                 if (data && data.length > 0) {
//                     const newProductItem: TableItem = {
//                         type: 'product',
//                         id: data[0].id,
//                         name: data[0].name,
//                         level: 0,
//                         data: data[0],
//                     };
//                     setAllTableData(prevData => [newProductItem, ...prevData]);
//                     setTableData(prevData => [newProductItem, ...prevData]); // Update displayed data as well
//                     setNewProductName('');
//                     setIsCreatingNewProduct(false);
//                     setIsModalOpen(false); // Close the modal after successful creation
//                     // Optionally refresh the product list in the dropdown if needed
//                 }
//             } catch (error) {
//                 console.error('Error creating product:', error);
//             }
//         }
//     }

//     async function fetchComponents(productId: string) {
//         const { data: componentsData, error: componentsError } = await supabase
//             .from('components')
//             .select('*')
//             .eq('product_id', productId);
//         if (componentsError) throw componentsError;
//         return componentsData.map(component => ({
//             type: 'component',
//             id: component.id,
//             name: component.name || 'Component',
//             level: 1,
//             data: component,
//         }));
//     }

//     async function fetchFeatures(componentId: string) {
//         const { data: featuresData, error: featuresError } = await supabase
//             .from('features')
//             .select('*')
//             .eq('component_id', componentId);
//         if (featuresError) throw featuresError;
//         return featuresData.map(feature => ({
//             type: 'feature',
//             id: feature.id,
//             name: feature.name || 'Feature',
//             level: 2,
//             data: feature,
//         }));
//     }

//     const toggleExpand = async (type: string, id: string, data: Product | Component) => {
//         setExpandedItems(prev => ({
//             ...prev,
//             [`${type}-${id}`]: !prev[`${type}-${id}`],
//         }));

//         if (type === 'product' && !expandedItems[`${type}-${id}`]) {
//             const components = await fetchComponents((data as Product).id);
//             setTableData(prevData =>
//                 prevData.map(item =>
//                     item.id === id
//                         ? { ...item, children: components as TableItem[] }
//                         : item
//                 )
//             );
//             setAllTableData(prevAllData =>
//                 prevAllData.map(item =>
//                     item.id === id
//                         ? { ...item, children: components as TableItem[] }
//                         : item
//                 )
//             );
//         } else if (type === 'component' && !expandedItems[`${type}-${id}`]) {
//             const features = await fetchFeatures((data as Component).id);
//             setTableData(prevData =>
//                 prevData.map(item =>
//                     item.type === 'product' && item.children
//                         ? {
//                             ...item,
//                             children: item.children.map(child =>
//                                 child.id === id
//                                     ? { ...child, children: features as TableItem[] }
//                                     : child
//                             ),
//                         }
//                         : item
//                 )
//             );
//             setAllTableData(prevAllData =>
//                 prevAllData.map(item =>
//                     item.type === 'product' && item.children
//                         ? {
//                             ...item,
//                             children: item.children.map(child =>
//                                 child.id === id
//                                     ? { ...child, children: features as TableItem[] }
//                                     : child
//                             ),
//                         }
//                         : item
//                 )
//             );
//         }
//     };

//     const isExpanded = (type: string, id: string) => {
//         return !!expandedItems[`${type}-${id}`];
//     };

//     const getFeatureColorClass = (index: number) => {
//         const colors = ['bg-yellow-400', 'bg-teal-400', 'bg-blue-500'];
//         return colors[index % colors.length];
//     };

//     const renderCreateProductButton = () => {
//         if (isCreatingNewProduct) {
//             return (
//                 <div className="flex items-center gap-2">
//                     <Input
//                         type="text"
//                         value={newProductName}
//                         onChange={handleProductNameChange}
//                         placeholder="Enter product name"
//                         className="w-48"
//                         onKeyDown={(e) => {
//                             if (e.key === 'Enter') {
//                                 createNewProduct();
//                             }
//                         }}
//                     />
//                     <Button onClick={createNewProduct} size="sm">Save</Button>
//                     <Button onClick={handleCancelCreate} variant="ghost" size="sm">Cancel</Button>
//                 </div>
//             );
//         } else {
//             return (
//                 <button onClick={handleCreateProductClick} className="flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900">
//                     <Plus size={20} />
//                     Create product
//                 </button>
//             );
//         }
//     };

//     const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
//         return children.map((child) => (
//             <div key={child.id}>
//                 <div
//                     className={`grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50`}
//                     style={{ paddingLeft: `${16 + child.level * 16}px` }}
//                     onClick={() => toggleExpand(child.type, child.id, child.data)}
//                 >
//                     <div className="col-span-3 flex items-center gap-2">
//                         {child.level < 2 && (
//                             isExpanded(child.type, child.id) ? (
//                                 <ChevronDown size={18} className="text-gray-500" />
//                             ) : (
//                                 <ChevronRight size={18} className="text-gray-500" />
//                             )
//                         )}
//                         <div className="flex items-center gap-2">
//                             {child.level === 1 && (
//                                 <span className="p-1 bg-gray-300 rounded-md">
//                                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                         <rect x="3" y="3" width="7" height="7" rx="1" />
//                                         <rect x="14" y="3" width="7" height="7" rx="1" />
//                                         <rect x="3" y="14" width="7" height="7" rx="1" />
//                                         <rect x="14" y="14" width="7" height="7" rx="1" />
//                                     </svg>
//                                 </span>
//                             )}
//                             {child.level === 2 && (
//                                 <span className={`p-1 ${getFeatureColorClass(tableData.find(p => p.children?.some(c => c.children?.some(f => f.id === child.id)))?.children?.find(c => c.children?.findIndex(f => f.id === child.id))?.children?.findIndex(f => f.id === child.id) ?? 0)} rounded-md w-4 h-4`}></span>
//                             )}
//                             {child.name}
//                         </div>
//                     </div>
//                     <div className="col-span-1 text-center">{child.data.status || ''}</div>
//                     <div className="col-span-1 text-center">{child.data.progress !== undefined ? `${child.data.progress}%` : ''}</div>
//                     <div className="col-span-1 text-center">{child.data.team || ''}</div>
//                     <div className="col-span-1 text-center">{child.data.days !== undefined ? child.data.days : ''}</div>
//                     <div className="col-span-1 text-center">{child.data.startDate || ''}</div>
//                     <div className="col-span-1 text-center">{child.data.targetDate || ''}</div>
//                     <div className="col-span-1 text-center">{child.data.completedOn || ''}</div>
//                     <div className="col-span-2">{child.data.remarks || ''}</div>
//                 </div>
//                 {child.children && isExpanded(child.type, child.id) && renderChildren(child.children)}
//             </div>
//         ));
//     };

//     if (loading) {
//         return <div className="flex justify-center p-10">Loading products...</div>;
//     }

//     return (
//         <div className="w-full">
//             <div className="bg-gray-100 border-b">
//                 <div className="grid grid-cols-12 py-3 px-4 font-medium text-gray-700 gap-x-4">
//                     <div className="col-span-3">Features list</div>
//                     <div className="col-span-1 text-center">Status</div>
//                     <div className="col-span-1 text-center">%</div>
//                     <div className="col-span-1 text-center">Team</div>
//                     <div className="col-span-1 text-center">Days</div>
//                     <div className="col-span-1 text-center">Start Date</div>
//                     <div className="col-span-1 text-center">Target Date</div>
//                     <div className="col-span-1 text-center">Completed On</div>
//                     <div className="col-span-2">Remarks</div>
//                 </div>
//             </div>

//             <div className="divide-y">
//                 {tableData.map((item) => (
//                     <div key={item.id}>
//                         <div
//                             className={`grid grid-cols-12 py-2 px-4 items-center cursor-pointer hover:bg-gray-50 gap-x-4`}
//                             style={{ paddingLeft: `${16 + item.level * 16}px` }}
//                             onClick={() => toggleExpand(item.type, item.id, item.data)}
//                         >
//                             <div className="col-span-3 flex items-center gap-2">
//                                 {item.level < 2 && (
//                                     isExpanded(item.type, item.id) ? (
//                                         <ChevronDown size={18} className="text-gray-500" />
//                                     ) : (
//                                         <ChevronRight size={18} className="text-gray-500" />
//                                     )
//                                 )}
//                                 <div className="flex items-center gap-2">
//                                     {item.level === 0 && (
//                                         <span className="p-1 bg-gray-300 rounded-md">
//                                             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                                             </svg>
//                                         </span>
//                                     )}
//                                     {item.name}
//                                 </div>
//                             </div>
//                             <div className="col-span-1 text-center">{item.data.status || ''}</div>
//                             <div className="col-span-1 text-center">{item.data.progress !== undefined ? `${item.data.progress}%` : ''}</div>
//                             <div className="col-span-1 text-center">{item.data.team || ''}</div>
//                             <div className="col-span-1 text-center">{item.data.days !== undefined ? item.data.days : ''}</div>
//                             <div className="col-span-1 text-center">{item.data.startDate || ''}</div>
//                             <div className="col-span-1 text-center">{item.data.targetDate || ''}</div>
//                             <div className="col-span-1 text-center">{item.data.completedOn || ''}</div>
//                             <div className="col-span-2">{item.data.remarks || ''}</div>
//                         </div>
//                         {item.children && isExpanded(item.type, item.id) && renderChildren(item.children)}
//                     </div>
//                 ))}
//             </div>

//             <div className="p-4 border-t">
//                 {renderCreateProductButton()}
//             </div>
//         </div>
//     );
// }


'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ChevronDown, ChevronRight, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Product, Component, Feature } from '@/app/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation'; // Import the router
import CreateProductModal from './_components/createModal'; // Import the modal

interface TableItem {
    type: 'product' | 'component' | 'feature';
    id: string;
    name: string;
    level: number;
    data: Product | Component | Feature;
    children?: TableItem[];
}

interface ProductTableProps {
    selectedProductIds: string[];
}

export default function ProductTable({ selectedProductIds }: ProductTableProps) {
    const [allTableData, setAllTableData] = useState<TableItem[]>([]); // Store all fetched data
    const [tableData, setTableData] = useState<TableItem[]>([]); // Data to be displayed
    const [loading, setLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [isCreatingNewProduct, setIsCreatingNewProduct] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const router = useRouter(); // Get the router instance
    const [isModalOpen, setIsModalOpen] = useState(false); // State for the modal

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (selectedProductIds.length > 0) {
            const filteredData = allTableData.filter(item =>
                item.type === 'product' && selectedProductIds.includes(item.id)
            );
            setTableData(filteredData);
        } else {
            setTableData(allTableData);
        }
    }, [selectedProductIds, allTableData]);

    const handleCreateProductClick = () => {
        setIsCreatingNewProduct(true);
        setIsModalOpen(true); // Open the modal
    };

    const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewProductName(e.target.value);
    };

    const handleCancelCreate = () => {
        setIsCreatingNewProduct(false);
        setNewProductName('');
        setIsModalOpen(false); // Close the modal
    };

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data: productsData, error: productsError } = await supabase
                .from('products')
                .select('*')
                .neq('name', 'Sample Product 1');
            if (productsError) throw productsError;
            const initialTableData: TableItem[] = productsData.map(product => ({
                type: 'product' as const,
                id: product.id,
                name: product.name || 'Product',
                level: 0,
                data: product,
            }));
            setAllTableData(initialTableData); // Store all fetched products
            setTableData(initialTableData); // Initially display all products
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createNewProduct() {
        if (newProductName.trim()) {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .insert([{ name: newProductName }])
                    .select();

                if (error) throw error;

                if (data && data.length > 0) {
                    const newProductItem: TableItem = {
                        type: 'product',
                        id: data[0].id,
                        name: data[0].name,
                        level: 0,
                        data: data[0],
                    };
                    setAllTableData(prevData => [newProductItem, ...prevData]);
                    setTableData(prevData => [newProductItem, ...prevData]); // Update displayed data as well
                    setNewProductName('');
                    setIsCreatingNewProduct(false);
                    setIsModalOpen(false); // Close the modal after successful creation
                    // Optionally refresh the product list in the dropdown if needed
                }
            } catch (error) {
                console.error('Error creating product:', error);
            }
        }
    }

    async function fetchComponents(productId: string) {
        const { data: componentsData, error: componentsError } = await supabase
            .from('components')
            .select('*')
            .eq('product_id', productId);
        if (componentsError) throw componentsError;
        return componentsData.map(component => ({
            type: 'component',
            id: component.id,
            name: component.name || 'Component',
            level: 1,
            data: component,
        }));
    }

    async function fetchFeatures(componentId: string) {
        const { data: featuresData, error: featuresError } = await supabase
            .from('features')
            .select('*')
            .eq('component_id', componentId);
        if (featuresError) throw featuresError;
        return featuresData.map(feature => ({
            type: 'feature',
            id: feature.id,
            name: feature.name || 'Feature',
            level: 2,
            data: feature,
        }));
    }

    const toggleExpand = async (type: string, id: string, data: Product | Component) => {
        setExpandedItems(prev => ({
            ...prev,
            [`${type}-${id}`]: !prev[`${type}-${id}`],
        }));

        if (type === 'product' && !expandedItems[`${type}-${id}`]) {
            const components = await fetchComponents((data as Product).id);
            setTableData(prevData =>
                prevData.map(item =>
                    item.id === id
                        ? { ...item, children: components as TableItem[] }
                        : item
                )
            );
            setAllTableData(prevAllData =>
                prevAllData.map(item =>
                    item.id === id
                        ? { ...item, children: components as TableItem[] }
                        : item
                )
            );
        } else if (type === 'component' && !expandedItems[`${type}-${id}`]) {
            const features = await fetchFeatures((data as Component).id);
            setTableData(prevData =>
                prevData.map(item =>
                    item.type === 'product' && item.children
                        ? {
                            ...item,
                            children: item.children.map(child =>
                                child.id === id
                                    ? { ...child, children: features as TableItem[] }
                                    : child
                            ),
                        }
                        : item
                )
            );
            setAllTableData(prevAllData =>
                prevAllData.map(item =>
                    item.type === 'product' && item.children
                        ? {
                            ...item,
                            children: item.children.map(child =>
                                child.id === id
                                    ? { ...child, children: features as TableItem[] }
                                    : child
                            ),
                        }
                        : item
                )
            );
        }
    };

    const isExpanded = (type: string, id: string) => {
        return !!expandedItems[`${type}-${id}`];
    };

    const getFeatureColorClass = (index: number) => {
        const colors = ['bg-yellow-400', 'bg-teal-400', 'bg-blue-500'];
        return colors[index % colors.length];
    };

    const renderCreateProductButton = () => {
        if (isCreatingNewProduct) {
            return (
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={newProductName}
                        onChange={handleProductNameChange}
                        placeholder="Enter product name"
                        className="w-48"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                createNewProduct();
                            }
                        }}
                    />
                    <Button onClick={createNewProduct} size="sm">Save</Button>
                    <Button onClick={handleCancelCreate} variant="ghost" size="sm">Cancel</Button>
                </div>
            );
        } else {
            return (
                <button onClick={handleCreateProductClick} className="flex items-center gap-2 text-gray-600 font-medium hover:text-gray-900">
                    <Plus size={20} />
                    Create product
                </button>
            );
        }
    };

    const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
        return children.map((child) => (
            <div key={child.id}>
                <div
                    className={`grid grid-cols-13 py-2 px-4 items-center hover:bg-gray-50`}
                    style={{ paddingLeft: `${16 + child.level * 16}px` }}
                    onClick={() => toggleExpand(child.type, child.id, child.data)}
                >
                    <div className="col-span-3 flex items-center gap-2">
                        {child.level < 2 && (
                            isExpanded(child.type, child.id) ? (
                                <ChevronDown size={18} className="text-gray-500" />
                            ) : (
                                <ChevronRight size={18} className="text-gray-500" />
                            )
                        )}
                        <div className="flex items-center gap-2">
                            {child.level === 1 && (
                                <span className="p-1 bg-gray-300 rounded-md">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" rx="1" />
                                        <rect x="14" y="3" width="7" height="7" rx="1" />
                                        <rect x="3" y="14" width="7" height="7" rx="1" />
                                        <rect x="14" y="14" width="7" height="7" rx="1" />
                                    </svg>
                                </span>
                            )}
                            {child.level === 2 && (
                                <span className={`p-1 ${getFeatureColorClass(tableData.find(p => p.children?.some(c => c.children?.some(f => f.id === child.id)))?.children?.find(c => c.children?.findIndex(f => f.id === child.id))?.children?.findIndex(f => f.id === child.id) ?? 0)} rounded-md w-4 h-4`}></span>
                            )}
                            {child.name}
                        </div>
                    </div>
                    <div className="col-span-1 text-center">{child.data.status || ''}</div>
                    <div className="col-span-1 text-center">{child.data.progress !== undefined ? `${child.data.progress}%` : ''}</div>
                    <div className="col-span-1 text-center">{child.data.team || ''}</div>
                    <div className="col-span-1 text-center">{child.data.days !== undefined ? child.data.days : ''}</div>
                    <div className="col-span-1 text-center">{child.data.startDate || ''}</div>
                    <div className="col-span-1 text-center">{child.data.targetDate || ''}</div>
                    <div className="col-span-1 text-center">{child.data.completedOn || ''}</div>
                    <div className="col-span-2">{child.data.remarks || ''}</div>
                    <div className="col-span-1 flex justify-center">
                        {child.level < 2 && (
                            <Plus size={20} className="text-gray-500 cursor-pointer" onClick={(e) => {
                                e.stopPropagation();
                                // Implement logic to add a new component/feature here
                                console.log(`Add new ${child.type === 'product' ? 'component' : 'feature'} to ${child.name} (${child.id})`);
                            }} />
                        )}
                    </div>
                </div>
                {child.children && isExpanded(child.type, child.id) && renderChildren(child.children)}
            </div>
        ));
    };

    if (loading) {
        return <div className="flex justify-center p-10">Loading products...</div>;
    }

    return (
        <div className="w-full">
            <div className="bg-gray-100 border-b">
                <div className="grid grid-cols-13 py-3 px-4 font-medium text-gray-700 gap-x-4">
                    <div className="col-span-3">Features list</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-center">%</div>
                    <div className="col-span-1 text-center">Team</div>
                    <div className="col-span-1 text-center">Days</div>
                    <div className="col-span-1 text-center">Start Date</div>
                    <div className="col-span-1 text-center">Target Date</div>
                    <div className="col-span-1 text-center">Completed On</div>
                    <div className="col-span-2">Remarks</div>
                    <div className="col-span-1 flex justify-center"></div>
                </div>
            </div>

            <div className="divide-y">
                {tableData.map((item) => (
                    <div key={item.id}>
                        <div
                            className={`grid grid-cols-13 py-2 px-4 items-center cursor-pointer hover:bg-gray-50 gap-x-4`}
                            style={{ paddingLeft: `${16 + item.level * 16}px` }}
                            onClick={() => toggleExpand(item.type, item.id, item.data)}
                        >
                            <div className="col-span-3 flex items-center gap-2">
                                {item.level < 2 && (
                                    isExpanded(item.type, item.id) ? (
                                        <ChevronDown size={18} className="text-gray-500" />
                                    ) : (
                                        <ChevronRight size={18} className="text-gray-500" />
                                    )
                                )}
                                <div className="flex items-center gap-2">
                                    {item.level === 0 && (
                                        <span className="p-1 bg-gray-300 rounded-md">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <rect x="3" y="3" width="18" height="18" rx="2" />
                                            </svg>
                                        </span>
                                    )}
                                    {item.name}
                                </div>
                            </div>
                            <div className="col-span-1 text-center">{item.data.status || ''}</div>
                            <div className="col-span-1 text-center">{item.data.progress !== undefined ? `${item.data.progress}%` : ''}</div>
                            <div className="col-span-1 text-center">{item.data.team || ''}</div>
                            <div className="col-span-1 text-center">{item.data.days !== undefined ? item.data.days : ''}</div>
                            <div className="col-span-1 text-center">{item.data.startDate || ''}</div>
                            <div className="col-span-1 text-center">{item.data.targetDate || ''}</div>
                            <div className="col-span-1 text-center">{item.data.completedOn || ''}</div>
                            <div className="col-span-2">{item.data.remarks || ''}</div>
                            <div className="col-span-1 flex justify-center">
                                <Plus size={20} className="text-gray-500 cursor-pointer" onClick={(e) => {
                                    e.stopPropagation();
                                    // Implement logic to add a new component to this product
                                    console.log(`Add new component to ${item.name} (${item.id})`);
                                }} />
                            </div>
                        </div>
                        {item.children && isExpanded(item.type, item.id) && renderChildren(item.children)}
                    </div>
                ))}
            </div>

            <div className="p-4 border-t">
                {renderCreateProductButton()}
            </div>
        </div>
    );
}