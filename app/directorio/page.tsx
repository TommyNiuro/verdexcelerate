'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import { getActors, insertActor, insertActors, getDirectoryStats, type Actor, type NewActorInput } from '@/lib/queries'

const TYPE_CHIPS = [
  { key: 'all',        label: 'Todos',           color: 'var(--accent)',  dot: 'var(--accent)'  },
  { key: 'startup',    label: 'Startups',         color: 'var(--accent)',  dot: 'var(--accent)'  },
  { key: 'inversor',   label: 'Inversores',       color: '#6366f1',        dot: '#6366f1'         },
  { key: 'eso',        label: 'ESOs',             color: 'var(--warning)', dot: 'var(--warning)' },
  { key: 'asociacion_agricola', label: 'Asoc. Agricolas',  color: '#8b5cf6',        dot: '#8b5cf6'         },
  { key: 'corporativo_ancla',label: 'Corporativos',     color: 'var(--success)', dot: 'var(--success)' },
  { key: 'academia',   label: 'Academia',         color: '#ec4899',        dot: '#ec4899'         },
  { key: 'agencia_gubernamental', label: 'Gobierno',  color: 'var(--fg)',      dot: 'var(--fg)'       },
  { key: 'organismo_internacional', label: 'Org. Internac.', color: '#3b82f6',  dot: '#3b82f6'         },
  { key: 'red_comunidad', label: 'Redes',          color: 'var(--danger)',  dot: 'var(--danger)'  },
]

const ICON_CLASSES: Record<string, string> = {
  startup: 'startup', inversor: 'inversor', eso: 'eso', academia: 'academia',
  agencia_gubernamental: 'gobierno', corporativo_ancla: 'corporativo', asociacion_agricola: 'asociacion',
  red_comunidad: 'red', organismo_internacional: 'organismo',
}

const VALUE_CHAINS = [
  { id: 1, name: 'Cafe' }, { id: 2, name: 'Cacao' }, { id: 3, name: 'Lacteos' },
  { id: 4, name: 'Hortalizas' }, { id: 5, name: 'Aguacate' }, { id: 6, name: 'Granos basicos' },
  { id: 7, name: 'Frutas' }, { id: 8, name: 'Cana de azucar' }, { id: 9, name: 'Pesca y acuicultura' },
]

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
}

function parseCSV(text: string): NewActorInput[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const idx = (k: string) => header.indexOf(k)
  const iName = idx('nombre'), iType = idx('tipo'), iCountry = idx('pais'), iDesc = idx('descripcion'), iChain = idx('cadena_valor')
  return lines.slice(1).map(line => {
    const cells = line.split(',')
    const get = (i: number) => (i >= 0 ? (cells[i] || '').trim() : '')
    const chainName = get(iChain).toLowerCase()
    const chain = VALUE_CHAINS.find(c => c.name.toLowerCase() === chainName)
    return {
      name: get(iName),
      type: get(iType) || 'startup',
      countryName: get(iCountry),
      description: get(iDesc),
      value_chain_ids: chain ? [chain.id] : undefined,
    } as NewActorInput
  }).filter(r => r.name)
}

function ActorCard({ actor, onClick }: { actor: Actor; onClick: (a: Actor) => void }) {
  const confPct = actor.confidence != null ? (actor.confidence * 100).toFixed(0) : null
  const iconCls = ICON_CLASSES[actor.type] ?? 'startup'
  const country = actor.countries?.iso2 ?? ''
  const flagMap: Record<string, string> = { CO:'🇨🇴', CR:'🇨🇷', SV:'🇸🇻', GT:'🇬🇹', HN:'🇭🇳', PA:'🇵🇦' }
  const flag = flagMap[country] ?? ''

  return (
    <div className="actor-card anim-fade-up" onClick={() => onClick(actor)}>
      <div className="actor-top">
        <div className={`actor-icon ${iconCls}`}>{initials(actor.name)}</div>
        <div style={{display:'flex',gap:6,alignItems:'center',flexWrap:'wrap'}}>
          {actor.status === 'aprobado' && (
            <span className="tag stage">Aprobado</span>
          )}
          {actor.women_led && (
            <span className="actor-gender gender-f">&#9792; Fundadora</span>
          )}
        </div>
      </div>
      <div className="actor-name">{actor.name}</div>
      {actor.short_pitch && (
        <div className="actor-desc">{actor.short_pitch}</div>
      )}
      <div className="actor-tags">
        <span className="tag">{actor.type}</span>
        {country && flag && <span className="tag">{flag} {actor.countries?.name ?? country}</span>}
      </div>
      <div className="actor-meta">
        <div className="actor-meta-left">
          <span>
            <span className={`status-dot ${actor.status === 'aprobado' ? 'approved' : 'pending'}`}></span>
            {actor.status === 'aprobado' ? 'Aprobado' : 'Pendiente'}
          </span>
          {confPct != null && (
            <span>
              Conf.
              <span className="confidence-bar">
                <span className="confidence-fill" style={{width: confPct + '%'}}></span>
              </span>
            </span>
          )}
        </div>
        {actor.capture_method && (
          <span className="actor-source">{actor.capture_method}</span>
        )}
      </div>
    </div>
  )
}

const EMPTY_FORM = { name: '', type: 'Startup AgriTech', countryName: 'Colombia', gender: 'Mujer', description: '' }

export default function DirectorioPage() {
  const [actors, setActors]       = useState<Actor[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [activeType, setActiveType] = useState('all')
  const [country, setCountry]     = useState('')
  const [chain, setChain]         = useState('')
  const [sort, setSort]           = useState('recientes')
  const [page, setPage]           = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [listView, setListView]   = useState(false)
  const [modal, setModal]         = useState<Actor | null>(null)
  const [showAddModal, setShowAddModal]     = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)

  const [stats, setStats] = useState<{ total:number; startups:number; inversores:number; womenPct:number; avgConf:number } | null>(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [importRows, setImportRows] = useState<NewActorInput[]>([])
  const [importFileName, setImportFileName] = useState('')
  const [importing, setImporting] = useState(false)
  const [toast, setToast] = useState('')

  const PER_PAGE = 12

  const load = useCallback(async () => {
    setLoading(true)
    const filters: Record<string, string | number> = { offset: (page - 1) * PER_PAGE, limit: PER_PAGE, sort }
    if (search)  filters.search  = search
    if (country) filters.country = country
    if (chain)   filters.chain   = Number(chain)
    if (activeType !== 'all') filters.type = activeType
    try {
      const { actors: data, count } = await getActors(filters as any)
      setActors(data)
      setTotalCount(count ?? 0)
    } catch {
      setActors([]); setTotalCount(0)
    }
    setLoading(false)
  }, [search, activeType, country, chain, sort, page])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    getDirectoryStats().then(setStats).catch(() => setStats(null))
  }, [])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  async function handleAddActor(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { showToast('El nombre es obligatorio'); return }
    setSaving(true)
    try {
      await insertActor({
        name: form.name,
        type: form.type,
        countryName: form.countryName,
        description: form.description,
        women_led: form.gender === 'Mujer',
      })
      setShowAddModal(false)
      setForm(EMPTY_FORM)
      showToast('Actor enviado a validacion correctamente')
      getDirectoryStats().then(setStats).catch(() => {})
    } catch (err: any) {
      showToast('Error al guardar: ' + (err?.message ?? 'desconocido'))
    }
    setSaving(false)
  }

  async function handleFile(file: File) {
    setImportFileName(file.name)
    const text = await file.text()
    setImportRows(parseCSV(text))
  }

  async function handleImport() {
    if (!importRows.length) return
    setImporting(true)
    try {
      const n = await insertActors(importRows)
      setShowImportModal(false)
      setImportRows([]); setImportFileName('')
      showToast(`${n} actores importados y enviados a validacion`)
      getDirectoryStats().then(setStats).catch(() => {})
    } catch (err: any) {
      showToast('Error al importar: ' + (err?.message ?? 'desconocido'))
    }
    setImporting(false)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))
  const fmt = (n: number | undefined) => n == null ? '—' : n.toLocaleString()

  return (
    <AppLayout title="Directorio de actores">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Directorio</span>
          </div>
          <h1>Directorio de actores</h1>
        </div>
        <div className="topbar-right">
          <button className="btn-sm btn-accent" onClick={() => setShowAddModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Agregar actor
          </button>
          <button className="btn-sm" onClick={() => setShowImportModal(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Importar
          </button>
          <button className="btn-sm" onClick={() => window.location.href='/configuracion'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar
          </button>
        </div>
      </header>

      {/* ── Stats strip ── */}
      <div className="stats-strip anim-fade-up">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(0,167,157,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'var(--fg)'}}>{fmt(stats?.total)}</span>
            <span className="stat-label">Total Actores</span>
          </div>
          <svg className="stat-sparkline" width="48" height="24" viewBox="0 0 48 24">
            <polyline points="0,20 8,16 16,18 24,10 32,12 40,6 48,8" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round"/>
            <polyline points="0,20 8,16 16,18 24,10 32,12 40,6 48,8 48,24 0,24" fill="rgba(0,167,157,.08)" stroke="none"/>
          </svg>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(0,167,157,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'var(--accent)'}}>{fmt(stats?.startups)}</span>
            <span className="stat-label">Startups</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(99,102,241,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'#6366f1'}}>{fmt(stats?.inversores)}</span>
            <span className="stat-label">Inversores</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(236,72,153,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.6"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'#ec4899'}}>{stats ? stats.womenPct + '%' : '—'}</span>
            <span className="stat-label">Lid. Femenino</span>
            {stats && stats.womenPct < 40 && (
              <span className="stat-warning">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                &lt;40% meta
              </span>
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(16,185,129,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.6"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'var(--success)'}}>{stats ? stats.avgConf + '%' : '—'}</span>
            <span className="stat-label">Confianza Prom.</span>
          </div>
        </div>
      </div>

      {/* ── Type chips ── */}
      <div className="type-chips anim-fade-up">
        {TYPE_CHIPS.map(({ key, label, dot }) => (
          <span
            key={key}
            className={`type-chip${activeType === key ? ' active' : ''}`}
            onClick={() => { setActiveType(key); setPage(1) }}
          >
            <span className="chip-dot" style={{background: dot}}></span>
            {label}
          </span>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="toolbar anim-fade-up delay-1">
        <div className="search-input">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          {search && (
            <span className="search-kbd" style={{cursor:'pointer'}} onClick={() => { setSearch(''); setPage(1) }}>✕</span>
          )}
        </div>
        <select className="filter-select" value={country} onChange={e => { setCountry(e.target.value); setPage(1) }}>
          <option value="">Todos los paises</option>
          <option value="CO">&#127464;&#127476; Colombia</option>
          <option value="CR">&#127464;&#127479; Costa Rica</option>
          <option value="SV">&#127480;&#127483; El Salvador</option>
          <option value="GT">&#127468;&#127481; Guatemala</option>
          <option value="HN">&#127469;&#127475; Honduras</option>
          <option value="PA">&#127477;&#127462; Panama</option>
        </select>
        <select className="filter-select" value={chain} onChange={e => { setChain(e.target.value); setPage(1) }}>
          <option value="">Todas las cadenas</option>
          {VALUE_CHAINS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="filter-select" value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}>
          <option value="recientes">Mas recientes</option>
          <option value="az">Nombre A-Z</option>
          <option value="za">Nombre Z-A</option>
          <option value="conf-desc">Mayor confianza</option>
          <option value="conf-asc">Menor confianza</option>
        </select>
      </div>

      {/* ── Results meta ── */}
      <div className="results-meta anim-fade-up delay-2">
        <span>
          Mostrando <strong>{actors.length}</strong> de <strong>{totalCount.toLocaleString()}</strong> actores en 6 paises
        </span>
        <div className="view-toggle">
          <button className={`view-btn${!listView ? ' active' : ''}`} onClick={() => setListView(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
          </button>
          <button className={`view-btn${listView ? ' active' : ''}`} onClick={() => setListView(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
          </button>
        </div>
      </div>

      {/* ── Actors grid ── */}
      {loading ? (
        <div className="empty-state">
          <div className="live-dot" style={{width:12,height:12,margin:'0 auto 16px'}}></div>
          Cargando actores...
        </div>
      ) : actors.length === 0 ? (
        <div className="no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3>Sin resultados</h3>
          <p>No se encontraron actores con los filtros seleccionados. Prueba ajustando tu busqueda.</p>
        </div>
      ) : (
        <div className={`actors-grid${listView ? ' list-view' : ''}`}>
          {actors.map(actor => (
            <ActorCard key={actor.id} actor={actor} onClick={setModal} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="pagination anim-fade-up">
          <button className={`page-btn${page <= 1 ? ' disabled' : ''}`} onClick={() => page > 1 && setPage(p => p - 1)}>
            &larr;
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`page-btn${p === page ? ' active' : ''}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}
          {totalPages > 5 && <span className="page-btn" style={{cursor:'default'}}>...</span>}
          {totalPages > 5 && <button className="page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>}
          <button className={`page-btn${page >= totalPages ? ' disabled' : ''}`} onClick={() => page < totalPages && setPage(p => p + 1)}>
            &rarr;
          </button>
        </div>
      )}

      {/* ── Detail Modal ── */}
      {modal && (
        <div className="modal-overlay show" onClick={e => { if (e.target === e.currentTarget) setModal(null) }}>
          <div className="modal">
            <div className="modal-header">
              <div className={`actor-icon ${ICON_CLASSES[modal.type] ?? 'startup'}`} style={{width:56,height:56,borderRadius:14,fontSize:16}}>
                {initials(modal.name)}
              </div>
              <div style={{flex:1}}>
                <div className="modal-name">{modal.name}</div>
                <div className="modal-type">{modal.type} · {modal.countries?.name ?? ''}</div>
              </div>
              <button className="modal-close" onClick={() => setModal(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-stats">
                <div className="modal-stat">
                  <div className="modal-stat-val" style={{color:'var(--accent)'}}>
                    {modal.confidence != null ? (modal.confidence * 100).toFixed(0) + '%' : '—'}
                  </div>
                  <div className="modal-stat-label">Confianza IA</div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-val" style={{color:'#6366f1'}}>
                    {modal.founded_year ?? '—'}
                  </div>
                  <div className="modal-stat-label">Fundacion</div>
                </div>
                <div className="modal-stat">
                  <div className="modal-stat-val" style={{color:'var(--success)'}}>
                    {modal.activity_level ?? '—'}
                  </div>
                  <div className="modal-stat-label">Actividad</div>
                </div>
              </div>
              <div className="modal-section">
                <h4>Descripcion</h4>
                <p className="modal-desc">{modal.description || modal.short_pitch || 'Sin descripcion.'}</p>
              </div>
              {modal.website && (
                <div className="modal-section">
                  <h4>Sitio web</h4>
                  <a href={modal.website} target="_blank" rel="noopener noreferrer" style={{fontSize:13,color:'var(--accent)',fontFamily:'var(--font-mono)'}}>
                    {modal.website.replace('https://','').replace('http://','')}
                  </a>
                </div>
              )}
              <div className="modal-section">
                <h4>Fuente de datos</h4>
                <p className="modal-desc" style={{fontFamily:'var(--font-mono)',fontSize:12}}>
                  {modal.capture_method ?? 'No especificada'}
                </p>
              </div>
              <div className="modal-actions">
                <button className="modal-btn modal-btn-primary" onClick={() => {
                  if (modal.website) window.open(modal.website, '_blank', 'noopener')
                  else window.location.href = '/pais'
                }}>
                  {modal.website ? 'Visitar sitio web' : 'Ver ecosistema del pais'}
                </button>
                <button className="modal-btn modal-btn-secondary" onClick={() => setModal(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Actor Modal ── */}
      {showAddModal && (
        <div style={{display:'flex',position:'fixed',inset:0,background:'rgba(0,0,0,.5)',backdropFilter:'blur(4px)',zIndex:1000,alignItems:'center',justifyContent:'center'}}
          onClick={e => { if (e.target === e.currentTarget) setShowAddModal(false) }}>
          <div style={{background:'#fff',borderRadius:'var(--radius-lg)',width:560,maxWidth:'90vw',maxHeight:'80vh',overflowY:'auto',padding:32,boxShadow:'0 25px 50px -12px rgba(0,0,0,.25)'}}>
            <h3 style={{fontFamily:'var(--font-display)',fontSize:22,margin:'0 0 6px'}}>Agregar nuevo actor</h3>
            <p style={{color:'var(--muted)',fontSize:13,margin:'0 0 24px'}}>Registra un actor del ecosistema AgrifoodTech. Se enviara a validacion humana.</p>
            <form onSubmit={handleAddActor}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Nombre *</label>
                  <input type="text" required placeholder="Nombre del actor" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',outline:'none',boxSizing:'border-box'}}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Tipo de actor</label>
                  <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
                    <option>Startup AgriTech</option><option>Inversor</option><option>ESO</option>
                    <option>Asociacion agricola</option><option>Corporativo</option>
                    <option>Academia</option><option>Gobierno</option>
                    <option>Organismo internacional</option><option>Red/Comunidad</option>
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Pais</label>
                  <select value={form.countryName} onChange={e => setForm(f => ({...f, countryName: e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
                    <option>Colombia</option><option>Costa Rica</option><option>El Salvador</option>
                    <option>Guatemala</option><option>Honduras</option><option>Panama</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Genero fundador(a)</label>
                  <select value={form.gender} onChange={e => setForm(f => ({...f, gender: e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
                    <option>Mujer</option><option>Hombre</option><option>No binario</option><option>Equipo mixto</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Descripcion</label>
                <textarea rows={3} placeholder="Breve descripcion del actor y sus actividades..." value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:500,border:'1px solid var(--border)',background:'#fff',color:'var(--muted)',cursor:'pointer'}}>Cancelar</button>
                <button type="submit" className="btn-sm btn-accent" disabled={saving} style={{padding:'10px 20px',opacity:saving ? 0.6 : 1}}>{saving ? 'Guardando...' : 'Agregar actor'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Import Modal ── */}
      {showImportModal && (
        <div className="modal-overlay import-modal show" onClick={e => { if (e.target === e.currentTarget) setShowImportModal(false) }}>
          <div className="modal">
            <div className="modal-header">
              <div style={{flex:1}}>
                <div className="modal-name">Importar actores</div>
                <div className="modal-type">Carga masiva de actores desde archivo CSV</div>
              </div>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <label className="import-zone" style={{cursor:'pointer',display:'block'}}>
                <input type="file" accept=".csv,text/csv" style={{display:'none'}} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}/>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p>{importFileName ? importFileName : 'Haz clic para seleccionar tu archivo CSV'}</p>
                <p className="import-formats">CSV con columnas: nombre, tipo, pais, descripcion, cadena_valor</p>
              </label>
              {importRows.length > 0 && (
                <p style={{fontSize:13,color:'var(--accent)',fontWeight:600,margin:'12px 0 0'}}>
                  {importRows.length} registros validos detectados en el archivo
                </p>
              )}
              <button className="import-btn-submit" disabled={!importRows.length || importing} onClick={handleImport}>
                {importing ? 'Importando...' : `Importar ${importRows.length} registros`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Toast ── */}
      <div className={`toast${toast ? ' show' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>{toast}</span>
      </div>
    </AppLayout>
  )
}
