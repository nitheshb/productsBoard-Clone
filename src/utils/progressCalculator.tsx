
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

export const updateComponentProgressInDb = async (componentId: string, teamFilter: string[] = []) => {
  try {

    let query = supabase
      .from('features')
      .select('status, team')
      .eq('component_id', componentId);
      

    if (teamFilter && teamFilter.length > 0) {
      query = query.in('team', teamFilter);
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

    const progressValues = features.map(feature => 
      calculateFeatureProgress(feature.status || 'Todo')
    );

    const total = progressValues.reduce((sum, value) => sum + value, 0);
    const average = Math.round(total / progressValues.length);

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

export const updateProductProgressInDb = async (productId: string, teamFilter: string[] = []) => {
  try {

    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('id')
      .eq('product_id', productId);
      
    if (componentsError) throw componentsError;
    if (!components || components.length === 0) return 0;
    

    const progressPromises = components.map(component => 
      updateComponentProgressInDb(component.id, teamFilter)
    );
    
    await Promise.all(progressPromises);

    const { data: updatedComponents, error: updatedError } = await supabase
      .from('components')
      .select('progress')
      .eq('product_id', productId);
      
    if (updatedError) throw updatedError;

    const componentsWithProgress = updatedComponents.filter(c => c.progress !== null && c.progress !== undefined);
    
    if (componentsWithProgress.length === 0) {
      await supabase
        .from('products')
        .update({ progress: 0 })
        .eq('id', productId);
      return 0;
    }
    
    const totalProgress = componentsWithProgress.reduce((sum, component) => sum + (component.progress || 0), 0);
    const averageProgress = Math.round(totalProgress / componentsWithProgress.length);

    await supabase
      .from('products')
      .update({ progress: averageProgress })
      .eq('id', productId);
      
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress:', error);
    throw error;
  }
};

export const updateAllProgress = async (teamFilter: string[] = []) => {
  try {

    const { data: products, error } = await supabase
      .from('products')
      .select('id');
      
    if (error) throw error;

    for (const product of products) {
      await updateProductProgressInDb(product.id, teamFilter);
    }
    
    return true;
  } catch (error) {
    console.error('Error updating all progress:', error);
    return false;
  }
};