import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  ChevronDown,
  ChevronRight,
  Settings,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product, Component, Feature, TableItem } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

import ProductDetailsPage from "./_components/productDetails";
import ComponentDetailsPage from "./_components/componentDetails";
import FeatureDetailsPage from "./_components/featureDetails";
import { CreateFeatureModal } from "./_components/createFeatureModal";
import { CreateComponentModal } from "./_components/createComponentModal";
import CreateProductModal from "./_components/createModal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getVersionProgressDisplay } from "@/utils/versionProgressCalculator";
import { toast } from "sonner";

// Helper: recursively check if any feature exists in the tree
function hasAnyFeature(item: TableItem | undefined): boolean {
  if (!item) return false;
  if (item.type === 'feature') return true;
  if (item.children && Array.isArray(item.children)) {
    return item.children.some(child => hasAnyFeature(child));
  }
  return false;
}

// Helper: type guard for string
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

interface ProductTableProps {
  selectedProductIds: string[];
  teamFilter?: string[];
  statusFilter?: string[];
  versionFilter?: string[];
  startDateFilter?: Date;
  endDateFilter?: Date;
}

export default function ProductTable({
  selectedProductIds,
  teamFilter = [],
  statusFilter = [],
  versionFilter = [],
  startDateFilter,
  endDateFilter,
}: ProductTableProps) {
  const [allTableData, setAllTableData] = useState<TableItem[]>([]);
  const [tableData, setTableData] = useState<TableItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [featureStatusFilter, setFeatureStatusFilter] = useState<string[]>([]);
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
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  // Add state for editing product/component/feature
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editingComponentId, setEditingComponentId] = useState<string | null>(null);
  const [editingFeatureId, setEditingFeatureId] = useState<string | null>(null);

  // In the ProductTable component, add a ref to keep track of expandedItems across refreshes
  const expandedItemsRef = React.useRef(expandedItems);

  useEffect(() => {
    expandedItemsRef.current = expandedItems;
  }, [expandedItems]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterTableData();
  }, [selectedProductIds, teamFilter, statusFilter, versionFilter, startDateFilter, endDateFilter, allTableData]);
  useEffect(() => {
    if (teamFilter.length > 0 || versionFilter.length > 0) {
      recalculateProgress();
    }
  }, [teamFilter, versionFilter]);
  useEffect(() => {
    filterTableData();
  }, [selectedProductIds, teamFilter, statusFilter, versionFilter, startDateFilter, endDateFilter, allTableData]);

  
  // Debug: Log tableData changes
  useEffect(() => {
  }, [tableData]);

  // Helper to fetch and attach features for expanded components
  async function attachFeaturesToExpandedComponents(tableDataToUpdate: TableItem[]): Promise<TableItem[]> {
    // Find all expanded component IDs
    const expandedComponentIds = Object.keys(expandedItemsRef.current)
      .filter((key: string) => key.startsWith('component-') && expandedItemsRef.current[key as keyof typeof expandedItemsRef.current])
      .map((key: string) => key.replace('component-', ''));

    if (expandedComponentIds.length === 0) return tableDataToUpdate;

    // For each product, update its children (components)
    const updatedTableData: TableItem[] = await Promise.all(tableDataToUpdate.map(async (product: TableItem) => {
      if (!product.children) return product;
      const updatedChildren: TableItem[] = await Promise.all(product.children.map(async (component: TableItem) => {
        if (expandedComponentIds.includes(component.id)) {
          // Fetch features for this component
          const features: TableItem[] = (await fetchFeatures(component.id)) as TableItem[];
          return { ...component, children: features };
        }
        return component;
      }));
      return { ...product, children: updatedChildren };
    }));
    return updatedTableData;
  }

  // Fix fetchProducts to properly calculate and display product progress
  async function fetchProducts(): Promise<void> {
    try {
      setLoading(true);
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .neq("name", "Sample Product 1");
      if (productsError) throw productsError;
      
      // Fetch all components for all products
      const productIds: string[] = (productsData as Product[]).map((p: Product) => p.id);
      const { data: allComponents, error: componentsError } = await supabase
        .from("components")
        .select("*")
        .in("product_id", productIds);
      if (componentsError) throw componentsError;

      // Fetch all features for all components
      const componentIds: string[] = (allComponents as Component[]).map((c: Component) => c.id);
      const { data: allFeatures, error: featuresError } = await supabase
        .from("features")
        .select("*")
        .in("component_id", componentIds);
      if (featuresError) throw featuresError;

      
      // Group components by product_id
      const componentsByProduct: Record<string, Component[]> = {};
      for (const comp of allComponents as Component[]) {
        if (!componentsByProduct[comp.product_id]) componentsByProduct[comp.product_id] = [];
        componentsByProduct[comp.product_id].push(comp);
      }

      // Use the actual progress from database, don't recalculate here
      let initialTableData: TableItem[] = (productsData as Product[]).map((product: Product) => {
        const components: TableItem[] = (componentsByProduct[product.id] || []).map((component: Component) => ({
          type: "component",
          id: component.id,
          name: component.name || "Component",
          level: 1,
          data: component,
        }));

        return {
          type: "product",
          id: product.id,
          name: product.name || "Product",
          level: 0,
          data: product, // Use the product data as-is, including stored progress
          children: components,
        };
      });

      // Attach features for expanded components
      initialTableData = await attachFeaturesToExpandedComponents(initialTableData);
      setAllTableData(initialTableData);
      filterTableData(initialTableData);
      // Restore expandedItems after refresh
      setExpandedItems(expandedItemsRef.current);
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
  async function filterTableData(baseData = allTableData) {
    let filtered = [...baseData];
    
    // Filter by selected product IDs
    if (selectedProductIds.length > 0) {
      filtered = filtered.filter(item => 
        item.type === "product" && selectedProductIds.includes(item.id)
      );
    }

    // Apply team filter to features
    if (teamFilter && teamFilter.length > 0) {
      // First, load all features for all components to apply proper filtering
      const newExpandedItems: Record<string, boolean> = {};
      
      for (const product of filtered) {
        if (product.children && product.children.length > 0) {
          for (const component of product.children) {
            if (!component.children || component.children.length === 0) {
              // Load features for this component
              const features = await fetchFeatures(component.id);
              component.children = features as TableItem[];
            }
          }
        }
      }

      // Now apply the team filter to the nested structure
      filtered = filtered.map(product => {
        return applyNestedTeamFilter(product, teamFilter);
      }).filter(product => {
        // Remove products with no matching components/features after team filtering
        if (!product || !product?.children || !Array.isArray(product.children)) return false;
        return product.children.length > 0;
      });

      // Auto-expand products and components that have matching features
      for (const product of filtered) {
        if (product && product.children && product.children.length > 0) {
          newExpandedItems[`product-${product.id}`] = true;
          
          for (const component of product.children) {
            if (component && component.children && component.children.length > 0) {
              newExpandedItems[`component-${component.id}`] = true;
            }
          }
        }
      }
      
      setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
    }

    // Apply status filter to products (not features) - REMOVED FEATURE STATUS FILTERING
    if (statusFilter && statusFilter.length > 0) {
      filtered = filtered.filter(product => typeof product.data.status === "string" && statusFilter.includes(product.data.status));

      // Auto-expand all products that match the filter and load their data
      const newExpandedItems: Record<string, boolean> = {};
      for (const product of filtered) {
        newExpandedItems[`product-${product.id}`] = true;
        
        // Load components if not already loaded
        if (!product.children || product.children.length === 0) {
          const components = await fetchComponents(product.id);
          product.children = components as TableItem[];
        }
        
        if (product.children && Array.isArray(product.children)) {
          for (const component of product.children) {
            newExpandedItems[`component-${component.id}`] = true;
            
            // Load features if not already loaded
            if (!component.children || component.children.length === 0) {
              const features = await fetchFeatures(component.id);
              component.children = features as TableItem[];
            }
          }
        }
      }
      
      // Apply team filter after loading all data if team filter is active
      if (teamFilter && teamFilter.length > 0) {
        filtered = filtered.map(product => {
          return applyNestedTeamFilter(product, teamFilter);
        }).filter(product => {
          // Remove products with no matching components/features after team filtering
          if (!product?.children || !Array.isArray(product.children)) return true;
          return product.children.length > 0;
        });
      }
      
      setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
    }

    // Apply version filter
    if (versionFilter && versionFilter.length > 0) {
      filtered = filtered.map(product => {
        // Apply version filter to nested data structure
        return applyNestedVersionFilter(product, versionFilter);
      }).filter(Boolean).filter(product => {
        // Remove products with no matching components/features after version filtering
        if (!product.children || !Array.isArray(product.children)) return true;
        return product.children.length > 0;
      });
    }

    // Apply date filter with special handling for today's date
  //   if (startDateFilter || endDateFilter) {
  //     filtered = filtered
  //       .map(product => applyNestedDateFilter(product, startDateFilter, endDateFilter))
  //       .filter((product): product is TableItem => product !== null);

  //     // Auto-expand all products and their components that have matching features
  //     const newExpandedItems: Record<string, boolean> = {};
  //     filtered.forEach(product => {
  //       newExpandedItems[`product-${product.id}`] = true;
  //       if (product.children && Array.isArray(product.children)) {
  //         product.children.forEach(component => {
  //           newExpandedItems[`component-${component.id}`] = true;
  //         });
  //       }
  //     });
  //     setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
  //   }

  //   setTableData(filtered);
  // }
    // Apply date filter with overlap handling
//   if (startDateFilter || endDateFilter) {
//     filtered = filtered
//       .map(product => applyNestedDateFilter(product, startDateFilter, endDateFilter))
//       .filter((product): product is TableItem => product !== null);

//     // Auto-expand all products and their components that have matching features
//     const newExpandedItems: Record<string, boolean> = {};
//     filtered.forEach(product => {
//       newExpandedItems[`product-${product.id}`] = true;
//       if (product.children && Array.isArray(product.children)) {
//         product.children.forEach(component => {
//           newExpandedItems[`component-${component.id}`] = true;
//         });
//       }
//     });
//     setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
//   }

//   setTableData(filtered);
// }
  if (startDateFilter || endDateFilter) {
    // Step 1: Load all components and features for products in filtered (if not already loaded)
    filtered = await Promise.all(filtered.map(async (product) => {
      // Load components if not present
      if (!product.children || product.children.length === 0) {
        const components = await fetchComponents(product.id);
        product.children = components as TableItem[];
      }

      // Load features for each component if not present
      if (product.children && Array.isArray(product.children)) {
        product.children = await Promise.all(product.children.map(async (component) => {
          if (!component.children || component.children.length === 0) {
            const features = await fetchFeatures(component.id);
            component.children = features as TableItem[];
          }
          return component;
        }));
      }

      return product;
    }));

    // Step 2: Apply the date filter to the now-loaded structure
    filtered = filtered
      .map(product => applyNestedDateFilter(product, startDateFilter, endDateFilter))
      .filter((product): product is TableItem => product !== null);

    // Step 3: Auto-expand only products and components that have matching features
    const newExpandedItems: Record<string, boolean> = {};
    filtered.forEach(product => {
      if (product.children && product.children.length > 0) {  // Only expand if product has matching children
        newExpandedItems[`product-${product.id}`] = true;
        product.children.forEach(component => {
          if (component.children && component.children.length > 0) {  // Only expand if component has matching features
            newExpandedItems[`component-${component.id}`] = true;
          }
        });
      }
    });
    setExpandedItems(prev => ({ ...prev, ...newExpandedItems }));
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
      return null as unknown as TableItem;
    }
    
    // If it has children, filter them recursively
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedTeamFilter(child, teams))
        .filter(Boolean);
      
      // Only return the item if it has matching children
      if (filteredChildren.length > 0) {
        return {
          ...item,
          children: filteredChildren
        };
      }
      
      // For products and components, if no children match, don't show them
      return null as unknown as TableItem;
    }
    
    // If no children and not a feature, keep as is (shouldn't happen in normal flow)
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

  // Helper function to apply version filter to nested structure
  function applyNestedVersionFilter(item: TableItem, versions: string[]): TableItem {
    // If it's a product, component, or feature, check if its version matches
    if (item.type === "product" || item.type === "component" || item.type === "feature") {
      if (versions.includes(item.data.version || "")) {
        return item;
      }
      return null as unknown as TableItem; // Ensure type compatibility
    }
    
    // If it has children, filter them
    if (item.children && Array.isArray(item.children)) {
      const filteredChildren = item.children
        .map(child => applyNestedVersionFilter(child, versions))
        .filter(Boolean);
      
      return {
        ...item,
        children: filteredChildren.length > 0 ? filteredChildren : undefined
      };
    }
    
    // If no children and not a product/component/feature, keep as is
    return item;
  }

  // Update component progress based on actual feature progress values
  async function updateComponentProgress(componentId: string) {
    try {
      // Get all features for this component with team filter applied
      let featuresQuery = supabase
        .from('features')
        .select('progress, team, version')
        .eq('component_id', componentId);

      if (teamFilter && teamFilter.length > 0) {
        featuresQuery = featuresQuery.in('team', teamFilter);
      }

      if (versionFilter && versionFilter.length > 0) {
        featuresQuery = featuresQuery.in('version', versionFilter);
      }

      const { data: filteredFeatures, error: featuresError } = await featuresQuery;
      
      if (featuresError) throw featuresError;
      
      if (filteredFeatures.length === 0) {
        return 0;
      }

      // Calculate progress based on actual progress values
      const totalProgress = filteredFeatures.reduce((sum, feature) => {
        return sum + (feature.progress || 0);
      }, 0);
      
      const averageProgress = Math.round(totalProgress / filteredFeatures.length);

      // Update the component's progress directly in the database
      const { error: updateError } = await supabase
        .from('components')
        .update({ progress: averageProgress })
        .eq('id', componentId);

      if (updateError) throw updateError;

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
          return sum + (typeof component.progress === 'number' && !isNaN(component.progress) ? component.progress : 0);
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

  // Recalculate progress for products and components based on team and version selection
  async function recalculateProgress() {
    try {
      // Just refresh the data without updating progress in database
      const productIds = tableData
        .filter(item => item.type === "product")
        .map(item => item.id);

      if (productIds.length > 0) {
        const { data: updatedProducts } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (updatedProducts) {
          setTableData(prevData =>
            prevData.map(item => {
              if (item.type === "product") {
                const updatedProduct = updatedProducts.find(p => p.id === item.id);
                if (updatedProduct) {
                  return { ...item, data: updatedProduct };
                }
              }
              return item;
            })
          );
        }
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
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
//  function applyNestedDateFilter(item: TableItem, start?: Date, end?: Date): TableItem | null {
//   const filterStart = start || new Date('1900-01-01');
//   const filterEnd = end || new Date('2100-12-31');

//   // For features: check if there's any overlap with the filter range
//   if (item.type === "feature") {
//     const itemStart = item.data.startdate ? new Date(item.data.startdate) : null;
//     const itemEnd = item.data.targetdate ? new Date(item.data.targetdate) : null;

//     if (!itemStart || !itemEnd) return null; // Skip if no valid dates

//     // Overlap condition: itemStart <= filterEnd && filterStart <= itemEnd
//     const overlaps = itemStart <= filterEnd && filterStart <= itemEnd;
//     return overlaps ? item : null;
//   }

//   // For products/components: recursively filter children
//   let filteredChildren: TableItem[] = [];
//   if (item.children && Array.isArray(item.children)) {
//     filteredChildren = item.children
//       .map(child => applyNestedDateFilter(child, start, end))
//       .filter((child): child is TableItem => child !== null);
//   }

//   // Include item if it has matching children (or if it's a leaf with overlap)
//   if (filteredChildren.length > 0) {
//     return {
//       ...item,
//       children: filteredChildren
//     };
//   }

//   return null; // Remove if no matching children
// }


// function applyNestedDateFilter(item: TableItem, start?: Date, end?: Date): TableItem | null {
//   const filterStart = start || new Date('1900-01-01');  // Default to broad range if partial filter
//   const filterEnd = end || new Date('2100-12-31');

//   // For features: check if there's any overlap with the filter range
//   if (item.type === "feature") {
//     const itemStart = item.data.startdate ? new Date(item.data.startdate) : null;
//     const itemEnd = item.data.targetdate ? new Date(item.data.targetdate) : null;

//     if (!itemStart || !itemEnd) return null;  // Skip if no valid dates

//     // Overlap condition: itemStart <= filterEnd && filterStart <= itemEnd
//     const overlaps = itemStart <= filterEnd && filterStart <= itemEnd;
//     return overlaps ? item : null;
//   }

//   // For products/components: recursively filter children
//   let filteredChildren: TableItem[] = [];
//   if (item.children && Array.isArray(item.children)) {
//     filteredChildren = item.children
//       .map(child => applyNestedDateFilter(child, start, end))
//       .filter((child): child is TableItem => child !== null);
//   }

//   // Include item only if it has matching children
//   if (filteredChildren.length > 0) {
//     return {
//       ...item,
//       children: filteredChildren
//     };
//   }

//   return null;  // Remove if no matching children
// }

function applyNestedDateFilter(item: TableItem, start?: Date, end?: Date): TableItem | null {
  if (item.type === "feature") {
    const itemStart = item.data.startdate ? new Date(item.data.startdate) : null;
    const itemEnd = item.data.targetdate ? new Date(item.data.targetdate) : null;
    if (!itemStart || !itemEnd) return null;

    if (start && !end) {
      // Only a single day is selected: include features that include that day
      if (itemStart <= start && itemEnd >= start) {
        return item;
      }
      return null;
    } else if (start && end) {
      // Date range filter: overlap logic
      if (itemStart <= end && start <= itemEnd) {
        return item;
      }
      return null;
    }
    return item;
  }

  // For products/components, recursively filter children
  let filteredChildren: TableItem[] = [];
  if (item.children && Array.isArray(item.children)) {
    filteredChildren = item.children
      .map(child => applyNestedDateFilter(child, start, end))
      .filter((child): child is TableItem => child !== null);
  }

  if (filteredChildren.length > 0) {
    return { ...item, children: filteredChildren };
  }
  return null;
}

  const handleProductUpdate = (updatedProduct: Product) => {
    console.log('Updating product in table:', updatedProduct);
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === updatedProduct.id
          ? { ...item, data: updatedProduct, name: updatedProduct.name }
          : item
      )
    );
    setAllTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === updatedProduct.id
          ? { ...item, data: updatedProduct, name: updatedProduct.name }
          : item
      )
    );
  };

  const handleCreateProductClick = () => {
    setEditingProductId(null);
    setCreatingProduct(true);
  };

  const handleEditProduct = (productId: string) => {
    setEditingProductId(productId);
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

  const handleEditComponent = (componentId: string, productId: string) => {
    setEditingComponentId(componentId);
    setSelectedProductIdForComponent(productId);
    setIsCreateComponentModalOpen(true);
  };

  const handleCreateFeatureClick = (componentId: string) => {
    setSelectedComponentIdForFeature(componentId);
    setIsCreateFeatureModalOpen(true);
  };

  const handleEditFeature = (featureId: string, componentId: string) => {
    setEditingFeatureId(featureId);
    setSelectedComponentIdForFeature(componentId);
    setIsCreateFeatureModalOpen(true);
  };

  async function createNewProduct(name: string, status: string = 'Todo', progress: number = 0, version: string = '1.0.0') {
    try {
      const { data, error } = await supabase
        .from("products")
        .insert([{ name, status, progress, version }])
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
    const newComponentItem: TableItem = {
      type: "component",
      id: newComponent.id,
      name: newComponent.name,
      level: 1,
      data: newComponent,
    };

    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === productId
          ? {
              ...item,
              children: [...(item.children || []), newComponentItem],
            }
          : item
      )
    );

    setAllTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.id === productId
          ? {
              ...item,
              children: [...(item.children || []), newComponentItem],
            }
          : item
      )
    );

    setExpandedItems((prev) => {
      const updatedExpanded = { ...prev };
      updatedExpanded[`product-${productId}`] = true;
      return updatedExpanded;
    });

    // Refresh the product's progress after creating a new component
    const refreshProductProgress = async () => {
      try {
        console.log(`Refreshing product progress for product ${productId} after component creation`);
        const response = await fetch(`/api/product/${productId}`);
        if (response.ok) {
          const updatedProduct = await response.json();
          console.log('Updated product data after component creation:', updatedProduct);
          
          // Update the product in the table data
          setTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.id === productId
                ? { ...item, data: updatedProduct, name: updatedProduct.name }
                : item
            )
          );
          setAllTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.id === productId
                ? { ...item, data: updatedProduct, name: updatedProduct.name }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error refreshing product progress after component creation:', error);
      }
    };
    
    // Call the refresh function
    refreshProductProgress();

    setIsCreateComponentModalOpen(false);
    setSelectedProductIdForComponent(null);
  }

  async function createNewInlineComponent(name: string, productId: string) {
    try {
      const response = await fetch('/api/component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          product_id: productId,
          updateProductProgress: true,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create component');
      }
      
      const newComponent = await response.json();
      createNewComponent(newComponent, productId);
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

    // Refresh the component's progress after creating a new feature
    const refreshComponentProgress = async () => {
      try {
        console.log(`Refreshing component progress for component ${componentId} after feature creation`);
        const response = await fetch(`/api/component/${componentId}`);
        if (response.ok) {
          const updatedComponent = await response.json();
          console.log('Updated component data after feature creation:', updatedComponent);
          
          // Update the component in the table data
          setTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.children
                ? {
                    ...item,
                    children: item.children.map((child) =>
                      child.id === componentId
                        ? { ...child, data: updatedComponent, name: updatedComponent.name }
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
                        ? { ...child, data: updatedComponent, name: updatedComponent.name }
                        : child
                    ),
                  }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error refreshing component progress after feature creation:', error);
      }
    };
    
    // Call the refresh function
    refreshComponentProgress();

    setIsCreateFeatureModalOpen(false);
    setSelectedComponentIdForFeature(null);
  }

  async function fetchComponents(productId: string) {
    try {
      const { data: componentsData, error: componentsError } = await supabase
        .from("components")
        .select("*")
        .eq("product_id", productId);

      if (componentsError) {
        console.error("Supabase error fetching components:", componentsError);
        throw componentsError;
      }
      
      
      const mappedComponents = componentsData.map((component) => ({
        type: "component",
        id: component.id,
        name: component.name || "Component",
        level: 1,
        data: component,
      }));
      
      return mappedComponents;
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

      if (featuresError) {
        console.error("Supabase error fetching features:", featuresError);
        throw featuresError;
      }
      
      
      const mappedFeatures = featuresData.map((feature) => ({
        type: "feature",
        id: feature.id,
        name: feature.name || "Feature",
        level: 2,
        data: feature,
      }));
      
      return mappedFeatures;
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
          // Set loading state
          setLoadingItems(prev => new Set(prev).add(`product-${id}`));
          
          const components = await fetchComponents(id);

          setTableData((prevData) =>
            prevData.map((item) =>
              item.id === id ? { ...item, children: components as TableItem[] } : item
            )
          );

          setAllTableData((prevAllData) =>
            prevAllData.map((item) =>
              item.id === id ? { ...item, children: components as TableItem[] } : item
            )
          );
          
          // Clear loading state
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(`product-${id}`);
            return newSet;
          });
        }
      } else if (type === "component") {
        let componentFound = false;
        let productId = null;
        let componentHasFeatures = false;
        
        tableData.forEach((product) => {
          if (product.children) {
            const componentIndex = product.children.findIndex(
              (comp) => comp.id === id
            );
            if (componentIndex >= 0) {
              componentFound = true;
              productId = product.id;
              // Check if component already has features loaded
              componentHasFeatures = !!(product.children[componentIndex].children && 
                                   product.children[componentIndex].children!.length > 0);
            }
          }
        });

        if (componentFound && productId && !componentHasFeatures) {
          // Set loading state only if features aren't already loaded
          setLoadingItems(prev => new Set(prev).add(`component-${id}`));
          
          const features = await fetchFeatures(id);

          setTableData((prevData) =>
            prevData.map((product) => {
              if (product.children) {
                return {
                  ...product,
                  children: product.children.map((comp) =>
                    comp.id === id ? { ...comp, children: features as TableItem[] } : comp
                  ) as TableItem[],
                };
              }
              return product;
            })
          );

          setAllTableData((prevAllData) =>
            prevAllData.map((product) => {
              if (product.children) {
                return {
                  ...product,
                  children: product.children.map((comp) =>
                    comp.id === id ? { ...comp, children: features as TableItem[] } : comp
                  ) as TableItem[],
                };
              }
              return product;
            })
          );

          // Remove loading state
          setLoadingItems(prev => {
            const newSet = new Set(prev);
            newSet.delete(`component-${id}`);
            return newSet;
          });
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
  // Helper to calculate average progress for children, with option to exclude empty children (for product progress)
  function getAverageProgress(children: TableItem[] | undefined, filterFn?: (child: TableItem) => boolean, excludeEmpty?: boolean): number {
    if (!children || children.length === 0) return 0;
    let filteredChildren = children;
    if (filterFn) {
      filteredChildren = children.filter(filterFn);
    }
    // For product progress: exclude components with no features or whose progress is not a number
    if (excludeEmpty) {
      filteredChildren = filteredChildren.filter(child => Array.isArray(child.children) && child.children.length > 0 && typeof (child.data as Component).progress === 'number');
    } else {
      filteredChildren = filteredChildren.filter(child => typeof (child.data as Component).progress === 'number');
    }
    if (filteredChildren.length === 0) return 0;
    const total = filteredChildren.reduce((sum, child) => sum + ((child.data as Component).progress || 0), 0);
    return Math.round(total / filteredChildren.length);
  }

  const renderChildren = (children: TableItem[] = []): JSX.Element[] => {
    return children.map((child) => (
      <React.Fragment key={child.id}>
        <TableRow className={`hover:bg-gray-50 ${child.level === 2 ? 'bg-white' : 'bg-blue-50'}`}>
          <TableCell className="w-[417px] p-2 border-r border-gray-200">
            <div className="flex items-center gap-2" style={{ paddingLeft: `${(child.level + 1) * 16}px` }}>
              <div
                className="flex items-center gap-2 cursor-pointer w-full"
                onClick={() => {
                  if (child.type === "product" || child.type === "component") {
                    toggleExpand(child.type, child.id, child.data);
                  }
                }}
              >
                              {child.level < 2 && (
                loadingItems.has(`${child.type}-${child.id}`) ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                ) : isExpanded(child.type, child.id) ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )
              )}
                <div
                  className={`flex items-center gap-2 cursor-pointer w-full ${
                    child.type === "component" || child.type === "feature"
                      ? "text-gray-600"
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
                    <span className="p-1 bg-white text-gray-500 rounded-md border border-gray-200">
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
                    <div className={`${
                      child.data.status === 'Completed' ? 'text-green-600' : 
                      child.data.status === 'In Progress' ? 'text-yellow-600' : 
                      child.data.status === 'Todo' ? 'text-gray-600' : 'text-gray-600'
                    }`}>
                      <svg height="16px" width="16px" viewBox="0 0 16 16" role="img" aria-label="TaskFilledIcon">
                        <path fill="currentColor" d="M8 15.5a7.5 7.5 0 0 0 6.365-11.47L8.53 9.87a.75.75 0 0 1-1.061 0l-2-2a.75.75 0 0 1 1.06-1.06L8 8.28l5.438-5.445A7.5 7.5 0 1 0 8 15.5"></path>
                      </svg>
                    </div>
                  )}
                  <span
                    className={`cursor-pointer ${
                      child.type === "component"
                        ? "hover:text-blue-600"
                        : child.type === "feature"
                        ? "hover:text-blue-600"
                        : ""
                    } text-gray-700 text-[14px] font-medium truncate block`}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCreateFeatureClick(child.id);
                        }}
                        className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
                      >
                        <img className="w-4 h-4" src="/add.svg" alt="Add" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="center">
                      Add feature
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </TableCell>
          <TableCell className="w-[100px] text-center text-[12px] text-gray-700 border-r border-gray-200">
            {child.data.version || "1.0.0"}
          </TableCell>
          <TableCell className="w-[130px] text-center text-[12px] text-gray-700 border-r border-gray-200">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              child.data.status === 'Completed' ? 'bg-green-100 text-green-800' :
              child.data.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              child.data.status === 'Todo' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
            }`}>
              {child?.data?.status || "-"}
            </span>
          </TableCell>
          <TableCell className="w-[120px] text-center text-[12px] text-gray-700 border-r border-gray-200">
            <div className="flex items-center gap-2" title={versionFilter && versionFilter.length > 0 ? `Version ${versionFilter[0]} Progress` : child.type === "component" ? "Component Progress" : "Feature Progress"}>
              <div className="w-16 bg-gray-200 rounded-full h-2" style={{ minWidth: 64 }}>
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${getProgressValue(child)}%` }}
                ></div>
              </div>
              <span className="text-xs font-medium">
                {getProgressValue(child)}%
              </span>
            </div>
          </TableCell>
          <TableCell className="w-[144px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            {child.data.team || "-"}
          </TableCell>
          <TableCell className="w-[112px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            {child.data.days !== undefined ? child.data.days : "-"}
          </TableCell>
          <TableCell className="w-[120px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            {(() => {
              const startDate = child.data.startdate;
              if (!startDate) return "-";
              if (typeof startDate === 'string') return startDate;
              return (startDate as Date).toISOString().split('T')[0];
            })()}
          </TableCell>
          <TableCell className="w-[120px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            {(() => {
              const endDate = child.data.targetdate;
              if (!endDate) return "-";
              if (typeof endDate === 'string') return endDate;
              return (endDate as Date).toISOString().split('T')[0];
            })()}
          </TableCell>
          <TableCell className="w-[170px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            {child.data.completedon || "-"}
          </TableCell>
          <TableCell className="w-[300px] text-center text-[14px] text-gray-700 border-r border-gray-200">
            <span className="truncate block">{child.data.remarks || "-"}</span>
          </TableCell>
          <TableCell className="w-[300px] text-center text-[14px] text-gray-700">
            <span className="break-words whitespace-normal text-left">{child.data.description || "-"}</span>
          </TableCell>
        </TableRow>
        {/* Recursively render nested children (features under components) */}
        {child.children &&
          isExpanded(child.type, child.id) &&
          renderChildren(child.children)}
      </React.Fragment>
    ));
  };

  if (loading) {
    return <div className="flex justify-center p-10">Loading products...</div>;
  }
  // When a feature is updated, ensure its parent component is expanded
  const handleComponentUpdated = (updatedComponent: Component) => {
    console.log('Updating component in table:', updatedComponent);
    // Update component in both tableData and allTableData
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === updatedComponent.id
                  ? { ...child, data: updatedComponent, name: updatedComponent.name }
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
                child.id === updatedComponent.id
                  ? { ...child, data: updatedComponent, name: updatedComponent.name }
                  : child
              ),
            }
          : item
      )
    );
    
    // Refresh the product's progress by fetching updated product data
    const refreshProductProgress = async () => {
      try {
        console.log(`Refreshing product progress for product ${updatedComponent.product_id}`);
        const response = await fetch(`/api/product/${updatedComponent.product_id}`);
        if (response.ok) {
          const updatedProduct = await response.json();
          console.log('Updated product data:', updatedProduct);
          
          // Update the product in the table data
          setTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.id === updatedComponent.product_id
                ? { ...item, data: updatedProduct, name: updatedProduct.name }
                : item
            )
          );
          setAllTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.id === updatedComponent.product_id
                ? { ...item, data: updatedProduct, name: updatedProduct.name }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error refreshing product progress:', error);
      }
    };
    
    // Call the refresh function
    refreshProductProgress();
  };

  const handleFeatureUpdated = (updatedFeature: Feature) => {
    console.log('Updating feature in table:', updatedFeature);
    
    // Update feature in both tableData and allTableData
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.map((child) =>
                child.id === updatedFeature.component_id && child.children
                  ? {
                      ...child,
                      children: child.children.map((feature) =>
                        feature.id === updatedFeature.id
                          ? { ...feature, data: updatedFeature, name: updatedFeature.name }
                          : feature
                      ),
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
                child.id === updatedFeature.component_id && child.children
                  ? {
                      ...child,
                      children: child.children.map((feature) =>
                        feature.id === updatedFeature.id
                          ? { ...feature, data: updatedFeature, name: updatedFeature.name }
                          : feature
                      ),
                    }
                  : child
              ),
            }
          : item
      )
    );
    
    // Refresh the component's progress by fetching updated component data
    const refreshComponentProgress = async () => {
      try {
        console.log(`Refreshing component progress for component ${updatedFeature.component_id}`);
        const response = await fetch(`/api/component/${updatedFeature.component_id}`);
        if (response.ok) {
          const updatedComponent = await response.json();
          console.log('Updated component data:', updatedComponent);
          
          // Update the component in the table data
          setTableData((prevData) =>
            prevData.map((item) =>
              item.type === "product" && item.children
                ? {
                    ...item,
                    children: item.children.map((child) =>
                      child.id === updatedFeature.component_id
                        ? { ...child, data: updatedComponent, name: updatedComponent.name }
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
                      child.id === updatedFeature.component_id
                        ? { ...child, data: updatedComponent, name: updatedComponent.name }
                        : child
                    ),
                  }
                : item
            )
          );
        }
      } catch (error) {
        console.error('Error refreshing component progress:', error);
      }
    };
    
    // Call the refresh function
    refreshComponentProgress();
  };

  const handleProductDeleted = (deletedProductId: string) => {
    console.log('Deleting product from table:', deletedProductId);
    // Remove product from both tableData and allTableData
    setTableData((prevData) =>
      prevData.filter((item) => item.id !== deletedProductId)
    );
    setAllTableData((prevData) =>
      prevData.filter((item) => item.id !== deletedProductId)
    );
  };

  const handleComponentDeleted = (deletedComponentId: string) => {
    console.log('Deleting component from table:', deletedComponentId);
    
    // Find the product ID for the deleted component
    let productId: string | null = null;
    setTableData((prevData) => {
      for (const product of prevData) {
        if (product.children) {
          const component = product.children.find(c => c.id === deletedComponentId);
          if (component) {
            productId = product.id;
            break;
          }
        }
      }
      return prevData;
    });
    
    // Remove component from both tableData and allTableData
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.filter((child) => child.id !== deletedComponentId),
            }
          : item
      )
    );
    setAllTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.filter((child) => child.id !== deletedComponentId),
            }
          : item
      )
    );
    
    // Refresh the product's progress if we found the product ID
    if (productId) {
      const refreshProductProgress = async () => {
        try {
          console.log(`Refreshing product progress for product ${productId} after component deletion`);
          const response = await fetch(`/api/product/${productId}`);
          if (response.ok) {
            const updatedProduct = await response.json();
            console.log('Updated product data after component deletion:', updatedProduct);
            
            // Update the product in the table data
            setTableData((prevData) =>
              prevData.map((item) =>
                item.type === "product" && item.id === productId
                  ? { ...item, data: updatedProduct, name: updatedProduct.name }
                  : item
              )
            );
            setAllTableData((prevData) =>
              prevData.map((item) =>
                item.type === "product" && item.id === productId
                  ? { ...item, data: updatedProduct, name: updatedProduct.name }
                  : item
              )
            );
          }
        } catch (error) {
          console.error('Error refreshing product progress after component deletion:', error);
        }
      };
      
      // Call the refresh function
      refreshProductProgress();
    }
  };

  const handleFeatureDeleted = (deletedFeatureId: string) => {
    console.log('Deleting feature from table:', deletedFeatureId);
    
    // Find the component ID for the deleted feature
    let componentId: string | null = null;
    setTableData((prevData) => {
      for (const product of prevData) {
        if (product.children) {
          for (const component of product.children) {
            if (component.children) {
              const feature = component.children.find(f => f.id === deletedFeatureId);
              if (feature) {
                componentId = component.id;
                break;
              }
            }
          }
        }
      }
      return prevData;
    });
    
    // Remove feature from both tableData and allTableData
    setTableData((prevData) =>
      prevData.map((item) =>
        item.type === "product" && item.children
          ? {
              ...item,
              children: item.children.map((child) =>
                child.children
                  ? {
                      ...child,
                      children: child.children.filter((feature) => feature.id !== deletedFeatureId),
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
                child.children
                  ? {
                      ...child,
                      children: child.children.filter((feature) => feature.id !== deletedFeatureId),
                    }
                  : child
              ),
            }
          : item
      )
    );
    
    // Refresh the component's progress if we found the component ID
    if (componentId) {
      const refreshComponentProgress = async () => {
        try {
          console.log(`Refreshing component progress for component ${componentId} after feature deletion`);
          const response = await fetch(`/api/component/${componentId}`);
          if (response.ok) {
            const updatedComponent = await response.json();
            console.log('Updated component data after feature deletion:', updatedComponent);
            
            // Update the component in the table data
            setTableData((prevData) =>
              prevData.map((item) =>
                item.type === "product" && item.children
                  ? {
                      ...item,
                      children: item.children.map((child) =>
                        child.id === componentId
                          ? { ...child, data: updatedComponent, name: updatedComponent.name }
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
                          ? { ...child, data: updatedComponent, name: updatedComponent.name }
                          : child
                      ),
                    }
                  : item
              )
            );
          }
        } catch (error) {
          console.error('Error refreshing component progress after feature deletion:', error);
        }
      };
      
      // Call the refresh function
      refreshComponentProgress();
    }
  };

  // Helper function to get progress value based on version filter
  const getProgressValue = (item: TableItem): number => {
    // If version filter is applied, show version-specific progress
    if (versionFilter && versionFilter.length > 0) {
      const selectedVersion = versionFilter[0]; // Take the first version if multiple
      if (item.data.version_progress && item.data.version_progress.length > 0) {
        const versionData = item.data.version_progress.find((vp: any) => vp.version === selectedVersion);
        return versionData ? versionData.progress : 0;
      }
    }
    // Otherwise, show normal progress (average of all children)
    return item.data.progress || 0;
  };

  return (
    <div className="w-full flex">
      {/* Left Side - Product Table */}
      <div className="w-full transition-all duration-300">
        <CreateProductModal
          isOpen={creatingProduct}
          onClose={() => { setCreatingProduct(false); setEditingProductId(null); }}
          productId={editingProductId}
          onComponentCreated={(product) => {
            if (editingProductId) {
              handleProductUpdate(product);
            } else {
              // Add new product to table
              const newProductItem: TableItem = {
                type: "product",
                id: product.id,
                name: product.name,
                level: 0,
                data: product,
              };
              setAllTableData((prevData) => [...prevData, newProductItem]);
              setTableData((prevData) => [...prevData, newProductItem]);
            }
            setCreatingProduct(false);
            setEditingProductId(null);
          }}
        />

        <CreateComponentModal
          isOpen={isCreateComponentModalOpen}
          onClose={() => { setIsCreateComponentModalOpen(false); setEditingComponentId(null); }}
          productId={selectedProductIdForComponent}
          componentId={editingComponentId}
          onComponentCreated={(component, productId) => {
            if (editingComponentId) {
              // Update component in table
              setTableData((prevData) => prevData.map(item =>
                item.id === productId && item.children ? {
                  ...item,
                  children: item.children.map(child =>
                    child.id === component.id ? { ...child, data: component } : child
                  )
                } : item
              ));
              setAllTableData((prevData) => prevData.map(item =>
                item.id === productId && item.children ? {
                  ...item,
                  children: item.children.map(child =>
                    child.id === component.id ? { ...child, data: component } : child
                  )
                } : item
              ));
            } else {
              createNewComponent(component, productId);
            }
            setIsCreateComponentModalOpen(false);
            setEditingComponentId(null);
          }}
        />

        <CreateFeatureModal
          isOpen={isCreateFeatureModalOpen}
          onClose={() => { setIsCreateFeatureModalOpen(false); setEditingFeatureId(null); }}
          componentId={selectedComponentIdForFeature}
          featureId={editingFeatureId}
          onFeatureCreated={(feature, componentId) => {
            if (editingFeatureId) {
              // Update feature in table
              setTableData((prevData) => prevData.map(item =>
                item.type === "product" && item.children ? {
                  ...item,
                  children: item.children.map(child =>
                    child.id === componentId && child.children ? {
                      ...child,
                      children: child.children.map(f =>
                        f.id === feature.id ? { ...f, data: feature } : f
                      )
                    } : child
                  )
                } : item
              ));
              setAllTableData((prevData) => prevData.map(item =>
                item.type === "product" && item.children ? {
                  ...item,
                  children: item.children.map(child =>
                    child.id === componentId && child.children ? {
                      ...child,
                      children: child.children.map(f =>
                        f.id === feature.id ? { ...f, data: feature } : f
                      )
                    } : child
                  )
                } : item
              ));
            } else {
              createNewFeature(feature, componentId);
            }
            setIsCreateFeatureModalOpen(false);
            setEditingFeatureId(null);
          }}
        />

        {selectedProduct && (
          <ProductDetailsPage
            productId={selectedProduct.data.id}
            isOpen={isProductDetailOpen}
            onClose={handleCloseProductDetails}
            onProductUpdated={handleProductUpdate}
            onProductDeleted={() => handleProductDeleted(selectedProduct.data.id)}
          />
        )}

        {selectedComponent && (
          <ComponentDetailsPage
            componentId={selectedComponent.data.id}
            isOpen={isComponentDetailOpen}
            onClose={handleCloseComponentDetails}
            onComponentUpdated={handleComponentUpdated}
            onComponentDeleted={() => {
              handleComponentDeleted(selectedComponent.data.id);
              handleCloseComponentDetails();
            }}
          />
        )}

        {selectedFeature && (
          <FeatureDetailsPage
            featureId={selectedFeature?.id || ''}
            isOpen={isFeatureDetailOpen}
            onClose={handleCloseFeatureDetails}
            onFeatureUpdated={handleFeatureUpdated}
            onFeatureDeleted={() => {
              handleFeatureDeleted(selectedFeature.id);
              handleCloseFeatureDetails();
            }}
          />
        )}

        {/* Enhanced Header with Search and Controls */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Products Board</h2>
              {/* Removed duplicate filter controls here */}
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products, components, features..."
                  className="pl-10 w-64 h-9"
                />
              </div>
              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 gap-1">
                    <Settings className="h-4 w-4" />
                    Board Controls
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Export Data
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    View Analytics
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        {/* Table Container */}
        <div className="bg-white">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-200">
                <TableHead className="w-[417px] text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  Products, Components, Features
                </TableHead>
                <TableHead className="w-[100px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/globe.svg" alt="Version" />
                    Version
                  </div>
                </TableHead>
                <TableHead className="w-[130px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  Status
                </TableHead>
                <TableHead className="w-[120px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  Progress
                </TableHead>
                <TableHead className="w-[144px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/person.svg" alt="Team" />
                    Team
                  </div>
                </TableHead>
                <TableHead className="w-[112px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/file_new.svg" alt="Days" />
                    Days
                  </div>
                </TableHead>
                <TableHead className="w-[170px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/clock.svg" alt="Start Date" />
                    Start Date
                  </div>
                </TableHead>
                <TableHead className="w-[180px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/clock.svg" alt="Target Date" />
                    Target Date
                  </div>
                </TableHead>
                <TableHead className="w-[190px] text-center text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/file_new.svg" alt="Completion Time" />
                    Completion Time
                  </div>
                </TableHead>
                <TableHead className="w-[300px] text-[13px] font-bold text-gray-700 border-r border-gray-200">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/file_new.svg" alt="Remarks" />
                    Remarks
                  </div>
                </TableHead>
                <TableHead className="w-[300px] text-[13px] font-bold text-gray-700">
                  <div className="flex items-center justify-center gap-1">
                    <img className="w-4 h-4" src="/file_new.svg" alt="Description" />
                    Description
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {tableData.map((item) => (
                <React.Fragment key={item.id}>
                  <TableRow className={`hover:bg-gray-50 ${selectedProduct?.id === item.id ? "bg-blue-50" : ""}`}>
                    <TableCell className="w-[417px] p-2 border-r border-gray-200">
                      <div className="flex items-center gap-2" style={{ paddingLeft: `${item.level * 16}px` }}>
                        <div
                          className="flex items-center gap-2 cursor-pointer w-full"
                          onClick={() => toggleExpand(item.type, item.id, item.data)}
                        >
                                                  {item.level < 2 && (
                          loadingItems.has(`${item.type}-${item.id}`) ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : isExpanded(item.type, item.id) ? (
                            <ChevronDown size={18} className="text-gray-500" />
                          ) : (
                            <ChevronRight size={18} className="text-gray-500" />
                          )
                        )}

                          <div className="flex items-center justify-between w-full">
                            <span
                              className={`cursor-pointer ${
                                item.type === "product" ? "hover:text-blue-600" : ""
                              } text-gray-700 text-[16px] font-medium`}
                              onClick={(e) => {
                                if (item.type === "product") {
                                  e.stopPropagation();
                                  handleProductSelection(item);
                                }
                              }}
                            >
                              {item.name}
                            </span>
                            <div className="flex items-center gap-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => handleCreateComponentClick(item.id)}
                                      className="p-2 rounded-full bg-green-50 hover:bg-green-100 text-green-600 hover:text-green-800 transition"
                                      aria-label="Add component"
                                    >
                                      <img className="w-4 h-4" src="/add.svg" alt="Add" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom" align="center">
                                    Add component
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {/* <Button size="sm" variant="outline" onClick={() => handleEditProduct(item.id)} className="h-8 ml-2">
                                Edit
                              </Button> */}
                            </div>
                          </div>
                        </div>
                        {creatingComponentForProduct === item.id && (
                          <div className="ml-2 flex items-center gap-2">
                            <Input
                              type="text"
                              placeholder="Enter component name"
                              value={newComponentName}
                              onChange={(e) => setNewComponentName(e.target.value)}
                              className="w-48 h-8"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleSaveNewComponent(item.id)}
                              className="h-8"
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={handleCancelNewComponent}
                              className="h-8"
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="w-[100px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {item.data.version || "1.0.0"}
                    </TableCell>
                    <TableCell className="w-[130px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.data.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        item.data.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        item.data.status === 'Todo' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {item.data.status || "-"}
                      </span>
                    </TableCell>
                    <TableCell className="w-[120px] text-center text-[12px] text-gray-700 border-r border-gray-200">
                      <div className="flex items-center gap-2" title={versionFilter && versionFilter.length > 0 ? `Version ${versionFilter[0]} Progress` : "Product Progress"}>
                        <div className="w-16 bg-gray-200 rounded-full h-2" style={{ minWidth: 64 }}>
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${getProgressValue(item)}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {getProgressValue(item)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[144px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {item.data.team || "-"}
                    </TableCell>
                    <TableCell className="w-[112px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {item.data.days !== undefined ? item.data.days : "-"}
                    </TableCell>
                    <TableCell className="w-[120px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {(() => {
                        const startDate = item.data.startdate;
                        if (!startDate) return "-";
                        if (typeof startDate === 'string') return startDate;
                        return (startDate as Date).toISOString().split('T')[0];
                      })()}
                    </TableCell>
                    <TableCell className="w-[120px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {(() => {
                        const endDate = item.data.targetdate;
                        if (!endDate) return "-";
                        if (typeof endDate === 'string') return endDate;
                        return (endDate as Date).toISOString().split('T')[0];
                      })()}
                    </TableCell>
                    <TableCell className="w-[170px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      {item.data.completedon || "-"}
                    </TableCell>
                    <TableCell className="w-[300px] text-center text-[14px] text-gray-700 border-r border-gray-200">
                      <span className="truncate block">{item.data.remarks || "-"}</span>
                    </TableCell>
                    <TableCell className="w-[300px] text-center text-[14px] text-gray-700">
                      <span className="break-words whitespace-normal text-left">{item.data.description || "-"}</span>
                    </TableCell>
                  </TableRow>
                  {item.children &&
                    isExpanded(item.type, item.id) &&
                    renderChildren(item.children)}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Enhanced Footer */}
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          {creatingProduct ? (
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Enter product name"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-80 h-10"
              />
              <Button size="sm" onClick={handleSaveNewProduct} className="h-10 px-6">
                Save Product
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancelNewProduct}
                className="h-10 px-6"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  onClick={handleCreateProductClick}
                  className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <img className="w-4 h-4 mr-2" src="/add.svg" alt="Add" />
                  Create Product
                </Button>
                <span className="text-sm text-gray-500">
                  {tableData.length} product{tableData.length !== 1 ? 's' : ''} • Click to expand and view components
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Last updated: {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}







