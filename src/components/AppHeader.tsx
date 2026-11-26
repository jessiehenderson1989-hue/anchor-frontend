import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, Settings } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { haptics } from '../lib/haptics'
import { ConfirmDialog } from './ConfirmDialog'

interface AppHeaderProps {
  showBack?: boolean
  /** Accepted so screens can name themselves. The header does not show it. */
  title?: string
}

const STAGE_COUNT = 10

export function AppHeader({ showBack = true }: AppHeaderProps) {
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const onSettings = useLocation().pathname === '/settings'
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const STAGE_ORDER = [
    'case-opening','detention','jurisdiction','disposition',
    'six-month','twelve-month','eighteen-month','permanency',
    'review-hearings','case-closure',
  ]
  const currentStageIndex = STAGE_ORDER.indexOf(profile?.current_stage || 'case-opening')
  const progress = Math.max(1, currentStageIndex + 1) / STAGE_COUNT
  const radius = 24
  const circumference = 2 * Math.PI * radius
  const dashLength = circumference * progress
  const ringColor = '#705987'

  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,247,242,0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.8)',
        boxShadow: '0 1px 12px rgba(90,70,110,0.08)',
      }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          padding: '8px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          position: 'relative',
        }}>

          {/* Left */}
          <div style={{ width: 40, flexShrink: 0 }}>
            {showBack && (
              <button className="aedge"
                onClick={() => { haptics.light(); navigate(-1) }}
                style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(145deg,#E9E0EF,#E1D6EA)', border: '1px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                aria-label="Go back"
              >
                <ArrowLeft size={17} color="#705987" />
              </button>
            )}
          </div>

          {/* Center — logo on a light badge, with the progress ring around it */}
          <div style={{
            position: 'absolute', left: '50%', top: '50%',
            transform: 'translate(-50%, -50%)',
            width: 52, height: 52,
          }}>
            {/* Badge behind the logo */}
            <div style={{
              position: 'absolute', top: 5, left: 5, width: 42, height: 42, borderRadius: '50%',
              background: 'linear-gradient(160deg,#FFFFFF,#E9E0EF)',
              boxShadow: '0 2px 8px rgba(94,77,116,0.22), inset 0 1px 0 rgba(255,255,255,1)',
            }} />
            {/* Progress ring SVG */}
            <svg
              width="52" height="52"
              viewBox="0 0 52 52"
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* Track */}
              <circle
                cx="26" cy="26" r={radius}
                fill="none"
                stroke="rgba(112,89,135,0.2)"
                strokeWidth="3"
              />
              {/* Progress arc */}
              <circle
                cx="26" cy="26" r={radius}
                fill="none"
                stroke={ringColor}
                strokeWidth="3"
                strokeDasharray={`${dashLength} ${circumference}`}
                strokeLinecap="round"
                transform="rotate(-90 26 26)"
              />
            </svg>
            {/* Actual logo */}
            <img
              src="/anchor-mark.png"
              alt="Anchor"
              style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 30, height: 30,
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Right */}
          {onSettings ? <div style={{ width: 40, flexShrink: 0 }} /> : (
          <button className="aedge"
            onClick={() => { haptics.light(); navigate('/settings') }}
            style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(145deg,#E9E0EF,#E1D6EA)', border: '1px solid rgba(255,255,255,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
            aria-label="Settings"
          >
            <Settings size={17} color="#705987" />
          </button>
          )}
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutDialog}
        onCancel={() => setShowLogoutDialog(false)}
        onConfirm={signOut}
        title="Sign Out"
        message="Are you sure you want to sign out?"
        confirmLabel="Sign Out"
        cancelLabel="Cancel"
      />
    </>
  )
}
