"""Hybrid ML Data Assimilation (ML-DA) Mock

This module simulates a lightweight ML model that uses surface data
(such as Chlorophyll-a from satellites) to predict unobserved deep-sea
variables like nitrate concentration in the hypolimnion.
"""

from typing import Dict, Any


def predict_deep_sea_nitrate(surface_observations: Dict[str, Any]) -> Dict[str, Any]:
    """Mock prediction of deep-sea nitrate based on surface observations."""
    # Simplified pseudo-ML formula for demonstration
    chl = surface_observations.get("chlorophyll", 2.0)
    sst = surface_observations.get("temperature", 24.0)
    turbidity = surface_observations.get("turbidity", 5.0)

    # Assume higher chl indicates upwelling, which increases nitrate deeper
    base_nitrate = 1.0 + chl * 0.8

    # Warmer SST tends to lower deep nitrate due to stratification
    temp_factor = max(0.5, 1.2 - (sst - 20) * 0.03)

    # Turbidity indicates mixing (positive) but also pollutants (negative)
    turb_factor = 1 + min(0.3, turbidity / 50)

    nitrate = base_nitrate * temp_factor * turb_factor

    return {
        "predicted_deep_nitrate_mg_per_l": round(nitrate, 2),
        "model_version": "ml-da-v1",
        "explanation": (
            "Surface chlorophyll and temperature used to estimate deep-sea nitrate levels "
            "via an ensemble assimilation model."
        ),
    }
