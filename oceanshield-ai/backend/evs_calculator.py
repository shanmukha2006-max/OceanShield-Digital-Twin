"""
EVS (Ecosystem Vulnerability Score) Calculator
Calculates 0-100 EVS score based on environmental parameters with compound stress penalty.
"""

def calculate_evs(temperature: float, ph: float, dissolved_oxygen: float, pollution_index: float) -> float:
    """
    Calculate EVS score from raw environmental data.

    Args:
        temperature: Sea surface temperature in Celsius
        ph: pH level
        dissolved_oxygen: Dissolved oxygen in mg/L
        pollution_index: Pollution index (0-100)

    Returns:
        EVS score (0-100)
    """
    # Define normal ranges (these are example values; adjust based on domain knowledge)
    normal_ranges = {
        'temperature': (15, 30),  # Normal SST range
        'ph': (7.8, 8.4),         # Normal ocean pH
        'dissolved_oxygen': (6, 12),  # Normal DO range
        'pollution_index': (0, 20)   # Low pollution threshold
    }

    # Calculate anomaly scores for each parameter (0-1 scale)
    anomalies = []
    anomaly_count = 0

    # Temperature anomaly
    if temperature < normal_ranges['temperature'][0] or temperature > normal_ranges['temperature'][1]:
        temp_anomaly = min(abs(temperature - 22.5) / 10, 1)  # 22.5 is midpoint
        anomalies.append(temp_anomaly)
        anomaly_count += 1
    else:
        anomalies.append(0)

    # pH anomaly
    if ph < normal_ranges['ph'][0] or ph > normal_ranges['ph'][1]:
        ph_anomaly = min(abs(ph - 8.1) / 0.5, 1)  # 8.1 is midpoint
        anomalies.append(ph_anomaly)
        anomaly_count += 1
    else:
        anomalies.append(0)

    # Dissolved oxygen anomaly
    if dissolved_oxygen < normal_ranges['dissolved_oxygen'][0] or dissolved_oxygen > normal_ranges['dissolved_oxygen'][1]:
        do_anomaly = min(abs(dissolved_oxygen - 9) / 3, 1)  # 9 is midpoint
        anomalies.append(do_anomaly)
        anomaly_count += 1
    else:
        anomalies.append(0)

    # Pollution anomaly
    if pollution_index > normal_ranges['pollution_index'][1]:
        poll_anomaly = min(pollution_index / 100, 1)
        anomalies.append(poll_anomaly)
        anomaly_count += 1
    else:
        anomalies.append(0)

    # Base EVS score (weighted average of anomalies)
    weights = [0.3, 0.25, 0.25, 0.2]  # Temperature, pH, DO, Pollution
    base_evs = sum(a * w for a, w in zip(anomalies, weights)) * 100

    # Compound Stress Penalty: If 3 or more variables are anomalous, apply 25% penalty
    if anomaly_count >= 3:
        base_evs *= 0.75

    # Ensure score is between 0-100
    return max(0, min(100, base_evs))

def get_evs_category(evs_score: float) -> str:
    """Get EVS category based on score."""
    if evs_score < 25:
        return "Low Risk"
    elif evs_score < 50:
        return "Moderate Risk"
    elif evs_score < 75:
        return "High Risk"
    else:
        return "Critical Risk"