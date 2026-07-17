export default function CategoryChip({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? 'px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-caps text-label-caps whitespace-nowrap'
          : 'px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-caps text-label-caps hover:bg-surface-container-high transition-colors border border-outline-variant whitespace-nowrap'
      }
    >
      {label}
    </button>
  )
}
