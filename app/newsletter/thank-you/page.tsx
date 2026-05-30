import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "You're In — One Leg B4 the Other",
  description: "Thanks for joining the mission. We'll keep you updated on the veterans we're serving.",
  robots: 'noindex',
}

export default function NewsletterThankYou() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-20">

      {/* Logo */}
      <img
        src="/logo.png"
        alt="One Leg B4 the Other"
        className="w-24 mb-10 opacity-90"
      />

      {/* Icon */}
      <div className="w-20 h-20 rounded-full bg-red-600/20 border border-red-600/40 flex items-center justify-center text-4xl mb-8">
        🪖
      </div>

      {/* Heading */}
      <h1 className="text-4xl md:text-5xl font-black text-white text-center leading-tight mb-4">
        You&apos;re in the mission.
      </h1>

      <div className="w-12 h-1 bg-red-600 rounded mb-6" />

      {/* Body */}
      <p className="text-gray-400 text-center text-lg max-w-md leading-relaxed mb-4">
        Every month we&apos;ll send you real stories, real numbers, and real ways to make a difference for veterans who need it most.
      </p>
      <p className="text-gray-600 text-center text-sm max-w-sm mb-12">
        No fluff. No spam. Just the mission.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          href="/#donate"
          className="flex-1 text-center py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors"
        >
          ❤️ Donate Now
        </Link>
        <Link
          href="/shop"
          className="flex-1 text-center py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm transition-colors"
        >
          🛍️ Shop
        </Link>
      </div>

      {/* Back link */}
      <Link href="/" className="mt-10 text-xs text-gray-600 hover:text-gray-400 transition-colors">
        ← Back to home
      </Link>

    </main>
  )
}
