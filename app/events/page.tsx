"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EVENTS = [
  {
    name: "Human Race 5K",
    date: "June 2026",
    location: "Sioux Falls, SD",
    emoji: "🏃",
  },
  {
    name: "American Island Days",
    date: "June 2026",
    location: "Chamberlain, SD",
    emoji: "🇺🇸",
  },
];

export default function EventsPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, firstName }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err: unknown) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <motion.img
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        src="/logo.png"
        alt="One Leg B4 the Other"
        className="w-24 mb-6"
      />

      <AnimatePresence mode="wait">
        {status === "success" ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-sm"
          >
            <div className="text-6xl mb-5">🎖️</div>
            <h1 className="text-3xl font-extrabold mb-3">You&apos;re in the fight.</h1>
            <p className="text-white/60 leading-relaxed mb-6">
              Welcome to the One Leg B4 the Other community. Monthly updates, mission impact, and ways to support veterans — straight to your inbox.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <p className="text-sm text-white/70 font-semibold mb-1">🎁 Raffle Entry Confirmed</p>
              <p className="text-xs text-white/40">You&apos;re entered to win a free Issued With Honor tee. Winner announced at our next event.</p>
            </div>
            <a
              href="/"
              className="text-sm text-white/40 hover:text-white/70 transition-colors underline"
            >
              Learn more about our mission →
            </a>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <span className="inline-block text-xs font-bold tracking-widest text-[#B22234] uppercase mb-3">
                One Leg B4 the Other
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                Join the Mission
              </h1>
              <p className="text-white/50 text-sm leading-relaxed">
                Sign up for our newsletter and get entered to win a free shirt. We provide new pants to veterans — no cost, no catch.
              </p>
            </div>

            {/* Events */}
            <div className="flex flex-col gap-2 mb-7">
              {EVENTS.map((ev) => (
                <div
                  key={ev.name}
                  className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3"
                >
                  <span className="text-xl">{ev.emoji}</span>
                  <div>
                    <p className="text-sm font-bold leading-tight">{ev.name}</p>
                    <p className="text-xs text-white/40">{ev.date} · {ev.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Raffle badge */}
            <div className="bg-[#B22234]/10 border border-[#B22234]/30 rounded-xl px-4 py-3 mb-6 flex items-start gap-3">
              <span className="text-lg shrink-0">🎁</span>
              <div>
                <p className="text-sm font-bold text-white">Free shirt raffle</p>
                <p className="text-xs text-white/50">Sign up = automatic entry. One winner announced after the event.</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="First name (optional)"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 transition-colors"
              />

              {status === "error" && (
                <p className="text-xs text-red-400 text-center">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 rounded-xl bg-[#B22234] text-white font-bold text-sm hover:bg-[#8B1A27] disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-1"
              >
                {status === "loading" ? "Signing up…" : "Sign Up & Enter Raffle →"}
              </button>

              <p className="text-center text-xs text-white/20 mt-1">
                Monthly newsletter · No spam · Unsubscribe anytime
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="mt-12 text-center text-xs text-white/20">
        <p>One Leg B4 the Other · EIN 99-3332965 · Veteran-Led Nonprofit</p>
        <a href="/" className="hover:text-white/40 transition-colors mt-1 inline-block">
          onelegb4theother.com
        </a>
      </div>
    </main>
  );
}
