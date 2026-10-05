import { useEffect, useState } from 'react'
import { api } from './api/client'
import { useReferral } from './hooks/useReferral'
import NavBar from './components/NavBar'
import LoadingMatch from './components/LoadingMatch'
import RegistrationModal from './components/RegistrationModal'
import Landing from './views/Landing'
import Quiz from './views/Quiz'
import ProjectResult from './views/ProjectResult'
import RegistrationSuccess from './views/RegistrationSuccess'
import GrowthHub from './views/GrowthHub'
import Dashboard from './views/Dashboard'

export default function App() {
  const referralCode = useReferral()
  const [view, setView] = useState('landing')
  const [apiOnline, setApiOnline] = useState(false)
  const [profile, setProfile] = useState(null)
  const [project, setProject] = useState(null)
  const [registration, setRegistration] = useState(null)
  const [loading, setLoading] = useState(false)
  const [switching, setSwitching] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)
  const [registerBusy, setRegisterBusy] = useState(false)
  const [fatal, setFatal] = useState('')

  useEffect(() => { api.health().then(() => setApiOnline(true)).catch(() => setApiOnline(false)) }, [])

  async function completeQuiz(finalProfile) {
    // IMPORTANT: finalProfile is the exact object built by Quiz. We do not merge
    // with demo/default answers, which avoids the stale-profile bug found in testing.
    setProfile(finalProfile)
    setFatal('')
    setLoading(true)
    setView('loading')
    try {
      const payload = { session_id: crypto.randomUUID?.() || `web_${Date.now()}`, ...finalProfile }
      if (import.meta.env.DEV) console.debug('[QUIZ FINAL PROFILE]', payload)
      const recommendation = await api.recommend(payload)
      setProject(recommendation)
      setView('result')
    } catch (err) {
      setFatal(err.message || 'Could not generate a recommendation.')
      setView('quiz')
    } finally { setLoading(false) }
  }

  async function anotherProject() {
    if (!project || !profile) return
    setSwitching(true)
    try {
      const next = await api.switchRecommendation({
        user_id: project.user_id,
        current_project_id: project.project_id,
        recommendation_id: project.id,
        profile,
      })
      setProject(next)
    } catch (err) { setFatal(err.message) }
    finally { setSwitching(false) }
  }

  async function submitRegistration(form) {
    setRegisterBusy(true)
    try {
      const result = await api.register({ profile, recommendation: project, form, referralCode })
      setRegistration(result)
      setRegisterOpen(false)
      setView('success')
    } finally { setRegisterBusy(false) }
  }

  function navigate(next) {
    if (next === 'hub' && !registration) { setView('hub'); return }
    setView(next)
  }

  return (
    <div className="app-shell">
      {view !== 'dashboard' && <NavBar view={view} onNavigate={navigate} apiOnline={apiOnline}/>} 
      {fatal && <div className="global-error shell" role="alert">{fatal}<button onClick={() => setFatal('')}>Dismiss</button></div>}
      {view === 'landing' && <Landing referral={referralCode} onStart={() => setView('quiz')}/>} 
      {view === 'quiz' && <Quiz onComplete={completeQuiz}/>} 
      {view === 'loading' && <div className="shell loading-wrap"><LoadingMatch /></div>}
      {view === 'result' && <ProjectResult project={project} onRegister={() => setRegisterOpen(true)} onAnother={anotherProject} switching={switching}/>} 
      {view === 'success' && <RegistrationSuccess registration={registration} project={project} onHub={() => setView('hub')}/>} 
      {view === 'hub' && <GrowthHub registration={registration} project={project}/>} 
      {view === 'dashboard' && <Dashboard/>}
      <RegistrationModal open={registerOpen} onClose={() => !registerBusy && setRegisterOpen(false)} onSubmit={submitRegistration} busy={registerBusy} profile={profile} project={project}/>
    </div>
  )
}
