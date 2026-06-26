'use client';
import { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { getDataQuality, getSourcesDetailed, getActorCount, type SourceRow } from '@/lib/queries';

type GovTab = 'modelos' | 'calidad' | 'etica' | 'auditoria';

type DQ = Awaited<ReturnType<typeof getDataQuality>>;

const RISK_LABEL: Record<number, { label: string; cls: string; color: string }> = {
  0: { label: 'Riesgo bajo',  cls: 'risk-low',  color: 'var(--success)' },
  1: { label: 'Riesgo medio', cls: 'risk-med',  color: 'var(--warning)' },
  2: { label: 'Riesgo medio', cls: 'risk-med',  color: 'var(--warning)' },
  3: { label: 'Riesgo alto',  cls: 'risk-high', color: 'var(--danger)' },
};

const COMPLIANCE_INITIAL = {
  privacidad:     [true, true, true, false, false],
  transparencia:  [true, true, false, false],
  auditabilidad:  [true, false, true, false],
  org:            [true, true, false],
};

const WEEKS = ['S1','S2','S3','S4','S5','S6','S7','S8','S9','S10','S11','S12'];
const PREC = [.84,.85,.86,.86,.87,.88,.88,.89,.89,.90,.91,.91];
const REC  = [.80,.81,.82,.83,.84,.84,.85,.86,.86,.87,.88,.88];
const F1   = [.82,.83,.84,.84,.85,.86,.86,.87,.87,.88,.89,.89];
const LAT50 = [55,52,50,48,47,45,44,44,43,42,42,42];
const LAT99 = [180,170,165,155,150,145,140,138,135,132,130,128];

const PAD = {t:15,r:20,b:25,l:40};
const CW = 500 - PAD.l - PAD.r, CH = 200 - PAD.t - PAD.b;

function pts(data: number[], yMin: number, yMax: number) {
  return data.map((v,i) => {
    const x = PAD.l + CW * (i / (data.length-1));
    const y = PAD.t + CH * (1 - (v-yMin)/(yMax-yMin));
    return `${x},${y}`;
  }).join(' ');
}
function grid(yMin: number, yMax: number, fmt: (v:number)=>string) {
  let s = '';
  for (let i=0; i<=4; i++) {
    const y = PAD.t + CH*(i/4), val = yMax - (yMax-yMin)*(i/4);
    s += `<line class="grid-line" x1="${PAD.l}" y1="${y}" x2="${500-PAD.r}" y2="${y}"/>`;
    s += `<text class="axis-label" x="${PAD.l-6}" y="${y+3}" text-anchor="end">${fmt(val)}</text>`;
  }
  WEEKS.forEach((w,i) => {
    const x = PAD.l + CW*(i/(WEEKS.length-1));
    s += `<text class="axis-label" x="${x}" y="196" text-anchor="middle">${w}</text>`;
  });
  return s;
}

const METRIC_GRID = grid(0.75, 0.95, v => v.toFixed(2));
const LAT_GRID   = grid(0, 200, v => `${Math.round(v)}`);
const PREC_PTS   = pts(PREC, 0.75, 0.95);
const REC_PTS    = pts(REC,  0.75, 0.95);
const F1_PTS     = pts(F1,   0.75, 0.95);
const L50_PTS    = pts(LAT50, 0, 200);
const L99_PTS    = pts(LAT99, 0, 200);

const BIAS_CATS   = ['Mujeres founders','Paises peq.','Zonas rurales','Actores locales','Sin web'];
const BIAS_BEFORE = [18, 32, 25, 28, 40];
const BIAS_AFTER  = [28, 38, 35, 36, 40];
const BW = 40, BGAP = 50, BLEFT = 80, BSH = 240;
function bx(i: number) { return BLEFT + i*(BW*2+BGAP); }

export default function GobernanzaPage() {
  const [tab, setTab] = useState<GovTab>('modelos');
  const [alertActive, setAlertActive] = useState([true,true,true,false,true]);
  const [formVisible, setFormVisible] = useState(false);
  const [compliance, setCompliance] = useState(COMPLIANCE_INITIAL);
  const [openSections, setOpenSections] = useState({privacidad:true,transparencia:false,auditabilidad:false,org:false});
  const [biasG, setBiasG] = useState(100);
  const [biasGeo, setBiasGeo] = useState(100);
  const [biasR, setBiasR] = useState(100);

  // Datos reales de Supabase
  const [dq, setDq] = useState<DQ | null>(null);
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [actorTotal, setActorTotal] = useState<number | null>(null);

  useEffect(() => {
    getDataQuality().then(setDq).catch(() => {});
    getSourcesDetailed().then(setSources).catch(() => {});
    getActorCount().then(setActorTotal).catch(() => {});
  }, []);

  const licensedCount = sources.filter(s => s.is_licensed).length;
  const lowRiskCount = sources.filter(s => s.risk_tier <= 1).length;

  function toggleCheck(sec: keyof typeof compliance, idx: number) {
    const arr = [...compliance[sec]]; arr[idx] = !arr[idx];
    setCompliance({...compliance, [sec]: arr});
  }
  function toggleSection(s: keyof typeof openSections) {
    setOpenSections({...openSections, [s]: !openSections[s]});
  }
  function toggleAlert(i: number) {
    const a = [...alertActive]; a[i] = !a[i]; setAlertActive(a);
  }

  const allChecks = [...compliance.privacidad,...compliance.transparencia,...compliance.auditabilidad,...compliance.org];
  const totalPct  = Math.round(allChecks.filter(Boolean).length / allChecks.length * 100);
  const ringOffset = Math.round(188.5*(1-totalPct/100));
  function secPct(arr: boolean[]) { return Math.round(arr.filter(Boolean).length/arr.length*100); }

  const biasScaled = [
    Math.min(100, BIAS_AFTER[0]*biasG/100),
    Math.min(100, BIAS_AFTER[1]*biasGeo/100),
    Math.min(100, BIAS_AFTER[2]*biasR/100),
    Math.min(100, BIAS_AFTER[3]*((biasG+biasGeo)/200)),
    BIAS_AFTER[4],
  ];

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Gobernanza IA</span>
          </div>
          <h1>Gobernanza IA</h1>
        </div>
      </header>
      <div className="content">
      <div className="page-intro anim-fade-up">
        <h2>Gobernanza y calidad de los datos</h2>
        <p>Gobernanza real del mapeo: cada actor conserva su fuente de origen y nivel de confianza, y las fuentes se clasifican por licencia y nivel de riesgo. La pestana Calidad refleja metricas computadas del dataset real. La automatizacion con modelos de IA (clasificacion, deteccion de sesgos) es parte del roadmap: las series de desempeno que se muestran abajo son ilustrativas, no de modelos en produccion.</p>
      </div>

      <div className="ai-banner anim-fade-up delay-1">
        <div className="ai-banner-content">
          <div>
            <div className="ai-status-row"><div className="ai-status-dot"></div><span className="ai-status-label">TRAZABILIDAD DE FUENTES ACTIVA</span></div>
            <h3>Cada dato es trazable a su fuente</h3>
            <p>Los {actorTotal ?? '...'} actores del directorio incluyen su URL de origen y un nivel de confianza. Las {sources.length || '...'} fuentes se gobiernan por licencia y nivel de riesgo (ver pestana Calidad de datos). Las metricas de modelos de IA a continuacion son ilustrativas del roadmap, no de modelos en produccion.</p>
          </div>
          <div className="ai-metrics">
            <div className="ai-metric"><div className="ai-metric-val">{actorTotal ?? '...'}</div><div className="ai-metric-label">Actores trazables</div></div>
            <div className="ai-metric"><div className="ai-metric-val">{dq ? `${dq.avgConfidence}%` : '...'}</div><div className="ai-metric-label">Confianza prom.</div></div>
            <div className="ai-metric"><div className="ai-metric-val">{licensedCount}/{sources.length || '...'}</div><div className="ai-metric-label">Fuentes con licencia</div></div>
          </div>
        </div>
      </div>

      <div className="tabs anim-fade-up delay-2">
        {(['modelos','calidad','etica','auditoria'] as GovTab[]).map(t => (
          <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setTab(t)}>
            {t==='modelos'?'Modelos IA':t==='calidad'?'Calidad de datos':t==='etica'?'Etica y sesgos':'Registro de auditoria'}
          </button>
        ))}
      </div>

      {/* TAB: Modelos IA */}
      <div className={`tab-content${tab==='modelos'?' active':''}`}>
        <div className="roadmap-notice anim-fade-up" style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',marginBottom:16,borderRadius:10,background:'rgba(139,92,246,.08)',border:'1px dashed rgba(139,92,246,.4)',fontSize:13,color:'var(--muted)'}}>
          <span style={{flexShrink:0,fontWeight:700,fontSize:11,letterSpacing:.5,padding:'3px 8px',borderRadius:6,background:'rgba(139,92,246,.15)',color:'#8b5cf6'}}>ROADMAP</span>
          <span>Los modelos de IA y sus metricas (F1, predicciones, A/B tests, latencia) son ilustrativos del roadmap, no de sistemas en produccion. Para datos verificables ver la pestana <strong>Calidad de datos</strong>.</span>
        </div>
        <div className="gov-grid anim-fade-up delay-3">
          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
            <div className="gov-title">Modelo de clasificacion de actores</div>
            <div className="gov-desc">Clasifica automaticamente nuevos actores en las 9 categorias del ecosistema (startups, inversores, ESOs, etc.) usando NLP sobre descripciones y metadata.</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>Activo - v2.3</div>
            <div className="gov-meta"><span>F1-Score: 0.91</span><span>Ultima actualizacion: Jun 22</span><span>12,450 predicciones</span></div>
          </div>
          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg></div>
            <div className="gov-title">Detector de tendencias emergentes</div>
            <div className="gov-desc">Monitorea noticias, redes sociales y publicaciones para detectar tendencias emergentes en AgriTech LATAM y genera alertas automaticas.</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>Activo - v1.8</div>
            <div className="gov-meta"><span>Precision: 87%</span><span>154 alertas/semana</span><span>24/7 monitoring</span></div>
          </div>
          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></div>
            <div className="gov-title">Motor de actualizacion de perfiles</div>
            <div className="gov-desc">Actualiza semi-automaticamente perfiles de actores cruzando datos de multiples fuentes (Crunchbase, LinkedIn, registros oficiales).</div>
            <div className="gov-status status-warn"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',display:'inline-block'}}></span>Revision pendiente</div>
            <div className="gov-meta"><span>Accuracy: 84%</span><span>Revisar antes de Jul 1</span><span>2,847 perfiles</span></div>
          </div>
          <div className="gov-card cat-data">
            <div className="gov-icon" style={{background:'var(--accent-soft)',color:'var(--accent)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
            <div className="gov-title">Detector de duplicados</div>
            <div className="gov-desc">Identifica registros duplicados o similares en el directorio usando comparacion fuzzy y embedding similarity.</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>Activo - v1.5</div>
            <div className="gov-meta"><span>134 duplicados detectados</span><span>99.1% precision</span></div>
          </div>
          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div>
            <div className="gov-title">Monitor de sesgo de genero</div>
            <div className="gov-desc">Verifica que los modelos no subrepresenten startups lideradas por mujeres. Meta TOR: 40% participacion femenina en aceleracion.</div>
            <div className="gov-status status-warn"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',display:'inline-block'}}></span>Alerta: 18% actual vs 40% meta</div>
            <div className="gov-meta"><span>Gap: 3.2x</span><span>512 startups mujeres</span><span>Correccion activa</span></div>
          </div>
          <div className="gov-card cat-security">
            <div className="gov-icon" style={{background:'rgba(239,68,68,.1)',color:'var(--danger)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
            <div className="gov-title">Seguridad y privacidad</div>
            <div className="gov-desc">Anonimizacion de datos sensibles, control de acceso basado en roles, y encriptacion de datos personales de actores del ecosistema.</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>Compliance OK</div>
            <div className="gov-meta"><span>GDPR/HABEAS compliant</span><span>0 incidentes</span></div>
          </div>
        </div>
      </div>

      {/* TAB: Calidad de datos */}
      <div className={`tab-content${tab==='calidad'?' active':''}`}>
        <div className="panel anim-fade-up">
          <div className="panel-header">
            <span className="panel-title">Metricas de calidad de datos</span>
            <span style={{fontSize:12,color:'var(--muted)'}}>Computadas del dataset real{dq ? ` (${dq.total} actores aprobados)` : ''}</span>
          </div>
          <div className="ring-grid">
            {(dq ? [
              {label:'Completitud', val:dq.completeness, color:'var(--accent)'},
              {label:'Validacion humana', val:dq.validatedPct, color:'#6366f1'},
              {label:'Frescura (90d)', val:dq.freshness, color:'#ec4899'},
              {label:'Confianza prom.', val:dq.avgConfidence, color:'var(--warning)'},
            ] : [
              {label:'Completitud', val:0, color:'var(--accent)'},
              {label:'Validacion humana', val:0, color:'#6366f1'},
              {label:'Frescura (90d)', val:0, color:'#ec4899'},
              {label:'Confianza prom.', val:0, color:'var(--warning)'},
            ]).map(r => (
              <div key={r.label} className="ring-item">
                <svg className="ring-svg" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                  <circle cx="40" cy="40" r="32" fill="none" stroke={r.color} strokeWidth="6" strokeDasharray="201" strokeDashoffset={Math.round(201*(1-r.val/100))} strokeLinecap="round" transform="rotate(-90 40 40)"/>
                </svg>
                <div className="ring-label">{r.label}</div>
                <div className="ring-val" style={{color:r.color}}>{r.val}%</div>
              </div>
            ))}
          </div>
        </div>
        <div className="panel anim-fade-up delay-1">
          <div className="panel-header"><span className="panel-title">Completitud por campo</span><span style={{fontSize:12,color:'var(--muted)'}}>Sobre {dq?.total ?? '...'} actores</span></div>
          <table className="data-table">
            <thead><tr><th>Campo</th><th>Registros totales</th><th>Completos</th><th>Vacios</th><th>Completitud</th></tr></thead>
            <tbody>
              {dq && [
                {c:'Sitio web', ok:dq.withWebsite, p:dq.websitePct},
                {c:'Descripcion', ok:dq.withDesc, p:dq.descPct},
                {c:'Pais', ok:dq.withCountry, p:dq.countryPct},
                {c:'Validacion humana', ok:dq.validated, p:dq.validatedPct},
                {c:'Area tematica', ok:dq.withTheme, p:dq.themePct},
                {c:'Coordenadas (lat/lng)', ok:dq.withCoords, p:dq.coordsPct},
                {c:'Ano de fundacion', ok:dq.withFounded, p:dq.foundedPct},
                {c:'Cadena de valor', ok:dq.withChain, p:dq.chainPct},
              ].sort((a,b)=>b.p-a.p).map(row => {
                const vac = dq.total - row.ok;
                const vc = row.p < 50 ? 'var(--danger)' : row.p < 80 ? 'var(--warning)' : '';
                return (
                  <tr key={row.c}>
                    <td>{row.c}</td>
                    <td className="num-col">{dq.total}</td>
                    <td className="num-col">{row.ok}</td>
                    <td className="num-col" style={vc?{color:vc}:{}}>{vac}</td>
                    <td className="num-col">{row.p}%</td>
                  </tr>
                );
              })}
              {!dq && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--muted)',padding:24}}>Cargando datos reales...</td></tr>}
            </tbody>
          </table>
        </div>

        {/* Fuentes y cumplimiento (real, desde getSourcesDetailed) */}
        <div className="panel anim-fade-up delay-2">
          <div className="panel-header">
            <span className="panel-title">Fuentes y cumplimiento</span>
            <span style={{fontSize:12,color:'var(--muted)'}}>{sources.length ? `${licensedCount}/${sources.length} con licencia - ${lowRiskCount}/${sources.length} riesgo bajo/medio` : 'Cargando...'}</span>
          </div>
          <table className="data-table">
            <thead><tr><th>Fuente</th><th>Tipo</th><th>Licencia</th><th>Nivel de riesgo</th><th>Cobertura</th></tr></thead>
            <tbody>
              {sources.map(s => {
                const risk = RISK_LABEL[s.risk_tier] ?? RISK_LABEL[2];
                return (
                  <tr key={s.id}>
                    <td>{s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" style={{color:'var(--accent)'}}>{s.name}</a> : s.name}</td>
                    <td style={{textTransform:'capitalize',color:'var(--muted)'}}>{(s.source_type||'').replace(/_/g,' ')}</td>
                    <td>
                      <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,padding:'2px 8px',borderRadius:6,background:s.is_licensed?'rgba(16,185,129,.1)':'rgba(148,163,184,.12)',color:s.is_licensed?'var(--success)':'var(--muted)'}}>
                        {s.is_licensed ? 'Con licencia' : 'Sin licencia'}
                      </span>
                    </td>
                    <td>
                      <span style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:12,fontWeight:600,padding:'2px 8px',borderRadius:6,background:`color-mix(in srgb, ${risk.color} 12%, transparent)`,color:risk.color}}>
                        <span style={{width:6,height:6,borderRadius:'50%',background:risk.color,display:'inline-block'}}></span>{risk.label} (T{s.risk_tier})
                      </span>
                    </td>
                    <td style={{color:'var(--muted)',fontSize:13}}>{s.coverage || '-'}</td>
                  </tr>
                );
              })}
              {!sources.length && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--muted)',padding:24}}>Cargando fuentes...</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {/* TAB: Etica y sesgos */}
      <div className={`tab-content${tab==='etica'?' active':''}`}>
        <div className="gov-grid anim-fade-up">
          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
            <div className="gov-title">Representacion de genero</div>
            <div className="gov-desc">Las recomendaciones del modelo deben asegurar representacion equitativa. Meta: 40% startups lideradas por mujeres en programa de aceleracion.</div>
            <div className="gov-status status-warn"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--warning)',display:'inline-block'}}></span>Requiere atencion</div>
            <div className="gov-meta"><span>18% actual</span><span>40% objetivo</span><span>Gap: 22pp</span></div>
          </div>
          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10"/></svg></div>
            <div className="gov-title">Representacion geografica</div>
            <div className="gov-desc">Verificar que los modelos no favorezcan paises con mas datos disponibles (Colombia) sobre paises con menor cobertura (Honduras, Panama).</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>Balanceado</div>
            <div className="gov-meta"><span>Gini: 0.12</span><span>6 paises cubiertos</span></div>
          </div>
          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <div className="gov-title">Sesgo zonas rurales vs urbanas</div>
            <div className="gov-desc">Los modelos tienden a subrepresentar actores en zonas rurales y prioritarias. Correccion activa para La Guajira, Morazan, Alta Verapaz.</div>
            <div className="gov-status status-review"><span style={{width:6,height:6,borderRadius:'50%',background:'#6366f1',display:'inline-block'}}></span>En revision</div>
            <div className="gov-meta"><span>Factor correccion: 1.4x</span><span>6 zonas prioritarias</span></div>
          </div>
          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg></div>
            <div className="gov-title">Privacidad y consentimiento</div>
            <div className="gov-desc">Todos los datos personales requieren consentimiento explicito. Auto-registro incluye opt-in para uso de IA en clasificacion y recomendaciones.</div>
            <div className="gov-status status-ok"><span style={{width:6,height:6,borderRadius:'50%',background:'var(--success)',animation:'dotPulse 2s ease-in-out infinite',display:'inline-block'}}></span>100% consentido</div>
            <div className="gov-meta"><span>2,847 consentimientos</span><span>0 solicitudes de eliminacion</span></div>
          </div>
        </div>
      </div>

      {/* TAB: Registro de auditoria */}
      <div className={`tab-content${tab==='auditoria'?' active':''}`}>
        <div className="roadmap-notice anim-fade-up" style={{display:'flex',alignItems:'center',gap:10,padding:'12px 16px',marginBottom:16,borderRadius:10,background:'rgba(139,92,246,.08)',border:'1px dashed rgba(139,92,246,.4)',fontSize:13,color:'var(--muted)'}}>
          <span style={{flexShrink:0,fontWeight:700,fontSize:11,letterSpacing:.5,padding:'3px 8px',borderRadius:6,background:'rgba(139,92,246,.15)',color:'#8b5cf6'}}>ROADMAP</span>
          <span>Eventos de auditoria ilustrativos de como se veria el log cuando los modelos de IA esten en produccion. La trazabilidad real disponible hoy esta en la pestana <strong>Calidad de datos</strong>.</span>
        </div>
        <div className="panel anim-fade-up">
          <div className="panel-header"><span className="panel-title">Registro de auditoria de IA</span><span style={{fontSize:12,color:'var(--muted)'}}>Ejemplo ilustrativo</span></div>
          <div>
            {[
              {bg:'rgba(16,185,129,.1)',c:'var(--success)',title:'Ciclo de actualizacion completado',desc:'Motor de actualizacion proceso 234 perfiles. 18 nuevos actores detectados, 45 actualizados, 2 marcados para revision manual.',time:'Hace 4h'},
              {bg:'rgba(245,158,11,.1)',c:'var(--warning)',title:'Alerta de sesgo de genero',desc:'El modelo de recomendacion mostro sesgo del 12% contra startups con fundadoras mujeres. Se aplico correccion de peso.',time:'Hace 1d'},
              {bg:'rgba(99,102,241,.1)',c:'#6366f1',title:'Modelo v2.3 desplegado',desc:'Nueva version del clasificador de actores con mejora en precision para categorias Redes y comunidades y Organismos internacionales.',time:'Hace 3d'},
              {bg:'rgba(16,185,129,.1)',c:'var(--success)',title:'Revision trimestral de sesgos completada',desc:'Auditoria Q2 2026: sesgo geografico dentro de limites aceptables (Gini 0.12). Sesgo de genero requiere accion correctiva.',time:'Hace 5d'},
              {bg:'rgba(239,68,68,.1)',c:'var(--danger)',title:'134 duplicados eliminados',desc:'El detector de duplicados identifico y mergeo 134 registros duplicados. Todos verificados manualmente antes de la eliminacion.',time:'Hace 1sem'},
              {bg:'rgba(16,185,129,.1)',c:'var(--success)',title:'Auditoria de seguridad aprobada',desc:'Revision de seguridad y privacidad de datos. Cumplimiento con politicas de proteccion de datos de TechnoServe y BID Lab.',time:'Hace 2sem'},
            ].map((a,i) => (
              <div key={i} className="audit-item">
                <div className="audit-icon" style={{background:a.bg,color:a.c}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div className="audit-body">
                  <div className="audit-title">{a.title}</div>
                  <div className="audit-desc">{a.desc}</div>
                </div>
                <div className="audit-time">{a.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURE 1: Model Performance Dashboard */}
      <div className="model-perf-dashboard panel anim-fade-up">
        <div className="panel-header">
          <span className="panel-title">Dashboard de rendimiento de modelos <span style={{fontSize:10,fontWeight:700,letterSpacing:.5,padding:'2px 7px',borderRadius:5,background:'rgba(139,92,246,.15)',color:'#8b5cf6',verticalAlign:'middle'}}>ROADMAP</span></span>
          <span style={{fontSize:12,color:'var(--muted)'}}>Series ilustrativas</span>
        </div>
        <div className="panel-body">
          <div className="perf-charts">
            <div className="perf-chart-card">
              <div className="perf-chart-title">Precision / Recall / F1-Score</div>
              <div className="perf-chart-subtitle">Clasificador de actores v2.3</div>
              <svg className="perf-chart-svg" viewBox="0 0 500 200" dangerouslySetInnerHTML={{__html:
                METRIC_GRID +
                `<polyline class="data-line" points="${PREC_PTS}" stroke="#8b5cf6"/>` +
                `<polyline class="data-line" points="${REC_PTS}" stroke="var(--accent)" style="animation-delay:.2s"/>` +
                `<polyline class="data-line" points="${F1_PTS}" stroke="#ec4899" style="animation-delay:.4s"/>`
              }}/>
              <div className="perf-legend">
                <span className="perf-legend-item"><span className="perf-legend-dot" style={{background:'#8b5cf6'}}></span>Precision</span>
                <span className="perf-legend-item"><span className="perf-legend-dot" style={{background:'var(--accent)'}}></span>Recall</span>
                <span className="perf-legend-item"><span className="perf-legend-dot" style={{background:'#ec4899'}}></span>F1-Score</span>
              </div>
              <div className="perf-current-vals">
                <span className="perf-val-chip" style={{color:'#8b5cf6'}}><span className="perf-legend-dot" style={{background:'#8b5cf6'}}></span>0.91</span>
                <span className="perf-val-chip" style={{color:'var(--accent)'}}><span className="perf-legend-dot" style={{background:'var(--accent)'}}></span>0.88</span>
                <span className="perf-val-chip" style={{color:'#ec4899'}}><span className="perf-legend-dot" style={{background:'#ec4899'}}></span>0.89</span>
              </div>
            </div>
            <div className="perf-chart-card">
              <div className="perf-chart-title">Latencia de inferencia</div>
              <div className="perf-chart-subtitle">Tiempo promedio de respuesta (ms)</div>
              <svg className="perf-chart-svg" viewBox="0 0 500 200" dangerouslySetInnerHTML={{__html:
                LAT_GRID +
                `<polyline class="data-line" points="${L50_PTS}" stroke="var(--warning)"/>` +
                `<polyline class="data-line" points="${L99_PTS}" stroke="var(--danger)" style="animation-delay:.2s"/>`
              }}/>
              <div className="perf-legend">
                <span className="perf-legend-item"><span className="perf-legend-dot" style={{background:'var(--warning)'}}></span>Latencia p50</span>
                <span className="perf-legend-item"><span className="perf-legend-dot" style={{background:'var(--danger)'}}></span>Latencia p99</span>
              </div>
              <div className="perf-current-vals">
                <span className="perf-val-chip" style={{color:'var(--warning)'}}><span className="perf-legend-dot" style={{background:'var(--warning)'}}></span>42ms</span>
                <span className="perf-val-chip" style={{color:'var(--danger)'}}><span className="perf-legend-dot" style={{background:'var(--danger)'}}></span>128ms</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 2: A/B Tests */}
      <div className="ab-test-panel panel anim-fade-up">
        <div className="panel-header">
          <span className="panel-title">Resultados de pruebas A/B <span style={{fontSize:10,fontWeight:700,letterSpacing:.5,padding:'2px 7px',borderRadius:5,background:'rgba(139,92,246,.15)',color:'#8b5cf6',verticalAlign:'middle'}}>ROADMAP</span></span>
          <span style={{fontSize:12,color:'var(--muted)'}}>Ejemplo ilustrativo</span>
        </div>
        <div className="ab-grid">
          <div className="ab-card">
            <div className="ab-card-header"><div className="ab-card-title">Clasificador v2 vs v1</div><span className="ab-winner-badge">Ganador: v2</span></div>
            <div className="ab-variants">
              <div className="ab-variant"><div className="ab-variant-name">Control (v1)</div><div className="ab-variant-metric" style={{color:'var(--muted)'}}>85.2%</div><div className="ab-variant-sub">n = 6,240</div></div>
              <div className="ab-variant" style={{borderColor:'var(--accent)'}}><div className="ab-variant-name" style={{color:'var(--accent)'}}>Variante (v2)</div><div className="ab-variant-metric" style={{color:'var(--accent)'}}>91.0%</div><div className="ab-variant-sub">n = 6,210</div></div>
            </div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Control</span><span>85.2%</span></div><div className="ab-bar-track"><div className="ab-bar-fill a" style={{width:'85.2%'}}></div></div></div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Variante</span><span>91.0%</span></div><div className="ab-bar-track"><div className="ab-bar-fill b" style={{width:'91%'}}></div></div></div>
            <div className="ab-confidence">Confianza: <span className="ab-confidence-val" style={{color:'var(--success)'}}>99.7%</span> &mdash; Mejora relativa: +6.8%</div>
          </div>
          <div className="ab-card">
            <div className="ab-card-header"><div className="ab-card-title">Nuevo detector de duplicados</div><span className="ab-running-badge">En curso</span></div>
            <div className="ab-variants">
              <div className="ab-variant"><div className="ab-variant-name">Fuzzy match</div><div className="ab-variant-metric">96.1%</div><div className="ab-variant-sub">n = 1,820</div></div>
              <div className="ab-variant"><div className="ab-variant-name">Embedding sim.</div><div className="ab-variant-metric">97.8%</div><div className="ab-variant-sub">n = 1,795</div></div>
            </div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Fuzzy match</span><span>96.1%</span></div><div className="ab-bar-track"><div className="ab-bar-fill a" style={{width:'96.1%'}}></div></div></div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Embedding sim.</span><span>97.8%</span></div><div className="ab-bar-track"><div className="ab-bar-fill b" style={{width:'97.8%'}}></div></div></div>
            <div className="ab-confidence">Confianza: <span className="ab-confidence-val" style={{color:'var(--warning)'}}>87.3%</span> &mdash; Necesita mas datos</div>
          </div>
          <div className="ab-card">
            <div className="ab-card-header"><div className="ab-card-title">Motor de actualizacion optimizado</div><span className="ab-running-badge">En curso</span></div>
            <div className="ab-variants">
              <div className="ab-variant"><div className="ab-variant-name">Batch (actual)</div><div className="ab-variant-metric">84.0%</div><div className="ab-variant-sub">n = 2,100</div></div>
              <div className="ab-variant"><div className="ab-variant-name">Streaming</div><div className="ab-variant-metric">86.5%</div><div className="ab-variant-sub">n = 2,080</div></div>
            </div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Batch</span><span>84.0%</span></div><div className="ab-bar-track"><div className="ab-bar-fill a" style={{width:'84%'}}></div></div></div>
            <div className="ab-bar-wrap"><div className="ab-bar-label"><span>Streaming</span><span>86.5%</span></div><div className="ab-bar-track"><div className="ab-bar-fill b" style={{width:'86.5%'}}></div></div></div>
            <div className="ab-confidence">Confianza: <span className="ab-confidence-val" style={{color:'var(--warning)'}}>72.1%</span> &mdash; Latencia -34% streaming</div>
          </div>
        </div>
      </div>

      {/* FEATURE 3: Bias Simulator */}
      <div className="bias-simulator panel anim-fade-up">
        <div className="panel-header">
          <span className="panel-title">Simulador de correccion de sesgos <span style={{fontSize:10,fontWeight:700,letterSpacing:.5,padding:'2px 7px',borderRadius:5,background:'rgba(139,92,246,.15)',color:'#8b5cf6',verticalAlign:'middle'}}>ROADMAP</span></span>
          <span style={{fontSize:12,color:'var(--muted)'}}>Ajuste interactivo (ilustrativo)</span>
        </div>
        <div className="bias-sim-body">
          <div className="bias-controls">
            {[
              {label:'Peso de correccion: Genero', val:biasG, set:setBiasG},
              {label:'Peso de correccion: Geografia', val:biasGeo, set:setBiasGeo},
              {label:'Peso de correccion: Rural / Urbano', val:biasR, set:setBiasR},
            ].map(({label,val,set}) => (
              <div key={label} className="bias-slider-group">
                <label>{label}</label>
                <div className="slider-row">
                  <input type="range" min={0} max={200} value={val} onChange={e => set(Number(e.target.value))}/>
                  <span className="bias-slider-val">{(val/100).toFixed(2)}</span>
                </div>
              </div>
            ))}
            <button className="bias-reset-btn" onClick={() => {setBiasG(100);setBiasGeo(100);setBiasR(100);}}>Restablecer valores</button>
            <div className="bias-impact">
              <div className="bias-impact-title">Vista previa del impacto</div>
              <div className="bias-impact-text">
                {biasG===100&&biasGeo===100&&biasR===100
                  ? 'Ajuste los pesos para ver como cambian las distribuciones de representacion en el ecosistema.'
                  : `Correcciones activas: genero x${(biasG/100).toFixed(2)}, geografia x${(biasGeo/100).toFixed(2)}, rural x${(biasR/100).toFixed(2)}. La representacion de grupos subrepresentados aumenta en las recomendaciones.`}
              </div>
            </div>
          </div>
          <div className="bias-chart-area">
            <svg className="bias-chart-svg" viewBox={`0 0 500 ${BSH}`}>
              {BIAS_CATS.map((cat,i) => {
                const x = bx(i);
                const maxH = BSH - 40;
                const bfH  = (BIAS_BEFORE[i]/100)*maxH;
                const afH  = (Math.min(100,biasScaled[i])/100)*maxH;
                return (
                  <g key={cat}>
                    <rect className="bar-before" x={x} y={BSH-20-bfH} width={BW} height={bfH}/>
                    <rect className="bar-after"  x={x+BW+2} y={BSH-20-afH} width={BW} height={afH}/>
                    <text className="bar-label" x={x+BW} y={BSH-4} textAnchor="middle" fontSize="9">{cat.split(' ')[0]}</text>
                    <text className="bar-value" x={x+BW/2}   y={BSH-22-bfH} textAnchor="middle">{BIAS_BEFORE[i]}%</text>
                    <text className="bar-value" x={x+BW+2+BW/2} y={BSH-22-afH} textAnchor="middle">{Math.round(Math.min(100,biasScaled[i]))}%</text>
                  </g>
                );
              })}
            </svg>
            <div className="bias-legend">
              <span className="legend-before">Sin correccion</span>
              <span className="legend-after">Con correccion</span>
            </div>
          </div>
        </div>
      </div>

      {/* FEATURE 4: Alert Rules */}
      <div className="alert-rules panel anim-fade-up">
        <div className="panel-header">
          <span className="panel-title">Reglas de alerta automatizadas</span>
          <span style={{fontSize:12,color:'var(--muted)'}}>Monitoreo de modelos</span>
        </div>
        <div className="alert-rules-list">
          {[
            {name:'Caida de precision',cond:'Si F1-Score cae por debajo del umbral',thresh:'< 0.85'},
            {name:'Latencia elevada',cond:'Si latencia p99 supera el umbral',thresh:'> 200ms'},
            {name:'Sesgo de genero',cond:'Si indice de sesgo supera el limite',thresh:'> 0.10'},
            {name:'Tasa de duplicados',cond:'Si duplicados nuevos por dia supera',thresh:'> 25/dia'},
            {name:'Datos incompletos',cond:'Si completitud cae por debajo del umbral',thresh:'< 80%'},
          ].map((rule,i) => (
            <div key={rule.name} className="alert-rule-card">
              <div className="alert-rule-info">
                <div className="alert-rule-name">{rule.name}</div>
                <div className="alert-rule-cond">{rule.cond}</div>
              </div>
              <span className="alert-rule-threshold">{rule.thresh}</span>
              <div className="alert-rule-actions">
                <div className="alert-channel-icon" style={{background:'rgba(99,102,241,.1)',color:'#6366f1'}}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <button
                  className={`alert-toggle${alertActive[i]?' active':''}`}
                  onClick={() => toggleAlert(i)}
                  style={alertActive[i]?{background:'var(--accent)'}:{}}
                ></button>
              </div>
            </div>
          ))}
        </div>
        {formVisible && (
          <div className="alert-inline-form visible">
            <div className="alert-form-row">
              <input type="text" placeholder="Nombre de la regla"/>
              <input type="text" placeholder="Condicion (ej: accuracy &lt; 0.80)"/>
            </div>
            <div className="alert-form-row">
              <input type="text" placeholder="Valor umbral"/>
              <select><option value="slack">Slack</option><option value="email">Email</option><option value="webhook">Webhook</option></select>
            </div>
            <div className="alert-form-actions">
              <button className="alert-form-cancel" onClick={() => setFormVisible(false)}>Cancelar</button>
              <button className="alert-form-save" onClick={() => setFormVisible(false)}>Guardar regla</button>
            </div>
          </div>
        )}
        <button className="alert-add-btn" onClick={() => setFormVisible(true)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{width:14,height:14}}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Agregar regla
        </button>
      </div>

      {/* FEATURE 5: Compliance Checklist */}
      <div className="compliance-checklist panel anim-fade-up">
        <div className="panel-header">
          <span className="panel-title">Checklist de cumplimiento</span>
          <span style={{fontSize:12,color:'var(--muted)'}}>Gobernanza IA</span>
        </div>
        <div className="compliance-overall">
          <div className="compliance-ring-wrap">
            <svg className="compliance-ring-svg" viewBox="0 0 72 72">
              <circle className="compliance-ring-bg" cx="36" cy="36" r="30"/>
              <circle className="compliance-ring-fg" cx="36" cy="36" r="30" strokeDasharray="188.5" strokeDashoffset={ringOffset}/>
            </svg>
            <div className="compliance-ring-text">{totalPct}%</div>
          </div>
          <div className="compliance-overall-info">
            <h4>Cumplimiento general de gobernanza IA</h4>
            <p>Marque los elementos completados para actualizar el progreso de cada seccion y el porcentaje total.</p>
          </div>
        </div>
        <div className="compliance-sections">
          {([
            {key:'privacidad' as const, label:'Privacidad de datos', iconBg:'rgba(239,68,68,.1)', iconColor:'var(--danger)',
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
              items:['Politica de privacidad publicada y accesible','Consentimiento explicito para procesamiento de datos','Anonimizacion de datos personales en modelos','Protocolo de eliminacion de datos implementado','Auditoria de acceso a datos completada Q2 2026']},
            {key:'transparencia' as const, label:'Transparencia del modelo', iconBg:'rgba(99,102,241,.1)', iconColor:'#6366f1',
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
              items:['Model cards documentadas para cada modelo','Explicabilidad de decisiones (SHAP/LIME)','Dashboard publico de metricas de rendimiento','Documentacion de datos de entrenamiento']},
            {key:'auditabilidad' as const, label:'Auditabilidad', iconBg:'rgba(245,158,11,.1)', iconColor:'var(--warning)',
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
              items:['Log de decisiones de IA con trazabilidad','Versionado de modelos con rollback','Revision trimestral por comite de gobernanza','Tests de regresion automatizados en pipeline']},
            {key:'org' as const, label:'Gobernanza organizacional', iconBg:'rgba(0,167,157,.1)', iconColor:'var(--accent)',
              icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
              items:['Comite de gobernanza IA establecido','Roles y responsabilidades definidos (RACI)','Plan de respuesta a incidentes de IA']},
          ]).map(sec => {
            const checks = compliance[sec.key];
            const pct = secPct(checks);
            const isOpen = openSections[sec.key];
            return (
              <div key={sec.key} className={`compliance-section${isOpen?' open':''}`}>
                <div className="compliance-section-header" onClick={() => toggleSection(sec.key)}>
                  <div className="compliance-section-left">
                    <div className="compliance-section-icon" style={{background:sec.iconBg,color:sec.iconColor}}>{sec.icon}</div>
                    <span className="compliance-section-name">{sec.label}</span>
                  </div>
                  <div className="compliance-section-right">
                    <div className="compliance-section-progress"><div className="compliance-section-bar" style={{width:`${pct}%`}}></div></div>
                    <span className="compliance-section-pct">{pct}%</span>
                    <span className="compliance-section-chevron"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg></span>
                  </div>
                </div>
                <div className="compliance-items">
                  {sec.items.map((item,idx) => (
                    <div key={item} className="compliance-item">
                      <div className={`compliance-check${checks[idx]?' checked':''}`} onClick={() => toggleCheck(sec.key,idx)}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                      </div>
                      <span className={`compliance-item-text${checks[idx]?' done':''}`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </AppLayout>
  );
}
