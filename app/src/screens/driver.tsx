import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { JOBS } from "../data";
import { useApp } from "../state";
import { useStore } from "../store";
import {
  BackLink,
  Btn,
  Card,
  IconTile,
  Modal,
  MonoTag,
  PageTitle,
  Placeholder,
  QtyStepper,
  SectionLabel,
  StatusBadge,
  Toggle,
} from "../ui";
import { REPORT_REASONS } from "../data";

/* =========================== VOLUNTEER DASHBOARD =========================== */

export function DriverDash() {
  const { go } = useApp();
  const {
    activeDeliveries,
    driverAvailable,
    setDriverAvailable,
    driverCapacity,
    setDriverCapacity,
    deliveriesCompleted,
  } = useStore();

  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <div className="page-head">
        <PageTitle
          title="Volunteer Dashboard"
          subtitle="Set your capacity and availability — we'll connect you when an order near you needs a ride."
        />
        <div style={{ display: "flex", alignItems: "center", gap: 11, background: "#fff", border: `1px solid ${C.line}`, borderRadius: 9, padding: "10px 16px" }}>
          <Toggle on={driverAvailable} onChange={setDriverAvailable} small />
          <span style={{ fontSize: 13.5, fontWeight: 700 }}>Available for deliveries</span>
        </div>
      </div>

      <Card style={{ marginTop: 20, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center", background: C.greenWash, borderColor: C.greenPale }}>
        <IconTile path={ICON.heart} bg={C.greenPale} color={C.green} size={42} radius={11} iconSize={20} />
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>Thank you for volunteering, Marcus.</div>
          <div style={{ fontSize: 13.5, color: C.textMute, marginTop: 2 }}>
            Every run you make is the difference between a donation sitting in a warehouse and
            reaching a family. This is an unpaid volunteer role — your time is the whole gift.
          </div>
        </div>
      </Card>

      {/* Community impact — no earnings anywhere in the volunteer experience */}
      <div className="g4" style={{ marginTop: 18 }}>
        <Card style={{ padding: 20 }}>
          <IconTile path={ICON.leaf} bg={C.greenPale} color={C.green} size={34} radius={9} iconSize={16} />
          <MonoTag style={{ display: "block", marginTop: 12 }}>CO₂ EMISSIONS SAVED</MonoTag>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 3 }}>1.9 t</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <IconTile path={ICON.users} bg={C.bluePale} color={C.blue} size={34} radius={9} iconSize={16} />
          <MonoTag style={{ display: "block", marginTop: 12 }}>PEOPLE SERVED</MonoTag>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 3 }}>1,480</div>
        </Card>
        <Card style={{ padding: 20 }}>
          <IconTile path={ICON.trash} bg={C.amberPale} color={C.amber} size={34} radius={9} iconSize={16} />
          <MonoTag style={{ display: "block", marginTop: 12 }}>WASTE DIVERTED</MonoTag>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 3 }}>9,240 lbs</div>
        </Card>
        <div className="card card-static" style={{ background: C.navy, borderRadius: 14, padding: 20 }}>
          <IconTile path={ICON.boxSimple} bg="rgba(108,248,187,.16)" color={C.mint} size={34} radius={9} iconSize={16} />
          <MonoTag color={C.navMute} style={{ display: "block", marginTop: 12 }}>ITEMS PROVIDED</MonoTag>
          <div style={{ fontSize: 26, fontWeight: 800, marginTop: 3, color: "#fff" }}>3,120</div>
        </div>
      </div>

      <div className="split-b" style={{ marginTop: 18 }}>
        <Card style={{ padding: 24 }} hover={false}>
          <SectionLabel>MY CAPACITY &amp; AVAILABILITY</SectionLabel>
          <div className="g2" style={{ gap: 20 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>How much can you carry?</div>
              <QtyStepper value={driverCapacity} onChange={setDriverCapacity} min={50} step={50} />
              <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>lbs, per delivery run</div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>When are you available?</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
                  9:00 AM
                </div>
                <span style={{ color: C.textFaint }}>–</span>
                <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "11px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
                  3:00 PM
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>weekdays</div>
            </div>
          </div>
          <div style={{ marginTop: 20, paddingTop: 18, borderTop: `1px solid ${C.lineSoft}` }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Item types you've delivered</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { label: "Food · 62%", color: C.green, bg: C.greenPale },
                { label: "Clothing · 21%", color: C.amber, bg: C.amberPale },
                { label: "Medical · 11%", color: C.blue, bg: C.bluePale },
                { label: "Household · 6%", color: C.purple, bg: C.purplePale },
              ].map((t) => (
                <span key={t.label} style={{ fontSize: 12.5, fontWeight: 700, color: t.color, background: t.bg, padding: "6px 12px", borderRadius: 999 }}>
                  {t.label}
                </span>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: 22 }} hover={false}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Active deliveries</div>
              <span className="tlink" onClick={() => go("activeRoute")} style={{ color: C.green, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                View all
              </span>
            </div>
            {activeDeliveries.length === 0 ? (
              <div style={{ fontSize: 13.5, color: C.textFaint, marginTop: 12 }}>
                Nothing assigned right now — check Discover Jobs for open runs.
              </div>
            ) : (
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                {activeDeliveries.slice(0, 2).map((d) => (
                  <div key={d.id} style={{ background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 10, padding: 13 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: C.textFaint, marginTop: 2 }}>
                      {d.pickup} → {d.drop}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Btn onClick={() => go("pendingJobs")} style={{ width: "100%", marginTop: 16, padding: 12 }}>
              Discover jobs
            </Btn>
          </Card>

          <Card style={{ padding: 22 }} hover={false}>
            <div style={{ fontSize: 17, fontWeight: 700 }}>Cities you serve</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
              {[
                { city: "Seattle, WA", runs: 9 },
                { city: "Tacoma, WA", runs: 5 },
                { city: "Renton, WA", runs: 3 },
                { city: "Kent, WA", runs: 2 },
              ].map((c) => (
                <div key={c.city} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Icon d={ICON.pin} size={15} color={C.green} strokeWidth={2} />
                  <span style={{ fontSize: 13.5, fontWeight: 600, flex: 1 }}>{c.city}</span>
                  <span style={{ fontSize: 12.5, color: C.textFaint, fontVariantNumeric: "tabular-nums" }}>{c.runs} runs</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.lineSoft}`, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: C.textMute }}>Deliveries completed</span>
              <span style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>{deliveriesCompleted}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* ============================== DISCOVER JOBS ============================== */

export function PendingJobs() {
  const { go } = useApp();
  const { acceptJob, driverCapacity } = useStore();
  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Discover Jobs" subtitle="Open volunteer runs near you. Accepting a job connects you with both sides." />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.ink, background: "#fff", border: `1.5px solid ${C.chipLine}`, padding: "9px 14px", borderRadius: 9 }}>
            Within 25 mi ▾
          </span>
          <span className="hide-mobile-inline" style={{ fontSize: 13, fontWeight: 600, color: C.ink, background: "#fff", border: `1.5px solid ${C.chipLine}`, padding: "9px 14px", borderRadius: 9 }}>
            Under {driverCapacity} lbs ▾
          </span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 22 }}>
        {JOBS.map((j) => (
          <Card key={j.id} style={{ overflow: "hidden", display: "flex" }} hover={false}>
            <Placeholder width={180} height="auto" radius={0} size={10} style={{ alignSelf: "stretch" }} />
            <div style={{ flex: 1, padding: "20px 22px", minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: j.catColor, background: j.catBg, padding: "4px 10px", borderRadius: 999 }}>
                    {j.cat}
                  </span>
                  <div style={{ fontSize: 19, fontWeight: 800, marginTop: 10 }}>{j.title}</div>
                  <div style={{ fontSize: 13, color: C.textFaint, marginTop: 4 }}>{j.city}</div>
                </div>
              </div>
              <div
                className="g4"
                style={{ gap: 14, marginTop: 16, padding: "14px 0", borderTop: `1px solid ${C.lineSoft}`, borderBottom: `1px solid ${C.lineSoft}` }}
              >
                {[
                  ["WEIGHT", j.weight],
                  ["SIZE", j.size],
                  ["PICKUP", j.pickup],
                  ["DROP-OFF", j.drop],
                ].map(([k, v]) => (
                  <div key={k}>
                    <MonoTag style={{ letterSpacing: 0 }}>{k}</MonoTag>
                    <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: C.textMute }}>{j.dist}</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <Btn variant="secondary" onClick={() => go("jobDetail")} style={{ fontSize: 13.5, padding: "10px 18px" }}>
                    Details
                  </Btn>
                  <Btn
                    onClick={() => {
                      acceptJob(j);
                      go("activeRoute");
                    }}
                    style={{ fontSize: 13.5, padding: "10px 22px" }}
                  >
                    Accept
                  </Btn>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function JobDetail() {
  const { go } = useApp();
  const { acceptJob } = useStore();
  const j = JOBS[0];
  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <BackLink label="Discover Jobs" onClick={() => go("pendingJobs")} />
      <div className="page-head">
        <div>
          <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: C.greenPale, padding: "4px 10px", borderRadius: 999 }}>
            Canned Goods &amp; Dry Storage
          </span>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginTop: 10 }}>{j.title}</h1>
        </div>
        <div style={{ textAlign: "right" }}>
          <MonoTag>LOAD</MonoTag>
          <div style={{ fontSize: 24, fontWeight: 800, color: C.green }}>{j.weight}</div>
        </div>
      </div>
      <div
        style={{
          marginTop: 20,
          padding: "14px 18px",
          background: C.bg,
          border: `1px solid ${C.lineSoft}`,
          borderRadius: 11,
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13.5,
          color: C.textMute,
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <span>Estimated distance</span>
        <span style={{ fontWeight: 700, color: C.ink }}>{j.dist}</span>
      </div>
      <div className="g2" style={{ marginTop: 18 }}>
        <Card style={{ padding: 20, display: "flex", gap: 14 }} hover={false}>
          <IconTile path={ICON.pin} bg={C.greenPale} color={C.green} size={38} radius={9} strokeWidth={2} />
          <div>
            <MonoTag>PICKUP</MonoTag>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>Seattle Warehouse A</div>
            <div style={{ fontSize: 13, color: C.textFaint }}>512 Market St · Dock 4</div>
          </div>
        </Card>
        <Card style={{ padding: 20, display: "flex", gap: 14 }} hover={false}>
          <IconTile path={ICON.send} bg={C.bluePale} color={C.blue} size={38} radius={9} strokeWidth={2} />
          <div>
            <MonoTag>DROP-OFF</MonoTag>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>Tacoma Community Center</div>
            <div style={{ fontSize: 13, color: C.textFaint }}>90 Pine Rd · Rear entrance</div>
          </div>
        </Card>
      </div>
      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn variant="danger" onClick={() => go("pendingJobs")} style={{ padding: "13px 22px" }}>
          Decline
        </Btn>
        <Btn
          onClick={() => {
            acceptJob(j);
            go("activeRoute");
          }}
          style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}
        >
          Accept this volunteer run
        </Btn>
      </div>
    </div>
  );
}

/* ========================== ACTIVE DELIVERIES LIST ========================== */

export function ActiveRoute() {
  const { go } = useApp();
  const { activeDeliveries, reportDelivery } = useStore();
  const [reportId, setReportId] = useState<string | null>(null);
  const [reason, setReason] = useState(0);
  const reasons = REPORT_REASONS.delivery;

  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <div className="page-head">
        <PageTitle title="Active Deliveries" subtitle="Every run you've accepted. Complete each one when it's dropped off." />
        <Btn variant="secondary" onClick={() => go("pendingJobs")}>
          Find more jobs
        </Btn>
      </div>

      {activeDeliveries.length === 0 ? (
        <Card style={{ padding: 36, textAlign: "center", marginTop: 22 }} hover={false}>
          <IconTile path={ICON.truck} bg={C.lineFaint} color={C.textFaint} size={48} radius={12} iconSize={22} />
          <div style={{ fontSize: 16, fontWeight: 700, marginTop: 14 }}>No active deliveries</div>
          <p style={{ fontSize: 13.5, color: C.textMute, marginTop: 6 }}>
            Accept a job from Discover Jobs and it'll appear here.
          </p>
          <Btn onClick={() => go("pendingJobs")} style={{ marginTop: 16 }}>
            Discover jobs
          </Btn>
        </Card>
      ) : (
        <div className="g2" style={{ marginTop: 22, gap: 18 }}>
          {activeDeliveries.map((d) => (
            <Card key={d.id} style={{ padding: 24, display: "flex", flexDirection: "column" }} hover={false}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 800 }}>{d.title}</div>
                  <div style={{ fontSize: 13, color: C.textFaint, marginTop: 3 }}>
                    {d.weight} · {d.city}
                  </div>
                </div>
                <StatusBadge tone={d.reported ? "declined" : "transit"}>
                  {d.reported ? "Issue reported" : "In Transit"}
                </StatusBadge>
              </div>

              <div style={{ marginTop: 20, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, background: C.green, border: `3px solid ${C.greenPale}` }} />
                    <div style={{ width: 2, height: 40, background: C.green }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>Picked up</div>
                    <div style={{ fontSize: 13, color: C.textFaint }}>{d.pickup}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, background: C.blue, border: `3px solid ${C.bluePale}` }} />
                    <div style={{ width: 2, height: 40, background: C.lineSoft }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>En route to drop-off</div>
                    <div style={{ fontSize: 13, color: C.textFaint }}>
                      {d.drop} · {d.dist}
                    </div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div style={{ width: 14, height: 14, borderRadius: 99, background: C.chipLine, border: `3px solid ${C.lineSoft}` }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.textFaint }}>Delivered</div>
                    <div style={{ fontSize: 13, color: C.chipLine }}>Pending your confirmation</div>
                  </div>
                </div>
              </div>

              {d.reported && (
                <div style={{ marginTop: 16, padding: "12px 14px", background: C.redPale, borderRadius: 9, fontSize: 12.5, color: C.red, lineHeight: 1.5 }}>
                  Reported: {d.reported}. Our team will reassign this delivery.
                </div>
              )}

              <div style={{ marginTop: "auto", paddingTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn variant="secondary" onClick={() => go("messages")} style={{ flex: 1, padding: 12, minWidth: 130 }}>
                  Message
                </Btn>
                <Btn
                  variant="danger"
                  onClick={() => {
                    setReportId(d.id);
                    setReason(0);
                  }}
                  style={{ padding: 12 }}
                  title="Report a problem with this delivery"
                >
                  <Icon d={ICON.flag} size={15} color={C.red} strokeWidth={2} />
                  Report
                </Btn>
                <Btn onClick={() => go("deliveryConfirm")} style={{ flex: 1, padding: 12, minWidth: 150 }}>
                  Complete Delivery
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={reportId !== null} onClose={() => setReportId(null)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <IconTile path={ICON.flag} bg={C.redPale} color={C.red} size={44} radius={11} iconSize={22} strokeWidth={1.9} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Report a delivery issue</h2>
            <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
              Tell us what went wrong. We'll notify both sides and reassign the run if needed.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 20 }}>
          {reasons.map((r, i) => {
            const sel = i === reason;
            return (
              <div
                key={r}
                className="card card-click"
                onClick={() => setReason(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  border: `1.5px solid ${sel ? C.green : C.line}`,
                  borderRadius: 10,
                  padding: "12px 14px",
                  cursor: "pointer",
                  background: sel ? C.greenWash : "#fff",
                }}
              >
                <div style={{ width: 18, height: 18, borderRadius: 99, border: `2px solid ${sel ? C.green : C.chipLine}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <div style={{ width: 8, height: 8, borderRadius: 99, background: sel ? C.green : "transparent" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: sel ? 700 : 500 }}>{r}</span>
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <Btn variant="secondary" onClick={() => setReportId(null)} style={{ flex: 1, padding: 13 }}>
            Cancel
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (reportId) reportDelivery(reportId, reasons[reason]);
              setReportId(null);
            }}
            style={{ flex: 1, padding: 13, fontWeight: 700 }}
          >
            Submit report
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

export function DeliveryConfirm() {
  const { go } = useApp();
  const { activeDeliveries, completeDelivery } = useStore();
  const d = activeDeliveries[0];
  return (
    <div className="pg" style={{ maxWidth: 640, margin: "0 auto" }}>
      <BackLink label="Active Deliveries" onClick={() => go("activeRoute")} />
      <PageTitle title="Confirm delivery" subtitle="Capture proof of delivery to close out this run." size={26} />
      <Card style={{ padding: 24, marginTop: 22 }} hover={false}>
        <SectionLabel mb={14}>PROOF OF DELIVERY</SectionLabel>
        <Placeholder height={150} radius={11} size={9} dashed label="+ TAKE PHOTO OF DROP-OFF" labelOnWhite />
        <div style={{ fontSize: 13, fontWeight: 600, margin: "18px 0 6px" }}>Received by</div>
        <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "12px 14px", fontSize: 14, color: C.textMute, background: "#fff" }}>
          M. Reyes · Site Coordinator
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 6px" }}>Signature</div>
        <div style={{ height: 80, border: `1.5px solid ${C.line}`, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", background: "#fff" }}>
          <span className="mono" style={{ fontSize: 11, color: C.chipLine }}>SIGN HERE</span>
        </div>
      </Card>
      <Btn
        onClick={() => {
          if (d) completeDelivery(d.id);
          go("driverDash");
        }}
        style={{ width: "100%", fontSize: 15, padding: 15, marginTop: 20 }}
      >
        Confirm delivery
      </Btn>
    </div>
  );
}
