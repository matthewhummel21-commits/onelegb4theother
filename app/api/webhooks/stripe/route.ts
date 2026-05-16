import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event: Stripe.Event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      // No secret yet — parse raw (development only)
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error("Webhook signature failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const session = event.data.object as any;

    try {
      await fulfillPrintfulOrder(session);
    } catch (err) {
      console.error("Printful fulfillment error:", err);
      // Return 200 so Stripe doesn't retry — log manually
    }
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fulfillPrintfulOrder(session: any) {
  const { size, printful_variant_id } = session.metadata || {};
  const shipping = session.shipping_details;
  const customer = session.customer_details;

  if (!shipping?.address || !customer) {
    console.error("Missing shipping/customer details", session.id);
    return;
  }

  const addr = shipping.address;

  const orderPayload = {
    recipient: {
      name: shipping.name || customer.name || "Customer",
      email: customer.email,
      address1: addr.line1,
      address2: addr.line2 || "",
      city: addr.city,
      state_code: addr.state,
      country_code: addr.country || "US",
      zip: addr.postal_code,
    },
    items: [
      {
        sync_variant_id: Number(printful_variant_id),
        quantity: 1,
        retail_price: "55.00",
      },
    ],
    retail_costs: {
      subtotal: "55.00",
      shipping: "0.00",
      tax: "0.00",
      total: "55.00",
    },
  };

  const res = await fetch(
    `https://api.printful.com/orders?store_id=${PRINTFUL_STORE_ID}&confirm=true`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTFUL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderPayload),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    throw new Error(`Printful error: ${JSON.stringify(result)}`);
  }

  console.log(`✅ Printful order created: ${result.result?.id} for session ${session.id} (size: ${size})`);
}
