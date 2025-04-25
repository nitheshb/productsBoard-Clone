

// // // // features/[id]/route.ts
// // // import { NextRequest, NextResponse } from 'next/server';
// // // import { supabase } from '@/lib/supabaseClient';

// // // // Get a single feature
// // // export async function GET(
// // //   request: NextRequest,
// // //   { params }: { params: { id: string } }
// // // ) {
// // //   try {
// // //     const { id } = params;

// // //     // Fetch the feature
// // //     const { data, error } = await supabase
// // //       .from('features')
// // //       .select('*')
// // //       .eq('id', id)
// // //       .single();

// // //     if (error) {
// // //       if (error.code === 'PGRST116') {
// // //         return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
// // //       }
// // //       throw error;
// // //     }

// // //     return NextResponse.json(data);
// // //   } catch (error) {
// // //     console.error('Error fetching feature:', error);
// // //     return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
// // //   }
// // // }



// // // // Delete a feature
// // // export async function DELETE(
// // //   request: NextRequest,
// // //   { params }: { params: { id: string } }
// // // ) {
// // //   try {
// // //     const { id } = params;

// // //     // Delete the feature
// // //     const { error } = await supabase
// // //       .from('features')
// // //       .delete()
// // //       .eq('id', id);

// // //     if (error) throw error;

// // //     return NextResponse.json({ message: 'Feature deleted successfully' });
// // //   } catch (error) {
// // //     console.error('Error deleting feature:', error);
// // //     return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
// // //   }
// // // }



// // // export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
// // //   try {
// // //     const { id } = params;
// // //     const body = await request.json();

// // //     // Create an update object with all the fields from the request body
// // //     const updateData: any = { ...body };

// // //     // Special handling for status to update progress as well
// // //     if (body.status) {
// // //       updateData.progress = body.status === 'Completed' ? 100 : (body.status === 'In Progress' ? 50 : 0);
// // //     }

// // //     // Update the feature with all the provided fields
// // //     const { data: updatedFeature, error: updateFeatureError } = await supabase
// // //       .from('features')
// // //       .update(updateData)
// // //       .eq('id', id)
// // //       .select('component_id, *'); // Select component_id and all other fields

// // //     if (updateFeatureError) {
// // //       console.error('Error updating feature:', updateFeatureError);
// // //       return NextResponse.json({ error: 'Failed to update feature', details: updateFeatureError }, { status: 500 });
// // //     }

// // //     if (!updatedFeature || updatedFeature.length === 0 || !updatedFeature[0].component_id) {
// // //       console.warn('Could not retrieve component_id after updating feature.');
// // //       return NextResponse.json(updatedFeature ? updatedFeature[0] : null); // Return the updated feature data if available
// // //     }

// // //     const componentId = updatedFeature[0].component_id;

// // //     // Recalculate component progress
// // //     await recalculateComponentProgress(componentId);

// // //     // Recalculate product progress
// // //     const { data: component, error: fetchComponentError } = await supabase
// // //       .from('components')
// // //       .select('product_id')
// // //       .eq('id', componentId)
// // //       .single();

// // //     if (fetchComponentError) {
// // //       console.error('Error fetching component for product progress recalculation:', fetchComponentError);
// // //       return NextResponse.json(updatedFeature[0]); // Still return the updated feature data
// // //     }

// // //     if (component) {
// // //       await recalculateProductProgress(component.product_id);
// // //     } else {
// // //       console.warn('Component not found while recalculating product progress for component ID:', componentId);
// // //     }

// // //     return NextResponse.json(updatedFeature[0]);
// // //   } catch (error: any) {
// // //     console.error('Error updating feature:', error);
// // //     return NextResponse.json({ error: 'Failed to update feature', details: error.message }, { status: 500 });
// // //   }
// // // }

// // // async function recalculateComponentProgress(componentId: string) {
// // //   try {
// // //     const { data: features, error: fetchFeaturesError } = await supabase
// // //       .from('features')
// // //       .select('progress')
// // //       .eq('component_id', componentId);

// // //     if (fetchFeaturesError) {
// // //       console.error('Error fetching features for component progress recalculation:', fetchFeaturesError);
// // //       throw fetchFeaturesError;
// // //     }

// // //     if (features && features.length > 0) {
// // //       const avgProgress = features.reduce((acc, feature) => acc + (feature.progress || 0), 0) / features.length;

// // //       const { error: updateComponentError } = await supabase
// // //         .from('components')
// // //         .update({ progress: avgProgress })
// // //         .eq('id', componentId);

// // //       if (updateComponentError) {
// // //         console.error('Error updating component progress:', updateComponentError);
// // //         throw updateComponentError;
// // //       }
// // //     } else {
// // //       console.warn('No features found for component ID:', componentId, '. Component progress not updated.');
// // //     }
// // //   } catch (error) {
// // //     console.error('Error in recalculateComponentProgress:', error);
// // //     throw error;
// // //   }
// // // }

// // // // Recalculate the progress of the product
// // // async function recalculateProductProgress(productId: string) {
// // //   try {
// // //     const { data: components, error: fetchComponentsError } = await supabase
// // //       .from('components')
// // //       .select('progress')
// // //       .eq('product_id', productId);

// // //     if (fetchComponentsError) {
// // //       console.error('Error fetching components for product progress recalculation:', fetchComponentsError);
// // //       throw fetchComponentsError;
// // //     }

// // //     if (components && components.length > 0) {
// // //       const avgProgress = components.reduce((acc, component) => acc + (component.progress || 0), 0) / components.length;

// // //       const { error: updateProductError } = await supabase
// // //         .from('products')
// // //         .update({ progress: avgProgress })
// // //         .eq('id', productId);

// // //       if (updateProductError) {
// // //         console.error('Error updating product progress:', updateProductError);
// // //         throw updateProductError;
// // //       }
// // //     } else {
// // //       console.warn('No components found for product ID:', productId, '. Product progress not updated.');
// // //     }
// // //   } catch (error) {
// // //     console.error('Error in recalculateProductProgress:', error);
// // //     throw error;
// // //   }
// // // }





// // // features/[id]/route.ts
// // import { NextRequest, NextResponse } from 'next/server';
// // import { supabase } from '@/lib/supabaseClient';

// // // Get a single feature
// // export async function GET(
// //   request: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     const { id } = params;

// //     // Fetch the feature
// //     const { data, error } = await supabase
// //       .from('features')
// //       .select('*')
// //       .eq('id', id)
// //       .single();

// //     if (error) {
// //       if (error.code === 'PGRST116') {
// //         return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
// //       }
// //       throw error;
// //     }

// //     return NextResponse.json(data);
// //   } catch (error) {
// //     console.error('Error fetching feature:', error);
// //     return NextResponse.json({ error: 'Failed to fetch feature' }, { status: 500 });
// //   }
// // }



// // // Delete a feature
// // export async function DELETE(
// //   request: NextRequest,
// //   { params }: { params: { id: string } }
// // ) {
// //   try {
// //     const { id } = params;

// //     // Delete the feature
// //     const { error } = await supabase
// //       .from('features')
// //       .delete()
// //       .eq('id', id);

// //     if (error) throw error;

// //     return NextResponse.json({ message: 'Feature deleted successfully' });
// //   } catch (error) {
// //     console.error('Error deleting feature:', error);
// //     return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
// //   }
// // }


// // function statusToProgress(status: string): number {
// //   switch (status) {
// //     case 'Todo':
// //       return 0;
// //     case 'In Progress':
// //       return 50;
// //     case 'Completed':
// //       return 100;
// //     default:
// //       return 0; // Default to 0 if status is unknown
// //   }
// // }



// // export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
// //   try {
// //     const { id } = params;
// //     const body = await request.json();

// //     // Create an update object with all the fields from the request body
// //     const updateData: any = { ...body };

// //     // Special handling for status to update progress as well
// //     // if (body.status) {
// //     //   updateData.progress = body.status === 'Completed' ? 100 : (body.status === 'In Progress' ? 50 : 0);
// //     // }

// //     if (body.status) {
// //       updateData.progress = statusToProgress(body.status);
// //     }

// //     // Update the feature with all the provided fields
// //     const { data: updatedFeature, error: updateFeatureError } = await supabase
// //       .from('features')
// //       .update(updateData)
// //       .eq('id', id)
// //       .select('component_id, status'); // Select component_id and all other fields

// //     if (updateFeatureError) {
// //       console.error('Error updating feature:', updateFeatureError);
// //       return NextResponse.json({ error: 'Failed to update feature', details: updateFeatureError }, { status: 500 });
// //     }

// //     if (!updatedFeature || updatedFeature.length === 0 || !updatedFeature[0].component_id) {
// //       console.warn('Could not retrieve component_id after updating feature.');
// //       return NextResponse.json(updatedFeature ? updatedFeature[0] : null); // Return the updated feature data if available
// //     }

// //     const componentId = updatedFeature[0].component_id;

// //     // Recalculate component progress
// //     await recalculateComponentProgress(componentId);

// //     // Recalculate product progress
// //     const { data: component, error: fetchComponentError } = await supabase
// //       .from('components')
// //       .select('product_id')
// //       .eq('id', componentId)
// //       .single();

// //     if (fetchComponentError) {
// //       console.error('Error fetching component for product progress recalculation:', fetchComponentError);
// //       return NextResponse.json(updatedFeature[0]); // Still return the updated feature data
// //     }

// //     if (component) {
// //       await recalculateProductProgress(component.product_id);
// //     } else {
// //       console.warn('Component not found while recalculating product progress for component ID:', componentId);
// //     }

// //     const { data: finalUpdatedFeature, error: fetchFinalFeatureError } = await supabase
// //     .from('features')
// //     .select('*')
// //     .eq('id', id)
// //     .single();

// //   if (fetchFinalFeatureError) {
// //     console.error('Error fetching final updated feature:', fetchFinalFeatureError);
// //     return NextResponse.json(updatedFeature[0]); // Return the previously updated data
// //   }

// //     return NextResponse.json(finalUpdatedFeature);
// //   } catch (error: any) {
// //     console.error('Error updating feature:', error);
// //     return NextResponse.json({ error: 'Failed to update feature', details: error.message }, { status: 500 });
// //   }
// // }

// // async function recalculateComponentProgress(componentId: string) {
// //   try {
// //     const { data: features, error: fetchFeaturesError } = await supabase
// //       .from('features')
// //       .select('progress, status')
// //       .eq('component_id', componentId);

// //     if (fetchFeaturesError) {
// //       console.error('Error fetching features for component progress recalculation:', fetchFeaturesError);
// //       throw fetchFeaturesError;
// //     }

// //     if (features && features.length > 0) {
// //       const totalProgress = features.reduce((acc, feature) => acc + statusToProgress(feature.status || 'Todo'), 0);
// //       // const avgProgress = features.reduce((acc, feature) => acc + (feature.progress || 0), 0) / features.length;
// //       const avgProgress = totalProgress / features.length;

// //       const { error: updateComponentError } = await supabase
// //         .from('components')
// //         .update({ progress: avgProgress })
// //         .eq('id', componentId);

// //       if (updateComponentError) {
// //         console.error('Error updating component progress:', updateComponentError);
// //         throw updateComponentError;
// //       }
// //     } else {
// //       console.warn('No features found for component ID:', componentId, '. Component progress not updated.');
// //       await supabase.from('components').update({ progress: 0 }).eq('id', componentId);
// //     }
// //   } catch (error) {
// //     console.error('Error in recalculateComponentProgress:', error);
// //     throw error;
// //   }
// // }

// // // Recalculate the progress of the product
// // async function recalculateProductProgress(productId: string) {
// //   try {
// //     const { data: components, error: fetchComponentsError } = await supabase
// //       .from('components')
// //       .select('progress')
// //       .eq('product_id', productId);

// //     if (fetchComponentsError) {
// //       console.error('Error fetching components for product progress recalculation:', fetchComponentsError);
// //       throw fetchComponentsError;
// //     }

// //     if (components && components.length > 0) {
// //       // const avgProgress = components.reduce((acc, component) => acc + (component.progress || 0), 0) / components.length;
// //       const totalProgress = components.reduce((acc, component) => acc + (component.progress || 0), 0);
// //       const avgProgress = totalProgress / components.length;

// //       const { error: updateProductError } = await supabase
// //         .from('products')
// //         .update({ progress: avgProgress })
// //         .eq('id', productId);

// //       if (updateProductError) {
// //         console.error('Error updating product progress:', updateProductError);
// //         throw updateProductError;
// //       }
// //     } else {
// //       console.warn('No components found for product ID:', productId, '. Product progress not updated.');
// //       await supabase.from('products').update({ progress: 0 }).eq('id', productId);
// //     }
// //   } catch (error) {
// //     console.error('Error in recalculateProductProgress:', error);
// //     throw error;
// //   }
// // }




// // features/[id]/route.ts
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
//         status: body.status || null,
//         progress: body.progress !== undefined ? body.progress : null,
//         team: body.team || null,
//         days: body.days !== undefined ? body.days : null,
//         startDate: body.startDate || null,
//         targetDate: body.targetDate || null,
//         completedOn: body.completedOn || null,
//         remarks: body.remarks || null,
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
async function updateComponentProgress(componentId: number) {
  try {
    // Get all features for this component
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('progress')
      .eq('component_id', componentId);
    
    if (featuresError) throw featuresError;
    
    // Calculate average progress
    const totalProgress = features.reduce((sum, feature) => sum + (feature.progress || 0), 0);
    const averageProgress = features.length > 0 ? Math.round(totalProgress / features.length) : 0;
    
    // Update the component's progress
    const { error: updateError } = await supabase
      .from('components')
      .update({ progress: averageProgress })
      .eq('id', componentId);
    
    if (updateError) throw updateError;
    
    // Get the product_id for this component
    const { data: component, error: componentError } = await supabase
      .from('components')
      .select('product_id')
      .eq('id', componentId)
      .single();
    
    if (componentError) throw componentError;
    
    // Update the product progress
    await updateProductProgress(component.product_id);
    
    return averageProgress;
  } catch (error) {
    console.error('Error updating component progress:', error);
    throw error;
  }
}

// Function to update product progress based on its components
async function updateProductProgress(productId: number) {
  try {
    // Get all components for this product
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('progress')
      .eq('product_id', productId);
    
    if (componentsError) throw componentsError;
    
    // Calculate average progress
    const totalProgress = components.reduce((sum, component) => sum + (component.progress || 0), 0);
    const averageProgress = components.length > 0 ? Math.round(totalProgress / components.length) : 0;
    
    // Update the product's progress
    const { error: updateError } = await supabase
      .from('products')
      .update({ progress: averageProgress })
      .eq('id', productId);
    
    if (updateError) throw updateError;
    
    return averageProgress;
  } catch (error) {
    console.error('Error updating product progress:', error);
    throw error;
  }
}

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
      .select('id, component_id, status, progress')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Feature not found' }, { status: 404 });
      }
      throw checkError;
    }

    // If status is being updated but progress isn't specified, calculate progress from status
    if (body.status && body.status !== existingFeature.status && body.progress === undefined) {
      body.progress = calculateProgressFromStatus(body.status);
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

    // If component_id changed, update both old and new component progress
    if (body.component_id && body.component_id !== existingFeature.component_id) {
      await updateComponentProgress(existingFeature.component_id);
      await updateComponentProgress(body.component_id);
    } else {
      // Otherwise just update the current component's progress
      await updateComponentProgress(existingFeature.component_id);
    }

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

    // Get the component_id before deleting the feature
    const { data: feature, error: fetchError } = await supabase
      .from('features')
      .select('component_id')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete the feature
    const { error } = await supabase
      .from('features')
      .delete()
      .eq('id', id);

    if (error) throw error;

    // Update the component progress after deletion
    await updateComponentProgress(feature.component_id);

    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json({ error: 'Failed to delete feature' }, { status: 500 });
  }
}