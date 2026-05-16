"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BlurFade } from "@/components/ui/blur-fade";

const SIZES = ["XS", "S", "M", "L", "XL", "2XL", "3XL"];

export default function ShopPage() {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!selectedSize) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: selectedSize }),
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
    <main className="min-h-screen bg-background text-foreground font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-extrabold text-lg tracking-tight">
            One Leg B4 the Other
          </a>
          <a
            href="/#donate"
            className="px-4 py-2 rounded-xl bg-[#b22234] text-white text-sm font-bold hover:bg-[#8b0000] transition-colors"
          >
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
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Wear the Mission
            </h1>
            <p className="text-white/60 text-lg max-w-xl mx-auto">
              Every shirt sold funds a pair of adaptive pants for a veteran in need.
              $55 — no markup, full impact.
            </p>
          </div>
        </BlurFade>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Product Image */}
          <BlurFade delay={0.2}>
            <div className="rounded-2xl overflow-hidden bg-white/5 border border-white/10 aspect-square flex items-center justify-center p-8">
              <img
                src="https://files.cdn.printful.com/files/844/844011d92c81ab651408cb0aa7b88076_preview.png"
                alt="Issued With Honor Tee"
                className="w-full h-full object-contain"
              />
            </div>
          </BlurFade>

          {/* Purchase Panel */}
          <BlurFade delay={0.3}>
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-extrabold text-white mb-1">
                  Issued With Honor Tee
                </h2>
                <p className="text-3xl font-bold text-[#b22234]">$55</p>
                <p className="text-white/50 text-sm mt-1">
                  Free shipping · Printful fulfilled · Ships in 3–5 days
                </p>
              </div>

              {/* Size Selector */}
              <div>
                <p className="text-white/70 text-sm font-semibold uppercase tracking-widest mb-3">
                  Select Size
                </p>
                <div className="flex flex-wrap gap-3">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                        selectedSize === size
                          ? "bg-[#b22234] border-[#b22234] text-white"
                          : "border-white/20 text-white/70 hover:border-white/50 hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact callout */}
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-white/80 text-sm">
                  <span className="text-white font-bold">Your $55</span> directly funds a pair of
                  adaptive pants for a veteran on our waitlist. That&apos;s it. No overhead theater.
                </p>
              </div>

              {/* CTA */}
              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <motion.div whileTap={{ scale: 0.97 }}>
                <ShimmerButton
                  background="rgb(178,34,52)"
                  shimmerColor="#ffffff"
                  borderRadius="14px"
                  className="w-full py-4 text-base font-extrabold disabled:opacity-50"
                  onClick={handleCheckout}
                  disabled={!selectedSize || loading}
                >
                  {loading
                    ? "Redirecting..."
                    : selectedSize
                    ? `Buy Now — ${selectedSize} / $55`
                    : "Select a Size"}
                </ShimmerButton>
              </motion.div>

              <p className="text-white/30 text-xs text-center">
                Secure checkout via Stripe · Sales tax may apply
              </p>
            </div>
          </BlurFade>
        </div>
      </div>
    </main>
  );
}
