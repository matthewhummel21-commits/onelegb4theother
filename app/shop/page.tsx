"use client";

import { useState } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SWEATS_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const SWEATS_COLORS = ["Black", "Vintage Heather Grey"];

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const VALID_CODES: Record<string, number> = { TEAM: 2999 };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (VALID_CODES[code] !== undefined) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid code. Try again.");
    }
  };

  const appliedCode = promoApplied ? promoCode.toUpperCase().trim() : null;
  const finalPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode] : 5500;
  const displayPrice = (finalPrice / 100).toFixed(2);

  const [sweatsSize, setSweatsSize] = useState<string | null>(null);
  const [sweatsColor, setSweatsColor] = useState<string>("Black");
  const [sweatsLoading, setSweatsLoading] = useState(false);
  const [sweatsError, setSweatsError] = useState<string | null>(null);

  const handleSweatsCheckout = async () => {
    if (!sweatsSize || sweatsLoading) return;
    setSweatsLoading(true);
    setSweatsError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "sweatpants", size: sweatsSize, color: sweatsColor }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setSweatsError(data.error || "Something went wrong."); setSweatsLoading(false); }
    } catch {
      setSweatsError("Network error. Please try again.");
      setSweatsLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedSize || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "shirt", size: selectedSize, promoCode: appliedCode || undefined }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Try again.");
        setLoading(false);
      }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-extrabold text-lg tracking-tight">
            One Leg B4 the Other
          </a>
          <a href="/#donate" className="px-4 py-2 rounded-xl bg-[#b22234] text-white text-sm font-bold hover:bg-[#8b0000] transition-colors">
            Donate
          </a>
        </div>
      </nav>

      <div className="pt-28 pb-20 px-6 max-w-5xl mx-auto">
        <BlurFade delay={0.1}>
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">
              Issued With Honor
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Wear the Mission</h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Every shirt sold funds a pair of adaptive pants for a veteran in need. $55 — no markup, full impact.
            </p>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Images */}
          <BlurFade delay={0.2}>
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-6">
                <img
                  src="https://files.cdn.printful.com/files/844/844011d92c81ab651408cb0aa7b88076_preview.png"
                  alt="Issued With Honor Tee — Front"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex flex-col items-center justify-center p-0 relative">
                  <img src="/shirt-front-mockup.jpg" alt="Front" className="w-full h-full object-cover rounded-xl" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-white/60 text-xs">Front</span>
                </div>
                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex flex-col items-center justify-center p-0 relative">
                  <img src="/shirt-back-mockup.jpg" alt="Back" className="w-full h-full object-cover rounded-xl" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-white/60 text-xs">Back</span>
                </div>
              </div>
            </div>
          </BlurFade>

          {/* Purchase Panel */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-1">Issued With Honor Tee</h2>
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-[#b22234]">${displayPrice}</p>
                {promoApplied && <span className="text-lg line-through text-white/30">$55.00</span>}
                {promoApplied && <span className="text-sm font-bold text-green-400">TEAM price ✓</span>}
              </div>
              <p className="text-white/50 text-sm mt-1">Free shipping · Printful fulfilled · Ships in 3–5 days</p>
            </div>

            {/* Size Selector */}
            <div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Select Size</p>
              <div className="flex flex-wrap gap-3">
                {SHIRT_SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                      selectedSize === size
                        ? "bg-[#b22234] border-[#b22234] text-white"
                        : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Promo Code */}
            <div>
              <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Promo Code</p>
              {!promoApplied ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    placeholder="Enter code..."
                    className="flex-1 h-11 rounded-xl bg-gray-800 border border-gray-600 text-white text-sm px-4 focus:outline-none focus:border-[#b22234] uppercase placeholder:normal-case placeholder:text-white/30"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    className="h-11 px-5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between h-11 px-4 rounded-xl bg-green-900/30 border border-green-700/50">
                  <span className="text-green-400 text-sm font-bold">✓ Code TEAM applied — $29.99</span>
                  <button
                    type="button"
                    onClick={() => { setPromoApplied(false); setPromoCode(""); }}
                    className="text-white/40 hover:text-white text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p className="text-red-400 text-xs mt-1.5">{promoError}</p>}
            </div>

            {/* Impact callout */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-white/80 text-sm">
                {promoApplied
                  ? <><span className="text-white font-bold">Team price applied.</span> Thank you for being part of the mission. 🎖️</>
                  : <><span className="text-white font-bold">Your $55</span> directly funds a pair of adaptive pants for a veteran on our waitlist. That&apos;s it. No overhead theater.</>
                }
              </p>
            </div>

            {!selectedSize && (
              <p className="text-yellow-400 text-sm font-semibold">👆 Select a size above to continue</p>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              onClick={handleCheckout}
              disabled={!selectedSize || loading}
              className="w-full py-4 rounded-2xl text-base font-extrabold text-white transition-all"
              style={{
                background: selectedSize && !loading ? "rgb(178,34,52)" : "rgb(80,80,80)",
                cursor: selectedSize && !loading ? "pointer" : "not-allowed",
              }}
            >
              {loading ? "Redirecting to checkout..." : selectedSize ? `Buy Now — ${selectedSize} / $${displayPrice}` : "Select a Size to Continue"}
            </button>

            <p className="text-white/30 text-xs text-center">Secure checkout via Stripe · Sales tax may apply</p>
          </div>
        </div>

        {/* SWEATPANTS */}
        <div className="mt-20 border-t border-white/10 pt-16">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Issued With Honor Sweatpants</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">Bella + Canvas heavyweight fleece. Primary emblem on the left leg. Black or grey.</p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <BlurFade delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-10">
                <div className="text-center">
                  <img src="https://files.cdn.printful.com/files/2f7/2f711ba9243f8c05399977fd7d8e9f32_preview.png" alt="Logo" className="w-32 h-32 object-contain mx-auto mb-4 opacity-60" />
                  <p className="text-white/40 text-sm">Mockup generating — check Printful dashboard</p>
                </div>
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Issued With Honor Sweatpants</h3>
                  <p className="text-3xl font-bold text-[#b22234]">$44.00</p>
                  <p className="text-white/50 text-sm mt-1">Free shipping · Bella + Canvas 4737 · Ships in 3–5 days</p>
                </div>

                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Color</p>
                  <div className="flex gap-3">
                    {SWEATS_COLORS.map((c) => (
                      <button key={c} onClick={() => setSweatsColor(c)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          sweatsColor === c ? "bg-[#b22234] border-[#b22234] text-white" : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400"
                        }`}>
                        {c === "Vintage Heather Grey" ? "Heather Grey" : c}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Size</p>
                  <div className="flex flex-wrap gap-3">
                    {SWEATS_SIZES.map((size) => (
                      <button key={size} onClick={() => setSweatsSize(size)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          sweatsSize === size ? "bg-[#b22234] border-[#b22234] text-white" : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400 hover:text-white"
                        }`}>
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/30 text-xs mt-2">Need 4XL? <a href="/#contact" className="underline hover:text-white">Contact us</a> — we’ll handle it.</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/80 text-sm"><span className="text-white font-bold">Your $44</span> helps fund a pair of adaptive pants for a veteran on our waitlist.</p>
                </div>

                {!sweatsSize && <p className="text-yellow-400 text-sm font-semibold">👆 Select a size above to continue</p>}
                {sweatsError && <p className="text-red-400 text-sm">{sweatsError}</p>}

                <button onClick={handleSweatsCheckout} disabled={!sweatsSize || sweatsLoading}
                  className="w-full py-4 rounded-2xl text-base font-extrabold text-white transition-all"
                  style={{ background: sweatsSize && !sweatsLoading ? "rgb(178,34,52)" : "rgb(80,80,80)", cursor: sweatsSize && !sweatsLoading ? "pointer" : "not-allowed" }}>
                  {sweatsLoading ? "Redirecting..." : sweatsSize ? `Buy Now — ${sweatsColor === "Vintage Heather Grey" ? "Grey" : sweatsColor} / ${sweatsSize} / $44.00` : "Select a Size to Continue"}
                </button>

                <p className="text-white/30 text-xs text-center">Secure checkout via Stripe · Sales tax may apply</p>
              </div>
            </BlurFade>
          </div>
        </div>
      </div>
    </main>
  );
}
