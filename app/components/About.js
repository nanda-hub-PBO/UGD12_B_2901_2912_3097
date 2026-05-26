export default function About() {
  return (
    <section className="section-wrap">
      <div className="about-grid">
        <div className="about-left">
          <div className="section-tag">{'// TENTANG KAMI'}</div>
          <h2>Monitoring <span>Real-Time</span><br />Terpercaya</h2>
          <p>
            TESSERA Maritime adalah platform teknologi maritim untuk operasional
            pelabuhan modern. Kami menyediakan monitoring real-time dengan visualisasi
            data yang jelas untuk meningkatkan efisiensi dan keselamatan operasional
            kapal di seluruh Indonesia.
          </p>
          <div className="services-mini">
            <div className="svc-card">
              <div className="svc-icon">📡</div>
              <div className="svc-name">GPS Tracking</div>
              <div className="svc-desc">Monitoring posisi kapal secara real-time 24/7</div>
            </div>
            <div className="svc-card">
              <div className="svc-icon">📊</div>
              <div className="svc-name">Analytics Dashboard</div>
              <div className="svc-desc">Visualisasi data performa dan efisiensi</div>
            </div>
            <div className="svc-card">
              <div className="svc-icon">🛡️</div>
              <div className="svc-name">Smart Alerts</div>
              <div className="svc-desc">Notifikasi cerdas untuk emergency</div>
            </div>
            <div className="svc-card">
              <div className="svc-icon">⚡</div>
              <div className="svc-name">Fast Response</div>
              <div className="svc-desc">Update data setiap 30-60 detik</div>
            </div>
          </div>
        </div>

        <div className="fleet-terminal">
          <div className="terminal-bar">
            <div className="t-dot red"></div>
            <div className="t-dot yellow"></div>
            <div className="t-dot green"></div>
            <span className="terminal-title">TESSERA FLEET MONITOR v2.0</span>
          </div>
          <div className="fleet-body">
            <div><span className="t-prompt">$</span> <span className="cmd">./track</span> <span className="arg">--vessel MV-NUSANTARA-07</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Status:</span> <span className="t-ok">ACTIVE</span> — <span style={{color:'#93c5fd'}}>Jakarta Bay</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Speed:</span> <span className="t-val">12.8 knots</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Cargo:</span> <span className="t-white">85% capacity</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">ETA Surabaya:</span> <span className="t-white">Apr 16 08:30</span></div>
            <br />
            <div><span className="t-prompt">$</span> <span className="cmd">./weather</span> <span className="arg">--route JKT-SBY</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Condition:</span> <span className="t-ok">Clear</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Wave Height:</span> <span className="t-ok">0.8m - SAFE</span></div>
            <div>&nbsp;&nbsp;<span className="warn-icon">⚠</span> <span className="key">Wind East</span> <span className="t-warn">18 km/h</span></div>
            <br />
            <div><span className="t-prompt">$</span> <span className="cmd">./fleet</span> <span className="arg">--status summary</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Active Vessels:</span> <span className="t-ok">95/100</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">Under Maintenance:</span> <span className="t-warn">5</span></div>
            <div>&nbsp;&nbsp;<span className="checkmark">✓</span> <span className="key">System Uptime:</span> <span className="t-ok">99.97%</span></div>
          </div>
        </div>
      </div>
    </section>
  )
}
