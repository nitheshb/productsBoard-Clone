import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Get all versions
export async function GET(request: NextRequest) {
  try {
    const { data: versions, error } = await supabase
      .from('versions')
      .select('*')
      .order('version', { ascending: true });

    if (error) throw error;

    return NextResponse.json(versions);
  } catch (error) {
    console.error('Error fetching versions:', error);
    return NextResponse.json({ error: 'Failed to fetch versions' }, { status: 500 });
  }
}

// Create a new version
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.version) {
      return NextResponse.json({ error: 'Version is required' }, { status: 400 });
    }

    // Check if version already exists
    const { data: existingVersion, error: checkError } = await supabase
      .from('versions')
      .select('id')
      .eq('version', body.version)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingVersion) {
      return NextResponse.json({ error: 'Version already exists' }, { status: 409 });
    }

    // Create the version
    const { data, error } = await supabase
      .from('versions')
      .insert([{
        version: body.version,
        description: body.description || null
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Error creating version:', error);
    return NextResponse.json({ error: 'Failed to create version' }, { status: 500 });
  }
} 