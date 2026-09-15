import { httpsCallable } from "firebase/functions";
import { functions, firebaseEnabled } from "../lib/firebase";
import { stripePublishableKey } from "../lib/config";

// Payments cover individual marketplace purchases only. Volunteer drivers are
// unpaid and cash donations link out to each org's own platform, so there are
// no marketplace payouts (see DECISIONS.md).
//
// Flow: client asks a Cloud Function for a Checkout Session and redirects to
// session.url. Prices are resolved SERVER-SIDE from the listings catalog, so
// the client can never set its own price.

export interface CheckoutItem {
  listingId: string;
  quantity: number;
}

export const paymentsEnabled = firebaseEnabled && Boolean(stripePublishableKey);

/**
 * Starts a Stripe Checkout for the given items.
 * Returns true if the browser is being redirected to Stripe; false in demo
 * mode (caller shows the local order-confirmation flow instead).
 */
export async function startCheckout(items: CheckoutItem[]): Promise<boolean> {
  if (!paymentsEnabled || !functions) return false;
  const createSession = httpsCallable<
    { items: CheckoutItem[]; successUrl: string; cancelUrl: string },
    { url: string }
  >(functions, "createCheckoutSession");
  const { data } = await createSession({
    items,
    successUrl: `${window.location.origin}/?checkout=success`,
    cancelUrl: `${window.location.origin}/?checkout=cancelled`,
  });
  window.location.assign(data.url);
  return true;
}
