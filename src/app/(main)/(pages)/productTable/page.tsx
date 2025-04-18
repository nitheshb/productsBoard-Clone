

// 'use client';

// import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { ArrowLeft, ChevronDown, ChevronRight, Maximize2, Plus } from 'lucide-react';
// import { Input } from '@/components/ui/input';
// import { Product, Component, Feature } from '@/app/types';
// import { Button } from '@/components/ui/button';
// import { useRouter } from 'next/navigation';
// import {
//     Sheet,
//     SheetClose,
//     SheetContent,
//     SheetDescription,
//     SheetFooter,
//     SheetHeader,
//     SheetTitle,
// } from "@/components/ui/sheet";
// import { Label } from "@/components/ui/label";
// import Link from 'next/link';

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

// interface CreateComponentModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     productId: string | null;
//     onComponentCreated: (component: any, productId: string) => void;
// }

// function CreateComponentModal({ isOpen, onClose, productId, onComponentCreated }: CreateComponentModalProps) {
//     const [formData, setFormData] = useState({
//         name: '',
//         status: 'Todo',
//         progress: 0,
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!productId) {
//             console.error('Product ID is null, cannot create component.');
//             return;
//         }

//         try {
//             const { data, error } = await supabase
//                 .from('components')
//                 .insert([{ name: formData.name, status: formData.status, progress: formData.progress, product_id: productId }])
//                 .select();

//             if (error) throw error;

//             if (data && data.length > 0) {
//                 onComponentCreated(data[0], productId);
//                 onClose();
//                 setFormData({
//                     name: '',
//                     status: 'Todo',
//                     progress: 0,
//                 });
//             }
//         } catch (error) {
//             console.error('Error creating component:', error);
//         }
//     };

//     return (
//         <Sheet open={isOpen} onOpenChange={onClose}>
//             <SheetContent>
//                 <SheetHeader>
//                     <SheetTitle>Create New Component</SheetTitle>
//                     <SheetDescription>
//                         Fill out the form below to create a new component.
//                     </SheetDescription>
//                 </SheetHeader>
//                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="name">Component Name</Label>
//                         <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//                     </div>
                    
                      
                    
//                     <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
//                         <SheetClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </SheetClose>
//                         <Button type="submit">Create</Button>
//                     </SheetFooter>
//                 </form>
//             </SheetContent>
//         </Sheet>
//     );
// }

// interface CreateFeatureModalProps {
//     isOpen: boolean;
//     onClose: () => void;
//     componentId: string | null;
//     onFeatureCreated: (feature: any, componentId: string) => void;
// }

// function CreateFeatureModal({ isOpen, onClose, componentId, onFeatureCreated }: CreateFeatureModalProps) {
//     const [formData, setFormData] = useState({
//         name: '',
//         status: 'Todo',
//         progress: 0,
//         team: '',
//         days: null,
//         startDate: null,
//         targetDate: null,
//         completedOn: null,
//         remarks: '',
//     });

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value === '' ? null : value,
//         }));
//     };

//     const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//         e.preventDefault();

//         if (!componentId) {
//             console.error('Component ID is null, cannot create feature.');
//             return;
//         }

//         try {
//             const { data, error } = await supabase
//                 .from('features')
//                 .insert([{ ...formData, component_id: componentId }])
//                 .select();

//             if (error) throw error;

//             if (data && data.length > 0) {
//                 onFeatureCreated(data[0], componentId);
//                 onClose();
//                 setFormData({
//                     name: '',
//                     status: 'Todo',
//                     progress: 0,
//                     team: '',
//                     days: null,
//                     startDate: null,
//                     targetDate: null,
//                     completedOn: null,
//                     remarks: '',
//                 });
//             }
//         } catch (error) {
//             console.error('Error creating feature:', error);
//         }
//     };

//     return (
//         <Sheet open={isOpen} onOpenChange={onClose}>
//             <SheetContent>
//                 <SheetHeader>
//                     <SheetTitle>Create New Feature</SheetTitle>
//                     <SheetDescription>
//                         Fill out the form below to create a new feature.
//                     </SheetDescription>
//                 </SheetHeader>
//                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
//                     <div className="space-y-2">
//                         <Label htmlFor="name">Feature Name</Label>
//                         <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
//                         <div className="space-y-2">
//                             <Label htmlFor="status">Status</Label>
//                             <select
//                                 id="status"
//                                 name="status"
//                                 value={formData.status}
//                                 onChange={handleChange}
//                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
//                             >
//                                 <option value="Todo">Todo</option>
//                                 <option value="In Progress">In Progress</option>
//                                 <option value="Completed">Completed</option>
//                                 <option value="Blocked">Blocked</option>
//                             </select>
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="progress">Progress (%)</Label>
//                             <Input
//                                 type="number"
//                                 id="progress"
//                                 name="progress"
//                                 value={formData.progress === null ? '' : formData.progress}
//                                 onChange={handleChange}
//                                 min={0}
//                                 max={100}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="team">Team</Label>
//                             <Input id="team" name="team" value={formData.team} onChange={handleChange} />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="days">Days</Label>
//                             <Input
//                                 type="number"
//                                 id="days"
//                                 name="days"
//                                 value={formData.days === null ? '' : formData.days}
//                                 onChange={handleChange}
//                                 min={0}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="startDate">Start Date</Label>
//                             <Input
//                                 type="date"
//                                 id="startDate"
//                                 name="startDate"
//                                 value={formData.startDate === null ? '' : formData.startDate}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="targetDate">Target Date</Label>
//                             <Input
//                                 type="date"
//                                 id="targetDate"
//                                 name="targetDate"
//                                 value={formData.targetDate === null ? '' : formData.targetDate}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="completedOn">Completed On</Label>
//                             <Input
//                                 type="date"
//                                 id="completedOn"
//                                 name="completedOn"
//                                 value={formData.completedOn === null ? '' : formData.completedOn}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div className="space-y-2">
//                             <Label htmlFor="remarks">Remarks</Label>
//                             <Input
//                                 id="remarks"
//                                 name="remarks"
//                                 value={formData.remarks}
//                                 onChange={handleChange}
//                                 className="min-h-[60px]"
//                             />
//                         </div>
//                     </div>
//                     <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
//                         <SheetClose asChild>
//                             <Button variant="outline">Cancel</Button>
//                         </SheetClose>
//                         <Button type="submit">Create</Button>
//                     </SheetFooter>
//                 </form>
//             </SheetContent>
//         </Sheet>
//     );
// }

// export default function ProductTable({ selectedProductIds }: ProductTableProps) {
//     const [allTableData, setAllTableData] = useState<TableItem[]>([]);
//     const [tableData, setTableData] = useState<TableItem[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
//     const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] = useState(false);
//     const [selectedProductIdForComponent, setSelectedProductIdForComponent] = useState<string | null>(null);
//     const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] = useState(false);
//     const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] = useState<string | null>(null);
//     const router = useRouter();
//     const [creatingProduct, setCreatingProduct] = useState(false);
//     const [newProductName, setNewProductName] = useState('');
//     const [creatingComponentForProduct, setCreatingComponentForProduct] = useState<string | null>(null);
//     const [newComponentName, setNewComponentName] = useState('');
//     const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(null);
//     const [activeTab, setActiveTab] = useState('details');
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
//         setCreatingProduct(true);
//     };


//     const handleProductSelection = (product: TableItem) => {
//       setSelectedProduct(product);
//     };
//     const handleCreateComponentClick = (productId: string) => {
//         setSelectedProductIdForComponent(productId);
//         setIsCreateComponentModalOpen(true);
//     };

//     const handleAddComponentAfter = (componentId: string) => {
//         setCreatingComponentForProduct(`AFTER_${componentId}`);
//     };

//     const handleCreateFeatureClick = (componentId: string) => {
//         setSelectedComponentIdForFeature(componentId);
//         setIsCreateFeatureModalOpen(true);
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
//             setAllTableData(initialTableData);
//             setTableData(initialTableData);
//         } catch (error) {
//             console.error('Error fetching products:', error);
//         } finally {
//             setLoading(false);
//         }
//     }

//     async function createNewProduct(name: string) {
//         try {
//             const { data, error } = await supabase
//                 .from('products')
//                 .insert([{ name }])
//                 .select();
//             if (error) throw error;
//             if (data && data.length > 0) {
//                 const newProduct = data[0];
//                 const newProductItem: TableItem = {
//                     type: 'product',
//                     id: newProduct.id,
//                     name: newProduct.name,
//                     level: 0,
//                     data: newProduct,
//                 };
//                 setAllTableData(prevData => [...prevData, newProductItem]);
//                 setTableData(prevData => [...prevData, newProductItem]);
//                 setCreatingProduct(false);
//                 setNewProductName('');
//             }
//         } catch (error) {
//             console.error('Error creating product:', error);
//         }
//     }

//     async function createNewComponent(newComponent: any, productId: string) {
//         try {
//             const newComponentItem: TableItem = {
//                 type: 'component',
//                 id: newComponent.id,
//                 name: newComponent.name,
//                 level: 1,
//                 data: newComponent,
//             };

//             setTableData(prevData =>
//                 prevData.map(item =>
//                     item.id === productId
//                         ? {
//                             ...item,
//                             children: [...(item.children || []), newComponentItem]
//                         }
//                         : item
//                 )
//             );

//             setAllTableData(prevData =>
//                 prevData.map(item =>
//                     item.id === productId
//                         ? {
//                             ...item,
//                             children: [...(item.children || []), newComponentItem]
//                         }
//                         : item
//                 )
//             );

//             setExpandedItems(prev => ({
//                 ...prev,
//                 [`product-${productId}`]: true
//             }));
            
//             setCreatingComponentForProduct(null);
//             setNewComponentName('');

//         } catch (error) {
//             console.error('Error handling component creation:', error);
//         }
//     }

//     async function createNewInlineComponent(name: string, productId: string) {
//         try {
//             const { data, error } = await supabase
//                 .from('components')
//                 .insert([{ name, product_id: productId }])
//                 .select();

//             if (error) throw error;

//             if (data && data.length > 0) {
//                 const newComponent = data[0];
//                 createNewComponent(newComponent, productId);
//             }
//         } catch (error) {
//             console.error('Error creating component:', error);
//         }
//     }

//     async function createNewFeature(newFeature: any, componentId: string) {
//         const newFeatureItem: TableItem = {
//             type: 'feature',
//             id: newFeature.id,
//             name: newFeature.name,
//             level: 2,
//             data: newFeature,
//         };

//         setTableData(prevData =>
//             prevData.map(item =>
//                 item.type === 'product' && item.children
//                     ? {
//                         ...item,
//                         children: item.children.map(child =>
//                             child.id === componentId
//                                 ? { ...child, children: [...(child.children || []), newFeatureItem] }
//                                 : child
//                         ),
//                     }
//                     : item
//             )
//         );

//         setAllTableData(prevData =>
//             prevData.map(item =>
//                 item.type === 'product' && item.children? {
//                   ...item,
//                   children: item.children.map(child =>
//                       child.id === componentId
//                           ? { ...child, children: [...(child.children || []), newFeatureItem] }
//                           : child
//                   ),
//               }
//               : item
//           )
//         );

//         setExpandedItems(prev => {
//             const updatedExpanded = { ...prev };
//             const parentProduct = allTableData.find(p => p.children?.some(c => c.id === componentId));
//             if (parentProduct) {
//                 updatedExpanded[`product-${parentProduct.id}`] = true;
//                 updatedExpanded[`component-${componentId}`] = true;
//             }
//             return updatedExpanded;
//         });

//         setIsCreateFeatureModalOpen(false);
//         setSelectedComponentIdForFeature(null);
//     }

//     async function fetchComponents(productId: string) {
//         try {
//             const { data: componentsData, error: componentsError } = await supabase
//                 .from('components')
//                 .select('*')
//                 .eq('product_id', productId);
                
//             if (componentsError) throw componentsError;
//             return componentsData.map(component => ({
//                 type: 'component' as const,
//                 id: component.id,
//                 name: component.name || 'Component',
//                 level: 1,
//                 data: component,
//             }));
//         } catch (error) {
//             console.error('Error fetching components:', error);
//             return [];
//         }
//     }

//     async function fetchFeatures(componentId: string) {
//         try {
//             const { data: featuresData, error: featuresError } = await supabase
//                 .from('features')
//                 .select('*')
//                 .eq('component_id', componentId);
                
//             if (featuresError) throw featuresError;
//             return featuresData.map(feature => ({
//                 type: 'feature' as const,
//                 id: feature.id,
//                 name: feature.name || 'Feature',
//                 level: 2,
//                 data: feature,
//             }));
//         } catch (error) {
//             console.error('Error fetching features:', error);
//             return [];
//         }
//     }

//     const toggleExpand = async (type: string, id: string, data: Product | Component) => {
//         const newExpandedState = !expandedItems[`${type}-${id}`];
//         setExpandedItems(prev => ({
//             ...prev,
//             [`${type}-${id}`]: newExpandedState,
//         }));

//         if (newExpandedState) {
//             if (type === 'product') {
//                 const product = tableData.find(item => item.id === id);
//                 if (!product?.children || product.children.length === 0) {
//                     const components = await fetchComponents(id);
                    
//                     setTableData(prevData =>
//                         prevData.map(item =>
//                             item.id === id
//                                 ? { ...item, children: components }
//                                 : item
//                         )
//                     );
                    
//                     setAllTableData(prevAllData =>
//                         prevAllData.map(item =>
//                             item.id === id
//                                 ? { ...item, children: components }
//                                 : item
//                         )
//                     );
//                 }
//             } else if (type === 'component') {
//                 let componentFound = false;
//                 const updatedTableData = tableData.map(product => {
//                     if (product.children) {
//                         const componentIndex = product.children.findIndex(comp => comp.id === id);
//                         if (componentIndex >= 0) {
//                             componentFound = true;
//                             if (!product.children[componentIndex].children) {
//                                 return {
//                                     ...product,
//                                     children: product.children.map(async (comp, i) => {
//                                         if (i === componentIndex) {
//                                             const features = await fetchFeatures(id);
//                                             return { ...comp, children: features };
//                                         }
//                                         return comp;
//                                     })
//                                 };
//                             }
//                         }
//                     }
//                     return product;
//                 });

//                 if (componentFound) {
//                     const features = await fetchFeatures(id);
                    
//                     setTableData(prevData =>
//                         prevData.map(product => {
//                             if (product.children) {
//                                 return {
//                                     ...product,
//                                     children: product.children.map(comp => 
//                                         comp.id === id
//                                             ? { ...comp, children: features }
//                                             : comp
//                                     )
//                                 };
//                             }
//                             return product;
//                         })
//                     );
                    
//                     setAllTableData(prevData =>
//                         prevData.map(product => {
//                             if (product.children) {
//                                 return {
//                                     ...product,
//                                     children: product.children.map(comp => 
//                                         comp.id === id
//                                             ? { ...comp, children: features }
//                                             : comp
//                                     )
//                                 };
//                             }
//                             return product;
//                         })
//                     );
//                 }
//             }
//         }
//     };

//     const isExpanded = (type: string, id: string) => {
//         return !!expandedItems[`${type}-${id}`];
//     };

//     const getFeatureColorClass = (index: number) => {
//         const colors = ['bg-yellow-400', 'bg-teal-400', 'bg-blue-500'];
//         return colors[index % colors.length];
//     };

//     const handleSaveNewProduct = () => {
//         if (newProductName.trim()) {
//             createNewProduct(newProductName.trim());
//         }
//     };

//     const handleCancelNewProduct = () => {
//         setCreatingProduct(false);
//         setNewProductName('');
//     };

//     const handleSaveNewComponent = (productId: string) => {
//         if (newComponentName.trim()) {
//             createNewInlineComponent(newComponentName.trim(), productId);
//         }
//     };

//     const handleCancelNewComponent = () => {
//         setCreatingComponentForProduct(null);
//         setNewComponentName('');
//     };


//     const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
//       return children.map((child) => (
//           <div key={child.id}>
//               <div
//                   className={`grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50`}
//                   style={{ paddingLeft: `${16 + child.level * 16}px` }}
//               >
//                   <div className="col-span-3 flex items-center gap-2">
//                       <div
//                           className="flex items-center gap-2 cursor-pointer"
//                           onClick={() => {
//                               if (child.type === 'product' || child.type === 'component') {
//                                   if (child.type === 'product' || child.type === 'component') {
//                                       toggleExpand(child.type, child.id, child.data);
//                                   }
//                               }
//                           }}
//                       >
//                           {child.level < 2 && (
//                               isExpanded(child.type, child.id) ? (
//                                   <ChevronDown size={18} className="text-gray-500" />
//                               ) : (
//                                   <ChevronRight size={18} className="text-gray-500" />
//                               )
//                           )}
//                           <div className="flex items-center gap-2">
//                               {child.level === 1 && (
//                                   <span className="p-1 bg-gray-300 rounded-md">
//                                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                           <rect x="3" y="3" width="7" height="7" rx="1" />
//                                           <rect x="14" y="3" width="7" height="7" rx="1" />
//                                           <rect x="3" y="14" width="7" height="7" rx="1" />
//                                           <rect x="14" y="14" width="7" height="7" rx="1" />
//                                       </svg>
//                                   </span>
                                  
//                               )}
//                               {child.level === 2 && (
//                                   <span className={`p-1 ${getFeatureColorClass(0)} rounded-md w-4 h-4`}></span>
//                               )}
//                               {child.name}
//                           </div>
//                       </div>
                      
//                       {/* Add the Plus button only for components (level 1) to create features */}
//                       {child.level === 1 && (
//                           <button
//                               onClick={(e) => {
//                                   e.stopPropagation();
//                                   handleCreateFeatureClick(child.id);
//                               }}
//                               className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//                           >
//                               <Plus size={16} className="text-gray-500" />
//                           </button>
//                       )}
//                   </div>
//                   <div className="col-span-1 text-center">{child.data.status || ''}</div>
//                   <div className="col-span-1 text-center">{child.data.progress !== undefined ? `${child.data.progress}%` : ''}</div>
//                   <div className="col-span-1 text-center">{child.data.team || ''}</div>
//                   <div className="col-span-1 text-center">{child.data.days !== undefined ? child.data.days : ''}</div>
//                   <div className="col-span-1 text-center">{child.data.startDate || ''}</div>
//                   <div className="col-span-1 text-center">{child.data.targetDate || ''}</div>
//                   <div className="col-span-1 text-center">{child.data.completedOn || ''}</div>
//                   <div className="col-span-2">{child.data.remarks || ''}</div>
//               </div>
//               {child.children && isExpanded(child.type, child.id) && renderChildren(child.children)}
              
//               {child.level === 1 && creatingComponentForProduct === `AFTER_${child.id}` && (
//                   <div 
//                       className="grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50"
//                       style={{ paddingLeft: `${16 + child.level * 16}px` }}
//                   >
//                       <div className="col-span-3 flex items-center gap-2">
//                           <Input
//                               type="text"
//                               placeholder="Enter component name"
//                               value={newComponentName}
//                               onChange={(e) => setNewComponentName(e.target.value)}
//                               className="w-48"
//                           />
//                           <Button 
//                               size="sm" 
//                               onClick={() => {
//                                   const productId = tableData.find(p => 
//                                       p.children?.some(c => c.id === child.id)
//                                   )?.id;
//                                   if (productId) {
//                                       handleSaveNewComponent(productId);
//                                   }
//                               }}
//                           >
//                               Save
//                           </Button>
//                           <Button 
//                               size="sm" 
//                               variant="outline" 
//                               onClick={handleCancelNewComponent}
//                           >
//                               Cancel
//                           </Button>
//                       </div>
//                   </div>
//               )}
//           </div>
//       ));
//   };




// if (loading) {
//   return <div className="flex justify-center p-10">Loading products...</div>;
// }

// return (
//   <div className="w-full flex">
//       {/* Left Side - Product Table */}
//       <div className={`${selectedProduct ? 'w-1/2' : 'w-full'} transition-all duration-300`}>
//           <CreateFeatureModal
//               isOpen={isCreateFeatureModalOpen}
//               onClose={() => setIsCreateFeatureModalOpen(false)}
//               componentId={selectedComponentIdForFeature}
//               onFeatureCreated={createNewFeature}
//           />

//           <CreateComponentModal
//               isOpen={isCreateComponentModalOpen}
//               onClose={() => setIsCreateComponentModalOpen(false)}
//               productId={selectedProductIdForComponent}
//               onComponentCreated={createNewComponent}
//           />

//           <div className="bg-gray-100 border-b">
//               <div className="grid grid-cols-12 py-3 px-4 font-medium text-gray-700 gap-x-4">
//                   <div className="col-span-3">Features list</div>
//                   <div className="col-span-1 text-center">Status</div>
//                   <div className="col-span-1 text-center">%</div>
//                   <div className="col-span-1 text-center">Team</div>
//                   <div className="col-span-1 text-center">Days</div>
//                   <div className="col-span-1 text-center">Start Date</div>
//                   <div className="col-span-1 text-center">Target Date</div>
//                   <div className="col-span-1 text-center">Completed On</div>
//                   <div className="col-span-2">Remarks</div>
//               </div>
//           </div>

//           <div className="divide-y">
//               {tableData.map((item) => (
//                   <div key={item.id}>
//                       <div
//                           className={`grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${selectedProduct?.id === item.id ? 'bg-blue-50' : ''}`}
//                           style={{ paddingLeft: `${16 + item.level * 16}px` }}
//                       >
//                           <div className="col-span-3 flex items-center gap-2">
//                               <div
//                                   className="flex items-center gap-2 cursor-pointer"
//                                   onClick={() => toggleExpand(item.type, item.id, item.data)}
//                               >
//                                   {item.level < 2 && (
//                                       isExpanded(item.type, item.id) ? (
//                                           <ChevronDown size={18} className="text-gray-500" />
//                                       ) : (
//                                           <ChevronRight size={18} className="text-gray-500" />
//                                       )
//                                   )}
//                                   <div className="flex items-center gap-2">
//                                       {item.level === 0 && (
//                                           <span className="p-1 bg-gray-300 rounded-md">
//                                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                                   <rect x="3" y="3" width="18" height="18" rx="2" />
//                                               </svg>
//                                           </span>
//                                       )}
//                                       <span 
//                                           className={`cursor-pointer ${item.type === 'product' ? 'hover:text-blue-600' : ''}`}
//                                           onClick={(e) => {
//                                               if (item.type === 'product') {
//                                                   e.stopPropagation();
//                                                   handleProductSelection(item);
//                                               }
//                                           }}
//                                       >
//                                           {item.name}
//                                       </span>
//                                   </div>
//                               </div>
                              
//                               {item.level === 0 && (
//                                   <button
//                                       onClick={(e) => {
//                                           e.stopPropagation();
//                                           handleCreateComponentClick(item.id);
//                                       }}
//                                       className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//                                   >
//                                       <Plus size={16} className="text-gray-500" />
//                                   </button>
//                               )}
//                               {creatingComponentForProduct === item.id && (
//                                   <>
//                                       <Input
//                                           type="text"
//                                           placeholder="Enter component name"
//                                           value={newComponentName}
//                                           onChange={(e) => setNewComponentName(e.target.value)}
//                                           className="ml-2 w-48"
//                                       />
//                                       <Button size="sm" onClick={() => handleSaveNewComponent(item.id)}>Save</Button>
//                                       <Button size="sm" variant="outline" onClick={handleCancelNewComponent}>Cancel</Button>
//                                   </>
//                               )}
//                           </div>
//                           <div className="col-span-1 text-center">{item.data.status || ''}</div>
//                           <div className="col-span-1 text-center">{item.data.progress !== undefined ? `${item.data.progress}%` : ''}</div>
//                           <div className="col-span-1 text-center">{item.data.team || ''}</div>
//                           <div className="col-span-1 text-center">{item.data.days !== undefined ? item.data.days : ''}</div>
//                           <div className="col-span-1 text-center">{item.data.startDate || ''}</div>
//                           <div className="col-span-1 text-center">{item.data.targetDate || ''}</div>
//                           <div className="col-span-1 text-center">{item.data.completedOn || ''}</div>
//                           <div className="col-span-2">{item.data.remarks || ''}</div>
//                       </div>
//                       {item.children && isExpanded(item.type, item.id) && renderChildren(item.children)}
//                   </div>
//               ))}
//           </div>

//           <div className="mt-4 px-4">
//               {creatingProduct ? (
//                   <div className="grid grid-cols-12 py-2 items-center hover:bg-gray-50">
//                       <div className="col-span-3 flex items-center gap-2">
//                           <Input
//                               type="text"
//                               placeholder="Enter product name"
//                               value={newProductName}
//                               onChange={(e) => setNewProductName(e.target.value)}
//                           />
//                           <Button size="sm" onClick={handleSaveNewProduct}>Save</Button>
//                           <Button size="sm" variant="outline" onClick={handleCancelNewProduct}>Cancel</Button>
//                       </div>
//                   </div>
//               ) : (
//                   <Button onClick={handleCreateProductClick}>
//                       <Plus className="mr-2 h-4 w-4" />
//                       Add Product
//                   </Button>
//               )}
//           </div>
//       </div>

//       {/* Right Side - Product Details */}
//       {selectedProduct && selectedProduct.type === 'product' && (
//           <div className="w-1/2 border-l border-gray-200">
//               <div className="p-4">
//                   {/* Header */}
//                   <div className="flex items-center justify-between mb-6">
//                       <div className="flex items-center gap-2">
//                           <button 
//                               onClick={() => setSelectedProduct(null)}
//                               className="text-gray-500 hover:text-gray-700"
//                           >
//                               <ArrowLeft size={18} />
//                           </button>
//                           <span className="p-1 bg-gray-300 rounded-md">
//                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                                   <rect x="3" y="3" width="18" height="18" rx="2" />
//                               </svg>
//                           </span>
//                           <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
//                       </div>
//                       <div className="flex items-center gap-2">
//                           <button className="p-1 text-gray-500 hover:text-gray-700">
//                               <Maximize2 size={18} />
//                           </button>
//                           <button className="p-1 text-gray-500 hover:text-gray-700">⋯</button>
//                           <button 
//                               className="p-1 text-gray-500 hover:text-gray-700"
//                               onClick={() => setSelectedProduct(null)}
//                           >
//                               ✕
//                           </button>
//                       </div>
//                   </div>
                  
//                   {/* Tabs */}
//                   <div className="border-b">
//                       <div className="flex">
//                           <button 
//                               className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//                               onClick={() => setActiveTab('details')}
//                           >
//                               Details
//                           </button>
//                           <button 
//                               className={`px-4 py-2 ${activeTab === 'insights' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//                               onClick={() => setActiveTab('insights')}
//                           >
//                               Insights
//                           </button>
//                           <button 
//                               className={`px-4 py-2 ${activeTab === 'portal' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
//                               onClick={() => setActiveTab('portal')}
//                           >
//                               Portal
//                           </button>
//                       </div>
//                   </div>
                  
//                   {/* Tab Content */}
//                   {activeTab === 'details' && (
//                       <div className="mt-6">
//                           <div className="flex items-center justify-between mb-4">
//                               <h3 className="text-lg font-medium">Fields</h3>
//                               <button className="text-gray-500">🔍</button>
//                           </div>
                          
//                           {/* Fields display */}
//                           <div className="space-y-4">
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Owner</span>
//                                   </div>
//                                   <div className="flex items-center gap-2">
//                                       <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
//                                           Nikitha
//                                       </span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Tags</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Business Value</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Business Value Score</span>
//                                   </div>
//                                   <div>
//                                       <input 
//                                           type="text" 
//                                           placeholder="Not assigned" 
//                                           className="border border-gray-300 rounded px-3 py-1 text-sm"
//                                       />
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Design Assets</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Designer</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Development</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
                              
//                               <div className="flex justify-between items-center">
//                                   <div className="flex items-center gap-2">
//                                       <span className="text-gray-600">Effort</span>
//                                   </div>
//                                   <div>
//                                       <span className="text-gray-500">Not assigned</span>
//                                   </div>
//                               </div>
//                           </div>
//                       </div>
//                   )}
                  
//                   {activeTab === 'insights' && (
//                       <div className="mt-6">
//                           <h3 className="text-lg font-medium mb-4">Insights</h3>
//                           <p className="text-gray-600">Product insights will be displayed here.</p>
//                       </div>
//                   )}
                  
//                   {activeTab === 'portal' && (
//                       <div className="mt-6">
//                           <h3 className="text-lg font-medium mb-4">Portal</h3>
//                           <p className="text-gray-600">Portal information will be displayed here.</p>
//                       </div>
//                   )}
//               </div>
//           </div>
//       )}
//   </div>
// );
// }




'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ArrowLeft, ChevronDown, ChevronRight, Maximize2, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Product, Component, Feature } from '@/app/types';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import Link from 'next/link';
import { ProductDetailsPage } from './_components/productDetails';

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

interface CreateComponentModalProps {
    isOpen: boolean;
    onClose: () => void;
    productId: string | null;
    onComponentCreated: (component: any, productId: string) => void;
}

function CreateComponentModal({ isOpen, onClose, productId, onComponentCreated }: CreateComponentModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        status: 'Todo',
        progress: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!productId) {
            console.error('Product ID is null, cannot create component.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('components')
                .insert([{ name: formData.name, status: formData.status, progress: formData.progress, product_id: productId }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                onComponentCreated(data[0], productId);
                onClose();
                setFormData({
                    name: '',
                    status: 'Todo',
                    progress: 0,
                });
            }
        } catch (error) {
            console.error('Error creating component:', error);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create New Component</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to create a new component.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Component Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    
                      
                    
                    <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit">Create</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

interface CreateFeatureModalProps {
    isOpen: boolean;
    onClose: () => void;
    componentId: string | null;
    onFeatureCreated: (feature: any, componentId: string) => void;
}

function CreateFeatureModal({ isOpen, onClose, componentId, onFeatureCreated }: CreateFeatureModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        status: 'Todo',
        progress: 0,
        team: '',
        days: null,
        startDate: null,
        targetDate: null,
        completedOn: null,
        remarks: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? null : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!componentId) {
            console.error('Component ID is null, cannot create feature.');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('features')
                .insert([{ ...formData, component_id: componentId }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                onFeatureCreated(data[0], componentId);
                onClose();
                setFormData({
                    name: '',
                    status: 'Todo',
                    progress: 0,
                    team: '',
                    days: null,
                    startDate: null,
                    targetDate: null,
                    completedOn: null,
                    remarks: '',
                });
            }
        } catch (error) {
            console.error('Error creating feature:', error);
        }
    };

    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Create New Feature</SheetTitle>
                    <SheetDescription>
                        Fill out the form below to create a new feature.
                    </SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Feature Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Todo">Todo</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="progress">Progress (%)</Label>
                            <Input
                                type="number"
                                id="progress"
                                name="progress"
                                value={formData.progress === null ? '' : formData.progress}
                                onChange={handleChange}
                                min={0}
                                max={100}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="team">Team</Label>
                            <Input id="team" name="team" value={formData.team} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="days">Days</Label>
                            <Input
                                type="number"
                                id="days"
                                name="days"
                                value={formData.days === null ? '' : formData.days}
                                onChange={handleChange}
                                min={0}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                                type="date"
                                id="startDate"
                                name="startDate"
                                value={formData.startDate === null ? '' : formData.startDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetDate">Target Date</Label>
                            <Input
                                type="date"
                                id="targetDate"
                                name="targetDate"
                                value={formData.targetDate === null ? '' : formData.targetDate}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="completedOn">Completed On</Label>
                            <Input
                                type="date"
                                id="completedOn"
                                name="completedOn"
                                value={formData.completedOn === null ? '' : formData.completedOn}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Input
                                id="remarks"
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                className="min-h-[60px]"
                            />
                        </div>
                    </div>
                    <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
                        <SheetClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </SheetClose>
                        <Button type="submit">Create</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}

export default function ProductTable({ selectedProductIds }: ProductTableProps) {
    const [allTableData, setAllTableData] = useState<TableItem[]>([]);
    const [tableData, setTableData] = useState<TableItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
    const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] = useState(false);
    const [selectedProductIdForComponent, setSelectedProductIdForComponent] = useState<string | null>(null);
    const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] = useState(false);
    const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] = useState<string | null>(null);
    const router = useRouter();
    const [creatingProduct, setCreatingProduct] = useState(false);
    const [newProductName, setNewProductName] = useState('');
    const [creatingComponentForProduct, setCreatingComponentForProduct] = useState<string | null>(null);
    const [newComponentName, setNewComponentName] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(null);
    const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('details');


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
        setCreatingProduct(true);
    };


    const handleProductSelection = (product: TableItem) => {
        setSelectedProduct(product);
        setIsProductDetailOpen(true);
    };


    const handleCloseProductDetails = () => {
        setIsProductDetailOpen(false);
    };
    
    const handleCreateComponentClick = (productId: string) => {
        setSelectedProductIdForComponent(productId);
        setIsCreateComponentModalOpen(true);
    };

    const handleAddComponentAfter = (componentId: string) => {
        setCreatingComponentForProduct(`AFTER_${componentId}`);
    };

    const handleCreateFeatureClick = (componentId: string) => {
        setSelectedComponentIdForFeature(componentId);
        setIsCreateFeatureModalOpen(true);
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
            setAllTableData(initialTableData);
            setTableData(initialTableData);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }

    async function createNewProduct(name: string) {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{ name }])
                .select();
            if (error) throw error;
            if (data && data.length > 0) {
                const newProduct = data[0];
                const newProductItem: TableItem = {
                    type: 'product',
                    id: newProduct.id,
                    name: newProduct.name,
                    level: 0,
                    data: newProduct,
                };
                setAllTableData(prevData => [...prevData, newProductItem]);
                setTableData(prevData => [...prevData, newProductItem]);
                setCreatingProduct(false);
                setNewProductName('');
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    async function createNewComponent(newComponent: any, productId: string) {
        try {
            const newComponentItem: TableItem = {
                type: 'component',
                id: newComponent.id,
                name: newComponent.name,
                level: 1,
                data: newComponent,
            };

            setTableData(prevData =>
                prevData.map(item =>
                    item.id === productId
                        ? {
                            ...item,
                            children: [...(item.children || []), newComponentItem]
                        }
                        : item
                )
            );

            setAllTableData(prevData =>
                prevData.map(item =>
                    item.id === productId
                        ? {
                            ...item,
                            children: [...(item.children || []), newComponentItem]
                        }
                        : item
                )
            );

            setExpandedItems(prev => ({
                ...prev,
                [`product-${productId}`]: true
            }));
            
            setCreatingComponentForProduct(null);
            setNewComponentName('');

        } catch (error) {
            console.error('Error handling component creation:', error);
        }
    }

    async function createNewInlineComponent(name: string, productId: string) {
        try {
            const { data, error } = await supabase
                .from('components')
                .insert([{ name, product_id: productId }])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                const newComponent = data[0];
                createNewComponent(newComponent, productId);
            }
        } catch (error) {
            console.error('Error creating component:', error);
        }
    }

    async function createNewFeature(newFeature: any, componentId: string) {
        const newFeatureItem: TableItem = {
            type: 'feature',
            id: newFeature.id,
            name: newFeature.name,
            level: 2,
            data: newFeature,
        };

        setTableData(prevData =>
            prevData.map(item =>
                item.type === 'product' && item.children
                    ? {
                        ...item,
                        children: item.children.map(child =>
                            child.id === componentId
                                ? { ...child, children: [...(child.children || []), newFeatureItem] }
                                : child
                        ),
                    }
                    : item
            )
        );

        setAllTableData(prevData =>
            prevData.map(item =>
                item.type === 'product' && item.children? {
                  ...item,
                  children: item.children.map(child =>
                      child.id === componentId
                          ? { ...child, children: [...(child.children || []), newFeatureItem] }
                          : child
                  ),
              }
              : item
          )
        );

        setExpandedItems(prev => {
            const updatedExpanded = { ...prev };
            const parentProduct = allTableData.find(p => p.children?.some(c => c.id === componentId));
            if (parentProduct) {
                updatedExpanded[`product-${parentProduct.id}`] = true;
                updatedExpanded[`component-${componentId}`] = true;
            }
            return updatedExpanded;
        });

        setIsCreateFeatureModalOpen(false);
        setSelectedComponentIdForFeature(null);
    }

    async function fetchComponents(productId: string) {
        try {
            const { data: componentsData, error: componentsError } = await supabase
                .from('components')
                .select('*')
                .eq('product_id', productId);
                
            if (componentsError) throw componentsError;
            return componentsData.map(component => ({
                type: 'component' as const,
                id: component.id,
                name: component.name || 'Component',
                level: 1,
                data: component,
            }));
        } catch (error) {
            console.error('Error fetching components:', error);
            return [];
        }
    }

    async function fetchFeatures(componentId: string) {
        try {
            const { data: featuresData, error: featuresError } = await supabase
                .from('features')
                .select('*')
                .eq('component_id', componentId);
                
            if (featuresError) throw featuresError;
            return featuresData.map(feature => ({
                type: 'feature' as const,
                id: feature.id,
                name: feature.name || 'Feature',
                level: 2,
                data: feature,
            }));
        } catch (error) {
            console.error('Error fetching features:', error);
            return [];
        }
    }

    const toggleExpand = async (type: string, id: string, data: Product | Component) => {
        const newExpandedState = !expandedItems[`${type}-${id}`];
        setExpandedItems(prev => ({
            ...prev,
            [`${type}-${id}`]: newExpandedState,
        }));

        if (newExpandedState) {
            if (type === 'product') {
                const product = tableData.find(item => item.id === id);
                if (!product?.children || product.children.length === 0) {
                    const components = await fetchComponents(id);
                    
                    setTableData(prevData =>
                        prevData.map(item =>
                            item.id === id
                                ? { ...item, children: components }
                                : item
                        )
                    );
                    
                    setAllTableData(prevAllData =>
                        prevAllData.map(item =>
                            item.id === id
                                ? { ...item, children: components }
                                : item
                        )
                    );
                }
            } else if (type === 'component') {
                let componentFound = false;
                const updatedTableData = tableData.map(product => {
                    if (product.children) {
                        const componentIndex = product.children.findIndex(comp => comp.id === id);
                        if (componentIndex >= 0) {
                            componentFound = true;
                            if (!product.children[componentIndex].children) {
                                return {
                                    ...product,
                                    children: product.children.map(async (comp, i) => {
                                        if (i === componentIndex) {
                                            const features = await fetchFeatures(id);
                                            return { ...comp, children: features };
                                        }
                                        return comp;
                                    })
                                };
                            }
                        }
                    }
                    return product;
                });

                if (componentFound) {
                    const features = await fetchFeatures(id);
                    
                    setTableData(prevData =>
                        prevData.map(product => {
                            if (product.children) {
                                return {
                                    ...product,
                                    children: product.children.map(comp => 
                                        comp.id === id
                                            ? { ...comp, children: features }
                                            : comp
                                    )
                                };
                            }
                            return product;
                        })
                    );
                    
                    setAllTableData(prevData =>
                        prevData.map(product => {
                            if (product.children) {
                                return {
                                    ...product,
                                    children: product.children.map(comp => 
                                        comp.id === id
                                            ? { ...comp, children: features }
                                            : comp
                                    )
                                };
                            }
                            return product;
                        })
                    );
                }
            }
        }
    };

    const isExpanded = (type: string, id: string) => {
        return !!expandedItems[`${type}-${id}`];
    };

    const getFeatureColorClass = (index: number) => {
        const colors = ['bg-yellow-400', 'bg-teal-400', 'bg-blue-500'];
        return colors[index % colors.length];
    };

    const handleSaveNewProduct = () => {
        if (newProductName.trim()) {
            createNewProduct(newProductName.trim());
        }
    };

    const handleCancelNewProduct = () => {
        setCreatingProduct(false);
        setNewProductName('');
    };

    const handleSaveNewComponent = (productId: string) => {
        if (newComponentName.trim()) {
            createNewInlineComponent(newComponentName.trim(), productId);
        }
    };

    const handleCancelNewComponent = () => {
        setCreatingComponentForProduct(null);
        setNewComponentName('');
    };


    const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
      return children.map((child) => (
          <div key={child.id}>
              <div
                  className={`grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50`}
                  style={{ paddingLeft: `${16 + child.level * 16}px` }}
              >
                  <div className="col-span-3 flex items-center gap-2">
                      <div
                          className="flex items-center gap-2 cursor-pointer"
                          onClick={() => {
                              if (child.type === 'product' || child.type === 'component') {
                                  if (child.type === 'product' || child.type === 'component') {
                                      toggleExpand(child.type, child.id, child.data);
                                  }
                              }
                          }}
                      >
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
                                  <span className={`p-1 ${getFeatureColorClass(0)} rounded-md w-4 h-4`}></span>
                              )}
                              {child.name}
                          </div>
                      </div>
                      
                      {/* Add the Plus button only for components (level 1) to create features */}
                      {child.level === 1 && (
                          <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  handleCreateFeatureClick(child.id);
                              }}
                              className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                          >
                              <Plus size={16} className="text-gray-500" />
                          </button>
                      )}
                  </div>
                  <div className="col-span-1 text-center">{child.data.status || ''}</div>
                  <div className="col-span-1 text-center">{child.data.progress !== undefined ? `${child.data.progress}%` : ''}</div>
                  <div className="col-span-1 text-center">{child.data.team || ''}</div>
                  <div className="col-span-1 text-center">{child.data.days !== undefined ? child.data.days : ''}</div>
                  <div className="col-span-1 text-center">{child.data.startDate || ''}</div>
                  <div className="col-span-1 text-center">{child.data.targetDate || ''}</div>
                  <div className="col-span-1 text-center">{child.data.completedOn || ''}</div>
                  <div className="col-span-2">{child.data.remarks || ''}</div>
              </div>
              {child.children && isExpanded(child.type, child.id) && renderChildren(child.children)}
              
              {child.level === 1 && creatingComponentForProduct === `AFTER_${child.id}` && (
                  <div 
                      className="grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50"
                      style={{ paddingLeft: `${16 + child.level * 16}px` }}
                  >
                      <div className="col-span-3 flex items-center gap-2">
                          <Input
                              type="text"
                              placeholder="Enter component name"
                              value={newComponentName}
                              onChange={(e) => setNewComponentName(e.target.value)}
                              className="w-48"
                          />
                          <Button 
                              size="sm" 
                              onClick={() => {
                                  const productId = tableData.find(p => 
                                      p.children?.some(c => c.id === child.id)
                                  )?.id;
                                  if (productId) {
                                      handleSaveNewComponent(productId);
                                  }
                              }}
                          >
                              Save
                          </Button>
                          <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={handleCancelNewComponent}
                          >
                              Cancel
                          </Button>
                      </div>
                  </div>
              )}
          </div>
      ));
  };




if (loading) {
  return <div className="flex justify-center p-10">Loading products...</div>;
}

return (
  <div className="w-full flex">
      {/* Left Side - Product Table */}
      {/* <div className={`${selectedProduct ? 'w-1/2' : 'w-full'} transition-all duration-300`}> */}
      <div className="w-full transition-all duration-300">
          <CreateFeatureModal
              isOpen={isCreateFeatureModalOpen}
              onClose={() => setIsCreateFeatureModalOpen(false)}
              componentId={selectedComponentIdForFeature}
              onFeatureCreated={createNewFeature}
          />

          <CreateComponentModal
              isOpen={isCreateComponentModalOpen}
              onClose={() => setIsCreateComponentModalOpen(false)}
              productId={selectedProductIdForComponent}
              onComponentCreated={createNewComponent}
          />



{selectedProduct && (
  <ProductDetailsPage
    productId={selectedProduct.data.id} // Pass the ID to fetch details within ProductDetailsPage
    isOpen={isProductDetailOpen}
    onClose={handleCloseProductDetails}
  />
)}

          <div className="bg-gray-100 border-b">
              <div className="grid grid-cols-12 py-3 px-4 font-medium text-gray-700 gap-x-4">
                  <div className="col-span-3">Features list</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">%</div>
                  <div className="col-span-1 text-center">Team</div>
                  <div className="col-span-1 text-center">Days</div>
                  <div className="col-span-1 text-center">Start Date</div>
                  <div className="col-span-1 text-center">Target Date</div>
                  <div className="col-span-1 text-center">Completed On</div>
                  <div className="col-span-2">Remarks</div>
              </div>
          </div>

          <div className="divide-y">
              {tableData.map((item) => (
                  <div key={item.id}>
                      <div
                          className={`grid grid-cols-12 py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${selectedProduct?.id === item.id ? 'bg-blue-50' : ''}`}
                          style={{ paddingLeft: `${16 + item.level * 16}px` }}
                      >
                          <div className="col-span-3 flex items-center gap-2">
                              <div
                                  className="flex items-center gap-2 cursor-pointer"
                                  onClick={() => toggleExpand(item.type, item.id, item.data)}
                              >
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
                                      <span 
                                          className={`cursor-pointer ${item.type === 'product' ? 'hover:text-blue-600' : ''}`}
                                          onClick={(e) => {
                                              if (item.type === 'product') {
                                                  e.stopPropagation();
                                                  handleProductSelection(item);
                                              }
                                          }}
                                      >
                                          {item.name}
                                      </span>
                                  </div>
                              </div>
                              
                              {item.level === 0 && (
                                  <button
                                      onClick={(e) => {
                                          e.stopPropagation();
                                          handleCreateComponentClick(item.id);
                                      }}
                                      className="ml-2 p-1 hover:bg-gray-200 rounded-full"
                                  >
                                      <Plus size={16} className="text-gray-500" />
                                  </button>
                              )}
                              {creatingComponentForProduct === item.id && (
                                  <>
                                      <Input
                                          type="text"
                                          placeholder="Enter component name"
                                          value={newComponentName}
                                          onChange={(e) => setNewComponentName(e.target.value)}
                                          className="ml-2 w-48"
                                      />
                                      <Button size="sm" onClick={() => handleSaveNewComponent(item.id)}>Save</Button>
                                      <Button size="sm" variant="outline" onClick={handleCancelNewComponent}>Cancel</Button>
                                  </>
                              )}
                          </div>
                          <div className="col-span-1 text-center">{item.data.status || ''}</div>
                          <div className="col-span-1 text-center">{item.data.progress !== undefined ? `${item.data.progress}%` : ''}</div>
                          <div className="col-span-1 text-center">{item.data.team || ''}</div>
                          <div className="col-span-1 text-center">{item.data.days !== undefined ? item.data.days : ''}</div>
                          <div className="col-span-1 text-center">{item.data.startDate || ''}</div>
                          <div className="col-span-1 text-center">{item.data.targetDate || ''}</div>
                          <div className="col-span-1 text-center">{item.data.completedOn || ''}</div>
                          <div className="col-span-2">{item.data.remarks || ''}</div>
                      </div>
                      {item.children && isExpanded(item.type, item.id) && renderChildren(item.children)}
                  </div>
              ))}
          </div>

          <div className="mt-4 px-4">
              {creatingProduct ? (
                  <div className="grid grid-cols-12 py-2 items-center hover:bg-gray-50">
                      <div className="col-span-3 flex items-center gap-2">
                          <Input
                              type="text"
                              placeholder="Enter product name"
                              value={newProductName}
                              onChange={(e) => setNewProductName(e.target.value)}
                          />
                          <Button size="sm" onClick={handleSaveNewProduct}>Save</Button>
                          <Button size="sm" variant="outline" onClick={handleCancelNewProduct}>Cancel</Button>
                      </div>
                  </div>
              ) : (
                  <Button onClick={handleCreateProductClick}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Product
                  </Button>
              )}
          </div>
      </div>

     
  </div>
);
}