'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getActorCount, getZones } from '@/lib/queries'

export default function Sidebar() {
  const path = usePathname()
  const [actorCount, setActorCount] = useState<number | null>(null)
  const [zoneCount, setZoneCount] = useState<number | null>(null)

  useEffect(() => {
    getActorCount().then(setActorCount).catch(() => {})
    getZones().then(z => setZoneCount(z.filter(x => x.is_priority).length)).catch(() => {})
  }, [])

  const isActive = (href: string) => path.startsWith(href)

  return (
    <aside className="sidebar">
      <Link href="/dashboard" className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
            <path d="M12 3c-1.2 3.6-4.4 6-8 7 1.6 2 2.8 4.6 3 7.5C8.6 15.2 10.2 13 12 12c1.8 1 3.4 3.2 5 5.5.2-2.9 1.4-5.5 3-7.5-3.6-1-6.8-3.4-8-7z"/>
          </svg>
        </div>
        VerdeXcelerate
      </Link>

      <div className="sidebar-section">
        <div className="sidebar-label">Principal</div>
        <Link href="/dashboard" className={`sidebar-link${isActive('/dashboard') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
            <rect x="14" y="14" width="7" height="7" rx="1.5"/>
          </svg>
          Dashboard
        </Link>
        <Link href="/directorio" className={`sidebar-link${isActive('/directorio') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
          </svg>
          Directorio
          {actorCount != null && <span className="sidebar-badge">{actorCount.toLocaleString()}</span>}
        </Link>
        <Link href="/mapa" className={`sidebar-link${isActive('/mapa') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
            <line x1="8" y1="2" x2="8" y2="18"/>
            <line x1="16" y1="6" x2="16" y2="22"/>
          </svg>
          Mapa
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Analisis</div>
        <Link href="/pais" className={`sidebar-link${isActive('/pais') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="10"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
          </svg>
          Perfiles de pais
        </Link>
        <Link href="/zonas" className={`sidebar-link${isActive('/zonas') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          Zonas prioritarias
          {zoneCount != null && <span className="sidebar-badge">{zoneCount}</span>}
        </Link>
        <Link href="/brechas" className={`sidebar-link${isActive('/brechas') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
          Brechas y retos
        </Link>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">Datos</div>
        <Link href="/fuentes" className={`sidebar-link${isActive('/fuentes') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
          </svg>
          Fuentes
        </Link>
        <Link href="/gobernanza" className={`sidebar-link${isActive('/gobernanza') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          Gobernanza IA
        </Link>
      </div>

      <div className="sidebar-bottom">
        <Link href="/configuracion" className={`sidebar-link${isActive('/configuracion') ? ' active' : ''}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
          </svg>
          Configuracion
        </Link>
        <div className="sidebar-user">
          <div className="sidebar-avatar">TS</div>
          <div>
            <div style={{color:'white',fontSize:13,fontWeight:500}}>TechnoServe</div>
            <div style={{fontSize:11}}>Administrador</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
