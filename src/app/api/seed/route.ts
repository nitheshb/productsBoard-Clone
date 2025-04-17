// import { NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// export async function GET() {
//   // Create tables if they don't exist
//   await supabase.from('projects').upsert([
//     {
//       id: 1,
//       name: 'John Black Residence',
//       address: '2223 S Main St, Wake Forest'
//     }
//   ]);

//   await supabase.from('phases').upsert([
//     { id: 1, name: 'Turbonomics', project_id: 1, work_days: 22 },
//     { id: 2, name: 'Lot / Foundation', project_id: 1, work_days: 21 },
//     { id: 3, name: 'Rough-Ins', project_id: 1, work_days: 54 }
//   ]);

//   await supabase.from('tasks').upsert([
//     { 
//       id: 1, 
//       name: 'Architectural Review Board', 
//       phase_id: 1, 
//       progress: 100, 
//       work_days: 14,
//       start_date: '2025-10-18',
//       end_date: '2025-10-23'
//     },
//     { 
//       id: 2, 
//       name: 'Building Permit', 
//       phase_id: 1, 
//       progress: 86, 
//       work_days: 5,
//       start_date: '2025-10-21',
//       end_date: '2025-10-25'
//     },
//     { 
//       id: 3, 
//       name: 'Clear Lot / Tree Removal', 
//       phase_id: 2, 
//       progress: 60, 
//       work_days: 12,
//       start_date: '2025-10-21',
//       end_date: '2025-10-26'
//     },
//     { 
//       id: 4, 
//       name: 'Install Silt Fence', 
//       phase_id: 2, 
//       progress: 0, 
//       work_days: 2,
//       start_date: '2025-10-23',
//       end_date: '2025-10-24'
//     },
//     { 
//       id: 5, 
//       name: 'Install Construction Driveway', 
//       phase_id: 2, 
//       progress: 0, 
//       work_days: 7,
//       start_date: '2025-10-24',
//       end_date: '2025-10-26'
//     },
//     { 
//       id: 6, 
//       name: 'Stake Lot For Excavation', 
//       phase_id: 3, 
//       progress: 0, 
//       work_days: 5,
//       start_date: '2025-10-26',
//       end_date: '2025-10-26'
//     },
//     { 
//       id: 7, 
//       name: 'Excavate Basement', 
//       phase_id: 3, 
//       progress: 0, 
//       work_days: 19,
//       start_date: '2025-10-26',
//       end_date: '2025-10-26' 
//     },
//     { 
//       id: 8, 
//       name: 'Footings Inspection', 
//       phase_id: 3, 
//       progress: 0, 
//       work_days: 5,
//       start_date: '2025-10-26',
//       end_date: '2025-10-26'
//     },
//     { 
//       id: 9, 
//       name: 'Pin Wall Corners', 
//       phase_id: 3, 
//       progress: 0, 
//       work_days: 3,
//       start_date: '2025-10-26',
//       end_date: '2025-10-26'
//     }
//   ]);

//   return NextResponse.json({ success: true });
// }



// app/api/seed/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function GET() {
  try {
    // Insert sample product
    const { data: product, error: productError } = await supabase
      .from('products')
      .insert([
        { name: 'Sample Product 1', owner_initials: 'NB', importance: 23 }
      ])
      .select();

    if (productError) throw productError;

    // Insert sample component
    const { data: component, error: componentError } = await supabase
      .from('components')
      .insert([
        { 
          product_id: product[0].id, 
          name: 'Sample Component (e.g. Use Case or Product Area)', 
          owner_initials: 'NB', 
          importance: 23 
        }
      ])
      .select();

    if (componentError) throw componentError;

    // Insert sample features
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .insert([
        { 
          component_id: component[0].id, 
          name: 'Sample feature (e.g. Epic)', 
          owner_initials: 'NB', 
          importance: 11,
          color: 'yellow' 
        },
        { 
          component_id: component[0].id, 
          name: 'Sample feature (e.g. Epic)', 
          owner_initials: 'NB', 
          importance: 6,
          color: 'teal' 
        },
        { 
          component_id: component[0].id, 
          name: 'Sample feature (e.g. Epic)', 
          owner_initials: 'NB', 
          importance: 6,
          color: 'blue' 
        }
      ])
      .select();

    if (featuresError) throw featuresError;

    return NextResponse.json({
      message: 'Database seeded successfully',
      data: {
        product: product[0],
        component: component[0],
        features
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding database:', error);
    return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
  }
}