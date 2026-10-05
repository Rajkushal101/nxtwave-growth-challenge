import { BarChart3, Beaker, CircleDollarSign, Filter, Network, Target, TrendingUp, Users, PieChart, Layers, ArrowRight } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import Tag from '../components/Tag'

const empty = { overview: null, funnel: [], sources: [], referrals: null, segments: null, experiments: [] }

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('Overview')
  const [simulation, setSimulation] = useState(false)
  const [timeFilter, setTimeFilter] = useState('all') // '7d' or 'all'
  const [data, setData] = useState(empty)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    setLoading(true); setError('')
    Promise.allSettled([
      api.analyticsOverview(simulation),
      api.analyticsFunnel(simulation),
      api.analyticsSources(simulation),
      api.analyticsReferrals(simulation),
      api.analyticsSegments(simulation),
      api.analyticsExperiments(simulation),
    ]).then(results => {
      if (!active) return
      const [overview, funnel, sources, referrals, segments, experiments] = results.map(r => r.status === 'fulfilled' ? r.value : null)
      setData({
        overview,
        funnel: normalizeArray(funnel, ['stages', 'funnel', 'items']),
        funnelMeta: funnel?.drop_off_analysis,
        sources: normalizeArray(sources, ['sources', 'channels', 'items']),
        budget: sources?.budget_recommendation,
        referrals,
        segments,
        experiments: normalizeArray(experiments, ['experiments', 'items']),
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
    if (data.funnelMeta?.biggest_drop_off_stage) {
      return {
        stage: data.funnelMeta.biggest_drop_off_stage,
        drop: data.funnelMeta.drop_off_pct,
        observation: data.funnelMeta.observation,
        hypothesis: data.funnelMeta.action_hypothesis
      }
    }
    let max = null
    for (let i = 1; i < data.funnel.length; i++) {
      const prev = valueOf(data.funnel[i - 1]), cur = valueOf(data.funnel[i])
      const drop = prev ? (prev - cur) / prev * 100 : 0
      if (!max || drop > max.drop) max = { from: labelOf(data.funnel[i - 1]), to: labelOf(data.funnel[i]), drop }
    }
    return max
  }, [data.funnel, data.funnelMeta])

  const tabs = ['Overview', 'Funnel', 'Acquisition', 'Segments', 'Referrals', 'Experiments']

  return (
    <main className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dash-brand">
          <BarChart3 />
          <strong>Growth OS</strong>
        </div>
        {tabs.map(tab => (
          <button
            key={tab}
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </aside>

      <section className="dashboard-main">
        <header className="dash-head">
          <div>
            <h1>Growth Dashboard — {activeTab}</h1>
            <p>Data → learning → decision.</p>
          </div>
          <div className="dash-controls">
            <button
              className="btn btn-secondary"
              onClick={() => setTimeFilter(f => f === 'all' ? '7d' : 'all')}
            >
              <Filter /> {timeFilter === '7d' ? 'Last 7 days' : 'All Time'}
            </button>
            <button
              className={`mode-toggle ${simulation ? 'sim' : ''}`}
              onClick={() => setSimulation(v => !v)}
            >
              {simulation ? 'SIMULATED DEMO DATA' : 'LIVE DATA'}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="dash-loading">Loading growth data…</div>
        ) : error ? (
          <div className="dash-error">{error}</div>
        ) : (
          <>
            {/* Global KPI Strip shown across all views */}
            <div className="kpi-grid">
              <Kpi icon={Users} label="Visitors" value={fmt(visitors)} note="Top of funnel" />
              <Kpi icon={Target} label="Registrations" value={fmt(registrations)} note={`${targetPct.toFixed(1)}% of ${fmt(target)} target`} tone="green" />
              <Kpi icon={TrendingUp} label="Registration conversion" value={`${Number(registrationRate || 0).toFixed(1)}%`} note="Visitor → registration" tone="violet" />
              <Kpi icon={Network} label="Referred registrations" value={fmt(referred)} note="Referral contribution" tone="amber" />
            </div>

            <div className="target-card">
              <div>
                <span className="eyebrow">500-REGISTRATION TARGET</span>
                <h2>{fmt(registrations)} / {fmt(target)}</h2>
              </div>
              <div className="target-track"><i style={{ width: `${targetPct}%` }} /></div>
              <strong>{Math.max(0, target - registrations)} remaining</strong>
            </div>

            {/* TAB: OVERVIEW */}
            {activeTab === 'Overview' && (
              <>
                <div className="dash-grid two">
                  <section className="dash-card">
                    <div className="dash-card-title">
                      <div>
                        <h2>Where students drop</h2>
                        <p>{biggestDrop?.stage ? `Biggest drop: ${biggestDrop.stage} (${biggestDrop.drop}%)` : 'Funnel stages'}</p>
                      </div>
                      <TrendingUp />
                    </div>
                    <div className="funnel-bars">
                      {data.funnel.map((item, i) => (
                        <FunnelRow key={i} item={item} max={Math.max(...data.funnel.map(valueOf), 1)} />
                      ))}
                    </div>
                  </section>

                  <section className="dash-card">
                    <div className="dash-card-title">
                      <div>
                        <h2>Acquisition efficiency</h2>
                        <p>Single first-touch source attribution</p>
                      </div>
                      <CircleDollarSign />
                    </div>
                    <div className="source-list">
                      {data.sources.slice(0, 8).map((s, i) => (
                        <SourceRow source={s} key={i} />
                      ))}
                    </div>
                  </section>
                </div>

                <div className="dash-grid two">
                  <section className="dash-card">
                    <div className="dash-card-title">
                      <div>
                        <h2>Referral performance</h2>
                        <p>Participation is different from code generation.</p>
                      </div>
                      <Network />
                    </div>
                    <div className="metric-mini-grid">
                      <Mini label="Participants" value={data.referrals?.students_who_referred ?? data.referrals?.referral_participants ?? '—'} />
                      <Mini label="Clicks" value={data.referrals?.total_referral_clicks ?? data.referrals?.clicks ?? '—'} />
                      <Mini label="Referred registrations" value={referred || '—'} />
                      <Mini label="Viral coefficient" value={data.referrals?.viral_coefficient ?? 'Insufficient data'} />
                    </div>
                  </section>

                  <section className="dash-card">
                    <div className="dash-card-title">
                      <div>
                        <h2>Experiment signal</h2>
                        <p>Directional learning, not fake certainty.</p>
                      </div>
                      <Beaker />
                    </div>
                    {data.experiments.length ? data.experiments.slice(0, 1).map((e, i) => (
                      <div className="experiment" key={i}>
                        <Tag tone="violet">EARLY DIRECTIONAL SIGNAL</Tag>
                        <h3>{e.name || e.experiment_name || 'CTA experiment'}</h3>
                        <p>{e.hypothesis || 'Project-focused CTA may reduce registration friction.'}</p>
                        <div className="experiment-variants">
                          {e.variants?.map(v => (
                            <span key={v.variant_id}>
                              {v.name || v.label} <strong>{pct(v.conversion_rate)}</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    )) : <p className="muted">No experiment data returned.</p>}
                  </section>
                </div>
              </>
            )}

            {/* TAB: FUNNEL */}
            {activeTab === 'Funnel' && (
              <section className="dash-card" style={{ marginTop: '1rem' }}>
                <div className="dash-card-title">
                  <div>
                    <h2>Canonical 9-Stage Growth Funnel</h2>
                    <p>Granular student progression from initial visitor to confirmed referral</p>
                  </div>
                  <TrendingUp />
                </div>
                <div className="funnel-bars" style={{ marginTop: '1.5rem' }}>
                  {data.funnel.map((item, i) => (
                    <div key={i} style={{ marginBottom: '1rem' }}>
                      <FunnelRow item={item} max={Math.max(...data.funnel.map(valueOf), 1)} />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--muted)', marginTop: '0.2rem', paddingLeft: '140px' }}>
                        <span>From previous: {item.conversion_from_previous ?? 0}%</span>
                        <span>Drop-off: {item.drop_off_pct ?? 0}% ({item.drop_off_count ?? 0} students)</span>
                      </div>
                    </div>
                  ))}
                </div>
                {biggestDrop?.hypothesis && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(42,138,134,0.08)', borderRadius: '8px', borderLeft: '4px solid var(--cyan)' }}>
                    <strong>Bottleneck Finding:</strong> {biggestDrop.observation}
                    <div style={{ marginTop: '0.5rem', color: 'var(--muted)' }}>{biggestDrop.hypothesis}</div>
                  </div>
                )}
              </section>
            )}

            {/* TAB: ACQUISITION */}
            {activeTab === 'Acquisition' && (
              <section className="dash-card" style={{ marginTop: '1rem' }}>
                <div className="dash-card-title">
                  <div>
                    <h2>Acquisition Channels & ₹2,000 Budget Optimization</h2>
                    <p>First-touch UTM attribution analysis across organic, campus, and paid sources</p>
                  </div>
                  <CircleDollarSign />
                </div>
                <div className="source-list" style={{ marginTop: '1.5rem' }}>
                  {data.sources.map((s, i) => (
                    <SourceRow source={s} key={i} />
                  ))}
                </div>
                {data.budget && (
                  <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(240,191,107,0.12)', borderRadius: '8px', borderLeft: '4px solid var(--amber)' }}>
                    <strong>Recommended ₹2,000 Budget Allocation:</strong> {data.budget.recommendation || 'Focus spend on high-converting student communities & college ambassadors'}
                    <p style={{ marginTop: '0.3rem', fontSize: '0.9rem', color: 'var(--muted)' }}>
                      Channel: {data.budget.best_channel || 'College Clubs'} • Estimated Cost Per Acquisition: ₹{data.budget.estimated_cac || '35'}
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* TAB: SEGMENTS */}
            {activeTab === 'Segments' && (
              <div className="dash-grid two" style={{ marginTop: '1rem' }}>
                <section className="dash-card">
                  <div className="dash-card-title">
                    <div>
                      <h2>Academic Year Distribution</h2>
                      <p>Conversion rates segmented by student cohort</p>
                    </div>
                    <Layers />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    {data.segments?.years?.map(y => (
                      <div key={y.year} className="source-row" style={{ marginBottom: '0.8rem' }}>
                        <div>
                          <strong>{y.year_label}</strong>
                          <small>{y.visitors} visitors • Goal: {y.primary_goal}</small>
                        </div>
                        <span>{y.registrations} regs</span>
                        <b>{y.conversion_rate}%</b>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="dash-card">
                  <div className="dash-card-title">
                    <div>
                      <h2>Engineering Branch Breakdown</h2>
                      <p>Project generation and conversion across disciplines</p>
                    </div>
                    <PieChart />
                  </div>
                  <div style={{ marginTop: '1rem' }}>
                    {data.segments?.branches?.map(b => (
                      <div key={b.branch} className="source-row" style={{ marginBottom: '0.8rem' }}>
                        <div>
                          <strong>{b.branch}</strong>
                          <small>{b.project_generations} project matches</small>
                        </div>
                        <span>{b.registrations} regs</span>
                        <b>{b.conversion_rate}%</b>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* TAB: REFERRALS */}
            {activeTab === 'Referrals' && (
              <section className="dash-card" style={{ marginTop: '1rem' }}>
                <div className="dash-card-title">
                  <div>
                    <h2>Viral Growth & Referral Engine</h2>
                    <p>Participant progression, milestone reward claims, and campus leaderboard</p>
                  </div>
                  <Network />
                </div>
                <div className="metric-mini-grid" style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                  <Mini label="Total Registered Students" value={data.referrals?.total_registered_students ?? '—'} />
                  <Mini label="Referral Participants" value={data.referrals?.students_who_referred ?? '—'} />
                  <Mini label="Participation Rate" value={`${data.referrals?.referral_participation_rate ?? 0}%`} />
                  <Mini label="Referral Clicks" value={data.referrals?.total_referral_clicks ?? '—'} />
                  <Mini label="Referred Registrations" value={data.referrals?.referred_registrations ?? '—'} />
                  <Mini label="Referral Conversion Rate" value={`${data.referrals?.referral_conversion_rate ?? 0}%`} />
                </div>
                <h3>Campus Leaderboard (Safe Privacy Names)</h3>
                <div className="source-list" style={{ marginTop: '1rem' }}>
                  {data.referrals?.leaderboard?.slice(0, 8).map(entry => (
                    <div key={entry.rank} className="source-row">
                      <div>
                        <strong>#{entry.rank} {entry.student_name}</strong>
                        <small>Code: {entry.referral_code}</small>
                      </div>
                      <b>{entry.successful_referrals} friends joined</b>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* TAB: EXPERIMENTS */}
            {activeTab === 'Experiments' && (
              <section className="dash-card" style={{ marginTop: '1rem' }}>
                <div className="dash-card-title">
                  <div>
                    <h2>A/B Experiments & Statistical Evidence</h2>
                    <p>Hypothesis testing, exposure counts, and honest directional recommendations</p>
                  </div>
                  <Beaker />
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {data.experiments?.map(exp => (
                    <div key={exp.id} className="experiment" style={{ padding: '1.2rem', background: 'rgba(255,255,255,0.7)', borderRadius: '8px', border: '1px solid rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Tag tone="violet">{exp.status?.toUpperCase() || 'ACTIVE'}</Tag>
                        <small style={{ color: 'var(--muted)' }}>Metric: {exp.primary_metric}</small>
                      </div>
                      <h3 style={{ marginTop: '0.6rem' }}>{exp.name}</h3>
                      <p style={{ color: 'var(--muted)', margin: '0.4rem 0 1rem 0' }}>{exp.hypothesis}</p>
                      <div className="experiment-variants">
                        {exp.variants?.map(v => (
                          <span key={v.variant_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 1rem' }}>
                            <span><strong>{v.name || v.label}</strong>: {v.conversions}/{v.exposures} converted</span>
                            <strong style={{ color: 'var(--cyan)' }}>{v.conversion_rate}%</strong>
                          </span>
                        ))}
                      </div>
                      <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
                        <strong>Decision Recommendation:</strong> {exp.decision_recommendation}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </section>
    </main>
  )
}

function normalizeArray(data, keys) {
  if (Array.isArray(data)) return data
  for (const k of keys) if (Array.isArray(data?.[k])) return data[k]
  return []
}
function valueOf(x) { return Number(x?.count ?? x?.value ?? x?.visitors ?? x?.registrations ?? 0) }
function labelOf(x) { return x?.stage_name ?? x?.stage ?? x?.name ?? x?.label ?? 'Stage' }
function fmt(x) { return Number(x || 0).toLocaleString('en-IN') }
function pct(x) { const n = Number(x || 0); return `${(n <= 1 ? n * 100 : n).toFixed(1)}%` }
function Kpi({ icon: Icon, label, value, note, tone = 'cyan' }) {
  return <article className={`kpi tone-${tone}`}><Icon /><span>{label}</span><strong>{value}</strong><small>{note}</small></article>
}
function Mini({ label, value }) {
  return <div><span>{label}</span><strong>{value}</strong></div>
}
function FunnelRow({ item, max }) {
  const v = valueOf(item)
  return (
    <div className="funnel-row">
      <span>{labelOf(item)}</span>
      <div><i style={{ width: `${Math.min(100, v / max * 100)}%` }} /></div>
      <strong>{fmt(v)}</strong>
    </div>
  )
}
function SourceRow({ source }) {
  const name = source.source ?? source.name ?? source.channel ?? 'Source'
  const v = source.visitors ?? source.count ?? 0
  const r = source.registrations ?? 0
  const rate = source.conversion_rate ?? (v ? r / v * 100 : 0)
  return (
    <div className="source-row">
      <div><strong>{name}</strong><small>{fmt(v)} visitors</small></div>
      <span>{fmt(r)} regs</span>
      <b>{Number(rate <= 1 ? rate * 100 : rate).toFixed(1)}%</b>
    </div>
  )
}
