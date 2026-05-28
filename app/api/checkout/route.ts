import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// T-shirt variants (small logo front + back print) — 432664066
const SHIRT_VARIANTS: Record<string, number> = {
  XS: 5308241175, S: 5308241177, M: 5308241178, L: 5308241179,
  XL: 5308241181, "2XL": 5308241182, "3XL": 5308241183,
};

// Large Logo Tee variants (large center logo + left sleeve flag) — 435183890
const LARGE_TEE_VARIANTS: Record<string, number> = {
  XS: 5327718216, S: 5327746590, M: 5327746591, L: 5327746592,
  XL: 5327746594, "2XL": 5327746595, "3XL": 5327746596,
};

// Sticker variants (Logo only)
const STICKER_VARIANTS: Record<string, number> = {
  "Logo": 5327655570,
};

// Sock variants — 435179129
const SOCK_VARIANTS: Record<string, number> = {
  S: 5327650831, M: 5327650832, L: 5327650833,
};

// Men's Fleece Shorts variants — 435293736
const FLEECE_VARIANTS: Record<string, Record<string, number>> = {
  Black:        { S: 5328923097, M: 5328923098, L: 5328923099, XL: 5328923100, "2XL": 5328923101 },
  "Heather Grey": { S: 5328923102, M: 5328923103, L: 5328923105, XL: 5328923111, "2XL": 5328923115 },
};

// Women's PJ Shorts variants — 435293738
const PJ_VARIANTS: Record<string, number> = {
  XS: 5328923158, S: 5328923163, M: 5328923164, L: 5328923165, XL: 5328923166, "2XL": 5328923167,
};

// Hat variants
const HAT_VARIANTS: Record<string, number> = {
  "Black/White/Black": 5327641776,
  "All Black": 5327644094,
  "Red/White/Blue": 5327644163,
};

// Hoodie variants — CC 1567 garment-dyed, Pepper/Grey/True Navy, S-3XL
const HOODIE_VARIANTS: Record<string, Record<string, number>> = {
  Pepper:     { S: 5327674379, M: 5327674380, L: 5327674381, XL: 5327674382, "2XL": 5327674383, "3XL": 5327674384 },
  Grey:       { S: 5327674385, M: 5327674386, L: 5327674387, XL: 5327674388, "2XL": 5327674389, "3XL": 5327674390 },
  "True Navy": { S: 5327674391, M: 5327674392, L: 5327674393, XL: 5327674394, "2XL": 5327674395, "3XL": 5327674396 },
};

// Sweatpants variants
const SWEATS_VARIANTS: Record<string, Record<string, number>> = {
  // Bella+Canvas — 435175062
  Black:          { S: 5327615052, M: 5327615053, L: 5327615054, XL: 5327615055, "2XL": 5327615056, "3XL": 5327615057 },
  "Heather Grey": { S: 5327615058, M: 5327615059, L: 5327615060, XL: 5327615061, "2XL": 5327615062, "3XL": 5327615063 },
  // Comfort Colors 1469 garment-dyed — 435181837
  Pepper:   { S: 5327672970, M: 5327672977, L: 5327672978, XL: 5327672979, "2XL": 5327672980 },
  Espresso: { S: 5327672975, M: 5327672971, L: 5327672972, XL: 5327672973, "2XL": 5327672974 },
};

export async function POST(req: NextRequest) {
  try {
    const { product, size, color, promoCode } = await req.json();
    const isSweatpants = product === "sweatpants";
    const isHat = product === "hat";
    const isSocks = product === "socks";
    const isSticker = product === "sticker";
    const isHoodie = product === "hoodie";
    const isLargeTee = product === "largetee";
    const isFleece = product === "fleece";
    const isPJ = product === "pj";

    // Validate variant
    let syncVariantId: number;
    if (isHoodie) {
      const colorMap = HOODIE_VARIANTS[color];
      if (!colorMap || !colorMap[size]) return NextResponse.json({ error: "Invalid hoodie color or size" }, { status: 400 });
      syncVariantId = colorMap[size];
    } else if (isHat) {
      if (!color || !HAT_VARIANTS[color]) {
        return NextResponse.json({ error: "Invalid hat color" }, { status: 400 });
      }
      syncVariantId = HAT_VARIANTS[color];
    } else if (isSticker) {
      if (!color || !STICKER_VARIANTS[color]) {
        return NextResponse.json({ error: "Invalid sticker type" }, { status: 400 });
      }
      syncVariantId = STICKER_VARIANTS[color];
    } else if (isLargeTee) {
      if (!size || !LARGE_TEE_VARIANTS[size]) return NextResponse.json({ error: "Invalid size" }, { status: 400 });
      syncVariantId = LARGE_TEE_VARIANTS[size];
    } else if (isFleece) {
      const colorMap = FLEECE_VARIANTS[color];
      if (!colorMap || !colorMap[size]) return NextResponse.json({ error: "Invalid fleece color or size" }, { status: 400 });
      syncVariantId = colorMap[size];
    } else if (isPJ) {
      if (!size || !PJ_VARIANTS[size]) return NextResponse.json({ error: "Invalid size" }, { status: 400 });
      syncVariantId = PJ_VARIANTS[size];
    } else if (isSocks) {
      if (!size || !SOCK_VARIANTS[size]) {
        return NextResponse.json({ error: "Invalid sock size" }, { status: 400 });
      }
      syncVariantId = SOCK_VARIANTS[size];
    } else if (isSweatpants) {
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
    const PROMO_CODES: Record<string, { label: string; shirtPrice: number; sweatsPrice: number; hatPrice: number; socksPrice: number; stickerPrice: number; hoodiePrice: number }> = {
      TEAM: { label: "Team / Nonprofit Discount", shirtPrice: 3000, sweatsPrice: 4000, hatPrice: 2000, socksPrice: 1500, stickerPrice: 500, hoodiePrice: 5000 },
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
              name: isHoodie
                ? `One Leg B4 the Other — Garment-Dyed Hoodie (${color} / ${size})`
                : isLargeTee
                ? `One Leg B4 the Other — Issued With Honor Tee — Large Logo (${size})`
                : isSticker
                ? `One Leg B4 the Other — Logo Sticker (3”×3”)`
                : isSocks
                ? `One Leg B4 the Other — Issued With Honor Socks (${size})`
                : isHat
                ? `One Leg B4 the Other — Foam Trucker Hat (${color})`
                : isSweatpants
                ? `One Leg B4 the Other — Issued With Honor Sweatpants (${color} / ${size})`
                : `One Leg B4 the Other — Issued With Honor Tee (${size})`,
              description: isHoodie
                ? "CC 1567 garment-dyed hoodie. Your purchase helps fund adaptive pants for veterans in need."
                : isLargeTee
                ? "Next Level 3600 tee with large front logo and left sleeve flag. Your purchase helps fund adaptive pants for veterans in need."
                : isSticker
                ? "Premium die-cut vinyl sticker. Your purchase helps fund adaptive pants for veterans in need."
                : isSocks
                ? "Sublimation crew socks. Your purchase helps fund adaptive pants for veterans in need."
                : isHat
                ? "Otto Cap foam trucker hat. Your purchase helps fund adaptive pants for veterans in need."
                : isSweatpants
                ? "Comfort Colors garment-dyed or Bella+Canvas heavyweight sweatpants. Your purchase helps fund adaptive pants for veterans in need."
                : promo
                  ? "Team / nonprofit price — thank you for your support!"
                  : "Your purchase funds a pair of adaptive pants for a veteran in need.",
              images: [
                "https://files.cdn.printful.com/files/844/844011d92c81ab651408cb0aa7b88076_preview.png",
              ],
            },
            unit_amount: isHoodie
                ? (promo ? promo.hoodiePrice : 6500)
                : isLargeTee
                ? (promo ? promo.shirtPrice : 4500)
                : isFleece
                ? (promo ? (promo as unknown as Record<string,number>).fleece ?? 4500 : 4500)
                : isPJ
                ? (promo ? (promo as unknown as Record<string,number>).pj ?? 4000 : 4000)
                : isSticker
                ? (promo ? promo.stickerPrice : 700)
                : isSocks
                ? (promo ? promo.socksPrice : 2000)
                : isHat
                ? (promo ? promo.hatPrice : 3800)
                : isSweatpants
                ? (promo ? promo.sweatsPrice : 5500)
                : (promo ? promo.shirtPrice : 4500),
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
        printful_product_id: isHoodie ? "435182091" : isLargeTee ? "435183890" : isFleece ? "435293736" : isPJ ? "435293738" : isSticker ? "435179893" : isSocks ? "435179129" : isHat ? "435178002" : isSweatpants ? (color === "Pepper" || color === "Espresso" ? "435181837" : "435175062") : "432664066",
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
