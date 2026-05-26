export default function Features() {
  return (
    <section className="features-section">
      <div className="features-header">
        <div className="section-tag">{'// LAYANAN KAMI'}</div>
        <h2>Platform <span>Features</span></h2>
      </div>

      <div className="features-grid">
        <div className="feat-card">
          <div className="feat-icon-wrap">🚢</div>
          <h4>Fleet Monitoring</h4>
          <p>Real-time vessel tracking dan status monitoring dengan GPS precision</p>
          <span className="feat-badge green">REAL-TIME</span>
        </div>
        <div className="feat-card">
          <div className="feat-icon-wrap">🗺️</div>
          <h4>Route Tracking</h4>
          <p>Advanced route planning dan optimization untuk efisiensi maksimal</p>
          <span className="feat-badge">ANALYTICS</span>
        </div>
        <div className="feat-card">
          <div className="feat-icon-wrap">⛅</div>
          <h4>Weather Monitor</h4>
          <p>Live weather updates dan storm warnings untuk keselamatan navigasi</p>
          <span className="feat-badge yellow">SAFETY</span>
        </div>
        <div className="feat-card">
          <div className="feat-icon-wrap">🔔</div>
          <h4>Alert System</h4>
          <p>Critical notifications dan emergency alerts untuk response cepat</p>
          <span className="feat-badge red">EMERGENCY</span>
        </div>
      </div>
    </section>
  )
}
