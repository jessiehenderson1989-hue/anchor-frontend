import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Download, X } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

// The banner waits until a person is inside the app. On these screens it
// would sit on top of the form they are trying to fill in.
const QUIET_SCREENS = ['/', '/auth', '/onboarding', '/foster-care-intro', '/forgot-password', '/reset-password', '/contact-support', '/under-13']

export function InstallPrompt() {
  const { pathname } = useLocation()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const dismissed = sessionStorage.getItem('pwa-install-dismissed')
    if (dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    await deferredPrompt.userChoice

    setDeferredPrompt(null)
    setShowPrompt(false)
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    sessionStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (!showPrompt || !deferredPrompt || QUIET_SCREENS.includes(pathname)) return null

  const font = 'DM Sans, sans-serif'

  return (
    <div
      className="animate-slide-up"
      style={{ position: 'fixed', left: 16, right: 16, bottom: 'calc(88px + env(safe-area-inset-bottom, 0px))', zIndex: 50, maxWidth: 460, margin: '0 auto' }}
    >
      <div style={{ position: 'relative', background: '#FAF7F2', border: '1px solid rgba(122,102,144,0.18)', borderRadius: 20, padding: 16, boxShadow: '0 10px 30px rgba(60,40,80,0.16)' }}>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss"
          style={{ position: 'absolute', top: 6, right: 6, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', borderRadius: 12, cursor: 'pointer' }}
        >
          <X size={16} color="#8A8098" />
        </button>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, paddingRight: 28 }}>
          <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 12, background: 'rgba(122,102,144,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Download size={18} color="#7A6690" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, color: '#2A2030', margin: '0 0 2px' }}>Install Anchor</h3>
            <p style={{ fontFamily: font, fontSize: 15, lineHeight: 1.45, color: '#4A4058', margin: '0 0 12px' }}>
              Add Anchor to your home screen for quick access anytime
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="abtn abtn-primary abtn-sm"
                onClick={handleInstall}
                style={{ flex: 1 }}
              >
                Add to Home Screen
              </button>
              <button className="abtn abtn-soft abtn-sm"
                onClick={handleDismiss}
                
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
