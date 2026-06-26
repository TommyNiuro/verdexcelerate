'use client'
import { useEffect, useRef, useState } from 'react'

const CIRC = 2 * Math.PI * 18 // ~113.1
const SCORE = 87
const METRICS = [
  { name: 'Cobertura de datos', value: 92 },
  { name: 'Calidad IA', value: 89 },
  { name: 'Diversidad de genero', value: 34 },
  { name: 'Frescura de datos', value: 85 },
]

export default function HealthBadge() {
  const [score, setScore] = useState(0)
  const [animated, setAnimated] = useState(false)
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    const t = setTimeout(() => {
      setAnimated(true)
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1500, 1)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setScore(Math.round(eased * SCORE))
        if (p < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }, 1200)
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [])

  const offset = animated ? CIRC - (SCORE / 100) * CIRC : CIRC

  return (
    <div className="health-badge">
      <div className="health-top">
        <div className="health-ring">
          <svg viewBox="0 0 44 44">
            <circle className="health-ring-bg" cx="22" cy="22" r="18"/>
            <circle className="health-ring-progress" cx="22" cy="22" r="18" strokeDasharray={CIRC} strokeDashoffset={offset}/>
          </svg>
          <div className="health-score">{score}</div>
        </div>
        <div className="health-info">
          <div className="health-label">Salud del ecosistema</div>
          <div className="health-status">Excelente</div>
        </div>
      </div>
      <div className="health-metrics">
        {METRICS.map(m => (
          <div key={m.name} className="health-metric">
            <span className="health-metric-name">{m.name}</span>
            <div className="health-metric-bar"><div className="health-metric-fill" style={{ width: animated ? `${m.value}%` : '0%' }}></div></div>
            <span className="health-metric-val">{m.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
