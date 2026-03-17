import { LineChart, Line, ResponsiveContainer } from 'recharts'

export default function KPIGrid({ evsScore, heat, biodiversity }) {
  const score = Math.round(evsScore * 100)
  
  // Generate sparkline data (7-day trend)
  const generateSparkData = (baseValue, variance) => {
    return Array.from({ length: 7 }).map((_, i) => ({
      value: Math.max(0, Math.min(100, baseValue + (Math.sin(i) * variance) + (Math.random() - 0.5) * 10))
    }))
  }

  const kpis = [
    {
      label: 'EVS Score',
      value: `${score}%`,
      unit: 'Risk Severity',
      trend: score > 70 ? 'up' : score > 40 ? 'flat' : 'down',
      color: score > 70 ? 'bg-rose-950/20 border-rose-500/30' : score > 40 ? 'bg-amber-950/20 border-amber-500/30' : 'bg-emerald-950/20 border-emerald-500/30',
      textColor: score > 70 ? 'text-rose-300' : score > 40 ? 'text-amber-300' : 'text-emerald-300',
      lineColor: score > 70 ? '#f87171' : score > 40 ? '#fbbf24' : '#34d399',
      sparkData: generateSparkData(score, 15),
    },
    {
      label: 'Sea Surface Temp',
      value: `${heat}°C`,
      unit: 'Temperature',
      trend: heat > 60 ? 'up' : 'flat',
      color: 'bg-orange-950/20 border-orange-500/30',
      textColor: 'text-orange-300',
      lineColor: '#fb923c',
      sparkData: generateSparkData(heat, 8),
    },
    {
      label: 'Biodiversity Index',
      value: `${biodiversity}%`,
      unit: 'Species Diversity',
      trend: biodiversity > 60 ? 'up' : 'flat',
      color: 'bg-cyan-950/20 border-cyan-500/30',
      textColor: 'text-cyan-300',
      lineColor: '#06b6d4',
      sparkData: generateSparkData(biodiversity, 12),
    },
  ]

  return (
    <div className="grid gap-3 grid-cols-1">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={`glass group rounded-2xl border px-4 py-3 transition-all duration-300 card-hover ${kpi.color}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">{kpi.label}</p>
              <p className={`text-2xl font-bold transition-colors ${kpi.textColor}`}>{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.unit}</p>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Sparkline Chart */}
              <ResponsiveContainer width={60} height={30}>
                <LineChart data={kpi.sparkData}>
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={kpi.lineColor} 
                    dot={false}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
              
              {/* Trend Indicator */}
              <span className={`text-lg ${
                kpi.trend === 'up' ? 'text-rose-400' : kpi.trend === 'down' ? 'text-emerald-400' : 'text-slate-400'
              }`}>
                {kpi.trend === 'up' ? '📈' : kpi.trend === 'down' ? '📉' : '→'}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
