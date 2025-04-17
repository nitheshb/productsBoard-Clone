// // app/api/features/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Get a single feature
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
    
//     // Fetch the feature
//     const { data, error } = await supabase
//       .from('features')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (error) {
//       if (error.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
//       }
//       throw error;
//     }
    
//     return NextResponse.json(data);
//   } catch (error) {
//     console.error('Error fetching feature:', error);
//     return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
//   }
// }

// // Update a feature
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const body = await request.json();
    
//     // Check if feature exists
//     const { data: existingFeature, error: checkError } = await supabase
//       .from('features')
//       .select('id')
//       .eq('id', id)
//       .single();
    
//     if (checkError) {
//       if (checkError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
//       }
//       throw checkError;
//     }
    
//     // Update the feature
//     const { data, error } = await supabase
//       .from('features')
//       .update({
//         name: body.name,
//         owner_initials: body.owner_initials,
//         importance: body.importance,
//         color: body.color,
//         component_id: body.component_id // Allow moving to a different component
//       })
//       .eq('id', id)
//       .select();
    
//     if (error) throw error;
    
//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error('Error updating feature:', error);
//     return NextResponse.json({ error: 'Failed to update feature' }, { status: 500 });
//   }
// }

// // Delete a feature
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
    
//     // Delete the feature
//     const { error } = await supabase
//       .from('features')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     return NextResponse.json({ message: 'Feature deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting feature:', error);
//     return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
//   }
// }


// features/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

// Update a feature
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if feature exists
    const { data: existingFeature, error: checkError } = await supabase
      .from('features')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
      }
      throw checkError;
    }

    // Update the feature
    const { data, error } = await supabase
      .from('features')
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
        owner_initials: body.owner_initials,
        importance: body.importance,
        color: body.color,
        component_id: body.component_id // Allow moving to a different component
      })
      .eq('id', id)
      .select();

    if (error) throw error;

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

    // Delete the feature
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}