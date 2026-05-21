const { connect } = require('./_db')
const Contact = require('./models/contact')
const { sendNotificationEmail } = require('./_mailer')

// Simple in-memory rate limiter for serverless
const rateLimitMap = new Map()
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_REQUESTS = 5

function checkRateLimit(ip) {
  const now = Date.now()
  const key = ip || 'unknown'
  const record = rateLimitMap.get(key)

  if (!record || now - record.windowStart > WINDOW_MS) {
    rateLimitMap.set(key, { count: 1, windowStart: now })
    return true
  }

  if (record.count >= MAX_REQUESTS) return false

  record.count++
  return true
}

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function validateBody(body) {
  if (!body) return 'Invalid request body'
  const { name, email, message } = body
  if (!name || typeof name !== 'string' || name.trim().length === 0) return 'Name is required'
  if (!name.trim().length > 100) return 'Name must be under 100 characters'
  if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) return 'Valid email is required'
  if (!message || typeof message !== 'string' || message.trim().length < 10) return 'Message must be at least 10 characters'
  if (message.trim().length > 2000) return 'Message must be under 2000 characters'
  return null
}

module.exports = async (req, res) => {
  setCorsHeaders(res)

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  // Rate limiting
  const clientIp = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.connection?.remoteAddress || 'unknown'
  if (!checkRateLimit(clientIp)) {
    return res.status(429).json({ error: 'Too many requests. Please try again after 15 minutes.' })
  }

  const errMsg = validateBody(req.body)
  if (errMsg) return res.status(400).json({ error: errMsg })

  try {
    await connect()
  } catch (err) {
    console.error('DB connection error:', err.message)
    return res.status(503).json({ error: 'Service temporarily unavailable. Please try again later.' })
  }

  const { name, email, subject, message } = req.body

  try {
    const contact = await Contact.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject?.trim() || 'No Subject',
      message: message.trim(),
      ip: clientIp,
    })

    // Fire-and-forget — don't fail the response if email fails
    sendNotificationEmail(contact).catch(err =>
      console.error('Email notification failed:', err.message)
    )

    console.log(`📩 New contact from ${name} <${email}>`)

    return res.status(201).json({
      success: true,
      message: "Message received! I'll get back to you soon.",
      id: contact._id,
    })
  } catch (err) {
    console.error('Contact save error:', err)
    return res.status(500).json({ error: 'Server error. Please try again later.' })
  }
}
