'use client'

import AppLayout from '@/components/AppLayout'
import { useEffect } from 'react'
import 'leaflet/dist/leaflet.css'

type Pt = { name: string; lat: number; lng: number; country: string; type: string; sub: string }

// Puntos reales (coordenadas de ciudades) por actor de muestra
const CITY_POINTS: Pt[] = [
  { name: 'AgroSmart CO',        lat: 4.7110,  lng: -74.0721, country: 'CO', type: 'startup',     sub: 'Bogota · AgTech precision' },
  { name: 'LogiSiembra CO',      lat: 6.2442,  lng: -75.5812, country: 'CO', type: 'startup',     sub: 'Medellin · Logistica' },
  { name: 'AgroSmart Cali',      lat: 3.4516,  lng: -76.5320, country: 'CO', type: 'startup',     sub: 'Cali · Hortalizas' },
  { name: 'Pomona Impact',       lat: 4.6500,  lng: -74.1500, country: 'CO', type: 'inversor',    sub: 'Fondo de impacto' },
  { name: 'AgriTech LATAM Net',  lat: 4.8000,  lng: -74.0000, country: 'CO', type: 'red',         sub: 'Red · 450+ miembros' },
  { name: 'AgroSmart CR',        lat: 9.9281,  lng: -84.0907, country: 'CR', type: 'startup',     sub: 'San Jose · AgTech' },
  { name: 'U. EARTH Costa Rica', lat: 10.2050, lng: -83.5870, country: 'CR', type: 'academia',    sub: 'Academia · Biotecnologia' },
  { name: 'Cafe Britt Tech',     lat: 9.9760,  lng: -84.1010, country: 'CR', type: 'corporativo', sub: 'Corporativo · Innovacion' },
  { name: 'PROCOMER',            lat: 9.9350,  lng: -84.0800, country: 'CR', type: 'gobierno',    sub: 'Gobierno · Exportaciones' },
  { name: 'CafeTrace GT',        lat: 14.6349, lng: -90.5069, country: 'GT', type: 'startup',     sub: 'Cd. Guatemala · Trazabilidad' },
  { name: 'Agro-Hub Zamorano',   lat: 14.0080, lng: -87.0030, country: 'HN', type: 'eso',         sub: 'Tegucigalpa · Aceleradora' },
  { name: 'BioFresh SV',         lat: 13.6929, lng: -89.2182, country: 'SV', type: 'startup',     sub: 'San Salvador · FoodTech' },
  { name: 'AquaCrop PA',         lat: 8.9824,  lng: -79.5199, country: 'PA', type: 'startup',     sub: 'Cd. Panama · Riego y agua' },
  { name: 'SENACYT Panama',      lat: 9.0000,  lng: -79.5300, country: 'PA', type: 'gobierno',    sub: 'Gobierno · Ciencia y tecnologia' },
]

const TYPE_COLOR: Record<string, string> = {
  startup: '#00A79D', inversor: '#6366f1', eso: '#f59e0b',
  gobierno: '#1B2A4A', academia: '#ec4899', corporativo: '#10b981', red: '#ef4444',
}
const CHIP_TYPE: Record<string, string> = { s:'startup', i:'inversor', e:'eso', g:'gobierno', a:'academia', c:'corporativo', r:'red' }

const COUNTRY_VIEW: Record<string, [number, number, number]> = {
  CO: [4.65, -74.1, 6], CR: [9.93, -84.05, 7], GT: [14.63, -90.5, 7],
  HN: [14.05, -87.1, 7], SV: [13.69, -89.21, 8], PA: [8.98, -79.52, 7],
}

const COUNTRY_DATA: Record<string, { flag: string; name: string; desc: string; actors: string; startups: string; funding: string; gender: string }> = {
  CO: { flag: '🇨🇴', name: 'Colombia', desc: 'Ecosistema mas maduro de la region', actors: '486', startups: '234', funding: '$42M', gender: '22%' },
  CR: { flag: '🇨🇷', name: 'Costa Rica', desc: 'Hub de innovacion centroamericano', actors: '198', startups: '89', funding: '$18M', gender: '28%' },
  GT: { flag: '🇬🇹', name: 'Guatemala', desc: 'Enfoque en cafe y cacao', actors: '147', startups: '56', funding: '$8M', gender: '15%' },
  HN: { flag: '🇭🇳', name: 'Honduras', desc: 'Crecimiento acelerado en AgTech', actors: '132', startups: '48', funding: '$6M', gender: '12%' },
  SV: { flag: '🇸🇻', name: 'El Salvador', desc: 'Zona prioritaria Morazan', actors: '94', startups: '34', funding: '$4M', gender: '19%' },
  PA: { flag: '🇵🇦', name: 'Panama', desc: 'Hub financiero regional', actors: '162', startups: '67', funding: '$22M', gender: '24%' },
}

export default function MapaPage() {
  useEffect(() => {
    let map: any = null
    let cleanupFns: Array<() => void> = []
    let cancelled = false

    ;(async () => {
      const L = (await import('leaflet')).default
      if (cancelled) return
      const mapEl = document.getElementById('leafletMap')
      if (!mapEl) return

      map = L.map(mapEl, { zoomControl: false, attributionControl: true })
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        subdomains: 'abcd',
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map)

      // Marcadores
      const markers = CITY_POINTS.map(p => {
        const color = TYPE_COLOR[p.type] ?? '#00A79D'
        const ini = p.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
        const icon = L.divIcon({
          className: 'vx-pin-wrap',
          html: `<div class="vx-pin" style="background:${color}">${ini}</div>`,
          iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -16],
        })
        const m = L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(map)
        m.bindPopup(`<strong>${p.name}</strong><br><span style="color:#7a8599;font-size:12px">${p.sub}</span>`)
        m.on('click', () => showCountryPanel(p.country))
        return { marker: m, type: p.type, country: p.country, name: p.name, lat: p.lat, lng: p.lng }
      })

      // Encajar a la region
      const group = L.featureGroup(markers.map(m => m.marker))
      map.fitBounds(group.getBounds().pad(0.08), { maxZoom: 7, padding: [40, 40] })
      setTimeout(() => map && map.invalidateSize(), 200)

      const countEl = document.getElementById('mapActorCount')
      function setCount(n: number) { if (countEl) countEl.textContent = String(n) }

      // ── Filtro por tipo (chips + leyenda) ──
      function applyFilter(filterKey: string) {
        const type = filterKey === 'all' ? 'all' : CHIP_TYPE[filterKey] ?? filterKey
        let visible = 0
        markers.forEach(m => {
          const show = type === 'all' || m.type === type
          if (show) { m.marker.addTo(map); visible++ } else { map.removeLayer(m.marker) }
        })
        // lista lateral
        document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => {
          const show = filterKey === 'all' || a.dataset.type === filterKey
          a.classList.toggle('hidden', !show)
        })
        setCount(visible)
      }

      const chips = Array.from(document.querySelectorAll<HTMLElement>('.map-chip'))
      chips.forEach(c => {
        const h = () => {
          chips.forEach(x => x.classList.remove('active'))
          c.classList.add('active')
          applyFilter(c.dataset.filter || 'all')
        }
        c.addEventListener('click', h)
        cleanupFns.push(() => c.removeEventListener('click', h))
      })

      const legendKeys = ['s', 'i', 'e', 'g', 'a']
      document.querySelectorAll<HTMLElement>('.map-legend-item').forEach((item, i) => {
        const h = () => {
          const key = legendKeys[i] || 'all'
          chips.forEach(x => x.classList.toggle('active', x.dataset.filter === key))
          applyFilter(key)
        }
        item.addEventListener('click', h)
        cleanupFns.push(() => item.removeEventListener('click', h))
      })

      // ── Buscador: filtra lista + marcadores ──
      const searchInput = document.getElementById('mapSearch') as HTMLInputElement | null
      if (searchInput) {
        const h = () => {
          const q = searchInput.value.toLowerCase()
          let visible = 0
          markers.forEach(m => {
            const show = m.name.toLowerCase().includes(q)
            if (show) { m.marker.addTo(map); visible++ } else { map.removeLayer(m.marker) }
          })
          document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => {
            const show = (a.textContent || '').toLowerCase().includes(q)
            a.classList.toggle('hidden', !show)
          })
          setCount(visible)
        }
        searchInput.addEventListener('input', h)
        cleanupFns.push(() => searchInput.removeEventListener('input', h))
      }

      // ── Click en actor de la lista: vuela a su pais y abre popup ──
      document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => {
        const h = () => {
          document.querySelectorAll('.map-actor').forEach(x => x.classList.remove('selected'))
          a.classList.add('selected')
          const name = a.querySelector('.map-actor-name')?.textContent?.trim()
          const found = markers.find(m => m.name === name)
          if (found) {
            map.flyTo([found.lat, found.lng], 9, { duration: 0.8 })
            found.marker.openPopup()
          } else {
            const code = a.dataset.country
            const v = code && COUNTRY_VIEW[code]
            if (v) map.flyTo([v[0], v[1]], v[2], { duration: 0.8 })
          }
        }
        a.addEventListener('click', h)
        cleanupFns.push(() => a.removeEventListener('click', h))
      })

      // ── Panel de pais ──
      function showCountryPanel(code: string) {
        const d = COUNTRY_DATA[code]; if (!d) return
        const set = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v }
        set('cpFlag', d.flag + ' '); set('cpName', d.name); set('cpDesc', d.desc)
        set('cpActors', d.actors); set('cpStartups', d.startups); set('cpFunding', d.funding); set('cpGender', d.gender)
        const btn = document.getElementById('cpBtn') as HTMLElement | null
        if (btn) btn.dataset.country = code
        document.getElementById('countryPanel')?.classList.add('show')
        const v = COUNTRY_VIEW[code]
        if (v) map.flyTo([v[0], v[1]], v[2], { duration: 0.8 })
      }

      // ── Controles ──
      const on = (id: string, fn: () => void) => {
        const el = document.getElementById(id)
        if (el) { el.addEventListener('click', fn); cleanupFns.push(() => el.removeEventListener('click', fn)) }
      }
      on('zoomIn', () => map.zoomIn())
      on('zoomOut', () => map.zoomOut())
      on('resetMap', () => {
        map.fitBounds(group.getBounds().pad(0.08), { maxZoom: 7, padding: [40, 40] })
        document.getElementById('countryPanel')?.classList.remove('show')
      })

      let isFullscreen = false
      on('fullscreenBtn', () => {
        isFullscreen = !isFullscreen
        document.body.classList.toggle('fullscreen-mode', isFullscreen)
        document.getElementById('fullscreenBtn')?.classList.toggle('active', isFullscreen)
        setTimeout(() => map && map.invalidateSize(), 350)
      })

      // ── Radio: dibuja un circulo real de 150km y cuenta actores dentro ──
      let radiusActive = false
      let radiusCircle: any = null
      on('radiusBtn', () => {
        radiusActive = !radiusActive
        document.getElementById('radiusBtn')?.classList.toggle('active', radiusActive)
        mapEl.style.cursor = radiusActive ? 'crosshair' : ''
        if (!radiusActive && radiusCircle) { map.removeLayer(radiusCircle); radiusCircle = null }
      })
      const onMapClick = (e: any) => {
        if (!radiusActive) return
        if (radiusCircle) map.removeLayer(radiusCircle)
        const r = 150000
        radiusCircle = L.circle(e.latlng, { radius: r, color: '#00A79D', weight: 2, fillColor: '#00A79D', fillOpacity: 0.08 }).addTo(map)
        let nearby = 0
        markers.forEach(m => { if (map.distance(e.latlng, [m.lat, m.lng]) <= r) nearby++ })
        radiusCircle.bindPopup(`${nearby} actor${nearby !== 1 ? 'es' : ''} en 150 km`).openPopup()
      }
      map.on('click', onMapClick)

      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          isFullscreen = false
          document.body.classList.remove('fullscreen-mode')
          document.getElementById('fullscreenBtn')?.classList.remove('active')
          setTimeout(() => map && map.invalidateSize(), 350)
        }
      }
      document.addEventListener('keydown', onKey)
      cleanupFns.push(() => document.removeEventListener('keydown', onKey))

      setCount(markers.length)

      // Stats overlay animado
      function animateCounter(el: HTMLElement, target: number, suffix = '', duration = 1200) {
        const start = performance.now()
        function tick(now: number) {
          const p = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 3)
          el.textContent = Math.round(target * eased).toLocaleString() + suffix
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
      const totalActors = Object.values(COUNTRY_DATA).reduce((s, c) => s + parseInt(c.actors), 0)
      const countries = Object.keys(COUNTRY_DATA).length
      const avgDensity = Math.round(totalActors / countries)
      const genderVals = Object.values(COUNTRY_DATA).map(c => parseInt(c.gender))
      const avgGender = Math.round(genderVals.reduce((s, v) => s + v, 0) / genderVals.length)
      setTimeout(() => {
        const s1 = document.getElementById('statTotalActors')
        const s2 = document.getElementById('statCountries')
        const s3 = document.getElementById('statDensity')
        const s4 = document.getElementById('statGender')
        const pill = document.getElementById('pillActors')
        if (s1) animateCounter(s1, totalActors)
        if (s2) animateCounter(s2, countries)
        if (s3) animateCounter(s3, avgDensity)
        if (s4) animateCounter(s4, avgGender, '%')
        if (pill) animateCounter(pill, totalActors)
      }, 300)
    })()

    return () => {
      cancelled = true
      cleanupFns.forEach(fn => fn())
      document.body.classList.remove('fullscreen-mode')
      if (map) { map.remove(); map = null }
    }
  }, [])

  return (
    <AppLayout>
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
        <div className="map-sidebar">
          <div className="map-sidebar-header">
            <h3>Explorar actores</h3>
            <div className="map-search">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input id="mapSearch" type="text" placeholder="Buscar en el mapa..." />
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

          <div className="map-count">Mostrando <strong id="mapActorCount">14</strong> actores en 6 paises</div>

          <div className="map-list">
            <div className="map-actor selected" data-type="s" data-country="CO">
              <div className="map-actor-icon s">AS</div>
              <div><div className="map-actor-name">AgroSmart CO</div><div className="map-actor-sub">Startup · AgTech precision · Cafe</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="i" data-country="CO">
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
            <div className="map-actor" data-type="s" data-country="CO">
              <div className="map-actor-icon s">LS</div>
              <div><div className="map-actor-name">LogiSiembra CO</div><div className="map-actor-sub">Startup · Logistica · Hortalizas</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="i" data-country="PA">
              <div className="map-actor-icon i">AC</div>
              <div><div className="map-actor-name">AquaCrop PA</div><div className="map-actor-sub">Startup · Riego y agua</div></div>
              <div className="map-actor-country">🇵🇦</div>
            </div>
            <div className="map-actor" data-type="g" data-country="CR">
              <div className="map-actor-icon g">PR</div>
              <div><div className="map-actor-name">PROCOMER</div><div className="map-actor-sub">Gobierno · Exportaciones</div></div>
              <div className="map-actor-country">🇨🇷</div>
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
            <div className="map-actor" data-type="r" data-country="CO">
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

        <div className="map-canvas">
          <div id="leafletMap" style={{position:'absolute',inset:0,zIndex:1}}></div>

          <div className="map-stats">
            <div className="map-stat-pill"><strong id="pillActors">0</strong> actores</div>
            <div className="map-stat-pill"><strong>6</strong> paises</div>
            <div className="map-stat-pill"><strong>9</strong> cadenas</div>
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
            <button id="zoomIn" className="map-ctrl" title="Zoom in">+</button>
            <button id="zoomOut" className="map-ctrl" title="Zoom out">&minus;</button>
            <button id="resetMap" className="map-ctrl" title="Reset">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="16" height="16"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
            </button>
            <div style={{marginTop:'8px',display:'flex',flexDirection:'column',gap:'4px'}}>
              <button className="radius-toggle" id="radiusBtn" title="Radio de distancia">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                Radio
              </button>
              <button className="fullscreen-toggle" id="fullscreenBtn" title="Pantalla completa">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                Pantalla
              </button>
            </div>
          </div>

          <div className="fullscreen-exit-hint">Presiona ESC o el boton para salir de pantalla completa</div>

          <div className="map-stats-overlay" id="mapStatsOverlay">
            <h4>Estadisticas del mapa</h4>
            <div className="stats-grid">
              <div className="stat-item"><span className="stat-value" id="statTotalActors">0</span><span className="stat-label">Actores totales</span></div>
              <div className="stat-item"><span className="stat-value" id="statCountries">0</span><span className="stat-label">Paises</span></div>
              <div className="stat-item"><span className="stat-value" id="statDensity">0</span><span className="stat-label">Densidad prom.</span></div>
              <div className="stat-item"><span className="stat-value" id="statGender">0%</span><span className="stat-label">Ratio mujeres</span></div>
            </div>
          </div>

          <div className="country-panel" id="countryPanel">
            <h4 id="cpTitle"><span id="cpFlag"></span><span id="cpName"></span></h4>
            <p id="cpDesc"></p>
            <div className="country-panel-stats">
              <div className="country-panel-stat"><div className="country-panel-val" id="cpActors">486</div><div className="country-panel-label">Actores</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpStartups">234</div><div className="country-panel-label">Startups</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpFunding">$42M</div><div className="country-panel-label">Inversion</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpGender">22%</div><div className="country-panel-label">Mujeres</div></div>
            </div>
            <button id="cpBtn" className="country-panel-btn" onClick={(e) => { const c = (e.currentTarget as HTMLElement).dataset.country; window.location.href = c ? `/pais?c=${c}` : '/pais' }}>Ver perfil completo →</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
