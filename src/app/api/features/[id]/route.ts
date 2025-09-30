
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { updateComponentProgressWithParents } from '@/utils/progressCalculator';

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


export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if feature exists and get its component_id
    const { data: existingFeature, error: checkError } = await supabase
      .from('features')
      .select('id, component_id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
      }
      throw checkError;
    }

    // Validate status if provided
    if (body.status && !isValidStatus(body.status)) {
      return NextResponse.json({ 
        error: 'Invalid status value. Must be one of: Todo, In Progress, Completed' 
      }, { status: 400 });
    }

    // Always update all fields, setting to null if not present in the body
    const updateFields: any = {
      name: body.name ?? null,
      status: body.status ?? null,
      progress: body.progress ?? null,
      team: body.team ?? null,
      days: body.days ?? null,
      startdate: body.startdate ?? null,
      targetdate: body.targetdate ?? null,
      completedon: body.completedon ?? null,
      remarks: body.remarks ?? null,
      description: body.description ?? null,
      version: body.version ?? null,
      component_id: body.component_id ?? null
    };

    // Remove any undefined values to prevent database errors
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] === undefined) {
        updateFields[key] = null;
      }
    });

    // If progress is provided, automatically set status based on progress
    // But only if status is not explicitly provided
    if (body.progress !== undefined && body.status === undefined) {
      updateFields.status = getStatusFromProgress(body.progress);
    }

    console.log('Updating feature with fields:', updateFields);
    
    let updateData;
    try {
      const { data, error } = await supabase
        .from('features')
        .update(updateFields)
        .eq('id', id)
        .select();

      if (error) {
        console.error('Supabase update error:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }

      updateData = data;
      console.log('Supabase update successful, data:', data);
    } catch (updateError) {
      console.error('Error during Supabase update:', updateError);
      console.error('Update error details:', JSON.stringify(updateError, null, 2));
      throw updateError;
    }

    // Update component progress and version progress
    if (existingFeature?.component_id) {
      try {
        console.log('Updating component progress for component_id:', existingFeature.component_id);
        await updateComponentProgressWithParents(existingFeature.component_id);
        console.log('Component progress updated successfully');
      } catch (progressError) {
        console.error('Error updating component progress:', progressError);
        console.error('Progress error details:', JSON.stringify(progressError, null, 2));
        // Don't fail the feature update if progress update fails
      }
    }

    return NextResponse.json(updateData[0]);
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

    // Get the component_id before deleting
    const { data: feature, error: fetchError } = await supabase
      .from('features')
      .select('component_id')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    // Delete the feature
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update component progress and version progress after deletion
    if (feature?.component_id) {
      try {
        await updateComponentProgressWithParents(feature.component_id);
      } catch (progressError) {
        console.error('Error updating component progress after deletion:', progressError);
        // Don't fail the deletion if progress update fails
      }
    }

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}
