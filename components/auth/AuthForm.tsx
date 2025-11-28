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
  const [showResendLink, setShowResendLink] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const supabase = createClient()

    try {
      setIsSubmitting(true)

      if (isSigningUp) {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          return
        }

        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
          },
        })

        if (error) {
          setError(error.message)
          return
        }

        toast.success('Check your email to confirm your account.')
        setShowResendLink(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setError(error.message)
          return
        }

        toast.success('Signed in successfully')
        router.push('/onboarding')
        router.refresh()
      }
    } catch (err: any) {
      console.error(err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResend = async () => {
    const supabase = createClient()
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${location.origin}/auth/callback?next=/onboarding`,
        },
      })
      if (error) {
        setError(error.message)
      } else {
        toast.success('Verification email resent.')
      }
    } catch (err: any) {
      console.error(err)
      setError('Failed to resend verification email.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      {isSigningUp && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-yellow-400 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-500 disabled:opacity-60"
      >
        {isSubmitting ? 'Please wait...' : isSigningUp ? 'Create account' : 'Sign in'}
      </button>

      {showResendLink && (
        <button type="button" onClick={handleResend} className="mt-2 w-full text-xs text-blue-600 hover:underline">
          Resend verification email
        </button>
      )}

      <div className="relative my-4 h-px w-full bg-gray-200">
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-gray-500">
          {isSigningUp ? 'Already have an account?' : 'New to our Amazon Clone?'}
        </span>
      </div>

      <button
        type="button"
        onClick={() => {
          setIsSigningUp((prev) => !prev)
          setError(null)
        }}
        className="w-full rounded-md border border-gray-300 bg-gray-100 py-2 text-sm shadow-sm hover:bg-gray-200"
      >
        {isSigningUp ? 'Sign in instead' : 'Create your Amazon account'}
      </button>
    </form>
  )
}
