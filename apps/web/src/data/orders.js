// Peta status pesanan -> label & gaya pill. Warnanya ambil dari token yang sudah ada
// di tailwind.config.js (primary-fixed = hijau muda, secondary-fixed = amber muda,
// error-container = merah muda) supaya tetap konsisten dengan design system.
export const ORDER_STATUS = {
  diproses: {
    label: 'Diproses',
    pillClass: 'bg-secondary-fixed text-on-secondary-fixed',
  },
  selesai: {
    label: 'Selesai',
    pillClass: 'bg-primary-fixed text-on-primary-fixed',
  },
  dibatalkan: {
    label: 'Dibatalkan',
    pillClass: 'bg-error-container text-on-error-container',
  },
}

// Data awal (seed) supaya halaman Riwayat Pesanan tidak kosong sebelum ada checkout baru.
// Pesanan baru dari halaman Checkout akan ditambahkan di depan array ini lewat OrderContext.
export const SEED_ORDERS = [
  {
    id: 'TB-54321',
    date: '2024-10-24',
    status: 'diproses',
    customerName: 'Rina Wulandari',
    items: [
      {
        id: 'anggur-muscat-organik',
        name: 'Anggur Muscat Organik',
        unit: '1 Kg',
        quantity: 1,
        price: 120000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB5IVu06TA5i2dsjuCr_-vXJTKuH0qgpJB9TxSXY_hM8eFbTYYqB_x9YvjAh4gKomoYiHr77BzjydQv05LoyWyxIvXjsggDyBY0t_Y6z3kioz9bOx_BeRr4ZDRBo7Aaa7BKXb1RlCUqHaxeCGBK8kOF2uRjOG1TBbRRJPjGsUjZUYcgwH-ZxGQwTMu7taUgsanLPobZ-CRDJhdelYQ1DeXGfV-aJG7IsFyyorpUuCFoJ9xeY2Gh8qBK',
      },
    ],
    total: 120000,
  },
  {
    id: 'TB-12345',
    date: '2024-10-20',
    status: 'selesai',
    customerName: 'Budi Santoso',
    items: [
      {
        id: 'apel-fuji-premium',
        name: 'Apel Fuji Premium',
        unit: '500 Gram',
        quantity: 2,
        price: 32000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuB69F-ZknOhKy2TJtMuI_Llh6wtgow4mqqHpSGBLaHDSzgonFprl3sAEoyo9_EfOJmzng3rYUsdIPALp4dzBR3_vZeGTRZVBzujzF4rZ8qpQOlAoRifliKzkBY8_rK7AXEHSQG3gvQKqEq0PqPEGuYVsF-ltMROOqV5LGhPZSuQOghYDc_1iE7Miv6vJ5pQ0XdLLTwvOfnwiDxCuRTaMrV7mO7x9f-1Wnl8M-MO1QBsitYJbHF3RA_p',
      },
      {
        id: 'jeruk-sunkist',
        name: 'Jeruk Sunkist',
        unit: '1 Kg',
        quantity: 1,
        price: 45000,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBxlMj6fqI_qXi0ciNDgSS9R-7juUv06QX-E3jBgwAW3w1PUNXiBaW_yEUWFjygBs5NXkAk8_jIHFLcO9j2blG3O2CEkIl2YWybYn_MQxIG1r56FRGFOcN5gPgAmc6Ij3YyYRh19X0c9F9iJPaONaXSB2pkYvJaYJuCyd9MsJ_WUkvCEnkbjw9JX_Yrac7qSRHyQYdxcJyXSgFI0y9GScCGdpi2UIgo0emFlzjgySsORcijx_1Yyuby',
      },
      {
        id: 'pisang-cavendish',
        name: 'Pisang Cavendish',
        unit: '1 Sisir',
        quantity: 1,
        price: 28500,
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBcudFKSsVx9bEBld2pOrb1H1g1K2bgtSCKwcCtTdsOFlBqu1S0jf6FUaigYZK_Yhhg0kGWTO4Dk_4uXSc0hMowll698ObYmnfHBxymuzKPsrL7FCbP3HtLv7GR_NntRs3b9r4h-oLyiDU911OG1HQdfpb3d2Wnyf38kanXyKcnH6qSo7Ktt9h5OkF0Sh5wBeApCBLLzgGkexKJwnqwJfs6xu1cK9N8jGb6gdNYuOAmxl-EDH8RpGP7',
      },
    ],
    total: 250000,
  },
]
