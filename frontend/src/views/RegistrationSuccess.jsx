import { ArrowRight, CheckCircle2, Copy, Network, Sparkles } from 'lucide-react'
import Tag from '../components/Tag'

export default function RegistrationSuccess({ registration, project, onHub }) {
  const code = registration?.referral_code || registration?.code || '—'
  return (
    <main className="success-wrap shell">
      <section className="success-card">
        <div className="success-icon"><CheckCircle2 /></div>
        <Tag tone="green">YOU’RE IN</Tag>
        <h1>Your project now has a build plan.</h1>
        <p className="muted">Registration confirmed in the app. Bring your project idea — we’ll build it together.</p>
        <div className="success-project"><Sparkles/><div><span>Your project</span><strong>{project?.project_title}</strong></div></div>
        <div className="referral-code-box"><div><span>Your squad code</span><strong>{code}</strong></div><button className="icon-button" onClick={() => navigator.clipboard?.writeText(code)} aria-label="Copy referral code"><Copy/></button></div>
        <button className="btn btn-primary btn-lg btn-block" onClick={onHub}><Network size={18}/> Open My Growth Hub <ArrowRight size={18}/></button>
      </section>
    </main>
  )
}
