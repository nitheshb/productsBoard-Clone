
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

    // Always update all fields, setting to null if not present in the body
    const updateFields: any = {
      name: body.name ?? null,
      status: body.status ?? null,
      progress: body.progress ?? null,
      team: body.team ?? null,
      days: body.days ?? null,
      startdate: body.startDate ?? body.startdate ?? null,
      targetdate: body.targetDate ?? body.targetdate ?? null,
      completedon: body.completedOn ?? body.completedon ?? null,
      remarks: body.remarks ?? null,
      description: body.description ?? null,
      version: body.version ?? null,
      color: body.color ?? null,
      owner_initials: body.owner_initials ?? null,
      component_id: body.component_id ?? null
    };

    // If progress is provided but status is not, automatically set status based on progress
    if (body.progress !== undefined && body.status === undefined) {
      updateFields.status = getStatusFromProgress(body.progress);
    }

    const { data, error } = await supabase
      .from('features')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) throw error;

    // Update component progress and version progress
    if (existingFeature?.component_id) {
      try {
        await updateComponentProgressWithParents(existingFeature.component_id);
      } catch (progressError) {
        console.error('Error updating component progress:', progressError);
        // Don't fail the feature update if progress update fails
      }
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
