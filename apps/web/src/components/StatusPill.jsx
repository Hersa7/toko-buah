import { ORDER_STATUS } from '../data/orders.js'

export default function StatusPill({ status }) {
  const config = ORDER_STATUS[status] ?? ORDER_STATUS.diproses

  return (
    <span className={`font-label-caps text-label-caps px-3 py-1 rounded-full ${config.pillClass}`}>
      {config.label}
    </span>
  )
}
