import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { CAT_BREAKDOWN, DIVERTED_SERIES, RESOURCE_CATEGORIES } from "../data";
import { useApp } from "../state";
import { useStore, type Donation } from "../store";
import {
  BackLink,
  Btn,
  Card,
  Chip,
  Field,
  IconTile,
  InfoIcon,
  Modal,
  MonoTag,
  PageTitle,
  Placeholder,
  QtyStepper,
  SectionLabel,
  Segmented,
  Select,
  StatusBadge,
  TableHead,
  TextInput,
  Toggle,
} from "../ui";

/* ============================== DASHBOARD ============================== */

export function DonorDash() {
  const { go } = useApp();
  const { donations, recurring } = useStore();
  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Donor Dashboard" subtitle="Overview of your organization's social asset impact." />
        <Btn onClick={() => go("createDonation")}>
          <Icon d={ICON.plus} size={16} color="#fff" strokeWidth={2.2} />
          Create Donation
        </Btn>
      </div>

      {/* Thank-you note */}
      <Card style={{ marginTop: 20, padding: "18px 22px", display: "flex", gap: 14, alignItems: "center", background: C.greenWash, borderColor: C.greenPale }}>
        <IconTile path={ICON.heart} bg={C.greenPale} color={C.green} size={42} radius={11} iconSize={20} />
        <div>
          <div style={{ fontSize: 15.5, fontWeight: 700 }}>Thank you for your generosity, Jordan.</div>
          <div style={{ fontSize: 13.5, color: C.textMute, marginTop: 2 }}>
            Your donations keep essential goods out of landfills and in the hands of neighbors who
            need them.
          </div>
        </div>
      </Card>

      <div className="g4" style={{ marginTop: 18 }}>
        <MetricCard icon={ICON.trend} bg={C.greenPale} color={C.green} delta="+12%" deltaColor={C.green} deltaBg={C.greenPale} label="TOTAL ITEMS PROVIDED" value="12,868" />
        <MetricCard icon={ICON.trash} bg={C.bluePale} color={C.blue} delta="+8.4%" deltaColor={C.blue} deltaBg={C.bluePale} label="WASTE DIVERTED (LBS)" value="152,400" />
        <MetricCard icon={ICON.dollar} bg={C.amberPale} color={C.amber} delta="+15%" deltaColor={C.amber} deltaBg={C.amberPale} label="ASSETS DONATED (USD)" value="$284,120" />
        <div style={{ background: C.navy, borderRadius: 14, padding: 22 }} className="card card-static">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <IconTile path={ICON.leaf} bg="rgba(108,248,187,.16)" color={C.mint} strokeWidth={2} />
            <div style={{ fontSize: 12, fontWeight: 700, color: C.ink, background: C.mint, padding: "3px 8px", borderRadius: 999, height: "fit-content" }}>
              +21%
            </div>
          </div>
          <div className="mono" style={{ fontSize: 11, letterSpacing: 1, color: C.navMute, marginTop: 16 }}>
            CO₂ SAVINGS
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: "#fff" }}>28.5 Tons</div>
        </div>
      </div>

      <div className="split-a" style={{ marginTop: 18 }}>
        <Card style={{ overflow: "hidden" }} hover={false}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Active Donations</div>
            <span className="tlink" onClick={() => go("activeDonations")} style={{ color: C.green, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              View All
            </span>
          </div>
          <div className="tscroll">
            <div className="tmin">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.6fr 1fr 1.2fr 0.6fr",
                  padding: "10px 22px",
                  background: C.bg,
                  borderTop: `1px solid ${C.lineSoft}`,
                  borderBottom: `1px solid ${C.lineSoft}`,
                }}
              >
                <MonoTag>ITEM</MonoTag>
                <MonoTag>STATUS</MonoTag>
                <MonoTag>RECIPIENT</MonoTag>
                <MonoTag style={{ textAlign: "right" }}>ACTION</MonoTag>
              </div>
              {donations.slice(0, 4).map((r) => (
                <div
                  key={r.id}
                  className="trow"
                  onClick={() => go("donationDetail")}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1fr 1.2fr 0.6fr",
                    alignItems: "center",
                    padding: "16px 22px",
                    borderBottom: `1px solid ${C.lineFaint}`,
                    cursor: "pointer",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Placeholder width={36} height={36} />
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</span>
                  </div>
                  <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                  <span style={{ fontSize: 14, color: C.textMute }}>{r.recipient}</span>
                  <span style={{ textAlign: "right", color: C.green, fontSize: 13, fontWeight: 700 }}>View →</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: 20 }} hover={false}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Recurring</div>
              <span className="tlink" onClick={() => go("recurringManage")} style={{ color: C.green, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Manage
              </span>
            </div>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
              {recurring.slice(0, 3).map((r) => (
                <div
                  key={r.id}
                  className="card card-click"
                  onClick={() => go("recurringManage")}
                  style={{ background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 10, padding: 13, display: "flex", gap: 11, alignItems: "center", cursor: "pointer" }}
                >
                  <IconTile path={ICON.recycle} bg={C.bluePale} color={C.blue} size={34} radius={8} iconSize={16} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 700 }}>{r.item}</div>
                    <div style={{ fontSize: 12, color: C.textFaint }}>
                      {r.cadence} · next {r.nextRun}
                    </div>
                  </div>
                  {!r.active && <StatusBadge tone={{ color: C.textFaint, bg: C.lineFaint }}>Paused</StatusBadge>}
                </div>
              ))}
              {recurring.length === 0 && (
                <div style={{ fontSize: 13.5, color: C.textFaint }}>No recurring donations scheduled.</div>
              )}
            </div>
          </Card>
          <div className="card card-static" style={{ background: C.navy, borderRadius: 14, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>Impact Trends</div>
              <span className="tlink" onClick={() => go("impact")} style={{ color: C.mint, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                Details
              </span>
            </div>
            <div style={{ fontSize: 12, color: C.navMute, marginTop: 2 }}>Monthly diverted waste</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 7, height: 80, marginTop: 18 }}>
              {DIVERTED_SERIES.slice(2).map((d, i, arr) => (
                <div
                  key={d.month}
                  className="bar"
                  title={`${d.month}: ${d.lbs.toLocaleString()} lbs`}
                  style={{
                    flex: 1,
                    background: i === arr.length - 1 ? C.mint : `rgba(108,248,187,${0.25 + i * 0.1})`,
                    borderRadius: 3,
                    height: `${d.h}%`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  bg,
  color,
  delta,
  deltaColor,
  deltaBg,
  label,
  value,
}: {
  icon: string;
  bg: string;
  color: string;
  delta: string;
  deltaColor: string;
  deltaBg: string;
  label: string;
  value: string;
}) {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <IconTile path={icon} bg={bg} color={color} strokeWidth={2} />
        <div style={{ fontSize: 12, fontWeight: 700, color: deltaColor, background: deltaBg, padding: "3px 8px", borderRadius: 999, height: "fit-content" }}>
          {delta}
        </div>
      </div>
      <div className="mono" style={{ fontSize: 11, letterSpacing: 1, color: C.textFaint, marginTop: 16 }}>
        {label}
      </div>
      <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>{value}</div>
    </Card>
  );
}

/* =========================== CREATE DONATION =========================== */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function CreateDonation() {
  const { go } = useApp();
  const { publishDonation, saveDraft, drafts } = useStore();

  const [item, setItem] = useState("Assorted Pastries");
  const [weight, setWeight] = useState("44");
  const [value, setValue] = useState("180");
  const [category, setCategory] = useState("Food");
  const [fulfilment, setFulfilment] = useState<"pickup" | "dropoff">("pickup");
  const [isRecurring, setIsRecurring] = useState(true);
  const [cadence, setCadence] = useState<"Weekly" | "Bi-Weekly" | "Monthly">("Weekly");
  const [days, setDays] = useState<string[]>(["Fri"]);
  const [earliest, setEarliest] = useState("4:00 PM");
  const [latest, setLatest] = useState("6:30 PM");
  const [priorityDays, setPriorityDays] = useState(3);
  const [allowPublicPickup, setAllowPublicPickup] = useState(true);
  const [radius, setRadius] = useState(15);

  const isDropoff = fulfilment === "dropoff";
  const word = isDropoff ? "Drop-off" : "Pickup";
  const toggleDay = (d: string) => setDays((ds) => (ds.includes(d) ? ds.filter((x) => x !== d) : [...ds, d]));

  const publish = () => {
    publishDonation({
      item,
      qty: `${weight || "0"} lbs`,
      estimatedValue: value,
      fulfilment,
      recurring: isRecurring,
      cadence,
      cat: category,
      days,
      window: `${earliest} – ${latest}`,
    });
    go("activeDonations");
  };

  return (
    <div className="pg" style={{ maxWidth: 880 }}>
      <BackLink label="Back to Dashboard" onClick={() => go("donorDash")} />
      <div className="page-head">
        <PageTitle title="Create Donation" subtitle="List surplus inventory for redistribution." />
        <Btn variant="secondary" onClick={() => go("drafts")}>
          View Drafts · {drafts.length}
        </Btn>
      </div>

      <Card style={{ padding: 26, marginTop: 22 }} hover={false}>
        <SectionLabel>01 — ITEM DETAILS</SectionLabel>
        <TextInput label="Item name" value={item} onChange={setItem} placeholder="What are you donating?" />
        <div style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 8px" }}>Category</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {RESOURCE_CATEGORIES.map((c) => (
            <Chip key={c} active={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="form-row-2" style={{ marginTop: 16 }}>
          <TextInput
            label="Total weight"
            value={weight}
            onChange={setWeight}
            type="number"
            suffix="lbs"
            hint="All donation weights are recorded in pounds."
          />
          <Field label="Condition" value="Fresh / Same-day" right={<span>▾</span>} />
          <TextInput label="Estimated value ($)" value={value} onChange={setValue} type="number" />
        </div>
      </Card>

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel>02 — PHOTOS</SectionLabel>
        <div className="g3" style={{ gap: 12 }}>
          <Placeholder height={110} radius={10} size={9} dashed>
            <span className="mono" style={{ fontSize: 10, color: C.textFaint }}>+ ADD PHOTO</span>
          </Placeholder>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 110, borderRadius: 10, border: `1.5px dashed ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="mono" style={{ fontSize: 10, color: C.chipLine }}>EMPTY</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel>03 — LOGISTICS</SectionLabel>
        <Segmented
          options={[
            { value: "pickup", label: "Schedule Pickup" },
            { value: "dropoff", label: "Self Drop-Off" },
          ]}
          value={fulfilment}
          onChange={(v) => setFulfilment(v as "pickup" | "dropoff")}
          style={{ marginBottom: 16 }}
        />

        {isDropoff ? (
          <>
            <Field label="Drop-off destination" value="Recipient organization's address (shared once matched)" />
            <div className="form-row-2" style={{ marginTop: 16 }}>
              <Field label="Available drop-off window" value="Sat, 10:00 AM – 12:00 PM" />
              <Field label="Expiration" value="Mar 14, 2026" />
            </div>
            <div style={{ marginTop: 16, background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 11, padding: 18 }}>
              <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
                Drop-off constraints
                <InfoIcon text="Organizations outside this radius won't see your listing as drop-off eligible, so you're never asked to drive further than you offered." />
              </div>
              <p style={{ fontSize: 13, color: C.textMute, lineHeight: 1.5, margin: "0 0 14px" }}>
                Set how far you're willing to travel. Requests beyond this distance won't ask you to
                self-deliver.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>Maximum travel radius</div>
                <QtyStepper value={radius} onChange={setRadius} min={1} step={5} />
                <div style={{ fontSize: 13, color: C.textFaint }}>miles from 512 Market St, Seattle</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <Field label="Pickup address" value="512 Market St, Seattle Warehouse A" />
            <div className="form-row-2" style={{ marginTop: 16 }}>
              <Field label="Pickup window" value="Fri, 4:00 – 6:00 PM" />
              <Field label="Expiration" value="Mar 14, 2026" />
            </div>
          </>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 11, marginTop: 18, paddingTop: 18, borderTop: `1px solid ${C.lineSoft}` }}>
          <Toggle on={isRecurring} onChange={setIsRecurring} />
          <span style={{ fontSize: 14, fontWeight: 600 }}>Make this a recurring donation</span>
        </div>

        {isRecurring && (
          <div style={{ marginTop: 16, background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 11, padding: 18 }}>
            <div style={{ fontSize: 13.5, fontWeight: 700, marginBottom: 4 }}>Recurring {word.toLowerCase()} constraints</div>
            <p style={{ fontSize: 12.5, color: C.textMute, margin: "0 0 14px", lineHeight: 1.5 }}>
              S.A.C. re-posts this listing automatically on your schedule — you don't need to
              recreate it each time.
            </p>
            <div className="form-row-2">
              <Select
                label="Repeats"
                value={cadence}
                options={["Weekly", "Bi-Weekly", "Monthly"]}
                onChange={(v) => setCadence(v as "Weekly" | "Bi-Weekly" | "Monthly")}
                labelStyle={{ fontSize: 12.5, color: C.textMute }}
              />
              <Field label="Ends" value="No end date" right={<span>▾</span>} labelStyle={{ fontSize: 12.5, color: C.textMute }} />
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 600, margin: "14px 0 8px", color: C.textMute }}>{word} days</div>
            <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>
              {DAYS.map((d) => {
                const active = days.includes(d);
                return (
                  <span
                    key={d}
                    className="chip"
                    onClick={() => toggleDay(d)}
                    style={{
                      fontSize: 12,
                      fontWeight: active ? 700 : 600,
                      color: active ? "#fff" : C.textMute,
                      background: active ? C.navy : "#fff",
                      border: active ? "1.5px solid transparent" : `1.5px solid ${C.line}`,
                      padding: "7px 12px",
                      borderRadius: 999,
                      cursor: "pointer",
                    }}
                  >
                    {active ? `${d} ✓` : d}
                  </span>
                );
              })}
            </div>
            <div className="form-row-2" style={{ marginTop: 14 }}>
              <TextInput label={`Earliest ${word.toLowerCase()}`} value={earliest} onChange={setEarliest} labelStyle={{ fontSize: 12.5, color: C.textMute }} />
              <TextInput label={`Latest ${word.toLowerCase()}`} value={latest} onChange={setLatest} labelStyle={{ fontSize: 12.5, color: C.textMute }} />
            </div>
          </div>
        )}
      </Card>

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel>04 — PRIORITY &amp; VISIBILITY</SectionLabel>
        <p style={{ fontSize: 14, color: C.textMute, lineHeight: 1.55, margin: "0 0 16px" }}>
          Reserve this donation for nonprofits and organizations first. If it isn't claimed within
          the priority window, it opens to the public.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Days until public release</div>
          <QtyStepper value={priorityDays} onChange={setPriorityDays} min={0} />
          <div style={{ fontSize: 13, color: C.textFaint }}>days</div>
        </div>

        <div
          style={{
            marginTop: 18,
            paddingTop: 18,
            borderTop: `1px solid ${C.lineSoft}`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ flex: 1, minWidth: 260 }}>
            <div style={{ fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
              Allow self-pickup once public
              <InfoIcon text="When off, individuals can only receive this item by delivery. The pickup option is removed from the public marketplace listing." />
            </div>
            <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 2, lineHeight: 1.45 }}>
              Turn this off if you don't want members of the public collecting from your site.
            </div>
          </div>
          <Toggle on={allowPublicPickup} onChange={setAllowPublicPickup} />
        </div>

        <div style={{ marginTop: 14, padding: "12px 14px", background: C.bluePale, borderRadius: 9, display: "flex", gap: 9, alignItems: "flex-start" }}>
          <Icon d={ICON.info} size={16} color={C.blue} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }} extra={<circle cx="12" cy="12" r="9" />} />
          <span style={{ fontSize: 13, color: C.blueDark, lineHeight: 1.5 }}>
            After {priorityDays} day{priorityDays === 1 ? "" : "s"} unclaimed by organizations, this
            donation opens to individuals
            {allowPublicPickup ? " with pickup available." : " as delivery-only — pickup stays disabled."}
            {isDropoff && " Self drop-off remains unavailable to the public."}
          </span>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn
          variant="secondary"
          onClick={() => {
            saveDraft({ item, qty: `${weight || "0"} lbs`, cat: category });
            go("drafts");
          }}
          style={{ padding: "13px 22px" }}
        >
          Save as Draft
        </Btn>
        <Btn onClick={publish} style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}>
          Publish Donation
        </Btn>
      </div>
    </div>
  );
}

/* ============================ ACTIVE DONATIONS ============================ */

export function ActiveDonations() {
  const { go } = useApp();
  const { donations, drafts } = useStore();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Pending Pickup", "Pending Drop-off", "In Transit", "Delivered"];
  const rows = filter === "All" ? donations : donations.filter((d) => d.status === filter);

  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Active Donations" subtitle="Track and manage your published listings." />
        <Btn onClick={() => go("createDonation")}>+ Create Donation</Btn>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
        {filters.map((f) => (
          <Chip key={f} active={filter === f} onClick={() => setFilter(f)}>
            {f}
          </Chip>
        ))}
        <Chip dashed onClick={() => go("drafts")} style={{ marginLeft: "auto" }}>
          Drafts · {drafts.length}
        </Chip>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 18 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ITEM", "WEIGHT", "STATUS", "RECIPIENT", "ACTION"]} template="1.8fr 0.8fr 1.1fr 1.2fr 0.7fr" />
            {rows.map((r) => (
              <div
                key={r.id}
                className="trow"
                onClick={() => go("donationDetail")}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 0.8fr 1.1fr 1.2fr 0.7fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Placeholder width={36} height={36} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</span>
                </div>
                <span style={{ fontSize: 14, color: C.textMute, fontVariantNumeric: "tabular-nums" }}>{r.qty}</span>
                <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.recipient}</span>
                <span style={{ textAlign: "right", color: C.green, fontSize: 13, fontWeight: 700 }}>View →</span>
              </div>
            ))}
            {rows.length === 0 && (
              <div style={{ padding: "26px 22px", fontSize: 14, color: C.textFaint }}>
                No donations with this status.
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

export function Drafts() {
  const { go } = useApp();
  const { drafts, publishDraft } = useStore();
  return (
    <div className="pg">
      <BackLink label="Active Donations" onClick={() => go("activeDonations")} />
      <div className="page-head">
        <PageTitle title="Draft Donations" subtitle="Unpublished listings saved for later. Finish and publish when ready." />
        <Btn onClick={() => go("createDonation")}>+ Create Donation</Btn>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 22 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ITEM", "WEIGHT", "CATEGORY", "EDITED", "ACTIONS"]} template="1.8fr 0.9fr 1.2fr 1fr 1.1fr" />
            {drafts.length === 0 && (
              <div style={{ padding: "26px 22px", fontSize: 14, color: C.textFaint }}>
                No drafts — saved listings will appear here.
              </div>
            )}
            {drafts.map((r) => (
              <div
                key={r.id}
                className="trow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 0.9fr 1.2fr 1fr 1.1fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Placeholder width={36} height={36} />
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: C.textMute, background: C.lineSoft, padding: "3px 8px", borderRadius: 999 }}>
                      Draft
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.qty}</span>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.cat}</span>
                <span style={{ fontSize: 14, color: C.textFaint }}>{r.edited}</span>
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <Btn variant="secondary" onClick={() => go("createDonation")} style={{ fontSize: 12.5, borderRadius: 8, padding: "7px 12px" }}>
                    Edit
                  </Btn>
                  <Btn onClick={() => publishDraft(r.id)} style={{ fontSize: 12.5, borderRadius: 8, padding: "7px 14px" }}>
                    Publish
                  </Btn>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* =========================== DONATION DETAIL =========================== */

export function DonationDetail() {
  const { go } = useApp();
  const { donations, completeDropOff } = useStore();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const d: Donation | undefined = donations[0];
  const isDropoffPending = d?.status === "Pending Drop-off";

  const timeline = [
    { title: "Donation published", time: "Mar 12, 2026 · 9:14 AM", dot: C.green, ring: C.greenPale, titleColor: C.ink },
    { title: `Reserved by ${d?.recipient ?? "recipient"}`, time: "Mar 12, 2026 · 11:02 AM", dot: C.green, ring: C.greenPale, titleColor: C.ink },
    isDropoffPending
      ? { title: "Awaiting your drop-off", time: "Window: Sat, 10:00 AM – 12:00 PM", dot: C.purple, ring: C.purplePale, titleColor: C.ink }
      : { title: "Awaiting volunteer driver pickup", time: "Scheduled Fri, 4–6 PM", dot: C.amber, ring: C.amberPale, titleColor: C.ink },
    d?.tone === "delivered"
      ? { title: "Delivered & verified", time: "Confirmed", dot: C.green, ring: C.greenPale, titleColor: C.ink }
      : { title: "Delivered & verified", time: "Pending", dot: C.chipLine, ring: C.lineSoft, titleColor: C.textFaint },
  ];

  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <BackLink label="Active Donations" onClick={() => go("activeDonations")} />
      <div className="page-head">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px" }}>{d?.item ?? "Donation"}</h1>
            <StatusBadge tone={d?.tone ?? "pending"} style={{ padding: "5px 12px" }}>
              {d?.status ?? "Pending"}
            </StatusBadge>
          </div>
          <p style={{ color: C.textMute, fontSize: 14, marginTop: 4 }}>
            Donation {d?.id ?? "#SAC-4821"} · Created Mar 12, 2026
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="secondary" onClick={() => go("createDonation")} style={{ fontSize: 13, padding: "10px 16px" }}>
            Edit
          </Btn>
          {/* Only drop-off donations need an action here — everything else is
              already visible in the status timeline below. */}
          {isDropoffPending && (
            <Btn onClick={() => setConfirmOpen(true)} style={{ fontSize: 13, padding: "10px 16px" }}>
              Completed Drop-Off
            </Btn>
          )}
        </div>
      </div>

      <div className="split-detail" style={{ marginTop: 22 }}>
        <Placeholder height={260} radius={14} size={10} dashed label="IMAGE — product shot" labelOnWhite />
        <Card style={{ padding: 24 }} hover={false}>
          <div className="g2" style={{ gap: 18 }}>
            {[
              ["WEIGHT", d?.qty ?? "44 lbs"],
              ["CATEGORY", "Food · Bakery"],
              [isDropoffPending ? "DROP-OFF WINDOW" : "PICKUP WINDOW", isDropoffPending ? "Sat, 10 AM – 12 PM" : "Fri, 4–6 PM"],
              ["EXPIRATION", "Mar 14, 2026"],
              ["RECIPIENT", d?.recipient ?? "The Haven Center"],
              ["FULFILMENT", d?.fulfilment === "dropoff" ? "Self drop-off" : "Volunteer pickup"],
            ].map(([k, v]) => (
              <div key={k}>
                <MonoTag>{k}</MonoTag>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
          {isDropoffPending && (
            <div style={{ marginTop: 18, padding: "12px 14px", background: C.purplePale, borderRadius: 9, fontSize: 13, color: "#5B3AA8", lineHeight: 1.5 }}>
              You chose to deliver this donation yourself. Confirm the drop-off once you've handed
              it over.
            </div>
          )}
        </Card>
      </div>

      <Card style={{ padding: 24, marginTop: 18 }} hover={false}>
        <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 18 }}>Status Timeline</div>
        {timeline.map((t, i, arr) => (
          <div key={t.title} style={{ display: "flex", gap: 14, alignItems: "flex-start", paddingBottom: i === arr.length - 1 ? 0 : 18 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 14, height: 14, borderRadius: 99, background: t.dot, border: `3px solid ${t.ring}` }} />
              {i < arr.length - 1 && <div style={{ width: 2, height: 30, background: C.lineSoft }} />}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.titleColor }}>{t.title}</div>
              <div style={{ fontSize: 13, color: C.textFaint }}>{t.time}</div>
            </div>
          </div>
        ))}
      </Card>

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
          <IconTile path={ICON.check} bg={C.greenPale} color={C.green} size={44} radius={11} iconSize={22} strokeWidth={2.2} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Confirm drop-off</h2>
            <p style={{ fontSize: 14, color: C.textMute, margin: "6px 0 0", lineHeight: 1.5 }}>
              Confirm that you delivered <strong>{d?.item}</strong> to {d?.recipient}. This marks
              the donation complete and notifies the organization.
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <Btn variant="secondary" onClick={() => setConfirmOpen(false)} style={{ flex: 1, padding: 13 }}>
            Not yet
          </Btn>
          <Btn
            onClick={() => {
              if (d) completeDropOff(d.id);
              setConfirmOpen(false);
              go("activeDonations");
            }}
            style={{ flex: 1, padding: 13 }}
          >
            Yes, completed
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ========================= RECURRING MANAGEMENT ========================= */

export function RecurringManage() {
  const { go } = useApp();
  const { recurring, toggleRecurring, removeRecurring } = useStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const target = recurring.find((r) => r.id === confirmId);

  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <div className="page-head">
        <PageTitle
          title="Recurring Donations"
          subtitle="These listings re-post automatically on their schedule — no need to recreate them each time."
        />
        <Btn onClick={() => go("createDonation")}>+ New Recurring Donation</Btn>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        {recurring.length === 0 && (
          <Card style={{ padding: 30, textAlign: "center" }} hover={false}>
            <div style={{ fontSize: 15, fontWeight: 700 }}>No recurring donations yet</div>
            <p style={{ fontSize: 13.5, color: C.textMute, marginTop: 6 }}>
              Turn on “Make this a recurring donation” when creating a listing to schedule it
              automatically.
            </p>
          </Card>
        )}
        {recurring.map((r) => (
          <Card key={r.id} style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <IconTile path={ICON.recycle} bg={r.active ? C.greenPale : C.lineFaint} color={r.active ? C.green : C.textFaint} size={46} radius={11} iconSize={21} />
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{r.item}</span>
                  <StatusBadge tone={r.active ? { color: C.green, bg: C.greenPale } : { color: C.textFaint, bg: C.lineFaint }}>
                    {r.active ? "Active" : "Paused"}
                  </StatusBadge>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.blue, background: C.bluePale, padding: "3px 9px", borderRadius: 999 }}>
                    {r.cadence}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.textFaint, marginTop: 4 }}>
                  {r.qty} · {r.cat} · {r.fulfilment === "dropoff" ? "Self drop-off" : "Volunteer pickup"} ·{" "}
                  {r.days.join(", ")} {r.window}
                </div>
              </div>
              <div style={{ textAlign: "right", minWidth: 120 }}>
                <MonoTag>NEXT POST</MonoTag>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{r.active ? r.nextRun : "—"}</div>
                <div style={{ fontSize: 12.5, color: C.textFaint }}>{r.postsCreated} posts created</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Btn variant="secondary" onClick={() => go("createDonation")} style={{ fontSize: 13, borderRadius: 8, padding: "9px 14px" }}>
                  <Icon d={ICON.edit} size={14} color={C.textMute} strokeWidth={2} />
                  Edit
                </Btn>
                <Btn variant="secondary" onClick={() => toggleRecurring(r.id)} style={{ fontSize: 13, borderRadius: 8, padding: "9px 14px" }}>
                  {r.active ? "Pause" : "Resume"}
                </Btn>
                <Btn variant="danger" onClick={() => setConfirmId(r.id)} style={{ fontSize: 13, borderRadius: 8, padding: "9px 14px" }}>
                  Remove
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={confirmId !== null} onClose={() => setConfirmId(null)}>
        <h2 style={{ fontSize: 20, fontWeight: 800, margin: 0 }}>Remove recurring donation?</h2>
        <p style={{ fontSize: 14, color: C.textMute, margin: "8px 0 0", lineHeight: 1.5 }}>
          “{target?.item}” will stop posting automatically. Listings already published stay active.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
          <Btn variant="secondary" onClick={() => setConfirmId(null)} style={{ flex: 1, padding: 13 }}>
            Keep it
          </Btn>
          <Btn
            variant="danger"
            onClick={() => {
              if (confirmId) removeRecurring(confirmId);
              setConfirmId(null);
            }}
            style={{ flex: 1, padding: 13, fontWeight: 700 }}
          >
            Remove
          </Btn>
        </div>
      </Modal>
    </div>
  );
}

/* ================================ IMPACT ================================ */

export function Impact() {
  const { role } = useApp();
  const [activeBar, setActiveBar] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState<number | null>(null);
  const isAdmin = role === "admin";

  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle
          title={isAdmin ? "Network Impact" : "Impact Analytics"}
          subtitle={
            isAdmin
              ? "Combined totals across every donor, organization, individual, and volunteer driver on the platform."
              : "Measure social return, diversion, and emissions impact."
          }
        />
        <Btn variant="softGreen" style={{ padding: "12px 18px" }}>
          <Icon d={ICON.download} size={16} color={C.green} strokeWidth={2} />
          Download ESG Report
        </Btn>
      </div>

      {isAdmin && (
        <Card style={{ marginTop: 20, padding: "16px 20px", background: C.blueWash, borderColor: "#CFE0FA" }} hover={false}>
          <div style={{ fontSize: 13.5, color: C.blueDark, lineHeight: 1.5 }}>
            Showing <strong>combined network totals</strong> — every account's impact summed
            together. Individual account breakdowns are available from the Deactivations table.
          </div>
        </Card>
      )}

      <div className="g4" style={{ marginTop: 20 }}>
        {(isAdmin
          ? [
              ["SROI", "$4.20", "per $1 donated"],
              ["TOTAL ITEMS DONATED", "128,940", "+12% MoM"],
              ["DIVERTED", "1.52M lbs", "+8.4% MoM"],
              ["CO₂ SAVED", "285 t", "+21% MoM"],
            ]
          : [
              ["SROI", "$4.20", "per $1 donated"],
              ["TOTAL ITEMS DONATED", "12,868", "+12% MoM"],
              ["DIVERTED", "152k lbs", "+8.4% MoM"],
              ["CO₂ SAVED", "28.5 t", "+21% MoM"],
            ]
        ).map(([k, v, sub]) => (
          <Card key={k} style={{ padding: 20 }}>
            <MonoTag>{k}</MonoTag>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
            <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>{sub}</div>
          </Card>
        ))}
      </div>

      <div className="split-d" style={{ marginTop: 18 }}>
        <Card style={{ padding: 24 }} hover={false}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Diverted waste over time</div>
              <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 2 }}>
                Tap or hover a bar for the exact month
              </div>
            </div>
            <div
              style={{
                minHeight: 46,
                minWidth: 168,
                padding: "8px 12px",
                borderRadius: 9,
                background: activeBar === null ? C.bg : C.greenPale,
                border: `1px solid ${activeBar === null ? C.lineSoft : C.greenPale}`,
              }}
            >
              {activeBar === null ? (
                <span style={{ fontSize: 12.5, color: C.textFaint }}>Hover a bar…</span>
              ) : (
                <>
                  <div className="mono" style={{ fontSize: 10, letterSpacing: 1, color: C.green }}>
                    {DIVERTED_SERIES[activeBar].month}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, fontVariantNumeric: "tabular-nums" }}>
                    {DIVERTED_SERIES[activeBar].lbs.toLocaleString()} lbs
                  </div>
                  <div style={{ fontSize: 12, color: C.textMute }}>
                    {DIVERTED_SERIES[activeBar].items.toLocaleString()} items
                  </div>
                </>
              )}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 200, marginTop: 20 }}>
            {DIVERTED_SERIES.map((d, i) => (
              <div
                key={d.month}
                className="bar"
                tabIndex={0}
                role="button"
                aria-label={`${d.month}: ${d.lbs} lbs`}
                onMouseEnter={() => setActiveBar(i)}
                onMouseLeave={() => setActiveBar(null)}
                onFocus={() => setActiveBar(i)}
                onBlur={() => setActiveBar(null)}
                onClick={() => setActiveBar(i)}
                style={{
                  flex: 1,
                  background: d.color,
                  borderRadius: 4,
                  height: `${d.h}%`,
                  outline: activeBar === i ? `2px solid ${C.green}` : undefined,
                  outlineOffset: 2,
                }}
              />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
            {DIVERTED_SERIES.map((d) => (
              <MonoTag key={d.month}>{d.month}</MonoTag>
            ))}
          </div>
        </Card>

        <Card style={{ padding: 24 }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>By category</div>
          <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 2 }}>
            Tap or hover a category for item counts
          </div>
          <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {CAT_BREAKDOWN.map((c, i) => {
              const on = activeCat === i;
              return (
                <div
                  key={c.label}
                  className="catrow"
                  tabIndex={0}
                  role="button"
                  aria-label={`${c.label}: ${c.items} items`}
                  onMouseEnter={() => setActiveCat(i)}
                  onMouseLeave={() => setActiveCat(null)}
                  onFocus={() => setActiveCat(i)}
                  onBlur={() => setActiveCat(null)}
                  onClick={() => setActiveCat(on ? null : i)}
                  style={{ padding: "8px 10px", margin: "0 -10px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600 }}>{c.label}</span>
                    <span style={{ color: on ? C.green : C.textFaint, fontWeight: on ? 700 : 400, fontVariantNumeric: "tabular-nums" }}>
                      {on ? `${c.items.toLocaleString()} items` : `${c.pct}%`}
                    </span>
                  </div>
                  <div style={{ height: 8, background: C.lineSoft, borderRadius: 99 }}>
                    <div
                      style={{
                        height: 8,
                        width: `${c.pct}%`,
                        background: on ? C.mint : C.green,
                        borderRadius: 99,
                        transition: "background .15s",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
