
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
// import { Input } from "@/components/ui/input";
// import { Product, Component, Feature } from "@/app/types";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";

// import ProductDetailsPage from "./_components/productDetails";
// import ComponentDetailsPage from "./_components/componentDetails";
// import FeatureDetailsPage from "./_components/featureDetails";
// import { CreateFeatureModal } from "./_components/createFeatureModal";
// import { CreateComponentModal } from "./_components/createComponentModal";


// // import { ProductDetailsPage } from './_components/productDetails';

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

// interface CreateComponentModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   productId: string | null;
//   onComponentCreated: (component: any, productId: string) => void;
// }



// interface CreateFeatureModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   componentId: string | null;
//   onFeatureCreated: (feature: any, componentId: string) => void;
// }


// export default function ProductTable({
//   selectedProductIds,
// }: ProductTableProps) {
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

//   const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
//     return children.map((child) => (
//       <div key={child.id}>
//         <div
//           className={`flex py-2 px-1 items-center  ${child.level=== 2 ?'bg-[#fff]' : 'bg-[#cce4fc]'}  border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
//         >
//           <div
//             className={`${child.level=== 2 ?'w-[563px] min-w-[433px] max-w-[433px]':'w-[436px] min-w-[435px] max-w-[435px]'}  flex items-center gap-2 `}
//             style={{ paddingLeft: `${16 + child.level * 16}px` }}
//           >
//             <div
//               className="flex items-center gap-2 cursor-pointer w-full"
//               onClick={() => {
//                 if (child.type === "product" || child.type === "component") {
//                   if (child.type === "product" || child.type === "component") {
//                     toggleExpand(child.type, child.id, child.data);
//                   }
//                 }
//               }}
//             >
//               {child.level < 2 &&
//                 (isExpanded(child.type, child.id) ? (
//                   <ChevronDown size={18} className="text-gray-500" />
//                 ) : (
//                   <ChevronRight size={18} className="text-gray-500" />
//                 ))}
//               {/* <div className="flex items-center gap-2"> */}
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
//                     <>
// {/*                   <span
//                     className={`inline-block ${getFeatureColorClass(
//                     Math.floor(Math.random() * 3)
//                     )} w-4 h-4 rounded-sm`}
//                   >
//   </span> */}
  
//     <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// ).toString() )&& 'text-[#ff4747]'} `}>
//     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
//     </svg>
//     </div>

// </>

               
//                 )}
//                 <span
//                   className={`cursor-pointer ${
//                     child.type === "component"
//                       ? "hover:text-blue-600"
//                       : child.type === "feature"
//                       ? "hover:text-blue-600"
//                       : ""
//                   } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%]  w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
//                   onClick={(e) => {
//                     if (child.type === "component") {
//                       e.stopPropagation();
//                       handleComponentSelection(child);
//                     } else if (child.type === "feature") {
//                       e.stopPropagation();
//                       handleFeatureSelection(child);
//                     }
//                   }}
//                 >
//                   {child.name}
//                 </span>
//               </div>
//             </div>

// {/* feature component */}
//             {/* Add the Plus button only for components (level 1) to create features */}
//             {child.level === 1 && (
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   handleCreateFeatureClick(child.id);
//                 }}
//                 className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//               >
//                  <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
//               </button>
//             )}
//           </div>
//           <div className="w-[130px]   flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child?.data?.status || "-"} 
//           </div>
//           <div className="w-[120px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             { `${child?.data?.progress}%` ||"-"}
//           </div>
//           <div className="w-[144px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child?.data?.team || "-"}
//           </div>
//           <div className="w-[112px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             { child?.data?.days || "-"} 
//           </div>
//           <div className="w-[180px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
//             {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
//           </div>
//           {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//             {child.data.targetDate || ""}
//           </div> */}
//           <div
//             className="w-[170px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
//  "
//           >
//             {child.data.completedOn || "-"}
//           </div>
//           <div
//             className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// "
//           >
//             <span>{child.data.remarks || "-"}</span>
//           </div>
//         </div>
//         {child.children &&
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
//       {/* Left Side - Product Table */}
//       {/* <div className={`${selectedProduct ? 'w-1/2' : 'w-full'} transition-all duration-300`}> */}
//       <div className="w-full transition-all duration-300">
//         <CreateFeatureModal
//           isOpen={isCreateFeatureModalOpen}
//           onClose={() => setIsCreateFeatureModalOpen(false)}
//           componentId={selectedComponentIdForFeature}
//           onFeatureCreated={createNewFeature}
//         />

//         <CreateComponentModal
//           isOpen={isCreateComponentModalOpen}
//           onClose={() => setIsCreateComponentModalOpen(false)}
//           productId={selectedProductIdForComponent}
//           onComponentCreated={createNewComponent}
//         />

//         {selectedProduct && (
//           <ProductDetailsPage
//             productId={selectedProduct.data.id} // Pass the ID to fetch details within ProductDetailsPage
//             isOpen={isProductDetailOpen}
//             onClose={handleCloseProductDetails}
//             onProductUpdated={handleProductUpdate}
//           />
//         )}

//         {selectedComponent && (
//           <ComponentDetailsPage
//             componentId={selectedComponent.data.id}
//             isOpen={isComponentDetailOpen}
//             onClose={handleCloseComponentDetails}
//           />
//         )}

//         {selectedFeature && (
//           <FeatureDetailsPage
//             featureId={selectedFeature.data.id}
//             isOpen={isFeatureDetailOpen}
//             onClose={handleCloseFeatureDetails}
//           />
//         )}

//         <div className="bg-gray-100 border-b px-5">
//           <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
//             <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//               Products, Components, Features
//             </div>
//             <div className="w-[80px]    justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//               Status
//             </div>
//             <div className="w-[80px]   justify-center text-center  text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//               Progress
//             </div>
//             <div className="w-[100px]   flex justify-center text-center  text-[13px] font-bold flex-row  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 <div className="flex-row flex">
//                     <img className="w-[16px] h-[16px] mr-1" src="/person.svg"></img>Team
//                 </div>
//             </div>
//             <div className="w-[72px]   flex  text-center text-[13px] font-bold flex-row   whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1"></img> Days
//             </div>
//             <div className="w-[144px]   flex justify-center text-center text-[13px] font-bold flex-row   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg"></img> Target span
//             </div>
//             {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[13px] font-bol flex-row flex mx-auto">
//                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img>Target Date
//             </div> */}
//             <div className="w-[144px]   justify-center text-center  text-[13px] font-bold flex-row flex  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Completion Time
//             </div>
//             <div className="w-[100px] text-center  text-[13px] font-bold flex-row flex   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
//              <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Remarks
//             </div>
//           </div>
//         </div>

//         <div className="divide-y bg-white px-6">
//           {tableData.map((item) => (
//             <div key={item.id}>
//               <div
//                 className={` flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
//                   selectedProduct?.id === item.id ? "bg-blue-50" : ""
//                 }`}
//                 style={{ paddingLeft: `${16 + item.level * 16}px` }}
//               >
//                 <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2   " 
//     >
//                   <div
//                     className="flex items-center gap-2 cursor-pointer w-full"
//                     onClick={() => toggleExpand(item.type, item.id, item.data)}
//                   >
//                     {item.level < 2 &&
//                       (isExpanded(item.type, item.id) ? (
//                         <ChevronDown size={18} className="text-gray-500" />
//                       ) : (
//                         <ChevronRight size={18} className="text-gray-500" />
//                       ))}

//                     <div className="flex items-center gap-2 text-gray-800 bg-white">
//                       {item.level === 0 && (
//                         <div className="p-1 bg-white text-gray-400 rounded-md">
//                           <svg
//                             height="16px"
//                             width="16px"
//                             viewBox="0 0 16 16"
//                             role="img"
//                             aria-label="ProductIcon"
//                             className="sc-fQpRED cOkelz ui-icon"
//                           >
//                             <path
//                               fill="currentColor"
//                               fill-rule="evenodd"
//                               d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
//                               clip-rule="evenodd"
//                             ></path>
//                           </svg>
//                         </div>
//                       )}
//                       <span
//                         className={`cursor-pointer ${
//                           item.type === "product" ? "hover:text-blue-600" : ""
//                         } text-gray-700 text-[16px]`}
//                         onClick={(e) => {
//                           if (item.type === "product") {
//                             e.stopPropagation();
//                             handleProductSelection(item);
//                           }
//                         }}
//                       >
//                         {item.name}
//                       </span>
//                     </div>
//                   </div>

//                   {item.level === 0 && (
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         handleCreateComponentClick(item.id);
//                       }}
//                       className="ml-2 p-1 hover:bg-gray-200 rounded-full"
//                     >
//                     <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
//                     </button>
//                   )}
//                   {creatingComponentForProduct === item.id && (
//                     <>
//                       <Input
//                         type="text"
//                         placeholder="Enter component name"
//                         value={newComponentName}
//                         onChange={(e) => setNewComponentName(e.target.value)}
//                         className="ml-2 w-48"
//                       />
//                       <Button
//                         size="sm"
//                         onClick={() => handleSaveNewComponent(item.id)}
//                       >
//                         Save
//                       </Button>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={handleCancelNewComponent}
//                       >
//                         Cancel
//                       </Button>
//                     </>
//                   )}
//                 </div>

//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
//                   {item.data.status || ""}
//                 </div>
//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.progress !== undefined
//                     ? `${item.data.progress}%`
//                     : ""}
//                 </div>
//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.team || ""}
//                 </div>
//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.days !== undefined ? item.data.days : ""}
//                 </div>
//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.startDate || ""}-{item.data.targetDate || ""}
//                 </div>
//                 {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.targetDate || ""}
//                 </div> */}
//                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
//                   {item.data.completedOn || ""}
//                 </div>
//                 <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
//                   <span>{item.data.remarks || ""}</span>
//                 </div>
//               </div>
//               {item.children &&
//                 isExpanded(item.type, item.id) &&
//                 renderChildren(item.children)}
//             </div>
//           ))}
//         </div>

//         <div className="mt-2 bg-gray-100 px-6">
//           {creatingProduct ? (
//             <div className="flex py-2 items-center hover:bg-gray-50">
//               <div className="w-[600px] flex items-center gap-2">
//                 <Input
//                   type="text"
//                   placeholder="Enter product name"
//                   value={newProductName}
//                   onChange={(e) => setNewProductName(e.target.value)}
//                 />
//                 <Button size="sm" onClick={handleSaveNewProduct}>
//                   Save
//                 </Button>
//                 <Button
//                   size="sm"
//                   variant="outline"
//                   onClick={handleCancelNewProduct}
//                 >
//                   Cancel
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="bg-white-200 px-5">
//               <Button onClick={handleCreateProductClick}>
//                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
//                 Create Product
//               </Button>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }


// // "use client";

// // import { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabaseClient";
// // import {
// //   ChevronDown,
// //   ChevronRight, 
// // } from "lucide-react";
// // import { Input } from "@/components/ui/input";
// // import { Product, Component, Feature } from "@/app/types";
// // import { Button } from "@/components/ui/button";
// // import { useRouter } from "next/navigation";
// // import ProductDetailsPage from "./_components/productDetails";
// // import ComponentDetailsPage from "./_components/componentDetails";
// // import FeatureDetailsPage from "./_components/featureDetails";
// // import { CreateFeatureModal } from "./_components/createFeatureModal";
// // import { CreateComponentModal } from "./_components/createComponentModal";

// // interface TableItem {
// //   type: "product" | "component" | "feature";
// //   id: string;
// //   name: string;
// //   level: number;
// //   data: Product | Component | Feature;
// //   children?: TableItem[];
// // }

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
// //       <div key={child.id}>
// //         <div
// //           className={`flex py-2 px-1 items-center  ${child.level=== 2 ?'bg-[#fff]' : 'bg-[#cce4fc]'}  border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// //         >
// //           <div
// //             className={`${child.level=== 2 ?'w-[563px] min-w-[433px] max-w-[433px]':'w-[436px] min-w-[435px] max-w-[435px]'}  flex items-center gap-2 `}
// //             style={{ paddingLeft: `${16 + child.level * 16}px` }}
// //           >
// //             <div
// //               className="flex items-center gap-2 cursor-pointer w-full"
// //               onClick={() => {
// //                 if (child.type === "product" || child.type === "component") {
// //                   if (child.type === "product" || child.type === "component") {
// //                     toggleExpand(child.type, child.id, child.data);
// //                   }
// //                 }
// //               }}
// //             >
// //               {child.level < 2 &&
// //                 (isExpanded(child.type, child.id) ? (
// //                   <ChevronDown size={18} className="text-gray-500" />
// //                 ) : (
// //                   <ChevronRight size={18} className="text-gray-500" />
// //                 ))}
// //               <div
// //                 className={`flex items-center gap-2 cursor-pointer w-full ${
// //                   child.type === "component" || child.type === "feature"
// //                     ? "text-gray-500 text-[14px]"
// //                     : ""
// //                 }`}
// //                 onClick={(e) => {
// //                   if (child.type === "component") {
// //                     e.stopPropagation();
// //                     handleComponentSelection(child);
// //                   } else if (child.type === "feature") {
// //                     e.stopPropagation();
// //                     handleFeatureSelection(child);
// //                   }
// //                 }}
// //               >
// //                 {child.level === 1 && (
// //                   <span className="p-1 bg-white text-gray-500 rounded-md">
// //                     <svg
// //                       width="16"
// //                       height="16"
// //                       viewBox="0 0 24 24"
// //                       fill="none"
// //                       stroke="currentColor"
// //                       strokeWidth="2"
// //                     >
// //                       <rect x="3" y="3" width="7" height="7" rx="1" />
// //                       <rect x="14" y="3" width="7" height="7" rx="1" />
// //                       <rect x="3" y="14" width="7" height="7" rx="1" />
// //                       <rect x="14" y="14" width="7" height="7" rx="1" />
// //                     </svg>
// //                   </span>
// //                 )}
// //                 {child.level === 2 && (
// //                     <>

  
// //     <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// // new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// // ).toString() )&& 'text-[#ff4747]'} `}>
// //     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// //     </svg>
// //     </div>

// // </>

               
// //                 )}
// //                 <span
// //                   className={`cursor-pointer ${
// //                     child.type === "component"
// //                       ? "hover:text-blue-600"
// //                       : child.type === "feature"
// //                       ? "hover:text-blue-600"
// //                       : ""
// //                   } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%]  w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
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
// //                   {child.name}
// //                 </span>
// //               </div>
// //             </div>

// // {/* feature component */}
// //             {/* Add the Plus button only for components (level 1) to create features */}
// //             {child.level === 1 && (
// //               <button
// //                 onClick={(e) => {
// //                   e.stopPropagation();
// //                   handleCreateFeatureClick(child.id);
// //                 }}
// //                 className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// //               >
// //                  <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// //               </button>
// //             )}
// //           </div>
// //           <div className="w-[130px]   flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //             {child?.data?.status || "-"} 
// //           </div>
// //           <div className="w-[120px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //             { `${child?.data?.progress}%` ||"-"}
// //           </div>
// //           <div className="w-[144px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //             {child?.data?.team || "-"}
// //           </div>
// //           <div className="w-[112px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //             { child?.data?.days || "-"} 
// //           </div>
// //           <div className="w-[180px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// //             {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
// //           </div>

// //           <div
// //             className="w-[170px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// //  "
// //           >
// //             {child.data.completedOn || "-"}
// //           </div>
// //           <div
// //             className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// // "
// //           >
// //             <span>{child.data.remarks || "-"}</span>
// //           </div>
// //         </div>
// //         {child.children &&
// //           isExpanded(child.type, child.id) &&
// //           renderChildren(child.children)}

// //         {child.level === 1 &&
// //           creatingComponentForProduct === `AFTER_${child.id}` && (
// //             <div
// //               className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
// //               style={{ paddingLeft: `${16 + child.level * 16}px` }}
// //             >
// //               <div className="w-[600px] flex items-center gap-2">
// //                 <Input
// //                   type="text"
// //                   placeholder="Enter component name"
// //                   value={newComponentName}
// //                   onChange={(e) => setNewComponentName(e.target.value)}
// //                   className="w-48"
// //                 />
// //                 <Button
// //                   size="sm"
// //                   onClick={() => {
// //                     const productId = tableData.find((p) =>
// //                       p.children?.some((c) => c.id === child.id)
// //                     )?.id;
// //                     if (productId) {
// //                       handleSaveNewComponent(productId);
// //                     }
// //                   }}
// //                 >
// //                   Save
// //                 </Button>
// //                 <Button
// //                   size="sm"
// //                   variant="outline"
// //                   onClick={handleCancelNewComponent}
// //                 >
// //                   Cancel
// //                 </Button>
// //               </div>
// //             </div>
// //           )}
// //       </div>
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
// //             productId={selectedProduct.data.id} // Pass the ID to fetch details within ProductDetailsPage
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
// //             <div className="w-[80px]    justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               Status
// //             </div>
// //             <div className="w-[80px]   justify-center text-center  text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //               Progress
// //             </div>
// //             <div className="w-[100px]   flex justify-center text-center  text-[13px] font-bold flex-row  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <div className="flex-row flex">
// //                     <img className="w-[16px] h-[16px] mr-1" src="/person.svg"></img>Team
// //                 </div>
// //             </div>
// //             <div className="w-[72px]   flex  text-center text-[13px] font-bold flex-row   whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1"></img> Days
// //             </div>
// //             <div className="w-[144px]   flex justify-center text-center text-[13px] font-bold flex-row   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg"></img> Target span
// //             </div>
// //             {/* <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[13px] font-bol flex-row flex mx-auto">
// //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img>Target Date
// //             </div> */}
// //             <div className="w-[144px]   justify-center text-center  text-[13px] font-bold flex-row flex  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Completion Time
// //             </div>
// //             <div className="w-[100px] text-center  text-[13px] font-bold flex-row flex   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// //              <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Remarks
// //             </div>
// //           </div>
// //         </div>

// //         <div className="divide-y bg-white px-6">
// //           {tableData.map((item) => (
// //             <div key={item.id}>
// //               <div
// //                 className={` flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
// //                   selectedProduct?.id === item.id ? "bg-blue-50" : ""
// //                 }`}
// //                 style={{ paddingLeft: `${16 + item.level * 16}px` }}
// //               >
// //                 <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2   " 
// //     >
// //                   <div
// //                     className="flex items-center gap-2 cursor-pointer w-full"
// //                     onClick={() => toggleExpand(item.type, item.id, item.data)}
// //                   >
// //                     {item.level < 2 &&
// //                       (isExpanded(item.type, item.id) ? (
// //                         <ChevronDown size={18} className="text-gray-500" />
// //                       ) : (
// //                         <ChevronRight size={18} className="text-gray-500" />
// //                       ))}

// //                     <div className="flex items-center gap-2 text-gray-800 bg-white">
// //                       {item.level === 0 && (
// //                         <div className="p-1 bg-white text-gray-400 rounded-md">
// //                           <svg
// //                             height="16px"
// //                             width="16px"
// //                             viewBox="0 0 16 16"
// //                             role="img"
// //                             aria-label="ProductIcon"
// //                             className="sc-fQpRED cOkelz ui-icon"
// //                           >
// //                             <path
// //                               fill="currentColor"
// //                               fill-rule="evenodd"
// //                               d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// //                               clip-rule="evenodd"
// //                             ></path>
// //                           </svg>
// //                         </div>
// //                       )}
// //                       <span
// //                         className={`cursor-pointer ${
// //                           item.type === "product" ? "hover:text-blue-600" : ""
// //                         } text-gray-700 text-[16px]`}
// //                         onClick={(e) => {
// //                           if (item.type === "product") {
// //                             e.stopPropagation();
// //                             handleProductSelection(item);
// //                           }
// //                         }}
// //                       >
// //                         {item.name}
// //                       </span>
// //                     </div>
// //                   </div>

// //                   {item.level === 0 && (
// //                     <button
// //                       onClick={(e) => {
// //                         e.stopPropagation();
// //                         handleCreateComponentClick(item.id);
// //                       }}
// //                       className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// //                     >
// //                     <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// //                     </button>
// //                   )}
// //                   {creatingComponentForProduct === item.id && (
// //                     <>
// //                       <Input
// //                         type="text"
// //                         placeholder="Enter component name"
// //                         value={newComponentName}
// //                         onChange={(e) => setNewComponentName(e.target.value)}
// //                         className="ml-2 w-48"
// //                       />
// //                       <Button
// //                         size="sm"
// //                         onClick={() => handleSaveNewComponent(item.id)}
// //                       >
// //                         Save
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         variant="outline"
// //                         onClick={handleCancelNewComponent}
// //                       >
// //                         Cancel
// //                       </Button>
// //                     </>
// //                   )}
// //                 </div>

// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
// //                   {item.data.status || ""}
// //                 </div>
// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                   {item.data.progress !== undefined
// //                     ? `${item.data.progress}%`
// //                     : ""}
// //                 </div>
// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                   {item.data.team || ""}
// //                 </div>
// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                   {item.data.days !== undefined ? item.data.days : ""}
// //                 </div>
// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                   {item.data.startDate || ""}-{item.data.targetDate || ""}
// //                 </div>
              
// //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// //                   {item.data.completedOn || ""}
// //                 </div>
// //                 <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
// //                   <span>{item.data.remarks || ""}</span>
// //                 </div>
// //               </div>
// //               {item.children &&
// //                 isExpanded(item.type, item.id) &&
// //                 renderChildren(item.children)}
// //             </div>
// //           ))}
// //         </div>

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
// //                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// //                 Create Product
// //               </Button>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }



"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import ProductDetailsPage from "./_components/productDetails";
import ComponentDetailsPage from "./_components/componentDetails";
import FeatureDetailsPage from "./_components/featureDetails";
import { CreateFeatureModal } from "./_components/createFeatureModal";
import { CreateComponentModal } from "./_components/createComponentModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"; // shadcn table components
import { Product } from "@/app/types";

interface TableItem {
  type: "product" | "component" | "feature";
  id: string;
  name: string;
  level: number;
  data: any;
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

interface CreateFeatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentId: string | null;
  onFeatureCreated: (feature: any, componentId: string) => void;
}

export default function ProductTable({
  selectedProductIds,
}: ProductTableProps) {
  const [allTableData, setAllTableData] = useState<TableItem[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [isCreateComponentModalOpen, setIsCreateComponentModalOpen] = useState(false);
  const [selectedProductIdForComponent, setSelectedProductIdForComponent] = useState<string | null>(null);
  const [isCreateFeatureModalOpen, setIsCreateFeatureModalOpen] = useState(false);
  const [selectedComponentIdForFeature, setSelectedComponentIdForFeature] = useState<string | null>(null);
  const [creatingProduct, setCreatingProduct] = useState(false);
  const [newProductName, setNewProductName] = useState("");
  const [creatingComponentForProduct, setCreatingComponentForProduct] = useState<string | null>(null);
  const [newComponentName, setNewComponentName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<TableItem | null>(null);
  const [isProductDetailOpen, setIsProductDetailOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<TableItem | null>(null);
  const [isComponentDetailOpen, setIsComponentDetailOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<TableItem | null>(null);
  const [isFeatureDetailOpen, setIsFeatureDetailOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedProductIds.length > 0) {
      const filteredData = allTableData.filter(
        (item) => item.type === "product" && selectedProductIds.includes(item.id)
      );
      setTableData(filteredData);
    } else {
      setTableData(allTableData);
    }
  }, [selectedProductIds, allTableData]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase.from("products").select("*").neq("name", "Sample Product 1");
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
  };

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

  const handleCreateComponentClick = (productId: string) => {
    setSelectedProductIdForComponent(productId);
    setIsCreateComponentModalOpen(true);
  };

  const handleCreateFeatureClick = (componentId: string) => {
    setSelectedComponentIdForFeature(componentId);
    setIsCreateFeatureModalOpen(true);
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

  const handleSaveNewProduct = () => {
    if (newProductName.trim()) {
      createNewProduct(newProductName.trim());
    }
  };

  const handleCancelNewProduct = () => {
    setCreatingProduct(false);
    setNewProductName("");
  };

  const createNewProduct = async (name: string) => {
    try {
      const { data, error } = await supabase.from("products").insert([{ name }]).select();
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
  };

  const createNewComponent = async (newComponent: any, productId: string) => {
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
          item.id === productId ? { ...item, children: [...(item.children || []), newComponentItem] } : item
        )
      );

      setAllTableData((prevData) =>
        prevData.map((item) =>
          item.id === productId ? { ...item, children: [...(item.children || []), newComponentItem] } : item
        )
      );

      setExpandedItems((prev) => ({ ...prev, [`product-${productId}`]: true }));
      setCreatingComponentForProduct(null);
      setNewComponentName("");
    } catch (error) {
      console.error("Error handling component creation:", error);
    }
  };

  const createNewFeature = async (newFeature: any, componentId: string) => {
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
                child.id === componentId ? { ...child, children: [...(child.children || []), newFeatureItem] } : child
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
                child.id === componentId ? { ...child, children: [...(child.children || []), newFeatureItem] } : child
              ),
            }
          : item
      )
    );

    setExpandedItems((prev) => {
      const updatedExpanded = { ...prev };
      const parentProduct = allTableData.find((p) => p.children?.some((c) => c.id === componentId));
      if (parentProduct) {
        updatedExpanded[`product-${parentProduct.id}`] = true;
        updatedExpanded[`component-${componentId}`] = true;
      }
      return updatedExpanded;
    });

    setIsCreateFeatureModalOpen(false);
    setSelectedComponentIdForFeature(null);
  };


  
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

  const toggleExpand = async (type: string, id: string, data: any) => {
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
            prevData.map((item) => (item.id === id ? { ...item, children: components } : item))
          );
          setAllTableData((prevAllData) =>
            prevAllData.map((item) => (item.id === id ? { ...item, children: components } : item))
          );
        }
      } else if (type === "component") {
        const component = tableData.find((item) => item.id === id);
        if (!component?.children || component.children.length === 0) {
          const features = await fetchFeatures(id);
          setTableData((prevData) =>
            prevData.map((item) => ({
              ...item,
              children: item.children?.map((child) => (child.id === id ? { ...child, children: features } : child)),
            }))
          );
          setAllTableData((prevData) =>
            prevData.map((item) => ({
              ...item,
              children: item.children?.map((child) => (child.id === id ? { ...child, children: features } : child)),
            }))
          );
        }
      }
    }
  };

  const isExpanded = (type: string, id: string) => {
    return !!expandedItems[`${type}-${id}`];
  };

  return (
    <div className="w-full flex">
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

        <Table className="border-b">
          <TableHeader>
            <TableRow>
              <TableHead>Products, Components, Features</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Target span</TableHead>
              <TableHead>Completion Time</TableHead>
              <TableHead>Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.data.status || "-"}</TableCell>
                <TableCell>{item.data.progress || "-"}</TableCell>
                <TableCell>{item.data.team || "-"}</TableCell>
                <TableCell>{item.data.days || "-"}</TableCell>
                <TableCell>{`${item.data.startDate || ""} - ${item.data.targetDate || ""}`}</TableCell>
                <TableCell>{item.data.completedOn || "-"}</TableCell>
                <TableCell>{item.data.remarks || "-"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
                <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
                Create Product
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
