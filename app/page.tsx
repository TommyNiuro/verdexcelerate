'use client'
import { useEffect, useRef, useState } from 'react'
import CommandPalette from '@/components/CommandPalette'
import HealthBadge from '@/components/HealthBadge'

// ── Count-up hook ──
function useCountUp(target: number, delay = 0, duration = 2000) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    let raf: number
    const t = setTimeout(() => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / duration, 1)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setValue(Math.round(eased * target))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, delay)
    return () => { clearTimeout(t); if (raf) cancelAnimationFrame(raf) }
  }, [target, delay, duration])
  return value
}

function MetaStat({ target, delay, prefix = '', suffix = '', comma = false, label }: {
  target: number; delay: number; prefix?: string; suffix?: string; comma?: boolean; label: string
}) {
  const v = useCountUp(target, delay)
  const display = comma ? v.toLocaleString('en-US') : String(v)
  return (
    <div className="hero-meta-item">
      <strong>{prefix}{display}{suffix}</strong>
      <span>{label}</span>
    </div>
  )
}

// ── Search data ──
type SearchItem = { name: string; category: string; href: string }
const SEARCH: SearchItem[] = [
  { name: 'AgroTech Labs', category: 'Actores', href: '/directorio' },
  { name: 'CafeDigital S.A.', category: 'Actores', href: '/directorio' },
  { name: 'BioHarvest Innovation', category: 'Actores', href: '/directorio' },
  { name: 'Colombia', category: 'Paises', href: '/pais' },
  { name: 'Costa Rica', category: 'Paises', href: '/pais' },
  { name: 'Honduras', category: 'Paises', href: '/pais' },
  { name: 'Dashboard regional', category: 'Secciones', href: '/dashboard' },
  { name: 'Mapa geografico', category: 'Secciones', href: '/mapa' },
  { name: 'Brechas y oportunidades', category: 'Secciones', href: '/brechas' },
  { name: 'Directorio de actores', category: 'Secciones', href: '/directorio' },
  { name: 'Zonas prioritarias', category: 'Secciones', href: '/zonas' },
]

const PULSE = [
  { text: <>Ultimo actor agregado: <strong>AgroTech Labs</strong></>, time: 'hace 3 min' },
  { text: <>Modelo IA actualizado: <strong>Clasificador v2.1</strong></>, time: 'hace 12 min' },
  { text: <>Nueva fuente integrada: <strong>DANE Colombia</strong></>, time: 'hace 28 min' },
  { text: <>Actor verificado: <strong>CafeDigital S.A.</strong></>, time: 'hace 45 min' },
  { text: <>Pipeline completado: <strong>Scraping Crunchbase</strong></>, time: 'hace 1h' },
  { text: <>Reporte generado: <strong>Brechas Honduras Q2</strong></>, time: 'hace 2h' },
]

const SCREENS = [
  { href: '/login', tag: 'Autenticacion', title: 'Login / Onboarding', desc: 'Inicio de sesion con Google, GitHub o correo. Panel de marca TechnoServe con cifras del ecosistema.', icon: <><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></> },
  { href: '/dashboard', tag: 'Vista principal', title: 'Dashboard regional', desc: 'Vista comparativa de los 6 paises con KPIs, cobertura digital, distribucion de actores y actividad reciente.', icon: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></> },
  { href: '/directorio', tag: '2,847 actores', title: 'Directorio de actores', desc: 'Buscador interactivo con filtros por tipo, pais, cadena de valor y status. Tarjetas con nivel de confianza IA.', icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></> },
  { href: '/mapa', tag: '6 paises', title: 'Mapa geografico', desc: 'Mapa interactivo con puntos por actor, panel lateral de busqueda y filtros por tipo.', icon: <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></> },
  { href: '/pais', tag: 'Colombia (ejemplo)', title: 'Perfil de ecosistema', desc: 'Perfil detallado por pais con KPIs, distribucion tematica, cadenas de valor, rondas de inversion y zonas.', icon: <><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></> },
  { href: '/zonas', tag: '6 zonas', title: 'Zonas prioritarias', desc: 'Diagnostico de 6 zonas de alta vulnerabilidad con brechas criticas, cobertura y analisis de genero.', icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></> },
  { href: '/brechas', tag: '38 brechas identificadas', title: 'Brechas y oportunidades', desc: 'Analisis de brechas criticas por categoria, oportunidades de innovacion, diagnostico de genero y recomendaciones.', icon: <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>, iconBg: 'rgba(239,68,68,.08)', iconColor: '#ef4444' },
  { href: '/fuentes', tag: '18 fuentes activas', title: 'Fuentes de datos', desc: 'Rastreo de entrevistas, bases de datos, encuestas, web scraping y monitoreo IA. Pipeline en tiempo real.', icon: <><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></>, iconBg: 'rgba(99,102,241,.08)', iconColor: '#6366f1' },
  { href: '/gobernanza', tag: '3 modelos activos', title: 'Gobernanza IA', desc: 'Monitoreo de modelos de IA, deteccion de sesgos de genero, calidad de datos, auditoria y cumplimiento etico.', icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>, iconBg: 'rgba(139,92,246,.08)', iconColor: '#8b5cf6' },
  { href: '/configuracion', tag: 'Admin panel', title: 'Configuracion', desc: 'Perfil de usuario, configuracion de plataforma, auto-registro, gestion de equipo, API keys e integraciones.', icon: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09"/></>, iconBg: 'rgba(245,158,11,.08)', iconColor: '#f59e0b' },
]

export default function Home() {
  const [query, setQuery] = useState('')
  const [pulseIdx, setPulseIdx] = useState(0)
  const [fading, setFading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  // Rotating pulse
  useEffect(() => {
    const id = setInterval(() => {
      setFading(true)
      setTimeout(() => { setPulseIdx(i => i + 1); setFading(false) }, 300)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Close search dropdown on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false)
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, [])

  const q = query.toLowerCase().trim()
  const results = q ? SEARCH.filter(d => d.name.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) : []
  const groups = results.reduce<Record<string, SearchItem[]>>((acc, d) => {
    (acc[d.category] ||= []).push(d); return acc
  }, {})

  const pulse = PULSE[pulseIdx % PULSE.length]

  return (
    <>
      <section className="hero">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="mesh"></div>
        <div className="hero-inner">
          <div className="hero-logo">
            <div className="hero-logo-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                <path d="M12 3c-1.2 3.6-4.4 6-8 7 1.6 2 2.8 4.6 3 7.5C8.6 15.2 10.2 13 12 12c1.8 1 3.4 3.2 5 5.5.2-2.9 1.4-5.5 3-7.5-3.6-1-6.8-3.4-8-7z"/>
              </svg>
            </div>
            <span className="hero-logo-text">VerdeXcelerate</span>
          </div>
          <h1>Mapeo Vivo del Ecosistema AgrifoodTech</h1>
          <p>Plataforma de inteligencia para mapear, analizar y conectar el ecosistema de innovacion agroalimentaria en Colombia, Costa Rica, El Salvador, Guatemala, Honduras y Panama.</p>
          <a className="hero-cta" href="/login">Acceder a la plataforma &rarr;</a>

          <div className="hero-search" ref={searchRef}>
            <input
              className="hero-search-input" type="text" autoComplete="off"
              placeholder="Buscar actores, paises, zonas..."
              value={query}
              onChange={e => { setQuery(e.target.value); setSearchOpen(true) }}
              onFocus={() => { if (query) setSearchOpen(true) }}
              onKeyDown={e => { if (e.key === 'Enter' && results[0]) window.location.href = results[0].href; if (e.key === 'Escape') setSearchOpen(false) }}
            />
            <svg className="hero-search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <div className={`search-dropdown${searchOpen && q ? ' active' : ''}`}>
              {results.length === 0 ? (
                <div className="search-no-results">Sin resultados para &quot;{q}&quot;</div>
              ) : (
                Object.entries(groups).map(([cat, items]) => (
                  <div key={cat}>
                    <div className="search-category">{cat}</div>
                    {items.map(d => (
                      <a key={d.name + d.href} className="search-result" href={d.href}>
                        <div className="search-result-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                        </div>
                        <div className="search-result-info"><div className="search-result-name">{d.name}</div></div>
                        <span className="search-result-badge">{d.category}</span>
                      </a>
                    ))}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="kbd-hint" onClick={() => window.dispatchEvent(new Event('verdex:cmdk'))}>
            <kbd>Ctrl</kbd>+<kbd>K</kbd> para navegacion rapida
          </div>

          <div className="hero-meta">
            <MetaStat target={2847} delay={0} comma label="actores mapeados" />
            <MetaStat target={6} delay={200} label="paises" />
            <MetaStat target={9} delay={400} label="cadenas de valor" />
            <MetaStat target={147} delay={600} prefix="$" suffix="M" label="inversion rastreada" />
          </div>
        </div>
      </section>

      <section className="platform-pulse">
        <div className="pulse-inner">
          <div className="pulse-label"><span className="pulse-dot"></span> Actividad en tiempo real</div>
          <div className="pulse-container">
            <div className={`pulse-item${fading ? ' fade-out' : ''}`}>
              <div className="pulse-item-dot"></div>
              <div className="pulse-item-text">{pulse.text}</div>
              <div className="pulse-item-time">{pulse.time}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="screens">
        <div className="screens-inner">
          <div className="screens-header">
            <h2>Pantallas de la plataforma</h2>
            <p>Navega entre las secciones de VerdeXcelerate</p>
          </div>
          <div className="screens-grid">
            {SCREENS.map(s => (
              <a key={s.href} className="screen-card" href={s.href}>
                <div className="screen-icon" style={s.iconBg ? { background: s.iconBg, color: s.iconColor } : undefined}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{s.icon}</svg>
                </div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <div className="screen-tag">{s.tag}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <span>VerdeXcelerate &middot; <a href="https://www.technoserve.org" target="_blank" rel="noreferrer">TechnoServe</a> / BID Lab</span>
      </footer>

      <HealthBadge />
      <CommandPalette />
    </>
  )
}
