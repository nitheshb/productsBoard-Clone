import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getAdminAuth } from '@/lib/firebase-admin';

// PATCH /api/team/:id
//   Body: { role?, team?, name?, email? }
//   Updates the given pb_employees row. Only fields present in the body
//   are touched, so callers can PATCH one column at a time.
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const body = await request.json();
    const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (typeof body.role === 'string') update.role = body.role.trim() || 'member';
    if (typeof body.team === 'string') update.team = body.team.trim();
    if (typeof body.name === 'string' && body.name.trim()) update.name = body.name.trim();
    if (typeof body.email === 'string') update.email = body.email.trim().toLowerCase() || null;

    const { data, error } = await supabase
      .from('pb_employees')
      .update(update)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ member: data });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update member';
    console.error('PATCH /api/team/:id error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/team/:id
//   Removes the pb_employees row. If a Firebase Auth account is linked,
//   also deletes that auth user (so they can no longer log in).
//   Query params:
//     ?actor_uid=<firebase-uid>  — must belong to a member whose role is 'admin'
//     ?keep_history=true         — skip deleting the row, only unlink the login
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    const url = new URL(request.url);
    const actorUid = url.searchParams.get('actor_uid');
    const keepHistory = url.searchParams.get('keep_history') === 'true';

    if (!actorUid) {
      return NextResponse.json(
        { error: 'actor_uid is required' },
        { status: 401 }
      );
    }

    // Actor must be an admin.
    const { data: actor, error: actorError } = await supabase
      .from('pb_employees')
      .select('id, role')
      .eq('firebase_uid', actorUid)
      .maybeSingle();
    if (actorError) throw actorError;
    if (!actor || actor.role !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can remove team members.' },
        { status: 403 }
      );
    }
    if (actor.id === id) {
      return NextResponse.json(
        { error: 'You cannot remove your own admin account.' },
        { status: 400 }
      );
    }

    const { data: target, error: targetError } = await supabase
      .from('pb_employees')
      .select('id, firebase_uid')
      .eq('id', id)
      .maybeSingle();
    if (targetError) throw targetError;
    if (!target) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Best-effort: delete the Firebase Auth account so they can no longer sign in.
    if (target.firebase_uid) {
      try {
        await getAdminAuth().deleteUser(target.firebase_uid);
      } catch (err) {
        console.warn('Firebase Auth delete failed (continuing):', err);
      }
    }

    if (keepHistory) {
      const { data, error } = await supabase
        .from('pb_employees')
        .update({
          firebase_uid: null,
          email: null,
          password_changed: false,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ member: data, deleted: false });
    }

    const { error: deleteError } = await supabase
      .from('pb_employees')
      .delete()
      .eq('id', id);
    if (deleteError) throw deleteError;
    return NextResponse.json({ deleted: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to remove member';
    console.error('DELETE /api/team/:id error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
