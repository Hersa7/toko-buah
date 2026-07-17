import { useState } from 'react'
import MaterialIcon from './MaterialIcon.jsx'

export default function PasswordField({
  id,
  label,
  placeholder = '••••••••',
  required = false,
  autoComplete,
  value,
  onChange,
  labelAction,
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="flex flex-col gap-unit">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-label-sm font-label-sm text-on-surface">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        <MaterialIcon
          name="lock"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
        />
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors text-body-md font-body-md text-on-surface placeholder:text-outline"
        />
        <button
          type="button"
          aria-label={visible ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
        >
          <MaterialIcon name={visible ? 'visibility' : 'visibility_off'} />
        </button>
      </div>
    </div>
  )
}
