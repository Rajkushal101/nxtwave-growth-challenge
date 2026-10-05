import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Clock, 
  Layers, 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  RotateCcw, 
  Shuffle, 
  Award, 
  Zap, 
  Bot 
} from 'lucide-react';
import { trackProjectViewed } from '../services/analytics.js';
import { getAssignedVariant, trackExperimentExposure } from '../services/experiments.js';

export default function ProjectResult({ 
  project, 
  onRegisterClick, 
  onTryAnother, 
  onRetake,
  switching = false 
}) {
  const [copied, setCopied] = useState(false);

  // Phase 4: A/B Experiment (Project-Focused CTA Copy)
  const ctaVariant = getAssignedVariant('exp_project_cta') || {
    button_text: 'Build My Project',
    subtext: 'Free 60-Minute Live Build'
  };

  useEffect(() => {
    if (project) {
      trackProjectViewed(project);
    }
    if (ctaVariant?.id) {
      trackExperimentExposure('exp_project_cta', ctaVariant.id);
    }
  }, [project, ctaVariant]);

  if (!project) return null;

  const renderStars = (stars) => {
    return (
      <div style={{ display: 'inline-flex', gap: '3px', color: '#f59e0b' }}>
        {[...Array(5)].map((_, i) => (
          <span key={i} style={{ opacity: i < stars ? 1 : 0.25, fontSize: '1rem' }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '820px', margin: '20px auto', padding: '0 16px' }}>
      {/* Top Value Banner */}
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div className="badge badge-emerald" style={{ marginBottom: '12px' }}>
          <Sparkles size={14} /> 60-Minute Match Found
        </div>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
          Your Recommended AI Project
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginTop: '6px' }}>
          Tailored to your background, skill comfort, and career targets.
        </p>
      </div>

      {/* Main Project Card */}
      <div className="glass-panel" style={{
        padding: '36px 32px',
        border: '1.5px solid var(--border-focus)',
        boxShadow: '0 10px 40px rgba(99, 102, 241, 0.15)',
        marginBottom: '28px',
        position: 'relative'
      }}>
        {/* Header Metadata */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '18px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-indigo">{project.category}</span>
              <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.78rem',
                color: project.is_ai_generated ? 'var(--accent-secondary)' : 'var(--text-muted)'
              }}>
                <Bot size={14} /> {project.is_ai_generated ? 'Synthesized via Gemini AI' : 'Deterministic Curriculum Match'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {project.project_title}
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Difficulty</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {renderStars(project.difficulty_stars)}
                <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{project.difficulty}</span>
              </div>
            </div>

            <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '14px' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Build Time</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                <Clock size={14} /> ~60 mins
              </div>
            </div>
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Technologies You Will Use
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {project.tech_stack.map((tech, idx) => (
              <span key={idx} style={{
                padding: '4px 12px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--text-primary)'
              }}>
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* What You'll Build */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: 'var(--text-primary)' }}>
            What you'll build
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
            {project.what_you_will_build}
          </p>
        </div>

        {/* Why this matches you (Personalized) */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.08))',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          padding: '18px 20px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: 'var(--accent-primary)', fontWeight: 700, fontSize: '0.9rem' }}>
            <Sparkles size={16} /> Why this matches you
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.93rem', lineHeight: 1.55 }}>
            {project.why_this_matches_you}
          </p>
        </div>

        {/* What you'll learn */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
            What you will learn in 60 minutes
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
            {project.learning_outcomes.map((outcome, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                <CheckCircle size={16} color="var(--accent-emerald)" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{outcome}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Value */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '12px 18px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
            <Award size={18} color="var(--accent-amber)" />
            <span><strong>Portfolio Impact:</strong> {project.portfolio_relevance}</span>
          </div>
          <span className="badge badge-indigo">{project.portfolio_value} Value</span>
        </div>
      </div>

      {/* Workshop Bridge & CTA Card */}
      <div className="glass-panel" style={{
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
        border: '1.5px solid var(--border-glow)',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-amber)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px', textTransform: 'uppercase' }}>
          <Zap size={16} /> Free Live Student Workshop
        </div>
        <h3 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px' }}>
          Want to Actually Build This?
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '580px', margin: '0 auto 24px' }}>
          Don't just keep an idea in your head. Join NxtWave's free 60-minute live workshop: <br />
          <strong>"Build Your First AI Project in 60 Minutes"</strong> and walk away with a live project.
        </p>

        <button
          className="btn btn-primary"
          style={{ fontSize: '1.15rem', padding: '16px 36px', boxShadow: '0 6px 25px rgba(99, 102, 241, 0.5)' }}
          onClick={onRegisterClick}
        >
          {ctaVariant.button_text} <ArrowRight size={18} />
        </button>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
          {ctaVariant.subtext || '100% Free • No credit card • Instant seat confirmation'}
        </div>
      </div>

      {/* Secondary Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {project.alternative_project_ids && project.alternative_project_ids.length > 0 && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onTryAnother}
            disabled={switching}
            style={{ fontSize: '0.9rem' }}
          >
            <Shuffle size={16} /> {switching ? 'Finding Next Match...' : 'Try Another Project'}
          </button>
        )}

        <button
          type="button"
          className="btn btn-secondary"
          onClick={onRetake}
          style={{ fontSize: '0.9rem' }}
        >
          <RotateCcw size={16} /> Change My Answers
        </button>
      </div>
    </div>
  );
}
