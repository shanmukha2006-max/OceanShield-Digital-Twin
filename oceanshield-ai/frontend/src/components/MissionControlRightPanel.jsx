import KPIGrid from './KPIGrid'
import EVSGauge from './EVSGauge'
import SimulationSliders from './SimulationSliders'
import AICopilotCard from './AICopilotCard'
import { BarChart3 } from 'lucide-react'

export default function MissionControlRightPanel({
  evsScore,
  sliders,
  onUpdateSliders,
  copilotMode,
  onChangeMode,
  copilotPrompt,
  onOpenModal,
}) {
  const heat = Math.round(20 + evsScore * 60)
  const biodiversity = Math.round(55 + (1 - evsScore) * 35)

  return (
    <section className="flex h-full flex-col gap-4 overflow-y-auto">
      {/* KPI Section */}
      <div className="glass-premium rounded-2xl border border-slate-700/50 p-5 animate-fade-in-up">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-subtitle">Real-Time Metrics</p>
            <p className="text-xs text-slate-400 mt-1">Live ecosystem indicators</p>
          </div>
          <button
            onClick={() => onOpenModal({ type: 'diagnostics', title: '🔧 System Diagnostics' })}
            className="flex-shrink-0 rounded-lg border border-slate-700/50 bg-slate-800/30 px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 card-hover hover:border-cyan-500/30 hover:text-cyan-200"
          >
            Details
          </button>
        </div>
        <KPIGrid evsScore={evsScore} heat={heat} biodiversity={biodiversity} />
      </div>

      {/* EVS Gauge Section */}
      <EVSGauge value={evsScore} />

      {/* Simulation Controls */}
      <SimulationSliders sliders={sliders} onUpdate={onUpdateSliders} />

      {/* AI Copilot Crown Jewel */}
      <AICopilotCard mode={copilotMode} onChangeMode={onChangeMode} prompt={copilotPrompt} />

      {/* Footer (System Status) */}
      <div className="mt-auto glass border border-slate-700/30 rounded-xl p-3 text-center">
        <p className="text-xs font-medium text-cyan-300">🛰️ Connected & Operational</p>
        <p className="text-[10px] text-slate-500 mt-1">All systems nominal</p>
      </div>
    </section>
  )
}
