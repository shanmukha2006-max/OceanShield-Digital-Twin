export const defaultRegions = [
  {
    id: 'arabian-sea',
    name: 'Arabian Sea Basin',
    coords: [21.5, 64.4],
    description: 'High shipping density with seasonal monsoon patterns.',
  },
  {
    id: 'bay-of-bengal',
    name: 'Bay of Bengal',
    coords: [14.0, 90.0],
    description: 'Warm waters supporting rich biodiversity and active fisheries.',
  },
  {
    id: 'lakshadweep',
    name: 'Lakshadweep Archipelago',
    coords: [11.5, 72.7],
    description: 'Fragile coral ecosystems with emerging tourism pressure.',
  },
]

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export function simulateRegionEvs(region, sliders) {
  // Simple heuristic model: EVS (0-1) increases with pollution + shipping + climate stress
  const base = 0.22 + region.id.length * 0.01
  const score = clamp(
    base + (sliders.pollution / 250) + (sliders.shipping / 320) + (sliders.climateStress / 380),
    0,
    1,
  )

  const heat = Math.round(20 + score * 60)
  const biodiversity = Math.round(55 + (1 - score) * 35)
  const alert = score > 0.7 ? 'High Risk' : score > 0.45 ? 'Elevated' : 'Stable'

  return { evs: score, heat, biodiversity, alert }
}

export function generateTrendData(evs) {
  const now = Date.now()
  const base = evs * 70
  return Array.from({ length: 30 }).map((_, idx) => {
    const date = new Date(now - (29 - idx) * 24 * 60 * 60 * 1000)
    const value = clamp(base + Math.sin(idx / 4) * 8 + Math.random() * 6 - 3, 0, 100)
    return {
      date: date.toISOString().slice(0, 10),
      value: Number(value.toFixed(1)),
    }
  })
}

export function generateCascadeData(evs) {
  const factors = ['Shipping', 'Pollution', 'Climate', 'Invasive Species', 'Acidification']
  return factors.map((label, idx) => {
    const value = clamp((evs + idx * 0.05) * 18 + Math.random() * 10, 0, 100)
    return { label, value: Number(value.toFixed(1)), id: `${label}-${idx}` }
  })
}

export function generateMockShapData(evs) {
  const drivers = ['Plastic', 'Noise', 'Temperature', 'Salinity', 'Fishing']
  return drivers.map((name, idx) => {
    const importance = clamp((1 - evs) * 30 + Math.random() * 20, 0, 100)
    return { name, importance: Number(importance.toFixed(1)), id: `${name}-${idx}` }
  })
}

export function generateMockNews() {
  return [
    {
      id: 'news-1',
      headline: 'Satellite detects anomalous algal bloom near Lakshadweep',
      time: '2m ago',
    },
    {
      id: 'news-2',
      headline: 'Automatic drifters report elevated microplastic levels',
      time: '12m ago',
    },
    {
      id: 'news-3',
      headline: 'New shipping corridor proposed to reduce pollution footprint',
      time: '30m ago',
    },
  ]
}

export const migrationRoutes = [
  {
    id: 'blue-whale',
    species: 'Blue Whale',
    status: 'Endangered',
    color: '#06b6d4', // Cyan
    coordinates: [
      [12.0, 72.0], // Lakshadweep
      [15.0, 75.0],
      [18.0, 78.0],
      [21.0, 81.0],
      [24.0, 84.0], // Arabian Sea
    ],
    threatAlert: 'High Bio-Acoustic Stress due to increased shipping traffic rerouting from the Red Sea.',
    aiInsight: 'Current shipping noise levels (62%) are disrupting whale communication patterns, potentially delaying migration by 15-20 days.',
  },
  {
    id: 'leatherback-turtle',
    species: 'Leatherback Sea Turtle',
    status: 'Vulnerable',
    color: '#10b981', // Emerald
    coordinates: [
      [8.0, 78.0], // Indian Ocean
      [10.0, 82.0],
      [12.0, 86.0],
      [14.0, 90.0],
      [16.0, 94.0], // Bay of Bengal
    ],
    threatAlert: 'Nesting grounds threatened by rising sea levels and coastal eutrophication.',
    aiInsight: 'Rising sea temperatures (25.2°C) are accelerating egg development, reducing hatchling survival rates by an estimated 30%.',
  },
  {
    id: 'yellowfin-tuna',
    species: 'Yellowfin Tuna',
    status: 'Near Threatened',
    color: '#8b5cf6', // Purple
    coordinates: [
      [18.0, -95.0], // Gulf of Mexico
      [20.0, -90.0],
      [22.0, -85.0],
      [24.0, -80.0],
      [26.0, -75.0], // Atlantic
    ],
    threatAlert: 'Migration route intersecting with expanding Hypoxic Dead Zone (Low Dissolved Oxygen).',
    aiInsight: 'Dissolved oxygen levels below 4.5 mg/L in migration corridors are forcing tuna to surface more frequently, increasing predation risk.',
  },
  {
    id: 'loggerhead-turtle',
    species: 'Loggerhead Sea Turtle',
    status: 'Endangered',
    color: '#ea580c', // Deep Orange
    coordinates: [
      [35.0, -5.0], // Atlantic near Morocco
      [37.0, 0.0],
      [39.0, 5.0],
      [41.0, 10.0],
      [43.0, 15.0], // Mediterranean Sea
    ],
    threatAlert: 'SST Shift Detected: Loggerhead thermal habitat is actively overlapping with commercial Swordfish longline fleets.',
    aiInsight: 'SST Shift Detected: Loggerhead thermal habitat is actively overlapping with commercial Swordfish longline fleets. High risk of accidental bycatch.',
  },
  {
    id: 'north-atlantic-right-whale',
    species: 'North Atlantic Right Whale',
    status: 'Critically Endangered',
    color: '#dc2626', // Red (will change to brighter red when stressed)
    coordinates: [
      [40.0, -70.0], // US East Coast
      [42.0, -65.0],
      [44.0, -60.0],
      [46.0, -55.0],
      [48.0, -50.0], // Canada
    ],
    threatAlert: 'Pod migration detected via acoustic telemetry.',
    aiInsight: 'Pod migration detected via acoustic telemetry. Initiating a \'Dynamic Marine Protected Area\' – temporary speed restrictions broadcasted to all AIS-equipped vessels in the sector.',
  },
  {
    id: 'sperm-whale',
    species: 'Sperm Whale',
    status: 'Vulnerable',
    color: '#2563eb', // Bright Blue
    coordinates: [
      [-35.0, 20.0], // Cape of Good Hope
      [-32.0, 25.0],
      [-29.0, 30.0],
      [-26.0, 35.0],
      [-23.0, 40.0], // Indian Ocean
    ],
    threatAlert: 'Warning: Rerouted global shipping traffic has elevated ambient bio-acoustic noise by 40%.',
    aiInsight: 'Warning: Rerouted global shipping traffic has elevated ambient bio-acoustic noise by 40%. Deep CNN audio analysis indicates severe masking of whale vocalizations and migration disorientation.',
  },
  {
    id: 'atlantic-mackerel',
    species: 'Atlantic Mackerel',
    status: 'In Decline',
    color: '#f59e0b', // Amber
    coordinates: [
      [48.0, -10.0], // Western Channel
      [50.0, -5.0],
      [52.0, 0.0],
      [54.0, 5.0],
      [56.0, 10.0], // North Sea
    ],
    threatAlert: '12-year eDNA time-series analysis confirms a rapid poleward migration of Mackerel stocks.',
    aiInsight: '12-year eDNA time-series analysis confirms a rapid poleward migration of Mackerel stocks due to a +1.5°C Sea Surface Temperature anomaly. Local artisanal fishery collapse predicted in 8 months.',
  },
  {
    id: 'largetooth-sawfish',
    species: 'Largetooth Sawfish',
    status: 'Critically Endangered',
    color: '#ec4899', // Neon Pink
    coordinates: [
      [-12.0, 135.0], // Gulf of Carpentaria
      [-10.0, 138.0],
      [-8.0, 141.0],
      [-6.0, 144.0],
      [-4.0, 147.0], // Australia
    ],
    threatAlert: 'Satellite tagging telemetry indicates coastal migration paths are intersecting with severe agricultural nutrient runoff.',
    aiInsight: 'Satellite tagging telemetry indicates coastal migration paths are intersecting with severe agricultural nutrient runoff, increasing the risk of Hypoxic Dead Zone exposure.',
  },
]
