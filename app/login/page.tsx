import AuthForm from '@/components/auth/AuthForm'
import GoogleSignInButton from '@/components/auth/GoogleSignInButton'
import Link from 'next/link'

const AmazonLogo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-label="Amazon Logo">
    <circle cx="20" cy="20" r="20" fill="#FF9900" />
    <text x="50%" y="55%" textAnchor="middle" fontSize="18" fill="#fff" fontFamily="Arial" dy=".3em">
      a
    </text>
  </svg>
)

export default function LoginPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-white px-4 py-8">
      <Link href="/" className="mb-4">
        <AmazonLogo />
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-gray-200 p-6 shadow-sm">
        <h1 className="mb-4 text-2xl font-normal text-gray-900">Sign in</h1>
        <AuthForm />
        <div className="mt-6">
          <GoogleSignInButton />
        </div>
        <p className="mt-4 text-xs text-gray-600">
          By continuing, you agree to Amazon&apos;s Conditions of Use and Privacy Notice.
        </p>
      </div>
    </main>
  )
}
