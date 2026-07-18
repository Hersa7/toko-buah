import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from './pages/RegisterPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import CatalogPage from './pages/CatalogPage.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderHistoryPage from './pages/OrderHistoryPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ManageProductsPage from './pages/ManageProductsPage.jsx'
import ManageOrdersPage from './pages/ManageOrdersPage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ProductProvider } from './context/ProductContext.jsx'
import { RequireAuth, RequireAdmin } from './components/RouteGuards.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ProductProvider>
            <OrderProvider>
              <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/katalog" element={<CatalogPage />} />
                <Route path="/keranjang" element={<CartPage />} />

                {/* Butuh login (siapa saja: admin atau customer) */}
                <Route element={<RequireAuth />}>
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/riwayat-pesanan" element={<OrderHistoryPage />} />
                  <Route path="/profil" element={<ProfilePage />} />
                </Route>

                {/* Khusus admin -- non-admin yang mencoba akses akan ditendang ke /katalog,
                    dan yang belum login sama sekali ditendang ke /login (lihat RouteGuards.jsx) */}
                <Route element={<RequireAdmin />}>
                  <Route path="/admin/dashboard" element={<DashboardPage />} />
                  <Route path="/admin/produk" element={<ManageProductsPage />} />
                  <Route path="/admin/pesanan" element={<ManageOrdersPage />} />
                </Route>

                {/* Tambahkan halaman lain di sini seiring berjalannya proyek */}
              </Routes>
            </OrderProvider>
          </ProductProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
