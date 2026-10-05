import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Laptop, 
  ArrowRight,
  ShieldCheck,
  Users,
  Trophy,
  Share2
} from 'lucide-react';

export default function RegistrationSuccess({ registration, onExploreMore, onOpenGrowthHub }) {
  useEffect(() => {
    // Trigger celebratory confetti on mount
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // Ignore in non-canvas environments
    }
  }, []);

  return (
    <div style={{ maxWidth: '720px', margin: '30px auto', padding: '0 16px' }}>
      <div className="glass-panel" style={{
        padding: '44px 36px',
        textAlign: 'center',
        border: '1.5px solid var(--accent-emerald)',
        boxShadow: '0 12px 40px rgba(16, 185, 129, 0.15)'
      }}>
        {/* Success Icon */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '68px',
          height: '68px',
          borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          marginBottom: '16px',
          color: 'var(--accent-emerald)'
        }}>
          <CheckCircle2 size={36} />
        </div>

        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '8px' }}>
          🎉 You're In!
        </h1>
        <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
          You are officially registered for: <br />
          <strong style={{ color: 'var(--text-primary)' }}>"Build Your First AI Project in 60 Minutes"</strong>
        </p>

        {/* Project Continuity Box */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(139, 92, 246, 0.12))',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '18px 20px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '2px' }}>
            Your Matched Project
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            {registration?.project_title || 'AI Application'}
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Bring your project idea to the workshop. Our mentors will guide you step-by-step so you build and deploy it live in 60 minutes.
          </p>
        </div>

        {/* Squad Growth Hub Teaser Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
          border: '1.5px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '20px',
          marginBottom: '28px',
          textAlign: 'left'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase' }}>
                <Trophy size={16} /> Squad Milestone Challenge
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginTop: '2px' }}>
                Build Together With Friends
              </h3>
            </div>
            <div style={{
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-mono)',
              fontWeight: 700
            }}>
              Your Code: {registration?.referral_code}
            </div>
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
            Don't build alone! Share your personalized AI project card with campus peers. Invite <strong>1 friend</strong> to unlock the <em>AI Project Starter Blueprint & Repo Template</em>.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenGrowthHub}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            <Users size={16} /> Open My Growth Hub & Share Card <ArrowRight size={16} />
          </button>
        </div>

        {/* Workshop Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          textAlign: 'left'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>
              <Clock size={14} /> 60-Min Live Build
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Hands-on session with live Q&A</div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '12px 14px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '2px' }}>
              <Laptop size={14} /> Zero Prerequisites
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Runs entirely in your web browser</div>
          </div>
        </div>

        {/* Confirmed Details */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          padding: '14px 18px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '24px',
          fontSize: '0.82rem',
          textAlign: 'left',
          color: 'var(--text-secondary)',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px'
        }}>
          <div><strong>Student:</strong> {registration?.full_name}</div>
          <div><strong>College:</strong> {registration?.college_name}</div>
          <div><strong>Confirmation sent to:</strong> {registration?.email}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            <ShieldCheck size={14} /> Official NxtWave registration confirmed
          </div>
        </div>

        {/* Secondary Action */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onExploreMore}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Explore Another Project
          </button>
        </div>
      </div>
    </div>
  );
}
