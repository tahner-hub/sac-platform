import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  type User,
} from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import { auth, db, firebaseEnabled } from "../lib/firebase";
import type { Role } from "../state";

/**
 * Auth service — Firebase Authentication plus the matching `users/{uid}`
 * profile document.
 *
 * Every function is safe to call when Firebase isn't configured: the app then
 * runs in demo mode against local data, so `npm run dev` works with no keys.
 */

/** Shape of a `users/{uid}` document. Mirrors BACKEND.md. */
export interface UserProfile {
  uid: string;
  email: string;
  role: Role;
  displayName: string;
  phone?: string;
  orgName?: string;
  categories?: string[];
  city?: string;
  state?: string;
  /** Flipped true by an admin in the Approvals queue. */
  verified: boolean;
  status: "active" | "suspended" | "deactivated";
  reportCount: number;
  orgProfile?: {
    description?: string;
    imageUrl?: string;
    donationUrl?: string;
    platformName?: string;
  };
  driverProfile?: {
    capacityLbs?: number;
    availableFrom?: string;
    availableTo?: string;
    isAvailable?: boolean;
    deliveriesCompleted?: number;
  };
}

/** Fields collected during onboarding before the account exists. */
export interface SignUpDetails {
  displayName: string;
  phone?: string;
  orgName?: string;
  categories?: string[];
}

export const authEnabled = firebaseEnabled;

/**
 * Subscribes to sign-in / sign-out. Returns an unsubscribe function.
 * In demo mode it reports "signed out" once and never fires again.
 */
export function watchAuth(callback: (user: User | null) => void): () => void {
  if (!firebaseEnabled || !auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

/**
 * Streams the signed-in user's profile document in real time, so a role change
 * or an admin approval reaches the UI without a refresh.
 * Returns an unsubscribe function.
 */
export function watchUserProfile(
  uid: string,
  onProfile: (profile: UserProfile | null) => void,
  onError?: (error: Error) => void,
): () => void {
  if (!firebaseEnabled || !db) {
    onProfile(null);
    return () => {};
  }
  return onSnapshot(
    doc(db, "users", uid),
    (snapshot) => {
      if (!snapshot.exists()) {
        onProfile(null);
        return;
      }
      onProfile({ uid: snapshot.id, ...snapshot.data() } as UserProfile);
    },
    (error) => onError?.(error),
  );
}

export async function signUp(
  email: string,
  password: string,
  role: Role,
  details: SignUpDetails,
): Promise<void> {
  if (!firebaseEnabled || !auth || !db) return;
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  // Provision the profile immediately — the onSnapshot listener picks it up.
  await setDoc(doc(db, "users", credential.user.uid), {
    email,
    role,
    displayName: details.displayName,
    phone: details.phone ?? "",
    orgName: details.orgName ?? "",
    categories: details.categories ?? [],
    verified: false,
    status: "active",
    reportCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function signIn(email: string, password: string): Promise<void> {
  if (!firebaseEnabled || !auth) return;
  await signInWithEmailAndPassword(auth, email, password);
}

export async function signOut(): Promise<void> {
  if (!firebaseEnabled || !auth) return;
  await fbSignOut(auth);
}

/**
 * Self-service password reset — Firebase sends the email, so admins never
 * reset passwords by hand.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  if (!firebaseEnabled || !auth) return;
  await sendPasswordResetEmail(auth, email);
}

/** Updates editable profile fields. Security rules block role/verified/status. */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, "uid" | "role" | "verified" | "status" | "reportCount">>,
): Promise<void> {
  if (!firebaseEnabled || !db) return;
  await updateDoc(doc(db, "users", uid), data);
}

/** Turns a Firebase auth error code into something worth showing a person. */
export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? "";
  switch (code) {
    case "auth/invalid-email":
      return "That email address doesn't look right.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Email or password is incorrect.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/email-already-in-use":
      return "An account already exists with that email. Try signing in.";
    case "auth/weak-password":
      return "Use a password of at least 6 characters.";
    case "auth/network-request-failed":
      return "Network problem — check your connection and try again.";
    default:
      return "Something went wrong. Please try again.";
  }
}
