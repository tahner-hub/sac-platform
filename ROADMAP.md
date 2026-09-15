# ROADMAP.md — from working auth to launch

Where the project stands, what's left, and how each piece gets verified before
it's called done.

**Status:** Phases 1 and 2 (rules) complete — Firebase Auth and live `users/{uid}` profiles are
wired and confirmed against project `plyer-f746a`. Everything else in the app
still runs on the local store (`app/src/store.tsx`), which is by design: the
store is the single seam between the screens and the backend, so it migrates one
collection at a time without touching a single screen.

---

## How to read this

Each phase lists **Build**, **Test**, and **Done when**. A phase isn't finished
until its "Done when" holds — that's the gate that keeps us from stacking new
work on an unverified foundation.

Two kinds of testing run throughout:

| Kind | What it covers | Where it runs |
|---|---|---|
| **Rules tests** | `firestore.rules` — who can read/write what | Firestore emulator, `npm test` |
| **E2E tests** | Real user journeys across screens | Playwright, emulator-backed |

Both belong in CI so a regression fails the build rather than reaching you.

---

## Phase 0 — Close out setup ⬜

Small, unblocking, mostly console work.

**Build**
- Bootstrap your admin account: sign up, then set `role: "admin"`,
  `verified: true` on your `users/{uid}` doc.
- Enable Storage (Build → Storage → Get started), then
  `firebase deploy --only storage`.
- Deploy Cloud Functions: `firebase deploy --only functions`.
- Confirm the CI badge is green on GitHub Actions.

**Test**
- Sign up one account per role; each lands on the right dashboard.
- With the app open, flip `verified` in the console — the UI reacts with no
  refresh. (This is the `onSnapshot` contract the whole app leans on.)
- Sign out and back in; you land where you left off.

**Done when** all five roles can sign in, and an admin change moves another
account's UI live.

---

## Phase 1 — Auth + users ✅

Done. Sign-up, sign-in, password reset, sign-out, live profile streaming,
atomic sign-up with rollback, and setup-aware error messages. See BACKEND.md →
"Step 1, wired".

---

## Phase 2 — Test foundation ✅ (rules) / ⬜ (E2E)

Deliberately before the data migration, not after. Every later phase changes
security rules, and rules are the one part of this system where a mistake is
silent and serious.

**Done — rules tests.** 61 tests in `tests/firestore.rules.test.ts`, run with
`npm test` from the repo root (boots the Firestore emulator, runs the suite,
tears it down) and as its own CI job.

Every rule has an allow case *and* a deny case, because a suite that only
proves the happy path would pass just as well against `allow read, write: if
true`. Covered: privilege escalation on `users` (role, verified, status,
reportCount), org-priority listing visibility including the unverified-org
case, client-side payment status on orders, driver run ownership, thread
membership for reads and message authorship, admin-only reports, and the
catch-all deny.

**Validated by mutation, not by passing.** Four rules were loosened one at a
time — self-promotion to admin, threads readable by non-members, clients
flipping orders to `paid`, reports readable by anyone — and each produced
failures. That's the evidence the suite has teeth. Repeat this whenever rules
change: break one deliberately, confirm red, restore.

**Still to do — emulator-backed E2E.** Deferred to land alongside Phase 3,
because until the store talks to Firestore an emulator-backed E2E run exercises
exactly the same localStorage path the current suite already covers.

**Done when** the E2E suite runs against the emulator in CI.

---

## Phase 3 — Listings (donations) ⬜

The first real migration, and the template for everything after it.

**Build**
- `listings` and `recurringTemplates` in Firestore, replacing the local arrays.
- `onSnapshot` queries for the donor's own listings and the org marketplace.
- Photo upload to Storage, with the URL on the listing.
- Keep `publishDonation`, `saveDraft`, `publishDraft` etc. as the same store
  actions — only their bodies change, so no screen is touched.

**Test**
- Rules: a donor writes only their own listings; orgs see `visibility == "org"`
  only when verified; the public sees only `visibility == "public"`.
- E2E: publish a donation → it appears in Firestore → a second browser signed in
  as an org sees it in the marketplace.
- Recurring: a template with a due `nextRunAt` produces a new listing when
  `runRecurringDonations` fires.

**Done when** a donation created in one browser appears in another, with photos,
and drafts survive a reload.

---

## Phase 4 — Orders & reservations ⬜

**Build**
- `orders` collection with the full status machine (`reserved` →
  `pending_payment` → `paid` → `in_transit` → `delivered`).
- Org reserve flow, the priority window, and the address-privacy rule — city and
  distance before commitment, full address only after.
- `releaseExpiredPriority` moving listings from org-only to public on schedule.

**Test**
- Rules: only the donor and recipient can read an order; nobody can set
  `status: "paid"` from the client.
- E2E: org reserves → donor sees it in Incoming Orders → status advances.
- Address privacy: assert the street address is absent from the DOM before
  confirmation and present after.

**Done when** the reserve→confirm→fulfil loop works across two accounts and the
priority window releases on its own.

---

## Phase 5 — Community requests ⬜

**Build**
- `needs` plus the `contributions` subcollection.
- `onNeedContribution` keeping `received` accurate server-side.
- Org-defined quantity types flowing through to donor and individual views.

**Test**
- Rules: only the owning org edits a need; `received` is not client-writable.
- E2E: post a request → contribute from another account → progress moves.
- Concurrency: two simultaneous contributions both count (this is what the
  Cloud Function is for — a client-side increment would lose one).

**Done when** progress is correct under concurrent contributions.

---

## Phase 6 — Deliveries ⬜

**Build**
- `deliveries` with driver assignment, capacity and radius checks.
- The self-drop-off vs volunteer-pickup decision from revision 1.0.
- Driver availability and completion, with proof-of-delivery photo.

**Test**
- Rules: a driver reads open jobs but writes only their own accepted run.
- E2E: order needing delivery → job appears for the driver → accept → complete →
  all three parties see the right status.
- Capacity: a job over the driver's stated capacity isn't offered.

**Done when** a delivery runs end to end across donor, driver and recipient.

---

## Phase 7 — Messaging ⬜

**Build**
- `threads` + `messages`, with `memberUids` driving the rules.
- Unread state and thread context (order / delivery / need).

**Test**
- Rules: a non-member can't read a thread — the highest-severity privacy case in
  the app.
- E2E: two browsers, message appears live without refresh.

**Done when** two accounts hold a real-time conversation and a third can't see it.

---

## Phase 8 — Reports & admin ⬜

**Build**
- `reports` with contextual reasons, `onReportCreated` maintaining `reportCount`.
- Admin triage, approvals, deactivations, network map.
- `requestDeactivation` enforcing the obligation gate server-side.

**Test**
- Rules: reports are admin-read-only; a reporter can't read others' reports.
- E2E: submit a report → it surfaces in triage → resolving it clears the queue.
- Deactivation: an account with an open obligation is refused **by the function**,
  not just by the UI.

**Done when** the client-side block is proven redundant because the server
refuses too.

---

## Phase 9 — Payments ⬜

Last, because only individual checkout depends on it.

**Build**
- `createCheckoutSession` + `stripeWebhook` with server-side price resolution.
- Stripe keys into Firebase Secret Manager (never into `.env.local`).

**Test**
- Test mode, card `4242 4242 4242 4242` → webhook flips the order to `paid`.
- Tampering: a client that alters the price still gets charged the server's
  price. This is the test that matters.
- Webhook replay and signature failure are both handled.

**Done when** an order can't be underpaid by a modified client.

---

## Phase 10 — Harden & launch ⬜

**Build**
- Empty, loading and error states on every screen backed by a live query.
- Offline and reconnect behaviour.
- **Bundle size** — currently ~970KB / 274KB gzipped in one chunk. Route-level
  code splitting, and Firebase imported per-service.
- Composite indexes verified against real query shapes.
- The remaining `TODO(owner)` items: delivery-fee policy, real partner links and
  logos, and legal text (terms, privacy, donated-goods liability).
- `VITE_ENABLE_ROLE_SWITCHER=false` for the production build.
- Deploy: `firebase deploy --only hosting`.

**Test**
- Full E2E across all five roles against a production-like build.
- Mobile (390px) and desktop (1440px), which the existing suite already covers.
- A rules audit pass: for every collection, ask who can read it, and prove it.

**Done when** the five-role suite passes against the deployed site.

---

## Deferred — not blocking, worth doing

1. **Git repo at `/Users/tahne`** — someone ran `git init` in the home folder.
   Harmless today, but a `git add -A` there could sweep up SSH keys and
   credential files. Clean up when convenient.
2. **Duplicate project copies** — `~/sacplatform` and
   `~/Documents/Surplus Donation Platform/repo` are stale. The nested clone at
   `~/sac-platform/app/sac-platform` should go regardless; a project folder
   inside `app/` confuses builds and searches.
3. **Node v23** is non-LTS; `firebase-tools` warns about it. Moving to 20 or 22
   would remove a class of odd failures.
4. **Analytics** — `measurementId` exists in your Firebase config but isn't
   wired. Add only if you want it.
5. **Project naming** — the Firebase project is `plyer-f746a`. Fine if
   deliberate; confusing later if it wasn't.

---

## Order of attack

Phases 0 and 2 are quick and unblock everything else. Phase 3 sets the pattern
that Phases 4–8 repeat, so it's worth being fussy about. Phase 9 is independent
and can move earlier if payments become urgent.
