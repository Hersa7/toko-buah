import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { useAuth } from './AuthContext.jsx'

const OrderContext = createContext(null)

export function OrderProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function refresh() {
    if (!isAuthenticated) {
      setOrders([])
      return
    }
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/orders')
      setOrders(data.orders)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Muat ulang tiap kali status login berubah -- misalnya abis login, atau abis logout
  // (langsung dikosongkan lagi supaya pesanan user sebelumnya tidak nyangkut di layar).
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  // items: [{ id, name, unit, price, quantity, image }], address: form Checkout,
  // paymentMethod: string. Harga & stok dihitung ulang di backend, bukan dipercaya dari sini.
  async function addOrder({ items, address, paymentMethod }) {
    const { order } = await api.post('/orders', { items, address, paymentMethod })
    setOrders((prev) => [order, ...prev])
    return order
  }

  async function updateOrderStatus(id, status) {
    const { order } = await api.patch(`/orders/${id}/status`, { status })
    setOrders((prev) => prev.map((o) => (o.id === id ? order : o)))
    return order
  }

  const value = { orders, loading, error, refresh, addOrder, updateOrderStatus }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export function useOrders() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrders harus dipakai di dalam <OrderProvider>')
  }
  return context
}
