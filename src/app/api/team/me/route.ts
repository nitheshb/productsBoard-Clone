import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// GET /api/team/me?uid=<firebase_uid>
//   Resolves the pb_employees row for the signed-in Firebase user.
//   Returns 404 if no row is linked to this uid.
export async function GET(request: NextRequest) {
  try {
    const uid = new URL(request.url).searchParams.get('uid');
    if (!uid) {
      return NextResponse.json({ error: 'uid is required' }, { status: 400 });
    }
    const { data, error } = await supabase
      .from('pb_employees')
      .select('*')
      .eq('firebase_uid', uid)
      .maybeSingle();
    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'No team member linked to this account' }, { status: 404 });
    }
    return NextResponse.json({ member: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load member';
    console.error('GET /api/team/me error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
