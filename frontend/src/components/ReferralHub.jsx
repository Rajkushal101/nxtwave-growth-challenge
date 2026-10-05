import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Sparkles, 
  Trophy, 
  Gift, 
  Rocket, 
  CheckCircle2, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  RotateCw, 
  ExternalLink,
  Flame,
  ArrowRight,
  ShieldCheck,
  MousePointerClick
} from 'lucide-react';
import ShareableProjectCard from './ShareableProjectCard.jsx';
import { getReferralHub, buildReferralUrl } from '../services/api.js';

export default function ReferralHub({ referralCode, onBackToApp }) {
  const [hubData, setHubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  const fetchHub = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getReferralHub(referralCode);
      setHubData(data);
    } catch (err) {
      console.error('Failed to load growth hub:', err);
      setError(err.message || 'Could not load your referral hub');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (referralCode) {
      fetchHub();
    }
  }, [referralCode]);

  const handleCopyLink = () => {
    if (!referralCode) return;
    const url = buildReferralUrl(referralCode);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  if (loading && !hubData) {
    return (
      <div className="glass-panel" style={{ maxWidth: '700px', margin: '60px auto', padding: '48px', textAlign: 'center' }}>
        <Sparkles size={32} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
        <h3>Loading Your Growth Hub...</h3>
        <p style={{ color: 'var(--text-secondary)' }}>Calculating referral milestones and squad progress...</p>
      </div>
    );
  }

  if (error || !hubData) {
    return (
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '60px auto', padding: '40px', textAlign: 'center' }}>
        <h3 style={{ color: 'var(--accent-rose)', marginBottom: '12px' }}>Could Not Load Referral Hub</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>{error || 'Referral profile not found.'}</p>
        <button className="btn btn-secondary" onClick={onBackToApp}>
          Return to Home
        </button>
      </div>
    );
  }

  const referralUrl = buildReferralUrl(hubData.referral_code);

  return (
    <div style={{ maxWidth: '1100px', margin: '20px auto', padding: '0 16px' }}>
      {/* Top Breadcrumb & Refresh */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
        <button 
          className="btn btn-secondary" 
          onClick={onBackToApp} 
          style={{ padding: '6px 14px', fontSize: '0.85rem' }}
        >
          ← Back to Matcher
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Referral Identity: <strong>{hubData.referral_code}</strong>
          </span>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={fetchHub} 
            title="Refresh referral progress"
            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
          >
            <RotateCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Main Title & Hero Banner */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div className="badge badge-indigo" style={{ marginBottom: '10px' }}>
          <Users size={14} /> Peer-to-Peer Growth Engine
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Your Squad Growth Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '600px', margin: '8px auto 0' }}>
          Invite your batchmates to discover their AI project. When they register, you both build together and unlock advanced blueprints.
        </p>
      </div>

      {/* KPI Stats Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(99, 102, 241, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-primary)' }}>
            <MousePointerClick size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Link Visits</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>{hubData.total_clicks}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-emerald)' }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Friends Registered</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{hubData.total_referrals}</div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', padding: '12px', borderRadius: '12px', color: 'var(--accent-amber)' }}>
            <Trophy size={24} />
          </div>
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Unlocked Rewards</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
              {hubData.milestones.filter(m => m.is_unlocked).length} / {hubData.milestones.length}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Left = Milestones & Activity, Right = Share Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '32px',
        alignItems: 'start'
      }}>
        {/* LEFT COLUMN: Progress & Milestones */}
        <div>
          {/* Milestone Progress Box */}
          <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase' }}>
                  Next Unlock Milestone
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginTop: '2px' }}>
                  {hubData.next_milestone ? hubData.next_milestone.title : 'All Milestones Completed!'}
                </h3>
              </div>

              {hubData.next_milestone && hubData.next_milestone.remaining > 0 ? (
                <span className="badge badge-indigo">
                  {hubData.next_milestone.remaining} more friend needed
                </span>
              ) : (
                <span className="badge badge-emerald">
                  All Unlocked 🎉
                </span>
              )}
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <span>Progress: {hubData.total_referrals} / {hubData.next_milestone?.required_count || 5}</span>
                <span>{hubData.next_milestone?.progress_pct || 100}%</span>
              </div>
              <div style={{
                height: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${hubData.next_milestone?.progress_pct || 100}%`,
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-emerald))',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
              Invite batchmates from your department or hostel. Every friend who registers via your link gets counted here in real-time.
            </p>
          </div>

          {/* Milestones Tier List */}
          <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Trophy size={18} color="var(--accent-amber)" /> Squad Milestone Rewards
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {hubData.milestones.map((m) => (
                <div 
                  key={m.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--radius-md)',
                    background: m.is_unlocked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1.5px solid ${m.is_unlocked ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {m.is_unlocked ? (
                        <CheckCircle2 size={18} color="var(--accent-emerald)" />
                      ) : (
                        <Lock size={18} color="var(--text-muted)" />
                      )}
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: m.is_unlocked ? '#ffffff' : 'var(--text-secondary)' }}>
                        {m.title}
                      </span>
                    </div>

                    <span className={`badge ${m.is_unlocked ? 'badge-emerald' : 'badge-indigo'}`} style={{ fontSize: '0.72rem' }}>
                      {m.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginLeft: '26px' }}>
                    {m.description}
                  </p>

                  {m.is_unlocked && m.reward_content && (
                    <div style={{
                      marginLeft: '26px',
                      marginTop: '4px',
                      padding: '8px 12px',
                      background: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '0.8rem',
                      color: 'var(--accent-emerald)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <Sparkles size={14} />
                      <span>{m.reward_content}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '14px', textAlign: 'center' }}>
              *Digital assets unlocked dynamically during this growth simulation.
            </div>
          </div>

          {/* Referred Friends Activity Feed */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Users size={18} color="var(--accent-primary)" /> Registered Squad Peers ({hubData.referred_friends.length})
            </h4>

            {hubData.referred_friends.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {hubData.referred_friends.map((fr, idx) => (
                  <div key={idx} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.88rem'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{fr.name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Building: {fr.project_title}</div>
                    </div>
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle2 size={12} /> {fr.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-muted)',
                fontSize: '0.88rem'
              }}>
                <Users size={28} style={{ opacity: 0.3, marginBottom: '8px' }} />
                <p>No squad peers have registered yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: 'var(--text-secondary)' }}>
                  Share your project card to get your first unlock!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Shareable Project Card & Actions */}
        <div>
          <div style={{ position: 'sticky', top: '24px' }}>
            <ShareableProjectCard 
              projectTitle={hubData.project_title}
              category={hubData.project_category}
              difficulty={hubData.difficulty}
              referralCode={hubData.referral_code}
              studentName={hubData.student_name}
            />

            {/* Direct Copy Referral URL Box */}
            <div className="glass-panel" style={{ marginTop: '20px', padding: '18px 20px' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                Your Unique Invite Link:
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  readOnly
                  value={referralUrl}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.3)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    color: '#ffffff',
                    fontFamily: 'var(--font-mono)'
                  }}
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCopyLink}
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
