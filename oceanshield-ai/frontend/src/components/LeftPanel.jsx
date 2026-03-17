import { MapPin, Activity, Beaker, Microscope } from 'lucide-react'

export default function LeftPanel({ regions, activeRegion, onSelectRegion, onOpenModal }) {
  return (
    <section className="glass-premium flex h-full flex-col gap-5 rounded-2xl p-5 animate-fade-in-up">
      {/* Header */}
      <div className="space-y-1">
        <p className="text-subtitle">Mission Zones</p>
        <h2 className="text-text-glow text-lg">Geographic Selection</h2>
      </div>

      {/* Region Chips */}
      <div className="space-y-2">
        {regions.map((region) => {
          const active = region.id === activeRegion.id
          return (
            <button
              key={region.id}
              onClick={() => onSelectRegion(region)}
              className={`group w-full rounded-2xl border px-4 py-3 text-left transition-all duration-300 card-hover ${
                active
                  ? 'glass-premium border-cyan-500/50 glow-cyan'
                  : 'glass border-slate-700/40 hover:border-cyan-500/30 hover:bg-cyan-950/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                  active 
                    ? 'bg-cyan-500/30 text-cyan-300 ring-2 ring-cyan-500/50' 
                    : 'bg-slate-800/50 text-slate-400 group-hover:text-cyan-300'
                }`}>
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-white">{region.name}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{region.description}</p>
                  {active && <p className="text-xs text-cyan-400 font-semibold mt-1">● Active Zone</p>}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="my-2 h-px bg-gradient-to-r from-slate-700/20 via-cyan-500/20 to-slate-700/20" />

      {/* Molecular Hub */}
      <div className="space-y-2 flex-1">
        <p className="text-subtitle">SIH25041 Hub</p>
        <p className="text-xs text-slate-400 font-medium">Molecular & Fisheries</p>
        
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={() => onOpenModal({ type: 'molecular', title: '🧬 eDNA Analysis Pipeline' })}
            className="group glass border border-emerald-500/30 rounded-xl px-3 py-3 text-center transition-all duration-300 card-hover hover:glow-emerald hover:bg-emerald-950/20"
          >
            <Microscope className="h-5 w-5 mx-auto mb-2 text-emerald-400 group-hover:text-emerald-300" />
            <p className="text-xs font-bold text-emerald-300">eDNA</p>
            <p className="text-[10px] text-slate-400 mt-1">Genomic Seq</p>
          </button>

          <button
            onClick={() => onOpenModal({ type: 'otolith', title: '🐟 Otolith CNN Analyzer' })}
            className="group glass border border-blue-500/30 rounded-xl px-3 py-3 text-center transition-all duration-300 card-hover hover:glow-amber hover:bg-amber-950/20"
          >
            <Beaker className="h-5 w-5 mx-auto mb-2 text-amber-400 group-hover:text-amber-300" />
            <p className="text-xs font-bold text-amber-300">Otolith</p>
            <p className="text-[10px] text-slate-400 mt-1">Age Analysis</p>
          </button>
        </div>
      </div>

      {/* Footer Status */}
      <div className="glass border border-slate-700/30 rounded-xl p-3 text-center">
        <p className="text-xs font-medium text-cyan-300">🔹 Ready for Upload</p>
        <p className="text-[10px] text-slate-500 mt-1">Drag files into modals</p>
      </div>
    </section>
  )
}
