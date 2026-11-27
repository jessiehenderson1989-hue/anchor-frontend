import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

// The sign-in screen is for people who are signed out. Someone who arrives already
// signed in goes Home. The check runs once, on arrival, so signing in or signing up
// on this screen still finishes its own steps.
export function SignedOutOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const [arrivedSignedIn, setArrivedSignedIn] = useState<boolean | null>(null)

  useEffect(() => {
    if (!loading && arrivedSignedIn === null) setArrivedSignedIn(!!user)
  }, [loading, user, arrivedSignedIn])

  if (loading || arrivedSignedIn === null) return <div style={{ minHeight: '100vh', background: '#EDE6DB' }} />
  if (arrivedSignedIn) return <Navigate to="/" replace />
  return <>{children}</>
}
