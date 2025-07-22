

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

// // Create a new component
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Validate required fields
//     if (!body.name || !body.product_id) {
//       return NextResponse.json({ error: 'Component name and product_id are required' }, { status: 400 });
//     }

//     // Create the component
//     const { data, error } = await supabase
//       .from('components')
//       .insert([{
//         name: body.name,
//         product_id: body.product_id,
//         status: body.status || null,
//         progress: body.progress !== undefined ? body.progress : null,
//         team: body.team || null,
//         days: body.days !== undefined ? body.days : null,
//         startdate: body.startDate || null,
//         targetdate: body.targetDate || null,
//         completedon: body.completedOn || null,
//         remarks: body.remarks || null,
//         version: body.version || '1.0.0'
//       }])
//       .select();

//     if (error) throw error;

//     return NextResponse.json(data[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating component:', error);
//     return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
//   }
// }




// Create a new component
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.product_id) {
      return NextResponse.json({ error: 'Component name and product_id are required' }, { status: 400 });
    }

    // Create the component
    const { data, error } = await supabase
      .from('components')
      .insert([{
        name: body.name,
        product_id: body.product_id,
        status: body.status || null,
        progress: body.progress !== undefined ? body.progress : null,
        team: body.team || null,
        days: body.days !== undefined ? body.days : null,
        startdate: body.startDate || null,
        targetdate: body.targetDate || null,
        completedon: body.completedOn || null,
        remarks: body.remarks || null,
        version: body.version || '1.0.0'
      }])
      .select();

    if (error) throw error;

    // Remap the returned data to camelCase for consistency with GET API
    const created = data[0];
    const responseData = {
      ...created,
      startDate: created.startdate || null,
      targetDate: created.targetdate || null,
      completedOn: created.completedon || null,
      // Add remapping for any other fields if necessary
    };

    // TODO: Optionally update product progress here, similar to the PUT handler
    // For example:
    // await updateProductProgress(body.product_id);

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}
