import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import Badge from '../components/Badge.jsx'
import StockIndicator from '../components/StockIndicator.jsx'
import ProductFormModal from '../components/ProductFormModal.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { formatRupiah } from '../data/products.js'

const PAGE_SIZE = 5

function stockLevel(stock) {
  if (stock > 50) return 'high'
  if (stock > 10) return 'medium'
  return 'low'
}

export default function ManageProductsPage() {
  const { products, loading, error: loadError, addProduct, updateProduct, deleteProduct } = useProducts()
  const [search, setSearch] = useState('')
  const [originFilter, setOriginFilter] = useState('Semua')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase())
      const matchesOrigin = originFilter === 'Semua' || p.origin === originFilter
      return matchesSearch && matchesOrigin
    })
  }, [products, search, originFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function openAddModal() {
    setEditingProduct(null)
    setFormError('')
    setModalOpen(true)
  }

  function openEditModal(product) {
    setEditingProduct(product)
    setFormError('')
    setModalOpen(true)
  }

  async function handleSubmit(data) {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data)
      } else {
        await addProduct(data)
      }
      setModalOpen(false)
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDelete(product) {
    // TODO: ganti window.confirm dengan dialog konfirmasi yang lebih rapi kalau perlu
    if (!window.confirm(`Hapus "${product.name}" dari daftar produk?`)) return
    try {
      await deleteProduct(product.id)
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <AdminLayout active="produk">
      <header className="mb-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Manajemen Produk
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Kelola inventaris dan detail produk buah segar Anda.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="flex items-center justify-center gap-2 bg-primary text-on-primary font-label-caps text-label-caps px-4 py-3 rounded-lg hover:opacity-90 transition-opacity shrink-0"
        >
          <MaterialIcon name="add" />
          Tambah Produk
        </button>
      </header>

      {loading && (
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Memuat produk...</p>
      )}
      {loadError && (
        <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3 mb-sm">
          {loadError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-sm mb-md">
        <div className="relative flex-grow">
          <MaterialIcon
            name="search"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            placeholder="Cari nama produk..."
            className="w-full pl-10 pr-3 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none font-body-md text-body-md"
          />
        </div>
        <select
          value={originFilter}
          onChange={(e) => {
            setOriginFilter(e.target.value)
            setPage(1)
          }}
          className="px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-lowest font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
        >
          <option value="Semua">Semua Asal</option>
          <option value="Lokal">Lokal</option>
          <option value="Impor">Impor</option>
        </select>
      </div>

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] border border-surface-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Gambar</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Nama Produk
                </th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Asal
                </th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Harga</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Stok</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="p-6 text-center font-body-md text-body-md text-on-surface-variant"
                  >
                    Tidak ada produk yang cocok.
                  </td>
                </tr>
              ) : (
                paged.map((product) => (
                  <tr key={product.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-14 h-14 rounded-md object-cover border border-outline-variant"
                      />
                    </td>
                    <td className="p-4">
                      <p className="font-body-md text-body-md font-semibold text-on-background">
                        {product.name}
                      </p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        SKU: {product.sku} · {product.category}
                      </p>
                    </td>
                    <td className="p-4">
                      <Badge variant={product.origin === 'Impor' ? 'impor' : 'lokal'}>
                        {product.origin}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <span className="font-label-price text-label-price text-secondary">
                        {formatRupiah(product.price)}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">
                        /{product.unit}
                      </span>
                    </td>
                    <td className="p-4">
                      <StockIndicator
                        level={stockLevel(product.stock)}
                        label={`${product.stock} ${product.unit}`}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          aria-label={`Edit ${product.name}`}
                          className="p-2 rounded-md text-on-surface-variant hover:text-primary hover:bg-surface-container-low transition-colors"
                        >
                          <MaterialIcon name="edit" className="text-[20px]" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(product)}
                          aria-label={`Hapus ${product.name}`}
                          className="p-2 rounded-md text-on-surface-variant hover:text-error hover:bg-surface-container-low transition-colors"
                        >
                          <MaterialIcon name="delete" className="text-[20px]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-outline-variant bg-surface-container-low flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} hasil
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-variant disabled:opacity-50 disabled:pointer-events-none"
            >
              <MaterialIcon name="chevron_left" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPage(p)}
                className={
                  p === currentPage
                    ? 'w-9 h-9 rounded-md bg-primary text-on-primary font-label-caps text-label-caps'
                    : 'w-9 h-9 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-variant font-label-caps text-label-caps'
                }
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-variant disabled:opacity-50 disabled:pointer-events-none"
            >
              <MaterialIcon name="chevron_right" />
            </button>
          </div>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        initialData={editingProduct}
        errorMessage={formError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  )
}
