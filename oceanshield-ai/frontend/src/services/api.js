import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Backend server is not running. Please start the FastAPI server.')
    }
    throw error
  }
)

export const simulationAPI = {
  /**
   * Run EVS simulation with current parameters
   * @param {Object} params - Simulation parameters
   * @param {number} params.pollution - Pollution level (0-100)
   * @param {number} params.shipping - Shipping density (0-100)
   * @param {number} params.climate_stress - Climate stress (0-100)
   * @param {number} [params.kinetic_threat=0] - Kinetic threat level (0-100)
   * @param {number} [params.temperature=25.0] - Sea surface temperature (°C)
   * @param {number} [params.ph=8.1] - pH level
   * @param {number} [params.dissolved_oxygen=9.0] - Dissolved oxygen (mg/L)
   * @returns {Promise<Object>} Simulation results
   */
  async runSimulation(params) {
    const response = await api.post('/simulate', params)
    return response.data
  },
}

export const copilotAPI = {
  /**
   * Generate AI copilot report
   * @param {string} mode - Report mode ("Scientist", "Policy", "Fisherman")
   * @param {number} evsScore - Current EVS score
   * @param {Array} activeCascades - Active cascade scenarios
   * @param {Object} currentParams - Current environmental parameters
   * @returns {Promise<Object>} Report data
   */
  async generateReport(mode, evsScore, activeCascades, currentParams) {
    const response = await api.post('/report', {
      mode,
      evs_score: evsScore,
      active_cascades: activeCascades,
      current_params: currentParams,
    })
    return response.data
  },
}

export const molecularAPI = {
  /**
   * Analyze eDNA sample
   * @param {Object} sampleData - Sample information
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeEDNA(sampleData) {
    const response = await api.post('/edna-analyze', sampleData)
    return response.data
  },

  /**
   * Predict fish age/species from otolith image
   * @param {Object} imageData - Image data and metadata
   * @returns {Promise<Object>} Prediction results
   */
  async predictOtolith(imageData) {
    const response = await api.post('/otolith-predict', imageData)
    return response.data
  },
}

export const healthAPI = {
  /**
   * Check backend health
   * @returns {Promise<Object>} Health status
   */
  async checkHealth() {
    const response = await api.get('/health')
    return response.data
  },
}

export const lakehouseAPI = {
  /**
   * Query the serverless lakehouse
   * @param {string} query - SQL query
   * @param {Array} filters - Optional filters
   * @returns {Promise<Object>} Query results
   */
  async queryLakehouse(query, filters = []) {
    const response = await api.post('/lakehouse/query', { query, filters })
    return response.data
  },

  /**
   * Ingest data into lakehouse
   * @param {Object} data - Data to ingest
   * @returns {Promise<Object>} Ingest status
   */
  async ingestData(data) {
    const response = await api.post('/lakehouse/ingest', data)
    return response.data
  },
}

export const semanticAPI = {
  /**
   * Query semantic layer (OBDA virtual graph)
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Semantic query results
   */
  async querySemantic(params) {
    const response = await api.post('/semantic', params)
    return response.data
  },
}

export const edgeAPI = {
  /**
   * Run edge anomaly detection
   * @param {Object} sensorData - Sensor data for anomaly detection
   * @returns {Promise<Object>} Anomaly detection results
   */
  async detectAnomalies(sensorData) {
    const response = await api.post('/edge/anomaly', sensorData)
    return response.data
  },
}

export const mlDAAPI = {
  /**
   * Predict deep nitrate levels
   * @param {Object} params - Environmental parameters
   * @returns {Promise<Object>} Nitrate prediction results
   */
  async predictDeepNitrate(params) {
    const response = await api.post('/predict/deep-nitrate', params)
    return response.data
  },
}

export default api