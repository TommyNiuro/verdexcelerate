'use client'
import { useState } from 'react'

type Msg = { role: 'bot' | 'user'; text: string }

function answer(q: string): string {
  const l = q.toLowerCase()
  if (l.includes('brecha')) return 'Hay 38 brechas identificadas. Las mas criticas son financiamiento (12) y conectividad (8), concentradas en La Guajira, Morazan y Alta Verapaz.'
  if (l.includes('colombia')) return 'Colombia lidera con 1,024 actores (68% startups). La Guajira y Sucre son zonas prioritarias con baja cobertura (28% y 34%).'
  if (l.includes('zona')) return 'Hay 6 zonas prioritarias de alta vulnerabilidad. Las de menor cobertura: La Guajira (28%), Morazan (31%) y Alta Verapaz (34%).'
  if (l.includes('genero') || l.includes('género') || l.includes('mujer')) return 'La diversidad de genero del ecosistema es 34%. Es la metrica de salud mas baja y una brecha estrategica priorizada.'
  return 'Base de conocimiento activa: 2,847 actores en 6 paises, $147M rastreados, cobertura digital 78%.'
}

export default function AIChat() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'bot', text: 'Hola, soy el asistente IA de VerdeXcelerate. Puedo responder preguntas sobre el ecosistema AgrifoodTech, brechas, actores y cobertura.' },
  ])

  function send() {
    if (!input.trim()) return
    const q = input
    setMessages(m => [...m, { role: 'user', text: q }])
    setInput('')
    setTimeout(() => setMessages(m => [...m, { role: 'bot', text: answer(q) }]), 900)
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
