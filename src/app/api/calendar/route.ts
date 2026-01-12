import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET - Fetch all employees from pb_employees table
export async function GET(request: NextRequest) {
  try {
    const { data: employees, error } = await supabase
      .from('pb_employees')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ employees: employees || [] });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}

// POST - Create a new employee
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.team) {
      return NextResponse.json(
        { error: 'Name and team are required' },
        { status: 400 }
      );
    }

    // Check if employee with same name and team already exists
    const { data: existing, error: checkError } = await supabase
      .from('pb_employees')
      .select('id')
      .eq('name', body.name)
      .eq('team', body.team)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Employee with this name and team already exists' },
        { status: 409 }
      );
    }

    // Generate initials from name
    const initials = body.name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

    // Create the employee
    const { data, error } = await supabase
      .from('pb_employees')
      .insert([{
        name: body.name,
        team: body.team,
        role: body.role || null,
        initials: body.initials || initials,
        email: body.email || null,
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating employee:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create employee' },
      { status: 500 }
    );
  }
}