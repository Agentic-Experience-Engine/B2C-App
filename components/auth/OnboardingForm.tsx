'use client'

import { updateUserProfile } from '@/actions/action'

export default function OnboardingForm() {
  return (
    <form action={updateUserProfile} className="grid grid-cols-1 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          name="fullName"
          required
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
        <input
          name="phoneNumber"
          type="tel"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          name="dateOfBirth"
          type="date"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Gender</label>
        <select
          name="gender"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        >
          <option value="">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Marital Status</label>
        <select
          name="maritalStatus"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        >
          <option value="">Prefer not to say</option>
          <option value="single">Single</option>
          <option value="married">Married</option>
          <option value="divorced">Divorced</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Preferred Language</label>
        <input
          name="preferredLanguage"
          placeholder="e.g. English"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Pincode</label>
        <input
          name="locationPincode"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amazonOrange focus:outline-none focus:ring-1 focus:ring-amazonOrange"
        />
      </div>

      <button
        type="submit"
        className="mt-4 w-full rounded-md bg-yellow-400 py-2 text-sm font-semibold text-black shadow-sm hover:bg-yellow-500"
      >
        Save and continue
      </button>
    </form>
  )
}
