export default function Contact({ sectionRef = null }) {
  return (
    <section id="hubungi-kami" ref={sectionRef} className="contact-section">
      <div className="contact-grid">
        <div className="contact-left">
          <div className="section-tag">{'// HUBUNGI KAMI'}</div>
          <h2>Siap <span>Mengirim</span><br />Bersama?</h2>
          <p>
            Konsultasikan kebutuhan monitoring kapal Anda dengan tim kami.
            Kami siap memberikan solusi maritime intelligence terbaik untuk bisnis Anda.
          </p>
          <div className="contact-info">
            <div className="cinfo-item">
              <span className="cinfo-icon">📍</span>
              <div>
                <div className="cinfo-label">ALAMAT</div>
                <div className="cinfo-val">Jl. Maritime Hub No. 88, Tanjung Priok, Jakarta Utara 14310</div>
              </div>
            </div>
            <div className="cinfo-item">
              <span className="cinfo-icon">📞</span>
              <div>
                <div className="cinfo-label">TELEPON</div>
                <div className="cinfo-val">+62 21 5500 8800</div>
              </div>
            </div>
            <div className="cinfo-item">
              <span className="cinfo-icon">✉️</span>
              <div>
                <div className="cinfo-label">EMAIL</div>
                <div className="cinfo-val">info@tessera.co.id</div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input type="text" placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Perusahaan</label>
              <input type="text" placeholder="PT. Contoh" />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="email@perusahaan.com" />
            </div>
            <div className="form-group">
              <label>Nomor Telepon</label>
              <input type="text" placeholder="+62 8xx xxxx xxxx" />
            </div>
          </div>
          <div className="form-group">
            <label>Layanan yang Dibutuhkan</label>
            <select defaultValue="">
              <option value="" disabled>Pilih layanan...</option>
              <option>Fleet Monitoring</option>
              <option>Route Tracking</option>
              <option>Weather Monitor</option>
              <option>Alert System</option>
            </select>
          </div>
          <div className="form-group">
            <label>Pesan / Deskripsi Kargo</label>
            <textarea placeholder="Ceritakan kebutuhan monitoring Anda..." />
          </div>
          <button className="btn-submit">Kirim Permintaan →</button>
        </div>
      </div>
    </section>
  )
}
