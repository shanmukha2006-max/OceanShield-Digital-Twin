import { motion } from 'framer-motion'
import { Fish, Turtle, AlertTriangle, X } from 'lucide-react'

const getSpeciesIcon = (species) => {
  if (species.includes('Turtle')) return Turtle
  return Fish
}

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'critically endangered':
      return 'text-red-600 border-red-600/50'
    case 'endangered':
      return 'text-red-400 border-red-400/50'
    case 'vulnerable':
      return 'text-orange-400 border-orange-400/50'
    case 'near threatened':
      return 'text-yellow-400 border-yellow-400/50'
    case 'in decline':
      return 'text-amber-500 border-amber-500/50'
    default:
      return 'text-slate-400 border-slate-400/50'
  }
}

export default function SpeciesPopup({ species, onClose }) {
  if (!species) return null

  const Icon = getSpeciesIcon(species.species)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="relative max-w-md w-full glass-premium border border-slate-700/50 rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: `0 0 40px rgba(6, 182, 212, 0.3), 0 0 80px rgba(6, 182, 212, 0.1)`,
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-800/50 transition-colors"
        >
          <X className="h-4 w-4 text-slate-400" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-slate-800/50">
            <Icon className="h-8 w-8 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{species.species}</h2>
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(species.status)}`}>
              <AlertTriangle className="h-3 w-3" />
              {species.status.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Threat Alert */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-slate-300 mb-2">Threat Alert</h3>
          <p className="text-sm text-slate-400 leading-relaxed">{species.threatAlert}</p>
        </div>

        {/* AI Vulnerability Insight */}
        <div>
          <h3 className="text-sm font-semibold text-cyan-300 mb-2">AI Vulnerability Insight</h3>
          <p className="text-sm text-slate-300 leading-relaxed">{species.aiInsight}</p>
        </div>

        {/* Migration Route Indicator */}
        <div className="mt-4 pt-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <div
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: species.color }}
            ></div>
            <span>Active Migration Route</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}