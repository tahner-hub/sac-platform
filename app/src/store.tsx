import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  ALL_DONATIONS,
  CHAT_MSGS,
  DRAFT_ROWS,
  NEED_ITEMS,
  ORG_ORDER_ROWS,
  REPORTED_ACCOUNTS,
  THREADS,
  type Fulfilment,
  type StatusTone,
} from "./data";

/**
 * Client-side data store backing the end-to-end flows. Persists to
 * localStorage so a session survives refresh. This is the seam where
 * Firestore reads/writes plug in later (see DECISIONS.md) — screens only
 * call the actions below, never touch raw collections.
 */

export interface Donation {
  id: string;
  item: string;
  qty: string;
  status: string;
  recipient: string;
  tone: StatusTone;
  fulfilment: Fulfilment;
  estimatedValue?: string;
  recurringId?: string;
}

export interface Draft {
  id: string;
  item: string;
  qty: string;
  cat: string;
  edited: string;
}

export interface RecurringTemplate {
  id: string;
  item: string;
  qty: string;
  cat: string;
  cadence: "Weekly" | "Bi-Weekly" | "Monthly";
  fulfilment: Fulfilment;
  days: string[];
  window: string;
  nextRun: string;
  active: boolean;
  postsCreated: number;
}

export interface Order {
  id: string;
  item: string;
  from: string;
  qty: string;
  status: string;
  eta: string;
  tone: StatusTone;
  fulfilment?: Fulfilment;
  address?: string;
  city?: string;
  dist?: string;
  window?: string;
  revealed?: boolean;
}

export interface Need {
  id: string;
  org: string;
  item: string;
  needed: number;
  received: number;
  quantityType: string;
  estWeight: string;
  city: string;
  dist: string;
  window: string;
  address: string;
  cat: string;
  catColor: string;
  catBg: string;
  urgency: string;
  urgencyColor: string;
  urgencyBg: string;
  urgencyRank: number;
  notes: string;
}

export interface ChatMsg {
  from: "me" | "them";
  text: string;
  time: string;
}

export interface Thread {
  id: string;
  name: string;
  ctx: string;
  time: string;
  unread: boolean;
  msgs: ChatMsg[];
}

export interface ActiveDelivery {
  id: string;
  title: string;
  weight: string;
  pickup: string;
  drop: string;
  dist: string;
  city: string;
  stage: "picked_up" | "en_route" | "delivered";
  reported?: string;
}

export interface Toast {
  id: number;
  text: string;
  tone?: "ok" | "error";
}

export interface ReportRecord {
  id: string;
  target: string;
  reason: string;
  details: string;
  at: string;
  status: "Open" | "Resolved";
}

interface Store {
  donations: Donation[];
  drafts: Draft[];
  recurring: RecurringTemplate[];
  orders: Order[];
  needs: Need[];
  threads: Thread[];
  activeThreadId: string;
  activeNeedId: string;
  activeDeliveries: ActiveDelivery[];
  driverAvailable: boolean;
  driverCapacity: number;
  deliveriesCompleted: number;
  categories: string[];
  reports: ReportRecord[];
  reportedAccounts: typeof REPORTED_ACCOUNTS;
  toasts: Toast[];

  publishDonation: (d: {
    item: string;
    qty: string;
    estimatedValue: string;
    fulfilment: Fulfilment;
    recurring: boolean;
    cadence: "Weekly" | "Bi-Weekly" | "Monthly";
    cat: string;
    days: string[];
    window: string;
  }) => void;
  saveDraft: (d: { item: string; qty: string; cat: string }) => void;
  publishDraft: (id: string) => void;
  completeDropOff: (id: string) => void;
  toggleRecurring: (id: string) => void;
  removeRecurring: (id: string) => void;

  reserveResource: (r: {
    item: string;
    qty: string;
    from: string;
    fulfilment: Fulfilment;
    city?: string;
    dist?: string;
    window?: string;
    address?: string;
  }) => void;
  placeOrder: (o: { items: string; total: string; fulfilment: Fulfilment; city: string; dist: string; window: string; address: string }) => void;

  postNeed: (n: { item: string; needed: number; quantityType: string; cat: string; urgency: string; notes: string }) => void;
  donateToNeed: (needId: string, amount: number, fulfilment: Fulfilment) => void;
  selectNeed: (id: string) => void;

  selectThread: (id: string) => void;
  sendMessage: (text: string) => void;

  acceptJob: (job: { id: string; title: string; weight: string; pickup: string; drop: string; dist: string; city: string }) => void;
  completeDelivery: (id: string) => void;
  reportDelivery: (id: string, reason: string) => void;
  setDriverAvailable: (on: boolean) => void;
  setDriverCapacity: (lbs: number) => void;

  setCategories: (c: string[]) => void;
  submitReport: (target: string, reason: string, details: string) => void;
  resolveReport: (accountId: string, index: number) => void;

  /** Anything blocking account deactivation (open obligations). */
  deactivationBlockers: () => string[];
  toast: (text: string, tone?: "ok" | "error") => void;
}

const StoreContext = createContext<Store | null>(null);

const now = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
const today = () => new Date().toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });

let idCounter = 4900;
const nextId = () => `#SAC-${idCounter++}`;

const SEED_THREADS: Thread[] = THREADS.map((t, i) => ({
  id: `t${i}`,
  name: t.name,
  ctx: t.ctx,
  time: t.time,
  unread: t.unread,
  msgs: i === 0 ? [...CHAT_MSGS] : [{ from: "them", text: t.snippet, time: t.time }],
}));

const SEED_NEEDS: Need[] = NEED_ITEMS.map((n, i) => ({ ...n, id: `n${i}` }));

const SEED_RECURRING: RecurringTemplate[] = [
  {
    id: "r1",
    item: "Weekly Bakery Surplus",
    qty: "44 lbs",
    cat: "Food",
    cadence: "Weekly",
    fulfilment: "pickup",
    days: ["Fri"],
    window: "4:00 PM – 6:30 PM",
    nextRun: "Fri, Mar 14",
    active: true,
    postsCreated: 26,
  },
  {
    id: "r2",
    item: "Monthly Pantry Clearout",
    qty: "310 lbs",
    cat: "Food",
    cadence: "Monthly",
    fulfilment: "dropoff",
    days: ["Mon"],
    window: "9:00 AM – 11:00 AM",
    nextRun: "Mon, Mar 31",
    active: true,
    postsCreated: 6,
  },
];

const STORAGE_KEY = "sac-store-v2";

export function StoreProvider({ children }: { children: ReactNode }) {
  const persisted = (() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  })();

  const [donations, setDonations] = useState<Donation[]>(
    (persisted?.donations as Donation[]) ?? ALL_DONATIONS.map((d, i) => ({ ...d, id: `d${i}` })),
  );
  const [drafts, setDrafts] = useState<Draft[]>(
    (persisted?.drafts as Draft[]) ?? DRAFT_ROWS.map((d, i) => ({ ...d, id: `dr${i}` })),
  );
  const [recurring, setRecurring] = useState<RecurringTemplate[]>(
    (persisted?.recurring as RecurringTemplate[]) ?? SEED_RECURRING,
  );
  const [orders, setOrders] = useState<Order[]>(
    (persisted?.orders as Order[]) ?? ORG_ORDER_ROWS.map((o, i) => ({ ...o, id: `o${i}` })),
  );
  const [needs, setNeeds] = useState<Need[]>((persisted?.needs as Need[]) ?? SEED_NEEDS);
  const [threads, setThreads] = useState<Thread[]>((persisted?.threads as Thread[]) ?? SEED_THREADS);
  const [activeThreadId, setActiveThreadId] = useState("t0");
  const [activeNeedId, setActiveNeedId] = useState("n0");
  const [activeDeliveries, setActiveDeliveries] = useState<ActiveDelivery[]>(
    (persisted?.activeDeliveries as ActiveDelivery[]) ?? [
      {
        id: "ad1",
        title: "Fresh Produce Run",
        weight: "400 lbs",
        pickup: "Global Grocers Inc.",
        drop: "St. Jude Community Center",
        dist: "9.4 mi · ~19 min",
        city: "Seattle, WA",
        stage: "en_route",
      },
    ],
  );
  const [driverAvailable, setDriverAvailableState] = useState<boolean>(
    (persisted?.driverAvailable as boolean) ?? true,
  );
  const [driverCapacity, setDriverCapacity] = useState<number>(
    (persisted?.driverCapacity as number) ?? 300,
  );
  const [deliveriesCompleted, setDeliveriesCompleted] = useState<number>(
    (persisted?.deliveriesCompleted as number) ?? 18,
  );
  const [categories, setCategories] = useState<string[]>(
    (persisted?.categories as string[]) ?? ["Food", "Clothing", "Hygiene"],
  );
  const [reports, setReports] = useState<ReportRecord[]>((persisted?.reports as ReportRecord[]) ?? []);
  const [reportedAccounts, setReportedAccounts] = useState(
    (persisted?.reportedAccounts as typeof REPORTED_ACCOUNTS) ?? REPORTED_ACCOUNTS,
  );
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          donations, drafts, recurring, orders, needs, threads, activeDeliveries,
          driverAvailable, driverCapacity, deliveriesCompleted, categories, reports, reportedAccounts,
        }),
      );
    } catch {
      // storage unavailable — session just won't persist
    }
  }, [donations, drafts, recurring, orders, needs, threads, activeDeliveries, driverAvailable,
      driverCapacity, deliveriesCompleted, categories, reports, reportedAccounts]);

  const toast = (text: string, tone: "ok" | "error" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  };

  const value: Store = {
    donations, drafts, recurring, orders, needs, threads, activeThreadId, activeNeedId,
    activeDeliveries, driverAvailable, driverCapacity, deliveriesCompleted, categories,
    reports, reportedAccounts, toasts, toast,

    publishDonation: ({ item, qty, estimatedValue, fulfilment, recurring: isRecurring, cadence, cat, days, window }) => {
      const recurringId = isRecurring ? `r${Date.now()}` : undefined;
      setDonations((d) => [
        {
          id: nextId(),
          item: item || "Untitled donation",
          qty: qty || "—",
          status: fulfilment === "dropoff" ? "Pending Drop-off" : "Pending Pickup",
          recipient: "Awaiting match",
          tone: fulfilment === "dropoff" ? "dropoff" : "pending",
          fulfilment,
          estimatedValue,
          recurringId,
        },
        ...d,
      ]);
      if (isRecurring && recurringId) {
        setRecurring((r) => [
          {
            id: recurringId,
            item: item || "Untitled donation",
            qty: qty || "—",
            cat,
            cadence,
            fulfilment,
            days,
            window,
            nextRun: cadence === "Weekly" ? "Next week" : cadence === "Bi-Weekly" ? "In 2 weeks" : "Next month",
            active: true,
            postsCreated: 1,
          },
          ...r,
        ]);
      }
      toast(
        isRecurring
          ? `Published — this listing will re-post ${cadence.toLowerCase()} automatically.`
          : "Donation published — organizations get priority access.",
      );
    },

    saveDraft: ({ item, qty, cat }) => {
      setDrafts((d) => [{ id: nextId(), item: item || "Untitled draft", qty: qty || "—", cat, edited: "Just now" }, ...d]);
      toast("Draft saved.");
    },

    publishDraft: (id) => {
      setDrafts((ds) => {
        const draft = ds.find((d) => d.id === id);
        if (draft) {
          setDonations((dons) => [
            { id: nextId(), item: draft.item, qty: draft.qty, status: "Pending Pickup", recipient: "Awaiting match", tone: "pending", fulfilment: "pickup" },
            ...dons,
          ]);
          toast(`"${draft.item}" published.`);
        }
        return ds.filter((d) => d.id !== id);
      });
    },

    completeDropOff: (id) => {
      setDonations((ds) =>
        ds.map((d) =>
          d.id === id ? { ...d, status: "Delivered", tone: "delivered" as StatusTone } : d,
        ),
      );
      toast("Drop-off confirmed — thank you for delivering this donation yourself.");
    },

    toggleRecurring: (id) => {
      setRecurring((rs) => {
        const t = rs.find((r) => r.id === id);
        if (t) toast(t.active ? `Paused "${t.item}" — no new posts will be created.` : `Resumed "${t.item}".`);
        return rs.map((r) => (r.id === id ? { ...r, active: !r.active } : r));
      });
    },

    removeRecurring: (id) => {
      setRecurring((rs) => {
        const t = rs.find((r) => r.id === id);
        if (t) toast(`Removed recurring donation "${t.item}".`);
        return rs.filter((r) => r.id !== id);
      });
    },

    reserveResource: ({ item, qty, from, fulfilment, city, dist, window, address }) => {
      setOrders((o) => [
        {
          id: nextId(),
          item,
          from,
          qty,
          status: "Reserved",
          eta: fulfilment === "pickup" ? "Self pickup" : "Fri, Mar 14",
          tone: "pending",
          fulfilment,
          city,
          dist,
          window,
          address,
          revealed: false,
        },
        ...o,
      ]);
      toast(`Reserved ${qty} — held for your organization.`);
    },

    placeOrder: ({ items, total, fulfilment, city, dist, window, address }) => {
      setOrders((o) => [
        {
          id: nextId(),
          item: items,
          from: "Public Marketplace",
          qty: "1 order",
          status: "Reserved",
          eta: window,
          tone: "pending",
          fulfilment,
          city,
          dist,
          window,
          address,
          revealed: true, // order complete → full address unlocked
        },
        ...o,
      ]);
      toast(`Order placed — ${total}. Pickup address unlocked.`);
    },

    postNeed: ({ item, needed, quantityType, cat, urgency, notes }) => {
      const high = urgency === "High need";
      setNeeds((n) => [
        {
          id: nextId(),
          org: "The Haven Center",
          item: item || "Untitled request",
          needed,
          received: 0,
          quantityType: quantityType || "units",
          estWeight: "—",
          city: "Seattle, WA",
          dist: "1.9 mi",
          window: "Mon–Fri · 9 AM – 5 PM",
          address: "210 Elm St, Seattle, WA 98101",
          cat,
          catColor: "#2A6FDB",
          catBg: "#EAF1FF",
          urgency,
          urgencyColor: high ? "#BA1A1A" : "#E08A1E",
          urgencyBg: high ? "#FFEDEA" : "#FFF3E0",
          urgencyRank: high ? 1 : 2,
          notes,
        },
        ...n,
      ]);
      toast("Request posted — donors can now see it.");
    },

    donateToNeed: (needId, amount, fulfilment) => {
      const need = needs.find((n) => n.id === needId);
      setNeeds((ns) =>
        ns.map((n) =>
          n.id === needId ? { ...n, received: Math.min(n.needed, n.received + amount) } : n,
        ),
      );
      setDonations((d) => [
        {
          id: nextId(),
          item: need ? need.item : "Direct donation",
          qty: `${amount} ${need?.quantityType ?? "units"}`,
          status: fulfilment === "dropoff" ? "Pending Drop-off" : "Pending Pickup",
          recipient: need ? need.org : "Organization",
          tone: fulfilment === "dropoff" ? "dropoff" : "pending",
          fulfilment,
        },
        ...d,
      ]);
      toast(`Donation sent directly to ${need ? need.org : "the organization"}.`);
    },

    selectNeed: setActiveNeedId,

    selectThread: (id) => {
      setActiveThreadId(id);
      setThreads((ts) => ts.map((t) => (t.id === id ? { ...t, unread: false } : t)));
    },

    sendMessage: (text) => {
      if (!text.trim()) return;
      setThreads((ts) =>
        ts.map((t) =>
          t.id === activeThreadId
            ? { ...t, msgs: [...t.msgs, { from: "me", text, time: now() }], time: "now" }
            : t,
        ),
      );
    },

    acceptJob: (job) => {
      setActiveDeliveries((ds) => [
        { id: job.id + Date.now(), title: job.title, weight: job.weight, pickup: job.pickup, drop: job.drop, dist: job.dist, city: job.city, stage: "picked_up" },
        ...ds,
      ]);
      toast(`Job accepted — ${job.title}. Thank you for volunteering!`);
    },

    completeDelivery: (id) => {
      setActiveDeliveries((ds) => ds.filter((d) => d.id !== id));
      setDeliveriesCompleted((n) => n + 1);
      setOrders((o) =>
        o.map((ord) => (ord.tone === "transit" ? { ...ord, status: "Delivered", tone: "delivered" as StatusTone, eta: "Delivered" } : ord)),
      );
      toast("Delivery confirmed — thank you for volunteering!");
    },

    reportDelivery: (id, reason) => {
      setActiveDeliveries((ds) => ds.map((d) => (d.id === id ? { ...d, reported: reason } : d)));
      setReports((r) => [
        { id: nextId(), target: "delivery", reason, details: "", at: today(), status: "Open" },
        ...r,
      ]);
      toast("Issue reported — our team will reassign this delivery.", "error");
    },

    setDriverAvailable: (on) => {
      setDriverAvailableState(on);
      toast(on ? "You're available for deliveries." : "You're offline — no new assignments.");
    },

    setDriverCapacity,

    setCategories: (c) => {
      setCategories(c);
      toast("Resource categories saved.");
    },

    submitReport: (target, reason, details) => {
      setReports((r) => [{ id: nextId(), target, reason, details, at: today(), status: "Open" }, ...r]);
      toast(`Report on ${target} submitted to Trust & Safety.`);
    },

    resolveReport: (accountId, index) => {
      setReportedAccounts((accts) =>
        accts.map((a) =>
          a.id === accountId
            ? { ...a, reasons: a.reasons.map((r, i) => (i === index ? { ...r, status: "Resolved" } : r)) }
            : a,
        ),
      );
      toast("Report marked resolved.");
    },

    deactivationBlockers: () => {
      const blockers: string[] = [];
      const openDonations = donations.filter((d) => d.tone === "pending" || d.tone === "dropoff" || d.tone === "transit");
      if (openDonations.length) {
        blockers.push(`${openDonations.length} donation${openDonations.length === 1 ? "" : "s"} still awaiting handoff or delivery`);
      }
      const openOrders = orders.filter((o) => o.tone !== "delivered" && o.tone !== "declined");
      if (openOrders.length) {
        blockers.push(`${openOrders.length} order${openOrders.length === 1 ? "" : "s"} not yet received`);
      }
      if (activeDeliveries.length) {
        blockers.push(`${activeDeliveries.length} delivery assignment${activeDeliveries.length === 1 ? "" : "s"} in progress`);
      }
      const activeRecurring = recurring.filter((r) => r.active);
      if (activeRecurring.length) {
        blockers.push(`${activeRecurring.length} active recurring donation${activeRecurring.length === 1 ? "" : "s"} still scheduled`);
      }
      return blockers;
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
