
import { supabase } from "@/lib/supabaseClient";

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

export const updateComponentProgressInDb = async (componentId: string, teamFilter: string[] = [], versionFilter: string[] = []) => {
  try {
    let query = supabase
      .from('features')
      .select('progress, team, version')
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
        .update({ progress: 0 })
        .eq('id', componentId);
      return 0;
    }

    // Calculate average progress from actual progress values
    const total = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    const average = Math.round(total / features.length);

    await supabase
      .from('components')
      .update({ progress: average })
      .eq('id', componentId);
      
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
      .select('id, progress, version')
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
        .update({ progress: 0 })
        .eq('id', productId);
      return 0;
    }

    // First update each component's progress (without filters)
    const progressPromises = components.map(component => 
      updateComponentProgressInDb(component.id, [], [])
    );
    
    await Promise.all(progressPromises);

    // Get updated component progress values
    const { data: updatedComponents, error: updatedError } = await supabase
      .from('components')
      .select('progress')
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

    console.log(`Updating product ${productId} progress to ${averageProgress}%`);

    const { error: updateError } = await supabase
      .from('products')
      .update({ progress: averageProgress })
      .eq('id', productId);
      
    if (updateError) throw updateError;
      
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress:', error);
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
