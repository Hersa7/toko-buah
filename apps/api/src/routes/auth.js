import { Router } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { db } from '../db.js'
import { requireAuth, JWT_SECRET } from '../middleware/auth.js'

const router = Router()

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function toPublicUser(user) {
  return { id: user.id, name: user.name, email: user.email, role: user.role }
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Nama, email, dan password wajib diisi.' })
  }
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password minimal 6 karakter.' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail)
  if (existing) {
    return res.status(409).json({ message: 'Email sudah terdaftar. Coba masuk saja.' })
  }

  // Akun baru dari halaman Register SELALU jadi role 'customer'.
  // Role 'admin' cuma ada lewat seed data (lihat src/seed.js), tidak bisa didaftarkan sendiri
  // lewat form publik -- ini penting biar orang sembarangan tidak bisa jadi admin.
  const passwordHash = bcrypt.hashSync(password, 10)
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(name.trim(), normalizedEmail, passwordHash, 'customer')

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid)
  const token = signToken(user)
  res.status(201).json({ token, user: toPublicUser(user) })
})

router.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi.' })
  }

  const normalizedEmail = email.toLowerCase().trim()
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail)

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ message: 'Email atau password salah.' })
  }

  const token = signToken(user)
  res.json({ token, user: toPublicUser(user) })
})

router.get('/me', requireAuth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id)
  if (!user) return res.status(404).json({ message: 'User tidak ditemukan.' })
  res.json({ user: toPublicUser(user) })
})

export default router
