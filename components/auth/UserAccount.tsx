import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import SignOutButton from './SignOutButton'
import { FiChevronDown } from 'react-icons/fi' // Add a dropdown icon: npm i react-icons

interface UserAccountProps {
  user: User
}

const UserAccount = ({ user }: UserAccountProps) => {
  // Truncate long usernames for better display
  const displayName = user.email?.split('@')[0]
  const truncatedName = displayName && displayName.length > 10 ? `${displayName.substring(0, 10)}...` : displayName

  return (
    // Make the parent 'relative' to correctly position the 'absolute' dropdown
    <div className="headerItem group relative cursor-pointer">
      {/* Main Button Content */}
      <div>
        <p className="text-xs text-gray-300">Hello, {truncatedName}</p>
        <div className="flex items-center">
          <FiChevronDown className="ml-1 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        className="
        absolute top-full right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white text-black shadow-2xl
        opacity-0 invisible group-hover:opacity-100 group-hover:visible
        transition-all duration-200 ease-in-out
      "
      >
        {/* Triangle/Caret pointing to the button */}
        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 transform bg-white"></div>

        <div className="relative rounded-md border border-gray-200 p-4">
          <div className="border-b border-gray-200 pb-4 mb-4 text-center">
            <h3 className="font-bold text-lg">Your Account</h3>
            <p className="text-sm text-gray-600" title={user.email}>
              {user.email}
            </p>
          </div>

          {/* Sign Out Section */}
          <div className="mt-4">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAccount
