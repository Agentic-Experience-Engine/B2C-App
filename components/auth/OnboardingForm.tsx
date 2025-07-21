'use client'

import { updateUserProfile } from '@/actions/action'

export default function OnboardingForm() {
  return (
    <form action={updateUserProfile} className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">
          Full name
        </label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium leading-6 text-gray-900">
          Phone number
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium leading-6 text-gray-900">
          Date of birth
        </label>
        <input
          type="date"
          name="dateOfBirth"
          id="dateOfBirth"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="gender" className="block text-sm font-medium leading-6 text-gray-900">
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
      </div>
      <div>
        <label htmlFor="maritalStatus" className="block text-sm font-medium leading-6 text-gray-900">
          Marital Status
        </label>
        <select
          id="maritalStatus"
          name="maritalStatus"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        >
          <option>Single</option>
          <option>Married</option>
          <option>Prefer not to say</option>
        </select>
      </div>
      <div>
        <label htmlFor="preferredLanguage" className="block text-sm font-medium leading-6 text-gray-900">
          Preferred Language
        </label>
        <input
          type="text"
          name="preferredLanguage"
          id="preferredLanguage"
          defaultValue="English"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="locationPincode" className="block text-sm font-medium leading-6 text-gray-900">
          Location Pincode
        </label>
        <input
          type="text"
          pattern="[0-9]{5,6}"
          name="locationPincode"
          id="locationPincode"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring-indigo-600 sm:text-sm"
        />
      </div>
      <div className="sm:col-span-2">
        <button
          type="submit"
          className="mt-4 w-full rounded-lg bg-yellow-400 px-4 py-2 text-sm font-semibold text-black shadow-md hover:bg-yellow-500"
        >
          Create Account
        </button>
      </div>
    </form>
  )
}
