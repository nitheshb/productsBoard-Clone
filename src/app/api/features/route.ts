// api/feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// Create a new feature
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.component_id) {
      return NextResponse.json({ error: 'Name and component_id are required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('features')
      .insert([{
        name: body.name,
        component_id: body.component_id,
        status: body.status || 'Todo',
        progress: body.progress !== undefined ? body.progress : 0,
        team: body.team || null,
        days: body.days !== undefined ? body.days : null,
        startDate: body.startDate || null,
        targetDate: body.targetDate || null,
        completedOn: body.completedOn || null,
        remarks: body.remarks || null,
        owner_initials: body.owner_initials || null,
        importance: body.importance || null,
        color: body.color || null
      }])
      .select();

    if (error) throw error;

    return NextResponse.json(data[0]);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json({ error: 'Failed to create feature' }, { status: 500 });
  }
}