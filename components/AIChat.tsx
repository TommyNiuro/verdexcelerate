'use client'
import { useEffect, useRef, useState } from 'react'
import {
  getRegionalKpis, getZones, getCountryProfile, getDataQuality,
  getSourcesDetailed, COUNTRY_BY_ID,
} from '@/lib/queries'

type Msg = { role: 'bot' | 'user'; text: string }

type KB = {
  kpis: Awaited<ReturnType<typeof getRegionalKpis>>
  zones: Awaited<ReturnType<typeof getZones>>
  quality: Awaited<ReturnType<typeof getDataQuality>>
  sources: number
  co: Awaited<ReturnType<typeof getCountryProfile>>
  cr: Awaited<ReturnType<typeof getCountryProfile>>
}

function zoneList(zones: KB['zones']): string {
  const priority = zones.filter(z => z.is_priority)
  if (!priority.length) return 'No hay zonas prioritarias registradas todavia.'
  const names = priority.map(z => {
    const c = z.country_id != null ? COUNTRY_BY_ID[z.country_id]?.name : null
    return c ? `${z.name} (${c})` : z.name
  })
  return `Hay ${priority.length} zonas prioritarias registradas: ${names.join(', ')}.`
}

function answer(q: string, kb: KB | null): string {
  if (!kb) return 'Estoy cargando la base de conocimiento, dame un segundo y vuelve a preguntar.'
  const l = q.toLowerCase()

  if (l.includes('brecha')) {
    const dq = kb.quality
    return `Las brechas de datos hoy, segun el dataset capturado (${dq.total} actores aprobados): ${100 - dq.websitePct}% sin sitio web, ${100 - dq.coordsPct}% sin coordenadas y ${100 - dq.validatedPct}% sin validacion humana. En participacion, las iniciativas lideradas por mujeres son el ${kb.kpis.womenPct}% (meta TOR 40%).`
  }

  if (l.includes('colombia')) {
    const co = kb.co
    const startups = co.byType['startup'] || 0
    const base = `Colombia tiene ${co.total} actores aprobados (${startups} startups), con ${co.womenPct}% liderados por mujeres.`
    if (l.includes('cr') || l.includes('costa')) {
      const cr = kb.cr
      const crStartups = cr.byType['startup'] || 0
      return `${base} Costa Rica tiene ${cr.total} actores aprobados (${crStartups} startups), con ${cr.womenPct}% liderados por mujeres.`
    }
    return base
  }

  if (l.includes('zona')) return zoneList(kb.zones)

  if (l.includes('genero') || l.includes('género') || l.includes('mujer')) {
    return `La participacion de iniciativas lideradas por mujeres es ${kb.kpis.womenPct}% (${kb.kpis.womenLed} de ${kb.kpis.total} actores aprobados). Sigue por debajo de la meta TOR de 40%.`
  }

  const k = kb.kpis
  return `Base de conocimiento activa: ${k.total} actores aprobados en ${k.countries} paises, ${k.chains} cadenas de valor y ${kb.sources} fuentes mapeadas.`
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [kb, setKb] = useState<KB | null>(null)
  const loadedRef = useRef(false)
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'Hola, soy el asistente IA de VerdeXcelerate. Puedo responder preguntas sobre el ecosistema AgrifoodTech, brechas, actores y cobertura.' },
  ])

  useEffect(() => {
    if (!open || loadedRef.current) return
    loadedRef.current = true
    ;(async () => {
      try {
        const [kpis, zones, quality, sourcesRows, co, cr] = await Promise.all([
          getRegionalKpis(), getZones(), getDataQuality(), getSourcesDetailed(),
          getCountryProfile(1), getCountryProfile(2),
        ])
        setKb({ kpis, zones, quality, sources: sourcesRows.length, co, cr })
      } catch {
        loadedRef.current = false
      }
    })()
  }, [open])

  function send() {
    if (!input.trim()) return
    const q = input
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTimeout(() => setMessages(m => [...m, { role: 'bot', text: answer(q, kb) }]), 600)
  }

  return (
    <>
      <button className={`ai-fab${open ? ' active' : ''}`} onClick={() => setOpen(o => !o)} aria-label="Asistente IA">
        <div className="ai-fab-badge"></div>
        <svg className="ai-fab-icon" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
        </svg>
        <svg className="ai-fab-close" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <div className={`ai-chat${open ? ' open' : ''}`}>
        <div className="ai-chat-header">
          <div className="ai-chat-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.6"><path d="M12 2a7 7 0 017 7c0 3.5-2 6-4 8l-3 3-3-3c-2-2-4-4.5-4-8a7 7 0 017-7z"/><circle cx="12" cy="9" r="2"/></svg>
          </div>
          <div className="ai-chat-header-info">
            <div className="ai-chat-header-name">Asistente VerdeXcelerate</div>
            <div className="ai-chat-header-status">Conectado · base de conocimiento activa</div>
          </div>
          <div className="ai-chat-header-actions">
            <button onClick={() => setOpen(false)} aria-label="Cerrar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
        </div>
        <div className="ai-chat-body">
          {messages.map((m, i) => (
            <div key={i} className={`ai-msg ${m.role}`}>{m.text}</div>
          ))}
        </div>
        <div className="ai-suggestions">
          {['Brechas criticas', 'Colombia vs CR', 'Zonas prioritarias'].map(s => (
            <button key={s} className="ai-suggestion" onClick={() => setInput(s)}>{s}</button>
          ))}
        </div>
        <div className="ai-chat-footer">
          <textarea
            className="ai-chat-input"
            placeholder="Pregunta sobre el ecosistema..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1}
          />
          <button className="ai-chat-send" onClick={send} disabled={!input.trim()} aria-label="Enviar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          </button>
        </div>
      </div>
    </>
  )
}
