// // app/api/products/[id]/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Get a single product with its components and features
// export async function GET(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
    
//     // Fetch the product
//     const { data: product, error: productError } = await supabase
//       .from('products')
//       .select('*')
//       .eq('id', id)
//       .single();
    
//     if (productError) {
//       if (productError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//       }
//       throw productError;
//     }
    
//     // Fetch components for this product
//     const { data: components, error: componentsError } = await supabase
//       .from('components')
//       .select('*')
//       .eq('product_id', id);
    
//     if (componentsError) throw componentsError;
    
//     // Fetch features for all components of this product
//     const componentIds = components.map(comp => comp.id);
//     let features = [];
    
//     if (componentIds.length > 0) {
//       const { data: featuresData, error: featuresError } = await supabase
//         .from('features')
//         .select('*')
//         .in('component_id', componentIds);
      
//       if (featuresError) throw featuresError;
//       features = featuresData;
//     }
    
//     // Structure the data hierarchically
//     const componentsWithFeatures = components.map(component => {
//       const componentFeatures = features.filter(feature => feature.component_id === component.id);
//       return {
//         ...component,
//         features: componentFeatures
//       };
//     });
    
//     const structuredProduct = {
//       ...product,
//       components: componentsWithFeatures
//     };
    
//     return NextResponse.json(structuredProduct);
//   } catch (error) {
//     console.error('Error fetching product:', error);
//     return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
//   }
// }

// // Update a product
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
//     const body = await request.json();
    
//     // Check if product exists
//     const { data: existingProduct, error: checkError } = await supabase
//       .from('products')
//       .select('id')
//       .eq('id', id)
//       .single();
    
//     if (checkError) {
//       if (checkError.code === 'PGRST116') {
//         return NextResponse.json({ error: 'Product not found' }, { status: 404 });
//       }
//       throw checkError;
//     }
    
//     // Update the product
//     const { data, error } = await supabase
//       .from('products')
//       .update({
//         name: body.name,
//         owner_initials: body.owner_initials,
//         importance: body.importance
//       })
//       .eq('id', id)
//       .select();
    
//     if (error) throw error;
    
//     return NextResponse.json(data[0]);
//   } catch (error) {
//     console.error('Error updating product:', error);
//     return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
//   }
// }

// // Delete a product
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const { id } = params;
    
//     // Delete the product (cascade deletion will handle components and features)
//     const { error } = await supabase
//       .from('products')
//       .delete()
//       .eq('id', id);
    
//     if (error) throw error;
    
//     return NextResponse.json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting product:', error);
//     return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
//   }
// }


// api/product/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get a single product with its components and features
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Fetch the product
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (productError) {
      if (productError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw productError;
    }

    // Fetch components for this product
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('*')
      .eq('product_id', id);

    if (componentsError) throw componentsError;

    // Fetch features for all components of this product
    const componentIds = components.map(comp => comp.id);
    let features = [];

    if (componentIds.length > 0) {
      const { data: featuresData, error: featuresError } = await supabase
        .from('features')
        .select('*')
        .in('component_id', componentIds);

      if (featuresError) throw featuresError;
      features = featuresData;
    }

    // Structure the data hierarchically
    const componentsWithFeatures = components.map(component => {
      const componentFeatures = features.filter(feature => feature.component_id === component.id);
      return {
        ...component,
        features: componentFeatures
      };
    });

    const structuredProduct = {
      ...product,
      components: componentsWithFeatures
    };

    return NextResponse.json(structuredProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}

// Update a product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if product exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('products')
      .select('id')
      .eq('id', id)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      throw checkError;
    }

    // Update the product
    const { data, error } = await supabase
      .from('products')
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
        owner: body.owner,
        importance: body.importance
      })
      .eq('id', id)
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

// Delete a product
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Delete the product (cascade deletion will handle components and features)
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}