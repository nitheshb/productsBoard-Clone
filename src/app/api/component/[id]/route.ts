

// components/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { updateProductProgressWithParents } from '@/utils/progressCalculator';

// Helper function to determine status based on progress
const getStatusFromProgress = (progress: number): string => {
  if (progress === 0) {
    return 'Todo';
  } else if (progress === 100) {
    return 'Completed';
  } else {
    return 'In Progress';
  }
};

// Helper function to validate status values
const isValidStatus = (status: string | undefined): boolean => {
  if (!status) return false;
  const validStatuses = ['Todo', 'In Progress', 'Completed'];
  return validStatuses.includes(status);
};

// Get a single component with its features
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: 'Invalid component ID' }, { status: 400 });
    }

    // Fetch the component
    const { data: component, error: componentError } = await supabase
      .from('components')
      .select('*')
      .eq('id', id)
      .single();

    if (componentError) {
      if (componentError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Component not found' }, { status: 404 });
      }
      console.error('Database error fetching component:', componentError);
      return NextResponse.json({ error: 'Failed to fetch component' }, { status: 500 });
    }

    // Fetch features for this component
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('*')
      .eq('component_id', id);

      if (featuresError) {
        console.error('Database error fetching features:', featuresError);
        return NextResponse.json({ error: 'Failed to fetch features' }, { status: 500 });
      }
  

    // Add features to the component
    const structuredComponent = {
      ...component,
      features
    };
    return NextResponse.json({
      ...component,
      features: features || []
    });
  } catch (error) {
    console.error('Error fetching component:', error);
    return NextResponse.json({ error: 'Failed to fetch component' }, { status: 500 });
  }
}

// Update a component
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if component exists and get its product_id
    const { data: existingComponent, error: checkError } = await supabase
      .from('components')
      .select('id, product_id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Component not found' }, { status: 404 });
      }
      throw checkError;
    }

    // Extract the flag, defaulting to true if not specified
    const shouldUpdateProductProgress = body.updateProductProgress !== false;
    
    // Remove the flag from the body before updating
    const updateData = { ...body };
    delete updateData.updateProductProgress;

    // Validate status if provided
    if (updateData.status && !isValidStatus(updateData.status)) {
      return NextResponse.json({ 
        error: 'Invalid status value. Must be one of: Todo, In Progress, Completed' 
      }, { status: 400 });
    }

    // Always update all fields, setting to null if not present in the body
    const updateFields: any = {
      name: updateData.name ?? null,
      status: updateData.status ?? null,
      progress: updateData.progress ?? null,
      team: updateData.team ?? null,
      days: updateData.days ?? null,
      startdate: updateData.startDate ?? updateData.startdate ?? null,
      targetdate: updateData.targetDate ?? updateData.targetdate ?? null,
      completedon: updateData.completedOn ?? updateData.completedon ?? null,
      remarks: updateData.remarks ?? null,
      description: updateData.description ?? null,
      version: updateData.version ?? null,
      product_id: updateData.product_id ?? null
    };

    // Handle date fields with snake_case
    if (updateData.startDate !== undefined) {
      updateFields.startdate = updateData.startDate;
    }
    if (updateData.targetDate !== undefined) {
      updateFields.targetdate = updateData.targetDate;
    }
    if (updateData.completedOn !== undefined) {
      updateFields.completedon = updateData.completedOn;
    }

    // Remove any camelCase date fields
    delete updateFields.startDate;
    delete updateFields.targetDate;
    delete updateFields.completedOn;

    // If progress is provided, automatically set status based on progress
    // But only if status is not explicitly provided
    if (updateData.progress !== undefined && updateData.status === undefined) {
      updateFields.status = getStatusFromProgress(updateData.progress);
      console.log(`Auto-setting status to ${updateFields.status} based on progress ${updateData.progress}`);
    } else if (updateData.status !== undefined) {
      console.log(`Using explicit status: ${updateData.status}`);
    }

    console.log('Updating component with fields:', updateFields);
    
    const { data, error } = await supabase
      .from('components')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) throw error;
    
    console.log('Component updated successfully:', data[0]);

    // Update product progress and version progress if flag is true
    if (shouldUpdateProductProgress && existingComponent?.product_id) {
      try {
        console.log(`Updating product progress for product ${existingComponent.product_id} after component update`);
        const updatedProgress = await updateProductProgressWithParents(existingComponent.product_id);
        console.log(`Product progress updated to: ${updatedProgress}%`);
      } catch (progressError) {
        console.error('Error updating product progress:', progressError);
        // Don't fail the component update if progress update fails
      }
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating component:', error);
    return NextResponse.json({ error: 'Failed to update component' }, { status: 500 });
  }
}

// Delete a component
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the product_id before deleting
    const { data: component, error: fetchError } = await supabase
      .from('components')
      .select('product_id')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Delete the component (cascade deletion will handle features)
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update product progress and version progress after deletion
    if (component?.product_id) {
      try {
        await updateProductProgressWithParents(component.product_id);
      } catch (progressError) {
        console.error('Error updating product progress after deletion:', progressError);
        // Don't fail the deletion if progress update fails
      }
    }

    return NextResponse.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 });
  }
}

