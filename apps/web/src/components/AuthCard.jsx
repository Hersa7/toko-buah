export default function AuthCard({ eyebrow, title, subtitle, children }) {
  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-surface-container-high overflow-hidden">
      <div className="p-stack-lg border-b border-surface-variant flex flex-col items-center">
        <h1 className="text-headline-md font-headline-md text-primary mb-stack-sm">{eyebrow}</h1>
        <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">{title}</h2>
        {subtitle && (
          <p className="text-body-md font-body-md text-on-surface-variant text-center mt-unit">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  )
}
