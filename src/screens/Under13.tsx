import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone, ExternalLink } from 'lucide-react'

// Shown instead of creating an account when someone under 13 picks Youth.
// Nothing is collected or saved on this page.

const card: React.CSSProperties = {
  background: '#FAF7F2', borderRadius: 20, padding: '18px 20px', marginBottom: 14,
  border: '1px solid rgba(122,102,144,0.12)', boxShadow: '0 3px 10px rgba(42,32,48,0.05)',
}
const h2: React.CSSProperties = { fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: '#2A2030', margin: '0 0 6px' }
const p: React.CSSProperties = { fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#4A4058', lineHeight: 1.6, margin: 0 }
const callBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 12, minHeight: 44,
  background: '#F4EFF8', color: '#5E4D74', borderRadius: 14, padding: '10px 16px',
  fontFamily: 'DM Sans, sans-serif', fontSize: 15, fontWeight: 700, textDecoration: 'none',
}

export function Under13() {
  const navigate = useNavigate()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DB' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px 60px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 700, color: '#2A2030', margin: '0 0 10px' }}>
          Anchor accounts are for ages 13 and up
        </h1>
        <p style={{ ...p, marginBottom: 24 }}>
          We did not make an account or save anything about you. You still have rights, and there are people whose job is to listen to you.
        </p>

        <div style={card}>
          <h2 style={h2}>You have a lawyer</h2>
          <p style={p}>
            Most kids in foster care have their own lawyer. Your lawyer works for you. You can ask them anything, like where you will live, when you can see your family, and whether you can go to court or talk to the judge.
          </p>
        </div>

        <div style={card}>
          <h2 style={h2}>If you do not feel safe</h2>
          <p style={p}>
            Tell your lawyer, your social worker, or another grown-up you trust today. You can also call the California Foster Care Ombudsperson. It is free, and they help kids in foster care.
          </p>
          <a href="tel:18778461602" style={callBtn}><Phone size={16} /> 1-877-846-1602</a>
        </div>

        <div style={card}>
          <h2 style={h2}>If you need help right now</h2>
          <p style={p}>
            If you feel like hurting yourself, call or text 988. Someone answers day or night. If you are in danger, call 911.
          </p>
          <a href="tel:988" style={callBtn}><Phone size={16} /> Call or text 988</a>
        </div>

        <div style={card}>
          <h2 style={h2}>Use Anchor with a grown-up</h2>
          <p style={p}>
            Your caregiver, your CASA, or another adult who helps you can make an Anchor account as a Supporter and go through it with you.
          </p>
        </div>

        <div style={card}>
          <h2 style={h2}>Learn your rights</h2>
          <p style={p}>The state has a page for kids and teens in foster care about your rights.</p>
          <a href="https://fosteryouthhelp.ca.gov/" target="_blank" rel="noopener noreferrer" style={callBtn}>
            <ExternalLink size={16} /> Foster Youth Help
          </a>
        </div>

        <button
          onClick={() => navigate('/auth')}
          style={{
            width: '100%', marginTop: 10, minHeight: 48, background: 'transparent', color: '#5E4D74',
            border: '1.5px solid rgba(122,102,144,0.3)', borderRadius: 16,
            fontFamily: 'DM Sans, sans-serif', fontWeight: 700, fontSize: 15, cursor: 'pointer',
          }}
        >
          Back to sign in
        </button>
      </div>
    </div>
  )
}
