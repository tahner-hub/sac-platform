// Central place for environment-driven configuration.
// All values come from .env.local (see .env.example) — nothing is hardcoded.

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
};

/** True when Firebase env vars are present. Without them the app runs in
 *  demo mode: local store only, no network, role-jump chips enabled. */
export const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

/**
 * Firestore database id. Leave unset for the standard `(default)` database.
 *
 * Firebase also allows *named* databases, and a database named "default" is a
 * different thing from `(default)` — the console displays both identically, so
 * it's easy to create one while believing you created the other. If the app
 * reports no database but the console clearly shows one, set this to the name
 * in the console's database dropdown.
 */
export const firebaseDatabaseId = import.meta.env.VITE_FIREBASE_DATABASE_ID as
  | string
  | undefined;

export const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

/** The "View as" role switcher is a demo/QA tool. It stays on in demo mode
 *  and in dev builds; set VITE_ENABLE_ROLE_SWITCHER=false to hide it. */
export const roleSwitcherEnabled =
  import.meta.env.VITE_ENABLE_ROLE_SWITCHER !== "false" && (!firebaseEnabled || import.meta.env.DEV);
