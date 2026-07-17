# Toko Buah — Monorepo

Monorepo untuk aplikasi Toko Buah. Dikelola dengan npm workspaces.

```
toko-buah/
  apps/
    web/              → React + Vite (frontend)
      src/
        api/          → client fetch ke backend (api/client.js)
        components/   → komponen UI reusable
        context/      → AuthContext, CartContext, ProductContext, OrderContext
        pages/        → satu file per halaman
    api/              → Express + SQLite (backend)
      src/
        db.js         → koneksi database & skema tabel
        seed.js        → data awal (akun admin/customer contoh, 4 produk)
        middleware/    → auth.js (cek token JWT & role admin)
        routes/        → auth.js, products.js, orders.js
```

## Menjalankan (2 terminal)

Backend dan frontend jalan terpisah, jadi butuh 2 terminal.

```bash
npm install              # sekali saja, install semua workspace (web + api)

# Terminal 1 — backend (jalan di http://localhost:4000)
npm run dev:api

# Terminal 2 — frontend (jalan di http://localhost:5173)
npm run dev:web
```

Saat pertama kali `npm run dev:api` dijalankan, database SQLite (`apps/api/toko-buah.sqlite`)
otomatis dibuat dan diisi data awal:

| Role     | Email                | Password    |
|----------|-----------------------|-------------|
| Admin    | admin@tokobuah.id     | admin123    |
| Customer | budi@example.com      | customer123 |

Ganti `apps/api/.env` kalau mau ubah `JWT_SECRET` atau port backend.

## Autentikasi & proteksi halaman

- Register lewat `/register` **selalu** jadi role `customer` — tidak bisa daftar sebagai admin
  lewat form publik (role admin cuma ada lewat seed data di atas).
- `/checkout` dan `/riwayat-pesanan` butuh login (siapa saja).
- `/admin/*` butuh login **dan** role admin — kalau belum login ditendang ke `/login`, kalau
  login tapi bukan admin ditendang ke `/katalog`. Ini dicek dua kali: di frontend (route guard,
  `components/RouteGuards.jsx`) dan di backend (`middleware/auth.js`, `requireAdmin`) — jadi
  walau seseorang berhasil mengakali tampilan frontend, API-nya tetap menolak permintaan yang
  tidak berhak.
- Token JWT disimpan di `localStorage` browser, berlaku 7 hari.

## Database

Pakai `node:sqlite` — modul SQLite **bawaan Node.js sendiri** (tersedia sejak Node 22+), jadi
**tidak perlu install/compile library database terpisah** (tidak ada masalah native addon gagal
compile di Windows seperti `better-sqlite3`). Wajar kalau muncul `ExperimentalWarning: SQLite is
an experimental feature` di terminal — itu cuma peringatan, bukan error, aman diabaikan.

Filenya di `apps/api/toko-buah.sqlite` (otomatis dibuat, di-gitignore). Tabelnya:
`users`, `products`, `orders`, `order_items`. Skema lengkap ada di `apps/api/src/db.js`, dan
data awalnya ada di `apps/api/src/seed.js` — dua file ini juga referensi bagus untuk bagian
"Database Schema / ERD" di dokumen PRD.

## Kalau project lokal kamu sudah "berantakan"

Zip ini adalah **versi bersih dan lengkap** dari semua yang sudah kita kerjakan bareng sampai
sejauh ini. Kalau folder project di komputer kamu sudah campur aduk, cara paling aman:

1. Tutup dulu dev server yang sedang jalan (`Ctrl+C` di semua terminal)
2. Hapus/rename folder `toko-buah` yang lama
3. Extract zip ini jadi folder `toko-buah` yang baru
4. `npm install` di root, lalu jalankan `npm run dev:api` dan `npm run dev:web` di 2 terminal

## Troubleshooting instalasi

**Error `EPERM: operation not permitted, rmdir ...` atau `npm warn cleanup Failed to remove`**
(sering muncul di Windows, biasanya bekas percobaan install yang gagal sebelumnya):
1. Tutup semua terminal yang masih menjalankan `npm run dev:api` / `dev:web`
2. Hapus folder `node_modules` di root project secara manual lewat File Explorer (klik kanan →
   Delete), bukan lewat terminal yang sama
3. Hapus juga `package-lock.json` di root kalau ada
4. Jalankan `npm install` lagi dari terminal yang baru

**Kalau backend error saat start dan menyebut `node:sqlite` tidak ditemukan:**
Cek versi Node kamu dengan `node -v` — minimal harus Node 22. Kalau di bawah itu, update Node.js
ke versi terbaru dari [nodejs.org](https://nodejs.org).

## Catatan penting sebelum deploy/kumpul tugas

- `apps/api/.env` isinya `JWT_SECRET` contoh — **wajib diganti** kalau di-deploy sungguhan.
- Password akun seed (`admin123`, `customer123`) juga sebaiknya diganti kalau demo di depan
  banyak orang / di-deploy publik.
