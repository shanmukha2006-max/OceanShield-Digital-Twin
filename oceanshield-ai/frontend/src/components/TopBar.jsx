import { Shield } from 'lucide-react'
import NewsTicker from './NewsTicker'

export default function TopBar({ news, showClouds, onToggleClouds }) {
  return (
    <header className="z-40 w-full border-b border-slate-700/30 bg-gradient-to-r from-slate-950/80 via-blue-950/40 to-slate-950/80 px-4 py-3 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-full items-center justify-between gap-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/40 shadow-lg glow-cyan">
            <Shield className="h-5 w-5 text-cyan-300" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-white">OceanShield AI</p>
            <p className="text-xs text-cyan-400/80 font-medium">Mission Control</p>
          </div>
        </div>

        {/* Live Ticker */}
        <div className="flex-1 min-w-0">
          <NewsTicker items={news} />
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onToggleClouds}
            className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
              showClouds ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/40' : 'bg-slate-900/40 text-slate-200 border border-slate-700/40'
            }`}
            title="Toggle subsea cloud deployment overlay"
          >
            {showClouds ? 'Hide Subsea Cloud' : 'Show Subsea Cloud'}
          </button>

          <div className="flex items-center gap-2">
            <div className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-300">LIVE</span>
          </div>
        </div>
      </div>
    </header>
  )
}
