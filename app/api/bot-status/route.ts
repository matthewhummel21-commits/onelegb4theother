import { NextResponse } from "next/server";
import * as xrpl from "xrpl";

const BOT_ADDRESS  = "rBsRhY1Kg85rUjfWyT1f4L54aHojGArzGY";
const RPLS_ISSUER  = "r93hE5FNShDdUqazHzNvwsCxL9mSqwyiru";
const RPLS_HEX     = "52504C5300000000000000000000000000000000";

// Morse sequence index tracking (stateless — derive from on-chain offer count)
const MORSE_SEQ = [3,3,3,7,3,1,7,1,11,1,3,1,1,7,1,7,3,3,1,11,1,3,11,1,1,1,7,1,3,7,1,3,1,1,7,1,1,3,7,3,7,1];

export async function GET() {
  const client = new xrpl.Client("wss://xrplcluster.com");
  try {
    await client.connect();

    const [infoRes, linesRes, offersRes] = await Promise.all([
      client.request({ command: "account_info", account: BOT_ADDRESS, ledger_index: "current" }),
      client.request({ command: "account_lines", account: BOT_ADDRESS }),
      client.request({ command: "account_offers", account: BOT_ADDRESS }),
    ]);

    const xrpBal  = Number(infoRes.result.account_data.Balance) / 1_000_000;
    const rplsLine = linesRes.result.lines.find(
      (l: {account: string; currency: string; balance: string}) => l.account === RPLS_ISSUER && l.currency === RPLS_HEX
    );
    const rplsBal = rplsLine ? parseFloat(rplsLine.balance) : 0;

    const rawOffers = offersRes.result.offers || [];

    const sells: {price: number; amount: number}[] = [];
    const buys:  {price: number; amount: number}[] = [];

    for (const o of rawOffers) {
      // SELL: taker_gets = RPLS, taker_pays = XRP drops
      if (typeof o.taker_gets === "object" && o.taker_gets.currency === RPLS_HEX) {
        const rplsAmt  = parseFloat(o.taker_gets.value);
        const xrpDrops = typeof o.taker_pays === "string" ? Number(o.taker_pays) : 0;
        const price    = xrpDrops > 0 ? (xrpDrops / 1e6) / rplsAmt : 0;
        sells.push({ price, amount: rplsAmt });
      }
      // BUY: taker_gets = XRP drops, taker_pays = RPLS
      else if (typeof o.taker_pays === "object" && o.taker_pays.currency === RPLS_HEX) {
        const rplsAmt  = parseFloat(o.taker_pays.value);
        const xrpDrops = typeof o.taker_gets === "string" ? Number(o.taker_gets) : 0;
        const price    = xrpDrops > 0 ? (xrpDrops / 1e6) / rplsAmt : 0;
        buys.push({ price, amount: rplsAmt });
      }
    }

    sells.sort((a, b) => a.price - b.price);
    buys.sort((a,  b) => b.price - a.price);

    return NextResponse.json({
      xrp:         xrpBal,
      rpls:        rplsBal,
      sells,
      buys,
      morseIdx:    rawOffers.length % MORSE_SEQ.length,
      lastUpdated: new Date().toLocaleTimeString("en-US", { timeZone: "America/Chicago", hour12: true }),
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    try { await client.disconnect(); } catch {}
  }
}
