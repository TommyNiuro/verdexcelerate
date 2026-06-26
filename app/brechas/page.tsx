'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'

type Tab = 'brechas' | 'oportunidades' | 'genero' | 'recomendaciones'

export default function BrechasPage() {
  const [tab, setTab] = useState<Tab>('brechas')
  const [planOpen, setPlanOpen] = useState(false)
  const [crossOpen, setCrossOpen] = useState(false)

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Brechas y oportunidades</span>
          </div>
          <h1>Brechas y oportunidades</h1>
        </div>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Analisis de brechas criticas del ecosistema</h2>
          <p>Brechas identificadas por pais y a nivel regional en financiamiento, talento, conectividad, genero, regulacion y mercado. Con enfasis en zonas prioritarias y necesidades de pequenos productores.</p>
        </div>

        {/* Tabs */}
        <div className="tabs anim-fade-up delay-1">
          {(['brechas','oportunidades','genero','recomendaciones'] as Tab[]).map(t => (
            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'brechas' ? 'Brechas criticas' : t === 'oportunidades' ? 'Oportunidades de innovacion' : t === 'genero' ? 'Analisis de genero' : 'Recomendaciones'}
            </button>
          ))}
        </div>

        {/* TAB: Brechas */}
        <div className={`tab-content${tab === 'brechas' ? ' active' : ''}`}>
          <div className="summary-row anim-fade-up delay-2">
            {[
              { cat: 'financiamiento', icon: 'fin', label: 'Financiamiento', val: '12', sub: 'brechas identificadas', color: '#6366f1', svg: <><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></> },
              { cat: 'conectividad', icon: 'con', label: 'Conectividad', val: '8', sub: 'brechas identificadas', color: 'var(--danger)', svg: <><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></> },
              { cat: 'genero', icon: 'gen', label: 'Genero', val: '7', sub: 'brechas identificadas', color: '#ec4899', svg: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></> },
              { cat: 'talento', icon: 'tal', label: 'Talento', val: '6', sub: 'brechas identificadas', color: 'var(--warning)', svg: <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 6 3 6 3s3 0 6-3v-5"/></> },
              { cat: 'mercado', icon: 'mer', label: 'Mercado', val: '5', sub: 'brechas identificadas', color: 'var(--accent)', svg: <><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></> },
            ].map(s => (
              <div key={s.cat} className={`summary-card cat-${s.cat}`}>
                <div className={`summary-icon ${s.icon}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{s.svg}</svg>
                </div>
                <div className="summary-label">{s.label}</div>
                <div className="summary-val" style={{color: s.color}}>{s.val}</div>
                <div className="summary-sub">{s.sub}</div>
              </div>
            ))}
          </div>

          <div className="radar-panel anim-fade-up delay-3">
            <h3>Severidad promedio por categoria (regional)</h3>
            <div className="radar-grid">
              <svg viewBox="0 0 300 300" style={{width:'100%',maxWidth:'280px'}}>
                <polygon points="150,30 270,110 230,260 70,260 30,110" fill="none" stroke="var(--border)" strokeWidth="1"/>
                <polygon points="150,78 222,130 198,210 102,210 78,130" fill="none" stroke="var(--border)" strokeWidth="1"/>
                <polygon points="150,126 174,150 166,180 134,180 126,150" fill="none" stroke="var(--border)" strokeWidth="1"/>
                <line x1="150" y1="30" x2="150" y2="150" stroke="var(--border)" strokeWidth=".5"/>
                <line x1="270" y1="110" x2="150" y2="150" stroke="var(--border)" strokeWidth=".5"/>
                <line x1="230" y1="260" x2="150" y2="150" stroke="var(--border)" strokeWidth=".5"/>
                <line x1="70" y1="260" x2="150" y2="150" stroke="var(--border)" strokeWidth=".5"/>
                <line x1="30" y1="110" x2="150" y2="150" stroke="var(--border)" strokeWidth=".5"/>
                <polygon points="150,50 250,118 215,245 85,245 50,118" fill="rgba(0,167,157,.08)" stroke="var(--accent)" strokeWidth="2"/>
                <circle cx="150" cy="50" r="4" fill="var(--accent)"/>
                <circle cx="250" cy="118" r="4" fill="var(--accent)"/>
                <circle cx="215" cy="245" r="4" fill="var(--accent)"/>
                <circle cx="85" cy="245" r="4" fill="var(--accent)"/>
                <circle cx="50" cy="118" r="4" fill="var(--accent)"/>
                <text x="150" y="20" textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">Financiamiento</text>
                <text x="285" y="115" textAnchor="start" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">Conectividad</text>
                <text x="240" y="275" textAnchor="start" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">Mercado</text>
                <text x="60" y="275" textAnchor="end" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">Genero</text>
                <text x="15" y="115" textAnchor="end" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">Talento</text>
              </svg>
              <div className="radar-bars">
                {[
                  { l:'Financiamiento', w:88, v:'4.4/5', cls:'fill-purple' },
                  { l:'Conectividad', w:82, v:'4.1/5', cls:'fill-danger' },
                  { l:'Genero', w:76, v:'3.8/5', cls:'fill-pink' },
                  { l:'Talento', w:70, v:'3.5/5', cls:'fill-warning' },
                  { l:'Mercado', w:62, v:'3.1/5', cls:'fill-accent' },
                  { l:'Regulacion', w:50, v:'2.5/5', cls:'fill-accent' },
                ].map((b,i) => (
                  <div key={b.l} className="radar-row">
                    <span className="radar-label">{b.l}</span>
                    <div className="radar-track"><div className={`radar-fill ${b.cls}`} style={{width:`${b.w}%`,animationDelay:`${.3+i*.1}s`}}></div></div>
                    <span className="radar-val">{b.v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="gaps-grid anim-fade-up delay-4">
            {[
              { sev:'sev-5', title:'Ausencia de fondos de capital semilla rurales', sevBadge:'5/5 Critica', sevCls:'sev-critical', cat:'cat-financiamiento', catLabel:'Financiamiento', desc:'No existen mecanismos de financiamiento temprano accesibles para startups AgrifoodTech en zonas rurales de alta vulnerabilidad. Los fondos existentes se concentran en capitales urbanas.', zones:['La Guajira','Sucre','Morazan'], meta:['Afecta mujeres','Afecta peq. productores'] },
              { sev:'sev-5', title:'Sin conectividad para adopcion de AgTech', sevBadge:'5/5 Critica', sevCls:'sev-critical', cat:'cat-conectividad', catLabel:'Conectividad', desc:'Zonas prioritarias carecen de infraestructura digital basica, impidiendo la adopcion de soluciones AgTech. Sin conectividad, las plataformas IoT y de trazabilidad son inviables.', zones:['Alta Verapaz','La Guajira'], meta:['Afecta mujeres','Afecta peq. productores'] },
              { sev:'sev-4', title:'Baja representacion femenina en liderazgo AgrifoodTech', sevBadge:'4/5 Alta', sevCls:'sev-high', cat:'cat-genero', catLabel:'Genero', desc:'Solo 18% de startups AgrifoodTech tienen liderazgo femenino. Meta del proyecto: 40%. Barreras diferenciadas en acceso a financiamiento, redes y mentoria.', zones:['Todas las zonas'], meta:['Afecta directamente mujeres'] },
              { sev:'sev-4', title:'Talento tecnico insuficiente para startups AgrifoodTech', sevBadge:'4/5 Alta', sevCls:'sev-high', cat:'cat-talento', catLabel:'Talento', desc:'Deficit de perfiles tecnicos con conocimiento en agricultura. Universidades no ofrecen programas interdisciplinarios en agtech. Alta migracion de talento joven desde zonas rurales.', zones:['Morazan','Magdalena','Honduras'], meta:['Afecta jovenes'] },
              { sev:'sev-3', title:'Acceso limitado a mercados de exportacion', sevBadge:'3/5 Media', sevCls:'sev-medium', cat:'cat-mercado', catLabel:'Mercado', desc:'Productores de zonas prioritarias carecen de canales directos a mercados internacionales. Las startups de trazabilidad y logistica pueden resolver esta brecha si alcanzan escala.', zones:['Cordoba','Sucre'], meta:['Afecta peq. productores'] },
              { sev:'sev-3', title:'Barreras regulatorias para innovacion agricola', sevBadge:'3/5 Media', sevCls:'sev-medium', cat:'cat-regulacion', catLabel:'Regulacion', desc:'Marcos regulatorios desactualizados que limitan el uso de drones, biotecnologia y fintech agricola. Procesos de certificacion lentos y costosos para startups en etapa temprana.', zones:['Guatemala','Honduras','El Salvador'], meta:['Afecta startups'] },
            ].map(g => (
              <div key={g.title} className={`gap-card ${g.sev}`}>
                <div className="gap-header">
                  <div className="gap-title">{g.title}</div>
                  <span className={`gap-sev ${g.sevCls}`}>{g.sevBadge}</span>
                </div>
                <span className={`gap-cat ${g.cat}`}>{g.catLabel}</span>
                <div className="gap-desc">{g.desc}</div>
                <div className="gap-zones">
                  {g.zones.map(z => <span key={z} className="zone-tag">{z}</span>)}
                </div>
                <div className="gap-meta">
                  {g.meta.map(m => <div key={m} className="gap-meta-item">{m}</div>)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAB: Oportunidades */}
        <div className={`tab-content${tab === 'oportunidades' ? ' active' : ''}`}>
          <div className="gaps-grid">
            {[
              { num:'OPP-001', title:'Retos de innovacion abierta para conectividad rural', desc:'Diseno de retos que conecten necesidades no resueltas de pequenos productores con soluciones de startups AgrifoodTech. Enfoque en soluciones offline-first y low-bandwidth.', tags:['Conectividad','Peq. productores','Componente 2'] },
              { num:'OPP-002', title:'Programa de mentoria para fundadoras AgrifoodTech', desc:'Red de mentoria especializada para mujeres fundadoras y co-fundadoras, con foco en acceso a financiamiento, redes y escalamiento. Vinculada al programa de aceleracion (Componente 2).', tags:['Genero','Componente 2','Meta 40%'] },
              { num:'OPP-003', title:'Vehiculo de inversion temprana para zonas prioritarias', desc:'Diseno de mecanismo de financiamiento semilla adaptado a realidades de zonas rurales. Tickets de USD 5K-50K con proceso simplificado y mentoria integrada (Componente 3).', tags:['Financiamiento','Componente 3','Zonas prior.'] },
              { num:'OPP-004', title:'Alianzas con corporativos ancla para pilotos AgTech', desc:'Articulacion de al menos 5 organizaciones candidatas a alianzas formales entre corporativos del sector agroalimentario y startups para pilotos en cadenas de valor prioritarias.', tags:['Mercado','Componente 1','Alianzas'] },
              { num:'OPP-005', title:'Hub de talento agtech interdisciplinario', desc:'Programas formativos con universidades y centros de investigacion para crear perfiles tecnicos con conocimiento en agricultura. Enfasis en jovenes de zonas rurales.', tags:['Talento','Academia','Jovenes'] },
              { num:'OPP-006', title:'Plataforma de trazabilidad para cafe de Alta Verapaz', desc:"Escalamiento de soluciones blockchain para conectar productores indigenas Q'eqchi' con compradores internacionales de cafe de especialidad.", tags:['Trazabilidad','Cafe','Guatemala'] },
            ].map(o => (
              <div key={o.num} className="opp-card">
                <div className="opp-num">{o.num}</div>
                <div className="opp-title">{o.title}</div>
                <div className="opp-desc">{o.desc}</div>
                <div className="opp-tags">{o.tags.map(t => <span key={t} className="opp-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* TAB: Genero */}
        <div className={`tab-content${tab === 'genero' ? ' active' : ''}`}>
          <div className="summary-row" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
            <div className="summary-card cat-genero"><div className="summary-label">Liderazgo femenino actual</div><div className="summary-val" style={{color:'#ec4899'}}>18%</div><div className="summary-sub">CEO/cofundadora mujer</div></div>
            <div className="summary-card cat-genero"><div className="summary-label">Meta programa aceleracion</div><div className="summary-val" style={{color:'var(--accent)'}}>40%</div><div className="summary-sub">startups con lid. femenino</div></div>
            <div className="summary-card cat-genero"><div className="summary-label">Brecha financiamiento</div><div className="summary-val" style={{color:'var(--danger)'}}>3.2x</div><div className="summary-sub">menor acceso vs. hombres</div></div>
            <div className="summary-card cat-genero"><div className="summary-label">Startups lideradas por mujeres</div><div className="summary-val" style={{color:'#6366f1'}}>512</div><div className="summary-sub">identificadas en 6 paises</div></div>
          </div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Liderazgo femenino por pais</span></div>
            <div className="panel-body-flush">
              <table className="data-table">
                <thead><tr><th>Pais</th><th className="num-col">Total startups</th><th className="num-col">Lid. femenino</th><th className="num-col">%</th><th>Tendencia</th></tr></thead>
                <tbody>
                  <tr><td style={{fontWeight:600}}>🇨🇷 Costa Rica</td><td className="num-col">198</td><td className="num-col">44</td><td className="num-col" style={{color:'var(--accent)',fontWeight:700}}>22%</td><td style={{color:'var(--success)',fontSize:'12px'}}>▲ Creciendo</td></tr>
                  <tr><td style={{fontWeight:600}}>🇵🇦 Panama</td><td className="num-col">162</td><td className="num-col">32</td><td className="num-col" style={{color:'var(--accent)',fontWeight:700}}>20%</td><td style={{color:'var(--success)',fontSize:'12px'}}>▲ Creciendo</td></tr>
                  <tr><td style={{fontWeight:600}}>🇨🇴 Colombia</td><td className="num-col">486</td><td className="num-col">88</td><td className="num-col" style={{fontWeight:700}}>18%</td><td style={{color:'var(--muted)',fontSize:'12px'}}>— Estable</td></tr>
                  <tr><td style={{fontWeight:600}}>🇸🇻 El Salvador</td><td className="num-col">118</td><td className="num-col">19</td><td className="num-col" style={{fontWeight:700}}>16%</td><td style={{color:'var(--muted)',fontSize:'12px'}}>— Estable</td></tr>
                  <tr><td style={{fontWeight:600}}>🇬🇹 Guatemala</td><td className="num-col">147</td><td className="num-col">21</td><td className="num-col" style={{color:'var(--warning)',fontWeight:700}}>14%</td><td style={{color:'var(--danger)',fontSize:'12px'}}>▼ Bajando</td></tr>
                  <tr><td style={{fontWeight:600}}>🇭🇳 Honduras</td><td className="num-col">132</td><td className="num-col">16</td><td className="num-col" style={{color:'var(--danger)',fontWeight:700}}>12%</td><td style={{color:'var(--danger)',fontSize:'12px'}}>▼ Bajando</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* TAB: Recomendaciones */}
        <div className={`tab-content${tab === 'recomendaciones' ? ' active' : ''}`}>
          <div className="gaps-grid">
            {[
              { num:'REC-001', title:'Establecer al menos 5 alianzas formales con actores clave', desc:'Articular alianzas con corporativos ancla, ESOs y organismos internacionales para el Componente 1. Priorizar organizaciones con presencia en zonas prioritarias.', tags:['Alianzas','Componente 1'] },
              { num:'REC-002', title:'Asegurar participacion de startups lideradas por mujeres', desc:'Acciones concretas para que al menos 40% de startups graduadas del programa de aceleracion sean fundadas/co-fundadas y/o lideradas por mujeres y/o jovenes.', tags:['Genero','Componente 2','Meta 40%'] },
              { num:'REC-003', title:'Priorizar startups con tecnologia para pequenos productores', desc:'Dar especial atencion a startups cuya propuesta de valor esta dirigida a pequenos productores como usuarios o beneficiarios directos de la tecnologia.', tags:['Peq. productores','Componente 2'] },
              { num:'REC-004', title:'Disenar vehiculo de inversion con enfoque de impacto', desc:'Facilitar acceso a capital para startups apoyadas a traves de un vehiculo de inversion (Componente 3) que priorice impacto social y ambiental medible.', tags:['Financiamiento','Componente 3'] },
              { num:'REC-005', title:'Implementar medicion de resiliencia climatica', desc:'Incorporar metricas de CO2e (reducidas, evitadas, secuestradas) en la evaluacion de startups. Recopilar metodologias de reporte de impacto climatico.', tags:['Clima','Sostenibilidad'] },
              { num:'REC-006', title:'Mantener el mapeo vivo como activo estrategico', desc:'Implementar sistema de autorregistro con validacion semiautomatica. Conectar a fuentes publicas con monitoreo automatizado con IA.', tags:['Herramienta digital','Sostenibilidad'] },
            ].map(o => (
              <div key={o.num} className="opp-card">
                <div className="opp-num">{o.num}</div>
                <div className="opp-title">{o.title}</div>
                <div className="opp-desc">{o.desc}</div>
                <div className="opp-tags">{o.tags.map(t => <span key={t} className="opp-tag">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature 1: Impact-Effort Matrix */}
        <div className="impact-effort-matrix anim-fade-up">
          <h3>Matriz Impacto vs Esfuerzo de Oportunidades</h3>
          <p style={{fontSize:'12px',color:'var(--muted)',marginTop:'-12px',marginBottom:'20px',lineHeight:1.5}}>Posicionamiento estrategico de cada oportunidad segun su impacto potencial y el esfuerzo requerido para implementarla.</p>
          <div style={{position:'relative',paddingLeft:'30px'}}>
            <div className="matrix-y-label">Impacto alto ↔ bajo</div>
            <div className="matrix-container">
              <div className="matrix-grid">
                <div className="matrix-quadrant">
                  <div className="quadrant-label">Quick Wins</div>
                  <div className="quadrant-desc">Alto impacto, bajo esfuerzo</div>
                  <div className="matrix-dots-row">
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,#ec4899,#f472b6)'}}>O2<div className="matrix-tooltip">OPP-002: Programa de mentoria para fundadoras AgrifoodTech</div></div>
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,var(--accent),var(--accent-light))'}}>O6<div className="matrix-tooltip">OPP-006: Plataforma de trazabilidad para cafe de Alta Verapaz</div></div>
                  </div>
                </div>
                <div className="matrix-quadrant">
                  <div className="quadrant-label">Major Projects</div>
                  <div className="quadrant-desc">Alto impacto, alto esfuerzo</div>
                  <div className="matrix-dots-row">
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,#6366f1,#818cf8)'}}>O3<div className="matrix-tooltip">OPP-003: Vehiculo de inversion temprana para zonas prioritarias</div></div>
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,var(--danger),#f87171)'}}>O1<div className="matrix-tooltip">OPP-001: Retos de innovacion abierta para conectividad rural</div></div>
                  </div>
                </div>
                <div className="matrix-quadrant">
                  <div className="quadrant-label">Fill-ins</div>
                  <div className="quadrant-desc">Bajo impacto, bajo esfuerzo</div>
                  <div className="matrix-dots-row">
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,#6b7280,#9ca3af)'}}>O4<div className="matrix-tooltip">OPP-004: Alianzas con corporativos ancla para pilotos AgTech</div></div>
                  </div>
                </div>
                <div className="matrix-quadrant">
                  <div className="quadrant-label">Thankless Tasks</div>
                  <div className="quadrant-desc">Bajo impacto, alto esfuerzo</div>
                  <div className="matrix-dots-row">
                    <div className="matrix-dot" style={{background:'linear-gradient(135deg,var(--warning),#fbbf24)'}}>O5<div className="matrix-tooltip">OPP-005: Hub de talento agtech interdisciplinario</div></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="matrix-axes"><span>Bajo esfuerzo</span><span>Alto esfuerzo</span></div>
          </div>
        </div>

        {/* Feature 2: Trend Analysis SVG */}
        <div className="trend-analysis anim-fade-up">
          <h3>Tendencia de Severidad de Brechas (Q1 2025 - Q2 2026)</h3>
          <p style={{fontSize:'12px',color:'var(--muted)',marginTop:'-12px',marginBottom:'20px',lineHeight:1.5}}>Evolucion trimestral del nivel de severidad promedio por categoria de brecha.</p>
          <div className="trend-svg-wrap">
            <svg viewBox="0 0 700 300" style={{width:'100%',minWidth:'500px'}}>
              <line x1="70" y1="40" x2="70" y2="240" stroke="var(--border)" strokeWidth="1"/>
              <line x1="70" y1="240" x2="660" y2="240" stroke="var(--border)" strokeWidth="1"/>
              {[200,160,120,80,40].map(y => <line key={y} x1="70" y1={y} x2="660" y2={y} stroke="var(--border)" strokeWidth=".5" strokeDasharray="4"/>)}
              {[1,2,3,4,5].map((v,i) => <text key={v} x="60" y={244-i*40} textAnchor="end" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">{v}</text>)}
              <text x="30" y="145" textAnchor="middle" fill="var(--muted)" fontSize="9" fontFamily="var(--font-mono)" transform="rotate(-90,30,145)">SEVERIDAD</text>
              {['Q1 25','Q2 25','Q3 25','Q4 25','Q1 26','Q2 26'].map((l,i) => <text key={l} x={168+i*98} y="262" textAnchor="middle" fill="var(--muted)" fontSize="10" fontFamily="var(--font-mono)">{l}</text>)}
              <polyline className="trend-line trend-line-1" points="168,56 266,64 364,72 462,68 560,76 660,88" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline className="trend-line trend-line-2" points="168,80 266,88 364,84 462,92 560,96 660,108" fill="none" stroke="var(--danger)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline className="trend-line trend-line-3" points="168,96 266,108 364,112 462,116 560,120 660,128" fill="none" stroke="#ec4899" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline className="trend-line trend-line-4" points="168,128 266,132 364,128 462,140 560,144 660,140" fill="none" stroke="var(--warning)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <polyline className="trend-line trend-line-5" points="168,152 266,156 364,164 462,160 560,168 660,176" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <g className="trend-data-point" style={{animationDelay:'2.2s'}}><circle cx="660" cy="88" r="4" fill="#6366f1"/><text x="660" y="80" textAnchor="middle" fill="#6366f1" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">4.4</text></g>
              <g className="trend-data-point" style={{animationDelay:'2.4s'}}><circle cx="660" cy="108" r="4" fill="var(--danger)"/><text x="660" y="100" textAnchor="middle" fill="var(--danger)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">4.1</text></g>
              <g className="trend-data-point" style={{animationDelay:'2.6s'}}><circle cx="660" cy="128" r="4" fill="#ec4899"/><text x="660" y="120" textAnchor="middle" fill="#ec4899" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">3.8</text></g>
              <g className="trend-data-point" style={{animationDelay:'2.8s'}}><circle cx="660" cy="140" r="4" fill="var(--warning)"/><text x="660" y="132" textAnchor="middle" fill="var(--warning)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">3.5</text></g>
              <g className="trend-data-point" style={{animationDelay:'3s'}}><circle cx="660" cy="176" r="4" fill="var(--accent)"/><text x="660" y="168" textAnchor="middle" fill="var(--accent)" fontSize="9" fontWeight="700" fontFamily="var(--font-mono)">3.1</text></g>
            </svg>
          </div>
          <div className="trend-legend">
            {[['#6366f1','Financiamiento'],['var(--danger)','Conectividad'],['#ec4899','Genero'],['var(--warning)','Talento'],['var(--accent)','Mercado']].map(([c,l]) => (
              <div key={l} className="trend-legend-item"><div className="trend-legend-dot" style={{background:c}}></div>{l}</div>
            ))}
          </div>
        </div>

        {/* Feature 3: Stakeholder Map */}
        <div className="stakeholder-map anim-fade-up">
          <h3>Mapa de Actores del Ecosistema</h3>
          <p style={{fontSize:'12px',color:'var(--muted)',marginTop:'-12px',marginBottom:'20px',lineHeight:1.5}}>Distribucion de actores clave por nivel de proximidad al proyecto VerdeXcelerate.</p>
          <div className="stakeholder-rings">
            <div className="stake-ring stake-ring-extended"><div className="stake-ring-label">Extendido</div></div>
            <div className="stake-ring stake-ring-strategic"><div className="stake-ring-label">Estrategico</div></div>
            <div className="stake-ring stake-ring-core"><div className="stake-ring-label">Core</div></div>
            <div className="stake-badge anim" style={{top:'40%',left:'35%',animationDelay:'.2s'}}><div className="stake-badge-icon type-ngo">T</div>TechnoServe</div>
            <div className="stake-badge anim" style={{top:'45%',left:'52%',animationDelay:'.3s'}}><div className="stake-badge-icon type-fin">B</div>BID Lab</div>
            <div className="stake-badge anim" style={{top:'22%',left:'22%',animationDelay:'.4s'}}><div className="stake-badge-icon type-eso">E</div>ESOs Regionales</div>
            <div className="stake-badge anim" style={{top:'20%',left:'55%',animationDelay:'.5s'}}><div className="stake-badge-icon type-corp">C</div>Corporativos Ancla</div>
            <div className="stake-badge anim" style={{top:'62%',left:'20%',animationDelay:'.6s'}}><div className="stake-badge-icon type-fin">F</div>Fondos de Impacto</div>
            <div className="stake-badge anim" style={{top:'60%',left:'58%',animationDelay:'.7s'}}><div className="stake-badge-icon type-gov">G</div>Min. Agricultura</div>
            <div className="stake-badge anim" style={{top:'5%',left:'5%',animationDelay:'.8s'}}><div className="stake-badge-icon type-uni">U</div>Universidades</div>
            <div className="stake-badge anim" style={{top:'3%',left:'55%',animationDelay:'.9s'}}><div className="stake-badge-icon type-gov">R</div>Reguladores</div>
            <div className="stake-badge anim" style={{top:'82%',left:'5%',animationDelay:'1s'}}><div className="stake-badge-icon type-corp">A</div>Agroindustria</div>
            <div className="stake-badge anim" style={{top:'80%',left:'62%',animationDelay:'1.1s'}}><div className="stake-badge-icon type-ngo">O</div>ONGs Desarrollo</div>
            <div className="stake-badge anim" style={{top:'10%',left:'75%',animationDelay:'1.2s'}}><div className="stake-badge-icon type-fin">V</div>VCs Regionales</div>
            <div className="stake-badge anim" style={{top:'88%',left:'38%',animationDelay:'1.3s'}}><div className="stake-badge-icon type-eso">I</div>Incubadoras</div>
          </div>
        </div>

        {/* Feature 4: Action Plan */}
        <button className="action-plan-trigger anim-fade-up" onClick={() => setPlanOpen(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/><path d="M9 14l2 2 4-4"/></svg>
          Generar Plan de Accion
        </button>
        <div className={`action-plan-modal${planOpen ? ' open' : ''}`}>
          <div className="modal-backdrop" onClick={() => setPlanOpen(false)}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>Plan de Accion — Brechas Criticas VerdeXcelerate</h3>
              <button className="modal-close" onClick={() => setPlanOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{fontSize:'12px',color:'var(--muted)',margin:'0 0 16px',lineHeight:1.5}}>Plan generado automaticamente a partir de las brechas identificadas. Fecha: Junio 2026.</p>
              <table className="action-table">
                <thead><tr><th style={{width:'20%'}}>Brecha</th><th style={{width:'30%'}}>Accion</th><th style={{width:'18%'}}>Responsable</th><th style={{width:'12%'}}>Plazo</th><th style={{width:'12%'}}>Estado</th></tr></thead>
                <tbody>
                  {[
                    { brecha:'Fondos de capital semilla rurales', accion:'Disenar mecanismo de tickets USD 5K-50K con proceso simplificado para zonas rurales', resp:'Equipo Componente 3', plazo:'Q3 2026', st:'planificado', stLabel:'Planificado' },
                    { brecha:'Conectividad para AgTech', accion:'Lanzar reto de innovacion abierta para soluciones offline-first y low-bandwidth', resp:'Equipo Componente 2', plazo:'Q4 2026', st:'pendiente', stLabel:'Pendiente' },
                    { brecha:'Liderazgo femenino AgTech', accion:'Implementar programa de mentoria especializado para fundadoras con meta 40%', resp:'Equipo Genero + Comp. 2', plazo:'Q3 2026', st:'progreso', stLabel:'En progreso' },
                    { brecha:'Talento tecnico insuficiente', accion:'Establecer convenios con 3+ universidades para programas agtech interdisciplinarios', resp:'Equipo Componente 1', plazo:'Q1 2027', st:'planificado', stLabel:'Planificado' },
                    { brecha:'Acceso mercados exportacion', accion:'Articular 5 alianzas formales con corporativos ancla para pilotos en cadenas de valor', resp:'Equipo Componente 1', plazo:'Q4 2026', st:'progreso', stLabel:'En progreso' },
                    { brecha:'Barreras regulatorias', accion:'Mapear y proponer reformas regulatorias para drones, biotech y fintech agricola', resp:'Equipo Legal + Comp. 1', plazo:'Q2 2027', st:'pendiente', stLabel:'Pendiente' },
                  ].map(r => (
                    <tr key={r.brecha}>
                      <td style={{fontWeight:600,fontSize:'12px'}}>{r.brecha}</td>
                      <td>{r.accion}</td>
                      <td>{r.resp}</td>
                      <td style={{fontFamily:'var(--font-mono)',fontSize:'11px'}}>{r.plazo}</td>
                      <td><span className={`status-badge status-${r.st}`}>{r.stLabel}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setPlanOpen(false)}>Cerrar</button>
              <button className="btn-copy">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:'14px',height:'14px'}}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copiar al portapapeles
              </button>
            </div>
          </div>
        </div>

        {/* Feature 5: Cross-Reference Panel */}
        <div className="cross-ref-panel anim-fade-up">
          <div className="cross-ref-header" onClick={() => setCrossOpen(!crossOpen)}>
            <h3>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" style={{width:'18px',height:'18px'}}><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              Referencias Cruzadas: Brechas ↔ Zonas Prioritarias
            </h3>
            <button className={`cross-ref-toggle${crossOpen ? ' open' : ''}`}>▼</button>
          </div>
          <div className="cross-ref-connections">Selecciona una brecha o zona para ver las conexiones.</div>
          <div className={`cross-ref-body${crossOpen ? ' open' : ''}`}>
            <div className="cross-ref-content">
              <div className="cross-ref-col">
                <h4>Brechas</h4>
                {[
                  { label:'Fondos de capital semilla rurales', dots:5 },
                  { label:'Conectividad para adopcion AgTech', dots:5 },
                  { label:'Liderazgo femenino AgrifoodTech', dots:4 },
                  { label:'Talento tecnico insuficiente', dots:4 },
                  { label:'Acceso limitado a mercados', dots:3 },
                  { label:'Barreras regulatorias', dots:3 },
                ].map(item => (
                  <div key={item.label} className="cross-ref-item">
                    {item.label}
                    <div className="cross-ref-strength">
                      {Array.from({length:5},(_,i) => <div key={i} className={`strength-dot${i<item.dots?' filled':''}`}></div>)}
                    </div>
                  </div>
                ))}
              </div>
              <div className="cross-ref-col">
                <h4>Zonas Prioritarias</h4>
                {[
                  { label:'La Guajira, Colombia', dots:5 },
                  { label:'Alta Verapaz, Guatemala', dots:4 },
                  { label:'Morazan, El Salvador', dots:4 },
                  { label:'Sucre, Colombia', dots:3 },
                  { label:'Cordoba, Colombia', dots:3 },
                  { label:'Magdalena, Colombia', dots:2 },
                ].map(item => (
                  <div key={item.label} className="cross-ref-item">
                    {item.label}
                    <div className="cross-ref-strength">
                      {Array.from({length:5},(_,i) => <div key={i} className={`strength-dot${i<item.dots?' filled':''}`}></div>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
