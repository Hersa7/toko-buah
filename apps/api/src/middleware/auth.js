import jwt from 'jsonwebtoken'

// PENTING: di production, JWT_SECRET wajib diisi lewat file .env (lihat .env.example),
// jangan pakai nilai default ini.
export const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-jangan-dipakai-di-production'

export function requireAuth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Belum login. Silakan masuk terlebih dahulu.' })
  }

  const token = header.slice('Bearer '.length)
  try {
    req.user = jwt.verify(token, JWT_SECRET) // { id, name, email, role }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Sesi sudah tidak valid, silakan login lagi.' })
  }
}

export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Halaman ini khusus untuk admin.' })
  }
  next()
}
