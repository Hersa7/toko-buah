import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

const ProductContext = createContext(null)

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function refresh() {
    setLoading(true)
    setError('')
    try {
      const data = await api.get('/products', { auth: false })
      setProducts(data.products)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function addProduct(data) {
    const { product } = await api.post('/products', data)
    setProducts((prev) => [product, ...prev])
    return product
  }

  async function updateProduct(id, data) {
    const { product } = await api.put(`/products/${id}`, data)
    setProducts((prev) => prev.map((p) => (p.id === id ? product : p)))
    return product
  }

  async function deleteProduct(id) {
    await api.delete(`/products/${id}`)
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  const value = { products, loading, error, refresh, addProduct, updateProduct, deleteProduct }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export function useProducts() {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts harus dipakai di dalam <ProductProvider>')
  }
  return context
}
