import { useState } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'

const projects = [
  {
    id: '01',
    title: 'Codesuu',
    tagline: 'Real-Time Collaborative Coding Platform',
    category: 'fullstack',
    live: true,
    liveUrl: 'https://codesuu.tech/',
    githubUrl: 'https://github.com/saisanthu07',
    stack: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'WebSockets', 'Clerk Auth', 'AWS EC2'],
    description:
      'A production-grade real-time collaborative coding platform with multi-tenant session isolation, host-controlled RBAC, and WebSocket-based synchronization. Built and shipped in 4 months.',
    bullets: [
      'Architected per-session isolated sandbox environments across a multi-tenant architecture, eliminating cross-session data leakage and supporting 10+ concurrent coding rooms.',
      'Implemented host-controlled session management with real-time participant tracking and room lifecycle handling — reducing session conflict rate by ~60%.',
      'Integrated Clerk for secure authentication with session-based access control and protected routes across the full-stack application.',
    ],
    image: '/codesuu-logo.png',
    accent: '#00d4ff',
  },
  {
    id: '02',
    title: 'Portfolio',
    tagline: 'Personal Portfolio Website',
    category: 'fullstack',
    live: true,
    liveUrl: 'https://saisanthoshborra.vercel.app/',
    githubUrl: 'https://github.com/saisanthu07/portfolio',
    stack: ['Node.js', 'Vercel Serverless', 'MongoDB Atlas', 'Nodemailer', 'Rate Limiting'],
    description:
      'Production serverless API powering this portfolio\'s contact form. Features in-memory rate limiting, rich HTML email notifications to both portfolio owner and sender, MongoDB Atlas persistence, and admin-protected submission viewer.',
    bullets: [
      'Zero-cold-start serverless design using Vercel Functions with cached MongoDB connections via global singleton pattern.',
      'Dual email pipeline: owner notification + auto-reply to sender using Gmail SMTP with styled dark-theme HTML templates.',
      'In-memory IP-based rate limiting (5 req / 15 min) to prevent spam without external dependencies or cold-start overhead.',
    ],
    emoji: '⚡',
    accent: '#7b2fff',
  },
]

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'fullstack', label: 'Full Stack' },
]

export default function Projects() {
  const [ref, visible] = useFadeIn()
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? projects
    : projects.filter(p => p.category === activeFilter)

  return (
    <section id="projects" ref={ref}>
      <div className="container">
        <p className="section-label">Projects</p>
        <h2 className="section-title">Things I've built</h2>

        <div className="project-filters" role="tablist">
          {FILTERS.map(f => (
            <button
              key={f.key}
              className={`filter-btn${activeFilter === f.key ? ' active' : ''}`}
              role="tab"
              aria-selected={activeFilter === f.key}
              id={`filter-${f.key}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filtered.map((p, i) => (
            <div
              className={`project-card fade-in delay-${Math.min(i + 1, 4)}${visible ? ' visible' : ''}`}
              key={p.id}
              style={{ '--accent': p.accent }}
              onMouseMove={e => {
                const card = e.currentTarget
                const rect = card.getBoundingClientRect()
                card.style.setProperty('--x', `${e.clientX - rect.left}px`)
                card.style.setProperty('--y', `${e.clientY - rect.top}px`)
              }}
            >
              <div className="project-body">
                <div className="project-header-row">
                  <p className="project-number">PROJECT — {p.id}</p>
                  {p.live && (
                    <div className="project-live-badge">
                      <span className="project-live-badge-dot" />
                      LIVE
                    </div>
                  )}
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-tagline">{p.tagline}</p>
                <p className="project-desc">{p.description}</p>

                <ul className="project-bullets">
                  {p.bullets.map((b, bi) => (
                    <li key={bi}>{b}</li>
                  ))}
                </ul>

                <div className="project-stack">
                  {p.stack.map(s => (
                    <span className="stack-tag" key={s}>{s}</span>
                  ))}
                </div>

                <div className="project-links">
                  {p.liveUrl && (
                    <a className="project-link primary" href={p.liveUrl} target="_blank" rel="noopener noreferrer" id={`project-${p.id}-live`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                      Live Demo
                    </a>
                  )}
                  <a className="project-link" href={p.githubUrl} target="_blank" rel="noopener noreferrer" id={`project-${p.id}-github`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
                    Source Code
                  </a>
                </div>
              </div>

              <div className="project-visual" aria-hidden="true">
                <div className="project-visual-inner">
                  {p.image ? (
                    <img src={p.image} className="project-visual-img" alt={`${p.title} Logo`} />
                  ) : (
                    <div className="project-visual-icon">{p.emoji}</div>
                  )}
                  <div className="project-visual-glow" />
                  <div className="project-visual-rings">
                    <div className="pvr pvr-1" />
                    <div className="pvr pvr-2" />
                    <div className="pvr pvr-3" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
