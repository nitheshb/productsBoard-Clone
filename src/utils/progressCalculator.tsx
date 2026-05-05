
import { supabase } from "@/lib/supabaseClient";
import { 
  updateComponentVersionProgress, 
  updateProductVersionProgress,
  updateParentComponentVersionProgress,
  updateParentProductVersionProgress
} from "./versionProgressCalculator";

export const calculateFeatureProgress = (status: string): number => {
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

// Helper function to determine status based on progress
export const getStatusFromProgress = (progress: number): string => {
  if (progress === 0) {
    return 'Todo';
  } else if (progress === 100) {
    return 'Completed';
  } else {
    return 'In Progress';
  }
};

// Helper function to determine status based on children's status
export const getStatusFromChildrenStatus = (childrenStatuses: string[]): string => {
  if (childrenStatuses.length === 0) {
    return 'Todo';
  }
  
  // If any child is "In Progress", parent should be "In Progress"
  if (childrenStatuses.some(status => status === 'In Progress')) {
    return 'In Progress';
  }
  
  // If all children are "Completed", parent should be "Completed"
  if (childrenStatuses.every(status => status === 'Completed')) {
    return 'Completed';
  }
  
  // If any child is "Blocked", parent should be "Blocked"
  if (childrenStatuses.some(status => status === 'Blocked')) {
    return 'Blocked';
  }
  
  // Default to "Todo" if all children are "Todo"
  return 'Todo';
};

export const updateComponentProgressInDb = async (componentId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    let query = supabase
      .from('pb_features')
      .select('progress, team, version, status')
      .eq('component_id', componentId);
      
    if (teamFilter && teamFilter.length > 0) {
      query = query.in('team', teamFilter);
    }

    if (versionFilter && versionFilter.length > 0) {
      query = query.in('version', versionFilter);
    }

    const { data: features, error: featuresError } = await query;
    
    if (featuresError) throw featuresError;

    if (!features || features.length === 0) {
      await supabase
        .from('pb_components')
        .update({ progress: 0, status: 'Todo' })
        .eq('id', componentId);
      return 0;
    }

    // Calculate average progress from actual progress values
    const total = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    const average = Math.round(total / features.length);
    
    console.log(`Component ${componentId} progress calculation:`, {
      features: features.length,
      totalProgress: total,
      averageProgress: average,
      featureProgresses: features.map(f => ({ progress: f.progress, status: f.status }))
    });

    // Determine status based on features' status
    const featureStatuses = features.map(feature => feature.status || 'Todo');
    const status = getStatusFromChildrenStatus(featureStatuses);

    await supabase
      .from('pb_components')
      .update({ progress: average, status: status })
      .eq('id', componentId);
    
    // Get the subproduct_id for this component to trigger parent update
    const { data: componentData } = await supabase
      .from('pb_components')
      .select('subproduct_id')
      .eq('id', componentId)
      .single();

    if (componentData?.subproduct_id) {
      await updateSubproductProgressInDb(componentData.subproduct_id);
    }
    
    // Update version progress for this component
    await updateComponentVersionProgress(componentId);
      
    return average;
  } catch (error) {
    console.error('Error updating component progress:', error);
    throw error;
  }
};

export const updateSubproductProgressInDb = async (subproductId: string) => {
  try {
    const { data: components, error } = await supabase
      .from('pb_components')
      .select('progress, status')
      .eq('subproduct_id', subproductId);

    if (error) throw error;

    if (!components || components.length === 0) {
      await supabase
        .from('pb_subproducts')
        .update({ progress: 0, status: 'Todo' })
        .eq('id', subproductId);
      return 0;
    }

    const total = components.reduce((sum, c) => sum + (c.progress || 0), 0);
    const average = Math.round(total / components.length);
    const statuses = components.map(c => c.status || 'Todo');
    const status = getStatusFromChildrenStatus(statuses);

    await supabase
      .from('pb_subproducts')
      .update({ progress: average, status: status })
      .eq('id', subproductId);

    // Get the product_id for this subproduct to trigger parent update
    const { data: subproductData } = await supabase
      .from('pb_subproducts')
      .select('product_id')
      .eq('id', subproductId)
      .single();

    if (subproductData?.product_id) {
      await updateProductProgressInDb(subproductData.product_id);
    }

    return average;
  } catch (error) {
    console.error('Error updating subproduct progress:', error);
    throw error;
  }
};

export const updateProductProgressInDb = async (productId: string) => {
  try {
    const { data: subproducts, error } = await supabase
      .from('pb_subproducts')
      .select('progress, status')
      .eq('product_id', productId);
      
    if (error) throw error;

    if (!subproducts || subproducts.length === 0) {
      await supabase
        .from('pb_products')
        .update({ progress: 0, status: 'Todo' })
        .eq('id', productId);
      return 0;
    }

    const total = subproducts.reduce((sum, s) => sum + (s.progress || 0), 0);
    const average = Math.round(total / subproducts.length);
    const statuses = subproducts.map(s => s.status || 'Todo');
    const status = getStatusFromChildrenStatus(statuses);

    const { error: updateError } = await supabase
      .from('pb_products')
      .update({ progress: average, status: status })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    // Update version progress for this product
    await updateProductVersionProgress(productId);
      
    return average;
  } catch (error) {
    console.error('Error updating product progress:', error);
    throw error;
  }
};

// Update component progress and trigger parent updates
export const updateComponentProgressWithParents = async (componentId: string) => {
  try {
    const progress = await updateComponentProgressInDb(componentId);
    // updateComponentProgressInDb already triggers subproduct and product updates
    return progress;
  } catch (error) {
    console.error('Error updating component progress with parents:', error);
    throw error;
  }
};

// Update product progress and trigger parent updates
export const updateProductProgressWithParents = async (productId: string) => {
  try {
    const progress = await updateProductProgressInDb(productId);
    await updateParentProductVersionProgress(productId);
    return progress;
  } catch (error) {
    console.error('Error updating product progress with parents:', error);
    throw error;
  }
};

// Update product progress with full component recalculation (use when components need updating)
export const updateProductProgressWithComponentRecalculation = async (productId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    let componentsQuery = supabase
      .from('pb_components')
      .select('id, progress, version, status')
      .eq('product_id', productId);

    const { data: components, error: componentsError } = await componentsQuery;
      
    if (componentsError) throw componentsError;
    if (!components || components.length === 0) {
      await supabase
        .from('pb_products')
        .update({ progress: 0, status: 'Todo' })
        .eq('id', productId);
      return 0;
    }

    // Update each component's progress first
    const progressPromises = components.map(component => 
      updateComponentProgressInDb(component.id, [], [])
    );
    
    await Promise.all(progressPromises);

    // Then calculate product progress from updated component values
    const { data: updatedComponents, error: updatedError } = await supabase
      .from('pb_components')
      .select('progress, status')
      .eq('product_id', productId);
      
    if (updatedError) throw updatedError;

    const componentsWithProgress = updatedComponents.filter(c => 
      c.progress !== null && c.progress !== undefined
    );
    
    let averageProgress = 0;
    if (componentsWithProgress.length > 0) {
      const totalProgress = componentsWithProgress.reduce((sum, component) => 
        sum + (component.progress || 0), 0
      );
      averageProgress = Math.round(totalProgress / componentsWithProgress.length);
    }

    // Determine status based on updated components' status
    const componentStatuses = updatedComponents.map(component => component.status || 'Todo');
    const status = getStatusFromChildrenStatus(componentStatuses);

    const { error: updateError } = await supabase
      .from('pb_products')
      .update({ progress: averageProgress, status: status })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    // Update version progress for this product
    await updateProductVersionProgress(productId);
      
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress with component recalculation:', error);
    throw error;
  }
};

export const updateAllProgress = async () => {
  try {
    const productsQuery = supabase
      .from('pb_products')
      .select('id, version');
      
    const { data: products, error } = await productsQuery;
      
    if (error) throw error;

    for (const product of products) {
      await updateProductProgressInDb(product.id);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating all progress:', error);
    return false;
  }
};
