// actions/action.ts
'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'

export async function updateUserProfile(formData: FormData) {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const fullName = (formData.get('fullName') || '') as string
  const phoneNumber = (formData.get('phoneNumber') || '') as string
  const dateOfBirth = (formData.get('dateOfBirth') || '') as string
  const gender = (formData.get('gender') || '') as string
  const maritalStatus = (formData.get('maritalStatus') || '') as string
  const preferredLanguage = (formData.get('preferredLanguage') || '') as string
  const locationPincode = (formData.get('locationPincode') || '') as string

  const existingAuth = await prisma.userAuthentication.findUnique({
    where: { authId: user.id }, // ✅ uses authId from your schema
    include: { user: true },
  })

  const dob = dateOfBirth ? new Date(dateOfBirth) : null

  if (!existingAuth) {
    // First-time onboarding: create User + UserAuthentication
    await prisma.user.create({
      data: {
        email: user.email ?? '',
        name: fullName,
        phoneNumber: phoneNumber || null,
        dateOfBirth: dob,
        gender: gender || null,
        maritalStatus: maritalStatus || null,
        preferredLanguage: preferredLanguage || null,
        locationPincode: locationPincode || null,
        onboardingComplete: true,
        accountCreatedAt: new Date(),
        authentication: {
          // 👇 this maps to your UserAuthentication model
          create: {
            authId: user.id, // ✅ primary key in UserAuthentication
            // userId is auto-filled by Prisma because we are nested under User
          },
        },
      },
    })
  } else {
    // Already linked: update existing User
    await prisma.user.update({
      where: { id: existingAuth.userId },
      data: {
        name: fullName,
        phoneNumber: phoneNumber || null,
        dateOfBirth: dob,
        gender: gender || null,
        maritalStatus: maritalStatus || null,
        preferredLanguage: preferredLanguage || null,
        locationPincode: locationPincode || null,
        onboardingComplete: true,
      },
    })
  }

  redirect('/')
}
