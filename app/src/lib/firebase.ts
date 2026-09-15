import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";
import { firebaseConfig, firebaseDatabaseId, firebaseEnabled } from "./config";

// Initialized once when env vars are present; everything stays null in demo
// mode so the app runs with zero configuration.

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig as Record<string, string>);
  auth = getAuth(app);
  // A named database needs its id passed explicitly; omitting it targets
  // `(default)`, which is a different database even when one is named "default".
  db = firebaseDatabaseId ? getFirestore(app, firebaseDatabaseId) : getFirestore(app);
  functions = getFunctions(app);
}

// Dev-only: says which mode the app actually booted in. "Demo mode" here while
// app/.env.local exists means Vite didn't read it — it loads env once at
// startup, so the dev server has to be restarted after the file changes.
if (import.meta.env.DEV) {
  console.info(
    firebaseEnabled
      ? `[S.A.C.] Firebase mode — project ${firebaseConfig.projectId}` +
          (firebaseDatabaseId ? `, database "${firebaseDatabaseId}"` : ", database (default)")
      : "[S.A.C.] Demo mode — no VITE_FIREBASE_* vars loaded. Check app/.env.local exists, " +
          "then restart the dev server (Vite reads env only at startup).",
  );
}

export { app, auth, db, functions, firebaseEnabled };
