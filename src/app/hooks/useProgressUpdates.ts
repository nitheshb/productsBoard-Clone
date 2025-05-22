
// import { useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { updateProductProgressInDb, updateComponentProgressInDb } from '@/utils/progressCalculator';

// export function useProgressUpdates() {
//   const [isUpdating, setIsUpdating] = useState(false);

//   // Update a specific component's progress
//   const updateComponentProgress = async (componentId: string, teamFilter: string[] = []) => {
//     setIsUpdating(true);
//     try {
//       await updateComponentProgressInDb(componentId, teamFilter);
      
//       // Get the component to find its product
//       const { data: component } = await supabase
//         .from('components')
//         .select('product_id')
//         .eq('id', componentId)
//         .single();
        
//       if (component) {
//         // Update the product progress too
//         await updateProductProgressInDb(component.product_id, teamFilter);
//       }
      
//       return true;
//     } catch (error) {
//       console.error("Error updating progress:", error);
//       return false;
//     } finally {
//       setIsUpdating(false);
//     }
//   };
  
//   // Update a specific product's progress
//   const updateProductProgress = async (productId: string, teamFilter: string[] = []) => {
//     setIsUpdating(true);
//     try {
//       await updateProductProgressInDb(productId, teamFilter);
//       return true;
//     } catch (error) {
//       console.error("Error updating product progress:", error);
//       return false;
//     } finally {
//       setIsUpdating(false);
//     }
//   };

//   return {
//     isUpdating,
//     updateComponentProgress,
//     updateProductProgress
//   };
// }



import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { updateProductProgressInDb, updateComponentProgressInDb } from '@/utils/progressCalculator';
import { TableItem } from '@/app/types';

export function useProgressUpdates() {
  const [isUpdating, setIsUpdating] = useState(false);

  // Update a specific component's progress
  const updateComponentProgress = async (componentId: string, teamFilter: string[] = []) => {
    setIsUpdating(true);
    try {
      // Update the component progress in the database
      await updateComponentProgressInDb(componentId, teamFilter);
      
      // Get the component to find its product
      const { data: component } = await supabase
        .from('components')
        .select('product_id')
        .eq('id', componentId)
        .single();
        
      if (component) {
        // Update the product progress too
        await updateProductProgressInDb(component.product_id, teamFilter);
      }
      
      return true;
    } catch (error) {
      console.error("Error updating progress:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Update a specific product's progress
  const updateProductProgress = async (productId: string, teamFilter: string[] = []) => {
    setIsUpdating(true);
    try {
      await updateProductProgressInDb(productId, teamFilter);
      return true;
    } catch (error) {
      console.error("Error updating product progress:", error);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Refresh table data with latest progress values
  const refreshProgressData = async (
    tableData: TableItem[], 
    setTableData: (data: TableItem[]) => void,
    teamFilter: string[] = []
  ) => {
    try {
      // Get all product IDs
      const productIds = tableData
        .filter(item => item.type === "product")
        .map(item => item.id);

      // Get updated product data with latest progress
      if (productIds.length > 0) {
        const { data: updatedProducts } = await supabase
          .from("products")
          .select("*")
          .in("id", productIds);

        if (updatedProducts) {
          // Update products in the table data
          setTableData(
            tableData.map(item => {
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

      // Get all component IDs
      const componentIds: string[] = [];
      tableData.forEach(product => {
        if (product.children) {
          product.children.forEach(component => {
            componentIds.push(component.id);
          });
        }
      });

      // Get updated component data
      if (componentIds.length > 0) {
        const { data: updatedComponents } = await supabase
          .from("components")
          .select("*")
          .in("id", componentIds);

        if (updatedComponents) {
          // Update components in the table data
          setTableData(
            tableData.map(product => {
              if (product.children) {
                return {
                  ...product,
                  children: product.children.map(component => {
                    const updatedComponent = updatedComponents.find(c => c.id === component.id);
                    if (updatedComponent) {
                      return { ...component, data: updatedComponent };
                    }
                    return component;
                  })
                };
              }
              return product;
            })
          );
        }
      }

      return true;
    } catch (error) {
      console.error("Error refreshing progress data:", error);
      return false;
    }
  };

  return {
    isUpdating,
    updateComponentProgress,
    updateProductProgress,
    refreshProgressData
  };
}
