import StatusPill from './StatusPill.jsx'
import { formatRupiah } from '../data/products.js'

function formatTanggal(isoDate) {
  return new Date(isoDate).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function OrderCard({ order, onTrack, onViewDetail, onBuyAgain }) {
  const [firstItem, ...restItems] = order.items
  const totalQty = firstItem?.quantity ?? 0

  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-md flex flex-col gap-sm">
      <div className="flex justify-between items-center border-b border-surface-variant pb-xs">
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-on-surface-variant">
            {formatTanggal(order.date)}
          </span>
          <span className="font-headline-md text-headline-md text-on-surface">#{order.id}</span>
        </div>
        <StatusPill status={order.status} />
      </div>

      <div className="flex gap-md items-center py-xs">
        <img
          src={firstItem?.image}
          alt={firstItem?.name}
          className="w-20 h-20 rounded-md object-cover border border-surface-variant shrink-0"
        />
        <div className="flex flex-col flex-1">
          <span className="font-body-md text-body-md font-bold text-on-surface">
            {firstItem?.name} x {totalQty}
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {restItems.length > 0 ? `+ ${restItems.length} produk lainnya` : firstItem?.unit}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-xs">
        <span className="font-body-md text-body-md text-on-surface">Total Belanja</span>
        <span className="font-label-price text-label-price text-secondary">
          {formatRupiah(order.total)}
        </span>
      </div>

      <div className="flex flex-wrap justify-end gap-sm mt-xs">
        {order.status === 'diproses' && (
          <button
            type="button"
            onClick={() => onTrack(order)}
            className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Lacak Pesanan
          </button>
        )}
        {order.status === 'selesai' && (
          <>
            <button
              type="button"
              onClick={() => onViewDetail(order)}
              className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              Lihat Detail
            </button>
            <button
              type="button"
              onClick={() => onBuyAgain(order)}
              className="font-label-caps text-label-caps bg-primary text-on-primary px-4 py-2 rounded-lg hover:bg-primary-container hover:text-on-primary-container transition-colors"
            >
              Beli Lagi
            </button>
          </>
        )}
        {order.status === 'dibatalkan' && (
          <button
            type="button"
            onClick={() => onViewDetail(order)}
            className="font-label-caps text-label-caps text-primary border border-primary px-4 py-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            Lihat Detail
          </button>
        )}
      </div>
    </div>
  )
}
