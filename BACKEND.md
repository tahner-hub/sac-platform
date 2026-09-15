# BACKEND.md — connecting S.A.C. to Firebase

Everything the UI does today runs against a local store (`app/src/store.tsx`).
This document is the checklist to make it real: what you need to provide, what
already exists in the repo, and the data structure to create.

---

## Part 1 — What's needed from you (in order)

These are the things only you can do. Roughly 1–2 hours total.

| # | What | Where | Notes |
|---|------|-------|-------|
| 1 | **Create a Firebase project** | console.firebase.google.com | Name it `sac-platform`. Region: `us-west1` (closest to Seattle). |
| 2 | **Enable Email/Password auth** | Build → Authentication | Turn on the Email/Password provider. Also enable the **password-reset email template** — this is what makes "Forgot password" self-service so you never reset one by hand. |
| 3 | **Create Firestore** | Build → Firestore Database | Start in **production mode** (our `firestore.rules` replaces the defaults). |
| 4 | **Enable Storage** | Build → Storage | For listing photos, verification docs, and proof-of-delivery images. |
| 5 | **Copy the web config** | Project settings → Your apps → Web | Paste the 6 values into `app/.env.local` (template: `app/.env.example`). |
| 6 | **Upgrade to the Blaze plan** | Settings → Usage and billing | Required for Cloud Functions. At 10+ users the bill is effectively $0 — free-tier allowances still apply. Set a **budget alert at $10** for peace of mind. |
| 7 | **Create a Stripe account** | dashboard.stripe.com | Stay in **Test mode** until launch. |
| 8 | **Add Stripe keys** | See SETUP.md §4 | Publishable key → `.env.local`. Secret + webhook keys → `firebase functions:secrets:set`. |
| 9 | **Seed your first admin** | Firestore console | Create your own account through the app, then edit `users/{yourUid}` and set `role: "admin"`, `verified: true`. This is the only manual record you'll ever create. |
| 10 | **Decide the open TODOs** | `git grep "TODO(owner)"` | Delivery fee policy, real partner org links, and legal/liability text. |

### Decisions still open (blocking nothing, but needed before public launch)

1. **Delivery fee** — currently a flat $3.50. Distance-based needs a rate table.
2. **Who pays the delivery fee** — the receiving org, the individual buyer, or
   is it absorbed? Right now it's added to individual checkout only.
3. **Liability text** for donated goods (Good Samaritan Act coverage), terms of
   service, privacy policy. Footer links exist and point nowhere.
4. **Verification SLA** — the UI promises "1–2 business days" for approvals.
5. **Geographic launch radius** — the marketplace filters say "Within 25 mi";
   confirm the real service area for launch.

---

## Part 2 — What already exists in this repo

You don't need to build these; they're written and compiling.

- **`firestore.rules`** — role-based security for every collection. Enforces
  that orgs only see priority listings, drivers only touch their own runs,
  reports are admin-read-only, and no client can mark its own order paid.
- **`storage.rules`** — photo/document access rules per bucket path.
- **`firestore.indexes.json`** — the composite indexes the app's queries need.
- **`functions/src/index.ts`** — six Cloud Functions:
  - `createCheckoutSession` / `stripeWebhook` — payments with server-side pricing.
  - `runRecurringDonations` — hourly job that auto-reposts recurring listings.
  - `releaseExpiredPriority` — flips org-only listings to public after the
    donor's priority window, honouring the "no public pickup" setting.
  - `onReportCreated` — maintains report counts for the admin triage table.
  - `onNeedContribution` — keeps `received` in sync on community requests.
  - `requestDeactivation` — server-side enforcement of the obligation check.
- **`app/src/services/`** — auth and payments clients with demo-mode fallbacks.
- **`app/src/auth.tsx`** — `AuthProvider`: live session + `users/{uid}` profile
  over `onSnapshot`. Fully wired (see "Step 1, wired" below).
- **`app/src/lib/firebase.ts`** — SDK initialization, gated on env vars.

---

## Part 3 — Suggested Firestore structure

Firestore is document-based, so the shape below is optimised for the reads the
app actually performs (dashboards, marketplace lists, one thread at a time)
rather than normalised like SQL.

```
users/{uid}
  role            "donor" | "org" | "individual" | "driver" | "admin"
  displayName     string
  email           string
  phone           string
  orgName         string                  // business / organization name
  categories      string[]                // resource preferences
  city, state     string
  geo             geopoint                // powers "distance from you"
  verified        bool                    // admin approves in Approvals queue
  status          "active" | "suspended" | "deactivated"
  reportCount     number                  // denormalised for admin triage
  deactivationReason, deactivationNote     string
  createdAt       timestamp

  // Org-only public profile (Cash Donations tab)
  orgProfile { description, imageUrl, donationUrl, platformName }

  // Driver-only
  driverProfile { capacityLbs, availableFrom, availableTo, isAvailable,
                  citiesServed[], deliveriesCompleted }

listings/{listingId}                       // donations offered
  donorUid        string
  title           string
  category        string
  weightLbs       number                   // ALL weights in lbs
  estimatedValueCents number
  condition       string
  photos          string[]                 // Storage URLs
  fulfilment      "pickup" | "dropoff"     // dropoff = donor delivers it
  pickupAddress   { line1, city, state, zip, geo }
  window          { start, end }
  expiresAt       timestamp
  priorityDays    number                   // days before public release
  allowPublicPickup bool                   // donor can disable public pickup
  dropoffRadiusMiles number                // donor's max travel distance
  status          "draft" | "active" | "reserved" | "in_transit" | "delivered"
  visibility      "org" | "public"         // flipped by releaseExpiredPriority
  publicPickupAvailable bool               // computed on release
  recurringTemplateId string | null
  createdAt       timestamp

recurringTemplates/{templateId}            // "post this automatically"
  donorUid, title, category, weightLbs
  cadence         "Weekly" | "Bi-Weekly" | "Monthly"
  fulfilment      "pickup" | "dropoff"
  days            string[]                 // ["Fri"]
  window          { earliest, latest }
  active          bool                     // pause/resume
  nextRunAt       timestamp                // driven by the scheduled function
  lastRunAt       timestamp
  postsCreated    number

needs/{needId}                             // community requests from orgs
  orgUid, orgName
  item            string
  needed          number                   // numeric quantity
  received        number                   // maintained by onNeedContribution
  quantityType    string                   // "units" | "lbs" | "cases" …
  estWeightLbs    number
  category        string
  urgency         "High need" | "Ongoing"
  urgencyRank     number                   // 1 = most urgent (admin sort)
  notes           string
  address         { line1, city, state, zip, geo }
  window          { start, end }
  status          "open" | "fulfilled"
  createdAt       timestamp

  needs/{needId}/contributions/{contributionId}
    donorUid, quantity, estWeightLbs, estimatedValueCents
    fulfilment    "pickup" | "dropoff"
    photos        string[]
    status        "pending" | "received"
    createdAt

orders/{orderId}                           // reservations + public purchases
  listingId, donorUid, recipientUid
  recipientType   "org" | "individual"
  quantity        number
  weightLbs       number
  fulfilment      "delivery" | "pickup"
  status          "reserved" | "pending_payment" | "paid" | "in_transit"
                  | "delivered" | "cancelled"
  amountTotal     number                   // cents, Stripe only
  stripeSessionId string
  addressRevealed bool                     // true once the order completes
  window          { start, end }
  createdAt, paidAt, deliveredAt

deliveries/{deliveryId}                    // volunteer driver runs
  orderId, donorUid, recipientUid
  driverUid       string | null            // null while status == "open"
  weightLbs       number
  pickup          { name, address, geo }
  dropoff         { name, address, geo }
  distanceMiles   number
  status          "open" | "accepted" | "picked_up" | "en_route"
                  | "delivered" | "issue_reported"
  proofPhotoUrl, receivedBy, signatureUrl
  issueReason     string
  createdAt, completedAt

threads/{threadId}                         // messaging
  memberUids      string[]                 // used directly by security rules
  context         { type: "order"|"delivery"|"need", refId, label }
  lastMessage     string
  lastMessageAt   timestamp
  unreadBy        string[]

  threads/{threadId}/messages/{messageId}
    senderUid, text, createdAt

reports/{reportId}                         // trust & safety
  reporterUid, subjectUid                  // subjectUid drives reportCount
  targetType      "listing" | "order" | "delivery" | "user"
  targetId        string
  reason          string
  details         string
  severity        "Low" | "Medium" | "High"
  status          "open" | "resolved"
  resolvedBy, resolvedAt
  createdAt
```

### Why this shape

- **`memberUids` on threads** lets the security rules authorise a read with no
  extra lookup — the cheapest possible permission check.
- **`reportCount` denormalised onto `users`** means the admin triage table is
  one query instead of an aggregation over every report.
- **`visibility` on listings** is what makes the priority window work: orgs
  query `visibility == "org"`, the public queries `visibility == "public"`, and
  a scheduled function moves records between them.
- **`received` on needs** (rather than summing contributions client-side) keeps
  the "60/100 units" progress bar to a single document read.
- **`geo` geopoints** back the "2.1 mi away" distances. For launch, compute
  distance client-side from the user's saved location; if you later need real
  radius queries, add the `geofire-common` library and a geohash field.

### Wiring order (recommended)

1. ~~**Auth + users**~~ — ✅ **done.** See "Step 1, wired" below.
2. **Listings + orders** — the core marketplace loop.
3. **Needs + contributions** — community requests.
4. **Deliveries** — volunteer driver assignment.
5. **Threads** — messaging (real-time listeners).
6. **Reports + admin** — trust & safety tooling.
7. **Stripe** — last, because only individual checkout depends on it.

Each step is a swap inside `app/src/store.tsx`: replace the `useState` array
with a Firestore `onSnapshot` listener and the action with a write. The screens
don't change at all — they only ever call store actions.

---

## Step 1, wired — Auth + users ✅

Sign-up, sign-in, password reset, sign-out, and a live `users/{uid}` profile are
implemented. Nothing here needs code from you — it activates the moment
`app/.env.local` has real Firebase keys (Part 1, steps 1–5).

**Where it lives**

| File | Role |
|---|---|
| `app/src/services/auth.ts` | Firebase calls: `watchAuth` (`onAuthStateChanged`), `watchUserProfile` (`onSnapshot` on `users/{uid}`), `signUp`/`signIn`/`signOut`, `requestPasswordReset`, `updateUserProfile`, and `authErrorMessage` for human-readable failures. |
| `app/src/auth.tsx` | `AuthProvider` / `useAuth` — holds the session, the live profile, the onboarding draft, and every auth action. |
| `app/src/App.tsx` | `AuthGate` (splash while the first auth check resolves) and `AuthBridge` (routes on sign-in, role change, and sign-out). |

**Auth is a separate provider from `store.tsx` on purpose.** The store holds
donations, orders, requests, messages and delivery state, and every screen reads
from it. Keeping the two apart means steps 2–7 can be migrated one collection at
a time without touching the session.

**What happens end to end**

1. Onboarding collects name, email, phone, organization and a password across
   the four setup steps (validated at step 1, so nobody discovers a rejected
   password three screens later).
2. "Enter S.A.C. →" calls `createUserWithEmailAndPassword`, then writes
   `users/{uid}` with `verified: false`, `status: "active"`, `reportCount: 0`.
3. `onAuthStateChanged` fires, `onSnapshot` starts streaming that document, and
   `AuthBridge` lands the user on their role's home screen.
4. Because the profile is streamed rather than fetched, flipping `verified` or
   `role` in the Firestore console moves that user's UI **without a refresh** —
   which is exactly how the admin Approvals queue is meant to work.
5. Settings reads the live profile; editing phone or organization writes back to
   `users/{uid}` and the snapshot echoes it in.
6. Sign out ends the Firebase session and returns to the public site.

**Demo mode is untouched.** With no env vars the same provider serves a local
stand-in profile, so `npm run dev` still works with zero configuration and the
"View as" switcher keeps swapping roles.

**Two things to know**

- A user who exists in Auth but has no `users/{uid}` document (interrupted
  sign-up, deleted doc) gets an explicit "Your profile isn't set up yet" screen
  with a sign-out button, rather than an infinite spinner.
- `role`, `verified`, `status` and `reportCount` are **not** writable by the
  client — `firestore.rules` blocks them, so promoting someone to admin stays a
  console/admin-side action.

---

## Part 4 — What stays out of the backend

- **Driver payments.** Volunteers are unpaid, so there's no Stripe Connect, no
  KYC onboarding, and no payout ledger. If paid drivers return later, add
  Connect Express accounts and a `payouts` collection.
- **Cash donations.** Orgs link out to their own platform (Givebutter, Classy,
  …). S.A.C. stores the URL and never touches the funds — this keeps you out of
  money-transmission and charitable-solicitation registration entirely.
- **Live GPS tracking.** Removed by design; deliveries show status and distance
  only.
