import AppLayout from '@/components/AppLayout'

export const revalidate = 60

export default function BrechasPage() {
  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Brechas</span>
          </div>
          <h1>Analisis de brechas</h1>
        </div>
        <button className="btn btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar
        </button>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Analisis de brechas del ecosistema</h2>
          <p>Identificacion y priorizacion de las principales brechas que limitan el desarrollo del ecosistema AgriTech en Centroamerica y Colombia. Basado en 47 entrevistas, 324 encuestas y analisis de datos de 6 paises.</p>
        </div>

        {/* Summary cards */}
        <div className="stats-grid-5 anim-fade-up delay-1">
          <div className="gap-summary-card danger">
            <div className="gap-sum-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
            </div>
            <div className="gap-sum-val">12</div>
            <div className="gap-sum-label">Financiamiento</div>
          </div>
          <div className="gap-summary-card warning">
            <div className="gap-sum-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M1 6l11-5 11 5-11 5z"/><path d="M1 12l11 5 11-5"/><path d="M1 18l11 5 11-5"/></svg>
            </div>
            <div className="gap-sum-val">8</div>
            <div className="gap-sum-label">Conectividad</div>
          </div>
          <div className="gap-summary-card pink">
            <div className="gap-sum-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
            </div>
            <div className="gap-sum-val">7</div>
            <div className="gap-sum-label">Genero</div>
          </div>
          <div className="gap-summary-card purple">
            <div className="gap-sum-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.06 6.06l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
            </div>
            <div className="gap-sum-val">6</div>
            <div className="gap-sum-label">Talento</div>
          </div>
          <div className="gap-summary-card ok">
            <div className="gap-sum-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <div className="gap-sum-val">5</div>
            <div className="gap-sum-label">Mercado</div>
          </div>
        </div>

        {/* Gap cards — Brechas criticas */}
        <div className="gap-grid anim-fade-up delay-2">
          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-5">5</span>
              <h3 className="gap-title">Ausencia de fondos de capital semilla</h3>
            </div>
            <p className="gap-desc">Menos del 3% de las startups AgriTech en la region acceden a financiamiento semilla formal. El ticket promedio requerido ($150K-500K) no existe en la region para el sector agro.</p>
            <div className="gap-meta">
              <span className="gap-tag">12 startups afectadas</span>
              <span className="gap-tag">6 paises</span>
              <span className="gap-tag">Financiamiento</span>
            </div>
          </div>

          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-5">5</span>
              <h3 className="gap-title">Sin conectividad para soluciones AgTech</h3>
            </div>
            <p className="gap-desc">El 67% de las zonas rurales prioritarias no tiene conectividad suficiente para operar soluciones IoT, drones o plataformas cloud. Limita el despliegue de tecnologia en campo.</p>
            <div className="gap-meta">
              <span className="gap-tag">5 zonas criticas</span>
              <span className="gap-tag">IoT/Drones</span>
              <span className="gap-tag">Conectividad</span>
            </div>
          </div>

          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-4">4</span>
              <h3 className="gap-title">Baja representacion femenina</h3>
            </div>
            <p className="gap-desc">Solo el 18% de las startups AgriTech tienen fundadoras mujeres, frente a una meta TOR del 40%. La brecha es 3.2x. Los programas de aceleracion replican el sesgo si no se corrige activamente.</p>
            <div className="gap-meta">
              <span className="gap-tag">18% actual</span>
              <span className="gap-tag">Meta: 40%</span>
              <span className="gap-tag">Brecha 3.2x</span>
            </div>
          </div>

          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-4">4</span>
              <h3 className="gap-title">Talento tecnico insuficiente</h3>
            </div>
            <p className="gap-desc">Las startups AgriTech no encuentran ingenieros con perfil agro-digital. La brecha entre oferta de talento tech y demanda del sector es critica en Honduras, Guatemala y El Salvador.</p>
            <div className="gap-meta">
              <span className="gap-tag">HN/GT/SV criticos</span>
              <span className="gap-tag">CTO gap</span>
              <span className="gap-tag">Talento</span>
            </div>
          </div>

          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-3">3</span>
              <h3 className="gap-title">Acceso limitado a mercados</h3>
            </div>
            <p className="gap-desc">Las startups no logran conectar con compradores institucionales (supermercados, exportadores, cooperativas). Falta infraestructura de matchmaking B2B en el sector agro.</p>
            <div className="gap-meta">
              <span className="gap-tag">B2B</span>
              <span className="gap-tag">Exportacion</span>
              <span className="gap-tag">Mercado</span>
            </div>
          </div>

          <div className="gap-card">
            <div className="gap-header">
              <span className="sev-badge sev-3">3</span>
              <h3 className="gap-title">Barreras regulatorias</h3>
            </div>
            <p className="gap-desc">La regulacion de drones agricolas, datos de suelo y trazabilidad alimentaria varia por pais y frena el escalamiento regional de soluciones tecnologicas con potencial cross-border.</p>
            <div className="gap-meta">
              <span className="gap-tag">Drones</span>
              <span className="gap-tag">Trazabilidad</span>
              <span className="gap-tag">6 marcos regulatorios</span>
            </div>
          </div>
        </div>

        {/* Gender analysis */}
        <div className="panel anim-fade-up delay-3">
          <div className="panel-header"><span className="panel-title">Analisis de brecha de genero</span></div>
          <div className="gender-cards">
            <div className="gender-card">
              <div className="gender-val warning">18%</div>
              <div className="gender-label">Liderazgo femenino actual</div>
              <div className="gender-sub">Meta TOR: 40%</div>
            </div>
            <div className="gender-card">
              <div className="gender-val danger">3.2x</div>
              <div className="gender-label">Brecha respecto a meta</div>
              <div className="gender-sub">Correccion activa requerida</div>
            </div>
            <div className="gender-card">
              <div className="gender-val accent">512</div>
              <div className="gender-label">Startups con fundadoras</div>
              <div className="gender-sub">Del total mapeado</div>
            </div>
          </div>
          <table className="data-table" style={{marginTop:'1.5rem'}}>
            <thead>
              <tr><th>Pais</th><th>Liderazgo femenino</th><th>vs Meta (40%)</th></tr>
            </thead>
            <tbody>
              <tr><td>🇨🇷 Costa Rica</td><td>22%</td><td><span className="status-badge status-warning">-18pp</span></td></tr>
              <tr><td>🇵🇦 Panama</td><td>20%</td><td><span className="status-badge status-warning">-20pp</span></td></tr>
              <tr><td>🇨🇴 Colombia</td><td>18%</td><td><span className="status-badge status-warning">-22pp</span></td></tr>
              <tr><td>🇸🇻 El Salvador</td><td>16%</td><td><span className="status-badge status-danger">-24pp</span></td></tr>
              <tr><td>🇬🇹 Guatemala</td><td>14%</td><td><span className="status-badge status-danger">-26pp</span></td></tr>
              <tr><td>🇭🇳 Honduras</td><td>12%</td><td><span className="status-badge status-danger">-28pp</span></td></tr>
            </tbody>
          </table>
        </div>

        {/* Recomendaciones */}
        <div className="panel anim-fade-up delay-4">
          <div className="panel-header"><span className="panel-title">Recomendaciones estrategicas</span></div>
          <div className="opp-grid">
            <div className="opp-card">
              <div className="opp-id">REC-001</div>
              <h4 className="opp-title">Fondo regional de capital semilla AgriTech</h4>
              <p className="opp-desc">Crear un fondo de $5M con BID Lab y TechnoServe para tickets de $100K-500K exclusivos para startups AgriTech en zonas prioritarias.</p>
              <div className="opp-meta"><span className="opp-impact high">Alto impacto</span><span className="opp-effort medium">Esfuerzo medio</span></div>
            </div>
            <div className="opp-card">
              <div className="opp-id">REC-002</div>
              <h4 className="opp-title">Programa de conectividad rural AgTech</h4>
              <p className="opp-desc">Alianza con operadores de telecomunicaciones para llevar conectividad 4G a las 6 zonas criticas identificadas. Modelo de subsidio cruzado via ESOs.</p>
              <div className="opp-meta"><span className="opp-impact high">Alto impacto</span><span className="opp-effort high">Esfuerzo alto</span></div>
            </div>
            <div className="opp-card">
              <div className="opp-id">REC-003</div>
              <h4 className="opp-title">Aceleradora exclusiva para fundadoras</h4>
              <p className="opp-desc">Track diferenciado dentro del programa de aceleracion con mentoria, red y condiciones preferenciales. Meta: 40% de startups aceleradas lideradas por mujeres en 18 meses.</p>
              <div className="opp-meta"><span className="opp-impact high">Alto impacto</span><span className="opp-effort low">Esfuerzo bajo</span></div>
            </div>
            <div className="opp-card">
              <div className="opp-id">REC-004</div>
              <h4 className="opp-title">Bootcamp de talento agro-digital</h4>
              <p className="opp-desc">Programa de 6 meses para formar desarrolladores con perfil agro en HN/GT/SV. Partnership con universidades locales y empresas ancla del sector.</p>
              <div className="opp-meta"><span className="opp-impact medium">Impacto medio</span><span className="opp-effort medium">Esfuerzo medio</span></div>
            </div>
            <div className="opp-card">
              <div className="opp-id">REC-005</div>
              <h4 className="opp-title">Plataforma B2B AgriTech LATAM</h4>
              <p className="opp-desc">Marketplace digital para conectar startups con compradores institucionales: exportadores, supermercados y cooperativas en los 6 paises.</p>
              <div className="opp-meta"><span className="opp-impact medium">Impacto medio</span><span className="opp-effort medium">Esfuerzo medio</span></div>
            </div>
            <div className="opp-card">
              <div className="opp-id">REC-006</div>
              <h4 className="opp-title">Mesa de armonizacion regulatoria</h4>
              <p className="opp-desc">Convocatoria con ministerios de agricultura de los 6 paises para armonizar marcos de drones, datos de suelo y trazabilidad alimentaria. Facilitado por BID Lab.</p>
              <div className="opp-meta"><span className="opp-impact medium">Impacto medio</span><span className="opp-effort high">Esfuerzo alto</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
