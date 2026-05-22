const { connect } = require('../_db')
const Contact = require('../models/contact')
const crypto = require('crypto')

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://saisanthoshborra.vercel.app',
  'https://portfolio-saisanthu07s-projects.vercel.app'
]

function getCorsOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return 'https://saisanthoshborra.vercel.app'
  
  if (ALLOWED_ORIGINS.includes(origin)) return origin
  
  // Allow custom Vercel preview domains safely
  if (/^https:\/\/portfolio-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
    return origin
  }
  
  return 'https://saisanthoshborra.vercel.app'
}

function setSecurityHeaders(req, res) {
  const origin = getCorsOrigin(req)
  res.setHeader('Access-Control-Allow-Origin', origin)
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key')
  
  // Security Headers (Helmet Equivalent)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; sandbox; base-uri 'none';")
}

function timingSafeCompare(input, secret) {
  if (!secret || secret.length < 8) {
    // Fail closed if the secret key is unset or too short to be secure
    return false
  }
  if (typeof input !== 'string') return false
  
  const inputHash = crypto.createHash('sha256').update(input).digest()
  const secretHash = crypto.createHash('sha256').update(secret).digest()
  
  return crypto.timingSafeEqual(inputHash, secretHash)
}

module.exports = async (req, res) => {
  setSecurityHeaders(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Failsafe configuration guard
  if (!process.env.ADMIN_KEY || process.env.ADMIN_KEY.length < 8) {
    console.error('❌ Configuration Guard: ADMIN_KEY environment variable is unset or weaker than 8 characters.')
    return res.status(500).json({ error: 'Authentication engine misconfigured.' })
  }

  const adminKey = req.headers['x-admin-key']
  if (!adminKey || !timingSafeCompare(adminKey, process.env.ADMIN_KEY)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    await connect()
  } catch (err) {
    console.error('Submissions DB connection failed:', err.message)
    return res.status(503).json({ error: 'Database unavailable' })
  }

  try {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const skip = (page - 1) * limit

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(),
    ])

    return res.status(200).json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: contacts.length,
      contacts,
    })
  } catch (err) {
    console.error('Submissions fetch error:', err.message)
    return res.status(500).json({ error: 'Server error' })
  }
}
