import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// T-shirt variants
const SHIRT_VARIANTS: Record<string, number> = {
  XS: 5308241175, S: 5308241177, M: 5308241178, L: 5308241179,
  XL: 5308241181, "2XL": 5308241182, "3XL": 5308241183,
};

// Sticker variants
const STICKER_VARIANTS: Record<string, number> = {
  "Logo": 5327655570,
  "QR Code": 5327655573,
};

// Richardson 112 hat
const RICHARDSON_VARIANT = 5327655782;

// Sock variants
const SOCK_VARIANTS: Record<string, number> = {
  S: 5327650869, M: 5327650894, L: 5327650895,
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

// Crewneck variants — CC 1466 garment-dyed, Pepper/Espresso/Black, S-3XL
const CREW_VARIANTS: Record<string, Record<string, number>> = {
  Pepper:   { S: 5327674453, M: 5327674454, L: 5327674455, XL: 5327674456, "2XL": 5327674457, "3XL": 5327674458 },
  Espresso: { S: 5327674459, M: 5327674460, L: 5327674461, XL: 5327674462, "2XL": 5327674463, "3XL": 5327674464 },
  Black:    { S: 5327674465, M: 5327674466, L: 5327674467, XL: 5327674468, "2XL": 5327674469, "3XL": 5327674470 },
};

// Sweatpants variants
const SWEATS_VARIANTS: Record<string, Record<string, number>> = {
  // Bella+Canvas 4737 heavyweight
  Black: { S: 5327615160, M: 5327615161, L: 5327615162, XL: 5327615163, "2XL": 5327615164, "3XL": 5327615165 },
  "Heather Grey": { S: 5327615166, M: 5327615167, L: 5327615168, XL: 5327615169, "2XL": 5327615170, "3XL": 5327615171 },
  // Comfort Colors 1469 garment-dyed
  Pepper: { S: 5327672970, M: 5327672977, L: 5327672978, XL: 5327672979, "2XL": 5327672980 },
  Espresso: { S: 5327672975, M: 5327672971, L: 5327672972, XL: 5327672973, "2XL": 5327672974 },
};

export async function POST(req: NextRequest) {
  try {
    const { product, size, color, promoCode } = await req.json();
    const isSweatpants = product === "sweatpants";
    const isHat = product === "hat";
    const isSocks = product === "socks";
    const isSticker = product === "sticker";
    const isRichardson = product === "richardson";
    const isHoodie = product === "hoodie";
    const isCrew = product === "crew";

    // Validate variant
    let syncVariantId: number;
    if (isHoodie) {
      const colorMap = HOODIE_VARIANTS[color];
      if (!colorMap || !colorMap[size]) return NextResponse.json({ error: "Invalid hoodie color or size" }, { status: 400 });
      syncVariantId = colorMap[size];
    } else if (isCrew) {
      const colorMap = CREW_VARIANTS[color];
      if (!colorMap || !colorMap[size]) return NextResponse.json({ error: "Invalid crewneck color or size" }, { status: 400 });
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
    } else if (isRichardson) {
      syncVariantId = RICHARDSON_VARIANT;
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
    const PROMO_CODES: Record<string, { label: string; shirtPrice: number; sweatsPrice: number; hatPrice: number; socksPrice: number; stickerPrice: number; richardsonPrice: number; hoodiePrice: number; crewPrice: number }> = {
      TEAM: { label: "Team / Nonprofit Discount", shirtPrice: 2999, sweatsPrice: 4444, hatPrice: 2800, socksPrice: 1500, stickerPrice: 500, richardsonPrice: 2800, hoodiePrice: 5500, crewPrice: 4444 },
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
                : isCrew
                ? `One Leg B4 the Other — Garment-Dyed Crewneck (${color} / ${size})`
                : isSticker
                ? `One Leg B4 the Other — ${color} Sticker (3"×3")`
                : isSocks
                ? `One Leg B4 the Other — Issued With Honor Socks (${size})`
                : isHat
                ? `One Leg B4 the Other — Foam Trucker Hat (${color})`
                : isSweatpants
                ? `One Leg B4 the Other — Issued With Honor Sweatpants (${color} / ${size})`
                : `One Leg B4 the Other — Issued With Honor Tee (${size})`,
              description: isHoodie
                ? "CC 1567 garment-dyed hoodie. Your purchase helps fund adaptive pants for veterans in need."
                : isCrew
                ? "CC 1466 garment-dyed crewneck. Your purchase helps fund adaptive pants for veterans in need."
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
                : isCrew
                ? (promo ? promo.crewPrice : 5500)
                : isSticker
                ? (promo ? promo.stickerPrice : 700)
                : isSocks
                ? (promo ? promo.socksPrice : 2000)
                : isHat
                ? (promo ? promo.hatPrice : 3800)
                : isSweatpants
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
        printful_product_id: isHoodie ? "435182091" : isCrew ? "435182102" : isSticker ? (color === "Logo" ? "435179893" : "435179896") : isSocks ? "435179141" : isHat ? "435178002" : isSweatpants ? (color === "Pepper" || color === "Espresso" ? "435181837" : "435175071") : "432664066",
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
