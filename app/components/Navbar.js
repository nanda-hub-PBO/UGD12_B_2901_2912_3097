import Image from 'next/image'

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Image src="/tessera-logo.png" alt="Tessera logo" width={144} height={56} />
      </div>

      <ul className="nav-links">
        <li>Company</li>
        <li>Dashboard</li>
      </ul>

      <div className="nav-right">
        <button className="btn-contact">✉ Hubungi Kami</button>
        <div className="nav-icon">🔔</div>
        <button className="btn-admin">👤 Admin</button>
      </div>
    </nav>
  )
}
