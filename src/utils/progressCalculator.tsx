
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
      .from('features')
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
        .from('components')
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
      .from('components')
      .update({ progress: average, status: status })
      .eq('id', componentId);
    
    // Update version progress for this component
    await updateComponentVersionProgress(componentId);
      
    return average;
  } catch (error) {
    console.error('Error updating component progress:', error);
    throw error;
  }
};

export const updateProductProgressInDb = async (productId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    let componentsQuery = supabase
      .from('components')
      .select('id, progress, version, status')
      .eq('product_id', productId);
      
    // Remove version filter - always calculate from ALL components
    // if (versionFilter && versionFilter.length > 0) {
    //   componentsQuery = componentsQuery.in('version', versionFilter);
    // }

    const { data: components, error: componentsError } = await componentsQuery;
      
    if (componentsError) throw componentsError;
    if (!components || components.length === 0) {
      await supabase
        .from('products')
        .update({ progress: 0, status: 'Todo' })
        .eq('id', productId);
      return 0;
    }

    // Calculate average progress directly from existing component progress values
    const componentsWithProgress = components.filter(c => 
      c.progress !== null && c.progress !== undefined
    );
    
    let averageProgress = 0;
    if (componentsWithProgress.length > 0) {
      const totalProgress = componentsWithProgress.reduce((sum, component) => 
        sum + (component.progress || 0), 0
      );
      averageProgress = Math.round(totalProgress / componentsWithProgress.length);
    }

    // Determine status based on components' status
    const componentStatuses = components.map(component => component.status || 'Todo');
    const status = getStatusFromChildrenStatus(componentStatuses);

    const { error: updateError } = await supabase
      .from('products')
      .update({ progress: averageProgress, status: status })
      .eq('id', productId);
      
    if (updateError) throw updateError;
    
    // Update version progress for this product
    await updateProductVersionProgress(productId);
      
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress:', error);
    throw error;
  }
};

// Update component progress and trigger parent updates
export const updateComponentProgressWithParents = async (componentId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    const progress = await updateComponentProgressInDb(componentId, teamFilter, versionFilter);
    await updateParentComponentVersionProgress(componentId);
    return progress;
  } catch (error) {
    console.error('Error updating component progress with parents:', error);
    throw error;
  }
};

// Update product progress and trigger parent updates
export const updateProductProgressWithParents = async (productId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    const progress = await updateProductProgressInDb(productId, teamFilter, versionFilter);
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
      .from('components')
      .select('id, progress, version, status')
      .eq('product_id', productId);

    const { data: components, error: componentsError } = await componentsQuery;
      
    if (componentsError) throw componentsError;
    if (!components || components.length === 0) {
      await supabase
        .from('products')
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
      .from('components')
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
      .from('products')
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

export const updateAllProgress = async (teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    const productsQuery = supabase
      .from('products')
      .select('id, version');
      
    const { data: products, error } = await productsQuery;
      
    if (error) throw error;

    for (const product of products) {
      await updateProductProgressInDb(product.id, [], []);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating all progress:', error);
    return false;
  }
};
