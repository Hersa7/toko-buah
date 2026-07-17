import { Router } from 'express'
import { db } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()

function rowToProduct(row) {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    category: row.category,
    origin: row.origin,
    price: row.price,
    unit: row.unit,
    stock: row.stock,
    image: row.image,
    badge: row.badge_variant ? { variant: row.badge_variant, label: row.badge_label } : null,
  }
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Publik: siapa pun (termasuk yang belum login) bisa lihat katalog produk.
router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all()
  res.json({ products: rows.map(rowToProduct) })
})

// Khusus admin di bawah sini.
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, sku, category, origin, price, unit, stock, image, badge } = req.body

  if (!name || !sku || !category || !price || !unit) {
    return res.status(400).json({ message: 'Nama, SKU, kategori, harga, dan satuan wajib diisi.' })
  }

  const id = slugify(sku)
  const existing = db.prepare('SELECT id FROM products WHERE id = ? OR sku = ?').get(id, sku)
  if (existing) {
    return res.status(409).json({ message: 'SKU sudah dipakai produk lain.' })
  }

  db.prepare(
    `INSERT INTO products (id, sku, name, category, origin, price, unit, stock, image, badge_variant, badge_label)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    sku,
    name,
    category,
    origin || 'Lokal',
    Number(price),
    unit,
    Number(stock) || 0,
    image || null,
    badge?.variant || null,
    badge?.label || null
  )

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(id)
  res.status(201).json({ product: rowToProduct(row) })
})

router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  if (!existing) return res.status(404).json({ message: 'Produk tidak ditemukan.' })

  const { name, sku, category, origin, price, unit, stock, image, badge } = req.body

  db.prepare(
    `UPDATE products
     SET name = ?, sku = ?, category = ?, origin = ?, price = ?, unit = ?, stock = ?, image = ?,
         badge_variant = ?, badge_label = ?
     WHERE id = ?`
  ).run(
    name ?? existing.name,
    sku ?? existing.sku,
    category ?? existing.category,
    origin ?? existing.origin,
    price != null ? Number(price) : existing.price,
    unit ?? existing.unit,
    stock != null ? Number(stock) : existing.stock,
    image ?? existing.image,
    badge ? badge.variant : existing.badge_variant,
    badge ? badge.label : existing.badge_label,
    req.params.id
  )

  const row = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id)
  res.json({ product: rowToProduct(row) })
})

router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const result = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ message: 'Produk tidak ditemukan.' })
  res.status(204).end()
})

export default router
