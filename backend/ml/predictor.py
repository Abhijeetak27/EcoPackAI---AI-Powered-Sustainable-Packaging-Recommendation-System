"""
Loads the trained model.pkl and exposes a predict_scores() function.
Falls back to the deterministic formula if model.pkl does not exist yet.
"""

import os
import numpy as np

_MODEL = None
_MODEL_PATH = os.path.join(os.path.dirname(__file__), "model.pkl")


def _load():
    global _MODEL
    if _MODEL is None and os.path.exists(_MODEL_PATH):
        import joblib
        _MODEL = joblib.load(_MODEL_PATH)
    return _MODEL


def predict_scores(
    weight: float,
    volume: float,
    dist_factor: float,
    co2_base: float,
    cost_base: float,
) -> tuple[float, float]:
    """Returns (predicted_co2, predicted_cost)."""
    model = _load()
    X = np.array([[weight, volume, dist_factor, co2_base, cost_base]])

    if model:
        co2 = float(model["co2"].predict(X)[0])
        cost = float(model["cost"].predict(X)[0])
    else:
        # Deterministic fallback (mirrors frontend formula)
        co2 = co2_base * weight * dist_factor * (1 + volume * 0.01)
        cost = cost_base * (1 + volume * 0.05) * (1 + weight * 0.02)

    return max(0.0, co2), max(0.0, cost)
