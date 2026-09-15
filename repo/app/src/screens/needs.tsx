import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { CASH_ORGS, RESOURCE_CATEGORIES } from "../data";
import { useApp } from "../state";
import { useStore } from "../store";
import {
  BackLink,
  Btn,
  Card,
  Chip,
  Field,
  InfoIcon,
  MonoTag,
  PageTitle,
  PickupSummary,
  Placeholder,
  Progress,
  QtyStepper,
  SectionLabel,
  Segmented,
  Select,
  StatusBadge,
  TableHead,
  TextArea,
  TextInput,
} from "../ui";

const QUANTITY_TYPE_HELP =
  "Quantity type is the unit the organization counts in — e.g. units, lbs, cases, boxes, or meals. Donors see this so their contribution is measured the same way.";

export function CashDonations() {
  return (
    <div className="pg">
      <PageTitle
        title="Cash Donations"
        subtitle="Organizations that accept financial gifts directly on their own site. S.A.C. links you out — we never handle the funds."
        maxWidth={640}
      />
      {/* TODO(owner): replace these sample organizations + URLs with real verified
          partners. Data comes from each org's profile (Settings → Organization
          profile & cash donations). */}
      <div className="g2" style={{ marginTop: 22 }}>
        {CASH_ORGS.map((o) => (
          <Card key={o.name} onClick={() => window.open(o.url, "_blank")} style={{ overflow: "hidden" }}>
            <Placeholder height={110} radius={0} size={10} />
            <div style={{ padding: "18px 20px" }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{o.name}</div>
              <div style={{ fontSize: 13.5, color: C.textMute, marginTop: 6, lineHeight: 1.5 }}>{o.desc}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.lineSoft}` }}>
                <span className="mono" style={{ fontSize: 10.5, letterSpacing: 0.5, color: C.textFaint }}>
                  {o.platform}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.green }}>Donate →</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ========================= COMMUNITY REQUESTS ========================= */

export function Discover() {
  const { go } = useApp();
  const { needs, selectNeed } = useStore();
  return (
    <div className="pg">
      <PageTitle
        title="Community Requests"
        subtitle="Organizations post the items they're currently short on. Choose one and make a direct donation toward it."
        maxWidth={640}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        {needs.map((n) => {
          const met = n.received >= n.needed;
          return (
            <Card
              key={n.id}
              onClick={() => {
                selectNeed(n.id);
                go("needDetail");
              }}
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
              {/* Received out of requested */}
              <div style={{ width: 210, minWidth: 180 }}>
                <div style={{ fontSize: 12.5, color: C.textMute, marginBottom: 4 }}>
                  Need ~{n.received}/{n.needed} {n.quantityType}
                </div>
                <Progress received={n.received} needed={n.needed} unit={n.quantityType} showLabel={false} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: met ? C.textFaint : C.green, flexShrink: 0 }}>
                {met ? "Fully met" : "Donate →"}
              </span>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export function NeedDetail() {
  const { go } = useApp();
  const { needs, activeNeedId } = useStore();
  const need = needs.find((n) => n.id === activeNeedId) ?? needs[0];
  if (!need) return null;
  const met = need.received >= need.needed;
  return (
    <div className="pg" style={{ maxWidth: 760 }}>
      <BackLink label="Community Requests" onClick={() => go("discover")} />
      <Placeholder height={200} radius={14} size={10} />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 18, flexWrap: "wrap" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: need.catColor, background: need.catBg, padding: "4px 10px", borderRadius: 999 }}>
          {need.cat}
        </span>
        <span style={{ fontSize: 11, fontWeight: 700, color: need.urgencyColor, background: need.urgencyBg, padding: "4px 10px", borderRadius: 999 }}>
          {need.urgency}
        </span>
      </div>
      <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.5px", marginTop: 12 }}>{need.item}</h1>
      <div style={{ fontSize: 14.5, color: C.textMute, marginTop: 4 }}>
        Requested by {need.org} · {need.city}
      </div>

      <Card style={{ marginTop: 18, padding: 20 }} hover={false}>
        <Progress received={need.received} needed={need.needed} unit={need.quantityType} />
        <div className="g3" style={{ marginTop: 18, gap: 16 }}>
          <div>
            <MonoTag>QUANTITY TYPE</MonoTag>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{need.quantityType}</div>
          </div>
          <div>
            <MonoTag>ESTIMATED WEIGHT</MonoTag>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{need.estWeight}</div>
          </div>
          <div>
            <MonoTag>STILL NEEDED</MonoTag>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>
              {Math.max(0, need.needed - need.received)} {need.quantityType}
            </div>
          </div>
        </div>
      </Card>

      <p style={{ fontSize: 14.5, color: C.textMute, lineHeight: 1.6, marginTop: 16 }}>{need.notes}</p>

      <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
        <Btn variant="secondary" onClick={() => go("messages")} style={{ padding: "13px 22px" }}>
          Message organization
        </Btn>
        <Btn onClick={() => go("needDonate")} disabled={met} style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 220 }}>
          {met ? "This request is fully met" : "Donate toward this need"}
        </Btn>
      </div>
    </div>
  );
}

export function NeedDonate() {
  const { go } = useApp();
  const { needs, activeNeedId, donateToNeed } = useStore();
  const need = needs.find((n) => n.id === activeNeedId) ?? needs[0];
  const remaining = Math.max(1, need.needed - need.received);
  const [amount, setAmount] = useState(Math.min(12, remaining));
  const [weight, setWeight] = useState("24");
  const [value, setValue] = useState("180");
  const [fulfilment, setFulfilment] = useState<"pickup" | "dropoff">("pickup");

  return (
    <div className="pg" style={{ maxWidth: 760 }}>
      <BackLink label="Back" onClick={() => go("needDetail")} />
      <PageTitle title="Donate toward this need" subtitle={`${need.item} · ${need.org}`} />

      <Card style={{ padding: 26, marginTop: 22 }} hover={false}>
        <SectionLabel>01 — YOUR CONTRIBUTION</SectionLabel>
        <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Quantity you can donate</div>
          <QtyStepper value={amount} onChange={setAmount} min={1} max={remaining} />
          {/* Quantity type is set by the organization and is not editable here */}
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: C.textMute,
              background: C.lineFaint,
              border: `1px solid ${C.line}`,
              padding: "9px 14px",
              borderRadius: 9,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {need.quantityType}
            <InfoIcon text={QUANTITY_TYPE_HELP} />
          </div>
        </div>
        <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 8 }}>
          {need.org} still needs {remaining} {need.quantityType} of {need.needed} requested.
        </div>

        <div className="form-row-2" style={{ marginTop: 18 }}>
          <TextInput
            label="Estimated weight"
            value={weight}
            onChange={setWeight}
            type="number"
            suffix="lbs"
            hint={`Organization estimates ${need.estWeight}`}
          />
          <TextInput label="Estimated value ($)" value={value} onChange={setValue} type="number" />
        </div>

        <div style={{ fontSize: 13, fontWeight: 600, margin: "18px 0 8px" }}>Photos</div>
        <div className="g3" style={{ gap: 12 }}>
          <Placeholder height={100} radius={10} size={9} dashed>
            <span className="mono" style={{ fontSize: 10, color: C.textFaint }}>+ ADD PHOTO</span>
          </Placeholder>
          {[0, 1].map((i) => (
            <div key={i} style={{ height: 100, borderRadius: 10, border: `1.5px dashed ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span className="mono" style={{ fontSize: 10, color: C.chipLine }}>EMPTY</span>
            </div>
          ))}
        </div>
      </Card>

      <Card style={{ padding: 26, marginTop: 18 }} hover={false}>
        <SectionLabel>02 — LOGISTICS</SectionLabel>
        {/* Same two options, same names, as the create-donation flow */}
        <Segmented
          options={[
            { value: "pickup", label: "Schedule Pickup" },
            { value: "dropoff", label: "Self Drop-Off" },
          ]}
          value={fulfilment}
          onChange={(v) => setFulfilment(v as "pickup" | "dropoff")}
          style={{ marginBottom: 16 }}
        />
        {fulfilment === "pickup" ? (
          <>
            <Field label="Pickup address" value="Your saved address · 512 Market St, Seattle" />
            <Field label="Pickup window" value="Sat, 10:00 AM – 12:00 PM" style={{ marginTop: 16 }} />
            <div style={{ marginTop: 14, padding: "12px 14px", background: C.bluePale, borderRadius: 9, fontSize: 12.5, color: C.blueDark, lineHeight: 1.5 }}>
              A volunteer driver collects from you and delivers to {need.org}.
            </div>
          </>
        ) : (
          <>
            <PickupSummary
              label="Drop-off"
              city={need.city}
              dist={need.dist}
              window={need.window}
              address={need.address}
              revealed={false}
            />
            <div style={{ marginTop: 14 }}>
              <Field label="Your planned drop-off time" value="Sat, 11:00 AM" />
            </div>
          </>
        )}
      </Card>

      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn variant="secondary" onClick={() => go("needDetail")} style={{ padding: "13px 22px" }}>
          Cancel
        </Btn>
        <Btn
          onClick={() => {
            donateToNeed(need.id, amount, fulfilment);
            go("needDonateConfirm");
          }}
          style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}
        >
          Confirm donation
        </Btn>
      </div>
    </div>
  );
}

export function NeedDonateConfirm() {
  const { go } = useApp();
  const { needs, activeNeedId, donations } = useStore();
  const need = needs.find((n) => n.id === activeNeedId) ?? needs[0];
  const latest = donations[0];
  const isDropoff = latest?.fulfilment === "dropoff";
  return (
    <div style={{ padding: "48px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <Card style={{ padding: 36 }} hover={false}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Icon d={ICON.check} size={32} color={C.green} strokeWidth={2.4} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 18 }}>Donation sent</h1>
            <p style={{ color: C.textMute, fontSize: 15, marginTop: 6 }}>
              Your donation toward {need?.item} was sent directly to {need?.org}.
            </p>
          </div>
          <div style={{ marginTop: 22 }}>
            <Progress received={need.received} needed={need.needed} unit={need.quantityType} />
          </div>
          <div style={{ marginTop: 18, border: `1px solid ${C.lineSoft}`, borderRadius: 12, overflow: "hidden" }}>
            {[
              ["QUANTITY", latest?.qty ?? `12 ${need.quantityType}`],
              ["METHOD", isDropoff ? "Self drop-off" : "Volunteer pickup"],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${C.lineFaint}` : undefined }}>
                <MonoTag style={{ fontSize: 11 }}>{k}</MonoTag>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          {/* Full address + map unlock now that the donation is committed */}
          {isDropoff && (
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Where to drop off</div>
              <PickupSummary label="Drop-off" city={need.city} dist={need.dist} window={need.window} address={need.address} revealed />
            </div>
          )}
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => go("discover")} style={{ flex: 1, padding: 13 }}>
              Keep browsing
            </Btn>
            <Btn onClick={() => go("messages")} style={{ flex: 1, padding: 13 }}>
              Message organization
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================ ORG: POST A NEED ============================ */

export function CreateRequest() {
  const { go } = useApp();
  const { postNeed } = useStore();
  const [item, setItem] = useState("Winter Coats (Adult, all sizes)");
  const [qty, setQty] = useState(60);
  const [quantityType, setQuantityType] = useState("units");
  const [cat, setCat] = useState("Clothing");
  const [urgency, setUrgency] = useState("High need");
  const [notes, setNotes] = useState("Any condition accepted — clean and wearable is all we ask.");

  return (
    <div className="pg" style={{ maxWidth: 760 }}>
      <BackLink label="Needs Posted" onClick={() => go("orgNeeds")} />
      <PageTitle title="Post a Need" subtitle="Tell donors what your organization is short on right now." />
      <Card style={{ padding: 26, marginTop: 22 }} hover={false}>
        <TextInput label="Item needed" value={item} onChange={setItem} />
        <div style={{ fontSize: 13, fontWeight: 600, margin: "16px 0 8px" }}>Category</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {RESOURCE_CATEGORIES.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c}
            </Chip>
          ))}
        </div>
        <div className="form-row-2" style={{ marginTop: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Quantity needed</div>
            <QtyStepper value={qty} onChange={setQty} min={1} step={5} />
          </div>
          <TextInput
            label="Quantity type"
            value={quantityType}
            onChange={setQuantityType}
            placeholder="units, lbs, cases, meals…"
            info={QUANTITY_TYPE_HELP}
            hint="Donors see this as a fixed unit when giving toward your request."
          />
        </div>
        <Select
          label="Urgency"
          value={urgency}
          options={["High need", "Ongoing"]}
          onChange={setUrgency}
          style={{ marginTop: 16 }}
        />
        <TextArea label="Notes for donors" value={notes} onChange={setNotes} style={{ marginTop: 16 }} />
      </Card>
      <div style={{ display: "flex", gap: 12, marginTop: 22, flexWrap: "wrap" }}>
        <Btn variant="secondary" onClick={() => go("orgNeeds")} style={{ padding: "13px 22px" }}>
          Cancel
        </Btn>
        <Btn
          onClick={() => {
            postNeed({ item, needed: qty, quantityType, cat, urgency, notes });
            go("orgNeeds");
          }}
          style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}
        >
          Post Need
        </Btn>
      </div>
    </div>
  );
}

export function OrgNeeds() {
  const { go } = useApp();
  const { needs } = useStore();
  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Needs Posted" subtitle="Items you've asked donors to help fulfill, and how much has arrived." />
        <Btn onClick={() => go("createRequest")}>+ Post a Need</Btn>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 22 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ITEM", "RECEIVED / REQUESTED", "POSTED", "STATUS"]} template="1.6fr 1.4fr 0.9fr 0.8fr" lastRight={false} />
            {needs.map((r) => {
              const met = r.received >= r.needed;
              return (
                <div
                  key={r.id}
                  className="trow"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.6fr 1.4fr 0.9fr 0.8fr",
                    alignItems: "center",
                    padding: "16px 22px",
                    borderBottom: `1px solid ${C.lineFaint}`,
                    gap: 12,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{r.item}</div>
                    <div style={{ fontSize: 12, color: C.textFaint }}>{r.cat}</div>
                  </div>
                  <div style={{ paddingRight: 20 }}>
                    <Progress received={r.received} needed={r.needed} unit={r.quantityType} />
                  </div>
                  <span style={{ fontSize: 14, color: C.textMute }}>4 days ago</span>
                  <StatusBadge tone={met ? { color: C.textFaint, bg: C.lineFaint } : { color: C.green, bg: C.greenPale }}>
                    {met ? "Fulfilled" : "Open"}
                  </StatusBadge>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}
