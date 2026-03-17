"""
OceanShield AI FastAPI Backend
Main application with EVS calculation, cascade analysis, and AI copilot.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Any, Optional
import uvicorn

# Import our custom modules
from evs_calculator import calculate_evs, get_evs_category
from cascade_graph import evaluate_cascades, get_cascade_summary
from ai_copilot import generate_copilot_report
from molecular_insights import analyze_edna_sample, predict_otolith_age

# Serverless Lakehouse / Semantic layer mocks
from lakehouse import ingest_record, query_by_tag, query_all
from semantic_layer import to_virtual_graph
from edge_simulator import detect_anomaly
from ml_da import predict_deep_sea_nitrate

# Create FastAPI app
app = FastAPI(
    title="OceanShield AI API",
    description="SIH25041 Ocean Ecosystem Monitoring and Prediction System",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request/response validation
class SimulationRequest(BaseModel):
    pollution: int
    shipping: int
    climate_stress: int
    kinetic_threat: Optional[int] = 0
    temperature: Optional[float] = 25.0
    ph: Optional[float] = 8.1
    dissolved_oxygen: Optional[float] = 9.0

class SimulationResponse(BaseModel):
    evs_score: float
    evs_category: str
    heat_index: float
    biodiversity_score: float
    cascade_summary: Dict[str, Any]
    trend_data: List[Dict[str, Any]]
    shap_data: List[Dict[str, Any]]

class LakehouseIngest(BaseModel):
    source: str
    payload: Dict[str, Any]
    tags: Dict[str, str]

class SemanticRequest(BaseModel):
    payload: Dict[str, Any]

class EdgePayload(BaseModel):
    payload: Dict[str, Any]

class DeepPredictionRequest(BaseModel):
    surface_observations: Dict[str, Any]

class CopilotRequest(BaseModel):
    mode: str  # "Scientist", "Policy", or "Fisherman"
    evs_score: float
    active_cascades: List[Dict[str, Any]]
    current_params: Dict[str, Any]

class EDNASample(BaseModel):
    sample_id: str
    volume_ml: Optional[int] = 100
    depth_m: Optional[int] = 50
    location: Optional[str] = "Unknown"

class OtolithImage(BaseModel):
    image_data: str  # base64 encoded image
    metadata: Optional[Dict[str, Any]] = {}

@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "OceanShield AI Backend"}

@app.post("/api/simulate", response_model=SimulationResponse)
async def simulate_scenario(request: SimulationRequest):
    """
    Run EVS simulation based on environmental parameters.
    Returns updated scores, cascade analysis, and visualization data.
    """
    try:
        # Calculate EVS score
        evs_score = calculate_evs(
            temperature=request.temperature,
            ph=request.ph,
            dissolved_oxygen=request.dissolved_oxygen,
            pollution_index=request.pollution
        )

        evs_category = get_evs_category(evs_score)

        # Calculate derived metrics
        heat_index = 20 + evs_score * 0.6  # Rough heat index calculation
        biodiversity_score = 90 - evs_score * 0.7  # Inverse relationship

        # Evaluate cascade threats
        cascades = evaluate_cascades(
            kinetic_threat=request.kinetic_threat,
            pollution=request.pollution,
            temperature=request.temperature
        )
        cascade_summary = get_cascade_summary(cascades)

        # Generate mock trend data (30 days)
        trend_data = []
        base_value = evs_score
        for i in range(30):
            date = f"2024-03-{str(17-i).zfill(2)}"
            value = max(0, min(100, base_value + (i-15) * 0.5 + (i % 7 - 3) * 2))
            trend_data.append({"date": date, "value": round(value, 1)})

        # Generate mock SHAP data
        shap_factors = [
            {"name": "Pollution", "importance": request.pollution / 100 * 80},
            {"name": "Shipping", "importance": request.shipping / 100 * 60},
            {"name": "Climate Stress", "importance": request.climate_stress / 100 * 70},
            {"name": "Temperature", "importance": (request.temperature - 20) / 10 * 50},
            {"name": "Kinetic Threat", "importance": request.kinetic_threat / 100 * 90}
        ]
        shap_data = [
            {"name": factor["name"], "importance": round(factor["importance"], 1)}
            for factor in shap_factors
        ]

        return SimulationResponse(
            evs_score=round(evs_score, 2),
            evs_category=evs_category,
            heat_index=round(heat_index, 1),
            biodiversity_score=round(biodiversity_score, 1),
            cascade_summary=cascade_summary,
            trend_data=trend_data,
            shap_data=shap_data
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Simulation error: {str(e)}")

@app.post("/api/report")
async def generate_report(request: CopilotRequest):
    """Generate AI copilot report based on current system state."""
    try:
        report = generate_copilot_report(
            mode=request.mode,
            evs_score=request.evs_score,
            active_cascades=request.active_cascades,
            current_params=request.current_params
        )
        return {"report": report, "mode": request.mode, "timestamp": "2024-03-17T12:00:00Z"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Report generation error: {str(e)}")

@app.post("/api/lakehouse/ingest")
async def lakehouse_ingest(record: LakehouseIngest):
    """Ingest a record into the simulated serverless lakehouse."""
    try:
        stored = ingest_record(record.source, record.payload, record.tags)
        return {"status": "ingested", "record": stored}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lakehouse ingest error: {str(e)}")

@app.post("/api/lakehouse/query")
async def lakehouse_query(request: SemanticRequest):
    """Query the simulated lakehouse by tags."""
    try:
        tag = request.payload.get("tag", "")
        value = request.payload.get("value", "")
        if tag:
            results = query_by_tag(tag, value)
        else:
            results = query_all()
        return {"count": len(results), "results": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Lakehouse query error: {str(e)}")


@app.post("/api/semantic")
async def semantic_transform(request: SemanticRequest):
    """Return a virtual knowledge graph fragment for a given payload."""
    try:
        graph = to_virtual_graph(request.payload)
        return {"graph": graph}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Semantic layer error: {str(e)}")

@app.post("/api/edge/anomaly")
async def edge_anomaly(payload: EdgePayload):
    """Simulate edge node anomaly detection and flagging."""
    try:
        alert = detect_anomaly(payload.payload)
        return {"edge": alert}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Edge processing error: {str(e)}")

@app.post("/api/predict/deep-nitrate")
async def predict_deep_nitrate(request: DeepPredictionRequest):
    """Predict deep-sea nitrate levels from surface observations."""
    try:
        prediction = predict_deep_sea_nitrate(request.surface_observations)
        return {"prediction": prediction}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/api/edna-analyze")
async def edna_analysis(sample: EDNASample):
    """Analyze eDNA sample for marine species detection."""
    try:
        result = analyze_edna_sample(sample.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"eDNA analysis error: {str(e)}")

@app.post("/api/otolith-predict")
async def otolith_prediction(image: OtolithImage):
    """Predict fish age and species from otolith image."""
    try:
        result = predict_otolith_age(image.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Otolith prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)