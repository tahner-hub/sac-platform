import { useEffect, useRef, useState } from "react";
import { C, stripeAvatar } from "../theme";
import { Icon, ICON } from "../icons";
import { NOTIFICATIONS, PREF_TOGGLES, RECORDS, RESOURCE_CATEGORIES } from "../data";
import { useApp } from "../state";
import { useAuth } from "../auth";
import { useStore } from "../store";
import {
  Btn,
  Card,
  Chip,
  IconTile,
  Modal,
  PageTitle,
  Placeholder,
  SectionLabel,
  Select,
  StatusBadge,
  TableHead,
  TextArea,
  TextInput,
  Toggle,
} from "../ui";

/* ================================ MESSAGES ================================ */

export function Messages() {
  const { openReport } = useApp();
  const { threads, activeThreadId, selectThread, sendMessage } = useStore();
  const [draft, setDraft] = useState("");
  const active = threads.find((t) => t.id === activeThreadId) ?? threads[0];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [active?.msgs.length, activeThreadId]);

  const send = () => {
    sendMessage(draft);
    setDraft("");
  };

  return (
    <div className="pg">
      <PageTitle
        title="Messages"
        subtitle="Conversations are tied to a reservation, order, or delivery — messaging opens once you're matched and stays available through handoff."
      />
      <Card style={{ marginTop: 22, overflow: "hidden" }} hover={false}>
        <div className="msg-grid">
          <div style={{ borderRight: `1px solid ${C.lineSoft}`, display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "16px 18px", borderBottom: `1px solid ${C.lineSoft}`, flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.searchBg, border: `1px solid ${C.line}`, borderRadius: 9, padding: "9px 12px" }}>
                <Icon d={ICON.search} size={15} color={C.textFaint} strokeWidth={2} />
                <span style={{ color: C.textFaint, fontSize: 13 }}>Search conversations…</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              {threads.map((t) => {
                const isActive = t.id === active?.id;
                return (
                  <div
                    key={t.id}
                    className="trow"
                    onClick={() => selectThread(t.id)}
                    style={{
                      padding: "15px 18px",
                      borderBottom: `1px solid ${C.lineFaint}`,
                      cursor: "pointer",
                      background: isActive ? C.greenWash : "#fff",
                      borderLeft: `3px solid ${isActive ? C.green : "transparent"}`,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700 }}>{t.name}</span>
                      <span style={{ fontSize: 11, color: C.textFaint, flexShrink: 0 }}>{t.time}</span>
                    </div>
                    <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginTop: 2 }}>{t.ctx}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                      <span style={{ fontSize: 13, color: C.textMute, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {t.msgs[t.msgs.length - 1]?.text ?? ""}
                      </span>
                      <span style={{ width: 8, height: 8, borderRadius: 99, background: t.unread ? C.green : "transparent", flexShrink: 0, marginLeft: "auto" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div style={{ padding: "16px 22px", borderBottom: `1px solid ${C.lineSoft}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 99, background: stripeAvatar(5), flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>{active?.name}</div>
                <div style={{ fontSize: 12.5, color: C.green, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {active?.ctx}
                </div>
              </div>
              <div
                className="iconbtn"
                onClick={() => openReport("this conversation", "order")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: C.textFaint, fontSize: 12.5, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}
              >
                <Icon d={ICON.flag} size={14} color="currentColor" strokeWidth={2} />
                Report
              </div>
            </div>
            <div
              ref={scrollRef}
              style={{ flex: 1, overflowY: "auto", padding: 22, background: C.chatBg, display: "flex", flexDirection: "column", gap: 14, minHeight: 0 }}
            >
              {active?.msgs.map((m, i) => {
                const me = m.from === "me";
                return (
                  <div key={i} style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start" }}>
                    <div
                      style={{
                        maxWidth: "70%",
                        background: me ? C.green : "#fff",
                        color: me ? "#fff" : C.ink,
                        border: me ? "none" : `1px solid ${C.line}`,
                        borderRadius: 14,
                        padding: "11px 15px",
                      }}
                    >
                      <div style={{ fontSize: 14, lineHeight: 1.45 }}>{m.text}</div>
                      <div style={{ fontSize: 10.5, color: me ? C.chatTime : C.textFaint, marginTop: 5, textAlign: "right" }}>{m.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "16px 22px", borderTop: `1px solid ${C.lineSoft}`, display: "flex", gap: 10, alignItems: "center", flexShrink: 0 }}>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Write a message…"
                style={{
                  flex: 1,
                  background: C.searchBg,
                  border: `1px solid ${C.line}`,
                  borderRadius: 9,
                  padding: "11px 14px",
                  fontSize: 14,
                  color: C.ink,
                  outline: "none",
                  minWidth: 0,
                }}
              />
              <Btn onClick={send} style={{ padding: "11px 20px" }}>
                Send
              </Btn>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ================================= RECORDS ================================= */

export function Records() {
  const { openReport } = useApp();
  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Records &amp; History" subtitle="Complete history of activity on your account." />
        <Btn variant="softGreen" style={{ padding: "12px 18px" }}>
          Export CSV
        </Btn>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 22 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ID", "DESCRIPTION", "DATE", "STATUS", "WEIGHT", "REPORT"]} template="0.8fr 1.8fr 1fr 1fr 0.8fr 0.6fr" />
            {RECORDS.map((r) => (
              <div
                key={r.id}
                className="trow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "0.8fr 1.8fr 1fr 1fr 0.8fr 0.6fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                }}
              >
                <span className="mono" style={{ fontSize: 12, color: C.textFaint }}>{r.id}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{r.desc}</span>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.date}</span>
                <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                <span style={{ fontSize: 14, fontWeight: 700, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{r.value}</span>
                <span
                  className="iconbtn"
                  onClick={() => openReport(`order ${r.id}`, "order")}
                  title="Report this order"
                  role="button"
                  tabIndex={0}
                  style={{ display: "inline-flex", justifyContent: "flex-end", alignItems: "center", color: C.flagIdle, cursor: "pointer" }}
                >
                  <Icon d={ICON.flag} size={15} color="currentColor" strokeWidth={2} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function Notifications() {
  return (
    <div className="pg" style={{ maxWidth: 760 }}>
      <div className="page-head">
        <PageTitle title="Notifications" subtitle="Updates across your donations and deliveries." />
        <span className="tlink" style={{ fontSize: 13, fontWeight: 700, color: C.green, cursor: "pointer" }}>
          Mark all read
        </span>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 22 }} hover={false}>
        {NOTIFICATIONS.map((n) => (
          <div
            key={n.title}
            className="trow"
            style={{ display: "flex", gap: 14, padding: "18px 22px", borderBottom: `1px solid ${C.lineFaint}`, background: n.bg }}
          >
            <IconTile path={n.iconPath} bg={n.iconBg} color={n.iconColor} strokeWidth={1.9} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: C.textMute, marginTop: 2 }}>{n.body}</div>
            </div>
            <span style={{ fontSize: 12, color: C.textFaint, flexShrink: 0 }}>{n.time}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ================================= SETTINGS ================================= */

const DEACTIVATION_REASONS = [
  "I no longer have surplus to donate",
  "I'm moving to a different area",
  "I found the platform hard to use",
  "I'm switching to a different account",
  "Privacy or data concerns",
  "Other",
];

export function Settings() {
  const { go, role } = useApp();
  const { profile, saveProfile, signOut } = useAuth();
  const { categories, setCategories, deactivationBlockers, toast } = useStore();
  const isOrgRole = role === "org";

  const [toggles, setToggles] = useState(PREF_TOGGLES.map((t) => t.on));
  const [selected, setSelected] = useState<string[]>(categories);
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [orgName, setOrgName] = useState(profile?.orgName ?? "");
  const [savingProfile, setSavingProfile] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [reasonNote, setReasonNote] = useState("");
  const [attempted, setAttempted] = useState(false);

  // Firebase resolves the profile a moment after first paint, so seed the
  // editable fields once per user rather than overwriting live typing.
  const seededUid = useRef<string | null>(null);
  useEffect(() => {
    if (profile && seededUid.current !== profile.uid) {
      seededUid.current = profile.uid;
      setPhone(profile.phone ?? "");
      setOrgName(profile.orgName ?? "");
    }
  }, [profile]);

  const blockers = deactivationBlockers();
  const dirty = selected.join() !== categories.join();
  const contactDirty = phone !== (profile?.phone ?? "") || orgName !== (profile?.orgName ?? "");
  const toggleCat = (c: string) => setSelected((s) => (s.includes(c) ? s.filter((x) => x !== c) : [...s, c]));

  // Writes straight to `users/{uid}`; the profile listener echoes the change
  // back, so there's no local copy to keep in sync.
  const saveContact = async () => {
    setSavingProfile(true);
    const ok = await saveProfile({ phone, orgName });
    setSavingProfile(false);
    toast(ok ? "Profile updated." : "Couldn't save your profile — try again.", ok ? "ok" : "error");
  };

  const confirmDeactivate = async () => {
    setAttempted(true);
    // Obligations must be cleared, and a reason is required, before we let go.
    if (blockers.length > 0 || !reason) return;
    toast("Account deactivated. We're sorry to see you go — thank you for what you gave.");
    setDeactivateOpen(false);
    await signOut();
    go("landing");
  };

  return (
    <div className="pg" style={{ maxWidth: 860 }}>
      <PageTitle title="Settings" subtitle="Manage your profile, organization, and preferences." />

      <Card style={{ padding: 26, marginTop: 22 }} hover={false}>
        <SectionLabel>PROFILE</SectionLabel>
        <div style={{ display: "flex", gap: 18, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 64, height: 64, borderRadius: 99, background: stripeAvatar(6) }} />
          <Btn variant="secondary" style={{ fontSize: 13, color: C.ink, borderRadius: 8, padding: "9px 16px" }}>
            Change photo
          </Btn>
        </div>
        <div className="form-row-2" style={{ marginTop: 20 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Full name</div>
            <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "12px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
              {profile?.displayName || "—"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Email</div>
            <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "12px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
              {profile?.email || "—"}
            </div>
          </div>
          {/* Phone + organization are editable and visible per spec */}
          <TextInput label="Phone number" value={phone} onChange={setPhone} />
          <TextInput label="Organization / business name" value={orgName} onChange={setOrgName} />
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Btn onClick={saveContact} disabled={!contactDirty || savingProfile} style={{ padding: "11px 20px" }}>
            {savingProfile ? "Saving…" : "Save profile"}
          </Btn>
          {contactDirty && !savingProfile && (
            <Btn
              variant="secondary"
              onClick={() => { setPhone(profile?.phone ?? ""); setOrgName(profile?.orgName ?? ""); }}
              style={{ padding: "11px 18px" }}
            >
              Reset
            </Btn>
          )}
          {!contactDirty && <span style={{ fontSize: 13, color: C.textFaint }}>All changes saved.</span>}
        </div>
      </Card>

      {/* Resource categories — displayed as pills and editable */}
      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel mb={8}>RESOURCE CATEGORIES</SectionLabel>
        <p style={{ fontSize: 13.5, color: C.textMute, lineHeight: 1.5, margin: "0 0 14px" }}>
          These decide which listings and requests we surface for you.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {RESOURCE_CATEGORIES.map((c) => (
            <Chip key={c} active={selected.includes(c)} onClick={() => toggleCat(c)}>
              {selected.includes(c) ? `${c} ✓` : c}
            </Chip>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center", flexWrap: "wrap" }}>
          <Btn
            onClick={() => { setCategories(selected); void saveProfile({ categories: selected }); }}
            disabled={!dirty}
            style={{ padding: "11px 20px" }}
          >
            Save categories
          </Btn>
          {dirty && (
            <Btn variant="secondary" onClick={() => setSelected(categories)} style={{ padding: "11px 18px" }}>
              Reset
            </Btn>
          )}
          {!dirty && <span style={{ fontSize: 13, color: C.textFaint }}>All changes saved.</span>}
        </div>
      </Card>

      {isOrgRole && (
        <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
          <SectionLabel mb={14}>ORGANIZATION PROFILE &amp; CASH DONATIONS</SectionLabel>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Placeholder width={56} height={56} radius={12} size={6} />
            <Btn variant="secondary" style={{ fontSize: 13, color: C.ink, borderRadius: 8, padding: "9px 16px" }}>
              Change image
            </Btn>
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Short description</div>
          <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "12px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
            {profile?.orgProfile?.description ||
              "Emergency shelter & transitional housing for families in Seattle."}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Preferred donation platform link</div>
          <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "12px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
            {profile?.orgProfile?.donationUrl || "https://givebutter.com/thehavencenter"}
          </div>
          <p style={{ fontSize: 12.5, color: C.textFaint, marginTop: 8 }}>
            Shown to donors in the Cash Donations tab. Clicking links out to your site — S.A.C.
            never touches the funds.
          </p>
        </Card>
      )}

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel mb={6}>NOTIFICATIONS</SectionLabel>
        {PREF_TOGGLES.map((t, i) => (
          <div
            key={t.label}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderTop: `1px solid ${C.lineSoft}`, gap: 12 }}
          >
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div>
              <div style={{ fontSize: 12.5, color: C.textFaint }}>{t.desc}</div>
            </div>
            <Toggle on={toggles[i]} onChange={(on) => setToggles((ts) => ts.map((v, j) => (j === i ? on : v)))} />
          </div>
        ))}
      </Card>

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel color={C.red} mb={6}>
          DANGER ZONE
        </SectionLabel>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginTop: 8 }}>
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 14, color: C.textMute, lineHeight: 1.5 }}>
              Deactivate your account and remove all listings. You'll need to settle any open
              commitments first.
            </div>
            {blockers.length > 0 && (
              <div style={{ fontSize: 13, color: C.amberInk, marginTop: 8, fontWeight: 600 }}>
                {blockers.length} outstanding obligation{blockers.length === 1 ? "" : "s"} to clear.
              </div>
            )}
          </div>
          <Btn variant="danger" onClick={() => { setDeactivateOpen(true); setAttempted(false); }} style={{ fontSize: 13, fontWeight: 700, padding: "11px 18px" }}>
            Deactivate
          </Btn>
        </div>
      </Card>

      <Modal open={deactivateOpen} onClose={() => setDeactivateOpen(false)} maxWidth={520}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <IconTile path={ICON.warn} bg={C.redPale} color={C.red} size={44} radius={11} iconSize={22} strokeWidth={2} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Deactivate your account</h2>
            <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
              This unpublishes your listings and removes your access. It can't be undone from here.
            </p>
          </div>
        </div>

        {/* Outstanding obligations block deactivation entirely */}
        {blockers.length > 0 ? (
          <div style={{ marginTop: 20, border: `1.5px solid ${C.redLine}`, background: C.redPale, borderRadius: 11, padding: 16 }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <Icon d={ICON.warn} size={18} color={C.red} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.red }}>
                  You still have commitments on the platform
                </div>
                <p style={{ fontSize: 13, color: "#8A2020", lineHeight: 1.5, margin: "6px 0 10px" }}>
                  Other people are counting on these. Complete or cancel them, then come back to
                  deactivate.
                </p>
                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                  {blockers.map((b) => (
                    <li key={b} style={{ fontSize: 13, color: "#8A2020", lineHeight: 1.45 }}>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: 20, padding: "12px 14px", background: C.greenWash, border: `1px solid ${C.greenPale}`, borderRadius: 10, display: "flex", gap: 10, alignItems: "center" }}>
            <Icon d={ICON.check} size={17} color={C.green} strokeWidth={2.4} />
            <span style={{ fontSize: 13, color: C.greenDark }}>
              No outstanding obligations — you're clear to deactivate.
            </span>
          </div>
        )}

        <Select
          label="Why are you leaving? (required)"
          value={reason}
          options={["", ...DEACTIVATION_REASONS]}
          onChange={setReason}
          style={{ marginTop: 18 }}
        />
        {attempted && !reason && (
          <div style={{ fontSize: 12.5, color: C.red, marginTop: 6, fontWeight: 600 }}>
            Please choose a reason so we can improve.
          </div>
        )}
        <TextArea label="Anything else you'd like us to know? (optional)" value={reasonNote} onChange={setReasonNote} style={{ marginTop: 16 }} />

        {attempted && blockers.length > 0 && (
          <div style={{ fontSize: 13, color: C.red, marginTop: 14, fontWeight: 600 }}>
            Can't deactivate yet — clear the obligations listed above first.
          </div>
        )}

        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <Btn variant="secondary" onClick={() => setDeactivateOpen(false)} style={{ flex: 1, padding: 13 }}>
            Keep my account
          </Btn>
          <Btn variant="danger" onClick={confirmDeactivate} style={{ flex: 1, padding: 13, fontWeight: 700 }}>
            Deactivate
          </Btn>
        </div>
      </Modal>
    </div>
  );
}
