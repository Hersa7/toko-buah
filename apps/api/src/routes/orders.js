import { Router } from 'express'
import { db, runInTransaction } from '../db.js'
import { requireAuth, requireAdmin } from '../middleware/auth.js'

const router = Router()
const SHIPPING_FEE = 15000

function generateOrderId() {
  let id
  do {
    id = `TB-${Math.floor(10000 + Math.random() * 90000)}`
  } while (db.prepare('SELECT id FROM orders WHERE id = ?').get(id))
  return id
}

function getItemsForOrder(orderId) {
  return db
    .prepare('SELECT * FROM order_items WHERE order_id = ?')
    .all(orderId)
    .map((item) => ({
      id: item.product_id,
      name: item.name,
      unit: item.unit,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    }))
}

function rowToOrder(row) {
  return {
    id: row.id,
    date: row.created_at.slice(0, 10),
    status: row.status,
    customerName: row.customer_name,
    address: { address: row.address, city: row.city, zip: row.zip },
    paymentMethod: row.payment_method,
    subtotal: row.subtotal,
    discount: row.discount,
    shipping: row.shipping_fee,
    total: row.total,
    items: getItemsForOrder(row.id),
  }
}

// Admin lihat SEMUA pesanan. Customer cuma lihat pesanan miliknya sendiri.
// (Ini bagian penting dari "autentikasi": tanpa cek req.user, customer A bisa lihat
// pesanan customer B kalau nebak ID-nya -- makanya query-nya difilter user_id di sini.)
router.get('/', requireAuth, (req, res) => {
  const rows =
    req.user.role === 'admin'
      ? db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all()
      : db
          .prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC')
          .all(req.user.id)

  res.json({ orders: rows.map(rowToOrder) })
})

router.post('/', requireAuth, (req, res) => {
  const { items, address, paymentMethod } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Keranjang kosong, tidak bisa checkout.' })
  }
  if (!address?.firstName || !address?.address || !address?.city || !address?.zip) {
    return res.status(400).json({ message: 'Alamat pengiriman belum lengkap.' })
  }

  // Ambil harga & stok TERKINI langsung dari database -- jangan pernah percaya harga
  // yang dikirim dari frontend, supaya orang tidak bisa akal-akalan ubah harga di browser.
  const productStmt = db.prepare('SELECT * FROM products WHERE id = ?')
  const resolvedItems = []
  for (const item of items) {
    const product = productStmt.get(item.id)
    if (!product) {
      return res.status(400).json({ message: `Produk "${item.name}" tidak ditemukan.` })
    }
    if (product.stock < item.quantity) {
      return res.status(400).json({ message: `Stok "${product.name}" tidak cukup.` })
    }
    resolvedItems.push({ product, quantity: item.quantity })
  }

  const subtotal = resolvedItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const discount = resolvedItems.reduce((sum, i) => {
    if (i.product.badge_variant === 'diskon') {
      return sum + Math.round(i.product.price * i.quantity * 0.1)
    }
    return sum
  }, 0)
  const total = subtotal - discount + SHIPPING_FEE
  const orderId = generateOrderId()
  const customerName = `${address.firstName} ${address.lastName || ''}`.trim() || req.user.name

  const insertOrder = db.prepare(
    `INSERT INTO orders
       (id, user_id, status, customer_name, address, city, zip, payment_method, subtotal, discount, shipping_fee, total)
     VALUES (?, ?, 'diproses', ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
  const insertItem = db.prepare(
    `INSERT INTO order_items (order_id, product_id, name, unit, price, quantity, image)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  )
  const updateStock = db.prepare('UPDATE products SET stock = stock - ? WHERE id = ?')

  // Transaksi: kalau ada satu langkah gagal di tengah, semuanya dibatalkan (rollback otomatis).
  // Ini yang memastikan stok tidak "bocor" berkurang tanpa order-nya tersimpan, atau sebaliknya.
  runInTransaction(() => {
    insertOrder.run(
      orderId,
      req.user.id,
      customerName,
      address.address,
      address.city,
      address.zip,
      paymentMethod || 'transfer_bca',
      subtotal,
      discount,
      SHIPPING_FEE,
      total
    )
    for (const { product, quantity } of resolvedItems) {
      insertItem.run(orderId, product.id, product.name, product.unit, product.price, quantity, product.image)
      updateStock.run(quantity, product.id)
    }
  })

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId)
  res.status(201).json({ order: rowToOrder(row) })
})

router.patch('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body
  const allowedStatus = ['diproses', 'selesai', 'dibatalkan']
  if (!allowedStatus.includes(status)) {
    return res.status(400).json({ message: 'Status tidak valid.' })
  }

  const result = db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, req.params.id)
  if (result.changes === 0) return res.status(404).json({ message: 'Pesanan tidak ditemukan.' })

  const row = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id)
  res.json({ order: rowToOrder(row) })
})

export default router
