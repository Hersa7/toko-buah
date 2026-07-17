import MaterialIcon from './MaterialIcon.jsx'

export default function QuantityStepper({ value, onDecrease, onIncrease, min = 1 }) {
  return (
    <div className="flex items-center border border-outline-variant rounded-full bg-surface">
      <button
        type="button"
        onClick={onDecrease}
        disabled={value <= min}
        aria-label="Kurangi jumlah"
        className="w-8 h-8 flex items-center justify-center text-primary-container hover:bg-surface-container transition-colors rounded-l-full disabled:opacity-40 disabled:pointer-events-none"
      >
        <MaterialIcon name="remove" className="text-[18px]" />
      </button>
      <span className="font-body-md text-body-md w-8 text-center">{value}</span>
      <button
        type="button"
        onClick={onIncrease}
        aria-label="Tambah jumlah"
        className="w-8 h-8 flex items-center justify-center text-primary-container hover:bg-surface-container transition-colors rounded-r-full"
      >
        <MaterialIcon name="add" className="text-[18px]" />
      </button>
    </div>
  )
}
