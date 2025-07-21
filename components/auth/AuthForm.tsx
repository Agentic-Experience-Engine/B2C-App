'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSigningUp, setIsSigningUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showResendLink, setShowResendLink] = useState(false) // New state for resend link
  const router = useRouter()

  const handleResendEmail = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Confirmation email resent!')
    }
  }

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setShowResendLink(false)
    const supabase = createClient()

    if (isSigningUp) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.')
        return
      }
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
        },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        toast.success('Success! Please check your email to confirm your account.')
        setShowResendLink(true) // Show the resend link on success
      }
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
      if (signInError) {
        setError(signInError.message)
      } else {
        router.push('/onboarding')
        router.refresh()
      }
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleAuthAction} className="flex w-full flex-col">
        {error && (
          <p className="mb-4 w-full rounded border border-red-500 bg-red-100 p-2 text-sm text-red-700">{error}</p>
        )}
        <label htmlFor="email" className="mb-1 text-xs font-bold">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-3 rounded-md border border-gray-400 px-3 py-1 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />
        <label htmlFor="password" className="mb-1 text-xs font-bold">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-3 rounded-md border border-gray-400 px-3 py-1 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
          required
        />
        {isSigningUp && (
          <>
            <label htmlFor="confirmPassword" className="mb-1 text-xs font-bold">
              Re-enter Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-4 rounded-md border border-gray-400 px-3 py-1 text-sm shadow-sm focus:border-yellow-500 focus:ring-yellow-500"
              required
            />
          </>
        )}
        <button type="submit" className="rounded-lg bg-yellow-400 py-1.5 text-sm shadow hover:bg-yellow-500">
          {isSigningUp ? 'Sign Up' : 'Continue'}
        </button>
      </form>

      {showResendLink && (
        <div className="mt-4 text-center text-xs">
          <p>
            Didn&#39;t get an email?{' '}
            <button onClick={handleResendEmail} className="font-semibold text-blue-600 hover:underline">
              Resend
            </button>
          </p>
        </div>
      )}

      <div className="relative my-6 h-px w-full bg-gray-200">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          {isSigningUp ? 'Already have an account?' : 'New to our Amazon Clone?'}
        </span>
      </div>
      <button
        onClick={() => setIsSigningUp(!isSigningUp)}
        className="w-full rounded-lg border border-gray-300 bg-gray-100 py-1.5 text-sm shadow-sm hover:bg-gray-200"
      >
        {isSigningUp ? 'Sign-In instead' : 'Create your Account'}
      </button>
    </div>
  )
}
