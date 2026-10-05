import { Copy, Download, ExternalLink, Gift, Link2, MessageCircle, Share2, Users } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { toPng } from 'html-to-image'
import { useEffect, useMemo, useRef, useState } from 'react'
import { api } from '../api/client'
import Tag from '../components/Tag'

export default function GrowthHub({ registration, project }) {
  const code = registration?.referral_code || registration?.code || ''
  const origin = window.location.origin
  const shareUrl = code ? `${origin}/?ref=${encodeURIComponent(code)}` : origin
  const [stats, setStats] = useState(null)
  const [notice, setNotice] = useState('')
  const cardRef = useRef(null)

  useEffect(() => {
    if (!code) return
    api.referralStats(code).then(setStats).catch(() => {})
  }, [code])

  const friends = stats?.successful_referrals ?? stats?.friends_registered ?? stats?.converted ?? 0
  const clicks = stats?.clicks ?? stats?.link_visits ?? 0
  const rewards = friends >= 5 ? 3 : friends >= 3 ? 2 : friends >= 1 ? 1 : 0
  const next = useMemo(() => friends < 1 ? 1 : friends < 3 ? 3 : friends < 5 ? 5 : 5, [friends])

  function flash(msg) { setNotice(msg); setTimeout(() => setNotice(''), 1800) }
  async function copyLink() { await navigator.clipboard?.writeText(shareUrl); flash('Referral link copied') }
  function whatsapp() {
    const message = `I got my AI project 🎯 Mine is ${project?.project_title || 'an AI project'}. What AI project will you get? 👀\n\n${shareUrl}`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }
  async function generalShare() {
    const payload = { title: 'What AI Project Should You Build?', text: `I got ${project?.project_title || 'my AI project'}. What will you get?`, url: shareUrl }
    if (navigator.share) await navigator.share(payload)
    else await copyLink()
  }
  async function downloadCard() {
    if (!cardRef.current) return
    try {
      const data = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true })
      const a = document.createElement('a'); a.download = 'my-ai-project.png'; a.href = data; a.click()
      flash('Project card downloaded')
    } catch { flash('Could not download card') }
  }

  if (!code) return <main className="empty-state shell"><Users/><h2>Your Growth Hub appears after registration.</h2><p>Register first to receive your unique squad code and share card.</p></main>

  return (
    <main className="hub-page shell">
      {notice && <div className="toast">{notice}</div>}
      <div className="hub-title"><div><span className="eyebrow">YOUR GROWTH HUB</span><h1>Turn your project into a squad.</h1><p className="muted">Share something useful, not a generic workshop link.</p></div><Tag>CODE • {code}</Tag></div>
      <section className="metric-row"><article><Link2/><span>Link visits</span><strong>{clicks}</strong><small>Referral traffic</small></article><article><Users/><span>Friends registered</span><strong>{friends}</strong><small>{Math.max(0, next - friends)} away from next unlock</small></article><article><Gift/><span>Rewards unlocked</span><strong>{rewards} / 3</strong><small>Prototype rewards</small></article></section>
      <section className="hub-grid">
        <div className="project-share-card" ref={cardRef}>
          <div className="card-topline"><Tag>MY AI PROJECT</Tag><Tag tone="green">SQUAD READY</Tag></div>
          <div className="share-project-icon">AI</div>
          <h2>{project?.project_title || 'My AI Project'}</h2>
          <p>{project?.difficulty || 'Intermediate'} • ~{project?.estimated_minutes || 60} min build</p>
          <div className="qr-box"><QRCodeSVG value={shareUrl} size={156} bgColor="#ffffff" fgColor="#07111f" /></div>
          <h3>What AI project will YOU get?</h3>
          <small>Scan or use code {code}</small>
        </div>
        <div className="growth-actions-card">
          <span className="eyebrow">SHARE NATURALLY</span><h2>Your project is the invite.</h2><p className="muted">Friends enter the matcher, discover their own project, and only then see the workshop.</p>
          <div className="share-actions"><button className="btn btn-primary" onClick={whatsapp}><MessageCircle/> WhatsApp</button><button className="btn btn-secondary" onClick={copyLink}><Copy/> Copy Link</button><button className="btn btn-secondary" onClick={generalShare}><Share2/> Share</button><button className="btn btn-secondary" onClick={downloadCard}><Download/> Download Card</button></div>
          <div className="link-preview"><ExternalLink size={15}/><span>{shareUrl}</span></div>
          <div className="milestones"><Milestone count={1} title="AI Project Starter Blueprint" current={friends}/><Milestone count={3} title="Advanced AI Project Blueprint" current={friends}/><Milestone count={5} title="Project Showcase & Hackathon Pitch Pack" current={friends}/></div>
        </div>
      </section>
    </main>
  )
}

function Milestone({ count, title, current }) {
  const unlocked = current >= count
  return <div className={`milestone ${unlocked ? 'unlocked' : ''}`}><span className="milestone-dot">{unlocked ? '✓' : count}</span><div><small>{count} referral{count > 1 ? 's' : ''}</small><strong>{title}</strong></div></div>
}
