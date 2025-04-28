
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Helper function to calculate progress from status
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

// Function to update component progress based on its features
async function updateComponentProgress(componentId: number) {
  try {
    // Get all features for this component
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('progress')
      .eq('component_id', componentId);
    
    if (featuresError) throw featuresError;
    
    // Calculate average progress
    const totalProgress = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    const averageProgress = features.length > 0 ? Math.round(totalProgress / features.length) : 0;
    
    // Update the component's progress
    const { error: updateError } = await supabase
      .from('components')
      .update({ progress: averageProgress })
      .eq('id', componentId);
    
    if (updateError) throw updateError;
    
    // Get the product_id for this component
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

// Function to update product progress based on its components
async function updateProductProgress(productId: number) {
  try {
    // Get all components for this product
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('progress')
      .eq('product_id', productId);
    
    if (componentsError) throw componentsError;
    
    // Calculate average progress
    const totalProgress = components.reduce((sum, component) => sum + (component.progress || 0), 0);
    const averageProgress = components.length > 0 ? Math.round(totalProgress / components.length) : 0;
    
    // Update the product's progress
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
}

// Get a single feature
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch the feature
    const { data, error } = await supabase
      .from('features')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching feature:', error);
    return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
  }
}

// Update a feature
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if feature exists
    const { data: existingFeature, error: checkError } = await supabase
      .from('features')
      .select('id, component_id, status, progress')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
      }
      throw checkError;
    }

    // If status is being updated but progress isn't specified, calculate progress from status
    if (body.status && body.status !== existingFeature.status && body.progress === undefined) {
      body.progress = calculateProgressFromStatus(body.status);
    }

    // Update the feature
    const { data, error } = await supabase
      .from('features')
      .update({
        name: body.name,
        status: body.status || null,
        progress: body.progress !== undefined ? body.progress : null,
        team: body.team || null,
        days: body.days !== undefined ? body.days : null,
        startDate: body.startDate || null,
        targetDate: body.targetDate || null,
        completedOn: body.completedOn || null,
        remarks: body.remarks || null,
        owner_initials: body.owner_initials,
        color: body.color,
        component_id: body.component_id // Allow moving to a different component
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    // If component_id changed, update both old and new component progress
    if (body.component_id && body.component_id !== existingFeature.component_id) {
      await updateComponentProgress(existingFeature.component_id);
      await updateComponentProgress(body.component_id);
    } else {
      // Otherwise just update the current component's progress
      await updateComponentProgress(existingFeature.component_id);
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
  }
}

// Delete a feature
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the component_id before deleting the feature
    const { data: feature, error: fetchError } = await supabase
      .from('features')
      .select('component_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the feature
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update the component progress after deletion
    await updateComponentProgress(feature.component_id);

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}