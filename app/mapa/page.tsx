'use client'

import AppLayout from '@/components/AppLayout'
import { useEffect } from 'react'

export default function MapaPage() {
  useEffect(() => {
    const chips = document.querySelectorAll<HTMLElement>('.map-chip')
    const actors = document.querySelectorAll<HTMLElement>('.map-actor')
    const countEl = document.getElementById('mapActorCount')

    chips.forEach(c => {
      c.addEventListener('click', () => {
        chips.forEach(x => x.classList.remove('active'))
        c.classList.add('active')
        const f = c.dataset.filter; let count = 0
        actors.forEach(a => {
          const show = f === 'all' || a.dataset.type === f
          a.classList.toggle('hidden', !show)
          if (show) count++
        })
        if (countEl) countEl.textContent = String(count)
        filterMapDots(f || 'all')
      })
    })

    actors.forEach(a => {
      a.addEventListener('click', () => {
        actors.forEach(x => x.classList.remove('selected'))
        a.classList.add('selected')
        const dotId = a.dataset.dot
        if (dotId) {
          const dot = document.getElementById(dotId)
          if (dot) {
            dot.style.transform = 'scale(2.5)'
            dot.style.boxShadow = '0 0 0 6px rgba(0,167,157,.3)'
            setTimeout(() => { dot.style.transform = ''; dot.style.boxShadow = '' }, 1500)
          }
        }
      })
    })

    const searchInput = document.getElementById('mapSearch') as HTMLInputElement | null
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        const q = this.value.toLowerCase(); let count = 0
        actors.forEach(a => {
          const show = (a.textContent || '').toLowerCase().includes(q)
          a.classList.toggle('hidden', !show)
          if (show) count++
        })
        if (countEl) countEl.textContent = String(count)
      })
    }

    let scale = 1
    const dotsContainer = document.querySelector<HTMLElement>('.map-dots')
    const mapSvgEl = document.querySelector<HTMLElement>('.latam-map')

    function zoomMap(factor: number) {
      scale = Math.max(0.5, Math.min(3, scale * factor))
      if (dotsContainer) dotsContainer.style.transform = `scale(${scale})`
      if (mapSvgEl) mapSvgEl.style.transform = `scale(${scale})`
    }
    function resetMap() {
      scale = 1
      if (dotsContainer) dotsContainer.style.transform = ''
      if (mapSvgEl) mapSvgEl.style.transform = ''
      const panel = document.getElementById('countryPanel')
      if (panel) panel.classList.remove('show')
    }

    const zoomIn = document.getElementById('zoomIn')
    const zoomOut = document.getElementById('zoomOut')
    const resetBtn = document.getElementById('resetMap')
    zoomIn?.addEventListener('click', () => zoomMap(1.2))
    zoomOut?.addEventListener('click', () => zoomMap(0.8))
    resetBtn?.addEventListener('click', resetMap)

    const countryData: Record<string, { flag: string; name: string; desc: string; actors: string; startups: string; funding: string; gender: string }> = {
      CO: { flag: '🇨🇴', name: 'Colombia', desc: 'Ecosistema mas maduro de la region', actors: '486', startups: '234', funding: '$42M', gender: '22%' },
      CR: { flag: '🇨🇷', name: 'Costa Rica', desc: 'Hub de innovacion centroamericano', actors: '198', startups: '89', funding: '$18M', gender: '28%' },
      GT: { flag: '🇬🇹', name: 'Guatemala', desc: 'Enfoque en cafe y cacao', actors: '147', startups: '56', funding: '$8M', gender: '15%' },
      HN: { flag: '🇭🇳', name: 'Honduras', desc: 'Crecimiento acelerado en AgTech', actors: '132', startups: '48', funding: '$6M', gender: '12%' },
      SV: { flag: '🇸🇻', name: 'El Salvador', desc: 'Zona prioritaria Morazan', actors: '94', startups: '34', funding: '$4M', gender: '19%' },
      PA: { flag: '🇵🇦', name: 'Panama', desc: 'Hub financiero regional', actors: '162', startups: '67', funding: '$22M', gender: '24%' },
    }

    function showCountryPanel(code: string) {
      const d = countryData[code]; if (!d) return
      const p = document.getElementById('countryPanel')
      const cpFlag = document.getElementById('cpFlag')
      const cpName = document.getElementById('cpName')
      const cpDesc = document.getElementById('cpDesc')
      const cpActors = document.getElementById('cpActors')
      const cpStartups = document.getElementById('cpStartups')
      const cpFunding = document.getElementById('cpFunding')
      const cpGender = document.getElementById('cpGender')
      if (cpFlag) cpFlag.textContent = d.flag + ' '
      if (cpName) cpName.textContent = d.name
      if (cpDesc) cpDesc.textContent = d.desc
      if (cpActors) cpActors.textContent = d.actors
      if (cpStartups) cpStartups.textContent = d.startups
      if (cpFunding) cpFunding.textContent = d.funding
      if (cpGender) cpGender.textContent = d.gender
      if (p) p.classList.add('show')
      const cpBtn = document.getElementById('cpBtn') as HTMLElement | null
      if (cpBtn) cpBtn.dataset.country = code
      document.querySelectorAll<HTMLElement>('.dot').forEach(dot => {
        if (dot.dataset.country === code) { dot.style.opacity = '1'; dot.style.transform = 'scale(1.3)' }
        else { dot.style.opacity = '.3'; dot.style.transform = 'scale(.8)' }
      })
    }

    // #5: todo dot tiene tooltip (los vacios reciben el nombre del pais)
    const COUNTRY_NAMES: Record<string, string> = { CO:'Colombia', CR:'Costa Rica', GT:'Guatemala', HN:'Honduras', SV:'El Salvador', PA:'Panama', REG:'Regional' }
    document.querySelectorAll<HTMLElement>('.dot').forEach(dot => {
      if (!dot.querySelector('.dot-tooltip')) {
        const span = document.createElement('span')
        span.className = 'dot-tooltip'
        span.textContent = COUNTRY_NAMES[dot.dataset.country ?? ''] ?? 'Actor'
        dot.appendChild(span)
      }
    })

    document.querySelectorAll<HTMLElement>('.dot[data-country]').forEach(dot => {
      dot.addEventListener('click', (e) => {
        const code = dot.dataset.country
        if (code && countryData[code]) { e.stopPropagation(); showCountryPanel(code) }
      })
    })

    // Mapea la clave del chip/leyenda a la clase real del dot
    const DOT_CLASS: Record<string, string> = { i: 'inv', e: 'eso', g: 'gov', a: 'aca', c: 'cor', r: 'red' }
    const NON_STARTUP = ['inv', 'eso', 'gov', 'aca', 'cor', 'red']
    function filterMapDots(type: string) {
      document.querySelectorAll<HTMLElement>('.dot').forEach(d => {
        if (type === 'all') { d.style.opacity = '.8'; d.style.display = ''; return }
        const match = type === 's'
          ? NON_STARTUP.every(cls => !d.classList.contains(cls))
          : d.classList.contains(DOT_CLASS[type] ?? type)
        d.style.opacity = match ? '.8' : '.15'
      })
    }

    document.querySelectorAll<HTMLElement>('.map-legend-item').forEach((item, i) => {
      const types = ['s', 'i', 'e', 'g', 'a']
      item.addEventListener('click', () => filterMapDots(types[i] || 'all'))
    })

    // Heatmap
    const heatmapData = [
      { top: '42%', left: '48%', size: 180, intensity: .7, color: '0,167,157' },
      { top: '38%', left: '44%', size: 120, intensity: .45, color: '0,167,157' },
      { top: '45%', left: '51%', size: 100, intensity: .35, color: '0,167,157' },
      { top: '32%', left: '33%', size: 140, intensity: .55, color: '99,102,241' },
      { top: '24%', left: '26%', size: 120, intensity: .45, color: '245,158,11' },
      { top: '26%', left: '31%', size: 110, intensity: .4, color: '236,72,153' },
      { top: '27%', left: '27%', size: 90, intensity: .3, color: '139,92,246' },
      { top: '34%', left: '38%', size: 130, intensity: .5, color: '16,185,129' },
    ]
    function buildHeatmap() {
      const overlay = document.getElementById('heatmapOverlay')
      if (!overlay) return
      overlay.innerHTML = ''
      heatmapData.forEach(h => {
        const blob = document.createElement('div')
        blob.className = 'heatmap-blob'
        blob.style.cssText = `top:${h.top};left:${h.left};width:${h.size}px;height:${h.size}px;background:radial-gradient(circle,rgba(${h.color},${h.intensity}) 0%,rgba(${h.color},${h.intensity * .4}) 40%,rgba(${h.color},0) 70%)`
        overlay.appendChild(blob)
      })
    }
    buildHeatmap()

    let heatmapActive = false
    let clusterActive = false

    function toggleHeatmap() {
      heatmapActive = !heatmapActive
      document.body.classList.toggle('heatmap-active', heatmapActive)
      document.getElementById('heatmapBtn')?.classList.toggle('active', heatmapActive)
      document.getElementById('heatmapOverlay')?.classList.toggle('visible', heatmapActive)
      if (heatmapActive && clusterActive) toggleClusters()
    }

    const clusterDefs = [
      { top: '41%', left: '48%', count: 7, size: 'large', label: 'Colombia' },
      { top: '32%', left: '33%', count: 4, size: 'medium', label: 'Costa Rica' },
      { top: '24%', left: '26%', count: 3, size: 'small', label: 'Guatemala' },
      { top: '26%', left: '31%', count: 3, size: 'small', label: 'Honduras' },
      { top: '27%', left: '27%', count: 2, size: 'small', label: 'El Salvador' },
      { top: '34%', left: '38%', count: 3, size: 'small', label: 'Panama' },
    ]
    function buildClusters() {
      const container = document.getElementById('clusterContainer')
      if (!container) return
      container.innerHTML = ''
      clusterDefs.forEach((c, i) => {
        const el = document.createElement('div')
        el.className = `cluster-bubble ${c.size}`
        el.style.cssText = `top:${c.top};left:${c.left};pointer-events:auto;animation-delay:${i * 80}ms`
        el.textContent = String(c.count)
        el.title = `${c.label}: ${c.count} puntos`
        el.addEventListener('click', () => toggleClusters())
        container.appendChild(el)
      })
    }
    function toggleClusters() {
      clusterActive = !clusterActive
      document.body.classList.toggle('cluster-active', clusterActive)
      document.getElementById('clusterBtn')?.classList.toggle('active', clusterActive)
      const container = document.getElementById('clusterContainer')
      if (!container) return
      if (clusterActive) { buildClusters(); if (heatmapActive) toggleHeatmap() }
      else container.innerHTML = ''
    }

    // Radius
    let radiusActive = false
    let activeRadiusEl: HTMLElement | null = null
    function clearRadius() {
      if (activeRadiusEl) { activeRadiusEl.remove(); activeRadiusEl = null }
    }
    function toggleRadius() {
      radiusActive = !radiusActive
      document.body.classList.toggle('radius-active', radiusActive)
      document.getElementById('radiusBtn')?.classList.toggle('active', radiusActive)
      if (!radiusActive) clearRadius()
    }
    document.querySelectorAll<HTMLElement>('.dot').forEach(dot => {
      dot.addEventListener('click', function (e) {
        if (!radiusActive) return
        e.stopPropagation()
        clearRadius()
        const canvas = document.querySelector<HTMLElement>('.map-canvas')
        if (!canvas) return
        const canvasRect = canvas.getBoundingClientRect()
        const dotRect = this.getBoundingClientRect()
        const cx = dotRect.left - canvasRect.left + dotRect.width / 2
        const cy = dotRect.top - canvasRect.top + dotRect.height / 2
        const radiusPx = 150
        let nearby = 0
        document.querySelectorAll<HTMLElement>('.dot').forEach(d => {
          if (d === dot) return
          const dr = d.getBoundingClientRect()
          const dx = (dr.left + dr.width / 2) - (dotRect.left + dotRect.width / 2)
          const dy = (dr.top + dr.height / 2) - (dotRect.top + dotRect.height / 2)
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist <= radiusPx) { nearby++; d.style.opacity = '1'; d.style.transform = 'scale(1.4)'; d.style.zIndex = '5' }
          else { d.style.opacity = '.25'; d.style.transform = 'scale(.7)' }
        })
        this.style.opacity = '1'; this.style.transform = 'scale(1.8)'; this.style.zIndex = '10'
        const circle = document.createElement('div')
        circle.className = 'radius-circle'
        circle.style.cssText = `left:${cx}px;top:${cy}px;width:${radiusPx * 2}px;height:${radiusPx * 2}px`
        circle.innerHTML = `<div class="radius-count">${nearby} actor${nearby !== 1 ? 'es' : ''} cercano${nearby !== 1 ? 's' : ''}</div>`
        canvas.appendChild(circle)
        activeRadiusEl = circle
      })
    })
    const canvas = document.querySelector<HTMLElement>('.map-canvas')
    canvas?.addEventListener('click', function (e) {
      if (!radiusActive) return
      const target = e.target as HTMLElement
      if (target.classList.contains('dot') || target.closest?.('.dot')) return
      clearRadius()
      document.querySelectorAll<HTMLElement>('.dot').forEach(d => { d.style.opacity = ''; d.style.transform = ''; d.style.zIndex = '' })
    })

    // Fullscreen
    let isFullscreen = false
    function toggleFullscreen() {
      isFullscreen = !isFullscreen
      document.body.classList.toggle('fullscreen-mode', isFullscreen)
      document.getElementById('fullscreenBtn')?.classList.toggle('active', isFullscreen)
    }
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isFullscreen) toggleFullscreen()
    }
    document.addEventListener('keydown', handleKeydown)

    document.getElementById('heatmapBtn')?.addEventListener('click', toggleHeatmap)
    document.getElementById('clusterBtn')?.addEventListener('click', toggleClusters)
    document.getElementById('radiusBtn')?.addEventListener('click', toggleRadius)
    document.getElementById('fullscreenBtn')?.addEventListener('click', toggleFullscreen)

    // Stats overlay animated counters
    function animateCounter(el: HTMLElement, target: number, suffix = '', duration = 1200) {
      const start = performance.now()
      function tick(now: number) {
        const elapsed = now - start
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        el.textContent = Math.round(target * eased).toLocaleString() + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }
    function populateStats() {
      const totalActors = Object.values(countryData).reduce((s, c) => s + parseInt(c.actors), 0)
      const countries = Object.keys(countryData).length
      const avgDensity = Math.round(totalActors / countries)
      const genderValues = Object.values(countryData).map(c => parseInt(c.gender))
      const avgGender = Math.round(genderValues.reduce((s, v) => s + v, 0) / genderValues.length)
      setTimeout(() => {
        const s1 = document.getElementById('statTotalActors')
        const s2 = document.getElementById('statCountries')
        const s3 = document.getElementById('statDensity')
        const s4 = document.getElementById('statGender')
        if (s1) animateCounter(s1, totalActors)
        if (s2) animateCounter(s2, countries)
        if (s3) animateCounter(s3, avgDensity)
        if (s4) animateCounter(s4, avgGender, '%')
        const pill = document.getElementById('pillActors')
        if (pill) animateCounter(pill, totalActors)
      }, 300)
    }
    populateStats()

    return () => {
      document.removeEventListener('keydown', handleKeydown)
      document.body.classList.remove('heatmap-active', 'cluster-active', 'radius-active', 'fullscreen-mode')
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
            <div className="map-actor selected" data-type="s" data-country="CO" data-dot="dot-bogota">
              <div className="map-actor-icon s">AS</div>
              <div><div className="map-actor-name">AgroSmart CO</div><div className="map-actor-sub">Startup · AgTech precision · Cafe</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="i" data-country="REG" data-dot="dot-bogota">
              <div className="map-actor-icon i">PI</div>
              <div><div className="map-actor-name">Pomona Impact</div><div className="map-actor-sub">Inversor · Fondo impacto</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="e" data-country="HN" data-dot="dot-tegucigalpa">
              <div className="map-actor-icon e">AH</div>
              <div><div className="map-actor-name">Agro-Hub Zamorano</div><div className="map-actor-sub">ESO · Aceleradora</div></div>
              <div className="map-actor-country">🇭🇳</div>
            </div>
            <div className="map-actor" data-type="s" data-country="GT" data-dot="dot-guatemala">
              <div className="map-actor-icon s">CT</div>
              <div><div className="map-actor-name">CafeTrace GT</div><div className="map-actor-sub">Startup · Trazabilidad · Cafe</div></div>
              <div className="map-actor-country">🇬🇹</div>
            </div>
            <div className="map-actor" data-type="s" data-country="SV" data-dot="dot-sansalvador">
              <div className="map-actor-icon s">BF</div>
              <div><div className="map-actor-name">BioFresh SV</div><div className="map-actor-sub">Startup · FoodTech · Frutas</div></div>
              <div className="map-actor-country">🇸🇻</div>
            </div>
            <div className="map-actor" data-type="s" data-country="HN" data-dot="dot-tegucigalpa">
              <div className="map-actor-icon s">RV</div>
              <div><div className="map-actor-name">RiegoVerde HN</div><div className="map-actor-sub">Startup · Riego · Granos basicos</div></div>
              <div className="map-actor-country">🇭🇳</div>
            </div>
            <div className="map-actor" data-type="i" data-country="REG" data-dot="dot-panama">
              <div className="map-actor-icon i">IN</div>
              <div><div className="map-actor-name">INNOGEN Fondo III</div><div className="map-actor-sub">Inversor · VC · BID Lab</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="s" data-country="PA" data-dot="dot-panama">
              <div className="map-actor-icon s">AC</div>
              <div><div className="map-actor-name">AquaCrop PA</div><div className="map-actor-sub">Startup · Riego y agua</div></div>
              <div className="map-actor-country">🇵🇦</div>
            </div>
            <div className="map-actor" data-type="g" data-country="CR" data-dot="dot-sanjose">
              <div className="map-actor-icon g">PR</div>
              <div><div className="map-actor-name">PROCOMER</div><div className="map-actor-sub">Gobierno · Exportaciones</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="s" data-country="CO" data-dot="dot-bogota">
              <div className="map-actor-icon s">LS</div>
              <div><div className="map-actor-name">LogiSiembra CO</div><div className="map-actor-sub">Startup · Logistica · Hortalizas</div></div>
              <div className="map-actor-country">🇨🇴</div>
            </div>
            <div className="map-actor" data-type="a" data-country="CR" data-dot="dot-sanjose">
              <div className="map-actor-icon a">UE</div>
              <div><div className="map-actor-name">U. EARTH Costa Rica</div><div className="map-actor-sub">Academia · Biotecnologia</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="c" data-country="CR" data-dot="dot-sanjose">
              <div className="map-actor-icon c">CB</div>
              <div><div className="map-actor-name">Cafe Britt Tech</div><div className="map-actor-sub">Corporativo · Innovacion</div></div>
              <div className="map-actor-country">🇨🇷</div>
            </div>
            <div className="map-actor" data-type="r" data-country="REG" data-dot="dot-bogota">
              <div className="map-actor-icon r">AL</div>
              <div><div className="map-actor-name">AgriTech LATAM Net</div><div className="map-actor-sub">Red · 450+ miembros</div></div>
              <div className="map-actor-country">🌎</div>
            </div>
            <div className="map-actor" data-type="g" data-country="PA" data-dot="dot-panama">
              <div className="map-actor-icon g">SE</div>
              <div><div className="map-actor-name">SENACYT Panama</div><div className="map-actor-sub">Gobierno · Ciencia y tecnologia</div></div>
              <div className="map-actor-country">🇵🇦</div>
            </div>
          </div>
        </div>

        <div className="map-canvas">
          <div style={{position:'absolute',inset:0,background:'linear-gradient(180deg,#e8ecf2,#d4dbe6)'}}></div>

          <div className="latam-map">
            <svg viewBox="0 0 400 500" fill="var(--fg)">
              <path d="M120 60 L180 50 L200 70 L210 90 L190 110 L200 130 L180 150 L170 140 L160 155 L140 150 L130 130 L120 120 L110 100 L115 80Z"/>
              <path d="M160 160 L180 155 L200 140 L220 150 L240 170 L260 200 L250 230 L230 250 L200 240 L180 220 L160 200 L150 180Z"/>
              <path d="M130 100 L110 110 L100 130 L110 140 L125 135Z"/>
              <path d="M145 105 L155 100 L165 110 L155 120 L140 115Z"/>
              <path d="M115 80 L130 75 L135 90 L125 95Z"/>
              <path d="M200 130 L215 125 L225 140 L215 150Z"/>
            </svg>
          </div>

          <span className="country-label" style={{top:'38%',left:'47%'}}>Colombia</span>
          <span className="country-label" style={{top:'30%',left:'31%'}}>Costa Rica</span>
          <span className="country-label" style={{top:'25%',left:'25%'}}>Guatemala</span>
          <span className="country-label" style={{top:'24%',left:'29%'}}>Honduras</span>
          <span className="country-label" style={{top:'26%',left:'24%'}}>El Salvador</span>
          <span className="country-label" style={{top:'33%',left:'36%'}}>Panama</span>

          <div className="map-stats">
            <div className="map-stat-pill"><strong id="pillActors">0</strong> actores</div>
            <div className="map-stat-pill"><strong>6</strong> paises</div>
            <div className="map-stat-pill"><strong>9</strong> cadenas</div>
          </div>

          <div className="map-dots">
            {/* Colombia */}
            <div className="dot lg" id="dot-bogota" style={{top:'42%',left:'48%'}} data-country="CO"><span className="dot-tooltip">Bogota · 486 actores</span></div>
            <div className="dot" style={{top:'38%',left:'44%'}} data-country="CO"><span className="dot-tooltip">Medellin · 124</span></div>
            <div className="dot" style={{top:'45%',left:'51%'}} data-country="CO"><span className="dot-tooltip">Cali · 89</span></div>
            <div className="dot inv" style={{top:'40%',left:'50%'}} data-country="CO"><span className="dot-tooltip">Pomona Impact</span></div>
            <div className="dot" style={{top:'36%',left:'46%'}} data-country="CO"></div>
            <div className="dot" style={{top:'44%',left:'46%'}} data-country="CO"></div>
            <div className="dot eso" style={{top:'41%',left:'52%'}} data-country="CO"></div>
            {/* Costa Rica */}
            <div className="dot lg" id="dot-sanjose" style={{top:'32%',left:'33%'}} data-country="CR"><span className="dot-tooltip">San Jose · 198 actores</span></div>
            <div className="dot" style={{top:'30%',left:'35%'}} data-country="CR"></div>
            <div className="dot inv" style={{top:'33%',left:'31%'}} data-country="CR"></div>
            <div className="dot aca" style={{top:'31%',left:'34%'}} data-country="CR"><span className="dot-tooltip">U. EARTH</span></div>
            {/* Guatemala */}
            <div className="dot lg" id="dot-guatemala" style={{top:'24%',left:'26%'}} data-country="GT"><span className="dot-tooltip">Cd. Guatemala · 147</span></div>
            <div className="dot" style={{top:'22%',left:'28%'}} data-country="GT"></div>
            <div className="dot eso" style={{top:'26%',left:'24%'}} data-country="GT"></div>
            {/* Honduras */}
            <div className="dot lg" id="dot-tegucigalpa" style={{top:'26%',left:'31%'}} data-country="HN"><span className="dot-tooltip">Tegucigalpa · 132</span></div>
            <div className="dot" style={{top:'24%',left:'33%'}} data-country="HN"></div>
            <div className="dot eso" style={{top:'27%',left:'29%'}} data-country="HN"><span className="dot-tooltip">Agro-Hub Zamorano</span></div>
            {/* El Salvador */}
            <div className="dot" id="dot-sansalvador" style={{top:'27%',left:'27%'}} data-country="SV"><span className="dot-tooltip">San Salvador · 94</span></div>
            <div className="dot" style={{top:'28%',left:'25%'}} data-country="SV"></div>
            {/* Panama */}
            <div className="dot lg" id="dot-panama" style={{top:'34%',left:'38%'}} data-country="PA"><span className="dot-tooltip">Cd. Panama · 162</span></div>
            <div className="dot inv" style={{top:'35%',left:'40%'}} data-country="PA"></div>
            <div className="dot gov" style={{top:'33%',left:'37%'}} data-country="PA"><span className="dot-tooltip">SENACYT</span></div>
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
              <button className="heatmap-toggle" id="heatmapBtn" title="Heatmap view">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="7" opacity=".5"/><circle cx="12" cy="12" r="10" opacity=".25"/></svg>
                Heatmap
              </button>
              <button className="cluster-toggle" id="clusterBtn" title="Cluster view">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="8" cy="8" r="3"/><circle cx="16" cy="8" r="2"/><circle cx="12" cy="16" r="4"/></svg>
                Clusters
              </button>
              <button className="radius-toggle" id="radiusBtn" title="Distance radius">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/></svg>
                Radio
              </button>
              <button className="fullscreen-toggle" id="fullscreenBtn" title="Fullscreen">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3"/></svg>
                Pantalla
              </button>
            </div>
          </div>

          <div className="heatmap-overlay" id="heatmapOverlay"></div>
          <div id="clusterContainer" style={{position:'absolute',inset:0,zIndex:3,pointerEvents:'none'}}></div>
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
