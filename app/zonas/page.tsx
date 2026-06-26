'use client'

import { useState, useEffect, Fragment } from 'react'
import AppLayout from '@/components/AppLayout'
import { getDashboardStats, getBenchmarks } from '@/lib/queries'

const ZONE_CID: Record<string, number> = { CO: 1, CR: 2, SV: 3, GT: 4, HN: 5, PA: 6 }

// Codigo de pais por zona (para deep-link al perfil)
const ZONE_CC: Record<string, string> = {
  'la-guajira': 'CO', 'sucre': 'CO', 'cordoba': 'CO', 'magdalena': 'CO',
  'morazan': 'SV', 'alta-verapaz': 'GT',
}

const ZONES = [
  {
    id: 'la-guajira', name: 'La Guajira', country: '🇨🇴 Colombia · Caribe',
    sev: 'sev-high', sevLabel: 'Alta vulnerabilidad', sevClass: 'severity-high',
    actores: 12, cobertura: 28, lidFem: 0, cobColor: 'var(--danger)',
    bars: [
      { l: 'Financiamiento', w: 15, val: '1/5', cls: 'fill-danger' },
      { l: 'Conectividad', w: 20, val: '1/5', cls: 'fill-danger' },
      { l: 'Talento', w: 35, val: '2/5', cls: 'fill-warning' },
    ],
    rationale: 'Alta vulnerabilidad. Poblacion Wayuu con agricultura de subsistencia. Potencial en energia solar para riego y cadenas de chivo/ovino.',
    recs: [
      { p: 'Alta', t: 'Implementar programa de microfinanzas con enfoque etnico para productores Wayuu, apalancando energia solar para sistemas de riego.' },
      { p: 'Alta', t: 'Desplegar conectividad satelital comunitaria para habilitar plataformas AgTech en zonas remotas.' },
      { p: 'Media', t: 'Crear programa de mentoria con mujeres lideres de Barranquilla para formar liderazgo femenino local.' },
    ],
    financiamiento: 1, conectividad: 1,
  },
  {
    id: 'sucre', name: 'Sucre', country: '🇨🇴 Colombia · Caribe',
    sev: 'sev-high', sevLabel: 'Alta vulnerabilidad', sevClass: 'severity-high',
    actores: 18, cobertura: 34, lidFem: 2, cobColor: 'var(--warning)',
    bars: [
      { l: 'Financiamiento', w: 20, val: '1/5', cls: 'fill-danger' },
      { l: 'Mercado', w: 40, val: '2/5', cls: 'fill-warning' },
      { l: 'Infraestructura', w: 35, val: '2/5', cls: 'fill-warning' },
    ],
    rationale: 'Alta vulnerabilidad. Cadena de yuca y name con potencial agroindustrial. Limitado acceso a servicios financieros rurales.',
    recs: [
      { p: 'Alta', t: 'Establecer fondo rotatorio de capital semilla para agroindustria de yuca, vinculando cooperativas con mercados nacionales.' },
      { p: 'Media', t: 'Desarrollar hub de procesamiento agroindustrial con acceso a infraestructura compartida y asistencia tecnica.' },
    ],
    financiamiento: 1, conectividad: 3,
  },
  {
    id: 'morazan', name: 'Morazan', country: '🇸🇻 El Salvador',
    sev: 'sev-high', sevLabel: 'Alta vulnerabilidad', sevClass: 'severity-high',
    actores: 8, cobertura: 22, lidFem: 1, cobColor: 'var(--danger)',
    bars: [
      { l: 'Conectividad', w: 15, val: '1/5', cls: 'fill-danger' },
      { l: 'Talento', w: 20, val: '1/5', cls: 'fill-danger' },
      { l: 'Financiamiento', w: 30, val: '2/5', cls: 'fill-warning' },
    ],
    rationale: 'Alta vulnerabilidad y potencial agroalimentario. Cadenas de cafe y granos basicos. CONAMYPE como aliado potencial para programas de innovacion local.',
    recs: [
      { p: 'Alta', t: 'Alianza con CONAMYPE para programa de digitalizacion de productores de cafe y granos basicos.' },
      { p: 'Alta', t: 'Instalar puntos de acceso WiFi comunitario en mercados rurales para adopcion de herramientas digitales.' },
      { p: 'Media', t: 'Programa de formacion tecnica acelerada en agronegocios con universidades locales.' },
    ],
    financiamiento: 2, conectividad: 1,
  },
  {
    id: 'alta-verapaz', name: 'Alta Verapaz', country: '🇬🇹 Guatemala',
    sev: 'sev-high', sevLabel: 'Alta vulnerabilidad', sevClass: 'severity-high',
    actores: 14, cobertura: 26, lidFem: 1, cobColor: 'var(--danger)',
    bars: [
      { l: 'Genero', w: 15, val: '1/5', cls: 'fill-danger' },
      { l: 'Conectividad', w: 20, val: '1/5', cls: 'fill-danger' },
      { l: 'Mercado', w: 30, val: '2/5', cls: 'fill-warning' },
    ],
    rationale: 'Alta concentracion de poblacion indigena Q\'eqchi\' y ruralidad. Cadenas de cafe, cardamomo y cacao. CafeTrace GT opera aqui con trazabilidad blockchain.',
    recs: [
      { p: 'Alta', t: 'Escalar modelo CafeTrace blockchain a cardamomo y cacao para trazabilidad integrada multi-cadena.' },
      { p: 'Alta', t: 'Programa de empoderamiento economico para mujeres Q\'eqchi\' en liderazgo de cooperativas.' },
      { p: 'Media', t: 'Infraestructura de conectividad rural con torres comunitarias de bajo costo.' },
    ],
    financiamiento: 2, conectividad: 1,
  },
  {
    id: 'cordoba', name: 'Cordoba', country: '🇨🇴 Colombia · Caribe',
    sev: 'sev-med', sevLabel: 'Vulnerabilidad media', sevClass: 'severity-med',
    actores: 24, cobertura: 41, lidFem: 3, cobColor: 'var(--warning)',
    bars: [
      { l: 'Financiamiento', w: 35, val: '2/5', cls: 'fill-warning' },
      { l: 'Talento', w: 40, val: '2/5', cls: 'fill-warning' },
      { l: 'Infraestructura', w: 50, val: '3/5', cls: 'fill-accent' },
    ],
    rationale: 'Excluye Monteria. Region Caribe con cadenas de lacteos y ganaderia. Potencial agroindustrial con brechas en acceso a financiamiento temprano.',
    recs: [
      { p: 'Alta', t: 'Crear fondo de garantias para productores lacteos y ganaderos que acceden a credito por primera vez.' },
      { p: 'Media', t: 'Programa de innovacion en cadena fria y logistica para reducir perdidas post-cosecha en lacteos.' },
    ],
    financiamiento: 2, conectividad: 3,
  },
  {
    id: 'magdalena', name: 'Magdalena', country: '🇨🇴 Colombia · Caribe',
    sev: 'sev-high', sevLabel: 'Alta vulnerabilidad', sevClass: 'severity-high',
    actores: 19, cobertura: 36, lidFem: 2, cobColor: 'var(--warning)',
    bars: [
      { l: 'Financiamiento', w: 20, val: '1/5', cls: 'fill-danger' },
      { l: 'Conectividad', w: 35, val: '2/5', cls: 'fill-warning' },
      { l: 'Mercado', w: 40, val: '2/5', cls: 'fill-warning' },
    ],
    rationale: 'Alta vulnerabilidad. Sierra Nevada con cafe de alta calidad. Zona bananera con potencial de innovacion en logistica y trazabilidad.',
    recs: [
      { p: 'Alta', t: 'Plataforma de trazabilidad blockchain para cafe Sierra Nevada con certificacion de origen.' },
      { p: 'Alta', t: 'Fondo de capital semilla para startups AgTech en zona bananera orientadas a logistica inteligente.' },
      { p: 'Media', t: 'Conectar productores con plataformas de comercio electronico para acceso directo a mercados de exportacion.' },
    ],
    financiamiento: 1, conectividad: 2,
  },
]

const HEATMAP_ZONES = ['La Guajira', 'Sucre', 'Morazan', 'Alta Verapaz', 'Cordoba', 'Magdalena']
const HEATMAP_DIMS = ['Actores', 'Cobertura', 'Lid. Fem.', 'Financ.', 'Conect.']
const HEATMAP_VALUES = [
  [24, 28, 0, 20, 20],
  [36, 34, 22, 20, 60],
  [16, 22, 11, 40, 20],
  [28, 26, 11, 40, 20],
  [48, 41, 33, 40, 60],
  [38, 36, 22, 20, 40],
]

const COMPARE_METRICS = [
  { key: 'actores', label: 'Actores' },
  { key: 'cobertura', label: 'Cobertura (%)' },
  { key: 'lidFem', label: 'Liderazgo femenino' },
  { key: 'financiamiento', label: 'Financiamiento (1-5)' },
  { key: 'conectividad', label: 'Conectividad (1-5)' },
]

function heatColor(v: number) {
  const t = v / 100
  const r = Math.round(0 + (239 - 0) * (1 - t))
  const g = Math.round(167 + (68 - 167) * (1 - t))
  const b = Math.round(157 + (68 - 157) * (1 - t))
  return `rgb(${r},${g},${b})`
}

export default function ZonasPage() {
  const [openRecs, setOpenRecs] = useState<string[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [ctx, setCtx] = useState<Record<string, { actors: number; rural: number | null; pib: number | null }>>({})

  // Contexto real por zona: actores del pais (dataset) + benchmarks Banco Mundial
  useEffect(() => {
    Promise.all([getDashboardStats(), getBenchmarks()]).then(([ds, bench]) => {
      const totalByIso: Record<string, number> = {}
      for (const r of ds) totalByIso[(r as any).iso2] = (r as any).total
      const bget = (cid: number, metric: string) => bench.find(b => b.country_id === cid && b.metric === metric)?.value ?? null
      const next: Record<string, { actors: number; rural: number | null; pib: number | null }> = {}
      for (const z of ZONES) {
        const iso = ZONE_CC[z.id] ?? 'CO'
        const cid = ZONE_CID[iso]
        next[z.id] = {
          actors: totalByIso[iso] ?? 0,
          rural: bget(cid, 'poblacion_rural_pct'),
          pib: bget(cid, 'pib_agricola_pct'),
        }
      }
      setCtx(next)
    }).catch(() => {})
  }, [])

  const toggleRec = (id: string) => {
    setOpenRecs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Zonas prioritarias</span>
          </div>
          <h1>Diagnostico de zonas prioritarias</h1>
        </div>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>6 zonas de alta vulnerabilidad</h2>
          <p>Zonas reales priorizadas por vulnerabilidad, poblacion indigena, ruralidad y potencial agroalimentario (datos de priority_zones). Los indicadores de cada tarjeta son contexto del pais: actores mapeados (dataset) y poblacion rural y PIB agricola (Banco Mundial, 2024). El conteo de actores por zona aun no se captura individualmente, por eso se muestra el del pais. El analisis cualitativo y las recomendaciones son insumos de la Fase II.</p>
        </div>

        <div className="zones-grid">
          {ZONES.map((z, i) => {
            const isOpen = openRecs.includes(z.id)
            return (
              <div key={z.id} className={`zone-card ${z.sev} anim-fade-up delay-${i + 1}`}>
                <div className="zone-top">
                  <div>
                    <div className="zone-name">{z.name}</div>
                    <div className="zone-country">{z.country}</div>
                  </div>
                  <div className={`zone-severity ${z.sevClass}`}>{z.sevLabel}</div>
                </div>
                <div className="zone-stats">
                  <div className="zone-stat">
                    <div className="zone-stat-val">{ctx[z.id]?.actors ?? '-'}</div>
                    <div className="zone-stat-label">Actores (pais)</div>
                  </div>
                  <div className="zone-stat">
                    <div className="zone-stat-val" style={{color: z.cobColor}}>{ctx[z.id]?.rural != null ? `${ctx[z.id]!.rural}%` : '-'}</div>
                    <div className="zone-stat-label">Pob. rural</div>
                  </div>
                  <div className="zone-stat">
                    <div className="zone-stat-val">{ctx[z.id]?.pib != null ? `${ctx[z.id]!.pib}%` : '-'}</div>
                    <div className="zone-stat-label">PIB agro</div>
                  </div>
                </div>
                <div className="zone-bars">
                  {z.bars.map(b => (
                    <div key={b.l} className="zone-bar-row">
                      <span className="zone-bar-label">{b.l}</span>
                      <div className="zone-bar-track">
                        <div className={`zone-bar-fill ${b.cls}`} style={{width: `${b.w}%`}}></div>
                      </div>
                      <span className="zone-bar-val">{b.val}</span>
                    </div>
                  ))}
                </div>
                <div className="zone-rationale">{z.rationale}</div>
                <div className="zone-recommendations">
                  <button
                    className={`zone-rec-toggle${isOpen ? ' open' : ''}`}
                    onClick={() => toggleRec(z.id)}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
                    Recomendaciones de intervencion
                  </button>
                  <div className={`zone-rec-list${isOpen ? ' expanded' : ''}`}>
                    {z.recs.map((r, ri) => (
                      <div key={ri} className="zone-rec-item">
                        <span className={`zone-rec-priority priority-${r.p === 'Alta' ? 'alta' : 'media'}`}>{r.p}</span>
                        <span className="zone-rec-text">{r.t}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <a className="panel-action" href={`/pais?c=${ZONE_CC[z.id] ?? 'CO'}`} style={{display:'inline-block',marginTop:12}}>Ver perfil del pais &rarr;</a>
              </div>
            )
          })}
        </div>

        {/* Compare button */}
        <button className="compare-btn anim-fade-up" style={{animationDelay:'.52s'}} onClick={() => setModalOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/><path d="M16 21h5v-5"/><path d="M8 21H3v-5"/><path d="M21 21l-7-7"/><path d="M3 21l7-7"/></svg>
          Comparar Zonas
        </button>

        {/* Risk Matrix */}
        <div className="risk-matrix anim-fade-up" style={{animationDelay:'.54s'}}>
          <div className="risk-matrix-title">Matriz de riesgo — Impacto vs Probabilidad</div>
          <div className="risk-matrix-grid">
            <div className="rm-axis-label rm-axis-y" style={{gridRow:'1/4'}}>Impacto</div>
            <div className="risk-matrix-cell rm-red" style={{gridColumn:2,gridRow:1,position:'relative'}}>
              <div className="rm-dot rm-dot-high" style={{top:'30px',left:'20px'}}><span>LG</span><div className="rm-tooltip">La Guajira<br/>Impacto: Alto | Prob: Alta</div></div>
            </div>
            <div className="risk-matrix-cell rm-red" style={{gridColumn:3,gridRow:1,position:'relative'}}>
              <div className="rm-dot rm-dot-high" style={{top:'25px',left:'35px'}}><span>MZ</span><div className="rm-tooltip">Morazan<br/>Impacto: Alto | Prob: Alta</div></div>
            </div>
            <div className="risk-matrix-cell rm-orange" style={{gridColumn:4,gridRow:1,position:'relative'}}>
              <div className="rm-dot rm-dot-high" style={{top:'35px',left:'25px'}}><span>AV</span><div className="rm-tooltip">Alta Verapaz<br/>Impacto: Alto | Prob: Media</div></div>
            </div>
            <div className="risk-matrix-cell rm-orange" style={{gridColumn:2,gridRow:2,position:'relative'}}>
              <div className="rm-dot rm-dot-high" style={{top:'30px',left:'30px'}}><span>MG</span><div className="rm-tooltip">Magdalena<br/>Impacto: Medio | Prob: Alta</div></div>
            </div>
            <div className="risk-matrix-cell rm-yellow" style={{gridColumn:3,gridRow:2,position:'relative'}}>
              <div className="rm-dot rm-dot-high" style={{top:'25px',left:'20px'}}><span>SU</span><div className="rm-tooltip">Sucre<br/>Impacto: Medio | Prob: Media</div></div>
            </div>
            <div className="risk-matrix-cell rm-green" style={{gridColumn:4,gridRow:2}}></div>
            <div className="risk-matrix-cell rm-yellow" style={{gridColumn:2,gridRow:3}}></div>
            <div className="risk-matrix-cell rm-green" style={{gridColumn:3,gridRow:3,position:'relative'}}>
              <div className="rm-dot rm-dot-med" style={{top:'30px',left:'30px'}}><span>CO</span><div className="rm-tooltip">Cordoba<br/>Impacto: Bajo | Prob: Media</div></div>
            </div>
            <div className="risk-matrix-cell rm-green" style={{gridColumn:4,gridRow:3}}></div>
            <div style={{gridColumn:2,gridRow:4}} className="rm-axis-label">Alta</div>
            <div style={{gridColumn:3,gridRow:4}} className="rm-axis-label">Media</div>
            <div style={{gridColumn:4,gridRow:4}} className="rm-axis-label">Baja</div>
          </div>
          <div style={{textAlign:'center',fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--muted)',marginTop:'6px',letterSpacing:'.06em'}}>PROBABILIDAD DE CRISIS</div>
          <div className="rm-legend">
            <div className="rm-legend-item"><div className="rm-legend-swatch" style={{background:'rgba(239,68,68,.3)'}}></div>Riesgo critico</div>
            <div className="rm-legend-item"><div className="rm-legend-swatch" style={{background:'rgba(245,158,11,.25)'}}></div>Riesgo alto</div>
            <div className="rm-legend-item"><div className="rm-legend-swatch" style={{background:'rgba(250,204,21,.25)'}}></div>Riesgo moderado</div>
            <div className="rm-legend-item"><div className="rm-legend-swatch" style={{background:'rgba(16,185,129,.2)'}}></div>Riesgo bajo</div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="progress-timeline anim-fade-up" style={{animationDelay:'.56s'}}>
          <div className="timeline-title">Cronograma de intervenciones</div>
          <div className="timeline-track">
            <div className="timeline-connector"><div className="timeline-connector-fill" style={{width:'40%'}}></div></div>
            {[
              { label: 'Q1 2025', desc: 'Diagnostico y mapeo de actores completado', status: 'completed', icon: <polyline points="20 6 9 17 4 12"/> },
              { label: 'Q3 2025', desc: 'Investigacion primaria Fase II iniciada', status: 'completed', icon: <polyline points="20 6 9 17 4 12"/> },
              { label: 'Q1 2026', desc: 'Pilotos de intervencion en 3 zonas', status: 'in-progress', icon: <circle cx="12" cy="12" r="4"/> },
              { label: 'Q3 2026', desc: 'Escalamiento a zonas restantes', status: 'planned', icon: <circle cx="12" cy="12" r="3"/> },
              { label: 'Q4 2026', desc: 'Evaluacion de impacto y reporte final', status: 'planned', icon: <path d="M12 5v14M5 12h14"/> },
            ].map(n => (
              <div key={n.label} className="timeline-node">
                <div className={`timeline-dot ${n.status}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{n.icon}</svg>
                </div>
                <div className="timeline-label">{n.label}</div>
                <div className="timeline-desc">{n.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Heatmap */}
        <div className="coverage-heatmap anim-fade-up" style={{animationDelay:'.58s'}}>
          <div className="heatmap-title">Mapa de calor — Cobertura por zona y dimension</div>
          <div className="heatmap-container">
            <div className="heatmap-grid" style={{gridTemplateColumns:`100px repeat(${HEATMAP_DIMS.length},1fr)`}}>
              <div className="heatmap-header"></div>
              {HEATMAP_DIMS.map(d => <div key={d} className="heatmap-header">{d}</div>)}
              {HEATMAP_ZONES.map((zone, zi) => (
                <Fragment key={zone}>
                  <div className="heatmap-row-label">{zone}</div>
                  {HEATMAP_VALUES[zi].map((val, di) => (
                    <div key={`${zone}-${di}`} className="heatmap-cell" style={{background: heatColor(val)}}>
                      {val}%
                      <div className="heatmap-cell-tooltip">{zone} · {HEATMAP_DIMS[di]}: {val}%</div>
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
            <div className="heatmap-legend">
              <div className="heatmap-legend-label">100%</div>
              <div className="heatmap-legend-bar"></div>
              <div className="heatmap-legend-label">0%</div>
            </div>
          </div>
        </div>

        {/* Gaps table */}
        <div className="panel anim-fade-up" style={{animationDelay:'.6s'}}>
          <div className="panel-header"><span className="panel-title">Brechas criticas identificadas en zonas prioritarias</span><a className="panel-action" href="/brechas">Ver todas las brechas &rarr;</a></div>
          <div className="panel-body-flush">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Brecha</th><th>Categoria</th><th>Zona(s)</th>
                  <th className="num-col">Severidad</th><th>Afecta mujeres</th><th>Afecta peq. prod.</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{fontWeight:600}}>Ausencia de fondos de capital semilla rurales</td>
                  <td><span className="gap-cat gap-financiamiento">Financiamiento</span></td>
                  <td>La Guajira, Sucre, Morazan</td>
                  <td className="num-col" style={{color:'var(--danger)',fontWeight:700}}>5/5</td>
                  <td>Si</td><td>Si</td>
                </tr>
                <tr>
                  <td style={{fontWeight:600}}>Sin conectividad para adopcion de AgTech</td>
                  <td><span className="gap-cat gap-conectividad">Conectividad</span></td>
                  <td>Alta Verapaz, La Guajira</td>
                  <td className="num-col" style={{color:'var(--danger)',fontWeight:700}}>5/5</td>
                  <td>Si</td><td>Si</td>
                </tr>
                <tr>
                  <td style={{fontWeight:600}}>Baja representacion femenina en liderazgo</td>
                  <td><span className="gap-cat gap-genero">Genero</span></td>
                  <td>Todas las zonas</td>
                  <td className="num-col" style={{color:'var(--danger)',fontWeight:700}}>4/5</td>
                  <td>Si</td><td>&mdash;</td>
                </tr>
                <tr>
                  <td style={{fontWeight:600}}>Talento tecnico insuficiente para startups</td>
                  <td><span className="gap-cat gap-talento">Talento</span></td>
                  <td>Morazan, Magdalena</td>
                  <td className="num-col" style={{color:'var(--warning)',fontWeight:700}}>4/5</td>
                  <td>&mdash;</td><td>&mdash;</td>
                </tr>
                <tr>
                  <td style={{fontWeight:600}}>Acceso limitado a mercados de exportacion</td>
                  <td><span className="gap-cat gap-mercado">Mercado</span></td>
                  <td>Cordoba, Sucre</td>
                  <td className="num-col" style={{color:'var(--warning)',fontWeight:700}}>3/5</td>
                  <td>&mdash;</td><td>Si</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {modalOpen && (
        <div className="zone-compare-modal visible">
          <div className="modal-overlay" onClick={() => setModalOpen(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Comparacion de zonas prioritarias</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Metrica</th>
                  {ZONES.map(z => <th key={z.id}>{z.name}</th>)}
                </tr>
              </thead>
              <tbody>
                {COMPARE_METRICS.map(m => {
                  const vals = ZONES.map(z => (z as any)[m.key] as number)
                  const best = Math.max(...vals)
                  const worst = Math.min(...vals)
                  return (
                    <tr key={m.key}>
                      <td>{m.label}</td>
                      {ZONES.map(z => {
                        const v = (z as any)[m.key] as number
                        const cls = v === best ? 'val-best' : v === worst ? 'val-worst' : ''
                        const sfx = m.key === 'cobertura' ? '%' : ''
                        return <td key={z.id} className={cls}>{v}{sfx}</td>
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppLayout>
  )
}
