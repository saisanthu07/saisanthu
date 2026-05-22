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
    desc: 'Completed secondary education with a perfect score, representing exceptional consistency and excellence in sciences and general mathematics.',
    coursework: ['General Science', 'Mathematics', 'Social Sciences']
  }
]

export default function Education() {
  const [ref, visible] = useFadeIn()

  return (
    <section id="education" ref={ref}>
      <div className="container">
        <p className="section-label">My Academic Journey</p>
        <h2 className="section-title">Education</h2>

        <div className={`edu-grid fade-in${visible ? ' visible' : ''}`}>
          {educationData.map((edu, i) => (
            <div
              key={edu.institution}
              className={`edu-card fade-in delay-${i + 1}${visible ? ' visible' : ''}`}
              style={{ '--edu-accent': edu.accent }}
            >
              <div className="edu-header">
                <div className="edu-icon-container" style={{ background: `${edu.accent}18`, borderColor: `${edu.accent}40`, color: edu.accent }}>
                  {edu.icon}
                </div>
                <div className="edu-meta-text">
                  <div className="edu-status-badge" style={{ color: edu.accent, background: `${edu.accent}10`, borderColor: `${edu.accent}25` }}>
                    {edu.status}
                  </div>
                  <span className="edu-duration">{edu.duration}</span>
                </div>
              </div>

              <div className="edu-body">
                <h3 className="edu-institution">{edu.institution}</h3>
                <p className="edu-location">{edu.location}</p>
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
          ))}
        </div>
      </div>
    </section>
  )
}
