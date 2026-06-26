import AppLayout from '@/components/AppLayout'

export const revalidate = 60

export default function FuentesPage() {
  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Fuentes</span>
          </div>
          <h1>Fuentes de datos</h1>
        </div>
        <button className="btn btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar
        </button>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Gestion integral de fuentes</h2>
          <p>Sistema de trazabilidad y monitoreo de todas las fuentes de datos que alimentan el ecosistema AgriTech. Entrevistas, bases de datos externas, encuestas y recopilacion por IA, integradas y validadas en tiempo real.</p>
        </div>

        <div className="stats-grid-4 anim-fade-up delay-1">
          <div className="stat-card">
            <div className="stat-card-icon" style={{background:'var(--accent-soft)',color:'var(--accent)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-val">47 <span style={{fontSize:'14px',color:'var(--muted)',fontWeight:400}}>/ 60</span></div>
              <div className="stat-card-label">Entrevistas</div>
              <div className="stat-card-sub">78% completadas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{background:'rgba(99,102,241,.1)',color:'#6366f1'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-val">18</div>
              <div className="stat-card-label">Bases de datos</div>
              <div className="stat-card-sub">12 activas</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-val">324</div>
              <div className="stat-card-label">Encuestas</div>
              <div className="stat-card-sub">Respuestas totales</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon" style={{background:'rgba(245,158,11,.1)',color:'var(--warning)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="stat-card-body">
              <div className="stat-card-val">9</div>
              <div className="stat-card-label">Fuentes IA</div>
              <div className="stat-card-sub">Activas 24/7</div>
            </div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-2">
          <div className="panel-header"><span className="panel-title">Pipeline de datos</span></div>
          <div className="pipeline">
            <div className="pipeline-step"><div className="pipeline-val">156</div><div className="pipeline-label">Recopilados</div></div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step"><div className="pipeline-val">134</div><div className="pipeline-label">Validados</div></div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step"><div className="pipeline-val">118</div><div className="pipeline-label">Procesados</div></div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step"><div className="pipeline-val">95</div><div className="pipeline-label">Integrados</div></div>
            <div className="pipeline-arrow">→</div>
            <div className="pipeline-step active"><div className="pipeline-val">87</div><div className="pipeline-label">Publicados</div></div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-2">
          <div className="panel-header"><span className="panel-title">Linaje de datos</span></div>
          <div className="lineage-container" style={{overflowX:'auto'}}>
            <svg viewBox="0 0 900 120" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',minWidth:'700px'}}>
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="var(--accent)" />
                </marker>
              </defs>
              <path d="M160,60 L220,60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" fill="none" strokeDasharray="4 2"/>
              <path d="M340,60 L400,60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" fill="none" strokeDasharray="4 2"/>
              <path d="M520,60 L580,60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" fill="none" strokeDasharray="4 2"/>
              <path d="M700,60 L760,60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#arr)" fill="none" strokeDasharray="4 2"/>
              <rect x="20" y="30" width="140" height="60" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth="1.5"/>
              <text x="90" y="55" textAnchor="middle" fill="var(--accent)" fontSize="12" fontWeight="600">Entrevistas</text>
              <text x="90" y="72" textAnchor="middle" fill="var(--accent)" fontSize="10">47 completadas</text>
              <rect x="220" y="30" width="120" height="60" rx="8" fill="rgba(99,102,241,.08)" stroke="#6366f1" strokeWidth="1.5"/>
              <text x="280" y="55" textAnchor="middle" fill="#6366f1" fontSize="12" fontWeight="600">Validacion</text>
              <text x="280" y="72" textAnchor="middle" fill="#6366f1" fontSize="10">134 aprobados</text>
              <rect x="400" y="30" width="120" height="60" rx="8" fill="rgba(236,72,153,.08)" stroke="#ec4899" strokeWidth="1.5"/>
              <text x="460" y="52" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="600">Clasificacion</text>
              <text x="460" y="66" textAnchor="middle" fill="#ec4899" fontSize="10">IA</text>
              <text x="460" y="80" textAnchor="middle" fill="#ec4899" fontSize="10">118 clasificados</text>
              <rect x="580" y="30" width="120" height="60" rx="8" fill="rgba(16,185,129,.08)" stroke="var(--success)" strokeWidth="1.5"/>
              <text x="640" y="55" textAnchor="middle" fill="var(--success)" fontSize="12" fontWeight="600">Base de datos</text>
              <text x="640" y="72" textAnchor="middle" fill="var(--success)" fontSize="10">95 integrados</text>
              <rect x="760" y="30" width="120" height="60" rx="8" fill="rgba(245,158,11,.08)" stroke="var(--warning)" strokeWidth="1.5"/>
              <text x="820" y="55" textAnchor="middle" fill="var(--warning)" fontSize="12" fontWeight="600">Dashboard</text>
              <text x="820" y="72" textAnchor="middle" fill="var(--warning)" fontSize="10">87 publicados</text>
            </svg>
          </div>
        </div>

        <div className="panel anim-fade-up delay-3">
          <div className="panel-header"><span className="panel-title">Panel de confiabilidad</span><span style={{fontSize:'12px',color:'var(--muted)'}}>Score general: 87%</span></div>
          <div className="reliability-bars">
            <div className="reliability-bar-item">
              <span>Precision</span>
              <div className="bar-track"><div className="bar-fill" style={{width:'91%',background:'var(--accent)'}}></div></div>
              <span>91%</span>
            </div>
            <div className="reliability-bar-item">
              <span>Cobertura</span>
              <div className="bar-track"><div className="bar-fill" style={{width:'84%',background:'#6366f1'}}></div></div>
              <span>84%</span>
            </div>
            <div className="reliability-bar-item">
              <span>Frescura</span>
              <div className="bar-track"><div className="bar-fill" style={{width:'79%',background:'#ec4899'}}></div></div>
              <span>79%</span>
            </div>
            <div className="reliability-bar-item">
              <span>Consistencia</span>
              <div className="bar-track"><div className="bar-fill" style={{width:'88%',background:'var(--warning)'}}></div></div>
              <span>88%</span>
            </div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-4">
          <div className="panel-header"><span className="panel-title">Todas las fuentes</span></div>
          <div className="source-grid">
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon entrevista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <div><div className="source-name">Entrevistas fundadores CO</div><div className="source-type">Entrevista</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">15 entrevistas · Colombia · Actualizado Jun 2026</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon entrevista"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div>
                <div><div className="source-name">Entrevistas ESOs CA</div><div className="source-type">Entrevista</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">32 entrevistas · CA · Actualizado May 2026</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon bd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div>
                <div><div className="source-name">Crunchbase Pro</div><div className="source-type">Base de datos</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">API · 1,200+ startups · Sync diario</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon bd"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg></div>
                <div><div className="source-name">LAVCA Database</div><div className="source-type">Base de datos</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">Fondos VC LATAM · 89 inversores · Trimestral</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon encuesta"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div><div className="source-name">Encuesta ESOs regional</div><div className="source-type">Encuesta</div></div>
                <span className="source-badge warning">Parcial</span>
              </div>
              <div className="source-meta">324 respuestas · 6 paises · Ene 2026</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon scraping"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg></div>
                <div><div className="source-name">LinkedIn AgriTech LATAM</div><div className="source-type">Web scraping</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">450+ perfiles · Semanal · 87% precision</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon oficial"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg></div>
                <div><div className="source-name">Registros mercantiles</div><div className="source-type">Oficial</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">CO/CR/GT/HN/SV/PA · Fuente primaria · Mensual</div>
            </div>
            <div className="source-card">
              <div className="source-header">
                <div className="source-icon ai"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg></div>
                <div><div className="source-name">AI News Tracker</div><div className="source-type">IA</div></div>
                <span className="source-badge ok">Activa</span>
              </div>
              <div className="source-meta">154 alertas/sem · NLP · Tiempo real</div>
            </div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-4">
          <div className="panel-header"><span className="panel-title">Progreso de entrevistas por pais</span></div>
          <table className="data-table">
            <thead>
              <tr><th>Pais</th><th>Meta</th><th>Completadas</th><th>Progreso</th></tr>
            </thead>
            <tbody>
              <tr><td>🇨🇴 Colombia</td><td>15</td><td>12</td><td><div className="bar-track"><div className="bar-fill" style={{width:'80%',background:'var(--accent)'}}></div></div></td></tr>
              <tr><td>🇨🇷 Costa Rica</td><td>10</td><td>8</td><td><div className="bar-track"><div className="bar-fill" style={{width:'80%',background:'var(--accent)'}}></div></div></td></tr>
              <tr><td>🇸🇻 El Salvador</td><td>10</td><td>7</td><td><div className="bar-track"><div className="bar-fill" style={{width:'70%',background:'var(--warning)'}}></div></div></td></tr>
              <tr><td>🇬🇹 Guatemala</td><td>10</td><td>8</td><td><div className="bar-track"><div className="bar-fill" style={{width:'80%',background:'var(--accent)'}}></div></div></td></tr>
              <tr><td>🇭🇳 Honduras</td><td>8</td><td>6</td><td><div className="bar-track"><div className="bar-fill" style={{width:'75%',background:'var(--accent)'}}></div></div></td></tr>
              <tr><td>🇵🇦 Panama</td><td>7</td><td>6</td><td><div className="bar-track"><div className="bar-fill" style={{width:'86%',background:'var(--accent)'}}></div></div></td></tr>
              <tr style={{fontWeight:600}}><td>Total</td><td>60</td><td>47</td><td><div className="bar-track"><div className="bar-fill" style={{width:'78%',background:'var(--success)'}}></div></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
