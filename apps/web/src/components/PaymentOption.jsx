import MaterialIcon from './MaterialIcon.jsx'

export default function PaymentOption({ id, name, label, icon, checked, onChange }) {
  return (
    <label
      htmlFor={id}
      className="flex items-center p-4 border border-outline-variant rounded-lg cursor-pointer hover:bg-surface-container-low transition-colors group has-[:checked]:border-primary has-[:checked]:bg-surface-container-low"
    >
      <input
        id={id}
        name={name}
        type="radio"
        checked={checked}
        onChange={onChange}
        className="w-5 h-5 text-primary border-outline-variant focus:ring-primary accent-primary"
      />
      <div className="ml-4 flex-grow flex justify-between items-center">
        <span className="font-body-md text-body-md text-on-background font-semibold">{label}</span>
        <MaterialIcon
          name={icon}
          className="text-outline-variant group-hover:text-primary transition-colors"
        />
      </div>
    </label>
  )
}
