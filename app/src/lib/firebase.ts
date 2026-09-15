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

export { app, auth, db, functions, firebaseEnabled };
