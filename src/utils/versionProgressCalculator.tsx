import { supabase } from '@/lib/supabaseClient';
import { VersionProgress } from '@/app/types';

// Calculate version progress for a component based on its features
export const calculateComponentVersionProgress = async (componentId: string): Promise<VersionProgress[]> => {
  try {
    // Get all features for this component
    const { data: features, error } = await supabase
      .from('features')
      .select('version, progress')
      .eq('component_id', componentId);

    if (error) throw error;

    if (!features || features.length === 0) {
      return [];
    }

    // Group features by version and calculate average progress
    const versionGroups: { [key: string]: number[] } = {};
    
    features.forEach(feature => {
      const version = feature.version || '1.0.0';
      if (!versionGroups[version]) {
        versionGroups[version] = [];
      }
      versionGroups[version].push(feature.progress || 0);
    });

    // Calculate average progress for each version
    const versionProgress: VersionProgress[] = Object.entries(versionGroups).map(([version, progresses]) => {
      const averageProgress = Math.round(
        progresses.reduce((sum, progress) => sum + progress, 0) / progresses.length
      );
      return { version, progress: averageProgress };
    });

    return versionProgress;
  } catch (error) {
    console.error('Error calculating component version progress:', error);
    throw error;
  }
};

// Calculate version progress for a product based on its components
export const calculateProductVersionProgress = async (productId: string): Promise<VersionProgress[]> => {
  try {
    // Get all components for this product
    const { data: components, error } = await supabase
      .from('components')
      .select('version, progress')
      .eq('product_id', productId);

    if (error) throw error;

    if (!components || components.length === 0) {
      return [];
    }

    // Group components by version and calculate average progress
    const versionGroups: { [key: string]: number[] } = {};
    
    components.forEach(component => {
      const version = component.version || '1.0.0';
      if (!versionGroups[version]) {
        versionGroups[version] = [];
      }
      versionGroups[version].push(component.progress || 0);
    });

    // Calculate average progress for each version
    const versionProgress: VersionProgress[] = Object.entries(versionGroups).map(([version, progresses]) => {
      const averageProgress = Math.round(
        progresses.reduce((sum, progress) => sum + progress, 0) / progresses.length
      );
      return { version, progress: averageProgress };
    });

    return versionProgress;
  } catch (error) {
    console.error('Error calculating product version progress:', error);
    throw error;
  }
};

// Update component's version progress in database
export const updateComponentVersionProgress = async (componentId: string): Promise<void> => {
  try {
    const versionProgress = await calculateComponentVersionProgress(componentId);
    
    const { error } = await supabase
      .from('components')
      .update({ version_progress: versionProgress })
      .eq('id', componentId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating component version progress:', error);
    throw error;
  }
};

// Update product's version progress in database
export const updateProductVersionProgress = async (productId: string): Promise<void> => {
  try {
    const versionProgress = await calculateProductVersionProgress(productId);
    
    const { error } = await supabase
      .from('products')
      .update({ version_progress: versionProgress })
      .eq('id', productId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating product version progress:', error);
    throw error;
  }
};

// Update all parent components' version progress when a feature is updated
export const updateParentComponentVersionProgress = async (componentId: string): Promise<void> => {
  try {
    await updateComponentVersionProgress(componentId);
    
    // Get the component to find its parent product
    const { data: component, error } = await supabase
      .from('components')
      .select('product_id')
      .eq('id', componentId)
      .single();

    if (error) throw error;
    if (component) {
      await updateProductVersionProgress(component.product_id);
    }
  } catch (error) {
    console.error('Error updating parent component version progress:', error);
    throw error;
  }
};

// Update all parent products' version progress when a component is updated
export const updateParentProductVersionProgress = async (productId: string): Promise<void> => {
  try {
    await updateProductVersionProgress(productId);
  } catch (error) {
    console.error('Error updating parent product version progress:', error);
    throw error;
  }
};

// Get version progress for display
export const getVersionProgressDisplay = (versionProgress: VersionProgress[] | null | undefined): string => {
  if (!versionProgress || versionProgress.length === 0) {
    return 'No version data';
  }
  
  // Format as "v1.0.0: 75%, v2.0.0: 60%"
  return versionProgress
    .map(vp => `v${vp.version}: ${vp.progress}%`)
    .join(', ');
};

// Get progress for a specific version
export const getProgressForVersion = (versionProgress: VersionProgress[] | null, targetVersion: string): number => {
  if (!versionProgress || versionProgress.length === 0) {
    return 0;
  }
  
  const versionData = versionProgress.find(vp => vp.version === targetVersion);
  return versionData ? versionData.progress : 0;
}; 