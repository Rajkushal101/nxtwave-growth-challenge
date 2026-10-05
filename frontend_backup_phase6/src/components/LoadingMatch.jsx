import { Check, LoaderCircle } from 'lucide-react'

export default function LoadingMatch() {
  return (
    <section className="loading-panel" aria-live="polite">
      <div className="ai-orbit"><LoaderCircle size={34} /></div>
      <h2>Finding your strongest project match…</h2>
      <div className="loading-steps">
        <span><Check size={16} /> Reading your profile</span>
        <span><Check size={16} /> Scoring project fit</span>
        <span className="loading-current"><LoaderCircle size={16} /> Personalizing your result</span>
      </div>
    </section>
  )
}
