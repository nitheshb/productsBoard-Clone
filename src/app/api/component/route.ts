// // app/api/components/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Create a new component
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate required fields
//     if (!body.name || !body.product_id) {
//       return NextResponse.json({ 
//         error: 'Component name and product_id are required' 
//       }, { status: 400 });
//     }
    
//     // Check if product exists
//     const { data: product, error: productError } = await supabase
//       .from('products')
//       .select('id')
//       .eq('id', body.product_id)
//       .single();
    
//     if (productError) {
//       if (productError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//       }
//       throw productError;
//     }
    
//     // Create the component
//     const { data, error } = await supabase
//       .from('components')
//       .insert([{
//         name: body.name,
//         product_id: body.product_id,
//         owner_initials: body.owner_initials || null,
//         importance: body.importance || 0
//       }])
//       .select();
    
//     if (error) throw error;
    
//     return NextResponse.json(data[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating component:', error);
//     return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
//   }
// }


// components/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Create a new component
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.product_id) {
      return NextResponse.json({
        error: 'Component name and product_id are required'
      }, { status: 400 });
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', body.product_id)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw productError;
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
        startDate: body.startDate || null,
        targetDate: body.targetDate || null,
        completedOn: body.completedOn || null,
        remarks: body.remarks || null,
        owner_initials: body.owner_initials || null,
        importance: body.importance || 0
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating component:', error);
    return NextResponse.json({ error: 'Failed to create component' }, { status: 500 });
  }
}