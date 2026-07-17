import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/AuthCard.jsx'
import FormField from '../components/FormField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    setSubmitting(true)
    try {
      // Akun yang daftar lewat form ini selalu jadi role "customer" (dijamin di backend).
      await register({ name: form.fullName, email: form.email, password: form.password })
      navigate('/katalog', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex items-center justify-center p-container-padding-mobile md:p-container-padding-desktop">
      <AuthCard
        eyebrow="Toko Buah"
        title="Daftar Akun Baru"
        subtitle="Bergabunglah bersama kami untuk mendapatkan produk segar setiap hari."
      >
        <form onSubmit={handleSubmit} className="p-stack-lg flex flex-col gap-stack-md">
          {error && (
            <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <FormField
            id="fullName"
            label="Nama Lengkap"
            icon="person"
            placeholder="Masukkan nama lengkap"
            required
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
          />
          <FormField
            id="email"
            label="Email"
            icon="mail"
            type="email"
            placeholder="contoh@email.com"
            required
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
          />
          <FormField
            id="password"
            label="Kata Sandi"
            icon="lock"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
          />
          <FormField
            id="confirmPassword"
            label="Konfirmasi Kata Sandi"
            icon="lock_reset"
            type="password"
            placeholder="Ulangi kata sandi"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <PrimaryButton type="submit" disabled={submitting}>
            {submitting ? 'Memproses...' : 'Daftar'}
            <MaterialIcon name="arrow_forward" className="text-[18px]" />
          </PrimaryButton>

          <p className="text-center mt-stack-md text-body-md font-body-md text-on-surface-variant">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-primary font-bold hover:underline transition-all">
              Masuk di sini
            </Link>
          </p>
        </form>
      </AuthCard>
    </div>
  )
}
