import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import FormField from '../components/FormField.jsx'
import PasswordField from '../components/PasswordField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  email: '',
  password: '',
}

export default function LoginPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await login(form)
      // Kalau tadinya ditendang ke /login dari halaman tertentu (lihat RouteGuards.jsx),
      // balikin ke halaman itu. Kalau tidak ada, arahkan sesuai role.
      const redirectTo = location.state?.from?.pathname
      if (redirectTo) {
        navigate(redirectTo, { replace: true })
      } else {
        navigate(user.role === 'admin' ? '/admin/dashboard' : '/katalog', { replace: true })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop">
      <main className="w-full max-w-md bg-surface-container-lowest rounded-xl shadow-sm border border-surface-container-highest p-stack-lg md:p-10 flex flex-col gap-stack-lg relative overflow-hidden">
        {/* Dekorasi blur halus di pojok kartu */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-primary-container/10 rounded-full blur-2xl pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 -ml-16 -mb-16 w-32 h-32 bg-secondary-container/10 rounded-full blur-2xl pointer-events-none"
        />

        <header className="text-center flex flex-col items-center gap-stack-sm relative z-10">
          <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center mb-stack-sm shadow-sm">
            <MaterialIcon name="local_mall" className="text-[32px]" />
          </div>
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
            Toko Buah
          </h1>
          <h2 className="font-headline-md text-headline-md text-on-surface mt-stack-sm">Masuk</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Silakan masuk ke akun Anda
          </p>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md relative z-10">
          {error && (
            <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <FormField
            id="email"
            label="Email"
            icon="mail"
            type="email"
            placeholder="nama@email.com"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />

          <PasswordField
            id="password"
            label="Password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            labelAction={
              <a
                href="#"
                className="text-primary text-label-sm font-label-sm hover:text-primary-fixed-dim transition-colors"
              >
                Lupa Password?
              </a>
            }
          />

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Masuk'}
            <MaterialIcon name="arrow_forward" className="text-[18px]" />
          </PrimaryButton>
        </form>

        <div className="text-center relative z-10 -mt-2">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Demo: <span className="font-semibold">admin@tokobuah.id</span> / admin123 (admin) ·{' '}
            <span className="font-semibold">budi@example.com</span> / customer123 (pembeli)
          </p>
        </div>

        <div className="text-center relative z-10 pt-stack-sm border-t border-outline-variant/30">
          <p className="font-body-md text-body-md text-on-surface-variant">
            Belum punya akun?{' '}
            <Link to="/register" className="text-primary font-bold hover:underline transition-all">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}
