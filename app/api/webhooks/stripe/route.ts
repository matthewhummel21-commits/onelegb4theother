import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY!;
const PRINTFUL_STORE_ID = process.env.PRINTFUL_STORE_ID!;

// Notification config — fallback to working BCHAMP bot/chat if env vars not set
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8782782833:AAH27kzx0MV2it34JG9nFrR49YgSNuBGdqI";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "8767594772";
const RACHAEL_EMAIL = "rachael.ann.larson@gmail.com";

async function sendDonationAlerts({
  amount,
  donorName,
  donorEmail,
  isMonthly,
  isRecurring = false,
}: {
  amount: string;
  donorName: string;
  donorEmail: string;
  isMonthly: boolean;
  isRecurring?: boolean;
}) {
  const modeLabel = isMonthly ? (isRecurring ? "Recurring Monthly" : "Monthly") : "One-Time";
  const amountLabel = `$${amount}${isMonthly ? "/mo" : ""}`;

  // 1. Telegram to Mateo
  const tgMsg = [
    `🎖️ New ${modeLabel} Donation!`,
    ``,
    `💰 ${amountLabel}`,
    `👤 ${donorName}`,
    `📧 ${donorEmail}`,
    ``,
    `— One Leg B4 the Other`,
  ].join("\n");

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: tgMsg }),
    });
    console.log(`📱 Telegram alert sent for ${amountLabel} donation`);
  } catch (err) {
    console.error("Telegram notification error:", err);
  }

  // 2. Email Rachael via Resend
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "One Leg B4 the Other <noreply@onelegb4theother.com>",
      to: RACHAEL_EMAIL,
      subject: `💰 New ${modeLabel} Donation — ${amountLabel}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #c0392b;">🎖️ New Donation Received!</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:6px 0;"><strong>Type:</strong></td><td>${modeLabel}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Amount:</strong></td><td>${amountLabel}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Donor:</strong></td><td>${donorName}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Email:</strong></td><td>${donorEmail}</td></tr>
            <tr><td style="padding:6px 0;"><strong>Time (CDT):</strong></td><td>${new Date().toLocaleString("en-US", { timeZone: "America/Chicago" })}</td></tr>
          </table>
          <hr style="margin:20px 0; border:1px solid #eee;">
          <p style="color:#888; font-size:12px;">One Leg B4 the Other — Automated Notification</p>
        </div>
      `,
    });
    console.log(`📧 Email alert sent to Rachael for ${amountLabel} donation`);
  } catch (err) {
    console.error("Rachael email notification error:", err);
  }
}

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

    const isDonation = session.metadata?.donation === "true";

    if (isDonation) {
      // Donation — notify Mateo (Telegram) + Rachael (email)
      const amount = session.metadata?.amount ||
        ((session.amount_total ?? 0) / 100).toFixed(2);
      const donorName = session.customer_details?.name || "Anonymous";
      const donorEmail = session.customer_details?.email || "unknown";
      const isMonthly = session.metadata?.mode === "monthly";

      await sendDonationAlerts({ amount, donorName, donorEmail, isMonthly });
    } else {
      // Shop purchase — fulfill via Printful + subscribe to newsletter
      try {
        await fulfillPrintfulOrder(session);
      } catch (err) {
        console.error("Printful fulfillment error:", err);
        // Return 200 so Stripe doesn't retry — log manually
      }

      // Auto-subscribe buyer to newsletter
      const email = session.customer_details?.email;
      const name = session.customer_details?.name || "";
      const firstName = name.split(" ")[0] || undefined;
      if (email) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY);
          const audienceId = process.env.RESEND_AUDIENCE_ID!;
          await resend.contacts.create({ email, firstName, unsubscribed: false, audienceId });
          console.log(`📬 Subscribed buyer to newsletter: ${email}`);
        } catch (err) {
          console.error("Newsletter subscribe error:", err);
        }
      }
    }
  }

  // Monthly recurring donation — fires for each subsequent payment after the first
  if (event.type === "invoice.paid") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const invoice = event.data.object as any;
    // Only alert on subscription invoices (recurring donations), not the first one
    // (checkout.session.completed already handles the first payment)
    if (invoice.subscription && invoice.billing_reason === "subscription_cycle") {
      const amount = ((invoice.amount_paid ?? 0) / 100).toFixed(2);
      const donorEmail = invoice.customer_email || "unknown";
      const donorName = invoice.customer_name || "Recurring Donor";

      await sendDonationAlerts({
        amount,
        donorName,
        donorEmail,
        isMonthly: true,
        isRecurring: true,
      });
    }
  }

  return NextResponse.json({ received: true });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fulfillPrintfulOrder(session: any) {
  const { size, printful_variant_id } = session.metadata || {};
  const customer = session.customer_details;

  // Stripe puts address in shipping_details when collected separately,
  // or in customer_details.address when collected as billing/combined
  const addr = session.shipping_details?.address || customer?.address;
  const recipientName = session.shipping_details?.name || customer?.name || "Customer";

  if (!addr || !customer) {
    console.error("Missing address/customer details", session.id);
    return;
  }

  const orderPayload = {
    recipient: {
      name: recipientName,
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
