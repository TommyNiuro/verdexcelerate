'use client'

import { useEffect, useState } from 'react'
import AppLayout from '@/components/AppLayout'
import { getSourcesDetailed, getBenchmarks, type SourceRow, type Benchmark } from '@/lib/queries'

const TYPE_LABEL: Record<string, string> = {
  api: 'API', documental: 'Documental', scraping: 'Scraping', manual: 'Manual',
}
const TYPE_COLOR: Record<string, string> = {
  api: '#6366f1', documental: 'var(--accent)', scraping: 'var(--warning)', manual: '#ec4899',
}
function riskLabel(t: number) {
  if (t <= 0) return { label: 'Riesgo bajo', color: 'var(--success)' }
  if (t === 1) return { label: 'Riesgo medio', color: 'var(--warning)' }
  return { label: 'Riesgo alto', color: 'var(--danger)' }
}

export default function FuentesPage() {
  const [sources, setSources] = useState<SourceRow[]>([])
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getSourcesDetailed(), getBenchmarks()])
      .then(([s, b]) => { setSources(s); setBenchmarks(b) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const total = sources.length
  const byType = sources.reduce<Record<string, number>>((acc, s) => { acc[s.source_type] = (acc[s.source_type] || 0) + 1; return acc }, {})
  const licensed = sources.filter(s => s.is_licensed).length
  const lowRisk = sources.filter(s => s.risk_tier <= 0).length

  // Fuentes de benchmarks externos (unicas por nombre)
  const benchSources = Object.values(
    benchmarks.reduce<Record<string, { name: string; url: string | null; count: number }>>((acc, b) => {
      const key = b.source_name || 'Sin fuente'
      if (!acc[key]) acc[key] = { name: key, url: b.source_url, count: 0 }
      acc[key].count++
      return acc
    }, {})
  ).sort((a, b) => b.count - a.count)

  const summary = [
    { label: 'Fuentes documentadas', val: total, sub: 'en la plataforma' },
    { label: 'Con licencia', val: licensed, sub: `de ${total} fuentes` },
    { label: 'Riesgo bajo', val: lowRisk, sub: 'uso seguro de datos' },
    { label: 'Fuentes de benchmarks', val: benchSources.length, sub: 'cifras de contexto citadas' },
  ]

  return (
    <AppLayout title="Fuentes de datos">
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Fuentes de datos</span>
          </div>
          <h1>Fuentes de datos</h1>
        </div>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Origen y gobernanza de los datos</h2>
          <p>Cada actor del directorio proviene de una de estas fuentes y conserva su URL de origen. Aqui se desarrolla cada fuente: que es, que datos aporta, su cobertura, licencia y nivel de riesgo de uso. Las cifras de contexto del ecosistema (inversion, genero, ruralidad) provienen de fuentes externas citadas.</p>
        </div>

        {/* Resumen */}
        <div className="summary-row anim-fade-up delay-1">
          {summary.map(s => (
            <div key={s.label} className="summary-card">
              <div className="summary-label">{s.label}</div>
              <div className="summary-val">{loading ? '-' : s.val}</div>
              <div className="summary-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Distribucion por tipo */}
        <div className="anim-fade-up delay-2" style={{display:'flex',gap:'10px',flexWrap:'wrap',margin:'4px 0 8px'}}>
          {Object.entries(byType).map(([t, n]) => (
            <span key={t} style={{display:'inline-flex',alignItems:'center',gap:'6px',fontSize:'13px',color:'var(--muted)',border:'1px solid var(--border)',borderRadius:'999px',padding:'5px 12px'}}>
              <span style={{width:'8px',height:'8px',borderRadius:'50%',background:TYPE_COLOR[t]||'var(--muted)'}}></span>
              {TYPE_LABEL[t] || t}: <strong style={{color:'var(--text)'}}>{n}</strong>
            </span>
          ))}
        </div>

        {/* Fuentes desarrolladas */}
        <h3 style={{margin:'18px 0 12px',fontSize:'15px'}}>Fuentes de actores ({total})</h3>
        <div className="gaps-grid anim-fade-up delay-3">
          {sources.map(s => {
            const risk = riskLabel(s.risk_tier)
            const tcolor = TYPE_COLOR[s.source_type] || 'var(--muted)'
            return (
              <div key={s.id} className="opp-card" style={{display:'flex',flexDirection:'column',gap:'10px'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'8px'}}>
                  <span style={{fontSize:'11px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.04em',color:tcolor,border:`1px solid ${tcolor}`,borderRadius:'6px',padding:'2px 8px'}}>{TYPE_LABEL[s.source_type] || s.source_type}</span>
                  <span style={{fontSize:'11px',fontWeight:600,color:risk.color}}>{risk.label}</span>
                </div>
                <div style={{fontWeight:700,fontSize:'15px'}}>{s.name}</div>
                {s.description && <div style={{fontSize:'13px',color:'var(--muted)',lineHeight:1.5}}>{s.description}</div>}
                <div style={{display:'flex',flexDirection:'column',gap:'4px',fontSize:'12.5px'}}>
                  {s.data_provided && <div><strong style={{color:'var(--text)'}}>Aporta:</strong> <span style={{color:'var(--muted)'}}>{s.data_provided}</span></div>}
                  {s.coverage && <div><strong style={{color:'var(--text)'}}>Cobertura:</strong> <span style={{color:'var(--muted)'}}>{s.coverage}</span></div>}
                  {s.update_frequency && <div><strong style={{color:'var(--text)'}}>Frecuencia:</strong> <span style={{color:'var(--muted)'}}>{s.update_frequency}</span></div>}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'8px',marginTop:'2px'}}>
                  <span style={{fontSize:'11px',fontWeight:600,color: s.is_licensed ? 'var(--success)' : 'var(--muted)',border:'1px solid var(--border)',borderRadius:'6px',padding:'2px 8px'}}>
                    {s.is_licensed ? 'Licenciada' : 'Sin licencia formal'}
                  </span>
                  {s.url && <a href={s.url} target="_blank" rel="noopener noreferrer" style={{fontSize:'12px',color:'var(--accent)',marginLeft:'auto'}}>Visitar fuente →</a>}
                </div>
              </div>
            )
          })}
        </div>

        {/* Fuentes de benchmarks externos */}
        <h3 style={{margin:'28px 0 12px',fontSize:'15px'}}>Fuentes de benchmarks externos ({benchSources.length})</h3>
        <p style={{fontSize:'12.5px',color:'var(--muted)',marginTop:'-6px',marginBottom:'14px',lineHeight:1.5}}>
          Cifras de contexto del ecosistema (inversion, liderazgo femenino, ruralidad, PIB agricola) tomadas de fuentes autoritativas. No son datos capturados por la plataforma: son benchmarks citados.
        </p>
        <div className="panel anim-fade-up">
          <div className="panel-body-flush">
            <table className="data-table">
              <thead><tr><th>Fuente</th><th className="num-col">Indicadores</th><th>Enlace</th></tr></thead>
              <tbody>
                {benchSources.map(b => (
                  <tr key={b.name}>
                    <td style={{fontWeight:600}}>{b.name}</td>
                    <td className="num-col">{b.count}</td>
                    <td>{b.url ? <a href={b.url} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>Ver</a> : <span style={{color:'var(--muted)'}}>-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
