import { C, stripeAvatar } from "./theme";
import { Icon, ICON, LogoMark } from "./icons";
import { NAV, ROLE_LABEL, ROLE_TABS } from "./data";
import { useApp } from "./state";
import { useAuth } from "./auth";
import { roleSwitcherEnabled } from "./lib/config";

export function Sidebar() {
  const { role, screen, go, navOpen } = useApp();
  const { signOut } = useAuth();

  // Ends the Firebase session (or clears the demo profile) and returns to the
  // public site. AuthBridge also sends us home once the session actually drops.
  const handleSignOut = async () => {
    await signOut();
    go("landing");
  };
  return (
    <aside
      className={`sac-sidebar${navOpen ? " open" : ""}`}
      style={{
        width: 240,
        flexShrink: 0,
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        padding: "18px 14px",
        overflowY: "auto",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 8px 22px" }}>
        <LogoMark size={34} />
        <div>
          <div style={{ color: "#fff", fontWeight: 800, fontSize: 17, letterSpacing: "-0.3px" }}>
            S.A.C.
          </div>
          <div className="mono" style={{ color: C.mint, fontSize: 9, letterSpacing: 1.5 }}>
            {ROLE_LABEL[role]}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
        {NAV[role].map((item) => {
          const active = item.screen === screen;
          const color = active ? C.ink : C.navText;
          return (
            <div
              key={item.label}
              className={`navrow${active ? " navrow-active" : ""}`}
              onClick={() => go(item.screen)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 11,
                padding: "11px 12px",
                borderRadius: 9,
                cursor: "pointer",
                background: active ? C.mint : "transparent",
              }}
            >
              <Icon d={ICON[item.icon]} size={18} color={color} strokeWidth={1.7} />
              <span style={{ fontSize: 13.5, fontWeight: active ? 700 : 500, color }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 3,
          paddingTop: 18,
          borderTop: `1px solid ${C.navyLine}`,
        }}
      >
        <div
          className="navrow"
          onClick={() => go("settings")}
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 9, cursor: "pointer" }}
        >
          <Icon d={ICON.gearFull} size={18} color={C.navText} strokeWidth={1.7} extra={<circle cx="12" cy="12" r="3" />} />
          <span style={{ fontSize: 13.5, fontWeight: 500, color: C.navText }}>Settings</span>
        </div>
        <div
          className="navrow"
          onClick={handleSignOut}
          style={{ display: "flex", alignItems: "center", gap: 11, padding: "10px 12px", borderRadius: 9, cursor: "pointer" }}
        >
          <Icon d={ICON.signOut} size={18} color={C.navText} strokeWidth={1.7} />
          <span style={{ fontSize: 13.5, fontWeight: 500, color: C.navText }}>Sign out</span>
        </div>
      </div>
    </aside>
  );
}

export function Topbar() {
  const { role, setRole, go, navOpen, setNavOpen } = useApp();
  const { mode, demoSignIn } = useAuth();

  // In demo mode "View as" also swaps the stand-in profile, so Settings and the
  // sidebar show the right person. With Firebase on, the profile is the source
  // of truth and the switcher stays a navigation-only dev tool.
  const viewAs = (r: typeof role) => {
    if (mode === "demo") demoSignIn(r);
    setRole(r);
  };
  return (
    <header
      style={{
        height: 64,
        flexShrink: 0,
        background: "#fff",
        borderBottom: `1px solid ${C.line}`,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 18px 0 14px",
      }}
    >
      <button
        className="hamburger btn"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Menu"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: 38,
          height: 38,
          borderRadius: 9,
          border: `1px solid ${C.line}`,
          background: "#fff",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.textMute} strokeWidth="2" strokeLinecap="round">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>
      <div
        className="hide-mobile"
        style={{
          flex: "1 1 0",
          minWidth: 0,
          maxWidth: 380,
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: C.searchBg,
          border: `1px solid ${C.line}`,
          borderRadius: 9,
          padding: "9px 14px",
          marginLeft: 8,
        }}
      >
        <Icon d={ICON.search} size={16} color={C.textFaint} strokeWidth={2} style={{ flexShrink: 0 }} />
        <span style={{ color: C.textFaint, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          Search resources, orders, partners…
        </span>
      </div>
      {roleSwitcherEnabled && (
        <div
          style={{
            marginLeft: "auto",
            flexShrink: 1,
            minWidth: 0,
            overflowX: "auto",
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: C.searchBg,
            border: `1px solid ${C.line}`,
            borderRadius: 999,
            padding: 4,
          }}
        >
          <span className="mono hide-mobile-inline" style={{ fontSize: 9, color: C.textFaint, letterSpacing: 1, padding: "0 8px" }}>
            VIEW AS
          </span>
          {ROLE_TABS.map((t) => {
            const active = t.role === role;
            return (
              <div
                key={t.role}
                className="chip"
                onClick={() => viewAs(t.role)}
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 11px",
                  borderRadius: 999,
                  cursor: "pointer",
                  background: active ? C.navy : "transparent",
                  color: active ? "#fff" : C.textMute,
                  whiteSpace: "nowrap",
                  border: "none",
                }}
              >
                {t.label}
              </div>
            );
          })}
        </div>
      )}
      <div
        className="btn"
        onClick={() => go("notifications")}
        style={{
          position: "relative",
          cursor: "pointer",
          width: 38,
          height: 38,
          borderRadius: 9,
          border: `1px solid ${C.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginLeft: roleSwitcherEnabled ? 0 : "auto",
          background: "#fff",
        }}
      >
        <Icon d={ICON.bell} size={18} color={C.textMute} strokeWidth={1.8} />
        <div
          style={{
            position: "absolute",
            top: 7,
            right: 8,
            width: 7,
            height: 7,
            borderRadius: 99,
            background: C.red,
            border: "1.5px solid #fff",
          }}
        />
      </div>
      <div
        className="hide-mobile"
        style={{ width: 38, height: 38, borderRadius: 99, background: stripeAvatar(5), border: `1px solid ${C.line}`, flexShrink: 0 }}
      />
    </header>
  );
}
