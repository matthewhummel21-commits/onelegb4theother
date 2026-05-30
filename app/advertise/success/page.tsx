"use client";

import { motion } from "framer-motion";

export default function AdvertiseSuccessPage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        <div className="text-6xl mb-6">🎖️</div>
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">You&apos;re In.</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-8">
          Thank you for sponsoring One Leg B4 the Other. Your payment was received and we&apos;ll be in touch within 48 hours to confirm your package details and get your logo and link set up.
        </p>
        <p className="text-white/40 text-sm mb-8">
          Questions? Email{" "}
          <a href="mailto:matthew@onelegb4theother.com" className="text-white/60 underline hover:text-white transition-colors">
            matthew@onelegb4theother.com
          </a>
        </p>
        <a
          href="/"
          className="inline-block px-8 py-3 rounded-xl bg-[#B22234] text-white font-bold hover:bg-[#8B1A27] transition-colors"
        >
          Back to Main Site
        </a>
      </motion.div>
    </main>
  );
}
