"""Edge Computing Simulator

This module simulates edge node processing for near-zero latency alerting.
When an anomaly is detected at the edge, it is flagged and then sent upstream.
"""

from typing import Dict, Any


def detect_anomaly(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze a payload and return an anomaly report if thresholds are exceeded."""
    alerts = []

    # Example: abrupt pH drop
    ph = payload.get("ph")
    if ph is not None and ph < 7.4:
        alerts.append({
            "type": "pH_drop",
            "message": "Rapid pH drop detected; possible acidification event.",
            "value": ph,
            "severity": "high",
        })

    # Example: oil spill proxy via turbidity spikes
    turbidity = payload.get("turbidity")
    if turbidity is not None and turbidity > 15:
        alerts.append({
            "type": "turbidity_spike",
            "message": "Turbidity spike suggests possible oil/chemical spill.",
            "value": turbidity,
            "severity": "critical",
        })

    # Example: sudden chlorophyll jump as proxy for algal bloom
    chl = payload.get("chlorophyll")
    if chl is not None and chl > 12:
        alerts.append({
            "type": "algal_bloom",
            "message": "Chlorophyll spike indicates potential harmful algal bloom.",
            "value": chl,
            "severity": "medium",
        })

    return {
        "anomalies": alerts,
        "edge_latency_ms": 5,  # simulated near-zero
        "processed_at": payload.get("timestamp"),
    }
