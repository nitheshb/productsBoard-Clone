import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getAdminAuth } from '@/lib/firebase-admin';
import { sendInviteEmail } from '@/lib/mailer';

async function maybeSendInvite(params: {
  request: NextRequest;
  email: string;
  name: string;
  tempPassword: string | null;
}): Promise<{ sent: boolean; error?: string }> {
  if (!params.tempPassword) return { sent: false };
  try {
    const origin =
      process.env.NEXT_PUBLIC_APP_URL ||
      new URL(params.request.url).origin;
    await sendInviteEmail({
      to: params.email,
      name: params.name,
      tempPassword: params.tempPassword,
      loginUrl: `${origin.replace(/\/$/, '')}/login`,
    });
    return { sent: true };
  } catch (err) {
    console.error('Invite email failed:', err);
    return { sent: false, error: err instanceof Error ? err.message : 'Failed to send email' };
  }
}

function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!';
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join('');
}

function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// GET /api/team — list all team members from pb_employees.
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('pb_employees')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return NextResponse.json({ members: data ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load team';
    console.error('GET /api/team error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/team
//   { name, email, team, role?, initials?, link_existing_id? }
//   • If link_existing_id is provided, we attach a Firebase Auth account to
//     that existing pb_employees row (preserves all task history).
//   • Otherwise we create a fresh row.
//   • In both paths: if a Firebase Auth user with `email` already exists
//     (e.g. caco-hr employee) we reuse its uid; otherwise we createUser
//     with a random temp password.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const team = typeof body.team === 'string' ? body.team.trim() : name;
    const role = typeof body.role === 'string' && body.role.trim() ? body.role.trim() : 'member';
    const linkId = typeof body.link_existing_id === 'string' ? body.link_existing_id : null;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'name and email are required' },
        { status: 400 }
      );
    }

    // 1. Find or create the Firebase Auth account.
    let uid: string;
    let tempPassword: string | null = null;
    try {
      const existing = await getAdminAuth().getUserByEmail(email);
      uid = existing.uid;
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/user-not-found') {
        tempPassword = generatePassword();
        const created = await getAdminAuth().createUser({
          email,
          password: tempPassword,
          displayName: name,
        });
        uid = created.uid;
      } else {
        throw err;
      }
    }

    // 2. Upsert the pb_employees row.
    const initials = typeof body.initials === 'string' && body.initials.trim()
      ? body.initials.trim().toUpperCase().slice(0, 2)
      : initialsFor(name);

    if (linkId) {
      const { data, error } = await supabase
        .from('pb_employees')
        .update({
          firebase_uid: uid,
          email,
          role,
          updated_at: new Date().toISOString(),
        })
        .eq('id', linkId)
        .select()
        .single();
      if (error) throw error;
      const emailResult = await maybeSendInvite({ request, email, name, tempPassword });
      return NextResponse.json({
        member: data,
        temp_password: tempPassword,
        email_sent: emailResult.sent,
        email_error: emailResult.error,
      });
    }

    // Check for an existing row with the same firebase_uid (idempotent invite).
    const { data: existingRow } = await supabase
      .from('pb_employees')
      .select('*')
      .eq('firebase_uid', uid)
      .maybeSingle();

    if (existingRow) {
      const emailResult = await maybeSendInvite({ request, email, name, tempPassword });
      return NextResponse.json({
        member: existingRow,
        temp_password: tempPassword,
        email_sent: emailResult.sent,
        email_error: emailResult.error,
      });
    }

    const { data, error } = await supabase
      .from('pb_employees')
      .insert([
        {
          name,
          email,
          team,
          role,
          initials,
          firebase_uid: uid,
          password_changed: false,
        },
      ])
      .select()
      .single();
    if (error) throw error;
    const emailResult = await maybeSendInvite({ request, email, name, tempPassword });
    return NextResponse.json({
      member: data,
      temp_password: tempPassword,
      email_sent: emailResult.sent,
      email_error: emailResult.error,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to invite team member';
    console.error('POST /api/team error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
