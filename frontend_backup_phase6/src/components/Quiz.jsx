import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Cpu, 
  Code2, 
  Sparkles, 
  Target, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Terminal
} from 'lucide-react';
import { 
  trackQuizStarted, 
  trackQuizQuestionViewed, 
  trackQuizQuestionCompleted 
} from '../services/analytics.js';

export default function Quiz({ onComplete, initialAnswers = null }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState(initialAnswers || {
    year_of_study: 1,
    branch: '',
    coding_level: '',
    interest_area: '',
    primary_goal: '',
    preferred_tech: 'Python'
  });

  const totalSteps = 5;

  useEffect(() => {
    trackQuizStarted();
  }, []);

  useEffect(() => {
    if (initialAnswers) {
      setAnswers(initialAnswers);
    }
  }, [initialAnswers]);

  useEffect(() => {
    trackQuizQuestionViewed(currentStep - 1, totalSteps);
  }, [currentStep]);

  const questions = [
    {
      id: 1,
      title: "What year of engineering are you in?",
      subtitle: "We calibrate project complexity so you don't hit confusing roadblocks.",
      field: "year_of_study",
      options: [
        { value: 1, label: "1st Year", hint: "Build your first AI project without needing advanced coding" },
        { value: 2, label: "2nd Year", hint: "Turn classroom concepts into a real, functioning project" },
        { value: 3, label: "3rd Year", hint: "Build a solid portfolio piece for internships and GitHub" },
        { value: 4, label: "4th Year", hint: "Build a practical demonstration project for placement interviews" }
      ]
    },
    {
      id: 2,
      title: "What is your engineering branch?",
      subtitle: "We'll suggest projects with direct relevance to your field.",
      field: "branch",
      options: [
        { value: "Computer Science / CSE", label: "Computer Science / CSE" },
        { value: "Information Technology / IT", label: "Information Technology / IT" },
        { value: "Electronics / ECE", label: "Electronics / ECE" },
        { value: "Electrical / EEE", label: "Electrical / EEE" },
        { value: "Mechanical", label: "Mechanical Engineering" },
        { value: "Civil", label: "Civil Engineering" },
        { value: "Other", label: "Other Branch" }
      ]
    },
    {
      id: 3,
      title: "How comfortable are you with coding right now?",
      subtitle: "Be honest — our 60-minute workshop is designed to support beginners through advanced.",
      field: "coding_level",
      options: [
        { value: "Beginner", label: "Beginner", hint: "Know basic syntax or just getting started with programming" },
        { value: "Intermediate", label: "Intermediate", hint: "Comfortable writing Python, C++, or Java logic and functions" },
        { value: "Advanced", label: "Advanced", hint: "Experience with frameworks, APIs, and data structures" }
      ]
    },
    {
      id: 4,
      title: "What area of technology interests you most?",
      subtitle: "Choose the domain you want your project to solve a problem in.",
      field: "interest_area",
      options: [
        { value: "AI / Machine Learning", label: "AI / Machine Learning", hint: "Generative AI, assistants, computer vision" },
        { value: "Cybersecurity", label: "Cybersecurity & Defense", hint: "Phishing detection, vulnerability auditing" },
        { value: "Data / Analytics", label: "Data / Analytics", hint: "Personal analytics, trend forecasting, dashboards" },
        { value: "Web Development", label: "Web Development", hint: "Interactive web tools, chatbots, portfolios" },
        { value: "Automation", label: "Automation & Smart Systems", hint: "IoT sensor analysis, task automation" },
        { value: "Productivity", label: "Productivity Tools", hint: "Lecture summarizers, flashcard generators" }
      ]
    },
    {
      id: 5,
      title: "What is your primary goal right now?",
      subtitle: "What is the single most valuable outcome for you?",
      field: "primary_goal",
      options: [
        { value: "Explore AI", label: "Explore AI", hint: "Curious to see what AI can actually do in code" },
        { value: "Learn by building", label: "Learn by building", hint: "Hands-on experience rather than watching another tutorial" },
        { value: "Build a portfolio", label: "Build a portfolio", hint: "Create a GitHub repository you can share with peers" },
        { value: "Prepare for placements/career", label: "Prepare for placements / career", hint: "Have an impressive talking point for upcoming interviews" },
        { value: "Solve a practical problem", label: "Solve a practical problem", hint: "Build a tool you will actually use in college life" }
      ]
    }
  ];

  const currentQ = questions[currentStep - 1];
  const currentValue = answers[currentQ.field];

  const handleSelect = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.field]: val }));
    trackQuizQuestionCompleted(currentStep - 1, val);
  };

  const handleNext = () => {
    if (!currentValue) return;
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      const finalAnswers = { ...answers, [currentQ.field]: currentValue };
      console.log("[QUIZ FINAL PROFILE]", finalAnswers);
      onComplete(finalAnswers);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div style={{ maxWidth: '720px', margin: '20px auto', padding: '0 16px' }}>
      {/* Progress Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            QUESTION {currentStep} OF {totalSteps}
          </span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
            {Math.round(progressPercent)}% COMPLETED
          </span>
        </div>
        <div style={{
          height: '6px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} />
        </div>
      </div>

      {/* Main Question Panel */}
      <div className="glass-panel" style={{ padding: '36px 32px', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '8px', lineHeight: 1.3 }}>
          {currentQ.title}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '28px' }}>
          {currentQ.subtitle}
        </p>

        {/* Options Grid */}
        <div 
          role="radiogroup" 
          aria-label={currentQ.title}
          style={{
            display: 'grid',
            gridTemplateColumns: currentQ.options.length > 4 ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '12px',
            marginBottom: '32px'
          }}
        >
          {currentQ.options.map((opt, idx) => {
            const isSelected = currentValue === opt.value;

            return (
              <button
                key={idx}
                type="button"
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onClick={() => handleSelect(opt.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(opt.value);
                  }
                }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '16px 20px',
                  background: isSelected ? 'rgba(99, 102, 241, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 0 15px rgba(99, 102, 241, 0.25)' : 'none'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1rem', color: isSelected ? '#ffffff' : 'var(--text-primary)' }}>
                    {opt.label}
                  </div>
                  {opt.hint && (
                    <div style={{ fontSize: '0.82rem', color: isSelected ? '#c7d2fe' : 'var(--text-muted)', marginTop: '4px' }}>
                      {opt.hint}
                    </div>
                  )}
                </div>

                <div style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--text-muted)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '2px',
                  background: isSelected ? 'var(--accent-primary)' : 'transparent'
                }}>
                  {isSelected && <CheckCircle2 size={14} color="#ffffff" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional preferred tech selector on step 5 */}
        {currentStep === 5 && (
          <div style={{
            padding: '16px 20px',
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '32px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
              <Terminal size={16} color="var(--accent-primary)" />
              <span>Preferred Tech Stack (Optional)</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Python', 'JavaScript', 'Java', 'No preference'].map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setAnswers(prev => ({ ...prev, preferred_tech: t }))}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    background: answers.preferred_tech === t ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${answers.preferred_tech === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    color: answers.preferred_tech === t ? '#a5b4fc' : 'var(--text-secondary)',
                    cursor: 'pointer'
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
          {currentStep > 1 ? (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleBack}
              style={{ padding: '12px 20px' }}
            >
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!currentValue}
            style={{
              padding: '12px 28px',
              opacity: currentValue ? 1 : 0.5,
              cursor: currentValue ? 'pointer' : 'not-allowed'
            }}
          >
            {currentStep === totalSteps ? 'Discover My Project' : 'Continue'} <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
