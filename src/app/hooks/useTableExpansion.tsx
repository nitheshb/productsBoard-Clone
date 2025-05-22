
// import { useState, useCallback } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import { Product, Component,TableItem } from '@/app/types';


// export function useTableExpansion() {
//   const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

//   const isExpanded = useCallback((type: string, id: string) => {
//     return !!expandedItems[`${type}-${id}`];
//   }, [expandedItems]);

//   const fetchComponents = useCallback(async (productId: string, teamFilter: string[] = []) => {
//     try {
//       const { data: componentsData, error: componentsError } = await supabase
//         .from("components")
//         .select("*")
//         .eq("product_id", productId);

//       if (componentsError) throw componentsError;
      
//       // Apply team filter if needed (for UI consistency)
//       let filteredComponents = [...componentsData];
      
//       if (teamFilter.length > 0) {
//         // We still return all components, but ensure their progress values are correct
//         // for the selected team by rerunning the progress calculation
//         try {
//           await import('@/utils/progressCalculator').then(({ updateComponentProgressInDb }) => {
//             // Update each component progress based on the team filter
//             componentsData.forEach(async (component) => {
//               await updateComponentProgressInDb(component.id, teamFilter);
//             });
//           });
          
//           // Fetch updated components with correct progress
//           const { data: updatedComponents } = await supabase
//             .from("components")
//             .select("*")
//             .eq("product_id", productId);
            
//           if (updatedComponents) {
//             filteredComponents = updatedComponents;
//           }
//         } catch (error) {
//           console.error("Error updating component progress on expand:", error);
//         }
//       }
      
//       return filteredComponents.map((component) => ({
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
//   }, []);

//   const fetchFeatures = useCallback(async (componentId: string, teamFilter: string[] = []) => {
//     try {
//       // Construct our base query to get all features for this component
//       let query = supabase
//         .from("features")
//         .select("*")
//         .eq("component_id", componentId);
      
//       // Get features for this component
//       const { data: featuresData, error: featuresError } = await query;

//       if (featuresError) throw featuresError;
      
//       // Return all features but mark/indicate which ones match the team filter
//       return featuresData.map((feature) => ({
//         type: "feature" as const,
//         id: feature.id,
//         name: feature.name || "Feature",
//         level: 2,
//         data: feature,
//         matchesTeamFilter: teamFilter.length === 0 || teamFilter.includes(feature.team || '')
//       }));
//     } catch (error) {
//       console.error("Error fetching features:", error);
//       return [];
//     }
//   }, []);

//   const toggleExpand = useCallback(async (
//     type: string,
//     id: string,
//     data: Product | Component,
//     tableData: TableItem[] = [],
//     setTableData: (data: TableItem[]) => void,
//     allTableData: TableItem[] = [],
//     setAllTableData: (data: TableItem[]) => void,
//     teamFilter: string[] = []
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
//           const components = await fetchComponents(id, teamFilter);

//           setTableData((prevData: TableItem[]) => {
//               return prevData.map((item) =>
//                   item.id === id
//                       ? { ...item, children: components as TableItem[] }
//                       : item
//               );
//           });

//           setAllTableData((prevAllData: TableItem[]) =>
//             prevAllData.map((item) =>
//               item.id === id ? { ...item, children: components } : item
//             )
//           );
//         }
//       } else if (type === "component") {
//         let componentFound = false;
//         tableData.forEach((product) => {
//           if (product.children) {
//             const componentIndex = product.children.findIndex(
//               (comp) => comp.id === id
//             );
//             if (componentIndex >= 0) {
//               componentFound = true;
//             }
//           }
//         });

//         if (componentFound) {
//           const features = await fetchFeatures(id, teamFilter);

//           // Ensure component progress is updated before displaying its features
//           if (teamFilter.length > 0) {
//             try {
//               await import('@/utils/progressCalculator').then(({ updateComponentProgressInDb }) => {
//                 updateComponentProgressInDb(id, teamFilter);
//               });
              
//               // Get updated component data with correct progress
//               const { data: updatedComponent } = await supabase
//                 .from("components")
//                 .select("*")
//                 .eq("id", id)
//                 .single();
                
//               if (updatedComponent) {
//                 // Update the component in tableData and allTableData with the updated progress value
//                 setTableData((prevData: TableItem[]) =>
//                   prevData.map((product) => {
//                     if (product.children) {
//                       return {
//                         ...product,
//                         children: product.children.map((comp) =>
//                           comp.id === id ? { ...comp, data: updatedComponent, children: features } : comp
//                         ),
//                       };
//                     }
//                     return product;
//                   })
//                 );
                
//                 setAllTableData((prevData: TableItem[]) =>
//                   prevData.map((product) => {
//                     if (product.children) {
//                       return {
//                         ...product,
//                         children: product.children.map((comp) =>
//                           comp.id === id ? { ...comp, data: updatedComponent, children: features } : comp
//                         ),
//                       };
//                     }
//                     return product;
//                   })
//                 );
                
//                 return; // We've already updated everything
//               }
//             } catch (error) {
//               console.error("Error updating component progress when expanding:", error);
//             }
//           }
          
//           // Fall back to standard behavior if we didn't do the team-filtered update
//           setTableData((prevData: TableItem[]) =>
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

//           setAllTableData((prevData: TableItem[]) =>
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
//   }, [expandedItems, fetchComponents, fetchFeatures]);

//   return {
//     expandedItems,
//     isExpanded,
//     toggleExpand,
//     setExpandedItems
//   };
// }
