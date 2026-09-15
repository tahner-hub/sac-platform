import { useMemo, useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { ADMIN_ACTIVITY, APPROVAL_QUEUE, MAP_ROLE_STYLE, MAP_USERS } from "../data";
import { useApp } from "../state";
import { useStore } from "../store";
import {
  BackLink,
  Btn,
  Card,
  Chip,
  IconTile,
  Modal,
  MonoTag,
  PageTitle,
  Placeholder,
  Progress,
  SectionLabel,
  Select,
  StatusBadge,
  TableHead,
  TextArea,
  TextInput,
} from "../ui";

const SEVERITY_TONE: Record<string, { color: string; bg: string }> = {
  High: { color: C.red, bg: C.redPale },
  Medium: { color: C.amber, bg: C.amberPale },
  Low: { color: C.blue, bg: C.bluePale },
};

/* ================================ OVERVIEW ================================ */

export function AdminOverview() {
  const { go } = useApp();
  const { needs, reportedAccounts, resolveReport } = useStore();
  const [triageSort, setTriageSort] = useState("Most reports");
  const [openAccount, setOpenAccount] = useState<string | null>(null);

  const account = reportedAccounts.find((a) => a.id === openAccount);

  // Triage ordering: reports are worked either by volume or by recency.
  const sortedAccounts = useMemo(() => {
    const copy = [...reportedAccounts];
    if (triageSort === "Most reports") return copy.sort((a, b) => b.reports - a.reports);
    if (triageSort === "Most recent") return copy.sort((a, b) => Date.parse(b.lastReport) - Date.parse(a.lastReport));
    const rank = { High: 0, Medium: 1, Low: 2 } as Record<string, number>;
    return copy.sort((a, b) => rank[a.severity] - rank[b.severity]);
  }, [reportedAccounts, triageSort]);

  const openReportCount = reportedAccounts.reduce(
    (n, a) => n + a.reasons.filter((r) => r.status === "Open").length,
    0,
  );

  // Needs sorted most → least urgent so the team can chase the critical ones.
  const urgentNeeds = useMemo(
    () =>
      [...needs].sort((a, b) => {
        if (a.urgencyRank !== b.urgencyRank) return a.urgencyRank - b.urgencyRank;
        const aGap = (a.needed - a.received) / a.needed;
        const bGap = (b.needed - b.received) / b.needed;
        return bGap - aGap;
      }),
    [needs],
  );

  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Platform Overview" subtitle="Network health across donors, organizations, individuals, and volunteer drivers." />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn variant="secondary" onClick={() => go("adminUsers")}>
            Deactivations
          </Btn>
          <Btn onClick={() => go("approvals")}>Review approvals · 7</Btn>
        </div>
      </div>

      <div className="g4" style={{ marginTop: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <MonoTag>PARTNER DONORS</MonoTag>
            <IconTile path={ICON.boxSimple} bg={C.greenPale} color={C.green} size={30} radius={8} iconSize={15} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>486</div>
          <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>+18 this wk</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <MonoTag>AVAILABLE DRIVERS</MonoTag>
            <IconTile path={ICON.truck} bg={C.purplePale} color={C.purple} size={30} radius={8} iconSize={15} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>32</div>
          <div style={{ fontSize: 12, color: C.textFaint, fontWeight: 600 }}>of 74 volunteers</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <MonoTag>PARTNER ORGS</MonoTag>
            <IconTile path={ICON.shield} bg={C.bluePale} color={C.blue} size={30} radius={8} iconSize={15} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>1,240</div>
          <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>+9.1%</div>
        </Card>
        <div className="card card-static" style={{ background: C.navy, borderRadius: 14, padding: 20 }}>
          <MonoTag color={C.navMute}>OPEN TRIAGE REPORTS</MonoTag>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: "#fff", fontVariantNumeric: "tabular-nums" }}>
            {openReportCount}
          </div>
          <div style={{ fontSize: 12, color: C.mint, fontWeight: 700 }}>Action needed</div>
        </div>
      </div>

      {/* ---------------- Triage reports ---------------- */}
      <Card style={{ marginTop: 18, overflow: "hidden" }} hover={false}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px", gap: 12, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Triage reports</div>
            <div style={{ fontSize: 13, color: C.textFaint, marginTop: 2 }}>
              Accounts with reports against them. Open one to review and resolve each report.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            {["Most reports", "Most recent", "Severity"].map((s) => (
              <Chip key={s} active={triageSort === s} onClick={() => setTriageSort(s)}>
                {s}
              </Chip>
            ))}
          </div>
        </div>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ACCOUNT", "ROLE", "CITY", "REPORTS", "SEVERITY", "ACTION"]} template="1.6fr 0.9fr 1fr 0.8fr 0.9fr 0.9fr" />
            {sortedAccounts.map((a) => {
              const open = a.reasons.filter((r) => r.status === "Open").length;
              return (
                <div
                  key={a.id}
                  className="trow"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 0.9fr 1fr 0.8fr 0.9fr 0.9fr",
                    alignItems: "center",
                    padding: "15px 22px",
                    borderBottom: `1px solid ${C.lineFaint}`,
                    gap: 10,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</div>
                    <div style={{ fontSize: 12, color: C.textFaint }}>{a.email}</div>
                  </div>
                  <span style={{ fontSize: 13.5, color: C.textMute }}>{a.role}</span>
                  <span style={{ fontSize: 13.5, color: C.textMute }}>{a.city}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                    {a.reports}
                    {open > 0 && <span style={{ color: C.red, fontSize: 12, fontWeight: 700 }}> · {open} open</span>}
                  </span>
                  <StatusBadge tone={SEVERITY_TONE[a.severity]}>{a.severity}</StatusBadge>
                  <Btn variant="secondary" onClick={() => setOpenAccount(a.id)} style={{ fontSize: 12.5, padding: "8px 12px", justifySelf: "end" }}>
                    View reports
                  </Btn>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ---------------- Map + activity ---------------- */}
      <div className="split-c" style={{ marginTop: 18 }}>
        <Card style={{ padding: 24 }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Network map</div>
          <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 2 }}>
            Every account by role and location. Hover a pin for details.
          </div>
          <div
            style={{
              position: "relative",
              height: 320,
              marginTop: 16,
              borderRadius: 12,
              background: C.blueWash,
              backgroundImage:
                "linear-gradient(rgba(42,111,219,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(42,111,219,.07) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
              border: `1px solid ${C.line}`,
              overflow: "hidden",
            }}
          >
            {MAP_USERS.map((u) => {
              const style = MAP_ROLE_STYLE[u.role];
              return (
                <div
                  key={u.name}
                  title={`${u.name} — ${style.label.slice(0, -1)} · ${u.city}`}
                  className="btn"
                  style={{
                    position: "absolute",
                    left: `${u.x}%`,
                    top: `${u.y}%`,
                    transform: "translate(-50%,-50%)",
                    width: 30,
                    height: 30,
                    borderRadius: 99,
                    background: "#fff",
                    border: `2px solid ${style.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(11,28,48,.14)",
                  }}
                >
                  <Icon d={style.icon} size={14} color={style.color} strokeWidth={2} />
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 14, flexWrap: "wrap" }}>
            {Object.entries(MAP_ROLE_STYLE).map(([k, s]) => (
              <div key={k} style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 20, height: 20, borderRadius: 99, background: "#fff", border: `2px solid ${s.color}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon d={s.icon} size={10} color={s.color} strokeWidth={2.4} />
                </span>
                <span style={{ fontSize: 12.5, color: C.textMute }}>{s.label}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 22 }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Recent activity</div>
          <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
            {ADMIN_ACTIVITY.map((a) => (
              <div key={a.text} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 9, height: 9, borderRadius: 99, background: a.dot, marginTop: 5, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.text}</div>
                  <div style={{ fontSize: 12, color: C.textFaint }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------------- Posted needs, most urgent first ---------------- */}
      <Card style={{ marginTop: 18, overflow: "hidden" }} hover={false}>
        <div style={{ padding: "20px 22px" }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Posted community requests</div>
          <div style={{ fontSize: 13, color: C.textFaint, marginTop: 2 }}>
            Sorted most urgent first, then by how far short of target they are.
          </div>
        </div>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["REQUEST", "ORGANIZATION", "CITY / STATE", "PROGRESS", "URGENCY"]} template="1.5fr 1.2fr 1fr 1.3fr 0.8fr" lastRight={false} />
            {urgentNeeds.map((n) => (
              <div
                key={n.id}
                className="trow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 1.2fr 1fr 1.3fr 0.8fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 700 }}>{n.item}</div>
                <span style={{ fontSize: 13.5, color: C.textMute }}>{n.org}</span>
                <span style={{ fontSize: 13.5, color: C.textMute }}>{n.city}</span>
                <div style={{ paddingRight: 16 }}>
                  <Progress received={n.received} needed={n.needed} unit={n.quantityType} />
                </div>
                <StatusBadge tone={{ color: n.urgencyColor, bg: n.urgencyBg }}>{n.urgency}</StatusBadge>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Report detail drawer */}
      <Modal open={openAccount !== null} onClose={() => setOpenAccount(null)} maxWidth={620}>
        {account && (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <Placeholder width={46} height={46} radius={11} size={6} />
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>{account.name}</h2>
                <p style={{ fontSize: 13.5, color: C.textMute, margin: "4px 0 0" }}>
                  {account.role} · {account.city} · {account.email}
                </p>
              </div>
              <StatusBadge tone={SEVERITY_TONE[account.severity]}>{account.severity}</StatusBadge>
            </div>
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
              {account.reasons.map((r, i) => (
                <div
                  key={`${r.reason}-${i}`}
                  style={{ border: `1px solid ${C.lineSoft}`, borderRadius: 11, padding: 14, background: r.status === "Open" ? "#fff" : C.bg }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{r.reason}</div>
                      <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 3 }}>
                        Reported by {r.by} · {r.date}
                      </div>
                    </div>
                    <StatusBadge tone={r.status === "Open" ? { color: C.red, bg: C.redPale } : { color: C.green, bg: C.greenPale }}>
                      {r.status}
                    </StatusBadge>
                  </div>
                  {r.status === "Open" && (
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <Btn variant="secondary" style={{ fontSize: 12.5, padding: "8px 12px" }}>
                        Message reporter
                      </Btn>
                      <Btn variant="softGreen" onClick={() => resolveReport(account.id, i)} style={{ fontSize: 12.5, padding: "8px 12px" }}>
                        Mark resolved
                      </Btn>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <Btn variant="secondary" onClick={() => setOpenAccount(null)} style={{ flex: 1, padding: 13 }}>
                Close
              </Btn>
              <Btn
                onClick={() => {
                  setOpenAccount(null);
                  go("adminUsers");
                }}
                style={{ flex: 1, padding: 13 }}
              >
                Manage account
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

/* ================================ APPROVALS ================================ */

export function Approvals() {
  const { go } = useApp();
  const { toast } = useStore();
  return (
    <div className="pg">
      <PageTitle title="Approvals Queue" subtitle="Verify organizations, donors, and volunteer drivers." />
      <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
        <Chip active>All · 7</Chip>
        <Chip>Organizations</Chip>
        <Chip>Donors</Chip>
        <Chip>Volunteer Drivers</Chip>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
        {APPROVAL_QUEUE.map((a) => (
          <Card key={a.name} style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Placeholder width={46} height={46} radius={11} size={6} />
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{a.name}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: a.tagColor, background: a.tagBg, padding: "3px 9px", borderRadius: 999 }}>
                  {a.type}
                </span>
              </div>
              <div style={{ fontSize: 13, color: C.textFaint, marginTop: 3 }}>{a.detail}</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="tlink" onClick={() => go("organizationVerification")} style={{ fontSize: 13, fontWeight: 700, color: C.green, cursor: "pointer" }}>
                Review docs
              </span>
              <Btn variant="danger" onClick={() => toast(`${a.name} rejected — applicant will be notified.`)} style={{ fontSize: 13, borderRadius: 8, padding: "9px 14px" }}>
                Reject
              </Btn>
              <Btn onClick={() => toast(`${a.name} approved — access granted.`)} style={{ fontSize: 13, borderRadius: 8, padding: "9px 16px" }}>
                Approve
              </Btn>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function OrganizationVerification() {
  const { go } = useApp();
  const { toast } = useStore();
  return (
    <div className="pg" style={{ maxWidth: 900 }}>
      <BackLink label="Approvals Queue" onClick={() => go("approvals")} />
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Placeholder width={54} height={54} radius={13} size={6} />
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800 }}>Sunshine Rescue Mission</h1>
          <div style={{ fontSize: 13.5, color: C.textFaint }}>Nonprofit · Applied Mar 11, 2026</div>
        </div>
      </div>
      <Card style={{ padding: 24, marginTop: 22 }} hover={false}>
        <SectionLabel mb={16}>SUBMITTED DOCUMENTS</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            ["501(c)(3) determination letter", "verified-letter.pdf · 240 KB"],
            ["EIN confirmation", "ein-doc.pdf · 88 KB"],
          ].map(([name, meta]) => (
            <div key={name} className="card card-static" style={{ display: "flex", alignItems: "center", gap: 14, border: `1px solid ${C.lineSoft}`, borderRadius: 11, padding: 14 }}>
              <IconTile path={ICON.file} bg={C.blueWash} color={C.blue} size={40} radius={9} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 12.5, color: C.textFaint }}>{meta}</div>
              </div>
              <span className="tlink" style={{ fontSize: 13, fontWeight: 700, color: C.green, cursor: "pointer" }}>
                View
              </span>
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn
          variant="danger"
          onClick={() => {
            toast("Application rejected — applicant notified.");
            go("approvals");
          }}
          style={{ padding: "13px 22px" }}
        >
          Reject application
        </Btn>
        <Btn
          onClick={() => {
            toast("Sunshine Rescue Mission approved.");
            go("approvals");
          }}
          style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}
        >
          Approve organization
        </Btn>
      </div>
    </div>
  );
}

/* =========================== USERS / DEACTIVATIONS =========================== */

export function AdminUsers() {
  const { go } = useApp();
  const { reportedAccounts, toast } = useStore();
  const [query, setQuery] = useState("");
  const [manageId, setManageId] = useState<string | null>(null);
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [reason, setReason] = useState("Repeated policy violations");
  const [note, setNote] = useState("");

  const manage = reportedAccounts.find((a) => a.id === manageId);
  const deactivate = reportedAccounts.find((a) => a.id === deactivateId);

  const rows = reportedAccounts.filter(
    (a) => a.name.toLowerCase().includes(query.toLowerCase()) || a.email.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="pg">
      <PageTitle
        title="User Management &amp; Deactivations"
        subtitle="Review reported accounts, contact members, and deactivate when necessary."
      />

      <Card style={{ marginTop: 20, padding: "14px 18px", background: C.blueWash, borderColor: "#CFE0FA" }} hover={false}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon d={ICON.info} size={17} color={C.blue} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} extra={<circle cx="12" cy="12" r="9" />} />
          <span style={{ fontSize: 13, color: C.blueDark, lineHeight: 1.5 }}>
            Password resets are self-service — members use <strong>Forgot password</strong> on the
            sign-in screen and receive a reset link by email. You only need to change an email
            address here if someone has lost access to their inbox.
          </span>
        </div>
      </Card>

      <div style={{ marginTop: 18, maxWidth: 360 }}>
        <TextInput label="" value={query} onChange={setQuery} placeholder="Search by name or email…" />
      </div>

      <Card style={{ overflow: "hidden", marginTop: 16 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ACCOUNT", "ROLE", "CITY", "REPORTS", "LAST REPORT", "ACTIONS"]} template="1.5fr 0.8fr 0.9fr 0.7fr 1fr 1.4fr" />
            {rows.map((a) => (
              <div
                key={a.id}
                className="trow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.5fr 0.8fr 0.9fr 0.7fr 1fr 1.4fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: C.textFaint }}>{a.email}</div>
                </div>
                <span style={{ fontSize: 13.5, color: C.textMute }}>{a.role}</span>
                <span style={{ fontSize: 13.5, color: C.textMute }}>{a.city}</span>
                <span
                  className="tlink"
                  onClick={() => go("adminOverview")}
                  title="View report details on the Overview triage table"
                  style={{ fontSize: 14, fontWeight: 700, color: a.reports > 2 ? C.red : C.ink, cursor: "pointer", fontVariantNumeric: "tabular-nums" }}
                >
                  {a.reports}
                </span>
                <span style={{ fontSize: 13.5, color: C.textMute }}>{a.lastReport}</span>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Btn variant="secondary" onClick={() => go("messages")} style={{ fontSize: 12.5, padding: "8px 12px" }}>
                    Message
                  </Btn>
                  <Btn
                    variant="secondary"
                    onClick={() => {
                      setManageId(a.id);
                      setNewEmail(a.email);
                    }}
                    style={{ fontSize: 12.5, padding: "8px 12px" }}
                  >
                    Account
                  </Btn>
                  <Btn variant="danger" onClick={() => setDeactivateId(a.id)} style={{ fontSize: 12.5, padding: "8px 12px" }}>
                    Deactivate
                  </Btn>
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div style={{ padding: "26px 22px", fontSize: 14, color: C.textFaint }}>No accounts match that search.</div>
            )}
          </div>
        </div>
      </Card>

      {/* Account maintenance */}
      <Modal open={manageId !== null} onClose={() => setManageId(null)}>
        {manage && (
          <>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Manage {manage.name}</h2>
            <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
              Update the account's email if they've lost inbox access, or send them a password reset
              link.
            </p>
            <TextInput label="Email address" value={newEmail} onChange={setNewEmail} type="email" style={{ marginTop: 20 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 18, flexWrap: "wrap" }}>
              <Btn
                variant="secondary"
                onClick={() => toast(`Password reset link sent to ${newEmail}.`)}
                style={{ flex: 1, padding: 12, minWidth: 160 }}
              >
                Send reset link
              </Btn>
              <Btn
                onClick={() => {
                  toast(`Email updated to ${newEmail}.`);
                  setManageId(null);
                }}
                style={{ flex: 1, padding: 12, minWidth: 160 }}
              >
                Save email
              </Btn>
            </div>
          </>
        )}
      </Modal>

      {/* Admin-side deactivation */}
      <Modal open={deactivateId !== null} onClose={() => setDeactivateId(null)}>
        {deactivate && (
          <>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <IconTile path={ICON.userX} bg={C.redPale} color={C.red} size={44} radius={11} iconSize={22} strokeWidth={1.9} />
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Deactivate {deactivate.name}?</h2>
                <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
                  Their listings are unpublished and they lose access immediately. They'll be
                  notified by email with the reason below.
                </p>
              </div>
            </div>
            <Select
              label="Reason"
              value={reason}
              options={[
                "Repeated policy violations",
                "Fraudulent activity",
                "Unfulfilled deliveries",
                "Requested by the account holder",
                "Other",
              ]}
              onChange={setReason}
              style={{ marginTop: 20 }}
            />
            <TextArea label="Internal note (optional)" value={note} onChange={setNote} style={{ marginTop: 16 }} />
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <Btn variant="secondary" onClick={() => setDeactivateId(null)} style={{ flex: 1, padding: 13 }}>
                Cancel
              </Btn>
              <Btn
                variant="danger"
                onClick={() => {
                  toast(`${deactivate.name} deactivated — ${reason.toLowerCase()}.`, "error");
                  setDeactivateId(null);
                }}
                style={{ flex: 1, padding: 13, fontWeight: 700 }}
              >
                Deactivate account
              </Btn>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
