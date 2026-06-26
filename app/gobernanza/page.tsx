import AppLayout from '@/components/AppLayout'

export default function GobernanzaPage() {
  return (
    <AppLayout>
      {/* Topbar */}
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
          <h2>Gobernanza y monitoreo de inteligencia artificial</h2>
          <p>Sistema de gobernanza para los modelos de IA que alimentan el mapeo vivo: monitoreo de sesgos, calidad de datos, actualizaciones semi-automaticas y cumplimiento etico del ecosistema AgriTech.</p>
        </div>

        {/* AI Status Banner */}
        <div className="ai-banner anim-fade-up delay-1">
          <div className="ai-banner-content">
            <div>
              <div className="ai-status-row">
                <div className="ai-status-dot"></div>
                <span className="ai-status-label">SISTEMA IA OPERATIVO</span>
              </div>
              <h3>Motor de actualizacion semi-automatica</h3>
              <p>3 modelos de IA activos monitoreando el ecosistema AgriTech en 6 paises. Ultimo ciclo de actualizacion: hace 4 horas. Proxima revision de sesgos programada para el 28 de junio.</p>
            </div>
            <div className="ai-metrics">
              <div className="ai-metric"><div className="ai-metric-val">99.2%</div><div className="ai-metric-label">Uptime</div></div>
              <div className="ai-metric"><div className="ai-metric-val">89%</div><div className="ai-metric-label">Precision</div></div>
              <div className="ai-metric"><div className="ai-metric-val">0.03</div><div className="ai-metric-label">Sesgo score</div></div>
            </div>
          </div>
        </div>

        {/* Gov cards grid — Modelos IA tab content (static, shown by default) */}
        <div className="gov-grid anim-fade-up delay-2">
          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            </div>
            <div className="gov-title">Modelo de clasificacion de actores</div>
            <div className="gov-desc">Clasifica automaticamente nuevos actores en las 9 categorias del ecosistema (startups, inversores, ESOs, etc.) usando NLP sobre descripciones y metadata.</div>
            <div className="gov-status status-ok">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)'}}></span>Activo - v2.3
            </div>
            <div className="gov-meta"><span>F1-Score: 0.91</span><span>Ultima actualizacion: Jun 22</span><span>12,450 predicciones</span></div>
          </div>

          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
            </div>
            <div className="gov-title">Detector de tendencias emergentes</div>
            <div className="gov-desc">Monitorea noticias, redes sociales y publicaciones para detectar tendencias emergentes en AgriTech LATAM y genera alertas automaticas.</div>
            <div className="gov-status status-ok">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)'}}></span>Activo - v1.8
            </div>
            <div className="gov-meta"><span>Precision: 87%</span><span>154 alertas/semana</span><span>24/7 monitoring</span></div>
          </div>

          <div className="gov-card cat-model">
            <div className="gov-icon" style={{background:'rgba(139,92,246,.1)',color:'#8b5cf6'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            </div>
            <div className="gov-title">Motor de actualizacion de perfiles</div>
            <div className="gov-desc">Actualiza semi-automaticamente perfiles de actores cruzando datos de multiples fuentes (Crunchbase, LinkedIn, registros oficiales).</div>
            <div className="gov-status status-warn">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--warning)'}}></span>Revision pendiente
            </div>
            <div className="gov-meta"><span>Accuracy: 84%</span><span>Revisar antes de Jul 1</span><span>2,847 perfiles</span></div>
          </div>

          <div className="gov-card cat-data">
            <div className="gov-icon" style={{background:'var(--accent-soft)',color:'var(--accent)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <div className="gov-title">Detector de duplicados</div>
            <div className="gov-desc">Identifica registros duplicados o similares en el directorio usando comparacion fuzzy y embedding similarity.</div>
            <div className="gov-status status-ok">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)'}}></span>Activo - v1.5
            </div>
            <div className="gov-meta"><span>134 duplicados detectados</span><span>99.1% precision</span></div>
          </div>

          <div className="gov-card cat-ethics">
            <div className="gov-icon" style={{background:'rgba(236,72,153,.1)',color:'#ec4899'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="gov-title">Monitor de sesgo de genero</div>
            <div className="gov-desc">Verifica que los modelos no subrepresenten startups lideradas por mujeres. Meta TOR: 40% participacion femenina en aceleracion.</div>
            <div className="gov-status status-warn">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--warning)'}}></span>Alerta: 18% actual vs 40% meta
            </div>
            <div className="gov-meta"><span>Gap: 3.2x</span><span>512 startups mujeres</span><span>Correccion activa</span></div>
          </div>

          <div className="gov-card cat-security">
            <div className="gov-icon" style={{background:'rgba(239,68,68,.1)',color:'var(--danger)'}}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div className="gov-title">Seguridad y privacidad</div>
            <div className="gov-desc">Anonimizacion de datos sensibles, control de acceso basado en roles, y encriptacion de datos personales de actores del ecosistema.</div>
            <div className="gov-status status-ok">
              <span style={{width:'6px',height:'6px',borderRadius:'50%',background:'var(--success)'}}></span>Compliance OK
            </div>
            <div className="gov-meta"><span>GDPR/HABEAS compliant</span><span>0 incidentes</span></div>
          </div>
        </div>

        {/* Calidad de datos */}
        <div className="panel anim-fade-up delay-3">
          <div className="panel-header"><span className="panel-title">Metricas de calidad de datos</span></div>
          <div className="ring-grid">
            <div className="ring-item">
              <svg className="ring-svg" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--accent)" strokeWidth="6" strokeDasharray="201" strokeDashoffset="20" strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div className="ring-label">Completitud</div><div className="ring-val" style={{color:'var(--accent)'}}>90%</div>
            </div>
            <div className="ring-item">
              <svg className="ring-svg" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#6366f1" strokeWidth="6" strokeDasharray="201" strokeDashoffset="16" strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div className="ring-label">Consistencia</div><div className="ring-val" style={{color:'#6366f1'}}>92%</div>
            </div>
            <div className="ring-item">
              <svg className="ring-svg" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="#ec4899" strokeWidth="6" strokeDasharray="201" strokeDashoffset="30" strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div className="ring-label">Frescura</div><div className="ring-val" style={{color:'#ec4899'}}>85%</div>
            </div>
            <div className="ring-item">
              <svg className="ring-svg" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--border)" strokeWidth="6"/>
                <circle cx="40" cy="40" r="32" fill="none" stroke="var(--warning)" strokeWidth="6" strokeDasharray="201" strokeDashoffset="24" strokeLinecap="round" transform="rotate(-90 40 40)"/>
              </svg>
              <div className="ring-label">Precision</div><div className="ring-val" style={{color:'var(--warning)'}}>88%</div>
            </div>
          </div>
        </div>

        {/* Audit log */}
        <div className="panel anim-fade-up delay-4">
          <div className="panel-header"><span className="panel-title">Registro de auditoria de IA</span><span style={{fontSize:'12px',color:'var(--muted)'}}>Ultimos 30 dias</span></div>
          <div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(16,185,129,.1)',color:'var(--success)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
              <div className="audit-body"><div className="audit-title">Ciclo de actualizacion completado</div><div className="audit-desc">Motor de actualizacion proceso 234 perfiles. 18 nuevos actores detectados, 45 actualizados, 2 marcados para revision manual.</div></div>
              <div className="audit-time">Hace 4h</div>
            </div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(245,158,11,.1)',color:'var(--warning)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg></div>
              <div className="audit-body"><div className="audit-title">Alerta de sesgo de genero</div><div className="audit-desc">El modelo de recomendacion mostro sesgo del 12% contra startups con fundadoras mujeres. Se aplico correccion de peso.</div></div>
              <div className="audit-time">Hace 1d</div>
            </div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(99,102,241,.1)',color:'#6366f1'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/></svg></div>
              <div className="audit-body"><div className="audit-title">Modelo v2.3 desplegado</div><div className="audit-desc">Nueva version del clasificador de actores con mejora en precision para categorias "Redes y comunidades" y "Organismos internacionales".</div></div>
              <div className="audit-time">Hace 3d</div>
            </div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(16,185,129,.1)',color:'var(--success)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
              <div className="audit-body"><div className="audit-title">Revision trimestral de sesgos completada</div><div className="audit-desc">Auditoria Q2 2026: sesgo geografico dentro de limites aceptables (Gini 0.12). Sesgo de genero requiere accion correctiva.</div></div>
              <div className="audit-time">Hace 5d</div>
            </div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(239,68,68,.1)',color:'var(--danger)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg></div>
              <div className="audit-body"><div className="audit-title">134 duplicados eliminados</div><div className="audit-desc">El detector de duplicados identifico y mergeo 134 registros duplicados. Todos verificados manualmente antes de la eliminacion.</div></div>
              <div className="audit-time">Hace 1sem</div>
            </div>
            <div className="audit-item">
              <div className="audit-icon" style={{background:'rgba(16,185,129,.1)',color:'var(--success)'}}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
              <div className="audit-body"><div className="audit-title">Auditoria de seguridad aprobada</div><div className="audit-desc">Revision de seguridad y privacidad de datos. Cumplimiento con politicas de proteccion de datos de TechnoServe y BID Lab.</div></div>
              <div className="audit-time">Hace 2sem</div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
