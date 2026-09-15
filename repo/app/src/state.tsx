import { createContext, useContext, useState, type ReactNode } from "react";

export const ROLES = ["donor", "org", "individual", "driver", "admin"] as const;
export type Role = (typeof ROLES)[number];

export const SCREENS = [
  // Public (no app shell)
  "landing",
  "howItWorks",
  "partners",
  "publicImpact",
  "publicBrowse",
  "roleSelect",
  "signIn",
  "accountSetup",
  "verification",
  "preferences",
  "reviewSummary",
  // Donor
  "donorDash",
  "createDonation",
  "drafts",
  "activeDonations",
  "donationDetail",
  "recurringManage",
  "impact",
  // Organization
  "orgDash",
  "marketplace",
  "recurringDonors",
  "itemDetail",
  "reserveResource",
  "reserveConfirm",
  "orgOrders",
  "orgNeeds",
  "createRequest",
  // Shared marketplace / requests
  "messages",
  "individualMarket",
  "checkout",
  "orderConfirm",
  "cashDonations",
  "discover",
  "needDetail",
  "needDonate",
  "needDonateConfirm",
  // Driver
  "driverDash",
  "pendingJobs",
  "jobDetail",
  "activeRoute",
  "deliveryConfirm",
  // Admin
  "adminOverview",
  "approvals",
  "adminUsers",
  "organizationVerification",
  // Shared
  "records",
  "notifications",
  "settings",
] as const;
export type Screen = (typeof SCREENS)[number];

const BARE_SCREENS: Screen[] = [
  "landing",
  "howItWorks",
  "partners",
  "publicImpact",
  "publicBrowse",
  "roleSelect",
  "signIn",
  "accountSetup",
  "verification",
  "preferences",
  "reviewSummary",
];

export const ROLE_HOME: Record<Role, Screen> = {
  donor: "donorDash",
  org: "orgDash",
  individual: "individualMarket",
  driver: "driverDash",
  admin: "adminOverview",
};

interface AppState {
  screen: Screen;
  role: Role;
  showShell: boolean;
  reportOpen: boolean;
  reportTarget: string;
  reportKind: "listing" | "order" | "delivery";
  navOpen: boolean;
  publicNavOpen: boolean;
  setNavOpen: (open: boolean) => void;
  setPublicNavOpen: (open: boolean) => void;
  go: (screen: Screen, role?: Role) => void;
  setRole: (role: Role) => void;
  /** Guests hitting a signed-in-only action land on account creation. */
  requireAccount: () => void;
  openReport: (target: string, kind?: "listing" | "order" | "delivery") => void;
  closeReport: () => void;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [role, setRoleState] = useState<Role>("donor");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportTarget, setReportTarget] = useState("this listing");
  const [reportKind, setReportKind] = useState<"listing" | "order" | "delivery">("listing");
  const [navOpen, setNavOpen] = useState(false);
  const [publicNavOpen, setPublicNavOpen] = useState(false);

  const go = (next: Screen, nextRole?: Role) => {
    setScreen(next);
    if (nextRole) setRoleState(nextRole);
    setNavOpen(false);
    setPublicNavOpen(false);
    requestAnimationFrame(() => {
      const el = document.getElementById("sac-content");
      if (el) el.scrollTop = 0;
      window.scrollTo({ top: 0 });
    });
  };

  const setRole = (r: Role) => go(ROLE_HOME[r], r);

  const value: AppState = {
    screen,
    role,
    showShell: !BARE_SCREENS.includes(screen),
    reportOpen,
    reportTarget,
    reportKind,
    navOpen,
    publicNavOpen,
    setNavOpen,
    setPublicNavOpen,
    go,
    setRole,
    requireAccount: () => go("roleSelect"),
    openReport: (target, kind = "listing") => {
      setReportTarget(target);
      setReportKind(kind);
      setReportOpen(true);
    },
    closeReport: () => setReportOpen(false),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
