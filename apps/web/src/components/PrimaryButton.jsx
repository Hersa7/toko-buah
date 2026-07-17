export default function PrimaryButton({ children, type = 'button', onClick, disabled = false }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="mt-stack-sm w-full py-3 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-surface-tint active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(0,110,47,0.2)] disabled:opacity-60 disabled:pointer-events-none"
    >
      {children}
    </button>
  )
}
