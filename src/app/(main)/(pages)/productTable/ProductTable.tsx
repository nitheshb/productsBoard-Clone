
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
// // //   teamFilter?: string[];
// // //   statusFilter?: string[];
// // //   startDateFilter?: Date;
// // //   endDateFilter?: Date;
// // // }

// // // interface CreateComponentModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   productId: string | null;
// // //   onComponentCreated: (component: any, productId: string) => void;
// // // }

// // // interface CreateFeatureModalProps {
// // //   isOpen: boolean;
// // //   onClose: () => void;
// // //   componentId: string | null;
// // //   onFeatureCreated: (feature: any, componentId: string) => void;
// // // }

// // // export default function ProductTable({
// // //   selectedProductIds,
// // //   teamFilter = [],
// // //   statusFilter = [],
// // //   startDateFilter,
// // //   endDateFilter,
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

// // //   // Fetch initial data
// // //   useEffect(() => {
// // //     fetchProducts();
// // //   }, []);

// // //   // Apply filters when they change
// // //   useEffect(() => {
// // //     filterTableData();
// // //   }, [selectedProductIds, teamFilter, statusFilter, startDateFilter, endDateFilter, allTableData]);

// // //   // Fetch products from database
// // //   async function fetchProducts() {
// // //     try {
// // //       setLoading(true);
// // //       // Fetch products
// // //       const { data: productsData, error: productsError } = await supabase
// // //         .from("products")
// // //         .select("*")
// // //         .neq("name", "Sample Product 1");

// // //       if (productsError) throw productsError;

// // //       // Prepare table data
// // //       const initialTableData: TableItem[] = productsData.map((product) => ({
// // //         type: "product" as const,
// // //         id: product.id,
// // //         name: product.name || "Product",
// // //         level: 0,
// // //         data: product,
// // //       }));

// // //       setAllTableData(initialTableData);
      
// // //       // Initial filter application
// // //       filterTableData(initialTableData);
// // //     } catch (error) {
// // //       console.error("Error fetching products:", error);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   // Get unique team names from the database
// // //   async function fetchTeamOptions() {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("features")
// // //         .select("team")
// // //         .not("team", "is", null);

// // //       if (error) throw error;

// // //       // Extract unique team names
// // //       const teamSet = new Set(data.map(item => item.team));
// // //       return Array.from(teamSet);
// // //     } catch (error) {
// // //       console.error("Error fetching team options:", error);
// // //       return [];
// // //     }
// // //   }

// // //   // Get unique statuses from the database
// // //   async function fetchStatusOptions() {
// // //     try {
// // //       const { data, error } = await supabase
// // //         .from("features")
// // //         .select("status")
// // //         .not("status", "is", null);

// // //       if (error) throw error;

// // //       // Extract unique statuses
// // //       const statusSet = new Set(data.map(item => item.status));
// // //       return Array.from(statusSet);
// // //     } catch (error) {
// // //       console.error("Error fetching status options:", error);
// // //       return [];
// // //     }
// // //   }

// // //   // Apply all filters
// // //   function filterTableData(baseData = allTableData) {
// // //     let filtered = [...baseData];
    
// // //     // Filter by selected product IDs
// // //     if (selectedProductIds.length > 0) {
// // //       filtered = filtered.filter(item => 
// // //         item.type === "product" && selectedProductIds.includes(item.id)
// // //       );
// // //     }

// // //     // Apply team filter to features
// // //     if (teamFilter && teamFilter.length > 0) {
// // //       filtered = filtered.map(product => {
// // //         // Apply team filter to nested data structure
// // //         return applyNestedTeamFilter(product, teamFilter);
// // //       }).filter(product => {
// // //         // Remove products with no matching components/features after team filtering
// // //         if (!product.children || !Array.isArray(product.children)) return true;
// // //         return product.children.length > 0;
// // //       });
// // //     }

// // //     // Apply status filter to features
// // //     if (statusFilter && statusFilter.length > 0) {
// // //       filtered = filtered.map(product => {
// // //         // Apply status filter to nested data structure
// // //         return applyNestedStatusFilter(product, statusFilter);
// // //       }).filter(product => {
// // //         // Remove products with no matching components/features after status filtering
// // //         if (!product.children || !Array.isArray(product.children)) return true;
// // //         return product.children.length > 0;
// // //       });
// // //     }

// // //     // Apply date filter with special handling for today's date
// // //     if (startDateFilter || endDateFilter) {
// // //       const isTodaySelected = startDateFilter && isToday(startDateFilter);
      
// // //       // If today's date is selected, filter to show only Todo and In Progress items
// // //       if (isTodaySelected) {
// // //         filtered = filtered.map(product => {
// // //           return applyNestedTodayFilter(product);
// // //         }).filter(product => {
// // //           if (!product.children || !Array.isArray(product.children)) return true;
// // //           return product.children.length > 0;
// // //         });
// // //       } else {
// // //         // Regular date range filtering
// // //         filtered = filtered.map(product => {
// // //           return applyNestedDateFilter(product, startDateFilter, endDateFilter);
// // //         }).filter(product => {
// // //           if (!product.children || !Array.isArray(product.children)) return true;
// // //           return product.children.length > 0;
// // //         });
// // //       }
// // //     }

// // //     setTableData(filtered);
// // //   }
  
// // //   // Helper function to check if a date is today
// // //   function isToday(date: Date): boolean {
// // //     const today = new Date();
// // //     return date.getDate() === today.getDate() &&
// // //       date.getMonth() === today.getMonth() &&
// // //       date.getFullYear() === today.getFullYear();
// // //   }

// // //   // Helper function to apply team filter to nested structure
// // //   function applyNestedTeamFilter(item: TableItem, teams: string[]): TableItem {
// // //     // If it's a feature, check if its team matches
// // //     if (item.type === "feature") {
// // //       if (teams.includes(item.data.team || "")) {
// // //         return item;
// // //       }
// // //       return null as unknown as TableItem; // Ensure type compatibility
// // //     }
    
// // //     // If it has children, filter them
// // //     if (item.children && Array.isArray(item.children)) {
// // //       const filteredChildren = item.children
// // //         .map(child => applyNestedTeamFilter(child, teams))
// // //         .filter(Boolean);
      
// // //       return {
// // //         ...item,
// // //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// // //       };
// // //     }
    
// // //     // If no children and not a feature, keep as is
// // //     return item;
// // //   }

// // //   // Helper function to apply status filter to nested structure
// // //   function applyNestedStatusFilter(item: TableItem, statuses: string[]): TableItem {
// // //     // If it's a feature, check if its status matches
// // //     if (item.type === "feature") {
// // //       if(statuses.includes(item.data.status || "")) {
// // //         return item;
// // //       }
// // //       return null as unknown as TableItem; // Ensure type compatibility
// // //     }
    
// // //     // If it has children, filter them
// // //     if (item.children && Array.isArray(item.children)) {
// // //       const filteredChildren = item.children
// // //         .map(child => applyNestedStatusFilter(child, statuses))
// // //         .filter(Boolean);
      
// // //       return {
// // //         ...item,
// // //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// // //       };
// // //     }
    
// // //     // If no children and not a feature, keep as is
// // //     return item;
// // //   }
  
// // //   // Helper function to filter items for today's date - show only Todo and In Progress items
// // //   function applyNestedTodayFilter(item: TableItem): TableItem {
// // //     // If it's a feature, check if its status is Todo or In Progress
// // //     if (item.type === "feature") {
// // //       if (item.data.status === "Todo" || item.data.status === "In Progress") {
// // //         return item;
// // //       }
// // //       return null as unknown as TableItem;
// // //     }
    
// // //     // If it has children, filter them
// // //     if (item.children && Array.isArray(item.children)) {
// // //       const filteredChildren = item.children
// // //         .map(child => applyNestedTodayFilter(child))
// // //         .filter(Boolean);
      
// // //       return {
// // //         ...item,
// // //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// // //       };
// // //     }
    
// // //     // If no children and not a feature, keep as is
// // //     return item;
// // //   }

// // //   // Helper function to apply date filter to nested structure
// // //   function applyNestedDateFilter(item: TableItem, startDate?: Date, endDate?: Date): TableItem {
// // //     if (!startDate && !endDate) return item;
    
// // //     // If it's a feature, check date range
// // //     if (item.type === "feature") {
// // //       const featureStartDate = item.data.startDate ? new Date(item.data.startDate) : null;
// // //       const featureEndDate = item.data.targetDate ? new Date(item.data.targetDate) : null;
      
// // //       // Skip items without dates
// // //       if (!featureStartDate && !featureEndDate) return item;
      
// // //       // Check date ranges
// // //       let isInRange = true;
// // //       if (startDate && featureStartDate) {
// // //         isInRange = isInRange && featureStartDate >= startDate;
// // //       }
// // //       if (endDate && featureEndDate) {
// // //         isInRange = isInRange && featureEndDate <= endDate;
// // //       }
      
// // //       if (isInRange) {
// // //         return item;
// // //       }
      
// // //       return null as unknown as TableItem;
// // //     }
    
// // //     // If it has children, filter them
// // //     if (item.children && Array.isArray(item.children)) {
// // //       const filteredChildren = item.children
// // //         .map(child => applyNestedDateFilter(child, startDate, endDate))
// // //         .filter(Boolean);
      
// // //       return {
// // //         ...item,
// // //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// // //       };
// // //     }
    
// // //     // If no children and not a feature, keep as is
// // //     return item;
// // //   }

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
// // //     return children.map((child) => (
// // //       <div key={child.id}>
// // //         <div
// // //           className={`flex py-2 px-1 items-center  ${child.level=== 2 ?'bg-[#fff]' : 'bg-[#cce4fc]'}  border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
// // //         >
// // //           <div
// // //             className={`${child.level=== 2 ?'w-[563px] min-w-[433px] max-w-[433px]':'w-[436px] min-w-[435px] max-w-[435px]'}  flex items-center gap-2 `}
// // //             style={{ paddingLeft: `${16 + child.level * 16}px` }}
// // //           >
// // //             <div
// // //               className="flex items-center gap-2 cursor-pointer w-full"
// // //               onClick={() => {
// // //                 if (child.type === "product" || child.type === "component") {
// // //                   if (child.type === "product" || child.type === "component") {
// // //                     toggleExpand(child.type, child.id, child.data);
// // //                   }
// // //                 }
// // //               }}
// // //             >
// // //               {child.level < 2 &&
// // //                 (isExpanded(child.type, child.id) ? (
// // //                   <ChevronDown size={18} className="text-gray-500" />
// // //                 ) : (
// // //                   <ChevronRight size={18} className="text-gray-500" />
// // //                 ))}
// // //               <div
// // //                 className={`flex items-center gap-2 cursor-pointer w-full ${
// // //                   child.type === "component" || child.type === "feature"
// // //                     ? "text-gray-500 text-[14px]"
// // //                     : ""
// // //                 }`}
// // //                 onClick={(e) => {
// // //                   if (child.type === "component") {
// // //                     e.stopPropagation();
// // //                     handleComponentSelection(child);
// // //                   } else if (child.type === "feature") {
// // //                     e.stopPropagation();
// // //                     handleFeatureSelection(child);
// // //                   }
// // //                 }}
// // //               >
// // //                 {child.level === 1 && (
// // //                   <span className="p-1 bg-white text-gray-500 rounded-md">
// // //                     <svg
// // //                       width="16"
// // //                       height="16"
// // //                       viewBox="0 0 24 24"
// // //                       fill="none"
// // //                       stroke="currentColor"
// // //                       strokeWidth="2"
// // //                     >
// // //                       <rect x="3" y="3" width="7" height="7" rx="1" />
// // //                       <rect x="14" y="3" width="7" height="7" rx="1" />
// // //                       <rect x="3" y="14" width="7" height="7" rx="1" />
// // //                       <rect x="14" y="14" width="7" height="7" rx="1" />
// // //                     </svg>
// // //                   </span>
// // //                 )}
// // //                 {child.level === 2 && (
// // //                     <>
// // //                   <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// // // new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// // // ).toString() )&& 'text-[#ff4747]'} `}>
// // //                     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// // //                     </svg>
// // //                     </div>
// // //                 </>
// // //                 )}
// // //                 <span
// // //                   className={`cursor-pointer ${
// // //                     child.type === "component"
// // //                       ? "hover:text-blue-600"
// // //                       : child.type === "feature"
// // //                       ? "hover:text-blue-600"
// // //                       : ""
// // //                   } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%]  w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
// // //                   onClick={(e) => {
// // //                     if (child.type === "component") {
// // //                       e.stopPropagation();
// // //                       handleComponentSelection(child);
// // //                     } else if (child.type === "feature") {
// // //                       e.stopPropagation();
// // //                       handleFeatureSelection(child);
// // //                     }
// // //                   }}
// // //                 >
// // //                   {child.name}
// // //                 </span>
// // //               </div>
// // //             </div>

// // //             {/* Add the Plus button only for components (level 1) to create features */}
// // //             {child.level === 1 && (
// // //               <button
// // //                 onClick={(e) => {
// // //                   e.stopPropagation();
// // //                   handleCreateFeatureClick(child.id);
// // //                 }}
// // //                 className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // //               >
// // //                  <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // //               </button>
// // //             )}
// // //           </div>
// // //           <div className="w-[130px]   flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {child?.data?.status || "-"} 
// // //           </div>
// // //           <div className="w-[120px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             { `${child?.data?.progress}%` ||"-"}
// // //           </div>
// // //           <div className="w-[144px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             {child?.data?.team || "-"}
// // //           </div>
// // //           <div className="w-[112px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //             { child?.data?.days || "-"} 
// // //           </div>
// // //           <div className="w-[180px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)] whitespace-nowrap">
// // //             {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
// // //           </div>
// // //           <div
// // //             className="w-[170px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// // //  "
// // //           >
// // //             {child.data.completedOn || "-"}
// // //           </div>
// // //           <div
// // //             className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
// // // "
// // //           >
// // //             <span>{child.data.remarks || "-"}</span>
// // //           </div>
// // //         </div>
// // //         {child.children &&
// // //           isExpanded(child.type, child.id) &&
// // //           renderChildren(child.children)}

// // //         {child.level === 1 &&
// // //           creatingComponentForProduct === `AFTER_${child.id}` && (
// // //             <div
// // //               className="flex py-3 px-4 items-center hover:bg-gray-50 border-b border-gray-100"
// // //               style={{ paddingLeft: `${16 + child.level * 16}px` }}
// // //             >
// // //               <div className="w-[600px] flex items-center gap-2">
// // //                 <Input
// // //                   type="text"
// // //                   placeholder="Enter component name"
// // //                   value={newComponentName}
// // //                   onChange={(e) => setNewComponentName(e.target.value)}
// // //                   className="w-48"
// // //                 />
// // //                 <Button
// // //                   size="sm"
// // //                   onClick={() => {
// // //                     const productId = tableData.find((p) =>
// // //                       p.children?.some((c) => c.id === child.id)
// // //                     )?.id;
// // //                     if (productId) {
// // //                       handleSaveNewComponent(productId);
// // //                     }
// // //                   }}
// // //                 >
// // //                   Save
// // //                 </Button>
// // //                 <Button
// // //                   size="sm"
// // //                   variant="outline"
// // //                   onClick={handleCancelNewComponent}
// // //                 >
// // //                   Cancel
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           )}
// // //       </div>
// // //     ));
// // //   };

// // //   if (loading) {
// // //     return <div className="flex justify-center p-10">Loading products...</div>;
// // //   }

// // //   return (
// // //     <div className="w-full flex">
// // //       {/* Left Side - Product Table */}
// // //       <div className="w-full transition-all duration-300">
// // //         <CreateFeatureModal
// // //           isOpen={isCreateFeatureModalOpen}
// // //           onClose={() => setIsCreateFeatureModalOpen(false)}
// // //           componentId={selectedComponentIdForFeature}
// // //           onFeatureCreated={createNewFeature}
// // //         />

// // //         <CreateComponentModal
// // //           isOpen={isCreateComponentModalOpen}
// // //           onClose={() => setIsCreateComponentModalOpen(false)}
// // //           productId={selectedProductIdForComponent}
// // //           onComponentCreated={createNewComponent}
// // //         />

// // //         {selectedProduct && (
// // //           <ProductDetailsPage
// // //             productId={selectedProduct.data.id}
// // //             isOpen={isProductDetailOpen}
// // //             onClose={handleCloseProductDetails}
// // //             onProductUpdated={handleProductUpdate}
// // //           />
// // //         )}

// // //         {selectedComponent && (
// // //           <ComponentDetailsPage
// // //             componentId={selectedComponent.data.id}
// // //             isOpen={isComponentDetailOpen}
// // //             onClose={handleCloseComponentDetails}
// // //           />
// // //         )}

// // //         {selectedFeature && (
// // //           <FeatureDetailsPage
// // //             featureId={selectedFeature.data.id}
// // //             isOpen={isFeatureDetailOpen}
// // //             onClose={handleCloseFeatureDetails}
// // //           />
// // //         )}

// // //         <div className="bg-gray-100 border-b px-5">
// // //           <div className="flex py-3 px-2 font-medium text-gray-700 gap-x-4 ">
// // //             <div className="w-[417px] text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Products, Components, Features
// // //             </div>
// // //             <div className="w-[80px]    justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Status
// // //             </div>
// // //             <div className="w-[80px]   justify-center text-center  text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //               Progress
// // //             </div>
// // //             <div className="w-[100px]   flex justify-center text-center  text-[13px] font-bold flex-row  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <div className="flex-row flex">
// // //                     <img className="w-[16px] h-[16px] mr-1" src="/person.svg"></img>Team
// // //                 </div>
// // //             </div>
// // //             <div className="w-[72px]   flex  text-center text-[13px] font-bold flex-row   whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1"></img> Days
// // //             </div>
// // //             <div className="w-[144px]   flex justify-center text-center text-[13px] font-bold flex-row   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/clock.svg"></img> Target span
// // //             </div>
// // //             <div className="w-[144px]   justify-center text-center  text-[13px] font-bold flex-row flex  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Completion Time
// // //             </div>
// // //             <div className="w-[100px] text-center  text-[13px] font-bold flex-row flex   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
// // //              <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Remarks
// // //             </div>
// // //           </div>
// // //         </div>

// // //         <div className="divide-y bg-white px-6">
// // //           {tableData.map((item) => (
// // //             <div key={item.id}>
// // //               <div
// // //                 className={` flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
// // //                   selectedProduct?.id === item.id ? "bg-blue-50" : ""
// // //                 }`}
// // //                 style={{ paddingLeft: `${16 + item.level * 16}px` }}
// // //               >
// // //                 <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2   " 
// // //     >
// // //                   <div
// // //                     className="flex items-center gap-2 cursor-pointer w-full"
// // //                     onClick={() => toggleExpand(item.type, item.id, item.data)}
// // //                   >
// // //                     {item.level < 2 &&
// // //                       (isExpanded(item.type, item.id) ? (
// // //                         <ChevronDown size={18} className="text-gray-500" />
// // //                       ) : (
// // //                         <ChevronRight size={18} className="text-gray-500" />
// // //                       ))}

// // //                     <div className="flex items-center gap-2 text-gray-800 bg-white">
// // //                       {item.level === 0 && (
// // //                         <div className="p-1 bg-white text-gray-400 rounded-md">
// // //                           <svg
// // //                             height="16px"
// // //                             width="16px"
// // //                             viewBox="0 0 16 16"
// // //                             role="img"
// // //                             aria-label="ProductIcon"
// // //                             className="sc-fQpRED cOkelz ui-icon"
// // //                           >
// // //                             <path
// // //                               fill="currentColor"
// // //                               fill-rule="evenodd"
// // //                               d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
// // //                               clip-rule="evenodd"
// // //                             ></path>
// // //                           </svg>
// // //                         </div>
// // //                       )}
// // //                       <span
// // //                         className={`cursor-pointer ${
// // //                           item.type === "product" ? "hover:text-blue-600" : ""
// // //                         } text-gray-700 text-[16px]`}
// // //                         onClick={(e) => {
// // //                           if (item.type === "product") {
// // //                             e.stopPropagation();
// // //                             handleProductSelection(item);
// // //                           }
// // //                         }}
// // //                       >
// // //                         {item.name}
// // //                       </span>
// // //                     </div>
// // //                   </div>

// // //                   {item.level === 0 && (
// // //                     <button
// // //                       onClick={(e) => {
// // //                         e.stopPropagation();
// // //                         handleCreateComponentClick(item.id);
// // //                       }}
// // //                       className="ml-2 p-1 hover:bg-gray-200 rounded-full"
// // //                     >
// // //                     <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // //                     </button>
// // //                   )}
// // //                   {creatingComponentForProduct === item.id && (
// // //                     <>
// // //                       <Input
// // //                         type="text"
// // //                         placeholder="Enter component name"
// // //                         value={newComponentName}
// // //                         onChange={(e) => setNewComponentName(e.target.value)}
// // //                         className="ml-2 w-48"
// // //                       />
// // //                       <Button
// // //                         size="sm"
// // //                         onClick={() => handleSaveNewComponent(item.id)}
// // //                       >
// // //                         Save
// // //                       </Button>
// // //                       <Button
// // //                         size="sm"
// // //                         variant="outline"
// // //                         onClick={handleCancelNewComponent}
// // //                       >
// // //                         Cancel
// // //                       </Button>
// // //                     </>
// // //                   )}
// // //                 </div>

// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
// // //                   {item.data.status || ""}
// // //                 </div>
// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                   {item.data.progress !== undefined
// // //                     ? `${item.data.progress}%`
// // //                     : ""}
// // //                 </div>
// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                   {item.data.team || ""}
// // //                 </div>
// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                   {item.data.days !== undefined ? item.data.days : ""}
// // //                 </div>
// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                   {item.data.startDate || ""}-{item.data.targetDate || ""}
// // //                 </div>
// // //                 <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
// // //                   {item.data.completedOn || ""}
// // //                 </div>
// // //                 <div className="w-[300px] text-[14px] text-gray-700 whitespace-nowrap">
// // //                   <span>{item.data.remarks || ""}</span>
// // //                 </div>
// // //               </div>
// // //               {item.children &&
// // //                 isExpanded(item.type, item.id) &&
// // //                 renderChildren(item.children)}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <div className="mt-2 bg-gray-100 px-6">
// // //           {creatingProduct ? (
// // //             <div className="flex py-2 items-center hover:bg-gray-50">
// // //               <div className="w-[600px] flex items-center gap-2">
// // //                 <Input
// // //                   type="text"
// // //                   placeholder="Enter product name"
// // //                   value={newProductName}
// // //                   onChange={(e) => setNewProductName(e.target.value)}
// // //                 />
// // //                 <Button size="sm" onClick={handleSaveNewProduct}>
// // //                   Save
// // //                 </Button>
// // //                 <Button
// // //                   size="sm"
// // //                   variant="outline"
// // //                   onClick={handleCancelNewProduct}
// // //                 >
// // //                   Cancel
// // //                 </Button>
// // //               </div>
// // //             </div>
// // //           ) : (
// // //             <div className="bg-white-200 px-5">
// // //               <Button onClick={handleCreateProductClick}>
// // //                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
// // //                 Create Product
// // //               </Button>
// // //             </div>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }



// // import { useState, useEffect } from "react";
// // import { supabase } from "@/lib/supabaseClient";
// // import {
// //   ArrowLeft,
// //   ChevronDown,
// //   ChevronRight,
// //   Maximize2,
// //   Plus,
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
// //   teamFilter?: string[];
// //   statusFilter?: string[];
// //   startDateFilter?: Date;
// //   endDateFilter?: Date;
// // }



// // export default function ProductTable({
// //   selectedProductIds,
// //   teamFilter = [],
// //   statusFilter = [],
// //   startDateFilter,
// //   endDateFilter,
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

// //   // Fetch initial data
// //   useEffect(() => {
// //     fetchProducts();
// //   }, []);

// //   // Apply filters when they change
// //   useEffect(() => {
// //     filterTableData();
// //   }, [selectedProductIds, teamFilter, statusFilter, startDateFilter, endDateFilter, allTableData]);

// //   useEffect(() => {
// //     if (teamFilter && teamFilter.length > 0) {
// //       recalculateProgressForAllItems();
// //     }
// //   }, [teamFilter]);


// //   // Fetch products from database
// //   async function fetchProducts() {
// //     try {
// //       setLoading(true);
// //       // Fetch products
// //       const { data: productsData, error: productsError } = await supabase
// //         .from("products")
// //         .select("*")
// //         .neq("name", "Sample Product 1");

// //       if (productsError) throw productsError;

// //       // Prepare table data
// //       const initialTableData: TableItem[] = productsData.map((product) => ({
// //         type: "product" as const,
// //         id: product.id,
// //         name: product.name || "Product",
// //         level: 0,
// //         data: product,
// //       }));

// //       setAllTableData(initialTableData);
      
// //       // Initial filter application
// //       filterTableData(initialTableData);
// //     } catch (error) {
// //       console.error("Error fetching products:", error);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   // Get unique team names from the database
// //   async function fetchTeamOptions() {
// //     try {
// //       const { data, error } = await supabase
// //         .from("features")
// //         .select("team")
// //         .not("team", "is", null);

// //       if (error) throw error;

// //       // Extract unique team names
// //       const teamSet = new Set(data.map(item => item.team));
// //       return Array.from(teamSet);
// //     } catch (error) {
// //       console.error("Error fetching team options:", error);
// //       return [];
// //     }
// //   }

// //   // Helper function to calculate progress based on the feature status
// // const calculateProgressFromStatus = (status: string,): number => {
// //   switch (status) {
// //     case 'Completed':
// //       return 100;
// //     case 'In Progress':
// //       return 50;
// //     case 'Todo':
// //     default:
// //       return 0;
// //   }
// // };


// //   // Get unique statuses from the database
// //   async function fetchStatusOptions() {
// //     try {
// //       const { data, error } = await supabase
// //         .from("features")
// //         .select("status")
// //         .not("status", "is", null);

// //       if (error) throw error;

// //       // Extract unique statuses
// //       const statusSet = new Set(data.map(item => item.status));
// //       return Array.from(statusSet);
// //     } catch (error) {
// //       console.error("Error fetching status options:", error);
// //       return [];
// //     }
// //   }

// //   // Apply all filters
// //   function filterTableData(baseData = allTableData) {
// //     let filtered = [...baseData];
    
// //     // Filter by selected product IDs
// //     if (selectedProductIds.length > 0) {
// //       filtered = filtered.filter(item => 
// //         item.type === "product" && selectedProductIds.includes(item.id)
// //       );
// //     }

// //     // Apply team filter to features
// //     if (teamFilter && teamFilter.length > 0) {
// //       filtered = filtered.map(product => {
// //         // Apply team filter to nested data structure
// //         return applyNestedTeamFilter(product, teamFilter);
// //       }).filter(product => {
// //         // Remove products with no matching components/features after team filtering
// //         if (!product.children || !Array.isArray(product.children)) return true;
// //         return product.children.length > 0;
// //       });
// //     }

// //     // Apply status filter to features
// //     if (statusFilter && statusFilter.length > 0) {
// //       filtered = filtered.map(product => {
// //         // Apply status filter to nested data structure
// //         return applyNestedStatusFilter(product, statusFilter);
// //       }).filter(product => {
// //         // Remove products with no matching components/features after status filtering
// //         if (!product.children || !Array.isArray(product.children)) return true;
// //         return product.children.length > 0;
// //       });
// //     }

// //     // Apply date filter with special handling for today's date
// //     if (startDateFilter || endDateFilter) {
// //       const isTodaySelected = startDateFilter && isToday(startDateFilter);
      
// //       // If today's date is selected, filter to show only Todo and In Progress items
// //       if (isTodaySelected) {
// //         filtered = filtered.map(product => {
// //           return applyNestedTodayFilter(product);
// //         }).filter(product => {
// //           if (!product.children || !Array.isArray(product.children)) return true;
// //           return product.children.length > 0;
// //         });
// //       } else {
// //         // Regular date range filtering
// //         filtered = filtered.map(product => {
// //           return applyNestedDateFilter(product, startDateFilter, endDateFilter);
// //         }).filter(product => {
// //           if (!product.children || !Array.isArray(product.children)) return true;
// //           return product.children.length > 0;
// //         });
// //       }
// //     }

// //     setTableData(filtered);
// //   }
  
// //   // Helper function to check if a date is today
// //   function isToday(date: Date): boolean {
// //     const today = new Date();
// //     return date.getDate() === today.getDate() &&
// //       date.getMonth() === today.getMonth() &&
// //       date.getFullYear() === today.getFullYear();
// //   }

// //   // Helper function to apply team filter to nested structure
// //   function applyNestedTeamFilter(item: TableItem, teams: string[]): TableItem {
// //     // If it's a feature, check if its team matches
// //     if (item.type === "feature") {
// //       if (teams.includes(item.data.team || "")) {
// //         return item;
// //       }
// //       return null as unknown as TableItem; // Ensure type compatibility
// //     }
    
// //     // If it has children, filter them
// //     if (item.children && Array.isArray(item.children)) {
// //       const filteredChildren = item.children
// //         .map(child => applyNestedTeamFilter(child, teams))
// //         .filter(Boolean);
      
// //       return {
// //         ...item,
// //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// //       };
// //     }
    
// //     // If no children and not a feature, keep as is
// //     return item;
// //   }

// //   // Helper function to apply status filter to nested structure
// //   function applyNestedStatusFilter(item: TableItem, statuses: string[]): TableItem {
// //     // If it's a feature, check if its status matches
// //     if (item.type === "feature") {
// //       if(statuses.includes(item.data.status || "")) {
// //         return item;
// //       }
// //       return null as unknown as TableItem; // Ensure type compatibility
// //     }
    
// //     // If it has children, filter them
// //     if (item.children && Array.isArray(item.children)) {
// //       const filteredChildren = item.children
// //         .map(child => applyNestedStatusFilter(child, statuses))
// //         .filter(Boolean);
      
// //       return {
// //         ...item,
// //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// //       };
// //     }
    
// //     // If no children and not a feature, keep as is
// //     return item;
// //   }


  

// //   // Modify updateComponentProgress to update based on selected team
// //   // async function updateComponentProgress(componentId: string) {
// //   //   try {
// //   //     const response = await fetch(`/api/features/${componentId}`, {
// //   //       method: 'PUT',
// //   //       headers: {
// //   //         'Content-Type': 'application/json',
// //   //       },
// //   //       body: JSON.stringify({
// //   //         teamFilter: teamFilter,  // Add teamFilter here
// //   //         componentId: componentId,
// //   //       }),
// //   //     });
  
// //   //     const data = await response.json();
  
// //   //     if (data.error) {
// //   //       throw new Error(data.error);
// //   //     }
  
// //   //     return data;
// //   //   } catch (error) {
// //   //     console.error('Error updating component progress:', error);
// //   //   }
// //   // }
  
// //   async function updateComponentProgress(componentId: string) {
// //     try {
// //       // Get database query for features
// //       let featuresQuery = supabase
// //         .from('features')
// //         .select('status, team')
// //         .eq('component_id', componentId);
      
// //       // Apply team filter if available
// //       if (teamFilter && teamFilter.length > 0) {
// //         featuresQuery = featuresQuery.in('team', teamFilter);
// //       }
      
// //       // Execute query
// //       const { data: features, error: featuresError } = await featuresQuery;

// //       if (featuresError) throw featuresError;

// //       // If no features match the team filter, return early without updating
// //       if (features.length === 0) {
// //         return 0;
// //       }

// //       // Calculate average progress for the matching features
// //       const totalProgress = features.reduce((sum, feature) => {
// //         return sum + calculateProgressFromStatus(feature.status);
// //       }, 0);
      
// //       const averageProgress = Math.round(totalProgress / features.length);

// //       // Update the component's progress
// //       const { error: updateError } = await supabase
// //         .from('components')
// //         .update({ progress: averageProgress })
// //         .eq('id', componentId);

// //       if (updateError) throw updateError;

// //       // Update the product progress after updating the component
// //       const { data: component, error: componentError } = await supabase
// //         .from('components')
// //         .select('product_id')
// //         .eq('id', componentId)
// //         .single();

// //       if (componentError) throw componentError;

// //       await updateProductProgress(component.product_id);
      
// //       return averageProgress;
// //     } catch (error) {
// //       console.error('Error updating component progress:', error);
// //       return 0;
// //     }
// //   }

// // // Modify updateProductProgress to update product based on components
// // // async function updateProductProgress(productId: string) {
// // //   try {
// // //     const { data: components, error: componentsError } = await supabase
// // //       .from('components')
// // //       .select('progress')
// // //       .eq('product_id', productId);

// // //     if (componentsError) throw componentsError;

// // //     const totalProgress = components.reduce((sum, component) => sum + (component.progress || 0), 0);
// // //     const averageProgress = components.length > 0 ? Math.round(totalProgress / components.length) : 0;

// // //     // Update the product's progress
// // //     const { error: updateError } = await supabase
// // //       .from('products')
// // //       .update({ progress: averageProgress })
// // //       .eq('id', productId);

// // //     if (updateError) throw updateError;

// // //     return averageProgress;
// // //   } catch (error) {
// // //     console.error('Error updating product progress:', error);
// // //     throw error;
// // //   }
// // // }


// // async function updateProductProgress(productId: string) {
// //   try {
// //     // Get all components for this product
// //     const { data: components, error: componentsError } = await supabase
// //       .from('components')
// //       .select('id, progress')
// //       .eq('product_id', productId);

// //     if (componentsError) throw componentsError;
    
// //     // If no components, return early
// //     if (components.length === 0) {
// //       return 0;
// //     }

// //     // For each component, if team filter is active, recalculate its progress
// //     if (teamFilter && teamFilter.length > 0) {
// //       // Process each component to ensure progress reflects selected teams
// //       for (const component of components) {
// //         // This will update component progress in the database based on team filter
// //         await updateComponentProgress(component.id);
// //       }
      
// //       // Get refreshed component data after updates
// //       const { data: updatedComponents, error } = await supabase
// //         .from('components')
// //         .select('progress')
// //         .eq('product_id', productId);
        
// //       if (error) throw error;
      
// //       // Calculate new average from the updated components
// //       const totalProgress = updatedComponents.reduce((sum, component) => {
// //         return sum + (component.progress || 0);
// //       }, 0);
      
// //       const averageProgress = updatedComponents.length > 0 ? 
// //         Math.round(totalProgress / updatedComponents.length) : 0;

// //       // Update product progress
// //       const { error: updateError } = await supabase
// //         .from('products')
// //         .update({ progress: averageProgress })
// //         .eq('id', productId);

// //       if (updateError) throw updateError;
      
// //       return averageProgress;
// //     } else {
// //       // If no team filter, just calculate from component values
// //       const totalProgress = components.reduce((sum, component) => {
// //         return sum + (component.progress || 0);
// //       }, 0);
      
// //       const averageProgress = components.length > 0 ? 
// //         Math.round(totalProgress / components.length) : 0;

// //       // Update product progress
// //       const { error: updateError } = await supabase
// //         .from('products')
// //         .update({ progress: averageProgress })
// //         .eq('id', productId);

// //       if (updateError) throw updateError;
      
// //       return averageProgress;
// //     }
// //   } catch (error) {
// //     console.error('Error updating product progress:', error);
// //     return 0;
// //   }
// // }


// // async function recalculateProgressForAllItems() {
// //   try {
// //     // Update all products
// //     for (const item of tableData) {
// //       if (item.type === "product") {
// //         await updateProductProgress(item.id);
// //       }
// //     }
    
// //     // Refresh the data to show updated progress values
// //     const updatedData = [...tableData];
// //     setTableData(updatedData);
// //   } catch (error) {
// //     console.error('Error recalculating progress:', error);
// //   }
// // }



// //   // Recalculate progress for products and components based on team selection
// // async function recalculateProgress() {
// //   for (let item of tableData) {
// //     if (item.type === "component" && item.data.team && teamFilter.includes(item.data.team)) {
// //       await updateComponentProgress(item.id); // Update progress for components based on selected team
// //     }
// //     if (item.type === "product") {
// //       await updateProductProgress(item.id); // Update progress for product
// //     }
// //   }
// // }



// // useEffect(() => {
// //   if (teamFilter.length > 0) {
// //     // Recalculate progress after applying the team filter
// //     recalculateProgress();
// //   }
// // }, [teamFilter]);  // Trigger on teamFilter change

  
// //   // Helper function to filter items for today's date - show only Todo and In Progress items
// //   function applyNestedTodayFilter(item: TableItem): TableItem {
// //     // If it's a feature, check if its status is Todo or In Progress
// //     if (item.type === "feature") {
// //       if (item.data.status === "Todo" || item.data.status === "In Progress") {
// //         return item;
// //       }
// //       return null as unknown as TableItem;
// //     }
    
// //     // If it has children, filter them
// //     if (item.children && Array.isArray(item.children)) {
// //       const filteredChildren = item.children
// //         .map(child => applyNestedTodayFilter(child))
// //         .filter(Boolean);
      
// //       return {
// //         ...item,
// //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// //       };
// //     }
    
// //     // If no children and not a feature, keep as is
// //     return item;
// //   }

// //   // Helper function to apply date filter to nested structure
// //   function applyNestedDateFilter(item: TableItem, startDate?: Date, endDate?: Date): TableItem {
// //     if (!startDate && !endDate) return item;
    
// //     // If it's a feature, check date range
// //     if (item.type === "feature") {
// //       const featureStartDate = item.data.startDate ? new Date(item.data.startDate) : null;
// //       const featureEndDate = item.data.targetDate ? new Date(item.data.targetDate) : null;
      
// //       // Skip items without dates
// //       if (!featureStartDate && !featureEndDate) return item;
      
// //       // Check date ranges
// //       let isInRange = true;
// //       if (startDate && featureStartDate) {
// //         isInRange = isInRange && featureStartDate >= startDate;
// //       }
// //       if (endDate && featureEndDate) {
// //         isInRange = isInRange && featureEndDate <= endDate;
// //       }
      
// //       if (isInRange) {
// //         return item;
// //       }
      
// //       return null as unknown as TableItem;
// //     }
    
// //     // If it has children, filter them
// //     if (item.children && Array.isArray(item.children)) {
// //       const filteredChildren = item.children
// //         .map(child => applyNestedDateFilter(child, startDate, endDate))
// //         .filter(Boolean);
      
// //       return {
// //         ...item,
// //         children: filteredChildren.length > 0 ? filteredChildren : undefined
// //       };
// //     }
    
// //     // If no children and not a feature, keep as is
// //     return item;
// //   }

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

// //     await updateComponentProgress(componentId);

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
// //       let featuresQuery = supabase
// //         .from("features")
// //         .select("*")
// //         .eq("component_id", componentId);
      
// //       // Apply team filter if available
// //       if (teamFilter && teamFilter.length > 0) {
// //         featuresQuery = featuresQuery.in('team', teamFilter);
// //       }
      
// //       const { data: featuresData, error: featuresError } = await featuresQuery;

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
// //                   <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// //                     new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// //                     ).toString() )&& 'text-[#ff4747]'} `}>
// //                     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
// //                     </svg>
// //                     </div>
// //                 </>
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
// //       {/* Left Side - Product Table */}
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
// import { Progress } from "@/components/ui/progress";

// import ProductDetailsPage from "./_components/productDetails";
// import ComponentDetailsPage from "./_components/componentDetails";
// import FeatureDetailsPage from "./_components/featureDetails";
// import { CreateFeatureModal } from "./_components/createFeatureModal";
// import { CreateComponentModal } from "./_components/createComponentModal";

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
//   teamFilter?: string[];
//   statusFilter?: string[];
//   startDateFilter?: Date;
//   endDateFilter?: Date;
// }


// export default function ProductTable({
//   selectedProductIds,
//   teamFilter = [],
//   statusFilter = [],
//   startDateFilter,
//   endDateFilter,
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

//   // Fetch initial data
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Apply filters when they change
//   useEffect(() => {
//     filterTableData();
//   }, [selectedProductIds, teamFilter, statusFilter, startDateFilter, endDateFilter, allTableData]);

//   // Separate effect for recalculating progress when team filter changes
//   useEffect(() => {
//     if (teamFilter.length > 0) {
//       // Only recalculate progress when team filter is applied
//       recalculateProgress();
//     }
//   }, [teamFilter]);
//   // Fetch products from database
//   async function fetchProducts() {
//     try {
//       setLoading(true);
//       // Fetch products
//       const { data: productsData, error: productsError } = await supabase
//         .from("products")
//         .select("*")
//         .neq("name", "Sample Product 1");

//       if (productsError) throw productsError;

//       // Prepare table data
//       const initialTableData: TableItem[] = productsData.map((product) => ({
//         type: "product" as const,
//         id: product.id,
//         name: product.name || "Product",
//         level: 0,
//         data: product,
//       }));

//       setAllTableData(initialTableData);
      
//       // Initial filter application
//       filterTableData(initialTableData);
//     } catch (error) {
//       console.error("Error fetching products:", error);
//     } finally {
//       setLoading(false);
//     }
//   }

//   // Get unique team names from the database
//   async function fetchTeamOptions() {
//     try {
//       const { data, error } = await supabase
//         .from("features")
//         .select("team")
//         .not("team", "is", null);

//       if (error) throw error;

//       // Extract unique team names
//       const teamSet = new Set(data.map(item => item.team));
//       return Array.from(teamSet);
//     } catch (error) {
//       console.error("Error fetching team options:", error);
//       return [];
//     }
//   }

//   // Helper function to calculate progress based on the feature status
// const calculateProgressFromStatus = (status: string): number => {
//   switch (status) {
//     case 'Completed':
//       return 100;
//     case 'In Progress':
//       return 50;
//     case 'Todo':
//     default:
//       return 0;
//   }
// };


//   // Get unique statuses from the database
//   async function fetchStatusOptions() {
//     try {
//       const { data, error } = await supabase
//         .from("features")
//         .select("status")
//         .not("status", "is", null);

//       if (error) throw error;

//       // Extract unique statuses
//       const statusSet = new Set(data.map(item => item.status));
//       return Array.from(statusSet);
//     } catch (error) {
//       console.error("Error fetching status options:", error);
//       return [];
//     }
//   }

//   // Apply all filters
//   function filterTableData(baseData = allTableData) {
//     let filtered = [...baseData];
    
//     // Filter by selected product IDs
//     if (selectedProductIds.length > 0) {
//       filtered = filtered.filter(item => 
//         item.type === "product" && selectedProductIds.includes(item.id)
//       );
//     }

//     // Apply team filter to features
//     if (teamFilter && teamFilter.length > 0) {
//       filtered = filtered.map(product => {
//         // Apply team filter to nested data structure
//         return applyNestedTeamFilter(product, teamFilter);
//       }).filter(product => {
//         // Remove products with no matching components/features after team filtering
//         if (!product.children || !Array.isArray(product.children)) return true;
//         return product.children.length > 0;
//       });
//     }

//     // Apply status filter to features
//     if (statusFilter && statusFilter.length > 0) {
//       filtered = filtered.map(product => {
//         // Apply status filter to nested data structure
//         return applyNestedStatusFilter(product, statusFilter);
//       }).filter(product => {
//         // Remove products with no matching components/features after status filtering
//         if (!product.children || !Array.isArray(product.children)) return true;
//         return product.children.length > 0;
//       });
//     }

//     // Apply date filter with special handling for today's date
//     if (startDateFilter || endDateFilter) {
//       const isTodaySelected = startDateFilter && isToday(startDateFilter);
      
//       // If today's date is selected, filter to show only Todo and In Progress items
//       if (isTodaySelected) {
//         filtered = filtered.map(product => {
//           return applyNestedTodayFilter(product);
//         }).filter(product => {
//           if (!product.children || !Array.isArray(product.children)) return true;
//           return product.children.length > 0;
//         });
//       } else {
//         // Regular date range filtering
//         filtered = filtered.map(product => {
//           return applyNestedDateFilter(product, startDateFilter, endDateFilter);
//         }).filter(product => {
//           if (!product.children || !Array.isArray(product.children)) return true;
//           return product.children.length > 0;
//         });
//       }
//     }

//     setTableData(filtered);
//   }
  
//   // Helper function to check if a date is today
//   function isToday(date: Date): boolean {
//     const today = new Date();
//     return date.getDate() === today.getDate() &&
//       date.getMonth() === today.getMonth() &&
//       date.getFullYear() === today.getFullYear();
//   }

//   // Helper function to apply team filter to nested structure
//   function applyNestedTeamFilter(item: TableItem, teams: string[]): TableItem {
//     // If it's a feature, check if its team matches
//     if (item.type === "feature") {
//       if (teams.includes(item.data.team || "")) {
//         return item;
//       }
//       return null as unknown as TableItem; // Ensure type compatibility
//     }
    
//     // If it has children, filter them
//     if (item.children && Array.isArray(item.children)) {
//       const filteredChildren = item.children
//         .map(child => applyNestedTeamFilter(child, teams))
//         .filter(Boolean);
      
//       return {
//         ...item,
//         children: filteredChildren.length > 0 ? filteredChildren : undefined
//       };
//     }
    
//     // If no children and not a feature, keep as is
//     return item;
//   }

//   // Helper function to apply status filter to nested structure
//   function applyNestedStatusFilter(item: TableItem, statuses: string[]): TableItem {
//     // If it's a feature, check if its status matches
//     if (item.type === "feature") {
//       if(statuses.includes(item.data.status || "")) {
//         return item;
//       }
//       return null as unknown as TableItem; // Ensure type compatibility
//     }
    
//     // If it has children, filter them
//     if (item.children && Array.isArray(item.children)) {
//       const filteredChildren = item.children
//         .map(child => applyNestedStatusFilter(child, statuses))
//         .filter(Boolean);
      
//       return {
//         ...item,
//         children: filteredChildren.length > 0 ? filteredChildren : undefined
//       };
//     }
    
//     // If no children and not a feature, keep as is
//     return item;
//   }


//   async function updateComponentProgress(componentId: string) {
//     try {
//       const { data: features, error: featuresError } = await supabase
//         .from('features')
//         .select('status, team')
//         .eq('component_id', componentId);

//       if (featuresError) throw featuresError;

//       // If no team filter is applied, use all features
//       // If team filter is applied, filter the features by team
//       const filteredFeatures = teamFilter.length > 0 
//         ? features.filter(feature => teamFilter.includes(feature.team || ''))
//         : features;
      
//       if (filteredFeatures.length === 0) {
//         // No features for this component with the selected team
//         return 0;
//       }

//       const totalProgress = filteredFeatures.reduce((sum, feature) => {
//         return sum + calculateProgressFromStatus(feature.status || 'Todo');
//       }, 0);
      
//       const averageProgress = Math.round(totalProgress / filteredFeatures.length);

//       // Update the component's progress
//       const { error: updateError } = await supabase
//         .from('components')
//         .update({ progress: averageProgress })
//         .eq('id', componentId);

//       if (updateError) throw updateError;

//       // Update the product progress after updating the component
//       const { data: component, error: componentError } = await supabase
//         .from('components')
//         .select('product_id')
//         .eq('id', componentId)
//         .single();

//       if (componentError) throw componentError;

//       await updateProductProgress(component.product_id);
//       return averageProgress;
//     } catch (error) {
//       console.error('Error updating component progress:', error);
//       throw error;
//     }
//   }

//   // Update product progress based on its components
//   async function updateProductProgress(productId: string) {
//     try {
//       const { data: components, error: componentsError } = await supabase
//         .from('components')
//         .select('id, progress')
//         .eq('product_id', productId);

//       if (componentsError) throw componentsError;

//       // Update progress for each component first
//       for (const component of components) {
//         await updateComponentProgress(component.id);
//       }

//       // Fetch updated components after their progress has been updated
//       const { data: updatedComponents, error: updatedError } = await supabase
//         .from('components')
//         .select('progress')
//         .eq('product_id', productId);

//       if (updatedError) throw updatedError;

//       const componentsWithProgress = updatedComponents.filter(c => c.progress !== null && c.progress !== undefined);
      
//       let averageProgress = 0;
//       if (componentsWithProgress.length > 0) {
//         const totalProgress = componentsWithProgress.reduce((sum, component) => {
//           return sum + (component.progress || 0);
//         }, 0);
        
//         averageProgress = Math.round(totalProgress / componentsWithProgress.length);
//       }

//       // Update the product's progress
//       const { error: updateError } = await supabase
//         .from('products')
//         .update({ progress: averageProgress })
//         .eq('id', productId);

//       if (updateError) throw updateError;

//       return averageProgress;
//     } catch (error) {
//       console.error('Error updating product progress:', error);
//       throw error;
//     }
//   }

//   // Recalculate progress for products and components based on team selection
//   async function recalculateProgress() {
//     try {
//       // Get all product IDs from tableData
//       const productIds = tableData
//         .filter(item => item.type === "product")
//         .map(item => item.id);
      
//       // Update progress for each product and its components
//       for (const productId of productIds) {
//         await updateProductProgress(productId);
//       }
      
//       // Refresh the table data after updates
//       const { data: updatedProducts, error } = await supabase
//         .from("products")
//         .select("*")
//         .in("id", productIds);
      
//       if (error) throw error;
      
//       // Update the table data with the new progress values
//       if (updatedProducts) {
//         setTableData(prevData => 
//           prevData.map(item => {
//             if (item.type === "product") {
//               const updatedProduct = updatedProducts.find(p => p.id === item.id);
//               if (updatedProduct) {
//                 return {
//                   ...item,
//                   data: updatedProduct
//                 };
//               }
//             }
//             return item;
//           })
//         );
//       }
//     } catch (error) {
//       console.error("Error recalculating progress:", error);
//     }
//   }




// useEffect(() => {
//   if (teamFilter.length > 0) {
//     // Recalculate progress after applying the team filter
//     recalculateProgress();
//   }
// }, [teamFilter]);  // Trigger on teamFilter change

  
//   // Helper function to filter items for today's date - show only Todo and In Progress items
//   function applyNestedTodayFilter(item: TableItem): TableItem {
//     // If it's a feature, check if its status is Todo or In Progress
//     if (item.type === "feature") {
//       if (item.data.status === "Todo" || item.data.status === "In Progress") {
//         return item;
//       }
//       return null as unknown as TableItem;
//     }
    
//     // If it has children, filter them
//     if (item.children && Array.isArray(item.children)) {
//       const filteredChildren = item.children
//         .map(child => applyNestedTodayFilter(child))
//         .filter(Boolean);
      
//       return {
//         ...item,
//         children: filteredChildren.length > 0 ? filteredChildren : undefined
//       };
//     }
    
//     // If no children and not a feature, keep as is
//     return item;
//   }

//   // Helper function to apply date filter to nested structure
//   function applyNestedDateFilter(item: TableItem, startDate?: Date, endDate?: Date): TableItem {
//     if (!startDate && !endDate) return item;
    
//     // If it's a feature, check date range
//     if (item.type === "feature") {
//       const featureStartDate = item.data.startDate ? new Date(item.data.startDate) : null;
//       const featureEndDate = item.data.targetDate ? new Date(item.data.targetDate) : null;
      
//       // Skip items without dates
//       if (!featureStartDate && !featureEndDate) return item;
      
//       // Check date ranges
//       let isInRange = true;
//       if (startDate && featureStartDate) {
//         isInRange = isInRange && featureStartDate >= startDate;
//       }
//       if (endDate && featureEndDate) {
//         isInRange = isInRange && featureEndDate <= endDate;
//       }
      
//       if (isInRange) {
//         return item;
//       }
      
//       return null as unknown as TableItem;
//     }
    
//     // If it has children, filter them
//     if (item.children && Array.isArray(item.children)) {
//       const filteredChildren = item.children
//         .map(child => applyNestedDateFilter(child, startDate, endDate))
//         .filter(Boolean);
      
//       return {
//         ...item,
//         children: filteredChildren.length > 0 ? filteredChildren : undefined
//       };
//     }
    
//     // If no children and not a feature, keep as is
//     return item;
//   }

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
//                   <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
// new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
// ).toString() )&& 'text-[#ff4747]'} `}>
//                     <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon" className=""><path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
//                     </svg>
//                     </div>
//                 </>
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
//             productId={selectedProduct.data.id}
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
//                 className={`flex py-2 px-4 items-center hover:bg-gray-50 gap-x-4 ${
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


import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import {

  ChevronDown,
  ChevronRight,

} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product, Component, Feature } from "@/app/types";
import { Button } from "@/components/ui/button";
import { updateAllProgress } from '@/utils/progressCalculator';

import ProductDetailsPage from "./_components/productDetails";
import ComponentDetailsPage from "./_components/componentDetails";
import FeatureDetailsPage from "./_components/featureDetails";
import { CreateFeatureModal } from "./_components/createFeatureModal";
import { CreateComponentModal } from "./_components/createComponentModal";

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
  teamFilter?: string[];
  statusFilter?: string[];
  startDateFilter?: Date;
  endDateFilter?: Date;
}

export default function ProductTable({
  selectedProductIds,
  teamFilter = [],
  statusFilter = [],
  startDateFilter,
  endDateFilter,
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

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterTableData();
  }, [selectedProductIds, teamFilter, statusFilter, startDateFilter, endDateFilter, allTableData]);

  useEffect(() => {
    if (teamFilter.length > 0) {

      recalculateProgress();
    }
  }, [teamFilter]);

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
      
     
      filterTableData(initialTableData);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  }

  

  // Helper function to calculate progress based on the feature status
  const calculateProgressFromStatus = (status: string): number => {
    switch (status) {
      case 'Completed':
        return 100;
      case 'In Progress':
        return 50;
      case 'Todo':
      default:
        return 0;
    }
  };



  // Apply all filters
  function filterTableData(baseData = allTableData) {
    let filtered = [...baseData];
    
    // Filter by selected product IDs
    if (selectedProductIds.length > 0) {
      filtered = filtered.filter(item => 
        item.type === "product" && selectedProductIds.includes(item.id)
      );
    }

    // Apply team filter to features
    if (teamFilter && teamFilter.length > 0) {
      filtered = filtered.map(product => {
        // Apply team filter to nested data structure
        return applyNestedTeamFilter(product, teamFilter);
      }).filter(product => {
        // Remove products with no matching components/features after team filtering
        if (!product.children || !Array.isArray(product.children)) return true;
        return product.children.length > 0;
      });
    }

    // Apply status filter to features
    if (statusFilter && statusFilter.length > 0) {
      filtered = filtered.map(product => {
        // Apply status filter to nested data structure
        return applyNestedStatusFilter(product, statusFilter);
      }).filter(product => {
        // Remove products with no matching components/features after status filtering
        if (!product.children || !Array.isArray(product.children)) return true;
        return product.children.length > 0;
      });
    }

    // Apply date filter with special handling for today's date
    if (startDateFilter || endDateFilter) {
      const isTodaySelected = startDateFilter && isToday(startDateFilter);
      
      // If today's date is selected, filter to show only Todo and In Progress items
      if (isTodaySelected) {
        filtered = filtered.map(product => {
          return applyNestedTodayFilter(product);
        }).filter(product => {
          if (!product.children || !Array.isArray(product.children)) return true;
          return product.children.length > 0;
        });
      } else {
        // Regular date range filtering
        filtered = filtered.map(product => {
          return applyNestedDateFilter(product, startDateFilter, endDateFilter);
        }).filter(product => {
          if (!product.children || !Array.isArray(product.children)) return true;
          return product.children.length > 0;
        });
      }
    }

    setTableData(filtered);
  }
  
  // Helper function to check if a date is today
  function isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  }

  // Helper function to apply team filter to nested structure
  function applyNestedTeamFilter(item: TableItem, teams: string[]): TableItem {
    // If it's a feature, check if its team matches
    if (item.type === "feature") {
      if (teams.includes(item.data.team || "")) {
        return item;
      }
      return null as unknown as TableItem; // Ensure type compatibility
    }
    
    // If it has children, filter them
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedTeamFilter(child, teams))
        .filter(Boolean);
      
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }
    
    // If no children and not a feature, keep as is
    return item;
  }

  // Helper function to apply status filter to nested structure
  function applyNestedStatusFilter(item: TableItem, statuses: string[]): TableItem {
    // If it's a feature, check if its status matches
    if (item.type === "feature") {
      if(statuses.includes(item.data.status || "")) {
        return item;
      }
      return null as unknown as TableItem; // Ensure type compatibility
    }
    
    // If it has children, filter them
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedStatusFilter(child, statuses))
        .filter(Boolean);
      
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }
    
    // If no children and not a feature, keep as is
    return item;
  }

  // Fixed updateComponentProgress to correctly calculate average based on status
  async function updateComponentProgress(componentId: string) {
    try {
      // Fetch all features for this component
      const { data: features, error: featuresError } = await supabase
        .from('features')
        .select('status, team')
        .eq('component_id', componentId);

      if (featuresError) throw featuresError;

      // If no team filter is applied, use all features
      // If team filter is applied, filter the features by team
      const filteredFeatures = teamFilter.length > 0 
        ? features.filter(feature => teamFilter.includes(feature.team || ''))
        : features;
      
      if (filteredFeatures.length === 0) {
        // No features for this component with the selected team
        return 0;
      }

      // Calculate progress based on status
      const totalProgress = filteredFeatures.reduce((sum, feature) => {
        return sum + calculateProgressFromStatus(feature.status || 'Todo');
      }, 0);
      
      const averageProgress = Math.round(totalProgress / filteredFeatures.length);

      // Update the component's progress directly in the database
      const { error: updateError } = await supabase
        .from('components')
        .update({ progress: averageProgress })
        .eq('id', componentId);

      if (updateError) throw updateError;

      // Update the component in the UI
      setTableData(prevData => 
        prevData.map(item => {
          if (item.type === "product" && item.children) {
            return {
              ...item,
              children: item.children.map(child => 
                child.id === componentId 
                  ? { ...child, data: { ...child.data, progress: averageProgress } }
                  : child
              )
            };
          }
          return item;
        })
      );

      // Get the product ID for this component to update the product progress
      const { data: component, error: componentError } = await supabase
        .from('components')
        .select('product_id')
        .eq('id', componentId)
        .single();

      if (componentError) throw componentError;

      // Update the product progress
      await updateProductProgress(component.product_id);
      
      return averageProgress;
    } catch (error) {
      console.error('Error updating component progress:', error);
      throw error;
    }
  }

  // Update product progress based on its components
  async function updateProductProgress(productId: string) {
    try {
      // Get all components for this product
      const { data: components, error: componentsError } = await supabase
        .from('components')
        .select('id, progress')
        .eq('product_id', productId);

      if (componentsError) throw componentsError;

      // First update the progress of each component
      for (const component of components) {
        await updateComponentProgress(component.id);
      }

      // Get the updated components
      const { data: updatedComponents, error: updatedError } = await supabase
        .from('components')
        .select('progress')
        .eq('product_id', productId);

      if (updatedError) throw updatedError;

      // Calculate the product's progress as the average of its components
      const componentsWithProgress = updatedComponents.filter(c => c.progress !== null && c.progress !== undefined);
      
      let averageProgress = 0;
      if (componentsWithProgress.length > 0) {
        const totalProgress = componentsWithProgress.reduce((sum, component) => {
          return sum + (component.progress || 0);
        }, 0);
        
        averageProgress = Math.round(totalProgress / componentsWithProgress.length);
      }

      // Update the product progress in the database
      const { error: updateError } = await supabase
        .from('products')
        .update({ progress: averageProgress })
        .eq('id', productId);

      if (updateError) throw updateError;

      // Update the product in the UI
      setTableData(prevData => 
        prevData.map(item => 
          item.id === productId 
            ? { ...item, data: { ...item.data, progress: averageProgress } }
            : item
        )
      );
      
      return averageProgress;
    } catch (error) {
      console.error('Error updating product progress:', error);
      throw error;
    }
  }

  // Recalculate progress for products and components based on team selection
  async function recalculateProgress() {
    try {
      // Update all progress in the database first
      await updateAllProgress(teamFilter);
      
      // Now refresh the data in the UI
      const productIds = tableData
        .filter(item => item.type === "product")
        .map(item => item.id);
      
      // Get the updated product data
      if (productIds.length > 0) {
        const { data: updatedProducts, error } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);
        
        if (error) throw error;
        
        // Update products in the UI
        if (updatedProducts) {
          setTableData(prevData => 
            prevData.map(item => {
              if (item.type === "product") {
                const updatedProduct = updatedProducts.find(p => p.id === item.id);
                if (updatedProduct) {
                  return {
                    ...item,
                    data: updatedProduct
                  };
                }
              }
              return item;
            })
          );
        }
        
        // Also refresh component data in the expanded products
        for (const productId of productIds) {
          if (expandedItems[`product-${productId}`]) {
            const { data: updatedComponents, error: componentsError } = await supabase
              .from("components")
              .select("*")
              .eq("product_id", productId);
            
            if (!componentsError && updatedComponents) {
              setTableData(prevData => 
                prevData.map(item => {
                  if (item.id === productId && item.children) {
                    return {
                      ...item,
                      children: item.children.map(child => {
                        const updatedComponent = updatedComponents.find(c => c.id === child.id);
                        if (updatedComponent) {
                          return {
                            ...child,
                            data: updatedComponent
                          };
                        }
                        return child;
                      })
                    };
                  }
                  return item;
                })
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Error recalculating progress:", error);
    }
  }

  // Helper function to filter items for today's date - show only Todo and In Progress items
  function applyNestedTodayFilter(item: TableItem): TableItem {
    // If it's a feature, check if its status is Todo or In Progress
    if (item.type === "feature") {
      if (item.data.status === "Todo" || item.data.status === "In Progress") {
        return item;
      }
      return null as unknown as TableItem;
    }
    
    // If it has children, filter them
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedTodayFilter(child))
        .filter(Boolean);
      
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }
    
    // If no children and not a feature, keep as is
    return item;
  }

  // Helper function to apply date filter to nested structure
  function applyNestedDateFilter(item: TableItem, startDate?: Date, endDate?: Date): TableItem {
    if (!startDate && !endDate) return item;
    
    // If it's a feature, check date range
    if (item.type === "feature") {
      const featureStartDate = item.data.startDate ? new Date(item.data.startDate) : null;
      const featureEndDate = item.data.targetDate ? new Date(item.data.targetDate) : null;
      
      // Skip items without dates
      if (!featureStartDate && !featureEndDate) return item;
      
      // Check date ranges
      let isInRange = true;
      if (startDate && featureStartDate) {
        isInRange = isInRange && featureStartDate >= startDate;
      }
      if (endDate && featureEndDate) {
        isInRange = isInRange && featureEndDate <= endDate;
      }
      
      if (isInRange) {
        return item;
      }
      
      return null as unknown as TableItem;
    }
    
    // If it has children, filter them
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedDateFilter(child, startDate, endDate))
        .filter(Boolean);
      
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }
    
    // If no children and not a feature, keep as is
    return item;
  }

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

  const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
    return children.map((child) => (
      <div key={child.id}>
        <div
          className={`flex py-2 px-1 items-center  ${child.level=== 2 ?'bg-[#fff]' : 'bg-[#cce4fc]'}  border-b-[0.5px] border-dashed border-[rgb(212,219,225)]`}
        >
          <div
            className={`${child.level=== 2 ?'w-[563px] min-w-[433px] max-w-[433px]':'w-[436px] min-w-[435px] max-w-[435px]'}  flex items-center gap-2 `}
            style={{ paddingLeft: `${16 + child.level * 16}px` }}
          >
            <div
              className="flex items-center gap-2 cursor-pointer w-full"
              onClick={() => {
                if (child.type === "product" || child.type === "component") {
                  if (child.type === "product" || child.type === "component") {
                    toggleExpand(child.type, child.id, child.data);
                  }
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
                  <div className={`${child.data.status=='Completed' && 'text-[#79ce17]'}  ${child.data.status=='In Progress' && 'text-[#ffc600]'} ${child.data.status=='Todo' && ''} ${(child.data.status=='Todo' && (
new Date(child.data.completedOn ?? new Date().toISOString()) > new Date(child.data.startDate ?? new Date().toISOString())
).toString() )&& 'text-[#ff4747]'} `}>
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
                  } border-r-[0.5px] border-dashed border-[rgb(212,219,225)] text-gray-700 text-[14px] max-w-[90%]  w-[100%] whitespace-nowrap overflow-hidden text-ellipsis`}
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
                  {child.name}
                </span>
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
                 <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
              </button>
            )}
          </div>
          <div className="w-[130px]   flex justify-center text-center text-[12px] text-[#30363c] font-normal whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.status || "-"} 
          </div>
          <div className="w-[120px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            { `${child?.data?.progress}%` ||"-"}
          </div>
          <div className="w-[144px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.team || "-"}
          </div>
          <div className="w-[112px]   flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            { child?.data?.days || "-"} 
          </div>
          <div className="w-[180px]  flex justify-center text-center text-[12px] text-[#30363c] border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
            {child?.data?.startDate || ""}-{child?.data?.targetDate || ""}
          </div>
          <div
            className="w-[170px]   flex justify-center text-center text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
 "
          >
            {child.data.completedOn || "-"}
          </div>
          <div
            className="w-[300px] text-[12px] text-[#30363c] whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]
"
          >
            <span>{child.data.remarks || "-"}</span>
          </div>
        </div>
        {child.children &&
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
      {/* Left Side - Product Table */}
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
            <div className="w-[80px]    justify-center text-center text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
              Status
            </div>
            <div className="w-[80px]   justify-center text-center  text-[13px] font-bold border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
              Progress
            </div>
            <div className="w-[100px]   flex justify-center text-center  text-[13px] font-bold flex-row  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                <div className="flex-row flex">
                    <img className="w-[16px] h-[16px] mr-1" src="/person.svg"></img>Team
                </div>
            </div>
            <div className="w-[72px]   flex  text-center text-[13px] font-bold flex-row   whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                <img src="/file_new.svg" className="w-[16px] h-[16px] mr-1"></img> Days
            </div>
            <div className="w-[144px]   flex justify-center text-center text-[13px] font-bold flex-row   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                <img className="w-[16px] h-[16px] mr-1" src="/clock.svg"></img> Target span
            </div>
            <div className="w-[144px]   justify-center text-center  text-[13px] font-bold flex-row flex  whitespace-nowrap border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
                <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Completion Time
            </div>
            <div className="w-[100px] text-center  text-[13px] font-bold flex-row flex   border-r-[0.5px] border-dashed border-[rgb(212,219,225)]">
             <img className="w-[16px] h-[16px] mr-1" src="/file_new.svg"></img> Remarks
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
                <div className="w-[611px] min-w-[390px] max-w-[390px] flex items-center gap-2   " 
    >
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
                              fill-rule="evenodd"
                              d="M1.25 4A2.75 2.75 0 0 1 4 1.25h8A2.75 2.75 0 0 1 14.75 4v8A2.75 2.75 0 0 1 12 14.75H4A2.75 2.75 0 0 1 1.25 12zM4 2.75c-.69 0-1.25.56-1.25 1.25v1.25h10.5V4c0-.69-.56-1.25-1.25-1.25zm9.25 4H2.75V12c0 .69.56 1.25 1.25 1.25h8c.69 0 1.25-.56 1.25-1.25z"
                              clip-rule="evenodd"
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
                    <img className="w-[16px] h-[16px] mr-1" src="/add.svg"></img>
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

                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap bg-green-300">
                  {item.data.status || ""}
                </div>
                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                  {item.data.progress !== undefined
                    ? `${item.data.progress}%`
                    : ""}
                </div>
                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                  {item.data.team || ""}
                </div>
                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                  {item.data.days !== undefined ? item.data.days : ""}
                </div>
                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
                  {item.data.startDate || ""}-{item.data.targetDate || ""}
                </div>
                <div className="w-[144px] min-w-[94px]  flex justify-center text-center text-[14px] text-gray-700 whitespace-nowrap">
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
