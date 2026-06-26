'use client'

import { useState } from 'react'
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

const DATA: Record<CountryKey, {
  phase: string; phaseClass: string; desc: string;
  startups: number; inversores: number; esos: number; lidFem: string; inversion: string;
  thematic: { label: string; pct: number }[];
  chains: { label: string; pct: number }[];
  funding: { name: string; tipo: string; monto: string; fecha: string }[];
  zones: { name: string; actores: number; cobertura: string }[];
}> = {
  CO: {
    phase: 'Maduro', phaseClass: 'phase-maduro',
    desc: 'Ecosistema mas desarrollado de la region con fuerte concentracion en Bogota y Medellin. Lider en capital de riesgo y diversidad de cadenas de valor AgriTech.',
    startups: 486, inversores: 127, esos: 89, lidFem: '18%', inversion: '$68M',
    thematic: [
      { label: 'Precision farming', pct: 78 },
      { label: 'Fintech agro', pct: 65 },
      { label: 'Supply chain', pct: 58 },
      { label: 'Biotech', pct: 45 },
    ],
    chains: [
      { label: 'Cafe', pct: 85 },
      { label: 'Hortalizas', pct: 72 },
      { label: 'Cacao', pct: 61 },
      { label: 'Frutas exoticas', pct: 48 },
    ],
    funding: [
      { name: 'AgroSmart CO', tipo: 'Seed', monto: '$1.2M', fecha: 'Mar 2026' },
      { name: 'CafeChain', tipo: 'Serie A', monto: '$4.5M', fecha: 'Feb 2026' },
      { name: 'LogiSiembra', tipo: 'Seed', monto: '$800K', fecha: 'Ene 2026' },
      { name: 'BioInsumos CO', tipo: 'Pre-seed', monto: '$250K', fecha: 'Dic 2025' },
      { name: 'AquaColombia', tipo: 'Seed', monto: '$600K', fecha: 'Nov 2025' },
    ],
    zones: [
      { name: 'La Guajira', actores: 12, cobertura: '28%' },
      { name: 'Sucre', actores: 18, cobertura: '34%' },
      { name: 'Cordoba', actores: 24, cobertura: '41%' },
      { name: 'Magdalena', actores: 19, cobertura: '36%' },
    ],
  },
  CR: {
    phase: 'Emergente', phaseClass: 'phase-emergente',
    desc: 'Ecosistema emergente con fuerte apoyo gubernamental via PROCOMER y SENASA. Alta calidad de biodiversidad y posicionamiento en AgriTech de exportacion de cafe y frutas tropicales.',
    startups: 198, inversores: 45, esos: 67, lidFem: '28%', inversion: '$22M',
    thematic: [
      { label: 'Exportacion digital', pct: 82 },
      { label: 'Sostenibilidad', pct: 74 },
      { label: 'Precision farming', pct: 55 },
      { label: 'Biotech', pct: 40 },
    ],
    chains: [
      { label: 'Cafe', pct: 88 },
      { label: 'Pina', pct: 76 },
      { label: 'Banano', pct: 65 },
      { label: 'Flores', pct: 42 },
    ],
    funding: [
      { name: 'Cafe Britt Tech', tipo: 'Serie A', monto: '$3.2M', fecha: 'Abr 2026' },
      { name: 'BioTrop CR', tipo: 'Seed', monto: '$900K', fecha: 'Feb 2026' },
      { name: 'ExportDigital', tipo: 'Pre-seed', monto: '$180K', fecha: 'Ene 2026' },
      { name: 'AguaVerde CR', tipo: 'Seed', monto: '$450K', fecha: 'Nov 2025' },
      { name: 'PolinizAI', tipo: 'Pre-seed', monto: '$120K', fecha: 'Oct 2025' },
    ],
    zones: [
      { name: 'Guanacaste', actores: 22, cobertura: '47%' },
      { name: 'Puntarenas', actores: 16, cobertura: '38%' },
      { name: 'Limon', actores: 12, cobertura: '31%' },
      { name: 'Cartago', actores: 28, cobertura: '58%' },
    ],
  },
  SV: {
    phase: 'Naciente', phaseClass: 'phase-naciente',
    desc: 'Ecosistema naciente con alto potencial en cadenas de cafe y frutas. Limitado por acceso a capital y conectividad rural. Bitcoin adoption como vector de innovacion financiera para el sector.',
    startups: 94, inversores: 12, esos: 23, lidFem: '19%', inversion: '$4M',
    thematic: [
      { label: 'Fintech agro', pct: 70 },
      { label: 'Trazabilidad', pct: 58 },
      { label: 'Mercados digitales', pct: 44 },
      { label: 'Precision farming', pct: 28 },
    ],
    chains: [
      { label: 'Cafe', pct: 80 },
      { label: 'Cana de azucar', pct: 62 },
      { label: 'Frutas', pct: 48 },
      { label: 'Granos basicos', pct: 35 },
    ],
    funding: [
      { name: 'BioFresh SV', tipo: 'Pre-seed', monto: '$200K', fecha: 'Mar 2026' },
      { name: 'CafeChain SV', tipo: 'Seed', monto: '$500K', fecha: 'Dic 2025' },
      { name: 'AgroWallet', tipo: 'Pre-seed', monto: '$150K', fecha: 'Oct 2025' },
      { name: 'FrutaDigital', tipo: 'Pre-seed', monto: '$90K', fecha: 'Sep 2025' },
      { name: 'RiegoSV', tipo: 'Pre-seed', monto: '$120K', fecha: 'Jul 2025' },
    ],
    zones: [
      { name: 'Morazan', actores: 8, cobertura: '22%' },
      { name: 'Chalatenango', actores: 11, cobertura: '28%' },
      { name: 'Santa Ana', actores: 19, cobertura: '41%' },
      { name: 'Sonsonate', actores: 14, cobertura: '33%' },
    ],
  },
  GT: {
    phase: 'Naciente', phaseClass: 'phase-naciente',
    desc: 'Ecosistema naciente con clusters emergentes en Ciudad de Guatemala. Alta diversidad de cultivos (cafe, cardamomo, palma) y comunidades indigenas como potencial de impacto social diferenciador.',
    startups: 147, inversores: 18, esos: 31, lidFem: '15%', inversion: '$8M',
    thematic: [
      { label: 'Trazabilidad', pct: 75 },
      { label: 'Supply chain', pct: 60 },
      { label: 'Precision farming', pct: 42 },
      { label: 'Fintech agro', pct: 35 },
    ],
    chains: [
      { label: 'Cafe', pct: 82 },
      { label: 'Cardamomo', pct: 70 },
      { label: 'Palma africana', pct: 55 },
      { label: 'Banano', pct: 48 },
    ],
    funding: [
      { name: 'CafeTrace GT', tipo: 'Seed', monto: '$650K', fecha: 'Abr 2026' },
      { name: 'CardamomoTech', tipo: 'Pre-seed', monto: '$180K', fecha: 'Feb 2026' },
      { name: 'AgroGT Connect', tipo: 'Pre-seed', monto: '$130K', fecha: 'Dic 2025' },
      { name: 'RiegoMaya', tipo: 'Pre-seed', monto: '$90K', fecha: 'Oct 2025' },
      { name: 'BiomassGT', tipo: 'Pre-seed', monto: '$200K', fecha: 'Sep 2025' },
    ],
    zones: [
      { name: 'Alta Verapaz', actores: 14, cobertura: '26%' },
      { name: 'Peten', actores: 9, cobertura: '19%' },
      { name: 'Quiche', actores: 11, cobertura: '23%' },
      { name: 'Izabal', actores: 16, cobertura: '34%' },
    ],
  },
  HN: {
    phase: 'Naciente', phaseClass: 'phase-naciente',
    desc: 'Ecosistema naciente con fuerte presencia de organismos internacionales (USAID, FAO). Potencial en granos basicos y cadena de cafe. Zamorano como hub academico regional con influencia en el ecosistema.',
    startups: 132, inversores: 14, esos: 28, lidFem: '12%', inversion: '$6M',
    thematic: [
      { label: 'Granos basicos', pct: 72 },
      { label: 'Supply chain', pct: 55 },
      { label: 'Fintech agro', pct: 42 },
      { label: 'Precision farming', pct: 30 },
    ],
    chains: [
      { label: 'Cafe', pct: 78 },
      { label: 'Granos basicos', pct: 70 },
      { label: 'Palma africana', pct: 58 },
      { label: 'Camaron', pct: 44 },
    ],
    funding: [
      { name: 'RiegoVerde HN', tipo: 'Seed', monto: '$400K', fecha: 'Mar 2026' },
      { name: 'GranoTech', tipo: 'Pre-seed', monto: '$140K', fecha: 'Ene 2026' },
      { name: 'CafeHN Digital', tipo: 'Pre-seed', monto: '$110K', fecha: 'Nov 2025' },
      { name: 'PalmaData', tipo: 'Pre-seed', monto: '$160K', fecha: 'Sep 2025' },
      { name: 'AquaHN', tipo: 'Pre-seed', monto: '$90K', fecha: 'Jul 2025' },
    ],
    zones: [
      { name: 'Olancho', actores: 10, cobertura: '21%' },
      { name: 'Colon', actores: 8, cobertura: '18%' },
      { name: 'Santa Barbara', actores: 14, cobertura: '30%' },
      { name: 'Yoro', actores: 12, cobertura: '26%' },
    ],
  },
  PA: {
    phase: 'Emergente', phaseClass: 'phase-emergente',
    desc: 'Ecosistema emergente con ventaja competitiva en logistica y finanzas por el Canal. SENACYT activo en financiamiento. Potencial en AgriTech de exportacion y soluciones de riego para el arco seco.',
    startups: 162, inversores: 38, esos: 34, lidFem: '24%', inversion: '$22M',
    thematic: [
      { label: 'Logistica agro', pct: 80 },
      { label: 'Exportacion digital', pct: 68 },
      { label: 'Riego inteligente', pct: 55 },
      { label: 'Fintech agro', pct: 48 },
    ],
    chains: [
      { label: 'Arroz', pct: 75 },
      { label: 'Maiz', pct: 62 },
      { label: 'Camaron', pct: 58 },
      { label: 'Frutas tropicales', pct: 45 },
    ],
    funding: [
      { name: 'AquaCrop PA', tipo: 'Serie A', monto: '$2.8M', fecha: 'Abr 2026' },
      { name: 'LogiAgro PA', tipo: 'Seed', monto: '$900K', fecha: 'Feb 2026' },
      { name: 'ArroceTech', tipo: 'Seed', monto: '$600K', fecha: 'Dic 2025' },
      { name: 'ExportFresh PA', tipo: 'Pre-seed', monto: '$200K', fecha: 'Oct 2025' },
      { name: 'RiegoSeco', tipo: 'Seed', monto: '$450K', fecha: 'Ago 2025' },
    ],
    zones: [
      { name: 'Chiriqui', actores: 28, cobertura: '52%' },
      { name: 'Cocle', actores: 18, cobertura: '38%' },
      { name: 'Herrera', actores: 14, cobertura: '31%' },
      { name: 'Los Santos', actores: 12, cobertura: '27%' },
    ],
  },
}

export default function PaisPage() {
  const [active, setActive] = useState<CountryKey>('CO')
  const d = DATA[active]
  const tab = TABS.find(t => t.key === active)!

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Paises</span>
          </div>
          <h1>Analisis por pais</h1>
        </div>
        <div style={{display:'flex',gap:'0.5rem'}}>
          <button className="btn btn-secondary">Comparar</button>
          <button className="btn btn-secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Exportar
          </button>
        </div>
      </header>

      <div className="content">
        {/* Country tabs */}
        <div className="country-tabs anim-fade-up">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`country-tab${active === t.key ? ' active' : ''}`}
              onClick={() => setActive(t.key)}
            >
              <span>{t.flag}</span> {t.name}
            </button>
          ))}
        </div>

        {/* Profile header */}
        <div className="country-profile anim-fade-up delay-1">
          <div className="country-profile-header">
            <h2>{tab.flag} {tab.name}</h2>
            <span className={`phase-badge ${d.phaseClass}`}>{d.phase}</span>
          </div>
          <p className="country-desc">{d.desc}</p>
        </div>

        {/* Stats grid */}
        <div className="stats-grid-5 anim-fade-up delay-1">
          <div className="stat-card compact">
            <div className="stat-card-val">{d.startups}</div>
            <div className="stat-card-label">Startups</div>
          </div>
          <div className="stat-card compact">
            <div className="stat-card-val">{d.inversores}</div>
            <div className="stat-card-label">Inversores</div>
          </div>
          <div className="stat-card compact">
            <div className="stat-card-val">{d.esos}</div>
            <div className="stat-card-label">ESOs</div>
          </div>
          <div className="stat-card compact">
            <div className="stat-card-val">{d.lidFem}</div>
            <div className="stat-card-label">Liderazgo femenino</div>
          </div>
          <div className="stat-card compact">
            <div className="stat-card-val">{d.inversion}</div>
            <div className="stat-card-label">Inversion total</div>
          </div>
        </div>

        {/* Two-column panel */}
        <div className="two-col-panel anim-fade-up delay-2">
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Areas tematicas</span></div>
            <div className="hbar-list">
              {d.thematic.map(t => (
                <div key={t.label} className="hbar-item">
                  <div className="hbar-label">{t.label}</div>
                  <div className="hbar-track"><div className="hbar-fill" style={{width:`${t.pct}%`}}></div></div>
                  <div className="hbar-val">{t.pct}%</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <div className="panel-header"><span className="panel-title">Cadenas de valor</span></div>
            <div className="hbar-list">
              {d.chains.map(c => (
                <div key={c.label} className="hbar-item">
                  <div className="hbar-label">{c.label}</div>
                  <div className="hbar-track"><div className="hbar-fill" style={{width:`${c.pct}%`,background:'#6366f1'}}></div></div>
                  <div className="hbar-val">{c.pct}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Funding table */}
        <div className="panel anim-fade-up delay-3">
          <div className="panel-header"><span className="panel-title">Ultimas rondas de financiamiento</span></div>
          <table className="data-table">
            <thead>
              <tr><th>Startup</th><th>Tipo</th><th>Monto</th><th>Fecha</th></tr>
            </thead>
            <tbody>
              {d.funding.map(f => (
                <tr key={f.name}>
                  <td>{f.name}</td>
                  <td><span className="funding-badge">{f.tipo}</span></td>
                  <td><strong>{f.monto}</strong></td>
                  <td style={{color:'var(--muted)'}}>{f.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Priority zones table */}
        <div className="panel anim-fade-up delay-4">
          <div className="panel-header">
            <span className="panel-title">Zonas prioritarias</span>
            <a href="/zonas" className="btn btn-ghost btn-sm">Ver todas</a>
          </div>
          <table className="data-table">
            <thead>
              <tr><th>Zona</th><th>Actores</th><th>Cobertura</th><th>Accion</th></tr>
            </thead>
            <tbody>
              {d.zones.map(z => (
                <tr key={z.name}>
                  <td>{z.name}</td>
                  <td>{z.actores}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                      <div className="bar-track" style={{minWidth:'80px'}}><div className="bar-fill" style={{width:z.cobertura,background:'var(--accent)'}}></div></div>
                      {z.cobertura}
                    </div>
                  </td>
                  <td><a href="/zonas" className="link">Ver zona</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  )
}
