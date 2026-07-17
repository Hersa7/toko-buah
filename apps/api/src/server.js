import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import './db.js' // pastikan tabel sudah dibuat sebelum server menerima request
import './seed.js' // isi data awal (admin, customer contoh, 4 produk) kalau database masih kosong

import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import orderRoutes from './routes/orders.js'

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'toko-buah-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan.' })
})

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ message: 'Terjadi kesalahan di server.' })
})

app.listen(PORT, () => {
  console.log(`API Toko Buah jalan di http://localhost:${PORT}`)
})
