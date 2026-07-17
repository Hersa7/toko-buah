import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

// Dipakai untuk halaman yang butuh login (siapa saja yang sudah masuk), contoh: Checkout,
// Riwayat Pesanan. Belum login -> ditendang ke /login, dan balik otomatis ke halaman
// tujuan semula setelah berhasil login.
export function RequireAuth() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return null // tunggu AuthContext selesai cek sesi dulu, biar tidak "kedip" ke /login
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />

  return <Outlet />
}

// Dipakai khusus untuk /admin/*. Sudah login tapi bukan admin -> ditendang ke /katalog,
// bukan ke /login (karena dia sebenarnya sudah berhasil login, cuma tidak punya akses).
export function RequireAdmin() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return null
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (!isAdmin) return <Navigate to="/katalog" replace />

  return <Outlet />
}
