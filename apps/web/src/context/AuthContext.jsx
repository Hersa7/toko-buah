import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'toko-buah:token'
const USER_KEY = 'toko-buah:user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Saat app pertama kali dibuka: kalau ada token tersimpan, cek ke backend apakah
  // masih valid (bukan cuma percaya localStorage mentah-mentah).
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      setLoading(false)
      return
    }

    api
      .get('/auth/me')
      .then(({ user }) => {
        setUser(user)
        localStorage.setItem(USER_KEY, JSON.stringify(user))
      })
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  function persistSession({ token, user }) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    setUser(user)
  }

  async function login({ email, password }) {
    const data = await api.post('/auth/login', { email, password }, { auth: false })
    persistSession(data)
    return data.user
  }

  async function register({ name, email, password }) {
    const data = await api.post('/auth/register', { name, email, password }, { auth: false })
    persistSession(data)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth harus dipakai di dalam <AuthProvider>')
  }
  return context
}
