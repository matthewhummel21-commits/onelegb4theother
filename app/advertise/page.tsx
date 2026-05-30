"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const PACKAGES = [
  {
    id: "patch",
    name: "Patch",
    price: 250,
    priceDisplay: "$250",
    tag: "",
    summary: "Get your brand in front of our veteran community — one issue, real reach.",
    deliverables: [
      "Logo + link in 1 newsletter issue",
      "Delivered within 30 days of purchase",
    ],
  },
  {
    id: "shield",
    name: "Shield",
    price: 750,
    priceDisplay: "$750",
    tag: "Popular",
    summary: "Three issues plus a social shoutout. Solid exposure, low commitment.",
    deliverables: [
      "Logo + link in 3 newsletter issues",
      "1 social media shoutout (Facebook/Instagram)",
      "Delivered across 60–90 days",
    ],
  },
  {
    id: "standard",
    name: "Standard",
    price: 1500,
    priceDisplay: "$1,500",
    tag: "",
    summary: "Half a year of newsletter placement and a featured sponsor spotlight.",
    deliverables: [
      "Logo + link in 6 newsletter issues",
      "2 social media shoutouts",
      "1 featured sponsor block in a newsletter issue",
      "Delivered across 6 months",
    ],
  },
  {
    id: "commander",
    name: "Commander",
    price: 3000,
    priceDisplay: "$3,000",
    tag: "Best Value",
    summary: "A full year of consistent presence — newsletter and social, month after month.",
    deliverables: [
      "Logo + link in 12 newsletter issues",
      "4 social media shoutouts",
      "2 featured sponsor blocks",
      "Delivered across 12 months",
    ],
  },
  {
    id: "patriot",
    name: "Patriot",
    price: 5000,
    priceDisplay: "$5,000",
    tag: "Top Tier",
    summary: "Full-year flagship sponsorship. Maximum visibility across every channel we run.",
    deliverables: [
      "Logo + link in every newsletter issue for 12 months",
      "Monthly featured sponsor block (12 total)",
      "6 social media posts dedicated to your business",
      "Event shoutout at One Leg B4 the Other events",
      "Personal thank-you from our President",
    ],
  },
];

export default function AdvertisePage() {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout(pkg: typeof PACKAGES[0]) {
    setLoading(pkg.id);
    setError(null);
    try {
      const res = await fetch("/api/checkout/advertise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(null);
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
            Partner with One Leg B4 the Other and put your brand in front of a loyal, mission-driven community of veterans, donors, and supporters. Every dollar helps fund dignified clothing for veterans in need.
          </p>
        </motion.div>
      </section>

      {/* Stats strip */}
      <section className="py-8 px-6 border-y border-white/10 bg-white/5">
        <div className="max-w-4xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { label: "Newsletter Subscribers", value: "142+" },
            { label: "Veterans Served", value: "100+" },
            { label: "Mission", value: "Dignity First" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-white/50 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Packages */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PACKAGES.map((pkg, i) => {
              const isTopTier = pkg.id === "patriot";
              const isPopular = pkg.tag === "Popular" || pkg.tag === "Best Value";
              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                    isTopTier
                      ? "border-[#B22234] bg-[#B22234]/10"
                      : isPopular
                      ? "border-white/30 bg-white/5"
                      : "border-white/10 bg-white/[0.03]"
                  }`}
                >
                  {/* Tag badge */}
                  {pkg.tag && (
                    <span
                      className={`absolute -top-3 left-6 text-xs font-bold px-3 py-1 rounded-full ${
                        isTopTier
                          ? "bg-[#B22234] text-white"
                          : "bg-white text-black"
                      }`}
                    >
                      {pkg.tag}
                    </span>
                  )}

                  <div>
                    <h2 className="text-xl font-extrabold tracking-tight">{pkg.name}</h2>
                    <div className="text-3xl font-extrabold mt-1 text-white">{pkg.priceDisplay}</div>
                    <p className="text-white/50 text-sm mt-2 leading-relaxed">{pkg.summary}</p>
                  </div>

                  <ul className="flex flex-col gap-2 flex-1">
                    {pkg.deliverables.map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm text-white/80">
                        <span className="text-[#B22234] mt-0.5 shrink-0">✓</span>
                        {d}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleCheckout(pkg)}
                    disabled={loading === pkg.id}
                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${
                      isTopTier
                        ? "bg-[#B22234] text-white hover:bg-[#8B1A27] disabled:opacity-60"
                        : "bg-white text-black hover:bg-white/90 disabled:opacity-60"
                    }`}
                  >
                    {loading === pkg.id ? "Redirecting…" : `Get ${pkg.name} — ${pkg.priceDisplay}`}
                  </button>
                </motion.div>
              );
            })}
          </div>

          {error && (
            <p className="text-center text-red-400 text-sm mt-6">{error}</p>
          )}

          {/* Bottom note */}
          <div className="mt-12 text-center text-white/40 text-sm max-w-xl mx-auto">
            Questions about a custom package or want to talk before buying?{" "}
            <a
              href="mailto:matthew@onelegb4theother.com"
              className="text-white/70 underline hover:text-white transition-colors"
            >
              Email us
            </a>
            . We&apos;re happy to work with you.
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 text-center text-white/30 text-sm">
        <p>One Leg B4 the Other · EIN 99-3332965 · 230 S Phillips Ave Suite 203, Sioux Falls SD 57104</p>
        <p className="mt-1">
          <a href="/" className="hover:text-white/60 transition-colors">← Back to main site</a>
        </p>
      </footer>
    </main>
  );
}
