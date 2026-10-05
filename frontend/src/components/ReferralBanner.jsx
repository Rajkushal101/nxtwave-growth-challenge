import React from 'react';
import { Sparkles, Users } from 'lucide-react';

export default function ReferralBanner({ context }) {
  if (!context || !context.valid) return null;

  return (
    <div style={{
      maxWidth: '820px',
      margin: '0 auto 24px',
      background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.25) 100%)',
      border: '1.5px solid var(--accent-primary)',
      boxShadow: '0 4px 20px rgba(99, 102, 241, 0.2)',
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '14px',
      textAlign: 'left'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
        padding: '10px',
        borderRadius: '50%',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Users size={20} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Campus Squad Invitation
        </div>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', marginTop: '2px' }}>
          {context.referrer_name ? (
            <>
              Your friend <strong>{context.referrer_name}</strong> is building{' '}
              <span style={{ color: '#a5b4fc', textDecoration: 'underline' }}>
                {context.project_title || 'an AI Project'}
              </span>{' '}
              with NxtWave!
            </>
          ) : (
            'Your peer invited you to discover your custom 60-minute AI project.'
          )}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
          Answer 5 quick questions below to discover what project <em>YOU</em> should build.
        </div>
      </div>
    </div>
  );
}
