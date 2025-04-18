
// // // 'use client';

// // // import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
// // // import { Button } from '@/components/ui/button';
// // // import { ArrowLeft, Maximize2 } from 'lucide-react';
// // // import { Product, Component, Feature } from '@/app/types';

// // // type Item = Product | Component | Feature;

// // // interface ProductDetailsSheetProps<T extends Item> {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   item: T;
// // //   components?: Component[]; // Add components prop
// // //   features?: Feature[]; // Add features prop
// // // }

// // // export const ProductDetailsSheet: <T extends Item>({ isOpen, onClose, item, components, features }: ProductDetailsSheetProps<T>) => React.ReactNode = ({ isOpen, onClose, item, components, features }) => {
// // //   const getItemType = (item: Item): 'Product' | 'Component' | 'Feature' => {
// // //     if ('product_id' in item && 'component_id' in item) {
// // //       return 'Feature';
// // //     }
// // //     if ('product_id' in item) {
// // //       return 'Component';
// // //     }
// // //     return 'Product';
// // //   };

// // //   const itemType = getItemType(item);

// // //   return (
// // //     <Sheet open={isOpen} onOpenChange={onClose}>
// // //       <SheetContent>
// // //         <SheetHeader>
// // //           <div className="flex items-center justify-between">
// // //             <div className="flex items-center gap-2">
// // //               <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
// // //                 <ArrowLeft size={18} />
// // //               </button>
// // //               <h2 className="text-xl font-semibold">{item.name}</h2>
// // //             </div>
// // //             <div className="flex items-center gap-2">
// // //               <button className="p-1 text-gray-500 hover:text-gray-700">
// // //                 <Maximize2 size={18} />
// // //               </button>
// // //             </div>
// // //           </div>
// // //         </SheetHeader>

// // //         <div className="mt-6">
// // //           <div className="flex justify-between items-center mb-4">
// // //             <span className="text-gray-600">Type</span>
// // //             <span className="text-gray-500">{itemType}</span>
// // //           </div>
// // //           {item.owner !== undefined && (
// // //             <div className="flex justify-between items-center mb-4">
// // //               <span className="text-gray-600">Owner</span>
// // //               <span className="text-gray-500">{item.owner || 'Not assigned'}</span>
// // //             </div>
// // //           )}
// // //           {/* Add any other properties of product */}
// // //           {itemType === 'Product' && (
// // //             <>
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <span className="text-gray-600">Components</span>
// // //                 <div className="text-gray-500">
// // //                   {components?.map((component) => (
// // //                     <div key={component.id}>{component.name}</div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //               <div className="flex justify-between items-center mb-4">
// // //                 <span className="text-gray-600">Features</span>
// // //                 <div className="text-gray-500">
// // //                   {features?.map((feature) => (
// // //                     <div key={feature.id}>{feature.name}</div>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </>
// // //           )}
// // //         </div>
// // //       </SheetContent>

// // //       <SheetFooter className="flex justify-end gap-2 absolute bottom-0 right-0 p-4">
// // //         <SheetClose asChild>
// // //           <Button variant="outline">Close</Button>
// // //         </SheetClose>
// // //       </SheetFooter>
// // //     </Sheet>
// // //   );
// // // };



// // // _components/productDetails.tsx
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
// // import { Button } from "@/components/ui/button";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import { supabase } from '@/lib/supabaseClient';
// // import { Product, Component, Feature } from '@/app/types';
// // import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// // import { Pencil, Save, X, Plus, Trash2 } from 'lucide-react';

// // interface ProductDetailsSheetProps {
// //   isOpen: boolean;
// //   onClose: () => void;
// //   item: Product;
// //   components?: Component[];
// //   features?: Feature[];
// // }

// // export function ProductDetailsSheet({ isOpen, onClose, item, components = [], features = [] }: ProductDetailsSheetProps) {
// //   const [activeTab, setActiveTab] = useState('details');
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [productData, setProductData] = useState<Product>(item);
// //   const [componentsList, setComponentsList] = useState<Component[]>(components);
// //   const [featuresList, setFeaturesList] = useState<Feature[]>(features);
// //   const [editingComponent, setEditingComponent] = useState<string | null>(null);
// //   const [editingFeature, setEditingFeature] = useState<string | null>(null);
// //   const [newComponent, setNewComponent] = useState<Partial<Component> | null>(null);
// //   const [newFeature, setNewFeature] = useState<Partial<Feature> | null>(null);

// //   useEffect(() => {
// //     setProductData(item);
// //     setComponentsList(components);
// //     setFeaturesList(features);
// //   }, [item, components, features]);

// //   const handleProductChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
// //     const { name, value } = e.target;
// //     setProductData(prev => ({
// //       ...prev,
// //       [name]: value === '' ? null : value
// //     }));
// //   };

// //   const handleComponentChange = (id: string, field: string, value: any) => {
// //     setComponentsList(prev =>
// //       prev.map(comp =>
// //         comp.id === id ? { ...comp, [field]: value === '' ? null : value } : comp
// //       )
// //     );
// //   };

// //   const handleFeatureChange = (id: string, field: string, value: any) => {
// //     setFeaturesList(prev =>
// //       prev.map(feature =>
// //         feature.id === id ? { ...feature, [field]: value === '' ? null : value } : feature
// //       )
// //     );
// //   };

// //   const saveProduct = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('products')
// //         .update(productData)
// //         .eq('id', productData.id)
// //         .select();

// //       if (error) throw error;
      
// //       setIsEditing(false);
// //       // You might want to refresh or update the parent component
// //     } catch (error) {
// //       console.error('Error updating product:', error);
// //     }
// //   };

// //   const saveComponent = async (component: Component) => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('components')
// //         .update({
// //           name: component.name,
// //           status: component.status,
// //           progress: component.progress
// //         })
// //         .eq('id', component.id)
// //         .select();

// //       if (error) throw error;
      
// //       setEditingComponent(null);
// //       // You might want to refresh the components list
// //     } catch (error) {
// //       console.error('Error updating component:', error);
// //     }
// //   };

// //   const saveFeature = async (feature: Feature) => {
// //     try {
// //       const { data, error } = await supabase
// //         .from('features')
// //         .update({
// //           name: feature.name,
// //           status: feature.status,
// //           progress: feature.progress,
// //           team: feature.team,
// //           days: feature.days,
// //           startDate: feature.startDate,
// //           targetDate: feature.targetDate,
// //           completedOn: feature.completedOn,
// //           remarks: feature.remarks
// //         })
// //         .eq('id', feature.id)
// //         .select();

// //       if (error) throw error;
      
// //       setEditingFeature(null);
// //       // You might want to refresh the features list
// //     } catch (error) {
// //       console.error('Error updating feature:', error);
// //     }
// //   };

// //   const addNewComponent = async () => {
// //     if (!newComponent?.name) return;

// //     try {
// //       const { data, error } = await supabase
// //         .from('components')
// //         .insert([{ 
// //           name: newComponent.name, 
// //           product_id: productData.id,
// //           status: newComponent.status || 'Todo',
// //           progress: newComponent.progress || 0
// //         }])
// //         .select();

// //       if (error) throw error;

// //       if (data && data.length > 0) {
// //         setComponentsList(prev => [...prev, data[0] as Component]);
// //         setNewComponent(null);
// //       }
// //     } catch (error) {
// //       console.error('Error creating component:', error);
// //     }
// //   };

// //   const addNewFeature = async () => {
// //     if (!newFeature?.name || !newFeature?.component_id) return;

// //     try {
// //       const { data, error } = await supabase
// //         .from('features')
// //         .insert([{ 
// //           name: newFeature.name, 
// //           component_id: newFeature.component_id,
// //           status: newFeature.status || 'Todo',
// //           progress: newFeature.progress || 0,
// //           team: newFeature.team || '',
// //           days: newFeature.days || null,
// //           startDate: newFeature.startDate || null,
// //           targetDate: newFeature.targetDate || null,
// //           completedOn: newFeature.completedOn || null,
// //           remarks: newFeature.remarks || ''
// //         }])
// //         .select();

// //       if (error) throw error;

// //       if (data && data.length > 0) {
// //         setFeaturesList(prev => [...prev, data[0] as Feature]);
// //         setNewFeature(null);
// //       }
// //     } catch (error) {
// //       console.error('Error creating feature:', error);
// //     }
// //   };

// //   const deleteComponent = async (id: string) => {
// //     try {
// //       const { error } = await supabase
// //         .from('components')
// //         .delete()
// //         .eq('id', id);

// //       if (error) throw error;

// //       setComponentsList(prev => prev.filter(comp => comp.id !== id));
// //       // This will also delete associated features due to database cascade
// //       setFeaturesList(prev => prev.filter(feature => 
// //         componentsList.find(comp => comp.id === id)?.id !== feature.component_id
// //       ));
// //     } catch (error) {
// //       console.error('Error deleting component:', error);
// //     }
// //   };

// //   const deleteFeature = async (id: string) => {
// //     try {
// //       const { error } = await supabase
// //         .from('features')
// //         .delete()
// //         .eq('id', id);

// //       if (error) throw error;

// //       setFeaturesList(prev => prev.filter(feature => feature.id !== id));
// //     } catch (error) {
// //       console.error('Error deleting feature:', error);
// //     }
// //   };

// //   return (
// //     <Sheet open={isOpen} onOpenChange={onClose}>
// //       <SheetContent className="w-full md:max-w-2xl overflow-y-auto">
// //         <SheetHeader>
// //           <SheetTitle>Product Details: {productData.name}</SheetTitle>
// //           <SheetDescription>
// //             View and manage product details, components, and features
// //           </SheetDescription>
// //         </SheetHeader>

// //         <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
// //           <TabsList className="grid grid-cols-3">
// //             <TabsTrigger value="details">Details</TabsTrigger>
// //             <TabsTrigger value="components">Components</TabsTrigger>
// //             <TabsTrigger value="features">Features</TabsTrigger>
// //           </TabsList>

// //           {/* Product Details Tab */}
// //           <TabsContent value="details" className="space-y-4 mt-4">
// //             <div className="flex justify-between">
// //               <h3 className="text-lg font-semibold">Product Information</h3>
// //               <Button
// //                 variant="outline"
// //                 size="sm"
// //                 onClick={() => setIsEditing(!isEditing)}
// //               >
// //                 {isEditing ? (
// //                   <>
// //                     <X className="h-4 w-4 mr-2" />
// //                     Cancel
// //                   </>
// //                 ) : (
// //                   <>
// //                     <Pencil className="h-4 w-4 mr-2" />
// //                     Edit
// //                   </>
// //                 )}
// //               </Button>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               <div className="space-y-2">
// //                 <Label htmlFor="name">Name</Label>
// //                 {isEditing ? (
// //                   <Input
// //                     id="name"
// //                     name="name"
// //                     value={productData.name || ''}
// //                     onChange={handleProductChange}
// //                   />
// //                 ) : (
// //                   <div className="p-2 border rounded-md bg-gray-50">{productData.name}</div>
// //                 )}
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="status">Status</Label>
// //                 {isEditing ? (
// //                   <select
// //                     id="status"
// //                     name="status"
// //                     value={productData.status || ''}
// //                     onChange={handleProductChange}
// //                     className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                   >
// //                     <option value="">Select status</option>
// //                     <option value="Todo">Todo</option>
// //                     <option value="In Progress">In Progress</option>
// //                     <option value="Completed">Completed</option>
// //                     <option value="Blocked">Blocked</option>
// //                   </select>
// //                 ) : (
// //                   <div className="p-2 border rounded-md bg-gray-50">{productData.status || 'Not set'}</div>
// //                 )}
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="progress">Progress (%)</Label>
// //                 {isEditing ? (
// //                   <Input
// //                     type="number"
// //                     id="progress"
// //                     name="progress"
// //                     value={productData.progress === null ? '' : productData.progress}
// //                     onChange={handleProductChange}
// //                     min={0}
// //                     max={100}
// //                   />
// //                 ) : (
// //                   <div className="p-2 border rounded-md bg-gray-50">{productData.progress !== null ? `${productData.progress}%` : 'Not set'}</div>
// //                 )}
// //               </div>

// //               <div className="space-y-2">
// //                 <Label htmlFor="team">Team</Label>
// //                 {isEditing ? (
// //                   <Input
// //                     id="team"
// //                     name="team"
// //                     value={productData.team || ''}
// //                     onChange={handleProductChange}
// //                   />
// //                 ) : (
// //                   <div className="p-2 border rounded-md bg-gray-50">{productData.team || 'Not assigned'}</div>
// //                 )}
// //               </div>
// //             </div>

// //             {isEditing && (
// //               <div className="flex justify-end gap-2 pt-4">
// //                 <Button variant="outline" onClick={() => setIsEditing(false)}>
// //                   Cancel
// //                 </Button>
// //                 <Button onClick={saveProduct}>
// //                   <Save className="h-4 w-4 mr-2" />
// //                   Save Changes
// //                 </Button>
// //               </div>
// //             )}
// //           </TabsContent>

// //           {/* Components Tab */}
// //           <TabsContent value="components" className="space-y-4 mt-4">
// //             <div className="flex justify-between">
// //               <h3 className="text-lg font-semibold">Components</h3>
// //               <Button
// //                 size="sm"
// //                 onClick={() => setNewComponent({ name: '', product_id: item.id })}
// //               >
// //                 <Plus className="h-4 w-4 mr-2" />
// //                 Add Component
// //               </Button>
// //             </div>

// //             {newComponent && (
// //               <div className="p-4 border rounded-md bg-gray-50 space-y-4">
// //                 <h4 className="font-medium">Add New Component</h4>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-component-name">Name</Label>
// //                     <Input
// //                       id="new-component-name"
// //                       value={newComponent.name || ''}
// //                       onChange={(e) => setNewComponent({...newComponent, name: e.target.value})}
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-component-status">Status</Label>
// //                     <select
// //                       id="new-component-status"
// //                       value={newComponent.status || 'Todo'}
// //                       onChange={(e) => setNewComponent({...newComponent, status: e.target.value})}
// //                       className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                     >
// //                       <option value="Todo">Todo</option>
// //                       <option value="In Progress">In Progress</option>
// //                       <option value="Completed">Completed</option>
// //                       <option value="Blocked">Blocked</option>
// //                     </select>
// //                   </div>
// //                 </div>
// //                 <div className="flex justify-end gap-2 pt-2">
// //                   <Button variant="outline" onClick={() => setNewComponent(null)}>
// //                     Cancel
// //                   </Button>
// //                   <Button onClick={addNewComponent}>
// //                     Save Component
// //                   </Button>
// //                 </div>
// //               </div>
// //             )}

// //             {componentsList && componentsList.length > 0 ? (
// //               <div className="space-y-4">
// //                 {componentsList.map((component) => (
// //                   <div key={component.id} className="p-4 border rounded-md hover:bg-gray-50">
// //                     {editingComponent === component.id ? (
// //                       <div className="space-y-4">
// //                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                           <div className="space-y-2">
// //                             <Label htmlFor={`component-name-${component.id}`}>Name</Label>
// //                             <Input
// //                               id={`component-name-${component.id}`}
// //                               value={component.name || ''}
// //                               onChange={(e) => handleComponentChange(component.id, 'name', e.target.value)}
// //                             />
// //                           </div>
// //                           <div className="space-y-2">
// //                             <Label htmlFor={`component-status-${component.id}`}>Status</Label>
// //                             <select
// //                               id={`component-status-${component.id}`}
// //                               value={component.status || ''}
// //                               onChange={(e) => handleComponentChange(component.id, 'status', e.target.value)}
// //                               className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                             >
// //                               <option value="">Select status</option>
// //                               <option value="Todo">Todo</option>
// //                               <option value="In Progress">In Progress</option>
// //                               <option value="Completed">Completed</option>
// //                               <option value="Blocked">Blocked</option>
// //                             </select>
// //                           </div>
// //                           <div className="space-y-2">
// //                             <Label htmlFor={`component-progress-${component.id}`}>Progress (%)</Label>
// //                             <Input
// //                               type="number"
// //                               id={`component-progress-${component.id}`}
// //                               value={component.progress === null ? '' : component.progress}
// //                               onChange={(e) => handleComponentChange(component.id, 'progress', e.target.value)}
// //                               min={0}
// //                               max={100}
// //                             />
// //                           </div>
// //                         </div>
// //                         <div className="flex justify-end gap-2">
// //                           <Button 
// //                             variant="outline" 
// //                             onClick={() => setEditingComponent(null)}
// //                           >
// //                             Cancel
// //                           </Button>
// //                           <Button onClick={() => saveComponent(component)}>
// //                             Save Changes
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     ) : (
// //                       <div className="flex justify-between">
// //                         <div>
// //                           <h4 className="font-medium">{component.name}</h4>
// //                           <div className="text-sm text-gray-500 mt-1">
// //                             Status: {component.status || 'Not set'} | 
// //                             Progress: {component.progress !== null ? `${component.progress}%` : 'Not set'}
// //                           </div>
// //                         </div>
// //                         <div className="flex gap-2">
// //                           <Button 
// //                             variant="outline" 
// //                             size="sm"
// //                             onClick={() => setEditingComponent(component.id)}
// //                           >
// //                             <Pencil className="h-4 w-4" />
// //                           </Button>
// //                           <Button 
// //                             variant="outline" 
// //                             size="sm"
// //                             className="text-red-500 hover:bg-red-50"
// //                             onClick={() => deleteComponent(component.id)}
// //                           >
// //                             <Trash2 className="h-4 w-4" />
// //                           </Button>
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-10 text-gray-500">
// //                 No components added to this product yet
// //               </div>
// //             )}
// //           </TabsContent>

// //           {/* Features Tab */}
// //           <TabsContent value="features" className="space-y-4 mt-4">
// //             <div className="flex justify-between">
// //               <h3 className="text-lg font-semibold">Features</h3>
// //               {componentsList && componentsList.length > 0 && (
// //                 <Button
// //                   size="sm"
// //                   onClick={() => setNewFeature({ name: '' })}
// //                 >
// //                   <Plus className="h-4 w-4 mr-2" />
// //                   Add Feature
// //                 </Button>
// //               )}
// //             </div>

// //             {newFeature && (
// //               <div className="p-4 border rounded-md bg-gray-50 space-y-4">
// //                 <h4 className="font-medium">Add New Feature</h4>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-feature-component">Component</Label>
// //                     <select
// //                       id="new-feature-component"
// //                       value={newFeature.component_id || ''}
// //                       onChange={(e) => setNewFeature({...newFeature, component_id: e.target.value})}
// //                       className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                     >
// //                       <option value="">Select component</option>
// //                       {componentsList.map(comp => (
// //                         <option key={comp.id} value={comp.id}>{comp.name}</option>
// //                       ))}
// //                     </select>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-feature-name">Name</Label>
// //                     <Input
// //                       id="new-feature-name"
// //                       value={newFeature.name || ''}
// //                       onChange={(e) => setNewFeature({...newFeature, name: e.target.value})}
// //                     />
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-feature-status">Status</Label>
// //                     <select
// //                       id="new-feature-status"
// //                       value={newFeature.status || 'Todo'}
// //                       onChange={(e) => setNewFeature({...newFeature, status: e.target.value})}
// //                       className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                     >
// //                       <option value="Todo">Todo</option>
// //                       <option value="In Progress">In Progress</option>
// //                       <option value="Completed">Completed</option>
// //                       <option value="Blocked">Blocked</option>
// //                     </select>
// //                   </div>
// //                   <div className="space-y-2">
// //                     <Label htmlFor="new-feature-team">Team</Label>
// //                     <Input
// //                       id="new-feature-team"
// //                       value={newFeature.team || ''}
// //                       onChange={(e) => setNewFeature({...newFeature, team: e.target.value})}
// //                     />
// //                   </div>
// //                 </div>
// //                 <div className="flex justify-end gap-2 pt-2">
// //                   <Button variant="outline" onClick={() => setNewFeature(null)}>
// //                     Cancel
// //                   </Button>
// //                   <Button 
// //                     onClick={addNewFeature}
// //                     disabled={!newFeature.name || !newFeature.component_id}
// //                   >
// //                     Save Feature
// //                   </Button>
// //                 </div>
// //               </div>
// //             )}

// //             {featuresList && featuresList.length > 0 ? (
// //               <div className="space-y-4">
// //                 {featuresList.map((feature) => {
// //                   const parentComponent = componentsList.find(comp => comp.id === feature.component_id);
                  
// //                   return (
// //                     <div key={feature.id} className="p-4 border rounded-md hover:bg-gray-50">
// //                       {editingFeature === feature.id ? (
// //                         <div className="space-y-4">
// //                           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-component-${feature.id}`}>Component</Label>
// //                               <select
// //                                 id={`feature-component-${feature.id}`}
// //                                 value={feature.component_id || ''}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'component_id', e.target.value)}
// //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                               >
// //                                 {componentsList.map(comp => (
// //                                   <option key={comp.id} value={comp.id}>{comp.name}</option>
// //                                 ))}
// //                               </select>
// //                             </div>
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-name-${feature.id}`}>Name</Label>
// //                               <Input
// //                                 id={`feature-name-${feature.id}`}
// //                                 value={feature.name || ''}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
// //                               />
// //                             </div>
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-status-${feature.id}`}>Status</Label>
// //                               <select
// //                                 id={`feature-status-${feature.id}`}
// //                                 value={feature.status || ''}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'status', e.target.value)}
// //                                 className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
// //                               >
// //                                 <option value="">Select status</option>
// //                                 <option value="Todo">Todo</option>
// //                                 <option value="In Progress">In Progress</option>
// //                                 <option value="Completed">Completed</option>
// //                                 <option value="Blocked">Blocked</option>
// //                               </select>
// //                             </div>
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-progress-${feature.id}`}>Progress (%)</Label>
// //                               <Input
// //                                 type="number"
// //                                 id={`feature-progress-${feature.id}`}
// //                                 value={feature.progress === null ? '' : feature.progress}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'progress', e.target.value)}
// //                                 min={0}
// //                                 max={100}
// //                               />
// //                             </div>
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-team-${feature.id}`}>Team</Label>
// //                               <Input
// //                                 id={`feature-team-${feature.id}`}
// //                                 value={feature.team || ''}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'team', e.target.value)}
// //                               />
// //                             </div>
// //                             <div className="space-y-2">
// //                               <Label htmlFor={`feature-days-${feature.id}`}>Days</Label>
// //                               <Input
// //                                 type="number"
// //                                 id={`feature-days-${feature.id}`}
// //                                 value={feature.days === null ? '' : feature.days}
// //                                 onChange={(e) => handleFeatureChange(feature.id, 'days', e.target.value)}
// //                                 min={0}
// //                               />
// //                             </div>
// //                           </div>
// //                           <div className="flex justify-end gap-2">
// //                             <Button 
// //                               variant="outline" 
// //                               onClick={() => setEditingFeature(null)}
// //                             >
// //                               Cancel
// //                             </Button>
// //                             <Button onClick={() => saveFeature(feature)}>
// //                               Save Changes
// //                             </Button>
// //                           </div>
// //                         </div>
// //                       ) : (
// //                         <div className="flex justify-between">
// //                           <div>
// //                             <div className="flex items-center gap-2">
// //                               <span className="p-1 bg-yellow-400 rounded-md w-3 h-3"></span>
// //                               <h4 className="font-medium">{feature.name}</h4>
// //                             </div>
// //                             <div className="text-sm text-gray-500 mt-1">
// //                               Component: {parentComponent?.name || 'Unknown'} | 
// //                               Status: {feature.status || 'Not set'} | 
// //                               Progress: {feature.progress !== null ? `${feature.progress}%` : 'Not set'}
// //                             </div>
// //                             {feature.team && (
// //                               <div className="text-sm text-gray-500">
// //                                 Team: {feature.team}
// //                               </div>
// //                             )}
// //                           </div>
// //                           <div className="flex gap-2">
// //                             <Button 
// //                               variant="outline" 
// //                               size="sm"
// //                               onClick={() => setEditingFeature(feature.id)}
// //                             >
// //                               <Pencil className="h-4 w-4" />
// //                             </Button>
// //                             <Button 
// //                               variant="outline" 
// //                               size="sm"
// //                               className="text-red-500 hover:bg-red-50"
// //                               onClick={() => deleteFeature(feature.id)}
// //                             >
// //                               <Trash2 className="h-4 w-4" />
// //                             </Button>
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>
// //             ) : (
// //               <div className="text-center py-10 text-gray-500">
// //                 {componentsList.length === 0 
// //                   ? "Add components first before creating features" 
// //                   : "No features added to this product yet"}
// //               </div>
// //             )}
// //           </TabsContent>
// //         </Tabs>

// //         <SheetFooter className="mt-6">
// //           <SheetClose asChild>
// //             <Button variant="outline">Close</Button>
// //           </SheetClose>
// //         </SheetFooter>
// //       </SheetContent>
// //     </Sheet>
// //   );
// // }



// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';

// interface Product {
//   id: string;
//   name: string;
//   status?: string;
//   progress?: number;
//   team?: string;
//   days?: number;
//   startDate?: string;
//   targetDate?: string;
//   completedOn?: string;
//   remarks?: string;
//   created_at: string;
//   components?: Component[];
//   owner?: string;
// }

// interface Component {
//   id: string;
//   product_id: string;
//   name: string;
//   status?: string;
//   progress?: number;
//   team?: string;
//   days?: number;
//   startDate?: string;
//   targetDate?: string;
//   completedOn?: string;
//   remarks?: string;
//   created_at: string;
//   features?: Feature[];
//   owner?: string;
// }

// interface Feature {
//   id: string;
//   component_id: string;
//   name: string;
//   status?: string;
//   progress?: number;
//   team?: string;
//   days?: number;
//   startDate?: string;
//   targetDate?: string;
//   completedOn?: string;
//   remarks?: string;
//   color?: 'yellow' | 'teal' | 'blue' | string;
//   created_at: string;
//   owner?: string;
// }


// interface ProductDetailsPageProps {
//   productId: string;
//   isOpen: boolean;
//   onClose: () => void;
// }


//  export function ProductDetailsPage ({ productId, isOpen, onClose }: ProductDetailsPageProps) {
//   const router = useRouter();
//   // const { id: queryProductId } = router.query;
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);



//   useEffect(() => {
//     if (isOpen && productId) { // Use the prop productId
//       const fetchProductDetails = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//           const response = await fetch(`/api/product/${productId}`);
//           if (!response.ok) {
//             const errorData = await response.json();
//             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
//           }
//           const data: Product = await response.json();
//           setProduct(data);
//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchProductDetails();
//     } else {
//       setProduct(null);
//     }
//   }, [isOpen, productId])


//   // const handleProductChange = (updatedProduct: Partial<Product>) => {
//   //   setProduct((prevProduct) => {
//   //     if (!prevProduct) return prevProduct; // Ensure prevProduct is not null
//   //     return { ...prevProduct, ...updatedProduct };
//   //   });
//   // };


//   const handleProductChange = (updatedProduct: Partial<Product>) => {
//     setProduct((prevProduct) => {
//       if (prevProduct) {
//         return { ...prevProduct, ...updatedProduct };
//       }
//       // Handle the case where prevProduct might be null (though unlikely during editing)
//       return updatedProduct as Product;
//     });
//   };

//   const handleUpdateProduct = async () => {
//     if (!product) return;
//     try {
//       const response = await fetch(`/api/product/${product.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: product.name,
//           status: product.status,
//           progress: product.progress,
//           team: product.team,
//           days: product.days,
//           startDate: product.startDate,
//           targetDate: product.targetDate,
//           completedOn: product.completedOn,
//           remarks: product.remarks,
//           owner: product.owner,
//         }),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || `Failed to update product (status ${response.status})`);
//       }
//       alert('Product updated successfully!');
//     } catch (error: any) {
//       console.error('Error updating product:', error);
//       alert(`Failed to update product: ${error.message}`);
//     }
//   };

//   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
//     setProduct((prevProduct) => {
//       if (!prevProduct?.components) return prevProduct;
//       return {
//         ...prevProduct,
//         components: prevProduct.components.map((comp) =>
//           comp.id === componentId
//             ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id }
//             : comp
//         ),
//       };
//     });
//   };
//   const handleUpdateComponent = async (componentId: string, updatedData: Partial<Component>) => {
//     try {
//       const response = await fetch(`/api/components/${componentId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
//       }
//       const updatedComponent: Component = await response.json();
//       setProduct((prevProduct) => {
//         if (!prevProduct) return null; // Handle potential null prevProduct

//         return {
//           ...prevProduct,
//           components: prevProduct.components?.map((comp) =>
//             comp.id === componentId ? updatedComponent : comp
//           ) || [], // Ensure components is not undefined
//         };
//       });
//       alert('Component updated successfully!');
//     } catch (error: any) {
//       console.error('Error updating component:', error);
//       alert(`Failed to update component: ${error.message}`);
//     }
//   };

//   const handleFeatureChange = (componentId: string, featureId: string, updatedFeature: Partial<Feature>) => {
//     setProduct((prevProduct) => {
//       if (!prevProduct?.components) return prevProduct;
//       return {
//         ...prevProduct,
//         components: prevProduct.components.map((comp) =>
//           comp.id === componentId
//             ? {
//                 ...comp,
//                 features: comp.features?.map((feat) =>
//                   feat.id === featureId
//                     ? { ...feat, ...updatedFeature, id: feat.id, component_id: feat.component_id }
//                     : feat
//                 ),
//               }
//             : comp
//         ),
//       };
//     });
//   };

//   // const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
//   //   try {
//   //     const response = await fetch(`/api/features/${featureId}`, {
//   //       method: 'PUT',
//   //       headers: {
//   //         'Content-Type': 'application/json',
//   //       },
//   //       body: JSON.stringify(updatedData),
//   //     });
//   //     if (!response.ok) {
//   //       const errorData = await response.json();
//   //       throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
//   //     }
//   //     const updatedFeature: Feature = await response.json();
//   //     setProduct((prevProduct) => ({
//   //       ...prevProduct,
//   //       components: prevProduct?.components?.map((comp) =>
//   //         comp.id === componentId
//   //           ? {
//   //               ...comp,
//   //               features: comp.features?.map((feat) =>
//   //                 feat.id === featureId ? updatedFeature : feat
//   //               ),
//   //             }
//   //           : comp
//   //       ),
//   //     }));
//   //     alert('Feature updated successfully!');
//   //   } catch (error: any) {
//   //     console.error('Error updating feature:', error);
//   //     alert(`Failed to update feature: ${error.message}`);
//   //   }
//   // };

//   const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
//     try {
//       const response = await fetch(`/api/features/${featureId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(updatedData),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
//       }
//       const updatedFeature: Feature = await response.json();
//       setProduct((prevProduct) => {
//         if (!prevProduct) return null;

//         return {
//           ...prevProduct,
//           components: prevProduct.components?.map((comp) =>
//             comp.id === componentId
//               ? {
//                   ...comp,
//                   features: comp.features?.map((feat) =>
//                     feat.id === featureId ? updatedFeature : feat
//                   ) || [], // Ensure features is not undefined
//                 }
//               : comp
//           ) || [], // Ensure components is not undefined
//         };
//       });
//       alert('Feature updated successfully!');
//     } catch (error: any) {
//       console.error('Error updating feature:', error);
//       alert(`Failed to update feature: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return <div>Loading product details...</div>;
//   }

//   if (error) {
//     return <div style={{ color: 'red' }}>Error: {error}</div>;
//   }

//   if (!product) {
//     return <div>Product not found.</div>;
//   }

//   return (
//     <div style={{ fontFamily: 'sans-serif', padding: '20px' }}>
//       <h2>{product.name}</h2>

//       {/* Editable Product Details */}
//       <h3>Product Details</h3>
//       <div>
//         <label>Name:</label>
//         <input type="text" value={product.name} onChange={(e) => handleProductChange({ name: e.target.value })} />
//       </div>
//       <div>
//         <label>Status:</label>
//         <input type="text" value={product.status || ''} onChange={(e) => handleProductChange({ status: e.target.value })} />
//       </div>
//       <div>
//         <label>Progress:</label>
//         <input type="number" value={product.progress || 0} onChange={(e) => handleProductChange({ progress: parseInt(e.target.value) })} />
//       </div>
//       <div>
//         <label>Team:</label>
//         <input type="text" value={product.team || ''} onChange={(e) => handleProductChange({ team: e.target.value })} />
//       </div>
//       <div>
//         <label>Days:</label>
//         <input type="number" value={product.days || 0} onChange={(e) => handleProductChange({ days: parseInt(e.target.value) })} />
//       </div>
//       <div>
//         <label>Start Date:</label>
//         <input type="date" value={product.startDate || ''} onChange={(e) => handleProductChange({ startDate: e.target.value })} />
//       </div>
//       <div>
//         <label>Target Date:</label>
//         <input type="date" value={product.targetDate || ''} onChange={(e) => handleProductChange({ targetDate: e.target.value })} />
//       </div>
//       <div>
//         <label>Completed On:</label>
//         <input type="date" value={product.completedOn || ''} onChange={(e) => handleProductChange({ completedOn: e.target.value })} />
//       </div>
//       <div>
//         <label>Remarks:</label>
//         <textarea value={product.remarks || ''} onChange={(e) => handleProductChange({ remarks: e.target.value })} />
//       </div>
//       <div>
//         <label>Owner:</label>
//         <input type="text" value={product.owner || ''} onChange={(e) => handleProductChange({ owner: e.target.value })} />
//       </div>
//       <button onClick={handleUpdateProduct}>Update Product</button>

//       <h3>Components</h3>
//       {product.components?.map((component) => (
//         <div key={component.id} style={{ border: '1px solid #ccc', padding: '15px', margin: '10px 0' }}>
//           <h4>{component.name}</h4>
//           {/* Editable Component Details */}
//           <div>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={component.name}
//               onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Status:</label>
//             <input
//               type="text"
//               value={component.status || ''}
//               onChange={(e) => handleComponentChange(component.id, { status: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Progress:</label>
//             <input
//               type="number"
//               value={component.progress || 0}
//               onChange={(e) => handleComponentChange(component.id, { progress: parseInt(e.target.value) })}
//             />
//           </div>
//           <div>
//             <label>Team:</label>
//             <input
//               type="text"
//               value={component.team || ''}
//               onChange={(e) => handleComponentChange(component.id, { team: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Days:</label>
//             <input
//               type="number"
//               value={component.days || 0}
//               onChange={(e) => handleComponentChange(component.id, { days: parseInt(e.target.value) })}
//             />
//           </div>
//           <div>
//             <label>Start Date:</label>
//             <input
//               type="date"
//               value={component.startDate || ''}
//               onChange={(e) => handleComponentChange(component.id, { startDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Target Date:</label>
//             <input
//               type="date"
//               value={component.targetDate || ''}
//               onChange={(e) => handleComponentChange(component.id, { targetDate: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Completed On:</label>
//             <input
//               type="date"
//               value={component.completedOn || ''}
//               onChange={(e) => handleComponentChange(component.id, { completedOn: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Remarks:</label>
//             <textarea
//               value={component.remarks || ''}
//               onChange={(e) => handleComponentChange(component.id, { remarks: e.target.value })}
//             />
//           </div>
//           <div>
//             <label>Owner:</label>
//             <input
//               type="text"
//               value={component.owner || ''}
//               onChange={(e) => handleComponentChange(component.id, { owner: e.target.value })}
//             />
//           </div>
//           <button
//             onClick={() =>
//               handleUpdateComponent(component.id, {
//                 name: component.name,
//                 status: component.status,
//                 progress: component.progress,
//                 team: component.team,
//                 days: component.days,
//                 startDate: component.startDate,
//                 targetDate: component.targetDate,
//                 completedOn: component.completedOn,
//                 remarks: component.remarks,
//                 owner: component.owner,
//               })
//             }
//           >
//             Update Component
//           </button>

//           <h5>Features</h5>
//           {component.features?.map((feature) => (
//             <div key={feature.id} style={{ border: '1px solid #eee', padding: '10px', margin: '5px 0' }}>
//               <span>{feature.name}</span>
//               {/* Editable Feature Details */}
//               <div>
//                 <label>Name:</label>
//                 <input
//                   type="text"
//                   value={feature.name}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { name: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Status:</label>
//                 <input
//                   type="text"
//                   value={feature.status || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { status: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Progress:</label>
//                 <input
//                   type="number"
//                   value={feature.progress || 0}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { progress: parseInt(e.target.value) })}
//                 />
//               </div>
//               <div>
//                 <label>Team:</label>
//                 <input
//                   type="text"
//                   value={feature.team || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { team: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Days:</label>
//                 <input
//                   type="number"
//                   value={feature.days || 0}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { days: parseInt(e.target.value) })}
//                 />
//               </div>
//               <div>
//                 <label>Start Date:</label>
//                 <input
//                   type="date"
//                   value={feature.startDate || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { startDate: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Target Date:</label>
//                 <input
//                   type="date"
//                   value={feature.targetDate || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { targetDate: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Completed On:</label>
//                 <input
//                   type="date"
//                   value={feature.completedOn || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { completedOn: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Remarks:</label>
//                 <textarea
//                   value={feature.remarks || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { remarks: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Color:</label>
//                 <input
//                   type="color"
//                   value={feature.color || '#ffffff'}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { color: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <label>Owner:</label>
//                 <input
//                   type="text"
//                   value={feature.owner || ''}
//                   onChange={(e) => handleFeatureChange(component.id, feature.id, { owner: e.target.value })}
//                 />
//               </div>
//               <button
//                 onClick={() =>
//                   handleUpdateFeature(component.id, feature.id, {
//                     name: feature.name,
//                     status: feature.status,
//                     progress: feature.progress,
//                     team: feature.team,
//                     days: feature.days,
//                     startDate: feature.startDate,
//                     targetDate: feature.targetDate,
//                     completedOn: feature.completedOn,
//                     remarks: feature.remarks,
//                     color: feature.color,
//                     owner: feature.owner,
//                   })
//                 }
//               >
//                 Update Feature
//               </button>
//             </div>
//           ))}
//           {!component.features || component.features.length === 0 ? <p>No features for this component.</p> : null}
//         </div>
//       ))}
//       {!product.components || product.components.length ===0 ?  <p>No components for this product.&lt;</p> : null}
// </div>
// );
// };



'use client';

import React, { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'; // Adjust the import path based on your project structure
import { Label } from '@/components/ui/label'; // Adjust the import path
import { Input } from '@/components/ui/input'; // Adjust the import path
import { Textarea } from '@/components/ui/textarea'; // Adjust the import path
import { Button } from '@/components/ui/button'; // Adjust the import path
import { Product, Feature, Component } from '@/app/types';

// ... (Your interfaces for Product, Component, Feature remain the same)

interface ProductDetailsPageProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProductDetails();
    } else {
      setProduct(null);
    }
  }, [isOpen, productId]);

  const handleProductChange = (updatedProduct: Partial<Product>) => {
    setProduct((prevProduct) => (prevProduct ? { ...prevProduct, ...updatedProduct } : updatedProduct as Product));
  };

  const handleUpdateProduct = async () => {
    if (!product) return;
    try {
      const response = await fetch(`/api/product/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product), // Send the entire product state for update
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update product (status ${response.status})`);
      }
      alert('Product updated successfully!');
    } catch (error: any) {
      console.error('Error updating product:', error);
      alert(`Failed to update product: ${error.message}`);
    }
  };

  const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
    setProduct((prevProduct) => {
      if (!prevProduct) {
        return null; // Or handle this case differently if a component change shouldn't happen when the product is null
      }
      return {
        ...prevProduct,
        components: prevProduct.components?.map((comp) =>
          comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
        ),
      };
    });
  };

  const handleUpdateComponent = async (componentId: string, updatedData: Partial<Component>) => {
    try {
      const response = await fetch(`/api/components/${componentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
      }
      const updatedComponent: Component = await response.json() as Component;
      setProduct((prevProduct) => {
        if (!prevProduct) {
          return null;
        }
        return {
          ...prevProduct,
          id: prevProduct.id,
          name: prevProduct.name,
          // ... other non-nullable Product properties
          components: prevProduct.components?.map((comp) => {
            if (comp.id === componentId) {
              return { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } as Component;
            }
            return comp;
          }) as Component[] || [],
        };
      });
      alert('Component updated successfully!');
    } catch (error: any) {
      console.error('Error updating component:', error);
      alert(`Failed to update component: ${error.message}`);
    }
  };

  const handleFeatureChange = (componentId: string, featureId: string, updatedFeature: Partial<Feature>) => {
    setProduct((prevProduct) => {
      if (!prevProduct) {
        return null;
      }
      return {
        ...prevProduct,
        id: prevProduct.id, // Ensure id is always included
        name: prevProduct.name, // Ensure name is always included
        // ... include any other non-nullable Product properties here
        components: prevProduct.components?.map((comp) =>
          comp.id === componentId
            ? {
                ...comp,
                features: comp.features?.map((feat) =>
                  feat.id === featureId ? { ...feat, ...updatedFeature, id: feat.id, component_id: feat.component_id } : feat
                ),
              }
            : comp
        ),
      };
    });
  };

  const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
    try {
      const response = await fetch(`/api/features/${featureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
      }
      const updatedFeature: Feature = await response.json();
      setProduct((prevProduct) => {
        if (!prevProduct) {
          return null;
        }
        return {
          ...prevProduct,
          id: prevProduct.id, // Ensure id is always included
          name: prevProduct.name, // Ensure name is always included
          // ... include any other non-nullable Product properties here
          components: prevProduct.components?.map((comp) =>
            comp.id === componentId
              ? {
                  ...comp,
                  features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
                }
              : comp
          ) || [],
        };
      });
      alert('Feature updated successfully!');
    } catch (error: any) {
      console.error('Error updating feature:', error);
      alert(`Failed to update feature: ${error.message}`);
    }
  };

  if (!isOpen) return null;
  if (loading) return <div>Loading product details...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{product.name} Details</SheetTitle>
          <SheetDescription>Manage and update the details of this product.</SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={product.name} onChange={(e) => handleProductChange({ name: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Input id="status" value={product.status || ''} onChange={(e) => handleProductChange({ status: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="progress">Progress</Label>
            <Input
              type="number"
              id="progress"
              value={product.progress?.toString() || ''}
              onChange={(e) => handleProductChange({ progress: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="team">Team</Label>
            <Input id="team" value={product.team || ''} onChange={(e) => handleProductChange({ team: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="days">Days</Label>
            <Input
              type="number"
              id="days"
              value={product.days?.toString() || ''}
              onChange={(e) => handleProductChange({ days: parseInt(e.target.value) })}
            />
          </div>
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              type="date"
              id="startDate"
              value={product.startDate || ''}
              onChange={(e) => handleProductChange({ startDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="targetDate">Target Date</Label>
            <Input
              type="date"
              id="targetDate"
              value={product.targetDate || ''}
              onChange={(e) => handleProductChange({ targetDate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="completedOn">Completed On</Label>
            <Input
              type="date"
              id="completedOn"
              value={product.completedOn || ''}
              onChange={(e) => handleProductChange({ completedOn: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea id="remarks" value={product.remarks || ''} onChange={(e) => handleProductChange({ remarks: e.target.value })} />
          </div>
          <div>
            <Label htmlFor="owner">Owner</Label>
            <Input id="owner" value={product.owner || ''} onChange={(e) => handleProductChange({ owner: e.target.value })} />
          </div>
        </div>
        <Button onClick={handleUpdateProduct}>Update Product</Button>

        <div className="mt-6">
          <h3>Components</h3>
          {product.components?.map((component) => (
            <div key={component.id} className="border rounded-md p-4 mt-2">
              <h4>{component.name}</h4>
              <div className="grid gap-2 py-2">
                <div>
                  <Label htmlFor={`component-name-${component.id}`}>Name</Label>
                  <Input
                    id={`component-name-${component.id}`}
                    value={component.name}
                    onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`component-status-${component.id}`}>Status</Label>
                  <Input
                    id={`component-status-${component.id}`}
                    value={component.status || ''}
                    onChange={(e) => handleComponentChange(component.id, { status: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor={`component-progress-${component.id}`}>Progress</Label>
                  <Input
                    type="number"
                    id={`component-progress-${component.id}`}
                    value={component.progress?.toString() || ''}
                    onChange={(e) => handleComponentChange(component.id, { progress: parseInt(e.target.value) })}
                  />
                </div>
                {/* ... other component fields */}
                <Button onClick={() => handleUpdateComponent(component.id, component)}>Update Component</Button>
              </div>

              <h5 className="mt-4">Features</h5>
              {component.features?.map((feature) => (
                <div key={feature.id} className="border rounded-md p-2 mt-1 ml-2">
                  <span>{feature.name}</span>
                  <div className="grid gap-2 py-2">
                    <div>
                      <Label htmlFor={`feature-name-${feature.id}`}>Name</Label>
                      <Input
                        id={`feature-name-${feature.id}`}
                        value={feature.name}
                        onChange={(e) => handleFeatureChange(component.id, feature.id, { name: e.target.value })}
                      />
                    </div>
                    {/* ... other feature fields */}
                    <Button
                      onClick={() => handleUpdateFeature(component.id, feature.id, feature)}
                      size="sm"
                      className="mt-2"
                    >
                      Update Feature
                    </Button>
                  </div>
                </div>
              ))}
              {!component.features || component.features.length === 0 ? <p className="ml-2 mt-1 text-sm text-muted-foreground">No features for this component.</p> : null}
            </div>
          ))}
          {!product.components || product.components.length === 0 ? <p>No components for this product.</p> : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}