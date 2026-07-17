import MaterialIcon from './MaterialIcon.jsx'

export default function FormField({
  id,
  label,
  icon,
  type = 'text',
  placeholder,
  required = false,
  autoComplete,
  value,
  onChange,
}) {
  return (
    <div className="flex flex-col gap-unit">
      <label htmlFor={id} className="text-label-sm font-label-sm text-on-surface">
        {label}
      </label>
      <div className="relative">
        <MaterialIcon
          name={icon}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
        />
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-3 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-body-md font-body-md text-on-surface placeholder:text-outline"
        />
      </div>
    </div>
  )
}
