import { useFadeIn } from '../hooks/useFadeIn'

const certs = [
  {
    title: 'AWS Academy Cloud Foundations',
    issuer: 'Amazon Web Services',
    date: 'Feb 2026',
    url: 'https://www.credly.com/badges/7dc7c354-2d70-4778-888c-163e21af178c/public_url',
    badge: '☁️',
    accent: '#ff9f43',
    desc: 'Core AWS cloud concepts, services, security, architecture, and pricing.',
  },
  {
    title: 'AWS Deploying Serverless Applications',
    issuer: 'AWS Training & Certification',
    date: 'Dec 2025',
    url: null,
    badge: '⚡',
    accent: '#00d4ff',
    desc: 'Lambda, API Gateway, DynamoDB, and serverless deployment patterns.',
  },
  {
    title: 'AWS Solutions Architecture',
    issuer: 'Forage Virtual Experience',
    date: '2025',
    url: null,
    badge: '🏗️',
    accent: '#7b2fff',
    desc: 'Designing scalable, highly available systems on AWS cloud infrastructure.',
  },
  {
    title: 'Computer Networks & Internet Protocol',
    issuer: 'NPTEL / IIT Kharagpur',
    date: '2025',
    url: null,
    badge: '🌐',
    accent: '#00ff88',
    desc: 'TCP/IP, routing, network security, and internet protocol fundamentals.',
  },
]

const community = [
  {
    title: 'AWS Community Day',
    year: '2025 & 2026',
    icon: '🎤',
    desc: 'Attended sessions on Serverless Architecture (Lambda, API Gateway), Amazon SageMaker for ML model deployment, and Cloud Security best practices — directly applied to Codesuu\'s AWS IAM configuration.',
  },
  {
    title: 'Multi-Cloud Workshop',
    year: 'Dec 2025',
    icon: '🛠️',
    desc: 'Participated in a focused workshop on cloud integration, deployment strategies, and multi-platform infrastructure management across AWS and other cloud providers.',
  },
]

export default function Certifications() {
  const [ref, visible] = useFadeIn()

  return (
    <section id="certifications" ref={ref}>
      <div className="container">
        <p className="section-label">Credentials</p>
        <h2 className="section-title">Certifications</h2>

        <div className={`certs-grid fade-in${visible ? ' visible' : ''}`}>
          {certs.map((c, i) => (
            <div
              className={`cert-card fade-in delay-${i + 1}${visible ? ' visible' : ''}`}
              key={c.title}
              style={{ '--cert-accent': c.accent }}
            >
              <div className="cert-badge-row">
                <div className="cert-badge-icon" style={{ background: `${c.accent}18`, borderColor: `${c.accent}40` }}>
                  {c.badge}
                </div>
                <div className="cert-issuer-badge" style={{ color: c.accent, background: `${c.accent}12`, borderColor: `${c.accent}30` }}>
                  {c.issuer}
                </div>
              </div>
              <div className="cert-title">{c.title}</div>
              <p className="cert-desc">{c.desc}</p>
              <div className="cert-footer">
                <div className="cert-meta">Issued {c.date}</div>
                {c.url && (
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-link"
                    id={`cert-badge-${i}`}
                  >
                    View Badge
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="section-label" style={{ marginTop: 72 }}>Community</p>
        <div className={`community-grid fade-in delay-3${visible ? ' visible' : ''}`}>
          {community.map((c, i) => (
            <div className="community-card" key={c.title}>
              <div className="community-card-header">
                <span className="community-icon">{c.icon}</span>
                <div>
                  <div className="community-card-title">{c.title}</div>
                  <span className="community-card-year">{c.year}</span>
                </div>
              </div>
              <p className="community-card-desc">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
