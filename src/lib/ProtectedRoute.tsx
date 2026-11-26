import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  /** Screens a person may open before finishing intake (intake itself, terms, privacy, delete account). */
  allowBeforeIntake?: boolean
}

export function ProtectedRoute({ children, allowBeforeIntake = false }: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#7A6690] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth?mode=signin" replace />
  }

  // Intake comes first. Nothing else opens until it is finished.
  if (!allowBeforeIntake && profile && profile.intake_completed !== true) {
    return <Navigate to="/onboarding" replace />
  }

  return <>{children}</>
}
