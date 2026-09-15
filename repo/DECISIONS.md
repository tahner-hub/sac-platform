# DECISIONS.md — S.A.C. Platform

Architecture and product decisions, with rationale, so any of them can be
overridden later without losing context.

---

## 1. Backend & hosting: Firebase ✅

**Decision:** Firebase — Firestore + Auth + Cloud Functions + Storage + Hosting.

**Why it fits:** messaging, order status, and delivery status are the heart of
the product and Firestore gives live updates with no socket infrastructure;
Firebase Auth plus a `users/{uid}` profile covers all five roles with rules
enforced server-side; and 10+ users sits inside the free tier (Cloud Functions
need the Blaze plan, but at this volume the bill rounds to ~$0).

**Escape hatch:** screens only call actions on `app/src/store.tsx`. Swapping
Firestore for Supabase/Postgres later means rewriting that one file.

## 2. Payments: Stripe Checkout, no Connect

**Decision:** Stripe **Checkout** (hosted, `payment` mode) for individual
marketplace purchases, created by the `createCheckoutSession` Cloud Function,
with `stripeWebhook` confirming payment.

- **Not Payment Links** — carts are dynamic, so sessions must be created in code.
- **Not Billing** — there are no subscriptions.
- **Not Connect** — drivers are volunteers (confirmed in revision 1.0) and cash
  donations link out to each org's own platform. No payouts means no KYC
  onboarding for every driver. If paid drivers return, add Connect Express and
  transfer per completed job.

**Server vs client:** the server creates sessions, resolves prices from the
`listings` collection, verifies webhook signatures, and transitions order state.
The client only holds the publishable key and redirects — no card data touches
our code (SAQ-A scope).

## 3. GitHub: monorepo, trunk-based, CI now

`app/` (React client) + `functions/` (Cloud Functions) + Firebase config at the
root. `main` is always deployable; work happens on short-lived PR branches. CI
typechecks and builds both packages on every push. Deploy automation is deferred
until the Firebase project exists.

## 4. Environment & config

Nothing is hardcoded. Client config lives in `app/.env.local` (template in
`app/.env.example`); Stripe secrets live in Firebase Secret Manager; the project
id lives in the gitignored `.firebaserc`. With no env vars the app runs in demo
mode against local data, so the repo is runnable the moment it's unzipped.

---

## Revision 1.0 decisions (from `SAC Updates Needed`)

### Volunteer-only drivers
The entire driver experience is now unpaid: no Earnings tab, no payout figures
on job cards, no "payout on completion". Driver sign-up is explicitly labelled
as a volunteer role on the role-select card and again on account setup. The
dashboard measures contribution instead — CO₂ saved, people served, waste
diverted, items provided, item types delivered, and cities serviced.

### Self drop-off as a first-class fulfilment method
A donation is either **volunteer pickup** or **self drop-off**. Drop-off gets:
its own status (`Pending Drop-off`, purple), a **Completed Drop-Off**
confirmation on the donation detail page, a travel-radius constraint so donors
are never asked to drive further than they offered, and recurring support with
drop-off wording throughout.

**Logic implemented:** if a donor listed self drop-off and the receiving org
requested delivery, the donor delivers — provided the org sits inside the
donor's radius. Otherwise a volunteer driver is assigned. Self drop-off is never
offered to the public once a listing releases.

### Address privacy on pickup/drop-off
Before an order or donation is committed, the counterparty sees **distance,
city/state, and the available window** only. The full street address and map
unlock on the confirmation screen. This is consistent across Community Requests
(donor + individual) and individual checkout.

### Community Requests (renamed from "In-Demand Donations")
Requests now carry a **numeric quantity** plus a free-text **quantity type**
(units, lbs, cases, meals…) set by the organization, explained by an info icon,
and shown read-only to donors so contributions are counted in the org's own
units. Progress is displayed as received/needed ("Need ~60/100 units") in the
list, on the detail page, on the org's Needs Posted table, and in the admin's
urgency-sorted view.

### Weights standardised to pounds
Every quantity that represents mass is now lbs — create-donation, listings,
orders, driver capacity, job loads, records, and dashboards.

### Reporting expanded
Report reasons are now contextual: **listings** (misdescribed, prohibited,
fraud), **orders** (never delivered, late/incomplete, damaged, misdescribed),
and **deliveries** (driver can't complete — pickup unavailable, over capacity,
site unreachable, unsafe load). The delivery-status action on Incoming Orders
and My Orders is replaced by the report flag.

### Deactivation is gated
Accounts can't be deactivated while obligations are outstanding — open
donations, unreceived orders, in-progress deliveries, or active recurring
schedules. The dialog lists exactly what's blocking, requires a reason, and
shows an error if you try anyway. Enforced client-side and again in the
`requestDeactivation` Cloud Function.

### Admin console rebuilt
"Members" removed; **Deactivations** added, with a searchable user table showing
report counts, message/deactivate actions, and email changes. Overview now
carries partner donors, available drivers, a sortable triage table (by volume,
recency, or severity) that opens individual reports to resolve, a network map
with a distinct icon per role, and posted requests sorted most-urgent-first with
city/state. Password resets are self-service by design, so admins don't handle
them.

### Public site
Added **Partners** and **Impact** pages, plus a guest **Browse** view showing
local marketplace listings and community requests — any action there routes to
account creation. The public header collapses to a hamburger drawer below
900px. Account creation has a breadcrumb back to home. All section headings are
left-aligned.

### Interaction states
Buttons, tabs, chips, links, nav rows, table rows, cards, and chart elements all
have hover/active states; static cards lift subtly. Impact charts are hoverable
(and tappable on mobile) — bars reveal exact lbs and item counts, category rows
reveal item counts. Everything respects `prefers-reduced-motion`.

---

## Auth wiring (backend step 1)

### Auth is its own provider, not part of the store
`AuthProvider` (`app/src/auth.tsx`) holds the session and the live profile;
`StoreProvider` (`app/src/store.tsx`) keeps holding donations, orders, requests,
messages and deliveries. Folding auth into the store — the shape Firebase's
Gemini assistant suggested — would have replaced the app's entire data layer
with `{authUser, userProfile, loading}` and broken every screen. Separating them
also means backend steps 2–7 can migrate one collection at a time.

### The profile is streamed, not fetched
`users/{uid}` is read with `onSnapshot`, not `getDoc`. That's what makes admin
approval work the way the UI promises: flipping `verified` or `role` moves that
user's interface immediately, with no refresh and no polling. Cost is one open
listener per signed-in user.

### Demo mode survives
The provider has two modes, chosen by whether Firebase env vars exist. With no
keys a local stand-in profile serves the same interface, so the repo still runs
the moment it's unzipped and the "View as" switcher still works. No screen knows
which mode it's in.

### Credentials are collected once, at step 1 of onboarding
Password and confirmation are validated on the Account Details screen rather
than at "Enter S.A.C. →", so a rejected password doesn't cost three more screens
of typing. The account is created at the final step, in one call, and the draft
(password included) is cleared from memory on success.

### Privileged fields stay server-side
`role`, `verified`, `status` and `reportCount` are written at sign-up and then
blocked from client writes by `firestore.rules`. Self-service password reset
stays Firebase's job, so admins never handle credentials.

---

## Open items needing your input (`git grep "TODO(owner)"`)

1. **Delivery fee policy** — flat $3.50 vs distance-based (`functions/src/index.ts`).
2. **Real partner orgs + donation URLs** for the Cash Donations tab.
3. **Partner logos** on the Partners page.
4. **Legal text** — terms, privacy, and donated-goods liability (footer links).
5. **Firebase project + Stripe keys** — your accounts (see SETUP.md).
