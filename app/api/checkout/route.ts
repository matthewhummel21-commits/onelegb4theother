import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Printful variant ID → size label
const VARIANTS: Record<string, { variantId: number; label: string }> = {
  XS:  { variantId: 5308241175, label: "XS" },
  S:   { variantId: 5308241177, label: "S" },
  M:   { variantId: 5308241178, label: "M" },
  L:   { variantId: 5308241179, label: "L" },
  XL:  { variantId: 5308241181, label: "XL" },
  "2XL": { variantId: 5308241182, label: "2XL" },
  "3XL": { variantId: 5308241183, label: "3XL" },
};

export async function POST(req: NextRequest) {
  try {
    const { size, promoCode } = await req.json();

    if (!size || !VARIANTS[size]) {
      return NextResponse.json({ error: "Invalid size" }, { status: 400 });
    }

    // Validate promo code
    const PROMO_CODES: Record<string, { stripeId: string; label: string; finalPrice: number }> = {
      TEAM: { stripeId: "promo_1TbYKvRrTSxjAtlBF9aDLhS8", label: "Team / Nonprofit Discount", finalPrice: 2999 },
    };
    const promo = promoCode ? PROMO_CODES[promoCode.toUpperCase().trim()] : null;
    if (promoCode && !promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }

    const origin = req.headers.get("origin") || "https://onelegb4theother.org";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `One Leg B4 the Other — Issued With Honor Tee (${size})`,
              description: promo
                ? "Team / nonprofit price — thank you for your support!"
                : "Your purchase funds a pair of adaptive pants for a veteran in need.",
              images: [
                "https://files.cdn.printful.com/files/844/844011d92c81ab651408cb0aa7b88076_preview.png",
              ],
            },
            unit_amount: promo ? promo.finalPrice : 5500,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: {
        size,
        printful_variant_id: String(VARIANTS[size].variantId),
        printful_product_id: "432664066",
      },
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      automatic_tax: { enabled: false },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Checkout error:", err);
    const message = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
