import { User } from '@supabase/supabase-js'
import SignOutButton from './SignOutButton'

interface UserAccountProps {
  user: User
}

const UserAccount = ({ user }: UserAccountProps) => {
  return (
    <div className="headerItem group">
      <p className="text-xs">Hello, {user.email?.split('@')[0]}</p>
      <p className="text-white font-bold">Account & Lists</p>
      {/* This div can be used for a hover dropdown menu */}
      <div className="absolute top-12 right-20 z-50 hidden w-48 rounded-md bg-white p-4 text-black shadow-lg group-hover:block">
        <p className="mb-4 text-sm">Welcome back!</p>
        <SignOutButton />
      </div>
    </div>
  )
}

export default UserAccount
