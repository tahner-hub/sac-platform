# SETUP.md — S.A.C. Platform

From zero to running locally, then to a live Firebase + Stripe deployment.

The app runs in **demo mode with no setup at all** (step 1 only) — every flow
works against local data. Steps 2–5 light up real auth, database, and payments.
For the full backend plan and data structure, see **[BACKEND.md](BACKEND.md)**.

---

## 1. Run locally (demo mode — no accounts needed)

```sh
cd app
npm install
npm run dev          # → http://localhost:5173
```

- Use **Sign In → "Demo mode — jump to a role"** or the top-bar **View as**
  switcher to explore all five roles.
- Data you create (donations, orders, requests, messages) persists in
  `localStorage`. Clear site data in the browser to reset.

## 2. GitHub repo init

```sh
cd sac-platform
git init -b main
git add -A
git commit -m "Initial commit"
git remote add origin https://github.com/<you>/sac-platform.git
git push -u origin main
```

CI (typecheck + build for `app/` and `functions/`) runs on every push/PR via
`.github/workflows/ci.yml`. Work on short-lived branches, merge to `main` via PR.

## 3. Firebase project setup

1. Create a project at https://console.firebase.google.com (e.g. `sac-platform`).
2. **Auth:** Build → Authentication → enable **Email/Password**, and confirm the
   **password reset** email template is enabled (this is what makes the Forgot
   password flow self-service).
3. **Firestore:** Build → Firestore Database → Create database (production mode).
4. **Storage:** Build → Storage → Get started.
5. **Web app config:** Project settings → Your apps → Add app → Web. Copy the
   values into `app/.env.local`:
   ```sh
   cd app && cp .env.example .env.local   # paste the 6 VITE_FIREBASE_* values
   ```
6. **CLI + rules:**
   ```sh
   npm install -g firebase-tools
   firebase login
   cp .firebaserc.example .firebaserc     # put your real project id inside
   firebase deploy --only firestore,storage
   ```
7. Restart `npm run dev` — the app now uses real Firebase Auth. Sign-up,
   sign-in, password reset, sign-out, and the live `users/{uid}` profile are
   already wired; the demo-mode role chips disappear automatically.

**Bootstrap your admin account:** sign up through the app, then in the Firestore
console edit your `users/{uid}` doc and set `role: "admin"`, `verified: true`.
The profile is streamed with `onSnapshot`, so the app switches to the admin
console in the open tab — no refresh needed. (That's also how the Approvals
queue is meant to feel for everyone else.)

## 4. Stripe setup (individual marketplace purchases)

Volunteer drivers are unpaid and cash donations link out to each org's own
platform, so Stripe is only needed for public marketplace orders.

1. Create an account at https://dashboard.stripe.com — stay in **Test mode**.
2. Developers → API keys:
   - **Publishable key** (`pk_test_…`) → `app/.env.local` as
     `VITE_STRIPE_PUBLISHABLE_KEY`.
   - **Secret key** (`sk_test_…`) → Firebase secret:
     ```sh
     firebase functions:secrets:set STRIPE_SECRET_KEY
     ```
3. **Webhook:** Developers → Webhooks → Add endpoint →
   `https://us-central1-<project-id>.cloudfunctions.net/stripeWebhook`,
   event `checkout.session.completed`. Copy the signing secret (`whsec_…`):
   ```sh
   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
   ```
4. **Deploy functions** (requires the Blaze plan — free at this volume):
   ```sh
   cd functions && npm install && cd ..
   firebase deploy --only functions
   ```
5. **Test:** order as an Individual → redirected to Stripe Checkout → pay with
   card `4242 4242 4242 4242`, any future expiry, any CVC → the webhook flips
   the order to `paid`.

   Local webhook testing:
   ```sh
   stripe listen --forward-to localhost:5001/<project-id>/us-central1/stripeWebhook
   ```

## 5. Deploy the web app

```sh
cd app && npm run build && cd ..
firebase deploy --only hosting        # → https://<project-id>.web.app
```

Set `VITE_ENABLE_ROLE_SWITCHER=false` for production builds (or omit it — a
configured production build hides the switcher by default).

## Environment variable reference

| Variable | Where | Purpose |
|---|---|---|
| `VITE_FIREBASE_API_KEY` … `VITE_FIREBASE_APP_ID` (6) | `app/.env.local` | Firebase web SDK config |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `app/.env.local` | Stripe client key |
| `VITE_ENABLE_ROLE_SWITCHER` | `app/.env.local` | Show/hide the "View as" switcher |
| `STRIPE_SECRET_KEY` | Firebase Functions secret | Server-side Stripe calls |
| `STRIPE_WEBHOOK_SECRET` | Firebase Functions secret | Webhook signature verification |

## Scheduled functions

Two run automatically once deployed:

- `runRecurringDonations` — hourly; re-posts recurring donations so donors never
  repeat the same listing.
- `releaseExpiredPriority` — hourly; opens org-priority listings to the public
  once the donor's window elapses (respecting the "no public pickup" setting).

## Troubleshooting

- **Stuck in demo mode after adding keys** — restart the dev server; Vite reads
  `.env.local` at startup.
- **"Your profile isn't set up yet"** — the Auth user exists but `users/{uid}`
  doesn't (usually an interrupted sign-up, or the doc was deleted). Either
  create the document by hand in the Firestore console, or delete the user in
  Authentication → Users and sign up again.
- **Sign-up fails with "An account already exists"** — that email is already in
  Authentication → Users, even if its Firestore document is gone.
- **`createCheckoutSession` returns `unauthenticated`** — you must be signed in
  through real Firebase Auth (demo-mode role chips don't create a session).
- **Webhook 400s** — endpoint URL or `STRIPE_WEBHOOK_SECRET` doesn't match the
  endpoint in the Stripe dashboard.
- **Functions deploy fails on plan** — upgrade to Blaze (Settings → Usage and
  billing). Free-tier allowances still apply.
