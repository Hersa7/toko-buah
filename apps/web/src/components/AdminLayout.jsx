import { Link, useNavigate } from 'react-router-dom'
import MaterialIcon from './MaterialIcon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: 'dashboard', to: '/admin/dashboard' },
  { key: 'produk', label: 'Kelola Produk', icon: 'inventory_2', to: '/admin/produk' },
  { key: 'pesanan', label: 'Kelola Pesanan', icon: 'receipt_long', to: '/admin/pesanan' },
]

const ADMIN_AVATAR =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCE4om-_F_NJrE4BtnAeyf0EafH4iKuqUOFVLFXH9inVUBALiiLZoqKtqsNLVurP42pIta2km0_pb26rgv89PLhY_5RD700DyeasdNkHz904dSg1XsItPjZJKPN3ubevOa5MDBfn-7j5nrvt8dWyQSDVE9EHXFK32x8YYQfblqdxhbdIdoArdQQInPho_NtTQsaOVC6bQdUAeHxcBvMFL9iHV_rhiGZNCDqDoPtvNgyF4iLyH83lF1y'

export default function AdminLayout({ active, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex">
      {/* Sidebar - desktop */}
      <aside className="hidden md:flex bg-surface-container-low h-screen w-64 fixed left-0 top-0 border-r border-outline-variant flex-col p-md space-y-xs z-40">
        <div className="mb-lg">
          <h1 className="font-headline-md text-headline-md font-bold text-primary">Toko Buah</h1>
        </div>
        <div className="flex items-center space-x-sm mb-lg px-2">
          <img alt="Admin Avatar" className="w-10 h-10 rounded-full object-cover" src={ADMIN_AVATAR} />
          <div>
            <p className="font-body-md text-body-md font-bold">{user?.name ?? 'Admin Toko'}</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Kelola kesegaran hari ini
            </p>
          </div>
        </div>
        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.key}
              to={item.to}
              className={
                active === item.key
                  ? 'flex items-center space-x-sm p-3 rounded-lg bg-primary-container text-on-primary-container font-bold transition-colors'
                  : 'flex items-center space-x-sm p-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors'
              }
            >
              <MaterialIcon name={item.icon} />
              <span className="font-label-caps text-label-caps">{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2 pt-4 border-t border-outline-variant">
          <Link
            to="/katalog"
            className="flex items-center space-x-sm p-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <MaterialIcon name="storefront" />
            <span className="font-label-caps text-label-caps">Lihat Toko</span>
          </Link>
          {/* TODO: buat halaman pengaturan admin kalau diperlukan */}
          <a
            href="#"
            className="flex items-center space-x-sm p-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors"
          >
            <MaterialIcon name="settings" />
            <span className="font-label-caps text-label-caps">Pengaturan</span>
          </a>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center space-x-sm p-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors text-left"
          >
            <MaterialIcon name="logout" />
            <span className="font-label-caps text-label-caps">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Bottom nav - mobile */}
      <nav className="md:hidden bg-surface shadow-[0_-4px_12px_rgba(74,74,74,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 rounded-t-xl">
        <Link
          to="/admin/dashboard"
          className={
            active === 'dashboard'
              ? 'flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1'
              : 'flex flex-col items-center justify-center text-on-surface-variant'
          }
        >
          <MaterialIcon name="home" />
          <span className="font-label-caps text-label-caps mt-1">Beranda</span>
        </Link>
        <Link
          to="/admin/produk"
          className={
            active === 'produk'
              ? 'flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1'
              : 'flex flex-col items-center justify-center text-on-surface-variant'
          }
        >
          <MaterialIcon name="inventory_2" />
          <span className="font-label-caps text-label-caps mt-1">Produk</span>
        </Link>
        <Link
          to="/admin/pesanan"
          className={
            active === 'pesanan'
              ? 'flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1'
              : 'flex flex-col items-center justify-center text-on-surface-variant'
          }
        >
          <MaterialIcon name="receipt_long" />
          <span className="font-label-caps text-label-caps mt-1">Pesanan</span>
        </Link>
        {/* TODO: buat halaman profil admin kalau diperlukan */}
        <a href="#" className="flex flex-col items-center justify-center text-on-surface-variant">
          <MaterialIcon name="person" />
          <span className="font-label-caps text-label-caps mt-1">Profil</span>
        </a>
      </nav>

      {/* Konten halaman */}
      <main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop min-h-screen pb-24 md:pb-margin-desktop">
        {children}
      </main>
    </div>
  )
}
