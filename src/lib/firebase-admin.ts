import { initializeApp, getApps, cert, App, ServiceAccount } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';

let cached: { app: App; auth: Auth } | null = null;

function loadServiceAccount(): ServiceAccount {
  // Preferred: single JSON blob (matches caco-hr).
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (raw) {
    try {
      return JSON.parse(raw) as ServiceAccount;
    } catch (err) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT_KEY is not valid JSON: ${(err as Error).message}`
      );
    }
  }

  // Fallback: three separate env vars.
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const rawPrivateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (projectId && clientEmail && rawPrivateKey) {
    // .env-encoded private keys typically contain literal "\n" that must be
    // converted back into real newlines, plus surrounding quotes we can strip.
    const privateKey = rawPrivateKey
      .replace(/^"|"$/g, '')
      .replace(/\\n/g, '\n');
    return { projectId, clientEmail, privateKey };
  }

  throw new Error(
    'Firebase admin credentials are missing. Set either FIREBASE_SERVICE_ACCOUNT_KEY (single JSON blob) OR the trio FIREBASE_ADMIN_PROJECT_ID + FIREBASE_ADMIN_CLIENT_EMAIL + FIREBASE_ADMIN_PRIVATE_KEY in .env, then restart `npm run dev`.'
  );
}

export function getAdminAuth(): Auth {
  if (cached) return cached.auth;

  const serviceAccount = loadServiceAccount();

  const existing = getApps();
  const app =
    existing.length > 0 ? existing[0] : initializeApp({ credential: cert(serviceAccount) });

  cached = { app, auth: getAuth(app) };
  return cached.auth;
}
