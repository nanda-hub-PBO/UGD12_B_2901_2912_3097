import './globals.css'

export const metadata = {
  title: {
    default: 'Tessera Maritime',
    template: '%s | Tessera Maritime'
  },
  description: 'Sistem Manajemen Transportasi Laut dan Kargo Terintegrasi',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  )
}
