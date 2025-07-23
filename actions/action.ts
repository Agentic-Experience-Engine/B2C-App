'use server'

import { createClient } from '@/lib/supabase/server'
import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('User not authenticated')
  }

  // Find the internal user ID from the bridge table
  const authLink = await prisma.userAuthentication.findUnique({
    where: { authId: user.id },
  })

  if (!authLink) {
    throw new Error('Could not find user profile to update.')
  }

  const internalUserId = authLink.userId

  // Update the user's profile in your public.User table
  await prisma.user.update({
    where: { id: internalUserId },
    data: {
      name: formData.get('fullName') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      gender: formData.get('gender') as string,
      maritalStatus: formData.get('maritalStatus') as string,
      preferredLanguage: formData.get('preferredLanguage') as string,
      locationPincode: formData.get('locationPincode') as string,
      onboardingComplete: true, // Mark onboarding as complete
      accountCreatedAt: new Date(), // Set the creation timestamp
    },
  })

  revalidatePath('/', 'layout') // Revalidate all paths
  redirect('/') // Redirect to homepage
}
