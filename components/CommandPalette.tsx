'use client'
import { useEffect, useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/directorio', label: 'Directorio de actores' },
  { href: '/mapa', label: 'Mapa interactivo' },
  { href: '/pais', label: 'Perfiles de pais' },
  { href: '/zonas', label: 'Zonas prioritarias' },
  { href: '/brechas', label: 'Brechas y retos' },
  { href: '/fuentes', label: 'Fuentes de datos' },
  { href: '/gobernanza', label: 'Gobernanza IA' },
  { href: '/configuracion', label: 'Configuracion' },
]

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    const openEvt = () => setOpen(true)
    document.addEventListener('keydown', handler)
    window.addEventListener('verdex:cmdk', openEvt)
    return () => {
      document.removeEventListener('keydown', handler)
      window.removeEventListener('verdex:cmdk', openEvt)
    }
  }, [])

  if (!open) return null

  const items = NAV.filter(i => !query || i.label.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="cmd-overlay open" onClick={(e) => { if (e.target === e.currentTarget) { setOpen(false); setQuery('') } }}>
      <div className="cmd-box">
        <div className="cmd-input-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input className="cmd-input" type="text" placeholder="Buscar actores, paises, secciones..." autoComplete="off" autoFocus
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') { setOpen(false); setQuery('') }
              if (e.key === 'Enter' && items[0]) { window.location.href = items[0].href }
            }} />
          <kbd>ESC</kbd>
        </div>
        <div className="cmd-group">
          <div className="cmd-group-label">Navegacion rapida</div>
          {items.length === 0 && <div className="cmd-empty" style={{padding:'16px',color:'var(--muted)',fontSize:13}}>Sin resultados</div>}
          {items.map(i => (
            <a key={i.href} className="cmd-item" href={i.href} onClick={() => setOpen(false)}>
              {i.label}
            </a>
          ))}
        </div>
        <div className="cmd-footer">
          <span><kbd>Enter</kbd> Abrir</span>
          <span><kbd>ESC</kbd> Cerrar</span>
        </div>
      </div>
    </div>
  )
}
