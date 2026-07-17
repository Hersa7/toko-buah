const DEFAULT_DATA = [
  { day: 'Senin', value: 35, color: 'bg-primary-fixed' },
  { day: 'Selasa', value: 48, color: 'bg-primary-fixed-dim' },
  { day: 'Rabu', value: 82, color: 'bg-primary' },
  { day: 'Kamis', value: 40, color: 'bg-primary-fixed' },
  { day: 'Jumat', value: 55, color: 'bg-primary-fixed-dim' },
  { day: 'Sabtu', value: 95, color: 'bg-secondary-container' },
  { day: 'Minggu', value: 88, color: 'bg-secondary-container' },
]

export default function WeeklySalesChart({ data = DEFAULT_DATA }) {
  const max = Math.max(...data.map((item) => item.value))

  return (
    <div>
      <div className="flex items-end justify-between gap-sm h-48 border-b border-outline-variant pb-2">
        {data.map((item) => (
          <div key={item.day} className="flex-1 h-full flex flex-col items-center justify-end">
            <div
              className={`w-full max-w-[48px] rounded-t-md ${item.color}`}
              style={{ height: `${(item.value / max) * 100}%` }}
              title={`${item.day}: ${item.value}`}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-2">
        <span className="font-body-sm text-body-sm text-on-surface-variant">{data[0].day}</span>
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          {data[data.length - 1].day}
        </span>
      </div>
    </div>
  )
}
