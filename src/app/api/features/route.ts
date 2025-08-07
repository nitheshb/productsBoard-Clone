

// api/features/route.ts
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

// Create a new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.component_id) {
      return NextResponse.json({ error: 'Name and component_id are required' }, { status: 400 });
    }

    // Extract the flag, defaulting to true if not specified
    const shouldUpdateComponentProgress = body.updateComponentProgress !== false;
    
    // Remove the flag from the body before inserting into database
    const featureData = { ...body };
    delete featureData.updateComponentProgress;

    // If status is provided but progress isn't, calculate progress from status
    if (featureData.status && featureData.progress === undefined) {
      featureData.progress = calculateProgressFromStatus(featureData.status);
    }

    // If progress is provided but status isn't, automatically set status based on progress
    if (featureData.progress !== undefined && !featureData.status) {
      featureData.status = getStatusFromProgress(featureData.progress);
    }

    const { data, error } = await supabase
      .from('features')
      .insert([{
        name: featureData.name,
        component_id: featureData.component_id,
        status: featureData.status || 'Todo',
        progress: featureData.progress !== undefined ? featureData.progress : 0,
        team: featureData.team || null,
        days: featureData.days !== undefined ? featureData.days : null,
        startdate: featureData.startDate || null,
        targetdate: featureData.targetDate || null,
        completedon: featureData.completedOn || null,
        remarks: featureData.remarks || null,
        description: featureData.description || null,
        owner_initials: featureData.owner_initials || null,
        color: featureData.color || null,
        version: featureData.version || '1.0.0'
      }])
      .select();

    if (error) {
      console.error('Error creating feature:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Update component progress and version progress if flag is true
    if (shouldUpdateComponentProgress) {
      try {
        await updateComponentProgressWithParents(featureData.component_id);
      } catch (progressError) {
        console.error('Error updating component progress:', progressError);
        // Don't fail the feature creation if progress update fails
      }
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: error.message || 'Failed to create feature' }, { status: 500 });
  }
}
