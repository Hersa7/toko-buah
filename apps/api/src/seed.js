import bcrypt from 'bcryptjs'
import { db } from './db.js'

const PRODUCTS = [
  {
    id: 'jeruk-sunkist',
    sku: 'JRK-001',
    name: 'Jeruk Sunkist',
    category: 'Jeruk',
    origin: 'Impor',
    price: 45000,
    unit: '1 Kg',
    stock: 42,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBxlMj6fqI_qXi0ciNDgSS9R-7juUv06QX-E3jBgwAW3w1PUNXiBaW_yEUWFjygBs5NXkAk8_jIHFLcO9j2blG3O2CEkIl2YWybYn_MQxIG1r56FRGFOcN5gPgAmc6Ij3YyYRh19X0c9F9iJPaONaXSB2pkYvJaYJuCyd9MsJ_WUkvCEnkbjw9JX_Yrac7qSRHyQYdxcJyXSgFI0y9GScCGdpi2UIgo0emFlzjgySsORcijx_1Yyuby',
    badgeVariant: 'organik',
    badgeLabel: 'Organik',
  },
  {
    id: 'apel-fuji-premium',
    sku: 'APL-001',
    name: 'Apel Fuji Premium',
    category: 'Apel',
    origin: 'Impor',
    price: 32000,
    unit: '500 Gram',
    stock: 8,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDGZ0xshpu4rPBjHUyOSbv2MPu6xOMSJS7vCrxpEgWs82Vmfym7s65cIQjkpMPo3JxDx0Zi_3QwHDHg4S_BgbqtlKFUAEdFeJx6N9HgQbUihCnh9iUoZejPS2ZH9HsnrTuQXghGL9rK_VeEoq9SE-g4DVWX0KE10qP7v9DZRA6xkt6tD4OnKaEXCfojhmqe_G3xXD0xaU8J9_MgGvBklRGyp5RFh8-JGIPV_Cdf5lJ_NGIXlrtPBjjy',
    badgeVariant: 'diskon',
    badgeLabel: 'Diskon 10%',
  },
  {
    id: 'pisang-cavendish',
    sku: 'PSG-001',
    name: 'Pisang Cavendish',
    category: 'Pisang',
    origin: 'Lokal',
    price: 28500,
    unit: '1 Sisir (±1.5 Kg)',
    stock: 25,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBcudFKSsVx9bEBld2pOrb1H1g1K2bgtSCKwcCtTdsOFlBqu1S0jf6FUaigYZK_Yhhg0kGWTO4Dk_4uXSc0hMowll698ObYmnfHBxymuzKPsrL7FCbP3HtLv7GR_NntRs3b9r4h-oLyiDU911OG1HQdfpb3d2Wnyf38kanXyKcnH6qSo7Ktt9h5OkF0Sh5wBeApCBLLzgGkexKJwnqwJfs6xu1cK9N8jGb6gdNYuOAmxl-EDH8RpGP7',
    badgeVariant: null,
    badgeLabel: null,
  },
  {
    id: 'mix-berry-lokal',
    sku: 'BRY-001',
    name: 'Mix Berry Lokal',
    category: 'Berry',
    origin: 'Lokal',
    price: 55000,
    unit: '250 Gram',
    stock: 3,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDe94nevLbo1WDZo8vjNYs_ADwaMpwpI7aLOfVkSikWd-cOKd41ScNqOdIm46P0aujJh_UExW6k3EvWaX29E5h8CiT99HHj8SKTtxqzgXGsYyTSR-22HqJl77PRENptO-KysnJUYxDdJpnQGJyYaiCcFjuhbT0h3TX7YDYua6TPO7ZCrCurkwEAEpTvAYQILbSpaENn2AFW0rq7Ezklm9tMeUwvkdNdyzkW9ygjdMOJPD1MP0ZjfUiU',
    badgeVariant: 'netral',
    badgeLabel: 'Tersedia',
  },
]

function seedUsers() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (count > 0) return

  const insert = db.prepare(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)'
  )
  insert.run('Admin Toko', 'admin@tokobuah.id', bcrypt.hashSync('admin123', 10), 'admin')
  insert.run('Budi Santoso', 'budi@example.com', bcrypt.hashSync('customer123', 10), 'customer')

  console.log('[seed] Akun awal dibuat:')
  console.log('[seed]   Admin    -> admin@tokobuah.id / admin123')
  console.log('[seed]   Customer -> budi@example.com / customer123')
}

function seedProducts() {
  const { count } = db.prepare('SELECT COUNT(*) as count FROM products').get()
  if (count > 0) return

  const insert = db.prepare(`
    INSERT INTO products (id, sku, name, category, origin, price, unit, stock, image, badge_variant, badge_label)
    VALUES (@id, @sku, @name, @category, @origin, @price, @unit, @stock, @image, @badgeVariant, @badgeLabel)
  `)
  for (const product of PRODUCTS) insert.run(product)

  console.log(`[seed] ${PRODUCTS.length} produk awal ditambahkan.`)
}

seedUsers()
seedProducts()
