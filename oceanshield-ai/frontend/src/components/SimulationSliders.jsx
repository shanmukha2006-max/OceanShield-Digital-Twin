import { useState } from 'react'

export default function SimulationSliders({ sliders, onUpdate }) {
  const [hoveredSlider, setHoveredSlider] = useState(null)
  
  const update = (key, value) => onUpdate({ ...sliders, [key]: value })

  const sliders_config = [
    {
      key: 'pollution',
      label: 'Pollution Load',
      icon: '🏭',
      color: 'from-rose-500/30 to-orange-500/20',
      textColor: 'text-rose-300',
      desc: 'Industrial & chemical stressors',
    },
    {
      key: 'shipping',
      label: 'Shipping Density',
      icon: '⚓',
      color: 'from-blue-500/30 to-cyan-500/20',
      textColor: 'text-blue-300',
      desc: 'Maritime traffic & noise',
    },
    {
      key: 'climateStress',
      label: 'Climate Stress',
      icon: '🌡️',
      color: 'from-amber-500/30 to-red-500/20',
      textColor: 'text-amber-300',
      desc: 'Temperature & weather anomalies',
    },
  ]

  return (
    <section className="glass-premium rounded-2xl border border-slate-700/50 p-5 animate-fade-in-up">
      <div className="mb-4">
        <p className="text-subtitle">What-If Simulation Engine</p>
        <p className="text-xs text-slate-400 mt-1">Drag sliders to model environmental scenarios</p>
      </div>

      <div className="space-y-4">
        {sliders_config.map((slider) => {
          const isHovered = hoveredSlider === slider.key
          const value = sliders[slider.key] || 0
          const barWidth = `${value}%`

          return (
            <div key={slider.key} className="group">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg">{slider.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{slider.label}</p>
                    <p className="text-[10px] text-slate-500">{slider.desc}</p>
                  </div>
                </div>
                <div className={`flex-shrink-0 rounded-lg px-2 py-1 font-mono text-sm font-bold transition-all ${slider.textColor} bg-slate-800/40`}>
                  {value}%
                </div>
              </div>

              {/* Mixing Board Fader */}
              <div className="relative h-8 rounded-lg bg-slate-900/60 border border-slate-700/50 overflow-hidden group-hover:border-slate-600/70 transition-all">
                {/* Background bar (active portion) */}
                <div
                  className={`absolute inset-y-0 left-0 bg-gradient-to-r ${slider.color} transition-all duration-100 rounded-lg`}
                  style={{ width: barWidth }}
                />

                {/* Slider input */}
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) => update(slider.key, Number(e.target.value))}
                  onMouseEnter={() => setHoveredSlider(slider.key)}
                  onMouseLeave={() => setHoveredSlider(null)}
                  className="relative w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Visual thumb indicator */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-1.5 h-7 bg-white rounded-full border-2 border-slate-800 pointer-events-none transition-all shadow-lg"
                  style={{
                    left: `calc(${barWidth} - 3px)`,
                    boxShadow: isHovered ? '0 0 12px rgba(6, 182, 212, 0.6)' : 'none',
                  }}
                />
              </div>

              {/* Risk Level Indicator */}
              <div className="flex gap-1 mt-2">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div
                    key={mark}
                    className={`flex-1 h-1 rounded-full transition-all ${
                      value >= mark ? 'bg-cyan-500/60' : 'bg-slate-700/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-700/30 text-xs text-slate-400">
        <p>💡 All sliders affect the EVS score in real-time. API calls debounced for performance.</p>
      </div>
    </section>
  )
}
