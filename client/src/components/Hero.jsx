import { useState, useEffect, useRef, useCallback } from 'react'

const roles = [
  'MERN Full-Stack Developer',
  'AWS Cloud Enthusiast',
  'CSE (AI) Student',
  'Open Source Builder',
]

const CODE_SNIPPETS = [
  { code: 'const app = express()', color: '#00d4ff' },
  { code: 'await mongoose.connect(uri)', color: '#7b2fff' },
  { code: 'useEffect(() => {}, [])', color: '#00ff88' },
  { code: 'npm run build', color: '#ffb347' },
  { code: 'git push origin main', color: '#00d4ff' },
  { code: 'docker build -t app .', color: '#ff6b6b' },
  { code: 'aws s3 sync ./dist s3://bucket', color: '#ffb347' },
  { code: 'const [state, setState]', color: '#7b2fff' },
  { code: 'socket.emit("update")', color: '#00ff88' },
  { code: 'SELECT * FROM users', color: '#00d4ff' },
]

function FloatingCodeSnippet({ snippet, index }) {
  const style = {
    '--delay': `${index * 1.3}s`,
    '--dur': `${14 + index * 1.7}s`,
    '--x': `${5 + (index * 13) % 85}%`,
    '--color': snippet.color,
  }
  return (
    <div className="float-snippet" style={style}>
      <span>{snippet.code}</span>
    </div>
  )
}

export default function Hero() {
  const [roleIdx, setRoleIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [deleting, setDeleting] = useState(false)
  const heroRef = useRef(null)

  // Typewriter effect
  useEffect(() => {
    const target = roles[roleIdx]
    let timeout
    if (!deleting && displayed.length < target.length) {
      timeout = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 75)
    } else if (!deleting && displayed.length === target.length) {
      timeout = setTimeout(() => setDeleting(true), 2400)
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 38)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setRoleIdx(i => (i + 1) % roles.length)
    }
    return () => clearTimeout(timeout)
  }, [displayed, deleting, roleIdx])

  // Mouse spotlight effect
  const handleMouseMove = useCallback(e => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    heroRef.current.style.setProperty('--mx', `${e.clientX - rect.left}px`)
    heroRef.current.style.setProperty('--my', `${e.clientY - rect.top}px`)
  }, [])

  const scrollTo = id => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })

  return (
    <section className="hero" id="hero" ref={heroRef} onMouseMove={handleMouseMove}>
      {/* Floating code snippets */}
      <div className="hero-floats" aria-hidden="true">
        {CODE_SNIPPETS.map((s, i) => <FloatingCodeSnippet key={i} snippet={s} index={i} />)}
      </div>

      {/* Mouse spotlight */}
      <div className="hero-spotlight" aria-hidden="true" />

      <div className="container">
        <div className="hero-grid">
          <div className="hero-content fade-in visible">
            <div className="hero-status">
              <span className="hero-status-dot" />
              Open to Opportunities (Internships & Full-Time)
            </div>

            <h1 className="hero-name">
              Borra Sai<br />
              <span className="hero-name-highlight">Santhosh</span>
            </h1>

            <p className="hero-role" aria-live="polite">
              &gt; <span>{displayed}</span>
              <span className="cursor" aria-hidden="true" />
            </p>

            <p className="hero-summary">
              Computer Science (AI) student building production-ready full-stack applications
              with the MERN stack. AWS hands-on deployment experience on EC2,
              S3, CloudFront, and Lambda. I turn complex problems into clean, scalable systems.
            </p>

            <div className="hero-actions">
              <button className="btn-primary" id="hero-view-projects-btn" onClick={() => scrollTo('#projects')}>
                View Projects
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <a
                className="btn-secondary"
                href="/resume.pdf"
                download="Sai_Santhosh_Borra_Resume.pdf"
                id="hero-download-resume-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download CV
              </a>
              <button className="btn-ghost" id="hero-contact-btn" onClick={() => scrollTo('#contact')}>
                Get in Touch
              </button>
            </div>

            <div className="hero-socials">
              <span className="hero-socials-label">Find me on</span>
              <a className="social-link" href="https://github.com/saisanthu07" target="_blank" rel="noopener noreferrer" title="GitHub" id="hero-github-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
              </a>
              <a className="social-link" href="https://linkedin.com/in/saisanthoshborra/" target="_blank" rel="noopener noreferrer" title="LinkedIn" id="hero-linkedin-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a className="social-link" href="mailto:saisanthoshborra@gmail.com" title="Email" id="hero-email-link">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/></svg>
              </a>
            </div>
          </div>

          <div className="hero-visual fade-in visible">
            <div className="hero-profile-card">
              <div className="hpc-inner">
                <img src="/profile.jpg" className="hpc-img" alt="Borra Sai Santhosh" />
                <div className="hpc-glow" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hero-scroll" aria-hidden="true">
        <span>scroll</span>
        <div className="hero-scroll-line" />
      </div>
    </section>
  )
}
