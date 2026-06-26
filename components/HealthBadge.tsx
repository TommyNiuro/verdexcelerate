'use client'
import { useEffect, useRef, useState } from 'react'
import { getDataQuality } from '@/lib/queries'

const CIRC = 2 * Math.PI * 18 // ~113.1

export default function HealthBadge() {
  const [score, setScore] = useState(0)
  const [target, setTarget] = useState(0)
  const [animated, setAnimated] = useState(false)
  const [metrics, setMetrics] = useState<{ name: string; value: number }[]>([])
  const raf = useRef<number | undefined>(undefined)

  useEffect(() => {
    getDataQuality().then(q => {
      // Salud = promedio de calidad de datos reales del dataset capturado
      const composite = Math.round((q.completeness + q.validatedPct + q.freshness + q.avgConfidence) / 4)
      setTarget(composite)
      setMetrics([
        { name: 'Completitud de datos', value: q.completeness },
        { name: 'Confianza promedio', value: q.avgConfidence },
        { name: 'Validado por humano', value: q.validatedPct },
        { name: 'Frescura de datos', value: q.freshness },
      ])
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (!target) return
    const t = setTimeout(() => {
      setAnimated(true)
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1500, 1)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setScore(Math.round(eased * target))
        if (p < 1) raf.current = requestAnimationFrame(tick)
      }
      raf.current = requestAnimationFrame(tick)
    }, 300)
    return () => { clearTimeout(t); if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target])

  const offset = animated ? CIRC - (target / 100) * CIRC : CIRC
  const status = target >= 85 ? 'Excelente' : target >= 70 ? 'Buena' : target >= 50 ? 'Aceptable' : 'En construccion'

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
          <div className="health-label">Salud del dataset</div>
          <div className="health-status">{status}</div>
        </div>
      </div>
      <div className="health-metrics">
        {metrics.map(m => (
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
