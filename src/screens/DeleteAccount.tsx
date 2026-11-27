import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Download, Lock, Trash2 } from 'lucide-react'
import { AppHeader } from '../components'
import { useAuth } from '../contexts/AuthContext'
import { haptics } from '../lib/haptics'
import { supabase } from '../lib/supabase'

export function DeleteAccount() {
  const [step, setStep] = useState<'export' | 'confirm'>('export')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [exportSent, setExportSent] = useState(false)
  const { deleteAccount, user, profile } = useAuth()
  const navigate = useNavigate()

  // Saves a real copy of the person's data to their device before anything is deleted
  const handleExport = async () => {
    haptics.light()
    setError('')
    try {
      const [notes, timeline, contacts] = await Promise.all([
        supabase.from('notes').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
        supabase.from('timeline_stages').select('*').eq('user_id', user?.id).order('order_index'),
        supabase.from('contacts').select('*').eq('user_id', user?.id),
      ])
      if (notes.error || timeline.error || contacts.error) throw new Error('export failed')
      const data = { profile, exportDate: new Date().toISOString(), notes: notes.data || [], timeline: timeline.data || [], contacts: contacts.data || [] }
      const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url; a.download = `anchor-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportSent(true)
      setTimeout(() => setStep('confirm'), 1000)
    } catch {
      setError('We could not save your copy. Check your connection and try again.')
    }
  }

  const handleDelete = async () => {
    if (!password || !confirmed) return
    setError('')
    setLoading(true)
    haptics.light()
    try {
      const { error } = await deleteAccount(password)
      if (error) {
        setError(error.message)
        setLoading(false)
        return
      }
      // A full reload clears the signed-in state left behind by the deleted account
      window.location.replace('/auth?mode=signup')
    } catch {
      setError('Failed to delete account. Please try again.')
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '13px 16px 13px 44px',
    background: '#EDE6DB',
    border: '1.5px solid rgba(112,89,135,0.2)',
    borderRadius: 16,
    fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#291F32',
    outline: 'none',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DB' }}>
      <AppHeader title="Delete Account" />

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '32px 20px 48px' }}>

        {step === 'export' ? (
          <>
            {/* Warning card */}
            <div style={{ background: '#F5ECD8', border: '1px solid rgba(200,136,58,0.25)', borderRadius: 20, padding: '18px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#C8883A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <AlertTriangle size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, color: '#291F32', margin: '0 0 6px' }}>
                    Before you go
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#7A5A2A', margin: 0, lineHeight: 1.6 }}>
                    You can save a copy of your notes, team, and timeline to this device before deleting your account.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p role="alert" style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#94445D', margin: '0 0 14px', lineHeight: 1.5 }}>{error}</p>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button
                onClick={handleExport}
                disabled={exportSent}
                className="abtn abtn-primary abtn-block"
                style={exportSent ? { background: '#EAF4EE', color: '#4A7C59', boxShadow: 'none', opacity: 1, cursor: 'default' } : undefined}
              >
                <Download size={16} />
                {exportSent ? 'Copy saved ✓' : 'Save a copy of my data'}
              </button>

              <button className="abtn abtn-outline"
                onClick={() => { haptics.light(); setStep('confirm') }}
                style={{ width: '100%' }}
              >
                Skip — delete without export
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Danger warning */}
            <div style={{ background: '#F8EEF2', border: '1px solid rgba(148,68,93,0.2)', borderRadius: 20, padding: '18px', marginBottom: 28 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 12, background: '#94445D', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Trash2 size={18} color="#fff" />
                </div>
                <div>
                  <p style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, color: '#291F32', margin: '0 0 6px' }}>
                    This is permanent
                  </p>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#8A3A3A', margin: 0, lineHeight: 1.6 }}>
                    All your notes, contacts, and timeline will be deleted forever. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {/* Password field */}
              <div>
                <label style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600, color: '#5A5065', display: 'block', marginBottom: 6 }}>
                  Confirm your password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#62566B' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Confirmation checkbox */}
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
                <div
                  onClick={() => setConfirmed(!confirmed)}
                  style={{
                    width: 20, height: 20, borderRadius: 6, flexShrink: 0, marginTop: 1,
                    background: confirmed ? '#94445D' : '#F0EAE0',
                    border: confirmed ? '2px solid #94445D' : '2px solid rgba(112,89,135,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {confirmed && (
                    <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                      <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#5A5065', lineHeight: 1.5 }}>
                  I understand this will permanently delete my account and all my data
                </span>
              </label>

              {/* Error */}
              {error && (
                <div style={{ background: '#F8EEF2', border: '1px solid rgba(148,68,93,0.2)', borderRadius: 14, padding: '12px 14px' }}>
                  <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#94445D', margin: 0 }}>{error}</p>
                </div>
              )}

              {/* Delete button */}
              <button className="abtn abtn-rose"
                onClick={handleDelete}
                disabled={!password || !confirmed || loading}
                style={{ width: '100%' }}
              >
                {loading ? 'Deleting…' : 'Delete my account permanently'}
              </button>

              {/* Cancel */}
              <button className="abtn abtn-outline"
                onClick={() => navigate('/settings')}
                style={{ width: '100%' }}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
