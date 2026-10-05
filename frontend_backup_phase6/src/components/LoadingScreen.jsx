import React, { useState, useEffect } from 'react';
import { BrainCircuit, CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function LoadingScreen() {
  const [stage, setStage] = useState(0);

  const stages = [
    { label: "Analyzing your engineering background & goal...", done: false },
    { label: "Filtering 17+ projects for 60-minute build feasibility...", done: false },
    { label: "Synthesizing personalized curriculum & portfolio outcomes...", done: false }
  ];

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 500);
    const t2 = setTimeout(() => setStage(2), 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="glass-panel" style={{
      maxWidth: '600px',
      margin: '60px auto',
      padding: '48px 32px',
      textAlign: 'center'
    }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
        border: '1px solid var(--border-glow)',
        marginBottom: '24px',
        position: 'relative'
      }}>
        <BrainCircuit size={32} color="var(--accent-primary)" />
        <div style={{
          position: 'absolute',
          top: -2,
          right: -2,
          animation: 'spin 2s linear infinite'
        }}>
          <Sparkles size={18} color="var(--accent-amber)" />
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '12px' }}>
        Matching Your AI Project
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '32px' }}>
        Finding a realistic 60-minute build tailored specifically to your background...
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        textAlign: 'left',
        background: 'rgba(0, 0, 0, 0.25)',
        padding: '20px 24px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)'
      }}>
        {stages.map((st, idx) => {
          const isCurrent = stage === idx;
          const isDone = stage > idx;

          return (
            <div key={idx} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '0.9rem',
              color: isDone ? 'var(--accent-emerald)' : isCurrent ? 'var(--text-primary)' : 'var(--text-muted)'
            }}>
              {isDone ? (
                <CheckCircle2 size={18} color="var(--accent-emerald)" />
              ) : isCurrent ? (
                <Loader2 size={18} color="var(--accent-primary)" style={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1px solid var(--border-subtle)' }} />
              )}
              <span style={{ fontWeight: isCurrent ? 600 : 400 }}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
