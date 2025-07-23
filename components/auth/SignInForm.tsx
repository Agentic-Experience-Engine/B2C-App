'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Optional: Redirect user to a specific page after sign-up
        emailRedirectTo: `${location.origin}/`,
      },
    })
    if (error) {
      setError(error.message)
    } else {
      // On successful sign-up, Supabase sends a confirmation email.
      // You can redirect or show a message here.
      alert('Check your email for a confirmation link!')
      router.refresh()
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      setError(error.message)
    } else {
      router.push('/') // Redirect to homepage on successful sign-in
      router.refresh()
    }
  }

  return (
    <div className="flex w-full max-w-sm flex-col items-center rounded-lg border border-gray-300 p-8">
      <h1 className="mb-4 text-2xl font-normal">Sign in</h1>
      {error && (
        <p className="mb-4 w-full rounded border border-red-500 bg-red-100 p-2 text-sm text-red-700">{error}</p>
      )}
      <form className="flex w-full flex-col">
        <label htmlFor="email" className="mb-1 text-sm font-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 rounded-md border border-gray-400 px-3 py-1 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />

        <label htmlFor="password" className="mb-1 text-sm font-bold">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 rounded-md border border-gray-400 px-3 py-1 shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />

        {/* Using two separate buttons for clarity */}
        <button
          onClick={handleSignIn}
          className="mb-4 rounded-lg bg-yellow-400 py-2 text-sm shadow hover:bg-yellow-500"
        >
          Sign In
        </button>
      </form>
      <div className="relative my-4 h-px w-full bg-gray-300">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          New to our Amazon Clone?
        </span>
      </div>
      <button
        onClick={handleSignUp}
        className="w-full rounded-lg border border-gray-300 bg-gray-100 py-2 text-sm shadow hover:bg-gray-200"
      >
        Create your Account
      </button>
    </div>
  )
}
