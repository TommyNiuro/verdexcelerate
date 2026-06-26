import AppLayout from '@/components/AppLayout'

export const revalidate = 60

export default function ZonasPage() {
  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Zonas prioritarias</span>
          </div>
          <h1>Zonas prioritarias</h1>
        </div>
        <button className="btn btn-secondary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Exportar
        </button>
      </header>

      <div className="content">
        <div className="page-intro anim-fade-up">
          <h2>Zonas prioritarias de intervencion</h2>
          <p>Areas geograficas con mayor potencial de impacto para el desarrollo del ecosistema AgriTech. Priorizadas por brecha de acceso, densidad de actores y potencial de escalamiento.</p>
        </div>

        <div className="zone-grid anim-fade-up delay-1">
          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇨🇴</div>
                <h3 className="zone-name">La Guajira</h3>
                <div className="zone-country">Colombia</div>
              </div>
              <span className="zone-badge danger">Critica</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">12</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">28%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'28%',background:'var(--danger)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Cafe</span><span className="tag">Hortalizas</span><span className="tag">Alta brecha</span>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇨🇴</div>
                <h3 className="zone-name">Sucre</h3>
                <div className="zone-country">Colombia</div>
              </div>
              <span className="zone-badge warning">Prioritaria</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">18</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">34%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'34%',background:'var(--warning)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Granos</span><span className="tag">Pesca</span><span className="tag">Logistica</span>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇸🇻</div>
                <h3 className="zone-name">Morazan</h3>
                <div className="zone-country">El Salvador</div>
              </div>
              <span className="zone-badge danger">Critica</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">8</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">22%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'22%',background:'var(--danger)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Cafe</span><span className="tag">Frutas</span><span className="tag">Rural</span>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇬🇹</div>
                <h3 className="zone-name">Alta Verapaz</h3>
                <div className="zone-country">Guatemala</div>
              </div>
              <span className="zone-badge danger">Critica</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">14</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">26%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'26%',background:'var(--danger)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Cardamomo</span><span className="tag">Cafe</span><span className="tag">Indigena</span>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇨🇴</div>
                <h3 className="zone-name">Cordoba</h3>
                <div className="zone-country">Colombia</div>
              </div>
              <span className="zone-badge warning">Prioritaria</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">24</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">41%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'41%',background:'var(--warning)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Ganaderia</span><span className="tag">Cacao</span><span className="tag">Emergente</span>
            </div>
          </div>

          <div className="zone-card">
            <div className="zone-header">
              <div>
                <div className="zone-flag">🇨🇴</div>
                <h3 className="zone-name">Magdalena</h3>
                <div className="zone-country">Colombia</div>
              </div>
              <span className="zone-badge warning">Prioritaria</span>
            </div>
            <div className="zone-stats">
              <div className="zone-stat"><div className="zone-stat-val">19</div><div className="zone-stat-label">Actores</div></div>
              <div className="zone-stat"><div className="zone-stat-val">36%</div><div className="zone-stat-label">Cobertura</div></div>
            </div>
            <div className="zone-bar-wrap"><div className="zone-bar" style={{width:'36%',background:'var(--warning)'}}></div></div>
            <div className="zone-tags">
              <span className="tag">Banano</span><span className="tag">Palma</span><span className="tag">Puerto</span>
            </div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-2">
          <div className="panel-header"><span className="panel-title">Cronograma de intervencion</span></div>
          <div className="timeline">
            <div className="tl-item completed">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Q1 2025 — Diagnostico inicial</div>
                <div className="tl-desc">Mapeo de actores en las 6 zonas prioritarias. 95 actores identificados.</div>
              </div>
            </div>
            <div className="tl-item completed">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Q3 2025 — Aceleracion piloto</div>
                <div className="tl-desc">Primeros 12 startups acelerados en La Guajira y Alta Verapaz.</div>
              </div>
            </div>
            <div className="tl-item in-progress">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Q1 2026 — Expansion ESOs</div>
                <div className="tl-desc">Incorporacion de 8 nuevas ESOs locales. En curso.</div>
              </div>
            </div>
            <div className="tl-item planned">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Q3 2026 — Convocatoria abierta</div>
                <div className="tl-desc">Primera convocatoria regional. Meta: 50 startups postulantes.</div>
              </div>
            </div>
            <div className="tl-item planned">
              <div className="tl-dot"></div>
              <div className="tl-content">
                <div className="tl-title">Q4 2026 — Evaluacion de impacto</div>
                <div className="tl-desc">Reporte de resultados e impacto economico del programa.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="panel anim-fade-up delay-3">
          <div className="panel-header"><span className="panel-title">Brechas por zona prioritaria</span></div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Brecha</th>
                <th>Zonas afectadas</th>
                <th>Severidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Financiamiento semilla</td>
                <td>5 / 5</td>
                <td><span className="badge danger">5</span></td>
                <td><span className="status-badge status-danger">Critica</span></td>
              </tr>
              <tr>
                <td>Conectividad AgTech</td>
                <td>5 / 5</td>
                <td><span className="badge danger">5</span></td>
                <td><span className="status-badge status-danger">Critica</span></td>
              </tr>
              <tr>
                <td>Representacion femenina</td>
                <td>4 / 5</td>
                <td><span className="badge warning">4</span></td>
                <td><span className="status-badge status-warning">Prioritaria</span></td>
              </tr>
              <tr>
                <td>Talento tecnico</td>
                <td>4 / 5</td>
                <td><span className="badge warning">4</span></td>
                <td><span className="status-badge status-warning">Prioritaria</span></td>
              </tr>
              <tr>
                <td>Acceso a mercados</td>
                <td>3 / 5</td>
                <td><span className="badge ok">3</span></td>
                <td><span className="status-badge status-ok">Moderada</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
