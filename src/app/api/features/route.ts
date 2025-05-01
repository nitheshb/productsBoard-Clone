// // // api/feature/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabaseClient';

// // // Create a new feature
// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
    
// //     // Validate required fields
// //     if (!body.name || !body.component_id) {
// //       return NextResponse.json({ error: 'Name and component_id are required' }, { status: 400 });
// //     }

// //     const { data, error } = await supabase
// //       .from('features')
// //       .insert([{
// //         name: body.name,
// //         component_id: body.component_id,
// //         status: body.status || 'Todo',
// //         progress: body.progress !== undefined ? body.progress : 0,
// //         team: body.team || null,
// //         days: body.days !== undefined ? body.days : null,
// //         startDate: body.startDate || null,
// //         targetDate: body.targetDate || null,
// //         completedOn: body.completedOn || null,
// //         remarks: body.remarks || null,
// //         owner_initials: body.owner_initials || null,
// //         color: body.color || null
// //       }])
// //       .select();

// //     if (error) throw error;

// //     return NextResponse.json(data[0]);
// //   } catch (error) {
// //     console.error('Error creating feature:', error);
// //     return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
// //   }
// // }


// // api/feature/route.ts 
// // Updated with component progress control
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Helper function to calculate progress from status
// const calculateProgressFromStatus = (status: string): number => {
//   switch (status) {
//     case 'Completed':
//       return 100;
//     case 'In Progress':
//       return 50;
//     case 'Todo':
//     default:
//       return 0;
//   }
// };

// // Function to update component progress based on its features
// async function updateComponentProgress(componentId: string) {
//   try {
//     // Get all features for this component
//     const { data: features, error: featuresError } = await supabase
//       .from('features')
//       .select('progress')
//       .eq('component_id', componentId);
    
//     if (featuresError) throw featuresError;
    
//     // Calculate average progress
//     const totalProgress = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
//     const averageProgress = features.length > 0 ? Math.round(totalProgress / features.length) : 0;
    
//     // Update the component's progress
//     const { error: updateError } = await supabase
//       .from('components')
//       .update({ progress: averageProgress })
//       .eq('id', componentId);
    
//     if (updateError) throw updateError;
    
//     // Get the product_id for this component
//     const { data: component, error: componentError } = await supabase
//       .from('components')
//       .select('product_id')
//       .eq('id', componentId)
//       .single();
    
//     if (componentError) throw componentError;
    
//     // Update the product progress
//     await updateProductProgress(component.product_id);
    
//     return averageProgress;
//   } catch (error) {
//     console.error('Error updating component progress:', error);
//     throw error;
//   }
// }

// // Function to update product progress based on its components
// async function updateProductProgress(productId: string) {
//   try {
//     // Get all components for this product
//     const { data: components, error: componentsError } = await supabase
//       .from('components')
//       .select('progress')
//       .eq('product_id', productId);
    
//     if (componentsError) throw componentsError;
    
//     // Calculate average progress
//     const totalProgress = components.reduce((sum, component) => sum + (component.progress || 0), 0);
//     const averageProgress = components.length > 0 ? Math.round(totalProgress / components.length) : 0;
    
//     // Update the product's progress
//     const { error: updateError } = await supabase
//       .from('products')
//       .update({ progress: averageProgress })
//       .eq('id', productId);
    
//     if (updateError) throw updateError;
    
//     return averageProgress;
//   } catch (error) {
//     console.error('Error updating product progress:', error);
//     throw error;
//   }
// }

// // Create a new feature
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
    
//     // Validate required fields
//     if (!body.name || !body.component_id) {
//       return NextResponse.json({ error: 'Name and component_id are required' }, { status: 400 });
//     }

//     // Extract the flag before sending to database
//     const shouldUpdateComponentProgress = body.updateComponentProgress === true;
//     delete body.updateComponentProgress;

//     // If status is provided but progress isn't, calculate progress from status
//     if (body.status && body.progress === undefined) {
//       body.progress = calculateProgressFromStatus(body.status);
//     }

//     const { data, error } = await supabase
//       .from('features')
//       .insert([{
//         name: body.name,
//         component_id: body.component_id,
//         status: body.status || 'Todo',
//         progress: body.progress !== undefined ? body.progress : 0,
//         team: body.team || null,
//         days: body.days !== undefined ? body.days : null,
//         startDate: body.startDate || null,
//         targetDate: body.targetDate || null,
//         completedOn: body.completedOn || null,
//         remarks: body.remarks || null,
//         owner_initials: body.owner_initials || null,
//         color: body.color || null
//       }])
//       .select();

//     if (error) throw error;

//     // Only update component progress if explicitly requested (like when adding a new feature)
//     if (shouldUpdateComponentProgress) {
//       await updateComponentProgress(body.component_id);
//     }

//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error('Error creating feature:', error);
//     return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
//   }
// }


// api/features/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

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

// Function to update component progress based on its features
async function updateComponentProgress(componentId: string) {
  try {
    // Get all features for this component
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('progress')
      .eq('component_id', componentId);
    
    if (featuresError) {
      console.error('Error fetching features:', featuresError);
      throw featuresError;
    }
    
    // Calculate average progress
    const totalProgress = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    const averageProgress = features.length > 0 ? Math.round(totalProgress / features.length) : 0;
    
    console.log(`Updating component ${componentId} progress to ${averageProgress}% based on ${features.length} features`);
    
    // Update the component's progress
    const { error: updateError } = await supabase
      .from('components')
      .update({ progress: averageProgress })
      .eq('id', componentId);
    
    if (updateError) {
      console.error('Error updating component:', updateError);
      throw updateError;
    }
    
    // Get the product_id for this component
    const { data: component, error: componentError } = await supabase
      .from('components')
      .select('product_id')
      .eq('id', componentId)
      .single();
    
    if (componentError) {
      console.error('Error fetching component:', componentError);
      throw componentError;
    }
    
    // Update the product progress
    await updateProductProgress(component.product_id);
    
    return averageProgress;
  } catch (error) {
    console.error('Error updating component progress:', error);
    throw error;
  }
}

// Function to update product progress based on its components
async function updateProductProgress(productId: string) {
  try {
    // Get all components for this product
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('progress')
      .eq('product_id', productId);
    
    if (componentsError) {
      console.error('Error fetching components:', componentsError);
      throw componentsError;
    }
    
    // Calculate average progress
    const totalProgress = components.reduce((sum, component) => sum + (component.progress || 0), 0);
    const averageProgress = components.length > 0 ? Math.round(totalProgress / components.length) : 0;
    
    console.log(`Updating product ${productId} progress to ${averageProgress}% based on ${components.length} components`);
    
    // Update the product's progress
    const { error: updateError } = await supabase
      .from('products')
      .update({ progress: averageProgress })
      .eq('id', productId);
    
    if (updateError) {
      console.error('Error updating product:', updateError);
      throw updateError;
    }
    
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress:', error);
    throw error;
  }
}

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

    // Insert the new feature
    const { data, error } = await supabase
      .from('features')
      .insert([{
        name: featureData.name,
        component_id: featureData.component_id,
        status: featureData.status || 'Todo',
        progress: featureData.progress !== undefined ? featureData.progress : 0,
        team: featureData.team || null,
        days: featureData.days !== undefined ? featureData.days : null,
        startDate: featureData.startDate || null,
        targetDate: featureData.targetDate || null,
        completedOn: featureData.completedOn || null,
        remarks: featureData.remarks || null
      
        
      }])
      .select();

    if (error) {
      console.error('Database error inserting feature:', error);
      throw error;
    }

    console.log('Feature created successfully:', data[0]);

    // Always update component progress when creating a new feature
    if (shouldUpdateComponentProgress) {
      console.log(`Updating progress for component ${featureData.component_id}`);
      try {
        await updateComponentProgress(featureData.component_id);
        console.log('Component and product progress updated successfully');
      } catch (progressError) {
        console.error('Error updating progress:', progressError);
        // Don't fail the request if progress update fails
      }
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: error.message || 'Failed to create feature' }, { status: 500 });
  }
}