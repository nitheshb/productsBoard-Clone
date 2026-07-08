'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Sidebar from '@/app/(main)/(pages)/product/_components/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import {
  UsersIcon,
  PlusIcon,
  LinkIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/lib/auth-context';

interface TeamMember {
  id: string;
  name: string;
  email: string | null;
  team: string | null;
  role: string | null;
  initials: string | null;
  firebase_uid: string | null;
  password_changed?: boolean | null;
}

const ROLE_OPTIONS = ['admin', 'manager', 'member'] as const;

export default function TeamPage() {
  const { user, member: currentMember, refresh } = useAuth();
  const needsBootstrap = !!user && !currentMember;
  const isAdmin = currentMember?.role === 'admin';

  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [sheetOpen, setSheetOpen] = useState(false);
  const [linkingRow, setLinkingRow] = useState<TeamMember | null>(null);
  const [inviteResult, setInviteResult] = useState<{
    email: string;
    tempPassword: string | null;
    emailSent: boolean;
    emailError?: string;
  } | null>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    team: '',
    role: 'member' as (typeof ROLE_OPTIONS)[number],
  });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [savingRoleId, setSavingRoleId] = useState<string | null>(null);
  const [removeTarget, setRemoveTarget] = useState<TeamMember | null>(null);
  const [removing, setRemoving] = useState(false);
  const [removeError, setRemoveError] = useState<string | null>(null);

  const fetchTeam = useCallback(async () => {
    try {
      const res = await fetch('/api/team', { cache: 'no-store' });
      const text = await res.text();
      let data: { members?: TeamMember[]; error?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server returned ${res.status} — non-JSON response: ${text.slice(0, 200)}`
        );
      }
      if (!res.ok) throw new Error(data.error || `Failed to load team (${res.status})`);
      setMembers((data.members || []) as TeamMember[]);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team');
    }
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchTeam();
      setLoading(false);
    })();
  }, [fetchTeam]);

  const startInvite = () => {
    setLinkingRow(null);
    setForm({ name: '', email: '', team: '', role: 'member' });
    setSaveError('');
    setInviteResult(null);
    setSheetOpen(true);
  };

  const startLink = (row: TeamMember) => {
    setLinkingRow(row);
    setForm({
      name: row.name,
      email: row.email ?? '',
      team: row.team ?? '',
      role: (row.role as (typeof ROLE_OPTIONS)[number]) ?? 'member',
    });
    setSaveError('');
    setInviteResult(null);
    setSheetOpen(true);
  };

  const submitInvite = async () => {
    setSaveError('');
    if (!form.name.trim() || !form.email.trim()) {
      setSaveError('Name and email are required.');
      return;
    }
    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        name: form.name.trim(),
        email: form.email.trim(),
        team: form.team.trim() || form.name.trim(),
        role: form.role,
      };
      if (linkingRow) body.link_existing_id = linkingRow.id;

      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setInviteResult({
        email: (data.member?.email as string) ?? form.email.trim(),
        tempPassword: (data.temp_password as string | null) ?? null,
        emailSent: Boolean(data.email_sent),
        emailError: (data.email_error as string | undefined) ?? undefined,
      });
      await fetchTeam();
      await refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const changeRole = useCallback(
    async (row: TeamMember, role: string) => {
      setSavingRoleId(row.id);
      try {
        const res = await fetch(`/api/team/${row.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to update role');
        setMembers((prev) =>
          prev.map((m) => (m.id === row.id ? { ...m, role: data.member?.role ?? role } : m))
        );
        if (currentMember?.id === row.id) await refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to update role');
      } finally {
        setSavingRoleId(null);
      }
    },
    [currentMember?.id, refresh]
  );

  const confirmRemove = async () => {
    if (!removeTarget || !user) return;
    setRemoving(true);
    setRemoveError(null);
    try {
      const res = await fetch(
        `/api/team/${removeTarget.id}?actor_uid=${encodeURIComponent(user.uid)}`,
        { method: 'DELETE' }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Failed to remove (${res.status})`);
      setRemoveTarget(null);
      await fetchTeam();
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  const closeSheet = () => {
    if (saving) return;
    setSheetOpen(false);
    setInviteResult(null);
    setLinkingRow(null);
  };

  const { linked, unlinked } = useMemo(() => {
    const linked: TeamMember[] = [];
    const unlinked: TeamMember[] = [];
    for (const m of members) {
      (m.firebase_uid ? linked : unlinked).push(m);
    }
    return { linked, unlinked };
  }, [members]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-full mx-auto">
          <header className="sticky top-0 z-20 flex justify-between items-center p-4 bg-white border-b">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-6 w-6 text-blue-500" />
              <h1 className="text-xl font-semibold">Team</h1>
              {currentMember?.role && (
                <Badge variant="outline" className="ml-2 text-[10px] border-blue-200 bg-blue-50 text-blue-700">
                  You are: {currentMember.role}
                </Badge>
              )}
            </div>
            {isAdmin && (
              <Button onClick={startInvite} className="bg-blue-500 hover:bg-blue-600">
                <PlusIcon className="h-4 w-4 mr-1.5" />
                Invite member
              </Button>
            )}
          </header>

          <div className="p-6 space-y-6">
            {needsBootstrap && (
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                <InformationCircleIcon className="h-5 w-5 mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold mb-0.5">Link your account to continue</div>
                  <p className="text-xs text-amber-700">
                    You&apos;re signed in as <code className="bg-amber-100 px-1 rounded">{user?.email}</code>{' '}
                    but no team row is linked to this login yet. Find your name in the &quot;not linked&quot; section
                    below and click <b>Link login</b>.
                  </p>
                </div>
              </div>
            )}
            {loading ? (
              <div className="flex items-center justify-center h-64 text-sm text-gray-400">
                Loading team…
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <UsersIcon className="h-12 w-12 text-gray-300 mb-3" />
                <h2 className="text-lg font-semibold text-gray-600 mb-2">Unable to load team</h2>
                <p className="text-gray-500 text-sm max-w-md mb-4">{error}</p>
              </div>
            ) : (
              <>
                <TeamSection
                  title="Signed-in members"
                  emptyLabel="No one has signed in yet."
                  members={linked}
                  onLink={startLink}
                  onChangeRole={changeRole}
                  savingRoleId={savingRoleId}
                  currentMemberId={currentMember?.id}
                  isAdmin={isAdmin}
                  onRemove={setRemoveTarget}
                />
                {unlinked.length > 0 && (
                  <TeamSection
                    title="Existing team — not linked to a login yet"
                    subtitle="These rows keep all their historical task assignments. Add an email and click Link to give them a login."
                    emptyLabel=""
                    members={unlinked}
                    onLink={startLink}
                    onChangeRole={changeRole}
                    savingRoleId={savingRoleId}
                    currentMemberId={currentMember?.id}
                    isAdmin={isAdmin}
                    onRemove={setRemoveTarget}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Right-sidebar sheet for invite / link */}
      <Sheet open={sheetOpen} onOpenChange={(open) => (!open ? closeSheet() : setSheetOpen(true))}>
        <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
          <SheetHeader className="px-6 py-4 border-b bg-gray-50">
            <SheetTitle>
              {linkingRow ? `Link login to ${linkingRow.name}` : 'Invite team member'}
            </SheetTitle>
            <SheetDescription className="text-xs text-gray-500">
              {linkingRow
                ? 'Attach a Firebase login to this existing team row. Task history is preserved.'
                : 'Creates a new team member and a Firebase login. A temporary password is generated.'}
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {inviteResult ? (
              <InviteResult result={inviteResult} />
            ) : (
              <div className="space-y-4">
                <Field
                  label="Name"
                  value={form.name}
                  onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                  placeholder="Full name"
                  disabled={!!linkingRow}
                />
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                  placeholder="name@company.com"
                  type="email"
                />
                <Field
                  label="Team / group"
                  value={form.team}
                  onChange={(v) => setForm((f) => ({ ...f, team: v }))}
                  placeholder="Defaults to name if empty"
                />
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, role: e.target.value as (typeof ROLE_OPTIONS)[number] }))
                    }
                    className="w-full border rounded-lg px-3 py-2 text-sm border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                {saveError && <p className="text-xs text-red-500">{saveError}</p>}
              </div>
            )}
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-gray-50">
            {inviteResult ? (
              <Button onClick={closeSheet} className="bg-blue-500 hover:bg-blue-600 w-full sm:w-auto">
                Done
              </Button>
            ) : (
              <div className="flex items-center justify-end gap-2 w-full">
                <Button variant="outline" onClick={closeSheet} disabled={saving}>Cancel</Button>
                <Button onClick={submitInvite} disabled={saving} className="bg-blue-500 hover:bg-blue-600">
                  {saving ? 'Saving…' : linkingRow ? 'Link account' : 'Send invite'}
                </Button>
              </div>
            )}
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <ConfirmationDialog
        isOpen={!!removeTarget}
        onClose={() => {
          if (removing) return;
          setRemoveTarget(null);
          setRemoveError(null);
        }}
        onConfirm={confirmRemove}
        title={`Remove ${removeTarget?.name}?`}
        description={
          removeError ||
          (removeTarget?.firebase_uid
            ? `This deletes the pb_employees row and their Firebase login. Existing tasks assigned by name will keep the name string, but they will no longer be able to sign in. This action cannot be undone.`
            : `This deletes the pb_employees row. Existing tasks assigned by name will keep the name string. This action cannot be undone.`)
        }
        confirmText={removing ? 'Removing…' : 'Remove member'}
        isLoading={removing}
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full border rounded-lg px-3 py-2 text-sm border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
      />
    </div>
  );
}

function InviteResult({
  result,
}: {
  result: { email: string; tempPassword: string | null; emailSent: boolean; emailError?: string };
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
        <ShieldCheckIcon className="h-4 w-4 mt-0.5 shrink-0" />
        <span>Account is ready.</span>
      </div>
      <p className="text-xs text-gray-600">
        Email: <code className="bg-gray-100 px-1 rounded">{result.email}</code>
      </p>

      {result.tempPassword ? (
        <>
          {result.emailSent ? (
            <p className="text-xs text-green-700">
              ✓ Welcome email sent with the temporary password.
            </p>
          ) : (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1">
              Email delivery failed — share the temporary password manually.
              {result.emailError ? ` (${result.emailError})` : ''}
            </p>
          )}
          <p className="text-xs text-gray-600">Temporary password:</p>
          <code className="block bg-gray-900 text-white font-mono text-sm px-3 py-2 rounded break-all">
            {result.tempPassword}
          </code>
          <p className="text-[11px] text-gray-500">
            They should sign in with it, then click &quot;Forgot password?&quot; to set a new one.
          </p>
        </>
      ) : (
        <p className="text-xs text-gray-600">
          Existing Firebase account found — they can sign in with their current password
          (e.g., their caco-hr credentials). No new password created, so no email was sent.
        </p>
      )}
    </div>
  );
}

function TeamSection({
  title,
  subtitle,
  emptyLabel,
  members,
  onLink,
  onChangeRole,
  savingRoleId,
  currentMemberId,
  isAdmin,
  onRemove,
}: {
  title: string;
  subtitle?: string;
  emptyLabel: string;
  members: TeamMember[];
  onLink: (row: TeamMember) => void;
  onChangeRole: (row: TeamMember, role: string) => void;
  savingRoleId: string | null;
  currentMemberId?: string;
  isAdmin: boolean;
  onRemove: (row: TeamMember) => void;
}) {
  return (
    <section>
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
      </div>

      {members.length === 0 ? (
        <div className="text-sm text-gray-400 italic">{emptyLabel}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {members.map((m) => (
            <div
              key={m.id}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex items-start gap-3"
            >
              <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-semibold shrink-0">
                {(m.initials || m.name.slice(0, 2)).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{m.name}</h3>
                  {m.id === currentMemberId && (
                    <Badge variant="outline" className="text-[10px] border-blue-200 bg-blue-50 text-blue-700">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">{m.email || 'No email on file'}</p>
                {m.team && m.team !== m.name && (
                  <p className="text-[11px] text-gray-400 mt-0.5">Team: {m.team}</p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-[11px] text-gray-500">Role</label>
                  <select
                    value={m.role ?? 'member'}
                    onChange={(e) => onChangeRole(m, e.target.value)}
                    disabled={savingRoleId === m.id || (!isAdmin && m.id !== currentMemberId)}
                    className="text-xs border border-gray-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-60"
                  >
                    {ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                  {savingRoleId === m.id && (
                    <span className="text-[10px] text-gray-400">saving…</span>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-3">
                  {!m.firebase_uid && (
                    <button
                      onClick={() => onLink(m)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
                    >
                      <LinkIcon className="h-3 w-3" />
                      Link login
                    </button>
                  )}
                  {isAdmin && m.id !== currentMemberId && (
                    <button
                      onClick={() => onRemove(m)}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <TrashIcon className="h-3 w-3" />
                      Remove
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
