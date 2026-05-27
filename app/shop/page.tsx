"use client";

import { useState, useEffect, useRef } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

const NAV_ITEMS = [
  { id: "tee",        label: "Tee" },
  { id: "sweatpants", label: "Sweatpants" },
  { id: "hats",       label: "Hats" },
  { id: "socks",      label: "Socks" },

  { id: "stickers",   label: "Stickers" },
];

const SHIRT_SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];
const SWEATS_SIZES = ["S", "M", "L", "XL", "2XL", "3XL"];
const SWEATS_COLORS = ["Black", "Vintage Heather Grey"];
const HAT_COLORS = ["Black/White/Black", "All Black", "Red/White/Blue"];
const SOCK_SIZES = ["S", "M", "L"];

export default function ShopPage() {
  const [activeSection, setActiveSection] = useState("tee");
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navH = navRef.current?.offsetHeight || 60;
    const top = el.getBoundingClientRect().top + window.scrollY - navH - 16;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState("");

  const VALID_CODES: Record<string, { shirt: number; sweats: number; hat: number; socks: number; sticker: number; richardson: number }> = {
    TEAM: { shirt: 2999, sweats: 4444, hat: 2800, socks: 1500, sticker: 500, richardson: 2800 }, // richardson kept for API compat
  };

  const handleApplyPromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (VALID_CODES[code]) {
      setPromoApplied(true);
      setPromoError("");
    } else {
      setPromoApplied(false);
      setPromoError("Invalid code. Try again.");
    }
  };

  const appliedCode = promoApplied ? promoCode.toUpperCase().trim() : null;
  const shirtPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].shirt : 5500;
  const sweatsPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].sweats : 5500;
  const displayPrice = (shirtPrice / 100).toFixed(2);
  const sweatsDisplayPrice = (sweatsPrice / 100).toFixed(2);

  const [sweatsSize, setSweatsSize] = useState<string | null>(null);
  const [sweatsColor, setSweatsColor] = useState<string>("Black");
  const [sweatsLoading, setSweatsLoading] = useState(false);
  const [sweatsError, setSweatsError] = useState<string | null>(null);
  const [hatColor, setHatColor] = useState<string>("Black/White/Black");
  const [hatLoading, setHatLoading] = useState(false);
  const [hatError, setHatError] = useState<string | null>(null);

  const socksPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].socks : 2000;
  const socksDisplayPrice = (socksPrice / 100).toFixed(2);
  const [socksSize, setSocksSize] = useState<string | null>(null);
  const [socksLoading, setSocksLoading] = useState(false);
  const [socksError, setSocksError] = useState<string | null>(null);

  const handleSocksCheckout = async () => {
    if (!socksSize || socksLoading) return;
    setSocksLoading(true);
    setSocksError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "socks", size: socksSize, promoCode: appliedCode || undefined }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setSocksError(data.error || "Something went wrong."); setSocksLoading(false); }
    } catch {
      setSocksError("Network error. Please try again.");
      setSocksLoading(false);
    }
  };

  const stickerPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].sticker : 700;
  const stickerDisplayPrice = (stickerPrice / 100).toFixed(2);
  const richardsonPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].richardson : 3500;
  const richardsonDisplayPrice = (richardsonPrice / 100).toFixed(2);
  const [stickerType, setStickerType] = useState<string>("Logo");
  const [stickerLoading, setStickerLoading] = useState(false);
  const [stickerError, setStickerError] = useState<string | null>(null);
  const [richardsonLoading, setRichardsonLoading] = useState(false);
  const [richardsonError, setRichardsonError] = useState<string | null>(null);

  const handleStickerCheckout = async () => {
    setStickerLoading(true); setStickerError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "sticker", color: stickerType, promoCode: appliedCode || undefined }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; } else { setStickerError(data.error || "Error"); setStickerLoading(false); }
    } catch { setStickerError("Network error."); setStickerLoading(false); }
  };

  const handleRichardsonCheckout = async () => {
    setRichardsonLoading(true); setRichardsonError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "richardson", promoCode: appliedCode || undefined }) });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; } else { setRichardsonError(data.error || "Error"); setRichardsonLoading(false); }
    } catch { setRichardsonError("Network error."); setRichardsonLoading(false); }
  };

  const hatPrice = appliedCode && VALID_CODES[appliedCode] ? VALID_CODES[appliedCode].hat : 3800;
  const hatDisplayPrice = (hatPrice / 100).toFixed(2);

  const handleHatCheckout = async () => {
    if (hatLoading) return;
    setHatLoading(true);
    setHatError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "hat", color: hatColor, promoCode: appliedCode || undefined }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setHatError(data.error || "Something went wrong."); setHatLoading(false); }
    } catch {
      setHatError("Network error. Please try again.");
      setHatLoading(false);
    }
  };

  const handleSweatsCheckout = async () => {
    if (!sweatsSize || sweatsLoading) return;
    setSweatsLoading(true);
    setSweatsError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: "sweatpants", size: sweatsSize, color: sweatsColor, promoCode: appliedCode || undefined }),
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

      {/* SHOP NAV */}
      <div ref={navRef} className="sticky top-[65px] z-40 bg-black/95 backdrop-blur-md border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-bold tracking-wide uppercase transition-all border-b-2 ${
                  activeSection === id
                    ? "text-[#b22234] border-[#b22234]"
                    : "text-white/40 border-transparent hover:text-white/80 hover:border-white/20"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {promoApplied && (
        <div className="sticky top-[113px] z-30 bg-green-900/90 backdrop-blur-sm border-b border-green-700/50 text-center py-2 text-green-300 text-sm font-bold">
          ✓ TEAM code active — discounted prices applied on all items
        </div>
      )}

      <div className="pt-12 pb-20 px-6 max-w-5xl mx-auto">
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

        <div id="tee" className="grid md:grid-cols-2 gap-12 items-start">
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
                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex flex-col items-center justify-center p-2 relative">
                  <img src="/shirt-front-mockup.jpg" alt="Front" className="w-full h-full object-contain" />
                  <span className="absolute bottom-2 left-0 right-0 text-center text-white/60 text-xs">Front</span>
                </div>
                <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex flex-col items-center justify-center p-2 relative">
                  <img src="/shirt-back-mockup.jpg" alt="Back" className="w-full h-full object-contain" />
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
        <div id="sweatpants" className="mt-20 border-t border-white/10 pt-16">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Issued With Honor Sweatpants</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">Bella + Canvas heavyweight fleece. Primary emblem on the left leg. Black or grey.</p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <BlurFade delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-0">
                <img
                  src={sweatsColor === "Vintage Heather Grey" ? "/sweats-grey-mockup.jpg" : "/sweats-black-mockup.jpg"}
                  alt={`Issued With Honor Sweatpants — ${sweatsColor}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Issued With Honor Sweatpants</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-[#b22234]">${sweatsDisplayPrice}</p>
                    {promoApplied && <span className="text-lg line-through text-white/30">$55.00</span>}
                    {promoApplied && <span className="text-sm font-bold text-green-400">TEAM price ✓</span>}
                  </div>
                  <p className="text-white/50 text-sm mt-1">Free shipping · Bella + Canvas 4737 · Ships in 3–5 days</p>
                </div>

                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Color</p>
                  <div className="flex gap-3">
                    {SWEATS_COLORS.map((c) => (
                      <button key={c} onClick={() => { setSweatsColor(c); setSweatsSize(null); }}
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
                  {sweatsLoading ? "Redirecting..." : sweatsSize ? `Buy Now — ${sweatsColor === "Vintage Heather Grey" ? "Grey" : sweatsColor} / ${sweatsSize} / $${sweatsDisplayPrice}` : "Select a Size to Continue"}
                </button>

                <p className="text-white/30 text-xs text-center">Secure checkout via Stripe · Sales tax may apply</p>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* HATS */}
        <div id="hats" className="mt-20 border-t border-white/10 pt-16">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Issued With Honor Trucker Hat</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">Otto Cap foam front trucker. Three colorways. One size fits all.</p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <BlurFade delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-6">
                <img
                  src={
                    hatColor === "All Black" ? "/hat-black-mockup.jpg"
                    : hatColor === "Red/White/Blue" ? "/hat-rwb-mockup.jpg"
                    : "/hat-bwb-mockup.jpg"
                  }
                  alt={`Foam Trucker Hat — ${hatColor}`}
                  className="w-full h-full object-contain transition-opacity duration-300"
                />
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Issued With Honor Trucker Hat</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-[#b22234]">${hatDisplayPrice}</p>
                    {promoApplied && <span className="text-lg line-through text-white/30">$38.00</span>}
                    {promoApplied && <span className="text-sm font-bold text-green-400">TEAM price ✓</span>}
                  </div>
                  <p className="text-white/50 text-sm mt-1">Free shipping · Otto Cap 39-165 · One size fits all</p>
                </div>

                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Color</p>
                  <div className="flex flex-wrap gap-3">
                    {HAT_COLORS.map((c) => (
                      <button key={c} onClick={() => setHatColor(c)}
                        className={`px-4 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          hatColor === c ? "bg-[#b22234] border-[#b22234] text-white" : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400"
                        }`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/80 text-sm"><span className="text-white font-bold">Your $38</span> helps fund a pair of adaptive pants for a veteran on our waitlist.</p>
                </div>

                {hatError && <p className="text-red-400 text-sm">{hatError}</p>}

                <button onClick={handleHatCheckout} disabled={hatLoading}
                  className="w-full py-4 rounded-2xl text-base font-extrabold text-white transition-all"
                  style={{ background: !hatLoading ? "rgb(178,34,52)" : "rgb(80,80,80)", cursor: !hatLoading ? "pointer" : "not-allowed" }}>
                  {hatLoading ? "Redirecting..." : `Buy Now — ${hatColor === "Black/White/Black" ? "Classic" : hatColor === "All Black" ? "All Black" : "Red/White/Blue"} / $${hatDisplayPrice}`}
                </button>

                <p className="text-white/30 text-xs text-center">Secure checkout via Stripe · Sales tax may apply</p>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* SOCKS */}
        <div id="socks" className="mt-20 border-t border-white/10 pt-16">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Issued With Honor Socks</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">Sublimation crew socks. Navy base, red stripes, logo on each side.</p>
            </div>
          </BlurFade>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <BlurFade delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-6">
                <img src="/socks-mockup.jpg" alt="Issued With Honor Socks" className="w-full h-full object-contain" />
              </div>
            </BlurFade>

            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Issued With Honor Socks</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-[#b22234]">${socksDisplayPrice}</p>
                    {promoApplied && <span className="text-lg line-through text-white/30">$20.00</span>}
                    {promoApplied && <span className="text-sm font-bold text-green-400">TEAM price ✓</span>}
                  </div>
                  <p className="text-white/50 text-sm mt-1">Free shipping · One pair · Ships in 3–5 days</p>
                </div>

                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Size</p>
                  <div className="flex gap-3">
                    {SOCK_SIZES.map((s) => (
                      <button key={s} onClick={() => setSocksSize(s)}
                        className={`px-6 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          socksSize === s ? "bg-[#b22234] border-[#b22234] text-white" : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400"
                        }`}>
                        {s}
                      </button>
                    ))}
                  </div>
                  <p className="text-white/30 text-xs mt-2">S = Wmn 4–10 / Mn 4–8 · M = Wmn 10–13 / Mn 8–11 · L = Mn 11–14</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/80 text-sm"><span className="text-white font-bold">Your $20</span> helps fund a pair of adaptive pants for a veteran on our waitlist.</p>
                </div>

                {!socksSize && <p className="text-yellow-400 text-sm font-semibold">👆 Select a size above to continue</p>}
                {socksError && <p className="text-red-400 text-sm">{socksError}</p>}

                <button onClick={handleSocksCheckout} disabled={!socksSize || socksLoading}
                  className="w-full py-4 rounded-2xl text-base font-extrabold text-white transition-all"
                  style={{ background: socksSize && !socksLoading ? "rgb(178,34,52)" : "rgb(80,80,80)", cursor: socksSize && !socksLoading ? "pointer" : "not-allowed" }}>
                  {socksLoading ? "Redirecting..." : socksSize ? `Buy Now — Size ${socksSize} / $${socksDisplayPrice}` : "Select a Size to Continue"}
                </button>

                <p className="text-white/30 text-xs text-center">Secure checkout via Stripe · Sales tax may apply</p>
              </div>
            </BlurFade>
          </div>
        </div>

        {/* STICKERS */}
        <div id="stickers" className="mt-20 border-t border-white/10 pt-16">
          <BlurFade delay={0.1}>
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-1 rounded-full bg-[#b22234]/20 text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">New</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Die-Cut Vinyl Stickers</h2>
              <p className="text-white/60 text-lg max-w-xl mx-auto">Thick premium vinyl. Weather resistant. 3∃3. Logo or QR code that links straight to the site.</p>
            </div>
          </BlurFade>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <BlurFade delay={0.2}>
              <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-8">
                <img
                  src={stickerType === "QR Code" ? "/sticker-qr.png" : "/sticker-logo.png"}
                  alt={`${stickerType} Sticker`}
                  className="w-full h-full object-contain"
                />
              </div>
            </BlurFade>
            <BlurFade delay={0.3}>
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-extrabold text-white mb-1">Die-Cut Vinyl Stickers</h3>
                  <div className="flex items-baseline gap-3">
                    <p className="text-3xl font-bold text-[#b22234]">${stickerDisplayPrice}</p>
                    {promoApplied && <span className="text-lg line-through text-white/30">$7.00</span>}
                    {promoApplied && <span className="text-sm font-bold text-green-400">TEAM price ✓</span>}
                  </div>
                  <p className="text-white/50 text-sm mt-1">Free shipping · 3″×3″ premium vinyl · Weather resistant</p>
                </div>
                <div>
                  <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">Design</p>
                  <div className="flex gap-3">
                    {["Logo", "QR Code"].map((t) => (
                      <button key={t} onClick={() => setStickerType(t)}
                        className={`px-5 py-2 rounded-xl border-2 text-sm font-bold transition-all ${
                          stickerType === t ? "bg-[#b22234] border-[#b22234] text-white" : "border-gray-600 bg-gray-800 text-gray-100 hover:border-gray-400"
                        }`}>
                        {t === "QR Code" ? "QR Code → Site" : "Logo"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-white/80 text-sm"><span className="text-white font-bold">Your $7</span> helps fund a pair of adaptive pants for a veteran on our waitlist.</p>
                </div>
                {stickerError && <p className="text-red-400 text-sm">{stickerError}</p>}
                <button onClick={handleStickerCheckout} disabled={stickerLoading}
                  className="w-full py-4 rounded-2xl text-base font-extrabold text-white transition-all"
                  style={{ background: !stickerLoading ? "rgb(178,34,52)" : "rgb(80,80,80)", cursor: !stickerLoading ? "pointer" : "not-allowed" }}>
                  {stickerLoading ? "Redirecting..." : `Buy Now — ${stickerType} / $${stickerDisplayPrice}`}
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
