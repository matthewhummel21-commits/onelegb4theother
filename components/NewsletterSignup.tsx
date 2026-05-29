'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Something went wrong')
      }

      setStatus('success')
      setEmail('')
    } catch (err: unknown) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <p className="text-sm font-semibold uppercase tracking-widest text-red-500 mb-1">
        Stay in the fight
      </p>
      <h3 className="text-xl font-bold text-white mb-2">
        Get mission updates
      </h3>
      <p className="text-sm text-gray-400 mb-4">
        Monthly stories, impact numbers, and ways to help — straight to your inbox.
      </p>

      {status === 'success' ? (
        <p className="text-green-400 font-medium text-sm">
          ✓ You&apos;re in. Welcome to the mission.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-red-500 transition"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 whitespace-nowrap"
          >
            {status === 'loading' ? 'Joining...' : 'Join'}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
      )}
    </div>
  )
}
