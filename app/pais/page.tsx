'use client'

import { useState, useEffect } from 'react'
import AppLayout from '@/components/AppLayout'

type CountryKey = 'CO' | 'CR' | 'SV' | 'GT' | 'HN' | 'PA'

const TABS: { key: CountryKey; flag: string; name: string }[] = [
  { key: 'CO', flag: '🇨🇴', name: 'Colombia' },
  { key: 'CR', flag: '🇨🇷', name: 'Costa Rica' },
  { key: 'SV', flag: '🇸🇻', name: 'El Salvador' },
  { key: 'GT', flag: '🇬🇹', name: 'Guatemala' },
  { key: 'HN', flag: '🇭🇳', name: 'Honduras' },
  { key: 'PA', flag: '🇵🇦', name: 'Panama' },
]

type StatItem = { l: string; v: number | string; s: string; pf?: string; sf?: string }

const DATA: Record<CountryKey, {
  phase: string; phaseClass: string; desc: string;
  stats: StatItem[];
  thematic: { l: string; w: number; v: number }[];
  chains: { l: string; w: number; v: number }[];
  funding: [string, string, string, string, string][];
  zones: { title: string; rows: [string, string, number, string, string][] };
}> = {
  CO: {
    phase: 'Ecosistema maduro', phaseClass: 'phase-maduro',
    desc: 'Ecosistema mas maduro de la region. Foco en region Caribe: La Guajira, Sucre, Cordoba (excl. Monteria), Magdalena. Base solida de startups AgrifoodTech con ecosistema de inversion activo.',
    stats: [
      { l: 'Startups', v: 486, s: '73 en zonas prioritarias' },
      { l: 'Inversores', v: 127, s: '34 con foco agrifoodtech' },
      { l: 'ESOs', v: 89, s: '12 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 18, s: '88 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 68, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'AgTech precision', w: 72, v: 142 }, { l: 'FoodTech', w: 48, v: 96 },
      { l: 'Logistica', w: 35, v: 68 }, { l: 'Fintech agro', w: 30, v: 58 },
      { l: 'Trazabilidad', w: 25, v: 49 }, { l: 'Clima/carbono', w: 18, v: 36 },
      { l: 'Riego y agua', w: 12, v: 22 }, { l: 'Biotecnologia', w: 8, v: 15 },
    ],
    chains: [
      { l: 'Cafe', w: 80, v: 156 }, { l: 'Hortalizas', w: 45, v: 89 },
      { l: 'Cacao', w: 38, v: 74 }, { l: 'Frutas', w: 32, v: 62 },
      { l: 'Aguacate', w: 22, v: 43 }, { l: 'Lacteos', w: 16, v: 31 },
      { l: 'Granos basicos', w: 10, v: 19 }, { l: 'Cana', w: 6, v: 12 },
    ],
    funding: [
      ['AgroSmart CO', 'Seed', 'Pomona Impact, INNOGEN III', '$1.2M', 'Mar 2026'],
      ['CafeChain', 'Serie A', 'SPventures', '$4.5M', 'Feb 2026'],
      ['LogiSiembra', 'Seed', 'Village Capital', '$800K', 'Ene 2026'],
      ['BioInsumos CO', 'Pre-seed', 'Angel investors', '$250K', 'Dic 2025'],
      ['AquaColombia', 'Seed', 'INNOGEN III', '$600K', 'Nov 2025'],
    ],
    zones: { title: 'Zonas prioritarias — Region Caribe', rows: [
      ['La Guajira', 'Departamento', 12, '28%', 'Alta vulnerabilidad'],
      ['Sucre', 'Departamento', 18, '34%', 'Alta vulnerabilidad'],
      ['Cordoba (excl. Monteria)', 'Departamento', 24, '41%', 'Region Caribe'],
      ['Magdalena', 'Departamento', 19, '36%', 'Alta vulnerabilidad'],
    ]},
  },
  CR: {
    phase: 'Ecosistema emergente', phaseClass: 'phase-emergente',
    desc: 'Hub de innovacion centroamericano con ecosistema solido de ESOs y aceleradoras. Fuerte en biotecnologia y agricultura regenerativa. Conexion activa con Silicon Valley.',
    stats: [
      { l: 'Startups', v: 198, s: '34 en AgTech precision' },
      { l: 'Inversores', v: 45, s: '12 con foco agrifoodtech' },
      { l: 'ESOs', v: 67, s: '8 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 28, s: '55 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 22, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'Biotecnologia', w: 65, v: 48 }, { l: 'AgTech precision', w: 52, v: 38 },
      { l: 'FoodTech', w: 40, v: 29 }, { l: 'Clima/carbono', w: 35, v: 26 },
      { l: 'Trazabilidad', w: 20, v: 15 }, { l: 'Logistica', w: 15, v: 11 },
      { l: 'Fintech agro', w: 10, v: 7 }, { l: 'Riego y agua', w: 6, v: 4 },
    ],
    chains: [
      { l: 'Cafe', w: 65, v: 52 }, { l: 'Frutas', w: 50, v: 40 },
      { l: 'Hortalizas', w: 38, v: 30 }, { l: 'Cacao', w: 28, v: 22 },
      { l: 'Cana', w: 18, v: 14 }, { l: 'Lacteos', w: 12, v: 10 },
      { l: 'Aguacate', w: 8, v: 6 }, { l: 'Granos basicos', w: 5, v: 4 },
    ],
    funding: [
      ['TicaAgro', 'Seed', 'Carao Ventures', '$900K', 'Mar 2026'],
      ['BioVerde CR', 'Serie A', 'Ibo Capital', '$3.2M', 'Feb 2026'],
      ['CafeDigital', 'Pre-seed', 'Angels', '$180K', 'Ene 2026'],
    ],
    zones: { title: 'Zonas prioritarias — Costa Rica', rows: [
      ['Zona Norte', 'Region', 14, '45%', 'Alta ruralidad'],
      ['Osa / Golfito', 'Canton', 8, '32%', 'Biodiversidad'],
    ]},
  },
  SV: {
    phase: 'Ecosistema naciente', phaseClass: 'phase-naciente',
    desc: 'Ecosistema en crecimiento con enfoque en zona prioritaria de Morazan. FoodTech y trazabilidad son areas de mayor actividad. Programa de adopcion tecnologica con pequenos productores.',
    stats: [
      { l: 'Startups', v: 94, s: '18 en zonas prioritarias' },
      { l: 'Inversores', v: 12, s: '4 con foco agrifoodtech' },
      { l: 'ESOs', v: 23, s: '3 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 19, s: '18 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 4, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'FoodTech', w: 55, v: 18 }, { l: 'Trazabilidad', w: 42, v: 14 },
      { l: 'AgTech precision', w: 30, v: 10 }, { l: 'Logistica', w: 22, v: 7 },
      { l: 'Granos basicos', w: 18, v: 6 }, { l: 'Clima/carbono', w: 12, v: 4 },
      { l: 'Fintech agro', w: 8, v: 3 }, { l: 'Riego y agua', w: 5, v: 2 },
    ],
    chains: [
      { l: 'Cafe', w: 60, v: 22 }, { l: 'Granos basicos', w: 48, v: 18 },
      { l: 'Hortalizas', w: 30, v: 11 }, { l: 'Cana', w: 22, v: 8 },
      { l: 'Frutas', w: 15, v: 6 }, { l: 'Cacao', w: 10, v: 4 },
      { l: 'Aguacate', w: 6, v: 2 }, { l: 'Lacteos', w: 4, v: 1 },
    ],
    funding: [
      ['AgroTech SV', 'Pre-seed', 'CONAMYPE', '$120K', 'Feb 2026'],
      ['CafeMorazan', 'Seed', 'INNOGEN III', '$450K', 'Dic 2025'],
    ],
    zones: { title: 'Zonas prioritarias — El Salvador', rows: [
      ['Morazan', 'Departamento', 8, '22%', 'Alta vulnerabilidad'],
    ]},
  },
  GT: {
    phase: 'Ecosistema naciente', phaseClass: 'phase-naciente',
    desc: 'Enfoque en cafe de especialidad y cadena de cacao en Alta Verapaz (zona prioritaria). Trazabilidad blockchain y conexion directa productor-comprador como temas emergentes.',
    stats: [
      { l: 'Startups', v: 147, s: '28 en zonas prioritarias' },
      { l: 'Inversores', v: 18, s: '6 con foco agrifoodtech' },
      { l: 'ESOs', v: 31, s: '4 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 15, s: '22 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 8, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'Trazabilidad', w: 60, v: 34 }, { l: 'AgTech precision', w: 45, v: 26 },
      { l: 'FoodTech', w: 32, v: 18 }, { l: 'Clima/carbono', w: 25, v: 14 },
      { l: 'Logistica', w: 18, v: 10 }, { l: 'Biotecnologia', w: 12, v: 7 },
      { l: 'Fintech agro', w: 8, v: 5 }, { l: 'Riego y agua', w: 5, v: 3 },
    ],
    chains: [
      { l: 'Cafe', w: 75, v: 46 }, { l: 'Cacao', w: 55, v: 34 },
      { l: 'Cardamomo', w: 35, v: 22 }, { l: 'Hortalizas', w: 25, v: 15 },
      { l: 'Granos basicos', w: 18, v: 11 }, { l: 'Frutas', w: 12, v: 7 },
      { l: 'Aguacate', w: 8, v: 5 }, { l: 'Lacteos', w: 5, v: 3 },
    ],
    funding: [
      ['CafeTrace GT', 'Seed', 'INNOGEN III', '$600K', 'Mar 2026'],
      ['AgroQ eqchi', 'Pre-seed', 'TechnoServe', '$200K', 'Ene 2026'],
    ],
    zones: { title: 'Zonas prioritarias — Guatemala', rows: [
      ['Alta Verapaz', 'Departamento', 14, '26%', 'Poblacion indigena'],
    ]},
  },
  HN: {
    phase: 'Ecosistema naciente', phaseClass: 'phase-naciente',
    desc: 'Crecimiento acelerado en AgTech gracias al Hub Zamorano. Riego inteligente y granos basicos son areas clave. Zona prioritaria en corredor seco.',
    stats: [
      { l: 'Startups', v: 132, s: '22 en zonas prioritarias' },
      { l: 'Inversores', v: 14, s: '5 con foco agrifoodtech' },
      { l: 'ESOs', v: 28, s: '3 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 12, s: '16 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 6, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'Riego y agua', w: 58, v: 28 }, { l: 'Granos basicos', w: 45, v: 22 },
      { l: 'AgTech precision', w: 38, v: 18 }, { l: 'FoodTech', w: 28, v: 14 },
      { l: 'Clima/carbono', w: 20, v: 10 }, { l: 'Logistica', w: 15, v: 7 },
      { l: 'Trazabilidad', w: 10, v: 5 }, { l: 'Fintech agro', w: 6, v: 3 },
    ],
    chains: [
      { l: 'Cafe', w: 70, v: 38 }, { l: 'Granos basicos', w: 52, v: 28 },
      { l: 'Hortalizas', w: 32, v: 17 }, { l: 'Frutas', w: 22, v: 12 },
      { l: 'Cacao', w: 15, v: 8 }, { l: 'Lacteos', w: 10, v: 5 },
      { l: 'Aguacate', w: 6, v: 3 }, { l: 'Cana', w: 4, v: 2 },
    ],
    funding: [
      ['HydroHN', 'Seed', 'Village Capital', '$500K', 'Feb 2026'],
      ['GranosDigital', 'Pre-seed', 'Angels', '$150K', 'Dic 2025'],
    ],
    zones: { title: 'Zonas prioritarias — Honduras', rows: [
      ['Corredor Seco', 'Region', 10, '30%', 'Vulnerabilidad climatica'],
      ['Olancho', 'Departamento', 6, '24%', 'Ruralidad alta'],
    ]},
  },
  PA: {
    phase: 'Ecosistema emergente', phaseClass: 'phase-emergente',
    desc: 'Hub financiero regional con potencial para vehiculo de inversion AgriTech. SENACYT impulsa innovacion agropecuaria. Conectividad digital superior a otros paises CA.',
    stats: [
      { l: 'Startups', v: 162, s: '18 en sostenibilidad' },
      { l: 'Inversores', v: 38, s: '15 con foco agrifoodtech' },
      { l: 'ESOs', v: 34, s: '5 aceleradoras activas' },
      { l: 'Liderazgo femenino', v: 24, s: '39 con CEO mujer', sf: '%' },
      { l: 'Inversion total', v: 22, s: 'USD acumulado', pf: '$', sf: 'M' },
    ],
    thematic: [
      { l: 'Fintech agro', w: 55, v: 34 }, { l: 'AgTech precision', w: 42, v: 26 },
      { l: 'FoodTech', w: 35, v: 22 }, { l: 'Logistica', w: 28, v: 17 },
      { l: 'Biotecnologia', w: 22, v: 14 }, { l: 'Trazabilidad', w: 15, v: 9 },
      { l: 'Clima/carbono', w: 10, v: 6 }, { l: 'Riego y agua', w: 6, v: 4 },
    ],
    chains: [
      { l: 'Frutas', w: 55, v: 36 }, { l: 'Cafe', w: 42, v: 28 },
      { l: 'Hortalizas', w: 35, v: 23 }, { l: 'Cacao', w: 25, v: 16 },
      { l: 'Aguacate', w: 18, v: 12 }, { l: 'Cana', w: 14, v: 9 },
      { l: 'Granos basicos', w: 8, v: 5 }, { l: 'Lacteos', w: 5, v: 3 },
    ],
    funding: [
      ['AquaCrop PA', 'Seed', 'SENACYT, Angels', '$700K', 'Mar 2026'],
      ['PanamaFresh', 'Serie A', 'Carao Ventures', '$2.8M', 'Ene 2026'],
      ['LogiPanama', 'Pre-seed', 'Angels', '$200K', 'Nov 2025'],
    ],
    zones: { title: 'Zonas prioritarias — Panama', rows: [
      ['Comarca Ngabe-Bugle', 'Comarca', 5, '18%', 'Poblacion indigena'],
      ['Darien', 'Provincia', 4, '20%', 'Frontera agricola'],
    ]},
  },
}

const ACTORS: Record<CountryKey, { name: string; type: 'startup' | 'investor' | 'eso' | 'gobierno'; conf: number }[]> = {
  CO: [
    { name: 'AgroSmart CO', type: 'startup', conf: 0.92 },
    { name: 'Pomona Impact', type: 'investor', conf: 0.88 },
    { name: 'LogiSiembra', type: 'startup', conf: 0.85 },
    { name: 'INNOGEN Fondo III', type: 'investor', conf: 0.90 },
    { name: 'Coomeva Agro', type: 'eso', conf: 0.78 },
  ],
  CR: [
    { name: 'Cafe Britt Tech', type: 'startup', conf: 0.87 },
    { name: 'PROCOMER', type: 'gobierno', conf: 0.95 },
    { name: 'Carao Ventures', type: 'investor', conf: 0.89 },
  ],
  SV: [
    { name: 'BioFresh SV', type: 'startup', conf: 0.82 },
    { name: 'AgroTech SV', type: 'startup', conf: 0.75 },
  ],
  GT: [
    { name: 'CafeTrace GT', type: 'startup', conf: 0.88 },
    { name: 'AgroQ eqchi', type: 'startup', conf: 0.72 },
  ],
  HN: [
    { name: 'Agro-Hub Zamorano', type: 'eso', conf: 0.93 },
    { name: 'RiegoVerde HN', type: 'startup', conf: 0.80 },
  ],
  PA: [
    { name: 'AquaCrop PA', type: 'startup', conf: 0.88 },
    { name: 'SENACYT Panama', type: 'gobierno', conf: 0.97 },
    { name: 'LogiPanama', type: 'startup', conf: 0.76 },
  ],
}

// Simple radar chart SVG for ecosystem maturity
const RADAR_LABELS = ['Startups', 'Inversion', 'ESOs', 'Talento', 'Politica', 'Mercado']

function RadarChart({ d }: { d: typeof DATA[CountryKey] }) {
  const statMax = [500, 100, 100, 100, 100, 100]
  const vals = [
    Math.min(Number(d.stats[0].v) / statMax[0], 1),
    Math.min(Number(d.stats[4].v) / 70, 1),
    Math.min(Number(d.stats[2].v) / 100, 1),
    0.65, 0.55, 0.70,
  ]
  const cx = 160, cy = 160, r = 110
  const pts = vals.map((v, i) => {
    const angle = (i / vals.length) * 2 * Math.PI - Math.PI / 2
    return [cx + r * v * Math.cos(angle), cy + r * v * Math.sin(angle)]
  })
  const polygon = pts.map(([x, y]) => `${x},${y}`).join(' ')
  const rings = [0.25, 0.5, 0.75, 1]

  return (
    <svg viewBox="0 0 320 320" style={{ width: '100%', maxWidth: 320, height: 'auto' }}>
      {rings.map(ring => {
        const rPts = RADAR_LABELS.map((_, i) => {
          const angle = (i / RADAR_LABELS.length) * 2 * Math.PI - Math.PI / 2
          return `${cx + r * ring * Math.cos(angle)},${cy + r * ring * Math.sin(angle)}`
        }).join(' ')
        return <polygon key={ring} points={rPts} fill="none" stroke="var(--border)" strokeWidth="0.5" />
      })}
      {RADAR_LABELS.map((_, i) => {
        const angle = (i / RADAR_LABELS.length) * 2 * Math.PI - Math.PI / 2
        return <line key={i} x1={cx} y1={cy} x2={cx + r * Math.cos(angle)} y2={cy + r * Math.sin(angle)} stroke="var(--border)" strokeWidth="1" />
      })}
      <polygon points={polygon} fill="var(--accent)" fillOpacity="0.18" stroke="var(--accent)" strokeWidth="2" className="radar-polygon" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={4} fill="var(--accent)" />)}
      {RADAR_LABELS.map((label, i) => {
        const angle = (i / RADAR_LABELS.length) * 2 * Math.PI - Math.PI / 2
        const lx = cx + (r + 20) * Math.cos(angle)
        const ly = cy + (r + 20) * Math.sin(angle)
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className="radar-label">{label}</text>
      })}
    </svg>
  )
}

export default function PaisPage() {
  const [active, setActive] = useState<CountryKey>('CO')
  const [comparing, setComparing] = useState(false)
  const [compA, setCompA] = useState<CountryKey>('CO')
  const [compB, setCompB] = useState<CountryKey>('CR')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [toast, setToast] = useState('')

  // Deep-link: /pais?c=CO selecciona el pais
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('c')
    if (c && TABS.some(t => t.key === c)) setActive(c as CountryKey)
  }, [])

  const d = DATA[active]
  const tab = TABS.find(t => t.key === active)!

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }
  function buildReport(): string {
    const lines = [
      'VerdeXcelerate — Perfil de ecosistema',
      `${tab.name} — ${d.phase}`, '', d.desc, '', 'Indicadores:',
    ]
    d.stats.forEach(s => lines.push(`- ${s.l}: ${s.pf || ''}${s.v}${s.sf || ''} (${s.s})`))
    lines.push('', 'Cadenas de valor principales:')
    d.chains.slice(0, 5).forEach(c => lines.push(`- ${c.l}: ${c.v} actores`))
    lines.push('', d.zones.title + ':')
    d.zones.rows.forEach(z => lines.push(`- ${z[0]} (${z[1]}): ${z[2]} actores, cobertura ${z[3]} — ${z[4]}`))
    return lines.join('\n')
  }
  async function copyReport() {
    try { await navigator.clipboard.writeText(buildReport()); showToast('Reporte copiado al portapapeles') }
    catch { showToast('No se pudo copiar el reporte') }
  }
  function downloadReport() {
    const blob = new Blob([buildReport()], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `verdexcelerate-${active}.txt`; a.click()
    URL.revokeObjectURL(url)
    showToast('Reporte descargado')
  }

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <a href="/pais">Perfiles</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>{tab.name}</span>
          </div>
          <h1>Perfil de ecosistema</h1>
        </div>
      </header>

      <div className="content">
        <div className="country-tabs anim-fade-up">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`country-tab${active === t.key ? ' active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              {t.flag} {t.name}
            </button>
          ))}
        </div>

        {/* Comparison toolbar */}
        <div className="comparison-bar anim-fade-up delay-1">
          <button
            className={`btn-compare${comparing ? ' active' : ''}`}
            onClick={() => setComparing(!comparing)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M16 3h5v5"/><path d="M8 3H3v5"/><path d="M21 3l-7 7"/><path d="M3 3l7 7"/><path d="M16 21h5v-5"/><path d="M8 21H3v-5"/><path d="M21 21l-7-7"/><path d="M3 21l7-7"/></svg>
            {comparing ? 'Cerrar comparacion' : 'Comparar'}
          </button>
          {comparing && (
            <div className="comparison-selectors">
              <select value={compA} onChange={e => setCompA(e.target.value as CountryKey)}>
                {TABS.map(t => <option key={t.key} value={t.key}>{t.flag} {t.name}</option>)}
              </select>
              <span>vs</span>
              <select value={compB} onChange={e => setCompB(e.target.value as CountryKey)}>
                {TABS.map(t => <option key={t.key} value={t.key}>{t.flag} {t.name}</option>)}
              </select>
            </div>
          )}
          <button className="btn-export" onClick={() => setModalOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
            Exportar PDF
          </button>
        </div>

        {/* Comparison panels */}
        {comparing && (
          <div className="comparison-mode visible" style={{marginBottom:'32px'}}>
            {([compA, compB] as CountryKey[]).map((key, pi) => {
              const cd = DATA[key]; const ct = TABS.find(t => t.key === key)!
              return (
                <div key={pi} className="comparison-panel">
                  <h3>{ct.flag} {ct.name}</h3>
                  <div className={`phase-badge ${cd.phaseClass}`} style={{marginBottom:'18px'}}>{cd.phase}</div>
                  {cd.stats.map(s => (
                    <div key={s.l} className="comp-stat">
                      <span className="comp-stat-label">{s.l}</span>
                      <span className="comp-stat-value">{s.pf||''}{s.v}{s.sf||''}</span>
                    </div>
                  ))}
                  <div className="comp-bars">
                    {cd.thematic.slice(0,5).map((b, i) => (
                      <div key={b.l} className="hbar">
                        <span className="hbar-label">{b.l}</span>
                        <div className="hbar-track"><div className="hbar-fill" style={{width:`${b.w}%`,animationDelay:`${0.2+i*0.08}s`}}></div></div>
                        <span className="hbar-val">{b.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Profile header */}
        <div className="profile-header anim-fade-up delay-1">
          <div className="profile-info">
            <h2>{tab.flag} {tab.name}</h2>
            <p>{d.desc}</p>
            <div className={`phase-badge ${d.phaseClass}`}>{d.phase}</div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="stats-grid anim-fade-up delay-2">
          {d.stats.map(s => (
            <div key={s.l} className="stat-box">
              <div className="stat-box-label">{s.l}</div>
              <div className="stat-box-value">{s.pf||''}{s.v}{s.sf||''}</div>
              <div className="stat-box-sub">{s.s}</div>
            </div>
          ))}
        </div>

        {/* Radar chart */}
        <div className="radar-chart-container anim-fade-up delay-3">
          <div className="radar-chart-header"><span className="panel-title">Madurez del ecosistema</span></div>
          <div className="radar-chart"><RadarChart d={d} /></div>
        </div>

        {/* Two-col charts */}
        <div className="two-col">
          <div className="panel anim-fade-up delay-3">
            <div className="panel-header"><span className="panel-title">Distribucion por area tematica</span></div>
            <div className="panel-body">
              {d.thematic.map((b, i) => (
                <div key={b.l} className="hbar">
                  <span className="hbar-label">{b.l}</span>
                  <div className="hbar-track"><div className="hbar-fill" style={{width:`${b.w}%`,animationDelay:`${0.3+i*0.1}s`}}></div></div>
                  <span className="hbar-val">{b.v}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="panel anim-fade-up delay-4">
            <div className="panel-header"><span className="panel-title">Cadenas de valor</span></div>
            <div className="panel-body">
              {d.chains.map((b, i) => (
                <div key={b.l} className="hbar">
                  <span className="hbar-label">{b.l}</span>
                  <div className="hbar-track"><div className="hbar-fill" style={{width:`${b.w}%`,animationDelay:`${0.35+i*0.1}s`}}></div></div>
                  <span className="hbar-val">{b.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funding table */}
        <div className="panel anim-fade-up delay-3" style={{marginBottom:'24px'}}>
          <div className="panel-header"><span className="panel-title">Rondas de inversion recientes</span></div>
          <div className="panel-body-flush">
            <table className="data-table">
              <thead><tr><th>Startup</th><th>Etapa</th><th>Inversor(es)</th><th className="num-col">Monto USD</th><th>Fecha</th></tr></thead>
              <tbody>
                {d.funding.map(f => (
                  <tr key={f[0]} style={{cursor:'pointer'}} title={`Buscar ${f[0]} en el directorio`} onClick={() => window.location.href = `/directorio?q=${encodeURIComponent(f[0])}`}>
                    <td style={{fontWeight:600}}>{f[0]}</td>
                    <td><span className="area-pill">{f[1]}</span></td>
                    <td>{f[2]}</td>
                    <td className="num-col" style={{fontWeight:700}}>{f[3]}</td>
                    <td style={{fontFamily:'var(--font-mono)',fontSize:'12px'}}>{f[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Priority zones table */}
        <div className="panel anim-fade-up" style={{animationDelay:'.3s'}}>
          <div className="panel-header">
            <span className="panel-title">{d.zones.title}</span>
            <a className="panel-action" href="/zonas">Ver diagnostico &rarr;</a>
          </div>
          <div className="panel-body-flush">
            <table className="data-table">
              <thead><tr><th>Zona</th><th>Tipo</th><th className="num-col">Actores</th><th className="num-col">Cobertura</th><th>Razon</th></tr></thead>
              <tbody>
                {d.zones.rows.map(z => (
                  <tr key={z[0]} style={{cursor:'pointer'}} title="Ver diagnostico de zonas" onClick={() => window.location.href='/zonas'}>
                    <td style={{fontWeight:600}}>{z[0]}</td>
                    <td>{z[1]}</td>
                    <td className="num-col">{z[2]}</td>
                    <td className="num-col" style={{color:parseInt(z[3])<35?'var(--danger)':'var(--warning)',fontWeight:700}}>{z[3]}</td>
                    <td style={{fontSize:'12px',color:'var(--muted)'}}>{z[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export modal */}
      {modalOpen && (
        <div className="modal-overlay visible" onClick={() => setModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reporte del ecosistema</h3>
              <button className="modal-close" onClick={() => setModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="report-section">
                <h4>{tab.flag} {tab.name} — {d.phase}</h4>
                {d.stats.map(s => (
                  <div key={s.l} className="report-stat">
                    <span>{s.l}</span>
                    <span>{s.pf||''}{s.v}{s.sf||''}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-close" onClick={() => setModalOpen(false)}>Cerrar</button>
              <button className="btn-copy" onClick={downloadReport}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Descargar TXT
              </button>
              <button className="btn-copy" onClick={() => window.print()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                Guardar PDF
              </button>
              <button className="btn-copy" onClick={copyReport}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                Copiar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actors sidebar toggle */}
      <button
        className={`actors-toggle${sidebarOpen ? ' shifted' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
      </button>

      {/* Actors sidebar */}
      <aside className={`actors-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="actors-sidebar-header">
          <h3>Actores clave</h3>
          <button className="modal-close" onClick={() => setSidebarOpen(false)} style={{width:'28px',height:'28px'}}>&times;</button>
        </div>
        <div className="actors-list">
          {(ACTORS[active] || []).map((a, i) => (
            <div key={a.name} className="actor-card" style={{animationDelay:`${i*80}ms`,cursor:'pointer'}} title={`Ver ${a.name} en el directorio`} onClick={() => window.location.href = `/directorio?q=${encodeURIComponent(a.name)}`}>
              <div className="actor-card-name">{a.name}</div>
              <div className="actor-card-meta">
                <span className={`actor-type-badge ${a.type}`}>{a.type}</span>
                <span className="actor-confidence">{(a.conf*100).toFixed(0)}%</span>
                <span className="actor-confidence-bar"><span className="actor-confidence-fill" style={{width:`${a.conf*100}%`}}></span></span>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className={`toast${toast ? ' show' : ''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>{toast}</span>
      </div>
    </AppLayout>
  )
}
