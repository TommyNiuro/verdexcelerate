'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'

// ── Counter animation ──────────────────────────────────────────────
function useCountUp(target: number, duration = 1500) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    const start = performance.now()
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 4)
      setValue(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
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

const COUNTRY_DATA = {
  co: { name: 'Colombia',    flag: '🇨🇴', total: 1024, startupPct: 68, investorPct: 15, esoPct: 8 },
  cr: { name: 'Costa Rica',  flag: '🇨🇷', total: 487,  startupPct: 42, investorPct: 12, esoPct: 6 },
  gt: { name: 'Guatemala',   flag: '🇬🇹', total: 389,  startupPct: 30, investorPct: 8,  esoPct: 5 },
  hn: { name: 'Honduras',    flag: '🇭🇳', total: 341,  startupPct: 26, investorPct: 7,  esoPct: 4 },
  sv: { name: 'El Salvador', flag: '🇸🇻', total: 318,  startupPct: 22, investorPct: 6,  esoPct: 3 },
  pa: { name: 'Panama',      flag: '🇵🇦', total: 288,  startupPct: 20, investorPct: 8,  esoPct: 3 },
}
const MAX_TOTAL = 1024

export default function DashboardPage() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [cmdQuery, setCmdQuery] = useState('')
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Hola, soy el asistente IA de VerdeXcelerate. Puedo responder preguntas sobre el ecosistema AgrifoodTech, brechas, actores y cobertura.' },
  ])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setCmdOpen(o => !o)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  function sendChat() {
    if (!chatInput.trim()) return
    const q = chatInput
    setMessages(m => [...m, { role: 'user' as const, text: q }])
    setChatInput('')
    setTimeout(() => {
      setMessages(m => [...m, {
        role: 'bot' as const,
        text: q.toLowerCase().includes('brecha')
          ? 'Hay 38 brechas identificadas. Las mas criticas son financiamiento (12) y conectividad (8), concentradas en La Guajira, Morazan y Alta Verapaz.'
          : q.toLowerCase().includes('colombia')
          ? 'Colombia lidera con 1,024 actores (68% startups). La Guajira y Sucre son zonas prioritarias con baja cobertura (28% y 34%).'
          : 'Base de conocimiento activa: 2,847 actores en 6 paises, $147M rastreados, cobertura digital 78%.',
      }])
    }, 900)
  }

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
          <div className="search-box" tabIndex={0} onClick={() => setCmdOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            Buscar actores, paises...
            <kbd>&#8984;K</kbd>
          </div>
          <div style={{position:'relative'}}>
            <button className="icon-btn" onClick={() => setNotifOpen(o => !o)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
              <span className="notif-dot"></span>
            </button>
            {notifOpen && (
              <div className="notif-panel open">
                <div className="notif-panel-header">
                  <div style={{display:'flex',alignItems:'center',gap:8}}>
                    <span className="notif-panel-title">Notificaciones</span>
                    <span className="notif-panel-count">5</span>
                  </div>
                  <span className="notif-mark-read" onClick={() => setNotifOpen(false)}>Marcar leidas</span>
                </div>
                <div className="notif-list">
                  {[
                    {color:'green',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,text:<><strong>312 actores</strong> clasificados automaticamente por IA</>,time:'hace 2 horas'},
                    {color:'blue',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,text:<>Scraper <strong>F6S</strong> completo: 48 startups nuevas en Costa Rica</>,time:'hace 4 horas'},
                    {color:'amber',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,text:<><strong>23 registros</strong> pendientes de validacion humana (confidence &lt; 0.6)</>,time:'hace 6 horas'},
                    {color:'green',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>,text:<>Pipeline de dedup ejecutado: <strong>17 duplicados</strong> fusionados</>,time:'hace 8 horas'},
                    {color:'blue',icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>,text:<>Autorregistro: <strong>AgroTech SV</strong> solicito inclusion desde El Salvador</>,time:'hace 12 horas'},
                  ].map((n,i) => (
                    <div key={i} className="notif-item unread">
                      <div className={`notif-icon ${n.color}`}>{n.icon}</div>
                      <div className="notif-body"><div className="notif-text">{n.text}</div><div className="notif-time">{n.time}</div></div>
                    </div>
                  ))}
                </div>
                <div className="notif-panel-footer"><a href="/gobernanza">Ver historial completo</a></div>
              </div>
            )}
          </div>
          <button className="icon-btn" onClick={() => window.location.href='/configuracion'}>
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
            <div key={key} className={`chip${activeFilter === key ? ' active' : ''}`} onClick={() => setActiveFilter(key)}>
              {label}
            </div>
          ))}
        </div>

        {/* ── Stats row ── */}
        <div className="stats-row">
          <CountCard
            label="Actores mapeados" target={2847}
            delta="+312 este mes" deltaClass="delta-up" iconClass="teal"
            sparkPath="M0 35 Q10 30 20 28 T40 22 T60 18 T80 10 T100 5"
            sparkFill="M0 35 Q10 30 20 28 T40 22 T60 18 T80 10 T100 5 V40 H0Z"
            sparkColor="var(--accent)"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>}
          />
          <CountCard
            label="Startups AgrifoodTech" target={1243}
            delta="+89 nuevas" deltaClass="delta-up" iconClass="blue"
            sparkPath="M0 30 Q15 28 25 24 T50 20 T75 12 T100 8"
            sparkFill="M0 30 Q15 28 25 24 T50 20 T75 12 T100 8 V40 H0Z"
            sparkColor="#3b82f6"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>}
          />
          <CountCard
            label="Inversion total rastreada" target={147} prefix="$" suffix="M"
            delta="USD acumulado" deltaClass="delta-neutral" iconClass="purple"
            sparkPath="M0 32 Q20 30 30 25 T55 22 T80 15 T100 10"
            sparkFill="M0 32 Q20 30 30 25 T55 22 T80 15 T100 10 V40 H0Z"
            sparkColor="#8b5cf6"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>}
          />
          <CountCard
            label="Cobertura digital" target={78} suffix="%"
            delta="+5pp vs. mes pasado" deltaClass="delta-up" iconClass="amber"
            sparkPath="M0 28 Q10 26 20 24 T45 20 T65 16 T85 12 T100 8"
            sparkFill="M0 28 Q10 26 20 24 T45 20 T65 16 T85 12 T100 8 V40 H0Z"
            sparkColor="#f59e0b"
            icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>}
          />
        </div>

        {/* ── Country chart + Coverage donuts ── */}
        <div className="grid-2-1">
          <div className="panel anim-fade-up delay-5">
            <div className="panel-header">
              <span className="panel-title">Actores por pais</span>
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
                return (
                  <div key={key} className="country-row">
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
              <span className="panel-title">Cobertura digital</span>
              <a href="/brechas" className="panel-action">Memo completo</a>
            </div>
            <div className="panel-body">
              <div className="coverage-grid">
                {[
                  { label: 'Startups',     pct: 82, color: 'var(--accent)' },
                  { label: 'Inversores',   pct: 75, color: 'var(--accent)' },
                  { label: 'ESOs',         pct: 68, color: 'var(--accent)' },
                  { label: 'Asoc. rurales',pct: 41, color: 'var(--warning)' },
                  { label: 'Zonas prior.', pct: 38, color: 'var(--warning)' },
                  { label: 'Lid. femenino',pct: 29, color: 'var(--danger)' },
                ].map(({ label, pct, color }) => {
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
                  <tr><td style={{fontWeight:600}}>🇨🇴 Colombia</td><td><span className="phase-badge phase-maduro">Maduro</span></td><td className="num-col">486</td><td className="num-col">127</td><td className="num-col">18%</td></tr>
                  <tr><td style={{fontWeight:600}}>🇨🇷 Costa Rica</td><td><span className="phase-badge phase-emergente">Emergente</span></td><td className="num-col">198</td><td className="num-col">64</td><td className="num-col">22%</td></tr>
                  <tr><td style={{fontWeight:600}}>🇬🇹 Guatemala</td><td><span className="phase-badge phase-crecimiento">Crecimiento</span></td><td className="num-col">147</td><td className="num-col">38</td><td className="num-col">14%</td></tr>
                  <tr><td style={{fontWeight:600}}>🇭🇳 Honduras</td><td><span className="phase-badge phase-crecimiento">Crecimiento</span></td><td className="num-col">132</td><td className="num-col">29</td><td className="num-col">12%</td></tr>
                  <tr><td style={{fontWeight:600}}>🇸🇻 El Salvador</td><td><span className="phase-badge phase-crecimiento">Crecimiento</span></td><td className="num-col">118</td><td className="num-col">31</td><td className="num-col">16%</td></tr>
                  <tr><td style={{fontWeight:600}}>🇵🇦 Panama</td><td><span className="phase-badge phase-emergente">Emergente</span></td><td className="num-col">162</td><td className="num-col">42</td><td className="num-col">20%</td></tr>
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
                {dot:'dot-green',text:<><strong>312 actores</strong> clasificados automaticamente por Gemini 2.5 Flash</>,time:'hace 2h'},
                {dot:'dot-blue', text:<>Scraper <strong>F6S</strong> completo &mdash; 48 nuevas startups en Costa Rica</>,time:'hace 4h'},
                {dot:'dot-yellow',text:<><strong>23 registros</strong> pendientes de validacion humana (confidence &lt; 0.6)</>,time:'hace 6h'},
                {dot:'dot-green',text:<>Pipeline de dedup ejecutado &mdash; <strong>17 duplicados</strong> fusionados</>,time:'hace 8h'},
                {dot:'dot-blue', text:<>Autorregistro: <strong>AgroTech SV</strong> solicito inclusion desde El Salvador</>,time:'hace 12h'},
                {dot:'dot-green',text:<>Memo de cobertura actualizado &mdash; Chapman N&#770; = 2,980 startups estimadas</>,time:'hace 1d'},
              ].map(({dot,text,time},i) => (
                <div key={i} className="activity-item">
                  <div className={`activity-dot ${dot}`}></div>
                  <div className="activity-text">{text}</div>
                  <div className="activity-time">{time}</div>
                </div>
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
              { cls:'insight-green', icn:'ig', color:'var(--success)',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
                text:<><strong>Colombia</strong> lidera con 36% de actores. Su ecosistema maduro genera efecto de red.</> },
              { cls:'insight-blue', icn:'ib', color:'#3b82f6',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
                text:<><strong>Costa Rica</strong> muestra el mayor crecimiento mensual (+18%). 48 startups nuevas este mes.</> },
              { cls:'insight-amber', icn:'ia', color:'var(--warning)',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
                text:<>Brecha de genero: solo 29% liderazgo femenino. Meta TOR: 40%.</> },
              { cls:'insight-red', icn:'ir', color:'var(--danger)',
                icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>,
                text:<>23 registros con confianza &lt; 0.6 requieren validacion humana urgente.</> },
            ].map(({ cls, icn, icon, text }) => (
              <div key={cls} className={`insight-item ${cls}`}>
                <div className={`insight-icon ${icn}`}>{icon}</div>
                <div className="insight-text">{text}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Pipeline de datos (full width) ── */}
        <div className="pipeline-monitor anim-fade-up" id="pipelineSection">
          <div className="pipeline-header">
            <div className="pipeline-header-title">Pipeline de datos</div>
            <span className="pipeline-timestamp"><span className="live-dot"></span> Ultima ejecucion: hace 2h</span>
          </div>
          <div className="pipeline-flow">
            {([
              { name:'Scraping',        count:48,   status:'running',  label:'Activo'   },
              { name:'Clasificacion IA', count:312,  status:'running',  label:'Activo'   },
              { name:'Deduplicacion',   count:17,   status:'complete', label:'Completo' },
              { name:'Validacion',      count:23,   status:'running',  label:'Activo'   },
              { name:'Publicacion',     count:2847, status:'complete', label:'Completo' },
            ] as const).map(({ name, count, status, label }, i) => (
              <span key={name} style={{display:'contents'}}>
                <div className="pipeline-stage">
                  <div className="pipeline-stage-status">
                    <div className={`status-dot ${status}`}></div>
                    {label}
                  </div>
                  <div className="pipeline-stage-name">{name}</div>
                  <div className="pipeline-stage-count">{count.toLocaleString()}</div>
                </div>
                {i < 4 && (
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
              <span className="panel-title">Metas TOR</span>
              <a href="/brechas" className="panel-action">Ver detalle →</a>
            </div>
            {[
              { label:'Entrevistas realizadas',  fraction:'42 / 60',    pct:70, cls:'fill-green'   },
              { label:'Alianzas formales',        fraction:'3 / 5',      pct:60, cls:'fill-warning' },
              { label:'Cobertura digital',        fraction:'78% / 85%',  pct:92, cls:'fill-green'   },
              { label:'Liderazgo femenino',       fraction:'29% / 40%',  pct:73, cls:'fill-warning' },
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
                    strokeDashoffset={339.292 * (1 - 0.87)}
                  />
                </svg>
                <div className="dq-text">
                  <div className="dq-number">87</div>
                  <div className="dq-label">de 100</div>
                </div>
              </div>
            </div>
            <div className="dq-mini-grid">
              {[
                { label:'Completitud', value:'94%' },
                { label:'Frescura',    value:'82%' },
                { label:'Precision',   value:'91%' },
                { label:'Cobertura',   value:'78%' },
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

      {/* ── AI FAB + Chat ── */}
      <button className={`ai-fab${chatOpen ? ' active' : ''}`} onClick={() => setChatOpen(o => !o)}>
        <div className="ai-fab-badge"></div>
        <svg className="ai-fab-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <svg className="ai-fab-close" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className={`ai-chat${chatOpen ? ' open' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6"><path d="M12 2a7 7 0 017 7c0 3.5-2 6-4 8l-3 3-3-3c-2-2-4-4.5-4-8a7 7 0 017-7z"/><circle cx="12" cy="9" r="2"/></svg>
          </div>
          <div className="ai-chat-header-info">
            <div className="ai-chat-header-name">Asistente VerdeXcelerate</div>
            <div className="ai-chat-header-status">Conectado · base de conocimiento activa</div>
          </div>
          <div className="ai-chat-header-actions">
            <button onClick={() => setChatOpen(false)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div className="ai-chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>
          ))}
        </div>
        <div className="ai-suggestions">
          {['Brechas criticas', 'Colombia vs CR', 'Zonas prioritarias'].map(s => (
            <button key={s} className="ai-suggestion" onClick={() => setChatInput(s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="ai-chat-footer">
          <textarea
            className="ai-chat-input"
            placeholder="Pregunta sobre el ecosistema..."
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat() } }}
            rows={1}
          />
          <button className="ai-chat-send" onClick={sendChat} disabled={!chatInput.trim()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>

      {/* ── Command Palette ── */}
      {cmdOpen && (
        <div className="cmd-overlay open" onClick={(e) => { if (e.target === e.currentTarget) setCmdOpen(false) }}>
          <div className="cmd-box">
            <div className="cmd-input-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input className="cmd-input" type="text" placeholder="Buscar actores, paises, secciones..." autoComplete="off" autoFocus
                value={cmdQuery} onChange={e => setCmdQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') { setCmdOpen(false); setCmdQuery('') } }} />
              <kbd>ESC</kbd>
            </div>
            <div className="cmd-group">
              <div className="cmd-group-label">Navegacion rapida</div>
              {[
                {href:'/dashboard',label:'Dashboard'},
                {href:'/directorio',label:'Directorio de actores'},
                {href:'/mapa',label:'Mapa interactivo'},
                {href:'/pais',label:'Perfiles de pais'},
                {href:'/zonas',label:'Zonas prioritarias'},
                {href:'/brechas',label:'Brechas y retos'},
                {href:'/fuentes',label:'Fuentes de datos'},
                {href:'/gobernanza',label:'Gobernanza IA'},
                {href:'/configuracion',label:'Configuracion'},
              ].filter(i => !cmdQuery || i.label.toLowerCase().includes(cmdQuery.toLowerCase()))
                .map(i => (
                <a key={i.href} className="cmd-item" href={i.href} onClick={() => setCmdOpen(false)}>
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
      )}
    </AppLayout>
  )
}
