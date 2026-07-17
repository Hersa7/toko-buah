const VARIANT_STYLES = {
  organik: 'bg-[#e8f5e9] text-[#1b5e20]',
  diskon: 'bg-[#fff8e1] text-[#f57f17]',
  netral: 'bg-surface-container-highest text-on-surface',
  impor: 'bg-primary-container text-on-primary-container',
  lokal: 'bg-surface-container-high text-on-surface-variant',
}

export default function Badge({ variant = 'netral', className = '', children }) {
  return (
    <span
      className={`px-2 py-1 rounded-sm font-label-caps text-label-caps ${VARIANT_STYLES[variant] ?? VARIANT_STYLES.netral} ${className}`}
    >
      {children}
    </span>
  )
}
