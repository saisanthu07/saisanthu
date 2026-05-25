import { useEffect, useState } from 'react'
import { useFadeIn } from '../hooks/useFadeIn'

const educationData = [
  {
    institution: 'Parul University',
    location: 'Vadodara, Gujarat',
    degree: 'Bachelor of Engineering & Technology',
    major: 'Computer Science (Artificial Intelligence)',
    duration: '2023 — 2027',
    grade: '7.25 CGPA',
    status: 'Pursuing',
    icon: '🎓',
    accent: '#00e5ff',
    desc: 'Deep-diving into Artificial Intelligence algorithms, Machine Learning systems, advanced Data Structures & Algorithms, Database Systems, and Cloud Architectures (AWS). Active member of developer spaces and collaborative teams.',
    coursework: ['Artificial Intelligence', 'Machine Learning', 'Data Structures & Algorithms', 'DBMS', 'AWS Cloud']
  },
  {
    institution: 'Narayana Junior College',
    location: 'Visakhapatnam, Andhra Pradesh',
    degree: 'Class XII (Senior Secondary)',
    major: 'MPC (Mathematics, Physics, Chemistry)',
    duration: '2021 — 2023',
    grade: '59.6%',
    status: 'Completed',
    icon: '🏫',
    accent: '#7b2fff',
    desc: 'Built a robust analytical foundation in algebraic structures, classical mechanics, chemical thermodynamics, and laboratory practices.',
    coursework: ['Mathematics', 'Physics', 'Chemistry']
  },
  {
    institution: 'N.S.V School',
    location: 'Jagityal, Telangana',
    degree: 'Class X (Secondary School Certificate)',
    major: 'General Curriculum',
    duration: '2020 — 2021',
    grade: '100% (10.0 GPA)',
    status: 'Completed',
    icon: '🏢',
    accent: '#00ff88',
    desc: 'Completed secondary education with a 100% score, representing exceptional consistency and excellence in sciences and general mathematics.',
    coursework: ['General Science', 'Mathematics', 'Social Sciences']
  }
]

export default function Education() {
  const [ref, visible] = useFadeIn()
  const initialIndex = educationData.findIndex(edu => {
    const deg = (edu.degree || '').toLowerCase()
    const inst = (edu.institution || '').toLowerCase()
    return deg.includes('bachelor') || inst.includes('parul')
  })
  const [current, setCurrent] = useState(initialIndex >= 0 ? initialIndex : 0)
  const total = educationData.length

  useEffect(() => {
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % total)
    }, 6000)
    return () => clearInterval(t)
  }, [total])

  function prev() { setCurrent(c => (c - 1 + total) % total) }
  function next() { setCurrent(c => (c + 1) % total) }
  function goTo(i) { setCurrent(i) }

  return (
    <section id="education" ref={ref}>
      <div className="container">
        <p className="section-label">My Academic Journey</p>
        <h2 className="section-title">Education</h2>

        <div className={`edu-stepper fade-in${visible ? ' visible' : ''}`} aria-roledescription="carousel">
          <div className="edu-points" role="tablist" aria-label="Education steps">
            {educationData.map((edu, i) => (
              <button
                key={edu.institution}
                className={`edu-point-btn ${i === current ? 'active' : i < current ? 'completed' : ''}`}
                onClick={() => goTo(i)}
                aria-current={i === current}
                aria-label={`${edu.institution} ${edu.duration}`}
                style={{ borderColor: edu.accent, color: edu.accent, background: i === current ? edu.accent : 'transparent' }}
              >
                <span className="point-icon">{edu.icon}</span>
              </button>
            ))}
          </div>

          <div className="edu-stage">
            <button className="step-control prev" onClick={prev} aria-label="Previous">‹</button>

            <div className="edu-cards">
              {educationData.map((edu, i) => (
                <article
                  key={edu.institution}
                  className={`edu-card-step ${i === current ? 'active' : i < current ? 'left-of' : 'right-of'}`}
                  style={{ '--edu-accent': edu.accent }}
                  aria-hidden={i !== current}
                >
                  <div className="edu-card-inner">
                    <div className="edu-header">
                      <div>
                        <h3 className="edu-institution">{edu.institution}</h3>
                        <p className="edu-location">{edu.location}</p>
                      </div>
                      <div className="edu-meta-text">
                        <div className="edu-status-badge" style={{ color: edu.accent, background: `${edu.accent}10`, borderColor: `${edu.accent}25` }}>
                          {edu.status}
                        </div>
                        <span className="edu-duration">{edu.duration}</span>
                      </div>
                    </div>

                    <div className="edu-body">
                      <div className="edu-degree">
                        {edu.degree} <br />
                        <span className="edu-major">Specialization: {edu.major}</span>
                      </div>
                      <p className="edu-desc">{edu.desc}</p>
                      {edu.coursework && (
                        <div className="edu-coursework">
                          {edu.coursework.map(course => (
                            <span key={course} className="edu-course-tag">{course}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="edu-footer">
                      <span className="edu-grade-label">Grade / Performance:</span>
                      <span className="edu-grade-value">{edu.grade}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <button className="step-control next" onClick={next} aria-label="Next">›</button>
          </div>
        </div>
      </div>
    </section>
  )
}
