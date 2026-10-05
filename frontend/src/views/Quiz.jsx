import { ArrowLeft, ArrowRight, Check, Code2, GraduationCap, Lightbulb, Target } from 'lucide-react'
import { useMemo, useState } from 'react'

const questions = [
  { key: 'year_of_study', title: 'Which year are you in?', hint: 'We’ll adjust complexity and career relevance.', icon: GraduationCap, options: [[1,'1st Year'],[2,'2nd Year'],[3,'3rd Year'],[4,'4th Year']] },
  { key: 'branch', title: 'What is your engineering branch?', hint: 'Your branch helps us make the project feel relevant.', icon: Lightbulb, options: ['Computer Science / CSE','Information Technology / IT','Electronics / ECE','Electrical / EEE','Mechanical','Civil','Other'] },
  { key: 'coding_level', title: 'How comfortable are you with coding?', hint: 'No judgment — we’ll match the build to your current level.', icon: Code2, options: ['Beginner','Intermediate','Advanced'] },
  { key: 'interest_area', title: 'What are you most curious to build?', hint: 'This helps us match the project category, not just the tech stack.', icon: Lightbulb, options: ['AI / Machine Learning','Cybersecurity','Web Development','Data / Analytics','Automation','Productivity','Other'] },
  { key: 'primary_goal', title: 'What do you want this project to do for you?', hint: 'Your goal changes what “best project” means.', icon: Target, options: ['Explore AI','Learn by building','Build a portfolio','Prepare for placements/career','Solve a practical problem'] },
]

export default function Quiz({ onComplete }) {
  const [step, setStep] = useState(0)
  const [profile, setProfile] = useState({ year_of_study: '', branch: '', coding_level: '', interest_area: '', primary_goal: '', preferred_tech: 'No preference' })
  const q = questions[step]
  const value = profile[q.key]
  const progress = ((step + 1) / questions.length) * 100
  const Icon = q.icon

  const selectedLabel = useMemo(() => {
    if (q.key === 'year_of_study') return q.options.find(([v]) => v === value)?.[1]
    return value
  }, [q, value])

  function choose(v) { setProfile(current => ({ ...current, [q.key]: v })) }
  function next() {
    if (!value) return
    if (step < questions.length - 1) setStep(s => s + 1)
    else onComplete({ ...profile }) // single source of truth; current profile is submitted directly
  }

  return (
    <main className="quiz-layout shell">
      <aside className="quiz-sidebar">
        <span className="eyebrow">PROJECT MATCHER</span>
        <h2>5 questions.<br/>One right project.</h2>
        <div className="quiz-steps">
          {questions.map((item, i) => (
            <div key={item.key} className={i === step ? 'current' : i < step ? 'done' : ''}>
              <span className="step-dot">{i < step ? <Check size={14}/> : i + 1}</span><span>{['Year','Branch','Coding','Interest','Goal'][i]}</span>
            </div>
          ))}
        </div>
        <div className="quiz-progress"><i style={{ width: `${progress}%` }}/></div>
        <small>{Math.round(progress)}% complete</small>
      </aside>

      <section className="question-panel">
        <div className="question-meta"><span>QUESTION {step + 1} OF {questions.length}</span><strong>{selectedLabel || 'Choose one'}</strong></div>
        <div className="question-title"><span className="question-icon"><Icon /></span><div><h1>{q.title}</h1><p>{q.hint}</p></div></div>
        <div className={`options-grid ${q.options.length > 4 ? 'compact' : ''}`} role="radiogroup" aria-label={q.title}>
          {q.options.map((item) => {
            const optionValue = Array.isArray(item) ? item[0] : item
            const label = Array.isArray(item) ? item[1] : item
            const selected = optionValue === value
            return <button key={label} role="radio" aria-checked={selected} className={`option-card ${selected ? 'selected' : ''}`} onClick={() => choose(optionValue)}><span className="radio-mark">{selected && <Check size={14}/>}</span><strong>{label}</strong></button>
          })}
        </div>
        {step === questions.length - 1 && (
          <div className="tech-preference"><span>Optional tech preference</span><select value={profile.preferred_tech} onChange={e => setProfile(v => ({ ...v, preferred_tech: e.target.value }))}><option>No preference</option><option>Python</option><option>JavaScript</option><option>Java</option></select></div>
        )}
        <div className="question-actions">
          <button className="btn btn-secondary" disabled={step === 0} onClick={() => setStep(s => s - 1)}><ArrowLeft size={17}/> Back</button>
          <button className="btn btn-primary" disabled={!value} onClick={next}>{step === questions.length - 1 ? 'Discover My Project' : 'Continue'} <ArrowRight size={17}/></button>
        </div>
      </section>
    </main>
  )
}
