'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

const PUBLIC_PATHS = new Set<string>(['/login']);
// Signed-in-but-not-linked users can still reach these paths so they
// can attach a login to an existing pb_employees row (bootstrap flow).
const LINK_BOOTSTRAP_PATHS = new Set<string>(['/team']);

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, error, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const isPublic = PUBLIC_PATHS.has(pathname || '');
  const isBootstrap = LINK_BOOTSTRAP_PATHS.has(pathname || '');

  useEffect(() => {
    if (loading) return;
    if (!isPublic && !user) {
      router.replace('/login');
    }
    if (isPublic && user && !error) {
      router.replace('/product');
    }
  }, [loading, user, isPublic, router, error]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-sm text-gray-500">
        Loading…
      </div>
    );
  }

  if (isPublic) return <>{children}</>;

  if (!user) return null;

  if (error && !isBootstrap) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-lg font-semibold text-gray-800 mb-2">Account not linked</h1>
        <p className="text-sm text-gray-500 max-w-md mb-4">{error}</p>
        <p className="text-xs text-gray-400 max-w-md mb-6">
          Signed in as <code className="bg-gray-100 px-1 rounded">{user.email}</code>.
          You need to attach this login to your existing team row before you can use the app.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/team')}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Link my account
          </button>
          <button
            onClick={() => logout().then(() => router.replace('/login'))}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
