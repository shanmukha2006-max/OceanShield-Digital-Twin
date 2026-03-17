import { Sparkles } from 'lucide-react'

const modes = [
  { id: 'Scientist', label: '🔬 Scientist', color: 'from-blue-500/30 to-cyan-500/20' },
  { id: 'Policy', label: '📋 Policy', color: 'from-amber-500/30 to-orange-500/20' },
  { id: 'Fisherman', label: '🐟 Fisherman', color: 'from-emerald-500/30 to-teal-500/20' },
]

export default function AICopilotCard({ mode, onChangeMode, prompt }) {
  const modeConfig = modes.find(m => m.id === mode) || modes[0]

  return (
    <section className="glass-dark rounded-2xl border border-blue-500/40 p-5 glow-cyan shadow-2xl animate-fade-in-up">
      {/* Header with Icon */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500/30 to-cyan-500/20 border border-cyan-500/50">
            <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />
          </div>
          <div>
            <p className="text-subtitle">AI Copilot Mission Intelligence</p>
            <p className="text-[10px] text-cyan-400 font-semibold mt-0.5">Real-time Analysis Engine</p>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-4">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => onChangeMode(m.id)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 card-hover border ${
              mode === m.id
                ? `glass-premium border-cyan-500/60 bg-gradient-to-r ${m.color} text-white shadow-lg glow-cyan`
                : 'glass border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600/60'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Report Content */}
      <div className="relative rounded-xl bg-slate-950/60 border border-slate-800/50 p-4 min-h-[120px] overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500/10 blur-3xl rounded-full -translate-x-16 -translate-y-16" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full translate-x-16 translate-y-16" />
        </div>

        {/* Text Content */}
        <p className="relative text-sm leading-relaxed text-slate-200 font-medium">
          {prompt ? (
            <>
              {prompt}
              <span className="animate-typing-cursor ml-1">▌</span>
            </>
          ) : (
            <span className="text-slate-500 italic">Initializing neural analysis...</span>
          )}
        </p>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between mt-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-slate-400">Live Mode: {mode}</span>
        </div>
        <span className="text-cyan-400 font-mono">🤖 v4.2 Neural</span>
      </div>
    </section>
  )
}
