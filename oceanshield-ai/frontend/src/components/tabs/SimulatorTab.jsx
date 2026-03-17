import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

// Cascade Timeline Component - shows chain reactions
function CascadeTimeline({ cascadeData, evsScore }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-300 mb-3">Cascade Impact Timeline</p>
      <div className="space-y-2 max-h-[200px] overflow-y-auto">
        {cascadeData.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="glass border border-slate-700/40 rounded-lg p-2 flex items-start gap-2"
          >
            <div className="h-6 w-6 rounded-full glass-dark border border-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-cyan-300 flex-shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="text-xs text-slate-200">{item.label}</p>
              <div className="mt-1 h-1 bg-slate-700/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-rose-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Slider Component
function SimulatorSlider({ label, icon, value, min, max, onChange }) {
  const getColor = (val) => {
    if (val > 70) return 'from-rose-500 to-orange-500'
    if (val > 40) return 'from-amber-500 to-yellow-500'
    return 'from-emerald-500 to-green-500'
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-300">
          {icon} {label}
        </label>
        <span className="text-sm font-bold text-cyan-300">{Math.round(value)}</span>
      </div>
      <div className="glass border border-slate-700/40 rounded-lg p-3">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
        <div className="flex justify-between mt-2 text-xs text-slate-400">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  )
}

export default function SimulatorTab({
  sliders,
  onUpdateSliders,
  evsScore,
  cascadeData,
  isLoading,
}) {
  const handleSliderChange = (key, value) => {
    onUpdateSliders({ ...sliders, [key]: value })
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">⚡ What-If Simulator</h2>
        <p className="text-xs text-slate-400">Geopolitical & climate predictions</p>
      </div>

      {/* Live EVS Score */}
      <div className="glass-dark border border-cyan-500/40 rounded-lg p-4 bg-cyan-950/20">
        <div className="text-xs text-slate-400 mb-1">Live EVS Score</div>
        <motion.div
          className="text-3xl font-bold text-cyan-300"
          key={Math.round(evsScore * 100)}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {Math.round(evsScore * 100)}%
        </motion.div>
        <p className="text-xs text-slate-400 mt-2">
          {evsScore > 0.75
            ? '🔴 CRITICAL'
            : evsScore > 0.5
              ? '🟡 WARNING'
              : '🟢 STABLE'}
        </p>
      </div>

      {/* Sliders */}
      <div className="space-y-3">
        <SimulatorSlider
          label="Pollution Level"
          icon="🏭"
          value={sliders.pollution}
          min={0}
          max={100}
          onChange={(val) => handleSliderChange('pollution', val)}
        />
        <SimulatorSlider
          label="Shipping Traffic"
          icon="⚓"
          value={sliders.shipping}
          min={0}
          max={100}
          onChange={(val) => handleSliderChange('shipping', val)}
        />
        <SimulatorSlider
          label="Climate Stress"
          icon="🌡️"
          value={sliders.climateStress}
          min={0}
          max={100}
          onChange={(val) => handleSliderChange('climateStress', val)}
        />
      </div>

      {/* Cascade Timeline */}
      {cascadeData && cascadeData.length > 0 && (
        <CascadeTimeline cascadeData={cascadeData} evsScore={evsScore} />
      )}

      {/* Processing Indicator */}
      {isLoading && (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="glass border border-blue-500/40 rounded-lg p-2 text-center text-xs text-blue-300"
        >
          Simulating ecosystem response...
        </motion.div>
      )}
    </div>
  )
}
