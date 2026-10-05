import { useEffect, useRef, useState } from 'react'
import { ArrowRight, ShieldCheck, X } from 'lucide-react'

export default function RegistrationModal({ open, onClose, onSubmit, busy, profile, project }) {
  const [form, setForm] = useState({ full_name: '', email: '', whatsapp: '', college: '' })
  const [error, setError] = useState('')
  const first = useRef(null)

  useEffect(() => {
    if (open) setTimeout(() => first.current?.focus(), 20)
  }, [open])

  if (!open) return null

  async function submit(e) {
    e.preventDefault()
    setError('')
    if (!form.full_name.trim() || !form.email.includes('@') || form.whatsapp.trim().length < 8 || !form.college.trim()) {
      setError('Please complete all fields with valid information.')
      return
    }
    try { await onSubmit(form) } catch (err) { setError(err.message || 'Registration failed. Please try again.') }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="registration-title">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close registration"><X /></button>
        <span className="eyebrow">YOUR PROJECT IS READY</span>
        <h2 id="registration-title">Build {project?.project_title || 'your project'} with us.</h2>
        <p className="muted">Reserve your seat for the free 60-minute build session. Your quiz profile is already carried forward.</p>
        <div className="profile-strip">
          <span>{profile?.year_of_study ? `${profile.year_of_study}${profile.year_of_study === 1 ? 'st' : profile.year_of_study === 2 ? 'nd' : profile.year_of_study === 3 ? 'rd' : 'th'} Year` : ''}</span>
          <span>{profile?.branch}</span>
        </div>
        <form onSubmit={submit} className="registration-form">
          <label>Full name<input ref={first} value={form.full_name} onChange={e => setForm(v => ({ ...v, full_name: e.target.value }))} maxLength={80} required /></label>
          <label>Email<input type="email" value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} maxLength={120} required /></label>
          <label>WhatsApp number<input inputMode="tel" value={form.whatsapp} onChange={e => setForm(v => ({ ...v, whatsapp: e.target.value }))} maxLength={20} required /></label>
          <label>College<input value={form.college} onChange={e => setForm(v => ({ ...v, college: e.target.value }))} maxLength={120} required /></label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="btn btn-primary btn-block" disabled={busy}>
            {busy ? 'Reserving…' : <>Reserve My Seat <ArrowRight size={17} /></>}
          </button>
        </form>
        <div className="trust-note"><ShieldCheck size={16} /> We only collect what is needed for workshop registration.</div>
      </section>
    </div>
  )
}
