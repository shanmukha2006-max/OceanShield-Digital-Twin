import { motion } from 'framer-motion'
import { Globe, Zap, Microscope, Sparkles, Waves } from 'lucide-react'

const tabs = [
  { id: 'global-intel', label: 'Global Intel', icon: Globe },
  { id: 'subsea-cloud', label: 'Subsea Cloud', icon: Waves },
  { id: 'simulator', label: 'Simulator', icon: Zap },
  { id: 'molecular', label: 'Molecular', icon: Microscope },
  { id: 'copilot', label: 'AI Copilot', icon: Sparkles },
]

export default function TabSelector({ activeTab, onTabChange }) {
  return (
    <div className="flex flex-col gap-3">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative group flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              isActive
                ? 'glass-dark glow-cyan border border-cyan-500/50'
                : 'glass border border-slate-700/40 text-slate-300 hover:text-cyan-200'
            }`}
          >
            <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-xs">{tab.id.split('-')[0]}</span>

            {isActive && (
              <motion.div
                layoutId="tabUnderline"
                className="absolute inset-0 bg-cyan-500/10 rounded-lg -z-10"
                initial={false}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
