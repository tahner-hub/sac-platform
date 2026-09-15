import { useEffect, useRef, type ComponentType, type ReactNode } from "react";
import { C } from "./theme";
import { LogoMark } from "./icons";
import { AppProvider, ROLE_HOME, useApp, type Screen } from "./state";
import { AuthProvider, useAuth } from "./auth";
import { StoreProvider, useStore } from "./store";
import { Btn, ToastStack } from "./ui";
import { Sidebar, Topbar } from "./Shell";
import { ReportModal } from "./ReportModal";
import { HowItWorks, Landing, Partners, PublicBrowse, PublicImpact, RoleSelect, SignIn } from "./screens/public";
import { AccountSetup, Preferences, ReviewSummary, Verification } from "./screens/onboarding";
import {
  ActiveDonations,
  CreateDonation,
  DonationDetail,
  DonorDash,
  Drafts,
  Impact,
  RecurringManage,
} from "./screens/donor";
import {
  ItemDetail,
  Marketplace,
  OrgDash,
  OrgOrders,
  RecurringDonors,
  ReserveConfirm,
  ReserveResource,
} from "./screens/org";
import { Checkout, IndividualMarket, OrderConfirm } from "./screens/individual";
import {
  CashDonations,
  CreateRequest,
  Discover,
  NeedDetail,
  NeedDonate,
  NeedDonateConfirm,
  OrgNeeds,
} from "./screens/needs";
import { ActiveRoute, DeliveryConfirm, DriverDash, JobDetail, PendingJobs } from "./screens/driver";
import { AdminOverview, AdminUsers, Approvals, OrganizationVerification } from "./screens/admin";
import { Messages, Notifications, Records, Settings } from "./screens/shared";

const SCREEN_COMPONENTS: Record<Screen, ComponentType> = {
  landing: Landing,
  howItWorks: HowItWorks,
  partners: Partners,
  publicImpact: PublicImpact,
  publicBrowse: PublicBrowse,
  roleSelect: RoleSelect,
  signIn: SignIn,
  accountSetup: AccountSetup,
  verification: Verification,
  preferences: Preferences,
  reviewSummary: ReviewSummary,

  donorDash: DonorDash,
  createDonation: CreateDonation,
  drafts: Drafts,
  activeDonations: ActiveDonations,
  donationDetail: DonationDetail,
  recurringManage: RecurringManage,
  impact: Impact,

  orgDash: OrgDash,
  marketplace: Marketplace,
  recurringDonors: RecurringDonors,
  itemDetail: ItemDetail,
  reserveResource: ReserveResource,
  reserveConfirm: ReserveConfirm,
  orgOrders: OrgOrders,
  orgNeeds: OrgNeeds,
  createRequest: CreateRequest,

  messages: Messages,
  individualMarket: IndividualMarket,
  checkout: Checkout,
  orderConfirm: OrderConfirm,
  cashDonations: CashDonations,
  discover: Discover,
  needDetail: NeedDetail,
  needDonate: NeedDonate,
  needDonateConfirm: NeedDonateConfirm,

  driverDash: DriverDash,
  pendingJobs: PendingJobs,
  jobDetail: JobDetail,
  activeRoute: ActiveRoute,
  deliveryConfirm: DeliveryConfirm,

  adminOverview: AdminOverview,
  approvals: Approvals,
  adminUsers: AdminUsers,
  organizationVerification: OrganizationVerification,

  records: Records,
  notifications: Notifications,
  settings: Settings,
};

function AppFrame() {
  const { screen, showShell, navOpen, setNavOpen } = useApp();
  const { toasts } = useStore();
  const ScreenComponent = SCREEN_COMPONENTS[screen];
  return (
    <div id="sac-root" style={{ display: "flex", height: "100vh", overflow: "hidden", background: C.bg }}>
      {showShell && <Sidebar />}
      {showShell && navOpen && <div className="sac-scrim" onClick={() => setNavOpen(false)} />}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {showShell && <Topbar />}
        <div id="sac-content" style={{ flex: 1, overflowY: "auto" }}>
          <ScreenComponent />
        </div>
      </div>
      <ReportModal />
      <ToastStack toasts={toasts} />
    </div>
  );
}

/**
 * Keeps the navigation layer in step with the live `users/{uid}` profile:
 * a sign-in lands on that role's home screen, an admin changing someone's role
 * moves them without a refresh, and a sign-out returns to the public site.
 * Renders nothing — it only reacts.
 */
function AuthBridge() {
  const { mode, profile } = useAuth();
  const { role, go } = useApp();
  const lastUid = useRef<string | null>(null);

  useEffect(() => {
    if (mode !== "firebase") return;

    if (!profile) {
      if (lastUid.current) {
        lastUid.current = null;
        go("landing");
      }
      return;
    }
    // New session, or the role changed underneath us.
    if (lastUid.current !== profile.uid || profile.role !== role) {
      lastUid.current = profile.uid;
      go(ROLE_HOME[profile.role], profile.role);
    }
  }, [mode, profile, role, go]);

  return null;
}

function Splash({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        height: "100vh",
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 18,
        padding: 24,
        textAlign: "center",
      }}
    >
      <LogoMark size={44} />
      {children ?? (
        <span className="mono" style={{ color: C.navMute, fontSize: 11, letterSpacing: 1.5 }}>
          SOCIAL ASSET CONNECTION
        </span>
      )}
    </div>
  );
}

function AuthGate() {
  const { loading, signedIn, profile, profilePending, signOut } = useAuth();

  // First auth check hasn't resolved — don't flash the public site at someone
  // who is already signed in.
  if (loading) return <Splash />;

  // Signed in to Firebase Auth, but no `users/{uid}` document exists. Happens if
  // sign-up was interrupted or the doc was deleted; there's no role to route on.
  if (signedIn && !profile && !profilePending) {
    return (
      <Splash>
        <div style={{ maxWidth: 380 }}>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
            Your profile isn't set up yet
          </div>
          <p style={{ color: C.navText, fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>
            Your sign-in worked, but we couldn't find your account details. Sign out and create your
            account again, or contact support if this keeps happening.
          </p>
          <Btn variant="mint" onClick={signOut} style={{ marginTop: 18, padding: "12px 22px" }}>
            Sign out
          </Btn>
        </div>
      </Splash>
    );
  }

  return (
    <>
      <AuthBridge />
      <AppFrame />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <StoreProvider>
          <AuthGate />
        </StoreProvider>
      </AppProvider>
    </AuthProvider>
  );
}
