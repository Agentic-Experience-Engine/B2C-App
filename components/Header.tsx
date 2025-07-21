import { logo } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'
import { SlLocationPin } from 'react-icons/sl'
import HeaderBottom from './HeaderBottom'
import SearchInput from './SearchInput'
import CartButton from './CartButton'
import FavoriteButton from './FavoriteButton'
import { createClient } from '@/lib/supabase/server'
import SignInButton from './auth/SignInButton'
import UserAccount from './auth/UserAccount'

const Header = async () => {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <header className="bg-transparent sticky top-0 z-50">
      <div className="w-full h-20 bg-amazonBlue text-lightText sticky top-0 z-50">
        <div className="h-full w-full mx-auto inline-flex items-center justify-between gap-1 mdl:gap-3 px-4">
          {/* Logo */}
          <Link href={'/'}>
            <div className="headerItem">
              <Image className="w-28 object-cover mt-1" src={logo} alt="logo" priority />
            </div>
          </Link>
          {/* Deliver */}
          <div className="headerItem hidden xl:inline-flex gap-1">
            <SlLocationPin className="text-lg text-white" />
            <div className="text-xs">
              <p>Deliver to</p>
              <p className="text-white font-bold uppercase">USA</p>
            </div>
          </div>
          <SearchInput />

          {/* Conditional Auth Block */}
          {user ? <UserAccount user={user} /> : <SignInButton />}

          {/* Favorite */}
          <FavoriteButton />
          {/* Cart */}
          <CartButton />
        </div>
      </div>
      <HeaderBottom />
    </header>
  )
}

export default Header
