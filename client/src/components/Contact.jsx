import { useState, useCallback, useRef } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'

const initialForm = { name: '', email: '', subject: '', message: '' }
const MAX_MSG = 2000

function Confetti({ active }) {
  if (!active) return null
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 0.6}s`,
    color: ['#00d4ff', '#7b2fff', '#00ff88', '#ffb347', '#ff6b6b'][i % 5],
    size: `${6 + Math.random() * 8}px`,
  }))
  return (
    <div className="confetti-container" aria-hidden="true">
      {pieces.map(p => (
        <div
          key={p.id}
          className="confetti-piece"
          style={{ left: p.left, animationDelay: p.delay, background: p.color, width: p.size, height: p.size }}
        />
      ))}
    </div>
  )
}

export default function Contact() {
  const [ref, visible] = useFadeIn()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const [message, setMessage] = useState('')
  const [confetti, setConfetti] = useState(false)

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (errors[name]) setErrors(er => ({ ...er, [name]: '' }))
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required'
    if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters'
    return errs
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) {
        setStatus('success')
        setMessage(data.message || "Message received! I'll get back to you soon 🚀")
        setForm(initialForm)
        setErrors({})
        setConfetti(true)
        setTimeout(() => setConfetti(false), 3500)
      } else {
        throw new Error(data.error || 'Failed to send')
      }
    } catch (err) {
      setStatus('error')
      setMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  const msgLen = form.message.length

  return (
    <section id="contact" ref={ref}>
      <Confetti active={confetti} />
      <div className="container">
        <p className="section-label">Get In Touch</p>
        <h2 className="section-title">Let's talk</h2>

        <div className={`contact-wrapper fade-in${visible ? ' visible' : ''}`}>
          {/* Contact Info */}
          <div className="contact-info">
            <h3>Available for opportunities</h3>
            <p>
              I'm actively looking for full-stack developer or AWS internship roles. Whether
              you have a project to discuss, a position to fill, or just want to say
              hello — my inbox is always open.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">📧</div>
                <div className="contact-item-text">
                  <span className="contact-item-label">Email</span>
                  <a className="contact-item-value" href="mailto:saisanthoshborra@gmail.com" id="contact-email-link">
                    saisanthoshborra@gmail.com
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">📍</div>
                <div className="contact-item-text">
                  <span className="contact-item-label">Location</span>
                  <span className="contact-item-value">Amalapuram, Andhra Pradesh · Remote & On-site</span>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">💼</div>
                <div className="contact-item-text">
                  <span className="contact-item-label">LinkedIn</span>
                  <a className="contact-item-value" href="https://linkedin.com/in/saisanthoshborra/" target="_blank" rel="noopener noreferrer" id="contact-linkedin-link">
                    /in/saisanthoshborra
                  </a>
                </div>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">🐙</div>
                <div className="contact-item-text">
                  <span className="contact-item-label">GitHub</span>
                  <a className="contact-item-value" href="https://github.com/saisanthu07" target="_blank" rel="noopener noreferrer" id="contact-github-link">
                    @saisanthu07
                  </a>
                </div>
              </div>
            </div>

            <a href="/resume.pdf" download="Sai_Santhosh_Borra_Resume.pdf" className="btn-primary contact-resume-btn" id="contact-resume-btn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download Resume
            </a>
          </div>

          {/* Contact Form */}
          <form className="contact-form" onSubmit={handleSubmit} noValidate id="contact-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="contact-name">Name *</label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  className={`form-input${errors.name ? ' input-error' : ''}`}
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                />
                {errors.name && <span className="field-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="contact-email">Email *</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  className={`form-input${errors.email ? ' input-error' : ''}`}
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
                {errors.email && <span className="field-error">{errors.email}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Subject</label>
              <input
                id="contact-subject"
                name="subject"
                type="text"
                className="form-input"
                placeholder="What's this about?"
                value={form.subject}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="contact-message">Message *</label>
                <span className={`char-count${msgLen > MAX_MSG * 0.9 ? ' warn' : ''}`}>
                  {msgLen}/{MAX_MSG}
                </span>
              </div>
              <textarea
                id="contact-message"
                name="message"
                className={`form-textarea${errors.message ? ' input-error' : ''}`}
                placeholder="Tell me about your project, opportunity, or just say hi..."
                value={form.message}
                onChange={handleChange}
                required
                maxLength={MAX_MSG}
              />
              {errors.message && <span className="field-error">{errors.message}</span>}
            </div>

            <button
              type="submit"
              className="form-submit"
              id="contact-submit-btn"
              disabled={status === 'loading'}
            >
              {status === 'loading' ? (
                <>
                  <span className="spinner" />
                  Sending...
                </>
              ) : (
                <>
                  Send Message
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </>
              )}
            </button>

            {message && (
              <div className={`form-message ${status === 'success' ? 'success' : 'error'}`} role="alert">
                {status === 'success' && <span className="form-message-icon">🎉</span>}
                {status === 'error' && <span className="form-message-icon">⚠️</span>}
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
