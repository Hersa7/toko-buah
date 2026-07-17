import AdminLayout from '../components/AdminLayout.jsx'
import StatCard from '../components/StatCard.jsx'
import WeeklySalesChart from '../components/WeeklySalesChart.jsx'
import { useOrders } from '../context/OrderContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { LOW_STOCK_THRESHOLD, formatRupiah } from '../data/products.js'

export default function DashboardPage() {
  const { orders } = useOrders()
  const { products } = useProducts()

  // Angka-angka ini dihitung dari data pesanan & produk yang sungguhan ada di app
  // (OrderContext & ProductContext) — bukan angka statis. Coba checkout pesanan baru
  // atau ubah stok di Kelola Produk, kartu-kartu ini akan berubah.
  const totalOrders = orders.length
  const revenue = orders.reduce((sum, order) => sum + order.total, 0)
  const lowStockProducts = products.filter((product) => product.stock < LOW_STOCK_THRESHOLD)

  return (
    <AdminLayout active="dashboard">
      <header className="mb-lg">
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background">
          Ikhtisar Hari Ini
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant mt-1">
          Pantau performa penjualan dan stok terkini.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md mb-lg">
        <StatCard
          label="Total Pesanan"
          value={totalOrders}
          icon="shopping_basket"
          tone="default"
          note="+12% dari kemarin"
          noteVariant="trend"
        />
        <StatCard
          label="Pendapatan"
          value={formatRupiah(revenue)}
          icon="account_balance_wallet"
          tone="amber"
          note="+5.2% dari minggu lalu"
          noteVariant="trend"
          accentValue
        />
        <StatCard
          label="Stok Menipis"
          value={lowStockProducts.length}
          icon="warning"
          tone="error"
          note="Produk perlu diisi ulang"
          noteVariant="plain"
        />
      </div>

      <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-md mb-lg">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-md text-headline-md text-on-background">
            Grafik Penjualan Mingguan
          </h3>
          {/* TODO: buat halaman detail laporan penjualan kalau diperlukan */}
          <button
            type="button"
            className="font-label-caps text-label-caps text-primary border border-outline-variant px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Lihat Detail
          </button>
        </div>
        <WeeklySalesChart />
      </section>

      {/* Tambahan: daftar produk stok menipis, supaya kartu di atas actionable */}
      {lowStockProducts.length > 0 && (
        <section className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] border border-error-container p-md">
          <h3 className="font-headline-md text-headline-md text-on-background mb-sm">
            Produk Stok Menipis
          </h3>
          <ul className="flex flex-col gap-2">
            {lowStockProducts.map((product) => (
              <li
                key={product.id}
                className="flex justify-between items-center font-body-sm text-body-sm text-on-surface-variant"
              >
                <span>{product.name}</span>
                <span className="text-error font-semibold">
                  {product.stock} {product.unit} tersisa
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </AdminLayout>
  )
}
