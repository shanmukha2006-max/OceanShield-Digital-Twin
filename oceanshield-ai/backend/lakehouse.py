"""Simulated Serverless Lakehouse (S3 + Athena-like query sandbox).

This module provides a lightweight in-memory representation of a data lake.
It exposes ingestion APIs that mimic serverless streams writing to S3, and
allows querying by tag/partition to simulate querying through a virtual
semantic layer.

The goal is to mirror the data flow of:
- Satellite/sensor ingestion -> S3 (object store)
- Serverless function tagging/normalization (Lambda / Glue)
- Query access via virtualized schema (Athena/Glue Catalog)
"""

from datetime import datetime
from typing import Any, Dict, List

# In-memory storage: list of ingested objects
L1_STORE: List[Dict[str, Any]] = []


def ingest_record(source: str, payload: Dict[str, Any], tags: Dict[str, str]) -> Dict[str, Any]:
    """Simulate ingesting a record into the lakehouse.

    Args:
        source: Source system name (satellite, sensor, edge)
        payload: Raw payload data
        tags: Metadata tags for partitioning/indexing

    Returns:
        Record metadata confirming insertion.
    """
    record = {
        "id": f"rec_{len(L1_STORE) + 1}",
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "source": source,
        "tags": tags,
        "payload": payload,
    }
    L1_STORE.append(record)
    return record


def query_by_tag(key: str, value: str) -> List[Dict[str, Any]]:
    """Query the lakehouse store by a single tag key/value match."""
    return [rec for rec in L1_STORE if rec.get("tags", {}).get(key) == value]


def query_all() -> List[Dict[str, Any]]:
    """Return all stored records."""
    return list(L1_STORE)
