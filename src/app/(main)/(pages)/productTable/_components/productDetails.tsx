
// // // // // // // // // // 'use client';

// // // // // // // // // // import React, { useState, useEffect} from 'react';
// // // // // // // // // // import { useRouter } from 'next/navigation';
// // // // // // // // // // import {
// // // // // // // // // //   Sheet,
// // // // // // // // // //   SheetContent,
// // // // // // // // // //   SheetDescription,
// // // // // // // // // //   SheetHeader,
// // // // // // // // // //   SheetTitle,
// // // // // // // // // //   SheetTrigger,
// // // // // // // // // // } from '@/components/ui/sheet'; // Adjust the import path based on your project structure
// // // // // // // // // // import { Label } from '@/components/ui/label'; // Adjust the import path
// // // // // // // // // // import { Input } from '@/components/ui/input'; // Adjust the import path
// // // // // // // // // // import { Textarea } from '@/components/ui/textarea'; // Adjust the import path
// // // // // // // // // // import { Button } from '@/components/ui/button'; // Adjust the import path
// // // // // // // // // // import { Product, Feature, Component } from '@/app/types';
// // // // // // // // // // import { Plus } from 'lucide-react';

// // // // // // // // // // // ... (Your interfaces for Product, Component, Feature remain the same)

// // // // // // // // // // interface ProductDetailsPageProps {
// // // // // // // // // //   productId: string;
// // // // // // // // // //   isOpen: boolean;
// // // // // // // // // //   onClose: () => void;
// // // // // // // // // // }

// // // // // // // // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// // // // // // // // // //   const router = useRouter();
// // // // // // // // // //   const [product, setProduct] = useState<Product | null>(null);
// // // // // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // // // // //   const [error, setError] = useState<string | null>(null);
// // // // // // // // // //   const [newComponentName, setNewComponentName] = useState('');

// // // // // // // // // //   useEffect(() => {
// // // // // // // // // //     if (isOpen && productId) {
// // // // // // // // // //       const fetchProductDetails = async () => {
// // // // // // // // // //         setLoading(true);
// // // // // // // // // //         setError(null);
// // // // // // // // // //         try {
// // // // // // // // // //           const response = await fetch(`/api/product/${productId}`);
// // // // // // // // // //           if (!response.ok) {
// // // // // // // // // //             const errorData = await response.json();
// // // // // // // // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // // // // // // // //           }
// // // // // // // // // //           const data: Product = await response.json();
// // // // // // // // // //           setProduct(data);
// // // // // // // // // //         } catch (err: any) {
// // // // // // // // // //           setError(err.message);
// // // // // // // // // //         } finally {
// // // // // // // // // //           setLoading(false);
// // // // // // // // // //         }
// // // // // // // // // //       };
// // // // // // // // // //       fetchProductDetails();
// // // // // // // // // //     } else {
// // // // // // // // // //       setProduct(null);
// // // // // // // // // //     }
// // // // // // // // // //   }, [isOpen, productId]);

// // // // // // // // // //   const handleProductChange = (updatedProduct: Partial<Product>) => {
// // // // // // // // // //     setProduct((prevProduct) => (prevProduct ? { ...prevProduct, ...updatedProduct } : updatedProduct as Product));
// // // // // // // // // //   };

// // // // // // // // // //   const handleUpdateProduct = async () => {
// // // // // // // // // //     if (!product) return;
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`/api/product/${product.id}`, {
// // // // // // // // // //         method: 'PUT',
// // // // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // // // //         body: JSON.stringify(product), // Send the entire product state for update
// // // // // // // // // //       });
// // // // // // // // // //       if (!response.ok) {
// // // // // // // // // //         const errorData = await response.json();
// // // // // // // // // //         throw new Error(errorData?.error || `Failed to update product (status ${response.status})`);
// // // // // // // // // //       }
// // // // // // // // // //       alert('Product updated successfully!');
// // // // // // // // // //     } catch (error: any) {
// // // // // // // // // //       console.error('Error updating product:', error);
// // // // // // // // // //       alert(`Failed to update product: ${error.message}`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // // // // // // // // //     setProduct((prevProduct) => {
// // // // // // // // // //       if (!prevProduct) {
// // // // // // // // // //         return null; // Or handle this case differently if a component change shouldn't happen when the product is null
// // // // // // // // // //       }
// // // // // // // // // //       return {
// // // // // // // // // //         ...prevProduct,
// // // // // // // // // //         components: prevProduct.components?.map((comp) =>
// // // // // // // // // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // // // // // // // // //         ),
// // // // // // // // // //       };
// // // // // // // // // //     });
// // // // // // // // // //   };

// // // // // // // // // //   const handleUpdateComponent = async (componentId: string, updatedData: Partial<Component>) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`/api/components/${componentId}`, {
// // // // // // // // // //         method: 'PUT',
// // // // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // // // //         body: JSON.stringify(updatedData),
// // // // // // // // // //       });
// // // // // // // // // //       if (!response.ok) {
// // // // // // // // // //         const errorData = await response.json();
// // // // // // // // // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // // // // // // // // //       }
// // // // // // // // // //       const updatedComponent: Component = await response.json() as Component;
// // // // // // // // // //       setProduct((prevProduct) => {
// // // // // // // // // //         if (!prevProduct) {
// // // // // // // // // //           return null;
// // // // // // // // // //         }
// // // // // // // // // //         return {
// // // // // // // // // //           ...prevProduct,
// // // // // // // // // //           id: prevProduct.id,
// // // // // // // // // //           name: prevProduct.name,
// // // // // // // // // //           // ... other non-nullable Product properties
// // // // // // // // // //           components: prevProduct.components?.map((comp) => {
// // // // // // // // // //             if (comp.id === componentId) {
// // // // // // // // // //               return { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } as Component;
// // // // // // // // // //             }
// // // // // // // // // //             return comp;
// // // // // // // // // //           }) as Component[] || [],
// // // // // // // // // //         };
// // // // // // // // // //       });
// // // // // // // // // //       alert('Component updated successfully!');
// // // // // // // // // //     } catch (error: any) {
// // // // // // // // // //       console.error('Error updating component:', error);
// // // // // // // // // //       alert(`Failed to update component: ${error.message}`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleAddComponent = () => {
// // // // // // // // // //     if (newComponentName) {
// // // // // // // // // //       // Assuming there's a function to add the component to the product
// // // // // // // // // //       // Call your function here to add a new component with newComponentName
// // // // // // // // // //       setNewComponentName('');
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   const handleFeatureChange = (componentId: string, featureId: string, updatedFeature: Partial<Feature>) => {
// // // // // // // // // //     setProduct((prevProduct) => {
// // // // // // // // // //       if (!prevProduct) {
// // // // // // // // // //         return null;
// // // // // // // // // //       }
// // // // // // // // // //       return {
// // // // // // // // // //         ...prevProduct,
// // // // // // // // // //         id: prevProduct.id, // Ensure id is always included
// // // // // // // // // //         name: prevProduct.name, // Ensure name is always included
// // // // // // // // // //         // ... include any other non-nullable Product properties here
// // // // // // // // // //         components: prevProduct.components?.map((comp) =>
// // // // // // // // // //           comp.id === componentId
// // // // // // // // // //             ? {
// // // // // // // // // //                 ...comp,
// // // // // // // // // //                 features: comp.features?.map((feat) =>
// // // // // // // // // //                   feat.id === featureId ? { ...feat, ...updatedFeature, id: feat.id, component_id: feat.component_id } : feat
// // // // // // // // // //                 ),
// // // // // // // // // //               }
// // // // // // // // // //             : comp
// // // // // // // // // //         ),
// // // // // // // // // //       };
// // // // // // // // // //     });
// // // // // // // // // //   };

// // // // // // // // // //   const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
// // // // // // // // // //     try {
// // // // // // // // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // // // // // // // //         method: 'PUT',
// // // // // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // // // // //         body: JSON.stringify(updatedData),
// // // // // // // // // //       });
// // // // // // // // // //       if (!response.ok) {
// // // // // // // // // //         const errorData = await response.json();
// // // // // // // // // //         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
// // // // // // // // // //       }
// // // // // // // // // //       const updatedFeature: Feature = await response.json();
// // // // // // // // // //       setProduct((prevProduct) => {
// // // // // // // // // //         if (!prevProduct) {
// // // // // // // // // //           return null;
// // // // // // // // // //         }
// // // // // // // // // //         return {
// // // // // // // // // //           ...prevProduct,
// // // // // // // // // //           id: prevProduct.id, // Ensure id is always included
// // // // // // // // // //           name: prevProduct.name, // Ensure name is always included
// // // // // // // // // //           // ... include any other non-nullable Product properties here
// // // // // // // // // //           components: prevProduct.components?.map((comp) =>
// // // // // // // // // //             comp.id === componentId
// // // // // // // // // //               ? {
// // // // // // // // // //                   ...comp,
// // // // // // // // // //                   features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
// // // // // // // // // //                 }
// // // // // // // // // //               : comp
// // // // // // // // // //           ) || [],
// // // // // // // // // //         };
// // // // // // // // // //       });
// // // // // // // // // //       alert('Feature updated successfully!');
// // // // // // // // // //     } catch (error: any) {
// // // // // // // // // //       console.error('Error updating feature:', error);
// // // // // // // // // //       alert(`Failed to update feature: ${error.message}`);
// // // // // // // // // //     }
// // // // // // // // // //   };

// // // // // // // // // //   if (!isOpen) return null;
// // // // // // // // // //   if (loading) return <div>Loading product details...</div>;
// // // // // // // // // //   if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
// // // // // // // // // //   if (!product) return <div>Product not found.</div>;

// // // // // // // // // //   return (
// // // // // // // // // //     <Sheet open={isOpen} onOpenChange={onClose}>
// // // // // // // // // //       <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // // // // // // //         <SheetHeader>
// // // // // // // // // //           <SheetTitle>{product.name} Details</SheetTitle>
// // // // // // // // // //           <SheetDescription>Manage and update the details of this product.</SheetDescription>
// // // // // // // // // //         </SheetHeader>
// // // // // // // // // //         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="name">Name</Label>
// // // // // // // // // //             <Input id="name" value={product.name} onChange={(e) => handleProductChange({ name: e.target.value })} />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="status">Status</Label>
// // // // // // // // // //             <Input id="status" value={product.status || ''} onChange={(e) => handleProductChange({ status: e.target.value })} />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="progress">Progress</Label>
// // // // // // // // // //             <Input
// // // // // // // // // //               type="number"
// // // // // // // // // //               id="progress"
// // // // // // // // // //               value={product.progress?.toString() || ''}
// // // // // // // // // //               onChange={(e) => handleProductChange({ progress: parseInt(e.target.value) })}
// // // // // // // // // //             />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="team">Team</Label>
// // // // // // // // // //             <Input id="team" value={product.team || ''} onChange={(e) => handleProductChange({ team: e.target.value })} />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="days">Days</Label>
// // // // // // // // // //             <Input
// // // // // // // // // //               type="number"
// // // // // // // // // //               id="days"
// // // // // // // // // //               value={product.days?.toString() || ''}
// // // // // // // // // //               onChange={(e) => handleProductChange({ days: parseInt(e.target.value) })}
// // // // // // // // // //             />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="startDate">Start Date</Label>
// // // // // // // // // //             <Input
// // // // // // // // // //               type="date"
// // // // // // // // // //               id="startDate"
// // // // // // // // // //               value={product.startDate || ''}
// // // // // // // // // //               onChange={(e) => handleProductChange({ startDate: e.target.value })}
// // // // // // // // // //             />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="targetDate">Target Date</Label>
// // // // // // // // // //             <Input
// // // // // // // // // //               type="date"
// // // // // // // // // //               id="targetDate"
// // // // // // // // // //               value={product.targetDate || ''}
// // // // // // // // // //               onChange={(e) => handleProductChange({ targetDate: e.target.value })}
// // // // // // // // // //             />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="completedOn">Completed On</Label>
// // // // // // // // // //             <Input
// // // // // // // // // //               type="date"
// // // // // // // // // //               id="completedOn"
// // // // // // // // // //               value={product.completedOn || ''}
// // // // // // // // // //               onChange={(e) => handleProductChange({ completedOn: e.target.value })}
// // // // // // // // // //             />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="remarks">Remarks</Label>
// // // // // // // // // //             <Textarea id="remarks" value={product.remarks || ''} onChange={(e) => handleProductChange({ remarks: e.target.value })} />
// // // // // // // // // //           </div>
// // // // // // // // // //           <div>
// // // // // // // // // //             <Label htmlFor="owner">Owner</Label>
// // // // // // // // // //             <Input id="owner" value={product.owner || ''} onChange={(e) => handleProductChange({ owner: e.target.value })} />
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //         <Button onClick={handleUpdateProduct}>Update Product</Button>




// // // // // // // // // // <div className="mt-6">
// // // // // // // // // //       <h3>Components</h3>
// // // // // // // // // //       {/* Input field for adding a new component */}
// // // // // // // // // //       <div className="flex items-center space-x-2 mb-4">
// // // // // // // // // //         <Input
// // // // // // // // // //           className="w-full"
// // // // // // // // // //           value={newComponentName}
// // // // // // // // // //           onChange={(e) => setNewComponentName(e.target.value)}
// // // // // // // // // //           placeholder="Enter component name..."
// // // // // // // // // //         />
// // // // // // // // // //         <Button onClick={handleAddComponent} className="p-2">
// // // // // // // // // //           <Plus size={16} />
// // // // // // // // // //         </Button>
// // // // // // // // // //       </div>

// // // // // // // // // //       {/* Displaying list of existing components */}
// // // // // // // // // //       {product.components?.map((component) => (
// // // // // // // // // //         <div key={component.id} className="border rounded-md p-4 mt-2">
// // // // // // // // // //           <h4>{component.name}</h4>
// // // // // // // // // //           <div className="grid gap-2 py-2">
// // // // // // // // // //             <div>
// // // // // // // // // //               <Label htmlFor={`component-name-${component.id}`}>Name</Label>
// // // // // // // // // //               <Input
// // // // // // // // // //                 id={`component-name-${component.id}`}
// // // // // // // // // //                 value={component.name}
// // // // // // // // // //                 onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // // // // // // // // //               />
// // // // // // // // // //             </div>
// // // // // // // // // //             <div>
// // // // // // // // // //               <Label htmlFor={`component-status-${component.id}`}>Status</Label>
// // // // // // // // // //               <Input
// // // // // // // // // //                 id={`component-status-${component.id}`}
// // // // // // // // // //                 value={component.status || ''}
// // // // // // // // // //                 onChange={(e) => handleComponentChange(component.id, { status: e.target.value })}
// // // // // // // // // //               />
// // // // // // // // // //             </div>
// // // // // // // // // //             <div>
// // // // // // // // // //               <Label htmlFor={`component-progress-${component.id}`}>Progress</Label>
// // // // // // // // // //               <Input
// // // // // // // // // //                 type="number"
// // // // // // // // // //                 id={`component-progress-${component.id}`}
// // // // // // // // // //                 value={component.progress?.toString() || ''}
// // // // // // // // // //                 onChange={(e) => handleComponentChange(component.id, { progress: parseInt(e.target.value) })}
// // // // // // // // // //               />
// // // // // // // // // //             </div>
// // // // // // // // // //             <Button onClick={() => handleUpdateComponent(component.id, component)} className="mt-2">
// // // // // // // // // //               Update Component
// // // // // // // // // //             </Button>
// // // // // // // // // //           </div>
// // // // // // // // // //         </div>
// // // // // // // // // //       ))}

// // // // // // // // // //       {!product.components || product.components.length === 0 ? (
// // // // // // // // // //         <p>No components for this product.</p>
// // // // // // // // // //       ) : null}
// // // // // // // // // //     </div>
// // // // // // // // // //       </SheetContent>
// // // // // // // // // //     </Sheet>
// // // // // // // // // //   );
// // // // // // // // // // }


// // // // // // // // // 'use client';

// // // // // // // // // import React from 'react';
// // // // // // // // // import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// // // // // // // // // import { Label } from '@/components/ui/label';
// // // // // // // // // import { Input } from '@/components/ui/input';
// // // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // // import { Plus } from 'lucide-react'; // For the Plus icon

// // // // // // // // // // Define your ProductDetailsPage component
// // // // // // // // // const ProductDetailsPage = () => {
// // // // // // // // //   return (
// // // // // // // // //     <div className="p-6">
// // // // // // // // //       {/* Product Header */}
// // // // // // // // //       {/* <h2 className="text-2xl font-bold">Sample Product 1</h2>

      
// // // // // // // // //       <p className="mt-2 text-blue-500">
// // // // // // // // //         <a href="https://productboard.com/academy" target="_blank" rel="noopener noreferrer">
// // // // // // // // //           Productboard Academy: Organize your work into a useful hierarchy
// // // // // // // // //         </a>
// // // // // // // // //       </p> */}

// // // // // // // // //       {/* Sheet Component for Fields, Components, and Features */}
// // // // // // // // //       <Sheet>
// // // // // // // // //         <SheetTrigger asChild>
// // // // // // // // //           <Button className="mt-4">Open Product Details</Button>
// // // // // // // // //         </SheetTrigger>
// // // // // // // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // // // // // //           <SheetHeader>
// // // // // // // // //             <SheetTitle>Details</SheetTitle>
// // // // // // // // //             <SheetDescription>Manage the product fields, components, and features</SheetDescription>
// // // // // // // // //           </SheetHeader>

// // // // // // // // //           {/* Fields Section */}
// // // // // // // // //           <div className="mt-4">
// // // // // // // // //             <h3 className="text-xl font-semibold">Fields</h3>
// // // // // // // // //             <div className="mt-2 flex items-center justify-between">
// // // // // // // // //               <p>Some field details...</p>
// // // // // // // // //               <Button variant="outline" size="sm">
// // // // // // // // //                 <Plus className="mr-2" />
// // // // // // // // //                 Add Field
// // // // // // // // //               </Button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Components Section */}
// // // // // // // // //           <div className="mt-4">
// // // // // // // // //             <h3 className="text-xl font-semibold">Components</h3>
// // // // // // // // //             <div className="mt-2 flex items-center justify-between">
// // // // // // // // //               <p>1 Component</p>
// // // // // // // // //               <Button variant="outline" size="sm">
// // // // // // // // //                 <Plus className="mr-2" />
// // // // // // // // //                 Add Component
// // // // // // // // //               </Button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>

// // // // // // // // //           {/* Features Section */}
// // // // // // // // //           <div className="mt-4">
// // // // // // // // //             <h3 className="text-xl font-semibold">Features</h3>
// // // // // // // // //             <div className="mt-2 flex items-center justify-between">
// // // // // // // // //               <p>No features yet</p>
// // // // // // // // //               <Button variant="outline" size="sm">
// // // // // // // // //                 <Plus className="mr-2" />
// // // // // // // // //                 Add Feature
// // // // // // // // //               </Button>
// // // // // // // // //             </div>
// // // // // // // // //           </div>
// // // // // // // // //         </SheetContent>
// // // // // // // // //       </Sheet>
// // // // // // // // //     </div>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default ProductDetailsPage;

// // // // // // // // 'use client';

// // // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // // import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// // // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // // import { Plus, ChevronRight, Search } from 'lucide-react';
// // // // // // // // import { Product, Feature, Component } from '@/app/types';


// // // // // // // // interface ProductDetailsPageProps {
// // // // // // // //   productId: string;
// // // // // // // //   isOpen: boolean;
// // // // // // // //   onClose: () => void;
// // // // // // // // }

// // // // // // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {

// // // // // // // //   const [product, setProduct] = useState<Product | null>(null);
// // // // // // // //     const [loading, setLoading] = useState(true);
// // // // // // // //   const [error, setError] = useState<string | null>(null);

// // // // // // // //     useEffect(() => {
// // // // // // // //     if (isOpen && productId) {
// // // // // // // //       const fetchProductDetails = async () => {
// // // // // // // //         setLoading(true);
// // // // // // // //         setError(null);
// // // // // // // //         try {
// // // // // // // //           const response = await fetch(`/api/product/${productId}`);
// // // // // // // //           if (!response.ok) {
// // // // // // // //             const errorData = await response.json();
// // // // // // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // // // // // //           }
// // // // // // // //           const data: Product = await response.json();
// // // // // // // //           setProduct(data);
// // // // // // // //         } catch (err: any) {
// // // // // // // //           setError(err.message);
// // // // // // // //         } finally {
// // // // // // // //           setLoading(false);
// // // // // // // //         }
// // // // // // // //       };
// // // // // // // //       fetchProductDetails();
// // // // // // // //     } else {
// // // // // // // //       setProduct(null);
// // // // // // // //     }
// // // // // // // //   }, [isOpen, productId]);

// // // // // // // //   if (!product) return <div>Product not found.</div>;

// // // // // // // //   return (
// // // // // // // //     <div className="p-6">
// // // // // // // //       {/* Sheet Component */}
// // // // // // // //       <Sheet>
// // // // // // // //         <SheetTrigger asChild>
// // // // // // // //           <Button variant="outline">Open Product Details</Button>
// // // // // // // //         </SheetTrigger>

// // // // // // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // // // // //           <SheetHeader>
// // // // // // // //           <SheetTitle>{product.name} </SheetTitle>
// // // // // // // //           </SheetHeader>

// // // // // // // //           {/* Fields Section */}
// // // // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // //               <ChevronRight size={18} className="text-gray-500" />
// // // // // // // //               <span className="text-md font-semibold">Fields</span>
// // // // // // // //             </div>
// // // // // // // //             <Search size={18} className="text-gray-500 cursor-pointer" />
// // // // // // // //           </div>

// // // // // // // //           {/* Components Section */}
// // // // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // //               <ChevronRight size={18} className="text-gray-500" />
// // // // // // // //               <span className="text-md font-semibold">Components</span>
// // // // // // // //               <span className="text-xs text-gray-500 border rounded px-1">1</span>
// // // // // // // //             </div>
// // // // // // // //             <Plus size={18} className="text-gray-500 cursor-pointer" />
// // // // // // // //           </div>

// // // // // // // //           {/* Features Section */}
// // // // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // // // //             <div className="flex items-center gap-2">
// // // // // // // //               <ChevronRight size={18} className="text-gray-500" />
// // // // // // // //               <span className="text-md font-semibold">Features</span>
// // // // // // // //               <span className="text-xs text-gray-500 border rounded px-1">0</span>
// // // // // // // //             </div>
// // // // // // // //             <Plus size={18} className="text-gray-500 cursor-pointer" />
// // // // // // // //           </div>

// // // // // // // //           {/* Integrations Section */}
          

// // // // // // // //         </SheetContent>
// // // // // // // //       </Sheet>
// // // // // // // //     </div>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default ProductDetailsPage;



// // // // // // // 'use client';

// // // // // // // import React, { useEffect, useState } from 'react';
// // // // // // // import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
// // // // // // // import { Button } from '@/components/ui/button';
// // // // // // // import { Plus, ChevronRight, Search } from 'lucide-react';
// // // // // // // import { Product, Component } from '@/app/types';
// // // // // // // import { Input } from '@/components/ui/input';

// // // // // // // interface ProductDetailsPageProps {
// // // // // // //   productId: string;
// // // // // // //   isOpen: boolean;
// // // // // // //   onClose: () => void;
// // // // // // // }

// // // // // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {

// // // // // // //   const [product, setProduct] = useState<Product | null>(null);
// // // // // // //   const [loading, setLoading] = useState(true);
// // // // // // //   const [error, setError] = useState<string | null>(null);
// // // // // // //   const [fieldsExpanded, setFieldsExpanded] = useState(false); // state to manage the visibility of the fields section
// // // // // // //   const [newComponentName, setNewComponentName] = useState('');
// // // // // // //   const [componentsExpanded, setComponentsExpanded] = useState(false);


// // // // // // //   useEffect(() => {
// // // // // // //     if (isOpen && productId) {
// // // // // // //       const fetchProductDetails = async () => {
// // // // // // //         setLoading(true);
// // // // // // //         setError(null);
// // // // // // //         try {
// // // // // // //           const response = await fetch(`/api/product/${productId}`);
// // // // // // //           if (!response.ok) {
// // // // // // //             const errorData = await response.json();
// // // // // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // // // // //           }
// // // // // // //           const data: Product = await response.json();
// // // // // // //           setProduct(data);
// // // // // // //         } catch (err: any) {
// // // // // // //           setError(err.message);
// // // // // // //         } finally {
// // // // // // //           setLoading(false);
// // // // // // //         }
// // // // // // //       };
// // // // // // //       fetchProductDetails();
// // // // // // //     } else {
// // // // // // //       setProduct(null);
// // // // // // //     }
// // // // // // //   }, [isOpen, productId]);


// // // // // // //   const handleUpdate = async () => {
// // // // // // //     try {
// // // // // // //       const response = await fetch(`/api/product/${productId}`, {
// // // // // // //         method: 'PUT',
// // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // //         body: JSON.stringify(product),
// // // // // // //       });
// // // // // // //       if (!response.ok) {
// // // // // // //         const errorData = await response.json();
// // // // // // //         throw new Error(errorData?.error || `Failed to update product`);
// // // // // // //       }
// // // // // // //       const data: Product = await response.json();
// // // // // // //       setProduct(data); // Update state with the new product data
// // // // // // //       alert('Product updated successfully!');
// // // // // // //     } catch (error) {
// // // // // // //       if (error instanceof Error) {
// // // // // // //         alert('Error updating product: ' + error.message);
// // // // // // //       } else {
// // // // // // //         alert('Error updating product: An unknown error occurred.');
// // // // // // //       }
// // // // // // //     }
// // // // // // //   };

// // // // // // //     const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // // // // // //     setProduct((prevProduct) => {
// // // // // // //       if (!prevProduct) {
// // // // // // //         return null; // Or handle this case differently if a component change shouldn't happen when the product is null
// // // // // // //       }
// // // // // // //       return {
// // // // // // //         ...prevProduct,
// // // // // // //         components: prevProduct.components?.map((comp) =>
// // // // // // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // // // // // //         ),
// // // // // // //       };
// // // // // // //     });
// // // // // // //   };

// // // // // // //   const handleUpdateComponent = async (componentId: string, updatedData: Partial<Component>) => {
// // // // // // //     try {
// // // // // // //       const response = await fetch(`/api/components/${componentId}`, {
// // // // // // //         method: 'PUT',
// // // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // // //         body: JSON.stringify(updatedData),
// // // // // // //       });
// // // // // // //       if (!response.ok) {
// // // // // // //         const errorData = await response.json();
// // // // // // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // // // // // //       }
// // // // // // //       const updatedComponent: Component = await response.json() as Component;
// // // // // // //       setProduct((prevProduct) => {
// // // // // // //         if (!prevProduct) {
// // // // // // //           return null;
// // // // // // //         }
// // // // // // //         return {
// // // // // // //           ...prevProduct,
// // // // // // //           id: prevProduct.id,
// // // // // // //           name: prevProduct.name,
// // // // // // //           // ... other non-nullable Product properties
// // // // // // //           components: prevProduct.components?.map((comp) => {
// // // // // // //             if (comp.id === componentId) {
// // // // // // //               return { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } as Component;
// // // // // // //             }
// // // // // // //             return comp;
// // // // // // //           }) as Component[] || [],
// // // // // // //         };
// // // // // // //       });
// // // // // // //       alert('Component updated successfully!');
// // // // // // //     } catch (error: any) {
// // // // // // //       console.error('Error updating component:', error);
// // // // // // //       alert(`Failed to update component: ${error.message}`);
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const handleAddComponent = () => {
// // // // // // //     if (newComponentName) {
// // // // // // //       // Assuming there's a function to add the component to the product
// // // // // // //       // Call your function here to add a new component with newComponentName
// // // // // // //       setNewComponentName('');
// // // // // // //     }
// // // // // // //   };



// // // // // // //   if (!product) return <div>Loading...</div>;

// // // // // // //   const toggleFields = () => setFieldsExpanded(!fieldsExpanded);
// // // // // // //   const toggleComponents = () => setComponentsExpanded(!componentsExpanded);

// // // // // // //   return (
// // // // // // //     <div className="p-6">
// // // // // // //       {/* Sheet Component */}
// // // // // // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // // // // // //         {/* <SheetTrigger asChild>
// // // // // // //           <Button variant="outline">Open Product Details</Button>
// // // // // // //         </SheetTrigger> */}

// // // // // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // // // //           <SheetHeader>
// // // // // // //             <SheetTitle>{product.name}</SheetTitle>
// // // // // // //           </SheetHeader>

// // // // // // //           {/* Fields Section */}
// // // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // // //             <div className="flex items-center gap-2">
// // // // // // //               <ChevronRight
// // // // // // //                 size={18}
// // // // // // //                 className="text-gray-500 cursor-pointer"
// // // // // // //                 onClick={toggleFields} // Toggle field section visibility
// // // // // // //               />
// // // // // // //               <span className="text-md font-semibold">Fields</span>
// // // // // // //             </div>
// // // // // // //             <Search size={18} className="text-gray-500 cursor-pointer" />
// // // // // // //           </div>

// // // // // // //           {fieldsExpanded && (
// // // // // // //             <div className="mt-4">
// // // // // // //               <div className="grid grid-cols-2 gap-4">
// // // // // // //                 {/* Editable product fields */}
// // // // // // //                 <div>
// // // // // // //                   <label className="text-sm font-medium">Product Name</label>
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={product.name}
// // // // // // //                     onChange={(e) => setProduct({ ...product, name: e.target.value })}
// // // // // // //                     className="mt-2 p-2 border border-gray-300 rounded"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 <div>
// // // // // // //                   <label className="text-sm font-medium">Status</label>
// // // // // // //                   <input
// // // // // // //                     type="text"
// // // // // // //                     value={product.status}
// // // // // // //                     onChange={(e) => setProduct({ ...product, status: e.target.value })}
// // // // // // //                     className="mt-2 p-2 border border-gray-300 rounded"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 <div>
// // // // // // //                   <label className="text-sm font-medium">Progress</label>
// // // // // // //                   <input
// // // // // // //                     type="number"
// // // // // // //                     value={product.progress}
// // // // // // //                     onChange={(e) => setProduct({ ...product, progress: parseInt(e.target.value) })}
// // // // // // //                     className="mt-2 p-2 border border-gray-300 rounded"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //                 <div>
// // // // // // //                   <label className="text-sm font-medium">Owner</label>
// // // // // // //                   <input
// // // // // // //                     type="email"
// // // // // // //                     value={product.owner}
// // // // // // //                     onChange={(e) => setProduct({ ...product, owner: e.target.value })}
// // // // // // //                     className="mt-2 p-2 border border-gray-300 rounded"
// // // // // // //                   />
// // // // // // //                 </div>
// // // // // // //               </div>
// // // // // // //               <div className="mt-4 flex justify-end">
// // // // // // //               <Button onClick={handleUpdate}  className="bg-gray-200 text-black hover:bg-gray-300">
// // // // // // //                 Update Product
// // // // // // //               </Button>
// // // // // // //             </div>
// // // // // // //             </div>
// // // // // // //           )}

// // // // // // //           {/* Components Section */}
// // // // // // //           {/* <div className="border-b py-3 flex justify-between items-center">
// // // // // // //             <div className="flex items-center gap-2">
// // // // // // //               <ChevronRight size={18} className="text-gray-500" />
// // // // // // //               <span className="text-md font-semibold">Components</span>
// // // // // // //               {product?.components?.map((component) => (
// // // // // // //                 <Input
// // // // // // //                   key={component.id}
// // // // // // //                   id={`component-name-${component.id}`}
// // // // // // //                   value={component.name}
// // // // // // //                   onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // // // // // //                 />
// // // // // // //               ))}
// // // // // // //             </div>
// // // // // // //             <Plus size={18} className="text-gray-500 cursor-pointer" />
// // // // // // //           </div> */}

// // // // // // // <div className="border-b py-3 flex justify-between items-center">
// // // // // // //             <div className="flex items-center gap-2">
// // // // // // //               <ChevronRight
// // // // // // //                 size={18}
// // // // // // //                 className="text-gray-500 cursor-pointer"
// // // // // // //                 onClick={toggleComponents}
// // // // // // //               />
// // // // // // //               <span className="text-md font-semibold">Components</span>
// // // // // // //               <span className="text-xs text-gray-500 border rounded px-1">{product.components?.length || 0}</span>
// // // // // // //             </div>
// // // // // // //             <Plus size={18} className="text-gray-500 cursor-pointer" onClick={handleAddComponent} />
// // // // // // //           </div>

// // // // // // //           {componentsExpanded && (
// // // // // // //             <div className="mt-4">
// // // // // // //               {/* Display components as editable tags */}
// // // // // // //               <div className="flex gap-2 flex-wrap">
// // // // // // //                 {product.components?.map((component) => (
// // // // // // //                   <div key={component.id} className="flex items-center gap-2 mb-2">
// // // // // // //                     <Input
// // // // // // //                       value={component.name}
// // // // // // //                       onChange={(e) =>
// // // // // // //                         handleComponentChange(component.id, { name: e.target.value })
// // // // // // //                       }
// // // // // // //                       className="p-2 border border-gray-300 rounded"
// // // // // // //                     />
// // // // // // //                     <Button
// // // // // // //                       onClick={() => handleComponentChange(component.id, { name: '' })}
// // // // // // //                       variant="outline"
// // // // // // //                       size="sm"
// // // // // // //                     >
// // // // // // //                       Save
// // // // // // //                     </Button>
// // // // // // //                   </div>
// // // // // // //                 ))}
// // // // // // //               </div>
// // // // // // //             </div>
// // // // // // //           )}


// // // // // // //           {/* Features Section */}
// // // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // // //             <div className="flex items-center gap-2">
// // // // // // //               <ChevronRight size={18} className="text-gray-500" />
// // // // // // //               <span className="text-md font-semibold">Features</span>
// // // // // // //               <span className="text-xs text-gray-500 border rounded px-1">0</span>
// // // // // // //             </div>
// // // // // // //             <Plus size={18} className="text-gray-500 cursor-pointer" />
// // // // // // //           </div>

// // // // // // //         </SheetContent>
// // // // // // //       </Sheet>
// // // // // // //     </div>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default ProductDetailsPage;



// // // // // // 'use client';

// // // // // // import React, { useEffect, useState } from 'react';
// // // // // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // // // // import { Button } from '@/components/ui/button';
// // // // // // import { Plus, ChevronRight, Search, Save, Edit, Trash2 } from 'lucide-react';
// // // // // // import { Product, Component, Feature } from '@/app/types';
// // // // // // import { Input } from '@/components/ui/input';

// // // // // // interface ProductDetailsPageProps {
// // // // // //   productId: string;
// // // // // //   isOpen: boolean;
// // // // // //   onClose: () => void;
// // // // // // }

// // // // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// // // // // //   const [product, setProduct] = useState<Product | null>(null);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [error, setError] = useState<string | null>(null);
// // // // // //   const [fieldsExpanded, setFieldsExpanded] = useState(false);
// // // // // //   const [componentsExpanded, setComponentsExpanded] = useState(true);
// // // // // //   const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
// // // // // //   const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
// // // // // //   const [newComponentName, setNewComponentName] = useState('');
// // // // // //   const [newFeatureName, setNewFeatureName] = useState('');
// // // // // //   const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
// // // // // //   const [features, setFeatures] = useState<Feature[]>([]);
// // // // // //   const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
// // // // // //   const [loadingFeatures, setLoadingFeatures] = useState(false);

// // // // // //   useEffect(() => {
// // // // // //     if (isOpen && productId) {
// // // // // //       const fetchProductDetails = async () => {
// // // // // //         setLoading(true);
// // // // // //         setError(null);
// // // // // //         try {
// // // // // //           const response = await fetch(`/api/product/${productId}`);
// // // // // //           if (!response.ok) {
// // // // // //             const errorData = await response.json();
// // // // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // // // //           }
// // // // // //           const data: Product = await response.json();
// // // // // //           setProduct(data);
// // // // // //         } catch (err: any) {
// // // // // //           setError(err.message);
// // // // // //         } finally {
// // // // // //           setLoading(false);
// // // // // //         }
// // // // // //       };
// // // // // //       fetchProductDetails();
// // // // // //     } else {
// // // // // //       setProduct(null);
// // // // // //     }
// // // // // //   }, [isOpen, productId]);

// // // // // //   // Fetch features when component is selected
// // // // // //   useEffect(() => {
// // // // // //     if (selectedComponentId) {
// // // // // //       fetchFeatures(selectedComponentId);
// // // // // //     } else {
// // // // // //       setFeatures([]);
// // // // // //     }
// // // // // //   }, [selectedComponentId]);

// // // // // //   // const fetchFeatures = async (componentId: string) => {
// // // // // //   //   try {
// // // // // //   //     const response = await fetch(`/api/components/${componentId}/features`);
// // // // // //   //     if (!response.ok) {
// // // // // //   //       throw new Error(`Failed to fetch features (status ${response.status})`);
// // // // // //   //     }
// // // // // //   //     const data = await response.json();
// // // // // //   //     setFeatures(data);
// // // // // //   //   } catch (error) {
// // // // // //   //     console.error('Error fetching features:', error);
// // // // // //   //   }
// // // // // //   // };

// // // // // //   const fetchFeatures = async (componentId: string) => {
// // // // // //     setLoadingFeatures(true);
// // // // // //     try {
// // // // // //       const response = await fetch(`/api/components/${componentId}/features`);
// // // // // //       if (!response.ok) {
// // // // // //         throw new Error(`Failed to fetch features (status ${response.status})`);
// // // // // //       }
// // // // // //       const data = await response.json();
// // // // // //       setFeatures(data);
// // // // // //     } catch (error) {
// // // // // //       console.error('Error fetching features:', error);
// // // // // //     } finally {
// // // // // //       setLoadingFeatures(false);
// // // // // //     }
// // // // // //   };
  

// // // // // //   const handleUpdate = async () => {
// // // // // //     try {
// // // // // //       const response = await fetch(`/api/product/${productId}`, {
// // // // // //         method: 'PUT',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify(product),
// // // // // //       });
// // // // // //       if (!response.ok) {
// // // // // //         const errorData = await response.json();
// // // // // //         throw new Error(errorData?.error || `Failed to update product`);
// // // // // //       }
// // // // // //       const data: Product = await response.json();
// // // // // //       setProduct(data);
// // // // // //       alert('Product updated successfully!');
// // // // // //     } catch (error) {
// // // // // //       if (error instanceof Error) {
// // // // // //         alert('Error updating product: ' + error.message);
// // // // // //       } else {
// // // // // //         alert('Error updating product: An unknown error occurred.');
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // // // // //     setProduct((prevProduct) => {
// // // // // //       if (!prevProduct) {
// // // // // //         return null;
// // // // // //       }
// // // // // //       return {
// // // // // //         ...prevProduct,
// // // // // //         components: prevProduct.components?.map((comp) =>
// // // // // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // // // // //         ),
// // // // // //       };
// // // // // //     });
// // // // // //   };

// // // // // //   const handleUpdateComponent = async (componentId: string) => {
// // // // // //     const component = product?.components?.find(comp => comp.id === componentId);
// // // // // //     if (!component) return;

// // // // // //     try {
// // // // // //       const response = await fetch(`/api/components/${componentId}`, {
// // // // // //         method: 'PUT',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify(component),
// // // // // //       });
// // // // // //       if (!response.ok) {
// // // // // //         const errorData = await response.json();
// // // // // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // // // // //       }
// // // // // //       alert('Component updated successfully!');
// // // // // //     } catch (error: any) {
// // // // // //       console.error('Error updating component:', error);
// // // // // //       alert(`Failed to update component: ${error.message}`);
// // // // // //     }
// // // // // //   };

// // // // // //   const handleAddComponent = async () => {
// // // // // //     if (newComponentName && product) {
// // // // // //       try {
// // // // // //         const response = await fetch('/api/components', {
// // // // // //           method: 'POST',
// // // // // //           headers: { 'Content-Type': 'application/json' },
// // // // // //           body: JSON.stringify({
// // // // // //             name: newComponentName,
// // // // // //             product_id: product.id
// // // // // //           }),
// // // // // //         });
// // // // // //         if (!response.ok) {
// // // // // //           throw new Error(`Failed to add component (status ${response.status})`);
// // // // // //         }
// // // // // //         const newComponent = await response.json();
        
// // // // // //         setProduct(prevProduct => {
// // // // // //           if (!prevProduct) return null;
// // // // // //           return {
// // // // // //             ...prevProduct,
// // // // // //             components: [...(prevProduct.components || []), newComponent]
// // // // // //           };
// // // // // //         });
        
// // // // // //         setNewComponentName('');
// // // // // //       } catch (error) {
// // // // // //         console.error('Error adding component:', error);
// // // // // //         alert('Failed to add component');
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const handleAddFeature = async () => {
// // // // // //     if (newFeatureName && selectedComponentId) {
// // // // // //       try {
// // // // // //         const response = await fetch('/api/feature', {
// // // // // //           method: 'POST',
// // // // // //           headers: { 'Content-Type': 'application/json' },
// // // // // //           body: JSON.stringify({
// // // // // //             name: newFeatureName,
// // // // // //             component_id: selectedComponentId
// // // // // //           }),
// // // // // //         });
// // // // // //         if (!response.ok) {
// // // // // //           throw new Error(`Failed to add feature (status ${response.status})`);
// // // // // //         }
// // // // // //         const newFeature = await response.json();
// // // // // //         setFeatures(prev => [...prev, newFeature]);
// // // // // //         setNewFeatureName('');
// // // // // //       } catch (error) {
// // // // // //         console.error('Error adding feature:', error);
// // // // // //         alert('Failed to add feature');
// // // // // //       }
// // // // // //     }
// // // // // //   };

// // // // // //   const handleFeatureChange = (featureId: string, field: string, value: any) => {
// // // // // //     setEditingFeature(prev => {
// // // // // //       if (!prev || prev.id !== featureId) return prev;
// // // // // //       return { ...prev, [field]: value };
// // // // // //     });
// // // // // //   };




// // // // // //     const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
// // // // // //     try {
// // // // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // // // //         method: 'PUT',
// // // // // //         headers: { 'Content-Type': 'application/json' },
// // // // // //         body: JSON.stringify(updatedData),
// // // // // //       });
// // // // // //       if (!response.ok) {
// // // // // //         const errorData = await response.json();
// // // // // //         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
// // // // // //       }
// // // // // //       const updatedFeature: Feature = await response.json();
// // // // // //       setProduct((prevProduct) => {
// // // // // //         if (!prevProduct) {
// // // // // //           return null;
// // // // // //         }
// // // // // //         return {
// // // // // //           ...prevProduct,
// // // // // //           id: prevProduct.id, // Ensure id is always included
// // // // // //           name: prevProduct.name, // Ensure name is always included
// // // // // //           // ... include any other non-nullable Product properties here
// // // // // //           components: prevProduct.components?.map((comp) =>
// // // // // //             comp.id === componentId
// // // // // //               ? {
// // // // // //                   ...comp,
// // // // // //                   features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
// // // // // //                 }
// // // // // //               : comp
// // // // // //           ) || [],
// // // // // //         };
// // // // // //       });
// // // // // //       alert('Feature updated successfully!');
// // // // // //     } catch (error: any) {
// // // // // //       console.error('Error updating feature:', error);
// // // // // //       alert(`Failed to update feature: ${error.message}`);
// // // // // //     }
// // // // // //   };
// // // // // //   const handleDeleteFeature = async (featureId: string) => {
// // // // // //     try {
// // // // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // // // //         method: 'DELETE',
// // // // // //       });
// // // // // //       if (!response.ok) {
// // // // // //         throw new Error(`Failed to delete feature (status ${response.status})`);
// // // // // //       }
// // // // // //       setFeatures(prev => prev.filter(feature => feature.id !== featureId));
// // // // // //       if (expandedFeature === featureId) {
// // // // // //         setExpandedFeature(null);
// // // // // //         setEditingFeature(null);
// // // // // //       }
// // // // // //     } catch (error) {
// // // // // //       console.error('Error deleting feature:', error);
// // // // // //       alert('Failed to delete feature');
// // // // // //     }
// // // // // //   };

// // // // // //   const toggleFields = () => setFieldsExpanded(!fieldsExpanded);
// // // // // //   const toggleComponents = () => setComponentsExpanded(!componentsExpanded);
  
// // // // // //   const toggleComponent = (componentId: string) => {
// // // // // //     if (expandedComponent === componentId) {
// // // // // //       setExpandedComponent(null);
// // // // // //       setSelectedComponentId(null);
// // // // // //     } else {
// // // // // //       setExpandedComponent(componentId);
// // // // // //       setSelectedComponentId(componentId);
// // // // // //     }
// // // // // //     setExpandedFeature(null);
// // // // // //     setEditingFeature(null);

    
// // // // // //   };

// // // // // //   const toggleFeature = (featureId: string) => {
// // // // // //     if (expandedFeature === featureId) {
// // // // // //       setExpandedFeature(null);
// // // // // //       setEditingFeature(null);
// // // // // //     } else {
// // // // // //       const feature = features.find(f => f.id === featureId);
// // // // // //       setExpandedFeature(featureId);
// // // // // //       setEditingFeature(feature || null);
// // // // // //     }
// // // // // //   };

// // // // // //   if (loading) return <div>Loading...</div>;
// // // // // //   if (error) return <div>Error: {error}</div>;
// // // // // //   if (!product) return <div>No product found</div>;

// // // // // //   return (
// // // // // //     <div className="p-6">
// // // // // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // // // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // // //           <SheetHeader>
// // // // // //             <SheetTitle>{product.name}</SheetTitle>
// // // // // //           </SheetHeader>

// // // // // //           {/* Fields Section */}
// // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // //             <div className="flex items-center gap-2">
// // // // // //               <ChevronRight
// // // // // //                 size={18}
// // // // // //                 className={`text-gray-500 cursor-pointer ${fieldsExpanded ? 'transform rotate-90' : ''}`}
// // // // // //                 onClick={toggleFields}
// // // // // //               />
// // // // // //               <span className="text-md font-semibold">Fields</span>
// // // // // //             </div>
// // // // // //             <Search size={18} className="text-gray-500 cursor-pointer" />
// // // // // //           </div>

// // // // // //           {fieldsExpanded && (
// // // // // //             <div className="mt-4">
// // // // // //               <div className="grid grid-cols-2 gap-4">
// // // // // //                 <div>
// // // // // //                   <label className="text-sm font-medium">Product Name</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={product.name}
// // // // // //                     onChange={(e) => setProduct({ ...product, name: e.target.value })}
// // // // // //                     className="mt-2 p-2 border border-gray-300 rounded w-full"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className="text-sm font-medium">Status</label>
// // // // // //                   <input
// // // // // //                     type="text"
// // // // // //                     value={product.status}
// // // // // //                     onChange={(e) => setProduct({ ...product, status: e.target.value })}
// // // // // //                     className="mt-2 p-2 border border-gray-300 rounded w-full"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className="text-sm font-medium">Progress</label>
// // // // // //                   <input
// // // // // //                     type="number"
// // // // // //                     value={product.progress}
// // // // // //                     onChange={(e) => setProduct({ ...product, progress: parseInt(e.target.value) })}
// // // // // //                     className="mt-2 p-2 border border-gray-300 rounded w-full"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //                 <div>
// // // // // //                   <label className="text-sm font-medium">Owner</label>
// // // // // //                   <input
// // // // // //                     type="email"
// // // // // //                     value={product.owner}
// // // // // //                     onChange={(e) => setProduct({ ...product, owner: e.target.value })}
// // // // // //                     className="mt-2 p-2 border border-gray-300 rounded w-full"
// // // // // //                   />
// // // // // //                 </div>
// // // // // //               </div>
// // // // // //               <div className="mt-4 flex justify-end">
// // // // // //                 <Button onClick={handleUpdate} className="bg-gray-200 text-black hover:bg-gray-300">
// // // // // //                   Update Product
// // // // // //                 </Button>
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           )}

// // // // // //           {/* Components Section */}
// // // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // // //             <div className="flex items-center gap-2">
// // // // // //               <ChevronRight
// // // // // //                 size={18}
// // // // // //                 className={`text-gray-500 cursor-pointer ${componentsExpanded ? 'transform rotate-90' : ''}`}
// // // // // //                 onClick={toggleComponents}
// // // // // //               />
// // // // // //               <span className="text-md font-semibold">Components</span>
// // // // // //               <span className="text-xs text-gray-500 border rounded px-1">{product.components?.length || 0}</span>
// // // // // //             </div>
// // // // // //             <div className="flex items-center gap-2">
// // // // // //               <Input
// // // // // //                 value={newComponentName}
// // // // // //                 onChange={(e) => setNewComponentName(e.target.value)}
// // // // // //                 placeholder="New component name"
// // // // // //                 className="h-8 text-sm"
// // // // // //               />
// // // // // //               <Button 
// // // // // //                 onClick={handleAddComponent} 
// // // // // //                 size="sm" 
// // // // // //                 variant="outline" 
// // // // // //                 className="px-2"
// // // // // //               >
// // // // // //                 <Plus size={16} />
// // // // // //               </Button>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {componentsExpanded && (
// // // // // //             <div className="mt-2">
// // // // // //               {product.components?.map((component) => (
// // // // // //                 <div key={component.id} className="mb-1">
// // // // // //                   {/* Component Row */}
// // // // // //                   <div 
// // // // // //                     className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // // // //                     onClick={() => toggleComponent(component.id)}
// // // // // //                   >
// // // // // //                     <div className="flex items-center gap-2">
// // // // // //                       <ChevronRight
// // // // // //                         size={16}
// // // // // //                         className={`text-gray-500 ${expandedComponent === component.id ? 'transform rotate-90' : ''}`}
// // // // // //                       />
// // // // // //                       <span>{component.name}</span>
// // // // // //                     </div>
// // // // // //                     <div className="flex items-center gap-2">
// // // // // //                       <Input
// // // // // //                         value={component.name}
// // // // // //                         onClick={(e) => e.stopPropagation()}
// // // // // //                         onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // // // // //                         className="h-8 text-sm"
// // // // // //                         placeholder="Component name"
// // // // // //                       />
// // // // // //                       <Button 
// // // // // //                         onClick={(e) => {
// // // // // //                           e.stopPropagation();
// // // // // //                           handleUpdateComponent(component.id);
// // // // // //                         }} 
// // // // // //                         size="sm" 
// // // // // //                         variant="outline" 
// // // // // //                         className="px-2"
// // // // // //                       >
// // // // // //                         <Save size={16} />
// // // // // //                       </Button>
// // // // // //                     </div>
// // // // // //                   </div>

// // // // // //                   {/* Features List when Component is expanded */}
// // // // // //                   {expandedComponent === component.id && (
// // // // // //                     <div className="ml-6 mt-2 border-l pl-4">
// // // // // //                       <div className="flex items-center justify-between mb-2">
// // // // // //                         <span className="text-sm font-medium">Features</span>
// // // // // //                         <span className="text-xs text-gray-500 border rounded px-1">{component.features?.length || 0}</span>
// // // // // //                         <div className="flex items-center gap-2">
// // // // // //                           <Input
// // // // // //                             value={newFeatureName}
// // // // // //                             onChange={(e) => setNewFeatureName(e.target.value)}
// // // // // //                             placeholder="New feature name"
// // // // // //                             className="h-8 text-sm"
// // // // // //                           />
// // // // // //                           <Button 
// // // // // //                             onClick={handleAddFeature} 
// // // // // //                             size="sm" 
// // // // // //                             variant="outline" 
// // // // // //                             className="px-2"
// // // // // //                           >
// // // // // //                             <Plus size={16} />
// // // // // //                           </Button>
// // // // // //                         </div>
// // // // // //                       </div>
                      
// // // // // //                       {/* {features.length === 0 ? (
// // // // // //                         <div className="text-sm text-gray-500 italic">No features found</div>
// // // // // //                       ) : (
// // // // // //                         <div>
// // // // // //                           {features.map(feature => ( */}
// // // // // //                           {loadingFeatures ? (
// // // // // //   <div className="text-sm text-gray-500 italic">Loading features...</div>
// // // // // // ) : features.length === 0 ? (
// // // // // //   <div className="text-sm text-gray-500 italic">No features found</div>
// // // // // // ) : (
// // // // // //   <div>
// // // // // //     {features.map(feature => (
// // // // // //                             <div key={feature.id} className="mb-1">
// // // // // //                               {/* Feature Row */}
// // // // // //                               <div 
// // // // // //                                 className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // // // //                                 onClick={() => toggleFeature(feature.id)}
// // // // // //                               >
// // // // // //                                 <div className="flex items-center gap-2">
// // // // // //                                   <ChevronRight
// // // // // //                                     size={16}
// // // // // //                                     className={`text-gray-500 ${expandedFeature === feature.id ? 'transform rotate-90' : ''}`}
// // // // // //                                   />
// // // // // //                                   <span>{feature.name}</span>
// // // // // //                                 </div>
// // // // // //                                 <div className="flex gap-1">
// // // // // //                                   <Button 
// // // // // //                                     onClick={(e) => {
// // // // // //                                       e.stopPropagation();
// // // // // //                                       toggleFeature(feature.id);
// // // // // //                                     }}
// // // // // //                                     size="sm" 
// // // // // //                                     variant="ghost" 
// // // // // //                                     className="h-8 w-8 p-0"
// // // // // //                                   >
// // // // // //                                     <Edit size={16} />
// // // // // //                                   </Button>
// // // // // //                                   <Button 
// // // // // //                                     onClick={(e) => {
// // // // // //                                       e.stopPropagation();
// // // // // //                                       handleDeleteFeature(feature.id);
// // // // // //                                     }}
// // // // // //                                     size="sm" 
// // // // // //                                     variant="ghost" 
// // // // // //                                     className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
// // // // // //                                   >
// // // // // //                                     <Trash2 size={16} />
// // // // // //                                   </Button>
// // // // // //                                 </div>
// // // // // //                               </div>

// // // // // //                               {/* Feature Edit Form */}
// // // // // //                               {expandedFeature === feature.id && editingFeature && (
// // // // // //                                 <div className="ml-6 mt-2 p-3 border rounded bg-gray-50">
// // // // // //                                   <div className="grid grid-cols-2 gap-3">
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Feature Name</label>
// // // // // //                                       <Input
// // // // // //                                         value={editingFeature.name}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Status</label>
// // // // // //                                       <Input
// // // // // //                                         value={editingFeature.status || ''}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'status', e.target.value)}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Progress</label>
// // // // // //                                       <Input
// // // // // //                                         type="number"
// // // // // //                                         value={editingFeature.progress || 0}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'progress', parseInt(e.target.value))}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Team</label>
// // // // // //                                       <Input
// // // // // //                                         value={editingFeature.team || ''}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'team', e.target.value)}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Days</label>
// // // // // //                                       <Input
// // // // // //                                         type="number"
// // // // // //                                         value={editingFeature.days || 0}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'days', parseInt(e.target.value))}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
                                   
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Start Date</label>
// // // // // //                                       <Input
// // // // // //                                         type="date"
// // // // // //                                         value={editingFeature.startDate || ''}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'startDate', e.target.value)}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div>
// // // // // //                                       <label className="text-xs font-medium">Target Date</label>
// // // // // //                                       <Input
// // // // // //                                         type="date"
// // // // // //                                         value={editingFeature.targetDate || ''}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'targetDate', e.target.value)}
// // // // // //                                         className="mt-1"
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                     <div className="col-span-2">
// // // // // //                                       <label className="text-xs font-medium">Remarks</label>
// // // // // //                                       <textarea
// // // // // //                                         value={editingFeature.remarks || ''}
// // // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'remarks', e.target.value)}
// // // // // //                                         className="mt-1 w-full p-2 border border-gray-300 rounded"
// // // // // //                                         rows={3}
// // // // // //                                       />
// // // // // //                                     </div>
// // // // // //                                   </div>
// // // // // //                                   <div className="mt-3 flex justify-end">
// // // // // //                                     <Button onClick={() => handleUpdateFeature(component.id, feature.id, editingFeature || {})} className="bg-gray-200 text-black hover:bg-gray-300">
// // // // // //                                       Save Changes
// // // // // //                                     </Button>
// // // // // //                                   </div>
// // // // // //                                 </div>
// // // // // //                               )}
// // // // // //                             </div>
// // // // // //                           ))}
// // // // // //                         </div>
// // // // // //                       )}
// // // // // //                     </div>
// // // // // //                   )}
// // // // // //                 </div>
// // // // // //               ))}
// // // // // //             </div>
// // // // // //           )}
// // // // // //         </SheetContent>
// // // // // //       </Sheet>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default ProductDetailsPage;



// // // // // 'use client';

// // // // // import React, { useEffect, useState } from 'react';
// // // // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // // // import { Button } from '@/components/ui/button';
// // // // // import { Plus, ChevronRight, Search, Save, Edit, Trash2 } from 'lucide-react';
// // // // // import { Product, Component, Feature } from '@/app/types';
// // // // // import { Input } from '@/components/ui/input';
// // // // // import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

// // // // // interface ProductDetailsPageProps {
// // // // //   productId: string;
// // // // //   isOpen: boolean;
// // // // //   onClose: () => void;
// // // // // }

// // // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// // // // //   const [product, setProduct] = useState<Product | null>(null);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [error, setError] = useState<string | null>(null);
// // // // //   const [fieldsExpanded, setFieldsExpanded] = useState(false);
// // // // //   const [componentsExpanded, setComponentsExpanded] = useState(true);
// // // // //   const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
// // // // //   const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
// // // // //   const [newComponentName, setNewComponentName] = useState('');
// // // // //   const [newFeatureName, setNewFeatureName] = useState('');
// // // // //   const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
// // // // //   const [features, setFeatures] = useState<Feature[]>([]);
// // // // //   const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
// // // // //   const [loadingFeatures, setLoadingFeatures] = useState(false);

// // // // //   useEffect(() => {
// // // // //     if (isOpen && productId) {
// // // // //       const fetchProductDetails = async () => {
// // // // //         setLoading(true);
// // // // //         setError(null);
// // // // //         try {
// // // // //           const response = await fetch(`/api/product/${productId}`);
// // // // //           if (!response.ok) {
// // // // //             const errorData = await response.json();
// // // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // // //           }
// // // // //           const data: Product = await response.json();
// // // // //           setProduct(data);
// // // // //         } catch (err: any) {
// // // // //           setError(err.message);
// // // // //         } finally {
// // // // //           setLoading(false);
// // // // //         }
// // // // //       };
// // // // //       fetchProductDetails();
// // // // //     } else {
// // // // //       setProduct(null);
// // // // //     }
// // // // //   }, [isOpen, productId]);

// // // // //   async function fetchFeatures(componentId: string) {
// // // // //     setLoadingFeatures(true);
// // // // //     try {
// // // // //       const { data: featuresData, error: featuresError } = await supabase
// // // // //         .from('features')
// // // // //         .select('*')
// // // // //         .eq('component_id', componentId);

// // // // //       if (featuresError) throw featuresError;
// // // // //       const mappedFeatures: Feature[] = featuresData.map(feature => ({
// // // // //         id: feature.id,
// // // // //         component_id: feature.component_id,
// // // // //         name: feature.name || 'Feature',
// // // // //         status: feature.status,
// // // // //         progress: feature.progress,
// // // // //         team: feature.team,
// // // // //         days: feature.days,
// // // // //         startDate: feature.startDate,
// // // // //         targetDate: feature.targetDate,
// // // // //         completedOn: feature.completedOn,
// // // // //         remarks: feature.remarks,
// // // // //         color: feature.color,
// // // // //         created_at: feature.created_at,
// // // // //         owner: feature.owner,
// // // // //       }));
// // // // //       setFeatures(mappedFeatures);
// // // // //     } catch (error) {
// // // // //       console.error('Error fetching features:', error);
// // // // //       setFeatures([]);
// // // // //     } finally {
// // // // //       setLoadingFeatures(false);
// // // // //     }
// // // // //   }

// // // // //   // Fetch features when component is selected
// // // // //   useEffect(() => {
// // // // //     if (selectedComponentId) {
// // // // //       fetchFeatures(selectedComponentId);
// // // // //     } else {
// // // // //       setFeatures([]);
// // // // //     }
// // // // //   }, [selectedComponentId]);

// // // // //   const handleUpdate = async () => {
// // // // //     try {
// // // // //       const response = await fetch(`/api/product/${productId}`, {
// // // // //         method: 'PUT',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify(product),
// // // // //       });
// // // // //       if (!response.ok) {
// // // // //         const errorData = await response.json();
// // // // //         throw new Error(errorData?.error || `Failed to update product`);
// // // // //       }
// // // // //       const data: Product = await response.json();
// // // // //       setProduct(data);
// // // // //       alert('Product updated successfully!');
// // // // //     } catch (error) {
// // // // //       if (error instanceof Error) {
// // // // //         alert('Error updating product: ' + error.message);
// // // // //       } else {
// // // // //         alert('Error updating product: An unknown error occurred.');
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // // // //     setProduct((prevProduct) => {
// // // // //       if (!prevProduct) {
// // // // //         return null;
// // // // //       }
// // // // //       return {
// // // // //         ...prevProduct,
// // // // //         components: prevProduct.components?.map((comp) =>
// // // // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // // // //         ),
// // // // //       };
// // // // //     });
// // // // //   };

// // // // //   const handleUpdateComponent = async (componentId: string) => {
// // // // //     const component = product?.components?.find(comp => comp.id === componentId);
// // // // //     if (!component) return;

// // // // //     try {
// // // // //       const response = await fetch(`/api/components/${componentId}`, {
// // // // //         method: 'PUT',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify(component),
// // // // //       });
// // // // //       if (!response.ok) {
// // // // //         const errorData = await response.json();
// // // // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // // // //       }
// // // // //       alert('Component updated successfully!');
// // // // //     } catch (error: any) {
// // // // //       console.error('Error updating component:', error);
// // // // //       alert(`Failed to update component: ${error.message}`);
// // // // //     }
// // // // //   };

// // // // //   const handleAddComponent = async () => {
// // // // //     if (newComponentName && product) {
// // // // //       try {
// // // // //         const response = await fetch('/api/components', {
// // // // //           method: 'POST',
// // // // //           headers: { 'Content-Type': 'application/json' },
// // // // //           body: JSON.stringify({
// // // // //             name: newComponentName,
// // // // //             product_id: product.id
// // // // //           }),
// // // // //         });
// // // // //         if (!response.ok) {
// // // // //           throw new Error(`Failed to add component (status ${response.status})`);
// // // // //         }
// // // // //         const newComponent = await response.json();

// // // // //         setProduct(prevProduct => {
// // // // //           if (!prevProduct) return null;
// // // // //           return {
// // // // //             ...prevProduct,
// // // // //             components: [...(prevProduct.components || []), newComponent]
// // // // //           };
// // // // //         });

// // // // //         setNewComponentName('');
// // // // //       } catch (error) {
// // // // //         console.error('Error adding component:', error);
// // // // //         alert('Failed to add component');
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleAddFeature = async () => {
// // // // //     if (newFeatureName && selectedComponentId) {
// // // // //       try {
// // // // //         const response = await fetch('/api/feature', {
// // // // //           method: 'POST',
// // // // //           headers: { 'Content-Type': 'application/json' },
// // // // //           body: JSON.stringify({
// // // // //             name: newFeatureName,
// // // // //             component_id: selectedComponentId
// // // // //           }),
// // // // //         });
// // // // //         if (!response.ok) {
// // // // //           throw new Error(`Failed to add feature (status ${response.status})`);
// // // // //         }
// // // // //         const newFeature = await response.json();
// // // // //         setFeatures(prev => [...prev, newFeature]);
// // // // //         setNewFeatureName('');
// // // // //       } catch (error) {
// // // // //         console.error('Error adding feature:', error);
// // // // //         alert('Failed to add feature');
// // // // //       }
// // // // //     }
// // // // //   };

// // // // //   const handleFeatureChange = (featureId: string, field: string, value: any) => {
// // // // //     setEditingFeature(prev => {
// // // // //       if (!prev || prev.id !== featureId) return prev;
// // // // //       return { ...prev, [field]: value };
// // // // //     });
// // // // //   };

// // // // //   const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
// // // // //     try {
// // // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // // //         method: 'PUT',
// // // // //         headers: { 'Content-Type': 'application/json' },
// // // // //         body: JSON.stringify(updatedData),
// // // // //       });
// // // // //       if (!response.ok) {
// // // // //         const errorData = await response.json();
// // // // //         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
// // // // //       }
// // // // //       const updatedFeature: Feature = await response.json();
// // // // //       setProduct((prevProduct) => {
// // // // //         if (!prevProduct) {
// // // // //           return null;
// // // // //         }
// // // // //         return {
// // // // //           ...prevProduct,
// // // // //           id: prevProduct.id, // Ensure id is always included
// // // // //           name: prevProduct.name, // Ensure name is always included
// // // // //           components: prevProduct.components?.map((comp) =>
// // // // //             comp.id === componentId
// // // // //               ? {
// // // // //                   ...comp,
// // // // //                   features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
// // // // //                 }
// // // // //               : comp
// // // // //           ) || [],
// // // // //         };
// // // // //       });
// // // // //       // Update the local features state as well for immediate UI update
// // // // //       setFeatures(prev => prev.map(f => (f.id === featureId ? updatedFeature : f)));
// // // // //       alert('Feature updated successfully!');
// // // // //     } catch (error: any) {
// // // // //       console.error('Error updating feature:', error);
// // // // //       alert(`Failed to update feature: ${error.message}`);
// // // // //     }
// // // // //   };
// // // // //   const handleDeleteFeature = async (featureId: string) => {
// // // // //     try {
// // // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // // //         method: 'DELETE',
// // // // //       });
// // // // //       if (!response.ok) {
// // // // //         throw new Error(`Failed to delete feature (status ${response.status})`);
// // // // //       }
// // // // //       setFeatures(prev => prev.filter(feature => feature.id !== featureId));
// // // // //       if (expandedFeature === featureId) {
// // // // //         setExpandedFeature(null);
// // // // //         setEditingFeature(null);
// // // // //       }
// // // // //     } catch (error) {
// // // // //       console.error('Error deleting feature:', error);
// // // // //       alert('Failed to delete feature');
// // // // //     }
// // // // //   };

// // // // //   const toggleFields = () => setFieldsExpanded(!fieldsExpanded);
// // // // //   const toggleComponents = () => setComponentsExpanded(!componentsExpanded);

// // // // //   const toggleComponent = (componentId: string) => {
// // // // //     if (expandedComponent === componentId) {
// // // // //       setExpandedComponent(null);
// // // // //       setSelectedComponentId(null);
// // // // //       setFeatures([]); // Clear features when component is closed
// // // // //     } else {
// // // // //       setExpandedComponent(componentId);
// // // // //       setSelectedComponentId(componentId);
// // // // //       // Features will be fetched in the useEffect hook
// // // // //     }
// // // // //     setExpandedFeature(null);
// // // // //     setEditingFeature(null);
// // // // //   };

// // // // //   const toggleFeature = (featureId: string) => {
// // // // //     if (expandedFeature === featureId) {
// // // // //       setExpandedFeature(null);
// // // // //       setEditingFeature(null);
// // // // //     } else {
// // // // //       const feature = features.find(f => f.id === featureId);
// // // // //       setExpandedFeature(featureId);
// // // // //       setEditingFeature(feature || null);
// // // // //     }
// // // // //   };

// // // // //   if (loading) return <div>Loading...</div>;
// // // // //   if (error) return <div>Error: {error}</div>;
// // // // //   if (!product) return <div>No product found</div>;

// // // // //   return (
// // // // //     <div className="p-6">
// // // // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // // //           <SheetHeader>
// // // // //             <SheetTitle>{product.name}</SheetTitle>
// // // // //           </SheetHeader>

// // // // //           {/* Fields Section */}
// // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // //             <div className="flex items-center gap-2">
// // // // //               <ChevronRight
// // // // //                 size={18}
// // // // //                 className={`text-gray-500 cursor-pointer ${fieldsExpanded ? 'transform rotate-90' : ''}`}
// // // // //                 onClick={toggleFields}
// // // // //               />
// // // // //               <span className="text-md font-semibold">Fields</span>
// // // // //             </div>
// // // // //             <Search size={18} className="text-gray-500 cursor-pointer" />
// // // // //           </div>

// // // // //           {fieldsExpanded && (
// // // // //             <div className="mt-4">
// // // // //               <div className="grid grid-cols-2 gap-4">
// // // // //                 {/* ... Product fields input ... */}
// // // // //               </div>
// // // // //               <div className="mt-4 flex justify-end">
// // // // //                 <Button onClick={handleUpdate} className="bg-gray-200 text-black hover:bg-gray-300">
// // // // //                   Update Product
// // // // //                 </Button>
// // // // //               </div>
// // // // //             </div>
// // // // //           )}

// // // // //           {/* Components Section */}
// // // // //           <div className="border-b py-3 flex justify-between items-center">
// // // // //             <div className="flex items-center gap-2">
// // // // //               <ChevronRight
// // // // //                 size={18}
// // // // //                 className={`text-gray-500 cursor-pointer ${componentsExpanded ? 'transform rotate-90' : ''}`}
// // // // //                 onClick={toggleComponents}
// // // // //               />
// // // // //               <span className="text-md font-semibold">Components</span>
// // // // //               <span className="text-xs text-gray-500 border rounded px-1">{product.components?.length || 0}</span>
// // // // //             </div>
// // // // //             <div className="flex items-center gap-2">
// // // // //               <Input
// // // // //                 value={newComponentName}
// // // // //                 onChange={(e) => setNewComponentName(e.target.value)}
// // // // //                 placeholder="New component name"
// // // // //                 className="h-8 text-sm"
// // // // //               />
// // // // //               <Button
// // // // //                 onClick={handleAddComponent}
// // // // //                 size="sm"
// // // // //                 variant="outline"
// // // // //                 className="px-2"
// // // // //               >
// // // // //                 <Plus size={16} />
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>

// // // // //           {componentsExpanded && (
// // // // //             <div className="mt-2">
// // // // //               {product.components?.map((component) => (
// // // // //                 <div key={component.id} className="mb-1">
// // // // //                   {/* Component Row */}
// // // // //                   <div
// // // // //                     className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // // //                     onClick={() => toggleComponent(component.id)}
// // // // //                   >
// // // // //                     <div className="flex items-center gap-2">
// // // // //                       <ChevronRight
// // // // //                         size={16}
// // // // //                         className={`text-gray-500 ${expandedComponent === component.id ? 'transform rotate-90' : ''}`}
// // // // //                       />
// // // // //                       <span>{component.name}</span>
// // // // //                     </div>
// // // // //                     <div className="flex items-center gap-2">
// // // // //                       <Input
// // // // //                         value={component.name}
// // // // //                         onClick={(e) => e.stopPropagation()}
// // // // //                         onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // // // //                         className="h-8 text-sm"
// // // // //                         placeholder="Component name"
// // // // //                       />
// // // // //                       <Button
// // // // //                         onClick={(e) => {
// // // // //                           e.stopPropagation();
// // // // //                           handleUpdateComponent(component.id);
// // // // //                         }}
// // // // //                         size="sm"
// // // // //                         variant="outline"
// // // // //                         className="px-2"
// // // // //                       >
// // // // //                         <Save size={16} />
// // // // //                       </Button>
// // // // //                     </div>
// // // // //                   </div>

// // // // //                   {/* Features List when Component is expanded */}
// // // // //                   {expandedComponent === component.id && (
// // // // //                     <div className="ml-6 mt-2 border-l pl-4">
// // // // //                       <div className="flex items-center justify-between mb-2">
// // // // //                         <span className="text-sm font-medium">Features</span>
// // // // //                         <span className="text-xs text-gray-500 border rounded px-1">{features.length}</span>
// // // // //                         <div className="flex items-center gap-2">
// // // // //                           <Input
// // // // //                             value={newFeatureName}
// // // // //                             onChange={(e) => setNewFeatureName(e.target.value)}
// // // // //                             placeholder="New feature name"
// // // // //                             className="h-8 text-sm"
// // // // //                           />
// // // // //                           <Button
// // // // //                             onClick={handleAddFeature}
// // // // //                             size="sm"
// // // // //                             variant="outline"
// // // // //                             className="px-2"
// // // // //                           >
// // // // //                             <Plus size={16} />
// // // // //                           </Button>
// // // // //                         </div>
// // // // //                       </div>

// // // // //                       {loadingFeatures ? (
// // // // //                         <div className="text-sm text-gray-500 italic">Loading features...</div>
// // // // //                       ) : features.length === 0 ? (
// // // // //                         <div className="text-sm text-gray-500 italic">No features found</div>
// // // // //                       ) : (
// // // // //                         <div>
// // // // //                           {features.map(feature => (
// // // // //                             <div key={feature.id} className="mb-1">
// // // // //                               {/* Feature Row */}
// // // // //                               <div
// // // // //                                 className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // // //                                 onClick={() => toggleFeature(feature.id)}
// // // // //                               >
// // // // //                                 <div className="flex items-center gap-2">
// // // // //                                   <ChevronRight
// // // // //                                     size={16}
// // // // //                                     className={`text-gray-500 ${expandedFeature === feature.id ? 'transform rotate-90' : ''}`}
// // // // //                                   />
// // // // //                                   <span>{feature.name}</span>
// // // // //                                   </div>
// // // // //                                 <div className="flex gap-1">
// // // // //                                   <Button
// // // // //                                     onClick={(e) => {
// // // // //                                       e.stopPropagation();
// // // // //                                       toggleFeature(feature.id);
// // // // //                                     }}
// // // // //                                     size="sm"
// // // // //                                     variant="ghost"
// // // // //                                     className="h-8 w-8 p-0"
// // // // //                                   >
// // // // //                                     <Edit size={16} />
// // // // //                                   </Button>
// // // // //                                   <Button
// // // // //                                     onClick={(e) => {
// // // // //                                       e.stopPropagation();
// // // // //                                       handleDeleteFeature(feature.id);
// // // // //                                     }}
// // // // //                                     size="sm"
// // // // //                                     variant="ghost"
// // // // //                                     className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
// // // // //                                   >
// // // // //                                     <Trash2 size={16} />
// // // // //                                   </Button>
// // // // //                                 </div>
// // // // //                               </div>

// // // // //                               {/* Feature Edit Form */}
// // // // //                               {expandedFeature === feature.id && editingFeature && (
// // // // //                                 <div className="ml-6 mt-2 p-3 border rounded bg-gray-50">
// // // // //                                   <div className="grid grid-cols-2 gap-3">
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Feature Name</label>
// // // // //                                       <Input
// // // // //                                         value={editingFeature.name}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Status</label>
// // // // //                                       <Input
// // // // //                                         value={editingFeature.status || ''}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'status', e.target.value)}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Progress</label>
// // // // //                                       <Input
// // // // //                                         type="number"
// // // // //                                         value={editingFeature.progress || 0}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'progress', parseInt(e.target.value))}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Team</label>
// // // // //                                       <Input
// // // // //                                         value={editingFeature.team || ''}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'team', e.target.value)}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Days</label>
// // // // //                                       <Input
// // // // //                                         type="number"
// // // // //                                         value={editingFeature.days || 0}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'days', parseInt(e.target.value))}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>

// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Start Date</label>
// // // // //                                       <Input
// // // // //                                         type="date"
// // // // //                                         value={editingFeature.startDate || ''}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'startDate', e.target.value)}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div>
// // // // //                                       <label className="text-xs font-medium">Target Date</label>
// // // // //                                       <Input
// // // // //                                         type="date"
// // // // //                                         value={editingFeature.targetDate || ''}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'targetDate', e.target.value)}
// // // // //                                         className="mt-1"
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                     <div className="col-span-2">
// // // // //                                       <label className="text-xs font-medium">Remarks</label>
// // // // //                                       <textarea
// // // // //                                         value={editingFeature.remarks || ''}
// // // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'remarks', e.target.value)}
// // // // //                                         className="mt-1 w-full p-2 border border-gray-300 rounded"
// // // // //                                         rows={3}
// // // // //                                       />
// // // // //                                     </div>
// // // // //                                   </div>
// // // // //                                   <div className="mt-3 flex justify-end">
// // // // //                                     <Button onClick={() => handleUpdateFeature(component.id, feature.id, editingFeature || {})} className="bg-gray-200 text-black hover:bg-gray-300">
// // // // //                                       Save Changes
// // // // //                                     </Button>
// // // // //                                   </div>
// // // // //                                 </div>
// // // // //                               )}
// // // // //                             </div>
// // // // //                           ))}
// // // // //                         </div>
// // // // //                       )}
// // // // //                     </div>
// // // // //                   )}
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           )}
// // // // //         </SheetContent>
// // // // //       </Sheet>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default ProductDetailsPage;


// // // // 'use client';

// // // // import React, { useEffect, useState } from 'react';
// // // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // // import { Button } from '@/components/ui/button';
// // // // import { Plus, ChevronRight, Search, Save, Edit, Trash2 } from 'lucide-react';
// // // // import { Product, Component, Feature } from '@/app/types';
// // // // import { Input } from '@/components/ui/input';
// // // // import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

// // // // interface ProductDetailsPageProps {
// // // //   productId: string;
// // // //   isOpen: boolean;
// // // //   onClose: () => void;
// // // // }

// // // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// // // //   const [product, setProduct] = useState<Product | null>(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState<string | null>(null);
// // // //   const [fieldsExpanded, setFieldsExpanded] = useState(true); // Initially expand fields
// // // //   const [componentsExpanded, setComponentsExpanded] = useState(true);
// // // //   const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
// // // //   const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
// // // //   const [newComponentName, setNewComponentName] = useState('');
// // // //   const [newFeatureName, setNewFeatureName] = useState('');
// // // //   const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
// // // //   const [features, setFeatures] = useState<Feature[]>([]);
// // // //   const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
// // // //   const [loadingFeatures, setLoadingFeatures] = useState(false);
// // // //   const [isEditingProduct, setIsEditingProduct] = useState(false);
// // // //   const [editedProduct, setEditedProduct] = useState<Product | null>(null);

// // // //   useEffect(() => {
// // // //     if (isOpen && productId) {
// // // //       const fetchProductDetails = async () => {
// // // //         setLoading(true);
// // // //         setError(null);
// // // //         try {
// // // //           const response = await fetch(`/api/product/${productId}`);
// // // //           if (!response.ok) {
// // // //             const errorData = await response.json();
// // // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // // //           }
// // // //           const data: Product = await response.json();
// // // //           setProduct(data);
// // // //           setEditedProduct({ ...data }); // Initialize editedProduct with fetched data
// // // //         } catch (err: any) {
// // // //           setError(err.message);
// // // //         } finally {
// // // //           setLoading(false);
// // // //         }
// // // //       };
// // // //       fetchProductDetails();
// // // //     } else {
// // // //       setProduct(null);
// // // //       setEditedProduct(null);
// // // //       setIsEditingProduct(false);
// // // //     }
// // // //   }, [isOpen, productId]);

// // // //   async function fetchFeatures(componentId: string) {
// // // //     setLoadingFeatures(true);
// // // //     try {
// // // //       const { data: featuresData, error: featuresError } = await supabase
// // // //         .from('features')
// // // //         .select('*')
// // // //         .eq('component_id', componentId);

// // // //       if (featuresError) throw featuresError;
// // // //       const mappedFeatures: Feature[] = featuresData.map(feature => ({
// // // //         id: feature.id,
// // // //         component_id: feature.component_id,
// // // //         name: feature.name || 'Feature',
// // // //         status: feature.status,
// // // //         progress: feature.progress,
// // // //         team: feature.team,
// // // //         days: feature.days,
// // // //         startDate: feature.startDate,
// // // //         targetDate: feature.targetDate,
// // // //         completedOn: feature.completedOn,
// // // //         remarks: feature.remarks,
// // // //         color: feature.color,
// // // //         created_at: feature.created_at,
// // // //         owner: feature.owner,
// // // //       }));
// // // //       setFeatures(mappedFeatures);
// // // //     } catch (error) {
// // // //       console.error('Error fetching features:', error);
// // // //       setFeatures([]);
// // // //     } finally {
// // // //       setLoadingFeatures(false);
// // // //     }
// // // //   }

// // // //   // Fetch features when component is selected
// // // //   useEffect(() => {
// // // //     if (selectedComponentId) {
// // // //       fetchFeatures(selectedComponentId);
// // // //     } else {
// // // //       setFeatures([]);
// // // //     }
// // // //   }, [selectedComponentId]);

// // // //   const handleProductInputChange = (field: keyof Product, value: any) => {
// // // //     setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
// // // //   };

// // // //   const enableEditProduct = () => {
// // // //     setIsEditingProduct(true);
// // // //   };

// // // //   const handleSaveProduct = async () => {
// // // //     if (!editedProduct || !productId) return;
// // // //     try {
// // // //       const response = await fetch(`/api/product/${productId}`, {
// // // //         method: 'PUT',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify(editedProduct),
// // // //       });
// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData?.error || `Failed to update product`);
// // // //       }
// // // //       const data: Product = await response.json();
// // // //       setProduct(data);
// // // //       setEditedProduct(data);
// // // //       setIsEditingProduct(false);
// // // //       alert('Product updated successfully!');
// // // //     } catch (error) {
// // // //       if (error instanceof Error) {
// // // //         alert('Error updating product: ' + error.message);
// // // //       } else {
// // // //         alert('Error updating product: An unknown error occurred.');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleDeleteProduct = async () => {
// // // //     if (!productId) return;
// // // //     if (window.confirm('Are you sure you want to delete this product? This will also delete associated components and features.')) {
// // // //       try {
// // // //         const response = await fetch(`/api/product/${productId}`, {
// // // //           method: 'DELETE',
// // // //         });
// // // //         if (!response.ok) {
// // // //           const errorData = await response.json();
// // // //           throw new Error(errorData?.error || `Failed to delete product`);
// // // //         }
// // // //         alert('Product deleted successfully!');
// // // //         onClose(); // Close the sheet after deletion
// // // //       } catch (error) {
// // // //         if (error instanceof Error) {
// // // //           alert('Error deleting product: ' + error.message);
// // // //         } else {
// // // //           alert('Error deleting product: An unknown error occurred.');
// // // //         }
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // // //     setProduct((prevProduct) => {
// // // //       if (!prevProduct) {
// // // //         return null;
// // // //       }
// // // //       return {
// // // //         ...prevProduct,
// // // //         components: prevProduct.components?.map((comp) =>
// // // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // // //         ),
// // // //       };
// // // //     });
// // // //   };

// // // //   const handleUpdateComponent = async (componentId: string) => {
// // // //     const component = product?.components?.find(comp => comp.id === componentId);
// // // //     if (!component) return;

// // // //     try {
// // // //       const response = await fetch(`/api/components/${componentId}`, {
// // // //         method: 'PUT',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify(component),
// // // //       });
// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // // //       }
// // // //       alert('Component updated successfully!');
// // // //     } catch (error: any) {
// // // //       console.error('Error updating component:', error);
// // // //       alert(`Failed to update component: ${error.message}`);
// // // //     }
// // // //   };

// // // //   const handleAddComponent = async () => {
// // // //     if (newComponentName && product) {
// // // //       try {
// // // //         const response = await fetch('/api/components', {
// // // //           method: 'POST',
// // // //           headers: { 'Content-Type': 'application/json' },
// // // //           body: JSON.stringify({
// // // //             name: newComponentName,
// // // //             product_id: product.id
// // // //           }),
// // // //         });
// // // //         if (!response.ok) {
// // // //           throw new Error(`Failed to add component (status ${response.status})`);
// // // //         }
// // // //         const newComponent = await response.json();

// // // //         setProduct(prevProduct => {
// // // //           if (!prevProduct) return null;
// // // //           return {
// // // //             ...prevProduct,
// // // //             components: [...(prevProduct.components || []), newComponent]
// // // //           };
// // // //         });

// // // //         setNewComponentName('');
// // // //       } catch (error) {
// // // //         console.error('Error adding component:', error);
// // // //         alert('Failed to add component');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleAddFeature = async () => {
// // // //     if (newFeatureName && selectedComponentId) {
// // // //       try {
// // // //         const response = await fetch('/api/feature', {
// // // //           method: 'POST',
// // // //           headers: { 'Content-Type': 'application/json' },
// // // //           body: JSON.stringify({
// // // //             name: newFeatureName,
// // // //             component_id: selectedComponentId
// // // //           }),
// // // //         });
// // // //         if (!response.ok) {
// // // //           throw new Error(`Failed to add feature (status ${response.status})`);
// // // //         }
// // // //         const newFeature = await response.json();
// // // //         setFeatures(prev => [...prev, newFeature]);
// // // //         setNewFeatureName('');
// // // //       } catch (error) {
// // // //         console.error('Error adding feature:', error);
// // // //         alert('Failed to add feature');
// // // //       }
// // // //     }
// // // //   };

// // // //   const handleFeatureChange = (featureId: string, field: string, value: any) => {
// // // //     setEditingFeature(prev => {
// // // //       if (!prev || prev.id !== featureId) return prev;
// // // //       return { ...prev, [field]: value };
// // // //     });
// // // //   };

// // // //   const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
// // // //     try {
// // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // //         method: 'PUT',
// // // //         headers: { 'Content-Type': 'application/json' },
// // // //         body: JSON.stringify(updatedData),
// // // //       });
// // // //       if (!response.ok) {
// // // //         const errorData = await response.json();
// // // //         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
// // // //       }
// // // //       const updatedFeature: Feature = await response.json();
// // // //       setProduct((prevProduct) => {
// // // //         if (!prevProduct) {
// // // //           return null;
// // // //         }
// // // //         return {
// // // //           ...prevProduct,
// // // //           id: prevProduct.id, // Ensure id is always included
// // // //           name: prevProduct.name, // Ensure name is always included
// // // //           components: prevProduct.components?.map((comp) =>
// // // //             comp.id === componentId
// // // //               ? {
// // // //                   ...comp,
// // // //                   features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
// // // //                 }
// // // //               : comp
// // // //           ) || [],
// // // //         };
// // // //       });
// // // //       // Update the local features state as well for immediate UI update
// // // //       setFeatures(prev => prev.map(f => (f.id === featureId ? updatedFeature : f)));
// // // //       alert('Feature updated successfully!');
// // // //     } catch (error: any) {
// // // //       console.error('Error updating feature:', error);
// // // //       alert(`Failed to update feature: ${error.message}`);
// // // //     }
// // // //   };
// // // //   const handleDeleteFeature = async (featureId: string) => {
// // // //     try {
// // // //       const response = await fetch(`/api/features/${featureId}`, {
// // // //         method: 'DELETE',
// // // //       });
// // // //       if (!response.ok) {
// // // //         throw new Error(`Failed to delete feature (status ${response.status})`);
// // // //       }
// // // //       setFeatures(prev => prev.filter(feature => feature.id !== featureId));
// // // //       if (expandedFeature === featureId) {
// // // //         setExpandedFeature(null);
// // // //         setEditingFeature(null);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error('Error deleting feature:', error);
// // // //       alert('Failed to delete feature');
// // // //     }
// // // //   };

// // // //   const toggleFields = () => setFieldsExpanded(!fieldsExpanded);
// // // //   const toggleComponents = () => setComponentsExpanded(!componentsExpanded);

// // // //   const toggleComponent = (componentId: string) => {
// // // //     if (expandedComponent === componentId) {
// // // //       setExpandedComponent(null);
// // // //       setSelectedComponentId(null);
// // // //       setFeatures([]); // Clear features when component is closed
// // // //     } else {
// // // //       setExpandedComponent(componentId);
// // // //       setSelectedComponentId(componentId);
// // // //       // Features will be fetched in the useEffect hook
// // // //     }
// // // //     setExpandedFeature(null);
// // // //     setEditingFeature(null);
// // // //   };

// // // //   const toggleFeature = (featureId: string) => {
// // // //     if (expandedFeature === featureId) {
// // // //       setExpandedFeature(null);
// // // //       setEditingFeature(null);
// // // //     } else {
// // // //       const feature = features.find(f => f.id === featureId);
// // // //       setExpandedFeature(featureId);
// // // //       setEditingFeature(feature || null);
// // // //     }
// // // //   };

// // // //   if (loading) return <div>Loading...</div>;
// // // //   if (error) return <div>Error: {error}</div>;
// // // //   if (!product) return <div>No product found</div>;

// // // //   return (
// // // //     <div className="p-6">
// // // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // // //           <SheetHeader>
// // // //             <SheetTitle>{product.name}</SheetTitle>
// // // //           </SheetHeader>

// // // //           {/* Fields Section */}
// // // //           <div className="border-b py-3 flex justify-between items-center">
// // // //             <div className="flex items-center gap-2">
// // // //               <ChevronRight
// // // //                 size={18}
// // // //                 className={`text-gray-500 cursor-pointer ${fieldsExpanded ? 'transform rotate-90' : ''}`}
// // // //                 onClick={toggleFields}
// // // //               />
// // // //               <span className="text-md font-semibold">Product Details</span>
// // // //             </div>
// // // //             <div className="flex gap-2">
// // // //               {!isEditingProduct ? (
// // // //                 <Button onClick={enableEditProduct} size="sm" variant="outline">
// // // //                   <Edit size={16} className="mr-2" /> Edit
// // // //                 </Button>
// // // //               ) : (
// // // //                 <Button onClick={handleSaveProduct} size="sm" variant="outline">
// // // //                   <Save size={16} className="mr-2" /> Save
// // // //                 </Button>
// // // //               )}
// // // //               <Button onClick={handleDeleteProduct} size="sm" variant="destructive">
// // // //                 <Trash2 size={16} className="mr-2" /> Delete
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           {fieldsExpanded && editedProduct && (
// // // //             <div className="mt-4 grid grid-cols-2 gap-4">
// // // //               <div>
// // // //                 <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
// // // //                   Product Name
// // // //                 </label>
// // // //                 <Input
// // // //                   type="text"
// // // //                   id="productName"
// // // //                   value={editedProduct.name || ''}
// // // //                   onChange={(e) => handleProductInputChange('name', e.target.value)}
// // // //                   disabled={!isEditingProduct}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>
// // // //               {/* Add more product fields here for editing */}
// // // //               <div>
// // // //                 <label htmlFor="productStatus" className="block text-sm font-medium text-gray-700">
// // // //                   Status
// // // //                 </label>
// // // //                 <Input
// // // //                   type="text"
// // // //                   id="productStatus"
// // // //                   value={editedProduct.status || ''}
// // // //                   onChange={(e) => handleProductInputChange('status', e.target.value)}
// // // //                   disabled={!isEditingProduct}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>
// // // //               <div>
// // // //                 <label htmlFor="productProgress" className="block text-sm font-medium text-gray-700">
// // // //                   Progress
// // // //                 </label>
// // // //                 <Input
// // // //                   type="number"
// // // //                   id="productProgress"
// // // //                   value={editedProduct.progress !== null ? editedProduct.progress : ''}
// // // //                   onChange={(e) => handleProductInputChange('progress', parseInt(e.target.value))}
// // // //                   disabled={!isEditingProduct}
// // // //                   className="mt-1"
// // // //                 />
// // // //               </div>
// // // //               {/* ... Add other product fields like team, days, start date, etc. ... */}
// // // //             </div>
// // // //           )}

// // // //           {/* Components Section */}
// // // //           <div className="border-b py-3 flex justify-between items-center mt-6">
// // // //             <div className="flex items-center gap-2">
// // // //               <ChevronRight
// // // //                 size={18}
// // // //                 className={`text-gray-500 cursor-pointer ${componentsExpanded ? 'transform rotate-90' : ''}`}
// // // //                 onClick={toggleComponents}
// // // //               />
// // // //               <span className="text-md font-semibold">Components</span>
// // // //               <span className="text-xs text-gray-500 border rounded px-1">{product.components?.length || 0}</span>
// // // //             </div>
// // // //             <div className="flex items-center gap-2">
// // // //               <Input
// // // //                 value={newComponentName}
// // // //                 onChange={(e) => setNewComponentName(e.target.value)}
// // // //                 placeholder="New component name"
// // // //                 className="h-8 text-sm"
// // // //               />
// // // //               <Button 
// // // //               onClick={handleAddComponent}
// // // //                 size="sm"
// // // //                 variant="outline"
// // // //                 className="px-2"
// // // //               >
// // // //                 <Plus size={16} />
// // // //               </Button>
// // // //             </div>
// // // //           </div>

// // // //           {componentsExpanded && (
// // // //             <div className="mt-2">
// // // //               {product.components?.map((component) => (
// // // //                 <div key={component.id} className="mb-1">
// // // //                   {/* Component Row */}
// // // //                   <div
// // // //                     className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // //                     onClick={() => toggleComponent(component.id)}
// // // //                   >
// // // //                     <div className="flex items-center gap-2">
// // // //                       <ChevronRight
// // // //                         size={16}
// // // //                         className={`text-gray-500 ${expandedComponent === component.id ? 'transform rotate-90' : ''}`}
// // // //                       />
// // // //                       <span>{component.name}</span>
// // // //                     </div>
// // // //                     <div className="flex items-center gap-2">
// // // //                       <Input
// // // //                         value={component.name}
// // // //                         onClick={(e) => e.stopPropagation()}
// // // //                         onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // // //                         className="h-8 text-sm"
// // // //                         placeholder="Component name"
// // // //                       />
// // // //                       <Button
// // // //                         onClick={(e) => {
// // // //                           e.stopPropagation();
// // // //                           handleUpdateComponent(component.id);
// // // //                         }}
// // // //                         size="sm"
// // // //                         variant="outline"
// // // //                         className="px-2"
// // // //                       >
// // // //                         <Save size={16} />
// // // //                       </Button>
// // // //                     </div>
// // // //                   </div>

// // // //                   {/* Features List when Component is expanded */}
// // // //                   {expandedComponent === component.id && (
// // // //                     <div className="ml-6 mt-2 border-l pl-4">
// // // //                       <div className="flex items-center justify-between mb-2">
// // // //                         <span className="text-sm font-medium">Features</span>
// // // //                         <span className="text-xs text-gray-500 border rounded px-1">{features.length}</span>
// // // //                         <div className="flex items-center gap-2">
// // // //                           <Input
// // // //                             value={newFeatureName}
// // // //                             onChange={(e) => setNewFeatureName(e.target.value)}
// // // //                             placeholder="New feature name"
// // // //                             className="h-8 text-sm"
// // // //                           />
// // // //                           <Button
// // // //                             onClick={handleAddFeature}
// // // //                             size="sm"
// // // //                             variant="outline"
// // // //                             className="px-2"
// // // //                           >
// // // //                             <Plus size={16} />
// // // //                           </Button>
// // // //                         </div>
// // // //                       </div>

// // // //                       {loadingFeatures ? (
// // // //                         <div className="text-sm text-gray-500 italic">Loading features...</div>
// // // //                       ) : features.length === 0 ? (
// // // //                         <div className="text-sm text-gray-500 italic">No features found</div>
// // // //                       ) : (
// // // //                         <div>
// // // //                           {features.map(feature => (
// // // //                             <div key={feature.id} className="mb-1">
// // // //                               {/* Feature Row */}
// // // //                               <div
// // // //                                 className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // // //                                 onClick={() => toggleFeature(feature.id)}
// // // //                               >
// // // //                                 <div className="flex items-center gap-2">
// // // //                                   <ChevronRight
// // // //                                     size={16}
// // // //                                     className={`text-gray-500 ${expandedFeature === feature.id ? 'transform rotate-90' : ''}`}
// // // //                                   />
// // // //                                   <span>{feature.name}</span>
// // // //                                 </div>
// // // //                                 <div className="flex gap-1">
// // // //                                   <Button
// // // //                                     onClick={(e) => {
// // // //                                       e.stopPropagation();
// // // //                                       toggleFeature(feature.id);
// // // //                                     }}
// // // //                                     size="sm"
// // // //                                     variant="ghost"
// // // //                                     className="h-8 w-8 p-0"
// // // //                                   >
// // // //                                     <Edit size={16} />
// // // //                                   </Button>
// // // //                                   <Button
// // // //                                     onClick={(e) => {
// // // //                                       e.stopPropagation();
// // // //                                       handleDeleteFeature(feature.id);
// // // //                                     }}
// // // //                                     size="sm"
// // // //                                     variant="ghost"
// // // //                                     className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
// // // //                                   >
// // // //                                     <Trash2 size={16} />
// // // //                                   </Button>
// // // //                                 </div>
// // // //                               </div>

// // // //                               {/* Feature Edit Form */}
// // // //                               {expandedFeature === feature.id && editingFeature && (
// // // //                                 <div className="ml-6 mt-2 p-3 border rounded bg-gray-50">
// // // //                                   <div className="grid grid-cols-2 gap-3">
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Feature Name</label>
// // // //                                       <Input
// // // //                                         value={editingFeature.name}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Status</label>
// // // //                                       <Input
// // // //                                         value={editingFeature.status || ''}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'status', e.target.value)}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Progress</label>
// // // //                                       <Input
// // // //                                         type="number"
// // // //                                         value={editingFeature.progress || 0}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'progress', parseInt(e.target.value))}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Team</label>
// // // //                                       <Input
// // // //                                         value={editingFeature.team || ''}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'team', e.target.value)}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Days</label>
// // // //                                       <Input
// // // //                                         type="number"
// // // //                                         value={editingFeature.days || 0}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'days', parseInt(e.target.value))}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>

// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Start Date</label>
// // // //                                       <Input
// // // //                                         type="date"
// // // //                                         value={editingFeature.startDate || ''}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'startDate', e.target.value)}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div>
// // // //                                       <label className="text-xs font-medium">Target Date</label>
// // // //                                       <Input
// // // //                                         type="date"
// // // //                                         value={editingFeature.targetDate || ''}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'targetDate', e.target.value)}
// // // //                                         className="mt-1"
// // // //                                       />
// // // //                                     </div>
// // // //                                     <div className="col-span-2">
// // // //                                       <label className="text-xs font-medium">Remarks</label>
// // // //                                       <textarea
// // // //                                         value={editingFeature.remarks || ''}
// // // //                                         onChange={(e) => handleFeatureChange(feature.id, 'remarks', e.target.value)}
// // // //                                         className="mt-1 w-full p-2 border border-gray-300 rounded"
// // // //                                         rows={3}
// // // //                                       />
// // // //                                     </div>
// // // //                                   </div>
// // // //                                   <div className="mt-3 flex justify-end">
// // // //                                     <Button onClick={() => handleUpdateFeature(component.id, feature.id, editingFeature || {})} className="bg-gray-200 text-black hover:bg-gray-300">
// // // //                                       Save Changes
// // // //                                     </Button>
// // // //                                   </div>
// // // //                                 </div>
// // // //                               )}
// // // //                             </div>
// // // //                           ))}
// // // //                         </div>
// // // //                       )}
// // // //                     </div>
// // // //                   )}
// // // //                 </div>
// // // //               ))}
// // // //             </div>
// // // //           )}
// // // //         </SheetContent>
// // // //       </Sheet>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default ProductDetailsPage;



// // // 'use client';

// // // import React, { useEffect, useState } from 'react';
// // // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // // import { Button } from '@/components/ui/button';
// // // import { Plus, ChevronRight, Search, Save, Edit, Trash2 } from 'lucide-react';
// // // import { Product, Component, Feature } from '@/app/types';
// // // import { Input } from '@/components/ui/input';
// // // import { supabase } from '@/lib/supabaseClient'; // Import your Supabase client

// // // interface ProductDetailsPageProps {
// // //   productId: string;
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // // }

// // // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// // //   const [product, setProduct] = useState<Product | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState<string | null>(null);
// // //   const [fieldsExpanded, setFieldsExpanded] = useState(true); // Initially expand fields
// // //   const [componentsExpanded, setComponentsExpanded] = useState(true);
// // //   const [expandedComponent, setExpandedComponent] = useState<string | null>(null);
// // //   const [expandedFeature, setExpandedFeature] = useState<string | null>(null);
// // //   const [newComponentName, setNewComponentName] = useState('');
// // //   const [newFeatureName, setNewFeatureName] = useState('');
// // //   const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);
// // //   const [features, setFeatures] = useState<Feature[]>([]);
// // //   const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
// // //   const [loadingFeatures, setLoadingFeatures] = useState(false);
// // //   const [isEditingProduct, setIsEditingProduct] = useState(false);
// // //   const [editedProduct, setEditedProduct] = useState<Product | null>(null);

// // //   useEffect(() => {
// // //     if (isOpen && productId) {
// // //       const fetchProductDetails = async () => {
// // //         setLoading(true);
// // //         setError(null);
// // //         try {
// // //           const response = await fetch(`/api/product/${productId}`);
// // //           if (!response.ok) {
// // //             const errorData = await response.json();
// // //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// // //           }
// // //           const data: Product = await response.json();
// // //           setProduct(data);
// // //           setEditedProduct({ ...data }); // Initialize editedProduct with fetched data
// // //         } catch (err: any) {
// // //           setError(err.message);
// // //         } finally {
// // //           setLoading(false);
// // //         }
// // //       };
// // //       fetchProductDetails();
// // //     } else {
// // //       setProduct(null);
// // //       setEditedProduct(null);
// // //       setIsEditingProduct(false);
// // //     }
// // //   }, [isOpen, productId]);

// // //   async function fetchFeatures(componentId: string) {
// // //     setLoadingFeatures(true);
// // //     try {
// // //       const { data: featuresData, error: featuresError } = await supabase
// // //         .from('features')
// // //         .select('*')
// // //         .eq('component_id', componentId);

// // //       if (featuresError) throw featuresError;
// // //       const mappedFeatures: Feature[] = featuresData.map(feature => ({
// // //         id: feature.id,
// // //         component_id: feature.component_id,
// // //         name: feature.name || 'Feature',
// // //         status: feature.status,
// // //         progress: feature.progress,
// // //         team: feature.team,
// // //         days: feature.days,
// // //         startDate: feature.startDate,
// // //         targetDate: feature.targetDate,
// // //         completedOn: feature.completedOn,
// // //         remarks: feature.remarks,
// // //         color: feature.color,
// // //         created_at: feature.created_at,
// // //         owner: feature.owner,
// // //       }));
// // //       setFeatures(mappedFeatures);
// // //     } catch (error) {
// // //       console.error('Error fetching features:', error);
// // //       setFeatures([]);
// // //     } finally {
// // //       setLoadingFeatures(false);
// // //     }
// // //   }

// // //   // Fetch features when component is selected
// // //   useEffect(() => {
// // //     if (selectedComponentId) {
// // //       fetchFeatures(selectedComponentId);
// // //     } else {
// // //       setFeatures([]);
// // //     }
// // //   }, [selectedComponentId]);

// // //   const handleProductInputChange = (field: keyof Product, value: any) => {
// // //     setEditedProduct(prev => prev ? { ...prev, [field]: value } : null);
// // //   };

// // //   const enableEditProduct = () => {
// // //     setIsEditingProduct(true);
// // //   };

// // //   const handleSaveProduct = async () => {
// // //     if (!editedProduct || !productId) return;
// // //     try {
// // //       const response = await fetch(`/api/product/${productId}`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(editedProduct),
// // //       });
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData?.error || `Failed to update product`);
// // //       }
// // //       const data: Product = await response.json();
// // //       setProduct(data);
// // //       setEditedProduct(data);
// // //       setIsEditingProduct(false);
// // //       alert('Product updated successfully!');
// // //     } catch (error) {
// // //       if (error instanceof Error) {
// // //         alert('Error updating product: ' + error.message);
// // //       } else {
// // //         alert('Error updating product: An unknown error occurred.');
// // //       }
// // //     }
// // //   };

// // //   const handleDeleteProduct = async () => {
// // //     if (!productId) return;
// // //     if (window.confirm('Are you sure you want to delete this product? This will also delete associated components and features.')) {
// // //       try {
// // //         const response = await fetch(`/api/product/${productId}`, {
// // //           method: 'DELETE',
// // //         });
// // //         if (!response.ok) {
// // //           const errorData = await response.json();
// // //           throw new Error(errorData?.error || `Failed to delete product`);
// // //         }
// // //         alert('Product deleted successfully!');
// // //         onClose(); // Close the sheet after deletion
// // //       } catch (error) {
// // //         if (error instanceof Error) {
// // //           alert('Error deleting product: ' + error.message);
// // //         } else {
// // //           alert('Error deleting product: An unknown error occurred.');
// // //         }
// // //       }
// // //     }
// // //   };

// // //   const handleComponentChange = (componentId: string, updatedComponent: Partial<Component>) => {
// // //     setProduct((prevProduct) => {
// // //       if (!prevProduct) {
// // //         return null;
// // //       }
// // //       return {
// // //         ...prevProduct,
// // //         components: prevProduct.components?.map((comp) =>
// // //           comp.id === componentId ? { ...comp, ...updatedComponent, id: comp.id, product_id: comp.product_id } : comp
// // //         ),
// // //       };
// // //     });
// // //   };

// // //   const handleUpdateComponent = async (componentId: string) => {
// // //     const component = product?.components?.find(comp => comp.id === componentId);
// // //     if (!component) return;

// // //     try {
// // //       const response = await fetch(`/api/component/${componentId}`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(component),
// // //       });
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData?.error || `Failed to update component (status ${response.status})`);
// // //       }
// // //       alert('Component updated successfully!');
// // //     } catch (error: any) {
// // //       console.error('Error updating component:', error);
// // //       alert(`Failed to update component: ${error.message}`);
// // //     }
// // //   };

// // //   const handleAddComponent = async () => {
// // //     if (newComponentName && product) {
// // //       try {
// // //         const response = await fetch('/api/components', {
// // //           method: 'POST',
// // //           headers: { 'Content-Type': 'application/json' },
// // //           body: JSON.stringify({
// // //             name: newComponentName,
// // //             product_id: product.id
// // //           }),
// // //         });
// // //         if (!response.ok) {
// // //           throw new Error(`Failed to add component (status ${response.status})`);
// // //         }
// // //         const newComponent = await response.json();

// // //         setProduct(prevProduct => {
// // //           if (!prevProduct) return null;
// // //           return {
// // //             ...prevProduct,
// // //             components: [...(prevProduct.components || []), newComponent]
// // //           };
// // //         });

// // //         setNewComponentName('');
// // //       } catch (error) {
// // //         console.error('Error adding component:', error);
// // //         alert('Failed to add component');
// // //       }
// // //     }
// // //   };

// // //   const handleAddFeature = async () => {
// // //     if (newFeatureName && selectedComponentId) {
// // //       try {
// // //         const response = await fetch('/api/feature', {
// // //           method: 'POST',
// // //           headers: { 'Content-Type': 'application/json' },
// // //           body: JSON.stringify({
// // //             name: newFeatureName,
// // //             component_id: selectedComponentId
// // //           }),
// // //         });
// // //         if (!response.ok) {
// // //           throw new Error(`Failed to add feature (status ${response.status})`);
// // //         }
// // //         const newFeature = await response.json();
// // //         setFeatures(prev => [...prev, newFeature]);
// // //         setNewFeatureName('');
// // //       } catch (error) {
// // //         console.error('Error adding feature:', error);
// // //         alert('Failed to add feature');
// // //       }
// // //     }
// // //   };

// // //   const handleFeatureChange = (featureId: string, field: string, value: any) => {
// // //     setEditingFeature(prev => {
// // //       if (!prev || prev.id !== featureId) return prev;
// // //       return { ...prev, [field]: value };
// // //     });
// // //   };

// // //   const handleUpdateFeature = async (componentId: string, featureId: string, updatedData: Partial<Feature>) => {
// // //     try {
// // //       const response = await fetch(`/api/features/${featureId}`, {
// // //         method: 'PUT',
// // //         headers: { 'Content-Type': 'application/json' },
// // //         body: JSON.stringify(updatedData),
// // //       });
// // //       if (!response.ok) {
// // //         const errorData = await response.json();
// // //         throw new Error(errorData?.error || `Failed to update feature (status ${response.status})`);
// // //       }
// // //       const updatedFeature: Feature = await response.json();
// // //       setProduct((prevProduct) => {
// // //         if (!prevProduct) {
// // //           return null;
// // //         }
// // //         return {
// // //           ...prevProduct,
// // //           id: prevProduct.id, // Ensure id is always included
// // //           name: prevProduct.name, // Ensure name is always included
// // //           components: prevProduct.components?.map((comp) =>
// // //             comp.id === componentId
// // //               ? {
// // //                   ...comp,
// // //                   features: comp.features?.map((feat) => (feat.id === featureId ? updatedFeature : feat)) || [],
// // //                 }
// // //               : comp
// // //           ) || [],
// // //         };
// // //       });
// // //       // Update the local features state as well for immediate UI update
// // //       setFeatures(prev => prev.map(f => (f.id === featureId ? updatedFeature : f)));
// // //       alert('Feature updated successfully!');
// // //     } catch (error: any) {
// // //       console.error('Error updating feature:', error);
// // //       alert(`Failed to update feature: ${error.message}`);
// // //     }
// // //   };
// // //   const handleDeleteFeature = async (featureId: string) => {
// // //     try {
// // //       const response = await fetch(`/api/features/${featureId}`, {
// // //         method: 'DELETE',
// // //       });
// // //       if (!response.ok) {
// // //         throw new Error(`Failed to delete feature (status ${response.status})`);
// // //       }
// // //       setFeatures(prev => prev.filter(feature => feature.id !== featureId));
// // //       if (expandedFeature === featureId) {
// // //         setExpandedFeature(null);
// // //         setEditingFeature(null);
// // //       }
// // //     } catch (error) {
// // //       console.error('Error deleting feature:', error);
// // //       alert('Failed to delete feature');
// // //     }
// // //   };

// // //   const toggleFields = () => setFieldsExpanded(!fieldsExpanded);
// // //   const toggleComponents = () => setComponentsExpanded(!componentsExpanded);

// // //   const toggleComponent = (componentId: string) => {
// // //     if (expandedComponent === componentId) {
// // //       setExpandedComponent(null);
// // //       setSelectedComponentId(null);
// // //       setFeatures([]); // Clear features when component is closed
// // //     } else {
// // //       setExpandedComponent(componentId);
// // //       setSelectedComponentId(componentId);
// // //       // Features will be fetched in the useEffect hook
// // //     }
// // //     setExpandedFeature(null);
// // //     setEditingFeature(null);
// // //   };

// // //   const toggleFeature = (featureId: string) => {
// // //     if (expandedFeature === featureId) {
// // //       setExpandedFeature(null);
// // //       setEditingFeature(null);
// // //     } else {
// // //       const feature = features.find(f => f.id === featureId);
// // //       setExpandedFeature(featureId);
// // //       setEditingFeature(feature || null);
// // //     }
// // //   };

// // //   if (loading) return <div>Loading...</div>;
// // //   if (error) return <div>Error: {error}</div>;
// // //   if (!product) return <div>No product found</div>;

// // //   return (
// // //     <div className="p-6">
// // //       <Sheet open={isOpen} onOpenChange={onClose}>
// // //         <SheetContent className="sm:max-w-xl overflow-y-auto">
// // //           <SheetHeader>
// // //             <SheetTitle>{product.name}</SheetTitle>
// // //           </SheetHeader>

// // //           {/* Product Details Section */}
// // //           <div className="border-b py-3 flex justify-between items-center">
// // //             <div className="flex items-center gap-2">
// // //               <ChevronRight
// // //                 size={18}
// // //                 className={`text-gray-500 cursor-pointer ${fieldsExpanded ? 'transform rotate-90' : ''}`}
// // //                 onClick={toggleFields}
// // //               />
// // //               <span className="text-md font-semibold">Product Details</span>
// // //             </div>
// // //             <div className="flex gap-2">
// // //               {!isEditingProduct ? (
// // //                 <Button onClick={enableEditProduct} size="sm" variant="outline">
// // //                   <Edit size={16} className="mr-2" /> Edit
// // //                 </Button>
// // //               ) : (
// // //                 <Button onClick={handleSaveProduct} size="sm" variant="outline">
// // //                   <Save size={16} className="mr-2" /> Save
// // //                 </Button>
// // //               )}
// // //               <Button onClick={handleDeleteProduct} size="sm" variant="destructive">
// // //                 <Trash2 size={16} className="mr-2" /> Delete
// // //               </Button>
// // //             </div>
// // //           </div>

// // //           {fieldsExpanded && editedProduct && (
// // //             <div className="mt-4 grid grid-cols-2 gap-4">
// // //               <div>
// // //                 <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
// // //                   Product Name
// // //                 </label>
// // //                 <Input
// // //                   type="text"
// // //                   id="productName"
// // //                   value={editedProduct.name || ''}
// // //                   onChange={(e) => handleProductInputChange('name', e.target.value)}
// // //                   disabled={!isEditingProduct}
// // //                   className="mt-1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label htmlFor="productStatus" className="block text-sm font-medium text-gray-700">
// // //                   Status
// // //                 </label>
// // //                 <Input
// // //                   type="text"
// // //                   id="productStatus"
// // //                   value={editedProduct.status || ''}
// // //                   onChange={(e) => handleProductInputChange('status', e.target.value)}
// // //                   disabled={!isEditingProduct}
// // //                   className="mt-1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label htmlFor="productProgress" className="block text-sm font-medium text-gray-700">
// // //                   Progress
// // //                 </label>
// // //                 <Input
// // //                   type="number"
// // //                   id="productProgress"
// // //                   value={editedProduct.progress !== null ? editedProduct.progress : ''}
// // //                   onChange={(e) => handleProductInputChange('progress', e.target.valueAsNumber)}
// // //                   disabled={!isEditingProduct}
// // //                   className="mt-1"
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <label htmlFor="productOwner" className="block text-sm font-medium text-gray-700">
// // //                   Owner
// // //                 </label>
// // //                 <Input
// // //                   type="text"
// // //                   id="productOwner"
// // //                   value={editedProduct.owner || ''}
// // //                   onChange={(e) => handleProductInputChange('owner', e.target.value)}
// // //                   disabled={!isEditingProduct}
// // //                   className="mt-1"
// // //                 />
// // //               </div>
// // //               {/* Add more product fields here for editing based on your Supabase schema */}
// // //             </div>
// // //           )}

// // //           {/* Components Section */}
// // //           <div className="border-b py-3 flex justify-between items-center mt-6">
// // //             <div className="flex items-center gap-2">
// // //               <ChevronRight
// // //                 size={18}
// // //                 className={`text-gray-500 cursor-pointer ${componentsExpanded ? 'transform rotate-90' : ''}`}
// // //                 onClick={toggleComponents}
// // //               />
// // //               <span className="text-md font-semibold">Components</span>
// // //               <span className="text-xs text-gray-500 border rounded px-1">{product.components?.length || 0}</span>
// // //             </div>
// // //             <div className="flex items-center gap-2">
// // //               <Input
// // //                 value={newComponentName}
// // //                 onChange={(e) => setNewComponentName(e.target.value)}
// // //                 placeholder ="New component name"
// // //                 className="h-8 text-sm"
// // //                 />
// // //                 <Button
// // //                   onClick={handleAddComponent}
// // //                   size="sm"
// // //                   variant="outline"
// // //                   className="px-2"
// // //                 >
// // //                   <Plus size={16} />
// // //                 </Button>
// // //               </div>
// // //             </div>
  
// // //             {componentsExpanded && (
// // //               <div className="mt-2">
// // //                 {product.components?.map((component) => (
// // //                   <div key={component.id} className="mb-1">
// // //                     {/* Component Row */}
// // //                     <div
// // //                       className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // //                       onClick={() => toggleComponent(component.id)}
// // //                     >
// // //                       <div className="flex items-center gap-2">
// // //                         <ChevronRight
// // //                           size={16}
// // //                           className={`text-gray-500 ${expandedComponent === component.id ? 'transform rotate-90' : ''}`}
// // //                         />
// // //                         <span>{component.name}</span>
// // //                       </div>
// // //                       <div className="flex items-center gap-2">
// // //                         <Input
// // //                           value={component.name || ''}
// // //                           onClick={(e) => e.stopPropagation()}
// // //                           onChange={(e) => handleComponentChange(component.id, { name: e.target.value })}
// // //                           className="h-8 text-sm"
// // //                           placeholder="Component name"
// // //                         />
// // //                         <Button
// // //                           onClick={(e) => {
// // //                             e.stopPropagation();
// // //                             handleUpdateComponent(component.id);
// // //                           }}
// // //                           size="sm"
// // //                           variant="outline"
// // //                           className="px-2"
// // //                         >
// // //                           <Save size={16} />
// // //                         </Button>
// // //                       </div>
// // //                     </div>
  
// // //                     {/* Features List when Component is expanded */}
// // //                     {expandedComponent === component.id && (
// // //                       <div className="ml-6 mt-2 border-l pl-4">
// // //                         <div className="flex items-center justify-between mb-2">
// // //                           <span className="text-sm font-medium">Features</span>
// // //                           <span className="text-xs text-gray-500 border rounded px-1">{features.length}</span>
// // //                           <div className="flex items-center gap-2">
// // //                             <Input
// // //                               value={newFeatureName}
// // //                               onChange={(e) => setNewFeatureName(e.target.value)}
// // //                               placeholder="New feature name"
// // //                               className="h-8 text-sm"
// // //                             />
// // //                             <Button
// // //                               onClick={handleAddFeature}
// // //                               size="sm"
// // //                               variant="outline"
// // //                               className="px-2"
// // //                             >
// // //                               <Plus size={16} />
// // //                             </Button>
// // //                           </div>
// // //                         </div>
  
// // //                         {loadingFeatures ? (
// // //                           <div className="text-sm text-gray-500 italic">Loading features...</div>
// // //                         ) : features.length === 0 ? (
// // //                           <div className="text-sm text-gray-500 italic">No features found</div>
// // //                         ) : (
// // //                           <div>
// // //                             {features.map(feature => (
// // //                               <div key={feature.id} className="mb-1">
// // //                                 {/* Feature Row */}
// // //                                 <div
// // //                                   className="p-2 border rounded flex justify-between items-center hover:bg-gray-50 cursor-pointer"
// // //                                   onClick={() => toggleFeature(feature.id)}
// // //                                 >
// // //                                   <div className="flex items-center gap-2">
// // //                                     <ChevronRight
// // //                                       size={16}
// // //                                       className={`text-gray-500 ${expandedFeature === feature.id ? 'transform rotate-90' : ''}`}
// // //                                     />
// // //                                     <span>{feature.name}</span>
// // //                                   </div>
// // //                                   <div className="flex gap-1">
// // //                                     <Button
// // //                                       onClick={(e) => {
// // //                                         e.stopPropagation();
// // //                                         toggleFeature(feature.id);
// // //                                       }}
// // //                                       size="sm"
// // //                                       variant="ghost"
// // //                                       className="h-8 w-8 p-0"
// // //                                     >
// // //                                       <Edit size={16} />
// // //                                     </Button>
// // //                                     <Button
// // //                                       onClick={(e) => {
// // //                                         e.stopPropagation();
// // //                                         handleDeleteFeature(feature.id);
// // //                                       }}
// // //                                       size="sm"
// // //                                       variant="ghost"
// // //                                       className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
// // //                                     >
// // //                                       <Trash2 size={16} />
// // //                                     </Button>
// // //                                   </div>
// // //                                 </div>
  
// // //                                 {/* Feature Edit Form */}
// // //                                 {expandedFeature === feature.id && editingFeature && (
// // //                                   <div className="ml-6 mt-2 p-3 border rounded bg-gray-50">
// // //                                     <div className="grid grid-cols-2 gap-3">
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Feature Name</label>
// // //                                         <Input
// // //                                           value={editingFeature.name || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Status</label>
// // //                                         <Input
// // //                                           value={editingFeature.status || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'status', e.target.value)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Progress</label>
// // //                                         <Input
// // //                                           type="number"
// // //                                           value={editingFeature.progress !== null ? editingFeature.progress : ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'progress', e.target.valueAsNumber)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Team</label>
// // //                                         <Input
// // //                                           value={editingFeature.team || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'team', e.target.value)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Days</label>
// // //                                         <Input
// // //                                           type="number"
// // //                                           value={editingFeature.days !== null ? editingFeature.days : ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'days', e.target.valueAsNumber)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
  
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Start Date</label>
// // //                                         <Input
// // //                                           type="date"
// // //                                           value={editingFeature.startDate || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'startDate', e.target.value)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div>
// // //                                         <label className="text-xs font-medium">Target Date</label>
// // //                                         <Input
// // //                                           type="date"
// // //                                           value={editingFeature.targetDate || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'targetDate', e.target.value)}
// // //                                           className="mt-1"
// // //                                         />
// // //                                       </div>
// // //                                       <div className="col-span-2">
// // //                                         <label className="text-xs font-medium">Remarks</label>
// // //                                         <textarea
// // //                                           value={editingFeature.remarks || ''}
// // //                                           onChange={(e) => handleFeatureChange(feature.id, 'remarks', e.target.value)}
// // //                                           className="mt-1 w-full p-2 border border-gray-300 rounded"
// // //                                           rows={3}
// // //                                         />
// // //                                       </div>
// // //                                     </div>
// // //                                     <div className="mt-3 flex justify-end">
// // //                                       <Button onClick={() => handleUpdateFeature(component.id, feature.id, editingFeature || {})} className="bg-gray-200 text-black hover:bg-gray-300">
// // //                                         Save Changes
// // //                                       </Button>
// // //                                     </div>
// // //                                   </div>
// // //                                 )}
// // //                               </div>
// // //                             ))}
// // //                           </div>
// // //                         )}
// // //                       </div>
// // //                     )}
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </SheetContent>
// // //         </Sheet>
// // //       </div>
// // //     );
// // //   }
  
// // //   export default ProductDetailsPage;



// // 'use client';

// // import React, { useEffect, useState } from 'react';
// // import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// // import { Product } from '@/app/types';

// // interface ProductDetailsPageProps {
// //   productId: string;
// //   isOpen: boolean;
// //   onClose: () => void;
// // }

// // export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
// //   const [product, setProduct] = useState<Product | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState<string | null>(null);

// //   useEffect(() => {
// //     if (isOpen && productId) {
// //       const fetchProductDetails = async () => {
// //         setLoading(true);
// //         setError(null);
// //         try {
// //           const response = await fetch(`/api/product/${productId}`);
// //           if (!response.ok) {
// //             const errorData = await response.json();
// //             throw new Error(errorData?.error || `Failed to fetch product (status ${response.status})`);
// //           }
// //           const data: Product = await response.json();
// //           setProduct(data);
// //         } catch (err: any) {
// //           setError(err.message);
// //         } finally {
// //           setLoading(false);
// //         }
// //       };
// //       fetchProductDetails();
// //     } else {
// //       setProduct(null);
// //     }
// //   }, [isOpen, productId]);

// //   if (loading) return <div>Loading...</div>;
// //   if (error) return <div>Error: {error}</div>;
// //   if (!product) return <div>No product found</div>;

// //   return (
// //     <div className="p-6">
// //       <Sheet open={isOpen} onOpenChange={onClose}>
// //         <SheetContent className="sm:max-w-md overflow-y-auto">
// //           <SheetHeader>
// //             <SheetTitle>{product.name}</SheetTitle>
// //           </SheetHeader>
// //           <div className="mt-4 grid grid-cols-1 gap-4">
// //             <div>
// //               <label className="block text-sm font-medium text-gray-700">Product Name</label>
// //               <div className="mt-1 text-gray-900">{product.name}</div>
// //             </div>
// //             {product.status && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Status</label>
// //                 <div className="mt-1 text-gray-900">{product.status}</div>
// //               </div>
// //             )}
// //             {product.progress !== undefined && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Progress</label>
// //                 <div className="mt-1 text-gray-900">{product.progress}</div>
// //               </div>
// //             )}
// //             {product.owner && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Owner</label>
// //                 <div className="mt-1 text-gray-900">{product.owner}</div>
// //               </div>
// //             )}
// //             {product.team && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Team</label>
// //                 <div className="mt-1 text-gray-900">{product.team}</div>
// //               </div>
// //             )}
// //             {product.days !== undefined && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Days</label>
// //                 <div className="mt-1 text-gray-900">{product.days}</div>
// //               </div>
// //             )}
// //             {product.startDate && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Start Date</label>
// //                 <div className="mt-1 text-gray-900">{new Date(product.startDate).toLocaleDateString()}</div>
// //               </div>
// //             )}
// //             {product.targetDate && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Target Date</label>
// //                 <div className="mt-1 text-gray-900">{new Date(product.targetDate).toLocaleDateString()}</div>
// //               </div>
// //             )}
// //             {product.completedOn && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Completed On</label>
// //                 <div className="mt-1 text-gray-900">{new Date(product.completedOn).toLocaleDateString()}</div>
// //               </div>
// //             )}
// //             {product.remarks && (
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700">Remarks</label>
// //                 <div className="mt-1 text-gray-900">{product.remarks}</div>
// //               </div>
// //             )}
// //             {/* Display other product details here */}
// //           </div>
// //         </SheetContent>
// //       </Sheet>
// //     </div>
// //   );
// // }

// // export default ProductDetailsPage;


// 'use client';

// import React, { useEffect, useState, useRef } from 'react';
// import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
// import { Button } from '@/components/ui/button';
// import { Trash2, MoreVertical } from 'lucide-react';
// import { Product, Component as ComponentType } from '@/app/types'; // Assuming you have a Component type
// import { Input } from '@/components/ui/input';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// interface ProductDetailsPageProps {
//   productId: string;
//   isOpen: boolean;
//   onClose: () => void;
// }

// export function ProductDetailsPage({ productId, isOpen, onClose }: ProductDetailsPageProps) {
//   const [product, setProduct] = useState<Product | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [editingField, setEditingField] = useState<keyof Product | null>(null);
//   const [draftProduct, setDraftProduct] = useState<Product | null>(null);
//   const editInputRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (isOpen && productId) {
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
//           setDraftProduct({ ...data });
//         } catch (err: any) {
//           setError(err.message);
//         } finally {
//           setLoading(false);
//         }
//       };
//       fetchProductDetails();
//     } else {
//       setProduct(null);
//       setDraftProduct(null);
//       setEditingField(null);
//     }
//   }, [isOpen, productId]);

//   useEffect(() => {
//     if (editingField && editInputRef.current) {
//       editInputRef.current.focus();
//     }
//   }, [editingField]);

//   const handleFieldHover = (field: keyof Product) => {
//     setEditingField(field);
//   };

//   const handleInputChange = (field: keyof Product, value: any) => {
//     setDraftProduct(prev => prev ? { ...prev, [field]: value } : null);
//   };

//   const handleInputBlur = async (field: keyof Product) => {
//     if (editingField === field && product && draftProduct && product[field] !== draftProduct[field]) {
//       await saveChanges();
//     }
//     setEditingField(null);
//   };

//   const handleInputKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>, field: keyof Product) => {
//     if (event.key === 'Enter' && editingField === field && product && draftProduct && product[field] !== draftProduct[field]) {
//       await saveChanges();
//       setEditingField(null);
//     } else if (event.key === 'Escape') {
//       setDraftProduct(product ? { ...product, id: product.id || '' } : null); // Revert changes
//       setEditingField(null);
//     }
//   };

//   const saveChanges = async () => {
//     if (!draftProduct || !productId) return;
//     try {
//       const response = await fetch(`/api/product/${productId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(draftProduct),
//       });
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData?.error || `Failed to update product`);
//       }
//       const data: Product = await response.json();
//       setProduct(data);
//       setDraftProduct(data);
//     } catch (error) {
//       if (error instanceof Error) {
//         alert('Error updating product: ' + error.message);
//       } else {
//         alert('Error updating product: An unknown error occurred.');
//       }
//     }
//   };

//   const handleDelete = async () => {
//     if (!productId) return;
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const response = await fetch(`/api/product/${productId}`, {
//           method: 'DELETE',
//         });
//         if (!response.ok) {
//           const errorData = await response.json();
//           throw new Error(errorData?.error || `Failed to delete product`);
//         }
//         alert('Product deleted successfully!');
//         onClose();
//       } catch (error) {
//         if (error instanceof Error) {
//           alert('Error deleting product: ' + error.message);
//         } else {
//           alert('Error deleting product: An unknown error occurred.');
//         }
//       }
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error}</div>;
//   if (!product || !draftProduct) return <div>No product found</div>;

//   const handleComponentsInputChange = (value: string) => {
//     handleInputChange('components', value);
//   };

//   return (
//     <div className="p-6">
//       <Sheet open={isOpen} onOpenChange={onClose}>
//         <SheetContent className="sm:max-w-md overflow-y-auto">
//           <SheetHeader className="flex items-center justify-between">
//             <div
//               className="relative w-full"
//               onMouseEnter={() => handleFieldHover('name')}
//               onMouseLeave={() => editingField === 'name' && editInputRef.current !== document.activeElement && handleInputBlur('name')}
//             >
//               {editingField === 'name' ? (
//                 <Input
//                   ref={editInputRef}
//                   type="text"
//                   value={draftProduct.name || ''}
//                   onChange={(e) => handleInputChange('name', e.target.value)}
//                   onBlur={() => handleInputBlur('name')}
//                   onKeyDown={(e) => handleInputKeyPress(e, 'name')}
//                   className="w-full text-lg font-semibold"
//                 />
//               ) : (
//                 <SheetTitle className="text-lg font-semibold">{product.name}</SheetTitle>
//               )}
//             </div>
//             {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" className="h-8 w-8 p-0">
//                   <MoreVertical className="h-4 w-4" />
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" sideOffset={4}>
//                 <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:bg-red-100">
//                   <Trash2 className="mr-2 h-4 w-4" />
//                   Delete product
//                 </DropdownMenuItem>
                
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//           </SheetHeader>

//           <div className="mt-4 space-y-3">
//             {(Object.keys(product) as (keyof Product)[]).filter(key => key !== 'id' && key !== 'name' && key !== 'created_at' && key !== 'components').map((key) => (
//               <div key={key} className="flex items-center gap-2">
//                 <span className="text-gray-500 w-24">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
//                 <div
//                   className="relative w-full"
//                   onMouseEnter={() => handleFieldHover(key)}
//                   onMouseLeave={() => editingField === key && editInputRef.current !== document.activeElement && handleInputBlur(key)}
//                 >
//                   {editingField === key ? (
//                     <Input
//                       ref={editInputRef}
//                       type="text" // Adjust type based on the field
//                       value={draftProduct[key] !== null && draftProduct[key] !== undefined ? String(draftProduct[key]) : ''}
//                       onChange={(e) => handleInputChange(key, e.target.value)}
//                       onBlur={() => handleInputBlur(key)}
//                       onKeyDown={(e) => handleInputKeyPress(e, key)}
//                       className="w-full"
//                     />
//                   ) : (
//                     <span>{product[key] !== null && product[key] !== undefined ? String(product[key]) : 'Not assigned'}</span>
//                   )}
//                 </div>
//               </div>
//             ))}

//             {product.components && (
//               <div className="flex items-start gap-2">
//                 <span className="text-gray-500 w-24">Components</span>
//                 {editingField === 'components' ? (
//                   <Input
//                     type="text"
//                     value={(draftProduct.components ?? []).map((comp: ComponentType) => comp.name).join(', ') || ''}
//                     onChange={(e) => handleComponentsInputChange(e.target.value)}
//                     onBlur={() => handleInputBlur('components')}
//                     onKeyDown={(e) => handleInputKeyPress(e, 'components')}
//                     className="w-full"
//                   />
//                 ) : (
//                   <ul>
//                     {product.components.map((component: ComponentType) => (
//                       <li key={component.id}>{component.name}</li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             )}
//           </div>
//         </SheetContent>
//       </Sheet>
//     </div>
//   );
// }

// export default ProductDetailsPage;



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

  // const saveChanges = async () => {

  //   if (!draftProduct || !productId) return;
  //   try {
  //     const response = await fetch(`/api/product/${productId}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(draftProduct),
  //     });
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       throw new Error(errorData?.error || `Failed to update product`);
  //     }
  //     const data: Product = await response.json();
  //     setProduct(data);
  //     setDraftProduct(data);
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       alert('Error updating product: ' + error.message);
  //     } else {
  //       alert('Error updating product: An unknown error occurred.');
  //     }
  //   }
  // };


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