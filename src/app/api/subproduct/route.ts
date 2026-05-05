
// app/api/subproduct/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get all subproducts
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const productId = searchParams.get('product_id');
    const search = searchParams.get('search') || '';

    let query = supabase
      .from('pb_subproducts')
      .select('*')
      .order('created_at', { ascending: false });

    if (productId) {
      query = query.eq('product_id', productId);
    }

    if (search) {
      query = query.ilike('name', `%${search}%`);
    }

    const { data: subproducts, error } = await query;

    if (error) {
      console.error('Error fetching subproducts from Supabase:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json(subproducts || []);
  } catch (error) {
    console.error('Error in GET /api/subproduct:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch subproducts',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Create a new subproduct
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name) {
      return NextResponse.json({ error: 'Subproduct name is required' }, { status: 400 });
    }
    if (!body.product_id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pb_subproducts')
      .insert([{
        product_id: body.product_id,
        name: body.name,
        status: body.status || 'Todo',
        progress: body.progress !== undefined ? body.progress : 0,
        version: body.version || '1.0.0',
        team: body.team || null,
        team_id: body.team_id || null,
        days: body.days || null,
        startdate: body.startdate || null,
        targetdate: body.targetdate || null,
        completedon: body.completedon || null,
        remarks: body.remarks || null,
        description: body.description || null
      }])
      .select();

    if (error) {
      console.error('Error creating subproduct:', error);
      throw new Error(`Supabase error: ${error.message}`);
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/subproduct:', error);
    return NextResponse.json({ 
      error: 'Failed to create subproduct',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
