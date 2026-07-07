'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { auth } from './firebase';

export interface TeamMemberRecord {
  id: string;
  name: string;
  email: string | null;
  role: string | null;
  team: string | null;
  initials: string | null;
  firebase_uid: string | null;
  password_changed?: boolean | null;
}

interface AuthContextValue {
  user: User | null;
  member: TeamMemberRecord | null;
  role: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  member: null,
  role: null,
  loading: true,
  error: null,
  refresh: async () => {},
  logout: async () => {},
});

async function resolveMember(user: User): Promise<TeamMemberRecord | null> {
  const res = await fetch(`/api/team/me?uid=${encodeURIComponent(user.uid)}`, {
    cache: 'no-store',
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to resolve member (${res.status})`);
  const data = await res.json();
  return (data.member as TeamMemberRecord) ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [member, setMember] = useState<TeamMemberRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (fbUser: User | null) => {
    if (!fbUser) {
      setMember(null);
      setError(null);
      return;
    }
    try {
      const m = await resolveMember(fbUser);
      setMember(m);
      setError(m ? null : 'No team member is linked to this account. Contact an admin.');
    } catch (err) {
      setMember(null);
      setError(err instanceof Error ? err.message : 'Failed to load account');
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser);
      await load(fbUser);
      setLoading(false);
    });
    return unsub;
  }, [load]);

  const refresh = useCallback(async () => {
    if (user) await load(user);
  }, [user, load]);

  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, member, role: member?.role ?? null, loading, error, refresh, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
