import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import CheckoutField from '../components/CheckoutField.jsx'
import PaymentOption from '../components/PaymentOption.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useOrders } from '../context/OrderContext.jsx'
import { formatRupiah } from '../data/products.js'

// TODO: kalau ongkos kirim nanti dihitung dari API (jarak/kurir), ganti konstanta ini.
const SHIPPING_FEE = 15000

const PAYMENT_METHODS = [
  { id: 'transfer_bca', label: 'Transfer Bank (BCA)', icon: 'account_balance' },
  { id: 'gopay', label: 'Gopay', icon: 'wallet' },
  { id: 'kartu_kredit', label: 'Kartu Kredit', icon: 'credit_card' },
]

const initialAddress = {
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  zip: '',
}

export default function CheckoutPage() {
  const { items, subtotal, discount, total, clearCart } = useCart()
  const { addOrder } = useOrders()

  const [address, setAddress] = useState(initialAddress)
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrder, setPlacedOrder] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const grandTotal = total + SHIPPING_FEE

  function handleAddressChange(e) {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  async function handleConfirm(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      // Backend yang hitung ulang harga/diskon/ongkir & yang berkurangin stok --
      // frontend cuma kirim id produk + qty, bukan harga (biar tidak bisa diakal-akalin).
      const order = await addOrder({ items, address, paymentMethod })
      setPlacedOrder(order)
      clearCart()
      setOrderPlaced(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex items-center justify-center">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_12px_rgba(74,74,74,0.1)] p-lg text-center flex flex-col items-center gap-sm">
            <p className="font-body-md text-body-md text-on-surface-variant">
              Keranjang kamu masih kosong, jadi belum ada yang bisa di-checkout.
            </p>
            <Link
              to="/katalog"
              className="inline-block bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
            >
              Mulai Belanja
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg flex items-center justify-center">
          <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-[#EADDD3] p-lg max-w-md w-full text-center flex flex-col items-center gap-sm">
            <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
              <MaterialIcon name="check_circle" className="text-[36px]" />
            </div>
            <h1 className="font-headline-md text-headline-md text-on-background">
              Pesanan Berhasil Dibuat!
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Terima kasih! Pesanan{' '}
              <span className="font-semibold">#{placedOrder?.id}</span> senilai{' '}
              <span className="text-secondary font-semibold">
                {formatRupiah(placedOrder?.total ?? grandTotal)}
              </span>{' '}
              sedang kami proses.
            </p>
            {/* TODO: tombol "Lihat Riwayat Pesanan" ini sekarang aktif karena OrderContext sudah ada */}
            <div className="flex flex-col sm:flex-row gap-sm mt-sm">
              <Link
                to="/riwayat-pesanan"
                className="inline-block bg-primary text-on-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Lihat Riwayat Pesanan
              </Link>
              <Link
                to="/katalog"
                className="inline-block border border-primary text-primary font-label-caps text-label-caps px-6 py-3 rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Kembali ke Katalog
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-primary mb-md">
          Checkout
        </h1>

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-12 gap-md items-start">
          {/* Kolom kiri: form */}
          <div className="lg:col-span-8 flex flex-col gap-md">
            <section className="bg-surface-container-lowest rounded-lg p-md shadow-[0_4px_12px_rgba(74,74,74,0.1)] border border-outline-variant">
              <h2 className="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-2">
                <MaterialIcon name="local_shipping" className="text-primary" />
                Alamat Pengiriman
              </h2>
              <div className="flex flex-col gap-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                  <CheckoutField
                    id="firstName"
                    label="Nama Depan"
                    placeholder="Budi"
                    required
                    value={address.firstName}
                    onChange={handleAddressChange}
                  />
                  <CheckoutField
                    id="lastName"
                    label="Nama Belakang"
                    placeholder="Santoso"
                    required
                    value={address.lastName}
                    onChange={handleAddressChange}
                  />
                </div>
                <CheckoutField
                  id="address"
                  label="Alamat Lengkap"
                  as="textarea"
                  placeholder="Jl. Merdeka No. 123..."
                  required
                  value={address.address}
                  onChange={handleAddressChange}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                  <CheckoutField
                    id="city"
                    label="Kota"
                    placeholder="Jakarta"
                    required
                    value={address.city}
                    onChange={handleAddressChange}
                  />
                  <CheckoutField
                    id="zip"
                    label="Kode Pos"
                    placeholder="10110"
                    required
                    value={address.zip}
                    onChange={handleAddressChange}
                  />
                </div>
              </div>
            </section>

            <section className="bg-surface-container-lowest rounded-lg p-md shadow-[0_4px_12px_rgba(74,74,74,0.1)] border border-outline-variant">
              <h2 className="font-headline-md text-headline-md text-on-background mb-md flex items-center gap-2">
                <MaterialIcon name="payments" className="text-primary" />
                Metode Pembayaran
              </h2>
              <div className="flex flex-col gap-sm">
                {PAYMENT_METHODS.map((method) => (
                  <PaymentOption
                    key={method.id}
                    id={method.id}
                    name="payment"
                    label={method.label}
                    icon={method.icon}
                    checked={paymentMethod === method.id}
                    onChange={() => setPaymentMethod(method.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Kolom kanan: ringkasan pesanan (sticky) */}
          <div className="lg:col-span-4 lg:sticky lg:top-[100px]">
            <section className="bg-surface-container-lowest rounded-lg p-md shadow-[0_4px_15px_rgba(0,0,0,0.15)] border border-[#EADDD3]">
              <h2 className="font-headline-md text-headline-md text-on-background mb-md border-b border-outline-variant pb-3">
                Ringkasan Pesanan
              </h2>

              {error && (
                <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3 mb-md">
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-4 mb-md">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start">
                    <div className="flex gap-3">
                      <div className="w-16 h-16 rounded-lg bg-surface-container-low overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-body-md text-body-md font-semibold text-on-background">
                          {item.name}
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          {item.quantity} x {item.unit}
                        </p>
                      </div>
                    </div>
                    <p className="font-body-md text-body-md font-semibold text-secondary whitespace-nowrap">
                      {formatRupiah(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-outline-variant pt-4 flex flex-col gap-2 mb-md">
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Subtotal</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                    <span>Diskon</span>
                    <span className="text-primary">- {formatRupiah(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-body-sm text-body-sm text-on-surface-variant">
                  <span>Ongkos Kirim</span>
                  <span>{formatRupiah(SHIPPING_FEE)}</span>
                </div>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-outline-variant">
                  <span className="font-headline-md text-headline-md text-on-background font-bold">
                    Total Bayar
                  </span>
                  <span className="font-label-price text-label-price text-secondary">
                    {formatRupiah(grandTotal)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#006e2f] hover:bg-[#005322] text-white font-headline-md text-headline-md rounded-lg py-3 transition-colors flex items-center justify-center gap-2 shadow-sm active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
              >
                <MaterialIcon name="check_circle" />
                {submitting ? 'Memproses...' : 'Konfirmasi Pesanan'}
              </button>
              <p className="font-body-sm text-body-sm text-on-surface-variant text-center mt-4 flex items-center justify-center gap-1">
                <MaterialIcon name="lock" className="text-[16px]" />
                Pembayaran Aman 100%
              </p>
            </section>
          </div>
        </form>
      </main>

      <Footer />
    </div>
  )
}
