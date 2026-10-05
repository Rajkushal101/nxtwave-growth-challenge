import { Sparkles } from 'lucide-react'

export default function Brand({ compact = false }) {
  return (
    <div className="brand" aria-label="NxtWave AI Project Matcher">
      <span className="brand-mark"><Sparkles size={compact ? 15 : 18} /></span>
      <span className="brand-name">NxtWave</span>
      {!compact && <span className="brand-product">Project Matcher</span>}
    </div>
  )
}
