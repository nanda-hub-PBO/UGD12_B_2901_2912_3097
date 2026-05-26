export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-left">
        <div className="hero-badge">MARITIME INTELLIGENCE PLATFORM</div>
        <h1>
          Navigate<br />
          <em>The Future</em>
        </h1>
        <p className="hero-sub">
          TESSERA menyediakan sistem monitoring kapal terintegrasi dengan teknologi
          real-time tracking, analytics dashboard, dan alert system untuk operasional
          pelabuhan yang lebih efisien dan aman.
        </p>
        <div className="hero-btns">
          <button className="btn-primary">Minta Penawaran →</button>
          <button className="btn-ghost">Lihat Layanan</button>
        </div>
      </div>

      <div className="terminal">
        <div className="terminal-bar">
          <div className="t-dot red"></div>
          <div className="t-dot yellow"></div>
          <div className="t-dot green"></div>
          <span className="terminal-title">TESSERA Terminal v2.0</span>
        </div>
        <div className="terminal-body">
          <div><span className="t-comment">{'// Connecting to Sat-07...'}</span></div>
          <div><span className="t-prompt">&gt;</span> <span className="t-ok">Status: Active</span></div>
          <div><span className="t-prompt">&gt;</span> <span className="t-ok">Vessels: <span className="t-val">142 Tracked</span></span></div>
          <div><span className="t-prompt">&gt;</span> <span className="t-ok">Weather: Clear - Sea State 2</span></div>
          <div><span className="t-prompt">|</span> <span className="t-warn">System Ready</span></div>
        </div>
        <div className="terminal-stats">
          <div className="t-stat">
            <div className="t-stat-label">UPTIME</div>
            <div className="t-stat-val green">99.9%</div>
          </div>
          <div className="t-stat">
            <div className="t-stat-label">LATENCY</div>
            <div className="t-stat-val purple">12ms</div>
          </div>
          <div className="t-stat">
            <div className="t-stat-label">CONNECTED</div>
            <div className="t-stat-val">142</div>
          </div>
          <div className="t-stat">
            <div className="t-stat-label">TIME</div>
            <div className="t-stat-val yellow">08:08:40</div>
          </div>
        </div>
      </div>
    </section>
  )
}
