export default function CheckoutField({
  id,
  label,
  type = 'text',
  as = 'input',
  placeholder,
  required = false,
  value,
  onChange,
  rows = 3,
  className = '',
}) {
  const fieldClass =
    'w-full bg-[#faf2ec] border border-outline-variant rounded-lg p-3 text-body-md font-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none transition-colors'

  return (
    <div className={className}>
      <label htmlFor={id} className="block font-label-caps text-label-caps text-on-surface-variant mb-base">
        {label}
      </label>
      {as === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          rows={rows}
          className={fieldClass}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value}
          onChange={onChange}
          className={fieldClass}
        />
      )}
    </div>
  )
}
