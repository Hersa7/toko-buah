import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Footer from '../components/Footer.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfilePage() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-24 md:pb-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-lg">
          Profil Saya
        </h1>

        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col gap-md">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-xl">
              {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div>
              <p className="font-body-lg text-body-lg font-semibold text-on-background">
                {user?.name}
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="border-t border-outline-variant pt-md flex flex-col gap-sm">
            <div className="flex justify-between items-center">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Role</span>
              <span className="font-body-sm text-body-sm font-semibold text-on-background capitalize">
                {isAdmin ? 'Admin' : 'Customer'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 border border-error text-error rounded-lg px-4 py-2 mt-sm hover:bg-error-container transition-colors font-label-caps text-label-caps"
          >
            <MaterialIcon name="logout" />
            Keluar
          </button>
        </div>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
