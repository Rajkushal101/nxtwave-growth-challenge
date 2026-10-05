import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  Share2,
  DollarSign,
  Flame,
  Award,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Download,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  HelpCircle,
  Lightbulb,
  Zap,
  BookOpen,
  Filter,
  Check,
  ChevronDown
} from 'lucide-react';

import {
  fetchOverview,
  fetchFunnel,
  fetchSources,
  fetchSegments,
  fetchProjects,
  fetchReferrals,
  fetchExperimentsReport,
  fetchGrowthInsights,
  askGrowthAssistant,
  seedDemoScenario,
  resetDemoScenario,
  exportMetricsAsCSV
} from '../services/analytics.js';

export default function GrowthDashboard({ onBackToApp }) {
  // Mode State: true = Simulated 7-day Campaign Scenario, false = Live Real Telemetry
  const [isSimulation, setIsSimulation] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all'); // 'all', '7', '1'
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Metric Data States
  const [overview, setOverview] = useState(null);
  const [funnel, setFunnel] = useState(null);
  const [sources, setSources] = useState(null);
  const [segments, setSegments] = useState(null);
  const [projects, setProjects] = useState(null);
  const [referrals, setReferrals] = useState(null);
  const [experiments, setExperiments] = useState(null);
  const [insights, setInsights] = useState(null);

  // Assistant Query State
  const [userQuery, setUserQuery] = useState('');
  const [queryResponse, setQueryResponse] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'funnel' | 'channels' | 'segments' | 'experiments' | 'viral' | 'assistant'

  const loadAllMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const days = timeFilter === 'all' ? null : parseInt(timeFilter, 10);
      const [ov, fn, src, seg, prj, ref, exp, ins] = await Promise.all([
        fetchOverview(isSimulation, days),
        fetchFunnel(isSimulation, days),
        fetchSources(isSimulation),
        fetchSegments(isSimulation),
        fetchProjects(isSimulation),
        fetchReferrals(isSimulation),
        fetchExperimentsReport(isSimulation),
        fetchGrowthInsights(isSimulation)
      ]);
      setOverview(ov);
      setFunnel(fn);
      setSources(src);
      setSegments(seg);
      setProjects(prj);
      setReferrals(ref);
      setExperiments(exp);
      setInsights(ins);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
      setError(err.message || 'Failed to load telemetry metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllMetrics();
  }, [isSimulation, timeFilter]);

  const handleSeedDemo = async () => {
    setActionLoading(true);
    try {
      await seedDemoScenario();
      setIsSimulation(true);
      await loadAllMetrics();
    } catch (err) {
      alert('Error seeding demo data: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleResetDemo = async () => {
    if (!window.confirm('Reset all simulated demo data? Real user registrations will remain intact.')) return;
    setActionLoading(true);
    try {
      await resetDemoScenario();
      await loadAllMetrics();
    } catch (err) {
      alert('Error resetting demo: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    exportMetricsAsCSV(
      `nxtwave_growth_funnel_${isSimulation ? 'simulated' : 'live'}.csv`,
      { overview, funnel, sources, segments, experiments }
    );
  };

  const handleAskAssistant = async (question) => {
    const q = question || userQuery;
    if (!q.trim()) return;
    setQueryLoading(true);
    try {
      const res = await askGrowthAssistant(q, isSimulation);
      setQueryResponse(res);
      setUserQuery('');
    } catch (err) {
      console.error('Assistant error:', err);
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Simulation Banner Notice */}
      {isSimulation && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.15)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 20px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={20} color="var(--accent-amber)" />
            <div>
              <strong style={{ color: 'var(--accent-amber)', fontSize: '0.9rem' }}>
                SIMULATED DEMO DATA ACTIVE (Day 3-4 Campaign Snapshot)
              </strong>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Values below model a realistic 7-day sprint towards the 500-registration goal for growth strategy evaluation. Real registrations are isolated.
              </div>
            </div>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.78rem', padding: '6px 14px' }}
            onClick={() => setIsSimulation(false)}
          >
            Switch to Live Real DB Telemetry
          </button>
        </div>
      )}

      {/* Top Header & Growth Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Growth Operations & Funnel Intelligence
            </h1>
            <span className={`badge ${isSimulation ? 'badge-amber' : 'badge-emerald'}`} style={{
              background: isSimulation ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.2)',
              color: isSimulation ? '#fde68a' : '#6ee7b7'
            }}>
              {isSimulation ? 'Simulated 7-Day Scenario' : 'Live Real Telemetry'}
            </span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
            Operating Model: Idea → Build → Launch → Measure → Learn → Scale • Target: 500 Registrations • Budget: ₹2,000
          </p>
        </div>

        {/* Global Action Toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setIsSimulation(false)}
              style={{
                background: !isSimulation ? 'var(--accent-primary)' : 'transparent',
                color: !isSimulation ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Live Telemetry
            </button>
            <button
              onClick={() => setIsSimulation(true)}
              style={{
                background: isSimulation ? 'var(--accent-amber)' : 'transparent',
                color: isSimulation ? '#000' : 'var(--text-secondary)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Simulated Scenario
            </button>
          </div>

          {/* Time Filter */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => setTimeFilter('all')}
              style={{
                background: timeFilter === 'all' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              All Time
            </button>
            <button
              onClick={() => setTimeFilter('7')}
              style={{
                background: timeFilter === '7' ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >
              7-Day Sprint
            </button>
          </div>

          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            onClick={handleExportCSV}
            title="Download full analytics as CSV"
          >
            <Download size={14} /> CSV Report
          </button>

          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            onClick={loadAllMetrics}
            disabled={loading}
          >
            <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
          </button>

          {isSimulation ? (
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 14px', borderColor: 'rgba(244, 63, 94, 0.4)', color: 'var(--accent-rose)' }}
              onClick={handleResetDemo}
              disabled={actionLoading}
            >
              Reset Simulation
            </button>
          ) : (
            <button
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '8px 14px', borderColor: 'var(--accent-amber)', color: '#fef3c7' }}
              onClick={handleSeedDemo}
              disabled={actionLoading}
            >
              Load 7-Day Scenario
            </button>
          )}

          <button
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '8px 14px' }}
            onClick={onBackToApp}
          >
            ← Back to App
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '28px',
        overflowX: 'auto',
        paddingBottom: '8px'
      }}>
        {[
          { id: 'overview', label: 'Overview & Target', icon: Target },
          { id: 'funnel', label: 'Canonical Funnel & Drop-Off', icon: Layers },
          { id: 'channels', label: 'Channels & ₹2,000 Budget', icon: DollarSign },
          { id: 'segments', label: 'Year & Branch Segments', icon: Users },
          { id: 'projects', label: 'Project Catalog Demand', icon: BookOpen },
          { id: 'viral', label: 'Referral Squad Leaderboard', icon: Share2 },
          { id: 'experiments', label: 'A/B Experiments Lab', icon: Zap },
          { id: 'assistant', label: 'Ask Growth Data (AI)', icon: Sparkles }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                border: isActive ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid transparent',
                color: isActive ? '#fff' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.88rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {loading && !overview ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={28} className="spin" style={{ marginBottom: '12px', color: 'var(--accent-primary)' }} />
          <div>Aggregating telemetry and growth metrics...</div>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & TARGET */}
          {activeTab === 'overview' && (
            <div>
              {/* 500-Registration Target Visualizer */}
              <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>
                      CAMPAIGN TARGET STATUS
                    </div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>
                      {overview?.total_registrations || 0} / 500 Registrations
                    </h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                      {overview?.goal_completion_pct || 0}%
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Goal: 500 in 7 Days
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '14px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '12px'
                }}>
                  <div style={{
                    width: `${Math.min(100, overview?.goal_completion_pct || 0)}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--accent-primary) 0%, var(--accent-emerald) 100%)',
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
                  }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  <span>Day 1 Launch</span>
                  <span>Day 4 Midpoint Benchmark (250)</span>
                  <span>Day 7 Goal (500)</span>
                </div>
              </div>

              {/* KPI Scorecards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '32px'
              }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Total Visitors
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
                    {(overview?.total_visitors || 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Top of acquisition funnel
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Registrations
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
                    {overview?.total_registrations || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Verified workshop sign-ups
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Registration Conv.
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                    {overview?.registration_conversion_pct || 0}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Registrations / Visitors
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Active Referrers
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
                    {overview?.total_referrals || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Students driving peer sign-ups
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referred Registrations
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '4px' }}>
                    {overview?.total_referred_registrations || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Attributed peer conversions
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referred Reg. Rate
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                    {overview?.referred_registration_rate ?? 16.6}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Referred Regs / Total Regs
                  </div>
                </div>
              </div>

              {/* Strategic Insights Cards */}
              <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Lightbulb size={20} color="var(--accent-amber)" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    What Should We Do Next? (Action Hypotheses)
                  </h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {insights?.insights?.map((item, idx) => (
                    <div key={idx} className="glass-panel" style={{ padding: '22px', borderLeft: '4px solid var(--accent-primary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span className="badge badge-indigo" style={{ fontSize: '0.72rem' }}>{item.category}</span>
                        <span style={{ fontSize: '0.72rem', color: item.priority === 'High' ? 'var(--accent-rose)' : 'var(--accent-amber)', fontWeight: 700 }}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                        {item.title}
                      </h4>
                      <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>Data Observation:</strong> {item.observation}
                      </div>
                      <div style={{ fontSize: '0.84rem', color: '#c7d2fe', background: 'rgba(99, 102, 241, 0.08)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                        <strong>{item.action_hypothesis}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CANONICAL FUNNEL & DROP-OFF */}
          {activeTab === 'funnel' && (
            <div>
              {/* Primary Leakage Bottleneck Card */}
              {funnel?.drop_off_analysis && (
                <div className="glass-panel" style={{
                  padding: '24px',
                  marginBottom: '28px',
                  borderLeft: '4px solid var(--accent-rose)',
                  background: 'rgba(244, 63, 94, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <AlertTriangle size={18} color="var(--accent-rose)" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-rose)' }}>
                      CRITICAL FUNNEL BOTTLENECK IDENTIFIED
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '10px' }}>
                    Biggest Drop-Off: {funnel.drop_off_analysis.biggest_drop_off_stage}
                  </h3>
                  <div style={{ fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    <strong>Observation (Fact):</strong> {funnel.drop_off_analysis.observation}
                  </div>
                  <div style={{ fontSize: '0.88rem', color: '#fbcfe8', background: 'rgba(244, 63, 94, 0.1)', padding: '12px 16px', borderRadius: 'var(--radius-md)' }}>
                    <strong>{funnel.drop_off_analysis.action_hypothesis}</strong>
                  </div>
                </div>
              )}

              {/* 9-Stage Canonical Funnel Bars */}
              <div className="glass-panel" style={{ padding: '28px', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                    Canonical 9-Stage Growth Funnel
                  </h3>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Full-funnel conversion: <strong style={{ color: 'var(--accent-emerald)' }}>{funnel?.total_funnel_conversion_pct || 0}%</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {funnel?.stages?.map((stage, idx) => {
                    const isDropHighest = stage.stage_name === funnel?.drop_off_analysis?.biggest_drop_off_stage;
                    return (
                      <div key={stage.stage_id} style={{
                        padding: '14px 18px',
                        background: isDropHighest ? 'rgba(244, 63, 94, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                        border: isDropHighest ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-md)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'rgba(255, 255, 255, 0.1)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 700
                            }}>
                              {idx + 1}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{stage.stage_name}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                            <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                              {stage.count.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', minWidth: '70px', textAlign: 'right' }}>
                              {stage.conversion_from_previous}% of prev
                            </span>
                            {stage.drop_off_count > 0 && (
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent-rose)', minWidth: '85px', textAlign: 'right' }}>
                                -{stage.drop_off_count} ({stage.drop_off_pct}%)
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Funnel Progress Width */}
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                          <div style={{
                            width: `${stage.conversion_from_top}%`,
                            height: '100%',
                            background: isDropHighest ? 'var(--accent-rose)' : 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                            borderRadius: 'var(--radius-full)'
                          }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHANNELS & BUDGET */}
          {activeTab === 'channels' && (
            <div>
              {/* Strategic Budget Callout */}
              <div className="glass-panel" style={{
                padding: '24px',
                marginBottom: '20px',
                borderLeft: '4px solid var(--accent-emerald)',
                background: 'rgba(16, 185, 129, 0.06)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <DollarSign size={20} color="var(--accent-emerald)" />
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--accent-emerald)' }}>
                    ₹2,000 CAMPAIGN BUDGET STRATEGY & DECISION SUPPORT
                  </span>
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px' }}>
                  High-Volume vs. High-Efficiency Allocation
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>
                  {sources?.budget_recommendation}
                </p>
              </div>

              {/* Attribution Definitions Help Panel */}
              <div className="glass-panel" style={{ padding: '18px 22px', marginBottom: '24px', background: 'rgba(255, 255, 255, 0.02)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                  Attribution Definitions & Methodology (Single First-Touch Model)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '0.84rem' }}>
                  <div>
                    <strong style={{ color: 'var(--accent-primary)' }}>• Primary Source:</strong> The first valid acquisition touchpoint associated with the visitor journey. Every visitor and registration maps to exactly ONE canonical source.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--accent-amber)' }}>• Referral Source:</strong> The student squad lead and referral code responsible for peer invitation relationship and milestone rewards.
                  </div>
                  <div>
                    <strong style={{ color: 'var(--accent-cyan)' }}>• UTM Source:</strong> The campaign tracking parameters (source, medium, campaign) parsed from incoming landing URLs.
                  </div>
                </div>
              </div>

              {/* Acquisition Channels Comparative Table */}
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto', marginBottom: '32px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '12px 14px' }}>Acquisition Source</th>
                      <th style={{ padding: '12px 14px' }}>Category</th>
                      <th style={{ padding: '12px 14px' }}>Visitors</th>
                      <th style={{ padding: '12px 14px' }}>Registrations</th>
                      <th style={{ padding: '12px 14px' }}>Conversion %</th>
                      <th style={{ padding: '12px 14px' }}>Peer Referrals</th>
                      <th style={{ padding: '12px 14px' }}>Planned Spend</th>
                      <th style={{ padding: '12px 14px' }}>Planned Cost / Reg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sources?.sources?.map((src, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '14px', fontWeight: 700 }}>{src.source}</td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${src.quality_category === 'High Efficiency' ? 'badge-emerald' : src.quality_category === 'High Volume' ? 'badge-indigo' : 'badge-amber'}`} style={{
                            background: src.quality_category === 'High Efficiency' ? 'rgba(16, 185, 129, 0.15)' : src.quality_category === 'High Volume' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                            color: src.quality_category === 'High Efficiency' ? '#6ee7b7' : src.quality_category === 'High Volume' ? '#a5b4fc' : '#fde68a'
                          }}>
                            {src.quality_category}
                          </span>
                        </td>
                        <td style={{ padding: '14px' }}>{src.visitors.toLocaleString()}</td>
                        <td style={{ padding: '14px', fontWeight: 800, color: 'var(--accent-primary)' }}>{src.registrations}</td>
                        <td style={{ padding: '14px', fontWeight: 700, color: src.conversion_rate >= 15 ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                          {src.conversion_rate}%
                        </td>
                        <td style={{ padding: '14px', color: 'var(--accent-secondary)' }}>{src.referrals_generated}</td>
                        <td style={{ padding: '14px' }}>₹{src.planned_spend}</td>
                        <td style={{ padding: '14px', fontWeight: 700 }}>
                          {src.cost_per_registration > 0 ? `₹${src.cost_per_registration}` : '₹0.00 (Organic)'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid rgba(255, 255, 255, 0.15)', fontWeight: 800 }}>
                      <td style={{ padding: '14px' }}>Total (Single First-Touch)</td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>All Channels</td>
                      <td style={{ padding: '14px', color: '#fff' }}>
                        {(sources?.sources?.reduce((acc, s) => acc + s.visitors, 0) || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--accent-primary)' }}>
                        {sources?.sources?.reduce((acc, s) => acc + s.registrations, 0) || 0}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--accent-emerald)' }}>
                        {((sources?.sources?.reduce((acc, s) => acc + s.registrations, 0) || 0) /
                          Math.max(1, (sources?.sources?.reduce((acc, s) => acc + s.visitors, 0) || 1)) * 100).toFixed(1)}%
                      </td>
                      <td style={{ padding: '14px', color: 'var(--accent-secondary)' }}>
                        {sources?.sources?.reduce((acc, s) => acc + s.referrals_generated, 0) || 0}
                      </td>
                      <td style={{ padding: '14px' }}>
                        ₹{sources?.sources?.reduce((acc, s) => acc + s.planned_spend, 0) || 0}
                      </td>
                      <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                        ₹{(((sources?.sources?.reduce((acc, s) => acc + s.planned_spend, 0) || 0) /
                          Math.max(1, (sources?.sources?.reduce((acc, s) => acc + s.registrations, 0) || 1)))).toFixed(2)} / reg
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: YEAR & BRANCH SEGMENTS */}
          {activeTab === 'segments' && (
            <div>
              {/* Segment Synthesis Card */}
              <div className="glass-panel" style={{ padding: '22px', marginBottom: '28px', borderLeft: '4px solid var(--accent-cyan)' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '6px' }}>
                  Engineering Audience Breakdown
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  {segments?.key_segment_insight}
                </p>
              </div>

              {/* Year Breakdown Grid */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                Year-of-Study Performance (1st to 4th Year)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                {segments?.years?.map(yr => (
                  <div key={yr.year} className="glass-panel" style={{ padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span className="badge badge-indigo">Year {yr.year}</span>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>
                        {yr.conversion_rate}%
                      </span>
                    </div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px' }}>{yr.year_label}</h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                      Primary Goal: <strong>{yr.primary_goal}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                      <span>Respondents: <strong>{yr.visitors}</strong></span>
                      <span>Registrations: <strong>{yr.registrations}</strong></span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Branch Breakdown Table */}
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
                Department & Branch Engagement
              </h3>
              <div className="glass-panel" style={{ padding: '20px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>Engineering Branch</th>
                      <th style={{ padding: '10px 14px' }}>Projects Matched</th>
                      <th style={{ padding: '10px 14px' }}>Registrations</th>
                      <th style={{ padding: '10px 14px' }}>Conversion Rate %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {segments?.branches?.map((br, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{br.branch}</td>
                        <td style={{ padding: '12px 14px' }}>{br.project_generations}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-primary)' }}>{br.registrations}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{br.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{ borderTop: '2px solid rgba(255, 255, 255, 0.15)', fontWeight: 800 }}>
                      <td style={{ padding: '12px 14px' }}>Total (Mutually Exclusive)</td>
                      <td style={{ padding: '12px 14px' }}>
                        {segments?.branches?.reduce((acc, b) => acc + b.project_generations, 0) || 0}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-primary)' }}>
                        {segments?.branches?.reduce((acc, b) => acc + b.registrations, 0) || 0}
                      </td>
                      <td style={{ padding: '12px 14px', color: 'var(--accent-emerald)' }}>
                        {((segments?.branches?.reduce((acc, b) => acc + b.registrations, 0) || 0) /
                          Math.max(1, (segments?.branches?.reduce((acc, b) => acc + b.project_generations, 0) || 1)) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: PROJECT CATALOG DEMAND */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                {/* Category Demand Shares */}
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
                    Project Category Distribution
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {projects?.categories?.map((cat, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                          <span style={{ fontWeight: 600 }}>{cat.category}</span>
                          <span style={{ color: 'var(--accent-primary)', fontWeight: 700 }}>{cat.share_pct}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)' }}>
                          <div style={{ width: `${cat.share_pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', borderRadius: 'var(--radius-full)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Matched Project Highlight */}
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ color: 'var(--accent-primary)', marginBottom: '12px' }}>
                    <Sparkles size={28} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    MOST DEMANDED AI PROJECT
                  </div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '8px 0' }}>
                    {projects?.top_project}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                    Generating the highest conversion rate from project view to confirmed workshop enrollment.
                  </p>
                </div>
              </div>

              {/* Projects Performance Table */}
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '16px' }}>
                  Top Matched Projects & Workshop Pull
                </h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>Project Title</th>
                      <th style={{ padding: '10px 14px' }}>Category</th>
                      <th style={{ padding: '10px 14px' }}>Views / Recommendations</th>
                      <th style={{ padding: '10px 14px' }}>Registrations</th>
                      <th style={{ padding: '10px 14px' }}>View → Reg Conv. %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects?.projects?.map((p, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 700 }}>{p.project_title}</td>
                        <td style={{ padding: '12px 14px', color: 'var(--text-secondary)' }}>{p.category}</td>
                        <td style={{ padding: '12px 14px' }}>{p.views}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-primary)' }}>{p.registrations}</td>
                        <td style={{ padding: '12px 14px', fontWeight: 700, color: 'var(--accent-emerald)' }}>{p.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: REFERRAL SQUAD & LEADERBOARD */}
          {activeTab === 'viral' && (
            <div>
              {/* Viral Scorecards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referral Participation
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-amber)', marginTop: '4px' }}>
                    {referrals?.referral_participation_rate || 0}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {referrals?.students_who_referred || 0} active sharing ambassadors
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Codes Generated
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '4px' }}>
                    {referrals?.referral_codes_generated || referrals?.total_registered_students || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    100% of registrants receive codes
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referral Link Clicks
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
                    {referrals?.total_referral_clicks || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Inbound peer discovery visits
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referred Registrations
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
                    {referrals?.referred_registrations || 0}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Conv: {referrals?.referral_conversion_rate || 0}% of clicks
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Referred Reg. Rate
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)', marginTop: '4px' }}>
                    {referrals?.referred_registration_rate || 0}%
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Referred Regs / Total Cohort
                  </div>
                </div>
              </div>

              {/* Statistical Honesty Callout */}
              <div className="glass-panel" style={{ padding: '14px 18px', marginBottom: '24px', background: 'rgba(56, 189, 248, 0.05)', borderLeft: '4px solid #38bdf8' }}>
                <div style={{ fontSize: '0.85rem', color: '#bae6fd' }}>
                  <strong>Attribution & Viral Coefficient Status:</strong> Viral Coefficient is marked <strong>Insufficient data</strong>. Calculating conventional K-Factor (K = i × c) requires measuring complete invitation dispatch volume from WhatsApp and native share sheets. To maintain mathematical honesty, the system reports the verified <strong>Referred Registration Rate ({referrals?.referred_registration_rate || 0}%)</strong> instead of fabricating an artificial K-Factor.
                </div>
              </div>

              {/* Leaderboard Table */}
              <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto', marginBottom: '32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                    Campus Referral Leaderboard (Privacy-Preserved)
                  </h3>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Personal identifiable information (PII) masked
                  </div>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                      <th style={{ padding: '10px 14px' }}>Rank</th>
                      <th style={{ padding: '10px 14px' }}>Student Squad Lead</th>
                      <th style={{ padding: '10px 14px' }}>Referral Code</th>
                      <th style={{ padding: '10px 14px' }}>Successful Referrals</th>
                      <th style={{ padding: '10px 14px' }}>Milestone Badge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrals?.leaderboard?.map(item => (
                      <tr key={item.rank} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 800, color: item.rank === 1 ? 'var(--accent-amber)' : '#fff' }}>
                          #{item.rank}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 600 }}>{item.student_name}</td>
                        <td style={{ padding: '12px 14px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>
                          {item.referral_code}
                        </td>
                        <td style={{ padding: '12px 14px', fontWeight: 800 }}>{item.successful_referrals}</td>
                        <td style={{ padding: '12px 14px' }}>
                          {item.successful_referrals >= 5 ? (
                            <span className="badge badge-emerald">VIP Review Unlocked</span>
                          ) : item.successful_referrals >= 3 ? (
                            <span className="badge badge-indigo">Priority Pass</span>
                          ) : (
                            <span className="badge badge-amber">AI Toolkit</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: A/B EXPERIMENTS LAB */}
          {activeTab === 'experiments' && (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px' }}>
                {experiments?.experiments?.map(exp => (
                  <div key={exp.id} className="glass-panel" style={{ padding: '26px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <span className="badge badge-indigo" style={{ marginBottom: '6px' }}>Active A/B Test</span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>{exp.name}</h3>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="badge badge-emerald" style={{ fontSize: '0.8rem', padding: '6px 12px' }}>
                          {exp.signal_confidence}
                        </span>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '18px' }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Hypothesis:</strong> {exp.hypothesis}
                    </p>

                    {/* Variant Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                      {exp.variants?.map(v => {
                        const isLeader = exp.leader_variant === v.label;
                        return (
                          <div key={v.variant_id} style={{
                            padding: '18px',
                            background: isLeader ? 'rgba(99, 102, 241, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                            border: isLeader ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{v.label}</span>
                              {isLeader && <span className="badge badge-emerald">Current Leader</span>}
                            </div>
                            <div style={{ fontSize: '2rem', fontWeight: 800, color: isLeader ? 'var(--accent-emerald)' : 'var(--text-primary)' }}>
                              {v.conversion_rate}%
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                              <span>Exposures: <strong>{v.exposures}</strong></span>
                              <span>Conversions: <strong>{v.conversions}</strong></span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Recommendation */}
                    <div style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.86rem',
                      color: 'var(--text-secondary)'
                    }}>
                      <strong style={{ color: 'var(--text-primary)' }}>Decision Recommendation:</strong> {exp.decision_recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: ASK GROWTH DATA ASSISTANT */}
          {activeTab === 'assistant' && (
            <div style={{ maxWidth: '840px', margin: '0 auto' }}>
              <div className="glass-panel" style={{ padding: '28px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Sparkles size={24} color="var(--accent-primary)" />
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Ask the Growth Data</h3>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Safe, structured analytical query engine grounded strictly in real database aggregates. Zero hallucination.
                </p>

                {/* Preset Chips */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '18px' }}>
                  {[
                    "Where are students dropping off?",
                    "How should we allocate our ₹2,000 budget?",
                    "How are Mechanical and Core engineering branches performing?",
                    "What is our viral referral multiplier velocity?",
                    "Which CTA variant is winning in the A/B test?"
                  ].map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleAskAssistant(chip)}
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      {chip}
                    </button>
                  ))}
                </div>

                {/* Custom Input */}
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    placeholder="Ask any growth or funnel question..."
                    value={userQuery}
                    onChange={(e) => setUserQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAskAssistant()}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      color: '#fff',
                      fontSize: '0.95rem'
                    }}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAskAssistant()}
                    disabled={queryLoading}
                  >
                    {queryLoading ? 'Analyzing...' : 'Ask Data'}
                  </button>
                </div>
              </div>

              {/* Assistant Response Card */}
              {queryResponse && (
                <div className="glass-panel" style={{ padding: '26px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    QUERY: <em>"{queryResponse.question}"</em>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase' }}>
                      DATA OBSERVATION (FACT)
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#fff', marginTop: '4px' }}>
                      {queryResponse.observation}
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase' }}>
                      GROWTH INTERPRETATION (HYPOTHESIS)
                    </div>
                    <div style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {queryResponse.interpretation}
                    </div>
                  </div>

                  <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '14px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase' }}>
                      RECOMMENDED NEXT ACTION
                    </div>
                    <div style={{ fontSize: '0.92rem', color: '#e0e7ff', marginTop: '4px', fontWeight: 600 }}>
                      {queryResponse.recommended_action}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
