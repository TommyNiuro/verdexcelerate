'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  {
    label: 'Principal',
    items: [
      { href: '/dashboard', label: 'Dashboard', icon: '⬡', badge: null },
      { href: '/directorio', label: 'Directorio', icon: '⊞', badge: '847' },
      { href: '/mapa', label: 'Mapa Regional', icon: '◎', badge: null },
    ],
  },
  {
    label: 'Análisis',
    items: [
      { href: '/pais', label: 'Vista por País', icon: '⬟', badge: null },
      { href: '/zonas', label: 'Zonas Prioritarias', icon: '◈', badge: null },
      { href: '/brechas', label: 'Brechas', icon: '△', badge: null },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/fuentes', label: 'Fuentes', icon: '≡', badge: null },
      { href: '/gobernanza', label: 'Gobernanza IA', icon: '◻', badge: null },
      { href: '/configuracion', label: 'Configuración', icon: '⚙', badge: null },
    ],
  },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
            <path d="M9 5L13 7.5V12.5L9 15L5 12.5V7.5L9 5Z" fill="rgba(255,255,255,0.3)" />
            <circle cx="9" cy="9" r="2" fill="white" />
          </svg>
        </div>
        VerdeXcelerate
      </Link>

      {nav.map((section) => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-label">{section.label}</div>
          {section.items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link${path.startsWith(item.href) ? ' active' : ''}`}
            >
              <span style={{ fontFamily: 'monospace', fontSize: 16 }}>{item.icon}</span>
              {item.label}
              {item.badge && <span className="sidebar-badge">{item.badge}</span>}
            </Link>
          ))}
        </div>
      ))}

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">TF</div>
          <div>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 13 }}>Tomás F.</div>
            <div style={{ fontSize: 11 }}>Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
