import { BarChart3, Beaker, CircleDollarSign, Filter, Network, Target, TrendingUp, Users } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import Tag from '../components/Tag'

const empty = { overview: null, funnel: [], sources: [], referrals: null, experiments: [] }

export default function Dashboard() {
  const [simulation, setSimulation] = useState(true)
  const [data, setData] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    Promise.allSettled([
      api.analyticsOverview(simulation), api.analyticsFunnel(simulation), api.analyticsSources(simulation), api.analyticsReferrals(simulation), api.analyticsExperiments(simulation),
    ]).then(results => {
      if (!active) return
      const [overview, funnel, sources, referrals, experiments] = results.map(r => r.status === 'fulfilled' ? r.value : null)
      setData({
        overview,
        funnel: normalizeArray(funnel, ['stages','funnel','items']),
        sources: normalizeArray(sources, ['sources','channels','items']),
        referrals,
        experiments: normalizeArray(experiments, ['experiments','items']),
      })
      if (results.every(r => r.status === 'rejected')) setError('Analytics endpoints are not reachable from this frontend configuration.')
      setLoading(false)
    })
    return () => { active = false }
  }, [simulation])

  const ov = data.overview || {}
  const visitors = ov.visitors ?? ov.total_visitors ?? 0
  const registrations = ov.registrations ?? ov.total_registrations ?? 0
  const registrationRate = ov.registration_conversion ?? ov.registration_conversion_rate ?? (visitors ? registrations / visitors * 100 : 0)
  const referred = data.referrals?.referred_registrations ?? data.referrals?.converted ?? 0
  const target = ov.target_registrations ?? 500
  const targetPct = target ? Math.min(100, registrations / target * 100) : 0

  const biggestDrop = useMemo(() => {
    let max = null
    for (let i = 1; i < data.funnel.length; i++) {
      const prev = valueOf(data.funnel[i-1]), cur = valueOf(data.funnel[i])
      const drop = prev ? (prev-cur)/prev*100 : 0
      if (!max || drop > max.drop) max = { from: labelOf(data.funnel[i-1]), to: labelOf(data.funnel[i]), drop }
    }
    return max
  }, [data.funnel])

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar"><div className="dash-brand"><BarChart3/><strong>Growth OS</strong></div>{['Overview','Funnel','Acquisition','Segments','Referrals','Experiments'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}</aside>
      <section className="dashboard-main">
        <header className="dash-head"><div><h1>Growth Dashboard</h1><p>Data → learning → decision.</p></div><div className="dash-controls"><button className="btn btn-secondary"><Filter/> Last 7 days</button><button className={`mode-toggle ${simulation?'sim':''}`} onClick={() => setSimulation(v => !v)}>{simulation ? 'SIMULATED DEMO DATA' : 'LIVE DATA'}</button></div></header>
        {loading ? <div className="dash-loading">Loading growth data…</div> : error ? <div className="dash-error">{error}</div> : <>
          <div className="kpi-grid"><Kpi icon={Users} label="Visitors" value={fmt(visitors)} note="Top of funnel"/><Kpi icon={Target} label="Registrations" value={fmt(registrations)} note={`${targetPct.toFixed(1)}% of ${fmt(target)} target`} tone="green"/><Kpi icon={TrendingUp} label="Registration conversion" value={`${Number(registrationRate||0).toFixed(1)}%`} note="Visitor → registration" tone="violet"/><Kpi icon={Network} label="Referred registrations" value={fmt(referred)} note="Referral contribution" tone="amber"/></div>
          <div className="target-card"><div><span className="eyebrow">500-REGISTRATION TARGET</span><h2>{fmt(registrations)} / {fmt(target)}</h2></div><div className="target-track"><i style={{width:`${targetPct}%`}}/></div><strong>{Math.max(0,target-registrations)} remaining</strong></div>
          <div className="dash-grid two"><section className="dash-card"><div className="dash-card-title"><div><h2>Where students drop</h2><p>{biggestDrop ? `Biggest drop: ${biggestDrop.from} → ${biggestDrop.to} (${biggestDrop.drop.toFixed(0)}%)` : 'Funnel stages'}</p></div><TrendingUp/></div><div className="funnel-bars">{data.funnel.map((item,i)=><FunnelRow key={i} item={item} max={Math.max(...data.funnel.map(valueOf),1)}/>)}</div></section><section className="dash-card"><div className="dash-card-title"><div><h2>Acquisition efficiency</h2><p>Single first-touch source attribution</p></div><CircleDollarSign/></div><div className="source-list">{data.sources.slice(0,8).map((s,i)=><SourceRow source={s} key={i}/>)}</div></section></div>
          <div className="dash-grid two"><section className="dash-card"><div className="dash-card-title"><div><h2>Referral performance</h2><p>Participation is different from code generation.</p></div><Network/></div><div className="metric-mini-grid"><Mini label="Participants" value={data.referrals?.participants ?? data.referrals?.referral_participants ?? '—'}/><Mini label="Clicks" value={data.referrals?.clicks ?? data.referrals?.referral_clicks ?? '—'}/><Mini label="Referred registrations" value={referred || '—'}/><Mini label="Viral coefficient" value={data.referrals?.viral_coefficient ?? 'Insufficient data'}/></div></section><section className="dash-card"><div className="dash-card-title"><div><h2>Experiment signal</h2><p>Directional learning, not fake certainty.</p></div><Beaker/></div>{data.experiments.length ? data.experiments.slice(0,1).map((e,i)=><div className="experiment" key={i}><Tag tone="violet">EARLY DIRECTIONAL SIGNAL</Tag><h3>{e.name || e.experiment_name || 'CTA experiment'}</h3><p>{e.hypothesis || 'Project-focused CTA may reduce registration friction.'}</p><div className="experiment-variants"><span>{e.control_name || 'Register Now'} <strong>{pct(e.control_rate ?? e.variant_a_rate)}</strong></span><span>{e.variant_name || 'Build My Project'} <strong>{pct(e.variant_rate ?? e.variant_b_rate)}</strong></span></div></div>) : <p className="muted">No experiment data returned.</p>}</section></div>
        </>}
      </section>
    </main>
  )
}

function normalizeArray(data, keys) { if (Array.isArray(data)) return data; for (const k of keys) if (Array.isArray(data?.[k])) return data[k]; return [] }
function valueOf(x) { return Number(x?.count ?? x?.value ?? x?.visitors ?? x?.registrations ?? 0) }
function labelOf(x) { return x?.stage ?? x?.name ?? x?.label ?? 'Stage' }
function fmt(x) { return Number(x || 0).toLocaleString('en-IN') }
function pct(x) { const n = Number(x || 0); return `${(n <= 1 ? n*100 : n).toFixed(1)}%` }
function Kpi({icon:Icon,label,value,note,tone='cyan'}) { return <article className={`kpi tone-${tone}`}><Icon/><span>{label}</span><strong>{value}</strong><small>{note}</small></article> }
function Mini({label,value}) { return <div><span>{label}</span><strong>{value}</strong></div> }
function FunnelRow({item,max}) { const v=valueOf(item); return <div className="funnel-row"><span>{labelOf(item)}</span><div><i style={{width:`${v/max*100}%`}}/></div><strong>{fmt(v)}</strong></div> }
function SourceRow({source}) { const name=source.source ?? source.name ?? source.channel ?? 'Source'; const v=source.visitors ?? source.count ?? 0; const r=source.registrations ?? 0; const rate=source.conversion_rate ?? (v ? r/v*100 : 0); return <div className="source-row"><div><strong>{name}</strong><small>{fmt(v)} visitors</small></div><span>{fmt(r)} regs</span><b>{Number(rate<=1?rate*100:rate).toFixed(1)}%</b></div> }
