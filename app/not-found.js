import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="error-page-shell">
      <section className="error-page-panel">
        <span className="error-page-code">404</span>
        <h1>Halaman tidak ditemukan</h1>
        <p>Alamat yang kamu buka tidak tersedia atau sudah dipindahkan.</p>
        <Link className="error-page-button" href="/">
          Kembali ke dashboard
        </Link>
      </section>
    </main>
  )
}
