import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON, LogoMark } from "../icons";
import { HOW_IT_WORKS_ROLES, MARKET_ITEMS, NEED_ITEMS, ROLE_CARDS } from "../data";
import { useApp, type Screen } from "../state";
import { useStore } from "../store";
import { useAuth } from "../auth";
import {
  Btn,
  Card,
  Chip,
  IconTile,
  Placeholder,
  Progress,
  SearchBox,
  SectionHead,
  TextInput,
} from "../ui";

type PublicPage = "home" | "how" | "partners" | "impact" | "browse";

const PUBLIC_LINKS: { key: PublicPage; label: string; screen: Screen }[] = [
  { key: "home", label: "Home", screen: "landing" },
  { key: "how", label: "How it Works", screen: "howItWorks" },
  { key: "browse", label: "Browse", screen: "publicBrowse" },
  { key: "partners", label: "Partners", screen: "partners" },
  { key: "impact", label: "Impact", screen: "publicImpact" },
];

function PublicHeader({ page }: { page: PublicPage }) {
  const { go, publicNavOpen, setPublicNavOpen } = useApp();
  return (
    <header style={{ background: C.navy, position: "relative", zIndex: 30 }}>
      <div className="hd-pad" style={{ display: "flex", alignItems: "center", gap: 28 }}>
        <div
          onClick={() => go("landing")}
          style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
        >
          <LogoMark size={32} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>S.A.C.</span>
        </div>
        <nav className="public-nav" style={{ display: "flex", gap: 26, marginLeft: 14 }}>
          {PUBLIC_LINKS.map((l) => (
            <span
              key={l.key}
              className="tlink"
              onClick={() => go(l.screen)}
              style={{
                color: page === l.key ? "#fff" : C.navText,
                fontSize: 14,
                fontWeight: page === l.key ? 600 : 400,
                cursor: "pointer",
              }}
            >
              {l.label}
            </span>
          ))}
        </nav>
        <div className="public-cta" style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <span
            className="tlink"
            onClick={() => go("signIn")}
            style={{ color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Sign In
          </span>
          <Btn variant="mint" onClick={() => go("roleSelect")} style={{ padding: "10px 18px" }}>
            Get Started
          </Btn>
        </div>
        {/* Collapses to a hamburger whenever the nav can't fit */}
        <button
          className="public-burger btn"
          aria-label="Menu"
          aria-expanded={publicNavOpen}
          onClick={() => setPublicNavOpen(!publicNavOpen)}
          style={{
            marginLeft: "auto",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 9,
            border: `1px solid ${C.navyLine}`,
            background: "transparent",
            cursor: "pointer",
            flexShrink: 0,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
            {publicNavOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>
      {publicNavOpen && (
        <div
          style={{
            borderTop: `1px solid ${C.navyLine}`,
            padding: "12px 20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            background: C.navy,
          }}
        >
          {PUBLIC_LINKS.map((l) => (
            <div
              key={l.key}
              className="navrow"
              onClick={() => go(l.screen)}
              style={{
                padding: "12px 10px",
                borderRadius: 9,
                color: page === l.key ? "#fff" : C.navText,
                fontSize: 15,
                fontWeight: page === l.key ? 700 : 500,
                cursor: "pointer",
              }}
            >
              {l.label}
            </div>
          ))}
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            <Btn variant="ghost" onClick={() => go("signIn")} style={{ flex: 1, padding: "12px 16px" }}>
              Sign In
            </Btn>
            <Btn variant="mint" onClick={() => go("roleSelect")} style={{ flex: 1, padding: "12px 16px" }}>
              Get Started
            </Btn>
          </div>
        </div>
      )}
    </header>
  );
}

function PublicFooter() {
  const { go } = useApp();
  const col = (title: string, links: { label: string; screen?: Screen }[]) => (
    <div>
      <div className="mono" style={{ fontSize: 10, letterSpacing: 1.5, color: C.textFaint, marginBottom: 12 }}>
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {links.map((l) => (
          <span
            key={l.label}
            className={l.screen ? "tlink" : undefined}
            onClick={l.screen ? () => go(l.screen!) : undefined}
            style={{ fontSize: 13.5, color: C.textMute, cursor: l.screen ? "pointer" : "default" }}
          >
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
  return (
    <footer style={{ background: C.blueWash, borderTop: `1px solid ${C.line}` }}>
      <div className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 44, paddingBottom: 32 }}>
        <div className="g4" style={{ gap: 32, alignItems: "flex-start" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <LogoMark size={30} radius={8} bg={C.navy} fg={C.mint} />
              <span style={{ fontWeight: 800, fontSize: 17 }}>S.A.C.</span>
            </div>
            <p style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.55, marginTop: 12, maxWidth: 240 }}>
              Building the standard for ethical resource redistribution.
            </p>
          </div>
          {col("PLATFORM", [
            { label: "Browse marketplace", screen: "publicBrowse" },
            { label: "How it works", screen: "howItWorks" },
            { label: "Community requests", screen: "publicBrowse" },
          ])}
          {col("COMPANY", [
            { label: "Partners", screen: "partners" },
            { label: "Impact", screen: "publicImpact" },
            { label: "Mission", screen: "howItWorks" },
          ])}
          {/* TODO(owner): legal pages need real copy — terms, privacy, and a
              Good Samaritan / food-donation liability notice for donated goods. */}
          {col("LEGAL", [
            { label: "Terms of service" },
            { label: "Privacy policy" },
            { label: "Donation liability" },
          ])}
        </div>
        <div
          style={{
            marginTop: 32,
            paddingTop: 20,
            borderTop: `1px solid ${C.line}`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <span className="mono" style={{ color: C.textFaint, fontSize: 11 }}>
            © 2026 SOCIAL ASSET CONNECTION
          </span>
          <span className="mono" style={{ color: C.textFaint, fontSize: 11 }}>
            SEATTLE, WA
          </span>
        </div>
      </div>
    </footer>
  );
}

function StepCards() {
  const steps = [
    {
      n: "01 — LIST",
      title: "Donors list surplus",
      body: "Businesses post available inventory — food, clothing, medical, furniture — with weight in lbs, condition, and a pickup or drop-off window.",
    },
    {
      n: "02 — RESERVE",
      title: "Organizations reserve",
      body: "Approved nonprofits get priority access and post the specific items they need. Remaining stock opens to individuals so nothing usable goes to waste.",
    },
    {
      n: "03 — DELIVER",
      title: "Volunteers complete delivery",
      body: "Volunteer drivers accept jobs, coordinate pickup and drop-off directly with both sides, and confirm delivery when it's done.",
    },
  ];
  return (
    <div className="g3" style={{ gap: 18 }}>
      {steps.map((s) => (
        <Card key={s.n} style={{ padding: 26 }}>
          <div className="mono" style={{ fontSize: 11, letterSpacing: 1.5, color: C.green }}>
            {s.n}
          </div>
          <div style={{ fontSize: 19, fontWeight: 700, marginTop: 12 }}>{s.title}</div>
          <p style={{ fontSize: 14, color: C.textMute, lineHeight: 1.55, marginTop: 8 }}>{s.body}</p>
        </Card>
      ))}
    </div>
  );
}

export function Landing() {
  const { go } = useApp();
  return (
    <div style={{ background: C.bg }}>
      <PublicHeader page="home" />

      <section className="hero psec" style={{ background: C.navy }}>
        <div style={{ flex: 1 }}>
          <span
            className="mono"
            style={{
              display: "inline-block",
              fontSize: 11,
              letterSpacing: 1.5,
              color: C.mint,
              background: "rgba(108,248,187,.12)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            RESOURCE REDISTRIBUTION NETWORK
          </span>
          <h1
            className="hero-title"
            style={{ color: "#fff", fontSize: 52, lineHeight: 1.05, fontWeight: 800, letterSpacing: "-1.5px", margin: "22px 0 0" }}
          >
            Move surplus to
            <br />
            where it's needed.
          </h1>
          <p style={{ color: C.navText, fontSize: 17, lineHeight: 1.6, maxWidth: 480, margin: "20px 0 0" }}>
            S.A.C. connects businesses with surplus goods to the nonprofits, communities, and people
            who need them — coordinated end-to-end with volunteer logistics.
          </p>
          <div style={{ display: "flex", gap: 14, marginTop: 30, flexWrap: "wrap" }}>
            <Btn variant="mint" onClick={() => go("roleSelect")} style={{ fontSize: 15, borderRadius: 10, padding: "14px 26px" }}>
              Get Started
            </Btn>
            <Btn variant="ghost" onClick={() => go("publicBrowse")} style={{ fontSize: 15, fontWeight: 600, borderRadius: 10, padding: "14px 26px" }}>
              Browse Marketplace
            </Btn>
          </div>
          <div className="hero-stats" style={{ display: "flex", gap: 36, marginTop: 38 }}>
            {[
              ["12.8M", "LIVES IMPACTED"],
              ["42.5k", "TONS DIVERTED"],
              ["1,240", "PARTNERS"],
            ].map(([v, l]) => (
              <div key={l}>
                <div style={{ color: "#fff", fontSize: 26, fontWeight: 800 }}>{v}</div>
                <div className="mono" style={{ color: C.navMute, fontSize: 11, letterSpacing: 1 }}>
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="hero-art"
          style={{
            width: 460,
            height: 360,
            borderRadius: 16,
            background: C.navyDeep,
            backgroundImage:
              "linear-gradient(rgba(108,248,187,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(108,248,187,.07) 1px,transparent 1px)",
            backgroundSize: "26px 26px",
            border: `1px solid ${C.navyLine}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            className="mono"
            style={{ fontSize: 11, letterSpacing: 1, color: C.mint, border: "1px solid rgba(108,248,187,.4)", padding: "6px 12px", borderRadius: 6 }}
          >
            HERO IMAGE — network / warehouse
          </span>
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          title="How do you want to contribute?"
          sub="Choose your path to make a tangible difference in resource redistribution."
          size={32}
        />
        <div className="g4" style={{ gap: 18, marginTop: 36 }}>
          {ROLE_CARDS.map((c) => (
            <Card key={c.key} style={{ padding: 24, display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(11,28,48,.05)" }}>
              <IconTile path={c.iconPath} bg={c.iconBg} color={c.iconColor} size={46} radius={11} iconSize={22} />
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 16 }}>{c.title}</div>
              <div style={{ fontSize: 14, color: C.textMute, lineHeight: 1.5, marginTop: 8, flex: 1 }}>{c.desc}</div>
              {c.note && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.blueDark,
                    background: C.bluePale,
                    borderRadius: 8,
                    padding: "8px 10px",
                    marginTop: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {c.note}
                </div>
              )}
              <Btn
                variant={c.primary ? "primary" : "secondary"}
                onClick={() => go("accountSetup", c.key)}
                style={{ padding: 11, marginTop: 18, fontWeight: 700, color: c.primary ? "#fff" : C.green }}
              >
                {c.cta}
              </Btn>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ background: C.blueWash }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHead title="How the network runs" sub="Three steps, four roles, one coordinated loop." style={{ marginBottom: 30 }} />
          <StepCards />
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

export function HowItWorks() {
  const { go } = useApp();
  return (
    <div style={{ background: C.bg }}>
      <PublicHeader page="how" />

      <section className="psec" style={{ background: C.navy }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <span
            className="mono"
            style={{
              display: "inline-block",
              fontSize: 11,
              letterSpacing: 1.5,
              color: C.mint,
              background: "rgba(108,248,187,.12)",
              padding: "6px 12px",
              borderRadius: 999,
            }}
          >
            HOW IT WORKS
          </span>
          <h1
            className="hero-title"
            style={{ color: "#fff", fontSize: 44, lineHeight: 1.1, fontWeight: 800, letterSpacing: "-1px", margin: "20px 0 0", maxWidth: 680 }}
          >
            One network, four roles, one goal: nothing usable goes to waste.
          </h1>
          <p style={{ color: C.navText, fontSize: 17, lineHeight: 1.6, maxWidth: 620, marginTop: 18 }}>
            Businesses list surplus, organizations reserve what their communities need, volunteer
            drivers move it, and individuals can pick up what's left over — all coordinated in one
            place.
          </p>
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: 24 }}>
        <StepCards />
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 32 }}>
        <SectionHead
          title="The steps, by role"
          sub="Every role gets its own dashboard, messaging, and workflow — here's what each looks like day to day."
        />
        <div className="g4" style={{ gap: 18, marginTop: 36 }}>
          {HOW_IT_WORKS_ROLES.map((rl) => (
            <Card key={rl.key} style={{ padding: 24, display: "flex", flexDirection: "column" }}>
              <IconTile path={rl.iconPath} bg={rl.iconBg} color={rl.iconColor} size={46} radius={11} iconSize={22} />
              <div style={{ fontSize: 17, fontWeight: 700, marginTop: 16 }}>{rl.title}</div>
              <div style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.5, marginTop: 6 }}>{rl.tagline}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18, flex: 1 }}>
                {rl.steps.map((text, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <div
                      className="mono"
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 6,
                        background: C.lineFaint,
                        color: C.textMute,
                        fontSize: 10,
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ fontSize: 13.5, color: C.ink, lineHeight: 1.45 }}>{text}</div>
                  </div>
                ))}
              </div>
              <Btn
                variant={rl.primary ? "primary" : "secondary"}
                onClick={() => go("accountSetup", rl.key)}
                style={{ fontSize: 13.5, padding: 11, marginTop: 20, fontWeight: 700, color: rl.primary ? "#fff" : C.green }}
              >
                {rl.cta}
              </Btn>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ background: C.blueWash }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <SectionHead title="Built to keep everyone connected" size={28} />
          <div className="g3" style={{ gap: 18, marginTop: 28 }}>
            {[
              {
                icon: ICON.users,
                bg: C.bluePale,
                color: C.blue,
                title: "Direct messaging",
                body: "Donors, organizations, volunteer drivers, and individuals message their counterparts directly to confirm handoff times, quantities, and details.",
              },
              {
                icon: ICON.clock,
                bg: C.greenPale,
                color: C.green,
                title: "Simple status tracking",
                body: "Every donation and delivery shows a clear status — pending pickup, pending drop-off, in transit, delivered — with distance and timing.",
              },
              {
                icon: ICON.search,
                bg: C.amberPale,
                color: C.amber,
                title: "Community requests",
                body: "Organizations post exactly what they're short on; donors and individuals browse those requests and give directly toward them.",
              },
            ].map((f) => (
              <Card key={f.title} style={{ padding: 26 }}>
                <IconTile path={f.icon} bg={f.bg} color={f.color} size={38} radius={10} iconSize={18} />
                <div style={{ fontSize: 17, fontWeight: 700, marginTop: 14 }}>{f.title}</div>
                <p style={{ fontSize: 14, color: C.textMute, lineHeight: 1.55, marginTop: 8 }}>{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead title="Ready to move something forward?" sub="Pick a role and get started — you can add more roles to your account later." />
        <div style={{ display: "flex", gap: 14, marginTop: 24, flexWrap: "wrap" }}>
          <Btn onClick={() => go("roleSelect")} style={{ fontSize: 15, borderRadius: 10, padding: "14px 26px" }}>
            Get Started
          </Btn>
          <Btn variant="secondary" onClick={() => go("publicBrowse")} style={{ fontSize: 15, borderRadius: 10, padding: "14px 26px" }}>
            Browse Marketplace
          </Btn>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

/* ============================== PARTNERS ============================== */

export function Partners() {
  const { go } = useApp();
  const stakeholders = [
    {
      title: "Corporate Donors",
      icon: ICON.box,
      bg: C.greenPale,
      color: C.green,
      body: "Turn operational waste into social capital with automated ESG reporting and direct impact tracking.",
      points: ["Detailed ESG reporting & analytics", "Automated tax deduction documentation", "Brand reputation & community engagement"],
      dark: false,
    },
    {
      title: "Member Organizations",
      icon: ICON.shield,
      bg: C.greenPale,
      color: C.green,
      body: "Focus on your mission while we handle the logistics of getting resources to your doorstep.",
      points: ["Priority access to incoming resources", "Zero-cost logistics management", "Post exactly what your community needs"],
      dark: false,
    },
    {
      title: "Volunteer Network",
      icon: ICON.truck,
      bg: "rgba(108,248,187,.16)",
      color: C.mint,
      body: "Community drivers close the last mile — the part that usually stops a donation from happening.",
      points: ["Flexible, self-set availability", "Clear pickup and drop-off details", "Real community impact per run"],
      dark: true,
    },
    {
      title: "Community Supporters",
      icon: ICON.heart,
      bg: C.amberPale,
      color: C.amber,
      body: "Individuals making local contributions with full transparency on where every asset goes.",
      points: ["Give toward specific local requests", "Transparent, itemized tracking", "Affordable access to surplus goods"],
      dark: false,
    },
  ];

  return (
    <div style={{ background: C.bg }}>
      <PublicHeader page="partners" />

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="split-b" style={{ alignItems: "center" }}>
          <div>
            <span
              className="mono"
              style={{
                display: "inline-block",
                fontSize: 11,
                letterSpacing: 1.5,
                color: C.green,
                background: C.greenPale,
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              THE S.A.C. ECOSYSTEM
            </span>
            <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1.1, marginTop: 20, textWrap: "balance" }}>
              Empowering impact
              <br />
              <span style={{ color: C.green }}>through partnership</span>
            </h1>
            <p style={{ color: C.textMute, fontSize: 16, lineHeight: 1.6, maxWidth: 480, marginTop: 16 }}>
              S.A.C. bridges the gap between surplus resources and urgent community needs. Our
              network turns logistical challenges into life-changing opportunities through a single,
              coordinated platform.
            </p>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              <Btn onClick={() => go("roleSelect")} style={{ fontSize: 15, padding: "14px 24px", borderRadius: 10 }}>
                Become a Partner
              </Btn>
              <Btn variant="secondary" onClick={() => go("publicImpact")} style={{ fontSize: 15, padding: "14px 24px", borderRadius: 10 }}>
                View Network Stats
              </Btn>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <Placeholder height={300} radius={16} size={12} label="IMAGE — partners at a distribution hub" labelOnWhite />
            <Card
              hover={false}
              style={{
                position: "absolute",
                left: -12,
                bottom: -22,
                padding: "16px 20px",
                boxShadow: "0 12px 32px rgba(11,28,48,.14)",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              <IconTile path={ICON.users} bg={C.greenPale} color={C.green} size={38} radius={10} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.green, lineHeight: 1 }}>4.2k+</div>
                <div style={{ fontSize: 12, color: C.textMute, marginTop: 4 }}>Active organizations connected</div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 24 }}>
        <SectionHead
          title="A solution for every stakeholder"
          sub="We've built specialized tools and reporting frameworks for every role in the resource redistribution lifecycle."
        />
        <div className="g2" style={{ gap: 18, marginTop: 32 }}>
          {stakeholders.map((s) => (
            <Card
              key={s.title}
              style={{
                padding: 26,
                background: s.dark ? C.navy : "#fff",
                border: s.dark ? "none" : `1px solid ${C.line}`,
              }}
            >
              <IconTile path={s.icon} bg={s.bg} color={s.color} size={40} radius={10} iconSize={19} />
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 14, color: s.dark ? "#fff" : C.ink }}>
                {s.title}
              </div>
              <p style={{ fontSize: 14, color: s.dark ? C.navText : C.textMute, lineHeight: 1.55, marginTop: 8 }}>
                {s.body}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                {s.points.map((p) => (
                  <div key={p} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <Icon d={ICON.check} size={16} color={s.dark ? C.mint : C.green} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ fontSize: 13.5, color: s.dark ? "#DCE7F2" : C.ink, lineHeight: 1.45 }}>{p}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 0 }}>
        <SectionHead title="Trusted by organizations across the region" size={24} />
        {/* TODO(owner): swap these for real partner logos once agreements are signed. */}
        <div className="g4" style={{ gap: 16, marginTop: 24 }}>
          {["Food Banks Intl.", "City Shelter", "Youth Rise", "Harvest Co-op"].map((n) => (
            <Card key={n} style={{ padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <Placeholder width={40} height={40} radius={9} size={6} />
              <span style={{ fontSize: 14, fontWeight: 700 }}>{n}</span>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 8 }}>
        <div style={{ background: C.green, borderRadius: 18, padding: "44px 40px" }}>
          <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 800, letterSpacing: "-0.5px", textWrap: "balance" }}>
            Ready to make a tangible difference?
          </h2>
          <p style={{ color: "#CFEFE0", fontSize: 16, marginTop: 10, maxWidth: 560, lineHeight: 1.55 }}>
            Join the S.A.C. network today and start transforming unused assets into community
            lifelines.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
            <Btn variant="mint" onClick={() => go("roleSelect")} style={{ fontSize: 15, padding: "14px 24px", borderRadius: 10, background: "#fff" }}>
              Register Your Organization
            </Btn>
            <Btn
              onClick={() => go("signIn")}
              style={{ fontSize: 15, padding: "14px 24px", borderRadius: 10, background: C.navy, color: "#fff" }}
            >
              Contact the Team
            </Btn>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

/* ============================ PUBLIC IMPACT ============================ */

export function PublicImpact() {
  const { go } = useApp();
  const stats = [
    { v: "1.2M", k: "ITEMS REDISTRIBUTED" },
    { v: "500+", k: "ACTIVE PARTNERS" },
    { v: "$14M", k: "ASSETS REDISTRIBUTED" },
    { v: "42", k: "REGIONS COVERED" },
  ];
  return (
    <div style={{ background: C.bg }}>
      <PublicHeader page="impact" />

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto" }}>
        <SectionHead
          title="Driving collective impact"
          sub="Connecting corporate resources with nonprofit needs to build more resilient communities through logistics and operational hope."
          size={34}
        />
        <div className="g4" style={{ gap: 16, marginTop: 32 }}>
          {stats.map((s) => (
            <Card key={s.k} style={{ padding: 24, textAlign: "left" }}>
              <div style={{ fontSize: 34, fontWeight: 800, color: C.green, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>
                {s.v}
              </div>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1.2, color: C.textFaint, marginTop: 8 }}>
                {s.k}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 0 }}>
        <div style={{ position: "relative" }}>
          <Placeholder height={320} radius={16} size={14} />
          <Card
            hover={false}
            style={{
              position: "absolute",
              left: "6%",
              top: "50%",
              transform: "translateY(-50%)",
              padding: 22,
              maxWidth: 320,
              boxShadow: "0 14px 40px rgba(11,28,48,.18)",
            }}
          >
            <div style={{ fontSize: 18, fontWeight: 800 }}>Network hubs</div>
            <p style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.5, marginTop: 8 }}>
              Live visualization of asset transfers between 2,400+ logistics nodes across the
              region.
            </p>
            <Btn onClick={() => go("roleSelect")} style={{ marginTop: 14, fontSize: 13.5, padding: "10px 18px" }}>
              Explore the map
            </Btn>
          </Card>
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 0 }}>
        <SectionHead title="Impact stories" sub="What redistribution looks like on the ground." size={26} />
        <div className="g2" style={{ gap: 18, marginTop: 26 }}>
          {[
            {
              tag: "Food Security",
              tagBg: C.greenPale,
              tagColor: C.green,
              title: "Fresh food rescue",
              quote:
                "S.A.C. transformed our surplus from a liability into a lifeline for 200 families every single week.",
              by: "Local Harvest Co.",
              stat: "+45k meals",
            },
            {
              tag: "Education",
              tagBg: C.bluePale,
              tagColor: C.blue,
              title: "Closing the digital gap",
              quote:
                "Refurbished corporate tech gave our students the tools they needed to thrive in a digital-first curriculum.",
              by: "TechLink Global",
              stat: "1.2k devices",
            },
          ].map((s) => (
            <Card key={s.title} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <Placeholder height={170} radius={0} size={11} />
              <div style={{ padding: 22 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: s.tagColor, background: s.tagBg, padding: "4px 10px", borderRadius: 999 }}>
                  {s.tag}
                </span>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 12 }}>{s.title}</div>
                <p style={{ fontSize: 14, color: C.textMute, lineHeight: 1.55, marginTop: 8, fontStyle: "italic" }}>
                  “{s.quote}”
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: 14,
                    paddingTop: 14,
                    borderTop: `1px solid ${C.lineSoft}`,
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.textMute }}>{s.by}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.green }}>{s.stat}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingTop: 0 }}>
        <div style={{ background: C.navy, borderRadius: 18, padding: "40px 36px" }}>
          <div className="split-b" style={{ alignItems: "center", gap: 32 }}>
            <div>
              <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>
                Audit-ready reporting
              </h2>
              <p style={{ color: C.navText, fontSize: 15, lineHeight: 1.6, marginTop: 10, maxWidth: 460 }}>
                Quantify environmental and social impact with real-time dashboards and downloadable
                ESG compliance reports — built for corporate social responsibility audits.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
                <Btn variant="mint" onClick={() => go("roleSelect")} style={{ fontSize: 14, padding: "12px 20px" }}>
                  <Icon d={ICON.download} size={16} color={C.ink} strokeWidth={2} />
                  Download Annual Report
                </Btn>
                <Btn variant="ghost" onClick={() => go("roleSelect")} style={{ fontSize: 14, padding: "12px 20px" }}>
                  View ESG Dashboard
                </Btn>
              </div>
            </div>
            <Placeholder height={200} radius={12} size={10} label="DASHBOARD PREVIEW" labelOnWhite />
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}

/* =================== PUBLIC BROWSE (not signed in) =================== */

export function PublicBrowse() {
  const { requireAccount } = useApp();
  const [tab, setTab] = useState<"market" | "requests">("market");

  return (
    <div style={{ background: C.bg, minHeight: "100%" }}>
      <PublicHeader page="browse" />

      <section className="psec" style={{ maxWidth: 1280, margin: "0 auto", paddingBottom: 24 }}>
        <SectionHead
          title="What's available near you"
          sub="Browse live surplus listings and community requests in your area. Creating a free account lets you reserve, order, or donate."
          size={32}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginTop: 24,
            padding: "12px 16px",
            background: C.bluePale,
            border: `1px solid #CFE0FA`,
            borderRadius: 11,
          }}
        >
          <Icon d={ICON.info} size={17} color={C.blue} strokeWidth={2} extra={<circle cx="12" cy="12" r="9" />} />
          <span style={{ fontSize: 13.5, color: C.blueDark, lineHeight: 1.45 }}>
            You're browsing as a guest — showing results near <strong>Seattle, WA</strong>. Select
            any item to create an account and continue.
          </span>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
          <Chip active={tab === "market"} onClick={() => setTab("market")}>
            Marketplace
          </Chip>
          <Chip active={tab === "requests"} onClick={() => setTab("requests")}>
            Community Requests
          </Chip>
          <SearchBox placeholder="Search items near you…" style={{ flex: 1, minWidth: 200, marginLeft: "auto" }} />
        </div>

        {tab === "market" ? (
          <div className="g3" style={{ marginTop: 22 }}>
            {MARKET_ITEMS.filter((m) => !m.recurring).map((m) => (
              <Card key={m.id} onClick={requireAccount} style={{ overflow: "hidden", boxShadow: "0 1px 3px rgba(11,28,48,.05)" }}>
                <Placeholder
                  height={150}
                  radius={0}
                  size={10}
                  style={{ alignItems: "flex-start", justifyContent: "flex-start", padding: 12, display: "flex" }}
                >
                  <span style={{ fontSize: 11, fontWeight: 700, color: m.catColor, background: m.catBg, padding: "4px 10px", borderRadius: 999 }}>
                    {m.cat}
                  </span>
                </Placeholder>
                <div style={{ padding: 16 }}>
                  <div style={{ fontSize: 16, fontWeight: 700 }}>{m.title}</div>
                  <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, color: C.textMute }}>{m.qty}</span>
                    <span style={{ fontSize: 13, color: C.textFaint }}>· {m.dist}</span>
                    <span style={{ fontSize: 13, color: C.textFaint }}>· {m.city}</span>
                  </div>
                  <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>From {m.donor}</div>
                  <Btn onClick={requireAccount} style={{ width: "100%", fontSize: 13.5, borderRadius: 8, padding: 10, marginTop: 14 }}>
                    Create account to reserve
                  </Btn>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
            {NEED_ITEMS.map((n) => (
              <Card
                key={n.item}
                onClick={requireAccount}
                style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", flexWrap: "wrap" }}
              >
                <Placeholder width={52} height={52} radius={11} size={6} />
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: n.catColor, background: n.catBg, padding: "3px 9px", borderRadius: 999 }}>
                      {n.cat}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: n.urgencyColor, background: n.urgencyBg, padding: "3px 9px", borderRadius: 999 }}>
                      {n.urgency}
                    </span>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{n.item}</div>
                  <div style={{ fontSize: 13, color: C.textFaint, marginTop: 2 }}>
                    {n.org} · {n.city} · {n.dist}
                  </div>
                </div>
                <div style={{ width: 200 }}>
                  <Progress received={n.received} needed={n.needed} unit={n.quantityType} />
                </div>
                <Btn onClick={requireAccount} style={{ fontSize: 13, padding: "10px 16px" }}>
                  Donate
                </Btn>
              </Card>
            ))}
          </div>
        )}
      </section>

      <PublicFooter />
    </div>
  );
}

/* ============================== ROLE SELECT ============================== */

export function RoleSelect() {
  const { go } = useApp();
  return (
    <div
      style={{
        minHeight: "100%",
        background: C.navy,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "28px 24px 56px",
      }}
    >
      {/* Breadcrumb back to the home page */}
      <div style={{ width: "100%", maxWidth: 760, marginBottom: 24 }}>
        <div
          className="tlink"
          onClick={() => go("landing")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.navText, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}
        >
          <Icon d={ICON.chevronLeft} size={15} color={C.navText} strokeWidth={2} />
          Back to home
        </div>
      </div>

      <div onClick={() => go("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 32 }}>
        <LogoMark size={32} />
        <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>S.A.C.</span>
      </div>
      <h1 style={{ color: "#fff", fontSize: 34, fontWeight: 800, letterSpacing: "-0.5px", textAlign: "center" }}>
        Create your account
      </h1>
      <p style={{ color: C.navText, fontSize: 16, marginTop: 8, textAlign: "center" }}>
        Tell us how you'll use S.A.C. — you can add roles later.
      </p>
      <div className="g2" style={{ maxWidth: 760, width: "100%", marginTop: 36 }}>
        {ROLE_CARDS.map((c) => (
          <div
            key={c.key}
            className="card card-click"
            onClick={() => go("accountSetup", c.key)}
            style={{
              background: C.navyCard,
              border: `1.5px solid ${C.navyCardLine}`,
              borderRadius: 14,
              padding: 24,
              cursor: "pointer",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <IconTile path={c.iconPath} bg={c.iconBg} color={c.iconColor} size={46} radius={11} iconSize={22} />
            <div>
              <div style={{ color: "#fff", fontSize: 17, fontWeight: 700 }}>{c.title}</div>
              <div style={{ color: C.navText, fontSize: 13.5, lineHeight: 1.5, marginTop: 6 }}>{c.desc}</div>
              {c.note && (
                <div style={{ color: C.mint, fontSize: 12, fontWeight: 600, marginTop: 8, lineHeight: 1.4 }}>{c.note}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, color: C.navText, fontSize: 14 }}>
        Already have an account?{" "}
        <span className="tlink" onClick={() => go("signIn")} style={{ color: C.mint, fontWeight: 700, cursor: "pointer" }}>
          Sign In
        </span>
      </div>
    </div>
  );
}

/* ================================ SIGN IN ================================ */

export function SignIn() {
  const { go, setRole } = useApp();
  const { toast } = useStore();
  const { mode, signIn, sendPasswordReset, demoSignIn, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  // On success AuthBridge routes to the role's home screen once the profile
  // arrives, so there's nothing to navigate to here.
  const submit = async () => {
    if (!email.trim() || !password) {
      toast("Enter your email and password to sign in.", "error");
      return;
    }
    setBusy(true);
    await signIn(email.trim(), password);
    setBusy(false);
  };

  // Self-service reset: Firebase emails the link, so admins never reset by hand.
  const forgot = async () => {
    if (!email.trim()) {
      toast("Enter your email address first, then choose Forgot password.", "error");
      return;
    }
    if (await sendPasswordReset(email.trim())) {
      toast(`Password reset link sent to ${email.trim()}.`);
    }
  };

  const jumpToRole = (r: Parameters<typeof setRole>[0]) => {
    demoSignIn(r);
    setRole(r);
  };

  return (
    <div className="signin-split" style={{ minHeight: "100%", display: "flex" }}>
      <div
        className="signin-brand"
        style={{
          flex: 1,
          background: C.navy,
          padding: "56px 48px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div onClick={() => go("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <LogoMark size={32} />
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>S.A.C.</span>
        </div>
        <div className="signin-tagline">
          <h2 style={{ color: "#fff", fontSize: 30, fontWeight: 800, lineHeight: 1.2, maxWidth: 380 }}>
            Welcome back to the redistribution network.
          </h2>
          <p style={{ color: C.navText, fontSize: 15, marginTop: 14, maxWidth: 380, lineHeight: 1.6 }}>
            Every sign-in moves usable resources one step closer to the people who need them.
          </p>
        </div>
        <span className="mono" style={{ color: C.navMute, fontSize: 11 }}>
          SOCIAL ASSET CONNECTION
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: 48, background: C.bg }}>
        <div style={{ width: "100%", maxWidth: 380 }}>
          <div
            className="tlink"
            onClick={() => go("landing")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textMute, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 18 }}
          >
            <Icon d={ICON.chevronLeft} size={15} color={C.textMute} strokeWidth={2} />
            Back to home
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>Sign in</h1>
          <p style={{ color: C.textMute, fontSize: 15, marginTop: 6 }}>Enter your credentials to continue.</p>
          <TextInput
            label="Email"
            value={email}
            onChange={(v) => { clearError(); setEmail(v); }}
            placeholder="you@organization.org"
            type="email"
            style={{ marginTop: 24 }}
          />
          <TextInput
            label="Password"
            value={password}
            onChange={(v) => { clearError(); setPassword(v); }}
            placeholder="••••••••••"
            type="password"
            style={{ marginTop: 16 }}
          />
          {error && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                padding: "10px 12px",
                background: C.redPale,
                border: `1px solid ${C.redLine}`,
                borderRadius: 9,
                fontSize: 13,
                color: C.red,
                fontWeight: 600,
                lineHeight: 1.45,
              }}
            >
              {error}
            </div>
          )}
          <div style={{ textAlign: "right", marginTop: 10 }}>
            <span className="tlink" onClick={forgot} style={{ color: C.green, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Forgot password?
            </span>
          </div>
          <Btn onClick={submit} disabled={busy} style={{ width: "100%", fontSize: 15, padding: 14, marginTop: 16 }}>
            {busy ? "Signing in…" : "Sign in"}
          </Btn>
          <div style={{ textAlign: "center", marginTop: 18, color: C.textMute, fontSize: 14 }}>
            New here?{" "}
            <span className="tlink" onClick={() => go("roleSelect")} style={{ color: C.green, fontWeight: 700, cursor: "pointer" }}>
              Create an account
            </span>
          </div>
          {mode === "demo" && (
            <div style={{ marginTop: 22, padding: 14, background: C.blueWash, borderRadius: 10 }}>
              <div className="mono" style={{ fontSize: 10, letterSpacing: 1, color: C.textFaint, marginBottom: 8 }}>
                DEMO MODE — JUMP TO A ROLE
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(
                  [
                    ["donor", "Donor"],
                    ["org", "Organization"],
                    ["individual", "Individual"],
                    ["driver", "Volunteer Driver"],
                    ["admin", "Admin"],
                  ] as const
                ).map(([r, label]) => (
                  <span
                    key={r}
                    className="chip"
                    onClick={() => jumpToRole(r)}
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      background: "#fff",
                      border: `1px solid ${C.line}`,
                      borderRadius: 999,
                      padding: "5px 11px",
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
