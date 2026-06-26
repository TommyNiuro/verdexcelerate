'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'

type FuentesTab = 'todas' | 'entrevistas' | 'bases' | 'encuestas' | 'cronograma'

const SOURCES = [
  { type:'entrevista', title:'Entrevistas a startups AgriTech - Colombia', desc:'Entrevistas semi-estructuradas a 12 startups AgriTech en Bogota, Medellin y Cali. Cobertura de 5 cadenas de valor.', date:'Mar 2026', actors:'12 actores', flag:'🇨🇴', country:'Colombia', prog:100, status:'active', statusLabel:'Completada' },
  { type:'entrevista', title:'Entrevistas a inversores - Regional', desc:'Entrevistas a fondos de inversion y angel investors con tesis AgriTech en Centroamerica y Colombia.', date:'Abr-Jun 2026', actors:'8/15 actores', flag:'🌎', country:'Regional', prog:53, status:'active', statusLabel:'En curso' },
  { type:'entrevista', title:'Entrevistas ESOs Centroamerica', desc:'Entrevistas a Organizaciones de Apoyo a Emprendedores en El Salvador, Guatemala y Honduras, con foco en AgriTech y economia rural.', date:'May 2026', actors:'19/32 actores', flag:'🌎', country:'CA', prog:59, status:'active', statusLabel:'En curso' },
  { type:'bd', title:'Crunchbase Pro - AgriTech LATAM', desc:'Datos de startups, rondas de financiamiento, inversores y adquisiciones en el sector AgriTech para la region.', date:'Diario', actors:'1,245 registros', flag:'', country:'API sync cada 24h', prog:94, status:'active', statusLabel:'Activa' },
  { type:'bd', title:'LAVCA Venture Data', desc:'Datos de venture capital en LATAM con enfoque en sectores de innovacion agricola y tecnologia climatica.', date:'Mensual', actors:'856 registros', flag:'', country:'Actualizada mensualmente', prog:91, status:'active', statusLabel:'Activa' },
  { type:'encuesta', title:'Encuesta ecosistema AgriTech 2026', desc:'Encuesta regional a startups, ESOs, inversores y corporativos sobre el estado del ecosistema en los 6 paises objetivo.', date:'Ene-Mar 2026', actors:'324 respuestas', flag:'🌎', country:'6 paises', prog:78, status:'pending', statusLabel:'En proceso' },
  { type:'web', title:'LinkedIn AgriTech LATAM', desc:'Monitoreo semanal de perfiles y publicaciones de startups, inversores y organizaciones AgriTech en la region.', date:'Semanal', actors:'450+ perfiles', flag:'', country:'87% precision', prog:87, status:'active', statusLabel:'Activa' },
  { type:'oficial', title:'Registros mercantiles - 6 paises', desc:'Consulta de registros oficiales de empresas en Colombia, Costa Rica, Guatemala, Honduras, El Salvador y Panama.', date:'Mensual', actors:'Fuente primaria', flag:'🌎', country:'CO/CR/GT/HN/SV/PA', prog:72, status:'active', statusLabel:'Activa' },
  { type:'ai', title:'AI News Tracker AgriTech', desc:'Monitoreo automatico de noticias, press releases y publicaciones de investigacion sobre AgriTech en la region mediante NLP.', date:'Tiempo real', actors:'154 alertas/sem', flag:'', country:'NLP', prog:100, status:'active', statusLabel:'Activa 24/7' },
]

const SYNC_ITEMS = [
  { icon:'#6366f1', name:'Crunchbase Pro', time:'Hace 2h', st:'synced', next:'en 22h' },
  { icon:'#ec4899', name:'Encuesta ESOs', time:'Hace 5h', st:'synced', next:'en 19h' },
  { icon:'var(--warning)', name:'LAVCA Venture', time:'Hace 1d', st:'synced', next:'en 6d' },
  { icon:'#8b5cf6', name:'AI News Tracker', time:'Hace 3min', st:'syncing', next:'tiempo real' },
  { icon:'var(--danger)', name:'Registros mercantiles', time:'Hace 2d', st:'error', next:'reintentar' },
  { icon:'var(--accent)', name:'LinkedIn Scraper', time:'Hace 18h', st:'synced', next:'en 6h' },
]

const GANTT_ROWS = [
  { label:'Entrevistas CO', color:'linear-gradient(90deg,#6366f1,#818cf8)', start:0, span:4 },
  { label:'Entrevistas CA', color:'linear-gradient(90deg,#6366f1,#818cf8)', start:2, span:5 },
  { label:'Crunchbase Pro', color:'linear-gradient(90deg,var(--accent),var(--accent-light))', start:0, span:12 },
  { label:'LAVCA Venture', color:'linear-gradient(90deg,var(--accent),var(--accent-light))', start:0, span:12 },
  { label:'Encuesta ESOs', color:'linear-gradient(90deg,#ec4899,#f472b6)', start:0, span:3 },
  { label:'LinkedIn Scraper', color:'linear-gradient(90deg,var(--warning),#fbbf24)', start:0, span:12 },
  { label:'AI Monitoring', color:'linear-gradient(90deg,#8b5cf6,#a78bfa)', start:0, span:12 },
  { label:'Registros ofic.', color:'linear-gradient(90deg,#ef4444,#f87171)', start:0, span:12 },
]

const COVERAGE = {
  dims: ['Startups','Inversion','ESOs','Corporativos','Gobierno'],
  rows: [
    { flag:'🇨🇴', name:'Colombia', vals:[95,88,72,65,45] },
    { flag:'🇨🇷', name:'Costa Rica', vals:[88,82,80,70,55] },
    { flag:'🇸🇻', name:'El Salvador', vals:[68,45,62,40,30] },
    { flag:'🇬🇹', name:'Guatemala', vals:[72,52,58,45,35] },
    { flag:'🇭🇳', name:'Honduras', vals:[60,38,48,35,22] },
    { flag:'🇵🇦', name:'Panama', vals:[78,70,65,60,50] },
  ]
}

function coverageColor(v: number) {
  if (v < 30) return '#fee2e2'
  if (v < 50) return '#fbbf24'
  if (v < 70) return '#86efac'
  if (v < 85) return '#10b981'
  return '#047857'
}

const MONTHS = ['E','F','M','A','M','J','J','A','S','O','N','D']

export default function FuentesPage() {
  const [tab, setTab] = useState<FuentesTab>('todas')
  const [filter, setFilter] = useState('all')

  const filtered = SOURCES.filter(s => filter === 'all' || s.type === filter)
  const entrevistas = SOURCES.filter(s => s.type === 'entrevista')
  const bases = SOURCES.filter(s => s.type === 'bd')
  const encuestas = SOURCES.filter(s => s.type === 'encuesta')

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Fuentes de datos</span>
          </div>
          <h1>Fuentes de datos</h1>
        </div>
        <button className="btn-add">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar fuente
        </button>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Gestion integral de fuentes</h2>
          <p>Rastreo y validacion de todas las fuentes de datos del mapeo: entrevistas (60 planificadas en 6 paises), bases de datos externas, encuestas, scraping web y fuentes gubernamentales oficiales. Cada dato trazable a su origen.</p>
        </div>

        {/* Stats */}
        <div className="stats-row anim-fade-up delay-1">
          {[
            { icon: <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>, iconBg:'rgba(99,102,241,.1)', iconClr:'#6366f1', label:'Entrevistas realizadas', val:'47/60', sub:'78% completado', clr:'#6366f1' },
            { icon: <><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></>, iconBg:'var(--accent-soft)', iconClr:'var(--accent)', label:'Bases de datos', val:'18', sub:'12 activas, 6 pendientes', clr:'var(--accent)' },
            { icon: <><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></>, iconBg:'rgba(236,72,153,.1)', iconClr:'#ec4899', label:'Encuestas', val:'324', sub:'respuestas recopiladas', clr:'#ec4899' },
            { icon: <><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></>, iconBg:'rgba(139,92,246,.1)', iconClr:'#8b5cf6', label:'Fuentes IA/scraping', val:'9', sub:'monitoreando activamente', clr:'#8b5cf6' },
          ].map(s => (
            <div key={s.label} className="stat-card">
              <div className="stat-icon" style={{background:s.iconBg,color:s.iconClr}}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{s.icon}</svg>
              </div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-val" style={{color:s.clr}}>{s.val}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="panel anim-fade-up delay-2">
          <div className="panel-header"><span className="panel-title">Pipeline de procesamiento de datos</span><span style={{fontSize:'12px',color:'var(--muted)'}}>Actualizado hace 2h</span></div>
          <div style={{padding:'20px 24px'}}>
            <div className="pipeline">
              {[['156','Recopilados'],['134','Validados'],['118','Procesados'],['95','Integrados'],['87','Publicados']].map(([n,l]) => (
                <div key={l} className="pipeline-stage"><div className="pipeline-num">{n}</div><div className="pipeline-label">{l}</div></div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 1: Data Lineage */}
        <div className="data-lineage anim-fade-up delay-2">
          <h3 className="data-lineage-title">Linaje de datos</h3>
          <p className="data-lineage-sub">Flujo de datos desde la recopilacion hasta la visualizacion final en el dashboard.</p>
          <div className="lineage-container">
            <svg className="lineage-svg" viewBox="0 0 900 180" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="lgNode1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#6366f1"/><stop offset="100%" stopColor="#818cf8"/></linearGradient>
                <linearGradient id="lgNode2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#f59e0b"/><stop offset="100%" stopColor="#fbbf24"/></linearGradient>
                <linearGradient id="lgNode3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8b5cf6"/><stop offset="100%" stopColor="#a78bfa"/></linearGradient>
                <linearGradient id="lgNode4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#00A79D"/><stop offset="100%" stopColor="#00c9bd"/></linearGradient>
                <linearGradient id="lgNode5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#1B2A4A"/><stop offset="100%" stopColor="#2d4a7a"/></linearGradient>
              </defs>
              <path className="lineage-path" d="M170,90 Q192,90 215,90"/>
              <path className="lineage-path" d="M365,90 Q387,90 410,90"/>
              <path className="lineage-path" d="M560,90 Q582,90 605,90"/>
              <path className="lineage-path" d="M755,90 Q777,90 800,90"/>
              <g className="lineage-node" transform="translate(20,50)">
                <rect width="150" height="80" fill="url(#lgNode1)" stroke="#6366f1" strokeWidth="1"/>
                <text x="75" y="38" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Entrevistas</text>
                <text x="75" y="55" textAnchor="middle" fill="#fff" fontSize="9" opacity=".8">47 completadas</text>
              </g>
              <g className="lineage-node" transform="translate(215,50)">
                <rect width="150" height="80" fill="url(#lgNode2)" stroke="#f59e0b" strokeWidth="1"/>
                <text x="75" y="38" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Validacion</text>
                <text x="75" y="55" textAnchor="middle" fill="#fff" fontSize="9" opacity=".8">134 validados</text>
              </g>
              <g className="lineage-node" transform="translate(410,50)">
                <rect width="150" height="80" fill="url(#lgNode3)" stroke="#8b5cf6" strokeWidth="1"/>
                <text x="75" y="38" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Clasificacion IA</text>
                <text x="75" y="55" textAnchor="middle" fill="#fff" fontSize="9" opacity=".8">3 modelos ML</text>
              </g>
              <g className="lineage-node" transform="translate(605,50)">
                <rect width="150" height="80" fill="url(#lgNode4)" stroke="#00A79D" strokeWidth="1"/>
                <text x="75" y="38" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Base de datos</text>
                <text x="75" y="55" textAnchor="middle" fill="#fff" fontSize="9" opacity=".8">11,742 registros</text>
              </g>
              <g className="lineage-node" transform="translate(800,50)">
                <rect width="80" height="80" fill="url(#lgNode5)" stroke="#1B2A4A" strokeWidth="1"/>
                <text x="40" y="38" textAnchor="middle" fill="#fff" fontSize="11">Dash-</text>
                <text x="40" y="53" textAnchor="middle" fill="#fff" fontSize="11">board</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Feature 4: Sync Status */}
        <div className="sync-status anim-fade-up delay-3">
          <div className="sync-status-header">
            <h3 className="sync-status-title">Estado de sincronizacion</h3>
            <span className="sync-status-live"><span className="sync-live-dot"></span>EN VIVO</span>
          </div>
          <div className="sync-grid">
            {SYNC_ITEMS.map(s => (
              <div key={s.name} className={`sync-item${s.st === 'syncing' ? ' is-syncing' : ''}`}>
                <div className="sync-item-icon" style={{background:`${s.icon}22`}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke={s.icon} strokeWidth="1.6"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
                </div>
                <div className="sync-item-info">
                  <div className="sync-item-name">{s.name}</div>
                  <div className="sync-item-time">{s.time}</div>
                </div>
                <div className="sync-item-status">
                  <div className={`sync-dot ${s.st}`}></div>
                  <div className="sync-item-next">{s.next}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 2: Reliability Dashboard */}
        <div className="reliability-dashboard anim-fade-up delay-3">
          <div className="reliability-header">
            <div>
              <h3 className="reliability-title">Panel de confiabilidad</h3>
              <p className="reliability-sub">Puntuaciones de confiabilidad por tipo de fuente y metrica de calidad.</p>
            </div>
            <div className="reliability-overall">
              <div className="reliability-overall-label">Score general</div>
              <div className="reliability-overall-val">87%</div>
              <div className="reliability-overall-sub">+3% vs. mes anterior</div>
            </div>
          </div>
          <div className="reliability-grid">
            <div className="reliability-bars">
              {[
                { label:'Entrevistas', v:89, cls:'green' },
                { label:'Bases de datos', v:93, cls:'green' },
                { label:'Encuestas', v:76, cls:'yellow' },
                { label:'Web/Scraping', v:71, cls:'yellow' },
                { label:'Fuentes IA', v:84, cls:'green' },
                { label:'Oficiales', v:97, cls:'green' },
              ].map(b => (
                <div key={b.label} className="rel-bar-item">
                  <div className="rel-bar-label">{b.label}</div>
                  <div className="rel-bar-track">
                    <div className={`rel-bar-fill ${b.cls}`} style={{width:`${b.v}%`}}><span>{b.v}%</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="reliability-breakdown">
              {[
                { name:'Precision', desc:'Exactitud de los datos', score:'91%', clr:'var(--success)', iconBg:'rgba(16,185,129,.1)', svg: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> },
                { name:'Cobertura', desc:'Completitud geografica y tematica', score:'84%', clr:'#6366f1', iconBg:'rgba(99,102,241,.1)', svg: <><path d="M21 12a9 9 0 11-6.219-8.56"/><polyline points="22 4 12 14.01 9 11.01"/></> },
                { name:'Frescura', desc:'Actualidad de la informacion', score:'79%', clr:'var(--warning)', iconBg:'rgba(245,158,11,.1)', svg: <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></> },
                { name:'Consistencia', desc:'Coherencia entre fuentes', score:'88%', clr:'#8b5cf6', iconBg:'rgba(139,92,246,.1)', svg: <><path d="M4 4h16v16H4z"/><path d="M4 12h16"/><path d="M12 4v16"/></> },
              ].map(m => (
                <div key={m.name} className="rel-metric">
                  <div className="rel-metric-left">
                    <div className="rel-metric-icon" style={{background:m.iconBg,color:m.clr}}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{m.svg}</svg>
                    </div>
                    <div><div className="rel-metric-name">{m.name}</div><div className="rel-metric-desc">{m.desc}</div></div>
                  </div>
                  <div className="rel-metric-score" style={{color:m.clr}}>{m.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 5: Coverage Matrix */}
        <div className="coverage-matrix anim-fade-up delay-4">
          <h3 className="coverage-title">Matriz de cobertura de datos</h3>
          <p className="coverage-sub">Cobertura por pais y area tematica. La intensidad del color indica el porcentaje de cobertura.</p>
          <div className="coverage-legend">
            <div>
              <div className="coverage-gradient"></div>
              <div className="coverage-legend-labels"><span>0%</span><span>50%</span><span>100%</span></div>
            </div>
            <div className="coverage-gap-label"><span className="coverage-gap-dot"></span>Brecha critica (&lt;30%)</div>
          </div>
          <div className="matrix-container" style={{maxWidth:'100%',aspectRatio:'unset'}}>
            <div style={{display:'grid',gridTemplateColumns:`140px repeat(${COVERAGE.dims.length},1fr)`,minWidth:'650px',border:'1px solid var(--border)',borderRadius:'10px',overflow:'hidden'}}>
              <div style={{padding:'10px 12px',background:'var(--bg)',fontSize:'10px',fontFamily:'var(--font-mono)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em',color:'var(--muted)',borderBottom:'1px solid var(--border)'}}>Pais</div>
              {COVERAGE.dims.map(d => <div key={d} style={{padding:'10px 8px',background:'var(--bg)',fontSize:'10px',fontFamily:'var(--font-mono)',fontWeight:600,textTransform:'uppercase',letterSpacing:'.04em',color:'var(--muted)',borderBottom:'1px solid var(--border)',textAlign:'center',borderLeft:'1px solid var(--border)'}}>{d}</div>)}
              {COVERAGE.rows.map(row => (
                <>
                  <div key={row.name} style={{padding:'10px 12px',fontSize:'12px',fontWeight:500,borderBottom:'1px solid rgba(0,0,0,.04)',display:'flex',alignItems:'center',gap:'6px',background:'#fff'}}>{row.flag} {row.name}</div>
                  {row.vals.map((v,ci) => (
                    <div key={ci} style={{borderBottom:'1px solid rgba(0,0,0,.04)',borderLeft:'1px solid rgba(0,0,0,.04)',position:'relative',display:'grid',placeItems:'center',minHeight:'44px',cursor:'pointer'}} title={`${COVERAGE.dims[ci]}: ${v}%`}>
                      <div style={{width:'calc(100% - 6px)',height:'calc(100% - 6px)',borderRadius:'4px',display:'grid',placeItems:'center',fontFamily:'var(--font-mono)',fontSize:'11px',fontWeight:700,color: v < 40 ? 'var(--fg)' : '#fff',background:coverageColor(v), ...(v < 30 ? {border:'2px dashed var(--danger)',background:'transparent',color:'var(--danger)'} : {})}}>{v}%</div>
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Feature 3: Collection Calendar (Gantt) */}
        <div className="collection-calendar anim-fade-up delay-4">
          <h3 className="calendar-title">Calendario de recopilacion</h3>
          <p className="calendar-sub">Vista Gantt del cronograma de recopilacion de datos por fuente, Ene-Dic 2026.</p>
          <div className="calendar-legend">
            {[['Entrevistas','linear-gradient(90deg,#6366f1,#818cf8)'],['Bases de datos','linear-gradient(90deg,var(--accent),var(--accent-light))'],['Encuestas','linear-gradient(90deg,#ec4899,#f472b6)'],['Web/Scraping','linear-gradient(90deg,#f59e0b,#fbbf24)'],['IA Monitoring','linear-gradient(90deg,#8b5cf6,#a78bfa)'],['Oficiales','linear-gradient(90deg,#ef4444,#f87171)']].map(([l,c]) => (
              <div key={l} className="calendar-legend-item"><span className="calendar-legend-dot" style={{background:c}}></span>{l}</div>
            ))}
          </div>
          <div className="gantt-container">
            <div className="gantt-grid">
              <div className="gantt-header" style={{textAlign:'left'}}>Fuente</div>
              {MONTHS.map(m => <div key={m} className="gantt-header">{m}</div>)}
              {GANTT_ROWS.map((row) => (
                <>
                  <div key={row.label} className="gantt-row-label">{row.label}</div>
                  {MONTHS.map((_,mi) => (
                    <div key={mi} className="gantt-cell">
                      {mi >= row.start && mi < row.start + row.span && (
                        <div className="gantt-bar" style={{background:row.color,left:'4px',right:'4px'}}>
                          <div className="gantt-bar-tooltip">{row.label}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs anim-fade-up delay-3">
          {(['todas','entrevistas','bases','encuestas','cronograma'] as FuentesTab[]).map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'todas' ? 'Todas las fuentes' : t === 'entrevistas' ? 'Entrevistas' : t === 'bases' ? 'Bases de datos' : t === 'encuestas' ? 'Encuestas' : 'Cronograma'}
            </button>
          ))}
        </div>

        {/* TAB: Todas */}
        <div className={`tab-content${tab === 'todas' ? ' active' : ''}`}>
          <div className="filters-bar anim-fade-up delay-4">
            {[['all','Todas'],['entrevista','Entrevistas'],['bd','Bases de datos'],['encuesta','Encuestas'],['web','Web/Scraping'],['oficial','Oficiales'],['ai','IA Monitoring']].map(([v,l]) => (
              <span key={v} className={`filter-chip${filter === v ? ' active' : ''}`} onClick={() => setFilter(v)}>{l}</span>
            ))}
          </div>
          <SourceGrid sources={filtered} />
        </div>

        {/* TAB: Entrevistas */}
        <div className={`tab-content${tab === 'entrevistas' ? ' active' : ''}`}>
          <SourceGrid sources={entrevistas} />
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Progreso de entrevistas por pais</span></div>
            <div className="panel-body-flush">
              <table className="data-table">
                <thead><tr><th>Pais</th><th className="num-col">Meta</th><th className="num-col">Completadas</th><th>Progreso</th></tr></thead>
                <tbody>
                  {[['🇨🇴 Colombia',15,12],['🇨🇷 Costa Rica',10,8],['🇸🇻 El Salvador',10,7],['🇬🇹 Guatemala',10,8],['🇭🇳 Honduras',8,6],['🇵🇦 Panama',7,6]].map(([c,m,d]) => (
                    <tr key={String(c)}><td style={{fontWeight:600}}>{c}</td><td className="num-col">{m}</td><td className="num-col">{d}</td><td><div className="progress-track"><div className="progress-fill" style={{width:`${Math.round((Number(d)/Number(m))*100)}%`}}></div></div></td></tr>
                  ))}
                  <tr style={{fontWeight:700}}><td>Total</td><td className="num-col">60</td><td className="num-col">47</td><td><div className="progress-track"><div className="progress-fill" style={{width:'78%',background:'var(--success)'}}></div></div></td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB: Bases */}
        <div className={`tab-content${tab === 'bases' ? ' active' : ''}`}>
          <SourceGrid sources={bases} />
        </div>

        {/* TAB: Encuestas */}
        <div className={`tab-content${tab === 'encuestas' ? ' active' : ''}`}>
          <SourceGrid sources={encuestas} />
        </div>

        {/* TAB: Cronograma */}
        <div className={`tab-content${tab === 'cronograma' ? ' active' : ''}`}>
          <div className="panel"><div className="panel-header"><span className="panel-title">Plan de recopilacion Ene-Dic 2026</span></div>
            <div className="panel-body-flush">
              <table className="data-table">
                <thead><tr><th>Fuente</th><th>Tipo</th><th>Periodo</th><th>Registros</th><th>Estado</th></tr></thead>
                <tbody>
                  {SOURCES.map(s => (
                    <tr key={s.title}><td style={{fontWeight:600}}>{s.title}</td><td><span className={`source-type type-${s.type}`}>{s.type}</span></td><td style={{fontSize:'12px',color:'var(--muted)'}}>{s.date}</td><td className="num-col">{s.actors}</td><td><span className={`source-status status-${s.status}`}><span className="status-dot"></span>{s.statusLabel}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

function SourceGrid({ sources }: { sources: typeof SOURCES }) {
  return (
    <div className="sources-grid">
      {sources.map(s => (
        <div key={s.title} className={`source-card type-${s.type}`}>
          <div className="source-header">
            <span className="source-type">{s.type === 'entrevista' ? 'Entrevista' : s.type === 'bd' ? 'Base de datos' : s.type === 'encuesta' ? 'Encuesta' : s.type === 'web' ? 'Web/Scraping' : s.type === 'oficial' ? 'Oficial' : 'IA Monitoring'}</span>
            <span className={`source-status status-${s.status}`}><span className="status-dot"></span>{s.statusLabel}</span>
          </div>
          <div className="source-title">{s.title}</div>
          <div className="source-desc">{s.desc}</div>
          <div className="source-meta">
            <span className="source-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {s.date}
            </span>
            <span className="source-meta-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
              {s.actors}
            </span>
            {s.flag && <span className="source-meta-item">{s.flag} {s.country}</span>}
          </div>
          <div className="source-progress">
            <div className="progress-label"><span>{s.type === 'bd' || s.type === 'ai' ? 'Confiabilidad' : 'Progreso'}</span><span>{s.prog}%</span></div>
            <div className="progress-track"><div className="progress-fill" style={{width:`${s.prog}%`}}></div></div>
          </div>
        </div>
      ))}
    </div>
  )
}
