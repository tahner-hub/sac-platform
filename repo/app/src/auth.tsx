import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { User } from "firebase/auth";
import {
  authEnabled,
  authErrorMessage,
  requestPasswordReset,
  signIn as authSignIn,
  signOut as authSignOut,
  signUp as authSignUp,
  updateUserProfile,
  watchAuth,
  watchUserProfile,
  type SignUpDetails,
  type UserProfile,
} from "./services/auth";
import type { Role } from "./state";

/**
 * Authentication + live user profile.
 *
 * Kept deliberately separate from `store.tsx` (which holds donations, orders,
 * requests, messages and delivery state) so that wiring auth doesn't disturb
 * the rest of the app.
 *
 * Two modes:
 *  - **firebase** — real Auth session, with the `users/{uid}` document streamed
 *    over `onSnapshot` so role changes and admin approvals appear instantly.
 *  - **demo** — no Firebase env vars. A local profile stands in, so every
 *    screen and the role switcher keep working with zero configuration.
 */

/**
 * Details gathered across the four onboarding steps before the account exists.
 * Held here (rather than in `store.tsx`) because it only matters until sign-up
 * succeeds, at which point it becomes the `users/{uid}` document.
 */
export interface SignupDraft {
  displayName: string;
  email: string;
  password: string;
  phone: string;
  orgName: string;
  categories: string[];
  orgDescription: string;
  donationUrl: string;
}

const EMPTY_DRAFT: SignupDraft = {
  displayName: "",
  email: "",
  password: "",
  phone: "",
  orgName: "",
  categories: [],
  orgDescription: "",
  donationUrl: "",
};

interface AuthState {
  mode: "firebase" | "demo";
  /** True until the first auth check resolves — render a splash, not the app. */
  loading: boolean;
  authUser: User | null;
  profile: UserProfile | null;
  signedIn: boolean;
  /** Set while Firebase has a session but the profile doc hasn't arrived. */
  profilePending: boolean;
  error: string | null;
  clearError: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string, role: Role, details: SignUpDetails) => Promise<boolean>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  saveProfile: (data: Partial<UserProfile>) => Promise<boolean>;
  /** Demo mode only: adopt a role without credentials. */
  demoSignIn: (role: Role) => void;
  demoSignOut: () => void;
  /** In-progress onboarding form, shared across the four setup steps. */
  draft: SignupDraft;
  setDraft: (patch: Partial<SignupDraft>) => void;
}

const DEMO_PROFILE: Record<Role, UserProfile> = {
  donor: demo("donor", "Jordan Avery", "jordan@globalgrocers.com", "Global Grocers Inc."),
  org: demo("org", "Riley Chen", "riley@havencenter.org", "The Haven Center"),
  individual: demo("individual", "Sam Iverson", "sam@example.com", ""),
  driver: demo("driver", "Marcus Lee", "m.lee@example.com", ""),
  admin: demo("admin", "Avery Cole", "admin@sac.org", "S.A.C."),
};

function demo(role: Role, displayName: string, email: string, orgName: string): UserProfile {
  return {
    uid: `demo-${role}`,
    email,
    role,
    displayName,
    orgName,
    phone: "(206) 555-0148",
    categories: ["Food", "Clothing", "Hygiene"],
    city: "Seattle",
    state: "WA",
    verified: true,
    status: "active",
    reportCount: 0,
  };
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode: "firebase" | "demo" = authEnabled ? "firebase" : "demo";

  const [loading, setLoading] = useState(mode === "firebase");
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profilePending, setProfilePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraftState] = useState<SignupDraft>(EMPTY_DRAFT);

  // Holds the profile listener so it can be torn down when the user changes.
  const unsubProfileRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (mode === "demo") return;

    const unsubAuth = watchAuth((user) => {
      // Always drop the previous user's profile stream first.
      unsubProfileRef.current();
      unsubProfileRef.current = () => {};

      if (!user) {
        setAuthUser(null);
        setProfile(null);
        setProfilePending(false);
        setLoading(false);
        return;
      }

      setAuthUser(user);
      setProfilePending(true);
      unsubProfileRef.current = watchUserProfile(
        user.uid,
        (next) => {
          setProfile(next);
          setProfilePending(false);
          setLoading(false);
        },
        (err) => {
          console.error("Profile sync error:", err);
          setError("Couldn't load your profile. Check your connection and try again.");
          setProfilePending(false);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubAuth();
      unsubProfileRef.current();
    };
  }, [mode]);

  const value: AuthState = {
    mode,
    loading,
    authUser,
    profile,
    signedIn: mode === "demo" ? profile !== null : authUser !== null,
    profilePending,
    error,
    clearError: () => setError(null),

    signIn: async (email, password) => {
      setError(null);
      try {
        await authSignIn(email, password);
        return true; // onAuthStateChanged takes it from here
      } catch (e) {
        setError(authErrorMessage(e));
        return false;
      }
    },

    signUp: async (email, password, role, details) => {
      setError(null);
      try {
        await authSignUp(email, password, role, details);
        setDraftState(EMPTY_DRAFT); // credentials never linger in memory
        return true;
      } catch (e) {
        setError(authErrorMessage(e));
        return false;
      }
    },

    signOut: async () => {
      setError(null);
      if (mode === "demo") {
        setProfile(null);
        return;
      }
      try {
        await authSignOut();
      } catch (e) {
        setError(authErrorMessage(e));
      }
    },

    sendPasswordReset: async (email) => {
      setError(null);
      try {
        await requestPasswordReset(email);
        return true;
      } catch (e) {
        setError(authErrorMessage(e));
        return false;
      }
    },

    saveProfile: async (data) => {
      if (mode === "demo") {
        setProfile((p) => (p ? { ...p, ...data } : p));
        return true;
      }
      if (!authUser) return false;
      try {
        await updateUserProfile(authUser.uid, data);
        return true; // onSnapshot delivers the change
      } catch (e) {
        setError(authErrorMessage(e));
        return false;
      }
    },

    demoSignIn: (role) =>
      setProfile({
        ...DEMO_PROFILE[role],
        // Anything typed during onboarding wins over the stand-in values.
        ...(draft.displayName ? { displayName: draft.displayName } : {}),
        ...(draft.email ? { email: draft.email } : {}),
        ...(draft.phone ? { phone: draft.phone } : {}),
        ...(draft.orgName ? { orgName: draft.orgName } : {}),
        ...(draft.categories.length ? { categories: draft.categories } : {}),
      }),
    demoSignOut: () => setProfile(null),

    draft,
    setDraft: (patch) => setDraftState((d) => ({ ...d, ...patch })),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
