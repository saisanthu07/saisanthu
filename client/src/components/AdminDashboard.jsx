import { useState, useEffect } from 'react'

export default function AdminDashboard({ onNavigate }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminKey, setAdminKey] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [stats, setStats] = useState({ total: 0, today: 0, latest: null })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMsg, setSelectedMsg] = useState(null)
  
  // Pagination
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const limit = 20

  // Session Storage Auth check on load
  useEffect(() => {
    const savedKey = sessionStorage.getItem('portfolio_admin_key')
    if (savedKey) {
      verifyAndFetch(savedKey)
    }
  }, [page])

  const verifyAndFetch = async (keyToVerify) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`/api/contact/submissions?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': keyToVerify
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid Admin Access Key')
        } else {
          throw new Error('Failed to load submissions')
        }
      }

      const data = await response.json()
      setSubmissions(data.contacts || [])
      setTotalPages(data.pages || 1)
      setIsAuthenticated(true)
      sessionStorage.setItem('portfolio_admin_key', keyToVerify)
      
      // Calculate Stats
      const totalCount = data.total || 0
      const todayCount = (data.contacts || []).filter(item => {
        const itemDate = new Date(item.createdAt)
        const today = new Date()
        return itemDate.toDateString() === today.toDateString()
      }).length

      const latestTime = data.contacts && data.contacts.length > 0 
        ? new Date(data.contacts[0].createdAt).toLocaleString()
        : 'N/A'

      setStats({
        total: totalCount,
        today: todayCount,
        latest: latestTime
      })
    } catch (err) {
      setError(err.message)
      setIsAuthenticated(false)
      sessionStorage.removeItem('portfolio_admin_key')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (!adminKey.trim()) {
      setError('Please enter your admin access key')
      return
    }
    verifyAndFetch(adminKey.trim())
  }

  const handleLogout = () => {
    sessionStorage.removeItem('portfolio_admin_key')
    setIsAuthenticated(false)
    setAdminKey('')
    setSubmissions([])
  }

  // Filter local search results for immediate responsiveness
  const filteredSubmissions = submissions.filter(sub => {
    const term = searchTerm.toLowerCase()
    return (
      (sub.name || '').toLowerCase().includes(term) ||
      (sub.email || '').toLowerCase().includes(term) ||
      (sub.subject || '').toLowerCase().includes(term) ||
      (sub.message || '').toLowerCase().includes(term)
    )
  })

  // Export CSV
  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return

    const headers = ['Name', 'Email', 'Subject', 'Message', 'Date Submitted']
    const rows = filteredSubmissions.map(sub => [
      `"${(sub.name || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${(sub.subject || '').replace(/"/g, '""')}"`,
      `"${(sub.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${new Date(sub.createdAt).toLocaleString()}"`
    ])

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `portfolio_submissions_page_${page}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="admin-portal-wrapper">
      {/* Dynamic lock screen if not verified */}
      {!isAuthenticated ? (
        <div className="admin-lock-screen">
          <div className="admin-lock-card">
            <div className="lock-icon-container">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>Admin submission portal</h2>
            <p className="lock-subtitle">Enter your secret key to view contact form messages</p>
            
            <form onSubmit={handleLoginSubmit} className="admin-lock-form">
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Secret Admin Key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="admin-input-field"
                  disabled={loading}
                />
              </div>
              
              {error && <div className="admin-error-box">{error}</div>}
              
              <button type="submit" className="btn-primary admin-btn" disabled={loading}>
                {loading ? 'Authorizing...' : 'Authorize Access'}
              </button>
              
              <button 
                type="button" 
                onClick={() => onNavigate('/')} 
                className="btn-ghost admin-back-btn"
              >
                Back to Portfolio
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Render beautiful Admin Dashboard */
        <div className="admin-dashboard-view">
          <header className="admin-header">
            <div className="admin-header-title">
              <h1>SANTHU🤍 <span>Admin Portal</span></h1>
              <p className="admin-header-desc">Manage received contact submissions</p>
            </div>
            <div className="admin-header-actions">
              <button onClick={() => onNavigate('/')} className="btn-secondary">
                View Portfolio
              </button>
              <button onClick={handleLogout} className="btn-ghost logout-btn">
                Sign Out
              </button>
            </div>
          </header>

          {/* Stats Bento Grid */}
          <section className="admin-stats-bento">
            <div className="admin-stat-card">
              <div className="asc-icon">✉️</div>
              <div className="asc-data">
                <h3>{stats.total}</h3>
                <p>Total Submissions</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="asc-icon">⚡</div>
              <div className="asc-data">
                <h3>{stats.today}</h3>
                <p>Today's Submissions</p>
              </div>
            </div>
            <div className="admin-stat-card">
              <div className="asc-icon">📅</div>
              <div className="asc-data">
                <h3 className="asc-time-text">{stats.latest}</h3>
                <p>Latest Message Received</p>
              </div>
            </div>
          </section>

          {/* Table / Grid list control bar */}
          <div className="admin-control-bar">
            <div className="search-box-container">
              <input
                type="text"
                placeholder="Search by name, email, content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button 
              onClick={handleExportCSV} 
              disabled={filteredSubmissions.length === 0}
              className="btn-primary csv-btn"
            >
              Export Page to CSV
            </button>
          </div>

          {/* Submissions Cards */}
          {loading ? (
            <div className="admin-loader-container">
              <div className="spinner"></div>
              <span>Fetching submissions...</span>
            </div>
          ) : filteredSubmissions.length === 0 ? (
            <div className="admin-empty-state">
              <p>{searchTerm ? 'No submissions match your search' : 'No submissions found on this page'}</p>
            </div>
          ) : (
            <div className="submissions-grid">
              {filteredSubmissions.map((sub) => (
                <div 
                  key={sub._id} 
                  className="submission-card"
                  onClick={() => setSelectedMsg(sub)}
                >
                  <div className="sc-header">
                    <h4>{sub.name}</h4>
                    <span className="sc-date">{new Date(sub.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="sc-email">{sub.email}</p>
                  <p className="sc-subject">{sub.subject || 'No Subject'}</p>
                  <p className="sc-body-snippet">
                    {sub.message && sub.message.length > 140
                      ? `${sub.message.slice(0, 140)}...`
                      : sub.message
                    }
                  </p>
                  <div className="sc-footer">
                    <span className="read-more-link">Click to expand</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination controls */}
          <div className="admin-pagination">
            <button 
              disabled={page <= 1} 
              onClick={() => setPage(p => Math.max(p - 1, 1))}
              className="btn-ghost prev-btn"
            >
              Previous Page
            </button>
            <span className="page-indicator">Page {page} of {totalPages}</span>
            <button 
              disabled={page >= totalPages} 
              onClick={() => setPage(p => Math.min(p + 1, totalPages))}
              className="btn-ghost next-btn"
            >
              Next Page
            </button>
          </div>
        </div>
      )}

      {/* Rich Details Modal Backdrop */}
      {selectedMsg && (
        <div className="admin-modal-backdrop" onClick={() => setSelectedMsg(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message details</h2>
              <button onClick={() => setSelectedMsg(null)} className="modal-close-btn">&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-meta-row">
                <div>
                  <span className="meta-label">From:</span>
                  <strong>{selectedMsg.name}</strong> ({selectedMsg.email})
                </div>
                <div className="meta-date">
                  {new Date(selectedMsg.createdAt).toLocaleString()}
                </div>
              </div>
              
              <div className="modal-meta-row">
                <div>
                  <span className="meta-label">Subject:</span>
                  <strong>{selectedMsg.subject || 'No Subject'}</strong>
                </div>
              </div>

              <div className="modal-message-content">
                {selectedMsg.message}
              </div>
            </div>

            <div className="modal-footer">
              <a 
                href={`mailto:${selectedMsg.email}?subject=RE: ${encodeURIComponent(selectedMsg.subject || '')}`}
                className="btn-primary"
              >
                Reply via Email
              </a>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(selectedMsg.email)
                  alert('Email address copied to clipboard!')
                }} 
                className="btn-secondary"
              >
                Copy Email Address
              </button>
              <button onClick={() => setSelectedMsg(null)} className="btn-ghost">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
