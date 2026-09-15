"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDeactivation = exports.onNeedContribution = exports.onReportCreated = exports.releaseExpiredPriority = exports.runRecurringDonations = exports.stripeWebhook = exports.createCheckoutSession = void 0;
const https_1 = require("firebase-functions/v2/https");
const scheduler_1 = require("firebase-functions/v2/scheduler");
const firestore_1 = require("firebase-functions/v2/firestore");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const stripe_1 = __importDefault(require("stripe"));
admin.initializeApp();
const db = admin.firestore();
// Secrets live in Firebase Secret Manager, never in the repo:
//   firebase functions:secrets:set STRIPE_SECRET_KEY
//   firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
const stripeSecretKey = (0, params_1.defineSecret)("STRIPE_SECRET_KEY");
const stripeWebhookSecret = (0, params_1.defineSecret)("STRIPE_WEBHOOK_SECRET");
/**
 * Creates a Stripe Checkout Session for public-marketplace purchases.
 *
 * Prices are resolved server-side from the `listings` collection so the client
 * can never set its own price.
 */
exports.createCheckoutSession = (0, https_1.onCall)({ secrets: [stripeSecretKey] }, async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError("unauthenticated", "Sign in to check out.");
    }
    const { items, successUrl, cancelUrl } = request.data;
    if (!Array.isArray(items) || items.length === 0 || items.length > 20) {
        throw new https_1.HttpsError("invalid-argument", "Provide 1–20 items.");
    }
    const stripe = new stripe_1.default(stripeSecretKey.value());
    const lineItems = [];
    for (const item of items) {
        const qty = Math.floor(item.quantity);
        if (!item.listingId || qty < 1 || qty > 99) {
            throw new https_1.HttpsError("invalid-argument", "Bad item or quantity.");
        }
        const snap = await db.collection("listings").doc(item.listingId).get();
        const listing = snap.data();
        if (!snap.exists || !listing || listing.status !== "public") {
            throw new https_1.HttpsError("not-found", `Listing ${item.listingId} is unavailable.`);
        }
        lineItems.push({
            quantity: qty,
            price_data: {
                currency: "usd",
                unit_amount: listing.priceCents,
                product_data: { name: listing.title },
            },
        });
    }
    // TODO(owner): confirm the delivery-fee policy. Flat $3.50 matches the
    // design mock; a distance-based fee needs a lookup table here.
    lineItems.push({
        quantity: 1,
        price_data: { currency: "usd", unit_amount: 350, product_data: { name: "Delivery" } },
    });
    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: lineItems,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { uid: request.auth.uid },
    });
    await db.collection("orders").doc(session.id).set({
        recipientUid: request.auth.uid,
        items,
        status: "pending_payment",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return { url: session.url };
});
/** Stripe webhook: marks orders paid once Checkout completes. */
exports.stripeWebhook = (0, https_1.onRequest)({ secrets: [stripeSecretKey, stripeWebhookSecret] }, async (req, res) => {
    const stripe = new stripe_1.default(stripeSecretKey.value());
    const signature = req.headers["stripe-signature"];
    if (!signature) {
        res.status(400).send("Missing signature");
        return;
    }
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.rawBody, signature, stripeWebhookSecret.value());
    }
    catch {
        res.status(400).send("Invalid signature");
        return;
    }
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        await db.collection("orders").doc(session.id).set({
            status: "paid",
            amountTotal: session.amount_total,
            paidAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    }
    res.status(200).send("ok");
});
/**
 * Recurring donations: re-publishes scheduled listings automatically so donors
 * never have to recreate the same post. Runs hourly and picks up any template
 * whose nextRunAt has passed.
 */
exports.runRecurringDonations = (0, scheduler_1.onSchedule)("every 1 hours", async () => {
    const now = admin.firestore.Timestamp.now();
    const due = await db
        .collection("recurringTemplates")
        .where("active", "==", true)
        .where("nextRunAt", "<=", now)
        .limit(200)
        .get();
    const batch = db.batch();
    for (const doc of due.docs) {
        const t = doc.data();
        const listing = db.collection("listings").doc();
        batch.set(listing, {
            donorUid: t.donorUid,
            title: t.title,
            category: t.category,
            weightLbs: t.weightLbs,
            estimatedValueCents: t.estimatedValueCents ?? null,
            fulfilment: t.fulfilment,
            pickupWindow: t.window,
            dropoffRadiusMiles: t.dropoffRadiusMiles ?? null,
            allowPublicPickup: t.allowPublicPickup ?? true,
            priorityDays: t.priorityDays ?? 3,
            status: "active",
            visibility: "org", // org-priority window; opens to public later
            recurringTemplateId: doc.id,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        batch.update(doc.ref, {
            lastRunAt: now,
            nextRunAt: nextRunFor(t.cadence, now),
            postsCreated: admin.firestore.FieldValue.increment(1),
        });
    }
    await batch.commit();
});
function nextRunFor(cadence, from) {
    const days = cadence === "Weekly" ? 7 : cadence === "Bi-Weekly" ? 14 : 30;
    return admin.firestore.Timestamp.fromMillis(from.toMillis() + days * 24 * 60 * 60 * 1000);
}
/**
 * Priority window: flips org-only listings to public once the donor's
 * "days until public release" has elapsed. Self drop-off is never offered to
 * the public, and pickup is withheld when the donor disabled it.
 */
exports.releaseExpiredPriority = (0, scheduler_1.onSchedule)("every 1 hours", async () => {
    const now = Date.now();
    const snap = await db
        .collection("listings")
        .where("status", "==", "active")
        .where("visibility", "==", "org")
        .limit(300)
        .get();
    const batch = db.batch();
    snap.docs.forEach((doc) => {
        const d = doc.data();
        const created = d.createdAt?.toMillis() ?? now;
        const windowMs = (d.priorityDays ?? 3) * 24 * 60 * 60 * 1000;
        if (now - created < windowMs)
            return;
        batch.update(doc.ref, {
            visibility: "public",
            publicPickupAvailable: d.fulfilment === "dropoff" ? false : d.allowPublicPickup !== false,
            releasedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    });
    await batch.commit();
});
/** Keeps a denormalised report count on each account for the admin triage table. */
exports.onReportCreated = (0, firestore_1.onDocumentCreated)("reports/{reportId}", async (event) => {
    const data = event.data?.data();
    if (!data?.subjectUid)
        return;
    await db.collection("users").doc(data.subjectUid).set({
        reportCount: admin.firestore.FieldValue.increment(1),
        lastReportAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
});
/** Keeps `received` in sync on a community request as contributions land. */
exports.onNeedContribution = (0, firestore_1.onDocumentWritten)("needs/{needId}/contributions/{contributionId}", async (event) => {
    const needRef = db.collection("needs").doc(event.params.needId);
    const contributions = await needRef.collection("contributions").get();
    const received = contributions.docs.reduce((sum, d) => sum + (d.data().quantity ?? 0), 0);
    const need = (await needRef.get()).data();
    await needRef.update({
        received,
        status: need && received >= (need.needed ?? 0) ? "fulfilled" : "open",
    });
});
/**
 * Blocks account deactivation while the member still has commitments, and
 * records the reason when they're clear to go.
 */
exports.requestDeactivation = (0, https_1.onCall)(async (request) => {
    if (!request.auth)
        throw new https_1.HttpsError("unauthenticated", "Sign in first.");
    const uid = request.auth.uid;
    const { reason, note } = request.data;
    if (!reason)
        throw new https_1.HttpsError("invalid-argument", "A reason is required.");
    const blockers = [];
    const openListings = await db
        .collection("listings")
        .where("donorUid", "==", uid)
        .where("status", "in", ["active", "reserved", "in_transit"])
        .get();
    if (!openListings.empty)
        blockers.push(`${openListings.size} donation(s) awaiting handoff`);
    const openOrders = await db
        .collection("orders")
        .where("recipientUid", "==", uid)
        .where("status", "in", ["reserved", "in_transit", "pending_payment"])
        .get();
    if (!openOrders.empty)
        blockers.push(`${openOrders.size} order(s) not yet received`);
    const openDeliveries = await db
        .collection("deliveries")
        .where("driverUid", "==", uid)
        .where("status", "in", ["accepted", "picked_up", "en_route"])
        .get();
    if (!openDeliveries.empty)
        blockers.push(`${openDeliveries.size} delivery assignment(s) in progress`);
    const activeRecurring = await db
        .collection("recurringTemplates")
        .where("donorUid", "==", uid)
        .where("active", "==", true)
        .get();
    if (!activeRecurring.empty)
        blockers.push(`${activeRecurring.size} active recurring donation(s)`);
    if (blockers.length > 0) {
        return { ok: false, blockers };
    }
    await db.collection("users").doc(uid).set({
        status: "deactivated",
        deactivatedAt: admin.firestore.FieldValue.serverTimestamp(),
        deactivationReason: reason,
        deactivationNote: note ?? "",
    }, { merge: true });
    await admin.auth().updateUser(uid, { disabled: true });
    return { ok: true, blockers: [] };
});
//# sourceMappingURL=index.js.map