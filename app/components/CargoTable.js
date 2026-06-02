'use client'

import { useEffect, useState } from 'react'
import styles from './CargoTable.module.css'

export default function CargoTable() {
  const [cargo, setCargo] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const fetchCargo = async () => {
      try {
        const response = await fetch(`/api/cargo?query=${encodeURIComponent(query)}`)
        const data = await response.json()
        setCargo(data.items || [])
      } catch (error) {
        console.error('Failed to fetch cargo:', error)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchCargo, 300)
    return () => clearTimeout(timer)
  }, [query])

  const getStatusBadgeClass = (status) => {
    if (!status) return styles.statusDefault
    const lower = status.toLowerCase()
    if (lower.includes('diproses')) return styles.statusProcessing
    if (lower.includes('sampai') || lower.includes('terima')) return styles.statusDelivered
    return styles.statusDefault
  }

  const getStatusBadgeText = (status) => {
    return status || 'Diproses'
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Cargo Data</h2>
        <input
          type="text"
          placeholder="Cari RESI, pengirim, penerima..."
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>MO RESI</th>
                <th>PENGIRIM</th>
                <th>PENERIMA</th>
                <th>BARANG</th>
                <th>PENGIRIMAN</th>
                <th>BARANG</th>
                <th>TRANSAKSI</th>
                <th>HARGA</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {cargo.length === 0 ? (
                <tr>
                  <td colSpan="9" className={styles.noData}>
                    Tidak ada data cargo
                  </td>
                </tr>
              ) : (
                cargo.map((item) => (
                  <tr key={item.id}>
                    <td>{item.resi}</td>
                    <td>{item.senderName}</td>
                    <td>{item.receiverName}</td>
                    <td>{item.itemName}</td>
                    <td className={styles.statusCell}>
                      <span className={getStatusBadgeClass(item.deliveryStatus)}>
                        {getStatusBadgeText(item.deliveryStatus)}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      <span className={getStatusBadgeClass(item.itemStatus)}>
                        {getStatusBadgeText(item.itemStatus)}
                      </span>
                    </td>
                    <td className={styles.statusCell}>
                      <span className={getStatusBadgeClass(item.transactionStatus)}>
                        {getStatusBadgeText(item.transactionStatus)}
                      </span>
                    </td>
                    <td className={styles.priceCell}>
                      Rp {item.shippingPrice.toLocaleString('id-ID')}
                    </td>
                    <td className={styles.actionsCell}>
                      <button className={styles.editBtn} title="Edit">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M11.333 2.333l2.334 2.334M1 15h3l9.333-9.333L10.333 2l-9.333 9.333L1 15z" 
                                stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                      <button className={styles.deleteBtn} title="Delete">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M2 4h12M6.5 7v4M9.5 7v4M3 4l1 11c0 .333.333 1 1.5 1h5c1.167 0 1.5-.667 1.5-1l1-11" 
                                stroke="currentColor" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
