import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { amount, mode } = await req.json();

    if (!amount || isNaN(amount) || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amountCents = Math.round(parseFloat(amount) * 100);
    const isMonthly = mode === "monthly";
    const origin = req.headers.get("origin") || "https://onelegb4theother.com";

    if (isMonthly) {
      // Recurring donation — create a subscription via Stripe
      const price = await stripe.prices.create({
        currency: "usd",
        unit_amount: amountCents,
        recurring: { interval: "month" },
        product_data: {
          name: `One Leg B4 the Other — Monthly Donation ($${amount}/mo)`,
        },
      });

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [{ price: price.id, quantity: 1 }],
        success_url: `${origin}/#donate?donated=1`,
        cancel_url: `${origin}/#donate`,
        metadata: { donation: "true", amount: String(amount), mode: "monthly" },
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
        metadata: { donation: "true", amount: String(amount), mode: "once" },
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (err) {
    console.error("Donate API error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
