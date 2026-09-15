import { ICON, type IconName } from "./icons";
import type { Role, Screen } from "./state";

export type StatusTone = "pending" | "transit" | "delivered" | "declined" | "dropoff";

export const STATUS_TONE: Record<StatusTone, { color: string; bg: string }> = {
  pending: { color: "#E08A1E", bg: "#FFF3E0" },
  transit: { color: "#2A6FDB", bg: "#EAF1FF" },
  delivered: { color: "#0A7D52", bg: "#E6FBF1" },
  declined: { color: "#BA1A1A", bg: "#FFEDEA" },
  dropoff: { color: "#8A5CF6", bg: "#F1EBFF" },
};

export const NAV: Record<Role, { label: string; icon: IconName; screen: Screen }[]> = {
  donor: [
    { label: "Dashboard", icon: "grid", screen: "donorDash" },
    { label: "Active Donations", icon: "box", screen: "activeDonations" },
    { label: "Create Donation", icon: "plus", screen: "createDonation" },
    { label: "Recurring", icon: "recycle", screen: "recurringManage" },
    { label: "Community Requests", icon: "search", screen: "discover" },
    { label: "Cash Donations", icon: "heart", screen: "cashDonations" },
    { label: "Messages", icon: "users", screen: "messages" },
    { label: "Impact", icon: "chart", screen: "impact" },
    { label: "Records", icon: "clock", screen: "records" },
  ],
  org: [
    { label: "Dashboard", icon: "grid", screen: "orgDash" },
    { label: "Marketplace", icon: "cart", screen: "marketplace" },
    { label: "Incoming Orders", icon: "box", screen: "orgOrders" },
    { label: "Needs Posted", icon: "clipboard", screen: "orgNeeds" },
    { label: "Messages", icon: "users", screen: "messages" },
    { label: "Impact", icon: "chart", screen: "impact" },
    { label: "Records", icon: "clock", screen: "records" },
  ],
  individual: [
    { label: "Browse", icon: "cart", screen: "individualMarket" },
    { label: "My Orders", icon: "box", screen: "orgOrders" },
    { label: "Community Requests", icon: "search", screen: "discover" },
    { label: "Cash Donations", icon: "heart", screen: "cashDonations" },
    { label: "Messages", icon: "users", screen: "messages" },
    { label: "Records", icon: "clock", screen: "records" },
  ],
  driver: [
    { label: "Dashboard", icon: "grid", screen: "driverDash" },
    { label: "Discover Jobs", icon: "clipboard", screen: "pendingJobs" },
    { label: "Active Deliveries", icon: "map", screen: "activeRoute" },
    { label: "Messages", icon: "users", screen: "messages" },
    { label: "Records", icon: "clock", screen: "records" },
  ],
  admin: [
    { label: "Overview", icon: "grid", screen: "adminOverview" },
    { label: "Approvals", icon: "shield", screen: "approvals" },
    { label: "Deactivations", icon: "userX", screen: "adminUsers" },
    { label: "Impact", icon: "chart", screen: "impact" },
  ],
};

export const ROLE_LABEL: Record<Role, string> = {
  donor: "DONOR PORTAL",
  org: "ORGANIZATION",
  individual: "MARKETPLACE",
  driver: "VOLUNTEER DRIVER",
  admin: "ADMIN CONSOLE",
};

export const ROLE_TABS: { role: Role; label: string }[] = [
  { role: "donor", label: "Donor" },
  { role: "org", label: "Org" },
  { role: "individual", label: "Indiv" },
  { role: "driver", label: "Driver" },
  { role: "admin", label: "Admin" },
];

export interface RoleCard {
  key: Role;
  title: string;
  desc: string;
  cta: string;
  iconPath: string;
  iconBg: string;
  iconColor: string;
  primary: boolean;
  note?: string;
}

export const ROLE_CARDS: RoleCard[] = [
  {
    key: "donor",
    title: "Corporate Donor",
    desc: "Donate surplus inventory and track your social and tax impact.",
    cta: "Register as Donor",
    iconPath: ICON.box,
    iconBg: "#E6FBF1",
    iconColor: "#0A7D52",
    primary: true,
  },
  {
    key: "org",
    title: "Receiving Organization",
    desc: "Nonprofits and shelters reserve needed resources with priority access.",
    cta: "Apply for Access",
    iconPath: ICON.shield,
    iconBg: "#E6FBF1",
    iconColor: "#0A7D52",
    primary: false,
  },
  {
    key: "driver",
    title: "Volunteer Driver",
    desc: "Deliver donations on your own schedule — set your capacity and availability.",
    cta: "Sign Up to Volunteer",
    iconPath: ICON.truck,
    iconBg: "#EAF1FF",
    iconColor: "#2A6FDB",
    primary: false,
    note: "Volunteer role — unpaid. S.A.C. does not process driver payments.",
  },
  {
    key: "individual",
    title: "Individual",
    desc: "Browse remaining resources and order affordable essentials for personal use.",
    cta: "Browse Items",
    iconPath: ICON.cart,
    iconBg: "#EAF1FF",
    iconColor: "#2A6FDB",
    primary: false,
  },
];

export const HOW_IT_WORKS_ROLES = [
  {
    key: "donor" as Role,
    title: "Corporate Donor",
    tagline: "Turn surplus into impact.",
    iconPath: ICON.box,
    iconBg: "#E6FBF1",
    iconColor: "#0A7D52",
    steps: [
      "List surplus inventory with quantity in lbs, condition, and pickup or drop-off window.",
      "Get matched with an organization or watch it open to individuals.",
      "Message the recipient to confirm handoff, then hand off to a volunteer driver.",
      "Track status and see your tax and social impact reporting.",
    ],
    cta: "Register as Donor",
    primary: true,
  },
  {
    key: "org" as Role,
    title: "Receiving Organization",
    tagline: "Reserve what your community needs.",
    iconPath: ICON.shield,
    iconBg: "#E6FBF1",
    iconColor: "#0A7D52",
    steps: [
      "Get verified for priority access to incoming donations.",
      "Browse the marketplace or post specific community requests.",
      "Reserve resources and message donors to coordinate pickup.",
      "Receive deliveries and distribute to the community.",
    ],
    cta: "Apply for Access",
    primary: false,
  },
  {
    key: "driver" as Role,
    title: "Volunteer Driver",
    tagline: "Move goods where they need to go.",
    iconPath: ICON.truck,
    iconBg: "#EAF1FF",
    iconColor: "#2A6FDB",
    steps: [
      "Set your availability and vehicle capacity in lbs.",
      "Discover open volunteer jobs with pickup and drop-off details.",
      "Accept a job and message both sides while en route.",
      "Confirm delivery and watch your community impact add up.",
    ],
    cta: "Sign Up to Volunteer",
    primary: false,
  },
  {
    key: "individual" as Role,
    title: "Individual",
    tagline: "Access affordable essentials.",
    iconPath: ICON.cart,
    iconBg: "#EAF1FF",
    iconColor: "#2A6FDB",
    steps: [
      "Browse the marketplace or community requests from local orgs.",
      "Order items left over after organizations reserve theirs.",
      "Message the donor or org to arrange pickup or delivery.",
      "Track order status until it arrives.",
    ],
    cta: "Browse Items",
    primary: false,
  },
];

/** Fulfilment method chosen by the donor when creating a listing. */
export type Fulfilment = "pickup" | "dropoff";

export const ALL_DONATIONS = [
  { item: "Assorted Pastries", qty: "44 lbs", status: "Pending Pickup", recipient: "The Haven Center", tone: "pending" as StatusTone, fulfilment: "pickup" as Fulfilment },
  { item: "Winter Coats", qty: "180 lbs", status: "Pending Drop-off", recipient: "Hope Harbor Shelter", tone: "dropoff" as StatusTone, fulfilment: "dropoff" as Fulfilment },
  { item: "Canned Vegetables", qty: "110 lbs", status: "In Transit", recipient: "Sunshine Mission", tone: "transit" as StatusTone, fulfilment: "pickup" as Fulfilment },
  { item: "Excess Produce", qty: "77 lbs", status: "In Transit", recipient: "Metro Food Bank", tone: "transit" as StatusTone, fulfilment: "pickup" as Fulfilment },
  { item: "Office Chairs", qty: "320 lbs", status: "Delivered", recipient: "Community Center 7", tone: "delivered" as StatusTone, fulfilment: "pickup" as Fulfilment },
  { item: "Hygiene Kits", qty: "225 lbs", status: "Pending Drop-off", recipient: "St. Jude Mobile Unit", tone: "dropoff" as StatusTone, fulfilment: "dropoff" as Fulfilment },
];

export const CAT_BREAKDOWN = [
  { label: "Food", pct: 46, items: 5920 },
  { label: "Clothing", pct: 24, items: 3088 },
  { label: "Medical Supplies", pct: 18, items: 2316 },
  { label: "Furniture & Other", pct: 12, items: 1544 },
];

/** Monthly diverted waste in lbs — used by the hoverable impact chart. */
export const DIVERTED_SERIES = [
  { month: "JUN", lbs: 6400, items: 820, color: "#D8F6E8", h: 35 },
  { month: "JUL", lbs: 8800, items: 1130, color: "#A9EFD0", h: 48 },
  { month: "AUG", lbs: 7700, items: 990, color: "#A9EFD0", h: 42 },
  { month: "SEP", lbs: 11000, items: 1410, color: "#6CF8BB", h: 60 },
  { month: "OCT", lbs: 10100, items: 1300, color: "#6CF8BB", h: 55 },
  { month: "NOV", lbs: 13200, items: 1700, color: "#34C98A", h: 72 },
  { month: "DEC", lbs: 14700, items: 1890, color: "#34C98A", h: 80 },
  { month: "JAN", lbs: 18300, items: 2350, color: "#0A7D52", h: 100 },
];

export const STEP_LABELS = ["ACCOUNT", "VERIFY", "PREFERENCES", "REVIEW"];

export const DOCS: Record<Role, [string, string][]> = {
  donor: [
    ["Business registration", "PDF or image · up to 10MB"],
    ["EIN / Tax ID confirmation", "Required for tax receipts"],
  ],
  org: [
    ["501(c)(3) determination letter", "IRS nonprofit status"],
    ["EIN / Tax ID confirmation", "Required for priority access"],
  ],
  driver: [
    ["Driver's license", "Front and back"],
    ["Vehicle insurance", "Active policy document"],
  ],
  individual: [["Government ID", "For pickup verification"]],
  admin: [["Staff authorization", "Internal approval"]],
};

export const PREF_TOGGLES = [
  { label: "List my organization publicly", desc: "Appear in the partner directory", on: true },
  { label: "Email notifications for new matches", desc: "Get alerted when relevant resources appear", on: true },
  { label: "Recurring availability reminders", desc: "Weekly nudge to refresh listings", on: false },
];

export const RESOURCE_CATEGORIES = [
  "Food",
  "Clothing",
  "Medical",
  "Hygiene",
  "Furniture",
  "Office Supplies",
  "Other",
];

export const ORG_ORDER_ROWS = [
  { item: "Canned Vegetables", from: "Global Grocers", qty: "110 lbs", status: "In Transit", eta: "Today 4 PM", tone: "transit" as StatusTone },
  { item: "Hygiene Kits", from: "CleanCo", qty: "225 lbs", status: "Reserved", eta: "Mar 14", tone: "pending" as StatusTone },
  { item: "Winter Coats", from: "NorthGear", qty: "180 lbs", status: "Delivered", eta: "Mar 10", tone: "delivered" as StatusTone },
  { item: "Medical Supplies", from: "Global Med-Link", qty: "410 lbs", status: "In Transit", eta: "Today 6 PM", tone: "transit" as StatusTone },
];

export const CAT = {
  food: { cat: "Food", catColor: "#0A7D52", catBg: "#E6FBF1" },
  med: { cat: "Medical", catColor: "#2A6FDB", catBg: "#EAF1FF" },
  cloth: { cat: "Clothing", catColor: "#E08A1E", catBg: "#FFF3E0" },
};

export interface MarketItem {
  id: string;
  title: string;
  qty: string;
  dist: string;
  city: string;
  donor: string;
  recurring: boolean;
  cadence?: string;
  pickupAllowed: boolean;
  window: string;
  cat: string;
  catColor: string;
  catBg: string;
}

/** Marketplace listings. `recurring` items are visible to organizations only. */
export const MARKET_ITEMS: MarketItem[] = [
  {
    id: "m1",
    title: "Regional Food Bank Bulk Transfer",
    qty: "1,240 lbs",
    dist: "2.1 mi",
    city: "Seattle, WA",
    donor: "Seattle Warehouse A",
    recurring: true,
    cadence: "Weekly",
    pickupAllowed: true,
    window: "Mar 14 · 9 AM – 12 PM",
    ...CAT.food,
  },
  {
    id: "m2",
    title: "Emergency Clinic Resupply",
    qty: "450 lbs",
    dist: "4.0 mi",
    city: "Bellevue, WA",
    donor: "Global Med-Link Hub",
    recurring: false,
    pickupAllowed: true,
    window: "Mar 15 · 1 – 4 PM",
    ...CAT.med,
  },
  {
    id: "m3",
    title: "Winter Coats & Outerwear",
    qty: "180 lbs",
    dist: "1.4 mi",
    city: "Seattle, WA",
    donor: "NorthGear Retail",
    recurring: false,
    pickupAllowed: false,
    window: "Mar 14 · 10 AM – 2 PM",
    ...CAT.cloth,
  },
  {
    id: "m4",
    title: "Fresh Produce Surplus",
    qty: "77 lbs",
    dist: "3.2 mi",
    city: "Renton, WA",
    donor: "Metro Markets",
    recurring: true,
    cadence: "Weekly",
    pickupAllowed: true,
    window: "Fri · 4 – 6 PM",
    ...CAT.food,
  },
  {
    id: "m5",
    title: "Hygiene & Care Kits",
    qty: "225 lbs",
    dist: "3.4 mi",
    city: "Tukwila, WA",
    donor: "CleanCo Distribution",
    recurring: false,
    pickupAllowed: true,
    window: "Mar 16 · 9 – 11 AM",
    ...CAT.med,
  },
  {
    id: "m6",
    title: "School Supply Bundle",
    qty: "140 lbs",
    dist: "5.1 mi",
    city: "Kent, WA",
    donor: "OfficePlus",
    recurring: false,
    pickupAllowed: true,
    window: "Mar 17 · 12 – 3 PM",
    ...CAT.cloth,
  },
];

export const PUBLIC_ITEMS = [
  { title: "Winter Jacket", dist: "0.8 mi away", city: "Seattle, WA", price: "$8.00", window: "Sat, 10 AM – 1 PM", pickupAllowed: true },
  { title: "Pantry Box", dist: "1.2 mi away", city: "Seattle, WA", price: "$5.00", window: "Sat, 9 AM – 12 PM", pickupAllowed: true },
  { title: "Office Chair", dist: "2.0 mi away", city: "Bellevue, WA", price: "$12.00", window: "Sun, 11 AM – 3 PM", pickupAllowed: true },
  { title: "Hygiene Kit", dist: "0.5 mi away", city: "Seattle, WA", price: "$3.00", window: "Sat, 10 AM – 2 PM", pickupAllowed: false },
  { title: "Kids Clothing Set", dist: "1.7 mi away", city: "Renton, WA", price: "$6.00", window: "Sat, 1 – 4 PM", pickupAllowed: true },
  { title: "Desk Lamp", dist: "2.4 mi away", city: "Kent, WA", price: "$4.00", window: "Sun, 10 AM – 1 PM", pickupAllowed: true },
  { title: "Canned Goods (6)", dist: "0.9 mi away", city: "Seattle, WA", price: "$4.50", window: "Sat, 9 AM – 5 PM", pickupAllowed: true },
  { title: "Blanket", dist: "1.1 mi away", city: "Seattle, WA", price: "$7.00", window: "Sat, 12 – 4 PM", pickupAllowed: true },
];

export const ADMIN_ACTIVITY = [
  { text: "Sunshine Rescue Mission applied for access", time: "12 min ago", dot: "#E08A1E" },
  { text: "Global Grocers published 3 new donations", time: "1 hr ago", dot: "#0A7D52" },
  { text: "Volunteer driver City Fresh joined the network", time: "3 hrs ago", dot: "#2A6FDB" },
  { text: "10,000 lbs diverted milestone reached", time: "Today", dot: "#0A7D52" },
];

export const APPROVAL_QUEUE = [
  { name: "Sunshine Rescue Mission", type: "Organization", detail: "Nonprofit · 501(c)(3) · Seattle, WA", tagColor: "#0A7D52", tagBg: "#E6FBF1" },
  { name: "NorthGear Retail", type: "Donor", detail: "Corporate donor · Apparel surplus", tagColor: "#2A6FDB", tagBg: "#EAF1FF" },
  { name: "Marcus Lee", type: "Driver", detail: "Volunteer driver · License + insurance", tagColor: "#E08A1E", tagBg: "#FFF3E0" },
  { name: "Hope Harbor Shelter", type: "Organization", detail: "Nonprofit · Emergency housing · Tacoma", tagColor: "#0A7D52", tagBg: "#E6FBF1" },
  { name: "CleanCo Distribution", type: "Donor", detail: "Wholesaler · Hygiene products", tagColor: "#2A6FDB", tagBg: "#EAF1FF" },
];

export const RECORDS = [
  { id: "#4821", desc: "Assorted Pastries donation", date: "Mar 12, 2026", status: "Pending", value: "44 lbs", tone: "pending" as StatusTone },
  { id: "#4799", desc: "Canned Vegetables delivered", date: "Mar 11, 2026", status: "Delivered", value: "110 lbs", tone: "delivered" as StatusTone },
  { id: "#4780", desc: "Winter Coats delivered", date: "Mar 10, 2026", status: "Delivered", value: "180 lbs", tone: "delivered" as StatusTone },
  { id: "#4763", desc: "Office Chairs delivered", date: "Mar 9, 2026", status: "Delivered", value: "320 lbs", tone: "delivered" as StatusTone },
  { id: "#4751", desc: "Hygiene Kits in transit", date: "Mar 9, 2026", status: "In Transit", value: "225 lbs", tone: "transit" as StatusTone },
  { id: "#4742", desc: "Fresh Produce delivered", date: "Mar 8, 2026", status: "Delivered", value: "77 lbs", tone: "delivered" as StatusTone },
  { id: "#4730", desc: "Medical Supplies declined", date: "Mar 7, 2026", status: "Declined", value: "410 lbs", tone: "declined" as StatusTone },
];

export const DRAFT_ROWS = [
  { item: "Assorted Pastries", qty: "44 lbs", cat: "Food · Bakery", edited: "2 hrs ago" },
  { item: "Refurbished Laptops", qty: "96 lbs", cat: "Office Supplies", edited: "Yesterday" },
  { item: "Baby Formula Cases", qty: "150 lbs", cat: "Medical", edited: "Mar 9" },
];

export const RECURRING_DONOR_LIST = [
  { name: "Global Grocers Inc.", cat: "Food · Produce · Bakery", cadence: "Weekly", next: "Fri, Mar 14", vol: "~400 lbs / drop" },
  { name: "CleanCo Distribution", cat: "Hygiene · Household", cadence: "Bi-Weekly", next: "Mon, Mar 17", vol: "225 lbs / drop" },
  { name: "NorthGear Retail", cat: "Clothing · Outerwear", cadence: "Monthly", next: "Mar 28", vol: "180 lbs / drop" },
  { name: "Metro Markets", cat: "Food · Dairy", cadence: "Weekly", next: "Thu, Mar 13", vol: "660 lbs / drop" },
];

export const THREADS = [
  { name: "Global Grocers Inc.", ctx: "Re: Regional Food Bank Bulk Transfer", snippet: "Dock 4 is open until 6 PM for pickup.", time: "2m", unread: true, active: true },
  { name: "CleanCo Distribution", ctx: "Re: Hygiene & Care Kits reservation", snippet: "We can hold the 225 lbs until Friday.", time: "1h", unread: false, active: false },
  { name: "NorthGear Retail", ctx: "Re: Winter Coats order #SAC-7711", snippet: "Confirmed — volunteer driver assigned for tomorrow.", time: "Yesterday", unread: false, active: false },
];

export const CHAT_MSGS = [
  { from: "them" as const, text: "Hi! Thanks for reserving the bulk food transfer. Just confirming pickup details.", time: "3:40 PM" },
  { from: "me" as const, text: "Great — is the loading dock accessible for a box truck?", time: "3:42 PM" },
  { from: "them" as const, text: "Yes, Dock 4 is open until 6 PM. Ask for the warehouse lead on arrival.", time: "3:44 PM" },
];

export const NOTIFICATIONS = [
  { title: "Donation reserved", body: "The Haven Center reserved your Assorted Pastries.", time: "12m", iconBg: "#E6FBF1", iconColor: "#0A7D52", iconPath: ICON.check, bg: "#F6FBF8" },
  { title: "Volunteer driver assigned", body: "Marcus Lee is en route to Seattle Warehouse A.", time: "1h", iconBg: "#EAF1FF", iconColor: "#2A6FDB", iconPath: "M1 4h13v11H1z M14 8h4l3 3v4h-7", bg: "#fff" },
  { title: "Delivery completed", body: "Canned Vegetables delivered to Sunshine Mission.", time: "3h", iconBg: "#E6FBF1", iconColor: "#0A7D52", iconPath: ICON.check, bg: "#fff" },
  { title: "New match available", body: "A medical supply listing matches your preferences.", time: "5h", iconBg: "#FFF3E0", iconColor: "#E08A1E", iconPath: ICON.bellSimple, bg: "#fff" },
  { title: "Impact milestone", body: "You reached Gold Tier impact this quarter.", time: "1d", iconBg: "#E6FBF1", iconColor: "#0A7D52", iconPath: ICON.star, bg: "#fff" },
];

/** Volunteer delivery jobs — no payouts (volunteer-only programme). */
export const JOBS = [
  { id: "j1", title: "Regional Food Bank Bulk Transfer", weight: "1,240 lbs", size: "3 pallets", pickup: "Seattle WH-A", drop: "Tacoma CC", dist: "18.4 mi · ~34 min", city: "Seattle → Tacoma, WA", ...CAT.food },
  { id: "j2", title: "Emergency Clinic Resupply", weight: "450 lbs", size: "1 half-pallet", pickup: "Med-Link Hub", drop: "St. Jude Unit", dist: "7.2 mi · ~16 min", city: "Bellevue → Seattle, WA", ...CAT.med },
  { id: "j3", title: "School Supply Bundle", weight: "140 lbs", size: "Small van", pickup: "OfficePlus", drop: "District 4", dist: "5.1 mi · ~12 min", city: "Kent, WA", ...CAT.cloth },
  { id: "j4", title: "Blanket & Tenting Gear", weight: "890 lbs", size: "2 pallets", pickup: "NorthGear", drop: "Cold Response", dist: "11.6 mi · ~23 min", city: "Seattle → Burien, WA", ...CAT.cloth },
];

export const CASH_ORGS = [
  { name: "The Haven Center", desc: "Emergency shelter & transitional housing for families in Seattle.", platform: "Donates via Givebutter", url: "https://givebutter.com" },
  { name: "Sunshine Rescue Mission", desc: "Meals, recovery programs, and street outreach since 1998.", platform: "Donates via Classy", url: "https://classy.org" },
  { name: "Hope Harbor Shelter", desc: "Emergency housing and case management in Tacoma.", platform: "Donates via PayPal Giving", url: "https://paypal.com" },
  { name: "Regional Food Bank", desc: "Distributing meals to 40+ partner pantries region-wide.", platform: "Donates via Donorbox", url: "https://donorbox.org" },
];

/**
 * Community requests. `received` / `needed` drive the "60/100 units" progress
 * display; `quantityType` is set by the org and shown read-only to donors.
 */
export const NEED_ITEMS = [
  {
    org: "The Haven Center",
    item: "Winter Coats (Adult, all sizes)",
    needed: 100,
    received: 60,
    quantityType: "units",
    estWeight: "~2 lbs each",
    city: "Seattle, WA",
    dist: "1.9 mi",
    window: "Mon–Fri · 9 AM – 5 PM",
    address: "210 Elm St, Seattle, WA 98101",
    cat: "Clothing",
    catColor: "#2A6FDB",
    catBg: "#EAF1FF",
    urgency: "High need",
    urgencyColor: "#BA1A1A",
    urgencyBg: "#FFEDEA",
    urgencyRank: 1,
    notes: "Any condition accepted — clean and wearable is all we ask.",
  },
  {
    org: "Sunshine Rescue Mission",
    item: "Canned Proteins & Dry Goods",
    needed: 300,
    received: 118,
    quantityType: "lbs",
    estWeight: "by weight",
    city: "Seattle, WA",
    dist: "3.4 mi",
    window: "Tue–Sat · 8 AM – 2 PM",
    address: "88 Harbor Ave, Seattle, WA 98134",
    cat: "Food",
    catColor: "#0A7D52",
    catBg: "#E6FBF1",
    urgency: "Ongoing",
    urgencyColor: "#E08A1E",
    urgencyBg: "#FFF3E0",
    urgencyRank: 2,
    notes: "Unopened, in-date shelf-stable goods only.",
  },
  {
    org: "Hope Harbor Shelter",
    item: "Baby Formula & Diapers",
    needed: 40,
    received: 9,
    quantityType: "cases",
    estWeight: "~12 lbs each",
    city: "Tacoma, WA",
    dist: "12.6 mi",
    window: "Mon–Thu · 10 AM – 4 PM",
    address: "1400 Pacific Ave, Tacoma, WA 98402",
    cat: "Medical",
    catColor: "#8A5CF6",
    catBg: "#F1EBFF",
    urgency: "High need",
    urgencyColor: "#BA1A1A",
    urgencyBg: "#FFEDEA",
    urgencyRank: 1,
    notes: "Sealed packaging required. Sizes newborn–4 most needed.",
  },
  {
    org: "Regional Food Bank",
    item: "Reusable Grocery Totes",
    needed: 150,
    received: 150,
    quantityType: "units",
    estWeight: "~0.5 lbs each",
    city: "Renton, WA",
    dist: "8.2 mi",
    window: "Mon–Fri · 7 AM – 3 PM",
    address: "600 Rainier Ave, Renton, WA 98057",
    cat: "Supplies",
    catColor: "#5B6472",
    catBg: "#EEF1F6",
    urgency: "Fulfilled",
    urgencyColor: "#0A7D52",
    urgencyBg: "#E6FBF1",
    urgencyRank: 3,
    notes: "Thank you — this request has been fully met.",
  },
];

/** Report reasons vary by what is being reported. */
export const REPORT_REASONS: Record<"listing" | "order" | "delivery", string[]> = {
  listing: [
    "Item not as described",
    "Prohibited or unsafe item",
    "Suspected fraud or scam",
    "Other",
  ],
  order: [
    "Item was never delivered",
    "Delivery was late or incomplete",
    "Items arrived damaged or unusable",
    "Item not as described",
    "Other",
  ],
  delivery: [
    "Cannot complete — pickup unavailable",
    "Cannot complete — load exceeds my capacity",
    "Cannot complete — drop-off site closed or unreachable",
    "Items damaged or unsafe to transport",
    "Other",
  ],
};

/** Admin: accounts that have received reports (drives the triage table). */
export const REPORTED_ACCOUNTS = [
  {
    id: "u-341",
    name: "QuickMart Wholesale",
    role: "Donor",
    email: "ops@quickmart.example",
    city: "Kent, WA",
    reports: 4,
    lastReport: "Mar 12, 2026",
    severity: "High",
    reasons: [
      { reason: "Item was never delivered", by: "Hope Harbor Shelter", date: "Mar 12, 2026", status: "Open" },
      { reason: "Item not as described", by: "The Haven Center", date: "Mar 8, 2026", status: "Open" },
      { reason: "Items arrived damaged or unusable", by: "Metro Food Bank", date: "Mar 2, 2026", status: "Resolved" },
      { reason: "Delivery was late or incomplete", by: "Sunshine Rescue Mission", date: "Feb 24, 2026", status: "Resolved" },
    ],
  },
  {
    id: "u-118",
    name: "Dana Whitfield",
    role: "Individual",
    email: "dana.w@example.com",
    city: "Seattle, WA",
    reports: 2,
    lastReport: "Mar 11, 2026",
    severity: "Medium",
    reasons: [
      { reason: "Suspected fraud or scam", by: "NorthGear Retail", date: "Mar 11, 2026", status: "Open" },
      { reason: "Item not as described", by: "CleanCo Distribution", date: "Mar 1, 2026", status: "Resolved" },
    ],
  },
  {
    id: "u-902",
    name: "Marcus Lee",
    role: "Driver",
    email: "m.lee@example.com",
    city: "Tacoma, WA",
    reports: 1,
    lastReport: "Mar 6, 2026",
    severity: "Low",
    reasons: [
      { reason: "Cannot complete — drop-off site closed or unreachable", by: "Regional Food Bank", date: "Mar 6, 2026", status: "Open" },
    ],
  },
];

/** Admin map: one pin per account, coloured/iconed by role. */
export const MAP_USERS = [
  { name: "Global Grocers Inc.", role: "donor" as Role, city: "Seattle, WA", x: 26, y: 32 },
  { name: "NorthGear Retail", role: "donor" as Role, city: "Bellevue, WA", x: 58, y: 24 },
  { name: "CleanCo Distribution", role: "donor" as Role, city: "Tukwila, WA", x: 40, y: 62 },
  { name: "The Haven Center", role: "org" as Role, city: "Seattle, WA", x: 33, y: 44 },
  { name: "Hope Harbor Shelter", role: "org" as Role, city: "Tacoma, WA", x: 21, y: 76 },
  { name: "Regional Food Bank", role: "org" as Role, city: "Renton, WA", x: 62, y: 55 },
  { name: "Marcus Lee", role: "driver" as Role, city: "Tacoma, WA", x: 48, y: 80 },
  { name: "Priya Raman", role: "driver" as Role, city: "Kent, WA", x: 72, y: 68 },
  { name: "Dana Whitfield", role: "individual" as Role, city: "Seattle, WA", x: 15, y: 52 },
  { name: "Alex Moreno", role: "individual" as Role, city: "Renton, WA", x: 80, y: 40 },
  { name: "Sam Iverson", role: "individual" as Role, city: "Burien, WA", x: 52, y: 14 },
];

export const MAP_ROLE_STYLE: Record<string, { color: string; icon: string; label: string }> = {
  donor: { color: "#0A7D52", icon: ICON.boxSimple, label: "Donors" },
  org: { color: "#2A6FDB", icon: ICON.shield, label: "Organizations" },
  individual: { color: "#E08A1E", icon: ICON.cart, label: "Individuals" },
  driver: { color: "#8A5CF6", icon: ICON.truck, label: "Volunteer drivers" },
};
