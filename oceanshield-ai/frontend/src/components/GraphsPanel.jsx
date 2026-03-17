import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { TrendingUp, Zap, BarChart3 } from 'lucide-react'

const tabs = [
  { id: 'trend', label: 'Trends', icon: TrendingUp, desc: 'Sea surface temperature & dissolved oxygen' },
  { id: 'cascade', label: 'Cascade', icon: Zap, desc: 'Threat chains & ecosystem responses' },
  { id: 'shap', label: 'Drivers', icon: BarChart3, desc: 'Feature importance analysis' },
]

export default function GraphsPanel({ trendData, cascadeData, shapData }) {
  const [activeTab, setActiveTab] = useState('trend')

  const TrendChart = useMemo(() => {
    return (
      <ResponsiveContainer height={240} width="100%">
        <AreaChart data={trendData} margin={{ top: 10, right: 24, left: -20, bottom: 4 }}>
          <defs>
            <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.01} />
            </linearGradient>
            <filter id="trend-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={24} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
          <Tooltip
            cursor={{ stroke: 'rgba(6, 182, 212, 0.3)', strokeWidth: 2 }}
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: 10,
              border: '1px solid rgba(6, 182, 212, 0.3)',
              boxShadow: '0 0 15px rgba(6, 182, 212, 0.2)',
            }}
            labelStyle={{ color: '#06b6d4', fontSize: 12 }}
          />
          <Area
            dot={false}
            dataKey="value"
            stroke="#06b6d4"
            strokeWidth={2.5}
            fill="url(#trendGradient)"
            filter="url(#trend-glow)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    )
  }, [trendData])

  const CascadeChart = useMemo(() => {
    return (
      <ResponsiveContainer height={240} width="100%">
        <BarChart data={cascadeData} margin={{ top: 12, right: 24, left: -20, bottom: 20 }}>
          <defs>
            <linearGradient id="cascadeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#d97706" stopOpacity={0.6} />
            </linearGradient>
            <filter id="cascade-glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <XAxis dataKey="label" tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} width={40} />
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100, 116, 139, 0.15)" />
          <Tooltip
            cursor={{ fill: 'rgba(245, 158, 11, 0.1)' }}
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: 10,
              border: '1px solid rgba(245, 158, 11, 0.3)',
              boxShadow: '0 0 15px rgba(245, 158, 11, 0.2)',
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 2, 2]} fill="url(#cascadeGradient)" filter="url(#cascade-glow)" />
        </BarChart>
      </ResponsiveContainer>
    )
  }, [cascadeData])

  const ShapChart = useMemo(() => {
    return (
      <ResponsiveContainer height={240} width="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="30%"
          outerRadius="85%"
          data={shapData}
          startAngle={90}
          endAngle={-270}
        >
          <defs>
            <linearGradient id="shapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          <RadialBar
            dataKey="importance"
            cornerRadius={6}
            fill="url(#shapGradient)"
            background={{ fill: 'rgba(100, 116, 139, 0.1)' }}
            isAnimationActive={true}
          />
          <Legend
            iconSize={8}
            iconType="circle"
            layout="vertical"
            verticalAlign="middle"
            align="right"
            formatter={(value) => <span className="text-xs text-slate-300">{value}</span>}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(15, 23, 42, 0.95)',
              borderRadius: 10,
              border: '1px solid rgba(139, 92, 246, 0.3)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.2)',
            }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
    )
  }, [shapData])

  const activeTabConfig = tabs.find(t => t.id === activeTab)
  const IconComponent = activeTabConfig?.icon

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl glass-premium border border-slate-700/50 p-5">
      {/* Tab Header */}
      <div className="flex items-start justify-between pb-3 border-b border-slate-700/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {IconComponent && <IconComponent className="h-4 w-4 text-cyan-400" />}
            <p className="text-subtitle">Analytics Bay</p>
          </div>
          <p className="text-xs text-slate-500 mt-1">{activeTabConfig?.desc}</p>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex gap-2">
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-300 card-hover ${
                isActive
                  ? 'glass-premium border-cyan-500/50 text-cyan-200 glow-cyan'
                  : 'glass border-slate-700/40 text-slate-400 hover:text-slate-200 hover:border-slate-600/60'
              }`}
            >
              <TabIcon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Chart Area */}
      <div className="flex-1 -mx-2">
        {activeTab === 'trend' && TrendChart}
        {activeTab === 'cascade' && CascadeChart}
        {activeTab === 'shap' && ShapChart}
      </div>
    </div>
  )
}
