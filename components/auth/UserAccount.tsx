import { User } from '@supabase/supabase-js'
import SignOutButton from './SignOutButton'
import { FiChevronDown } from 'react-icons/fi'

interface UserAccountProps {
  user: User
}

const UserAccount = ({ user }: UserAccountProps) => {
  const displayName = user.email?.split('@')[0]
  const truncatedName = displayName && displayName.length > 10 ? `${displayName.substring(0, 10)}...` : displayName

  return (
    <div className="headerItem group relative cursor-pointer">
      <div>
        <p className="text-xs text-gray-300">Hello, {truncatedName}</p>
        <div className="flex items-center">
          <span className="text-sm font-bold text-white">Account &amp; Lists</span>
          <FiChevronDown className="ml-1 text-gray-400 transition-transform duration-200 group-hover:rotate-180" />
        </div>
      </div>

      <div className="absolute top-full right-0 z-50 mt-2 w-64 origin-top-right rounded-md bg-white text-black shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out">
        <div className="absolute -top-2 right-6 h-4 w-4 rotate-45 transform bg-white" />

        <div className="relative rounded-md border border-gray-200 p-4">
          <div className="mb-4 border-b border-gray-200 pb-4 text-center">
            <h3 className="text-lg font-bold">Your Account</h3>
            <p className="text-sm text-gray-600" title={user.email || undefined}>
              {user.email}
            </p>
          </div>
          <div className="mt-4">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserAccount
