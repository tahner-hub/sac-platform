import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { MARKET_ITEMS, RECURRING_DONOR_LIST } from "../data";
import { useApp } from "../state";
import { useStore } from "../store";
import {
  BackLink,
  Btn,
  Card,
  Chip,
  Field,
  IconTile,
  MonoTag,
  PageTitle,
  PickupSummary,
  Placeholder,
  QtyStepper,
  SearchBox,
  SectionLabel,
  Segmented,
  StatusBadge,
  TableHead,
} from "../ui";

export function OrgDash() {
  const { go } = useApp();
  const { orders } = useStore();
  return (
    <div className="pg">
      <div className="page-head">
        <PageTitle title="Organization Dashboard" subtitle="The Haven Center · Priority access partner" />
        <Btn onClick={() => go("marketplace")}>Browse Marketplace</Btn>
      </div>
      <div className="g4" style={{ marginTop: 24 }}>
        {[
          ["INCOMING THIS WEEK", String(orders.length)],
          ["RESERVED", String(orders.filter((o) => o.status === "Reserved").length)],
          ["DELIVERED (MO)", "128"],
        ].map(([k, v]) => (
          <Card key={k} style={{ padding: 20 }}>
            <MonoTag>{k}</MonoTag>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>{v}</div>
          </Card>
        ))}
        {/* CO2 savings replaces the old "People served" tile */}
        <div className="card card-static" style={{ background: C.navy, borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <MonoTag color={C.navMute}>CO₂ SAVINGS</MonoTag>
            <IconTile path={ICON.leaf} bg="rgba(108,248,187,.16)" color={C.mint} size={30} radius={8} iconSize={15} />
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4, color: "#fff" }}>6.2 Tons</div>
          <div style={{ fontSize: 12, color: C.mint, fontWeight: 700, marginTop: 2 }}>
            from 14,300 lbs received
          </div>
        </div>
      </div>
      <div className="split-b" style={{ marginTop: 18 }}>
        <Card style={{ overflow: "hidden" }} hover={false}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 22px" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>Incoming Orders</div>
            <span className="tlink" onClick={() => go("orgOrders")} style={{ color: C.green, fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              View All
            </span>
          </div>
          {orders.slice(0, 4).map((r) => (
            <div
              key={r.id}
              className="trow"
              onClick={() => go("orgOrders")}
              style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 22px", borderTop: `1px solid ${C.lineFaint}`, cursor: "pointer" }}
            >
              <Placeholder width={38} height={38} radius={9} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.item}</div>
                <div style={{ fontSize: 12.5, color: C.textFaint }}>
                  {r.from} · {r.qty}
                </div>
              </div>
              <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
            </div>
          ))}
        </Card>
        <Card style={{ padding: 22, height: "fit-content" }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Recommended for you</div>
          <div style={{ fontSize: 13, color: C.textFaint, marginTop: 2 }}>Matches your category preferences</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { title: "Canned Vegetables", meta: "110 lbs · 2.1 mi" },
              { title: "Hygiene Kits", meta: "225 lbs · 3.4 mi" },
            ].map((r) => (
              <div
                key={r.title}
                className="card card-click"
                onClick={() => go("itemDetail")}
                style={{ display: "flex", gap: 12, alignItems: "center", cursor: "pointer", padding: 10, border: `1px solid ${C.lineSoft}`, borderRadius: 11 }}
              >
                <Placeholder width={48} height={48} radius={9} size={6} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700 }}>{r.title}</div>
                  <div style={{ fontSize: 12.5, color: C.textFaint }}>{r.meta}</div>
                </div>
                <span style={{ color: C.green, fontSize: 13, fontWeight: 700 }}>Reserve</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== MARKETPLACE ============================== */

export function Marketplace() {
  const { go } = useApp();
  const [following] = useState<string[]>(["Global Grocers Inc."]);

  // Followed recurring donors surface their next scheduled drop as a
  // non-selectable card so orgs can plan around it.
  const upcomingDrops = RECURRING_DONOR_LIST.filter((d) => following.includes(d.name));

  return (
    <div className="pg">
      <PageTitle title="Marketplace" subtitle="Available resources ready to reserve. Priority access applied." />

      <div
        className="card card-click"
        onClick={() => go("recurringDonors")}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginTop: 18,
          background: C.navy,
          borderRadius: 12,
          padding: "16px 20px",
          cursor: "pointer",
          border: "none",
        }}
      >
        <IconTile path={ICON.recycle} bg="rgba(108,248,187,.16)" color={C.mint} size={40} radius={10} iconSize={20} />
        <div style={{ flex: 1 }}>
          <div style={{ color: "#fff", fontSize: 15, fontWeight: 700 }}>Recurring donors</div>
          <div style={{ color: C.navText, fontSize: 13, marginTop: 1 }}>
            See which donors send resources on a schedule and follow them to plan ahead.
          </div>
        </div>
        <span style={{ color: C.mint, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>View →</span>
      </div>

      {upcomingDrops.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 10 }}>Upcoming drops from donors you follow</div>
          <div className="g3">
            {upcomingDrops.map((d) => (
              <Card
                key={d.name}
                hover={false}
                style={{
                  padding: 18,
                  background: C.blueWash,
                  borderStyle: "dashed",
                  borderColor: "#C9D8EE",
                  cursor: "not-allowed",
                  opacity: 0.95,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <IconTile path={ICON.calendar} bg="#fff" color={C.blue} size={34} radius={8} iconSize={16} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: C.textFaint }}>{d.cat}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, alignItems: "flex-end" }}>
                  <div>
                    <MonoTag>NEXT EXPECTED DROP</MonoTag>
                    <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2 }}>{d.next}</div>
                    <div style={{ fontSize: 12.5, color: C.textFaint }}>{d.vol}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.textMute, background: "#fff", border: `1px solid ${C.line}`, padding: "4px 10px", borderRadius: 999 }}>
                    Not yet listed
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 22, flexWrap: "wrap" }}>
        <SearchBox placeholder="Search resources…" style={{ flex: 1, minWidth: 200 }} />
        <Chip active>All</Chip>
        <Chip>Food</Chip>
        <Chip>Medical</Chip>
        <Chip>Clothing</Chip>
        <Chip>Within 25 mi</Chip>
      </div>

      <div className="g3" style={{ marginTop: 22 }}>
        {MARKET_ITEMS.map((m) => (
          <Card key={m.id} onClick={() => go("itemDetail")} style={{ overflow: "hidden", boxShadow: "0 1px 3px rgba(11,28,48,.05)" }}>
            <Placeholder
              height={150}
              radius={0}
              size={10}
              style={{ alignItems: "flex-start", justifyContent: "space-between", padding: 12, display: "flex" }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: m.catColor, background: m.catBg, padding: "4px 10px", borderRadius: 999 }}>
                {m.cat}
              </span>
              {/* Recurring marker — organizations only (see logic note below) */}
              {m.recurring && (
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#fff",
                    background: C.navy,
                    padding: "4px 10px",
                    borderRadius: 999,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <Icon d={ICON.recycle} size={11} color={C.mint} strokeWidth={2.4} />
                  {m.cadence}
                </span>
              )}
            </Placeholder>
            <div style={{ padding: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700 }}>{m.title}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 13, color: C.textMute }}>{m.qty}</span>
                <span style={{ fontSize: 13, color: C.textFaint }}>· {m.dist}</span>
                <span style={{ fontSize: 13, color: C.textFaint }}>· {m.city}</span>
              </div>
              <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 6 }}>From {m.donor}</div>
              <Btn onClick={() => go("reserveResource")} style={{ width: "100%", fontSize: 13.5, borderRadius: 8, padding: 10, marginTop: 14 }}>
                Reserve
              </Btn>
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ marginTop: 20, padding: "14px 18px", background: C.bg }} hover={false}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <Icon d={ICON.info} size={16} color={C.textFaint} strokeWidth={2} style={{ flexShrink: 0, marginTop: 2 }} extra={<circle cx="12" cy="12" r="9" />} />
          <span style={{ fontSize: 12.5, color: C.textMute, lineHeight: 1.5 }}>
            Recurring listings are visible to verified organizations only. Once a recurring item
            passes its priority window and opens to the public, it appears as a single one-time
            listing without the recurring label.
          </span>
        </div>
      </Card>
    </div>
  );
}

export function RecurringDonors() {
  const { go } = useApp();
  const { toast } = useStore();
  const [following, setFollowing] = useState<string[]>(["Global Grocers Inc."]);
  const toggle = (name: string) => {
    setFollowing((f) => {
      const on = f.includes(name);
      toast(on ? `Unfollowed ${name}.` : `Following ${name} — their next drop will appear in your marketplace.`);
      return on ? f.filter((x) => x !== name) : [...f, name];
    });
  };
  return (
    <div className="pg">
      <BackLink label="Marketplace" onClick={() => go("marketplace")} />
      <PageTitle
        title="Recurring Donors"
        subtitle="Donors sending resources on a schedule. Follow one to see their next drop before it publishes."
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 22 }}>
        {RECURRING_DONOR_LIST.map((d) => {
          const on = following.includes(d.name);
          return (
            <Card key={d.name} style={{ padding: "20px 22px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <Placeholder width={48} height={48} radius={11} size={6} />
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 16, fontWeight: 700 }}>{d.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: C.green, background: C.greenPale, padding: "3px 9px", borderRadius: 999 }}>
                    {d.cadence}
                  </span>
                </div>
                <div style={{ fontSize: 13, color: C.textFaint, marginTop: 3 }}>{d.cat}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <MonoTag>NEXT DROP</MonoTag>
                <div style={{ fontSize: 14, fontWeight: 700, marginTop: 2 }}>{d.next}</div>
                <div style={{ fontSize: 12.5, color: C.textFaint }}>{d.vol}</div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="secondary" onClick={() => go("messages")} style={{ fontSize: 13, borderRadius: 8, padding: "9px 14px" }}>
                  Message
                </Btn>
                <Btn variant={on ? "softGreen" : "primary"} onClick={() => toggle(d.name)} style={{ fontSize: 13, borderRadius: 8, padding: "9px 16px" }}>
                  {on ? "Following ✓" : "Follow"}
                </Btn>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============================== ITEM DETAIL ============================== */

export function ItemDetail() {
  const { go, openReport } = useApp();
  const m = MARKET_ITEMS[0];
  return (
    <div className="pg" style={{ maxWidth: 1040 }}>
      <BackLink label="Marketplace" onClick={() => go("marketplace")} />
      <div className="split-2" style={{ gap: 24 }}>
        <div>
          <Placeholder height={300} radius={14} size={10} dashed label="IMAGE — product shot" labelOnWhite />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {[0, 1, 2].map((i) => (
              <Placeholder key={i} height={64} radius={9} size={7} style={{ flex: 1 }} />
            ))}
          </div>
        </div>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: C.green, background: C.greenPale, padding: "5px 12px", borderRadius: 999 }}>
              Canned Goods &amp; Dry Storage
            </span>
            {m.recurring && (
              <span
                style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: C.navy, padding: "5px 12px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Icon d={ICON.recycle} size={12} color={C.mint} strokeWidth={2.4} />
                {m.cadence} recurring
              </span>
            )}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", margin: "14px 0 0" }}>{m.title}</h1>
          <p style={{ color: C.textMute, fontSize: 15, lineHeight: 1.6, marginTop: 12 }}>
            High-priority redistribution of staple pantry items. Loading dock available at pickup
            location. Refrigeration not required.
          </p>
          <div className="g2" style={{ marginTop: 22, padding: 20, background: C.bg, border: `1px solid ${C.lineSoft}`, borderRadius: 12 }}>
            {[
              ["WEIGHT", m.qty],
              ["CONDITION", "Shelf-stable"],
              ["PICKUP", `${m.donor} · ${m.city}`],
              ["WINDOW", m.window],
            ].map(([k, v]) => (
              <div key={k}>
                <MonoTag>{k}</MonoTag>
                <div style={{ fontSize: 16, fontWeight: 700, marginTop: 3 }}>{v}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18, padding: 14, background: C.greenPale, borderRadius: 11 }}>
            <Icon d={ICON.shield} size={20} color={C.green} strokeWidth={2} />
            <span style={{ fontSize: 13, color: C.greenDark, fontWeight: 600 }}>
              Priority access — reserve before public release.
            </span>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <Btn variant="secondary" onClick={() => go("messages")} style={{ padding: "13px 20px" }}>
              Message donor
            </Btn>
            <Btn onClick={() => go("reserveResource")} style={{ flex: 1, fontSize: 15, padding: 13, minWidth: 200 }}>
              Reserve resource
            </Btn>
          </div>
          <div
            className="tlink"
            onClick={() => openReport("this listing", "listing")}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: C.textFaint, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
          >
            <Icon d={ICON.flag} size={14} color={C.textFaint} strokeWidth={2} />
            Report this listing
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================ RESERVE RESOURCE ============================ */

export function ReserveResource() {
  const { go } = useApp();
  const { reserveResource } = useStore();
  const m = MARKET_ITEMS[0];
  const [pallets, setPallets] = useState(3);
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const lbs = Math.round((pallets * 1240) / 3);

  const confirm = () => {
    reserveResource({
      item: m.title,
      qty: `${lbs.toLocaleString()} lbs`,
      from: m.donor,
      fulfilment: fulfilment === "pickup" ? "pickup" : "dropoff",
      city: m.city,
      dist: m.dist,
      window: m.window,
      address: "512 Market St, Dock 4, Seattle, WA 98101",
    });
    go("reserveConfirm");
  };

  return (
    <div className="pg" style={{ maxWidth: 920 }}>
      <BackLink label="Back to listing" onClick={() => go("itemDetail")} />
      <PageTitle title="Reserve resource" subtitle={`Confirm quantity and fulfilment for ${m.title}.`} />
      <div className="split-b" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: 24 }} hover={false}>
            <SectionLabel mb={16}>01 — QUANTITY</SectionLabel>
            <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Reserve amount</div>
              <QtyStepper value={pallets} onChange={setPallets} min={1} max={3} />
              <div style={{ fontSize: 13, color: C.textFaint }}>
                of 3 pallets · {lbs.toLocaleString()} lbs
              </div>
            </div>
          </Card>
          <Card style={{ padding: 24 }} hover={false}>
            <SectionLabel mb={16}>02 — FULFILMENT</SectionLabel>
            <Segmented
              options={[
                {
                  value: "delivery",
                  label: "Request delivery",
                  hint: "A volunteer driver picks up and delivers to your site.",
                  iconPath: ICON.truck,
                },
                {
                  value: "pickup",
                  label: "Self pickup",
                  hint: "Collect directly from the donor within the pickup window.",
                  iconPath: ICON.boxSimple,
                },
              ]}
              value={fulfilment}
              onChange={(v) => setFulfilment(v as "delivery" | "pickup")}
              disabledValues={m.pickupAllowed ? [] : ["pickup"]}
            />
            {fulfilment === "delivery" ? (
              <>
                <Field label="Delivery address" value="The Haven Center · 210 Elm St, Seattle WA" style={{ marginTop: 18 }} />
                <Field label="Preferred delivery window" value="Fri, Mar 14 · 9 AM – 12 PM" right={<span>▾</span>} style={{ marginTop: 16 }} />
                <div style={{ marginTop: 14, padding: "12px 14px", background: C.bluePale, borderRadius: 9, fontSize: 12.5, color: C.blueDark, lineHeight: 1.5 }}>
                  If the donor listed this as self drop-off and is within their travel radius,
                  they'll deliver it to you directly — otherwise a volunteer driver is assigned.
                </div>
              </>
            ) : (
              <div style={{ marginTop: 18 }}>
                <PickupSummary city={m.city} dist={m.dist} window={m.window} address="512 Market St, Dock 4, Seattle, WA 98101" revealed={false} />
              </div>
            )}
          </Card>
        </div>
        <Card style={{ padding: 24, height: "fit-content" }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Reservation summary</div>
          <Placeholder height={120} radius={10} size={9} style={{ marginTop: 14 }} />
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              ["Item", "Bulk Food Transfer"],
              ["Weight", `${lbs.toLocaleString()} lbs`],
              ["Fulfilment", fulfilment === "delivery" ? "Delivery" : "Self pickup"],
              ["Delivery fee", fulfilment === "delivery" ? "$18.00" : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, gap: 12 }}>
                <span style={{ color: C.textMute }}>{k}</span>
                <span style={{ fontWeight: 600, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, padding: "12px 14px", background: C.greenPale, borderRadius: 9, fontSize: 12.5, color: C.greenDark, lineHeight: 1.5 }}>
            Priority access — held for your organization until Mar 13, 6 PM.
          </div>
          <Btn onClick={confirm} style={{ width: "100%", fontSize: 15, padding: 14, marginTop: 18 }}>
            Confirm reservation
          </Btn>
        </Card>
      </div>
    </div>
  );
}

export function ReserveConfirm() {
  const { go } = useApp();
  const { orders } = useStore();
  const latest = orders[0];
  const isPickup = latest?.fulfilment === "pickup";
  return (
    <div style={{ padding: "48px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <Card style={{ padding: 36 }} hover={false}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Icon d={ICON.check} size={32} color={C.green} strokeWidth={2.4} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 18 }}>Resource reserved</h1>
            <p style={{ color: C.textMute, fontSize: 15, marginTop: 6 }}>
              {latest?.item ?? "Your reservation"} is held for The Haven Center.
            </p>
          </div>
          <div style={{ marginTop: 24, border: `1px solid ${C.lineSoft}`, borderRadius: 12, overflow: "hidden" }}>
            {[
              ["RESERVATION", latest?.id ?? "#SAC-7741", 700],
              ["WEIGHT", latest?.qty ?? "1,240 lbs", 600],
              ["HELD UNTIL", "Mar 13, 6:00 PM", 600],
            ].map(([k, v, w], i, arr) => (
              <div
                key={k as string}
                style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${C.lineFaint}` : undefined }}
              >
                <MonoTag style={{ fontSize: 11 }}>{k}</MonoTag>
                <span style={{ fontSize: 14, fontWeight: w as number, textAlign: "right" }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Fulfilment</div>
            {isPickup ? (
              <PickupSummary
                city={latest?.city ?? "Seattle, WA"}
                dist={latest?.dist ?? "2.1 mi"}
                window={latest?.window ?? "Mar 14 · 9 AM – 12 PM"}
                address={latest?.address}
                revealed
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.greenPale}`, background: C.greenWash, borderRadius: 10, padding: "12px 14px" }}>
                <Icon d={ICON.truck} size={18} color={C.green} strokeWidth={1.9} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Delivery requested</div>
                  <div style={{ fontSize: 12.5, color: C.textFaint }}>
                    Fri, Mar 14 · 9 AM – 12 PM · volunteer driver to be assigned
                  </div>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => go("marketplace")} style={{ flex: 1, padding: 13 }}>
              Keep browsing
            </Btn>
            <Btn onClick={() => go("orgOrders")} style={{ flex: 1, padding: 13 }}>
              View my orders
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

/* ============================== ORG ORDERS ============================== */

export function OrgOrders() {
  const { role, openReport } = useApp();
  const { orders } = useStore();
  const isIndividual = role === "individual";
  return (
    <div className="pg">
      <PageTitle
        title={isIndividual ? "My Orders" : "Incoming Orders"}
        subtitle="Track reservations and incoming deliveries. Use the flag to report a problem with any order."
      />
      <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
        <Chip active>All</Chip>
        <Chip>Reserved</Chip>
        <Chip>In Transit</Chip>
        <Chip>Delivered</Chip>
      </div>
      <Card style={{ overflow: "hidden", marginTop: 18 }} hover={false}>
        <div className="tscroll">
          <div className="tmin">
            <TableHead columns={["ITEM", "FROM", "STATUS", "ETA", "REPORT"]} template="1.8fr 1fr 1fr 1fr 0.7fr" />
            {orders.map((r) => (
              <div
                key={r.id}
                className="trow"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1.8fr 1fr 1fr 1fr 0.7fr",
                  alignItems: "center",
                  padding: "15px 22px",
                  borderBottom: `1px solid ${C.lineFaint}`,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Placeholder width={36} height={36} />
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{r.item}</span>
                </div>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.from}</span>
                <StatusBadge tone={r.tone}>{r.status}</StatusBadge>
                <span style={{ fontSize: 14, color: C.textMute }}>{r.eta}</span>
                {/* Report action replaces the old delivery-status link */}
                <span
                  className="iconbtn"
                  onClick={() => openReport(`order ${r.id}`, "order")}
                  title="Report a problem with this order"
                  role="button"
                  tabIndex={0}
                  style={{ display: "inline-flex", justifyContent: "flex-end", alignItems: "center", color: C.flagIdle, cursor: "pointer" }}
                >
                  <Icon d={ICON.flag} size={16} color="currentColor" strokeWidth={2} />
                </span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
