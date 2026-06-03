"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TIERS = [
  {
    id: "battle-buddy",
    name: "Battle Buddy",
    price: "$500",
    period: "/ quarter",
    emoji: "⚔️",
    tagline: "The one who's always got your back.",
    color: "border-slate-500",
    selectedColor: "border-slate-400 bg-slate-400/10 shadow-[0_0_0_2px_#94a3b8]",
    benefits: [
      "Logo + name in newsletter footer (monthly, 150+ subscribers)",
      "Facebook thank-you post when you sign on",
      "Logo in Sponsors section on onelegb4theother.com",
      "Certificate of appreciation",
    ],
  },
  {
    id: "squad-leader",
    name: "Squad Leader",
    price: "$1,000",
    period: "/ quarter",
    emoji: "🪖",
    tagline: "Elevated support. Elevated visibility.",
    color: "border-blue-500/60",
    selectedColor: "border-blue-400 bg-blue-400/10 shadow-[0_0_0_2px_#60a5fa]",
    popular: true,
    benefits: [
      "Everything in Battle Buddy",
      "Dedicated sponsor spotlight in every monthly newsletter (logo + business blurb)",
      "Monthly Facebook feature post",
      "Prominent logo placement on website — top sponsor position",
    ],
  },
  {
    id: "mission-commander",
    name: "Mission Commander",
    price: "$2,000",
    period: "/ quarter",
    emoji: "🦅",
    tagline: "Leading the mission.",
    color: "border-[#B22234]/60",
    selectedColor: "border-[#B22234] bg-[#B22234]/10 shadow-[0_0_0_2px_#B22234]",
    benefits: [
      "Everything in Squad Leader",
      "Top-of-newsletter placement — first sponsor slot every issue",
      "\"Presenting Sponsor\" at One Leg B4 the Other events",
      "Logo on pants request confirmation page — seen by every veteran we serve",
      "Dedicated Facebook story/reel feature",
      "Personal founder shoutout from Matthew Hummel",
    ],
  },
];

export default function AdvertisePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", business: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/advertise-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tier: selected }),
      });
      if (res.ok) {
        setStatus("sent");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const selectedTier = TIERS.find(t => t.id === selected);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="text-white font-extrabold text-lg tracking-tight hover:opacity-80 transition-opacity">
            One Leg B4 the Other
          </a>
          <a
            href="/#donate"
            className="px-4 py-2 rounded-xl bg-[#B22234] text-white text-sm font-bold hover:bg-[#8B1A27] transition-colors"
          >
            Donate
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block text-xs font-bold tracking-widest text-[#B22234] uppercase mb-4">
            Sponsor Opportunities
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Advertise With a Purpose
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            Partner with One Leg B4 the Other and put your brand in front of a loyal, mission-driven community of veterans, donors, and supporters — across our newsletter, website, social media, and live events.
          </p>
        </motion.div>
      </section>

      {/* Tier cards */}
      <section className="py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-white/40 text-sm mb-10 uppercase tracking-widest font-semibold">
            Select a tier to get started
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {TIERS.map((tier, i) => (
              <motion.button
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                onClick={() => setSelected(tier.id)}
                className={`relative rounded-2xl border p-6 flex flex-col text-left transition-all cursor-pointer ${
                  selected === tier.id ? tier.selectedColor : `${tier.color} bg-white/[0.03] hover:bg-white/[0.06]`
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl">{tier.emoji}</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold text-white">{tier.price}</span>
                    <span className="text-white/40 text-xs ml-1">{tier.period}</span>
                  </div>
                </div>
                <h3 className="text-lg font-extrabold tracking-tight mb-1">{tier.name}</h3>
                <p className="text-white/40 text-xs mb-5 leading-snug italic">{tier.tagline}</p>
                <ul className="flex flex-col gap-2.5">
                  {tier.benefits.map((b, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-white/70 leading-snug">
                      <span className="text-[#B22234] mt-0.5 shrink-0">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
                {selected === tier.id && (
                  <div className="mt-5 text-center text-xs font-bold text-white/60 border-t border-white/10 pt-4">
                    ✓ Selected
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Contact form */}
      <section className="py-12 px-6">
        <div className="max-w-lg mx-auto">
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <div className="text-5xl mb-4">🎖️</div>
              <h2 className="text-2xl font-extrabold mb-3">We&apos;ll be in touch.</h2>
              <p className="text-white/50 leading-relaxed">
                Thanks for reaching out. Someone from our team will contact you within 48 hours to discuss your sponsorship.
              </p>
              <a href="/" className="inline-block mt-8 text-sm text-white/40 hover:text-white/70 transition-colors underline">
                Back to main site
              </a>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              {selected && (
                <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white/60 text-center">
                  Inquiring about: <span className="text-white font-bold">{selectedTier?.emoji} {selectedTier?.name} — {selectedTier?.price}/quarter</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Your Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Business Name</label>
                  <input
                    required
                    type="text"
                    placeholder="Acme Co."
                    value={form.business}
                    onChange={e => setForm(f => ({ ...f, business: e.target.value }))}
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Email</label>
                <input
                  required
                  type="email"
                  placeholder="you@yourbusiness.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Anything else? (optional)</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your business or what you're hoping to get out of the partnership..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              {!selected && (
                <p className="text-xs text-[#B22234] text-center">Select a tier above before submitting.</p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-400 text-center">Something went wrong — email us at matthew@onelegb4theother.com</p>
              )}

              <button
                type="submit"
                disabled={!selected || status === "sending"}
                className="w-full py-3.5 rounded-xl bg-[#B22234] text-white font-bold text-sm hover:bg-[#8B1A27] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {status === "sending" ? "Sending…" : selected ? `Submit — ${selectedTier?.name} Tier` : "Submit Inquiry"}
              </button>

              <p className="text-center text-xs text-white/20">
                Quarterly commitment · We&apos;ll reach out within 48 hours to confirm
              </p>
            </motion.form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-white/30 text-sm mt-8">
        <p>One Leg B4 the Other · EIN 99-3332965 · 230 S Phillips Ave Suite 203, Sioux Falls SD 57104</p>
        <p className="mt-1">
          <a href="/" className="hover:text-white/60 transition-colors">← Back to main site</a>
        </p>
      </footer>
    </main>
  );
}
