import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Send } from 'lucide-react'

// Mode Selector Buttons
function ModeButton({ mode, icon, label, isActive, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`flex-1 flex flex-col items-center justify-center gap-1 rounded-lg px-2 py-2 text-xs font-semibold transition-all ${
        isActive
          ? 'glass-dark glow-cyan border border-cyan-500/50 text-cyan-200'
          : 'glass border border-slate-700/40 text-slate-300 hover:text-slate-100'
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </motion.button>
  )
}

// Typewriter Effect Component
function TypewriterText({ text, speed = 20 }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)

    if (!text) return

    let index = 0
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1))
        index++
      } else {
        setIsComplete(true)
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <div className="space-y-2">
      <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="ml-1 inline-block w-2 h-5 bg-cyan-400"
          />
        )}
      </p>
    </div>
  )
}

export default function AICopilotTab({
  copilotMode,
  onChangeMode,
  copilotPrompt,
  evsScore,
}) {
  const modes = [
    { id: 'Scientist', icon: '🔬', label: 'Scientist' },
    { id: 'Policy', icon: '📋', label: 'Policy' },
    { id: 'Fisherman', icon: '🐟', label: 'Fisherman' },
  ]

  const riskLevel =
    evsScore > 0.75 ? 'CRITICAL' : evsScore > 0.5 ? 'WARNING' : 'STABLE'
  const riskColor =
    evsScore > 0.75
      ? 'text-rose-400'
      : evsScore > 0.5
        ? 'text-amber-400'
        : 'text-emerald-400'

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
          <h2 className="text-lg font-bold text-slate-100">AI Copilot</h2>
        </div>
        <p className="text-xs text-slate-400">Actionable LLM intelligence</p>
      </div>

      {/* Risk Status Badge */}
      <motion.div
        className={`glass border border-slate-700/40 rounded-lg p-3 text-center ${riskColor}`}
        key={riskLevel}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <p className="text-xs text-slate-400 mb-1">Current Status</p>
        <p className="text-2xl font-bold">{riskLevel}</p>
        <p className="text-xs text-slate-400 mt-1">EVS {Math.round(evsScore * 100)}%</p>
      </motion.div>

      {/* Audience Mode Selector */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-300">Audience Mode</p>
        <div className="flex gap-2">
          {modes.map((mode) => (
            <ModeButton
              key={mode.id}
              mode={mode.id}
              icon={mode.icon}
              label={mode.label}
              isActive={copilotMode === mode.id}
              onClick={() => onChangeMode(mode.id)}
            />
          ))}
        </div>
      </div>

      {/* AI Briefing Text Box */}
      <div className="flex-1 flex flex-col">
        <p className="text-xs font-semibold text-slate-300 mb-2">Live Briefing</p>
        <div className="flex-1 glass-dark border border-slate-700/50 rounded-lg p-4 overflow-y-auto">
          {copilotPrompt ? (
            <TypewriterText text={copilotPrompt} speed={15} />
          ) : (
            <p className="text-xs text-slate-400 italic">
              Generating briefing for {copilotMode}...
            </p>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full glass-dark glow-cyan border border-cyan-500/50 rounded-lg px-4 py-2.5 text-sm font-semibold text-cyan-200 hover:text-cyan-100 flex items-center justify-center gap-2 transition"
      >
        <Send className="h-4 w-4" />
        Generate Fresh Briefing
      </motion.button>
    </div>
  )
}
