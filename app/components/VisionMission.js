export default function VisionMission() {
  return (
    <section className="vm-section">
      <div className="vm-header">
        <div className="section-tag">{'// FILOSOFI KAMI'}</div>
        <h2>Visi &amp; <span>Misi</span> TESSERA</h2>
      </div>

      <div className="vm-grid">
        <div className="vm-card">
          <div className="vm-tag">— VISION</div>
          <h3><span className="vm-icon">🔭</span> Visi</h3>
          <p>
            Menjadi solusi teknologi pelabuhan terdepan dalam meningkatkan efisiensi
            dan visibilitas operasional kapal secara real-time.
          </p>
          <p className="sub">
            Kami percaya bahwa teknologi adalah kunci untuk mengoptimalkan operasional
            maritim di Indonesia. TESSERA hadir untuk memastikan setiap kapal terpantau
            dengan akurat dan setiap keputusan ditunjang oleh data real-time.
          </p>
        </div>

        <div className="vm-card">
          <div className="vm-tag">— MISSION</div>
          <h3><span className="vm-icon">🎯</span> Misi</h3>
          <div className="mission-list">
            <div className="mission-item">
              <span className="mission-num">01</span>
              <span>Mengembangkan <strong>sistem monitoring kapal terintegrasi</strong> dengan teknologi GPS tracking dan analytics real-time.</span>
            </div>
            <div className="mission-item">
              <span className="mission-num">02</span>
              <span>Menyediakan <strong>data real-time yang akurat</strong> untuk mendukung kepuasan operasional yang cepat dan tepat.</span>
            </div>
            <div className="mission-item">
              <span className="mission-num">03</span>
              <span>Mendukung <strong>efisiensi operasional pelabuhan</strong> melalui dashboard terpadu dan visualisasi data yang jelas.</span>
            </div>
            <div className="mission-item">
              <span className="mission-num">04</span>
              <span>Mendukung <strong>keselamatan</strong> melalui sistem alert otomatis dan monitoring kondisi risiko real-time.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
