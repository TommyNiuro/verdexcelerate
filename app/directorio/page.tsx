'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import { getActors, type Actor } from '@/lib/queries'

const TYPE_LABELS: Record<string, string> = {
  todos: 'Todos',
  startup: 'Startups',
  inversor: 'Inversores',
  eso: 'ESOs',
  academia: 'Academia',
  corporativo_ancla: 'Corporativos',
  gobierno: 'Gobierno',
  asociacion: 'Asociaciones',
  red: 'Redes',
  organismo_internacional: 'Organismos',
}

const TYPE_INITIALS: Record<string, string> = {
  startup: 'ST', inversor: 'IN', eso: 'ES', academia: 'AC',
  corporativo_ancla: 'CO', gobierno: 'GO', asociacion: 'AS',
  red: 'RE', organismo_internacional: 'OI',
}

const TYPE_CLASS: Record<string, string> = {
  startup: 'startup', inversor: 'inversor', eso: 'eso', academia: 'academia',
  corporativo_ancla: 'corporativo', gobierno: 'gobierno', asociacion: 'asociacion',
  red: 'red', organismo_internacional: 'organismo',
}

const COUNTRIES = [
  { iso: 'todos', name: 'Todos los países' },
  { iso: 'CO', name: 'Colombia' }, { iso: 'CR', name: 'Costa Rica' },
  { iso: 'SV', name: 'El Salvador' }, { iso: 'GT', name: 'Guatemala' },
  { iso: 'HN', name: 'Honduras' }, { iso: 'PA', name: 'Panamá' },
]

const PAGE_SIZE = 24

export default function DirectorioPage() {
  const [actors, setActors] = useState<Actor[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [type, setType] = useState('todos')
  const [country, setCountry] = useState('todos')
  const [page, setPage] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(t)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await getActors({
        type: type !== 'todos' ? type : undefined,
        country: country !== 'todos' ? country : undefined,
        search: debouncedSearch || undefined,
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      })
      setActors(result.actors)
      setTotal(result.count ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [type, country, debouncedSearch, page])

  useEffect(() => { setPage(0) }, [type, country, debouncedSearch])
  useEffect(() => { load() }, [load])

  const pages = Math.ceil(total / PAGE_SIZE)

  return (
    <AppLayout title="Directorio de actores">
      {/* Type chips */}
      <div className="type-chips anim-fade-up">
        {Object.entries(TYPE_LABELS).map(([k, label]) => (
          <button
            key={k}
            className={`type-chip${type === k ? ' active' : ''}`}
            onClick={() => setType(k)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="toolbar anim-fade-up delay-2">
        <div className="search-input">
          <svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
          <input
            type="text"
            placeholder="Buscar actores, cadenas de valor, países…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className="filter-select" value={country} onChange={(e) => setCountry(e.target.value)}>
          {COUNTRIES.map((c) => <option key={c.iso} value={c.iso}>{c.name}</option>)}
        </select>
      </div>

      {/* Results meta */}
      <div className="results-meta anim-fade-up delay-3">
        <span>
          {loading ? 'Cargando…' : (
            <><strong>{total.toLocaleString()}</strong> actores{type !== 'todos' ? ` · ${TYPE_LABELS[type]}` : ''}</>
          )}
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
          Página {page + 1} de {Math.max(1, pages)}
        </span>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="actor-card" style={{
              background: 'linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', minHeight: 180,
            }} />
          ))}
        </div>
      ) : actors.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" /><path d="M16 24h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <h3>Sin resultados</h3>
          <p>Intenta con otro tipo de actor o cambia los filtros.</p>
        </div>
      ) : (
        <div className="actors-grid">
          {actors.map((actor, i) => (
            <div key={actor.id} className={`actor-card anim-fade-up delay-${(i % 8) + 1}`}>
              <div className="actor-top">
                <div className={`actor-icon ${TYPE_CLASS[actor.type] ?? 'startup'}`}>
                  {TYPE_INITIALS[actor.type] ?? 'AC'}
                </div>
                <div>
                  <span className="badge badge-teal" style={{ fontSize: 10 }}>
                    {(actor.countries as any)?.iso2 ?? '—'}
                  </span>
                </div>
              </div>
              <div className="actor-name">{actor.name}</div>
              <div className="actor-desc">
                {actor.short_pitch ?? actor.description ?? 'Sin descripción disponible.'}
              </div>
              <div className="actor-meta">
                <div className="actor-meta-left">
                  <span>
                    <span className="status-dot approved" />
                    Aprobado
                  </span>
                  {actor.confidence != null && (
                    <span>
                      <span style={{ fontSize: 11 }}>Conf.</span>
                      <span className="confidence-bar">
                        <span className="confidence-fill" style={{ width: `${actor.confidence}%` }} />
                      </span>
                    </span>
                  )}
                </div>
                <span className="actor-source">{actor.capture_method ?? 'manual'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹</button>
          {Array.from({ length: Math.min(5, pages) }, (_, i) => {
            const p = page < 3 ? i : page + i - 2
            if (p >= pages) return null
            return (
              <button key={p} className={`page-btn${p === page ? ' active' : ''}`} onClick={() => setPage(p)}>
                {p + 1}
              </button>
            )
          })}
          <button className="page-btn" disabled={page === pages - 1} onClick={() => setPage(p => p + 1)}>›</button>
        </div>
      )}
    </AppLayout>
  )
}
