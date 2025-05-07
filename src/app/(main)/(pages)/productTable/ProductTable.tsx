



// // "use client";

// // import { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabaseClient";
// // import {
// //   ArrowLeft,
// //   ChevronDown,
// //   ChevronRight,
// //   GripVertical,
// //   Maximize2,
// //   Plus,
// // } from "lucide-react";
// // import { Input } from "@/components/ui/input";
// // import { Product, Component, Feature } from "@/app/types";
// // import { Button } from "@/components/ui/button";
// // import { useRouter } from "next/navigation";
// // import { DndContext, DragEndEvent, closestCenter, useSensor, useSensors, MouseSensor, TouchSensor, KeyboardSensor } from "@dnd-kit/core";
// // import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
// // import { restrictToVerticalAxis } from "@dnd-kit/modifiers";

// // import ProductDetailsPage from "./_components/productDetails";
// // import ComponentDetailsPage from "./_components/componentDetails";
// // import FeatureDetailsPage from "./_components/featureDetails";
// // import { CreateFeatureModal } from "./_components/createFeatureModal";
// // import { CreateComponentModal } from "./_components/createComponentModal";
// // import { DragHandle } from "@/components/ui/drag-handle";
// // import { DraggableRow, TableItem } from "@/components/product/draggable-row";

// // interface ProductTableProps {
// //   selectedProductIds: string[];
// // }



// // export default function ProductTable({
// //   selectedProductIds,
// // }: ProductTableProps) {
// //   const [allTableData, setAllTableData] = useState<TableItem[]>([]);
// //   const [tableData, setTableData] = useState<TableItem[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
// //     {}
// //   );
// //   const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] =
// //     useState(false);
// //   const [selectedProductIdForComponent, setSelectedProductIdForComponent] =
// //     useState<string | null>(null);
// //   const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] =
// //     useState(false);
// //   const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] =
// //     useState<string | null>(null);
// //   const router = useRouter();
// //   const [creatingProduct, setCreatingProduct] = useState(false);
// //   const [newProductName, setNewProductName] = useState("");
// //   const [creatingComponentForProduct, setCreatingComponentForProduct] =
// //     useState<string | null>(null);
// //   const [newComponentName, setNewComponentName] = useState("");
// //   const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(
// //     null
// //   );
// //   const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
// //   const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(
// //     null
// //   );
// //   const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
// //   const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(
// //     null
// //   );
// //   const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

// //   // Initialize drag and drop sensors
// //   const sensors = useSensors(
// //     useSensor(MouseSensor, {
// //       activationConstraint: {
// //         distance: 10, // 10px movement before drag starts
// //       },
// //     }),
// //     useSensor(TouchSensor, {
// //       activationConstraint: {
// //         delay: 250, // 250ms delay before drag starts on touch
// //         tolerance: 5, // 5px movement before drag starts
// //       },
// //     }),
// //     useSensor(KeyboardSensor)
// //   );

// //   useEffect(() => {
// //     fetchProducts();
// //   }, []);

// //   useEffect(() => {
// //     if (selectedProductIds.length > 0) {
// //       const filteredData = allTableData.filter(
// //         (item) =>
// //           item.type === "product" && selectedProductIds.includes(item.id)
// //       );
// //       setTableData(filteredData);
// //     } else {
// //       setTableData(allTableData);
// //     }
// //   }, [selectedProductIds, allTableData]);

// //   const handleProductUpdate = (updatedProduct: Product) => {
// //     setTableData((prevData) =>
// //       prevData.map((item) =>
// //         item.type === "product" && item.id === updatedProduct.id
// //           ? { ...item, data: updatedProduct }
// //           : item
// //       )
// //     );
// //     setAllTableData((prevData) =>
// //       prevData.map((item) =>
// //         item.type === "product" && item.id === updatedProduct.id
// //           ? { ...item, data: updatedProduct }
// //           : item
// //       )
// //     );
// //   };

// //   const handleCreateProductClick = () => {
// //     setCreatingProduct(true);
// //   };

// //   const handleProductSelection = (product: TableItem) => {
// //     setSelectedProduct(product);
// //     setIsProductDetailOpen(true);
// //   };

// //   const handleComponentSelection = (component: TableItem) => {
// //     setSelectedComponent(component);
// //     setIsComponentDetailOpen(true);
// //   };

// //   const handleFeatureSelection = (feature: TableItem) => {
// //     setSelectedFeature(feature);
// //     setIsFeatureDetailOpen(true);
// //   };

// //   const handleCloseProductDetails = () => {
// //     setIsProductDetailOpen(false);
// //   };

// //   const handleCloseComponentDetails = () => {
// //     setIsComponentDetailOpen(false);
// //   };

// //   const handleCloseFeatureDetails = () => {
// //     setIsFeatureDetailOpen(false);
// //   };

// //   const handleCreateComponentClick = (productId: string) => {
// //     setSelectedProductIdForComponent(productId);
// //     setIsCreateComponentModalOpen(true);
// //   };

// //   const handleCreateFeatureClick = (componentId: string) => {
// //     setSelectedComponentIdForFeature(componentId);
// //     setIsCreateFeatureModalOpen(true);
// //   };

// //   async function updateProductOrderInDb(updatedData: TableItem[]) {
// //     try {
// //       // Assuming `updatedData` contains the new order
// //       for (const product of updatedData) {
// //         await fetch(`/api/product/${product.id}`, {
// //           method: 'PUT',
// //           body: JSON.stringify({ order: product.order }),
// //         });
// //       }
// //     } catch (error) {
// //       console.error("Error updating product order in DB:", error);
// //     }
// //   }
  

// //   async function updateComponentOrderInDb(updatedData: TableItem[]) {
// //     try {
// //       // Iterate through the products and components and update their order
// //       for (const product of updatedData) {
// //         if (product.children) {
// //           for (const component of product.children) {
// //             await fetch(`/api/component/${component.id}`, {
// //               method: 'PUT',
// //               body: JSON.stringify({ order: component.order }),
// //             });
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error updating component order in DB:", error);
// //     }
// //   }
  

// //   async function updateFeatureOrderInDb(updatedData: TableItem[]) {
// //     try {
// //       // Iterate through components and features to update their order
// //       for (const product of updatedData) {
// //         if (product.children) {
// //           for (const component of product.children) {
// //             if (component.children) {
// //               for (const feature of component.children) {
// //                 await fetch(`/api/feature/${feature.id}`, {
// //                   method: 'PUT',
// //                   body: JSON.stringify({ order: feature.order }),
// //                 });
// //               }
// //             }
// //           }
// //         }
// //       }
// //     } catch (error) {
// //       console.error("Error updating feature order in DB:", error);
// //     }
// //   }
  


// //   const handleDragEnd = async (event: DragEndEvent) => {
// //     const { active, over } = event;
  
// //     if (!over || active.id === over.id) return;
  
// //     const activeId = active.id.toString();
// //     const overId = over.id.toString();
  
// //     // Extract the type and id from the composite id (format: "type-id")
// //     const [activeType, activeItemId] = activeId.split("-");
// //     const [overType, overItemId] = overId.split("-");
  
// //     if (activeType !== overType) return; // Only allow same-type reordering
  
// //     // Reordering logic
// //     const getUpdatedData = async (activeId: string, overId: string) => {
// //     if (activeType === "product") {
// //       const oldIndex = tableData.findIndex(item => item.id === activeItemId);
// //       const newIndex = tableData.findIndex(item => item.id === overItemId);
  
// //       if (oldIndex !== -1 && newIndex !== -1) {
// //         const newData = arrayMove(tableData, oldIndex, newIndex);
// //         setTableData(newData);
// //         await updateProductOrderInDb(newData);
// //       }
// //     } else if (activeType === "component") {
// //       setTableData(prevData => {
// //         const updatedData = prevData.map(product => {
// //           if (!product.children) return product;
  
// //           const oldIndex = product.children.findIndex(comp => comp.id === activeItemId);
// //           const newIndex = product.children.findIndex(comp => comp.id === overItemId);
  
// //           if (oldIndex !== -1 && newIndex !== -1) {
// //             const newChildren = arrayMove(product.children, oldIndex, newIndex);
// //             return { ...product, children: newChildren };
// //           }
  
// //           return product;
// //         });
// //         return updatedData;
// //       });
// //       await updateComponentOrderInDb(tableData);
// //     } else if (activeType === "feature") {

// //     }
// //     getUpdatedData(activeId, overId);

// //       setTableData(prevData => {
// //         const updatedData = prevData.map(product => {
// //           if (!product.children) return product;
  
// //           return {
// //             ...product,
// //             children: product.children.map(component => {
// //               if (!component.children) return component;
  
// //               const oldIndex = component.children.findIndex(feat => feat.id === activeItemId);
// //               const newIndex = component.children.findIndex(feat => feat.id === overItemId);
  
// //               if (oldIndex !== -1 && newIndex !== -1) {
// //                 const newChildren = arrayMove(component.children, oldIndex, newIndex);
// //                 return { ...component, children: newChildren };
// //               }
  
// //               return component;
// //             })
// //           };
// //         });
// //         return updatedData;
// //       });
// //       await updateFeatureOrderInDb(tableData);
// //     }
// //   };
  

// //   async function fetchProducts() {
// //     try {
// //       setLoading(true);
// //       const { data: productsData, error: productsError } = await supabase
// //         .from("products")
// //         .select("*")
// //         .neq("name", "Sample Product 1");
// //       if (productsError) throw productsError;
// //       const initialTableData: TableItem[] = productsData.map((product) => ({
// //         type: "product" as const,
// //         id: product.id,
// //         name: product.name || "Product",
// //         level: 0,
// //         data: product,
// //       }));
// //       setAllTableData(initialTableData);
// //       setTableData(initialTableData);
// //     } catch (error) {
// //       console.error("Error fetching products:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   async function createNewProduct(name: string) {
// //     try {
// //       const { data, error } = await supabase
// //         .from("products")
// //         .insert([{ name }])
// //         .select();
// //       if (error) throw error;
// //       if (data && data.length > 0) {
// //         const newProduct = data[0];
// //         const newProductItem: TableItem = {
// //           type: "product",
// //           id: newProduct.id,
// //           name: newProduct.name,
// //           level: 0,
// //           data: newProduct,
// //         };
// //         setAllTableData((prevData) => [...prevData, newProductItem]);
// //         setTableData((prevData) => [...prevData, newProductItem]);
// //         setCreatingProduct(false);
// //         setNewProductName("");
// //       }
// //     } catch (error) {
// //       console.error("Error creating product:", error);
// //     }
// //   }

// //   async function createNewComponent(newComponent: any, productId: string) {
// //     try {
// //       const newComponentItem: TableItem = {
// //         type: "component",
// //         id: newComponent.id,
// //         name: newComponent.name,
// //         level: 1,
// //         data: newComponent,
// //       };

// //       setTableData((prevData) =>
// //         prevData.map((item) =>
// //           item.id === productId
// //             ? {
// //                 ...item,
// //                 children: [...(item.children || []), newComponentItem],
// //               }
// //             : item
// //         )
// //       );

// //       setAllTableData((prevData) =>
// //         prevData.map((item) =>
// //           item.id === productId
// //             ? {
// //                 ...item,
// //                 children: [...(item.children || []), newComponentItem],
// //               }
// //             : item
// //         )
// //       );

// //       setExpandedItems((prev) => ({
// //         ...prev,
// //         [`product-${productId}`]: true,
// //       }));

// //       setCreatingComponentForProduct(null);
// //       setNewComponentName("");
// //     } catch (error) {
// //       console.error("Error handling component creation:", error);
// //     }
// //   }

// //   async function createNewInlineComponent(name: string, productId: string) {
// //     try {
// //       const { data, error } = await supabase
// //         .from("components")
// //         .insert([{ name, product_id: productId }])
// //         .select();

// //       if (error) throw error;

// //       if (data && data.length > 0) {
// //         const newComponent = data[0];
// //         createNewComponent(newComponent, productId);
// //       }
// //     } catch (error) {
// //       console.error("Error creating component:", error);
// //     }
// //   }

// //   async function createNewFeature(newFeature: any, componentId: string) {
// //     const newFeatureItem: TableItem = {
// //       type: "feature",
// //       id: newFeature.id,
// //       name: newFeature.name,
// //       level: 2,
// //       data: newFeature,
// //     };

// //     setTableData((prevData) =>
// //       prevData.map((item) =>
// //         item.type === "product" && item.children
// //           ? {
// //               ...item,
// //               children: item.children.map((child) =>
// //                 child.id === componentId
// //                   ? {
// //                       ...child,
// //                       children: [...(child.children || []), newFeatureItem],
// //                     }
// //                   : child
// //               ),
// //             }
// //           : item
// //       )
// //     );

// //     setAllTableData((prevData) =>
// //       prevData.map((item) =>
// //         item.type === "product" && item.children
// //           ? {
// //               ...item,
// //               children: item.children.map((child) =>
// //                 child.id === componentId
// //                   ? {
// //                       ...child,
// //                       children: [...(child.children || []), newFeatureItem],
// //                     }
// //                   : child
// //               ),
// //             }
// //           : item
// //       )
// //     );

// //     setExpandedItems((prev) => {
// //       const updatedExpanded = { ...prev };
// //       const parentProduct = allTableData.find((p) =>
// //         p.children?.some((c) => c.id === componentId)
// //       );
// //       if (parentProduct) {
// //         updatedExpanded[`product-${parentProduct.id}`] = true;
// //         updatedExpanded[`component-${componentId}`] = true;
// //       }
// //       return updatedExpanded;
// //     });

// //     setIsCreateFeatureModalOpen(false);
// //     setSelectedComponentIdForFeature(null);
// //   }

// //   async function fetchComponents(productId: string) {
// //     try {
// //       const { data: componentsData, error: componentsError } = await supabase
// //         .from("components")
// //         .select("*")
// //         .eq("product_id", productId);

// //       if (componentsError) throw componentsError;
// //       return componentsData.map((component) => ({
// //         type: "component" as const,
// //         id: component.id,
// //         name: component.name || "Component",
// //         level: 1,
// //         data: component,
// //       }));
// //     } catch (error) {
// //       console.error("Error fetching components:", error);
// //       return [];
// //     }
// //   }

// //   async function fetchFeatures(componentId: string) {
// //     try {
// //       const { data: featuresData, error: featuresError } = await supabase
// //         .from("features")
// //         .select("*")
// //         .eq("component_id", componentId);

// //       if (featuresError) throw featuresError;
// //       return featuresData.map((feature) => ({
// //         type: "feature" as const,
// //         id: feature.id,
// //         name: feature.name || "Feature",
// //         level: 2,
// //         data: feature,
// //       }));
// //     } catch (error) {
// //       console.error("Error fetching features:", error);
// //       return [];
// //     }
// //   }

// //   const toggleExpand = async (
// //     type: string,
// //     id: string,
// //     data: Product | Component
// //   ) => {
// //     const newExpandedState = !expandedItems[`${type}-${id}`];
// //     setExpandedItems((prev) => ({
// //       ...prev,
// //       [`${type}-${id}`]: newExpandedState,
// //     }));

// //     if (newExpandedState) {
// //       if (type === "product") {
// //         const product = tableData.find((item) => item.id === id);
// //         if (!product?.children || product.children.length === 0) {
// //           const components = await fetchComponents(id);

// //           setTableData((prevData) =>
// //             prevData.map((item) =>
// //               item.id === id ? { ...item, children: components } : item
// //             )
// //           );

// //           setAllTableData((prevAllData) =>
// //             prevAllData.map((item) =>
// //               item.id === id ? { ...item, children: components } : item
// //             )
// //           );
// //         }
// //       } else if (type === "component") {
// //         let componentFound = false;
// //         const updatedTableData = tableData.map((product) => {
// //           if (product.children) {
// //             const componentIndex = product.children.findIndex(
// //               (comp) => comp.id === id
// //             );
// //             if (componentIndex >= 0) {
// //               componentFound = true;
// //               if (!product.children[componentIndex].children) {
// //                 return {
// //                   ...product,
// //                   children: product.children.map(async (comp, i) => {
// //                     if (i === componentIndex) {
// //                       const features = await fetchFeatures(id);
// //                       return { ...comp, children: features };
// //                     }
// //                     return comp;
// //                   }),
// //                 };
// //               }
// //             }
// //           }
// //           return product;
// //         });

// //         if (componentFound) {
// //           const features = await fetchFeatures(id);

// //           setTableData((prevData) =>
// //             prevData.map((product) => {
// //               if (product.children) {
// //                 return {
// //                   ...product,
// //                   children: product.children.map((comp) =>
// //                     comp.id === id ? { ...comp, children: features } : comp
// //                   ),
// //                 };
// //               }
// //               return product;
// //             })
// //           );

// //           setAllTableData((prevData) =>
// //             prevData.map((product) => {
// //               if (product.children) {
// //                 return {
// //                   ...product,
// //                   children: product.children.map((comp) =>
// //                     comp.id === id ? { ...comp, children: features } : comp
// //                   ),
// //                 };
// //               }
// //               return product;
// //             })
// //           );
// //         }
// //       }
// //     }
// //   };

// //   const isExpanded = (type: string, id: string) => {
// //     return !!expandedItems[`${type}-${id}`];
// //   };

// //   const getFeatureColorClass = (index: number) => {
// //     const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
// //     return colors[index % colors.length];
// //   };

// //   const handleSaveNewProduct = () => {
// //     if (newProductName.trim()) {
// //       createNewProduct(newProductName.trim());
// //     }
// //   };

// //   const handleCancelNewProduct = () => {
// //     setCreatingProduct(false);
// //     setNewProductName("");
// //   };

// //   const handleSaveNewComponent = (productId: string) => {
// //     if (newComponentName.trim()) {
// //       createNewInlineComponent(newComponentName.trim(), productId);
// //     }
// //   };

// //   const handleCancelNewComponent = () => {
// //     setCreatingComponentForProduct(null);
// //     setNewComponentName("");
// //   };

// //   const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
// //     return children.map((child) => (
// //       <SortableContext
// //   items={tableData.map(item => `${item.type}-${item.id}`)}
// //   strategy={verticalListSortingStrategy}
// // >
// //         <DraggableRow key={child.id} item={child}>
// //           <div
// //             className={`flex py-2 px-1 items-center ${child.level === 2 ? 'bg-[#fff]' : 'bg-[#cce4fc]'} border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// //           >
// //             <div
// //               className={`${child.level === 2 ? 'w-[563px] min-w-[433px] max-w-[433px]' : 'w-[436px] min-w-[435px] max-w-[435px]'} flex items-center gap-2`}
// //               style={{ paddingLeft: `${16 + child.level * 16}px` }}
// //             >
// //               <div
// //                 className="flex items-center gap-2 cursor-pointer w-full"
// //                 onClick={() => {
// //                   if (child.type === "product" || child.type === "component") {
// //                     toggleExpand(child.type, child.id, child.data);
// //                   }
// //                 }}
// //               >
// //                 {/* Drag handle */}
// //                 <DragHandle id={child.id} type={child.type} />
                
// //                 {child.level < 2 &&
// //                   (isExpanded(child.type, child.id) ? (
// //                     <ChevronDown size={18} className="text-gray-500" />
// //                   ) : (
// //                     <ChevronRight size={18} className="text-gray-500" />
// //                   ))}
                
// //                 <div
// //                   className={`flex items-center gap-2 cursor-pointer w-full ${
// //                     child.type === "component" || child.type === "feature"
// //                       ? "text-gray-500 text-[14px]"
// //                       : ""
// //                   }`}
// //                   onClick={(e) => {
// //                     if (child.type === "component") {
// //                       e.stopPropagation();
// //                       handleComponentSelection(child);
// //                     } else if (child.type === "feature") {
// //                       e.stopPropagation();
// //                       handleFeatureSelection(child);
// //                     }
// //                   }}
// //                 >
// //                   {child.level === 1 && (
// //                     <span className="p-1 bg-white text-gray-500 rounded-md">
// //                       <svg
// //                         width="16"
// //                         height="16"
// //                         viewBox="0 0 24 24"
// //                         fill="none"
// //                         stroke="currentColor"
// //                         strokeWidth="2"
// //                       >
// //                         <rect x="3" y="3" width="7" height="7" rx="1" />
// //                         <rect x="14" y="3" width="7" height="7" rx="1" />
// //                         <rect x="3" y="14" width="7" height="7" rx="1" />
// //                         <rect x="14" y="14" width="7" height="7" rx="1" />
// //                       </svg>
// //                     </span>
// //                   )}
// //                   {child.level === 2 && (
// //                     <>
// //                       <div className={`${child.data.status === 'Completed' && 'text-[#79ce17]'} ${child.data.status === 'In Progress' && 'text-[#ffc600]'} ${child.data.status === 'Todo' && ''} ${(child.data.status === 'Todo' && (
// //                         new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// //                       ).toString()) && 'text-[#ff4747]'}`}>
// //                         <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className="">
// //                           <path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// //                         </svg>
// //                       </div>
// //                     </>
// //                   )}
// //                   <span
// //                     className={`cursor-pointer ${
// //                       child.type === "component"
// //                         ? "hover:text-blue-600"
// //                         : child.type === "feature"
// //                         ? "hover:text-blue-600"
// //                         : ""
// //                     } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
// //                     onClick={(e) => {
// //                       if (child.type === "component") {
// //                         e.stopPropagation();
// //                         handleComponentSelection(child);
// //                       } else if (child.type === "feature") {
// //                         e.stopPropagation();
// //                         handleFeatureSelection(child);
// //                       }
// //                     }}
// //                   >
// //                     {child.name}
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* Add the Plus button only for components (level 1) to create features */}
// //               {child.level === 1 && (
// //                 <button
// //                   onClick={(e) => {
// //                     e.stopPropagation();
// //                     handleCreateFeatureClick(child.id);
// //                   }}
// //                   className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// //                 >
// //                    <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// //                 </button>
// //               )}
// //             </div>
// //             <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               {child?.data?.status || "-"} 
// //             </div>
// //             <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               {child?.data?.progress !== undefined ? `${child.data.progress}%` : "-"}
// //             </div>
// //             <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               {child?.data?.team || "-"}
// //             </div>
// //             <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               {child?.data?.days || "-"} 
// //             </div>
// //             <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// //               {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
// //             </div>
// //             <div
// //               className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// //             >
// //               {child.data.completedOn || "-"}
// //             </div>
// //             <div
// //               className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// //             >
// //               <span>{child.data.remarks || "-"}</span>
// //             </div>
// //           </div>
          
// //           {child.children &&
// //             isExpanded(child.type, child.id) &&
// //             renderChildren(child.children)}

// //           {child.level === 1 &&
// //             creatingComponentForProduct === `AFTER_${child.id}` && (
// //               <div
// //                 className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
// //                 style={{ paddingLeft: `${16 + child.level * 16}px` }}
// //               >
// //                 <div className="w-[600px] flex items-center gap-2">
// //                   <Input
// //                     type="text"
// //                     placeholder="Enter component name"
// //                     value={newComponentName}
// //                     onChange={(e) => setNewComponentName(e.target.value)}
// //                     className="w-48"
// //                   />
// //                   <Button
// //                     size="sm"
// //                     onClick={() => {
// //                       const productId = tableData.find((p) =>
// //                         p.children?.some((c) => c.id === child.id)
// //                       )?.id;
// //                       if (productId) {
// //                         handleSaveNewComponent(productId);
// //                       }
// //                     }}
// //                   >
// //                     Save
// //                   </Button>
// //                   <Button
// //                     size="sm"
// //                     variant="outline"
// //                     onClick={handleCancelNewComponent}
// //                   >
// //                     Cancel
// //                   </Button>
// //                 </div>
// //               </div>
// //             )}
// //         </DraggableRow>
// //       </SortableContext>
// //     ));
// //   };

// //   if (loading) {
// //     return <div className="flex justify-center p-10">Loading products...</div>;
// //   }

// //   return (
// //     <div className="w-full flex">
// //       <div className="w-full transition-all duration-300">
// //         <CreateFeatureModal
// //           isOpen={isCreateFeatureModalOpen}
// //           onClose={() => setIsCreateFeatureModalOpen(false)}
// //           componentId={selectedComponentIdForFeature}
// //           onFeatureCreated={createNewFeature}
// //         />

// //         <CreateComponentModal
// //           isOpen={isCreateComponentModalOpen}
// //           onClose={() => setIsCreateComponentModalOpen(false)}
// //           productId={selectedProductIdForComponent}
// //           onComponentCreated={createNewComponent}
// //         />

// //         {selectedProduct && (
// //           <ProductDetailsPage
// //             productId={selectedProduct.data.id}
// //             isOpen={isProductDetailOpen}
// //             onClose={handleCloseProductDetails}
// //             onProductUpdated={handleProductUpdate}
// //           />
// //         )}

// //         {selectedComponent && (
// //           <ComponentDetailsPage
// //             componentId={selectedComponent.data.id}
// //             isOpen={isComponentDetailOpen}
// //             onClose={handleCloseComponentDetails}
// //           />
// //         )}

// //         {selectedFeature && (
// //           <FeatureDetailsPage
// //             featureId={selectedFeature.data.id}
// //             isOpen={isFeatureDetailOpen}
// //             onClose={handleCloseFeatureDetails}
// //           />
// //         )}

// //         <div className="bg-gray-100 border-b px-5">
// //           <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
// //             <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               Products, Components, Features
// //             </div>
// //             <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               Status
// //             </div>
// //             <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               Progress
// //             </div>
// //             <div className="w-[100px] flex justify-center text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <div className="flex-row flex">
// //                     <img className="w-[16px] h-[16px] mr-1" src="/person.svg" alt="Person" />Team
// //                 </div>
// //             </div>
// //             <div className="w-[72px] flex text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1" alt="File" /> Days
// //             </div>
// //             <div className="w-[144px] flex justify-center text-center text-[13px] font-bold flex-row border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg" alt="Clock" /> Target span
// //             </div>
// //             <div className="w-[144px] justify-center text-center text-[13px] font-bold flex-row flex whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File" /> Completion Time
// //             </div>
// //             <div className="w-[100px] text-center text-[13px] font-bold flex-row flex border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //              <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File" /> Remarks
// //             </div>
// //           </div>
// //         </div>

// //         <DndContext 
// //           sensors={sensors}
// //           collisionDetection={closestCenter}
// //           onDragEnd={handleDragEnd}
// //           modifiers={[restrictToVerticalAxis]}
// //         >
// //           <div className="divide-y bg-white px-6">
// //             <SortableContext 
// //               items={tableData.map(item => `${item.type}-${item.id}`)}
// //               strategy={verticalListSortingStrategy}
// //             >
// //               {tableData.map((item) => (
// //                 <DraggableRow key={item.id} item={item}>
// //                   <div key={item.id}>
// //                     <div
// //                       className={`flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
// //                         selectedProduct?.id === item.id ? "bg-blue-50" : ""
// //                       }`}
// //                       style={{ paddingLeft: `${16 + item.level * 16}px` }}
// //                     >
// //                       <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2">
// //                         <div
// //                           className="flex items-center gap-2 cursor-pointer w-full"
// //                           onClick={() => toggleExpand(item.type, item.id, item.data)}
// //                         >
// //                           {/* Drag handle */}
// //                           <DragHandle id={item.id} type={item.type} />
                          
// //                           {item.level < 2 &&
// //                             (isExpanded(item.type, item.id) ? (
// //                               <ChevronDown size={18} className="text-gray-500" />
// //                             ) : (
// //                               <ChevronRight size={18} className="text-gray-500" />
// //                             ))}

// //                           <div className="flex items-center gap-2 text-gray-800 bg-white">
// //                             {item.level === 0 && (
// //                               <div className="p-1 bg-white text-gray-400 rounded-md">
// //                                 <svg
// //                                   height="16px"
// //                                   width="16px"
// //                                   viewBox="0 0 16 16"
// //                                   role="img"
// //                                   aria-label="ProductIcon"
// //                                   className="sc-fQpRED cOkelz ui-icon"
// //                                 >
// //                                   <path
// //                                     fill="currentColor"
// //                                     fillRule="evenodd"
// //                                     d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// //                                     clipRule="evenodd"
// //                                   ></path>
// //                                 </svg>
// //                               </div>
// //                             )}
// //                             <span
// //                               className={`cursor-pointer ${
// //                                 item.type === "product" ? "hover:text-blue-600" : ""
// //                               } text-gray-700 text-[16px]`}
// //                               onClick={(e) => {
// //                                 if (item.type === "product") {
// //                                   e.stopPropagation();
// //                                   handleProductSelection(item);
// //                                 }
// //                               }}
// //                             >
// //                               {item.name}
// //                             </span>
// //                           </div>
// //                         </div>

// //                         {item.level === 0 && (
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               handleCreateComponentClick(item.id);
// //                             }}
// //                             className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// //                           >
// //                             <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// //                           </button>
// //                         )}
// //                         {creatingComponentForProduct === item.id && (
// //                           <>
// //                             <Input
// //                               type="text"
// //                               placeholder="Enter component name"
// //                               value={newComponentName}
// //                               onChange={(e) => setNewComponentName(e.target.value)}
// //                               className="ml-2 w-48"
// //                             />
// //                             <Button
// //                               size="sm"
// //                               onClick={() => handleSaveNewComponent(item.id)}
// //                             >
// //                               Save
// //                             </Button>
// //                             <Button
// //                               size="sm"
// //                               variant="outline"
// //                               onClick={handleCancelNewComponent}
// //                             >
// //                               Cancel
// //                             </Button>
// //                           </>
// //                         )}
// //                       </div>

// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
// //                         {item.data.status || ""}
// //                       </div>
// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                         {item.data.progress !== undefined
// //                           ? `${item.data.progress}%`
// //                           : ""}
// //                       </div>
// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                         {item.data.team || ""}
// //                       </div>
// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                         {item.data.days !== undefined ? item.data.days : ""}
// //                       </div>
// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                         {item.data.startDate || ""}-{item.data.targetDate || ""}
// //                       </div>
// //                       <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                         {item.data.completedOn || ""}
// //                       </div>
// //                       <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
// //                         <span>{item.data.remarks || ""}</span>
// //                       </div>
// //                     </div>
// //                     {item.children &&
// //                       isExpanded(item.type, item.id) &&
// //                       renderChildren(item.children)}
// //                   </div>
// //                 </DraggableRow>
// //               ))}
// //             </SortableContext>
// //           </div>
// //         </DndContext>

// //         <div className="mt-2 bg-gray-100 px-6">
// //           {creatingProduct ? (
// //             <div className="flex py-2 items-center hover:bg-gray-50">
// //               <div className="w-[600px] flex items-center gap-2">
// //                 <Input
// //                   type="text"
// //                   placeholder="Enter product name"
// //                   value={newProductName}
// //                   onChange={(e) => setNewProductName(e.target.value)}
// //                 />
// //                 <Button size="sm" onClick={handleSaveNewProduct}>
// //                   Save
// //                 </Button>
// //                 <Button
// //                   size="sm"
// //                   variant="outline"
// //                   onClick={handleCancelNewProduct}
// //                 >
// //                   Cancel
// //                 </Button>
// //               </div>
// //             </div>
// //           ) : (
// //             <div className="bg-white-200 px-5">
// //               <Button onClick={handleCreateProductClick}>
// //                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// //                 Create Product
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // // // "use client";

// // // // import { useState, useEffect } from "react";
// // // // import { supabase } from "@/lib/supabaseClient";
// // // // import {
// // // //   ArrowLeft,
// // // //   ChevronDown,
// // // //   ChevronRight,
// // // //   Maximize2,
// // // //   Plus,
// // // // } from "lucide-react";
// // // // import { Input } from "@/components/ui/input";
// // // // import { Product, Component, Feature } from "@/app/types";
// // // // import { Button } from "@/components/ui/button";
// // // // import { useRouter } from "next/navigation";

// // // // import ProductDetailsPage from "./_components/productDetails";
// // // // import ComponentDetailsPage from "./_components/componentDetails";
// // // // import FeatureDetailsPage from "./_components/featureDetails";
// // // // import { CreateFeatureModal } from "./_components/createFeatureModal";
// // // // import { CreateComponentModal } from "./_components/createComponentModal";
// // // // import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
// // // // import { DndContext } from "@dnd-kit/core";


// // // // // import { ProductDetailsPage } from './_components/productDetails';

// // // // interface TableItem {
// // // //   type: "product" | "component" | "feature";
// // // //   id: string;
// // // //   name: string;
// // // //   level: number;
// // // //   data: any;
// // // //   children?: TableItem[];
// // // // }

// // // // interface ProductTableProps {
// // // //   selectedProductIds: string[];
// // // // }




// // // // export default function ProductTable({
// // // //   selectedProductIds,
// // // // }: ProductTableProps) {
// // // //   const [allTableData, setAllTableData] = useState<TableItem[]>([]);
// // // //   const [tableData, setTableData] = useState<TableItem[]>([]);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
// // // //     {}
// // // //   );
// // // //   const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] =
// // // //     useState(false);
// // // //   const [selectedProductIdForComponent, setSelectedProductIdForComponent] =
// // // //     useState<string | null>(null);
// // // //   const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] =
// // // //     useState(false);
// // // //   const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] =
// // // //     useState<string | null>(null);
// // // //   const router = useRouter();
// // // //   const [creatingProduct, setCreatingProduct] = useState(false);
// // // //   const [newProductName, setNewProductName] = useState("");
// // // //   const [creatingComponentForProduct, setCreatingComponentForProduct] =
// // // //     useState<string | null>(null);
// // // //   const [newComponentName, setNewComponentName] = useState("");
// // // //   const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(
// // // //     null
// // // //   );
// // // //   const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
// // // //   const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(
// // // //     null
// // // //   );
// // // //   const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
// // // //   const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(
// // // //     null
// // // //   );
// // // //   const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

// // // //   useEffect(() => {
// // // //     fetchProducts();
// // // //   }, []);


// // // //   const handleDragEnd = (event: any) => {
// // // //     const { active, over } = event;
// // // //     const activeId = active.id;
// // // //     const overId = over?.id;

// // // //     if (activeId !== overId) {
// // // //       // Update the position of the item
// // // //       const updatedTableData = reorderTableData(activeId, overId);
// // // //       setTableData(updatedTableData);
// // // //       setAllTableData(updatedTableData);
// // // //     }
// // // //   };


// // // //   const reorderTableData = (activeId: string, overId: string) => {
// // // //     // Reorder logic here, updating state based on drag and drop positions
// // // //     const newTableData = [...tableData];
// // // //     const activeItem = newTableData.find((item) => item.id === activeId);
// // // //     const overItem = newTableData.find((item) => item.id === overId);

// // // //     if (activeItem && overItem) {
// // // //       const activeIndex = newTableData.indexOf(activeItem);
// // // //       const overIndex = newTableData.indexOf(overItem);

// // // //       // Swap the positions of active and over items
// // // //       newTableData[activeIndex] = overItem;
// // // //       newTableData[overIndex] = activeItem;
// // // //     }

// // // //     return newTableData;
// // // //   };

// // // //   const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
// // // //     id: "sortable-item",
// // // //   });

// // // //   useEffect(() => {
// // // //     if (selectedProductIds.length > 0) {
// // // //       const filteredData = allTableData.filter(
// // // //         (item) =>
// // // //           item.type === "product" && selectedProductIds.includes(item.id)
// // // //       );
// // // //       setTableData(filteredData);
// // // //     } else {
// // // //       setTableData(allTableData);
// // // //     }
// // // //   }, [selectedProductIds, allTableData]);

// // // //   const handleProductUpdate = (updatedProduct: Product) => {
// // // //     setTableData((prevData) =>
// // // //       prevData.map((item) =>
// // // //         item.type === "product" && item.id === updatedProduct.id
// // // //           ? { ...item, data: updatedProduct }
// // // //           : item
// // // //       )
// // // //     );
// // // //     setAllTableData((prevData) =>
// // // //       prevData.map((item) =>
// // // //         item.type === "product" && item.id === updatedProduct.id
// // // //           ? { ...item, data: updatedProduct }
// // // //           : item
// // // //       )
// // // //     );
// // // //   };

// // // //   const handleCreateProductClick = () => {
// // // //     setCreatingProduct(true);
// // // //   };

// // // //   const handleProductSelection = (product: TableItem) => {
// // // //     setSelectedProduct(product);
// // // //     setIsProductDetailOpen(true);
// // // //   };

// // // //   const handleComponentSelection = (component: TableItem) => {
// // // //     setSelectedComponent(component);
// // // //     setIsComponentDetailOpen(true);
// // // //   };

// // // //   const handleFeatureSelection = (feature: TableItem) => {
// // // //     setSelectedFeature(feature);
// // // //     setIsFeatureDetailOpen(true);
// // // //   };

// // // //   const handleCloseProductDetails = () => {
// // // //     setIsProductDetailOpen(false);
// // // //   };

// // // //   const handleCloseComponentDetails = () => {
// // // //     setIsComponentDetailOpen(false);
// // // //   };

// // // //   const handleCloseFeatureDetails = () => {
// // // //     setIsFeatureDetailOpen(false);
// // // //   };

// // // //   const handleCreateComponentClick = (productId: string) => {
// // // //     setSelectedProductIdForComponent(productId);
// // // //     setIsCreateComponentModalOpen(true);
// // // //   };

// // // //   const handleCreateFeatureClick = (componentId: string) => {
// // // //     setSelectedComponentIdForFeature(componentId);
// // // //     setIsCreateFeatureModalOpen(true);
// // // //   };

// // // //   // async function fetchProducts() {
// // // //   //   try {
// // // //   //     setLoading(true);
// // // //   //     const { data: productsData, error: productsError } = await supabase
// // // //   //       .from("products")
// // // //   //       .select("*")
// // // //   //       .neq("name", "Sample Product 1");
// // // //   //     if (productsError) throw productsError;
// // // //   //     const initialTableData: TableItem[] = productsData.map((product) => ({
// // // //   //       type: "product" as const,
// // // //   //       id: product.id,
// // // //   //       name: product.name || "Product",
// // // //   //       level: 0,
// // // //   //       data: product,
// // // //   //     }));
// // // //   //     setAllTableData(initialTableData);
// // // //   //     setTableData(initialTableData);
// // // //   //   } catch (error) {
// // // //   //     console.error("Error fetching products:", error);
// // // //   //   } finally {
// // // //   //     setLoading(false);
// // // //   //   }
// // // //   // }

// // // //   async function fetchProducts() {
// // // //     setLoading(true);
// // // //     try {
// // // //       const { data: productsData, error: productsError } = await supabase
// // // //         .from("products")
// // // //         .select("*")
// // // //         .neq("name", "Sample Product 1");

// // // //       if (productsError) throw productsError;
// // // //       const initialTableData: TableItem[] = productsData.map((product) => ({
// // // //         type: "product",
// // // //         id: product.id,
// // // //         name: product.name || "Product",
// // // //         level: 0,
// // // //         data: product,
// // // //       }));

// // // //       setAllTableData(initialTableData);
// // // //       setTableData(initialTableData);
// // // //     } catch (error) {
// // // //       console.error("Error fetching products:", error);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   }

// // // //   async function createNewProduct(name: string) {
// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from("products")
// // // //         .insert([{ name }])
// // // //         .select();
// // // //       if (error) throw error;
// // // //       if (data && data.length > 0) {
// // // //         const newProduct = data[0];
// // // //         const newProductItem: TableItem = {
// // // //           type: "product",
// // // //           id: newProduct.id,
// // // //           name: newProduct.name,
// // // //           level: 0,
// // // //           data: newProduct,
// // // //         };
// // // //         setAllTableData((prevData) => [...prevData, newProductItem]);
// // // //         setTableData((prevData) => [...prevData, newProductItem]);
// // // //         setCreatingProduct(false);
// // // //         setNewProductName("");
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error creating product:", error);
// // // //     }
// // // //   }

// // // //   async function createNewComponent(newComponent: any, productId: string) {
// // // //     try {
// // // //       const newComponentItem: TableItem = {
// // // //         type: "component",
// // // //         id: newComponent.id,
// // // //         name: newComponent.name,
// // // //         level: 1,
// // // //         data: newComponent,
// // // //       };

// // // //       setTableData((prevData) =>
// // // //         prevData.map((item) =>
// // // //           item.id === productId
// // // //             ? {
// // // //                 ...item,
// // // //                 children: [...(item.children || []), newComponentItem],
// // // //               }
// // // //             : item
// // // //         )
// // // //       );

// // // //       setAllTableData((prevData) =>
// // // //         prevData.map((item) =>
// // // //           item.id === productId
// // // //             ? {
// // // //                 ...item,
// // // //                 children: [...(item.children || []), newComponentItem],
// // // //               }
// // // //             : item
// // // //         )
// // // //       );

// // // //       setExpandedItems((prev) => ({
// // // //         ...prev,
// // // //         [`product-${productId}`]: true,
// // // //       }));

// // // //       setCreatingComponentForProduct(null);
// // // //       setNewComponentName("");
// // // //     } catch (error) {
// // // //       console.error("Error handling component creation:", error);
// // // //     }
// // // //   }

// // // //   async function createNewInlineComponent(name: string, productId: string) {
// // // //     try {
// // // //       const { data, error } = await supabase
// // // //         .from("components")
// // // //         .insert([{ name, product_id: productId }])
// // // //         .select();

// // // //       if (error) throw error;

// // // //       if (data && data.length > 0) {
// // // //         const newComponent = data[0];
// // // //         createNewComponent(newComponent, productId);
// // // //       }
// // // //     } catch (error) {
// // // //       console.error("Error creating component:", error);
// // // //     }
// // // //   }

// // // //   async function createNewFeature(newFeature: any, componentId: string) {
// // // //     const newFeatureItem: TableItem = {
// // // //       type: "feature",
// // // //       id: newFeature.id,
// // // //       name: newFeature.name,
// // // //       level: 2,
// // // //       data: newFeature,
// // // //     };

// // // //     setTableData((prevData) =>
// // // //       prevData.map((item) =>
// // // //         item.type === "product" && item.children
// // // //           ? {
// // // //               ...item,
// // // //               children: item.children.map((child) =>
// // // //                 child.id === componentId
// // // //                   ? {
// // // //                       ...child,
// // // //                       children: [...(child.children || []), newFeatureItem],
// // // //                     }
// // // //                   : child
// // // //               ),
// // // //             }
// // // //           : item
// // // //       )
// // // //     );

// // // //     setAllTableData((prevData) =>
// // // //       prevData.map((item) =>
// // // //         item.type === "product" && item.children
// // // //           ? {
// // // //               ...item,
// // // //               children: item.children.map((child) =>
// // // //                 child.id === componentId
// // // //                   ? {
// // // //                       ...child,
// // // //                       children: [...(child.children || []), newFeatureItem],
// // // //                     }
// // // //                   : child
// // // //               ),
// // // //             }
// // // //           : item
// // // //       )
// // // //     );

// // // //     setExpandedItems((prev) => {
// // // //       const updatedExpanded = { ...prev };
// // // //       const parentProduct = allTableData.find((p) =>
// // // //         p.children?.some((c) => c.id === componentId)
// // // //       );
// // // //       if (parentProduct) {
// // // //         updatedExpanded[`product-${parentProduct.id}`] = true;
// // // //         updatedExpanded[`component-${componentId}`] = true;
// // // //       }
// // // //       return updatedExpanded;
// // // //     });

// // // //     setIsCreateFeatureModalOpen(false);
// // // //     setSelectedComponentIdForFeature(null);
// // // //   }

// // // //   async function fetchComponents(productId: string) {
// // // //     try {
// // // //       const { data: componentsData, error: componentsError } = await supabase
// // // //         .from("components")
// // // //         .select("*")
// // // //         .eq("product_id", productId);

// // // //       if (componentsError) throw componentsError;
// // // //       return componentsData.map((component) => ({
// // // //         type: "component" as const,
// // // //         id: component.id,
// // // //         name: component.name || "Component",
// // // //         level: 1,
// // // //         data: component,
// // // //       }));
// // // //     } catch (error) {
// // // //       console.error("Error fetching components:", error);
// // // //       return [];
// // // //     }
// // // //   }

// // // //   async function fetchFeatures(componentId: string) {
// // // //     try {
// // // //       const { data: featuresData, error: featuresError } = await supabase
// // // //         .from("features")
// // // //         .select("*")
// // // //         .eq("component_id", componentId);

// // // //       if (featuresError) throw featuresError;
// // // //       return featuresData.map((feature) => ({
// // // //         type: "feature" as const,
// // // //         id: feature.id,
// // // //         name: feature.name || "Feature",
// // // //         level: 2,
// // // //         data: feature,
// // // //       }));
// // // //     } catch (error) {
// // // //       console.error("Error fetching features:", error);
// // // //       return [];
// // // //     }
// // // //   }

// // // //   const toggleExpand = async (
// // // //     type: string,
// // // //     id: string,
// // // //     data: Product | Component
// // // //   ) => {
// // // //     const newExpandedState = !expandedItems[`${type}-${id}`];
// // // //     setExpandedItems((prev) => ({
// // // //       ...prev,
// // // //       [`${type}-${id}`]: newExpandedState,
// // // //     }));

// // // //     if (newExpandedState) {
// // // //       if (type === "product") {
// // // //         const product = tableData.find((item) => item.id === id);
// // // //         if (!product?.children || product.children.length === 0) {
// // // //           const components = await fetchComponents(id);

// // // //           setTableData((prevData) =>
// // // //             prevData.map((item) =>
// // // //               item.id === id ? { ...item, children: components } : item
// // // //             )
// // // //           );

// // // //           setAllTableData((prevAllData) =>
// // // //             prevAllData.map((item) =>
// // // //               item.id === id ? { ...item, children: components } : item
// // // //             )
// // // //           );
// // // //         }
// // // //       } else if (type === "component") {
// // // //         let componentFound = false;
// // // //         const updatedTableData = tableData.map((product) => {
// // // //           if (product.children) {
// // // //             const componentIndex = product.children.findIndex(
// // // //               (comp) => comp.id === id
// // // //             );
// // // //             if (componentIndex >= 0) {
// // // //               componentFound = true;
// // // //               if (!product.children[componentIndex].children) {
// // // //                 return {
// // // //                   ...product,
// // // //                   children: product.children.map(async (comp, i) => {
// // // //                     if (i === componentIndex) {
// // // //                       const features = await fetchFeatures(id);
// // // //                       return { ...comp, children: features };
// // // //                     }
// // // //                     return comp;
// // // //                   }),
// // // //                 };
// // // //               }
// // // //             }
// // // //           }
// // // //           return product;
// // // //         });

// // // //         if (componentFound) {
// // // //           const features = await fetchFeatures(id);

// // // //           setTableData((prevData) =>
// // // //             prevData.map((product) => {
// // // //               if (product.children) {
// // // //                 return {
// // // //                   ...product,
// // // //                   children: product.children.map((comp) =>
// // // //                     comp.id === id ? { ...comp, children: features } : comp
// // // //                   ),
// // // //                 };
// // // //               }
// // // //               return product;
// // // //             })
// // // //           );

// // // //           setAllTableData((prevData) =>
// // // //             prevData.map((product) => {
// // // //               if (product.children) {
// // // //                 return {
// // // //                   ...product,
// // // //                   children: product.children.map((comp) =>
// // // //                     comp.id === id ? { ...comp, children: features } : comp
// // // //                   ),
// // // //                 };
// // // //               }
// // // //               return product;
// // // //             })
// // // //           );
// // // //         }
// // // //       }
// // // //     }
// // // //   };

// // // //   const isExpanded = (type: string, id: string) => {
// // // //     return !!expandedItems[`${type}-${id}`];
// // // //   };

// // // //   const getFeatureColorClass = (index: number) => {
// // // //     const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
// // // //     return colors[index % colors.length];
// // // //   };

// // // //   const handleSaveNewProduct = () => {
// // // //     if (newProductName.trim()) {
// // // //       createNewProduct(newProductName.trim());
// // // //     }
// // // //   };

// // // //   const handleCancelNewProduct = () => {
// // // //     setCreatingProduct(false);
// // // //     setNewProductName("");
// // // //   };

// // // //   const handleSaveNewComponent = (productId: string) => {
// // // //     if (newComponentName.trim()) {
// // // //       createNewInlineComponent(newComponentName.trim(), productId);
// // // //     }
// // // //   };

// // // //   const handleCancelNewComponent = () => {
// // // //     setCreatingComponentForProduct(null);
// // // //     setNewComponentName("");
// // // //   };

// // // //   const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
// // // //     return children.map((child) => (
// // // //       <div key={child.id} >
// // // //         <div
// // // //           className={`flex py-2 px-1 items-center  ${child.level=== 2 ?'bg-[#fff]' : 'bg-[#cce4fc]'}  border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// // // //         >
// // // //           <div  ref={setNodeRef}
// // // //           {...listeners}
// // // //           {...attributes}
// // // //             className={`${child.level=== 2 ?'w-[563px] min-w-[433px] max-w-[433px]':'w-[436px] min-w-[435px] max-w-[435px]'}  flex items-center gap-2 `}
// // // //             style={{ paddingLeft: `${16 + child.level * 16}px`, 
// // // //             transition,
// // // //             opacity: isDragging ? 0.5 : 1,  }}
// // // //           >
// // // //             <div
// // // //               className="flex items-center gap-2 cursor-pointer w-full"
// // // //               onClick={() => {
// // // //                 if (child.type === "product" || child.type === "component") {
// // // //                   if (child.type === "product" || child.type === "component") {
// // // //                     toggleExpand(child.type, child.id, child.data);
// // // //                   }
// // // //                 }
// // // //               }}
// // // //             >
// // // //               {child.level < 2 &&
// // // //                 (isExpanded(child.type, child.id) ? (
// // // //                   <ChevronDown size={18} className="text-gray-500" />
// // // //                 ) : (
// // // //                   <ChevronRight size={18} className="text-gray-500" />
// // // //                 ))}
// // // //               {/* <div className="flex items-center gap-2"> */}
// // // //               <div
// // // //                 className={`flex items-center gap-2 cursor-pointer w-full ${
// // // //                   child.type === "component" || child.type === "feature"
// // // //                     ? "text-gray-500 text-[14px]"
// // // //                     : ""
// // // //                 }`}
// // // //                 onClick={(e) => {
// // // //                   if (child.type === "component") {
// // // //                     e.stopPropagation();
// // // //                     handleComponentSelection(child);
// // // //                   } else if (child.type === "feature") {
// // // //                     e.stopPropagation();
// // // //                     handleFeatureSelection(child);
// // // //                   }
// // // //                 }}
// // // //               >
// // // //                 {child.level === 1 && (
// // // //                   <span className="p-1 bg-white text-gray-500 rounded-md">
// // // //                     <svg
// // // //                       width="16"
// // // //                       height="16"
// // // //                       viewBox="0 0 24 24"
// // // //                       fill="none"
// // // //                       stroke="currentColor"
// // // //                       strokeWidth="2"
// // // //                     >
// // // //                       <rect x="3" y="3" width="7" height="7" rx="1" />
// // // //                       <rect x="14" y="3" width="7" height="7" rx="1" />
// // // //                       <rect x="3" y="14" width="7" height="7" rx="1" />
// // // //                       <rect x="14" y="14" width="7" height="7" rx="1" />
// // // //                     </svg>
// // // //                   </span>
// // // //                 )}
// // // //                 {child.level === 2 && (
// // // //                     <>
// // // // {/*                   <span
// // // //                     className={`inline-block ${getFeatureColorClass(
// // // //                     Math.floor(Math.random() * 3)
// // // //                     )} w-4 h-4 rounded-sm`}
// // // //                   >
// // // //   </span> */}
  
// // // //     <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// // // // new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// // // // ).toString() )&& 'text-[#ff4747]'} `}>
// // // //     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// // // //     </svg>
// // // //     </div>

// // // // </>

               
// // // //                 )}
// // // //                 <span
// // // //                   className={`cursor-pointer ${
// // // //                     child.type === "component"
// // // //                       ? "hover:text-blue-600"
// // // //                       : child.type === "feature"
// // // //                       ? "hover:text-blue-600"
// // // //                       : ""
// // // //                   } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%]  w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
// // // //                   onClick={(e) => {
// // // //                     if (child.type === "component") {
// // // //                       e.stopPropagation();
// // // //                       handleComponentSelection(child);
// // // //                     } else if (child.type === "feature") {
// // // //                       e.stopPropagation();
// // // //                       handleFeatureSelection(child);
// // // //                     }
// // // //                   }}
// // // //                 >
// // // //                   {child.name}
// // // //                 </span>
// // // //               </div>
// // // //             </div>

// // // // {/* feature component */}
// // // //             {/* Add the Plus button only for components (level 1) to create features */}
// // // //             {child.level === 1 && (
// // // //               <button
// // // //                 onClick={(e) => {
// // // //                   e.stopPropagation();
// // // //                   handleCreateFeatureClick(child.id);
// // // //                 }}
// // // //                 className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // // //               >
// // // //                  <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // // //               </button>
// // // //             )}
// // // //           </div>
// // // //           <div className="w-[130px]   flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //             {child?.data?.status || "-"} 
// // // //           </div>
// // // //           <div className="w-[120px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //             { `${child?.data?.progress}%` ||"-"}
// // // //           </div>
// // // //           <div className="w-[144px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //             {child?.data?.team || "-"}
// // // //           </div>
// // // //           <div className="w-[112px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //             { child?.data?.days || "-"} 
// // // //           </div>
// // // //           <div className="w-[180px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // // //             {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
// // // //           </div>
// // // //           {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //             {child.data.targetDate || ""}
// // // //           </div> */}
// // // //           <div
// // // //             className="w-[170px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// // // //  "
// // // //           >
// // // //             {child.data.completedOn || "-"}
// // // //           </div>
// // // //           <div
// // // //             className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// // // // "
// // // //           >
// // // //             <span>{child.data.remarks || "-"}</span>
// // // //           </div>
// // // //         </div>
// // // //         {child.children &&
// // // //           isExpanded(child.type, child.id) &&
// // // //           renderChildren(child.children)}

// // // //         {child.level === 1 &&
// // // //           creatingComponentForProduct === `AFTER_${child.id}` && (
// // // //             <div
// // // //               className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
// // // //               style={{ paddingLeft: `${16 + child.level * 16}px` }}
// // // //             >
// // // //               <div className="w-[600px] flex items-center gap-2">
// // // //                 <Input
// // // //                   type="text"
// // // //                   placeholder="Enter component name"
// // // //                   value={newComponentName}
// // // //                   onChange={(e) => setNewComponentName(e.target.value)}
// // // //                   className="w-48"
// // // //                 />
// // // //                 <Button
// // // //                   size="sm"
// // // //                   onClick={() => {
// // // //                     const productId = tableData.find((p) =>
// // // //                       p.children?.some((c) => c.id === child.id)
// // // //                     )?.id;
// // // //                     if (productId) {
// // // //                       handleSaveNewComponent(productId);
// // // //                     }
// // // //                   }}
// // // //                 >
// // // //                   Save
// // // //                 </Button>
// // // //                 <Button
// // // //                   size="sm"
// // // //                   variant="outline"
// // // //                   onClick={handleCancelNewComponent}
// // // //                 >
// // // //                   Cancel
// // // //                 </Button>
// // // //               </div>
// // // //             </div>
// // // //           )}
// // // //       </div>
// // // //     ));
// // // //   };

// // // //   if (loading) {
// // // //     return <div className="flex justify-center p-10">Loading products...</div>;
// // // //   }

// // // //   return (
// // // //     <DndContext onDragEnd={handleDragEnd}>
// // // //           <SortableContext items={tableData.map((item) => item.id)} strategy={verticalListSortingStrategy}>

// // // //     <div className="w-full flex">
// // // //       {/* Left Side - Product Table */}
// // // //       {/* <div className={`${selectedProduct ? 'w-1/2' : 'w-full'} transition-all duration-300`}> */}
// // // //       <div className="w-full transition-all duration-300">
// // // //         <CreateFeatureModal
// // // //           isOpen={isCreateFeatureModalOpen}
// // // //           onClose={() => setIsCreateFeatureModalOpen(false)}
// // // //           componentId={selectedComponentIdForFeature}
// // // //           onFeatureCreated={createNewFeature}
// // // //         />

// // // //         <CreateComponentModal
// // // //           isOpen={isCreateComponentModalOpen}
// // // //           onClose={() => setIsCreateComponentModalOpen(false)}
// // // //           productId={selectedProductIdForComponent}
// // // //           onComponentCreated={createNewComponent}
// // // //         />

// // // //         {selectedProduct && (
// // // //           <ProductDetailsPage
// // // //             productId={selectedProduct.data.id} // Pass the ID to fetch details within ProductDetailsPage
// // // //             isOpen={isProductDetailOpen}
// // // //             onClose={handleCloseProductDetails}
// // // //             onProductUpdated={handleProductUpdate}
// // // //           />
// // // //         )}

// // // //         {selectedComponent && (
// // // //           <ComponentDetailsPage
// // // //             componentId={selectedComponent.data.id}
// // // //             isOpen={isComponentDetailOpen}
// // // //             onClose={handleCloseComponentDetails}
// // // //           />
// // // //         )}

// // // //         {selectedFeature && (
// // // //           <FeatureDetailsPage
// // // //             featureId={selectedFeature.data.id}
// // // //             isOpen={isFeatureDetailOpen}
// // // //             onClose={handleCloseFeatureDetails}
// // // //           />
// // // //         )}

// // // //         <div className="bg-gray-100 border-b px-5">
// // // //           <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
// // // //             <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //               Products, Components, Features
// // // //             </div>
// // // //             <div className="w-[80px]    justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //               Status
// // // //             </div>
// // // //             <div className="w-[80px]   justify-center text-center  text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //               Progress
// // // //             </div>
// // // //             <div className="w-[100px]   flex justify-center text-center  text-[13px] font-bold flex-row  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //                 <div className="flex-row flex">
// // // //                     <img className="w-[16px] h-[16px] mr-1" src="/person.svg"></img>Team
// // // //                 </div>
// // // //             </div>
// // // //             <div className="w-[72px]   flex  text-center text-[13px] font-bold flex-row   whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1"></img> Days
// // // //             </div>
// // // //             <div className="w-[144px]   flex justify-center text-center text-[13px] font-bold flex-row   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg"></img> Target span
// // // //             </div>
// // // //             {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[13px] font-bol flex-row flex mx-auto">
// // // //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img>Target Date
// // // //             </div> */}
// // // //             <div className="w-[144px]   justify-center text-center  text-[13px] font-bold flex-row flex  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Completion Time
// // // //             </div>
// // // //             <div className="w-[100px] text-center  text-[13px] font-bold flex-row flex   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // // //              <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Remarks
// // // //             </div>
// // // //           </div>
// // // //         </div>

// // // //         <div className="divide-y bg-white px-6">
// // // //           {tableData.map((item) => (
// // // //             <div key={item.id} >
// // // //               <div

// // // // ref={setNodeRef}
// // // // {...listeners}
// // // // {...attributes}
// // // //                 className={` flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
// // // //                   selectedProduct?.id === item.id ? "bg-blue-50" : ""
// // // //                 }`}
// // // //                 style={{ paddingLeft: `${16 + item.level * 16}px` , 
// // // //                 transition,
// // // //                 opacity: isDragging ? 0.5 : 1,}}
// // // //               >
// // // //                 <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2   " 
// // // //     >
// // // //                   <div
// // // //                     className="flex items-center gap-2 cursor-pointer w-full"
// // // //                     onClick={() => toggleExpand(item.type, item.id, item.data)}
// // // //                   >
// // // //                     {item.level < 2 &&
// // // //                       (isExpanded(item.type, item.id) ? (
// // // //                         <ChevronDown size={18} className="text-gray-500" />
// // // //                       ) : (
// // // //                         <ChevronRight size={18} className="text-gray-500" />
// // // //                       ))}

// // // //                     <div className="flex items-center gap-2 text-gray-800 bg-white">
// // // //                       {item.level === 0 && (
// // // //                         <div className="p-1 bg-white text-gray-400 rounded-md">
// // // //                           <svg
// // // //                             height="16px"
// // // //                             width="16px"
// // // //                             viewBox="0 0 16 16"
// // // //                             role="img"
// // // //                             aria-label="ProductIcon"
// // // //                             className="sc-fQpRED cOkelz ui-icon"
// // // //                           >
// // // //                             <path
// // // //                               fill="currentColor"
// // // //                               fill-rule="evenodd"
// // // //                               d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// // // //                               clip-rule="evenodd"
// // // //                             ></path>
// // // //                           </svg>
// // // //                         </div>
// // // //                       )}
// // // //                       <span
// // // //                         className={`cursor-pointer ${
// // // //                           item.type === "product" ? "hover:text-blue-600" : ""
// // // //                         } text-gray-700 text-[16px]`}
// // // //                         onClick={(e) => {
// // // //                           if (item.type === "product") {
// // // //                             e.stopPropagation();
// // // //                             handleProductSelection(item);
// // // //                           }
// // // //                         }}
// // // //                       >
// // // //                         {item.name}
// // // //                       </span>
// // // //                     </div>
// // // //                   </div>

// // // //                   {item.level === 0 && (
// // // //                     <button
// // // //                       onClick={(e) => {
// // // //                         e.stopPropagation();
// // // //                         handleCreateComponentClick(item.id);
// // // //                       }}
// // // //                       className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // // //                     >
// // // //                     <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // // //                     </button>
// // // //                   )}
// // // //                   {creatingComponentForProduct === item.id && (
// // // //                     <>
// // // //                       <Input
// // // //                         type="text"
// // // //                         placeholder="Enter component name"
// // // //                         value={newComponentName}
// // // //                         onChange={(e) => setNewComponentName(e.target.value)}
// // // //                         className="ml-2 w-48"
// // // //                       />
// // // //                       <Button
// // // //                         size="sm"
// // // //                         onClick={() => handleSaveNewComponent(item.id)}
// // // //                       >
// // // //                         Save
// // // //                       </Button>
// // // //                       <Button
// // // //                         size="sm"
// // // //                         variant="outline"
// // // //                         onClick={handleCancelNewComponent}
// // // //                       >
// // // //                         Cancel
// // // //                       </Button>
// // // //                     </>
// // // //                   )}
// // // //                 </div>

// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
// // // //                   {item.data.status || ""}
// // // //                 </div>
// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.progress !== undefined
// // // //                     ? `${item.data.progress}%`
// // // //                     : ""}
// // // //                 </div>
// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.team || ""}
// // // //                 </div>
// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.days !== undefined ? item.data.days : ""}
// // // //                 </div>
// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.startDate || ""}-{item.data.targetDate || ""}
// // // //                 </div>
// // // //                 {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.targetDate || ""}
// // // //                 </div> */}
// // // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   {item.data.completedOn || ""}
// // // //                 </div>
// // // //                 <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
// // // //                   <span>{item.data.remarks || ""}</span>
// // // //                 </div>
// // // //               </div>
// // // //               {item.children &&
// // // //                 isExpanded(item.type, item.id) &&
// // // //                 renderChildren(item.children)}
// // // //             </div>
// // // //           ))}
// // // //         </div>

// // // //         <div className="mt-2 bg-gray-100 px-6">
// // // //           {creatingProduct ? (
// // // //             <div className="flex py-2 items-center hover:bg-gray-50">
// // // //               <div className="w-[600px] flex items-center gap-2">
// // // //                 <Input
// // // //                   type="text"
// // // //                   placeholder="Enter product name"
// // // //                   value={newProductName}
// // // //                   onChange={(e) => setNewProductName(e.target.value)}
// // // //                 />
// // // //                 <Button size="sm" onClick={handleSaveNewProduct}>
// // // //                   Save
// // // //                 </Button>
// // // //                 <Button
// // // //                   size="sm"
// // // //                   variant="outline"
// // // //                   onClick={handleCancelNewProduct}
// // // //                 >
// // // //                   Cancel
// // // //                 </Button>
// // // //               </div>
// // // //             </div>
// // // //           ) : (
// // // //             <div className="bg-white-200 px-5">
// // // //               <Button onClick={handleCreateProductClick}>
// // // //                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // // //                 Create Product
// // // //               </Button>
// // // //             </div>
// // // //           )}
// // // //         </div>
// // // //       </div>
// // // //     </div>
// // // //     </SortableContext>
    
// // // //     </DndContext>
// // // //   );
// // // // }



// // // "use client";

// // // import { useState, useEffect } from "react";
// // // import { supabase } from "@/lib/supabaseClient";
// // // import {
// // //   ArrowLeft,
// // //   ChevronDown,
// // //   ChevronRight,
// // //   Maximize2,
// // //   Plus,
// // // } from "lucide-react";
// // // import { Input } from "@/components/ui/input";
// // // import { Product, Component, Feature } from "@/app/types";
// // // import { Button } from "@/components/ui/button";
// // // import { useRouter } from "next/navigation";

// // // import ProductDetailsPage from "./_components/productDetails";
// // // import ComponentDetailsPage from "./_components/componentDetails";
// // // import FeatureDetailsPage from "./_components/featureDetails";
// // // import { CreateFeatureModal } from "./_components/createFeatureModal";
// // // import { CreateComponentModal } from "./_components/createComponentModal";
// // // import { 
// // //   DndContext, 
// // //   closestCenter,
// // //   KeyboardSensor,
// // //   PointerSensor,
// // //   useSensor,
// // //   useSensors,
// // //   DragEndEvent,
// // //   DragStartEvent,
// // //   DragOverlay
// // // } from "@dnd-kit/core";
// // // import {
// // //   SortableContext, 
// // //   sortableKeyboardCoordinates,
// // //   useSortable,
// // //   verticalListSortingStrategy,
// // //   arrayMove
// // // } from "@dnd-kit/sortable";
// // // import { CSS } from '@dnd-kit/utilities';

// // // interface TableItem {
// // //   type: "product" | "component" | "feature";
// // //   id: string;
// // //   name: string;
// // //   level: number;
// // //   data: any;
// // //   parentId?: string; // Track parent ID for components and features
// // //   children?: TableItem[];
// // // }

// // // interface ProductTableProps {
// // //   selectedProductIds: string[];
// // // }

// // // // Sortable item component for DnD
// // // function SortableItem({ item, expandedItems, toggleExpand, renderActions, renderChildren, isExpanded }) {
// // //   const {
// // //     attributes,
// // //     listeners,
// // //     setNodeRef,
// // //     transform,
// // //     transition,
// // //     isDragging,
// // //   } = useSortable({
// // //     id: `${item.type}-${item.id}`,
// // //     data: {
// // //       type: item.type,
// // //       id: item.id,
// // //       parentId: item.parentId,
// // //       level: item.level
// // //     }
// // //   });
  
// // //   const style = {
// // //     transform: CSS.Transform.toString(transform),
// // //     transition,
// // //     opacity: isDragging ? 0.5 : 1,
// // //     position: isDragging ? 'relative' : undefined,
// // //     zIndex: isDragging ? 999 : undefined,
// // //   };

// // //   return (
// // //     <div ref={setNodeRef} style={style}>
// // //       <div
// // //         className={`flex py-2 px-1 items-center ${
// // //           item.level === 2 ? 'bg-[#fff]' : item.level === 1 ? 'bg-[#cce4fc]' : ''
// // //         } border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// // //       >
// // //         <div
// // //           className={`${
// // //             item.level === 2
// // //               ? 'w-[563px] min-w-[433px] max-w-[433px]'
// // //               : 'w-[436px] min-w-[435px] max-w-[435px]'
// // //           } flex items-center gap-2`}
// // //           style={{ paddingLeft: `${16 + item.level * 16}px` }}
// // //         >
// // //           <div
// // //             className="flex items-center gap-2 cursor-pointer w-full"
// // //             onClick={() => {
// // //               if (item.type === "product" || item.type === "component") {
// // //                 toggleExpand(item.type, item.id, item.data);
// // //               }
// // //             }}
// // //           >
// // //             <div {...attributes} {...listeners} className="cursor-grab">
// // //               <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
// // //                 <path d="M2 4h12v2H2V4zm0 4h12v2H2V8zm0 4h12v2H2v-2z"/>
// // //               </svg>
// // //             </div>
            
// // //             {item.level < 2 &&
// // //               (isExpanded(item.type, item.id) ? (
// // //                 <ChevronDown size={18} className="text-gray-500" />
// // //               ) : (
// // //                 <ChevronRight size={18} className="text-gray-500" />
// // //               ))}
            
// // //             {renderActions(item)}
// // //           </div>
// // //         </div>

// // //         <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {item?.data?.status || "-"} 
// // //         </div>
// // //         <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {`${item?.data?.progress}%` || "-"}
// // //         </div>
// // //         <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {item?.data?.team || "-"}
// // //         </div>
// // //         <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {item?.data?.days || "-"} 
// // //         </div>
// // //         <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //           {item?.data?.startDate || ""}-{item?.data?.targetDate || ""}
// // //         </div>
// // //         <div className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {item.data.completedOn || "-"}
// // //         </div>
// // //         <div className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           <span>{item.data.remarks || "-"}</span>
// // //         </div>
// // //       </div>
      
// // //       {item.children &&
// // //         isExpanded(item.type, item.id) &&
// // //         renderChildren(item.children)}
// // //     </div>
// // //   );
// // // }

// // // export default function ProductTable({
// // //   selectedProductIds,
// // // }: ProductTableProps) {
// // //   const [allTableData, setAllTableData] = useState<TableItem[]>([]);
// // //   const [tableData, setTableData] = useState<TableItem[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
// // //   const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] = useState(false);
// // //   const [selectedProductIdForComponent, setSelectedProductIdForComponent] = useState<string | null>(null);
// // //   const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] = useState(false);
// // //   const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] = useState<string | null>(null);
// // //   const router = useRouter();
// // //   const [creatingProduct, setCreatingProduct] = useState(false);
// // //   const [newProductName, setNewProductName] = useState("");
// // //   const [creatingComponentForProduct, setCreatingComponentForProduct] = useState<string | null>(null);
// // //   const [newComponentName, setNewComponentName] = useState("");
// // //   const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(null);
// // //   const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
// // //   const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(null);
// // //   const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
// // //   const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(null);
// // //   const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);
// // //   const [activeId, setActiveId] = useState<string | null>(null);
// // //   const [activeDragItem, setActiveDragItem] = useState<TableItem | null>(null);

// // //   const sensors = useSensors(
// // //     useSensor(PointerSensor, {
// // //       activationConstraint: {
// // //         distance: 8,
// // //       },
// // //     }),
// // //     useSensor(KeyboardSensor, {
// // //       coordinateGetter: sortableKeyboardCoordinates,
// // //     })
// // //   );

// // //   useEffect(() => {
// // //     fetchProducts();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (selectedProductIds.length > 0) {
// // //       const filteredData = allTableData.filter(
// // //         (item) =>
// // //           item.type === "product" && selectedProductIds.includes(item.id)
// // //       );
// // //       setTableData(filteredData);
// // //     } else {
// // //       setTableData(allTableData);
// // //     }
// // //   }, [selectedProductIds, allTableData]);

// // //   const handleDragStart = (event: DragStartEvent) => {
// // //     const { active } = event;
// // //     const activeId = active.id.toString();
// // //     setActiveId(activeId);
    
// // //     // Find the dragged item
// // //     const findDragItem = (items: TableItem[]): TableItem | null => {
// // //       for (const item of items) {
// // //         const itemId = `${item.type}-${item.id}`;
// // //         if (itemId === activeId) {
// // //           return item;
// // //         }
// // //         if (item.children) {
// // //           const found = findDragItem(item.children);
// // //           if (found) return found;
// // //         }
// // //       }
// // //       return null;
// // //     };
    
// // //     const dragItem = findDragItem(tableData);
// // //     setActiveDragItem(dragItem || null);
// // //   };

// // //   const handleDragEnd = (event: DragEndEvent) => {
// // //     const { active, over } = event;
    
// // //     if (!over || active.id === over.id) {
// // //       setActiveId(null);
// // //       setActiveDragItem(null);
// // //       return;
// // //     }
    
// // //     const activeId = active.id.toString();
// // //     const overId = over.id.toString();
    
// // //     const activeType = activeId.split('-')[0];
// // //     const activeItemId = activeId.split('-')[1];
// // //     const overType = overId.split('-')[0];
// // //     const overItemId = overId.split('-')[1];
    
// // //     // Only allow reordering within same type and parent
// // //     if (activeType !== overType) {
// // //       setActiveId(null);
// // //       setActiveDragItem(null);
// // //       return;
// // //     }
    
// // //     // Handle reordering based on item type
// // //     if (activeType === 'product') {
// // //       reorderProducts(activeItemId, overItemId);
// // //     } else if (activeType === 'component') {
// // //       // Get the parent product for these components
// // //       const parentProduct = findParentProduct(activeItemId);
// // //       if (parentProduct) {
// // //         reorderComponents(activeItemId, overItemId, parentProduct.id);
// // //       }
// // //     } else if (activeType === 'feature') {
// // //       // Get the parent component and product for these features
// // //       const { parentComponent, parentProduct } = findParentComponentAndProduct(activeItemId);
// // //       if (parentComponent && parentProduct) {
// // //         reorderFeatures(activeItemId, overItemId, parentComponent.id, parentProduct.id);
// // //       }
// // //     }
    
// // //     setActiveId(null);
// // //     setActiveDragItem(null);
// // //   };
  
// // //   const findParentProduct = (componentId: string): TableItem | null => {
// // //     for (const product of tableData) {
// // //       if (product.children) {
// // //         for (const component of product.children) {
// // //           if (component.id === componentId) {
// // //             return product;
// // //           }
// // //         }
// // //       }
// // //     }
// // //     return null;
// // //   };
  
// // //   const findParentComponentAndProduct = (featureId: string): { parentComponent: TableItem | null, parentProduct: TableItem | null } => {
// // //     for (const product of tableData) {
// // //       if (product.children) {
// // //         for (const component of product.children) {
// // //           if (component.children) {
// // //             for (const feature of component.children) {
// // //               if (feature.id === featureId) {
// // //                 return { parentComponent: component, parentProduct: product };
// // //               }
// // //             }
// // //           }
// // //         }
// // //       }
// // //     }
// // //     return { parentComponent: null, parentProduct: null };
// // //   };
  
// // //   const reorderProducts = (activeId: string, overId: string) => {
// // //     setTableData((items) => {
// // //       const oldIndex = items.findIndex(item => item.id === activeId);
// // //       const newIndex = items.findIndex(item => item.id === overId);
      
// // //       if (oldIndex !== -1 && newIndex !== -1) {
// // //         const reordered = arrayMove(items, oldIndex, newIndex);
// // //         setAllTableData(reordered);
// // //         return reordered;
// // //       }
      
// // //       return items;
// // //     });
    
// // //     // Here you would call your API to update the order in the database
// // //     updateProductOrder(activeId, overId);
// // //   };
  
// // //   const reorderComponents = (activeId: string, overId: string, productId: string) => {
// // //     setTableData((items) => {
// // //       const updatedItems = [...items];
// // //       const productIndex = updatedItems.findIndex(item => item.id === productId);
      
// // //       if (productIndex !== -1 && updatedItems[productIndex].children) {
// // //         const components = updatedItems[productIndex].children || [];
// // //         const oldIndex = components.findIndex(comp => comp.id === activeId);
// // //         const newIndex = components.findIndex(comp => comp.id === overId);
        
// // //         if (oldIndex !== -1 && newIndex !== -1) {
// // //           updatedItems[productIndex].children = arrayMove(components, oldIndex, newIndex);
// // //         }
// // //       }
      
// // //       setAllTableData(updatedItems);
// // //       return updatedItems;
// // //     });
    
// // //     // Here you would call your API to update the order in the database
// // //     updateComponentOrder(activeId, overId, productId);
// // //   };
  
// // //   const reorderFeatures = (activeId: string, overId: string, componentId: string, productId: string) => {
// // //     setTableData((items) => {
// // //       const updatedItems = [...items];
// // //       const productIndex = updatedItems.findIndex(item => item.id === productId);
      
// // //       if (productIndex !== -1 && updatedItems[productIndex].children) {
// // //         const components = updatedItems[productIndex].children || [];
// // //         const componentIndex = components.findIndex(comp => comp.id === componentId);
        
// // //         if (componentIndex !== -1 && components[componentIndex].children) {
// // //           const features = components[componentIndex].children || [];
// // //           const oldIndex = features.findIndex(feat => feat.id === activeId);
// // //           const newIndex = features.findIndex(feat => feat.id === overId);
          
// // //           if (oldIndex !== -1 && newIndex !== -1) {
// // //             components[componentIndex].children = arrayMove(features, oldIndex, newIndex);
// // //           }
// // //         }
// // //       }
      
// // //       setAllTableData(updatedItems);
// // //       return updatedItems;
// // //     });
    
// // //     // Here you would call your API to update the order in the database
// // //     updateFeatureOrder(activeId, overId, componentId);
// // //   };
  
// // //   // API functions to update order in database
// // //   const updateProductOrder = async (movedProductId: string, targetProductId: string) => {
// // //     try {
// // //       // Implement your API call to update product order
// // //       console.log(`Reordering product ${movedProductId} relative to ${targetProductId}`);
// // //       // Example: await supabase.rpc('update_product_order', { moved_id: movedProductId, target_id: targetProductId });
// // //     } catch (error) {
// // //       console.error("Error updating product order:", error);
// // //     }
// // //   };
  
// // //   const updateComponentOrder = async (movedComponentId: string, targetComponentId: string, productId: string) => {
// // //     try {
// // //       // Implement your API call to update component order
// // //       console.log(`Reordering component ${movedComponentId} relative to ${targetComponentId} in product ${productId}`);
// // //       // Example: await supabase.rpc('update_component_order', { moved_id: movedComponentId, target_id: targetComponentId, product_id: productId });
// // //     } catch (error) {
// // //       console.error("Error updating component order:", error);
// // //     }
// // //   };
  
// // //   const updateFeatureOrder = async (movedFeatureId: string, targetFeatureId: string, componentId: string) => {
// // //     try {
// // //       // Implement your API call to update feature order
// // //       console.log(`Reordering feature ${movedFeatureId} relative to ${targetFeatureId} in component ${componentId}`);
// // //       // Example: await supabase.rpc('update_feature_order', { moved_id: movedFeatureId, target_id: targetFeatureId, component_id: componentId });
// // //     } catch (error) {
// // //       console.error("Error updating feature order:", error);
// // //     }
// // //   };

// // //   const handleProductUpdate = (updatedProduct: Product) => {
// // //     setTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.id === updatedProduct.id
// // //           ? { ...item, data: updatedProduct }
// // //           : item
// // //       )
// // //     );
// // //     setAllTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.id === updatedProduct.id
// // //           ? { ...item, data: updatedProduct }
// // //           : item
// // //       )
// // //     );
// // //   };

// // //   const handleCreateProductClick = () => {
// // //     setCreatingProduct(true);
// // //   };

// // //   const handleProductSelection = (product: TableItem) => {
// // //     setSelectedProduct(product);
// // //     setIsProductDetailOpen(true);
// // //   };

// // //   const handleComponentSelection = (component: TableItem) => {
// // //     setSelectedComponent(component);
// // //     setIsComponentDetailOpen(true);
// // //   };

// // //   const handleFeatureSelection = (feature: TableItem) => {
// // //     setSelectedFeature(feature);
// // //     setIsFeatureDetailOpen(true);
// // //   };

// // //   const handleCloseProductDetails = () => {
// // //     setIsProductDetailOpen(false);
// // //   };

// // //   const handleCloseComponentDetails = () => {
// // //     setIsComponentDetailOpen(false);
// // //   };

// // //   const handleCloseFeatureDetails = () => {
// // //     setIsFeatureDetailOpen(false);
// // //   };

// // //   const handleCreateComponentClick = (productId: string) => {
// // //     setSelectedProductIdForComponent(productId);
// // //     setIsCreateComponentModalOpen(true);
// // //   };

// // //   const handleCreateFeatureClick = (componentId: string) => {
// // //     setSelectedComponentIdForFeature(componentId);
// // //     setIsCreateFeatureModalOpen(true);
// // //   };

// // //   async function fetchProducts() {
// // //     setLoading(true);
// // //     try {
// // //       const { data: productsData, error: productsError } = await supabase
// // //         .from("products")
// // //         .select("*")
// // //         .neq("name", "Sample Product 1");

// // //       if (productsError) throw productsError;
// // //       const initialTableData: TableItem[] = productsData.map((product) => ({
// // //         type: "product",
// // //         id: product.id,
// // //         name: product.name || "Product",
// // //         level: 0,
// // //         data: product,
// // //       }));

// // //       setAllTableData(initialTableData);
// // //       setTableData(initialTableData);
// // //     } catch (error) {
// // //       console.error("Error fetching products:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function createNewProduct(name: string) {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("products")
// // //         .insert([{ name }])
// // //         .select();
// // //       if (error) throw error;
// // //       if (data && data.length > 0) {
// // //         const newProduct = data[0];
// // //         const newProductItem: TableItem = {
// // //           type: "product",
// // //           id: newProduct.id,
// // //           name: newProduct.name,
// // //           level: 0,
// // //           data: newProduct,
// // //         };
// // //         setAllTableData((prevData) => [...prevData, newProductItem]);
// // //         setTableData((prevData) => [...prevData, newProductItem]);
// // //         setCreatingProduct(false);
// // //         setNewProductName("");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error creating product:", error);
// // //     }
// // //   }

// // //   async function createNewComponent(newComponent: any, productId: string) {
// // //     try {
// // //       const newComponentItem: TableItem = {
// // //         type: "component",
// // //         id: newComponent.id,
// // //         name: newComponent.name,
// // //         level: 1,
// // //         parentId: productId,
// // //         data: newComponent,
// // //       };

// // //       setTableData((prevData) =>
// // //         prevData.map((item) =>
// // //           item.id === productId
// // //             ? {
// // //                 ...item,
// // //                 children: [...(item.children || []), newComponentItem],
// // //               }
// // //             : item
// // //         )
// // //       );

// // //       setAllTableData((prevData) =>
// // //         prevData.map((item) =>
// // //           item.id === productId
// // //             ? {
// // //                 ...item,
// // //                 children: [...(item.children || []), newComponentItem],
// // //               }
// // //             : item
// // //         )
// // //       );

// // //       setExpandedItems((prev) => ({
// // //         ...prev,
// // //         [`product-${productId}`]: true,
// // //       }));

// // //       setCreatingComponentForProduct(null);
// // //       setNewComponentName("");
// // //     } catch (error) {
// // //       console.error("Error handling component creation:", error);
// // //     }
// // //   }

// // //   async function createNewInlineComponent(name: string, productId: string) {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("components")
// // //         .insert([{ name, product_id: productId }])
// // //         .select();

// // //       if (error) throw error;

// // //       if (data && data.length > 0) {
// // //         const newComponent = data[0];
// // //         createNewComponent(newComponent, productId);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error creating component:", error);
// // //     }
// // //   }

// // //   async function createNewFeature(newFeature: any, componentId: string) {
// // //     // Find parent product for this component
// // //     let parentProductId = "";
// // //     for (const product of tableData) {
// // //       if (product.children) {
// // //         for (const component of product.children) {
// // //           if (component.id === componentId) {
// // //             parentProductId = product.id;
// // //             break;
// // //           }
// // //         }
// // //       }
// // //       if (parentProductId) break;
// // //     }

// // //     const newFeatureItem: TableItem = {
// // //       type: "feature",
// // //       id: newFeature.id,
// // //       name: newFeature.name,
// // //       level: 2,
// // //       parentId: componentId,
// // //       data: newFeature,
// // //     };

// // //     setTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.children && item.id === parentProductId
// // //           ? {
// // //               ...item,
// // //               children: item.children.map((child) =>
// // //                 child.id === componentId
// // //                   ? {
// // //                       ...child,
// // //                       children: [...(child.children || []), newFeatureItem],
// // //                     }
// // //                   : child
// // //               ),
// // //             }
// // //           : item
// // //       )
// // //     );

// // //     setAllTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.children && item.id === parentProductId
// // //           ? {
// // //               ...item,
// // //               children: item.children.map((child) =>
// // //                 child.id === componentId
// // //                   ? {
// // //                       ...child,
// // //                       children: [...(child.children || []), newFeatureItem],
// // //                     }
// // //                   : child
// // //               ),
// // //             }
// // //           : item
// // //       )
// // //     );

// // //     setExpandedItems((prev) => {
// // //       const updatedExpanded = { ...prev };
// // //       const parentProduct = allTableData.find((p) =>
// // //         p.children?.some((c) => c.id === componentId)
// // //       );
// // //       if (parentProduct) {
// // //         updatedExpanded[`product-${parentProduct.id}`] = true;
// // //         updatedExpanded[`component-${componentId}`] = true;
// // //       }
// // //       return updatedExpanded;
// // //     });

// // //     setIsCreateFeatureModalOpen(false);
// // //     setSelectedComponentIdForFeature(null);
// // //   }

// // //   async function fetchComponents(productId: string) {
// // //     try {
// // //       const { data: componentsData, error: componentsError } = await supabase
// // //         .from("components")
// // //         .select("*")
// // //         .eq("product_id", productId);

// // //       if (componentsError) throw componentsError;
// // //       return componentsData.map((component) => ({
// // //         type: "component" as const,
// // //         id: component.id,
// // //         name: component.name || "Component",
// // //         level: 1,
// // //         parentId: productId,
// // //         data: component,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching components:", error);
// // //       return [];
// // //     }
// // //   }

// // //   async function fetchFeatures(componentId: string) {
// // //     try {
// // //       const { data: featuresData, error: featuresError } = await supabase
// // //         .from("features")
// // //         .select("*")
// // //         .eq("component_id", componentId);

// // //       if (featuresError) throw featuresError;
// // //       return featuresData.map((feature) => ({
// // //         type: "feature" as const,
// // //         id: feature.id,
// // //         name: feature.name || "Feature",
// // //         level: 2,
// // //         parentId: componentId,
// // //         data: feature,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching features:", error);
// // //       return [];
// // //     }
// // //   }

// // //   const toggleExpand = async (
// // //     type: string,
// // //     id: string,
// // //     data: Product | Component
// // //   ) => {
// // //     const newExpandedState = !expandedItems[`${type}-${id}`];
// // //     setExpandedItems((prev) => ({
// // //       ...prev,
// // //       [`${type}-${id}`]: newExpandedState,
// // //     }));

// // //     if (newExpandedState) {
// // //       if (type === "product") {
// // //         const product = tableData.find((item) => item.id === id);
// // //         if (!product?.children || product.children.length === 0) {
// // //           const components = await fetchComponents(id);

// // //           setTableData((prevData) =>
// // //             prevData.map((item) =>
// // //               item.id === id ? { ...item, children: components } : item
// // //             )
// // //           );

// // //           setAllTableData((prevAllData) =>
// // //             prevAllData.map((item) =>
// // //               item.id === id ? { ...item, children: components } : item
// // //             )
// // //           );
// // //         }
// // //       } else if (type === "component") {
// // //         let componentFound = false;
// // //         let parentProductId = "";
        
// // //         // Find the parent product first
// // //         for (const product of tableData) {
// // //           if (product.children) {
// // //             const componentIndex = product.children.findIndex(
// // //               (comp) => comp.id === id
// // //             );
// // //             if (componentIndex >= 0) {
// // //               componentFound = true;
// // //               parentProductId = product.id;
// // //               break;
// // //             }
// // //           }
// // //         }

// // //         if (componentFound) {
// // //           const features = await fetchFeatures(id);

// // //           setTableData((prevData) =>
// // //             prevData.map((product) => {
// // //               if (product.id === parentProductId && product.children) {
// // //                 return {
// // //                   ...product,
// // //                   children: product.children.map((comp) =>
// // //                     comp.id === id ? { ...comp, children: features } : comp
// // //                   ),
// // //                 };
// // //               }
// // //               return product;
// // //             })
// // //           );

// // //           setAllTableData((prevData) =>
// // //             prevData.map((product) => {
// // //               if (product.id === parentProductId && product.children) {
// // //                 return {
// // //                   ...product,
// // //                   children: product.children.map((comp) =>
// // //                     comp.id === id ? { ...comp, children: features } : comp
// // //                   ),
// // //                 };
// // //               }
// // //               return product;
// // //             })
// // //           );
// // //         }
// // //       }
// // //     }
// // //   };

// // //   const isExpanded = (type: string, id: string) => {
// // //     return !!expandedItems[`${type}-${id}`];
// // //   };

// // //   const getFeatureColorClass = (index: number) => {
// // //     const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
// // //     return colors[index % colors.length];
// // //   };

// // //   const handleSaveNewProduct = () => {
// // //     if (newProductName.trim()) {
// // //       createNewProduct(newProductName.trim());
// // //     }
// // //   };

// // //   const handleCancelNewProduct = () => {
// // //     setCreatingProduct(false);
// // //     setNewProductName("");
// // //   };

// // //   const handleSaveNewComponent = (productId: string) => {
// // //     if (newComponentName.trim()) {
// // //       createNewInlineComponent(newComponentName.trim(), productId);
// // //     }
// // //   };

// // //   const handleCancelNewComponent = () => {
// // //     setCreatingComponentForProduct(null);
// // //     setNewComponentName("");
// // //   };

// // //   const renderItemActions = (item: TableItem) => {
// // //     if (item.level === 0) {
// // //       // Product
// // //       return (
// // //         <>
// // //           <div className="flex items-center gap-2 text-gray-800">
// // //             <div className="p-1 bg-white text-gray-400 rounded-md">
// // //               <svg
// // //                 height="16px"
// // //                 width="16px"
// // //                 viewBox="0 0 16 16"
// // //                 role="img"
// // //                 aria-label="ProductIcon"
// // //                 className="ui-icon"
// // //               >
// // //                 <path
// // //                   fill="currentColor"
// // //                   fillRule="evenodd"
// // //                   d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <span
// // //               className="text-[13px] text-gray-800 font-medium cursor-pointer"
// // //               onClick={() => handleProductSelection(item)}
// // //             >
// // //               {item.name}
// // //             </span>
// // //             <div className="flex items-center">
// // //               <Button
// // //                 variant="ghost"
// // //                 size="icon"
// // //                 className="h-5 w-5"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   handleCreateComponentClick(item.id);
// // //                 }}
// // //               >
// // //                 <Plus size={14} className="text-blue-600" />
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </>
// // //       );
// // //     } else if (item.level === 1) {
// // //       // Component
// // //       return (
// // //         <>
// // //           <div className="flex items-center gap-2 bg-[#cce4fc]">
// // //             <div className="p-1 bg-transparent text-gray-500 rounded-md">
// // //               <svg
// // //                 height="16px"
// // //                 width="16px"
// // //                 viewBox="0 0 16 16"
// // //                 role="img"
// // //                 aria-label="ComponentIcon"
// // //                 className="ui-icon"
// // //               >
// // //                 <rect
// // //                   x="2.5"
// // //                   y="2.5"
// // //                   width="4.5"
// // //                   height="4.5"
// // //                   rx="1"
// // //                   stroke="currentColor"
// // //                   strokeWidth="1.5"
// // //                   fill="none"
// // //                 />
// // //                 <rect
// // //                   x="9"
// // //                   y="2.5"
// // //                   width="4.5"
// // //                   height="4.5"
// // //                   rx="1"
// // //                   stroke="currentColor"
// // //                   strokeWidth="1.5"
// // //                   fill="none"
// // //                 />
// // //                 <rect
// // //                   x="2.5"
// // //                   y="9"
// // //                   width="4.5"
// // //                   height="4.5"
// // //                   rx="1"
// // //                   stroke="currentColor"
// // //                   strokeWidth="1.5"
// // //                   fill="none"
// // //                 />
// // //                 <rect
// // //                   x="9"
// // //                   y="9"
// // //                   width="4.5"
// // //                   height="4.5"
// // //                   rx="1"
// // //                   stroke="currentColor"
// // //                   strokeWidth="1.5"
// // //                   fill="none"
// // //                 />
// // //               </svg>
// // //             </div>
// // //             <span
// // //               className="text-[13px] font-medium cursor-pointer"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 handleComponentSelection(item);
// // //               }}
// // //             >
// // //               {item.name}
// // //             </span>
// // //             <div className="flex items-center">
// // //               <Button
// // //                 variant="ghost"
// // //                 size="icon"
// // //                 className="h-5 w-5"
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   handleCreateFeatureClick(item.id);
// // //                 }}
// // //               >
// // //                 <Plus size={14} className="text-blue-600" />
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </>
// // //       );
// // //     } else {
// // //       // Feature
// // //       const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
// // //       const colorIndex = parseInt(item.id.charAt(item.id.length - 1)) % colors.length;
// // //       const colorClass = colors[colorIndex];
      
// // //       return (
// // //         <div className="flex items-center gap-2">
// // //           <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>
// // //           <span
// // //             className="text-[13px] font-medium cursor-pointer"
// // //             onClick={(e) => {
// // //               e.stopPropagation();
// // //               handleFeatureSelection(item);
// // //             }}
// // //           >
// // //             {item.name}
// // //           </span>
// // //         </div>
// // //       );
// // //     }
// // //   };

// // //   const renderChildren = (children: TableItem[]) => {
// // //     return children.map((child) => (
// // //       <SortableItem
// // //         key={`${child.type}-${child.id}`}
// // //         item={child}
// // //         expandedItems={expandedItems}
// // //         toggleExpand={toggleExpand}
// // //         renderActions={renderItemActions}
// // //         renderChildren={renderChildren}
// // //         isExpanded={isExpanded}
// // //       />
// // //     ));
// // //   };

// // //   // Get all sortable item IDs for the DndContext
// // //   const getSortableItems = (data: TableItem[]): string[] => {
// // //     let ids: string[] = [];
    
// // //     data.forEach(item => {
// // //       ids.push(`${item.type}-${item.id}`);
      
// // //       if (item.children && isExpanded(item.type, item.id)) {
// // //         ids = [...ids, ...getSortableItems(item.children)];
// // //       }
// // //     });
    
// // //     return ids;
// // //   };

// // //   // Render the DnD overlay item
// // //   const renderDragOverlay = () => {
// // //     if (!activeDragItem) return null;
    
// // //     return (
// // //       <div className="opacity-80 pointer-events-none">
// // //         <div
// // //           className={`flex py-2 px-1 items-center ${
// // //             activeDragItem.level === 2 ? 'bg-[#fff]' : activeDragItem.level === 1 ? 'bg-[#cce4fc]' : ''
// // //           } border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// // //         >
// // //           <div
// // //             className={`${
// // //               activeDragItem.level === 2
// // //                 ? 'w-[563px] min-w-[433px] max-w-[433px]'
// // //                 : 'w-[436px] min-w-[435px] max-w-[435px]'
// // //             } flex items-center gap-2`}
// // //             style={{ paddingLeft: `${16 + activeDragItem.level * 16}px` }}
// // //           >
// // //             <div className="flex items-center gap-2 w-full">
// // //               <div className="cursor-grab">
// // //                 <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
// // //                   <path d="M2 4h12v2H2V4zm0 4h12v2H2V8zm0 4h12v2H2v-2z"/>
// // //                 </svg>
// // //               </div>
              
// // //               {activeDragItem.level < 2 && (
// // //                 <ChevronRight size={18} className="text-gray-500" />
// // //               )}
              
// // //               {renderItemActions(activeDragItem)}
// // //             </div>
// // //           </div>
          
// // //           <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {activeDragItem?.data?.status || "-"} 
// // //           </div>
// // //           <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {`${activeDragItem?.data?.progress}%` || "-"}
// // //           </div>
// // //           <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {activeDragItem?.data?.team || "-"}
// // //           </div>
// // //           <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {activeDragItem?.data?.days || "-"} 
// // //           </div>
// // //           <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //             {activeDragItem?.data?.startDate || ""}-{activeDragItem?.data?.targetDate || ""}
// // //           </div>
// // //           <div className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {activeDragItem.data.completedOn || "-"}
// // //           </div>
// // //           <div className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             <span>{activeDragItem.data.remarks || "-"}</span>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     );
// // //   };

// // //   if (isProductDetailOpen && selectedProduct) {
// // //     return (
// // //       <ProductDetailsPage
// // //         productId={selectedProduct.data}
// // //         onClose={handleCloseProductDetails}
// // //         onUpdate={handleProductUpdate}
// // //       />
// // //     );
// // //   }

// // //   if (isComponentDetailOpen && selectedComponent) {
// // //     return (
// // //       <ComponentDetailsPage
// // //         componentId={selectedComponent.data}
// // //         onClose={handleCloseComponentDetails} isOpen={false}      />
// // //     );
// // //   }

// // //   if (isFeatureDetailOpen && selectedFeature) {
// // //     return (
// // //       <FeatureDetailsPage
// // //         featureId={selectedFeature.data.id}
// // //         isOpen={isFeatureDetailOpen}
// // //         onClose={handleCloseFeatureDetails}
// // //       />
// // //     );
// // //   }

// // //   return (
// // //     <div className="relative">
// // //       <div className="sticky top-0 z-10 bg-white border-b-[0.5px] border-[rgb(212,219,225)]">
// // //         <div className="flex items-center justify-between py-2 px-4">
// // //           <div className="flex items-center gap-2">
// // //             <Button
// // //               size="sm"
// // //               variant="ghost"
// // //               className="flex items-center gap-1 text-blue-600"
// // //               onClick={() => router.push("/products")}
// // //             >
// // //               <ArrowLeft size={16} />
// // //               <span>Back</span>
// // //             </Button>
// // //             <h2 className="text-lg font-semibold">Products Roadmap</h2>
// // //           </div>
// // //           <div className="flex items-center gap-2">
// // //             <Button size="sm" variant="outline">
// // //               <Maximize2 size={16} className="mr-1" />
// // //               Expand All
// // //             </Button>
// // //             <Button
// // //               size="sm"
// // //               variant="default"
// // //               className="bg-blue-600 text-white"
// // //               onClick={handleCreateProductClick}
// // //             >
// // //               <Plus size={16} className="mr-1" />
// // //               Create Product
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <div className="overflow-auto border-[rgb(212,219,225)]">
// // //         <div className="sticky top-16 z-10 bg-[#f6f8fa] border-b-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           <div className="flex py-2 px-1">
// // //             <div className="w-[436px] min-w-[435px] max-w-[435px] px-4 text-[12px] text-gray-600 font-normal border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Products, Components, Features
// // //             </div>
// // //             <div className="w-[130px] flex justify-center text-center text-[12px] text-gray-600 font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Status
// // //             </div>
// // //             <div className="w-[120px] flex justify-center text-center text-[12px] text-gray-600 font-normal border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Progress
// // //             </div>
// // //             <div className="w-[144px] flex justify-center text-center text-[12px] text-gray-600 font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Team
// // //             </div>
// // //             <div className="w-[112px] flex justify-center text-center text-[12px] text-gray-600 font-normal border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Days
// // //             </div>
// // //             <div className="w-[180px] flex justify-center text-center text-[12px] text-gray-600 font-normal border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //               Target span
// // //             </div>
// // //             <div className="w-[170px] flex justify-center text-center text-[12px] text-gray-600 font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Completion Time
// // //             </div>
// // //             <div className="w-[300px] px-4 text-[12px] text-gray-600 font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Remarks
// // //             </div>
// // //           </div>
// // //         </div>

// // //         {loading ? (
// // //           <div className="flex justify-center items-center h-64">
// // //             <p>Loading...</p>
// // //           </div>
// // //         ) : (
// // //           <DndContext
// // //             sensors={sensors}
// // //             collisionDetection={closestCenter}
// // //             onDragStart={handleDragStart}
// // //             onDragEnd={handleDragEnd}
// // //           >
// // //             <SortableContext
// // //               items={getSortableItems(tableData)}
// // //               strategy={verticalListSortingStrategy}
// // //             >
// // //               {tableData.map((item) => (
// // //                 <SortableItem
// // //                   key={`${item.type}-${item.id}`}
// // //                   item={item}
// // //                   expandedItems={expandedItems}
// // //                   toggleExpand={toggleExpand}
// // //                   renderActions={renderItemActions}
// // //                   renderChildren={renderChildren}
// // //                   isExpanded={isExpanded}
// // //                 />
// // //               ))}
// // //             </SortableContext>
            
// // //             <DragOverlay>{activeId ? renderDragOverlay() : null}</DragOverlay>
// // //           </DndContext>
// // //         )}

// // //         {creatingProduct && (
// // //           <div className="flex border-b-[0.5px] border-dashed border-[rgb(212,219,225)] py-2 px-4">
// // //             <div className="flex items-center gap-2 w-full">
// // //               <Input
// // //                 placeholder="Enter product name..."
// // //                 value={newProductName}
// // //                 onChange={(e) => setNewProductName(e.target.value)}
// // //                 className="h-8 w-60"
// // //                 autoFocus
// // //               />
// // //               <Button
// // //                 size="sm"
// // //                 variant="default"
// // //                 className="h-8 bg-blue-600 text-white"
// // //                 onClick={handleSaveNewProduct}
// // //               >
// // //                 Save
// // //               </Button>
// // //               <Button
// // //                 size="sm"
// // //                 variant="ghost"
// // //                 className="h-8"
// // //                 onClick={handleCancelNewProduct}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         )}

// // //         {creatingComponentForProduct && (
// // //           <div className="flex border-b-[0.5px] border-dashed border-[rgb(212,219,225)] py-2 px-4 pl-16">
// // //             <div className="flex items-center gap-2 w-full">
// // //               <Input
// // //                 placeholder="Enter component name..."
// // //                 value={newComponentName}
// // //                 onChange={(e) => setNewComponentName(e.target.value)}
// // //                 className="h-8 w-60"
// // //                 autoFocus
// // //               />
// // //               <Button
// // //                 size="sm"
// // //                 variant="default"
// // //                 className="h-8 bg-blue-600 text-white"
// // //                 onClick={() =>
// // //                   handleSaveNewComponent(creatingComponentForProduct)
// // //                 }
// // //               >
// // //                 Save
// // //               </Button>
// // //               <Button
// // //                 size="sm"
// // //                 variant="ghost"
// // //                 className="h-8"
// // //                 onClick={handleCancelNewComponent}
// // //               >
// // //                 Cancel
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         )}
// // //       </div>

// // //       {isCreateComponentModalOpen && (
// // //         <CreateComponentModal
// // //           isOpen={isCreateComponentModalOpen}
// // //           onClose={() => {
// // //             setIsCreateComponentModalOpen(false);
// // //             setSelectedProductIdForComponent(null);
// // //           }}
// // //           onComponentCreated={(component) =>
// // //             createNewComponent(
// // //               component,
// // //               selectedProductIdForComponent as string
// // //             )
// // //           }
// // //           productId={selectedProductIdForComponent as string}
// // //         />
// // //       )}

// // //       {isCreateFeatureModalOpen && (
// // //         <CreateFeatureModal
// // //           isOpen={isCreateFeatureModalOpen}
// // //           onClose={() => {
// // //             setIsCreateFeatureModalOpen(false);
// // //             setSelectedComponentIdForFeature(null);
// // //           }}
// // //           onFeatureCreated={(feature) =>
// // //             createNewFeature(feature, selectedComponentIdForFeature as string)
// // //           }
// // //           componentId={selectedComponentIdForFeature as string}
// // //         />
// // //       )}
// // //     </div>
// // //   );
// // // // }
// // // "use client";



// // // import { useState, useEffect, useRef } from "react";
// // // import { supabase } from "@/lib/supabaseClient";
// // // import {
// // //   ArrowLeft,
// // //   ChevronDown,
// // //   ChevronRight,
// // //   Maximize2,
// // //   Plus,
// // // } from "lucide-react";
// // // import { Input } from "@/components/ui/input";
// // // import { Product, Component, Feature } from "@/app/types";
// // // import { Button } from "@/components/ui/button";
// // // import { useRouter } from "next/navigation";

// // // import  DndProvider from "react-dnd-html5-backend";
// // // import { HTML5Backend } from "react-dnd-html5-backend";

// // // import ProductDetailsPage from "./_components/productDetails";
// // // import ComponentDetailsPage from "./_components/componentDetails";
// // // import FeatureDetailsPage from "./_components/featureDetails";
// // // import { CreateFeatureModal } from "./_components/createFeatureModal";
// // // import { CreateComponentModal } from "./_components/createComponentModal";
// // // import { useDrop } from "react-dnd/dist/hooks";
// // // import { useDrag} from "react-dnd/dist/hooks";

// // // // Define item types for drag and drop
// // // const ItemTypes = {
// // //   FEATURE: "feature",
// // // };

// // // // Define the DragItem interface
// // // interface DragItem {
// // //   id: string;
// // //   type: string;
// // //   data: any;
// // // }

// // // interface TableItem {
// // //   type: "product" | "component" | "feature";
// // //   id: string;
// // //   name: string;
// // //   level: number;
// // //   data: Product | Component | Feature;
// // //   children?: TableItem[];
// // // }

// // // interface ProductTableProps {
// // //   selectedProductIds: string[];
// // // }



// // // interface DraggableFeatureProps {
// // //   feature: TableItem;
// // //   onDrop: (item: DragItem, componentId: string) => void;
// // //   getFeatureColorClass: (index: number) => string;
// // //   onFeatureSelection: (feature: TableItem) => void;
// // // }

// // // interface DroppableComponentProps {
// // //   component: TableItem;
// // //   children: React.ReactNode;
// // //   onDrop: (item: DragItem, componentId: string) => void;
// // //   isExpanded: (type: string, id: string) => boolean;
// // //   toggleExpand: (type: string, id: string, data: Product | Component) => void;
// // //   handleComponentSelection: (component: TableItem) => void;
// // //   handleCreateFeatureClick: (componentId: string) => void;
// // // }
// // // // Draggable Feature component
// // // const DraggableFeature: React.FC<DraggableFeatureProps> = ({
// // //   feature,
// // //   onFeatureSelection,
// // //   getFeatureColorClass,
// // // }) => {
// // //   const [{ isDragging }, drag] = useDrag(() => ({
// // //     type: ItemTypes.FEATURE,
// // //     item: { id: feature.id, type: "feature", data: feature.data },
// // //     collect: (monitor) => ({
// // //       isDragging: !!monitor.isDragging(),
// // //     }),
// // //   }));

// // //   return (
// // //     <div
// // //       ref={drag}
// // //       className={`flex items-center cursor-grab ${
// // //         isDragging ? "opacity-50" : "opacity-100"
// // //       }`}
// // //       onClick={(e) => {
// // //         e.stopPropagation();
// // //         onFeatureSelection(feature);
// // //       }}
// // //     >
// // //       <div className={`${feature.data.status=='Completed' && 'text-[#79ce17]'}  ${feature.data.status=='In Progress' && 'text-[#ffc600]'} ${feature.data.status=='Todo' && ''} ${(feature.data.status=='Todo' && (
// // //         new Date(feature.data.completedOn ?? new Date().toISOString()) > new Date(feature.data.startDate ?? new Date().toISOString())
// // //         ).toString() )&& 'text-[#ff4747]'} `}>
// // //         <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// // //         </svg>
// // //       </div>

// // //       <span className="cursor-pointer hover:text-blue-600 border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis">
// // //         {feature.name}
// // //       </span>
// // //     </div>
// // //   );
// // // };

// // // // Droppable Component area
// // // const DroppableComponent: React.FC<DroppableComponentProps> = ({
// // //   component,
// // //   children,
// // //   onDrop,
// // //   isExpanded,
// // //   toggleExpand,
// // //   handleComponentSelection,
// // //   handleCreateFeatureClick,
// // // }) => {
// // //   const [{ isOver, canDrop }, drop] = useDrop(() => ({
// // //     accept: ItemTypes.FEATURE,
// // //     drop: (item: DragItem) => onDrop(item, component.id),
// // //     collect: (monitor) => ({
// // //       isOver: !!monitor.isOver(),
// // //       canDrop: !!monitor.canDrop(),
// // //     }),
// // //   }));

// // //   return (
// // //     <div>
// // //       <div
// // //         className={`flex py-2 px-1 items-center bg-[#cce4fc] border-b-[0.5px] border-dashed border-[rgb(212,219,225)] ${
// // //           isOver && canDrop ? "bg-blue-100" : ""
// // //         }`}
// // //       >
// // //         <div
// // //           className="w-[436px] min-w-[435px] max-w-[435px] flex items-center gap-2"
// // //           style={{ paddingLeft: `${16 + component.level * 16}px` }}
// // //         >
// // //           <div
// // //             className="flex items-center gap-2 cursor-pointer w-full"
// // //             onClick={() => toggleExpand(component.type, component.id, component.data)}
// // //           >
// // //             {isExpanded(component.type, component.id) ? (
// // //               <ChevronDown size={18} className="text-gray-500" />
// // //             ) : (
// // //               <ChevronRight size={18} className="text-gray-500" />
// // //             )}
            
// // //             <div
// // //               className="flex items-center gap-2 cursor-pointer w-full text-gray-500 text-[14px]"
// // //               onClick={(e) => {
// // //                 e.stopPropagation();
// // //                 handleComponentSelection(component);
// // //               }}
// // //             >
// // //               <span className="p-1 bg-white text-gray-500 rounded-md">
// // //                 <svg
// // //                   width="16"
// // //                   height="16"
// // //                   viewBox="0 0 24 24"
// // //                   fill="none"
// // //                   stroke="currentColor"
// // //                   strokeWidth="2"
// // //                 >
// // //                   <rect x="3" y="3" width="7" height="7" rx="1" />
// // //                   <rect x="14" y="3" width="7" height="7" rx="1" />
// // //                   <rect x="3" y="14" width="7" height="7" rx="1" />
// // //                   <rect x="14" y="14" width="7" height="7" rx="1" />
// // //                 </svg>
// // //               </span>
              
// // //               <span
// // //                 className="cursor-pointer hover:text-blue-600 border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis"
// // //               >
// // //                 {component.name}
// // //               </span>
// // //             </div>
// // //           </div>
          
// // //           <button
// // //             onClick={(e) => {
// // //               e.stopPropagation();
// // //               handleCreateFeatureClick(component.id);
// // //             }}
// // //             className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // //           >
// // //             <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// // //           </button>
// // //         </div>
        
// // //         <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {component?.data?.status || "-"} 
// // //         </div>
// // //         <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {`${component?.data?.progress}%` || "-"}
// // //         </div>
// // //         <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {component?.data?.team || "-"}
// // //         </div>
// // //         <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //           {component?.data?.days || "-"} 
// // //         </div>
// // //         <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //           {component?.data?.startDate || ""}-{component?.data?.targetDate || ""}
// // //         </div>
// // //         <div
// // //           className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //         >
// // //           {component.data.completedOn || "-"}
// // //         </div>
// // //         <div
// // //           className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //         >
// // //           <span>{component.data.remarks || "-"}</span>
// // //         </div>
// // //       </div>
      
// // //       <div ref={drop} className={`${isOver ? "bg-blue-50" : ""}`}>
// // //         {children}
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default function ProductTable({
// // //   selectedProductIds,
// // // }: ProductTableProps) {
// // //   const [allTableData, setAllTableData] = useState<TableItem[]>([]);
// // //   const [tableData, setTableData] = useState<TableItem[]>([]);
// // //   const [loading, setLoading] = useState(true);
// // //   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
// // //     {}
// // //   );
// // //   const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] =
// // //     useState(false);
// // //   const [selectedProductIdForComponent, setSelectedProductIdForComponent] =
// // //     useState<string | null>(null);
// // //   const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] =
// // //     useState(false);
// // //   const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] =
// // //     useState<string | null>(null);
// // //   const router = useRouter();
// // //   const [creatingProduct, setCreatingProduct] = useState(false);
// // //   const [newProductName, setNewProductName] = useState("");
// // //   const [creatingComponentForProduct, setCreatingComponentForProduct] =
// // //     useState<string | null>(null);
// // //   const [newComponentName, setNewComponentName] = useState("");
// // //   const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(
// // //     null
// // //   );
// // //   const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
// // //   const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(
// // //     null
// // //   );
// // //   const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
// // //   const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(
// // //     null
// // //   );
// // //   const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

// // //   useEffect(() => {
// // //     fetchProducts();
// // //   }, []);

// // //   useEffect(() => {
// // //     if (selectedProductIds.length > 0) {
// // //       const filteredData = allTableData.filter(
// // //         (item) =>
// // //           item.type === "product" && selectedProductIds.includes(item.id)
// // //       );
// // //       setTableData(filteredData);
// // //     } else {
// // //       setTableData(allTableData);
// // //     }
// // //   }, [selectedProductIds, allTableData]);

// // //   // Handle dropping a feature onto a component
// // //   const handleFeatureDrop = async (draggedItem: DragItem, targetComponentId: string) => {
// // //     if (draggedItem.type !== "feature") return;
    
// // //     const featureId = draggedItem.id;
// // //     const sourceComponentId = draggedItem.data.component_id;
    
// // //     // Don't do anything if dropped on the same component
// // //     if (sourceComponentId === targetComponentId) return;
    
// // //     try {
// // //       // Update the feature in the database
// // //       const response = await fetch(`/api/feature/${featureId}`, {
// // //         method: 'PUT',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify({
// // //           component_id: targetComponentId
// // //         }),
// // //       });
      
// // //       if (!response.ok) throw new Error('Failed to update feature');
      
// // //       // Update the local state
// // //       const updatedAllTableData = moveFeatureInTableData(
// // //         allTableData,
// // //         featureId,
// // //         sourceComponentId,
// // //         targetComponentId
// // //       );
      
// // //       setAllTableData(updatedAllTableData);
      
// // //       const updatedTableData = moveFeatureInTableData(
// // //         tableData,
// // //         featureId, 
// // //         sourceComponentId,
// // //         targetComponentId
// // //       );
      
// // //       setTableData(updatedTableData);
      
// // //       // Ensure the target component is expanded to show the newly added feature
// // //       setExpandedItems((prev) => ({
// // //         ...prev,
// // //         [`component-${targetComponentId}`]: true,
// // //       }));
      
// // //     } catch (error) {
// // //       console.error('Error moving feature:', error);
// // //     }
// // //   };

// // //   // Helper function to move a feature between components in the data structure
// // //   const moveFeatureInTableData = (
// // //     data: TableItem[],
// // //     featureId: string,
// // //     sourceComponentId: string,
// // //     targetComponentId: string
// // //   ): TableItem[] => {
// // //     // First, find the feature and remove it from the source component
// // //     let featureToMove: TableItem | null = null;
    
// // //     const dataWithoutFeature = data.map(product => {
// // //       if (!product.children) return product;
      
// // //       const updatedChildren = product.children.map(component => {
// // //         if (component.id !== sourceComponentId || !component.children) {
// // //           return component;
// // //         }
        
// // //         // Find the feature and remove it from this component
// // //         const featureIndex = component.children.findIndex(f => f.id === featureId);
// // //         if (featureIndex >= 0) {
// // //           featureToMove = component.children[featureIndex];
// // //           return {
// // //             ...component,
// // //             children: component.children.filter(f => f.id !== featureId)
// // //           };
// // //         }
        
// // //         return component;
// // //       });
      
// // //       return { ...product, children: updatedChildren };
// // //     });
    
// // //     // If we didn't find the feature, return the original data
// // //     if (!featureToMove) return data;
    
// // //     // Now add the feature to the target component
// // //     const updatedData = dataWithoutFeature.map(product => {
// // //       if (!product.children) return product;
      
// // //       const updatedChildren = product.children.map(component => {
// // //         if (component.id !== targetComponentId) {
// // //           return component;
// // //         }
        
// // //         // Add the feature to this component
// // //         return {
// // //           ...component,
// // //           children: [
// // //             ...(component.children || []),
// // //             {
// // //               ...featureToMove,
// // //               data: {
// // //                 ...(featureToMove?.data || {}),
// // //                 component_id: targetComponentId
// // //               }
// // //             }
// // //           ]
// // //         };
// // //       });
      
// // //       return { ...product, children: updatedChildren };
// // //     });
    
// // //     return updatedData as TableItem[];
// // //   };

// // //   const handleProductUpdate = (updatedProduct: Product) => {
// // //     setTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.id === updatedProduct.id
// // //           ? { ...item, data: updatedProduct }
// // //           : item
// // //       )
// // //     );
// // //     setAllTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.id === updatedProduct.id
// // //           ? { ...item, data: updatedProduct }
// // //           : item
// // //       )
// // //     );
// // //   };

// // //   const handleCreateProductClick = () => {
// // //     setCreatingProduct(true);
// // //   };

// // //   const handleProductSelection = (product: TableItem) => {
// // //     setSelectedProduct(product);
// // //     setIsProductDetailOpen(true);
// // //   };

// // //   const handleComponentSelection = (component: TableItem) => {
// // //     setSelectedComponent(component);
// // //     setIsComponentDetailOpen(true);
// // //   };

// // //   const handleFeatureSelection = (feature: TableItem) => {
// // //     setSelectedFeature(feature);
// // //     setIsFeatureDetailOpen(true);
// // //   };

// // //   const handleCloseProductDetails = () => {
// // //     setIsProductDetailOpen(false);
// // //   };

// // //   const handleCloseComponentDetails = () => {
// // //     setIsComponentDetailOpen(false);
// // //   };

// // //   const handleCloseFeatureDetails = () => {
// // //     setIsFeatureDetailOpen(false);
// // //   };

// // //   const handleCreateComponentClick = (productId: string) => {
// // //     setSelectedProductIdForComponent(productId);
// // //     setIsCreateComponentModalOpen(true);
// // //   };

// // //   const handleCreateFeatureClick = (componentId: string) => {
// // //     setSelectedComponentIdForFeature(componentId);
// // //     setIsCreateFeatureModalOpen(true);
// // //   };

// // //   async function fetchProducts() {
// // //     try {
// // //       setLoading(true);
// // //       const { data: productsData, error: productsError } = await supabase
// // //         .from("products")
// // //         .select("*")
// // //         .neq("name", "Sample Product 1");
// // //       if (productsError) throw productsError;
// // //       const initialTableData: TableItem[] = productsData.map((product) => ({
// // //         type: "product" as const,
// // //         id: product.id,
// // //         name: product.name || "Product",
// // //         level: 0,
// // //         data: product,
// // //       }));
// // //       setAllTableData(initialTableData);
// // //       setTableData(initialTableData);
// // //     } catch (error) {
// // //       console.error("Error fetching products:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   async function createNewProduct(name: string) {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("products")
// // //         .insert([{ name }])
// // //         .select();
// // //       if (error) throw error;
// // //       if (data && data.length > 0) {
// // //         const newProduct = data[0];
// // //         const newProductItem: TableItem = {
// // //           type: "product",
// // //           id: newProduct.id,
// // //           name: newProduct.name,
// // //           level: 0,
// // //           data: newProduct,
// // //         };
// // //         setAllTableData((prevData) => [...prevData, newProductItem]);
// // //         setTableData((prevData) => [...prevData, newProductItem]);
// // //         setCreatingProduct(false);
// // //         setNewProductName("");
// // //       }
// // //     } catch (error) {
// // //       console.error("Error creating product:", error);
// // //     }
// // //   }

// // //   async function createNewComponent(newComponent: any, productId: string) {
// // //     try {
// // //       const newComponentItem: TableItem = {
// // //         type: "component",
// // //         id: newComponent.id,
// // //         name: newComponent.name,
// // //         level: 1,
// // //         data: newComponent,
// // //       };

// // //       setTableData((prevData) =>
// // //         prevData.map((item) =>
// // //           item.id === productId
// // //             ? {
// // //                 ...item,
// // //                 children: [...(item.children || []), newComponentItem],
// // //               }
// // //             : item
// // //         )
// // //       );

// // //       setAllTableData((prevData) =>
// // //         prevData.map((item) =>
// // //           item.id === productId
// // //             ? {
// // //                 ...item,
// // //                 children: [...(item.children || []), newComponentItem],
// // //               }
// // //             : item
// // //         )
// // //       );

// // //       setExpandedItems((prev) => ({
// // //         ...prev,
// // //         [`product-${productId}`]: true,
// // //       }));

// // //       setCreatingComponentForProduct(null);
// // //       setNewComponentName("");
// // //     } catch (error) {
// // //       console.error("Error handling component creation:", error);
// // //     }
// // //   }

// // //   async function createNewInlineComponent(name: string, productId: string) {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("components")
// // //         .insert([{ name, product_id: productId }])
// // //         .select();

// // //       if (error) throw error;

// // //       if (data && data.length > 0) {
// // //         const newComponent = data[0];
// // //         createNewComponent(newComponent, productId);
// // //       }
// // //     } catch (error) {
// // //       console.error("Error creating component:", error);
// // //     }
// // //   }

// // //   async function createNewFeature(newFeature: any, componentId: string) {
// // //     const newFeatureItem: TableItem = {
// // //       type: "feature",
// // //       id: newFeature.id,
// // //       name: newFeature.name,
// // //       level: 2,
// // //       data: newFeature,
// // //     };

// // //     setTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.children
// // //           ? {
// // //               ...item,
// // //               children: item.children.map((child) =>
// // //                 child.id === componentId
// // //                   ? {
// // //                       ...child,
// // //                       children: [...(child.children || []), newFeatureItem],
// // //                     }
// // //                   : child
// // //               ),
// // //             }
// // //           : item
// // //       )
// // //     );

// // //     setAllTableData((prevData) =>
// // //       prevData.map((item) =>
// // //         item.type === "product" && item.children
// // //           ? {
// // //               ...item,
// // //               children: item.children.map((child) =>
// // //                 child.id === componentId
// // //                   ? {
// // //                       ...child,
// // //                       children: [...(child.children || []), newFeatureItem],
// // //                     }
// // //                   : child
// // //               ),
// // //             }
// // //           : item
// // //       )
// // //     );

// // //     setExpandedItems((prev) => {
// // //       const updatedExpanded = { ...prev };
// // //       const parentProduct = allTableData.find((p) =>
// // //         p.children?.some((c) => c.id === componentId)
// // //       );
// // //       if (parentProduct) {
// // //         updatedExpanded[`product-${parentProduct.id}`] = true;
// // //         updatedExpanded[`component-${componentId}`] = true;
// // //       }
// // //       return updatedExpanded;
// // //     });

// // //     setIsCreateFeatureModalOpen(false);
// // //     setSelectedComponentIdForFeature(null);
// // //   }

// // //   async function fetchComponents(productId: string) {
// // //     try {
// // //       const { data: componentsData, error: componentsError } = await supabase
// // //         .from("components")
// // //         .select("*")
// // //         .eq("product_id", productId);

// // //       if (componentsError) throw componentsError;
// // //       return componentsData.map((component) => ({
// // //         type: "component" as const,
// // //         id: component.id,
// // //         name: component.name || "Component",
// // //         level: 1,
// // //         data: component,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching components:", error);
// // //       return [];
// // //     }
// // //   }

// // //   async function fetchFeatures(componentId: string) {
// // //     try {
// // //       const { data: featuresData, error: featuresError } = await supabase
// // //         .from("features")
// // //         .select("*")
// // //         .eq("component_id", componentId);

// // //       if (featuresError) throw featuresError;
// // //       return featuresData.map((feature) => ({
// // //         type: "feature" as const,
// // //         id: feature.id,
// // //         name: feature.name || "Feature",
// // //         level: 2,
// // //         data: feature,
// // //       }));
// // //     } catch (error) {
// // //       console.error("Error fetching features:", error);
// // //       return [];
// // //     }
// // //   }

// // //   const toggleExpand = async (
// // //     type: string,
// // //     id: string,
// // //     data: Product | Component
// // //   ) => {
// // //     const newExpandedState = !expandedItems[`${type}-${id}`];
// // //     setExpandedItems((prev) => ({
// // //       ...prev,
// // //       [`${type}-${id}`]: newExpandedState,
// // //     }));

// // //     if (newExpandedState) {
// // //       if (type === "product") {
// // //         const product = tableData.find((item) => item.id === id);
// // //         if (!product?.children || product.children.length === 0) {
// // //           const components = await fetchComponents(id);

// // //           setTableData((prevData) =>
// // //             prevData.map((item) =>
// // //               item.id === id ? { ...item, children: components } : item
// // //             )
// // //           );

// // //           setAllTableData((prevAllData) =>
// // //             prevAllData.map((item) =>
// // //               item.id === id ? { ...item, children: components } : item
// // //             )
// // //           );
// // //         }
// // //       } else if (type === "component") {
// // //         let componentFound = false;
// // //         const updatedTableData = tableData.map((product) => {
// // //           if (product.children) {
// // //             const componentIndex = product.children.findIndex(
// // //               (comp) => comp.id === id
// // //             );
// // //             if (componentIndex >= 0) {
// // //               componentFound = true;
// // //               if (!product.children[componentIndex].children) {
// // //                 return {
// // //                   ...product,
// // //                   children: product.children.map(async (comp, i) => {
// // //                     if (i === componentIndex) {
// // //                       const features = await fetchFeatures(id);
// // //                       return { ...comp, children: features };
// // //                     }
// // //                     return comp;
// // //                   }),
// // //                 };
// // //               }
// // //             }
// // //           }
// // //           return product;
// // //         });

// // //         if (componentFound) {
// // //           const features = await fetchFeatures(id);

// // //           setTableData((prevData) =>
// // //             prevData.map((product) => {
// // //               if (product.children) {
// // //                 return {
// // //                   ...product,
// // //                   children: product.children.map((comp) =>
// // //                     comp.id === id ? { ...comp, children: features } : comp
// // //                   ),
// // //                 };
// // //               }
// // //               return product;
// // //             })
// // //           );

// // //           setAllTableData((prevData) =>
// // //             prevData.map((product) => {
// // //               if (product.children) {
// // //                 return {
// // //                   ...product,
// // //                   children: product.children.map((comp) =>
// // //                     comp.id === id ? { ...comp, children: features } : comp
// // //                   ),
// // //                 };
// // //               }
// // //               return product;
// // //             })
// // //           );
// // //         }
// // //       }
// // //     }
// // //   };

// // //   const isExpanded = (type: string, id: string) => {
// // //     return !!expandedItems[`${type}-${id}`];
// // //   };

// // //   const getFeatureColorClass = (index: number) => {
// // //     const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
// // //     return colors[index % colors.length];
// // //   };

// // //   const handleSaveNewProduct = () => {
// // //     if (newProductName.trim()) {
// // //       createNewProduct(newProductName.trim());
// // //     }
// // //   };

// // //   const handleCancelNewProduct = () => {
// // //     setCreatingProduct(false);
// // //     setNewProductName("");
// // //   };

// // //   const handleSaveNewComponent = (productId: string) => {
// // //     if (newComponentName.trim()) {
// // //       createNewInlineComponent(newComponentName.trim(), productId);
// // //     }
// // //   };

// // //   const handleCancelNewComponent = () => {
// // //     setCreatingComponentForProduct(null);
// // //     setNewComponentName("");
// // //   };

// // //   const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
// // //     return children.map((child) => {
// // //       if (child.type === "component") {
// // //         return (
// // //           <DroppableComponent
// // //             key={child.id}
// // //             component={child}
// // //             onDrop={handleFeatureDrop}
// // //             isExpanded={isExpanded}
// // //             toggleExpand={toggleExpand}
// // //             handleComponentSelection={handleComponentSelection}
// // //             handleCreateFeatureClick={handleCreateFeatureClick}
// // //           >
// // //             {child.children && isExpanded(child.type, child.id) && (
// // //               <div>
// // //                 {child.children.map((feature) => (
// // //                   <div 
// // //                     key={feature.id}
// // //                     className="flex py-2 px-1 items-center bg-[#fff] border-b-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //                   >
// // //                     <div 
// // //                       className="w-[563px] min-w-[433px] max-w-[433px] flex items-center gap-2"
// // //                       style={{ paddingLeft: `${16 + feature.level * 16}px` }}
// // //                     >
// // //                       <DraggableFeature 
// // //                         feature={feature}
// // //                         onFeatureSelection={handleFeatureSelection}
// // //                         getFeatureColorClass={getFeatureColorClass} onDrop={function (item: DragItem, componentId: string): void {
// // //                           throw new Error("Function not implemented.");
// // //                         } }                      />
// // //                     </div>
// // //                     <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                       {feature?.data?.status || "-"} 
// // //                     </div>
// // //                     <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                       {`${feature?.data?.progress}%` || "-"}
// // //                     </div>
// // //                     <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                       {feature?.data?.team || "-"}
// // //                     </div>
// // //                     <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                       {feature?.data?.days || "-"} 
// // //                     </div>
// // //                     <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //                       {feature?.data?.startDate || ""}-{feature?.data?.targetDate || ""}
// // //                     </div>
// // //                     <div
// // //                       className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //                     >
// // //                       {feature.data.completedOn || "-"}
// // //                     </div>
// // //                     <div
// // //                       className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //                     >
// // //                       <span>{feature.data.remarks || "-"}</span>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}
// // //           </DroppableComponent>
// // //         );
// // //       } else {
// // //         return (
// // //           <div key={child.id}>
// // //             <div
// // //               className={`flex py-2 px-1 items-center ${child.level === 2 ? 'bg-[#fff]' : 'bg-[#cce4fc]'} border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// // //             >
// // //               <div
// // //                 className={`${child.level === 2 ? 'w-[563px] min-w-[433px] max-w-[433px]' : 'w-[436px] min-w-[435px] max-w-[435px]'} flex items-center gap-2`}
// // //                 style={{ paddingLeft: `${16 + child.level * 16}px` }}
// // //               >
// // //                 <div
// // //                   className="flex items-center gap-2 cursor-pointer w-full"
// // //                   onClick={() => {
// // //                     if (child.type === "product" || child.type === "component") {
// // //                       toggleExpand(child.type, child.id, child.data);
// // //                     }
// // //                   }}
// // //                 >
// // //                   {child.level < 2 &&
// // //                     (isExpanded(child.type, child.id) ? (
// // //                       <ChevronDown size={18} className="text-gray-500" />
// // //                     ) : (
// // //                       <ChevronRight size={18} className="text-gray-500" />
// // //                     ))}
                    
// // //                   <div
// // //                     className={`flex items-center gap-2 cursor-pointer w-full ${
// // //                       (child.type as string) === "component" || (child.type as string) === "feature"
// // //                         ? "text-gray-500 text-[14px]"
// // //                         : ""
// // //                     }`}
// // //                     onClick={(e) => {
// // //                       if (child.type === "component") {
// // //                         e.stopPropagation();
// // //                         handleComponentSelection(child);
// // //                       } else if (child.type === "feature") {
// // //                         e.stopPropagation();
// // //                         handleFeatureSelection(child);
// // //                       }
// // //                     }}
// // //                   >
// // //                     {child.level === 1 && (
// // //                       <span className="p-1 bg-white text-gray-500 rounded-md">
// // //                         <svg
// // //                           width="16"
// // //                           height="16"
// // //                           viewBox="0 0 24 24"
// // //                           fill="none"
// // //                           stroke="currentColor"
// // //                           strokeWidth="2"
// // //                         >
// // //                           <rect x="3" y="3" width="7" height="7" rx="1" />
// // //                           <rect x="14" y="3" width="7" height="7" rx="1" />
// // //                           <rect x="3" y="14" width="7" height="7" rx="1" />
// // //                           <rect x="14" y="14" width="7" height="7" rx="1" />
// // //                         </svg>
// // //                       </span>
// // //                     )}
                    
// // //                     {child.level === 2 && (
// // //                       <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'} ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// // //                         new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// // //                         ).toString() )&& 'text-[#ff4747]'}`}>
// // //                         <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path></svg>
// // //                       </div>
// // //                     )}
                    
// // //                     <span
// // //                       className={`cursor-pointer ${
// // //                         (child.type as string) === "component"
// // //                           ? "hover:text-blue-600"
// // //                           : child.type === "feature"
// // //                           ? "hover:text-blue-600"
// // //                           : ""
// // //                       } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
// // //                     >
// // //                       {child.name}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //                 {child.level === 1 && (
// // //                   <button
// // //                     onClick={(e) => {
// // //                       e.stopPropagation();
// // //                       handleCreateFeatureClick(child.id);
// // //                     }}
// // //                     className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // //                   >
// // //                     <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// // //                   </button>
// // //                 )}
// // //               </div>
              
// // //               <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 {child?.data?.status || "-"} 
// // //               </div>
// // //               <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 {`${child?.data?.progress}%` || "-"}
// // //               </div>
// // //               <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 {child?.data?.team || "-"}
// // //               </div>
// // //               <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 {child?.data?.days || "-"} 
// // //               </div>
// // //               <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //                 {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
// // //               </div>
// // //               <div
// // //                 className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //               >
// // //                 {child.data.completedOn || "-"}
// // //               </div>
// // //               <div
// // //                 className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
// // //               >
// // //                 <span>{child.data.remarks || "-"}</span>
// // //               </div>
// // //             </div>
            
// // //             {child.children &&
// // //               isExpanded(child.type, child.id) &&
// // //               renderChildren(child.children)}

// // //             {child.level === 1 &&
// // //               creatingComponentForProduct === `AFTER_${child.id}` && (
// // //                 <div
// // //                   className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
// // //                   style={{ paddingLeft: `${16 + child.level * 16}px` }}
// // //                 >
// // //                   <div className="w-[600px] flex items-center gap-2">
// // //                     <Input
// // //                       type="text"
// // //                       placeholder="Enter component name"
// // //                       value={newComponentName}
// // //                       onChange={(e) => setNewComponentName(e.target.value)}
// // //                       className="w-48"
// // //                     />
// // //                     <Button
// // //                       size="sm"
// // //                       onClick={() => {
// // //                         const productId = tableData.find((p) =>
// // //                           p.children?.some((c) => c.id === child.id)
// // //                         )?.id;
// // //                         if (productId) {
// // //                           handleSaveNewComponent(productId);
// // //                         }
// // //                       }}
// // //                     >
// // //                       Save
// // //                     </Button>
// // //                     <Button
// // //                       size="sm"
// // //                       variant="outline"
// // //                       onClick={handleCancelNewComponent}
// // //                     >
// // //                       Cancel
// // //                     </Button>
// // //                   </div>
// // //                 </div>
// // //               )}
// // //           </div>
// // //         );
// // //       }
// // //     });
// // //   };

// // //   if (loading) {
// // //     return <div className="flex justify-center p-10">Loading products...</div>;
// // //   }

// // //   return (
// // //     <DndProvider backend={HTML5Backend}>
// // //       <div className="w-full flex">
// // //         <div className="w-full transition-all duration-300">
// // //           <CreateFeatureModal
// // //             isOpen={isCreateFeatureModalOpen}
// // //             onClose={() => setIsCreateFeatureModalOpen(false)}
// // //             componentId={selectedComponentIdForFeature}
// // //             onFeatureCreated={createNewFeature}
// // //           />

// // //           <CreateComponentModal
// // //             isOpen={isCreateComponentModalOpen}
// // //             onClose={() => setIsCreateComponentModalOpen(false)}
// // //             productId={selectedProductIdForComponent}
// // //             onComponentCreated={createNewComponent}
// // //           />

// // //           {selectedProduct && (
// // //             <ProductDetailsPage
// // //               productId={selectedProduct.data.id}
// // //               isOpen={isProductDetailOpen}
// // //               onClose={handleCloseProductDetails}
// // //               onProductUpdated={handleProductUpdate}
// // //             />
// // //           )}

// // //           {selectedComponent && (
// // //             <ComponentDetailsPage
// // //               componentId={selectedComponent.data.id}
// // //               isOpen={isComponentDetailOpen}
// // //               onClose={handleCloseComponentDetails}
// // //             />
// // //           )}

// // //           {selectedFeature && (
// // //             <FeatureDetailsPage
// // //               featureId={selectedFeature.data.id}
// // //               isOpen={isFeatureDetailOpen}
// // //               onClose={handleCloseFeatureDetails}
// // //             />
// // //           )}

// // //           <div className="bg-gray-100 border-b px-5">
// // //             <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4">
// // //               <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 Products, Components, Features
// // //               </div>
// // //               <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 Status
// // //               </div>
// // //               <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 Progress
// // //               </div>
// // //               <div className="w-[100px] flex justify-center text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <div className="flex-row flex">
// // //                   <img className="w-[16px] h-[16px] mr-1" src="/person.svg" alt="Person" />Team
// // //                 </div>
// // //               </div>
// // //               <div className="w-[72px] flex text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1" alt="File" /> Days
// // //               </div>
// // //               <div className="w-[144px] flex justify-center text-center text-[13px] font-bold flex-row border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg" alt="Clock" /> Target span
// // //               </div>
// // //               <div className="w-[144px] justify-center text-center text-[13px] font-bold flex-row flex whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File" /> Completion Time
// // //               </div>
// // //               <div className="w-[100px] text-center text-[13px] font-bold flex-row flex border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File" /> Remarks
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="divide-y bg-white px-6">
// // //             {tableData.map((item) => (
// // //               <div key={item.id}>
// // //                 <div
// // //                   className={`flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
// // //                     selectedProduct?.id === item.id ? "bg-blue-50" : ""
// // //                   }`}
// // //                   style={{ paddingLeft: `${16 + item.level * 16}px` }}
// // //                 >
// // //                   <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2">
// // //                     <div
// // //                       className="flex items-center gap-2 cursor-pointer w-full"
// // //                       onClick={() => toggleExpand(item.type, item.id, item.data)}
// // //                     >
// // //                       {item.level < 2 &&
// // //                         (isExpanded(item.type, item.id) ? (
// // //                           <ChevronDown size={18} className="text-gray-500" />
// // //                         ) : (
// // //                           <ChevronRight size={18} className="text-gray-500" />
// // //                         ))}

// // //                       <div className="flex items-center gap-2 text-gray-800 bg-white">
// // //                         {item.level === 0 && (
// // //                           <div className="p-1 bg-white text-gray-400 rounded-md">
// // //                             <svg
// // //                               height="16px"
// // //                               width="16px"
// // //                               viewBox="0 0 16 16"
// // //                               role="img"
// // //                               aria-label="ProductIcon"
// // //                               className="sc-fQpRED cOkelz ui-icon"
// // //                             >
// // //                               <path
// // //                                 fill="currentColor"
// // //                                 fillRule="evenodd"
// // //                                 d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// // //                                 clipRule="evenodd"
// // //                               ></path>
// // //                             </svg>
// // //                           </div>
// // //                         )}
// // //                         <span
// // //                           className={`cursor-pointer ${
// // //                             item.type === "product" ? "hover:text-blue-600" : ""
// // //                           } text-gray-700 text-[16px]`}
// // //                           onClick={(e) => {
// // //                             if (item.type === "product") {
// // //                               e.stopPropagation();
// // //                               handleProductSelection(item);
// // //                             }
// // //                           }}
// // //                         >
// // //                           {item.name}
// // //                         </span>
// // //                       </div>
// // //                     </div>

// // //                     {item.level === 0 && (
// // //                       <button
// // //                         onClick={(e) => {
// // //                           e.stopPropagation();
// // //                           handleCreateComponentClick(item.id);
// // //                         }}
// // //                         className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // //                       >
// // //                         <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// // //                       </button>
// // //                     )}
// // //                     {creatingComponentForProduct === item.id && (
// // //                       <>
// // //                         <Input
// // //                           type="text"
// // //                           placeholder="Enter component name"
// // //                           value={newComponentName}
// // //                           onChange={(e) => setNewComponentName(e.target.value)}
// // //                           className="ml-2 w-48"
// // //                         />
// // //                         <Button
// // //                           size="sm"
// // //                           onClick={() => handleSaveNewComponent(item.id)}
// // //                         >
// // //                           Save
// // //                         </Button>
// // //                         <Button
// // //                           size="sm"
// // //                           variant="outline"
// // //                           onClick={handleCancelNewComponent}
// // //                         >
// // //                           Cancel
// // //                         </Button>
// // //                       </>
// // //                     )}
// // //                   </div>

// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
// // //                     {item.data.status || ""}
// // //                   </div>
// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                     {item.data.progress !== undefined
// // //                       ? `${item.data.progress}%`
// // //                       : ""}
// // //                   </div>
// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                     {item.data.team || ""}
// // //                   </div>
// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                     {item.data.days !== undefined ? item.data.days : ""}
// // //                   </div>
// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                     {item.data.startDate || ""}-{item.data.targetDate || ""}
// // //                   </div>
// // //                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                     {item.data.completedOn || ""}
// // //                   </div>
// // //                   <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
// // //                     <span>{item.data.remarks || ""}</span>
// // //                   </div>
// // //                 </div>
// // //                 {item.children &&
// // //                   isExpanded(item.type, item.id) &&
// // //                   renderChildren(item.children)}
// // //               </div>
// // //             ))}
// // //           </div>

// // //           <div className="mt-2 bg-gray-100 px-6">
// // //             {creatingProduct ? (
// // //               <div className="flex py-2 items-center hover:bg-gray-50">
// // //                 <div className="w-[600px] flex items-center gap-2">
// // //                   <Input
// // //                     type="text"
// // //                     placeholder="Enter product name"
// // //                     value={newProductName}
// // //                     onChange={(e) => setNewProductName(e.target.value)}
// // //                   />
// // //                   <Button size="sm" onClick={handleSaveNewProduct}>
// // //                     Save
// // //                   </Button>
// // //                   <Button
// // //                     size="sm"
// // //                     variant="outline"
// // //                     onClick={handleCancelNewProduct}
// // //                   >
// // //                     Cancel
// // //                   </Button>
// // //                 </div>
// // //               </div>
// // //             ) : (
// // //               <div className="bg-white-200 px-5">
// // //                 <Button onClick={handleCreateProductClick}>
// // //                   <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add" />
// // //                   Create Product
// // //                 </Button>
// // //               </div>
// // //             )}
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </DndProvider>
// // //   );
// // // }




// "use client";

// import { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabaseClient";
// import {
//   ArrowLeft,
//   ChevronDown,
//   ChevronRight,
//   Maximize2,
//   Plus,
// } from "lucide-react";
// import { 
//   DndContext, 
//   DragEndEvent, 
//   PointerSensor, 
//   MouseSensor, 
//   TouchSensor, 
//   KeyboardSensor,
//   useSensor, 
//   useSensors,
//   closestCenter
// } from "@dnd-kit/core";
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
// import { Input } from "@/components/ui/input";
// import { Product, Component, Feature } from "@/app/types";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// // import { toast } from "@/components/ui/use-toast";
// import { DroppableComponent } from "./_components/draggablecomponent";

// import ProductDetailsPage from "./_components/productDetails";
// import ComponentDetailsPage from "./_components/componentDetails";
// import FeatureDetailsPage from "./_components/featureDetails";
// import { CreateFeatureModal } from "./_components/createFeatureModal";
// import { CreateComponentModal } from "./_components/createComponentModal";
// import { toast } from "@/app/hooks/use-toast";

// interface TableItem {
//   type: "product" | "component" | "feature";
//   id: string;
//   name: string;
//   level: number;
//   data: Product | Component | Feature;
//   children?: TableItem[];
// }

// interface ProductTableProps {
//   selectedProductIds: string[];
// }

// export default function ProductTable({
//   selectedProductIds,
// }: ProductTableProps) {
//   // ... keep existing code (state declarations and initial hooks)
//   const [allTableData, setAllTableData] = useState<TableItem[]>([]);
//   const [tableData, setTableData] = useState<TableItem[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
//     {}
//   );
//   const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] =
//     useState(false);
//   const [selectedProductIdForComponent, setSelectedProductIdForComponent] =
//     useState<string | null>(null);
//   const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] =
//     useState(false);
//   const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] =
//     useState<string | null>(null);
//   const router = useRouter();
//   const [creatingProduct, setCreatingProduct] = useState(false);
//   const [newProductName, setNewProductName] = useState("");
//   const [creatingComponentForProduct, setCreatingComponentForProduct] =
//     useState<string | null>(null);
//   const [newComponentName, setNewComponentName] = useState("");
//   const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(
//     null
//   );
//   const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
//   const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(
//     null
//   );
//   const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
//   const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(
//     null
//   );
//   const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

//   // Set up sensors for drag and drop
//   const sensors = useSensors(
//     useSensor(MouseSensor, {
//       activationConstraint: {
//         distance: 10, // 10px movement required before drag starts
//       },
//     }),
//     useSensor(TouchSensor, {
//       activationConstraint: {
//         delay: 250, // ms delay for touch sensors
//         tolerance: 5, // px tolerance
//       },
//     }),
//     useSensor(KeyboardSensor)
//   );

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   useEffect(() => {
//     if (selectedProductIds.length > 0) {
//       const filteredData = allTableData.filter(
//         (item) =>
//           item.type === "product" && selectedProductIds.includes(item.id)
//       );
//       setTableData(filteredData);
//     } else {
//       setTableData(allTableData);
//     }
//   }, [selectedProductIds, allTableData]);

//   // ... keep existing code (handleProductUpdate and other handlers)
//   const handleProductUpdate = (updatedProduct: Product) => {
//     setTableData((prevData) =>
//       prevData.map((item) =>
//         item.type === "product" && item.id === updatedProduct.id
//           ? { ...item, data: updatedProduct }
//           : item
//       )
//     );
//     setAllTableData((prevData) =>
//       prevData.map((item) =>
//         item.type === "product" && item.id === updatedProduct.id
//           ? { ...item, data: updatedProduct }
//           : item
//       )
//     );
//   };

//   const handleCreateProductClick = () => {
//     setCreatingProduct(true);
//   };

//   const handleProductSelection = (product: TableItem) => {
//     setSelectedProduct(product);
//     setIsProductDetailOpen(true);
//   };

//   const handleComponentSelection = (component: TableItem) => {
//     setSelectedComponent(component);
//     setIsComponentDetailOpen(true);
//   };

//   const handleFeatureSelection = (feature: TableItem) => {
//     setSelectedFeature(feature);
//     setIsFeatureDetailOpen(true);
//   };

//   const handleCloseProductDetails = () => {
//     setIsProductDetailOpen(false);
//   };

//   const handleCloseComponentDetails = () => {
//     setIsComponentDetailOpen(false);
//   };

//   const handleCloseFeatureDetails = () => {
//     setIsFeatureDetailOpen(false);
//   };

//   const handleCreateComponentClick = (productId: string) => {
//     setSelectedProductIdForComponent(productId);
//     setIsCreateComponentModalOpen(true);
//   };

//   const handleCreateFeatureClick = (componentId: string) => {
//     setSelectedComponentIdForFeature(componentId);
//     setIsCreateFeatureModalOpen(true);
//   };

//   // New function to handle the end of drag operation
//   const handleDragEnd = async (event: DragEndEvent) => {
//     const { active, over } = event;

//     if (!over || active.id === over.id) {
//       return;
//     }

//     const activeId = String(active.id).replace('feature-', '');
//     const overId = String(over.id).replace('component-', '');

//     // Find the source component and feature
//     let sourceComponent: TableItem | null = null;
//     let sourceFeature: TableItem | null = null;
//     let sourceProductId = '';

//     // Find destination component
//     const destinationComponentId = overId;

//     // Find the feature and its current component
//     for (const product of tableData) {
//       if (product.children) {
//         for (const component of product.children) {
//           if (component.children) {
//             const featureIndex = component.children.findIndex(f => f.id === activeId);
//             if (featureIndex >= 0) {
//               sourceComponent = component;
//               sourceFeature = component.children[featureIndex];
//               sourceProductId = product.id;
//               break;
//             }
//           }
//         }
//         if (sourceFeature) break;
//       }
//     }

//     if (!sourceFeature || !sourceComponent) {
//       console.error("Could not find source feature or component");
//       return;
//     }

//     // Don't do anything if dragging to the same component
//     if (sourceComponent.id === destinationComponentId) {
//       return;
//     }

//     try {
//       // Update the feature's component_id in the database
//       const response = await fetch(`/api/features/${activeId}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           component_id: destinationComponentId
//         }),
//       });

//       if (!response.ok) {
//         throw new Error('Failed to update feature');
//       }

//       // Update UI after successful API call
//       // Clone table data to make our updates
//       const newTableData = [...tableData];

//       // Remove feature from source component
//       for (const product of newTableData) {
//         if (product.children) {
//           for (let i = 0; i < product.children.length; i++) {
//             const component = product.children[i];
//             if (component.id === sourceComponent?.id && component.children) {
//               component.children = component.children.filter(f => f.id !== activeId);
//             }
//           }
//         }
//       }

//       // Add feature to destination component
//       for (const product of newTableData) {
//         if (product.children) {
//           for (let i = 0; i < product.children.length; i++) {
//             const component = product.children[i];
//             if (component.id === destinationComponentId) {
//               if (!component.children) {
//                 component.children = [];
//               }
//               // Update feature with new component_id
//               const updatedFeature = {
//                 ...sourceFeature,
//                 data: {
//                   ...sourceFeature.data,
//                   component_id: destinationComponentId
//                 }
//               };
//               component.children.push(updatedFeature);
//             }
//           }
//         }
//       }

//       // Update state
//       setTableData(newTableData);
//       setAllTableData(prevData => {
//         const newData = [...prevData];
        
//         // Apply same changes to allTableData
//         for (const product of newData) {
//           if (product.children) {
//             for (let i = 0; i < product.children.length; i++) {
//               const component = product.children[i];
//               if (component.id === sourceComponent?.id && component.children) {
//                 component.children = component.children.filter(f => f.id !== activeId);
//               }
//               if (component.id === destinationComponentId) {
//                 if (!component.children) {
//                   component.children = [];
//                 }
//                 const updatedFeature = {
//                   ...sourceFeature,
//                   data: {
//                     ...sourceFeature.data,
//                     component_id: destinationComponentId
//                   }
//                 };
//                 component.children.push(updatedFeature);
//               }
//             }
//           }
//         }
        
//         return newData;
//       });

//       // Show success toast
//       toast({
//         title: "Feature moved",
//         description: `Feature "${sourceFeature.name}" moved successfully`,
//       });
//     } catch (error) {
//       console.error("Error moving feature:", error);
//       toast({
//         title: "Error",
//         description: "Failed to move feature. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ... keep existing code (fetch functions)
//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       const { data: productsData, error: productsError } = await supabase
//         .from("products")
//         .select("*")
//         .neq("name", "Sample Product 1");
//       if (productsError) throw productsError;
//       const initialTableData: TableItem[] = productsData.map((product) => ({
//         type: "product" as const,
//         id: product.id,
//         name: product.name || "Product",
//         level: 0,
//         data: product,
//       }));
//       setAllTableData(initialTableData);
//       setTableData(initialTableData);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   async function createNewProduct(name: string) {
//     try {
//       const { data, error } = await supabase
//         .from("products")
//         .insert([{ name }])
//         .select();
//       if (error) throw error;
//       if (data && data.length > 0) {
//         const newProduct = data[0];
//         const newProductItem: TableItem = {
//           type: "product",
//           id: newProduct.id,
//           name: newProduct.name,
//           level: 0,
//           data: newProduct,
//         };
//         setAllTableData((prevData) => [...prevData, newProductItem]);
//         setTableData((prevData) => [...prevData, newProductItem]);
//         setCreatingProduct(false);
//         setNewProductName("");
//       }
//     } catch (error) {
//       console.error("Error creating product:", error);
//     }
//   }

//   async function createNewComponent(newComponent: any, productId: string) {
//     try {
//       const newComponentItem: TableItem = {
//         type: "component",
//         id: newComponent.id,
//         name: newComponent.name,
//         level: 1,
//         data: newComponent,
//       };

//       setTableData((prevData) =>
//         prevData.map((item) =>
//           item.id === productId
//             ? {
//                 ...item,
//                 children: [...(item.children || []), newComponentItem],
//               }
//             : item
//         )
//       );

//       setAllTableData((prevData) =>
//         prevData.map((item) =>
//           item.id === productId
//             ? {
//                 ...item,
//                 children: [...(item.children || []), newComponentItem],
//               }
//             : item
//         )
//       );

//       setExpandedItems((prev) => ({
//         ...prev,
//         [`product-${productId}`]: true,
//       }));

//       setCreatingComponentForProduct(null);
//       setNewComponentName("");
//     } catch (error) {
//       console.error("Error handling component creation:", error);
//     }
//   }

//   async function createNewInlineComponent(name: string, productId: string) {
//     try {
//       const { data, error } = await supabase
//         .from("components")
//         .insert([{ name, product_id: productId }])
//         .select();

//       if (error) throw error;

//       if (data && data.length > 0) {
//         const newComponent = data[0];
//         createNewComponent(newComponent, productId);
//       }
//     } catch (error) {
//       console.error("Error creating component:", error);
//     }
//   }

//   async function createNewFeature(newFeature: any, componentId: string) {
//     const newFeatureItem: TableItem = {
//       type: "feature",
//       id: newFeature.id,
//       name: newFeature.name,
//       level: 2,
//       data: newFeature,
//     };

//     setTableData((prevData) =>
//       prevData.map((item) =>
//         item.type === "product" && item.children
//           ? {
//               ...item,
//               children: item.children.map((child) =>
//                 child.id === componentId
//                   ? {
//                       ...child,
//                       children: [...(child.children || []), newFeatureItem],
//                     }
//                   : child
//               ),
//             }
//           : item
//       )
//     );

//     setAllTableData((prevData) =>
//       prevData.map((item) =>
//         item.type === "product" && item.children
//           ? {
//               ...item,
//               children: item.children.map((child) =>
//                 child.id === componentId
//                   ? {
//                       ...child,
//                       children: [...(child.children || []), newFeatureItem],
//                     }
//                   : child
//               ),
//             }
//           : item
//       )
//     );

//     setExpandedItems((prev) => {
//       const updatedExpanded = { ...prev };
//       const parentProduct = allTableData.find((p) =>
//         p.children?.some((c) => c.id === componentId)
//       );
//       if (parentProduct) {
//         updatedExpanded[`product-${parentProduct.id}`] = true;
//         updatedExpanded[`component-${componentId}`] = true;
//       }
//       return updatedExpanded;
//     });

//     setIsCreateFeatureModalOpen(false);
//     setSelectedComponentIdForFeature(null);
//   }

//   async function fetchComponents(productId: string) {
//     try {
//       const { data: componentsData, error: componentsError } = await supabase
//         .from("components")
//         .select("*")
//         .eq("product_id", productId);

//       if (componentsError) throw componentsError;
//       return componentsData.map((component) => ({
//         type: "component" as const,
//         id: component.id,
//         name: component.name || "Component",
//         level: 1,
//         data: component,
//       }));
//     } catch (error) {
//       console.error("Error fetching components:", error);
//       return [];
//     }
//   }

//   async function fetchFeatures(componentId: string) {
//     try {
//       const { data: featuresData, error: featuresError } = await supabase
//         .from("features")
//         .select("*")
//         .eq("component_id", componentId);

//       if (featuresError) throw featuresError;
//       return featuresData.map((feature) => ({
//         type: "feature" as const,
//         id: feature.id,
//         name: feature.name || "Feature",
//         level: 2,
//         data: feature,
//       }));
//     } catch (error) {
//       console.error("Error fetching features:", error);
//       return [];
//     }
//   }

//   const toggleExpand = async (
//     type: string,
//     id: string,
//     data: Product | Component
//   ) => {
//     const newExpandedState = !expandedItems[`${type}-${id}`];
//     setExpandedItems((prev) => ({
//       ...prev,
//       [`${type}-${id}`]: newExpandedState,
//     }));

//     if (newExpandedState) {
//       if (type === "product") {
//         const product = tableData.find((item) => item.id === id);
//         if (!product?.children || product.children.length === 0) {
//           const components = await fetchComponents(id);

//           setTableData((prevData) =>
//             prevData.map((item) =>
//               item.id === id ? { ...item, children: components } : item
//             )
//           );

//           setAllTableData((prevAllData) =>
//             prevAllData.map((item) =>
//               item.id === id ? { ...item, children: components } : item
//             )
//           );
//         }
//       } else if (type === "component") {
//         let componentFound = false;
//         const updatedTableData = tableData.map((product) => {
//           if (product.children) {
//             const componentIndex = product.children.findIndex(
//               (comp) => comp.id === id
//             );
//             if (componentIndex >= 0) {
//               componentFound = true;
//               if (!product.children[componentIndex].children) {
//                 return {
//                   ...product,
//                   children: product.children.map(async (comp, i) => {
//                     if (i === componentIndex) {
//                       const features = await fetchFeatures(id);
//                       return { ...comp, children: features };
//                     }
//                     return comp;
//                   }),
//                 };
//               }
//             }
//           }
//           return product;
//         });

//         if (componentFound) {
//           const features = await fetchFeatures(id);

//           setTableData((prevData) =>
//             prevData.map((product) => {
//               if (product.children) {
//                 return {
//                   ...product,
//                   children: product.children.map((comp) =>
//                     comp.id === id ? { ...comp, children: features } : comp
//                   ),
//                 };
//               }
//               return product;
//             })
//           );

//           setAllTableData((prevData) =>
//             prevData.map((product) => {
//               if (product.children) {
//                 return {
//                   ...product,
//                   children: product.children.map((comp) =>
//                     comp.id === id ? { ...comp, children: features } : comp
//                   ),
//                 };
//               }
//               return product;
//             })
//           );
//         }
//       }
//     }
//   };

//   const isExpanded = (type: string, id: string) => {
//     return !!expandedItems[`${type}-${id}`];
//   };

//   const getFeatureColorClass = (index: number) => {
//     const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
//     return colors[index % colors.length];
//   };

//   const handleSaveNewProduct = () => {
//     if (newProductName.trim()) {
//       createNewProduct(newProductName.trim());
//     }
//   };

//   const handleCancelNewProduct = () => {
//     setCreatingProduct(false);
//     setNewProductName("");
//   };

//   const handleSaveNewComponent = (productId: string) => {
//     if (newComponentName.trim()) {
//       createNewInlineComponent(newComponentName.trim(), productId);
//     }
//   };

//   const handleCancelNewComponent = () => {
//     setCreatingComponentForProduct(null);
//     setNewComponentName("");
//   };

//   // Modified renderChildren to use the DnD components
//   const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
//     return children.map((child) => (
//       <div key={child.id}>
//         <div
//           className={`flex py-2 px-1 items-center ${child.level === 2 ? 'bg-[#fff]' : 'bg-[#cce4fc]'} border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
//         >
//           <div
//             className={`${child.level === 2 ? 'w-[563px] min-w-[433px] max-w-[433px]' : 'w-[436px] min-w-[435px] max-w-[435px]'} flex items-center gap-2`}
//             style={{ paddingLeft: `${16 + child.level * 16}px` }}
//           >
//             <div
//               className="flex items-center gap-2 cursor-pointer w-full"
//               onClick={() => {
//                 if (child.type === "product" || child.type === "component") {
//                   toggleExpand(child.type, child.id, child.data);
//                 }
//               }}
//             >
//               {child.level < 2 &&
//                 (isExpanded(child.type, child.id) ? (
//                   <ChevronDown size={18} className="text-gray-500" />
//                 ) : (
//                   <ChevronRight size={18} className="text-gray-500" />
//                 ))}
//               <div
//                 className={`flex items-center gap-2 cursor-pointer w-full ${
//                   child.type === "component" || child.type === "feature"
//                     ? "text-gray-500 text-[14px]"
//                     : ""
//                 }`}
//                 onClick={(e) => {
//                   if (child.type === "component") {
//                     e.stopPropagation();
//                     handleComponentSelection(child);
//                   } else if (child.type === "feature") {
//                     e.stopPropagation();
//                     handleFeatureSelection(child);
//                   }
//                 }}
//               >
//                 {child.level === 1 && (
//                   <span className="p-1 bg-white text-gray-500 rounded-md">
//                     <svg
//                       width="16"
//                       height="16"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="2"
//                     >
//                       <rect x="3" y="3" width="7" height="7" rx="1" />
//                       <rect x="14" y="3" width="7" height="7" rx="1" />
//                       <rect x="3" y="14" width="7" height="7" rx="1" />
//                       <rect x="14" y="14" width="7" height="7" rx="1" />
//                     </svg>
//                   </span>
//                 )}
//                 {child.level === 2 && (
//                   <>
//                     <div className={`${child.data.status == 'Completed' && 'text-[#79ce17]'} ${child.data.status == 'In Progress' && 'text-[#ffc600]'} ${child.data.status == 'Todo' && ''} ${(child.data.status == 'Todo' && (
//                       new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
//                     ).toString()) && 'text-[#ff4747]'}`}>
//                       <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
//                       </svg>
//                     </div>
//                   </>
//                 )}
//                 <span
//                   className={`cursor-pointer ${
//                     child.type === "component"
//                       ? "hover:text-blue-600"
//                       : child.type === "feature"
//                       ? "hover:text-blue-600"
//                       : ""
//                   } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
//                 >
//                   {child.name}
//                 </span>
//               </div>
//             </div>

//             {child.level === 1 && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleCreateFeatureClick(child.id);
//                 }}
//                 className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//               >
//                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
//               </button>
//             )}
//           </div>

//           <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child?.data?.status || "-"}
//           </div>
//           <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {`${child?.data?.progress}%` || "-"}
//           </div>
//           <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child?.data?.team || "-"}
//           </div>
//           <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child?.data?.days || "-"}
//           </div>
//           <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
//             {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
//           </div>
//           <div
//             className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
//           >
//             {child.data.completedOn || "-"}
//           </div>
//           <div
//             className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
//           >
//             <span>{child.data.remarks || "-"}</span>
//           </div>
//         </div>
        
//         {/* For components, we use DroppableComponent to enable drag and drop */}
//         {child.type === "component" && (
//           <DroppableComponent 
//             component={child}
//             isExpanded={isExpanded(child.type, child.id)}
//             onFeatureClick={handleFeatureSelection}
//           />
//         )}
        
//         {/* For products and other types, use the regular rendering */}
//         {child.type !== "component" && child.children &&
//           isExpanded(child.type, child.id) &&
//           renderChildren(child.children)}

//         {child.level === 1 &&
//           creatingComponentForProduct === `AFTER_${child.id}` && (
//             <div
//               className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
//               style={{ paddingLeft: `${16 + child.level * 16}px` }}
//             >
//               <div className="w-[600px] flex items-center gap-2">
//                 <Input
//                   type="text"
//                   placeholder="Enter component name"
//                   value={newComponentName}
//                   onChange={(e) => setNewComponentName(e.target.value)}
//                   className="w-48"
//                 />
//                 <Button
//                   size="sm"
//                   onClick={() => {
//                     const productId = tableData.find((p) =>
//                       p.children?.some((c) => c.id === child.id)
//                     )?.id;
//                     if (productId) {
//                       handleSaveNewComponent(productId);
//                     }
//                   }}
//                 >
//                   Save
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={handleCancelNewComponent}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           )}
//       </div>
//     ));
//   };

//   if (loading) {
//     return <div className="flex justify-center p-10">Loading products...</div>;
//   }

//   return (
//     <div className="w-full flex">
//       <DndContext 
//         sensors={sensors}
//         collisionDetection={closestCenter}
//         modifiers={[restrictToVerticalAxis]}
//         onDragEnd={handleDragEnd}
//       >
//         <div className="w-full transition-all duration-300">
//           <CreateFeatureModal
//             isOpen={isCreateFeatureModalOpen}
//             onClose={() => setIsCreateFeatureModalOpen(false)}
//             componentId={selectedComponentIdForFeature}
//             onFeatureCreated={createNewFeature}
//           />

//           <CreateComponentModal
//             isOpen={isCreateComponentModalOpen}
//             onClose={() => setIsCreateComponentModalOpen(false)}
//             productId={selectedProductIdForComponent}
//             onComponentCreated={createNewComponent}
//           />

//           {selectedProduct && (
//             <ProductDetailsPage
//               productId={selectedProduct.data.id}
//               isOpen={isProductDetailOpen}
//               onClose={handleCloseProductDetails}
//               onProductUpdated={handleProductUpdate}
//             />
//           )}

//           {selectedComponent && (
//             <ComponentDetailsPage
//               componentId={selectedComponent.data.id}
//               isOpen={isComponentDetailOpen}
//               onClose={handleCloseComponentDetails}
//             />
//           )}

//           {selectedFeature && (
//             <FeatureDetailsPage
//               featureId={selectedFeature.data.id}
//               isOpen={isFeatureDetailOpen}
//               onClose={handleCloseFeatureDetails}
//             />
//           )}

//           <div className="bg-gray-100 border-b px-5">
//             <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
//               <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 Products, Components, Features
//               </div>
//               <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 Status
//               </div>
//               <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 Progress
//               </div>
//               <div className="w-[100px] flex justify-center text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                   <div className="flex-row flex">
//                       <img className="w-[16px] h-[16px] mr-1" src="/person.svg" alt="Person"></img>Team
//                   </div>
//               </div>
//               <div className="w-[72px] flex text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                   <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1" alt="File"></img> Days
//               </div>
//               <div className="w-[144px] flex justify-center text-center text-[13px] font-bold flex-row border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                   <img className="w-[16px] h-[16px] mr-1" src="/clock.svg" alt="Clock"></img> Target span
//               </div>
//               <div className="w-[144px] justify-center text-center text-[13px] font-bold flex-row flex whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                   <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File"></img> Completion Time
//               </div>
//               <div className="w-[100px] text-center text-[13px] font-bold flex-row flex border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File"></img> Remarks
//               </div>
//             </div>
//           </div>

//           <div className="divide-y bg-white px-6">
//             {tableData.map((item) => (
//               <div key={item.id}>
//                 <div
//                   className={`flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
//                     selectedProduct?.id === item.id ? "bg-blue-50" : ""
//                   }`}
//                   style={{ paddingLeft: `${16 + item.level * 16}px` }}
//                 >
//                   <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2">
//                     <div
//                       className="flex items-center gap-2 cursor-pointer w-full"
//                       onClick={() => toggleExpand(item.type, item.id, item.data)}
//                     >
//                       {item.level < 2 &&
//                         (isExpanded(item.type, item.id) ? (
//                           <ChevronDown size={18} className="text-gray-500" />
//                         ) : (
//                           <ChevronRight size={18} className="text-gray-500" />
//                         ))}

//                       <div className="flex items-center gap-2 text-gray-800 bg-white">
//                         {item.level === 0 && (
//                           <div className="p-1 bg-white text-gray-400 rounded-md">
//                             <svg
//                               height="16px"
//                               width="16px"
//                               viewBox="0 0 16 16"
//                               role="img"
//                               aria-label="ProductIcon"
//                               className="sc-fQpRED cOkelz ui-icon"
//                             >
//                               <path
//                                 fill="currentColor"
//                                 fillRule="evenodd"
//                                 d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
//                                 clipRule="evenodd"
//                               ></path>
//                             </svg>
//                           </div>
//                         )}
//                         <span
//                           className={`cursor-pointer ${
//                             item.type === "product" ? "hover:text-blue-600" : ""
//                           } text-gray-700 text-[16px]`}
//                           onClick={(e) => {
//                             if (item.type === "product") {
//                               e.stopPropagation();
//                               handleProductSelection(item);
//                             }
//                           }}
//                         >
//                           {item.name}
//                         </span>
//                       </div>
//                     </div>

//                     {item.level === 0 && (
//                       <button
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           handleCreateComponentClick(item.id);
//                         }}
//                         className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//                       >
//                       <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
//                       </button>
//                     )}
//                     {creatingComponentForProduct === item.id && (
//                       <>
//                         <Input
//                           type="text"
//                           placeholder="Enter component name"
//                           value={newComponentName}
//                           onChange={(e) => setNewComponentName(e.target.value)}
//                           className="ml-2 w-48"
//                         />
//                         <Button
//                           size="sm"
//                           onClick={() => handleSaveNewComponent(item.id)}
//                         >
//                           Save
//                         </Button>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={handleCancelNewComponent}
//                         >
//                           Cancel
//                         </Button>
//                       </>
//                     )}
//                   </div>

//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
//                     {item.data.status || ""}
//                   </div>
//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                     {item.data.progress !== undefined
//                       ? `${item.data.progress}%`
//                       : ""}
//                   </div>
//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                     {item.data.team || ""}
//                   </div>
//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                     {item.data.days !== undefined ? item.data.days : ""}
//                   </div>
//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                     {item.data.startDate || ""}-{item.data.targetDate || ""}
//                   </div>
//                   <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                     {item.data.completedOn || ""}
//                   </div>
//                   <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
//                     <span>{item.data.remarks || ""}</span>
//                   </div>
//                 </div>

//                 {item.children &&
//                   isExpanded(item.type, item.id) &&
//                   renderChildren(item.children)}
//               </div>
//             ))}
//           </div>

//           <div className="mt-2 bg-gray-100 px-6">
//             {creatingProduct ? (
//               <div className="flex py-2 items-center hover:bg-gray-50">
//                 <div className="w-[600px] flex items-center gap-2">
//                   <Input
//                     type="text"
//                     placeholder="Enter product name"
//                     value={newProductName}
//                     onChange={(e) => setNewProductName(e.target.value)}
//                   />
//                   <Button size="sm" onClick={handleSaveNewProduct}>
//                     Save
//                   </Button>
//                   <Button
//                     size="sm"
//                     variant="outline"
//                     onClick={handleCancelNewProduct}
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </div>
//             ) : (
//               <div className="bg-white-200 px-5">
//                 <Button onClick={handleCreateProductClick}>
//                   <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
//                   Create Product
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </DndContext>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Plus,
} from "lucide-react";
import { 
  DndContext, 
  DragEndEvent, 
  PointerSensor, 
  MouseSensor, 
  TouchSensor, 
  KeyboardSensor,
  useSensor, 
  useSensors,
  closestCenter
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { Input } from "@/components/ui/input";
import { Product, Component, Feature } from "@/app/types";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
// import { toast } from "@/components/ui/use-toast";
import { DroppableComponent } from "./_components/draggablecomponent";

import ProductDetailsPage from "./_components/productDetails";
import ComponentDetailsPage from "./_components/componentDetails";
import FeatureDetailsPage from "./_components/featureDetails";
import { CreateFeatureModal } from "./_components/createFeatureModal";
import { CreateComponentModal } from "./_components/createComponentModal";
import { toast } from "@/app/hooks/use-toast";

interface TableItem {
  type: "product" | "component" | "feature";
  id: string;
  name: string;
  level: number;
  data: Product | Component | Feature;
  children?: TableItem[];
}

interface ProductTableProps {
  selectedProductIds: string[];
}

export default function ProductTable({
  selectedProductIds,
}: ProductTableProps) {
  const [allTableData, setAllTableData] = useState<TableItem[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );
  const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] =
    useState(false);
  const [selectedProductIdForComponent, setSelectedProductIdForComponent] =
    useState<string | null>(null);
  const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] =
    useState(false);
  const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] =
    useState<string | null>(null);
  const router = useRouter();
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [creatingComponentForProduct, setCreatingComponentForProduct] =
    useState<string | null>(null);
  const [newComponentName, setNewComponentName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(
    null
  );
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(
    null
  );
  const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(
    null
  );
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);

  // Set up sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // 10px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // ms delay for touch sensors
        tolerance: 5, // px tolerance
      },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductIds.length > 0) {
      const filteredData = allTableData.filter(
        (item) =>
          item.type === "product" && selectedProductIds.includes(item.id)
      );
      setTableData(filteredData);
    } else {
      setTableData(allTableData);
    }
  }, [selectedProductIds, allTableData]);

  const handleProductUpdate = (updatedProduct: Product) => {
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === updatedProduct.id
          ? { ...item, data: updatedProduct }
          : item
      )
    );
    setAllTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === updatedProduct.id
          ? { ...item, data: updatedProduct }
          : item
      )
    );
  };

  const handleCreateProductClick = () => {
    setCreatingProduct(true);
  };

  const handleProductSelection = (product: TableItem) => {
    setSelectedProduct(product);
    setIsProductDetailOpen(true);
  };

  const handleComponentSelection = (component: TableItem) => {
    setSelectedComponent(component);
    setIsComponentDetailOpen(true);
  };

  const handleFeatureSelection = (feature: TableItem) => {
    setSelectedFeature(feature);
    setIsFeatureDetailOpen(true);
  };

  const handleCloseProductDetails = () => {
    setIsProductDetailOpen(false);
  };

  const handleCloseComponentDetails = () => {
    setIsComponentDetailOpen(false);
  };

  const handleCloseFeatureDetails = () => {
    setIsFeatureDetailOpen(false);
  };

  const handleCreateComponentClick = (productId: string) => {
    setSelectedProductIdForComponent(productId);
    setIsCreateComponentModalOpen(true);
  };

  const handleCreateFeatureClick = (componentId: string) => {
    setSelectedComponentIdForFeature(componentId);
    setIsCreateFeatureModalOpen(true);
  };

  // New function to handle the end of drag operation
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeIdWithPrefix = String(active.id);
    const overIdWithPrefix = String(over.id);
    
    // Only proceed if dragging a feature to a component
    if (!activeIdWithPrefix.startsWith('feature-') || !overIdWithPrefix.startsWith('component-')) {
      console.error('Invalid drag operation - must drag feature to component', { activeIdWithPrefix, overIdWithPrefix });
      return;
    }

    const activeId = activeIdWithPrefix.replace('feature-', '');
    const overId = overIdWithPrefix.replace('component-', '');
      
    console.log('Drag end event:', { activeId, overId, active, over });

    if (!activeId || !overId) {
      console.error('Invalid active or over ID');
      return;
    }

    // Find the source component and feature
    let sourceComponent: TableItem | null = null;
    let sourceFeature: TableItem | null = null;
    let sourceProductId = '';

    // Find destination component
    // const destinationComponentId = overId;
    let targetComponent: TableItem | null = null;
    // Find the feature and its current component

    console.log('Current table data:', JSON.parse(JSON.stringify(tableData)));
    console.log('Expanded items:', expandedItems);
    
    for (const product of tableData) {
      if (product.children) {
        for (const component of product.children) {
          if (component.id === overId) {
            targetComponent = component;
          }
          if (component.children) {
            const featureIndex = component.children.findIndex(f => f.id === activeId);
            if (featureIndex >= 0) {
              sourceComponent = component;
              sourceFeature = component.children[featureIndex];
              sourceProductId = product.id;
              break;
            }
          }
        }
        if (sourceFeature) break;
      }
    }

    if (!sourceFeature || !sourceComponent) {
      console.error("Could not find source feature or component", {
        activeId,
        tableData,
        expandedItems
      });
      return;
    }

    if (!targetComponent) {
      console.error("Could not find target component", {
        overId,
        tableData
      });
      return;
    }

    // Don't do anything if dragging to the same component
    if (sourceComponent.id === overId) {
      return;
    }

    try {
      // Update the feature's component_id in the database
      // const response = await fetch(`/api/features/${activeId}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     component_id: overId,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error('Failed to update feature');
      // }

      console.log(`Moving feature ${activeId} from component ${sourceComponent.id} to ${overId}`);

      // Update UI after successful API call
      // Clone table data to make our updates
      const newTableData = JSON.parse(JSON.stringify(tableData));

      // Remove feature from source component
      for (const product of newTableData) {
        if (product.children) {
          for (let i = 0; i < product.children.length; i++) {
            const component = product.children[i];
            if (component.id === sourceComponent?.id && component.children) {
              component.children = component.children.filter((f: TableItem) => f.id !== activeId);
            }
          }
        }
      }

      // Add feature to destination component
      for (const product of newTableData) {
        if (product.children) {
          for (let i = 0; i < product.children.length; i++) {
            const component = product.children[i];
            if (component.id === overId) {
              if (!component.children) {
                component.children = [];
              }
              // Update feature with new component_id
              const updatedFeature = {
                ...sourceFeature,
                data: {
                  ...sourceFeature.data,
                  component_id: overId
                }
              };
              component.children.push(updatedFeature);
            }
          }
        }
      }

      // Update state
      setTableData(newTableData);
      // setAllTableData(prevData => {
      //   const newData = [...prevData];
        
      //   // Apply same changes to allTableData
      //   for (const product of newData) {
      //     if (product.children) {
      //       for (let i = 0; i < product.children.length; i++) {
      //         const component = product.children[i];
      //         if (component.id === sourceComponent?.id && component.children) {
      //           component.children = component.children.filter(f => f.id !== activeId);
      //         }
      //         if (component.id === destinationComponentId) {
      //           if (!component.children) {
      //             component.children = [];
      //           }
      //           const updatedFeature = {
      //             ...sourceFeature,
      //             data: {
      //               ...sourceFeature.data,
      //               component_id: destinationComponentId
      //             }
      //           };
      //           component.children.push(updatedFeature);
      //         }
      //       }
      //     }
      //   }
        
      //   return newData;
      // });

      // Show success toast
      // const newAllTableData = [...allTableData];

      const newAllTableData = JSON.parse(JSON.stringify(allTableData));
      
      // Remove feature from source component in allTableData
      for (const product of newAllTableData) {
        if (product.children) {
          for (let i = 0; i < product.children.length; i++) {
            const component = product.children[i];
            if (component.id === sourceComponent?.id && component.children) {
              component.children = component.children.filter((f: TableItem) => f.id !== activeId);
            }
          }
        }
      }

      // Add feature to destination component in allTableData
      for (const product of newAllTableData) {
        if (product.children) {
          for (let i = 0; i < product.children.length; i++) {
            const component = product.children[i];
            if (component.id === overId) {
              if (!component.children) {
                component.children = [];
              }
              // Update feature with new component_id
              const updatedFeature = {
                ...sourceFeature,
                data: {
                  ...sourceFeature.data,
                  component_id: overId
                }
              };
              component.children.push(updatedFeature);
            }
          }
        }
      }

      setAllTableData(newAllTableData);

      toast({
        title: "Feature moved",
        description: `Feature "${sourceFeature.name}" moved successfully`,
      });
    } catch (error) {
      console.error("Error moving feature:", error);
      toast({
        title: "Error",
        description: "Failed to move feature. Please try again.",
        variant: "destructive",
      });
    }
  };

  async function fetchProducts() {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .neq("name", "Sample Product 1");
      if (productsError) throw productsError;
      const initialTableData: TableItem[] = productsData.map((product) => ({
        type: "product" as const,
        id: product.id,
        name: product.name || "Product",
        level: 0,
        data: product,
      }));
      setAllTableData(initialTableData);
      setTableData(initialTableData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createNewProduct(name: string) {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{ name }])
        .select();
      if (error) throw error;
      if (data && data.length > 0) {
        const newProduct = data[0];
        const newProductItem: TableItem = {
          type: "product",
          id: newProduct.id,
          name: newProduct.name,
          level: 0,
          data: newProduct,
        };
        setAllTableData((prevData) => [...prevData, newProductItem]);
        setTableData((prevData) => [...prevData, newProductItem]);
        setCreatingProduct(false);
        setNewProductName("");
      }
    } catch (error) {
      console.error("Error creating product:", error);
    }
  }

  async function createNewComponent(newComponent: any, productId: string) {
    try {
      const newComponentItem: TableItem = {
        type: "component",
        id: newComponent.id,
        name: newComponent.name,
        level: 1,
        data: newComponent,
      };

      setTableData((prevData) =>
        prevData.map((item) =>
          item.id === productId
            ? {
                ...item,
                children: [...(item.children || []), newComponentItem],
              }
            : item
        )
      );

      setAllTableData((prevData) =>
        prevData.map((item) =>
          item.id === productId
            ? {
                ...item,
                children: [...(item.children || []), newComponentItem],
              }
            : item
        )
      );

      setExpandedItems((prev) => ({
        ...prev,
        [`product-${productId}`]: true,
      }));

      setCreatingComponentForProduct(null);
      setNewComponentName("");
    } catch (error) {
      console.error("Error handling component creation:", error);
    }
  }

  async function createNewInlineComponent(name: string, productId: string) {
    try {
      const { data, error } = await supabase
        .from("components")
        .insert([{ name, product_id: productId }])
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const newComponent = data[0];
        createNewComponent(newComponent, productId);
      }
    } catch (error) {
      console.error("Error creating component:", error);
    }
  }

  async function createNewFeature(newFeature: any, componentId: string) {
    const newFeatureItem: TableItem = {
      type: "feature",
      id: newFeature.id,
      name: newFeature.name,
      level: 2,
      data: newFeature,
    };

    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === componentId
                  ? {
                      ...child,
                      children: [...(child.children || []), newFeatureItem],
                    }
                  : child
              ),
            }
          : item
      )
    );

    setAllTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === componentId
                  ? {
                      ...child,
                      children: [...(child.children || []), newFeatureItem],
                    }
                  : child
              ),
            }
          : item
      )
    );

    setExpandedItems((prev) => {
      const updatedExpanded = { ...prev };
      const parentProduct = allTableData.find((p) =>
        p.children?.some((c) => c.id === componentId)
      );
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
        .from("components")
        .select("*")
        .eq("product_id", productId);

      if (componentsError) throw componentsError;
      return componentsData.map((component) => ({
        type: "component" as const,
        id: component.id,
        name: component.name || "Component",
        level: 1,
        data: component,
      }));
    } catch (error) {
      console.error("Error fetching components:", error);
      return [];
    }
  }

  async function fetchFeatures(componentId: string) {
    try {
      const { data: featuresData, error: featuresError } = await supabase
        .from("features")
        .select("*")
        .eq("component_id", componentId);

      if (featuresError) throw featuresError;
      return featuresData.map((feature) => ({
        type: "feature" as const,
        id: feature.id,
        name: feature.name || "Feature",
        level: 2,
        data: feature,
      }));
    } catch (error) {
      console.error("Error fetching features:", error);
      return [];
    }
  }

  const toggleExpand = async (
    type: string,
    id: string,
    data: Product | Component
  ) => {
    const newExpandedState = !expandedItems[`${type}-${id}`];
    setExpandedItems((prev) => ({
      ...prev,
      [`${type}-${id}`]: newExpandedState,
    }));

    if (newExpandedState) {
      if (type === "product") {
        const product = tableData.find((item) => item.id === id);
        if (!product?.children || product.children.length === 0) {
          const components = await fetchComponents(id);

          setTableData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, children: components } : item
            )
          );

          setAllTableData((prevAllData) =>
            prevAllData.map((item) =>
              item.id === id ? { ...item, children: components } : item
            )
          );
        }
      } else if (type === "component") {
        let componentFound = false;
        const updatedTableData = tableData.map((product) => {
          if (product.children) {
            const componentIndex = product.children.findIndex(
              (comp) => comp.id === id
            );
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
                  }),
                };
              }
            }
          }
          return product;
        });

        if (componentFound) {
          const features = await fetchFeatures(id);

          setTableData((prevData) =>
            prevData.map((product) => {
              if (product.children) {
                return {
                  ...product,
                  children: product.children.map((comp) =>
                    comp.id === id ? { ...comp, children: features } : comp
                  ),
                };
              }
              return product;
            })
          );

          setAllTableData((prevData) =>
            prevData.map((product) => {
              if (product.children) {
                return {
                  ...product,
                  children: product.children.map((comp) =>
                    comp.id === id ? { ...comp, children: features } : comp
                  ),
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
    const colors = ["bg-yellow-400", "bg-cyan-400", "bg-blue-400"];
    return colors[index % colors.length];
  };

  const handleSaveNewProduct = () => {
    if (newProductName.trim()) {
      createNewProduct(newProductName.trim());
    }
  };

  const handleCancelNewProduct = () => {
    setCreatingProduct(false);
    setNewProductName("");
  };

  const handleSaveNewComponent = (productId: string) => {
    if (newComponentName.trim()) {
      createNewInlineComponent(newComponentName.trim(), productId);
    }
  };

  const handleCancelNewComponent = () => {
    setCreatingComponentForProduct(null);
    setNewComponentName("");
  };

  // Modified renderChildren to use the DnD components
  const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
    return children.map((child) => (
      <div key={child.id}>
        <div
          className={`flex py-2 px-1 items-center ${child.level === 2 ? 'bg-[#fff]' : 'bg-[#cce4fc]'} border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
        >
          <div
            className={`${child.level === 2 ? 'w-[563px] min-w-[433px] max-w-[433px]' : 'w-[436px] min-w-[435px] max-w-[435px]'} flex items-center gap-2`}
            style={{ paddingLeft: `${16 + child.level * 16}px` }}
          >
            <div
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => {
                if (child.type === "product" || child.type === "component") {
                  toggleExpand(child.type, child.id, child.data);
                }
              }}
            >
              {child.level < 2 &&
                (isExpanded(child.type, child.id) ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                ))}
              <div
                className={`flex items-center gap-2 cursor-pointer w-full ${
                  child.type === "component" || child.type === "feature"
                    ? "text-gray-500 text-[14px]"
                    : ""
                }`}
                onClick={(e) => {
                  if (child.type === "component") {
                    e.stopPropagation();
                    handleComponentSelection(child);
                  } else if (child.type === "feature") {
                    e.stopPropagation();
                    handleFeatureSelection(child);
                  }
                }}
              >
                {child.level === 1 && (
                  <span className="p-1 bg-white text-gray-500 rounded-md">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="3" width="7" height="7" rx="1" />
                      <rect x="14" y="3" width="7" height="7" rx="1" />
                      <rect x="3" y="14" width="7" height="7" rx="1" />
                      <rect x="14" y="14" width="7" height="7" rx="1" />
                    </svg>
                  </span>
                )}
                {child.level === 2 && (
                  <>
                    <div className={`${child.data.status == 'Completed' && 'text-[#79ce17]'} ${child.data.status == 'In Progress' && 'text-[#ffc600]'} ${child.data.status == 'Todo' && ''} ${(child.data.status == 'Todo' && (
                      new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
                    ).toString()) && 'text-[#ff4747]'}`}>
                      <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
                      </svg>
                    </div>
                  </>
                )}
                <span
                  className={`cursor-pointer ${
                    child.type === "component"
                      ? "hover:text-blue-600"
                      : child.type === "feature"
                      ? "hover:text-blue-600"
                      : ""
                  } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%] w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
                >
                  {child.name}
                </span>
              </div>
            </div>

            {child.level === 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCreateFeatureClick(child.id);
                }}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full"
              >
                <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
              </button>
            )}
          </div>

          <div className="w-[130px] flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.status || "-"}
          </div>
          <div className="w-[120px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {`${child?.data?.progress}%` || "-"}
          </div>
          <div className="w-[144px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.team || "-"}
          </div>
          <div className="w-[112px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.days || "-"}
          </div>
          <div className="w-[180px] flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
            {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
          </div>
          <div
            className="w-[170px] flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
          >
            {child.data.completedOn || "-"}
          </div>
          <div
            className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]"
          >
            <span>{child.data.remarks || "-"}</span>
          </div>
        </div>
        
        {/* For components, we use DroppableComponent to enable drag and drop */}
        {child.type === "component" && (
          <DroppableComponent 
            component={child}
            componentId={child.id}
            isExpanded={isExpanded(child.type, child.id)}
            onFeatureClick={handleFeatureSelection}
          />
        )}
        
        {/* For products and other types, use the regular rendering */}
        {child.type !== "component" && child.children &&
          isExpanded(child.type, child.id) &&
          renderChildren(child.children)}

        {child.level === 1 &&
          creatingComponentForProduct === `AFTER_${child.id}` && (
            <div
              className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
              style={{ paddingLeft: `${16 + child.level * 16}px` }}
            >
              <div className="w-[600px] flex items-center gap-2">
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
                    const productId = tableData.find((p) =>
                      p.children?.some((c) => c.id === child.id)
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
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragEnd={handleDragEnd}
      >
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
              productId={selectedProduct.data.id}
              isOpen={isProductDetailOpen}
              onClose={handleCloseProductDetails}
              onProductUpdated={handleProductUpdate}
            />
          )}

          {selectedComponent && (
            <ComponentDetailsPage
              componentId={selectedComponent.data.id}
              isOpen={isComponentDetailOpen}
              onClose={handleCloseComponentDetails}
            />
          )}

          {selectedFeature && (
            <FeatureDetailsPage
              featureId={selectedFeature.data.id}
              isOpen={isFeatureDetailOpen}
              onClose={handleCloseFeatureDetails}
            />
          )}

          <div className="bg-gray-100 border-b px-5">
            <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
              <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                Products, Components, Features
              </div>
              <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                Status
              </div>
              <div className="w-[80px] justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                Progress
              </div>
              <div className="w-[100px] flex justify-center text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                  <div className="flex-row flex">
                      <img className="w-[16px] h-[16px] mr-1" src="/person.svg" alt="Person"></img>Team
                  </div>
              </div>
              <div className="w-[72px] flex text-center text-[13px] font-bold flex-row whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                  <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1" alt="File"></img> Days
              </div>
              <div className="w-[144px] flex justify-center text-center text-[13px] font-bold flex-row border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                  <img className="w-[16px] h-[16px] mr-1" src="/clock.svg" alt="Clock"></img> Target span
              </div>
              <div className="w-[144px] justify-center text-center text-[13px] font-bold flex-row flex whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                  <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File"></img> Completion Time
              </div>
              <div className="w-[100px] text-center text-[13px] font-bold flex-row flex border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
               <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg" alt="File"></img> Remarks
              </div>
            </div>
          </div>

          <div className="divide-y bg-white px-6">
            {tableData.map((item) => (
              <div key={item.id}>
                <div
                  className={`flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
                    selectedProduct?.id === item.id ? "bg-blue-50" : ""
                  }`}
                  style={{ paddingLeft: `${16 + item.level * 16}px` }}
                >
                  <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2">
                    <div
                      className="flex items-center gap-2 cursor-pointer w-full"
                      onClick={() => toggleExpand(item.type, item.id, item.data)}
                    >
                      {item.level < 2 &&
                        (isExpanded(item.type, item.id) ? (
                          <ChevronDown size={18} className="text-gray-500" />
                        ) : (
                          <ChevronRight size={18} className="text-gray-500" />
                        ))}

                      <div className="flex items-center gap-2 text-gray-800 bg-white">
                        {item.level === 0 && (
                          <div className="p-1 bg-white text-gray-400 rounded-md">
                            <svg
                              height="16px"
                              width="16px"
                              viewBox="0 0 16 16"
                              role="img"
                              aria-label="ProductIcon"
                              className="sc-fQpRED cOkelz ui-icon"
                            >
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </div>
                        )}
                        <span
                          className={`cursor-pointer ${
                            item.type === "product" ? "hover:text-blue-600" : ""
                          } text-gray-700 text-[16px]`}
                          onClick={(e) => {
                            if (item.type === "product") {
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
                      <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
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
                        <Button
                          size="sm"
                          onClick={() => handleSaveNewComponent(item.id)}
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
                      </>
                    )}
                  </div>

                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
                    {item.data.status || ""}
                  </div>
                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                    {item.data.progress !== undefined
                      ? `${item.data.progress}%`
                      : ""}
                  </div>
                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                    {item.data.team || ""}
                  </div>
                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                    {item.data.days !== undefined ? item.data.days : ""}
                  </div>
                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                    {item.data.startDate || ""}-{item.data.targetDate || ""}
                  </div>
                  <div className="w-[144px] min-w-[94px] flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                    {item.data.completedOn || ""}
                  </div>
                  <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
                    <span>{item.data.remarks || ""}</span>
                  </div>
                </div>

                {item.children &&
                  isExpanded(item.type, item.id) &&
                  renderChildren(item.children)}
              </div>
            ))}
          </div>

          <div className="mt-2 bg-gray-100 px-6">
            {creatingProduct ? (
              <div className="flex py-2 items-center hover:bg-gray-50">
                <div className="w-[600px] flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Enter product name"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  />
                  <Button size="sm" onClick={handleSaveNewProduct}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancelNewProduct}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-white-200 px-5">
                <Button onClick={handleCreateProductClick}>
                  <img className="w-[16px] h-[16px] mr-1" src="/add.svg" alt="Add"></img>
                  Create Product
                </Button>
              </div>
            )}
          </div>
        </div>
      </DndContext>
    </div>
  );
}
