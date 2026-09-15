import { useState, type ReactNode } from "react";
import { C } from "../theme";
import { Icon, ICON, LogoMark } from "../icons";
import { DOCS, PREF_TOGGLES, RESOURCE_CATEGORIES, STEP_LABELS } from "../data";
import { useApp, type Screen } from "../state";
import { useAuth } from "../auth";
import { useStore } from "../store";
import { Btn, Chip, IconTile, MonoTag, Placeholder, SectionLabel, TextInput, Toggle } from "../ui";

function OnboardingFrame({
  step,
  back,
  next,
  nextLabel = "Continue",
  onNext,
  nextDisabled,
  error,
  children,
}: {
  step: number;
  back: Screen;
  next?: Screen;
  nextLabel?: string;
  onNext?: () => void;
  nextDisabled?: boolean;
  error?: string | null;
  children: ReactNode;
}) {
  const { go } = useApp();
  return (
    <div
      style={{
        minHeight: "100%",
        background: C.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "24px 24px 40px",
      }}
    >
      {/* Breadcrumb: always a way back to the home screen */}
      <div style={{ width: "100%", maxWidth: 660, marginBottom: 18 }}>
        <div
          className="tlink"
          onClick={() => go("landing")}
          style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textMute, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
        >
          <Icon d={ICON.chevronLeft} size={15} color={C.textMute} strokeWidth={2} />
          Back to home
        </div>
      </div>

      <div onClick={() => go("landing")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 24 }}>
        <LogoMark size={32} bg={C.navy} fg={C.mint} />
        <span style={{ fontWeight: 800, fontSize: 18 }}>S.A.C.</span>
      </div>

      <div style={{ width: "100%", maxWidth: 660, display: "flex", gap: 10, marginBottom: 26 }}>
        {STEP_LABELS.map((label, i) => (
          <div key={label} style={{ flex: 1 }}>
            <div style={{ height: 5, borderRadius: 99, background: i <= step ? C.green : C.line }} />
            <div className="mono" style={{ fontSize: 10, letterSpacing: 1, marginTop: 7, color: i <= step ? C.ink : C.chipLine }}>
              {label}
            </div>
          </div>
        ))}
      </div>
      <div style={{ width: "100%", maxWidth: 660, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 14, padding: 30 }}>
        {children}
      </div>
      {error && (
        <div
          role="alert"
          style={{
            width: "100%",
            maxWidth: 660,
            marginTop: 14,
            padding: "11px 14px",
            background: C.redPale,
            border: `1px solid ${C.redLine}`,
            borderRadius: 10,
            fontSize: 13.5,
            fontWeight: 600,
            color: C.red,
            lineHeight: 1.45,
          }}
        >
          {error}
        </div>
      )}
      <div style={{ width: "100%", maxWidth: 660, display: "flex", justifyContent: "space-between", marginTop: 20, gap: 12 }}>
        <Btn variant="secondary" onClick={() => go(back)} style={{ padding: "12px 22px" }}>
          Back
        </Btn>
        <Btn
          onClick={onNext ?? (next ? () => go(next) : undefined)}
          disabled={nextDisabled}
          style={{ padding: "12px 26px" }}
        >
          {nextLabel}
        </Btn>
      </div>
    </div>
  );
}

export function AccountSetup() {
  const { role, go } = useApp();
  const { draft, setDraft } = useAuth();
  const isOrgRole = role === "org";
  const isDriver = role === "driver";
  const [confirm, setConfirm] = useState("");
  const [problem, setProblem] = useState<string | null>(null);

  // Validated here rather than at the end, so nobody fills in three more steps
  // before finding out their password was too short.
  const validateAndContinue = () => {
    if (!draft.displayName.trim()) return setProblem("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(draft.email.trim())) return setProblem("Enter a valid email address.");
    if (draft.password.length < 6)
      return setProblem("Choose a password of at least 6 characters.");
    if (draft.password !== confirm) return setProblem("The two passwords don't match.");
    setProblem(null);
    go("verification");
  };

  return (
    <OnboardingFrame step={0} back="roleSelect" onNext={validateAndContinue} error={problem}>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Account details</h1>
      <p style={{ color: C.textMute, fontSize: 14, marginTop: 4 }}>
        You're registering as{" "}
        <span style={{ color: C.green, fontWeight: 700 }}>
          {isDriver ? "a Volunteer Driver" : role.charAt(0).toUpperCase() + role.slice(1)}
        </span>
        .
      </p>

      {isDriver && (
        <div
          style={{
            marginTop: 16,
            padding: "14px 16px",
            background: C.bluePale,
            borderRadius: 10,
            display: "flex",
            gap: 10,
            alignItems: "flex-start",
          }}
        >
          <Icon d={ICON.info} size={18} color={C.blue} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} extra={<circle cx="12" cy="12" r="9" />} />
          <span style={{ fontSize: 13.5, color: C.blueDark, lineHeight: 1.5 }}>
            <strong>This is a volunteer role.</strong> Driver deliveries on S.A.C. are unpaid — the
            platform does not process driver payments. You choose your own capacity and hours.
          </span>
        </div>
      )}

      <div className="form-row-2" style={{ marginTop: 22 }}>
        <TextInput
          label="Full name"
          value={draft.displayName}
          onChange={(v) => setDraft({ displayName: v })}
          placeholder="Jordan Avery"
        />
        <TextInput
          label="Email"
          value={draft.email}
          onChange={(v) => setDraft({ email: v })}
          type="email"
          placeholder="you@organization.org"
        />
        <TextInput
          label="Phone"
          value={draft.phone}
          onChange={(v) => setDraft({ phone: v })}
          placeholder="(206) 555-0148"
        />
        <TextInput
          label={isOrgRole ? "Organization name" : "Organization / business name"}
          value={draft.orgName}
          onChange={(v) => setDraft({ orgName: v })}
          placeholder={isDriver ? "Optional" : "Global Grocers Inc."}
        />
        <TextInput
          label="Create password"
          value={draft.password}
          onChange={(v) => setDraft({ password: v })}
          type="password"
          placeholder="At least 6 characters"
        />
        <TextInput
          label="Confirm password"
          value={confirm}
          onChange={setConfirm}
          type="password"
          placeholder="Re-enter your password"
        />
      </div>

      {isOrgRole && (
        <div style={{ marginTop: 22, paddingTop: 22, borderTop: `1px solid ${C.lineSoft}` }}>
          <SectionLabel mb={14}>PUBLIC ORGANIZATION PROFILE</SectionLabel>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <Placeholder width={56} height={56} radius={12} size={6} />
            <Btn variant="secondary" style={{ fontSize: 13, color: C.ink, borderRadius: 8, padding: "9px 16px" }}>
              Add organization image
            </Btn>
          </div>
          <TextInput
            label="Short description"
            value={draft.orgDescription}
            onChange={(v) => setDraft({ orgDescription: v })}
            placeholder="Emergency shelter & transitional housing for families in Seattle."
            style={{ marginTop: 16 }}
          />
          <TextInput
            label="Preferred donation platform link"
            value={draft.donationUrl}
            onChange={(v) => setDraft({ donationUrl: v })}
            placeholder="https://givebutter.com/your-org"
            style={{ marginTop: 16 }}
          />
          <p style={{ fontSize: 12.5, color: C.textFaint, marginTop: 8, lineHeight: 1.5 }}>
            Donors see this in the Cash Donations tab and are linked to your site to give directly —
            S.A.C. doesn't process financial donations.
          </p>
        </div>
      )}
    </OnboardingFrame>
  );
}

export function Verification() {
  const { role } = useApp();
  const docs = DOCS[role] ?? DOCS.donor;
  return (
    <OnboardingFrame step={1} back="accountSetup" next="preferences">
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Verification</h1>
      <p style={{ color: C.textMute, fontSize: 14, marginTop: 4 }}>
        Upload documents so we can verify your eligibility. Review usually takes 1–2 business days.
      </p>
      <div style={{ marginTop: 22, display: "flex", flexDirection: "column", gap: 12 }}>
        {docs.map(([name, hint], i) => (
          <div
            key={name}
            className="card card-static"
            style={{ display: "flex", alignItems: "center", gap: 14, border: `1.5px dashed ${C.chipLine}`, borderRadius: 11, padding: 16, background: "#fff" }}
          >
            <IconTile path={ICON.file} bg={C.blueWash} color={C.blue} size={42} radius={10} iconSize={20} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
              <div style={{ fontSize: 12.5, color: C.textFaint }}>{hint}</div>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: i === 0 ? C.green : C.amber,
                background: i === 0 ? C.greenPale : C.amberPale,
                padding: "6px 12px",
                borderRadius: 999,
              }}
            >
              {i === 0 ? "Uploaded" : "Required"}
            </span>
          </div>
        ))}
      </div>
    </OnboardingFrame>
  );
}

export function Preferences() {
  const { go } = useApp();
  const { draft, setDraft } = useAuth();
  const { categories, setCategories } = useStore();
  const [selected, setSelected] = useState<string[]>(draft.categories.length ? draft.categories : categories);
  const [toggles, setToggles] = useState(PREF_TOGGLES.map((t) => t.on));

  const toggleCat = (c: string) =>
    setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  return (
    <OnboardingFrame
      step={2}
      back="verification"
      nextLabel="Continue"
      onNext={() => {
        setCategories(selected);
        setDraft({ categories: selected });
        go("reviewSummary");
      }}
    >
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Preferences &amp; visibility</h1>
      <p style={{ color: C.textMute, fontSize: 14, marginTop: 4 }}>
        Tell us what you care about so we can match you faster.
      </p>
      <div style={{ fontSize: 13, fontWeight: 700, margin: "22px 0 10px" }}>Resource categories</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {RESOURCE_CATEGORIES.map((c) => (
          <Chip key={c} active={selected.includes(c)} onClick={() => toggleCat(c)}>
            {selected.includes(c) ? `${c} ✓` : c}
          </Chip>
        ))}
      </div>
      <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 2 }}>
        {PREF_TOGGLES.map((t, i) => (
          <div
            key={t.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              borderTop: `1px solid ${C.lineSoft}`,
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>
              <div style={{ fontSize: 12.5, color: C.textFaint }}>{t.desc}</div>
            </div>
            <Toggle on={toggles[i]} onChange={(on) => setToggles((ts) => ts.map((v, j) => (j === i ? on : v)))} />
          </div>
        ))}
      </div>
    </OnboardingFrame>
  );
}

export function ReviewSummary() {
  const { role, setRole } = useApp();
  const { mode, draft, signUp, demoSignIn, error, clearError } = useAuth();
  const [busy, setBusy] = useState(false);

  const roleLabel = role === "driver" ? "Volunteer Driver" : role.charAt(0).toUpperCase() + role.slice(1);
  const rows = [
    { k: "NAME", v: draft.displayName || "—" },
    { k: "ORGANIZATION", v: draft.orgName || "—" },
    { k: "ROLE", v: roleLabel },
    { k: "EMAIL", v: draft.email || "—" },
    { k: "PHONE", v: draft.phone || "—" },
    { k: "CATEGORIES", v: draft.categories.length ? draft.categories.join(" · ") : "—" },
  ];

  // This is where the account actually gets created. In demo mode there's no
  // Firebase to talk to, so the local profile stands in.
  const enter = async () => {
    clearError();
    if (mode === "demo") {
      demoSignIn(role);
      setRole(role);
      return;
    }
    setBusy(true);
    const ok = await signUp(draft.email.trim(), draft.password, role, {
      displayName: draft.displayName.trim(),
      phone: draft.phone.trim(),
      orgName: draft.orgName.trim(),
      categories: draft.categories,
    });
    setBusy(false);
    // On success the profile snapshot arrives and AuthBridge routes us in. On
    // failure the message renders below the card and every detail is still here.
    if (!ok) return;
  };

  return (
    <OnboardingFrame
      step={3}
      back="preferences"
      nextLabel={busy ? "Creating account…" : "Enter S.A.C. →"}
      onNext={enter}
      nextDisabled={busy}
      error={error}
    >
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 13,
          background: C.greenPale,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
        }}
      >
        <Icon d={ICON.check} size={26} color={C.green} strokeWidth={2.2} />
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 800 }}>Review &amp; confirm</h1>
      <p style={{ color: C.textMute, fontSize: 14, marginTop: 4 }}>
        Here's everything we have. You can edit details anytime in Settings.
      </p>
      <div style={{ marginTop: 20, border: `1px solid ${C.lineSoft}`, borderRadius: 11, overflow: "hidden" }}>
        {rows.map((r) => (
          <div
            key={r.k}
            style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: `1px solid ${C.lineFaint}` }}
          >
            <MonoTag style={{ fontSize: 11 }}>{r.k}</MonoTag>
            <span style={{ fontSize: 14, fontWeight: 600, textAlign: "right" }}>{r.v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 18, padding: 14, background: C.amberWash, borderRadius: 10, display: "flex", gap: 10, alignItems: "flex-start" }}>
        <Icon d={ICON.warn} size={18} color={C.amber} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 13, color: C.amberInk, lineHeight: 1.5 }}>
          Your verification is pending review. You can explore the platform now — full access
          unlocks once approved.
        </span>
      </div>
    </OnboardingFrame>
  );
}
