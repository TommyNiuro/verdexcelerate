'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { getDashboardStats, getRegionalKpis, getDataQuality, getBenchmarks } from '@/lib/queries'

// ── Counter animation ──────────────────────────────────────────────
function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    let raf = 0
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(ease * target))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return value
}

function CountCard({
  label, target, prefix = '', suffix = '', delta, deltaClass, iconClass, sparkPath, sparkFill, sparkColor, icon,
}: {
  label: string; target: number; prefix?: string; suffix?: string
  delta: string; deltaClass: string; iconClass: string
  sparkPath: string; sparkFill: string; sparkColor: string; icon: React.ReactNode
}) {
  const value = useCountUp(target)
  return (
    <div className="stat-card anim-fade-up delay-1">
      <div className={`stat-card-icon ${iconClass}`}>{icon}</div>
      <div className="stat-card-label">{label}</div>
      <div className="stat-card-value">{prefix}{value.toLocaleString()}{suffix}</div>
      <span className={`stat-card-delta ${deltaClass}`}>{delta}</span>
      <svg className="stat-sparkline" width="100" height="40" viewBox="0 0 100 40">
        <path d={sparkPath} fill="none" stroke={sparkColor} strokeWidth="2" opacity=".3"/>
        <path d={sparkFill} fill={sparkColor} opacity=".06"/>
      </svg>
    </div>
  )
}

const COUNTRIES_ORDER = ['co', 'cr', 'gt', 'hn', 'sv', 'pa'] as const
type CountryKey = typeof COUNTRIES_ORDER[number]

type CountryDatum = {
  name: string; flag: string; total: number
  startupPct: number; investorPct: number; esoPct: number
  startups: number; investors: number; esos: number; femLead: number
  phase: string; phaseCls: string; inversionM: number; cobertura: number
}

const PHASE_LABEL: Record<string, { phase: string; phaseCls: string }> = {
  maduro: { phase: 'Maduro', phaseCls: 'phase-maduro' },
  emergente: { phase: 'Emergente', phaseCls: 'phase-emergente' },
  crecimiento: { phase: 'Crecimiento', phaseCls: 'phase-crecimiento' },
}
const FLAG: Record<CountryKey, string> = { co:'🇨🇴', cr:'🇨🇷', gt:'🇬🇹', hn:'🇭🇳', sv:'🇸🇻', pa:'🇵🇦' }
const NAME: Record<CountryKey, string> = { co:'Colombia', cr:'Costa Rica', gt:'Guatemala', hn:'Honduras', sv:'El Salvador', pa:'Panama' }
const PHASE_BY_KEY: Record<CountryKey, string> = { co:'maduro', cr:'emergente', gt:'crecimiento', hn:'crecimiento', sv:'crecimiento', pa:'emergente' }

// Estado inicial vacio (se llena con datos reales de Supabase en el efecto)
const COUNTRY_INIT: Record<CountryKey, CountryDatum> = Object.fromEntries(
  COUNTRIES_ORDER.map(k => [k, {
    name: NAME[k], flag: FLAG[k], total: 0, startupPct: 0, investorPct: 0, esoPct: 0,
    startups: 0, investors: 0, esos: 0, femLead: 0, ...PHASE_LABEL[PHASE_BY_KEY[k]], inversionM: 0, cobertura: 0,
  }])
) as Record<CountryKey, CountryDatum>

const REGIONAL_INIT = { actores: 0, startups: 0, inversion: 0, cobertura: 0 }

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | CountryKey>('all')
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifRead, setNotifRead] = useState(false)
  const [COUNTRY_DATA, setCountryData] = useState(COUNTRY_INIT)
  const [REGIONAL, setRegional] = useState(REGIONAL_INIT)
  const [dq, setDq] = useState({ score: 0, total: 0, completeness: 0, freshness: 0, avgConfidence: 0, validatedPct: 0, womenPct: 0 })
  const [coverage, setCoverage] = useState([
    { label: 'Completitud', pct: 0, color: 'var(--accent)' },
    { label: 'Validado', pct: 0, color: 'var(--accent)' },
    { label: 'Con website', pct: 0, color: 'var(--accent)' },
    { label: 'Con cadena', pct: 0, color: 'var(--warning)' },
    { label: 'Confianza', pct: 0, color: 'var(--accent)' },
    { label: 'Lid. femenino', pct: 0, color: 'var(--danger)' },
  ])

  // Carga de datos reales desde Supabase
  useEffect(() => {
    const isoKey: Record<string, CountryKey> = { CO: 'co', CR: 'cr', GT: 'gt', HN: 'hn', SV: 'sv', PA: 'pa' }
    const cidByKey: Record<CountryKey, number> = { co: 1, cr: 2, sv: 3, gt: 4, hn: 5, pa: 6 }
    Promise.all([getDashboardStats(), getRegionalKpis(), getDataQuality(), getBenchmarks({ metric: 'inversion_agrifoodtech' })])
      .then(([ds, kpi, dq, inv]) => {
        const next: Record<CountryKey, CountryDatum> = { ...COUNTRY_INIT }
        const regionalTotal = kpi.total || 1
        const invByCountry: Record<number, number> = {}
        for (const b of inv) if (b.country_id && b.value != null) invByCountry[b.country_id] = Number(b.value)
        for (const row of ds) {
          const k = isoKey[(row as any).iso2]; if (!k) continue
          const total = (row as any).total || 0
          next[k] = {
            ...next[k], total, startups: (row as any).startups, investors: (row as any).inversores, esos: (row as any).esos,
            startupPct: total ? Math.round((row as any).startups / total * 100) : 0,
            investorPct: total ? Math.round((row as any).inversores / total * 100) : 0,
            esoPct: total ? Math.round((row as any).esos / total * 100) : 0,
            femLead: total ? Math.round((row as any).lideradas_mujer / total * 100) : 0,
            inversionM: invByCountry[cidByKey[k]] || 0,
            cobertura: Math.round(total / regionalTotal * 100),
          }
        }
        setCountryData(next)
        const regionalInv = inv.find(b => b.country_id == null)?.value
        setRegional({ actores: kpi.total, startups: kpi.startups, inversion: regionalInv ? Math.round(Number(regionalInv)) : 0, cobertura: dq.completeness })
        setDq({
          score: Math.round((dq.completeness + dq.validatedPct + dq.freshness + dq.avgConfidence) / 4),
          total: dq.total, completeness: dq.completeness, freshness: dq.freshness,
          avgConfidence: dq.avgConfidence, validatedPct: dq.validatedPct, womenPct: dq.womenPct,
        })
        setCoverage([
          { label: 'Completitud', pct: dq.completeness, color: 'var(--accent)' },
          { label: 'Validado', pct: dq.validatedPct, color: 'var(--accent)' },
          { label: 'Con website', pct: dq.websitePct, color: 'var(--accent)' },
          { label: 'Con cadena', pct: dq.chainPct, color: 'var(--warning)' },
          { label: 'Confianza', pct: dq.avgConfidence, color: 'var(--accent)' },
          { label: 'Lid. femenino', pct: dq.womenPct, color: 'var(--danger)' },
        ])
      }).catch(() => {})
  }, [])

  const MAX_TOTAL = Math.max(...COUNTRIES_ORDER.map(k => COUNTRY_DATA[k].total), 1)

  const view = activeFilter === 'all' ? null : COUNTRY_DATA[activeFilter]
  const stats = view
    ? { actores: view.total, startups: view.startups, inversion: view.inversionM, cobertura: view.cobertura }
    : REGIONAL

  const cards = [
    {
      label: 'Actores mapeados', target: stats.actores,
      delta: view ? `${view.flag} ${view.name}` : 'en 6 paises',
      deltaClass: 'delta-neutral', iconClass: 'teal',
      sparkPath: 'M0 35 Q10 30 20 28 T40 22 T60 18 T80 10 T100 5',
      sparkFill: 'M0 35 Q10 30 20 28 T40 22 T60 18 T80 10 T100 5 V40 H0Z',
      sparkColor: 'var(--accent)',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    },
    {
      label: 'Startups AgrifoodTech', target: stats.startups,
      delta: view ? `${view.phase}` : 'del dataset',
      deltaClass: 'delta-neutral', iconClass: 'blue',
      sparkPath: 'M0 30 Q15 28 25 24 T50 20 T75 12 T100 8',
      sparkFill: 'M0 30 Q15 28 25 24 T50 20 T75 12 T100 8 V40 H0Z',
      sparkColor: '#3b82f6',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    },
    {
      label: view ? 'Inversion AgriFoodTech' : 'Inversion AgriFoodTech LATAM', target: stats.inversion, prefix: '$', suffix: 'M',
      delta: view ? 'benchmark externo' : 'AgFunder, 2022 (LATAM)', deltaClass: 'delta-neutral', iconClass: 'purple',
      sparkPath: 'M0 32 Q20 30 30 25 T55 22 T80 15 T100 10',
      sparkFill: 'M0 32 Q20 30 30 25 T55 22 T80 15 T100 10 V40 H0Z',
      sparkColor: '#8b5cf6',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    },
    {
      label: view ? 'Participacion regional' : 'Completitud de datos', target: stats.cobertura, suffix: '%',
      delta: view ? 'del total mapeado' : 'calidad del dataset',
      deltaClass: 'delta-neutral', iconClass: 'amber',
      sparkPath: 'M0 28 Q10 26 20 24 T45 20 T65 16 T85 12 T100 8',
      sparkFill: 'M0 28 Q10 26 20 24 T45 20 T65 16 T85 12 T100 8 V40 H0Z',
      sparkColor: '#f59e0b',
      icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    },
  ]

  // Rows visible in chart/table according to filter
  const visibleCountries = activeFilter === 'all' ? COUNTRIES_ORDER : [activeFilter]

  return (
    <AppLayout title="Dashboard comparativo">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="topbar-left">
          <div>
            <div className="breadcrumb">
              <a href="/dashboard">VerdeXcelerate</a>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              <span>Dashboard regional</span>
            </div>
            <h1>Dashboard comparativo</h1>
          </div>
        </div>
        <div className="topbar-right">
          <div className="topbar-live">
            <span className="live-dot"></span>
            <span>En vivo</span>&nbsp;&mdash; pipeline activo
          </div>
          <div className="search-box" tabIndex={0} role="button"
            onClick={() => window.dispatchEvent(new Event('verdex:cmdk'))}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') window.dispatchEvent(new Event('verdex:cmdk')) }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Buscar actores, paises...
            <kbd>&#8984;K</kbd>
          </div>
          <div style={{position:'relative'}}>
            <button className="icon-btn" onClick={() => setNotifOpen(o => !o)} aria-label="Notificaciones">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              {!notifRead && <span className="notif-dot"></span>}
            </button>
            {notifOpen && (
              <div className="notif-panel open">
                <div className="notif-panel-header">
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className="notif-panel-title">Notificaciones</span>
                    {!notifRead && <span className="notif-panel-count">5</span>}
                  </div>
                  <span className="notif-mark-read" style={{cursor:'pointer'}} onClick={() => setNotifRead(true)}>Marcar leidas</span>
                </div>
                <div className="notif-list">
                  {[
                    {color:'green',href:'/gobernanza',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,text:<><strong>312 actores</strong> clasificados automaticamente por IA</>,time:'hace 2 horas'},
                    {color:'blue',href:'/fuentes',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,text:<>Scraper <strong>F6S</strong> completo: 48 startups nuevas en Costa Rica</>,time:'hace 4 horas'},
                    {color:'amber',href:'/gobernanza',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,text:<><strong>23 registros</strong> pendientes de validacion humana (confidence &lt; 0.6)</>,time:'hace 6 horas'},
                    {color:'green',href:'/fuentes',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,text:<>Pipeline de dedup ejecutado: <strong>17 duplicados</strong> fusionados</>,time:'hace 8 horas'},
                    {color:'blue',href:'/configuracion',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,text:<>Autorregistro: <strong>AgroTech SV</strong> solicito inclusion desde El Salvador</>,time:'hace 12 horas'},
                  ].map((n,i) => (
                    <a key={i} href={n.href} className={`notif-item${notifRead ? '' : ' unread'}`} style={{textDecoration:'none',color:'inherit',cursor:'pointer'}} onClick={() => setNotifOpen(false)}>
                      <div className={`notif-icon ${n.color}`}>{n.icon}</div>
                      <div className="notif-body"><div className="notif-text">{n.text}</div><div className="notif-time">{n.time}</div></div>
                    </a>
                  ))}
                </div>
                <div className="notif-panel-footer"><a href="/gobernanza">Ver historial completo</a></div>
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={() => window.location.href='/configuracion'} aria-label="Exportar / configuracion" title="Exportar datos">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          </button>
        </div>
      </header>

      <div className="content">
        {/* ── Filter chips ── */}
        <div className="filter-bar anim-fade-up">
          {[
            { key: 'all', label: 'Todos los paises' },
            { key: 'co',  label: '🇨🇴 Colombia' },
            { key: 'cr',  label: '🇨🇷 Costa Rica' },
            { key: 'sv',  label: '🇸🇻 El Salvador' },
            { key: 'gt',  label: '🇬🇹 Guatemala' },
            { key: 'hn',  label: '🇭🇳 Honduras' },
            { key: 'pa',  label: '🇵🇦 Panama' },
          ].map(({ key, label }) => (
            <div key={key} className={`chip${activeFilter === key ? ' active' : ''}`} onClick={() => setActiveFilter(key as 'all' | CountryKey)}>
              {label}
            </div>
          ))}
          {activeFilter !== 'all' && (
            <div className="chip" style={{marginLeft:'auto',color:'var(--accent)'}} onClick={() => setActiveFilter('all')}>
              ✕ Limpiar filtro
            </div>
          )}
        </div>

        {/* ── Stats row ── */}
        <div className="stats-row">
          {cards.map((c) => (
            <CountCard
              key={c.label + activeFilter}
              label={c.label} target={c.target} prefix={c.prefix} suffix={c.suffix}
              delta={c.delta} deltaClass={c.deltaClass} iconClass={c.iconClass}
              sparkPath={c.sparkPath} sparkFill={c.sparkFill} sparkColor={c.sparkColor} icon={c.icon}
            />
          ))}
        </div>

        {/* ── Country chart + Coverage donuts ── */}
        <div className="grid-2-1">
          <div className="panel anim-fade-up delay-5">
            <div className="panel-header">
              <span className="panel-title">Actores por pais{view ? ` · ${view.name}` : ''}</span>
              <div className="legend">
                <div className="legend-item"><div className="legend-dot" style={{background:'linear-gradient(135deg,var(--accent),var(--accent-light))'}}></div> Startups</div>
                <div className="legend-item"><div className="legend-dot" style={{background:'rgba(27,42,74,.6)'}}></div> Inversores</div>
                <div className="legend-item"><div className="legend-dot" style={{background:'rgba(27,42,74,.25)'}}></div> ESOs</div>
              </div>
            </div>
            <div className="panel-body-flush">
              {COUNTRIES_ORDER.map((key) => {
                const c = COUNTRY_DATA[key]
                const totalPct = c.total / MAX_TOTAL
                const sw = (c.startupPct  * totalPct).toFixed(1) + '%'
                const iw = (c.investorPct * totalPct).toFixed(1) + '%'
                const ew = (c.esoPct      * totalPct).toFixed(1) + '%'
                const dimmed = activeFilter !== 'all' && activeFilter !== key
                return (
                  <div
                    key={key}
                    className={`country-row${activeFilter === key ? ' is-active' : ''}`}
                    style={{ cursor:'pointer', opacity: dimmed ? 0.3 : 1, transition:'opacity .25s' }}
                    onClick={() => setActiveFilter(activeFilter === key ? 'all' : key)}
                    title={`Filtrar por ${c.name}`}
                  >
                    <div className="flag">
                      <span className="flag-emoji">{c.flag}</span>
                      {c.name}
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill bar-startups"  style={{width: sw}}></div>
                      <div className="bar-fill bar-investors" style={{width: iw}}></div>
                      <div className="bar-fill bar-esos"      style={{width: ew}}></div>
                    </div>
                    <div className="num">{c.total.toLocaleString()}</div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="panel anim-fade-up delay-6">
            <div className="panel-header">
              <span className="panel-title">Calidad del dataset</span>
              <a href="/gobernanza" className="panel-action">Gobernanza</a>
            </div>
            <div className="panel-body">
              <div className="coverage-grid">
                {coverage.map(({ label, pct, color }) => {
                  const circ = 97.5
                  const offset = circ - (circ * pct / 100)
                  return (
                    <div key={label} className="coverage-item">
                      <div className="donut-wrap">
                        <svg viewBox="0 0 36 36" style={{transform:'rotate(-90deg)'}}>
                          <circle className="track" cx="18" cy="18" r="15.5" stroke="var(--bg)" strokeWidth="3" fill="none"/>
                          <circle
                            className="fill" cx="18" cy="18" r="15.5"
                            fill="none" stroke={color} strokeWidth="3" strokeLinecap="round"
                            strokeDasharray={circ} strokeDashoffset={offset}
                          />
                        </svg>
                        <div className="donut-text" style={{color}}>{pct}%</div>
                      </div>
                      <div className="coverage-label">{label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Ecosistemas table + Activity feed ── */}
        <div className="grid-1-1">
          <div className="panel anim-fade-up delay-7">
            <div className="panel-header">
              <span className="panel-title">Ecosistemas por pais</span>
              <a href="/pais" className="panel-action">Ver perfiles →</a>
            </div>
            <div className="panel-body-flush">
              <table className="data-table">
                <thead><tr><th>Pais</th><th>Fase</th><th className="num-col">Startups</th><th className="num-col">Inv.</th><th className="num-col">Lid. fem.</th></tr></thead>
                <tbody>
                  {visibleCountries.map((key) => {
                    const c = COUNTRY_DATA[key]
                    return (
                      <tr key={key} style={{cursor:'pointer'}} title={`Ver perfil de ${c.name}`}
                        onClick={() => window.location.href='/pais'}>
                        <td style={{fontWeight:600}}>{c.flag} {c.name}</td>
                        <td><span className={`phase-badge ${c.phaseCls}`}>{c.phase}</span></td>
                        <td className="num-col">{c.startups}</td>
                        <td className="num-col">{c.investors}</td>
                        <td className="num-col">{c.femLead}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="panel anim-fade-up delay-8">
            <div className="panel-header">
              <span className="panel-title">Actividad reciente</span>
              <a href="/fuentes" className="panel-action">Ver todo →</a>
            </div>
            <div className="panel-body-flush">
              {[
                {dot:'dot-green',href:'/directorio',text:<><strong>{REGIONAL.actores} actores</strong> reales mapeados en los 6 paises</>,time:'dataset'},
                {dot:'dot-blue', href:'/fuentes',text:<><strong>11 fuentes</strong> de datos documentadas (Crunchbase, Dealroom, IDB, LinkedIn y mas)</>,time:'fuentes'},
                {dot:'dot-green',href:'/directorio',text:<>Cada actor incluye su <strong>fuente de origen</strong> y nivel de confianza</>,time:'trazabilidad'},
                {dot:'dot-blue', href:'/pais',text:<><strong>Colombia</strong> concentra el mayor numero de actores ({COUNTRY_DATA.co.total})</>,time:'cobertura'},
                {dot:'dot-yellow',href:'/brechas',text:<>Inversion AgrifoodTech LATAM 2022: <strong>USD 1.7B</strong> (AgFunder)</>,time:'benchmark'},
                {dot:'dot-green',href:'/gobernanza',text:<>Dataset validado por humano y con cadenas de valor asignadas</>,time:'calidad'},
              ].map(({dot,href,text,time},i) => (
                <a key={i} href={href} className="activity-item" style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>
                  <div className={`activity-dot ${dot}`}></div>
                  <div className="activity-text">{text}</div>
                  <div className="activity-time">{time}</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Insights IA (full width) ── */}
        <div className="insights-panel anim-fade-up delay-4" id="insightsSection">
          <div className="insights-title">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l1.09 3.26L16.36 6l-2.6 2.09L14.54 12 12 9.72 9.46 12l.78-3.91L7.64 6l3.27-.74L12 2z"/><path d="M5 16l.55 1.64L7.18 18l-1.3 1.04.39 1.96L5 20.1l-1.27.9.39-1.96L2.82 18l1.63-.36L5 16z"/><path d="M19 16l.55 1.64 1.63.36-1.3 1.04.39 1.96-1.27-.9-1.27.9.39-1.96-1.3-1.04 1.63-.36L19 16z"/></svg>
            Insights IA
          </div>
          <div className="insights-grid">
            {[
              { cls:'insight-green', icn:'ig', href:'/pais',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
                text:<><strong>Colombia</strong> lidera el mapeo con {COUNTRY_DATA.co.total} actores. Su ecosistema maduro genera efecto de red.</> },
              { cls:'insight-blue', icn:'ib', href:'/pais',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                text:<><strong>Costa Rica</strong> es el segundo ecosistema mejor cubierto ({COUNTRY_DATA.cr.total} actores), con base agroindustrial exportadora.</> },
              { cls:'insight-amber', icn:'ia', href:'/brechas',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                text:<>Brecha de genero: solo 16% de los deals VC de LATAM van a startups lideradas por mujeres (LAVCA, 2025). Meta del programa: 40%.</> },
              { cls:'insight-red', icn:'ir', href:'/gobernanza',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
                text:<>Cada actor del directorio incluye su fuente y nivel de confianza, trazables en Gobernanza.</> },
            ].map(({ cls, icn, icon, text, href }) => (
              <a key={cls} href={href} className={`insight-item ${cls}`} style={{textDecoration:'none',color:'inherit',cursor:'pointer'}}>
                <div className={`insight-icon ${icn}`}>{icon}</div>
                <div className="insight-text">{text}</div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Pipeline de datos (full width) ── */}
        <div className="pipeline-monitor anim-fade-up" id="pipelineSection">
          <div className="pipeline-header">
            <div className="pipeline-header-title">Pipeline de datos</div>
            <span className="pipeline-timestamp"><span className="live-dot"></span> Flujo de captura a publicacion</span>
          </div>
          <div className="pipeline-flow">
            {([
              { name:'Captura (fuentes)', count:11,              status:'complete', label:'11 fuentes', href:'/fuentes' },
              { name:'Clasificacion',     count:REGIONAL.actores, status:'complete', label:'Completo',  href:'/gobernanza' },
              { name:'Validacion humana', count:REGIONAL.actores, status:'complete', label:'Completo',  href:'/gobernanza' },
              { name:'Publicacion',       count:REGIONAL.actores, status:'complete', label:'Completo',  href:'/directorio' },
            ] as const).map(({ name, count, status, label, href }, i) => (
              <span key={name} style={{display:'contents'}}>
                <a className="pipeline-stage" href={href} style={{textDecoration:'none',color:'inherit',cursor:'pointer'}} title={`Ir a ${name}`}>
                  <div className="pipeline-stage-status">
                    <div className={`status-dot ${status}`}></div>
                    {label}
                  </div>
                  <div className="pipeline-stage-name">{name}</div>
                  <div className="pipeline-stage-count">{count.toLocaleString()}</div>
                </a>
                {i < 3 && (
                  <div className="pipeline-arrow">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* ── TOR Goals + DQ Score ── */}
        <div className="grid-1-1">
          <div className="tor-goals panel anim-fade-up delay-2">
            <div className="panel-header">
              <span className="panel-title">Metas del programa</span>
              <a href="/brechas" className="panel-action">Ver detalle →</a>
            </div>
            {[
              { label:'Actores mapeados',     fraction:`${REGIONAL.actores} / 200`,        pct: Math.min(Math.round(REGIONAL.actores / 200 * 100), 100), cls:'fill-green'   },
              { label:'Paises cubiertos',      fraction:'6 / 6',                            pct:100, cls:'fill-green'   },
              { label:'Completitud de datos',  fraction:`${dq.completeness}% / 90%`,        pct: Math.min(Math.round(dq.completeness / 90 * 100), 100), cls:'fill-warning' },
              { label:'Liderazgo femenino',    fraction:`${dq.womenPct}% / 40%`,            pct: Math.min(Math.round(dq.womenPct / 40 * 100), 100), cls:'fill-warning' },
            ].map(({ label, fraction, pct, cls }) => (
              <div key={label} className="tor-goal-item">
                <div className="tor-goal-top">
                  <div className="tor-goal-label">{label}</div>
                  <div className="tor-goal-fraction">{fraction}</div>
                </div>
                <div className="tor-goal-bar">
                  <div className={`tor-goal-fill ${cls}`} style={{width: pct + '%'}}></div>
                </div>
                <div className="tor-goal-pct">{pct}%</div>
              </div>
            ))}
          </div>

          <div className="dq-score panel anim-fade-up delay-3">
            <div className="panel-header">
              <span className="panel-title">Calidad de datos</span>
              <a href="/gobernanza" className="panel-action">Gobernanza →</a>
            </div>
            <div className="dq-gauge-wrap">
              <div className="dq-gauge">
                <svg viewBox="0 0 120 120" style={{transform:'rotate(-90deg)'}}>
                  <circle className="dq-track" cx="60" cy="60" r="54" stroke="var(--bg)" strokeWidth="8" fill="none"/>
                  <circle
                    className="dq-fill" cx="60" cy="60" r="54"
                    fill="none" stroke="var(--success)" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={339.292}
                    strokeDashoffset={339.292 * (1 - dq.score / 100)}
                  />
                </svg>
                <div className="dq-text">
                  <div className="dq-number">{dq.score}</div>
                  <div className="dq-label">de 100</div>
                </div>
              </div>
            </div>
            <div className="dq-mini-grid">
              {[
                { label:'Completitud', value:`${dq.completeness}%` },
                { label:'Frescura',    value:`${dq.freshness}%` },
                { label:'Confianza',   value:`${dq.avgConfidence}%` },
                { label:'Validado',    value:`${dq.validatedPct}%` },
              ].map(({ label, value }) => (
                <div key={label} className="dq-mini">
                  <div className="dq-mini-value">{value}</div>
                  <div className="dq-mini-label">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Quick bar ── */}
        <div className="quick-bar">
          <button className="quick-bar-btn primary" onClick={() => window.location.href='/directorio'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>Actor</span>
          </button>
          <div className="quick-bar-divider"></div>
          <button className="quick-bar-btn" onClick={() => window.location.href='/configuracion'}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>Exportar</span>
          </button>
          <div className="quick-bar-divider"></div>
          <button className="quick-bar-btn" onClick={() => document.getElementById('pipelineSection')?.scrollIntoView({behavior:'smooth',block:'center'})}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span>Pipeline</span>
          </button>
          <div className="quick-bar-divider"></div>
          <button className="quick-bar-btn" onClick={() => document.getElementById('insightsSection')?.scrollIntoView({behavior:'smooth',block:'center'})}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2l1.09 3.26L16.36 6l-2.6 2.09L14.54 12 12 9.72 9.46 12l.78-3.91L7.64 6l3.27-.74L12 2z"/></svg>
            <span>Insights</span>
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
