import Link from 'next/link'

const SignInButton = () => {
  return (
    <Link href="/login" className="headerItem">
      <p className="text-xs">Hello, sign in</p>
      <p className="text-sm font-bold">Account &amp; Lists</p>
    </Link>
  )
}

export default SignInButton
