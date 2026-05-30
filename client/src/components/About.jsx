import { useState, useEffect } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'

const stats = [
  { number: 1, suffix: '+', label: 'Production Apps', icon: '🚀' },
  { number: 2, suffix: '+', label: 'AWS Certifications', icon: '☁️' },
]

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let startTime = null
    const step = timestamp => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, start])
  return count
}

function StatCard({ stat, animStart }) {
  const count = useCountUp(stat.number, 1600, animStart)
  return (
    <div className="stat-card">
      <div className="stat-icon">{stat.icon}</div>
      <div className="stat-number">{count}{stat.suffix}</div>
      <div className="stat-label">{stat.label}</div>
    </div>
  )
}

export default function About() {
  const [ref, visible] = useFadeIn()
  const [animStart, setAnimStart] = useState(false)
  useEffect(() => { if (visible) setAnimStart(true) }, [visible])

  return (
    <section id="about" ref={ref}>
      <div className="container">
        <p className="section-label">About Me</p>
        <div className="about-grid">
          <div className={`about-text fade-in${visible ? ' visible' : ''}`}>
            <h2 className="section-title" style={{ marginBottom: 24 }}>
              Building things that<br />actually ship.
            </h2>
            <p>
              I'm a <strong>Computer Science (AI)</strong> student at Parul University,
              Vadodara, graduating May 2027. I specialize in the MERN stack and have
              hands-on cloud deployment experience with <strong>AWS EC2, S3, CloudFront,
              and Lambda</strong>.
            </p>
            <p>
              My approach is simple: I care about the <strong>full journey</strong> — from
              designing architecture to debugging production CORS errors at 2am. I've
              shipped <strong>Codesuu</strong>, a real-time collaborative coding platform
              used by 10+ concurrent teams simultaneously.
            </p>
            <p>
              Currently seeking a <strong>full-stack or backend developer role</strong> where
              I can contribute to scalable systems and grow alongside a strong engineering team.
            </p>
            <div className="about-actions">
              <a href="/resume.pdf" download="Sai_Santhosh_Borra_Resume.pdf" className="btn-primary" id="about-resume-btn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Resume
              </a>
              <a href="https://linkedin.com/in/saisanthoshborra/" target="_blank" rel="noopener noreferrer" className="btn-secondary" id="about-linkedin-btn">
                View LinkedIn
              </a>
            </div>
          </div>

          <div className={`about-stats fade-in delay-2${visible ? ' visible' : ''}`}>
            {stats.map(s => (
              <StatCard key={s.label} stat={s} animStart={animStart} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
