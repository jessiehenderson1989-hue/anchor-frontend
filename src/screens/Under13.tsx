import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Phone, ExternalLink } from 'lucide-react'

// Shown instead of creating an account when someone under 13 picks Youth.
// Nothing is collected or saved on this page.

const card: React.CSSProperties = {
  background: '#FAF7F2', borderRadius: 20, padding: '18px 20px', marginBottom: 14,
  border: '1px solid rgba(112,89,135,0.12)', boxShadow: '0 3px 10px rgba(42,32,48,0.05)',
}
const h2: React.CSSProperties = { fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 700, color: '#291F32', margin: '0 0 6px' }
const p: React.CSSProperties = { fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#4A4058', lineHeight: 1.6, margin: 0 }

export function Under13() {
  const navigate = useNavigate()
  const { user } = useAuth()
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DB' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '40px 20px 60px' }}>
        <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, fontWeight: 700, color: '#291F32', margin: '0 0 10px' }}>
          Anchor accounts are for ages 13 and up
        </h1>
        <p style={{ ...p, marginBottom: 24 }}>
          {user ? 'Your account was not changed.' : 'We did not make an account or save anything about you.'} You still have rights, and there are people whose job is to listen to you.
        </p>

        <div style={card}>
          <h2 style={h2}>If you do not feel safe</h2>
          <p style={{ ...p, fontSize: 16, lineHeight: '24px', fontWeight: 600, color: '#291F32', marginBottom: 8 }}>
            Tell your lawyer, your social worker, or a grown-up you trust today.
          </p>
          <p style={p}>
            There is also a state office that helps kids in foster care when something is wrong. It is called the Foster Care Ombudsperson. You can call them. The call is free.
          </p>
          <a href="tel:18778461602" className="abtn abtn-soft abtn-sm" style={{ marginTop: 12 }}><Phone size={16} /> 1-877-846-1602</a>
        </div>

        <div style={card}>
          <h2 style={h2}>If you need help right now</h2>
          <p style={p}>
            If you feel like hurting yourself, call or text 988. Someone answers day or night. If you are in danger, call 911.
          </p>
          <a href="tel:988" className="abtn abtn-soft abtn-sm" style={{ marginTop: 12 }}><Phone size={16} /> Call or text 988</a>
        </div>

        <div style={card}>
          <h2 style={h2}>You have a lawyer</h2>
          <p style={p}>
            Most kids in foster care have their own lawyer. Your lawyer works for you. You can ask them anything, like where you will live, when you can see your family, and whether you can go to court or talk to the judge.
          </p>
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
          <a href="https://fosteryouthhelp.ca.gov/" target="_blank" rel="noopener noreferrer" className="abtn abtn-soft abtn-sm" style={{ marginTop: 12 }}>
            <ExternalLink size={16} /> Foster Youth Help
          </a>
        </div>

        <button
          onClick={() => navigate(user ? '/settings' : '/auth')}
          className="abtn abtn-outline abtn-block"
          style={{ marginTop: 10 }}
        >
          {user ? 'Back to Settings' : 'Back to sign in'}
        </button>
      </div>
    </div>
  )
}
