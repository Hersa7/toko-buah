import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Footer from '../components/Footer.jsx'
import FilterChip from '../components/FilterChip.jsx'
import OrderCard from '../components/OrderCard.jsx'
import { useOrders } from '../context/OrderContext.jsx'
import { useCart } from '../context/CartContext.jsx'

const FILTERS = [
  { key: 'semua', label: 'Semua' },
  { key: 'diproses', label: 'Diproses' },
  { key: 'selesai', label: 'Selesai' },
  { key: 'dibatalkan', label: 'Dibatalkan' },
]

export default function OrderHistoryPage() {
  const { orders, loading, error } = useOrders()
  const { addItem } = useCart()
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('semua')

  const filteredOrders = useMemo(() => {
    if (activeFilter === 'semua') return orders
    return orders.filter((order) => order.status === activeFilter)
  }, [orders, activeFilter])

  function handleTrack(order) {
    // TODO: sambungkan ke halaman/status pelacakan sungguhan begitu API pengiriman siap.
    console.log('lacak pesanan', order.id)
  }

  function handleViewDetail(order) {
    // TODO: buat halaman/modal Detail Pesanan begitu diperlukan.
    console.log('lihat detail pesanan', order.id)
  }

  function handleBuyAgain(order) {
    order.items.forEach((item) => addItem(item))
    navigate('/keranjang')
  }

  return (
    <div className="bg-surface text-on-surface antialiased flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow w-full max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-32 md:pb-lg flex flex-col gap-md">
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-sm">
          Riwayat Pesanan
        </h1>

        <div className="flex gap-sm overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <FilterChip
              key={filter.key}
              label={filter.label}
              active={activeFilter === filter.key}
              onClick={() => setActiveFilter(filter.key)}
            />
          ))}
        </div>

        {loading && (
          <p className="font-body-sm text-body-sm text-on-surface-variant">Memuat pesanan...</p>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {filteredOrders.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-lg text-center">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Belum ada pesanan dengan status ini.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            {filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onTrack={handleTrack}
                onViewDetail={handleViewDetail}
                onBuyAgain={handleBuyAgain}
              />
            ))}
          </div>
        )}
      </main>

      <div className="hidden md:block">
        <Footer />
      </div>
      <BottomNav />
    </div>
  )
}
