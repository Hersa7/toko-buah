import { DatabaseSync } from 'node:sqlite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(__dirname, '..', 'toko-buah.sqlite')

// Pakai modul sqlite BAWAAN Node.js (tersedia sejak Node 22+), bukan library pihak ketiga --
// jadi tidak perlu kompilasi native addon sama sekali. Ini yang bikin masalah "better-sqlite3
// gagal di-install di Windows" hilang total, karena memang tidak ada lagi yang perlu dikompilasi.
export const db = new DatabaseSync(DB_PATH)

db.exec('PRAGMA journal_mode = WAL')
db.exec('PRAGMA foreign_keys = ON')

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'customer', -- 'admin' | 'customer'
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    sku TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,       -- kategori buah: Jeruk/Apel/Pisang/Berry/Tropis (dipakai filter Katalog)
    origin TEXT NOT NULL DEFAULT 'Lokal', -- Lokal/Impor (dipakai Kelola Produk)
    price INTEGER NOT NULL,
    unit TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    image TEXT,
    badge_variant TEXT,
    badge_label TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    status TEXT NOT NULL DEFAULT 'diproses', -- 'diproses' | 'selesai' | 'dibatalkan'
    customer_name TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    zip TEXT NOT NULL,
    payment_method TEXT NOT NULL,
    subtotal INTEGER NOT NULL,
    discount INTEGER NOT NULL DEFAULT 0,
    shipping_fee INTEGER NOT NULL DEFAULT 0,
    total INTEGER NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL REFERENCES orders(id),
    product_id TEXT,
    name TEXT NOT NULL,
    unit TEXT NOT NULL,
    price INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    image TEXT
  );
`)

// node:sqlite tidak punya helper db.transaction(fn) seperti better-sqlite3, jadi dibikin sendiri
// di sini: BEGIN sebelum fn() jalan, COMMIT kalau sukses, ROLLBACK otomatis kalau fn() melempar
// error. Dipakai di routes/orders.js supaya insert order + order_items + update stok
// tetap konsisten (semua berhasil, atau semua dibatalkan -- tidak ada yang "nyangkut" separuh).
export function runInTransaction(fn) {
  db.exec('BEGIN')
  try {
    const result = fn()
    db.exec('COMMIT')
    return result
  } catch (err) {
    db.exec('ROLLBACK')
    throw err
  }
}
