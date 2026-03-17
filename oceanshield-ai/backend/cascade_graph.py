"""
Cascade Graph: Rule-based system linking environmental inputs to consequences.
Includes geopolitical and environmental scenarios for SIH25041.
"""

from typing import Dict, List, Any

# Define the cascade graph as a dictionary of triggers and their consequences
CASCADE_GRAPH = {
    "kinetic_threat_high": {
        "trigger": "Kinetic/War Threat slider > 70",
        "consequences": [
            {
                "stage": 1,
                "description": "Red Sea shipping reroute activated",
                "impact": "35% Carbon Penalty Spike",
                "severity": "high"
            },
            {
                "stage": 2,
                "description": "Bio-acoustic noise pollution in new routes",
                "impact": "Increased underwater noise levels",
                "severity": "medium"
            },
            {
                "stage": 3,
                "description": "Whale migration disruption",
                "impact": "Marine mammal population stress",
                "severity": "high"
            }
        ]
    },
    "water_energy_critical": {
        "trigger": "Pollution/Kinetic threat critical (>80)",
        "consequences": [
            {
                "stage": 1,
                "description": "Oil/Chemical spill detected",
                "impact": "Immediate environmental contamination",
                "severity": "critical"
            },
            {
                "stage": 2,
                "description": "Spill drift towards Desalination Plant",
                "impact": "Water treatment facility at risk",
                "severity": "high"
            },
            {
                "stage": 3,
                "description": "7-day warning until coastal water supply failure",
                "impact": "Critical infrastructure threat",
                "severity": "critical"
            }
        ]
    },
    "climate_crisis": {
        "trigger": "SST high (>28°C) + Pollution high (>60)",
        "consequences": [
            {
                "stage": 1,
                "description": "Harmful Algal Bloom (HAB) formation",
                "impact": "Toxic algae proliferation",
                "severity": "high"
            },
            {
                "stage": 2,
                "description": "Hypoxic Dead Zone development",
                "impact": "Oxygen depletion in water column",
                "severity": "critical"
            },
            {
                "stage": 3,
                "description": "Mass benthic mortality",
                "impact": "Bottom-dwelling organism die-off",
                "severity": "high"
            },
            {
                "stage": 4,
                "description": "Fishery collapse",
                "impact": "Commercial fishing industry disruption",
                "severity": "critical"
            }
        ]
    }
}

def evaluate_cascades(kinetic_threat: int, pollution: int, temperature: float) -> List[Dict[str, Any]]:
    """
    Evaluate which cascades are triggered based on current parameters.

    Args:
        kinetic_threat: Kinetic threat level (0-100)
        pollution: Pollution index (0-100)
        temperature: Sea surface temperature (°C)

    Returns:
        List of triggered cascade scenarios
    """
    triggered_cascades = []

    # Check kinetic threat cascade
    if kinetic_threat > 70:
        triggered_cascades.append(CASCADE_GRAPH["kinetic_threat_high"])

    # Check water-energy nexus cascade
    if pollution > 80 or kinetic_threat > 80:
        triggered_cascades.append(CASCADE_GRAPH["water_energy_critical"])

    # Check climate crisis cascade
    if temperature > 28 and pollution > 60:
        triggered_cascades.append(CASCADE_GRAPH["climate_crisis"])

    return triggered_cascades

def get_cascade_summary(cascades: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Generate a summary of active cascades for frontend display.

    Args:
        cascades: List of triggered cascade scenarios

    Returns:
        Summary dictionary with cascade data
    """
    if not cascades:
        return {
            "active_cascades": 0,
            "highest_severity": "none",
            "cascade_data": []
        }

    # Flatten consequences for summary
    all_consequences = []
    severities = []

    for cascade in cascades:
        for consequence in cascade["consequences"]:
            all_consequences.append({
                "trigger": cascade["trigger"],
                "stage": consequence["stage"],
                "description": consequence["description"],
                "impact": consequence["impact"],
                "severity": consequence["severity"]
            })
            severities.append(consequence["severity"])

    # Determine highest severity
    severity_levels = {"low": 1, "medium": 2, "high": 3, "critical": 4}
    highest_severity = max(severities, key=lambda x: severity_levels.get(x, 0))

    return {
        "active_cascades": len(cascades),
        "highest_severity": highest_severity,
        "cascade_data": all_consequences
    }