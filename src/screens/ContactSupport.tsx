import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { haptics } from '../lib/haptics'

const TOPICS = [
  'I found an error in the app',
  'Something isn\'t working',
  'I have a question about my case',
  'I want to give feedback',
  'Something else',
]

export function ContactSupport() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!message.trim()) { setError('Please write a message before sending.'); return }
    setLoading(true); setError('')
    try {
      const { error: dbError } = await supabase.from('support_requests').insert({
        user_id: user?.id || null,
        username: profile?.username || null,
        role: profile?.role || null,
        topic: topic || 'Not specified',
        message: message.trim(),
        contact: !user && contact.trim() ? contact.trim() : null,
      })
      if (dbError) throw dbError
      haptics.success()
      setSubmitted(true)
    } catch (e: any) {
      setError('Something went wrong. Please try again.')
      haptics.error()
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', background: '#EDE6DB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 320 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(145deg,#EAF4EE,#D4EDD8)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 4px 16px rgba(74,124,89,0.2)' }}>
            <Check size={28} color="#4A7C59" />
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 700, color: '#291F32', marginBottom: 10 }}>Message sent</h2>
          <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#4A4058', lineHeight: 1.6, marginBottom: 28 }}>
            We got your message and will follow up within a few days. Thank you for reaching out.
          </p>
          <button
            onClick={() => navigate(user ? '/settings' : '/')}
            className="abtn abtn-primary"
          >
            {user ? 'Back to Settings' : 'Back'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DB' }}>
      <div style={{ background: '#FAF7F2', borderBottom: '1px solid rgba(112,89,135,0.1)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 10 }}>
        <button className="aedge" onClick={() => navigate(-1)} style={{ background: '#E8DDE8', border: 'none', borderRadius: 10, width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
          <ArrowLeft size={16} color="#705987" />
        </button>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 20, fontWeight: 700, color: '#291F32', margin: 0 }}>Contact Support</h1>
      </div>

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '28px 20px 60px' }}>
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#4A4058', lineHeight: 1.6, marginBottom: 28 }}>
          Have a question, found something wrong, or want to share feedback? We read every message.
        </p>

        {/* Topic */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#62566B', marginBottom: 10 }}>
            What's this about? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
          </label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOPICS.map((t) => (
              <button className="aedge"
                key={t}
                onClick={() => { haptics.light(); setTopic(t === topic ? '' : t) }}
                style={{ textAlign: 'left', padding: '12px 16px', background: topic === t ? '#E9E0EF' : '#FAF7F2', border: topic === t ? '1.5px solid #705987' : '1.5px solid rgba(112,89,135,0.15)', borderRadius: 14, cursor: 'pointer', fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: topic === t ? '#705987' : '#4A4058', fontWeight: topic === t ? 600 : 400 }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#62566B', marginBottom: 8 }}>
            Your message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind…"
            rows={6}
            maxLength={4000}
            style={{ width: '100%', boxSizing: 'border-box', padding: '14px 16px', background: '#FAF7F2', border: '1.5px solid rgba(112,89,135,0.2)', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#291F32', outline: 'none', resize: 'vertical', lineHeight: 1.6 }}
          />
        </div>

        {!user && (
          <div style={{ marginBottom: 20 }}>
            <label htmlFor="support-contact" style={{ display: 'block', fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#62566B', marginBottom: 8 }}>
              How can we reach you? <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              id="support-contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone number"
              maxLength={200}
              autoComplete="email"
              style={{ width: '100%', boxSizing: 'border-box', minHeight: 50, padding: '0 16px', background: '#FAF7F2', border: '1.5px solid rgba(112,89,135,0.2)', borderRadius: 16, fontFamily: 'DM Sans, sans-serif', color: '#291F32', outline: 'none' }}
            />
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#62566B', margin: '6px 0 0', lineHeight: 1.4 }}>
              You are not signed in, so we cannot write back unless you leave one.
            </p>
          </div>
        )}

        {error && (
          <div style={{ background: '#F5ECD8', border: '1px solid rgba(200,136,58,0.2)', borderRadius: 12, padding: '10px 14px', marginBottom: 16 }}>
            <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, color: '#7A5A2A', margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading || !message.trim()}
          className="abtn abtn-primary abtn-block" style={{ width: '100%' }}
        >
          {loading ? 'Sending…' : 'Send Message'}
        </button>

        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: '#62566B', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          We typically respond within 2–3 business days.{'\n'}For urgent legal questions, please contact your attorney.
        </p>
      </div>
    </div>
  )
}
