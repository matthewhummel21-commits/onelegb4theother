'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function JoinPage() {
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      router.push('/newsletter/thank-you')
    } catch (err: unknown) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center px-6 py-12">

      {/* Logo */}
      <img
        src="/logo.png"
        alt="One Leg B4 the Other"
        className="w-20 mb-8 opacity-95"
      />

      {/* Flag stripe */}
      <div className="w-16 mb-8 overflow-hidden rounded">
        <div className="h-1.5 bg-red-600" />
        <div className="h-1.5 bg-white" />
        <div className="h-1.5 bg-blue-900" />
      </div>

      {/* Headline */}
      <h1 className="text-3xl md:text-4xl font-black text-white text-center leading-tight mb-3">
        Stay connected<br />to the mission.
      </h1>
      <p className="text-gray-400 text-center text-base max-w-xs mb-10 leading-relaxed">
        Monthly updates on veterans we&apos;re serving, events near you, and ways to help.
      </p>

      {/* Form */}
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <input
          type="text"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          placeholder="First name"
          className="w-full h-14 px-5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-base focus:outline-none focus:border-red-500 transition"
        />
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="Email address"
          required
          className="w-full h-14 px-5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-base focus:outline-none focus:border-red-500 transition"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full h-14 bg-red-600 hover:bg-red-700 text-white font-black text-lg rounded-xl transition disabled:opacity-60"
        >
          {status === 'loading' ? 'Joining...' : 'Join the Mission →'}
        </button>
      </form>

      {status === 'error' && (
        <p className="text-red-400 text-sm mt-3">{error}</p>
      )}

      {/* Trust line */}
      <p className="text-gray-600 text-xs text-center mt-8 max-w-xs">
        No spam. No fluff. Just the mission.<br />
        Unsubscribe anytime.
      </p>

      {/* Flag stripe bottom */}
      <div className="w-16 mt-8 overflow-hidden rounded">
        <div className="h-1.5 bg-blue-900" />
        <div className="h-1.5 bg-white" />
        <div className="h-1.5 bg-red-600" />
      </div>

    </main>
  )
}
