'use client'

import AppLayout from '@/components/AppLayout'
import { useEffect, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import { getGeoActors, getDashboardStats, getBenchmarks } from '@/lib/queries'

type Pt = {
  id: string; name: string; lat: number; lng: number; iso2: string
  fullType: string; chipKey: string; flag: string; sub: string; ini: string; website: string | null
}
type CountryStat = { flag: string; name: string; desc: string; actors: string; startups: string; funding: string; gender: string }

// enum de la BD -> tipo de la pagina (color), clave de chip (filtro) y etiqueta
const ENUM_MAP: Record<string, { full: string; chip: string; label: string }> = {
  startup: { full: 'startup', chip: 's', label: 'Startup' },
  inversor: { full: 'inversor', chip: 'i', label: 'Inversor' },
  eso: { full: 'eso', chip: 'e', label: 'ESO' },
  agencia_gubernamental: { full: 'gobierno', chip: 'g', label: 'Gobierno' },
  academia: { full: 'academia', chip: 'a', label: 'Academia' },
  corporativo_ancla: { full: 'corporativo', chip: 'c', label: 'Corporativo' },
  red_comunidad: { full: 'red', chip: 'r', label: 'Red' },
  organismo_internacional: { full: 'organismo', chip: 'x', label: 'Organismo' },
  asociacion_agricola: { full: 'asociacion', chip: 'x', label: 'Asociacion' },
}
const TYPE_COLOR: Record<string, string> = {
  startup: '#00A79D', inversor: '#6366f1', eso: '#f59e0b', gobierno: '#1B2A4A',
  academia: '#ec4899', corporativo: '#10b981', red: '#ef4444', organismo: '#0ea5e9', asociacion: '#84cc16',
}
const CHIP_TYPE: Record<string, string> = { s: 'startup', i: 'inversor', e: 'eso', g: 'gobierno', a: 'academia', c: 'corporativo', r: 'red' }
const FLAG: Record<string, string> = { CO: '🇨🇴', CR: '🇨🇷', GT: '🇬🇹', HN: '🇭🇳', SV: '🇸🇻', PA: '🇵🇦' }
const COUNTRY_VIEW: Record<string, [number, number, number]> = {
  CO: [4.65, -74.1, 6], CR: [9.93, -84.05, 7], GT: [14.63, -90.5, 7],
  HN: [14.05, -87.1, 7], SV: [13.69, -89.21, 8], PA: [8.98, -79.52, 7],
}
const COUNTRY_META: Record<string, { name: string; desc: string; cid: number }> = {
  CO: { name: 'Colombia', desc: 'Ecosistema mas maduro de la region', cid: 1 },
  CR: { name: 'Costa Rica', desc: 'Hub de innovacion centroamericano', cid: 2 },
  SV: { name: 'El Salvador', desc: 'Zona prioritaria Morazan', cid: 3 },
  GT: { name: 'Guatemala', desc: 'Foco en cafe y poblacion indigena', cid: 4 },
  HN: { name: 'Honduras', desc: 'Potencial agroindustrial', cid: 5 },
  PA: { name: 'Panama', desc: 'Ventajas logisticas regionales', cid: 6 },
}

export default function MapaPage() {
  const [pts, setPts] = useState<Pt[]>([])
  const [countryData, setCountryData] = useState<Record<string, CountryStat>>({})

  // Carga de actores reales + stats por pais
  useEffect(() => {
    Promise.all([getGeoActors(), getDashboardStats(), getBenchmarks({ metric: 'inversion_agrifoodtech' })])
      .then(([acts, ds, inv]) => {
        const seen: Record<string, number> = {}
        const built: Pt[] = acts.filter(a => a.lat != null && a.lng != null).map(a => {
          const m = ENUM_MAP[a.type] || { full: 'startup', chip: 'x', label: a.type }
          const iso = a.countries?.iso2 || ''
          const key = `${a.lat},${a.lng}`
          const n = (seen[key] = (seen[key] || 0) + 1) - 1
          // jitter deterministico en espiral para no apilar actores que comparten ciudad
          const ang = n * 2.399963
          const rad = n ? 0.05 * Math.sqrt(n) : 0
          const lat = (a.lat as number) + Math.cos(ang) * rad
          const lng = (a.lng as number) + Math.sin(ang) * rad
          const ini = a.name.split(' ').slice(0, 2).map(w => w[0] || '').join('').toUpperCase()
          return { id: a.id, name: a.name, lat, lng, iso2: iso, fullType: m.full, chipKey: m.chip, flag: FLAG[iso] || '🌎', sub: `${m.label}${a.city ? ' · ' + a.city : ''}`, ini, website: a.website }
        })
        const invBy: Record<number, number> = {}
        for (const b of inv) if (b.country_id && b.value != null) invBy[b.country_id] = Number(b.value)
        const cd: Record<string, CountryStat> = {}
        for (const row of ds) {
          const iso = (row as any).iso2; const meta = COUNTRY_META[iso]; if (!meta) continue
          const total = (row as any).total || 0
          const fund = invBy[meta.cid]
          cd[iso] = {
            flag: FLAG[iso], name: meta.name, desc: meta.desc,
            actors: String(total), startups: String((row as any).startups),
            funding: fund ? `$${Math.round(fund)}M` : 's/d',
            gender: total ? Math.round((row as any).lideradas_mujer / total * 100) + '%' : '0%',
          }
        }
        setPts(built)
        setCountryData(cd)
      }).catch(() => {})
  }, [])

  // Leaflet: se (re)construye cuando los actores reales estan cargados
  useEffect(() => {
    if (!pts.length) return
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
        subdomains: 'abcd', maxZoom: 19, attribution: '&copy; OpenStreetMap &copy; CARTO',
      }).addTo(map)

      const markers = pts.map(p => {
        const color = TYPE_COLOR[p.fullType] ?? '#00A79D'
        const icon = L.divIcon({
          className: 'vx-pin-wrap',
          html: `<div class="vx-pin" style="background:${color}">${p.ini}</div>`,
          iconSize: [30, 30], iconAnchor: [15, 15], popupAnchor: [0, -16],
        })
        const m = L.marker([p.lat, p.lng], { icon, title: p.name }).addTo(map)
        const link = p.website ? `<br><a href="${p.website}" target="_blank" rel="noopener" style="color:#00A79D;font-size:12px">Sitio web</a>` : ''
        m.bindPopup(`<strong>${p.name}</strong><br><span style="color:#7a8599;font-size:12px">${p.sub}</span>${link}`)
        m.on('click', () => showCountryPanel(p.iso2))
        return { marker: m, type: p.fullType, country: p.iso2, name: p.name, lat: p.lat, lng: p.lng }
      })

      const group = L.featureGroup(markers.map(m => m.marker))
      map.fitBounds(group.getBounds().pad(0.08), { maxZoom: 7, padding: [40, 40] })
      setTimeout(() => map && map.invalidateSize(), 200)

      const countEl = document.getElementById('mapActorCount')
      function setCount(n: number) { if (countEl) countEl.textContent = String(n) }

      function applyFilter(filterKey: string) {
        const type = filterKey === 'all' ? 'all' : CHIP_TYPE[filterKey] ?? filterKey
        let visible = 0
        markers.forEach(m => {
          const show = type === 'all' || m.type === type
          if (show) { m.marker.addTo(map); visible++ } else { map.removeLayer(m.marker) }
        })
        document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => {
          const show = filterKey === 'all' || a.dataset.type === filterKey
          a.classList.toggle('hidden', !show)
        })
        setCount(visible)
      }

      const chips = Array.from(document.querySelectorAll<HTMLElement>('.map-chip'))
      chips.forEach(c => {
        const h = () => { chips.forEach(x => x.classList.remove('active')); c.classList.add('active'); applyFilter(c.dataset.filter || 'all') }
        c.addEventListener('click', h); cleanupFns.push(() => c.removeEventListener('click', h))
      })

      const legendKeys = ['s', 'i', 'e', 'g', 'a']
      document.querySelectorAll<HTMLElement>('.map-legend-item').forEach((item, i) => {
        const h = () => { const key = legendKeys[i] || 'all'; chips.forEach(x => x.classList.toggle('active', x.dataset.filter === key)); applyFilter(key) }
        item.addEventListener('click', h); cleanupFns.push(() => item.removeEventListener('click', h))
      })

      const searchInput = document.getElementById('mapSearch') as HTMLInputElement | null
      if (searchInput) {
        const h = () => {
          const q = searchInput.value.toLowerCase()
          let visible = 0
          markers.forEach(m => { const show = m.name.toLowerCase().includes(q); if (show) { m.marker.addTo(map); visible++ } else { map.removeLayer(m.marker) } })
          document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => { const show = (a.textContent || '').toLowerCase().includes(q); a.classList.toggle('hidden', !show) })
          setCount(visible)
        }
        searchInput.addEventListener('input', h); cleanupFns.push(() => searchInput.removeEventListener('input', h))
      }

      document.querySelectorAll<HTMLElement>('.map-actor').forEach(a => {
        const h = () => {
          document.querySelectorAll('.map-actor').forEach(x => x.classList.remove('selected'))
          a.classList.add('selected')
          const name = a.querySelector('.map-actor-name')?.textContent?.trim()
          const found = markers.find(m => m.name === name)
          if (found) { map.flyTo([found.lat, found.lng], 9, { duration: 0.8 }); found.marker.openPopup() }
          else { const code = a.dataset.country; const v = code && COUNTRY_VIEW[code]; if (v) map.flyTo([v[0], v[1]], v[2], { duration: 0.8 }) }
        }
        a.addEventListener('click', h); cleanupFns.push(() => a.removeEventListener('click', h))
      })

      function showCountryPanel(code: string) {
        const d = countryData[code]; if (!d) return
        const set = (id: string, v: string) => { const el = document.getElementById(id); if (el) el.textContent = v }
        set('cpFlag', d.flag + ' '); set('cpName', d.name); set('cpDesc', d.desc)
        set('cpActors', d.actors); set('cpStartups', d.startups); set('cpFunding', d.funding); set('cpGender', d.gender)
        const btn = document.getElementById('cpBtn') as HTMLElement | null
        if (btn) btn.dataset.country = code
        document.getElementById('countryPanel')?.classList.add('show')
        const v = COUNTRY_VIEW[code]; if (v) map.flyTo([v[0], v[1]], v[2], { duration: 0.8 })
      }

      const on = (id: string, fn: () => void) => { const el = document.getElementById(id); if (el) { el.addEventListener('click', fn); cleanupFns.push(() => el.removeEventListener('click', fn)) } }
      on('zoomIn', () => map.zoomIn())
      on('zoomOut', () => map.zoomOut())
      on('resetMap', () => { map.fitBounds(group.getBounds().pad(0.08), { maxZoom: 7, padding: [40, 40] }); document.getElementById('countryPanel')?.classList.remove('show') })

      let isFullscreen = false
      on('fullscreenBtn', () => {
        isFullscreen = !isFullscreen
        document.body.classList.toggle('fullscreen-mode', isFullscreen)
        document.getElementById('fullscreenBtn')?.classList.toggle('active', isFullscreen)
        setTimeout(() => map && map.invalidateSize(), 350)
      })

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
      const totalActors = pts.length
      const isoSet = Object.keys(countryData)
      const countries = isoSet.length || 6
      const avgDensity = Math.round(totalActors / countries)
      const genderVals = Object.values(countryData).map(c => parseInt(c.gender) || 0)
      const avgGender = genderVals.length ? Math.round(genderVals.reduce((s, v) => s + v, 0) / genderVals.length) : 0
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
  }, [pts, countryData])

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

          <div className="map-count">Mostrando <strong id="mapActorCount">{pts.length}</strong> actores en 6 paises</div>

          <div className="map-list">
            {pts.map((p, i) => (
              <div key={p.id} className={`map-actor${i === 0 ? ' selected' : ''}`} data-type={p.chipKey} data-country={p.iso2}>
                <div className={`map-actor-icon ${p.chipKey}`}>{p.ini}</div>
                <div><div className="map-actor-name">{p.name}</div><div className="map-actor-sub">{p.sub}</div></div>
                <div className="map-actor-country">{p.flag}</div>
              </div>
            ))}
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
              <div className="country-panel-stat"><div className="country-panel-val" id="cpActors">-</div><div className="country-panel-label">Actores</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpStartups">-</div><div className="country-panel-label">Startups</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpFunding">-</div><div className="country-panel-label">Inversion</div></div>
              <div className="country-panel-stat"><div className="country-panel-val" id="cpGender">-</div><div className="country-panel-label">Mujeres</div></div>
            </div>
            <button id="cpBtn" className="country-panel-btn" onClick={(e) => { const c = (e.currentTarget as HTMLElement).dataset.country; window.location.href = c ? `/pais?c=${c}` : '/pais' }}>Ver perfil completo →</button>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
