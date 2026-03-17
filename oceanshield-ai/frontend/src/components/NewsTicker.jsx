import { useState, useEffect } from 'react'

const premiumNews = [
  { id: 'news-1', headline: '🔴 KINETIC ALERT: Red Sea reroute causing 35% localized carbon spike', level: 'critical', time: '2m ago' },
  { id: 'news-2', headline: '🟢 eDNA MATCH: Endangered coral DNA sequenced in Gulf of Mannar', level: 'success', time: '8m ago' },
  { id: 'news-3', headline: '🟠 THERMAL STRESS: SST anomaly detected across Lakshadweep (+2.3°C)', level: 'warning', time: '15m ago' },
  { id: 'news-4', headline: '🔵 MOLECULAR INSIGHT: Otolith analysis reveals declining fish populations', level: 'info', time: '22m ago' },
  { id: 'news-5', headline: '🟡 SHIPPING DENSITY: 47 vessels detected in Arabian Sea Basin', level: 'warning', time: '31m ago' },
  { id: 'news-6', headline: '🟢 BIODIVERSITY SURGE: Phytoplankton bloom supports marine life recovery', level: 'success', time: '43m ago' },
]

export default function NewsTicker({ items = premiumNews }) {
  const [scrollPosition, setScrollPosition] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % (items.length * 100))
    }, 30)
    return () => clearInterval(interval)
  }, [items.length])

  const getColorClass = (level) => {
    switch (level) {
      case 'critical':
        return 'text-rose-400 border-rose-500/30 bg-rose-950/10'
      case 'warning':
        return 'text-amber-400 border-amber-500/30 bg-amber-950/10'
      case 'success':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-950/10'
      case 'info':
        return 'text-blue-400 border-blue-500/30 bg-blue-950/10'
      default:
        return 'text-cyan-400 border-cyan-500/30 bg-cyan-950/10'
    }
  }

  return (
    <div className="flex items-center gap-3 overflow-hidden flex-1">
      <span className="text-xs font-bold text-cyan-300 tracking-widest flex-shrink-0 uppercase">Threat Feed</span>
      <div className="relative flex-1 h-8 overflow-hidden rounded-lg border border-slate-700/50 bg-slate-900/30 backdrop-blur">
        <div 
          className="flex gap-6 whitespace-nowrap transition-transform duration-linear"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
          }}
        >
          {[...items, ...items].map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              className={`flex-shrink-0 px-4 py-2 rounded border text-xs font-medium ${getColorClass(item.level)}`}
            >
              {item.headline}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
