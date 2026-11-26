import Stripe from "stripe";

let client: Stripe | null = null;

/** Build the Stripe client on first use so `next build` can load routes when the key is unset. */
export function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!client) client = new Stripe(key);
  return client;
}
