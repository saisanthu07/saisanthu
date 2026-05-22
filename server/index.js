require('dotenv').config()

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const nodemailer = require('nodemailer')
const rateLimit = require('express-rate-limit')
const { body, validationResult } = require('express-validator')
const crypto = require('crypto')

const app = express()
const PORT = process.env.PORT || 5001

// ─── Security & CORS Middleware ───────────────────────────────────────────────
app.use(express.json())

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://saisanthoshborra.vercel.app',
  'https://portfolio-saisanthu07s-projects.vercel.app'
]

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like server-to-server or test setups)
    if (!origin) return callback(null, true)
    if (ALLOWED_ORIGINS.includes(origin) || /^https:\/\/portfolio-[a-zA-Z0-9-]+\.vercel\.app$/.test(origin)) {
      return callback(null, true)
    }
    return callback(null, 'https://saisanthoshborra.vercel.app')
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'x-admin-key'],
  credentials: true
}))

// Security Headers Middleware (Helmet parity)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'; sandbox; base-uri 'none';")
  next()
})

// Rate limiting — max 5 contact form submissions per 15 min per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'Too many requests. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
})

// Helper: safe timing comparison to prevent timing side-channel attacks
function timingSafeCompare(input, secret) {
  if (!secret || secret.length < 8) return false
  if (typeof input !== 'string') return false
  
  const inputHash = crypto.createHash('sha256').update(input).digest()
  const secretHash = crypto.createHash('sha256').update(secret).digest()
  
  return crypto.timingSafeEqual(inputHash, secretHash)
}

function sanitizeInput(str, maxLength = 2000) {
  if (typeof str !== 'string') return ''
  return str.trim()
    .slice(0, maxLength)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// ─── MongoDB ───────────────────────────────────────────────────────────────────
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err))

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, trim: true, maxlength: 200, default: 'No Subject' },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  ip: String,
  readAt: Date,
}, { timestamps: true })

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema)

// ─── Nodemailer ────────────────────────────────────────────────────────────────
const createTransporter = () => nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Gmail App Password
  },
})

async function sendNotificationEmail(contact) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('📧 Email skipped — SMTP credentials not configured')
    return
  }

  const transporter = createTransporter()

  // Notification to you
  await transporter.sendMail({
    from: `"Portfolio Bot" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    subject: `📬 Portfolio Contact: ${contact.subject || 'New Message'} — from ${contact.name}`,
    html: `
      <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f0f0f8; padding: 40px; border-radius: 12px; border: 1px solid rgba(0,212,255,0.2);">
        <h2 style="color: #00d4ff; margin-bottom: 24px;">New Portfolio Contact 🚀</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 0; color: #8888aa; width: 80px;">Name</td>
            <td style="padding: 12px 0; font-weight: 600;">${contact.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 0; color: #8888aa;">Email</td>
            <td style="padding: 12px 0;"><a href="mailto:${contact.email}" style="color: #00d4ff;">${contact.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
            <td style="padding: 12px 0; color: #8888aa;">Subject</td>
            <td style="padding: 12px 0;">${contact.subject}</td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #8888aa; vertical-align: top;">Message</td>
            <td style="padding: 12px 0; line-height: 1.7;">${contact.message}</td>
          </tr>
        </table>
        <p style="color: #555570; font-size: 12px; margin-top: 32px;">Received at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
      </div>
    `,
  })

  // Auto-reply to sender
  await transporter.sendMail({
    from: `"Sai Santhosh Borra" <${process.env.SMTP_USER}>`,
    to: contact.email,
    subject: `Thanks for reaching out, ${contact.name.split(' ')[0]}! 👋`,
    html: `
      <div style="font-family: system-ui; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #f0f0f8; padding: 40px; border-radius: 12px; border: 1px solid rgba(0,212,255,0.2);">
        <h2 style="color: #00d4ff;">Hey ${contact.name.split(' ')[0]}! 👋</h2>
        <p style="color: #8888aa; line-height: 1.8; margin: 16px 0;">
          Thanks for getting in touch. I've received your message and I'll get back to you as soon as possible — usually within 24 hours.
        </p>
        <blockquote style="border-left: 2px solid rgba(0,212,255,0.3); padding-left: 16px; color: #555570; font-style: italic; margin: 24px 0;">
          "${contact.message.slice(0, 200)}${contact.message.length > 200 ? '...' : ''}"
        </blockquote>
        <p style="color: #8888aa; line-height: 1.8;">
          In the meantime, feel free to check out my work on
          <a href="https://github.com/saisanthu07" style="color: #00d4ff;">GitHub</a> or connect on
          <a href="https://linkedin.com/in/saisanthoshborra/" style="color: #00d4ff;">LinkedIn</a>.
        </p>
        <p style="color: #555570; margin-top: 32px;">— Sai Santhosh</p>
      </div>
    `,
  })
}

// ─── Routes ────────────────────────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mongo: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// Submit contact form
app.post(
  '/api/contact',
  contactLimiter,
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
    body('subject').optional().trim().isLength({ max: 200 }),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg })
    }

    const { name, email, subject, message } = req.body

    try {
      // Save to MongoDB with sanitization to shield against stored injection attacks
      const contact = await Contact.create({
        name: sanitizeInput(name, 100),
        email: email.toLowerCase().trim(),
        subject: subject ? sanitizeInput(subject, 200) : 'No Subject',
        message: sanitizeInput(message, 2000),
        ip: req.ip,
      })

      // Send emails (non-blocking)
      sendNotificationEmail(contact).catch(err =>
        console.error('📧 Email notification failed:', err.message)
      )

      console.log(`📩 New contact from ${contact.name} <${contact.email}>`)

      res.status(201).json({
        success: true,
        message: "Message received! I'll get back to you soon.",
        id: contact._id,
      })
    } catch (err) {
      console.error('❌ Contact save error:', err.message)
      res.status(500).json({ error: 'Server error. Please try again later.' })
    }
  }
)

// Get all submissions (protected by admin key)
app.get('/api/contact/submissions', async (req, res) => {
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
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 50, 100)
    const skip = (page - 1) * limit

    const [contacts, total] = await Promise.all([
      Contact.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Contact.countDocuments(),
    ])

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      count: contacts.length,
      contacts
    })
  } catch (err) {
    console.error('❌ Fetch submissions error:', err.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// ─── Start ─────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio backend running on port ${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/api/health`)
  console.log(`   Frontend: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`)
})
