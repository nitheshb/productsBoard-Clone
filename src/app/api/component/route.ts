// // // // app/api/components/route.ts
// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { supabase } from '@/lib/supabaseClient';

// // // // Create a new component
// // // export async function POST(request: NextRequest) {
// // //   try {
// // //     const body = await request.json();
    
// // //     // Validate required fields
// // //     if (!body.name || !body.product_id) {
// // //       return NextResponse.json({ 
// // //         error: 'Component name and product_id are required' 
// // //       }, { status: 400 });
// // //     }
    
// // //     // Check if product exists
// // //     const { data: product, error: productError } = await supabase
// // //       .from('products')
// // //       .select('id')
// // //       .eq('id', body.product_id)
// // //       .single();
    
// // //     if (productError) {
// // //       if (productError.code === 'PGRST116') {
// // //         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
// // //       }
// // //       throw productError;
// // //     }
    
// // //     // Create the component
// // //     const { data, error } = await supabase
// // //       .from('components')
// // //       .insert([{
// // //         name: body.name,
// // //         product_id: body.product_id,
// // //         owner_initials: body.owner_initials || null,
// // //         importance: body.importance || 0
// // //       }])
// // //       .select();
    
// // //     if (error) throw error;
    
// // //     return NextResponse.json(data[0], { status: 201 });
// // //   } catch (error) {
// // //     console.error('Error creating component:', error);
// // //     return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
// // //   }
// // // }


// // // components/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabaseClient';

// // // Create a new component
// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();

// //     // Validate required fields
// //     if (!body.name || !body.product_id) {
// //       return NextResponse.json({
// //         error: 'Component name and product_id are required'
// //       }, { status: 400 });
// //     }

// //     // Check if product exists
// //     const { data: product, error: productError } = await supabase
// //       .from('products')
// //       .select('id')
// //       .eq('id', body.product_id)
// //       .single();

// //     if (productError) {
// //       if (productError.code === 'PGRST116') {
// //         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
// //       }
// //       throw productError;
// //     }

// //     // Create the component
// //     const { data, error } = await supabase
// //       .from('components')
// //       .insert([{
// //         name: body.name,
// //         product_id: body.product_id,
// //         status: body.status || null,
// //         progress: body.progress !== undefined ? body.progress : null,
// //         team: body.team || null,
// //         days: body.days !== undefined ? body.days : null,
// //         startDate: body.startDate || null,
// //         targetDate: body.targetDate || null,
// //         completedOn: body.completedOn || null,
// //         remarks: body.remarks || null,
// //         owner_initials: body.owner_initials || null,
// //         importance: body.importance || 0
// //       }])
// //       .select();

// //     if (error) throw error;

// //     return NextResponse.json(data[0], { status: 201 });
// //   } catch (error) {
// //     console.error('Error creating component:', error);
// //     return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
// //   }
// // }


// // api/component/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Create a new component
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate required fields
//     if (!body.name || !body.product_id) {
//       return NextResponse.json({ error: 'Name and product_id are required' }, { status: 400 });
//     }

//     const { data, error } = await supabase
//       .from('components')
//       .insert([{
//         name: body.name,
//         product_id: body.product_id,
//         status: body.status || 'Todo',
//         progress: body.progress !== undefined ? body.progress : 0,
//         team: body.team || null,
//         days: body.days !== undefined ? body.days : null,
//         startDate: body.startDate || null,
//         targetDate: body.targetDate || null,
//         completedOn: body.completedOn || null,
//         remarks: body.remarks || null,
//         owner_initials: body.owner_initials || null,
//         importance: body.importance || null
//       }])
//       .select();

//     if (error) throw error;

//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error('Error creating component:', error);
//     return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
//   }
// }


import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get a single component with its features
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

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
      throw componentError;
    }

    // Fetch features for this component
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('*')
      .eq('component_id', id);

    if (featuresError) throw featuresError;

    const componentWithFeatures = {
      ...component,
      features: features || []
    };

    return NextResponse.json(componentWithFeatures);
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

    // Update the component
    const { data, error } = await supabase
      .from('components')
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
        owner_initials: body.owner_initials || null,
        importance: body.importance || null,
        product_id: body.product_id // Allow moving to a different product
      })
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