import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Microscope, Beaker, AlertCircle } from 'lucide-react'

// Drag-Drop Upload Zone
function UploadZone({ title, icon: Icon, description, onFileSelect, isLoading }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      onFileSelect(files[0])
    }
  }

  return (
    <motion.div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      whileHover={{ borderColor: 'rgba(6, 182, 212, 0.5)' }}
      className={`glass border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
        isDragging
          ? 'border-cyan-400/70 bg-cyan-950/30 glow-cyan'
          : 'border-slate-700/50'
      }`}
    >
      <Icon className="h-8 w-8 mx-auto text-cyan-400 mb-2" />
      <h3 className="text-sm font-semibold text-slate-200 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 mb-3">{description}</p>
      <input
        type="file"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            onFileSelect(e.target.files[0])
          }
        }}
        className="hidden"
        id={`upload-${title}`}
      />
      <label
        htmlFor={`upload-${title}`}
        className="inline-block glass-dark border border-slate-600/50 rounded-lg px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200 cursor-pointer transition"
      >
        {isLoading ? '⏳ Processing...' : '📁 Select File'}
      </label>
    </motion.div>
  )
}

// Results Display
function ResultsDisplay({ type, data }) {
  if (!data) return null

  if (type === 'edna') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-emerald-500/30 rounded-lg p-3 bg-emerald-950/10"
      >
        <h4 className="text-sm font-bold text-emerald-300 mb-2">✅ eDNA Analysis Complete</h4>
        <div className="space-y-1 text-xs text-slate-300">
          <p><span className="text-slate-400">Sample ID:</span> {data.sample_id}</p>
          <p><span className="text-slate-400">Total Reads:</span> {data.total_reads?.toLocaleString?.() || 0}</p>
          <p><span className="text-slate-400">Diversity Index:</span> {data.diversity_index}</p>
          {data.detected_species && data.detected_species.length > 0 && (
            <div className="mt-2">
              <p className="text-slate-400">Top Species:</p>
              <div className="ml-2 space-y-1">
                {data.detected_species.slice(0, 3).map((sp, idx) => (
                  <p key={idx} className="text-emerald-300">
                    {sp.species} • {(sp.confidence * 100).toFixed(1)}%
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (type === 'otolith') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass border border-cyan-500/30 rounded-lg p-3 bg-cyan-950/10"
      >
        <h4 className="text-sm font-bold text-cyan-300 mb-2">✅ Otolith Prediction Complete</h4>
        <div className="space-y-1 text-xs text-slate-300">
          <p><span className="text-slate-400">Species:</span> {data.predicted_species}</p>
          <p><span className="text-slate-400">Age:</span> {data.predicted_age_years} years</p>
          <p><span className="text-slate-400">Confidence:</span> {(data.confidence_score * 100).toFixed(1)}%</p>
          <p><span className="text-slate-400">Growth Zones:</span> {data.growth_zones_counted}</p>
          <p><span className="text-slate-400">Est. Weight:</span> {data.estimated_weight_kg} kg</p>
        </div>
      </motion.div>
    )
  }

  return null
}

export default function MolecularHubTab({ onOpenModal }) {
  const [ednaPending, setEdnaPending] = useState(false)
  const [otolithPending, setOtolithPending] = useState(false)
  const [ednaResults, setEdnaResults] = useState(null)
  const [otolithResults, setOtolithResults] = useState(null)

  const handleEdnaUpload = async (file) => {
    setEdnaPending(true)
    try {
      // In a real implementation, you'd send the file to the /api/edna-analyze endpoint
      setTimeout(() => {
        setEdnaResults({
          sample_id: `EDNA-${Date.now()}`,
          total_reads: 45230,
          diversity_index: 3.2,
          detected_species: [
            { species: 'Tuna (Thunnus albacares)', confidence: 0.92 },
            { species: 'Grouper (Epinephelus)', confidence: 0.78 },
            { species: 'Squid (Dosidicus gigas)', confidence: 0.65 },
          ],
        })
        setEdnaPending(false)
      }, 1200)
    } catch (err) {
      console.error('eDNA upload error:', err)
      setEdnaPending(false)
    }
  }

  const handleOtolithUpload = async (file) => {
    setOtolithPending(true)
    try {
      // In a real implementation, you'd send the file to the /api/otolith-predict endpoint
      setTimeout(() => {
        setOtolithResults({
          predicted_species: 'Yellowfin Tuna',
          predicted_age_years: 7,
          confidence_score: 0.89,
          growth_zones_counted: 7,
          estimated_weight_kg: 156,
        })
        setOtolithPending(false)
      }, 1200)
    } catch (err) {
      console.error('Otolith upload error:', err)
      setOtolithPending(false)
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-slate-100 mb-2">🔬 Molecular Hub (SIH25041)</h2>
        <p className="text-xs text-slate-400">Scientific data uploads & analysis</p>
      </div>

      {/* Information Banner */}
      <div className="glass border border-blue-500/30 rounded-lg p-3 bg-blue-950/10 flex items-start gap-2">
        <AlertCircle className="h-4 w-4 text-blue-300 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-200">
          Upload eDNA sequences (FASTA) or otolith images to analyze fish populations and age prediction.
        </p>
      </div>

      {/* eDNA Upload Zone */}
      <div className="space-y-2">
        <UploadZone
          title="Upload eDNA Sequence"
          icon={Microscope}
          description="FASTA format files for genomic species detection"
          onFileSelect={handleEdnaUpload}
          isLoading={ednaPending}
        />
        {ednaResults && <ResultsDisplay type="edna" data={ednaResults} />}
      </div>

      {/* Otolith Upload Zone */}
      <div className="space-y-2">
        <UploadZone
          title="Upload Otolith Image"
          icon={Beaker}
          description="PNG/JPG otolith cross-sections for CNN age prediction"
          onFileSelect={handleOtolithUpload}
          isLoading={otolithPending}
        />
        {otolithResults && <ResultsDisplay type="otolith" data={otolithResults} />}
      </div>

      {/* Actions */}
      <button
        onClick={() => onOpenModal({ type: 'molecular', title: 'Advanced Workflows' })}
        className="w-full glass-dark border border-slate-600/50 rounded-lg px-3 py-2 text-xs font-semibold text-cyan-300 hover:text-cyan-200 hover:glow-cyan transition"
      >
        📊 View Full Molecular Dashboard
      </button>
    </div>
  )
}
