import { useState } from 'react'
import { X, Microscope, Beaker, AlertCircle } from 'lucide-react'
import { molecularAPI } from '../services/api'

export default function Modal({ open, onClose, payload }) {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  if (!open) return null

  const handleEDNAAnalysis = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const sampleData = {
        sample_id: `EDNA-${Date.now()}`,
        volume_ml: 150,
        depth_m: 25,
        location: payload?.region || 'Arabian Sea'
      }
      const result = await molecularAPI.analyzeEDNA(sampleData)
      setResults({ type: 'edna', data: result })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtolithPrediction = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const imageData = {
        image_data: 'mock-base64-image-data', // In real app, this would be actual image
        metadata: { source: 'uploaded', quality: 'high' }
      }
      const result = await molecularAPI.predictOtolith(imageData)
      setResults({ type: 'otolith', data: result })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const renderContent = () => {
    if (results) {
      if (results.type === 'edna') {
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-emerald-200 flex items-center gap-2">
              <Microscope className="h-4 w-4" />
              eDNA Analysis Results
            </h4>
            <div className="space-y-2 text-sm bg-slate-800/30 rounded-lg p-3 border border-emerald-500/20">
              <p><span className="font-semibold text-slate-200">Sample ID:</span> <span className="text-emerald-300">{results.data.sample_id}</span></p>
              <p><span className="font-semibold text-slate-200">Total Reads:</span> <span className="text-cyan-300">{results.data.total_reads.toLocaleString()}</span></p>
              <p><span className="font-semibold text-slate-200">Diversity Index:</span> <span className="text-amber-300">{results.data.diversity_index}</span></p>
              <p><span className="font-semibold text-slate-200">Detected Species:</span></p>
              <div className="ml-4 space-y-1 max-h-[200px] overflow-y-auto">
                {results.data.detected_species.slice(0, 5).map((species, idx) => (
                  <div key={idx} className="flex justify-between text-xs bg-slate-900/50 p-2 rounded border border-emerald-500/10">
                    <span className="text-slate-300">{species.species}</span>
                    <span className="text-emerald-400 font-semibold">{(species.confidence * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )
      } else if (results.type === 'otolith') {
        return (
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-cyan-200 flex items-center gap-2">
              <Beaker className="h-4 w-4" />
              Otolith Age Prediction
            </h4>
            <div className="space-y-2 text-sm bg-slate-800/30 rounded-lg p-3 border border-cyan-500/20">
              <p><span className="font-semibold text-slate-200">Predicted Species:</span> <span className="text-cyan-300">{results.data.predicted_species}</span></p>
              <p><span className="font-semibold text-slate-200">Predicted Age:</span> <span className="text-amber-300">{results.data.predicted_age_years} years</span></p>
              <p><span className="font-semibold text-slate-200">Confidence:</span> <span className="text-emerald-300">{(results.data.confidence_score * 100).toFixed(1)}%</span></p>
              <p><span className="font-semibold text-slate-200">Growth Zones:</span> <span className="text-blue-300">{results.data.growth_zones_counted}</span></p>
              <p><span className="font-semibold text-slate-200">Estimated Weight:</span> <span className="text-rose-300">{results.data.estimated_weight_kg} kg</span></p>
            </div>
          </div>
        )
      }
    }

    if (payload?.type === 'molecular') {
      return (
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Molecular biodiversity workflows for SIH25041 ecosystem monitoring.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleEDNAAnalysis}
              disabled={isLoading}
              className="group relative rounded-2xl overflow-hidden p-4 text-left transition card-hover disabled:opacity-50"
            >
              <div className="absolute inset-0 glass-premium border border-emerald-500/40 -z-10 group-hover:glow-emerald"></div>
              <div className="relative">
                <Microscope className="h-5 w-5 text-emerald-400 mb-2" />
                <h4 className="text-sm font-semibold text-emerald-200">eDNA Analysis</h4>
                <p className="mt-1 text-xs text-slate-400">Genomic sequencing for species detection</p>
              </div>
            </button>
            <button
              onClick={handleOtolithPrediction}
              disabled={isLoading}
              className="group relative rounded-2xl overflow-hidden p-4 text-left transition card-hover disabled:opacity-50"
            >
              <div className="absolute inset-0 glass-premium border border-cyan-500/40 -z-10 group-hover:glow-cyan"></div>
              <div className="relative">
                <Beaker className="h-5 w-5 text-cyan-400 mb-2" />
                <h4 className="text-sm font-semibold text-cyan-200">Otolith Prediction</h4>
                <p className="mt-1 text-xs text-slate-400">CNN-based age estimation</p>
              </div>
            </button>
          </div>
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-cyan-300 animate-pulse">
              <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Processing molecular analysis...</span>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="glass-premium rounded-2xl border border-slate-700/50 p-4 text-sm text-slate-300">
        <p className="text-slate-200">
          This modal is a placeholder for interactive mission tools. Integrate
          with backend simulations and AI pipelines to unlock:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-400 text-xs">
          <li>Scenario playback and what-if scenario generation</li>
          <li>Live telemetry dashboards and anomaly alerts</li>
          <li>Multimodal data overlays (satellite, IoT, sensor networks)</li>
        </ul>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg rounded-3xl glass-premium border border-slate-700/60 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full glass border border-slate-600/50 text-slate-300 transition hover:text-slate-100 hover:glow-cyan hover:scale-110"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <h3 className="text-lg font-bold text-slate-100">
          {payload?.title ?? '🎯 Mission Control'}
        </h3>
        <p className="mt-1 text-xs text-slate-400">Advanced workflows & ecosystem analysis</p>

        {/* Error Banner */}
        {error && (
          <div className="mt-4 rounded-xl border border-rose-500/40 glass-dark bg-rose-950/20 p-3 text-sm text-rose-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <span>Error: {error}</span>
          </div>
        )}

        {/* Content */}
        <div className="mt-5 space-y-3">
          <p className="text-xs text-slate-300">
            <span className="font-semibold text-slate-200">Workflow:</span>
            <span className="ml-2 px-2 py-1 rounded-full glass text-cyan-300 inline-block text-[11px]">
              {payload?.type ?? 'overview'}
            </span>
          </p>
          {renderContent()}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          {results && (
            <button
              onClick={() => setResults(null)}
              className="px-4 py-2 rounded-lg glass border border-slate-600/50 text-slate-200 text-sm font-semibold transition hover:border-slate-500 hover:text-slate-100 card-hover"
            >
              ← Back
            </button>
          )}
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg glass-dark border border-slate-600/50 text-slate-100 text-sm font-semibold transition hover:text-cyan-200 hover:glow-cyan card-hover"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
