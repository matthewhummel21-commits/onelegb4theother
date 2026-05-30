import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const PACKAGES: Record<string, { name: string; price: number; description: string }> = {
  patch: {
    name: "Patch Sponsor Package",
    price: 25000, // $250.00 in cents
    description: "Logo + link in 1 newsletter issue. Delivered within 30 days.",
  },
  shield: {
    name: "Shield Sponsor Package",
    price: 75000, // $750.00
    description: "Logo + link in 3 newsletter issues + 1 social media shoutout. Delivered across 60–90 days.",
  },
  standard: {
    name: "Standard Sponsor Package",
    price: 150000, // $1,500.00
    description: "Logo + link in 6 issues + 2 social shoutouts + 1 featured sponsor block. Delivered across 6 months.",
  },
  commander: {
    name: "Commander Sponsor Package",
    price: 300000, // $3,000.00
    description: "Logo + link in 12 issues + 4 social shoutouts + 2 featured sponsor blocks. Delivered across 12 months.",
  },
  patriot: {
    name: "Patriot Sponsor Package",
    price: 500000, // $5,000.00
    description: "Full-year flagship: every newsletter issue + monthly featured block + 6 dedicated social posts + event shoutout.",
  },
};

export async function POST(req: NextRequest) {
  try {
    const { packageId } = await req.json();

    const pkg = PACKAGES[packageId];
    if (!pkg) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://onelegb4theother.com";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: pkg.name,
              description: pkg.description,
              images: [
                "https://onelegb4theother.com/logo.png",
              ],
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/advertise/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/advertise`,
      metadata: {
        packageId,
        packageName: pkg.name,
        type: "sponsor",
      },
      billing_address_collection: "required",
      customer_creation: "always",
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Advertise checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
