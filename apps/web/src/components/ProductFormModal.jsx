import { useEffect, useState } from 'react'
import MaterialIcon from './MaterialIcon.jsx'
import { CATEGORIES } from '../data/products.js'

const FRUIT_CATEGORIES = CATEGORIES.filter((category) => category !== 'Semua')

// Dipakai kalau admin menambah produk baru tanpa mengisi URL gambar,
// supaya tidak muncul gambar rusak di Katalog maupun tabel admin.
const DEFAULT_IMAGE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBcudFKSsVx9bEBld2pOrb1H1g1K2bgtSCKwcCtTdsOFlBqu1S0jf6FUaigYZK_Yhhg0kGWTO4Dk_4uXSc0hMowll698ObYmnfHBxymuzKPsrL7FCbP3HtLv7GR_NntRs3b9r4h-oLyiDU911OG1HQdfpb3d2Wnyf38kanXyKcnH6qSo7Ktt9h5OkF0Sh5wBeApCBLLzgGkexKJwnqwJfs6xu1cK9N8jGb6gdNYuOAmxl-EDH8RpGP7'

const EMPTY_FORM = {
  name: '',
  sku: '',
  category: FRUIT_CATEGORIES[0],
  origin: 'Lokal',
  price: '',
  unit: 'kg',
  stock: '',
  image: '',
}

const inputClass =
  'w-full px-3 py-2 rounded-lg border border-outline-variant bg-[#faf2ec] text-on-surface focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none transition-colors font-body-md text-body-md'
const labelClass = 'font-label-caps text-label-caps text-on-surface-variant'

export default function ProductFormModal({ open, initialData, errorMessage, onClose, onSubmit }) {
  const [form, setForm] = useState(EMPTY_FORM)

  useEffect(() => {
    setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM)
  }, [initialData, open])

  if (!open) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image: form.image?.trim() || DEFAULT_IMAGE,
    })
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-margin-mobile">
      <div className="bg-surface-container-lowest rounded-xl shadow-lg w-full max-w-md p-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-md">
          <h2 className="font-headline-md text-headline-md text-on-background">
            {initialData ? 'Edit Produk' : 'Tambah Produk'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="text-on-surface-variant hover:text-on-background transition-colors"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
          {errorMessage && (
            <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3">
              {errorMessage}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="name">
              Nama Produk
            </label>
            <input
              id="name"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="sku">
                SKU
              </label>
              <input
                id="sku"
                name="sku"
                required
                value={form.sku}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="category">
                Kategori Buah
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                className={inputClass}
              >
                {FRUIT_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="origin">
                Asal
              </label>
              <select
                id="origin"
                name="origin"
                value={form.origin}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Lokal">Lokal</option>
                <option value="Impor">Impor</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="unit">
                Satuan
              </label>
              <input
                id="unit"
                name="unit"
                placeholder="kg / sisir / ikat"
                required
                value={form.unit}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-sm">
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="price">
                Harga (Rp)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                required
                value={form.price}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className={labelClass} htmlFor="stock">
                Stok
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass} htmlFor="image">
              URL Gambar (opsional)
            </label>
            <input
              id="image"
              name="image"
              placeholder="Kosongkan untuk pakai gambar default"
              value={form.image}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-sm mt-sm">
            <button
              type="button"
              onClick={onClose}
              className="font-label-caps text-label-caps text-on-surface-variant border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="font-label-caps text-label-caps bg-primary text-on-primary px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
