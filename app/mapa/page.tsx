import AppLayout from '@/components/AppLayout'

export default function MapaPage() {
  return (
    <AppLayout>
      {/* Topbar */}
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Mapa</span>
          </div>
          <h1>Mapa geografico</h1>
        </div>
      </header>

      <div className="map-layout">
        {/* Map sidebar */}
        <div className="map-sidebar">
          <div className="map-sidebar-header">
            <h3>Explorar actores</h3>
            <div className="map-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input type="text" placeholder="Buscar en el mapa..." />
            </div>
            <div className="map-filters">
              <span className="map-chip active" data-filter="all">Todos</span>
              <span className="map-chip" data-filter="s">Startups</span>
              <span className="map-chip" data-filter="i">Inversores</span>
              <span className="map-chip" data-filter="e">ESOs</span>
              <span className="map-chip" data-filter="g">Gobierno</span>
              <span className="map-chip" data-filter="a">Academia</span>
              <span className="map-chip" data-filter="c">Corporativo</span>
              <span className="map-chip" data-filter="r">Redes</span>
            </div>
          </div>

          <div className="map-count">Mostrando <strong>14</strong> actores en 6 paises</div>

          <div className="map-list">
            <div className="map-actor selected" data-type="s" data-country="CO">
              <div className="map-actor-icon s">AS</div>
              <div><div className="map-actor-name">AgroSmart CO</div><div className="map-actor-sub">Startup · AgTech precision · Cafe</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="i" data-country="REG">
              <div className="map-actor-icon i">PI</div>
              <div><div className="map-actor-name">Pomona Impact</div><div className="map-actor-sub">Inversor · Fondo impacto</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="e" data-country="HN">
              <div className="map-actor-icon e">AH</div>
              <div><div className="map-actor-name">Agro-Hub Zamorano</div><div className="map-actor-sub">ESO · Aceleradora</div></div>
              <div className="map-actor-country">🇭🇳</div>
            </div>
            <div className="map-actor" data-type="s" data-country="GT">
              <div className="map-actor-icon s">CT</div>
              <div><div className="map-actor-name">CafeTrace GT</div><div className="map-actor-sub">Startup · Trazabilidad · Cafe</div></div>
              <div className="map-actor-country">🇬🇹</div>
            </div>
            <div className="map-actor" data-type="s" data-country="SV">
              <div className="map-actor-icon s">BF</div>
              <div><div className="map-actor-name">BioFresh SV</div><div className="map-actor-sub">Startup · FoodTech · Frutas</div></div>
              <div className="map-actor-country">🇸🇻</div>
            </div>
            <div className="map-actor" data-type="s" data-country="HN">
              <div className="map-actor-icon s">RV</div>
              <div><div className="map-actor-name">RiegoVerde HN</div><div className="map-actor-sub">Startup · Riego · Granos basicos</div></div>
              <div className="map-actor-country">🇭🇳</div>
            </div>
            <div className="map-actor" data-type="i" data-country="REG">
              <div className="map-actor-icon i">IN</div>
              <div><div className="map-actor-name">INNOGEN Fondo III</div><div className="map-actor-sub">Inversor · VC · BID Lab</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="s" data-country="PA">
              <div className="map-actor-icon s">AC</div>
              <div><div className="map-actor-name">AquaCrop PA</div><div className="map-actor-sub">Startup · Riego y agua</div></div>
              <div className="map-actor-country">🇵🇦</div>
            </div>
            <div className="map-actor" data-type="g" data-country="CR">
              <div className="map-actor-icon g">PR</div>
              <div><div className="map-actor-name">PROCOMER</div><div className="map-actor-sub">Gobierno · Exportaciones</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="s" data-country="CO">
              <div className="map-actor-icon s">LS</div>
              <div><div className="map-actor-name">LogiSiembra CO</div><div className="map-actor-sub">Startup · Logistica · Hortalizas</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="a" data-country="CR">
              <div className="map-actor-icon a">UE</div>
              <div><div className="map-actor-name">U. EARTH Costa Rica</div><div className="map-actor-sub">Academia · Biotecnologia</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="c" data-country="CR">
              <div className="map-actor-icon c">CB</div>
              <div><div className="map-actor-name">Cafe Britt Tech</div><div className="map-actor-sub">Corporativo · Innovacion</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="r" data-country="REG">
              <div className="map-actor-icon r">AL</div>
              <div><div className="map-actor-name">AgriTech LATAM Net</div><div className="map-actor-sub">Red · 450+ miembros</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="g" data-country="PA">
              <div className="map-actor-icon g">SE</div>
              <div><div className="map-actor-name">SENACYT Panama</div><div className="map-actor-sub">Gobierno · Ciencia y tecnologia</div></div>
              <div className="map-actor-country">🇵🇦</div>
            </div>
          </div>
        </div>

        {/* Map canvas — dark placeholder */}
        <div className="map-canvas">
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#e8ecf2,#d4dbe6)'}}></div>

          {/* Country labels */}
          <span className="country-label" style={{top:'38%',left:'47%'}}>Colombia</span>
          <span className="country-label" style={{top:'30%',left:'31%'}}>Costa Rica</span>
          <span className="country-label" style={{top:'25%',left:'25%'}}>Guatemala</span>
          <span className="country-label" style={{top:'24%',left:'29%'}}>Honduras</span>
          <span className="country-label" style={{top:'26%',left:'24%'}}>El Salvador</span>
          <span className="country-label" style={{top:'33%',left:'36%'}}>Panama</span>

          <div className="map-stats">
            <div className="map-stat-pill"><strong>2,847</strong> actores</div>
            <div className="map-stat-pill"><strong>6</strong> paises</div>
            <div className="map-stat-pill"><strong>9</strong> cadenas</div>
          </div>

          {/* Dots */}
          <div className="map-dots">
            <div className="dot lg" style={{top:'42%',left:'48%'}}><span className="dot-tooltip">Bogota · 486 actores</span></div>
            <div className="dot" style={{top:'38%',left:'44%'}}><span className="dot-tooltip">Medellin · 124</span></div>
            <div className="dot" style={{top:'45%',left:'51%'}}><span className="dot-tooltip">Cali · 89</span></div>
            <div className="dot inv" style={{top:'40%',left:'50%'}}><span className="dot-tooltip">Pomona Impact</span></div>
            <div className="dot lg" style={{top:'32%',left:'33%'}}><span className="dot-tooltip">San Jose · 198 actores</span></div>
            <div className="dot inv" style={{top:'33%',left:'31%'}}></div>
            <div className="dot aca" style={{top:'31%',left:'34%'}}><span className="dot-tooltip">U. EARTH</span></div>
            <div className="dot lg" style={{top:'24%',left:'26%'}}><span className="dot-tooltip">Cd. Guatemala · 147</span></div>
            <div className="dot eso" style={{top:'26%',left:'24%'}}></div>
            <div className="dot lg" style={{top:'26%',left:'31%'}}><span className="dot-tooltip">Tegucigalpa · 132</span></div>
            <div className="dot eso" style={{top:'27%',left:'29%'}}><span className="dot-tooltip">Agro-Hub Zamorano</span></div>
            <div className="dot" style={{top:'27%',left:'27%'}}><span className="dot-tooltip">San Salvador · 94</span></div>
            <div className="dot lg" style={{top:'34%',left:'38%'}}><span className="dot-tooltip">Cd. Panama · 162</span></div>
            <div className="dot inv" style={{top:'35%',left:'40%'}}></div>
            <div className="dot gov" style={{top:'33%',left:'37%'}}><span className="dot-tooltip">SENACYT</span></div>
          </div>

          <div className="map-legend">
            <h4>Tipo de actor</h4>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--accent)'}}></div>Startup</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'#6366f1'}}></div>Inversor</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--warning)'}}></div>ESO</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'var(--fg)'}}></div>Gobierno</div>
            <div className="map-legend-item"><div className="map-legend-dot" style={{background:'#ec4899'}}></div>Academia</div>
          </div>

          <div className="map-controls">
            <button className="map-ctrl" title="Zoom in">+</button>
            <button className="map-ctrl" title="Zoom out">&minus;</button>
            <button className="map-ctrl" title="Reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
          </div>

          {/* Map stats overlay */}
          <div className="map-stats-overlay">
            <h4>Estadisticas del mapa</h4>
            <div className="stats-grid">
              <div className="stat-item"><span className="stat-value">2,847</span><span className="stat-label">Actores totales</span></div>
              <div className="stat-item"><span className="stat-value">6</span><span className="stat-label">Paises</span></div>
              <div className="stat-item"><span className="stat-value">474</span><span className="stat-label">Densidad prom.</span></div>
              <div className="stat-item"><span className="stat-value">18%</span><span className="stat-label">Ratio mujeres</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
