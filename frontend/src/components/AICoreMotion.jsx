import { useEffect, useRef } from 'react'
import { Bot, Braces, Cpu, Sparkles } from 'lucide-react'

export default function AICoreMotion() {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let raf = 0
    const onMove = (e) => {
      const r = node.getBoundingClientRect()
      const px = (e.clientX - r.left) / r.width - 0.5
      const py = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        node.style.setProperty('--mx', `${px * 18}px`)
        node.style.setProperty('--my', `${py * 14}px`)
      })
    }
    const onLeave = () => {
      node.style.setProperty('--mx', '0px')
      node.style.setProperty('--my', '0px')
    }
    node.addEventListener('pointermove', onMove)
    node.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      node.removeEventListener('pointermove', onMove)
      node.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="ai-core" ref={ref} aria-label="Animated AI project matching visualization">
      <div className="ai-grid" aria-hidden="true" />
      <div className="ai-beam beam-a" aria-hidden="true" />
      <div className="ai-beam beam-b" aria-hidden="true" />
      <div className="orbit orbit-1" aria-hidden="true"><span /></div>
      <div className="orbit orbit-2" aria-hidden="true"><span /></div>
      <div className="orbit orbit-3" aria-hidden="true"><span /></div>

      <div className="core-shell">
        <div className="core-pulse" />
        <div className="core-icon"><Bot size={34} /></div>
        <strong>AI PROJECT<br/>MATCH</strong>
        <small>profile → project</small>
      </div>

      <div className="float-node node-branch"><Cpu size={15}/><span>IT</span></div>
      <div className="float-node node-skill"><Braces size={15}/><span>Advanced</span></div>
      <div className="float-node node-goal"><Sparkles size={15}/><span>Portfolio</span></div>

      <svg className="signal-lines" viewBox="0 0 520 520" aria-hidden="true">
        <defs>
          <linearGradient id="signal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#39d6e8" stopOpacity="0"/>
            <stop offset=".5" stopColor="#39d6e8" stopOpacity=".8"/>
            <stop offset="1" stopColor="#806bff" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M70 125 C155 132 165 245 248 256" />
        <path d="M452 150 C355 160 348 236 274 252" />
        <path d="M108 392 C164 335 201 304 252 274" />
      </svg>

      <div className="ai-caption"><span className="live-dot"/> Matching your profile in real time</div>
    </div>
  )
}
