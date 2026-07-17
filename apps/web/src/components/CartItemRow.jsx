import Badge from './Badge.jsx'
import QuantityStepper from './QuantityStepper.jsx'
import MaterialIcon from './MaterialIcon.jsx'
import { formatRupiah } from '../data/products.js'

export default function CartItemRow({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-sm md:p-md flex flex-col sm:flex-row items-start sm:items-center gap-md">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 rounded-lg object-cover border border-outline-variant shrink-0"
      />
      <div className="flex-grow flex flex-col justify-between h-full gap-xs w-full">
        <div className="flex justify-between items-start w-full">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">{item.name}</h3>
            {item.badge && (
              <Badge variant={item.badge.variant} className="mt-1 inline-block">
                {item.badge.label}
              </Badge>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Hapus ${item.name}`}
            className="text-on-surface-variant hover:text-error transition-colors"
          >
            <MaterialIcon name="delete" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-auto pt-sm w-full">
          <div className="font-label-price text-label-price text-secondary">
            {formatRupiah(item.price)}{' '}
            <span className="font-body-sm text-body-sm text-on-surface-variant font-normal">
              /{item.unit}
            </span>
          </div>
          <QuantityStepper value={item.quantity} onDecrease={onDecrease} onIncrease={onIncrease} />
        </div>
      </div>
    </div>
  )
}
