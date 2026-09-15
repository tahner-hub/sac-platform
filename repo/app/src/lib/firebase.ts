import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getFunctions, type Functions } from "firebase/functions";
import { firebaseConfig, firebaseEnabled } from "./config";

// Initialized once when env vars are present; everything stays null in demo
// mode so the app runs with zero configuration.

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let functions: Functions | null = null;

if (firebaseEnabled) {
  app = initializeApp(firebaseConfig as Record<string, string>);
  auth = getAuth(app);
  db = getFirestore(app);
  functions = getFunctions(app);
}

export { app, auth, db, functions, firebaseEnabled };
