

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { updateProductProgressWithParents } from '@/utils/progressCalculator';

// Get all components
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');
    const version = searchParams.get('version');

    let query = supabase.from('components').select('*');

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (version) {
      query = query.eq('version', version);
    }

    const { data: components, error } = await query;

    if (error) throw error;

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return NextResponse.json({ error: 'Failed to fetch components' }, { status: 500 });
  }
}

// Create a new component
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.product_id) {
      return NextResponse.json({ error: 'Component name and product_id are required' }, { status: 400 });
    }

    // Extract the flag, defaulting to true if not specified
    const shouldUpdateProductProgress = body.updateProductProgress !== false;
    
    // Remove the flag from the body before inserting into database
    const componentData = { ...body };
    delete componentData.updateProductProgress;

    // Create the component
    const { data, error } = await supabase
      .from('components')
      .insert([{
        name: componentData.name,
        product_id: componentData.product_id,
        status: componentData.status || null,
        progress: componentData.progress !== undefined ? componentData.progress : null,
        team: componentData.team || null,
        days: componentData.days !== undefined ? componentData.days : null,
        startdate: componentData.startDate || null,
        targetdate: componentData.targetDate || null,
        completedon: componentData.completedOn || null,
        remarks: componentData.remarks || null,
        description: componentData.description || null,
        version: componentData.version || '1.0.0'
      }])
      .select();

    if (error) throw error;

    // Update product progress and version progress if flag is true
    if (shouldUpdateProductProgress) {
      try {
        await updateProductProgressWithParents(componentData.product_id);
      } catch (progressError) {
        console.error('Error updating product progress:', progressError);
        // Don't fail the component creation if progress update fails
      }
    }

    // Remap the returned data to camelCase for consistency with GET API
    const created = data[0];
    const responseData = {
      ...created,
      startDate: created.startdate || null,
      targetDate: created.targetdate || null,
      completedOn: created.completedon || null,
      // Add remapping for any other fields if necessary
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}
