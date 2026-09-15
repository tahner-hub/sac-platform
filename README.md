# S.A.C. — Social Asset Connection

A supply-and-demand platform for surplus goods: businesses donate extra
inventory to nonprofits (tax write-off), nonprofits post what they need and shop
the marketplace with priority access, individuals buy what's left over, and
volunteer drivers move it all.

**Web + mobile responsive · React + Vite + TypeScript · Firebase · Stripe**

## Quick start

```sh
cd app
npm install
npm run dev        # → http://localhost:5173 — demo mode, no keys needed
```

| Doc | What's in it |
|---|---|
| **[SETUP.md](SETUP.md)** | Firebase + Stripe setup, deploy, env vars |
| **[BACKEND.md](BACKEND.md)** | What you need to provide, and the Firestore data structure |
| **[DECISIONS.md](DECISIONS.md)** | Every architecture/product decision and why |
| **[ROADMAP.md](ROADMAP.md)** | The phases left to launch, each with its test gate |

**Backend status:** authentication and the live `users/{uid}` profile are wired
and running against a real Firebase project (BACKEND.md → "Step 1, wired").
Listings, orders, needs, deliveries, threads and reports still run on the local
store — see ROADMAP.md for the order they get migrated in.

## Repo layout

```
app/          React web client (Vite + TS). Runs with zero config in demo mode.
functions/    Cloud Functions: Stripe, recurring donations, priority release,
              report counts, need progress, gated deactivation.
firestore.rules / storage.rules / firestore.indexes.json / firebase.json
.github/      CI — typecheck + build on every push/PR.
```

## The five roles

| Role | What they do |
|---|---|
| **Donor** | Publish surplus (pickup or self drop-off, one-time or auto-recurring), manage drafts, give toward community requests, track impact |
| **Organization** | Priority marketplace access, post community requests with their own quantity units, reserve with delivery or pickup, report order problems |
| **Individual** | Buy remaining surplus, give toward requests, Stripe checkout |
| **Volunteer driver** | Set capacity and hours, accept runs, confirm deliveries, report issues — unpaid volunteer role |
| **Admin** | Approvals, triage reports, deactivations, network map, combined impact |

Guests can browse the marketplace and community requests before signing up.
Use the top-bar **View as** switcher (demo/dev builds) to hop between roles.

## Still needs your input

`git grep "TODO(owner)"` — delivery-fee policy, real partner links, legal text.
Everything else ships with a working default.
