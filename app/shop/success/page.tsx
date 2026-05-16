"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-extrabold text-lg tracking-tight">One Leg B4 the Other</a>
          <a href="/#donate" className="px-4 py-2 rounded-xl bg-[#b22234] text-white text-sm font-bold hover:bg-[#8b0000] transition-colors">Donate</a>
        </div>
      </nav>

      <div className={`pt-24 pb-20 px-6 max-w-3xl mx-auto transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>

        {/* Hero thank you */}
        <div className="text-center py-12">
          <div className="text-7xl mb-6">🎖️</div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
            You Just Made a<br />
            <span className="text-[#b22234]">Real Difference.</span>
          </h1>
          <p className="text-white/60 text-lg max-w-xl mx-auto leading-relaxed">
            Your shirt is in production. But more importantly — your $55 just funded a brand new pair of pants for a veteran who earned it.
          </p>
          {sessionId && (
            <p className="text-white/20 text-xs mt-4">Order ref: {sessionId.slice(-12).toUpperCase()}</p>
          )}
        </div>

        {/* Impact cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          {[
            { icon: "👖", title: "Pants Funded", desc: "A veteran on our waitlist just moved one step closer to receiving a brand new pair of pants — with dignity." },
            { icon: "📦", title: "Shirt In Production", desc: "Your Issued With Honor tee is being printed and fulfilled via Printful. Ships in 3–5 business days." },
            { icon: "🤝", title: "Mission Grows", desc: "Every purchase helps us tell the story and fund more veterans. You're part of building this movement." },
          ].map((card, i) => (
            <div
              key={i}
              className={`rounded-2xl border border-white/10 bg-white/5 p-6 text-center transition-all duration-700 delay-${i * 100}`}
              style={{ transitionDelay: `${200 + i * 100}ms`, opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(12px)" }}
            >
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 className="font-bold text-white mb-2">{card.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="rounded-2xl border border-[#b22234]/30 bg-[#b22234]/10 p-8 text-center mb-12">
          <p className="text-lg italic text-white/80 leading-relaxed mb-4">
            &ldquo;They wrote a check with their lives, not knowing what the outcome would be. The least we can do is show up for them.&rdquo;
          </p>
          <p className="text-sm font-bold text-[#b22234]">— Matthew Hummel, President · U.S. Air Force Veteran · 20 Years of Service</p>
        </div>

        {/* Spread the word */}
        <div className="text-center mb-12">
          <p className="text-white/50 text-sm font-semibold uppercase tracking-widest mb-4">Help spread the word</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent("Just bought an 'Issued With Honor' tee from @onelegb4theother — every shirt funds a pair of pants for a veteran in need. 🎖️ onelegb4theother.com/shop")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#1DA1F2]/20 border border-[#1DA1F2]/30 text-[#1DA1F2] text-sm font-bold hover:bg-[#1DA1F2]/30 transition-colors"
            >
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://onelegb4theother.com/shop")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#1877F2]/20 border border-[#1877F2]/30 text-[#1877F2] text-sm font-bold hover:bg-[#1877F2]/30 transition-colors"
            >
              Share on Facebook
            </a>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/shop"
            className="px-8 py-4 rounded-2xl bg-[#b22234] text-white font-extrabold text-base hover:bg-[#8b0000] transition-colors text-center"
          >
            Buy Another Shirt
          </a>
          <a
            href="/#donate"
            className="px-8 py-4 rounded-2xl border-2 border-white/20 text-white font-extrabold text-base hover:bg-white/5 transition-colors text-center"
          >
            Make a Donation
          </a>
          <a
            href="/"
            className="px-8 py-4 rounded-2xl border border-white/10 text-white/60 font-bold text-base hover:text-white hover:border-white/30 transition-colors text-center"
          >
            Back to Home
          </a>
        </div>

      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
