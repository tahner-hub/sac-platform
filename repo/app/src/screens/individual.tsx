import { useState } from "react";
import { C } from "../theme";
import { Icon, ICON } from "../icons";
import { PUBLIC_ITEMS } from "../data";
import { useApp } from "../state";
import { useStore } from "../store";
import { startCheckout, paymentsEnabled } from "../services/payments";
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
  SearchBox,
  SectionLabel,
  Segmented,
} from "../ui";

export function IndividualMarket() {
  const { go } = useApp();
  return (
    <div className="pg">
      <div className="card card-static" style={{ background: C.navy, borderRadius: 14, padding: "24px 28px", display: "flex", alignItems: "center", gap: 16 }}>
        <IconTile path={ICON.cart} bg="rgba(108,248,187,.16)" color={C.mint} size={44} radius={11} iconSize={22} />
        <div>
          <div style={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>Public Marketplace</div>
          <div style={{ color: C.navText, fontSize: 13.5, marginTop: 2 }}>
            Surplus released to the community after nonprofit demand is met. Affordable essentials,
            near you.
          </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <SearchBox placeholder="Search items…" style={{ flex: 1, minWidth: 200 }} />
        <Chip active>All</Chip>
        <Chip>Food</Chip>
        <Chip>Clothing</Chip>
        <Chip>Household</Chip>
      </div>
      <div className="g4" style={{ marginTop: 22 }}>
        {PUBLIC_ITEMS.map((m) => (
          <Card key={m.title} style={{ overflow: "hidden", boxShadow: "0 1px 3px rgba(11,28,48,.05)" }}>
            <Placeholder height={120} radius={0} size={10} />
            <div style={{ padding: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{m.title}</div>
              <div style={{ fontSize: 12.5, color: C.textFaint, marginTop: 4 }}>
                {m.dist} · {m.city}
              </div>
              {!m.pickupAllowed && (
                <div style={{ fontSize: 11.5, color: C.blueDark, background: C.bluePale, borderRadius: 6, padding: "3px 8px", marginTop: 6, display: "inline-block" }}>
                  Delivery only
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                <span style={{ fontSize: 16, fontWeight: 800, color: C.green }}>{m.price}</span>
                <Btn onClick={() => go("checkout")} style={{ fontSize: 13, borderRadius: 8, padding: "8px 14px" }}>
                  Order
                </Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function Checkout() {
  const { go } = useApp();
  const { placeOrder, toast } = useStore();
  const [fulfilment, setFulfilment] = useState<"delivery" | "pickup">("delivery");
  const [placing, setPlacing] = useState(false);
  const item = PUBLIC_ITEMS[0];

  const total = fulfilment === "delivery" ? "$16.50" : "$13.00";

  // With Stripe configured this redirects to hosted Checkout (prices resolved
  // server-side); in demo mode the order is recorded locally.
  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const redirected = await startCheckout([
        { listingId: "winter-jacket", quantity: 1 },
        { listingId: "pantry-box", quantity: 1 },
      ]);
      if (!redirected) {
        placeOrder({
          items: "Winter Jacket + Pantry Box",
          total,
          fulfilment: fulfilment === "pickup" ? "pickup" : "dropoff",
          city: item.city,
          dist: item.dist,
          window: item.window,
          address: "512 Market St, Dock 4, Seattle, WA 98101",
        });
        go("orderConfirm");
      }
    } catch {
      toast("Payment couldn't be started — please try again.", "error");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="pg" style={{ maxWidth: 920 }}>
      <BackLink label="Back to browse" onClick={() => go("individualMarket")} />
      <PageTitle title="Checkout" />
      <div className="split-b" style={{ marginTop: 22 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card style={{ padding: 24 }} hover={false}>
            <SectionLabel mb={16}>FULFILMENT</SectionLabel>
            <Segmented
              options={[
                { value: "delivery", label: "Delivery" },
                { value: "pickup", label: "Pickup" },
              ]}
              value={fulfilment}
              onChange={(v) => setFulfilment(v as "delivery" | "pickup")}
              disabledValues={item.pickupAllowed ? [] : ["pickup"]}
            />
            {fulfilment === "delivery" ? (
              <>
                <Field label="Delivery address" value="88 Cedar Ave, Apt 4, Seattle WA" style={{ marginTop: 18 }} />
                <Field label="Preferred window" value="Sat, 10 AM – 1 PM" style={{ marginTop: 16 }} />
              </>
            ) : (
              <div style={{ marginTop: 18 }}>
                <PickupSummary
                  city={item.city}
                  dist={item.dist}
                  window={item.window}
                  address="512 Market St, Dock 4, Seattle, WA 98101"
                  revealed={false}
                />
              </div>
            )}
          </Card>
          <Card style={{ padding: 24 }} hover={false}>
            <SectionLabel mb={16}>PAYMENT</SectionLabel>
            {paymentsEnabled ? (
              <div style={{ fontSize: 14, color: C.textMute, lineHeight: 1.5 }}>
                You'll be redirected to a secure Stripe Checkout page to pay.
              </div>
            ) : (
              <div style={{ border: `1.5px solid ${C.line}`, borderRadius: 9, padding: "13px 14px", fontSize: 14, color: C.textMute, display: "flex", justifyContent: "space-between" }}>
                <span>•••• •••• •••• 4242</span>
                <span className="mono" style={{ fontSize: 12, color: C.textFaint }}>DEMO</span>
              </div>
            )}
          </Card>
        </div>
        <Card style={{ padding: 24, height: "fit-content" }} hover={false}>
          <div style={{ fontSize: 17, fontWeight: 700 }}>Order summary</div>
          <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              ["Winter Jacket ×1", "$8.00"],
              ["Pantry Box ×1", "$5.00"],
              ["Delivery", fulfilment === "delivery" ? "$3.50" : "—"],
            ].map(([k, v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
                <span style={{ color: C.textMute }}>{k}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.lineSoft}` }}>
            <span style={{ fontSize: 16, fontWeight: 700 }}>Total</span>
            <span style={{ fontSize: 20, fontWeight: 800, color: C.green }}>{total}</span>
          </div>
          <Btn onClick={handlePlaceOrder} disabled={placing} style={{ width: "100%", fontSize: 15, padding: 14, marginTop: 18 }}>
            {placing ? "Starting checkout…" : "Place order"}
          </Btn>
        </Card>
      </div>
    </div>
  );
}

/** Post-purchase confirmation — this is where the full address unlocks. */
export function OrderConfirm() {
  const { go } = useApp();
  const { orders } = useStore();
  const o = orders[0];
  const isPickup = o?.fulfilment === "pickup";
  return (
    <div style={{ padding: "48px 24px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: 560 }}>
        <Card style={{ padding: 36 }} hover={false}>
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: C.greenPale, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }}>
              <Icon d={ICON.check} size={32} color={C.green} strokeWidth={2.4} />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, marginTop: 18 }}>Order confirmed</h1>
            <p style={{ color: C.textMute, fontSize: 15, marginTop: 6 }}>
              {o?.item ?? "Your order"} is reserved for you.
            </p>
          </div>
          <div style={{ marginTop: 24, border: `1px solid ${C.lineSoft}`, borderRadius: 12, overflow: "hidden" }}>
            {[
              ["ORDER", o?.id ?? "#SAC-7742"],
              ["FULFILMENT", isPickup ? "Self pickup" : "Delivery"],
            ].map(([k, v], i, arr) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 18px", borderBottom: i < arr.length - 1 ? `1px solid ${C.lineFaint}` : undefined }}>
                <MonoTag style={{ fontSize: 11 }}>{k}</MonoTag>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
              {isPickup ? "Where to collect" : "Delivery details"}
            </div>
            {isPickup ? (
              <PickupSummary
                city={o?.city ?? "Seattle, WA"}
                dist={o?.dist ?? "0.8 mi away"}
                window={o?.window ?? "Sat, 10 AM – 1 PM"}
                address={o?.address ?? "512 Market St, Dock 4, Seattle, WA 98101"}
                revealed
              />
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10, border: `1px solid ${C.greenPale}`, background: C.greenWash, borderRadius: 10, padding: "12px 14px" }}>
                <Icon d={ICON.truck} size={18} color={C.green} strokeWidth={1.9} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700 }}>Delivery scheduled</div>
                  <div style={{ fontSize: 12.5, color: C.textFaint }}>{o?.window ?? "Sat, 10 AM – 1 PM"} · 88 Cedar Ave, Apt 4</div>
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
            <Btn variant="secondary" onClick={() => go("individualMarket")} style={{ flex: 1, padding: 13 }}>
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
