"""Semantic Layer / OBDA Mock

This module simulates a semantic transformation layer that maps incoming
sensor/satellite data into standard vocabularies (Darwin Core, SWEET).
It is designed to be used as the "virtual knowledge graph" for FAIR compliance.
"""

from typing import Any, Dict


def map_to_dwc(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Map raw observation to a simplified Darwin Core-like model."""
    return {
        "dwc:eventDate": raw.get("timestamp"),
        "dwc:country": raw.get("location", {}).get("country"),
        "dwc:decimalLatitude": raw.get("location", {}).get("lat"),
        "dwc:decimalLongitude": raw.get("location", {}).get("lon"),
        "dwc:scientificName": raw.get("species", "Unknown"),
        "dwc:dynamicProperties": raw.get("properties", {}),
    }


def map_to_sweet(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Map raw physical measurements into a SWEET ontology description."""
    return {
        "sweet:hasMeasurement": {
            "sweet:hasPhenomenon": "sweet:SeaSurfaceTemperature",
            "sweet:hasValue": raw.get("temperature"),
            "sweet:hasUnit": "degreeCelsius",
        },
        "sweet:hasMeasurement2": {
            "sweet:hasPhenomenon": "sweet:Salinity",
            "sweet:hasValue": raw.get("salinity"),
            "sweet:hasUnit": "PSU",
        },
        "sweet:hasMeasurement3": {
            "sweet:hasPhenomenon": "sweet:DissolvedOxygen",
            "sweet:hasValue": raw.get("dissolved_oxygen"),
            "sweet:hasUnit": "mg/L",
        },
    }


def to_virtual_graph(raw: Dict[str, Any]) -> Dict[str, Any]:
    """Create a virtual knowledge graph fragment for an incoming payload."""
    return {
        "dwc": map_to_dwc(raw),
        "sweet": map_to_sweet(raw),
        "meta": {
            "uuid": raw.get("id"),
            "ingested_at": raw.get("timestamp"),
        },
    }
