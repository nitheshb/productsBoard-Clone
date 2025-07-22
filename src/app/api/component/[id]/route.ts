

// components/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

    // Check if component exists
    const { data: existingComponent, error: checkError } = await supabase
      .from('components')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Component not found' }, { status: 404 });
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
      version: body.version ?? null,
      product_id: body.product_id ?? null
    };

    // Handle date fields with snake_case
    if (body.startDate !== undefined) {
      updateFields.startdate = body.startDate;
    }
    if (body.targetDate !== undefined) {
      updateFields.targetdate = body.targetDate;
    }
    if (body.completedOn !== undefined) {
      updateFields.completedon = body.completedOn;
    }

    // Remove any camelCase date fields
    delete updateFields.startDate;
    delete updateFields.targetDate;
    delete updateFields.completedOn;

    const { data, error } = await supabase
      .from('components')
      .update(updateFields)
      .eq('id', id)
      .select();

    if (error) throw error;

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

    // Delete the component (cascade deletion will handle features)
    const { error } = await supabase
      .from('components')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Component deleted successfully' });
  } catch (error) {
    console.error('Error deleting component:', error);
    return NextResponse.json({ error: 'Failed to delete component' }, { status: 500 });
  }
}

