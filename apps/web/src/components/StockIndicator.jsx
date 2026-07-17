const DOT_COLOR = {
  high: 'bg-primary',
  medium: 'bg-secondary',
  low: 'bg-error',
}

export default function StockIndicator({ level, label }) {
  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full shrink-0 ${DOT_COLOR[level] ?? DOT_COLOR.medium}`} />
      <span className="font-body-sm text-body-sm text-on-surface">{label}</span>
    </span>
  )
}
