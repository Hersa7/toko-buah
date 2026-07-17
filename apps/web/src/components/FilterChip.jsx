export default function FilterChip({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'font-label-caps text-label-caps bg-primary text-on-primary px-4 py-2 rounded-full whitespace-nowrap transition-colors'
          : 'font-label-caps text-label-caps bg-surface-container text-on-surface-variant px-4 py-2 rounded-full whitespace-nowrap hover:bg-surface-container-high transition-colors'
      }
    >
      {label}
    </button>
  )
}
