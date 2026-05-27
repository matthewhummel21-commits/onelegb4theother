import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// T-shirt variants
const SHIRT_VARIANTS: Record<string, number> = {
  XS: 5308241175, S: 5308241177, M: 5308241178, L: 5308241179,
  XL: 5308241181, "2XL": 5308241182, "3XL": 5308241183,
};

// Sweatpants variants — Black and Vintage Heather Grey, S-3XL
const SWEATS_VARIANTS: Record<string, Record<string, number>> = {
  Black: {
    S: 5327615160, M: 5327615161, L: 5327615162,
    XL: 5327615163, "2XL": 5327615164, "3XL": 5327615165,
  },
  "Vintage Heather Grey": {
    S: 5327615166, M: 5327615167, L: 5327615168,
    XL: 5327615169, "2XL": 5327615170, "3XL": 5327615171,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { product, size, color, promoCode } = await req.json();
    const isSweatpants = product === "sweatpants";

    // Validate variant
    let syncVariantId: number;
    if (isSweatpants) {
      const colorMap = SWEATS_VARIANTS[color];
      if (!colorMap || !colorMap[size]) {
        return NextResponse.json({ error: "Invalid color or size" }, { status: 400 });
      }
      syncVariantId = colorMap[size];
    } else {
      if (!size || !SHIRT_VARIANTS[size]) {
        return NextResponse.json({ error: "Invalid size" }, { status: 400 });
      }
      syncVariantId = SHIRT_VARIANTS[size];
    }

    // Validate promo code
    const PROMO_CODES: Record<string, { label: string; shirtPrice: number; sweatsPrice: number }> = {
      TEAM: { label: "Team / Nonprofit Discount", shirtPrice: 2999, sweatsPrice: 4444 },
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
              name: isSweatpants
                ? `One Leg B4 the Other — Issued With Honor Sweatpants (${color} / ${size})`
                : `One Leg B4 the Other — Issued With Honor Tee (${size})`,
              description: isSweatpants
                ? "Bella + Canvas heavyweight fleece. Your purchase helps fund adaptive pants for veterans in need."
                : promo
                  ? "Team / nonprofit price — thank you for your support!"
                  : "Your purchase funds a pair of adaptive pants for a veteran in need.",
              images: [
                "https://files.cdn.printful.com/files/844/844011d92c81ab651408cb0aa7b88076_preview.png",
              ],
            },
            unit_amount: isSweatpants
                ? (promo ? promo.sweatsPrice : 5500)
                : (promo ? promo.shirtPrice : 5500),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop`,
      metadata: {
        size,
        color: color || "",
        product: product || "shirt",
        printful_variant_id: String(syncVariantId),
        printful_product_id: isSweatpants ? "435175071" : "432664066",
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
