"""
Molecular & Fisheries Insights for SIH25041
Mock implementations for eDNA analysis and otolith prediction.
"""

import random
from typing import Dict, List, Any

# Mock species database for eDNA analysis
MOCK_SPECIES_DB = [
    {"species": "Sardina pilchardus", "common_name": "European pilchard", "confidence": 0.85},
    {"species": "Thunnus thynnus", "common_name": "Atlantic bluefin tuna", "confidence": 0.72},
    {"species": "Scomber scombrus", "common_name": "Atlantic mackerel", "confidence": 0.91},
    {"species": "Clupea harengus", "common_name": "Atlantic herring", "confidence": 0.78},
    {"species": "Gadus morhua", "common_name": "Atlantic cod", "confidence": 0.65},
    {"species": "Pleuronectes platessa", "common_name": "European plaice", "confidence": 0.82},
    {"species": "Solea solea", "common_name": "Common sole", "confidence": 0.88},
    {"species": "Merluccius merluccius", "common_name": "European hake", "confidence": 0.74},
    {"species": "Trisopterus luscus", "common_name": "Pouting", "confidence": 0.69},
    {"species": "Pollachius pollachius", "common_name": "Pollack", "confidence": 0.76}
]

def analyze_edna_sample(sample_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock eDNA analysis based on simulated genomic sequencing.

    Args:
        sample_data: Sample metadata (location, volume, etc.)

    Returns:
        Analysis results with detected species and confidence scores
    """
    # Simulate detection based on sample characteristics
    base_detection_rate = 0.7
    if sample_data.get("volume_ml", 100) > 200:
        base_detection_rate += 0.1
    if sample_data.get("depth_m", 50) < 100:
        base_detection_rate += 0.05

    # Randomly select species based on detection rate
    detected_species = []
    for species in MOCK_SPECIES_DB:
        if random.random() < base_detection_rate:
            # Add some noise to confidence scores
            confidence = species["confidence"] + random.uniform(-0.1, 0.1)
            confidence = max(0.1, min(0.99, confidence))

            detected_species.append({
                "species": species["species"],
                "common_name": species["common_name"],
                "confidence": round(confidence, 2),
                "abundance_estimate": random.randint(1, 100)
            })

    # Sort by confidence
    detected_species.sort(key=lambda x: x["confidence"], reverse=True)

    return {
        "sample_id": sample_data.get("sample_id", "unknown"),
        "analysis_timestamp": "2024-03-17T12:00:00Z",
        "sequencing_method": "Illumina MiSeq",
        "total_reads": random.randint(100000, 500000),
        "detected_species": detected_species[:8],  # Limit to top 8
        "diversity_index": round(random.uniform(2.0, 4.5), 2),
        "processing_time_seconds": random.randint(300, 900)
    }

def predict_otolith_age(image_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Mock CNN-based otolith age prediction.

    Args:
        image_data: Image metadata and base64 data

    Returns:
        Prediction results with age, species, and confidence
    """
    # Mock CNN prediction results
    possible_species = ["Gadus morhua", "Melanogrammus aeglefinus", "Pollachius virens"]
    predicted_species = random.choice(possible_species)

    # Age prediction (fish age in years)
    base_age = random.gauss(5, 2)  # Normal distribution around 5 years
    predicted_age = max(1, min(15, round(base_age)))

    # Confidence score
    confidence = random.uniform(0.75, 0.95)

    # Additional metadata
    growth_zones = random.randint(3, 12)
    estimated_weight = predicted_age * random.uniform(0.8, 1.5)  # Rough weight estimate

    return {
        "prediction_id": f"otolith_{random.randint(1000, 9999)}",
        "model_version": "CNN-v2.1",
        "predicted_species": predicted_species,
        "predicted_age_years": predicted_age,
        "confidence_score": round(confidence, 3),
        "growth_zones_counted": growth_zones,
        "estimated_weight_kg": round(estimated_weight, 1),
        "processing_time_ms": random.randint(500, 2000),
        "image_quality_score": round(random.uniform(0.7, 0.95), 2)
    }