"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Product catalog ──────────────────────────────────────────────────────────

const SIZES_FULL  = ["XS","S","M","L","XL","2XL","3XL"];
const SIZES_GD    = ["S","M","L","XL","2XL","3XL"];
const SIZES_SWEATS_GD = ["S","M","L","XL","2XL"];
const SIZES_SOCKS = ["S","M","L"];

const PRODUCTS = [
  {
    id: "tee",
    name: "Issued With Honor Tee",
    subtitle: "Next Level 3600 · Small logo front · Full back print",
    price: 4500,
    colors: [
      { key: "White", label: "White", hex: "#FFFFFF", img: "/shirt-front-mockup.jpg", backImg: "/shirt-back-mockup.jpg" },
    ],
    sizes: SIZES_FULL,
    tag: "Bestseller",
  },

  {
    id: "hoodie",
    name: "Garment-Dyed Hoodie",
    subtitle: "Comfort Colors 1567 · Heavyweight",
    price: 6500,
    colors: [
      { key: "Pepper",    label: "Pepper",     hex: "#3D3635", img: "/hoodie-pepper-mockup.jpg" },
      { key: "Grey",      label: "Grey",        hex: "#9B9B9B", img: "/hoodie-grey-mockup.jpg" },
      { key: "True Navy", label: "True Navy",   hex: "#1B2A4A", img: "/hoodie-navy-mockup.jpg" },
    ],
    sizes: SIZES_GD,
    tag: "🔥 Trending",
  },

  {
    id: "sweatpants",
    name: "Sweatpants",
    subtitle: "Bella+Canvas or Comfort Colors · Garment-Dyed",
    price: 5500,
    colors: [
      { key: "Pepper",       label: "Pepper",       hex: "#3D3635", img: "/sweats-pepper-mockup.jpg",   gd: true },
      { key: "Espresso",     label: "Espresso",     hex: "#2C1A0E", img: "/sweats-espresso-mockup.jpg", gd: true },
      { key: "Black",        label: "Black",        hex: "#1A1A1A", img: "/sweats-black-mockup.jpg" },
      { key: "Heather Grey", label: "Heather Grey", hex: "#9B9B9B", img: "/sweats-grey-mockup.jpg" },
    ],
    sizes: SIZES_GD,
    tag: "New",
    dynamicSizes: true,
  },
  {
    id: "hat",
    name: "Foam Trucker Hat",
    subtitle: "Otto Cap 39-165 · One size",
    price: 3800,
    colors: [
      { key: "All Black",         label: "All Black",     hex: "#0A0A0A", img: "/hat-black-mockup.jpg" },
      { key: "Black/White/Black", label: "Classic",       hex: "#222222", img: "/hat-bwb-mockup.jpg" },
      { key: "Red/White/Blue",    label: "Red/White/Blue",hex: "#B22234", img: "/hat-rwb-mockup.jpg" },
    ],
    sizes: [],
    tag: "",
  },
  {
    id: "fleece",
    name: "Men's Fleece Shorts",
    subtitle: "Independent Trading Co. · Left leg logo",
    price: 4500,
    colors: [
      { key: "Black",        label: "Black",        hex: "#1A1A1A", img: "/shorts-fleece-mockup.jpg" },
      { key: "Heather Grey", label: "Heather Grey", hex: "#9B9B9B", img: "/shorts-fleece-mockup.jpg" },
    ],
    sizes: ["S","M","L","XL","2XL"],
    tag: "New",
  },
  {
    id: "pj",
    name: "Women's Lounge Shorts",
    subtitle: "All-over print · Logo on back",
    price: 4000,
    colors: [
      { key: "Black", label: "Black", hex: "#1A1A1A", img: "/shorts-pj-mockup.jpg" },
    ],
    sizes: ["XS","S","M","L","XL","2XL"],
    tag: "New",
  },
] as const;

type Product = typeof PRODUCTS[number];
type Color = Product["colors"][number];

const PROMO_CODES: Record<string, Record<string, number>> = {
  TEAM: { tee: 3000, hoodie: 5000, sweatpants: 4000, hat: 2000, fleece: 3500, pj: 3000 },
};

// ─── Product Card ─────────────────────────────────────────────────────────────

function ProductCard({ product, appliedCode }: { product: Product; appliedCode: string | null }) {
  const [activeColor, setActiveColor] = useState<string>(product.colors[0].key);
  const [activeSize, setActiveSize] = useState<string | null>(null);

  // Reset selected size if it's not available in the newly selected color
  useEffect(() => {
    if (activeSize && !getSizes().includes(activeSize)) {
      setActiveSize(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeColor]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flipped, setFlipped] = useState(false);

  const discount = appliedCode ? PROMO_CODES[appliedCode]?.[product.id] : null;
  const finalPrice = discount ?? product.price;
  const displayPrice = `$${(finalPrice / 100).toFixed(2)}`;
  const originalPrice = discount ? `$${(product.price / 100).toFixed(2)}` : null;

  const colorObj = (product.colors as readonly Color[]).find(c => c.key === activeColor) ?? product.colors[0];

  // Dynamic sizes for items that vary by color
  const getSizes = () => {
    if ("dynamicSizes" in product && product.dynamicSizes) {
      const isGD = (colorObj as { gd?: boolean }).gd;
      return isGD ? SIZES_SWEATS_GD : SIZES_GD;
    }
    return [...product.sizes];
  };

  const hasBack = "backImg" in colorObj && (colorObj as { backImg?: string }).backImg;

  const handleBuy = async () => {
    if (product.sizes.length > 0 && !activeSize) return;
    setLoading(true);
    setError(null);
    try {
      const body: Record<string, string | undefined> = {
        product: product.id,
        color: activeColor,
        size: activeSize ?? undefined,
        promoCode: appliedCode ?? undefined,
      };
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || "Something went wrong."); setLoading(false); }
    } catch { setError("Network error."); setLoading(false); }
  };

  const needsSize = product.sizes.length > 0 && !activeSize;

  return (
    <div className="group bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/15 transition-all duration-300 flex flex-col">

      {/* Image */}
      <div className="relative aspect-square bg-[#0a0a0a] overflow-hidden">
        {product.tag && (
          <span className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-full bg-[#b22234] text-white text-xs font-bold uppercase tracking-wide">
            {product.tag}
          </span>
        )}
        {discount && (
          <span className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-green-600 text-white text-xs font-bold">
            TEAM ✓
          </span>
        )}
        <img
          src={flipped && hasBack ? (colorObj as { backImg?: string }).backImg! : colorObj.img}
          alt={`${product.name} — ${colorObj.label}`}
          className="w-full h-full object-contain p-4 transition-all duration-500 group-hover:scale-105"
        />
        {hasBack && (
          <button
            onClick={() => setFlipped(f => !f)}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white text-xs px-2.5 py-1 rounded-lg border border-white/20 backdrop-blur-sm transition-all"
          >
            {flipped ? "Front" : "Back"}
          </button>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-extrabold text-white text-base leading-tight">{product.name}</h3>
            <div className="text-right shrink-0">
              <span className="font-extrabold text-[#b22234] text-lg">{displayPrice}</span>
              {originalPrice && <p className="text-white/30 text-xs line-through">{originalPrice}</p>}
            </div>
          </div>
          <p className="text-white/40 text-xs mt-0.5">{product.subtitle}</p>
        </div>

        {/* Color swatches */}
        {product.colors.length > 1 && (
          <div className="flex items-center gap-2 flex-wrap">
            {(product.colors as readonly Color[]).map(c => (
              <button
                key={c.key}
                onClick={() => { setActiveColor(c.key); setActiveSize(null); setFlipped(false); }}
                title={c.label}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  activeColor === c.key ? "border-white scale-110" : "border-transparent hover:border-white/50"
                }`}
                style={{ backgroundColor: c.hex }}
              />
            ))}
            <span className="text-white/40 text-xs ml-1">{colorObj.label}</span>
          </div>
        )}

        {/* Size picker — show all product sizes; disable ones unavailable for the selected color */}
        {product.sizes.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {[...product.sizes].map(s => {
              const available = getSizes().includes(s);
              return (
                <button
                  key={s}
                  onClick={() => available && setActiveSize(s)}
                  disabled={!available}
                  title={!available ? `Not available in ${colorObj.label}` : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                    !available
                      ? "border-white/5 text-white/20 line-through cursor-not-allowed"
                      : activeSize === s
                        ? "bg-white text-black border-white"
                        : "border-white/15 text-white/60 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="text-red-400 text-xs">{error}</p>}

        {/* Buy button */}
        <button
          onClick={handleBuy}
          disabled={loading || (getSizes().length > 0 && !activeSize)}
          className={`mt-auto w-full py-3 rounded-xl text-sm font-extrabold uppercase tracking-wide transition-all ${
            loading || needsSize
              ? "bg-white/5 text-white/30 cursor-not-allowed"
              : "bg-[#b22234] hover:bg-[#8b0000] text-white"
          }`}
        >
          {loading ? "..." : needsSize ? "Select a Size" : `Add to Cart — ${displayPrice}`}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ShopPage() {
  const [promoCode, setPromoCode] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState("");

  const handlePromo = () => {
    const code = promoCode.toUpperCase().trim();
    if (PROMO_CODES[code]) { setAppliedCode(code); setPromoError(""); }
    else { setPromoError("Invalid code."); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white font-sans">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-extrabold text-lg tracking-tight">
            One Leg B4 the Other
          </a>
          <a href="/#donate" className="px-4 py-2 rounded-xl bg-[#b22234] text-white text-sm font-bold hover:bg-[#8b0000] transition-colors">
            Donate
          </a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <div className="pt-16">
        <div className="relative overflow-hidden bg-[#0d0d0d] border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <p className="text-[#b22234] text-sm font-bold uppercase tracking-widest mb-4">Issued With Honor</p>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tight mb-6">
                Wear<br className="hidden md:block" /> the<br className="hidden md:block" /> Mission.
              </h1>
              <p className="text-white/50 text-lg max-w-md mb-8">
                Every purchase funds a pair of adaptive pants for a veteran in need. No overhead. Full impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                <a
                  href="#shop-grid"
                  className="px-8 py-4 rounded-2xl bg-[#b22234] text-white font-extrabold text-base hover:bg-[#8b0000] transition-colors"
                >
                  Shop Now
                </a>
                <a
                  href="/#donate"
                  className="px-8 py-4 rounded-2xl border border-white/20 text-white font-extrabold text-base hover:bg-white/5 transition-colors"
                >
                  Just Donate →
                </a>
              </div>
            </div>
            {/* Hero product stack */}
            <div className="flex-1 flex justify-center">
              <div className="relative w-72 h-72 md:w-96 md:h-96">
                <img src="/hoodie-pepper-mockup.jpg" alt="Garment-Dyed Hoodie" className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl" />
              </div>
            </div>
          </div>
          {/* Subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#b22234]/5 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* ── PROMO BANNER ── */}
      {appliedCode && (
        <div className="bg-green-900/80 border-b border-green-700/50 text-center py-2.5 text-green-300 text-sm font-bold">
          ✓ TEAM code active — discounted prices applied on all items
        </div>
      )}

      {/* ── PROMO CODE BAR ── */}
      <div className="bg-[#111111] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-end gap-3">
          {!appliedCode ? (
            <>
              <input
                value={promoCode}
                onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                onKeyDown={e => e.key === "Enter" && handlePromo()}
                placeholder="Promo code"
                className="h-9 w-40 rounded-lg bg-white/5 border border-white/10 text-white text-sm px-3 focus:outline-none focus:border-white/30 uppercase placeholder:normal-case placeholder:text-white/30"
              />
              <button onClick={handlePromo} className="h-9 px-4 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-colors">
                Apply
              </button>
              {promoError && <span className="text-red-400 text-xs">{promoError}</span>}
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-green-400 text-sm font-bold">✓ {appliedCode} applied</span>
              <button onClick={() => { setAppliedCode(null); setPromoCode(""); }} className="text-white/30 hover:text-white text-xs transition-colors">
                Remove
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── PRODUCT GRID ── */}
      <div id="shop-grid" className="max-w-7xl mx-auto px-6 py-16">

        {/* Mission stat strip */}
        <div className="grid grid-cols-3 gap-4 mb-16">
          {[
            { n: "100%", label: "Goes to veterans" },
            { n: "$0",   label: "Cost to the vet" },
            { n: "∞",    label: "Pairs per veteran" },
          ].map(s => (
            <div key={s.n} className="text-center border border-white/5 rounded-2xl py-6 bg-[#111111]">
              <p className="text-3xl font-black text-[#b22234]">{s.n}</p>
              <p className="text-white/40 text-xs mt-1 uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PRODUCTS.map(p => (
            <ProductCard key={p.id} product={p as unknown as Product} appliedCode={appliedCode} />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-white/20 text-sm mt-16">
          Secure checkout via Stripe · Fulfilled by Printful · Ships in 3–5 days · Free shipping on all orders
        </p>
      </div>

    </main>
  );
}
