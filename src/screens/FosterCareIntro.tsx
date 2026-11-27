import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { haptics } from '../lib/haptics'

interface Section {
  title: string
  body: string
}

const CONTENT: Record<string, { headline: string; subtitle: string; sections: Section[] }> = {
  parent: {
    headline: "What is foster care \u2014 and what it isn't",
    subtitle: 'Before you dive in, here are a few things that are important to know.',
    sections: [
      {
        title: 'Foster care is temporary',
        body: 'The goal of the system is reunification whenever it\'s safe. Most parents get about one year of services if they keep making progress. If your child is under 3, you may get only 6 months. The court sets regular hearings to track progress and check in on your case plan.',
      },
      {
        title: 'Having your child removed is not the end',
        body: 'Parents who stay engaged — attending hearings, completing services, and staying in contact with their social worker — have the best outcomes. Showing up consistently is one of the most powerful things you can do.',
      },
      {
        title: 'You still have rights',
        body: 'You have the right to a lawyer even if you cannot pay, to ask for visits with your child (the judge sets them and can limit them if they are not safe), to receive a copy of your case plan, and to speak at every court hearing. Your lawyer can explain each one.',
      },
      {
        title: 'The system has a lot of moving parts',
        body: 'You\'ll work with a social worker, an attorney, and a judge. There may also be a CASA volunteer or parent partner involved. Each person has a different role — your attorney works for you.',
      },
      {
        title: 'Resources exist to help you',
        body: 'Your case plan may include parenting classes, counseling and treatment. Ask your social worker which ones are free. Completing these services is one of the most important steps in your case plan.',
      },
      {
        title: 'Things to remember',
        body: 'Write everything down. Keep copies of every document. Ask questions if you don\'t understand something. You are allowed to advocate for yourself — and Anchor is here to help you do that.',
      },
    ],
  },
  youth: {
    headline: 'What foster care means for you',
    subtitle: 'Being in foster care can feel overwhelming. Here\'s what you should know.',
    sections: [
      {
        title: 'Being in care doesn\'t mean your family doesn\'t love you',
        body: 'Most youth in care have parents who are working to bring them home. The system got involved because of safety concerns — not because anyone stopped loving you.',
      },
      {
        title: 'You have rights',
        body: 'You have the right to know what\'s happening in your case, to have a say in decisions that affect you, to be treated with respect, and to have your own attorney.',
      },
      {
        title: 'You are not alone',
        body: 'There are people — attorneys, advocates, CASA volunteers, and social workers — whose job is to look out for you. You can ask questions and speak up at any point in your case.',
      },
      {
        title: 'Court hearings happen regularly',
        body: 'There will be hearings about every six months where a judge reviews your case. You are allowed to attend and to speak. Your voice matters in that room.',
      },
      {
        title: 'Education rights are protected',
        body: 'No matter where you\'re placed, you have the right to stay in your school if possible, receive help catching up if you fall behind, and access support services. School stability is taken seriously.',
      },
      {
        title: 'Things to remember',
        body: 'You can always ask your attorney questions — they work for you, not the agency. If something feels wrong about your placement or your care, speak up. Anchor is here to help you understand what\'s happening.',
      },
    ],
  },
  supporter: {
    headline: 'What your person is going through',
    subtitle: 'Understanding the process will help you show up in the right way.',
    sections: [
      {
        title: 'This is one of the hardest things a family can go through',
        body: 'Foster care involvement is deeply stressful and often traumatic. Your presence — even just showing up — matters more than you may realize. You don\'t need to fix anything to be helpful.',
      },
      {
        title: 'The process is complex and can feel overwhelming',
        body: 'Court dates, case plans, legal terms, and agency visits can pile up fast. Your person may feel confused or powerless. Helping them track what\'s happening is one of the most practical things you can do.',
      },
      {
        title: 'You don\'t need to have all the answers',
        body: 'Listening without judgment, helping with rides, childcare, or paperwork, and just being a calm presence are among the most valuable forms of support. You don\'t need to be an expert.',
      },
      {
        title: 'Timelines vary, but things do move',
        body: 'Cases typically involve hearings about every six months, with a major decision point around 12–18 months. Progress depends heavily on engagement with the case plan. Your encouragement can make a real difference.',
      },
      {
        title: 'Resources are available',
        body: 'There are parenting classes, counseling and other help. Ask the social worker or the lawyer which ones are free. You can help by learning what\'s out there and sharing it — or by helping your person access it.',
      },
      {
        title: 'Things to remember',
        body: 'Don\'t speak for your person — speak with them. Let them lead. Ask what they need rather than assuming. Anchor is here to help both of you understand what\'s happening and what\'s next.',
      },
    ],
  },
}

export function FosterCareIntro() {
  const navigate = useNavigate()
  const { user, profile, updateProfile } = useAuth()
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0)
  const [saving, setSaving] = useState(false)

  const role = profile?.role || 'parent'
  const content = CONTENT[role] || CONTENT.parent

  useEffect(() => {
    // If they've already seen this, skip straight to dashboard
    if (profile?.onboarding_foster_care_seen) {
      navigate('/dashboard', { replace: true })
    }
  }, [profile])

  const markSeenAndContinue = async () => {
    haptics.light()
    setSaving(true)
    try {
      if (user) {
        await updateProfile({ onboarding_foster_care_seen: true })
      }
    } catch (e) {
      console.error('Error marking foster care intro seen:', e)
    } finally {
      setSaving(false)
      navigate('/dashboard', { replace: true })
    }
  }

  const roleColors: Record<string, { accent: string; bg: string; dot: string }> = {
    parent:    { accent: '#705987', bg: '#E9E0EF', dot: '#705987' },
    youth:     { accent: '#3A5A80', bg: '#EAF0F8', dot: '#3A5A80' },
    supporter: { accent: '#4A7C59', bg: '#EAF4EE', dot: '#4A7C59' },
  }
  const colors = roleColors[role] || roleColors.parent

  return (
    <div style={{ minHeight: '100vh', background: '#EDE6DB', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <div style={{
        background: '#FAF7F2',
        borderBottom: '1px solid rgba(112,89,135,0.12)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <img
          src="/anchor-mark.png"
          alt="Anchor"
          style={{ width: 48, height: 48, objectFit: 'contain' }}
        />
        <button
          onClick={markSeenAndContinue}
          style={{
            background: 'none', border: 'none',
            fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 600,
            color: '#62566B', cursor: 'pointer', padding: '8px 4px',
          }}
        >
          Skip
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, maxWidth: 480, margin: '0 auto', width: '100%', padding: '28px 20px 32px', overflowY: 'auto' }}>

        {/* Role badge */}
        <div style={{ marginBottom: 16 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: colors.bg, color: colors.accent,
            borderRadius: 20, padding: '4px 12px',
            fontFamily: 'DM Sans, sans-serif', fontSize: 12, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '0.05em',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.dot }} />
            {role === 'parent' ? 'For Parents' : role === 'youth' ? 'For Youth' : 'For Supporters'}
          </span>
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontSize: 28, fontWeight: 700,
          color: '#291F32', margin: '0 0 10px', lineHeight: 1.2,
        }}>
          {content.headline}
        </h1>
        <p style={{
          fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#5A5065',
          margin: '0 0 28px', lineHeight: 1.6,
        }}>
          {content.subtitle}
        </p>

        {/* Accordion sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {content.sections.map((section, i) => {
            const isOpen = expandedIndex === i
            return (
              <div
                key={i}
                style={{
                  background: '#FAF7F2',
                  border: `1px solid ${isOpen ? colors.dot + '40' : 'rgba(112,89,135,0.12)'}`,
                  borderRadius: 20,
                  overflow: 'hidden',
                  transition: 'border-color 0.15s',
                }}
              >
                <button
                  onClick={() => { haptics.light(); setExpandedIndex(isOpen ? null : i) }}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: '14px 16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                      background: isOpen ? colors.bg : '#F0EAE0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'Fraunces, serif', fontSize: 14, fontWeight: 700,
                      color: isOpen ? colors.accent : '#9A90A8',
                    }}>
                      {i + 1}
                    </div>
                    <span style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 700,
                      color: isOpen ? '#291F32' : '#5A5065',
                    }}>
                      {section.title}
                    </span>
                  </div>
                  {isOpen
                    ? <ChevronUp size={16} color="#9A90A8" style={{ flexShrink: 0 }} />
                    : <ChevronDown size={16} color="#9A90A8" style={{ flexShrink: 0 }} />
                  }
                </button>

                {isOpen && (
                  <div style={{ padding: '0 16px 16px 54px' }}>
                    <p style={{
                      fontFamily: 'DM Sans, sans-serif', fontSize: 15, color: '#5A5065',
                      margin: 0, lineHeight: 1.7,
                    }}>
                      {section.body}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer CTA */}
      <div style={{
        background: '#FAF7F2',
        borderTop: '1px solid rgba(112,89,135,0.12)',
        padding: '16px 20px env(safe-area-inset-bottom, 24px)',
        maxWidth: 480, margin: '0 auto', width: '100%', boxSizing: 'border-box',
      }}>
        <button
          onClick={markSeenAndContinue}
          disabled={saving}
          className="abtn abtn-primary abtn-block" style={{ width: '100%' }}
        >
          {saving ? 'Loading…' : "I'm ready — take me to Anchor"}
          {!saving && <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  )
}
