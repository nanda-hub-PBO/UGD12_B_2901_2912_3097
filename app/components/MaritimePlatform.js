'use client'

import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense, use, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import About from './About'                               
import Contact from './Contact'
import Features from './Features'
import Hero from './Hero'
import StatsBar from './StatsBar'
import VisionMission from './VisionMission'

const vessels = [
  {
    id: 'V001',
    name: 'Pacific Explorer',
    status: 'En Route',
    route: 'Singapore - Tokyo',
    eta: '2h 15m',
    type: 'Container Ship',
    captain: 'Capt. John Smith',
    location: 'Pacific Ocean',
    speed: '18.5 kn',
    lat: '35.6762',
    lng: '139.6503',
    x: 54,
    y: 22,
  },
  {
    id: 'V002',
    name: 'Atlantic Star',
    status: 'In Port',
    route: 'Rotterdam - Rotterdam Port',
    eta: 'Docked',
    type: 'Bulk Carrier',
    captain: 'Capt. Maria Santos',
    location: 'Rotterdam Port',
    speed: '0 kn',
    lat: '51.9244',
    lng: '4.4777',
    x: 47,
    y: 36,
  },
  {
    id: 'V003',
    name: 'Indian Ocean',
    status: 'En Route',
    route: 'Mumbai - Dubai',
    eta: '5h 42m',
    type: 'Oil Tanker',
    captain: 'Capt. Ahmed Hassan',
    location: 'Arabian Sea',
    speed: '21.2 kn',
    lat: '25.2048',
    lng: '55.2708',
    x: 54,
    y: 31,
  },
  {
    id: 'V004',
    name: 'Arctic Voyager',
    status: 'Delayed',
    route: 'Oslo - Reykjavik',
    eta: '12h 30m',
    type: 'Container Ship',
    captain: 'Capt. Lars Olsen',
    location: 'North Atlantic',
    speed: '8.3 kn',
    lat: '64.1466',
    lng: '-21.9426',
    x: 24,
    y: 63,
  },
  {
    id: 'V005',
    name: 'Southern Cross',
    status: 'Maintenance',
    route: 'Sydney Drydock - Sydney',
    eta: '48h',
    type: 'Bulk Carrier',
    captain: 'Capt. James Wilson',
    location: 'Sydney Drydock',
    speed: '0 kn',
    lat: '-33.8688',
    lng: '151.2093',
    x: 74,
    y: 70,
  },
  {
    id: 'V006',
    name: 'Mediterranean',
    status: 'En Route',
    route: 'Athens - Valletta',
    eta: '3h 55m',
    type: 'Container Ship',
    captain: 'Capt. Sofia Romano',
    location: 'Mediterranean Sea',
    speed: '19.8 kn',
    lat: '35.8989',
    lng: '14.5146',
    x: 50,
    y: 33,
  },
]

const tabs = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'map', label: 'Map' },
  { id: 'analytics', label: 'Analytics' },
]

const submenuContent = {
  company: {
    leftTitle: 'Company',
    rightTitle: 'Highlights',
    leftItems: [
      { title: 'Company Profile', detail: 'Halaman profil perusahaan', target: 'company' },
      { title: 'Vision & Mission', detail: 'Arah dan tujuan utama', target: 'company' },
      { title: 'Services', detail: 'Solusi maritime logistics', target: 'company' },
    ],
    rightItems: [
      { title: 'Dashboard', detail: 'Masuk ke overview utama', target: 'dashboard' },
      { title: 'Fleet', detail: 'Pantau armada kapal', target: 'fleet' },
      { title: 'Contact', detail: 'Hubungi tim Tessera', target: 'company' },
    ],
  },
  dashboard: {
    leftTitle: 'Overview',
    rightTitle: 'Quick Stats',
    leftItems: [
      { title: 'Dashboard', detail: 'Stats kapal & monitoring', target: 'dashboard' },
      { title: 'Monitoring', detail: 'Live tracking & map', target: 'map' },
      { title: 'Fleet', detail: 'Daftar armada kapal', target: 'fleet' },
      { title: 'Analytics', detail: 'Laporan & statistik', target: 'analytics' },
    ],
    rightItems: [
      { title: 'Total Kapal', detail: '12 vessels', target: 'fleet' },
      { title: 'En Route', detail: '5 active', target: 'fleet' },
      { title: 'In Port', detail: '4 docked', target: 'fleet' },
    ],
  },
  fleet: {
    leftTitle: 'Fleet Management',
    rightTitle: 'Status',
    leftItems: [
      { title: 'Fleet List', detail: 'Detail semua kapal', target: 'fleet' },
      { title: 'Live Map', detail: 'Real-time tracking', target: 'map' },
      { title: 'Dashboard', detail: 'Monitoring overview', target: 'dashboard' },
      { title: 'Analytics', detail: 'Performance metrics', target: 'analytics' },
    ],
    rightItems: [
      { title: 'En Route', detail: '5 vessels', target: 'fleet' },
      { title: 'In Port', detail: '4 vessels', target: 'fleet' },
      { title: 'Maintenance', detail: '1 vessel', target: 'fleet' },
      { title: 'Delayed', detail: '2 vessels', target: 'fleet' },
    ],
  },
  map: {
    leftTitle: 'Live Tracking',
    rightTitle: 'Features',
    leftItems: [
      { title: 'Monitoring', detail: 'Live map & tracking', target: 'map' },
      { title: 'Fleet Overview', detail: 'All vessels status', target: 'fleet' },
      { title: 'Dashboard', detail: 'Quick stats', target: 'dashboard' },
    ],
    rightItems: [
      { title: 'Real-time GPS', detail: 'Live positions', target: 'map' },
      { title: 'Weather Data', detail: 'Conditions', target: 'dashboard' },
      { title: 'Route Overlay', detail: 'Planned routes', target: 'analytics' },
    ],
  },
  analytics: {
    leftTitle: 'Reports',
    rightTitle: 'Metrics',
    leftItems: [
      { title: 'Analytics', detail: 'Laporan lengkap', target: 'analytics' },
      { title: 'Dashboard', detail: 'Live monitoring', target: 'dashboard' },
      { title: 'Fleet', detail: 'Fleet performance', target: 'fleet' },
    ],
    rightItems: [
      { title: 'On-Time Rate', detail: '92% success', target: 'analytics' },
      { title: 'Fuel Efficiency', detail: '87% score', target: 'analytics' },
      { title: 'Safety Score', detail: '95% rating', target: 'analytics' },
    ],
  },
}

const authAccounts = [
  {
    username: 'admintessera',
    password: 'kelompok3',
    role: 'admin',
  },
  {
    username: 'usertessera',
    password: 'kelompok3',
    role: 'user',
  },
]

const AUTH_STORAGE_KEY = 'tessera-auth-session'
const AUTH_EVENT = 'tessera-auth-change'

const statusColors = {
  'En Route': 'green',
  'In Port': 'blue',
  Delayed: 'yellow',
  Maintenance: 'red',
}

const monthlyVolume = [46, 52, 48, 61, 55, 68]
const routeDuration = [
  { label: 'SG-JP', value: 48 },
  { label: 'EU-AS', value: 71 },
  { label: 'US-EU', value: 96 },
  { label: 'AS-ME', value: 35 },
  { label: 'AU-AS', value: 52 },
]

const initialUsers = [
  { id: 'U001', name: 'John Doe', email: 'john@tessera.com', role: 'Admin', status: 'Active' },
  { id: 'U002', name: 'Sarah Smith', email: 'sarah@tessera.com', role: 'Operator', status: 'Active' },
  { id: 'U003', name: 'Mike Johnson', email: 'mike@tessera.com', role: 'Operator', status: 'Active' },
  { id: 'U004', name: 'Emma Wilson', email: 'emma@tessera.com', role: 'Operator', status: 'Inactive' },
  { id: 'U005', name: 'David Brown', email: 'david@tessera.com', role: 'Admin', status: 'Active' },
  { id: 'U006', name: 'Lisa Anderson', email: 'lisa@tessera.com', role: 'Operator', status: 'Active' },
]

const activityItems = [
  { id: 1, type: 'login', title: 'Logged in to system', actor: 'John Doe', detail: 'IP: 192.168.1.100', time: '2 min ago' },
  { id: 2, type: 'shift', title: 'Started day shift', actor: 'Sarah Smith', detail: 'Shift: 06:00 - 18:00', time: '15 min ago' },
  { id: 3, type: 'action', title: 'Updated vessel V001 status', actor: 'Mike Johnson', detail: 'Changed status to En Route', time: '32 min ago' },
  { id: 4, type: 'alert', title: 'Storm warning triggered', actor: 'System', detail: 'Arctic Voyager - Category 4 storm', time: '45 min ago' },
  { id: 5, type: 'logout', title: 'Logged out from system', actor: 'Emma Wilson', detail: 'Session ended normally', time: '1 hour ago' },
]

const workflowStatuses = ['Diproses', 'Dalam Pengiriman', 'Sampai Tujuan', 'Pending', 'Selesai']

const vehicleTypes = ['Truk Kontainer', 'Truk Box', 'Pickup Cargo', 'Trailer']

const vehicleStatuses = ['Diproses', 'Dalam Pengiriman', 'Pending', 'Selesai']

const viewTransitionCache = new Map()

function getViewTransitionPromise(viewKey) {
  const cachedPromise = viewTransitionCache.get(viewKey)

  if (cachedPromise) {
    return cachedPromise
  }

  const promise = new Promise((resolve) => {
    setTimeout(resolve, 450)
  })

  viewTransitionCache.set(viewKey, promise)
  return promise
}

const weatherSnapshot = {
  temperature: '24°C',
  condition: 'Partly Cloudy',
  wind: '15 km/h',
  windDirection: 'NE',
  humidity: '68%',
  visibility: '10 km',
  pressure: '1013 hPa',
}

const weatherWarnings = [
  {
    id: 'w1',
    title: 'Category 4 storm approaching',
    affected: 'Arctic Voyager, Pacific Explorer',
    tone: 'critical',
    badge: 'Critical',
  },
  {
    id: 'w2',
    title: 'High winds expected',
    affected: 'Mediterranean',
    tone: 'warning',
    badge: 'Warning',
  },
]

const initialNotifications = [
  {
    id: 'n1',
    title: 'Severe Storm Warning',
    vessel: 'Arctic Voyager',
    message: 'Category 4 storm approaching vessel route. Recommend course adjustment.',
    tone: 'critical',
    badge: 'Critical',
    time: '21 min ago',
    read: false,
  },
  {
    id: 'n2',
    title: 'Engine Temperature High',
    vessel: 'Southern Cross',
    message: 'Main engine temperature exceeding normal operating range.',
    tone: 'warning',
    badge: 'Warning',
    time: '15 min ago',
    read: false,
  },
  {
    id: 'n3',
    title: 'Signal Strength Low',
    vessel: 'Indian Ocean',
    message: 'Satellite communication signal intermittent. Switching to backup.',
    tone: 'info',
    badge: 'Info',
    time: '1 hour ago',
    read: true,
  },
]

const serverAuthSnapshot = Object.freeze({
  isAuthenticated: false,
  isAuthReady: false,
  userRole: null,
})

let cachedAuthSnapshot = serverAuthSnapshot

function readStoredAuthSession() {
  if (typeof window === 'undefined') {
    return serverAuthSnapshot
  }

  const storedSession = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
  let nextSnapshot

  if (!storedSession) {
    nextSnapshot = {
      isAuthenticated: false,
      isAuthReady: true,
      userRole: null,
    }
  } else {
    try {
      const parsedSession = JSON.parse(storedSession)

      if (parsedSession?.isAuthenticated && parsedSession?.role) {
        nextSnapshot = {
          isAuthenticated: true,
          isAuthReady: true,
          userRole: parsedSession.role,
        }
      }
    } catch {
      window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  if (!nextSnapshot) {
    nextSnapshot = {
      isAuthenticated: false,
      isAuthReady: true,
      userRole: null,
    }
  }

  if (
    cachedAuthSnapshot.isAuthenticated === nextSnapshot.isAuthenticated &&
    cachedAuthSnapshot.isAuthReady === nextSnapshot.isAuthReady &&
    cachedAuthSnapshot.userRole === nextSnapshot.userRole
  ) {
    return cachedAuthSnapshot
  }

  cachedAuthSnapshot = nextSnapshot
  return cachedAuthSnapshot
}

function getServerAuthSnapshot() {
  return serverAuthSnapshot
}

function subscribeAuthSession(callback) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const handleStorage = (event) => {
    if (!event.key || event.key === AUTH_STORAGE_KEY) {
      callback()
    }
  }

  const handleAuthChange = () => {
    callback()
  }

  window.addEventListener('storage', handleStorage)
  window.addEventListener(AUTH_EVENT, handleAuthChange)

  return () => {
    window.removeEventListener('storage', handleStorage)
    window.removeEventListener(AUTH_EVENT, handleAuthChange)
  }
}

function countByStatus(status) {
  return vessels.filter((vessel) => vessel.status === status).length
}

function getRouteHref(tabId) {
  switch (tabId) {
    case 'dashboard':
      return '/dashboard'
    case 'fleet':
      return '/fleet'
    case 'analytics':
      return '/analytics'
    default:
      return null
  }
}

function getTabFromPathname(pathname) {
  switch (pathname) {
    case '/dashboard':
      return 'dashboard'
    case '/fleet':
      return 'fleet'
    case '/analytics':
      return 'analytics'
    default:
      return null
  }
}

function Icon({ name }) {
  const common = { width: 16, height: 16, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

  switch (name) {
    case 'dashboard':
      return (
        <svg {...common}>
          <path d="M3 13h8V3H3zM13 21h8v-6h-8zM13 10h8V3h-8zM3 21h8v-4H3z" />
        </svg>
      )
    case 'fleet':
      return (
        <svg {...common}>
          <path d="M3 18c2.5-2.5 5.2-3.8 9-3.8s6.5 1.3 9 3.8" />
          <path d="M6 16 8.5 7h7L18 16" />
          <path d="M9 7h6" />
          <circle cx="7" cy="18" r="1.2" />
          <circle cx="17" cy="18" r="1.2" />
        </svg>
      )
    case 'map':
      return (
        <svg {...common}>
          <path d="M12 21s6-5.3 6-11a6 6 0 1 0-12 0c0 5.7 6 11 6 11Z" />
          <circle cx="12" cy="10" r="2.2" />
        </svg>
      )
    case 'analytics':
      return (
        <svg {...common}>
          <path d="m4 15 5-5 4 4 7-8" />
          <path d="M4 20h16" />
        </svg>
      )
    case 'mail':
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      )
    case 'bell':
      return (
        <svg {...common}>
          <path d="M15 17H5.5a1.5 1.5 0 0 1-1.3-2.2L6 12V9a6 6 0 1 1 12 0v3l1.8 2.8A1.5 1.5 0 0 1 18.5 17H15" />
          <path d="M9.5 20a2.5 2.5 0 0 0 5 0" />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" />
          <path d="M5 20a7 7 0 0 1 14 0" />
        </svg>
      )
    case 'anchor':
      return (
        <svg {...common}>
          <circle cx="12" cy="5" r="1.5" />
          <path d="M12 7v11" />
          <path d="M8 10h8" />
          <path d="M7 14a5 5 0 0 0 10 0" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...common}>
          <path d="M12 4 3.8 18a1 1 0 0 0 .9 1.5h14.6a1 1 0 0 0 .9-1.5L12 4Z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      )
    case 'tool':
      return (
        <svg {...common}>
          <path d="m14 7 3-3 3 3-3 3" />
          <path d="m4 20 8.5-8.5" />
          <path d="m9 5 10 10" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 8v5l3 2" />
        </svg>
      )
    case 'percent':
      return (
        <svg {...common}>
          <path d="m6 18 12-12" />
          <circle cx="7.5" cy="7.5" r="1.8" />
          <circle cx="16.5" cy="16.5" r="1.8" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        </svg>
      )
    case 'filter':
      return (
        <svg {...common}>
          <path d="M4 6h16l-6 7v5l-4-2v-3z" />
        </svg>
      )
    case 'expand':
      return (
        <svg {...common}>
          <path d="M14 4h6v6" />
          <path d="m20 4-7 7" />
          <path d="M10 20H4v-6" />
          <path d="m4 20 7-7" />
        </svg>
      )
    case 'ship':
      return (
        <svg {...common}>
          <path d="M4 16c2.4 1.6 4.8 2.4 8 2.4s5.6-.8 8-2.4" />
          <path d="m7 14 1.8-6h6.4L17 14" />
          <path d="M9 8V5h6v3" />
        </svg>
      )
    case 'route':
      return (
        <svg {...common}>
          <path d="M6 18h.01" />
          <path d="M18 6h.01" />
          <path d="M7 18c4 0 2-8 8-8" />
        </svg>
      )
    case 'users':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.5" />
          <path d="M4 18a5 5 0 0 1 10 0" />
          <circle cx="17" cy="10" r="2" />
          <path d="M15 18a4 4 0 0 1 5 0" />
        </svg>
      )
    case 'activity':
      return (
        <svg {...common}>
          <path d="M3 12h4l2-5 4 10 2-5h6" />
        </svg>
      )
    case 'add-user':
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="2.5" />
          <path d="M4 18a5 5 0 0 1 10 0" />
          <path d="M19 8v6" />
          <path d="M16 11h6" />
        </svg>
      )
    case 'edit':
      return (
        <svg {...common}>
          <path d="M4 20h4l10-10-4-4L4 16v4Z" />
          <path d="m12 6 4 4" />
        </svg>
      )
    case 'delete':
      return (
        <svg {...common}>
          <path d="M5 7h14" />
          <path d="M9 7V5h6v2" />
          <path d="M8 7v12h8V7" />
        </svg>
      )
    case 'login':
      return (
        <svg {...common}>
          <path d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
          <path d="m13 15 4-3-4-3" />
          <path d="M9 12h8" />
        </svg>
      )
    case 'logout':
      return (
        <svg {...common}>
          <path d="M10 17H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4" />
          <path d="m14 9 4 3-4 3" />
          <path d="M18 12H9" />
        </svg>
      )
    case 'chevron-left':
      return (
        <svg {...common}>
          <path d="m15 6-6 6 6 6" />
        </svg>
      )
    case 'chevron-right':
      return (
        <svg {...common}>
          <path d="m9 6 6 6-6 6" />
        </svg>
      )
    case 'alert':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
          <path d="M12 8v4" />
          <path d="M12 16h.01" />
        </svg>
      )
    case 'weather':
      return (
        <svg {...common}>
          <path d="M8 18h8a4 4 0 0 0 .6-8A5.5 5.5 0 0 0 6 11.5 3.5 3.5 0 0 0 8 18Z" />
        </svg>
      )
    case 'humidity':
      return (
        <svg {...common}>
          <path d="M12 4s4.5 4.7 4.5 8.2A4.5 4.5 0 1 1 7.5 12.2C7.5 8.7 12 4 12 4Z" />
        </svg>
      )
    case 'visibility':
      return (
        <svg {...common}>
          <path d="M2.5 12s3.5-5 9.5-5 9.5 5 9.5 5-3.5 5-9.5 5-9.5-5-9.5-5Z" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      )
    case 'pressure':
      return (
        <svg {...common}>
          <circle cx="12" cy="13" r="7" />
          <path d="M12 13 16 9" />
          <path d="M12 6v1" />
        </svg>
      )
    case 'sound':
      return (
        <svg {...common}>
          <path d="M11 5 7 8H4v8h3l4 3V5Z" />
          <path d="M16 9a4 4 0 0 1 0 6" />
          <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />
        </svg>
      )
    case 'close':
      return (
        <svg {...common}>
          <path d="m6 6 12 12" />
          <path d="M18 6 6 18" />
        </svg>
      )
    default:
      return null
  }
}

function NotificationPanel({
  notifications,
  unreadCount,
  onClose,
  onToggleRead,
}) {
  const summary = {
    critical: notifications.filter((item) => item.tone === 'critical').length,
    warning: notifications.filter((item) => item.tone === 'warning').length,
    info: notifications.filter((item) => item.tone === 'info').length,
  }

  const weatherMetrics = [
    { label: 'Wind', value: weatherSnapshot.wind, note: weatherSnapshot.windDirection, icon: 'route', tone: 'violet' },
    { label: 'Humidity', value: weatherSnapshot.humidity, icon: 'humidity', tone: 'cyan' },
    { label: 'Visibility', value: weatherSnapshot.visibility, icon: 'visibility', tone: 'green' },
    { label: 'Pressure', value: weatherSnapshot.pressure, icon: 'pressure', tone: 'yellow' },
  ]

  return (
    <>
      <button
        type="button"
        className="notification-overlay"
        onClick={onClose}
        aria-label="Close notifications"
      />
      <aside className="notification-panel" role="dialog" aria-modal="true" aria-label="Weather and emergency notifications">
        <button type="button" className="notification-close-button" onClick={onClose} aria-label="Exit notifications">
          <Icon name="close" />
        </button>
        <div className="notification-card weather-card">
          <div className="notification-block-header">
            <div className="notification-title-group">
              <span className="notification-icon weather">
                <Icon name="weather" />
              </span>
              <div>
                <h2>WEATHER</h2>
                <p>Current conditions</p>
              </div>
            </div>
          </div>

          <div className="weather-surface">
            <div className="weather-current">
              <span className="notification-icon cyan weather-current-icon">
                <Icon name="weather" />
              </span>
              <div>
                <strong>{weatherSnapshot.temperature}</strong>
                <span>{weatherSnapshot.condition}</span>
              </div>
            </div>

            <div className="weather-metrics">
              {weatherMetrics.map((metric) => (
                <article key={metric.label} className="weather-metric">
                  <span className={`weather-metric-label ${metric.tone}`}>
                    <Icon name={metric.icon} />
                    {metric.label}
                  </span>
                  <strong>{metric.value}</strong>
                  {metric.note ? <small>{metric.note}</small> : null}
                </article>
              ))}
            </div>
          </div>

          <div className="notification-warning-stack">
            <span className="notification-subheading">Weather warnings</span>
            {weatherWarnings.map((warning) => (
              <article key={warning.id} className={`notification-alert-card ${warning.tone}`}>
                <div className="notification-alert-copy">
                  <div className="notification-alert-title-row">
                    <span className={`notification-icon ${warning.tone}`}>
                      <Icon name="warning" />
                    </span>
                    <strong>{warning.title}</strong>
                  </div>
                  <p>Affected: {warning.affected}</p>
                </div>
                <span className={`notification-pill ${warning.tone}`}>{warning.badge}</span>
              </article>
            ))}
          </div>
        </div>

        <div className="notification-card active-alerts-card">
          <div className="notification-block-header notification-block-header-alerts">
            <div className="notification-title-group">
              <span className="notification-icon critical">
                <Icon name="alert" />
              </span>
              <div>
                <h2>ACTIVE ALERTS</h2>
                <p>{unreadCount} active notifications</p>
              </div>
            </div>
            <button type="button" className="icon-button notification-sound-button" aria-label="Notification sound status">
              <Icon name="sound" />
            </button>
          </div>

          <div className="notification-alert-list">
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                className={`notification-alert-card ${notification.tone} ${notification.read ? 'is-read' : ''}`}
                onClick={() => onToggleRead(notification.id)}
              >
                <div className="notification-alert-copy">
                  <div className="notification-alert-title-row">
                    <span className={`notification-icon ${notification.tone}`}>
                      <Icon name={notification.tone === 'info' ? 'sound' : notification.tone === 'warning' ? 'tool' : 'alert'} />
                    </span>
                    <strong>{notification.title}</strong>
                  </div>
                  <span className="notification-vessel">{notification.vessel}</span>
                  <p>{notification.message}</p>
                </div>
                <div className="notification-alert-meta">
                  <span className={`notification-pill ${notification.tone}`}>{notification.badge}</span>
                  <time>{notification.time}</time>
                </div>
              </button>
            ))}
          </div>

          <div className="notification-summary-grid">
            <article className="notification-summary critical">
              <strong>{summary.critical}</strong>
              <span>Critical</span>
            </article>
            <article className="notification-summary warning">
              <strong>{summary.warning}</strong>
              <span>Warning</span>
            </article>
            <article className="notification-summary info">
              <strong>{summary.info}</strong>
              <span>Info</span>
            </article>
          </div>
        </div>
      </aside>
    </>
  )
}

function LoginScreen({ username, password, error, onChange, onSubmit }) {
  return (
    <main className="login-screen">
      <div className="login-card">
        <h1>LOGIN</h1>
        <div className="login-brand">
          <Image src="/tessera-logo.png" alt="Tessera logo" width={124} height={124} priority />
        </div>

        <form className="login-form" onSubmit={onSubmit}>
          <label className="login-field">
            <span>Username</span>
            <input
              type="text"
              value={username}
              onChange={(event) => onChange('username', event.target.value)}
              autoComplete="username"
              suppressHydrationWarning
            />
          </label>

          <label className="login-field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => onChange('password', event.target.value)}
              autoComplete="current-password"
              suppressHydrationWarning
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="login-submit" suppressHydrationWarning>
            Sign in
          </button>
        </form>
      </div>
    </main>
  )
}

function LoginModal({ username, password, error, onChange, onSubmit, onClose }) {
  return (
    <div className="login-modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="login-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-label="Login Tessera"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="icon-button login-modal-close" onClick={onClose} aria-label="Tutup login">
          <Icon name="close" />
        </button>
        <LoginScreen
          username={username}
          password={password}
          error={error}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

function NavSubmenu({ tabId, onSelectTab }) {
  const section = submenuContent[tabId]

  if (!section) {
    return null
  }

  return (
    <div className="nav-submenu" role="menu" aria-label={`${tabId} submenu`}>
      <div className="nav-submenu-pointer" />
      <div className="nav-submenu-grid">
        <div className="nav-submenu-column">
          <h3>{section.leftTitle}</h3>
          {section.leftItems.map((item) => (
            <button
              key={`${tabId}-${item.title}`}
              type="button"
              className="nav-submenu-item"
              onClick={() => onSelectTab(item.target)}
            >
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </button>
          ))}
        </div>
        <div className="nav-submenu-column">
          <h3>{section.rightTitle}</h3>
          {section.rightItems.map((item) => (
            <button
              key={`${tabId}-${item.title}`}
              type="button"
              className="nav-submenu-item"
              onClick={() => onSelectTab(item.target)}
            >
              <strong>{item.title}</strong>
              <span>{item.detail}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DashboardView({ onSelectTab }) {
  const cards = [
    { label: 'Total Kapal', value: vessels.length, icon: 'fleet', tone: 'violet' },
    { label: 'En Route', value: countByStatus('En Route'), icon: 'analytics', tone: 'green' },
    { label: 'In Port', value: countByStatus('In Port'), icon: 'anchor', tone: 'blue' },
    { label: 'Delayed', value: countByStatus('Delayed'), icon: 'warning', tone: 'yellow' },
    { label: 'Maintenance', value: countByStatus('Maintenance'), icon: 'tool', tone: 'red' },
  ]

  return (
    <section className="console-section">
      <div className="section-heading">
        <h1>DASHBOARD OVERVIEW</h1>
      </div>

      <div className="overview-grid">
        {cards.map((card) => (
          <article key={card.label} className={`metric-card tone-${card.tone}`}>
            <div className="metric-icon">
              <Icon name={card.icon} />
            </div>
            <div className="metric-copy">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="panel-card">
        <div className="panel-header">
          <div>
            <h2>DAFTAR KAPAL</h2>
            <p>Status perjalanan real-time</p>
          </div>
          <span className="live-badge">
            <span className="live-dot" />
            LIVE
          </span>
        </div>

        <div className="table-wrap">
          <table className="fleet-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAMA KAPAL</th>
                <th>STATUS</th>
                <th>RUTE</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {vessels.slice(0, 5).map((vessel) => (
                <tr key={vessel.id}>
                  <td>{vessel.id}</td>
                  <td>
                    <div className="table-ship">
                      <Icon name="ship" />
                      <span>{vessel.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${statusColors[vessel.status]}`}>{vessel.status}</span>
                  </td>
                  <td>{vessel.route}</td>
                  <td>{vessel.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button className="inline-link" onClick={() => onSelectTab('fleet')}>
          Lihat armada lengkap
        </button>
      </div>
    </section>
  )
}

function FleetView() {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('All')
  const [requestedPage, setRequestedPage] = useState(1)

  const filteredVessels = useMemo(() => {
    return vessels.filter((vessel) => {
      const matchesQuery =
        vessel.name.toLowerCase().includes(query.toLowerCase()) ||
        vessel.id.toLowerCase().includes(query.toLowerCase()) ||
        vessel.location.toLowerCase().includes(query.toLowerCase())
      const matchesFilter = filter === 'All' ? true : vessel.status === filter

      return matchesQuery && matchesFilter
    })
  }, [filter, query])

  const filters = ['All', 'En Route', 'In Port', 'Delayed', 'Maintenance']
  const fleetPageSize = 4
  const fleetTotalPages = Math.max(1, Math.ceil(filteredVessels.length / fleetPageSize))
  const currentPage = Math.min(requestedPage, fleetTotalPages)
  const paginatedVessels = useMemo(() => {
    const startIndex = (currentPage - 1) * fleetPageSize
    return filteredVessels.slice(startIndex, startIndex + fleetPageSize)
  }, [currentPage, filteredVessels, fleetPageSize])

  return (
    <section className="console-section">
      <div className="toolbar-card">
        <div className="toolbar-top">
          <label className="search-field">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search vessels..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setRequestedPage(1)
              }}
            />
          </label>

          <div className="filter-group">
            {filters.map((item) => (
              <button
                key={item}
                className={`filter-button ${filter === item ? 'active' : ''}`}
                onClick={() => {
                  setFilter(item)
                  setRequestedPage(1)
                }}
                type="button"
              >
                {item === 'All' ? <Icon name="filter" /> : null}
                {item}
              </button>
            ))}
          </div>

        </div>

        <div className="toolbar-stats">
          <div className="toolbar-stat">
            <span className="toolbar-label green">ACTIVE</span>
            <strong>{countByStatus('En Route')} vessels</strong>
          </div>
          <div className="toolbar-stat">
            <span className="toolbar-label blue">IN PORT</span>
            <strong>{countByStatus('In Port')} vessel</strong>
          </div>
          <div className="toolbar-stat">
            <span className="toolbar-label yellow">DELAYED</span>
            <strong>{countByStatus('Delayed')} vessel</strong>
          </div>
          <div className="toolbar-stat stream">
            <span className="toolbar-label violet">STREAMING</span>
            <strong>LIVE</strong>
          </div>
        </div>
      </div>

      <div className="section-heading">
        <h1>FLEET MANAGEMENT</h1>
        <p>Detail informasi armada kapal</p>
      </div>

      <div className="fleet-grid">
        {paginatedVessels.map((vessel) => (
          <article key={vessel.id} className="fleet-card">
            <div className="fleet-card-top">
              <div className="fleet-card-title">
                <span className="fleet-icon">
                  <Icon name="ship" />
                </span>
                <div>
                  <h3>{vessel.name}</h3>
                  <p>{vessel.id}</p>
                </div>
              </div>
              <span className={`status-badge ${statusColors[vessel.status]}`}>{vessel.status}</span>
            </div>

            <div className="fleet-meta">
              <div><span>JENIS:</span><strong>{vessel.type}</strong></div>
              <div><span>KAPTEN:</span><strong>{vessel.captain}</strong></div>
              <div><span>LOKASI:</span><strong>{vessel.location}</strong></div>
              <div><span>ETA:</span><strong>{vessel.eta}</strong></div>
            </div>

            <div className="fleet-footer">
              <span>Speed</span>
              <strong>{vessel.speed}</strong>
            </div>
          </article>
        ))}
      </div>

      <PaginationControls
        currentPage={currentPage}
        totalPages={fleetTotalPages}
        totalItems={filteredVessels.length}
        onPageChange={setRequestedPage}
      />

      {filteredVessels.length === 0 ? (
        <div className="empty-state">Tidak ada kapal yang cocok dengan pencarian atau filter saat ini.</div>
      ) : null}
    </section>
  )
}

function MapView({ selectedVesselId, onSelectVessel }) {
  const selectedVessel = vessels.find((vessel) => vessel.id === selectedVesselId) ?? vessels[0]
  const [isExpanded, setIsExpanded] = useState(false)
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 })
  const [dragState, setDragState] = useState(null)

  const clampOffset = (nextOffset) => {
    if (!isExpanded) {
      return { x: 0, y: 0 }
    }

    const maxOffset = { x: 240, y: 140 }

    return {
      x: Math.max(-maxOffset.x, Math.min(maxOffset.x, nextOffset.x)),
      y: Math.max(-maxOffset.y, Math.min(maxOffset.y, nextOffset.y)),
    }
  }

  useEffect(() => {
    if (!isExpanded) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsExpanded(false)
        setMapOffset({ x: 0, y: 0 })
        setDragState(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded])

  const handleToggleExpand = () => {
    setIsExpanded((current) => {
      const next = !current

      if (!next) {
        setMapOffset({ x: 0, y: 0 })
        setDragState(null)
      }

      return next
    })
  }

  const handlePointerDown = (event) => {
    if (!isExpanded) {
      return
    }

    event.currentTarget.setPointerCapture(event.pointerId)
    setDragState({
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: mapOffset.x,
      originY: mapOffset.y,
    })
  }

  const handlePointerMove = (event) => {
    if (!dragState || !isExpanded) {
      return
    }

    const deltaX = event.clientX - dragState.startX
    const deltaY = event.clientY - dragState.startY

    setMapOffset(
      clampOffset({
        x: dragState.originX + deltaX,
        y: dragState.originY + deltaY,
      })
    )
  }

  const handlePointerUp = (event) => {
    if (dragState?.pointerId === event.pointerId) {
      event.currentTarget.releasePointerCapture(event.pointerId)
      setDragState(null)
    }
  }

  return (
    <section className="console-section">
      <div className="panel-card">
        <div className="panel-header">
          <div>
            <div className="map-title-row">
              <Icon name="map" />
              <h2>GLOBAL TRACKING</h2>
              <span className="live-pill">LIVE</span>
            </div>
            <p>Real-time vessel monitoring - Updated: 2s ago</p>
          </div>

          <button
            className="icon-button"
            type="button"
            aria-label={isExpanded ? 'Collapse map' : 'Expand map'}
            onClick={handleToggleExpand}
          >
            <Icon name="expand" />
          </button>
        </div>

        {isExpanded ? (
          <button
            type="button"
            className="map-expanded-backdrop"
            onClick={handleToggleExpand}
            aria-label="Close expanded map"
          />
        ) : null}

        <div
          className={`map-stage ${isExpanded ? 'expanded' : ''} ${dragState ? 'dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <div className="map-coords">LAT: {selectedVessel.lat} deg | LNG: {selectedVessel.lng} deg</div>
          <div
            className="map-canvas"
            style={{
              transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${isExpanded ? 1.85 : 1.08})`,
            }}
          >
            <svg className="map-svg" viewBox="0 0 1200 620" role="img" aria-label="Global vessel tracking map">
              <g className="map-grid">
                {[140, 280, 420, 560].map((y) => (
                  <line key={`lat-${y}`} x1="40" y1={y} x2="1160" y2={y} />
                ))}
                {[180, 360, 540, 720, 900, 1080].map((x) => (
                  <line key={`lng-${x}`} x1={x} y1="40" x2={x} y2="580" />
                ))}
              </g>

              <g className="map-land">
                <path d="M138 138 188 102 252 128 277 186 268 243 228 292 190 336 154 300 126 248 126 176 138 138Z" />
                <path d="m190 350 28 58-14 58-24 62-34 32-24-34-14-56-10-56 28-20 34-44z" />
                <path d="M485 112 512 102 528 120 524 150 500 162 480 150 478 124Z" />
                <path d="m520 134 48-14 58 18 36 44-12 42-54 18-40 8-36-26z" />
                <path d="m554 262 58-16 40 52-10 70-14 90-40 34-34-38-16-72V262Z" />
                <path d="m732 118 116-18 96 38 56 26 44 78-44 60-96-34-92-36-58-32-22-32z" />
                <path d="m854 370 76-18 38 44-20 56-70-12-52-38z" />
                <path d="m906 468 60 24 48 34-16 34-72-10-58-28-12-30z" />
                <path d="M106 96 136 74 166 86 164 116 126 126 100 114Z" />
              </g>

              <g className="route-lines">
                <line x1="412" y1="148" x2="560" y2="300" />
                <line x1="468" y1="352" x2="596" y2="330" />
                <line x1="594" y1="206" x2="892" y2="182" />
              </g>

              {vessels.map((vessel) => (
                <g
                  key={vessel.id}
                  className={`map-marker ${selectedVessel.id === vessel.id ? 'active' : ''} ${statusColors[vessel.status]}`}
                  transform={`translate(${vessel.x * 12}, ${vessel.y * 6.1})`}
                  onClick={() => onSelectVessel(vessel.id)}
                >
                  <circle className="marker-pulse" r="18" />
                  <circle className="marker-ring" r="10" />
                  <circle className="marker-core" r="5" />
                </g>
              ))}
            </svg>
          </div>

          <div className="map-legend">
            <span>STATUS LEGEND</span>
            <button type="button" className="legend-item green" onClick={() => onSelectVessel('V001')}>
              En Route
            </button>
            <button type="button" className="legend-item blue" onClick={() => onSelectVessel('V002')}>
              In Port
            </button>
            <button type="button" className="legend-item yellow" onClick={() => onSelectVessel('V004')}>
              Delayed
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function AnalyticsView() {
  const statCards = [
    { label: 'Total Perjalanan', value: '328', note: 'Last 6 months', icon: 'fleet', tone: 'violet' },
    { label: 'Rata-rata Waktu', value: '58h', note: 'Per voyage', icon: 'clock', tone: 'blue' },
    { label: 'On-Time Rate', value: '92%', note: 'Delivery success', icon: 'analytics', tone: 'green' },
    { label: 'Delay Rate', value: '8%', note: 'Delayed voyages', icon: 'percent', tone: 'yellow' },
  ]

  const linePoints = monthlyVolume
    .map((value, index) => {
      const x = 50 + index * 70
      const y = 180 - ((value - 20) / 60) * 140
      return `${x},${y}`
    })
    .join(' ')

  return (
    <section className="console-section">
      <div className="section-heading">
        <h1>ANALYTICS &amp; REPORTS</h1>
        <p>Performance metrics dan statistik</p>
      </div>

      <div className="analytics-top-grid">
        {statCards.map((card) => (
          <article key={card.label} className={`metric-card analytics tone-${card.tone}`}>
            <div className="metric-icon">
              <Icon name={card.icon} />
            </div>
            <div className="metric-copy">
              <strong>{card.value}</strong>
              <span>{card.label}</span>
              <small>{card.note}</small>
            </div>
          </article>
        ))}
      </div>

      <div className="analytics-grid">
        <article className="panel-card chart-card">
          <div className="panel-header compact">
            <div>
              <h2>VOLUME PERJALANAN</h2>
              <p>Tren 6 bulan terakhir</p>
            </div>
          </div>
          <svg className="chart-svg" viewBox="0 0 460 240" role="img" aria-label="Travel volume line chart">
            <g className="chart-grid">
              {[0, 1, 2, 3, 4].map((row) => (
                <line key={row} x1="40" y1={30 + row * 35} x2="430" y2={30 + row * 35} />
              ))}
              {[0, 1, 2, 3, 4, 5].map((column) => (
                <line key={column} x1={50 + column * 70} y1="25" x2={50 + column * 70} y2="200" />
              ))}
            </g>
            <polyline points={linePoints} className="line-chart-path" />
            {monthlyVolume.map((value, index) => {
              const x = 50 + index * 70
              const y = 180 - ((value - 20) / 60) * 140
              return <circle key={`${value}-${index}`} cx={x} cy={y} r="4.5" className="line-chart-dot" />
            })}
            <g className="chart-axis">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <text key={month} x={50 + index * 70} y="216">{month}</text>
              ))}
              {[20, 40, 60, 80].map((value, index) => (
                <text key={value} x="18" y={184 - index * 46}>{value}</text>
              ))}
            </g>
          </svg>
        </article>

        <article className="panel-card chart-card">
          <div className="panel-header compact">
            <div>
              <h2>RATA-RATA WAKTU PER RUTE</h2>
              <p>Durasi perjalanan (jam)</p>
            </div>
          </div>
          <div className="bar-chart">
            {routeDuration.map((item) => (
              <div key={item.label} className="bar-column">
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${item.value}%` }} />
                </div>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <div className="mini-analytics-grid">
        <article className="mini-stat-card">
          <h3>Fuel Efficiency</h3>
          <strong>87%</strong>
          <p>Fleet average score</p>
        </article>
        <article className="mini-stat-card">
          <h3>Safety Score</h3>
          <strong>95%</strong>
          <p>Zero incidents this month</p>
        </article>
        <article className="mini-stat-card">
          <h3>Fleet Utilization</h3>
          <strong>78%</strong>
          <p>Active vessels ratio</p>
        </article>
      </div>
    </section>
  )
}

function CompanyView({ scrollTarget, scrollNonce }) {
  const contactSectionRef = useRef(null)

  useEffect(() => {
    if (scrollTarget !== 'contact') {
      return
    }

    contactSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [scrollNonce, scrollTarget])

  return (
    <div className="company-profile">
      <Hero />
      <StatsBar />
      <About />
      <VisionMission />
      <Features />
      <Contact sectionRef={contactSectionRef} />
    </div>
  )
}

function SkeletonBlock({ className = '' }) {
  return <div className={`dashboard-skeleton-block ${className}`.trim()} />
}

function DashboardSkeleton() {
  return (
    <section className="console-section dashboard-skeleton" aria-live="polite" aria-busy="true">
      <div className="dashboard-skeleton-header">
        <SkeletonBlock className="dashboard-skeleton-title" />
        <SkeletonBlock className="dashboard-skeleton-pill" />
      </div>

      <div className="dashboard-skeleton-stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <article key={index} className="dashboard-skeleton-card">
            <SkeletonBlock className="dashboard-skeleton-line short" />
            <SkeletonBlock className="dashboard-skeleton-line medium" />
            <SkeletonBlock className="dashboard-skeleton-line tiny" />
          </article>
        ))}
      </div>

      <div className="dashboard-skeleton-panels">
        <article className="dashboard-skeleton-panel large">
          <SkeletonBlock className="dashboard-skeleton-line medium" />
          <SkeletonBlock className="dashboard-skeleton-line short" />
          <SkeletonBlock className="dashboard-skeleton-canvas" />
          <SkeletonBlock className="dashboard-skeleton-line tiny" />
        </article>

        <article className="dashboard-skeleton-panel side">
          <SkeletonBlock className="dashboard-skeleton-line medium" />
          <SkeletonBlock className="dashboard-skeleton-line short" />
          <div className="dashboard-skeleton-list">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="dashboard-skeleton-list-item">
                <SkeletonBlock className="dashboard-skeleton-avatar" />
                <div className="dashboard-skeleton-copy">
                  <SkeletonBlock className="dashboard-skeleton-line medium" />
                  <SkeletonBlock className="dashboard-skeleton-line short" />
                </div>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

function ViewContent({
  viewKey,
  currentTab,
  companyScrollTarget,
  companyScrollNonce,
  handleSelectTab,
  selectedVesselId,
  setSelectedVesselId,
  userRole,
  adminMode,
  setAdminMode,
}) {
  use(getViewTransitionPromise(viewKey))

  switch (currentTab) {
    case 'company':
      return <CompanyView scrollTarget={companyScrollTarget} scrollNonce={companyScrollNonce} />
    case 'dashboard':
      return <DashboardView onSelectTab={handleSelectTab} />
    case 'fleet':
      return <FleetView />
    case 'map':
      return <MapView selectedVesselId={selectedVesselId} onSelectVessel={setSelectedVesselId} />
    case 'analytics':
      return <AnalyticsView />
    case 'admin':
      return userRole === 'admin' ? <AdminView adminMode={adminMode} onAdminModeChange={setAdminMode} /> : <DashboardView onSelectTab={handleSelectTab} />
    default:
      return null
  }
}

function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
}) {
  if (totalItems === 0) {
    return null
  }

  const pageItems = (() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 'ellipsis', totalPages]
    }

    if (currentPage >= totalPages - 2) {
      return [1, 'ellipsis', totalPages - 2, totalPages - 1, totalPages]
    }

    return [1, 'ellipsis-start', currentPage, 'ellipsis-end', totalPages]
  })()

  return (
    <div className="pagination-bar">
      <div className="pagination-actions">
        <button
          type="button"
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <Icon name="chevron-left" />
        </button>
        {pageItems.map((item, index) => (
          typeof item === 'number' ? (
            <button
              key={item}
              type="button"
              className={`pagination-button pagination-number ${currentPage === item ? 'active' : ''}`}
              onClick={() => onPageChange(item)}
              aria-current={currentPage === item ? 'page' : undefined}
            >
              {item}
            </button>
          ) : (
            <span key={`${item}-${index}`} className="pagination-ellipsis" aria-hidden="true">
              ...
            </span>
          )
        ))}
        <button
          type="button"
          className="pagination-button pagination-nav"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <Icon name="chevron-right" />
        </button>
      </div>
    </div>
  )
}

function formatRupiah(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount)
}

function getWorkflowStatusTone(status) {
  switch (status) {
    case 'Selesai':
    case 'Sampai Tujuan':
      return 'green'
    case 'Dalam Pengiriman':
      return 'blue'
    case 'Diproses':
      return 'violet'
    case 'Pending':
      return 'yellow'
    default:
      return 'red'
  }
}

function AdminView({ adminMode, onAdminModeChange }) {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState(initialUsers)
  const [requestedPage, setRequestedPage] = useState(1)
  const [formMode, setFormMode] = useState('add')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [formError, setFormError] = useState('')
  const [formState, setFormState] = useState({
    id: '',
    name: '',
    email: '',
    role: 'Operator',
    status: 'Active',
  })
  const [cargoQuery, setCargoQuery] = useState('')
  const [cargoItems, setCargoItems] = useState([])
  const [cargoRequestedPage, setCargoRequestedPage] = useState(1)
  const [cargoError, setCargoError] = useState('')
  const [cargoFormError, setCargoFormError] = useState('')
  const [cargoFeedback, setCargoFeedback] = useState('')
  const [isCargoLoading, setIsCargoLoading] = useState(false)
  const [cargoFormMode, setCargoFormMode] = useState('add')
  const [isCargoFormOpen, setIsCargoFormOpen] = useState(false)
  const [cargoFormState, setCargoFormState] = useState({
    id: '',
    resi: '',
    senderName: '',
    receiverName: '',
    itemName: '',
    deliveryStatus: 'Diproses',
    itemStatus: 'Pending',
    transactionStatus: 'Pending',
    shippingPrice: '',
  })
  const [vehicleQuery, setVehicleQuery] = useState('')
  const [vehicles, setVehicles] = useState([])
  const [vehicleRequestedPage, setVehicleRequestedPage] = useState(1)
  const [vehicleError, setVehicleError] = useState('')
  const [vehicleFormError, setVehicleFormError] = useState('')
  const [vehicleFeedback, setVehicleFeedback] = useState('')
  const [isVehicleLoading, setIsVehicleLoading] = useState(false)
  const [vehicleFormMode, setVehicleFormMode] = useState('add')
  const [isVehicleFormOpen, setIsVehicleFormOpen] = useState(false)
  const [vehicleFormState, setVehicleFormState] = useState({
    id: '',
    name: '',
    type: vehicleTypes[0],
    code: '',
    capacity: '',
    status: 'Diproses',
  })

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = query.toLowerCase()
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        user.id.toLowerCase().includes(search) ||
        user.role.toLowerCase().includes(search) ||
        user.status.toLowerCase().includes(search)
      )
    })
  }, [query, users])

  const adminPageSize = 4
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / adminPageSize))
  const currentPage = Math.min(requestedPage, totalPages)
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * adminPageSize
    return filteredUsers.slice(startIndex, startIndex + adminPageSize)
  }, [adminPageSize, currentPage, filteredUsers])

  const filteredVehicles = useMemo(() => {
    const search = vehicleQuery.trim().toLowerCase()

    if (!search) {
      return vehicles
    }

    return vehicles.filter((vehicle) =>
      [vehicle.name, vehicle.type, vehicle.code, vehicle.capacity, vehicle.status].some((value) =>
        value.toLowerCase().includes(search)
      )
    )
  }, [vehicleQuery, vehicles])

  const cargoPageSize = 4
  const cargoTotalPages = Math.max(1, Math.ceil(cargoItems.length / cargoPageSize))
  const cargoCurrentPage = Math.min(cargoRequestedPage, cargoTotalPages)
  const paginatedCargo = useMemo(() => {
    const startIndex = (cargoCurrentPage - 1) * cargoPageSize
    return cargoItems.slice(startIndex, startIndex + cargoPageSize)
  }, [cargoCurrentPage, cargoItems, cargoPageSize])

  const vehiclePageSize = 4
  const vehicleTotalPages = Math.max(1, Math.ceil(filteredVehicles.length / vehiclePageSize))
  const vehicleCurrentPage = Math.min(vehicleRequestedPage, vehicleTotalPages)
  const paginatedVehicles = useMemo(() => {
    const startIndex = (vehicleCurrentPage - 1) * vehiclePageSize
    return filteredVehicles.slice(startIndex, startIndex + vehiclePageSize)
  }, [filteredVehicles, vehicleCurrentPage, vehiclePageSize])

  useEffect(() => {
    let ignore = false

    async function loadCargo() {
      setIsCargoLoading(true)
      setCargoError('')

      try {
        const response = await fetch(`/api/cargo?query=${encodeURIComponent(cargoQuery)}`, {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data cargo.')
        }

        const data = await response.json()

        if (!ignore) {
          setCargoItems(Array.isArray(data.items) ? data.items : [])
        }
      } catch (error) {
        if (!ignore) {
          setCargoError(error.message || 'Gagal mengambil data cargo.')
          setCargoItems([])
        }
      } finally {
        if (!ignore) {
          setIsCargoLoading(false)
        }
      }
    }

    loadCargo()

    return () => {
      ignore = true
    }
  }, [cargoQuery])

  useEffect(() => {
    let ignore = false

    async function loadVehicles() {
      setIsVehicleLoading(true)
      setVehicleError('')

      try {
        const response = await fetch('/api/vehicles', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Gagal mengambil data kendaraan.')
        }

        const data = await response.json()

        if (!ignore) {
          setVehicles(Array.isArray(data.items) ? data.items : [])
        }
      } catch (error) {
        if (!ignore) {
          setVehicleError(error.message || 'Gagal mengambil data kendaraan.')
          setVehicles([])
        }
      } finally {
        if (!ignore) {
          setIsVehicleLoading(false)
        }
      }
    }

    loadVehicles()

    return () => {
      ignore = true
    }
  }, [])

  const openAddUserForm = () => {
    const lastNumber = users.reduce((maxNumber, user) => {
      const parsedNumber = Number.parseInt(user.id.replace(/\D/g, ''), 10)
      return Number.isNaN(parsedNumber) ? maxNumber : Math.max(maxNumber, parsedNumber)
    }, 0)
    const nextNumber = lastNumber + 1
    const nextId = `U${String(nextNumber).padStart(3, '0')}`

    setFormMode('add')
    setSelectedUserId(null)
    setFormError('')
    setFormState({
      id: nextId,
      name: '',
      email: '',
      role: 'Operator',
      status: 'Active',
    })
    setIsFormOpen(true)
  }

  const handleEditUser = (id) => {
    const selectedUser = users.find((user) => user.id === id)

    if (!selectedUser) {
      return
    }

    setFormMode('edit')
    setSelectedUserId(id)
    setFormError('')
    setFormState({ ...selectedUser })
    setIsFormOpen(true)
  }

  const handleDeleteUser = (id) => {
    setUsers((current) => current.filter((user) => user.id !== id))
  }

  const closeUserForm = () => {
    setIsFormOpen(false)
    setSelectedUserId(null)
    setFormError('')
  }

  const handleFormChange = (field, value) => {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmitUserForm = (event) => {
    event.preventDefault()

    const trimmedName = formState.name.trim()
    const trimmedEmail = formState.email.trim().toLowerCase()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!trimmedName || !trimmedEmail) {
      setFormError('Nama dan email wajib diisi.')
      return
    }

    if (!emailPattern.test(trimmedEmail)) {
      setFormError('Format email tidak valid.')
      return
    }

    const hasDuplicateEmail = users.some(
      (user) => user.email.toLowerCase() === trimmedEmail && user.id !== selectedUserId
    )

    if (hasDuplicateEmail) {
      setFormError('Email sudah dipakai user lain.')
      return
    }

    if (formMode === 'add') {
      setUsers((current) => [
        ...current,
        {
          ...formState,
          name: trimmedName,
          email: trimmedEmail,
        },
      ])
    } else {
      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUserId
            ? {
                ...formState,
                name: trimmedName,
                email: trimmedEmail,
              }
            : user
        )
      )
    }

    closeUserForm()
  }

  const handleEditCargo = (item) => {
    setCargoFormMode('edit')
    setCargoFormError('')
    setCargoFeedback('')
    setCargoFormState({
      ...item,
      shippingPrice: String(item.shippingPrice ?? ''),
    })
    setIsCargoFormOpen(true)
  }

  const openAddCargoForm = () => {
    const lastNumber = cargoItems.reduce((maxNumber, item) => {
      const parsedNumber = Number.parseInt(item.id.replace(/\D/g, ''), 10)
      return Number.isNaN(parsedNumber) ? maxNumber : Math.max(maxNumber, parsedNumber)
    }, 0)
    const nextNumber = lastNumber + 1

    setCargoFormMode('add')
    setCargoFormError('')
    setCargoFeedback('')
    setCargoFormState({
      id: `C${String(nextNumber).padStart(3, '0')}`,
      resi: `RESI-${String(Date.now()).slice(-6)}${String(nextNumber).padStart(3, '0')}`,
      shippingDate: new Date().toISOString().split('T')[0],
      senderName: '',
      receiverName: '',
      phoneNumber: '',
      originCity: '',
      destinationCity: '',
      itemType: '',
      itemName: '',
      itemWeight: '',
      deliveryStatus: 'Diproses',
      itemStatus: 'Pending',
      transactionStatus: 'Pending',
      shippingPrice: '',
      vehicleType: 'Truk Biasa',
      shippingType: 'Biasa',
      description: '',
    })
    setIsCargoFormOpen(true)
  }

  const closeCargoForm = () => {
    setIsCargoFormOpen(false)
    setCargoFormError('')
  }

  const handleCargoFormChange = (field, value) => {
    setCargoFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmitCargoForm = async (event) => {
    event.preventDefault()

    const trimmedResi = cargoFormState.resi.trim()
    const trimmedSenderName = cargoFormState.senderName.trim()
    const trimmedReceiverName = cargoFormState.receiverName.trim()
    const trimmedItemName = cargoFormState.itemName.trim()
    const trimmedPhoneNumber = (cargoFormState.phoneNumber || '').trim()
    const trimmedOriginCity = (cargoFormState.originCity || '').trim()
    const trimmedDestinationCity = (cargoFormState.destinationCity || '').trim()
    const trimmedItemType = (cargoFormState.itemType || '').trim()
    const trimmedDescription = (cargoFormState.description || '').trim()
    const itemWeight = Number(cargoFormState.itemWeight)
    const shippingPrice = Number(cargoFormState.shippingPrice)

    if (!trimmedResi || !trimmedSenderName || !trimmedReceiverName || !trimmedItemName || !trimmedPhoneNumber || !trimmedOriginCity || !trimmedDestinationCity || !trimmedItemType || !cargoFormState.shippingDate) {
      setCargoFormError('Semua data cargo wajib diisi dengan lengkap.')
      return
    }

    if (!Number.isFinite(itemWeight) || itemWeight <= 0) {
      setCargoFormError('Berat barang harus berupa angka yang valid dan lebih dari 0.')
      return
    }

    if (!Number.isFinite(shippingPrice) || shippingPrice < 0) {
      setCargoFormError('Harga pengiriman harus berupa angka yang valid.')
      return
    }

    try {
      const response = await fetch('/api/cargo', {
        method: cargoFormMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...cargoFormState,
          resi: trimmedResi,
          senderName: trimmedSenderName,
          receiverName: trimmedReceiverName,
          phoneNumber: trimmedPhoneNumber,
          originCity: trimmedOriginCity,
          destinationCity: trimmedDestinationCity,
          itemType: trimmedItemType,
          itemName: trimmedItemName,
          itemWeight,
          description: trimmedDescription,
          shippingPrice,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || (cargoFormMode === 'add' ? 'Gagal menambahkan data cargo.' : 'Gagal memperbarui data cargo.'))
      }

      setCargoItems((current) =>
        cargoFormMode === 'add'
          ? [data.item, ...current]
          : current.map((item) => (item.id === data.item.id ? data.item : item))
      )
      setCargoRequestedPage(1)
      setCargoFeedback(
        cargoFormMode === 'add'
          ? `Data cargo ${data.item.resi} berhasil ditambahkan.`
          : `Data cargo ${data.item.resi} berhasil diperbarui.`
      )
      closeCargoForm()
    } catch (error) {
      setCargoFormError(error.message || (cargoFormMode === 'add' ? 'Gagal menambahkan data cargo.' : 'Gagal memperbarui data cargo.'))
    }
  }

  const handleDeleteCargo = async (id) => {
    try {
      const response = await fetch(`/api/cargo?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus data cargo.')
      }

      setCargoItems((current) => current.filter((item) => item.id !== id))
      setCargoFeedback(`Data cargo ${id} berhasil dihapus.`)
    } catch (error) {
      setCargoError(error.message || 'Gagal menghapus data cargo.')
    }
  }

  const handleEditVehicle = (vehicle) => {
    setVehicleFormMode('edit')
    setVehicleFormError('')
    setVehicleFeedback('')
    setVehicleFormState({ ...vehicle })
    setIsVehicleFormOpen(true)
  }

  const openAddVehicleForm = () => {
    const lastNumber = vehicles.reduce((maxNumber, item) => {
      const parsedNumber = Number.parseInt(item.id.replace(/\D/g, ''), 10)
      return Number.isNaN(parsedNumber) ? maxNumber : Math.max(maxNumber, parsedNumber)
    }, 0)
    const nextNumber = lastNumber + 1

    setVehicleFormMode('add')
    setVehicleFormError('')
    setVehicleFeedback('')
    setVehicleFormState({
      id: `K${String(nextNumber).padStart(3, '0')}`,
      name: '',
      type: vehicleTypes[0],
      code: '',
      capacity: '',
      status: 'Diproses',
    })
    setIsVehicleFormOpen(true)
  }

  const closeVehicleForm = () => {
    setIsVehicleFormOpen(false)
    setVehicleFormError('')
  }

  const handleVehicleFormChange = (field, value) => {
    setVehicleFormState((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleSubmitVehicleForm = async (event) => {
    event.preventDefault()

    const trimmedName = vehicleFormState.name.trim()
    const trimmedCode = vehicleFormState.code.trim().toUpperCase()
    const trimmedCapacity = vehicleFormState.capacity.trim()

    if (!trimmedName || !trimmedCode || !trimmedCapacity) {
      setVehicleFormError('Semua data kendaraan wajib diisi.')
      return
    }

    try {
      const response = await fetch('/api/vehicles', {
        method: vehicleFormMode === 'add' ? 'POST' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...vehicleFormState,
          name: trimmedName,
          code: trimmedCode,
          capacity: trimmedCapacity,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || (vehicleFormMode === 'add' ? 'Gagal menambahkan data kendaraan.' : 'Gagal memperbarui data kendaraan.'))
      }

      setVehicles((current) =>
        vehicleFormMode === 'add'
          ? [data.item, ...current]
          : current.map((item) => (item.id === data.item.id ? data.item : item))
      )
      setVehicleRequestedPage(1)
      setVehicleFeedback(
        vehicleFormMode === 'add'
          ? `Data kendaraan ${data.item.code} berhasil ditambahkan.`
          : `Data kendaraan ${data.item.code} berhasil diperbarui.`
      )
      closeVehicleForm()
    } catch (error) {
      setVehicleFormError(error.message || (vehicleFormMode === 'add' ? 'Gagal menambahkan data kendaraan.' : 'Gagal memperbarui data kendaraan.'))
    }
  }

  const handleDeleteVehicle = async (id) => {
    try {
      const response = await fetch(`/api/vehicles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Gagal menghapus data kendaraan.')
      }

      setVehicles((current) => current.filter((item) => item.id !== id))
      setVehicleFeedback(`Data kendaraan ${id} berhasil dihapus.`)
    } catch (error) {
      setVehicleError(error.message || 'Gagal menghapus data kendaraan.')
    }
  }

  const liveStats = {
    login: activityItems.filter((item) => item.type === 'login').length,
    logout: activityItems.filter((item) => item.type === 'logout').length,
    shift: activityItems.filter((item) => item.type === 'shift').length,
    action: activityItems.filter((item) => item.type === 'action').length,
    alert: activityItems.filter((item) => item.type === 'alert').length,
  }

  return (
    <section className="console-section admin-section">
      <div className="admin-switcher">
        <button
          type="button"
          className={`admin-switch ${adminMode === 'users' ? 'active' : ''}`}
          onClick={() => onAdminModeChange('users')}
        >
          <Icon name="users" />
          User Management
        </button>
        <button
          type="button"
          className={`admin-switch ${adminMode === 'activity' ? 'active' : ''}`}
          onClick={() => onAdminModeChange('activity')}
        >
          <Icon name="activity" />
          Activity Log
        </button>
        <button
          type="button"
          className={`admin-switch ${adminMode === 'cargo' ? 'active' : ''}`}
          onClick={() => onAdminModeChange('cargo')}
        >
          <Icon name="ship" />
          Cargo Data
        </button>
        <button
          type="button"
          className={`admin-switch ${adminMode === 'vehicles' ? 'active' : ''}`}
          onClick={() => onAdminModeChange('vehicles')}
        >
          <Icon name="fleet" />
          Kendaraan
        </button>
      </div>

      {adminMode === 'users' ? (
        <div className="panel-card admin-panel">
          <div className="panel-header">
            <div className="admin-title-row">
              <span className="admin-title-icon">
                <Icon name="users" />
              </span>
              <div>
                <h2>USER MANAGEMENT</h2>
                <p>{users.length} total users</p>
              </div>
            </div>
            <button type="button" className="admin-add-button" onClick={openAddUserForm}>
              <Icon name="add-user" />
              Add User
            </button>
          </div>

          <label className="search-field admin-search">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Search by ID, name, email, role, or status..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setRequestedPage(1)
              }}
            />
          </label>

          <div className="table-wrap admin-table-wrap">
            <table className="fleet-table admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NAME</th>
                  <th>EMAIL</th>
                  <th>ROLE</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-badge ${user.role === 'Admin' ? 'violet' : 'blue'}`}>{user.role}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${user.status === 'Active' ? 'green' : 'red'}`}>{user.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="admin-action edit" onClick={() => handleEditUser(user.id)} aria-label={`Edit ${user.name}`}>
                          <Icon name="edit" />
                        </button>
                        <button type="button" className="admin-action delete" onClick={() => handleDeleteUser(user.id)} aria-label={`Delete ${user.name}`}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredUsers.length}
            onPageChange={setRequestedPage}
          />

          {filteredUsers.length === 0 ? (
            <div className="empty-state admin-empty-state">Tidak ada user yang cocok dengan pencarian saat ini.</div>
          ) : null}

          {isFormOpen ? (
            <div className="admin-modal-backdrop" role="presentation" onClick={closeUserForm}>
              <div
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-user-form-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="panel-header compact admin-modal-header">
                  <div>
                    <h2 id="admin-user-form-title">{formMode === 'add' ? 'ADD USER' : 'EDIT USER'}</h2>
                    <p>
                      {formMode === 'add'
                        ? 'Tambahkan user baru ke sistem admin.'
                        : `Perbarui data user ${formState.name || formState.id}.`}
                    </p>
                  </div>
                  <button type="button" className="icon-button admin-close-button" onClick={closeUserForm} aria-label="Close user form">
                    <Icon name="delete" />
                  </button>
                </div>

                <form className="admin-user-form" onSubmit={handleSubmitUserForm}>
                  <div className="admin-form-grid">
                    <label className="admin-form-field">
                      <span>ID User</span>
                      <input type="text" value={formState.id} disabled />
                    </label>
                    <label className="admin-form-field">
                      <span>Nama Lengkap</span>
                      <input
                        type="text"
                        value={formState.name}
                        onChange={(event) => handleFormChange('name', event.target.value)}
                        placeholder="Masukkan nama user"
                        required
                      />
                    </label>
                    <label className="admin-form-field">
                      <span>Email</span>
                      <input
                        type="email"
                        value={formState.email}
                        onChange={(event) => handleFormChange('email', event.target.value)}
                        placeholder="nama@tessera.com"
                        required
                      />
                    </label>
                    <label className="admin-form-field">
                      <span>Role</span>
                      <select value={formState.role} onChange={(event) => handleFormChange('role', event.target.value)}>
                        <option>Admin</option>
                        <option>Operator</option>
                      </select>
                    </label>
                    <label className="admin-form-field">
                      <span>Status</span>
                      <select value={formState.status} onChange={(event) => handleFormChange('status', event.target.value)}>
                        <option>Active</option>
                        <option>Inactive</option>
                      </select>
                    </label>
                  </div>

                  {formError ? <div className="admin-form-error">{formError}</div> : null}

                  <div className="admin-form-actions">
                    <button type="button" className="admin-secondary-button" onClick={closeUserForm}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-primary-button">
                      {formMode === 'add' ? 'Save User' : 'Update User'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      ) : adminMode === 'cargo' ? (
        <div className="panel-card admin-panel">
          <div className="panel-header">
            <div className="admin-title-row">
              <span className="admin-title-icon">
                <Icon name="ship" />
              </span>
              <div>
                <h2>CARGO MANAGEMENT</h2>
                <p>{cargoItems.length} data cargo dari database</p>
              </div>
            </div>
            <button type="button" className="admin-add-button" onClick={openAddCargoForm}>
              <Icon name="add-user" />
              Add Cargo Data
            </button>
          </div>

          <label className="search-field admin-search">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Cari No Resi, Nama Pengirim, Nama Penerima, atau Nama Barang..."
              value={cargoQuery}
              onChange={(event) => {
                setCargoQuery(event.target.value)
                setCargoRequestedPage(1)
                setCargoError('')
                setCargoFeedback('')
              }}
            />
          </label>

          {cargoError ? <div className="admin-form-error">{cargoError}</div> : null}
          {cargoFeedback ? <div className="empty-state admin-empty-state">{cargoFeedback}</div> : null}

          <div className="table-wrap admin-table-wrap">
            <table className="fleet-table admin-table">
              <thead>
                <tr>
                  <th>NO RESI</th>
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
                {paginatedCargo.map((item) => (
                  <tr key={item.id}>
                    <td>{item.resi}</td>
                    <td>{item.senderName}</td>
                    <td>{item.receiverName}</td>
                    <td>{item.itemName}</td>
                    <td>
                      <span className={`status-badge ${getWorkflowStatusTone(item.deliveryStatus)}`}>{item.deliveryStatus}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getWorkflowStatusTone(item.itemStatus)}`}>{item.itemStatus}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${getWorkflowStatusTone(item.transactionStatus)}`}>{item.transactionStatus}</span>
                    </td>
                    <td>{formatRupiah(item.shippingPrice)}</td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="admin-action edit" onClick={() => handleEditCargo(item)} aria-label={`Edit ${item.resi}`}>
                          <Icon name="edit" />
                        </button>
                        <button type="button" className="admin-action delete" onClick={() => handleDeleteCargo(item.id)} aria-label={`Delete ${item.resi}`}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={cargoCurrentPage}
            totalPages={cargoTotalPages}
            totalItems={cargoItems.length}
            onPageChange={setCargoRequestedPage}
          />

          {!isCargoLoading && cargoItems.length === 0 ? (
            <div className="empty-state admin-empty-state">Data cargo tidak ditemukan untuk keyword saat ini.</div>
          ) : null}

          {isCargoFormOpen ? (
            <div className="admin-modal-backdrop" role="presentation" onClick={closeCargoForm}>
              <div
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-cargo-form-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="panel-header compact admin-modal-header">
                  <div>
                    <h2 id="admin-cargo-form-title">{cargoFormMode === 'add' ? 'ADD CARGO DATA' : 'EDIT DATA CARGO'}</h2>
                    <p>{cargoFormMode === 'add' ? 'Isi form untuk menambahkan data cargo baru ke database.' : 'Data lama otomatis ditampilkan dan bisa langsung diperbarui.'}</p>
                  </div>
                  <button type="button" className="icon-button admin-close-button" onClick={closeCargoForm} aria-label="Close cargo form">
                    <Icon name="close" />
                  </button>
                </div>

                <form className="admin-user-form" onSubmit={handleSubmitCargoForm}>
                  <div className="admin-form-grid">
                    <label className="admin-form-field">
                      <span>Id Pengiriman / No Resi</span>
                      <input type="text" value={cargoFormState.resi || cargoFormState.id} disabled />
                    </label>
                    <label className="admin-form-field">
                      <span>Tanggal Kirim</span>
                      <input type="date" value={cargoFormState.shippingDate || ''} onChange={(event) => handleCargoFormChange('shippingDate', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Nama Pengirim</span>
                      <input type="text" value={cargoFormState.senderName} onChange={(event) => handleCargoFormChange('senderName', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Nama Penerima</span>
                      <input type="text" value={cargoFormState.receiverName} onChange={(event) => handleCargoFormChange('receiverName', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>No Telepon</span>
                      <input type="tel" value={cargoFormState.phoneNumber || ''} onChange={(event) => handleCargoFormChange('phoneNumber', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Kota Asal</span>
                      <input type="text" value={cargoFormState.originCity || ''} onChange={(event) => handleCargoFormChange('originCity', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Kota Tujuan</span>
                      <input type="text" value={cargoFormState.destinationCity || ''} onChange={(event) => handleCargoFormChange('destinationCity', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Jenis Barang</span>
                      <input type="text" value={cargoFormState.itemType || ''} onChange={(event) => handleCargoFormChange('itemType', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Nama Barang</span>
                      <input type="text" value={cargoFormState.itemName} onChange={(event) => handleCargoFormChange('itemName', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Berat Barang (Kg)</span>
                      <input type="number" min="0" step="0.1" value={cargoFormState.itemWeight || ''} onChange={(event) => handleCargoFormChange('itemWeight', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Harga/Tarif Pengiriman</span>
                      <input
                        type="number"
                        min="0"
                        value={cargoFormState.shippingPrice}
                        onChange={(event) => handleCargoFormChange('shippingPrice', event.target.value)}
                        required
                      />
                    </label>
                    <label className="admin-form-field">
                      <span>Jenis Kendaraan</span>
                      <input type="text" value={cargoFormState.vehicleType || ''} onChange={(event) => handleCargoFormChange('vehicleType', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Jenis Pengiriman</span>
                      <select value={cargoFormState.shippingType || 'Biasa'} onChange={(event) => handleCargoFormChange('shippingType', event.target.value)}>
                        <option value="Biasa">Biasa</option>
                        <option value="Cepat">Cepat</option>
                        <option value="Vvip">Vvip</option>
                      </select>
                    </label>
                    <label className="admin-form-field">
                      <span>Status Pengiriman</span>
                      <select value={cargoFormState.deliveryStatus} onChange={(event) => handleCargoFormChange('deliveryStatus', event.target.value)}>
                        {workflowStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-form-field">
                      <span>Status Barang</span>
                      <select value={cargoFormState.itemStatus} onChange={(event) => handleCargoFormChange('itemStatus', event.target.value)}>
                        {workflowStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-form-field">
                      <span>Status Transaksi</span>
                      <select value={cargoFormState.transactionStatus} onChange={(event) => handleCargoFormChange('transactionStatus', event.target.value)}>
                        {workflowStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-form-field" style={{ gridColumn: '1 / -1' }}>
                      <span>Deskripsi/Catatan Barang</span>
                      <textarea value={cargoFormState.description || ''} onChange={(event) => handleCargoFormChange('description', event.target.value)} rows="3" style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #333', background: '#2a2a2a', color: 'white' }}></textarea>
                    </label>
                  </div>

                  {cargoFormError ? <div className="admin-form-error">{cargoFormError}</div> : null}

                  <div className="admin-form-actions">
                    <button type="button" className="admin-secondary-button" onClick={closeCargoForm}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-primary-button">
                      {cargoFormMode === 'add' ? 'Add Cargo' : 'Update Cargo'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      ) : adminMode === 'vehicles' ? (
        <div className="panel-card admin-panel">
          <div className="panel-header">
            <div className="admin-title-row">
              <span className="admin-title-icon">
                <Icon name="fleet" />
              </span>
              <div>
                <h2>VEHICLE MANAGEMENT</h2>
                <p>{vehicles.length} data kendaraan dari database</p>
              </div>
            </div>
            <button type="button" className="admin-add-button" onClick={openAddVehicleForm}>
              <Icon name="add-user" />
              Add Kendaraan
            </button>
          </div>

          <label className="search-field admin-search">
            <Icon name="search" />
            <input
              type="text"
              placeholder="Cari nama kendaraan, jenis, kode, kapasitas, atau status..."
              value={vehicleQuery}
              onChange={(event) => {
                setVehicleQuery(event.target.value)
                setVehicleRequestedPage(1)
                setVehicleError('')
                setVehicleFeedback('')
              }}
            />
          </label>

          {vehicleError ? <div className="admin-form-error">{vehicleError}</div> : null}
          {vehicleFeedback ? <div className="empty-state admin-empty-state">{vehicleFeedback}</div> : null}

          <div className="table-wrap admin-table-wrap">
            <table className="fleet-table admin-table">
              <thead>
                <tr>
                  <th>NAMA</th>
                  <th>JENIS</th>
                  <th>KODE</th>
                  <th>KAPASITAS</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedVehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>{vehicle.name}</td>
                    <td>{vehicle.type}</td>
                    <td>{vehicle.code}</td>
                    <td>{vehicle.capacity}</td>
                    <td>
                      <span className={`status-badge ${getWorkflowStatusTone(vehicle.status)}`}>{vehicle.status}</span>
                    </td>
                    <td>
                      <div className="admin-actions">
                        <button type="button" className="admin-action edit" onClick={() => handleEditVehicle(vehicle)} aria-label={`Edit ${vehicle.code}`}>
                          <Icon name="edit" />
                        </button>
                        <button type="button" className="admin-action delete" onClick={() => handleDeleteVehicle(vehicle.id)} aria-label={`Delete ${vehicle.code}`}>
                          <Icon name="delete" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={vehicleCurrentPage}
            totalPages={vehicleTotalPages}
            totalItems={filteredVehicles.length}
            onPageChange={setVehicleRequestedPage}
          />

          {!isVehicleLoading && filteredVehicles.length === 0 ? (
            <div className="empty-state admin-empty-state">Data kendaraan tidak ditemukan untuk pencarian saat ini.</div>
          ) : null}

          {isVehicleFormOpen ? (
            <div className="admin-modal-backdrop" role="presentation" onClick={closeVehicleForm}>
              <div
                className="admin-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="admin-vehicle-form-title"
                onClick={(event) => event.stopPropagation()}
              >
                <div className="panel-header compact admin-modal-header">
                  <div>
                    <h2 id="admin-vehicle-form-title">{vehicleFormMode === 'add' ? 'ADD DATA KENDARAAN' : 'EDIT DATA KENDARAAN'}</h2>
                    <p>{vehicleFormMode === 'add' ? 'Isi form untuk menambahkan kendaraan baru ke database.' : 'Form menampilkan data lama kendaraan sebelum diperbarui.'}</p>
                  </div>
                  <button type="button" className="icon-button admin-close-button" onClick={closeVehicleForm} aria-label="Close vehicle form">
                    <Icon name="close" />
                  </button>
                </div>

                <form className="admin-user-form" onSubmit={handleSubmitVehicleForm}>
                  <div className="admin-form-grid">
                    <label className="admin-form-field">
                      <span>ID Kendaraan</span>
                      <input type="text" value={vehicleFormState.id} disabled />
                    </label>
                    <label className="admin-form-field">
                      <span>Nama Kendaraan</span>
                      <input type="text" value={vehicleFormState.name} onChange={(event) => handleVehicleFormChange('name', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Jenis Kendaraan</span>
                      <select value={vehicleFormState.type} onChange={(event) => handleVehicleFormChange('type', event.target.value)}>
                        {vehicleTypes.map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </label>
                    <label className="admin-form-field">
                      <span>Kode Kendaraan</span>
                      <input type="text" value={vehicleFormState.code} onChange={(event) => handleVehicleFormChange('code', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Kapasitas Muatan</span>
                      <input type="text" value={vehicleFormState.capacity} onChange={(event) => handleVehicleFormChange('capacity', event.target.value)} required />
                    </label>
                    <label className="admin-form-field">
                      <span>Status Kendaraan</span>
                      <select value={vehicleFormState.status} onChange={(event) => handleVehicleFormChange('status', event.target.value)}>
                        {vehicleStatuses.map((status) => (
                          <option key={status}>{status}</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {vehicleFormError ? <div className="admin-form-error">{vehicleFormError}</div> : null}

                  <div className="admin-form-actions">
                    <button type="button" className="admin-secondary-button" onClick={closeVehicleForm}>
                      Cancel
                    </button>
                    <button type="submit" className="admin-primary-button">
                      {vehicleFormMode === 'add' ? 'Add Kendaraan' : 'Update Kendaraan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="panel-card admin-panel">
          <div className="panel-header">
            <div className="admin-title-row">
              <span className="admin-title-icon">
                <Icon name="activity" />
              </span>
              <div>
                <h2>ACTIVITY LOG</h2>
                <p>Recent system activities</p>
              </div>
            </div>
            <span className="live-badge">
              <span className="live-dot" />
              LIVE
            </span>
          </div>

          <div className="activity-list">
            {activityItems.map((item) => (
              <article key={item.id} className="activity-card">
                <div className={`activity-icon ${item.type}`}>
                  <Icon
                    name={
                      item.type === 'login'
                        ? 'login'
                        : item.type === 'logout'
                          ? 'logout'
                          : item.type === 'shift'
                            ? 'clock'
                            : item.type === 'action'
                              ? 'activity'
                              : 'alert'
                    }
                  />
                </div>
                <div className="activity-copy">
                  <h3>{item.title}</h3>
                  <p>{item.actor}</p>
                  <span>{item.detail}</span>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>

          <div className="admin-stats-strip">
            <div className="admin-mini-card">
              <strong className="green">{liveStats.login}</strong>
              <span>LOGIN</span>
            </div>
            <div className="admin-mini-card">
              <strong className="yellow">{liveStats.logout}</strong>
              <span>LOGOUT</span>
            </div>
            <div className="admin-mini-card">
              <strong className="blue">{liveStats.shift}</strong>
              <span>SHIFT</span>
            </div>
            <div className="admin-mini-card">
              <strong className="violet">{liveStats.action}</strong>
              <span>ACTION</span>
            </div>
            <div className="admin-mini-card">
              <strong className="red">{liveStats.alert}</strong>
              <span>ALERT</span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default function MaritimePlatform() {
  const pathname = usePathname()
  const router = useRouter()
  const routeTab = getTabFromPathname(pathname)
  const authState = useSyncExternalStore(
    subscribeAuthSession,
    readStoredAuthSession,
    getServerAuthSnapshot
  )
  const [companyScrollTarget, setCompanyScrollTarget] = useState(null)
  const [companyScrollNonce, setCompanyScrollNonce] = useState(0)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
  })
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState(routeTab ?? 'company')
  const [hoveredTab, setHoveredTab] = useState(null)
  const [selectedVesselId, setSelectedVesselId] = useState('V001')
  const [adminMode, setAdminMode] = useState('users')
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [notifications, setNotifications] = useState(initialNotifications)
  const { isAuthenticated, isAuthReady, userRole } = authState
  const currentTab = routeTab ?? activeTab

  const unreadCount = notifications.filter((item) => !item.read).length
  const allowedTabs = useMemo(
    () => (!isAuthenticated
      ? ['company']
      : userRole === 'admin'
        ? ['dashboard', 'fleet', 'map', 'analytics', 'admin']
        : ['dashboard', 'fleet', 'map', 'analytics']),
    [isAuthenticated, userRole]
  )
  const visibleTabs = useMemo(() => tabs.filter((tab) => allowedTabs.includes(tab.id)), [allowedTabs])

  useEffect(() => {
    if (!isNotificationOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsNotificationOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isNotificationOpen])

  useEffect(() => {
    if (!isAuthReady || isAuthenticated || pathname === '/') {
      return
    }

    router.replace('/')
  }, [isAuthReady, isAuthenticated, pathname, router])

  useEffect(() => {
    if (!isLoginOpen) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsLoginOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLoginOpen])

  const toggleNotificationPanel = () => {
    setIsNotificationOpen((current) => !current)
  }

  const closeNotificationPanel = () => {
    setIsNotificationOpen(false)
  }

  const handleMarkAllRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }

  const handleToggleRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read: !item.read,
            }
          : item
      )
    )
  }

  const handleLoginFormChange = (field, value) => {
    setLoginForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleLoginSubmit = (event) => {
    event.preventDefault()

    const username = loginForm.username.trim()
    const password = loginForm.password.trim()
    const matchedAccount = authAccounts.find(
      (account) => account.username === username && account.password === password
    )

    if (matchedAccount) {
      setActiveTab(routeTab && routeTab !== 'company' ? routeTab : 'dashboard')
      setIsLoginOpen(false)
      setLoginError('')
      window.sessionStorage.setItem(
        AUTH_STORAGE_KEY,
        JSON.stringify({
          isAuthenticated: true,
          role: matchedAccount.role,
        })
      )
      window.dispatchEvent(new Event(AUTH_EVENT))
      return
    }

    setLoginError('Username atau password salah.')
  }

  const handleSelectTab = (tabId) => {
    if (!isAuthenticated && tabId !== 'company') {
      setIsLoginOpen(true)
      setHoveredTab(null)
      return
    }

    if (!allowedTabs.includes(tabId)) {
      return
    }

    if (tabId !== 'company') {
      setCompanyScrollTarget(null)
    }

    setActiveTab(tabId)
    setHoveredTab(null)

    const routeHref = getRouteHref(tabId)

    if (routeHref) {
      router.push(routeHref)
      return
    }

    if (pathname !== '/') {
      router.push('/')
    }
  }

  const handleOpenCompanyContact = () => {
    if (isAuthenticated || !allowedTabs.includes('company')) {
      return
    }

    setCompanyScrollTarget('contact')
    setCompanyScrollNonce((current) => current + 1)
    setActiveTab('company')
    setHoveredTab(null)

    if (pathname !== '/') {
      router.push('/')
    }
  }

  const handleOpenLogin = () => {
    setLoginError('')
    setIsLoginOpen(true)
    setHoveredTab(null)
  }

  const handleLogout = () => {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
    window.dispatchEvent(new Event(AUTH_EVENT))
    setHoveredTab(null)
    setIsNotificationOpen(false)
    setCompanyScrollTarget(null)
    setLoginError('')
    setLoginForm({
      username: '',
      password: '',
    })
    setActiveTab('company')
    router.push('/')
  }

  if (!isAuthReady) {
    return null
  }

  const viewKey = `${currentTab}-${adminMode}-${selectedVesselId}-${companyScrollNonce}`

  return (
    <main className="platform-shell">
      <div className="platform-frame">
        <header className="platform-navbar">
          <button type="button" className="brand-block" onClick={() => handleSelectTab(isAuthenticated ? 'dashboard' : 'company')}>
            <Image
              className="brand-logo-image"
              src="/tessera-logo.png"
              alt="Tessera logo"
              width={44}
              height={44}
              priority
            />
            <span className="brand-copy">
              <strong>TESSERA</strong>
              <small>MARITIME LOGISTICS SYSTEM</small>
            </span>
          </button>

          <nav className="platform-nav-links" aria-label="Primary navigation">
            {visibleTabs.map((tab) => (
              <div
                key={tab.id}
                className="nav-item-wrap"
                onMouseEnter={() => setHoveredTab(submenuContent[tab.id] ? tab.id : null)}
                onMouseLeave={() => setHoveredTab((current) => (current === tab.id ? null : current))}
              >
                <button
                  type="button"
                  className={`nav-link ${currentTab === tab.id ? 'active' : ''} ${hoveredTab === tab.id ? 'hovered' : ''}`}
                  onClick={() => handleSelectTab(tab.id)}
                >
                  {tab.id === 'dashboard' ? <Icon name="dashboard" /> : null}
                  {tab.id === 'fleet' ? <Icon name="fleet" /> : null}
                  {tab.id === 'map' ? <Icon name="map" /> : null}
                  {tab.id === 'analytics' ? <Icon name="analytics" /> : null}
                  {tab.label}
                </button>

                {hoveredTab === tab.id ? <NavSubmenu tabId={tab.id} onSelectTab={handleSelectTab} /> : null}
              </div>
            ))}
          </nav>

          <div className="platform-actions">
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  className={`nav-icon-button ${isNotificationOpen ? 'active' : ''}`}
                  aria-label="Notifications"
                  aria-expanded={isNotificationOpen}
                  onClick={toggleNotificationPanel}
                >
                  <Icon name="bell" />
                  {unreadCount > 0 ? <span className="notify-dot" /> : null}
                </button>
                {userRole === 'admin' ? (
                  <button
                    type="button"
                    className={`btn-admin-modern ${currentTab === 'admin' ? 'active' : ''}`}
                    onClick={() => handleSelectTab('admin')}
                  >
                    <Icon name="user" />
                    <span>Admin</span>
                  </button>
                ) : null}
                <button type="button" className="btn-logout-modern" onClick={handleLogout} aria-label="Logout">
                  <Icon name="logout" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button type="button" className="btn-contact-modern" onClick={handleOpenCompanyContact}>
                  <Icon name="mail" />
                  <span>Hubungi Kami</span>
                </button>
                <button type="button" className="btn-admin-modern" onClick={handleOpenLogin} aria-label="Login">
                  <Icon name="login" />
                  <span>Login</span>
                </button>
              </>
            )}
          </div>
        </header>

        <Suspense fallback={<DashboardSkeleton />}>
          <ViewContent
            viewKey={viewKey}
            currentTab={currentTab}
            companyScrollTarget={companyScrollTarget}
            companyScrollNonce={companyScrollNonce}
            handleSelectTab={handleSelectTab}
            selectedVesselId={selectedVesselId}
            setSelectedVesselId={setSelectedVesselId}
            userRole={userRole}
            adminMode={adminMode}
            setAdminMode={setAdminMode}
          />
        </Suspense>
      </div>

      {isNotificationOpen ? (
        <NotificationPanel
          notifications={notifications}
          unreadCount={unreadCount}
          onClose={closeNotificationPanel}
          onMarkAllRead={handleMarkAllRead}
          onToggleRead={handleToggleRead}
        />
      ) : null}

      {!isAuthenticated && isLoginOpen ? (
        <LoginModal
          username={loginForm.username}
          password={loginForm.password}
          error={loginError}
          onChange={handleLoginFormChange}
          onSubmit={handleLoginSubmit}
          onClose={() => setIsLoginOpen(false)}
        />
      ) : null}
    </main>
  )
}
