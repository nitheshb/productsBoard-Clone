// // app/api/features/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Create a new feature
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate required fields
//     if (!body.name || !body.component_id) {
//       return NextResponse.json({ 
//         error: 'Feature name and component_id are required' 
//       }, { status: 400 });
//     }
    
//     // Check if component exists
//     const { data: component, error: componentError } = await supabase
//       .from('components')
//       .select('id')
//       .eq('id', body.component_id)
//       .single();
    
//     if (componentError) {
//       if (componentError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Component not found' }, { status: 404 });
//       }
//       throw componentError;
//     }
    
//     // Create the feature
//     const { data, error } = await supabase
//       .from('features')
//       .insert([{
//         name: body.name,
//         component_id: body.component_id,
//         owner_initials: body.owner_initials || null,
//         importance: body.importance || 0,
//         color: body.color || 'yellow' // Default color
//       }])
//       .select();
    
//     if (error) throw error;
    
//     return NextResponse.json(data[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating feature:', error);
//     return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
//   }
// }



// features/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Create a new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.component_id) {
      return NextResponse.json({
        error: 'Feature name and component_id are required'
      }, { status: 400 });
    }

    // Check if component exists
    const { data: component, error: componentError } = await supabase
      .from('components')
      .select('id')
      .eq('id', body.component_id)
      .single();

    if (componentError) {
      if (componentError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Component not found' }, { status: 404 });
      }
      throw componentError;
    }

    // Create the feature
    const { data, error } = await supabase
      .from('features')
      .insert([{
        name: body.name,
        component_id: body.component_id,
        status: body.status || null,
        progress: body.progress !== undefined ? body.progress : null,
        team: body.team || null,
        days: body.days !== undefined ? body.days : null,
        startDate: body.startDate || null,
        targetDate: body.targetDate || null,
        completedOn: body.completedOn || null,
        remarks: body.remarks || null,
        owner_initials: body.owner_initials || null,
        importance: body.importance || 0,
        color: body.color || 'yellow' // Default color
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}