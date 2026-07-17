export default function Footer() {
  return (
    <footer className="bg-surface-container-low w-full py-xl mt-lg border-t border-outline-variant">
      <div className="max-w-7xl mx-auto px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-md">
        <div>
          <div className="font-headline-md text-headline-md font-bold text-primary mb-4">
            Toko Buah
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
            © 2024 Toko Buah Indonesia. Kesegaran Terjamin.
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:items-end">
          {['Tentang Kami', 'Syarat & Ketentuan', 'Kebijakan Privasi', 'Kontak'].map((label) => (
            <a
              key={label}
              href="#"
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
