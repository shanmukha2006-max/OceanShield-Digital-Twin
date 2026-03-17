import { useMemo } from 'react'
import EVSGauge from '../../components/EVSGauge'

// Simple KPI Card for the Intel Tab
function KPICard({ label, value, unit, trend, riskLevel }) {
  const getColor = (risk) => {
    if (risk > 0.75) return 'text-rose-400'
    if (risk > 0.5) return 'text-amber-400'
    return 'text-emerald-400'
  }

  return (
    <div className="glass border border-slate-700/40 rounded-lg p-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <div>
          <p className={`text-2xl font-bold ${getColor(riskLevel)}`}>
            {typeof value === 'number' ? value.toFixed(1) : value}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{unit}</p>
        </div>
        <span className="text-sm">{trend}</span>
      </div>
    </div>
  )
}

export default function GlobalIntelTab({
  activeRegion,
  onRegionChange,
  evsScore,
  kpiData,
  trendData,
}) {
  const gaugeData = useMemo(
    () => [
      { name: 'EVS', value: Math.round(evsScore * 100), fill: '#06b6d4' },
    ],
    [evsScore]
  )

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-1">🌍 Global Intel</h2>
        <p className="text-xs text-slate-400">
          Situational awareness & ecosystem metrics • {activeRegion?.name}
        </p>
      </div>

      {/* EVS Gauge */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-300">Ecosystem Vulnerability</p>
        <div className="glass border border-slate-700/40 rounded-lg p-4">
          <EVSGauge evsPercentage={Math.round(evsScore * 100)} />
        </div>
      </div>

      {/* KPI Grid 2x2 */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-300">Key Metrics (2x2)</p>
        <div className="grid grid-cols-2 gap-2">
          <KPICard
            label="Sea Surface Temp"
            value={kpiData?.sst || 25.0}
            unit="°C"
            trend="📈"
            riskLevel={evsScore}
          />
          <KPICard
            label="pH Level"
            value={kpiData?.ph || 8.1}
            unit="pH"
            trend="📉"
            riskLevel={Math.min(evsScore * 1.2, 1)}
          />
          <KPICard
            label="Dissolved O₂"
            value={kpiData?.do || 9.0}
            unit="mg/L"
            trend="📉"
            riskLevel={Math.min(evsScore + 0.1, 1)}
          />
          <KPICard
            label="Pollution Index"
            value={kpiData?.pollution || 62}
            unit="ppm"
            trend="📈"
            riskLevel={Math.min(evsScore * 0.9, 1)}
          />
        </div>
      </div>

      {/* Status Footer */}
      <div className="glass border border-emerald-500/20 rounded-lg p-3 bg-emerald-950/10 text-xs">
        <div className="flex items-center gap-2 text-emerald-300">
          <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <span>Live monitoring active · Last update: now</span>
        </div>
      </div>
    </div>
  )
}
