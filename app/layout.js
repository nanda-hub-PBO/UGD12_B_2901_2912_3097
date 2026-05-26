import './globals.css'
import MaritimePlatform from './components/MaritimePlatform'

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <MaritimePlatform>{children}</MaritimePlatform>
      </body>
    </html>
  )
}
