import { useMemo, useState } from 'react'
import MapContainer from './MapContainer'
import GraphsPanel from './GraphsPanel'
import { Map, BarChart3 } from 'lucide-react'

export default function CenterPanel({
  activeRegion,
  evsScore,
  trendData,
  cascadeData,
  shapData,
  focusedPanel,
  onSetFocus,
}) {
  const regionLabel = useMemo(() => {
    if (!activeRegion) return 'Unknown Region'
    return activeRegion.name
  }, [activeRegion])

  return (
    <section className="glass-premium flex min-h-[72vh] flex-col gap-4 rounded-2xl border border-slate-700/50 p-6 shadow-2xl animate-fade-in-up">
      {/* Header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-3 border-b border-slate-700/30">
        <div>
          <p className="text-subtitle">📍 Active Mission Zone</p>
          <h2 className="text-xl font-bold text-white mt-1">{regionLabel}</h2>
          <p className="text-xs text-slate-400 mt-1">Real-time environmental monitoring & analysis</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/40 border border-slate-700/40 px-3 py-2">
            <span className={`h-3 w-3 rounded-full animate-pulse ${evsScore > 0.7 ? 'bg-rose-400' : evsScore > 0.4 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-xs font-semibold text-slate-300">EVS</span>
            <span className="font-mono font-bold text-white">{Math.round(evsScore * 100)}%</span>
          </div>
          <button
            onClick={() => onSetFocus(focusedPanel === 'map' ? 'graphs' : 'map')}
            className="flex items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/40 px-3 py-2 text-xs font-semibold text-slate-300 transition-all duration-300 card-hover hover:border-cyan-500/30 hover:text-cyan-200"
          >
            {focusedPanel === 'map' ? (
              <>
                <BarChart3 className="h-4 w-4" />
                Analytics
              </>
            ) : (
              <>
                <Map className="h-4 w-4" />
                Map View
              </>
            )}
          </button>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-12">
        {/* Map Section */}
        <div className={`${focusedPanel === 'graphs' ? 'md:col-span-12' : 'md:col-span-7'} relative rounded-xl overflow-hidden border border-slate-700/40 glass`}>
          <MapContainer region={activeRegion} evsScore={evsScore} />
        </div>

        {/* Analytics Section */}
        <div className={`${focusedPanel === 'map' ? 'hidden' : 'md:col-span-5'} md:block rounded-xl overflow-hidden`}>
          <GraphsPanel
            trendData={trendData}
            cascadeData={cascadeData}
            shapData={shapData}
          />
        </div>
      </div>
    </section>
  )
}
