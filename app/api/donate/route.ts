import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { withinRateLimit } from "@/lib/rate-limit";
import { safeSiteOrigin } from "@/lib/safe-origin";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    if (!withinRateLimit(req, "donate", 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const { amount, mode } = await req.json();
    const numeric = typeof amount === "number" ? amount : parseFloat(String(amount));

    if (!Number.isFinite(numeric) || numeric < 1 || numeric > 100000) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amountCents = Math.round(numeric * 100);
    const isMonthly = mode === "monthly";
    const origin = safeSiteOrigin(req.headers.get("origin"));

    if (isMonthly) {
      // Recurring donation — create a subscription via Stripe
      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: amountCents,
        recurring: { interval: "month" },
        product_data: {
          name: `One Leg B4 the Other — Monthly Donation ($${numeric}/mo)`,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${origin}/#donate?donated=1`,
        cancel_url: `${origin}/#donate`,
        metadata: { donation: "true", amount: String(numeric), mode: "monthly" },
      });

      return NextResponse.json({ url: session.url });
    } else {
      // One-time donation
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "One Leg B4 the Other — Donation",
                description: "Your donation goes directly to providing adaptive wear to veterans in need.",
                images: ["https://onelegb4theother.com/logo.png"],
              },
              unit_amount: amountCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${origin}/#donate?donated=1`,
        cancel_url: `${origin}/#donate`,
        metadata: { donation: "true", amount: String(numeric), mode: "once" },
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (err) {
    console.error("Donate API error:", err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
