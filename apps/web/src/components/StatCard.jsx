import MaterialIcon from './MaterialIcon.jsx'

const ICON_BG = {
  default: 'bg-primary-fixed text-on-primary-fixed',
  amber: 'bg-secondary-fixed text-on-secondary-fixed',
  error: 'bg-error-container text-on-error-container',
}

export default function StatCard({
  label,
  value,
  icon,
  tone = 'default',
  note,
  noteVariant = 'trend',
  accentValue = false,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-lg shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-md">
      <div className="flex justify-between items-start">
        <span
          className={`font-body-md text-body-md font-semibold ${
            tone === 'error' ? 'text-error' : 'text-on-surface-variant'
          }`}
        >
          {label}
        </span>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[tone]}`}>
          <MaterialIcon name={icon} />
        </div>
      </div>
      <p
        className={`font-headline-lg text-headline-lg mt-2 ${
          accentValue ? 'text-secondary' : 'text-on-background'
        }`}
      >
        {value}
      </p>
      {note && noteVariant === 'trend' && (
        <p className="font-body-sm text-body-sm text-primary flex items-center gap-1 mt-2">
          <MaterialIcon name="trending_up" className="text-[16px]" />
          {note}
        </p>
      )}
      {note && noteVariant === 'plain' && (
        <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">{note}</p>
      )}
    </div>
  )
}
