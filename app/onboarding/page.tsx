import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { PrismaClient } from '@prisma/client'
import OnboardingForm from '@/components/auth/OnboardingForm'

const prisma = new PrismaClient()

export default async function OnboardingPage() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const authLink = await prisma.userAuthentication.findUnique({
    where: { authId: user.id },
    include: { user: true },
  })

  if (authLink?.user.onboardingComplete) {
    redirect('/')
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-gray-50 p-8">
      <div className="w-full max-w-lg rounded-lg border bg-white p-8 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold">Complete Your Profile</h1>
        <p className="mb-6 text-sm text-gray-600">
          Welcome, {user?.email}! Please fill out the details below to finish creating your account.
        </p>
        <OnboardingForm />
      </div>
    </main>
  )
}
