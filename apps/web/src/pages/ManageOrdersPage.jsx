import { useMemo, useState } from 'react'
import AdminLayout from '../components/AdminLayout.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useOrders } from '../context/OrderContext.jsx'
import { ORDER_STATUS } from '../data/orders.js'
import { formatRupiah } from '../data/products.js'

const PAGE_SIZE = 5

const FILTERS = [
  { value: 'semua', label: 'Semua' },
  { value: 'diproses', label: 'Diproses' },
  { value: 'selesai', label: 'Selesai' },
  { value: 'dibatalkan', label: 'Dibatalkan' },
]

function formatDate(isoDate) {
  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function ManageOrdersPage() {
  const { orders, loading, error, updateOrderStatus } = useOrders()
  const [filter, setFilter] = useState('semua')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (filter === 'semua') return orders
    return orders.filter((order) => order.status === filter)
  }, [orders, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  function handleFilterChange(value) {
    setFilter(value)
    setPage(1)
  }

  async function handleStatusChange(orderId, status) {
    try {
      await updateOrderStatus(orderId, status)
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <AdminLayout active="pesanan">
      <header className="mb-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Manajemen Pesanan
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Pantau dan kelola semua pesanan pelanggan.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-lg border border-outline-variant self-start">
          {FILTERS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => handleFilterChange(item.value)}
              className={
                filter === item.value
                  ? 'px-4 py-2 rounded-md bg-surface-container-lowest shadow-sm font-label-caps text-label-caps text-primary border border-outline-variant'
                  : 'px-4 py-2 rounded-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-variant transition-colors'
              }
            >
              {item.label}
            </button>
          ))}
        </div>
      </header>

      {loading && (
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-sm">Memuat pesanan...</p>
      )}
      {error && (
        <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3 mb-sm">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] border border-surface-variant overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low border-b border-outline-variant">
              <tr>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">
                  ID Pesanan
                </th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Pelanggan
                </th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">
                  Tanggal
                </th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Total</th>
                <th className="p-4 font-label-caps text-label-caps text-on-surface-variant">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {paged.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-6 text-center font-body-md text-body-md text-on-surface-variant"
                  >
                    Belum ada pesanan untuk filter ini.
                  </td>
                </tr>
              ) : (
                paged.map((order) => (
                  <tr key={order.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="p-4 font-body-sm text-body-sm font-semibold text-primary">
                      #{order.id}
                    </td>
                    <td className="p-4 font-body-sm text-body-sm">{order.customerName}</td>
                    <td className="p-4 font-body-sm text-body-sm text-on-surface-variant">
                      {formatDate(order.date)}
                    </td>
                    <td className="p-4 font-label-price text-label-price text-secondary text-sm">
                      {formatRupiah(order.total)}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-surface-container-low border border-outline-variant rounded-md px-2 py-1 font-body-sm text-body-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none"
                      >
                        {Object.entries(ORDER_STATUS).map(([value, config]) => (
                          <option key={value} value={value}>
                            {config.label}
                          </option>
                        ))}
                      </select>
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
            {Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} pesanan
          </span>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-md border border-outline-variant text-on-surface-variant hover:bg-surface-variant disabled:opacity-50 disabled:pointer-events-none"
            >
              <MaterialIcon name="chevron_left" />
            </button>
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
    </AdminLayout>
  )
}
