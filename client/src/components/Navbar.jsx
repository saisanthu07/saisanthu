import { useState, useEffect, useRef } from 'react'

const links = [
  { label: 'About', href: '#about' },
  { label: 'Education', href: '#education' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certs', href: '#certifications' },
  { label: 'Contact', href: '#contact', cta: true },
]

const sectionIds = ['hero', 'about', 'education', 'skills', 'projects', 'certifications', 'contact']

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const handleNav = (e, href) => {
    e.preventDefault()
    setOpen(false)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  const isActive = href => {
    const sectionId = href.replace('#', '')
    return activeSection === sectionId
  }

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}`} role="navigation" aria-label="Main navigation">
      <div className="container">
        <div className="navbar-inner">
          <a className="navbar-logo" href="#hero" onClick={e => handleNav(e, '#hero')}>
            <span>SANTHU</span>🤍
          </a>

          <ul className="navbar-links" role="list">
            {links.map(l => (
              <li key={l.label}>
                <a
                  href={l.href}
                  className={`${l.cta ? 'navbar-cta' : ''}${!l.cta && isActive(l.href) ? ' nav-active' : ''}`}
                  onClick={e => handleNav(e, l.href)}
                  aria-current={isActive(l.href) ? 'true' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            className={`hamburger${open ? ' open' : ''}`}
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            <span /><span /><span />
          </button>
        </div>

        <div className={`mobile-menu${open ? ' open' : ''}`} role="menu">
          {links.map(l => (
            <a
              key={l.label}
              href={l.href}
              role="menuitem"
              className={isActive(l.href) ? 'mobile-active' : ''}
              onClick={e => handleNav(e, l.href)}
            >
              {l.label}
              {isActive(l.href) && <span className="mobile-active-dot" />}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
