import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import MaterialIcon from './MaterialIcon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar({ searchValue, onSearchChange }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { totalItems } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  function navLinkClass(path) {
    return location.pathname === path
      ? 'text-primary border-b-2 border-primary pb-1 font-label-caps text-label-caps transition-colors'
      : 'text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors'
  }

  function handleLogout() {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-surface top-0 shadow-sm z-50 sticky">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-7xl mx-auto">
        <Link to="/katalog" className="font-headline-md text-headline-md font-bold text-primary">
          Toko Buah
        </Link>

        <nav className="hidden md:flex items-center space-x-md">
          <Link to="/katalog" className={navLinkClass('/katalog')}>
            Kategori
          </Link>
          <a
            href="#"
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
          >
            Promo
          </a>
          <a
            href="#"
            className="text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors"
          >
            Bantuan
          </a>
        </nav>

        <div className="flex items-center space-x-sm">
          {onSearchChange && (
            <div className="relative hidden md:block">
              <input
                type="text"
                value={searchValue}
                onChange={onSearchChange}
                placeholder="Cari buah..."
                className="bg-[#faf2ec] border border-outline-variant rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary font-body-sm text-body-sm"
              />
              <MaterialIcon
                name="search"
                className="absolute right-3 top-2 text-on-surface-variant"
              />
            </div>
          )}

          <Link
            to="/keranjang"
            aria-label="Keranjang Belanja"
            className={`relative p-2 ${navLinkClass('/keranjang')}`}
          >
            <MaterialIcon name="shopping_cart" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-error text-on-error rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold">
                {totalItems}
              </span>
            )}
          </Link>
          {/* TODO: hubungkan ke halaman Notifikasi kalau nanti dibuat */}
          <button type="button" className="p-2 text-primary hover:text-primary transition-colors">
            <MaterialIcon name="notifications" />
          </button>

          {/* Link ini sekarang cuma muncul kalau yang login memang admin (dicek dari
              AuthContext, yang datanya berasal dari token JWT yang diverifikasi backend). */}
          {isAdmin && (
            <Link
              to="/admin/dashboard"
              className="hidden sm:flex items-center gap-1 text-on-surface-variant font-label-caps text-label-caps hover:text-primary transition-colors border border-outline-variant rounded-lg px-3 py-2"
            >
              <MaterialIcon name="admin_panel_settings" className="text-[18px]" />
              Admin
            </Link>
          )}

          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label="Menu akun"
                className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center ml-2 border border-outline-variant font-bold"
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-lg shadow-lg border border-outline-variant py-2 z-50">
                  <div className="px-4 py-2 border-b border-outline-variant">
                    <p className="font-body-sm text-body-sm font-semibold text-on-background truncate">
                      {user.name}
                    </p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                      {user.email}
                    </p>
                  </div>
                  <Link
                    to="/riwayat-pesanan"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 font-body-sm text-body-sm text-on-surface-variant hover:bg-surface-container-low"
                  >
                    Riwayat Pesanan
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 font-body-sm text-body-sm text-error hover:bg-surface-container-low"
                  >
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="ml-2 font-label-caps text-label-caps text-primary border border-primary rounded-lg px-3 py-2 hover:bg-surface-container-low transition-colors"
            >
              Masuk
            </Link>
          )}
        </div>
      </div>
      <div className="w-full h-px bg-surface-container-low" />
    </header>
  )
}
