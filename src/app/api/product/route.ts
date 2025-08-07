
// app/api/product/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get all products (flat list, without components/features for simplicity)
export async function GET(request: NextRequest) {
  try {
    // Get query parameters for filtering
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    // Fetch products only, with columns matching the schema
    let query = supabase
      .from('products')
      .select('id, name, status, progress, version, team, days, startdate, targetdate, completedon, remarks, description, owner_initials, created_at, updated_at') // Fixed: owner_initials, added updated_at
      .order('created_at', { ascending: false });

    // Apply search filter if provided
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: products, error } = await query;

    if (error) {
      console.error('Error fetching products from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    // Return empty array if no products (Supabase returns null or [] for empty results)
    return NextResponse.json(products || []);
  } catch (error) {
    console.error('Error in GET /api/product:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Create a new product (updated for schema consistency)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json({ error: 'Product name is required' }, { status: 400 });
    }

    // Create the product with fields matching the schema
    const { data, error } = await supabase
      .from('products')
      .insert([{
        name: body.name,
        status: body.status || null,
        progress: body.progress !== undefined ? body.progress : 0,
        version: body.version || '1.0.0',
        team: body.team || null,
        days: body.days || null,
        startdate: body.startdate || null,
        targetdate: body.targetdate || null,
        completedon: body.completedon || null,
        remarks: body.remarks || null,
        description: body.description || null,
        owner_initials: body.owner_initials || null // Fixed: owner_initials
      }])
      .select();

    if (error) {
      console.error('Error creating product:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/product:', error);
    return NextResponse.json({ 
      error: 'Failed to create product',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
