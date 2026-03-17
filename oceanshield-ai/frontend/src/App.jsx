import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import TopBar from './components/TopBar'
import Modal from './components/Modal'
import MapContainer from './components/MapContainer'
import TabSelector from './components/TabSelector'
import GlobalIntelTab from './components/tabs/GlobalIntelTab'
import SimulatorTab from './components/tabs/SimulatorTab'
import MolecularHubTab from './components/tabs/MolecularHubTab'
import AICopilotTab from './components/tabs/AICopilotTab'
import SubseaCloudPanel from './components/SubseaCloudPanel'
import { simulationAPI, copilotAPI } from './services/api'
import {
  defaultRegions,
  generateMockNews,
  generateTrendData,
  generateCascadeData,
  generateMockShapData,
} from './utils/mockData'

function App() {
  const [activeTab, setActiveTab] = useState('global-intel')
  const [activeRegion, setActiveRegion] = useState(defaultRegions[0])
  const [newsItems, setNewsItems] = useState(generateMockNews())
  const [evsScore, setEvsScore] = useState(0.42)
  const [trendData, setTrendData] = useState([])
  const [cascadeData, setCascadeData] = useState([])
  const [shapData, setShapData] = useState([])
  const [sliders, setSliders] = useState({
    pollution: 62,
    shipping: 48,
    climateStress: 35,
  })
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalPayload, setModalPayload] = useState(null)
  const [copilotMode, setCopilotMode] = useState('Scientist')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copilotPrompt, setCopilotPrompt] = useState('')
  const [runtimeError, setRuntimeError] = useState(null)
  const [leftCollapsed, setLeftCollapsed] = useState(false)
  const [rightCollapsed, setRightCollapsed] = useState(false)
  const [showSubseaCloud, setShowSubseaCloud] = useState(false)

  // Simulation effect - runs when sliders change
  useEffect(() => {
    const runSimulation = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const simulationParams = {
          pollution: sliders.pollution,
          shipping: sliders.shipping,
          climate_stress: sliders.climateStress,
          kinetic_threat: 0,
          temperature: 25.0 + (sliders.climateStress / 100) * 5,
          ph: 8.1 - (sliders.pollution / 100) * 0.3,
          dissolved_oxygen: 9.0 - (sliders.pollution / 100) * 2,
        }

        const result = await simulationAPI.runSimulation(simulationParams)
        setEvsScore(result.evs_score / 100)
        setTrendData(result.trend_data)
        setShapData(result.shap_data)

        const cascadeItems = result.cascade_summary.cascade_data.map(item => ({
          label: item.description,
          value: Math.random() * 50 + 25,
          id: `${item.stage}-${item.description.slice(0, 10)}`
        }))
        setCascadeData(cascadeItems)
      } catch (err) {
        console.error('Simulation error:', err)
        setError(err.message)
        setEvsScore(0.42)
        setTrendData(generateTrendData(42))
        setCascadeData(generateCascadeData(42))
        setShapData(generateMockShapData(42))
      } finally {
        setIsLoading(false)
      }
    }

    const timeoutId = setTimeout(runSimulation, 300)
    return () => clearTimeout(timeoutId)
  }, [activeRegion, sliders])

  // Copilot effect - updates AI briefing
  useEffect(() => {
    const updateCopilotPrompt = async () => {
      try {
        const currentParams = {
          pollution: sliders.pollution,
          shipping: sliders.shipping,
          climate_stress: sliders.climateStress,
          temperature: 25.0 + (sliders.climateStress / 100) * 5,
        }

        const report = await copilotAPI.generateReport(
          copilotMode,
          evsScore * 100,
          [],
          currentParams
        )

        setCopilotPrompt(report.report)
      } catch (err) {
        console.error('Copilot error:', err)
        const riskTier = evsScore > 0.7 ? 'critical' : evsScore > 0.4 ? 'elevated' : 'stable'
        setCopilotPrompt(`Risk level is ${riskTier} (EVS ${Math.round(evsScore * 100)}). Adjusting pollution and shipping levels will shift the heat map accordingly.`)
      }
    }

    updateCopilotPrompt()
  }, [copilotMode, evsScore, sliders])

  // Error handling
  useEffect(() => {
    const handleError = (message, source, lineno, colno, error) => {
      setRuntimeError(error?.message || message)
      return false
    }

    const handleRejection = (event) => {
      setRuntimeError(event.reason?.message || String(event.reason))
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  const handleRegionSelect = (region) => {
    setActiveRegion(region)
  }

  const handleOpenModal = (payload) => {
    setModalPayload(payload)
    setIsModalOpen(true)
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-slate-950">
      {/* Full-Screen Map Background */}
      <MapContainer region={activeRegion} evsScore={evsScore} sliders={sliders} showSubseaCloud={showSubseaCloud} />

      {/* Floating Top Bar */}
      <div className="absolute top-4 left-4 right-4 z-50">
        <TopBar news={newsItems} showClouds={showSubseaCloud} onToggleClouds={() => setShowSubseaCloud((prev) => !prev)} />
      </div>

      {/* Left Control Panel (Region + Tabs) */}
      {leftCollapsed ? (
        <button
          onClick={() => setLeftCollapsed(false)}
          className="absolute left-4 top-24 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-200 shadow-lg backdrop-blur-md hover:bg-slate-900/90"
          title="Expand panels"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      ) : (
        <div className="absolute left-4 top-24 z-50 w-80 max-h-[calc(100vh-6rem)] overflow-y-auto glass border border-slate-700/50 backdrop-blur-md p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Mission Zones</h3>
              <p className="text-xs text-slate-400">Select a region to focus the map.</p>
            </div>
            <button
              onClick={() => setLeftCollapsed(true)}
              className="rounded-full p-1 text-slate-300 hover:bg-slate-800/50"
              title="Collapse"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Active Region</label>
              <select
                value={activeRegion.id}
                onChange={(e) => {
                  const region = defaultRegions.find((r) => r.id === e.target.value)
                  if (region) handleRegionSelect(region)
                }}
                className="w-full glass border border-slate-700/40 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-cyan-500/50 focus:glow-cyan transition-all"
              >
                {defaultRegions.map((region) => (
                  <option key={region.id} value={region.id} className="bg-slate-950">
                    {region.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-slate-100">Dashboard</h3>
              <TabSelector activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
          </div>
        </div>
      )}

      {/* Right Intelligence Panel */}
      {rightCollapsed ? (
        <button
          onClick={() => setRightCollapsed(false)}
          className="absolute right-4 top-24 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-slate-900/70 border border-slate-700/60 text-slate-200 shadow-lg backdrop-blur-md hover:bg-slate-900/90"
          title="Expand panel"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <div className="absolute right-4 top-24 z-50 w-96 max-h-[calc(100vh-6rem)] overflow-y-auto glass border border-slate-700/50 backdrop-blur-md p-6">
          <div className="sticky top-0 z-50 flex items-start justify-between bg-slate-950/60 pb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Intelligence Panel</h3>
              <p className="text-xs text-slate-400">Contextual insights for the selected dashboard view.</p>
            </div>
            <button
              onClick={() => setRightCollapsed(true)}
              className="rounded-full p-2 text-slate-200 hover:bg-slate-800/60"
              title="Collapse"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4">
            {activeTab === 'global-intel' && (
              <GlobalIntelTab
                activeRegion={activeRegion}
                evsScore={evsScore}
                kpiData={{
                  sst: 25.0 + (sliders.climateStress / 100) * 5,
                  ph: 8.1 - (sliders.pollution / 100) * 0.3,
                  do: 9.0 - (sliders.pollution / 100) * 2,
                  pollution: sliders.pollution,
                }}
                trendData={trendData}
              />
            )}

            {activeTab === 'subsea-cloud' && (
              <SubseaCloudPanel />
            )}

            {activeTab === 'simulator' && (
              <SimulatorTab
                sliders={sliders}
                onUpdateSliders={setSliders}
                evsScore={evsScore}
                cascadeData={cascadeData}
                isLoading={isLoading}
              />
            )}

            {activeTab === 'molecular' && (
              <MolecularHubTab onOpenModal={handleOpenModal} />
            )}

            {activeTab === 'copilot' && (
              <AICopilotTab
                copilotMode={copilotMode}
                onChangeMode={setCopilotMode}
                copilotPrompt={copilotPrompt}
                evsScore={evsScore}
              />
            )}
          </div>
        </div>
      )}


      {/* Error Banners */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-32 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-red-400/50 bg-red-950/20 px-4 py-3 text-red-200"
        >
          <p className="text-sm font-semibold">Backend Error</p>
          <p className="text-xs">{error}</p>
        </motion.div>
      )}

      {runtimeError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-32 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-red-400/50 bg-red-950/20 px-4 py-3 text-red-200"
        >
          <p className="text-sm font-semibold">Runtime Error</p>
          <p className="text-xs">{runtimeError}</p>
        </motion.div>
      )}

      {isLoading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-32 left-1/2 -translate-x-1/2 z-50 rounded-xl border border-blue-400/50 bg-blue-950/20 px-4 py-3 text-blue-200"
        >
          <p className="text-sm font-semibold">Running Simulation...</p>
        </motion.div>
      )}

      {/* Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} payload={modalPayload} />
    </div>
  )
}

export default App
