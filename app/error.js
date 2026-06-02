'use client'

import Link from 'next/link'

export default function ErrorPage({ error, reset }) {
  return (
    <main className="error-page-shell">
      <section className="error-page-panel">
        <span className="error-page-code">ERROR</span>
        <h1>Terjadi kesalahan</h1>
        <p>{error?.message || 'Sistem gagal memuat halaman. Silakan coba lagi.'}</p>
        <div className="error-page-actions">
          <button type="button" className="error-page-button" onClick={reset}>
            Coba lagi
          </button>
          <Link className="error-page-button secondary" href="/">
            Kembali ke dashboard
          </Link>
        </div>
      </section>
    </main>
  )
}
