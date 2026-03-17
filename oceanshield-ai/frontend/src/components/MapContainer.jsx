import { useEffect, useState } from 'react'
import { MapContainer as LeafletMap, TileLayer, Circle, Tooltip, Polyline, Popup } from 'react-leaflet'
import L from 'leaflet'
import { MapPin } from 'lucide-react'
import SpeciesPopup from './SpeciesPopup'
import { migrationRoutes } from '../utils/mockData'

// Work around Leaflet's icon loading issue in Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const getRiskColor = (evs) => {
  if (evs > 0.75) return '#fb7185' // rose-400
  if (evs > 0.5) return '#fbbf24' // amber-400
  return '#34d399' // emerald-400
}

const getRiskGlowColor = (evs) => {
  if (evs > 0.75) return 'rgba(251, 113, 133, 0.4)'
  if (evs > 0.5) return 'rgba(251, 191, 36, 0.4)'
  return 'rgba(52, 211, 153, 0.4)'
}

export default function MapContainer({ region, evsScore, sliders, showSubseaCloud }) {
  const position = region?.coords ?? [20, 77]
  const [selectedSpecies, setSelectedSpecies] = useState(null)

  // Function to get adjusted migration routes based on simulation parameters
  const getAdjustedRoutes = () => {
    return migrationRoutes.map(route => {
      let adjustedRoute = { ...route }

      if (route.id === 'atlantic-mackerel') {
        // Shift north based on temperature (climateStress slider)
        const shift = (sliders?.climateStress || 0) / 100 * 2 // Up to 2 degrees north
        adjustedRoute.coordinates = route.coordinates.map(([lat, lon]) => [lat + shift, lon])
      }

      if (route.id === 'north-atlantic-right-whale' && evsScore > 0.7) {
        // Turn red when stressed
        adjustedRoute.color = '#ef4444' // Brighter red
      }

      return adjustedRoute
    })
  }

  const adjustedRoutes = getAdjustedRoutes()

  // Real submarine cable landing sites for subsea cloud infrastructure
  const subseaCloudSites = [
    { id: 'cloud-uae', name: '🏙️ UAE Hub', coords: [24.4539, 54.3773], status: 'active', latency: '2ms' },
    { id: 'cloud-sg', name: '🏙️ Singapore', coords: [1.3521, 103.8198], status: 'active', latency: '1ms' },
    { id: 'cloud-france', name: '🏙️ France (Dunkirk)', coords: [51.0425, 2.3725], status: 'active', latency: '3ms' },
    { id: 'cloud-brazil', name: '🏙️ Brazil (Rio)', coords: [-22.9068, -43.1729], status: 'active', latency: '4ms' },
    { id: 'cloud-aus', name: '🏙️ Australia', coords: [-33.8688, 151.2093], status: 'active', latency: '2ms' },
    { id: 'cloud-japan', name: '🏙️ Japan', coords: [35.6762, 139.6503], status: 'standby', latency: '5ms' },
  ]

  useEffect(() => {
    // Force a re-render to ensure map tiles load correctly on server / client mismatch
  }, [region])

  return (
    <div className="absolute top-0 left-0 z-0 h-screen w-screen">
      <style>{`
        .leaflet-container {
          filter: brightness(0.75) contrast(1.1) saturate(0.85);
          background: #010b18;
        }
        .leaflet-tile-pane {
          mix-blend-mode: normal;
        }
        .risk-zone {
          animation: pulse-zone 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse-zone {
          0%, 100% {
            opacity: 0.16;
          }
          50% {
            opacity: 0.35;
          }
        }
        .migration-route {
          stroke-dasharray: 10, 10;
          stroke-linecap: round;
          animation: flow 3s linear infinite;
          filter: drop-shadow(0 0 6px currentColor);
        }
        @keyframes flow {
          0% {
            stroke-dashoffset: 20;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .migration-route:hover {
          stroke-width: 4;
          filter: drop-shadow(0 0 12px currentColor);
        }
        @keyframes sonar-pulse {
          0% {
            r: 40000;
            fill-opacity: 0.25;
            stroke-width: 3;
          }
          50% {
            r: 80000;
            fill-opacity: 0.08;
            stroke-width: 1.5;
          }
          100% {
            r: 120000;
            fill-opacity: 0;
            stroke-width: 0;
          }
        }
        .sonar-node {
          animation: sonar-pulse 4s ease-out infinite;
        }
        @keyframes glow-pulse {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(124, 58, 237, 0.6));
          }
          50% {
            filter: drop-shadow(0 0 20px rgba(124, 58, 237, 0.9));
          }
        }
        .subsea-cloud-marker {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
      
      <LeafletMap 
        center={[1, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        zoomControl={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CartoDB</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Glowing Risk Zone Circle */}
        <Circle
          center={position}
          radius={75000}
          className="risk-zone"
          pathOptions={{
            color: getRiskColor(evsScore),
            fillColor: getRiskColor(evsScore),
            fillOpacity: 0.2,
            weight: 2,
            dashArray: '8, 4',
          }}
        >
          <Tooltip 
            direction="top" 
            offset={[0, -10]} 
            opacity={0.98}
            className="risk-tooltip"
          >
            <div 
              className="rounded-lg bg-slate-950/95 px-3 py-2 backdrop-blur-md border border-slate-700/80 shadow-lg"
              style={{ boxShadow: `0 0 15px ${getRiskGlowColor(evsScore)}` }}
            >
              <div 
                className="text-sm font-bold"
                style={{ color: getRiskColor(evsScore) }}
              >
                {region?.name || 'Ocean Zone'} Risk
              </div>
              <div className="text-xs text-slate-300 mt-1">
                EVS: {Math.round(evsScore * 100)}%
              </div>
            </div>
          </Tooltip>
        </Circle>

        {/* Migration Routes */}
        {adjustedRoutes.map((route) => (
          <Polyline
            key={route.id}
            positions={route.coordinates}
            pathOptions={{
              color: route.color,
              weight: 3,
              opacity: 0.8,
            }}
            className="migration-route"
            eventHandlers={{
              click: () => setSelectedSpecies(route),
            }}
          >
            <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
              <div className="rounded-lg bg-slate-950/95 px-3 py-2 backdrop-blur-md border border-slate-700/80 shadow-lg">
                <div className="text-sm font-bold" style={{ color: route.color }}>
                  {route.species} Migration
                </div>
                <div className="text-xs text-slate-300 mt-1">
                  Click for details
                </div>
              </div>
            </Tooltip>
          </Polyline>
        ))}
      </LeafletMap>

      {/* Corner Status Indicators */}
      <div className="absolute bottom-6 left-6 z-50 flex flex-col gap-2">
        {/* Location Badge */}
        <div className="flex items-center gap-2 rounded-lg glass-dark px-3 py-2 text-xs font-semibold text-cyan-200 backdrop-blur-lg border border-slate-700/60 shadow-lg">
          <MapPin className="h-3.5 w-3.5" />
          <span>{region?.name || 'Bay of Bengal'}</span>
        </div>

        {/* Status Footer */}
        <div className="rounded-lg glass-dark px-3 py-2 text-xs font-semibold text-slate-200 backdrop-blur-lg border border-slate-700/60 shadow-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
          <span>Live Monitoring</span>
        </div>
      </div>

      {/* Risk Level Badge (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-50 rounded-lg glass-dark px-3 py-2 text-xs font-semibold backdrop-blur-lg border border-slate-700/60 shadow-lg">
        <div className="flex items-center gap-2">
          <div 
            className="h-3 w-3 rounded-full animate-pulse"
            style={{ backgroundColor: getRiskColor(evsScore) }}
          ></div>
          <span style={{ color: getRiskColor(evsScore) }} className="font-bold">
            {evsScore > 0.75 ? '🔴 CRITICAL' : evsScore > 0.5 ? '🟡 WARNING' : '🟢 STABLE'}
          </span>
        </div>
      </div>

      {showSubseaCloud && (
        <>
            {subseaCloudSites.map((site, idx) => (
              <Circle
                key={site.id}
                center={site.coords}
                radius={50000}
                pathOptions={{
                  color: site.status === 'active' ? '#7c3aed' : '#94a3b8',
                  fillColor: site.status === 'active' ? '#7c3aed' : '#94a3b8',
                  fillOpacity: 0.12,
                  weight: 2,
                  dashArray: '5, 10',
                  className: 'subsea-cloud-marker',
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
                style={{
                  animation: `sonar-pulse 4s ease-out infinite`,
                  animationDelay: `${idx * 0.8}s`,
                }}
              >
                <Tooltip direction="top" offset={[0, -10]} opacity={0.98}>
                  <div className="rounded-lg bg-slate-950/98 px-4 py-3 backdrop-blur-xl border border-slate-700/80 shadow-2xl">
                    <div className="text-sm font-bold text-indigo-200">{site.name}</div>
                    <div className="text-xs text-slate-300 mt-2 space-y-1">
                      <div>🔌 Status: <span className={site.status === 'active' ? 'text-emerald-400 font-semibold' : 'text-slate-400'}>{site.status === 'active' ? 'ACTIVE' : 'STANDBY'}</span></div>
                      <div>⚡ Latency: <span className="text-cyan-300 font-mono">{site.latency}</span></div>
                      <div>📍 Subsea deployment node for oceanographic data</div>
                    </div>
                  </div>
                </Tooltip>
              </Circle>
            ))}
          </>
        )}

      {/* Species Popup */}
      <SpeciesPopup
        species={selectedSpecies}
        onClose={() => setSelectedSpecies(null)}
      />
    </div>
  )
}

