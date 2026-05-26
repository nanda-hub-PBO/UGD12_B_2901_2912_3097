export default function StatsBar() {
  return (
    <div className="stats-bar">
      <div className="stat-item">
        <div className="stat-num">2024</div>
        <div className="stat-label">TAHUN BERDIRI</div>
      </div>
      <div className="stat-item">
        <div className="stat-num"><span className="plus">100+</span></div>
        <div className="stat-label">ARMADA KAPAL</div>
      </div>
      <div className="stat-item">
        <div className="stat-num"><span className="pct">99.9%</span></div>
        <div className="stat-label">SYSTEM UPTIME</div>
      </div>
      <div className="stat-item">
        <div className="stat-num">24/7</div>
        <div className="stat-label">REAL-TIME MONITOR</div>
      </div>
    </div>
  )
}