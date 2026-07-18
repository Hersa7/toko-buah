import { Link, useLocation } from 'react-router-dom'
import MaterialIcon from './MaterialIcon.jsx'

const ITEMS = [
  { icon: 'home', label: 'Beranda', to: '/katalog' },
  { icon: 'search', label: 'Cari', to: '/katalog' },
  { icon: 'shopping_bag', label: 'Pesanan', to: '/riwayat-pesanan' },
  { icon: 'person', label: 'Profil', to: '/profil' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav className="md:hidden bg-surface fixed bottom-0 w-full z-50 rounded-t-xl shadow-[0_-4px_15px_rgba(0,0,0,0.1)] flex justify-around items-center px-4 py-3">
      {ITEMS.map((item) => {
        const active = item.to !== '#' && location.pathname === item.to
        return active ? (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-4 py-1 active:scale-90 transition-all"
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-caps text-label-caps mt-1">{item.label}</span>
          </Link>
        ) : (
          <Link
            key={item.label}
            to={item.to}
            className="flex flex-col items-center justify-center text-on-surface-variant hover:bg-surface-container-high"
          >
            <MaterialIcon name={item.icon} />
            <span className="font-label-caps text-label-caps mt-1">{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
