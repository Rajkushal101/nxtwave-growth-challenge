import { ArrowRight, BarChart3, Bot, Check, Clock3, Network, Sparkles, Target, Users } from 'lucide-react'
import Tag from '../components/Tag'
import AICoreMotion from '../components/AICoreMotion'

export default function Landing({ onStart, referral }) {
  return (
    <main>
      {referral && (
        <div className="referral-banner shell">
          <Network size={17} />
          <span><strong>Campus Squad Invitation</strong> — a friend invited you to discover your AI project.</span>
          <Tag tone="violet">REF {referral}</Tag>
        </div>
      )}

      <section className="hero shell">
        <div className="hero-copy">
          <Tag>FREE • 60-MINUTE AI WORKSHOP</Tag>
          <h1>Don’t just learn AI.<br/><span>Build the right project.</span></h1>
          <p className="hero-lede">Answer 5 quick questions. Get a project matched to your year, branch, skill level and goal — then build it with NxtWave.</p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" onClick={onStart}>Find My AI Project <ArrowRight size={18} /></button>
            <a className="btn btn-secondary btn-lg" href="#how">See how it works</a>
          </div>
          <div className="trust-row">
            <span><Check size={15}/> 1st–4th year</span><span><Clock3 size={15}/> ~2 minutes</span><span><Sparkles size={15}/> Personalized</span><span><Users size={15}/> Referral-ready</span>
          </div>
        </div>

        <div className="hero-visual-stack">
          <AICoreMotion />
          <div className="dna-card dna-card-floating">
            <div className="card-topline"><Tag>EXAMPLE PROJECT DNA</Tag><Tag tone="green">92% MATCH</Tag></div>
            <h2>AI Phishing & Malicious URL Detector</h2>
            <p className="muted">3rd Year • IT • Advanced • Portfolio</p>
            <div className="score-list">
              {[['Interest match',92],['Skill fit',82],['Portfolio value',96],['60-min feasibility',90]].map(([label,value], i) => (
                <div className="score-row" key={label}>
                  <span>{label}</span><div className="score-track"><i style={{ '--score': `${value}%` }} className={`score-${i}`} /></div><strong>{value}%</strong>
                </div>
              ))}
            </div>
            <div className="chip-row"><Tag tone="soft">Python</Tag><Tag tone="soft">Gemini API</Tag><Tag tone="soft">Pandas</Tag></div>
          </div>
        </div>
      </section>

      <section id="how" className="value-grid shell">
        <article><Target/><strong>Personalized</strong><p>Not a random project list. The match reflects the student profile.</p></article>
        <article><Clock3/><strong>Buildable</strong><p>Recommendations are chosen to fit a focused 60-minute build session.</p></article>
        <article><Network/><strong>Shareable</strong><p>The project itself becomes the social object for referrals.</p></article>
        <article><BarChart3/><strong>Measurable</strong><p>Quiz, conversion and referral behavior can be tracked end-to-end.</p></article>
      </section>
    </main>
  )
}
