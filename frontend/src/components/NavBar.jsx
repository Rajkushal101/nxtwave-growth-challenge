import { BarChart3, Network, WandSparkles } from 'lucide-react'
import Brand from './Brand'

export default function NavBar({ view, onNavigate, apiOnline }) {
  return (
    <header className="topbar">
      <Brand />
      <nav className="topnav" aria-label="Main navigation">
        <button className={view === 'landing' || view === 'quiz' || view === 'result' ? 'active' : ''} onClick={() => onNavigate('landing')}>
          <WandSparkles size={16} /> Project Matcher
        </button>
        <button className={view === 'hub' ? 'active' : ''} onClick={() => onNavigate('hub')}>
          <Network size={16} /> Growth Hub
        </button>
        <button className={view === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
          <BarChart3 size={16} /> Dashboard
        </button>
      </nav>
      <div className="api-status" title={apiOnline ? 'Backend connected' : 'Backend unavailable'}>
        <span className={apiOnline ? 'status-dot online' : 'status-dot'} />
        {apiOnline ? 'API Connected' : 'API Offline'}
      </div>
    </header>
  )
}
