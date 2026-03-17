import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts'

export default function EVSGauge({ value = 0 }) {
  const percentage = Math.round(Math.min(1, Math.max(0, value)) * 100)
  const data = [{ name: 'EVS', value: percentage }]

  // Color gradient based on risk level
  let gaugeColor, glowColor, riskLevel, riskDesc
  if (percentage > 75) {
    gaugeColor = '#ef4444' // Red
    glowColor = 'rgba(239, 68, 68, 0.5)'
    riskLevel = 'CRITICAL'
    riskDesc = 'Severe Ecosystem Stress'
  } else if (percentage > 50) {
    gaugeColor = '#f59e0b' // Orange
    glowColor = 'rgba(245, 158, 11, 0.5)'
    riskLevel = 'HIGH'
    riskDesc = 'Elevated Environmental Risk'
  } else if (percentage > 25) {
    gaugeColor = '#eab308' // Yellow
    glowColor = 'rgba(234, 179, 8, 0.5)'
    riskLevel = 'MODERATE'
    riskDesc = 'Managed Baseline'
  } else {
    gaugeColor = '#10b981' // Green
    glowColor = 'rgba(16, 185, 129, 0.5)'
    riskLevel = 'STABLE'
    riskDesc = 'Ecosystem Healthy'
  }

  return (
    <div className="glass-premium rounded-2xl border border-slate-700/50 p-5 glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-subtitle">Ecosystem Vulnerability Score</p>
          <p className="text-xs text-slate-400 mt-1">Real-time Risk Assessment</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">{percentage}%</p>
          <p className={`text-xs font-semibold mt-1 ${
            percentage > 75 ? 'text-rose-400' : 
            percentage > 50 ? 'text-amber-400' : 
            percentage > 25 ? 'text-yellow-400' : 'text-emerald-400'
          }`}>
            {riskLevel}
          </p>
        </div>
      </div>

      {/* Speedometer Gauge */}
      <div className="relative h-32 mb-4">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
          {/* Background Arc */}
          <path
            d="M 30 110 A 70 70 0 0 1 170 110"
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          
          {/* Gradient Risk Zones */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(16, 185, 129, 0.8)" /> {/* Green */}
              <stop offset="30%" stopColor="rgba(234, 179, 8, 0.8)" /> {/* Yellow */}
              <stop offset="70%" stopColor="rgba(245, 158, 11, 0.8)" /> {/* Orange */}
              <stop offset="100%" stopColor="rgba(239, 68, 68, 0.8)" /> {/* Red */}
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Active Arc (animated based on value) */}
          <path
            d="M 30 110 A 70 70 0 0 1 170 110"
            fill="none"
            stroke={gaugeColor}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(percentage / 100) * 219} 219`}
            filter="url(#glow)"
            style={{
              transition: 'stroke-dasharray 1s ease-out',
              filter: 'drop-shadow(0 0 8px ' + glowColor + ')',
            }}
          />

          {/* Needle Indicator */}
          <g style={{ transformOrigin: '100px 110px' }}>
            <line
              x1="100"
              y1="110"
              x2="100"
              y2="40"
              stroke={gaugeColor}
              strokeWidth="3"
              strokeLinecap="round"
              style={{
                transform: `rotate(${(percentage / 100) * 180 - 90}deg)`,
                transformOrigin: '100px 110px',
                transition: 'transform 1s ease-out',
                filter: 'drop-shadow(0 0 4px ' + glowColor + ')',
              }}
            />
            <circle cx="100" cy="110" r="6" fill={gaugeColor} filter="url(#glow)" />
          </g>
        </svg>

        {/* Center Labels */}
        <div className="absolute inset-0 flex items-end justify-center pb-3">
          <div className="text-center">
            <p className="text-xs text-slate-400">Risk Level</p>
            <p className="text-sm font-bold text-slate-200">{riskDesc}</p>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex gap-2">
          <div className={`h-2 w-2 rounded-full ${percentage > 75 ? 'bg-rose-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-slate-400">Live Monitoring</span>
        </div>
        <span className="text-cyan-400 font-mono">EVS #{percentage.toString().padStart(3, '0')}</span>
      </div>
    </div>
  )
}
