export const CATEGORIES = ['Semua', 'Jeruk', 'Apel', 'Pisang', 'Berry', 'Tropis']

// Ambang batas stok menipis, dipakai di Dashboard Admin & Manajemen Produk.
export const LOW_STOCK_THRESHOLD = 10

// Data produk sekarang datang dari database lewat ProductContext (lihat
// context/ProductContext.jsx & apps/api/src/seed.js untuk data awalnya), jadi file ini
// tinggal isi konstanta yang tidak berubah-ubah saja.

export function formatRupiah(value) {
  return `Rp ${value.toLocaleString('id-ID')}`
}
