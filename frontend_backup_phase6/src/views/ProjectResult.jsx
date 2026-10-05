import { ArrowRight, BrainCircuit, Clock3, RefreshCw, ShieldCheck, Sparkles, Trophy } from 'lucide-react'
import Tag from '../components/Tag'

function stars(n = 3) { return '★★★★★'.slice(0,n) + '☆☆☆☆☆'.slice(0,5-n) }

export default function ProjectResult({ project, onRegister, onAnother, switching }) {
  const title = project?.project_title || project?.name || 'Your AI Project'
  const tech = project?.tech_stack || project?.technologies || []
  const learning = project?.learning_outcomes || []
  return (
    <main className="result-layout shell">
      <section className="result-card">
        <div className="card-topline"><Tag>YOUR BEST MATCH</Tag><Tag tone="green">{project?.match_score ? `${Math.round(project.match_score)}% FIT` : 'PERSONALIZED'}</Tag></div>
        <div className="result-symbol"><BrainCircuit /></div>
        <h1>{title}</h1>
        <p className="result-hook">{project?.summary_hook || project?.why_this_matches_you}</p>
        <div className="result-stats">
          <div><Clock3/><strong>{project?.estimated_minutes || 60} min</strong><span>Build time</span></div>
          <div><Sparkles/><strong>{project?.difficulty || 'Intermediate'}</strong><span>{stars(project?.difficulty_stars || 3)}</span></div>
          <div><Trophy/><strong>{project?.portfolio_value || 'High'}</strong><span>Portfolio value</span></div>
        </div>
        <div className="result-section"><h3>What you’ll build</h3><p>{project?.what_you_will_build || project?.description}</p></div>
        <div className="result-section"><h3>Why this matches you</h3><p>{project?.why_this_matches_you}</p></div>
        {!!learning.length && <div className="result-section"><h3>What you’ll learn</h3><div className="learning-grid">{learning.slice(0,4).map(x => <span key={x}><ShieldCheck size={15}/>{x}</span>)}</div></div>}
        <div className="result-section"><h3>Tech stack</h3><div className="chip-row">{tech.map(x => <Tag tone="soft" key={x}>{x}</Tag>)}</div></div>
        <div className="result-actions"><button className="btn btn-primary btn-lg" onClick={onRegister}>Build My Project <ArrowRight size={18}/></button><button className="btn btn-secondary btn-lg" onClick={onAnother} disabled={switching}><RefreshCw size={17}/>{switching ? 'Finding…' : 'Try Another Project'}</button></div>
      </section>
      <aside className="workshop-card">
        <Tag tone="violet">FREE WORKSHOP</Tag>
        <h2>Build it with us<br/>in 60 minutes.</h2>
        <p>You already know what to build. The workshop becomes the next step — not the first pitch.</p>
        <div className="workshop-benefits"><div><strong>Live build</strong><span>Follow along, not just watch.</span></div><div><strong>Beginner-safe</strong><span>Fallback paths if you get stuck.</span></div><div><strong>Shareable output</strong><span>Leave with something worth showing.</span></div></div>
        <button className="btn btn-violet btn-block" onClick={onRegister}>Reserve My Seat</button>
      </aside>
    </main>
  )
}
