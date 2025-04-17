// // app/api/products/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { supabase } from '@/lib/supabaseClient';

// // Get all products with their components and features
// export async function GET(request: NextRequest) {
//   try {
//     // Get query parameters for filtering
//     const searchParams = request.nextUrl.searchParams;
//     const search = searchParams.get('search') || '';
    
//     // Fetch all products
//     let query = supabase.from('products').select('*');
    
//     // Apply search filter if provided
//     if (search) {
//       query = query.ilike('name', `%${search}%`);
//     }
    
//     const { data: products, error: productsError } = await query;
    
//     if (productsError) throw productsError;
    
//     // Fetch components for all products
//     const { data: components, error: componentsError } = await supabase
//       .from('components')
//       .select('*');
    
//     if (componentsError) throw componentsError;
    
//     // Fetch features for all components
//     const { data: features, error: featuresError } = await supabase
//       .from('features')
//       .select('*');
    
//     if (featuresError) throw featuresError;
    
//     // Structure the data hierarchically
//     const structuredProducts = products.map(product => {
//       const productComponents = components.filter(comp => comp.product_id === product.id);
      
//       const componentsWithFeatures = productComponents.map(component => {
//         const componentFeatures = features.filter(feature => feature.component_id === component.id);
//         return {
//           ...component,
//           features: componentFeatures
//         };
//       });
      
//       return {
//         ...product,
//         components: componentsWithFeatures
//       };
//     });
    
//     return NextResponse.json(structuredProducts);
//   } catch (error) {
//     console.error('Error fetching products:', error);
//     return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
//   }
// }

// // Create a new product
// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
    
// //     // Validate required fields
// //     if (!body.name) {
// //       return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
// //     }
    
// //     // Create the product
// //     const { data, error } = await supabase
// //       .from('products')
// //       .insert([{
// //         name: body.name,
// //         owner_initials: body.owner_initials || null,
// //         importance: body.importance || 0
// //       }])
// //       .select();
    
// //     if (error) throw error;
    
// //     return NextResponse.json(data[0], { status: 201 });
// //   } catch (error) {
// //     console.error('Error creating product:', error);
// //     return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
// //   }
// // }


// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();

//     // Validate required fields
//     if (!body.name) {
//       return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
//     }

//     // Create the product
//     const { data, error } = await supabase
//       .from('products')
//       .insert([{
//         name: body.name,
//         status: body.status || null, // Add status
//         progress: body.progress !== undefined ? body.progress : null, // Add progress
//         team: body.team || null, // Add team
//         days: body.days !== undefined ? body.days : null, // Add days
//         startDate: body.startDate || null, // Add startDate
//         targetDate: body.targetDate || null, // Add targetDate
//         completedOn: body.completedOn || null, // Add completedOn
//         remarks: body.remarks || null, // Add remarks
//         owner_initials: body.owner_initials || null,
//         importance: body.importance || 0
//       }])
//       .select();

//     if (error) throw error;

//     return NextResponse.json(data[0], { status: 201 });
//   } catch (error) {
//     console.error('Error creating product:', error);
//     return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
//   }
// }


// product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get all products with their components and features
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    // Fetch all products
    let query = supabase.from('products').select('*');

    // Apply search filter if provided
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: products, error: productsError } = await query;

    if (productsError) throw productsError;

    // Fetch components for all products
    const { data: components, error: componentsError } = await supabase
      .from('components')
      .select('*');

    if (componentsError) throw componentsError;

    // Fetch features for all components
    const { data: features, error: featuresError } = await supabase
      .from('features')
      .select('*');

    if (featuresError) throw featuresError;

    // Structure the data hierarchically
    const structuredProducts = products.map(product => {
      const productComponents = components.filter(comp => comp.product_id === product.id);

      const componentsWithFeatures = productComponents.map(component => {
        const componentFeatures = features.filter(feature => feature.component_id === component.id);
        return {
          ...component,
          features: componentFeatures
        };
      });

      return {
        ...product,
        components: componentsWithFeatures
      };
    });

    return NextResponse.json(structuredProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // Create the product
    const { data, error } = await supabase
      .from('products')
      .insert([{
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
        importance: body.importance || 0
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}