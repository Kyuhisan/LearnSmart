import { useAuth } from '../context/AuthContext'

export function LoginButton() {
  const { session, signInWithGoogle, signOut } = useAuth()

  if (session) {
    return (
      <div>
        <span>Hello, {session.user.email}</span>
        <button onClick={signOut}>Sign out</button>
      </div>
    )
  }

  return (
    <button onClick={signInWithGoogle}>
      Sign in with Google
    </button>
  )
}