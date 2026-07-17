import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CartItemRow from '../components/CartItemRow.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { formatRupiah } from '../data/products.js'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, discount, total } = useCart()
  const navigate = useNavigate()

  function handleCheckout() {
    navigate('/checkout')
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <div className="mb-md">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface mb-xs">
            Keranjang Belanja
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Pastikan pesanan segar Anda sudah benar sebelum checkout.
          </p>
        </div>

        {items.length === 0 ? (
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-lg text-center flex flex-col items-center gap-sm">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Keranjang kamu masih kosong.
            </p>
            <Link
              to="/katalog"
              className="inline-block bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Mulai Belanja
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
            <section className="lg:col-span-8 flex flex-col gap-sm">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
                  onRemove={() => removeItem(item.id)}
                />
              ))}
            </section>

            <aside className="lg:col-span-4">
              <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-md sticky top-md">
                <h2 className="font-headline-md text-headline-md text-on-surface mb-md">
                  Ringkasan Pesanan
                </h2>
                <div className="flex flex-col gap-sm border-b border-outline-variant pb-md mb-md">
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Total Harga ({items.length} Barang)</span>
                    <span>{formatRupiah(subtotal)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                      <span>Total Diskon Barang</span>
                      <span className="text-primary">- {formatRupiah(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-body-md text-body-md text-on-surface-variant">
                    <span>Biaya Pengiriman</span>
                    <span>Dihitung di checkout</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-md">
                  <span className="font-headline-md text-headline-md font-bold text-on-surface">
                    Total Belanja
                  </span>
                  <span className="font-label-price text-label-price text-secondary">
                    {formatRupiah(total)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCheckout}
                  className="w-full bg-primary text-on-primary font-headline-md text-headline-md font-bold py-3 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex justify-center items-center gap-xs active:scale-95"
                >
                  Checkout Sekarang
                </button>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-sm flex items-center justify-center gap-xs">
                  <MaterialIcon name="verified_user" className="text-[16px] text-primary" />
                  Pembayaran 100% Aman
                </p>
              </div>
            </aside>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
