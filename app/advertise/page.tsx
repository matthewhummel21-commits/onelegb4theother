"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const TIERS = [
  { id: "patch",     name: "Patch",     tagline: "Entry-level presence" },
  { id: "shield",    name: "Shield",    tagline: "Growing reach" },
  { id: "standard",  name: "Standard",  tagline: "Consistent visibility" },
  { id: "commander", name: "Commander", tagline: "High-impact partnership" },
  { id: "patriot",   name: "Patriot",   tagline: "Flagship sponsorship" },
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
      <section className="pt-32 pb-16 px-6 text-center">
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
            Partner with One Leg B4 the Other and put your brand in front of a loyal, mission-driven community of veterans, donors, and supporters. We offer several tiers of partnership — tell us which fits and we&apos;ll be in touch personally.
          </p>
        </motion.div>
      </section>

      {/* Tier cards — names only */}
      <section className="py-10 px-6">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-white/40 text-sm mb-8 uppercase tracking-widest font-semibold">
            Select a tier you&apos;re interested in
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {TIERS.map((tier, i) => (
              <motion.button
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                onClick={() => setSelected(tier.id)}
                className={`rounded-2xl border p-5 flex flex-col items-center gap-2 text-center transition-all cursor-pointer ${
                  selected === tier.id
                    ? "border-[#B22234] bg-[#B22234]/15 shadow-[0_0_0_2px_#B22234]"
                    : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.07]"
                }`}
              >
                <span className="text-lg font-extrabold tracking-tight">{tier.name}</span>
                <span className="text-xs text-white/40 leading-snug">{tier.tagline}</span>
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
                Thanks for reaching out. Someone from our team will contact you within 48 hours to talk through your sponsorship.
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
                  placeholder="Tell us a bit about your business or what you're hoping to get out of the partnership..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors resize-none"
                />
              </div>

              {!selected && (
                <p className="text-xs text-[#B22234] text-center">Select a tier above before submitting.</p>
              )}

              {status === "error" && (
                <p className="text-xs text-red-400 text-center">Something went wrong — email us directly at matthew@onelegb4theother.com</p>
              )}

              <button
                type="submit"
                disabled={!selected || status === "sending"}
                className="w-full py-3.5 rounded-xl bg-[#B22234] text-white font-bold text-sm hover:bg-[#8B1A27] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                {status === "sending" ? "Sending…" : selected ? `Submit — ${TIERS.find(t => t.id === selected)?.name} Tier` : "Submit Inquiry"}
              </button>
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
