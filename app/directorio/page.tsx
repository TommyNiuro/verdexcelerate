'use client'

import { useState, useEffect, useCallback } from 'react'
import AppLayout from '@/components/AppLayout'
import { getActors, type Actor } from '@/lib/queries'

const TYPE_CHIPS = [
  { key: 'all',        label: 'Todos',           color: 'var(--accent)',  dot: 'var(--accent)'  },
  { key: 'startup',    label: 'Startups',         color: 'var(--accent)',  dot: 'var(--accent)'  },
  { key: 'inversor',   label: 'Inversores',       color: '#6366f1',        dot: '#6366f1'         },
  { key: 'eso',        label: 'ESOs',             color: 'var(--warning)', dot: 'var(--warning)' },
  { key: 'asociacion', label: 'Asoc. Agricolas',  color: '#8b5cf6',        dot: '#8b5cf6'         },
  { key: 'corporativo',label: 'Corporativos',     color: 'var(--success)', dot: 'var(--success)' },
  { key: 'academia',   label: 'Academia',         color: '#ec4899',        dot: '#ec4899'         },
  { key: 'gobierno',   label: 'Gobierno',         color: 'var(--fg)',      dot: 'var(--fg)'       },
  { key: 'organismo',  label: 'Org. Internac.',   color: '#3b82f6',        dot: '#3b82f6'         },
  { key: 'red',        label: 'Redes',            color: 'var(--danger)',  dot: 'var(--danger)'  },
]

const ICON_CLASSES: Record<string, string> = {
  startup: 'startup', inversor: 'inversor', eso: 'eso', academia: 'academia',
  gobierno: 'gobierno', corporativo: 'corporativo', asociacion: 'asociacion',
  red: 'red', organismo: 'organismo',
}

function initials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
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

  const PER_PAGE = 12

  const load = useCallback(async () => {
    setLoading(true)
    const filters: Record<string, string | number> = { page, limit: PER_PAGE }
    if (search)  filters.search  = search
    if (country) filters.country = country
    if (activeType !== 'all') filters.type = activeType
    const { actors: data, count } = await getActors(filters as any)
    setActors(data)
    setTotalCount(count ?? 0)
    setLoading(false)
  }, [search, activeType, country, page])

  useEffect(() => { load() }, [load])

  const totalPages = Math.max(1, Math.ceil(totalCount / PER_PAGE))

  return (
    <AppLayout title="Directorio de actores">
      {/* ── Stats strip ── */}
      <div className="stats-strip anim-fade-up">
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(0,167,157,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'var(--fg)'}}>2,847</span>
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
            <span className="stat-value" style={{color:'var(--accent)'}}>1,243</span>
            <span className="stat-label">Startups</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(99,102,241,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a4 4 0 00-8 0v2"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'#6366f1'}}>331</span>
            <span className="stat-label">Inversores</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(236,72,153,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.6"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'#ec4899'}}>29%</span>
            <span className="stat-label">Lid. Femenino</span>
            <span className="stat-warning">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              &lt;40% meta
            </span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{background:'rgba(16,185,129,.08)'}}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--success)" strokeWidth="1.6"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
          <div className="stat-info">
            <span className="stat-value" style={{color:'var(--success)'}}>89%</span>
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
            placeholder="Buscar por nombre, pais, area tematica..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
          <span className="search-kbd">&#8984;K</span>
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
        <select className="filter-select" value={chain} onChange={e => setChain(e.target.value)}>
          <option value="">Todas las cadenas</option>
          <option value="cafe">Cafe</option>
          <option value="cacao">Cacao</option>
          <option value="lacteos">Lacteos</option>
          <option value="hortalizas">Hortalizas</option>
          <option value="aguacate">Aguacate</option>
          <option value="granos">Granos basicos</option>
          <option value="frutas">Frutas</option>
          <option value="ganaderia">Ganaderia</option>
          <option value="multichain">Multi-cadena</option>
        </select>
        <select className="filter-select" value={sort} onChange={e => setSort(e.target.value)}>
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
        {totalPages > 5 && <button className="page-btn">...</button>}
        {totalPages > 5 && <button className="page-btn" onClick={() => setPage(totalPages)}>{totalPages}</button>}
        <button className={`page-btn${page >= totalPages ? ' disabled' : ''}`} onClick={() => page < totalPages && setPage(p => p + 1)}>
          &rarr;
        </button>
      </div>

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
                <button className="modal-btn modal-btn-primary" onClick={() => setModal(null)}>
                  Ver perfil completo
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
            <p style={{color:'var(--muted)',fontSize:13,margin:'0 0 24px'}}>Registra un actor del ecosistema AgrifoodTech.</p>
            <form onSubmit={e => { e.preventDefault(); setShowAddModal(false) }}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:16}}>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Nombre</label>
                  <input type="text" placeholder="Nombre del actor" style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',outline:'none',boxSizing:'border-box'}}/>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Tipo de actor</label>
                  <select style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
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
                  <select style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
                    <option>Colombia</option><option>Costa Rica</option><option>El Salvador</option>
                    <option>Guatemala</option><option>Honduras</option><option>Panama</option>
                  </select>
                </div>
                <div>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Genero fundador(a)</label>
                  <select style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',background:'#fff'}}>
                    <option>Mujer</option><option>Hombre</option><option>No binario</option><option>Equipo mixto</option>
                  </select>
                </div>
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:6,color:'var(--muted)'}}>Descripcion</label>
                <textarea rows={3} placeholder="Breve descripcion del actor y sus actividades..." style={{width:'100%',padding:'10px 14px',border:'1px solid var(--border)',borderRadius:8,fontSize:13,fontFamily:'var(--font-body)',outline:'none',resize:'vertical',boxSizing:'border-box'}}/>
              </div>
              <div style={{display:'flex',gap:12,justifyContent:'flex-end'}}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{padding:'10px 20px',borderRadius:8,fontSize:13,fontWeight:500,border:'1px solid var(--border)',background:'#fff',color:'var(--muted)',cursor:'pointer'}}>Cancelar</button>
                <button type="submit" className="btn-sm btn-accent" style={{padding:'10px 20px'}}>Agregar actor</button>
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
                <div className="modal-type">Carga masiva de actores desde archivo CSV o Excel</div>
              </div>
              <button className="modal-close" onClick={() => setShowImportModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="import-zone">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <p>Arrastra y suelta tu archivo aqui</p>
                <p className="import-formats">CSV con columnas: nombre, tipo, pais, descripcion, cadena_valor</p>
              </div>
              <button className="import-btn-submit" disabled>Importar 0 registros</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
