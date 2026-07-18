# 🍎 Toko Buah

Aplikasi web katalog dan pemesanan buah segar secara online. Dibangun sebagai proyek Ujian Akhir Semester mata kuliah **Pemrograman Web 2**.

Pembeli dapat menjelajahi katalog, mengelola keranjang, dan checkout secara mandiri. Admin toko mendapat dasbor terpisah untuk mengelola stok produk dan status pesanan.

---

## ✨ Fitur Utama

**Customer**
- Registrasi & login (JWT)
- Lihat, cari, dan filter katalog produk per kategori (termasuk kotak pencarian yang tetap bisa diakses di tampilan mobile)
- Kelola keranjang belanja
- Checkout dengan alamat pengiriman & metode pembayaran
- Riwayat pesanan pribadi beserta status
- Halaman Profil (lihat data akun & logout)

**Admin**
- Dashboard ringkasan toko
- CRUD produk (tambah/ubah/hapus, atur stok & harga)
- Kelola seluruh pesanan pelanggan & ubah status pesanan

**Keamanan**
- Password di-hash dengan bcrypt
- Proteksi role admin di sisi backend (bukan hanya tampilan)
- Harga & stok divalidasi ulang dari server saat checkout
- Query database ter-parameterisasi (anti SQL Injection)

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|---|---|
| Frontend | React 18 (Vite), Tailwind CSS, React Router, Context API |
| Backend | Node.js, Express.js |
| Database | SQLite via modul bawaan `node:sqlite` (Node.js ≥ 22) |
| Autentikasi | JSON Web Token (JWT) |
| Arsitektur | Monorepo (npm workspaces) |

---

## 📁 Struktur Proyek

```
toko-buah/
├─ apps/
│  ├─ web/                     → Frontend (React + Vite)
│  │  └─ src/
│  │     ├─ api/               → Client fetch ke backend
│  │     ├─ components/        → Komponen UI reusable
│  │     ├─ context/           → AuthContext, CartContext, ProductContext, OrderContext
│  │     └─ pages/              → Satu file per halaman
│  └─ api/                     → Backend (Express + SQLite)
│     └─ src/
│        ├─ db.js              → Koneksi database & skema tabel
│        ├─ seed.js            → Data awal (akun admin/customer, contoh produk)
│        ├─ middleware/        → Verifikasi JWT & proteksi role admin
│        └─ routes/            → auth.js, products.js, orders.js
└─ docs/
   └─ PRD_Toko_Buah.pdf        → Product Requirement Document
```

---

## 🚀 Menjalankan Secara Lokal

**Prasyarat:** Node.js versi 22 ke atas (cek dengan `node -v`), karena backend menggunakan modul bawaan `node:sqlite`.

```bash
# 1. Clone repository
git clone https://github.com/Hersa7/toko-buah.git
cd toko-buah

# 2. Install semua dependency (frontend + backend sekaligus)
npm install

# 3. Siapkan environment variable backend
cp apps/api/.env.example apps/api/.env
# lalu buka apps/api/.env dan isi JWT_SECRET dengan nilai bebas kamu sendiri
```

Jalankan backend dan frontend di **dua terminal terpisah**:

```bash
# Terminal 1 — backend (http://localhost:4000)
npm run dev:api

# Terminal 2 — frontend (http://localhost:5173)
npm run dev:web
```

Saat backend dijalankan pertama kali, database SQLite (`apps/api/toko-buah.sqlite`) otomatis dibuat dan diisi data awal.

---

## 🔑 Akun Demo (untuk keperluan penilaian/demo)

> ⚠️ Akun di bawah ini hanya untuk keperluan demo/penilaian lokal. **Ganti password ini** (lihat `apps/api/src/seed.js`) sebelum dipakai di lingkungan publik/production sungguhan.

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tokobuah.id` | `admin123` |
| Customer | `budi@example.com` | `customer123` |

---

## 🗄️ Skema Database

Empat tabel utama: `users`, `products`, `orders`, `order_items`.

- `users (1) — (N) orders` — satu pengguna dapat memiliki banyak pesanan
- `orders (1) — (N) order_items` — satu pesanan terdiri dari banyak item
- `products (1) — (N) order_items` — satu produk dapat muncul di banyak item pesanan

Detail kolom lengkap ada di `apps/api/src/db.js` dan pada dokumen PRD (bagian *Database Schema*).

---

## 🌐 Deployment

- **Live demo:** https://toko-buah-web.vercel.app/

---

## 🩹 Troubleshooting

<details>
<summary>Error <code>EPERM: operation not permitted, rmdir ...</code> atau <code>npm warn cleanup Failed to remove</code> (umum di Windows)</summary>

Biasanya disebabkan sisa percobaan install yang gagal sebelumnya.

1. Tutup semua terminal yang masih menjalankan `npm run dev:api` / `dev:web`
2. Hapus folder `node_modules` di root project secara manual lewat File Explorer (klik kanan → Delete), bukan lewat terminal yang sama
3. Hapus juga `package-lock.json` di root kalau ada
4. Jalankan `npm install` lagi dari terminal baru
</details>

<details>
<summary>Backend error saat start dan menyebut <code>node:sqlite</code> tidak ditemukan</summary>

Cek versi Node kamu dengan `node -v` — minimal harus Node 22. Kalau di bawah itu, update Node.js ke versi terbaru dari [nodejs.org](https://nodejs.org).
</details>

<details>
<summary>Muncul <code>ExperimentalWarning: SQLite is an experimental feature</code></summary>

Ini hanya peringatan dari Node.js, bukan error — aman diabaikan.
</details>

---

## 👤 Author

Dikembangkan oleh **Muhammad Hersa Sugiannor** — NIM **2410010253** — sebagai proyek UAS Pemrograman Web 2.
