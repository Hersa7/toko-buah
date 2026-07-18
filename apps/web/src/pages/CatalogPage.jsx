import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import BottomNav from '../components/BottomNav.jsx'
import Footer from '../components/Footer.jsx'
import CategoryChip from '../components/CategoryChip.jsx'
import ProductCard from '../components/ProductCard.jsx'
import MaterialIcon from '../components/MaterialIcon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../context/ProductContext.jsx'
import { CATEGORIES, formatRupiah } from '../data/products.js'

export default function CatalogPage() {
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [search, setSearch] = useState('')
  const { addItem } = useCart()
  const { products, loading, error } = useProducts()

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'Semua' || product.category === activeCategory
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, search])

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col">
      <Navbar searchValue={search} onSearchChange={(e) => setSearch(e.target.value)} />

      <main className="flex-grow w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-24 md:pb-lg">
        <div className="mb-lg">
          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-background mb-md">
            Katalog Buah Segar
          </h1>

          {/* Kotak pencarian khusus tampilan mobile -- sengaja dibuat terpisah dari kotak
              pencarian di Navbar (yang cuma muncul di layar md ke atas), supaya pencarian
              tetap bisa dipakai di HP dalam mode portrait maupun landscape. */}
          <div className="relative md:hidden mb-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari buah..."
              className="w-full bg-[#faf2ec] border border-outline-variant rounded-lg py-2 pl-4 pr-10 focus:outline-none focus:ring-1 focus:ring-primary font-body-sm text-body-sm"
            />
            <MaterialIcon
              name="search"
              className="absolute right-3 top-2 text-on-surface-variant"
            />
          </div>

          <div className="flex flex-wrap gap-xs overflow-x-auto pb-2">
            {CATEGORIES.map((category) => (
              <CategoryChip
                key={category}
                label={category}
                active={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              />
            ))}
          </div>
        </div>

        {loading && (
          <p className="text-body-md font-body-md text-on-surface-variant py-lg text-center">
            Memuat produk...
          </p>
        )}
        {error && (
          <div className="bg-error-container text-on-error-container font-body-sm text-body-sm rounded-lg px-4 py-3 mb-md">
            {error}
          </div>
        )}

        {!loading && filteredProducts.length === 0 ? (
          <p className="text-body-md font-body-md text-on-surface-variant py-lg text-center">
            Buah yang kamu cari tidak ditemukan.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter md:gap-md">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                unit={product.unit}
                price={formatRupiah(product.price)}
                image={product.image}
                badge={product.badge}
                outOfStock={product.stock <= 0}
                onAddToCart={() => addItem(product)}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}
