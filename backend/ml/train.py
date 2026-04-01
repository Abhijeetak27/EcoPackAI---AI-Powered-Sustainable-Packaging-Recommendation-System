"""
Trains a LinearRegression model to predict CO₂ and cost for a material
given product + shipping inputs.

Training data is synthetically generated from the deterministic scoring
formula. This gives the model data-derived coefficients that can later
be tuned with real user feedback data.

Usage:
    python backend/ml/train.py
Outputs:
    backend/ml/model.pkl  (joblib-serialized dict of two models)
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

import numpy as np
import joblib
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

# ── Synthetic data generation ─────────────────────────────────────────────────

np.random.seed(42)
N = 5000

weight      = np.random.uniform(0.1, 20.0, N)
volume      = np.random.uniform(0.1, 50.0, N)
dist_factor = np.random.choice([0.8, 1.0, 1.3, 1.6], N)
co2_base    = np.random.uniform(0.08, 0.85, N)
cost_base   = np.random.uniform(5.0, 40.0, N)

# Ground-truth formulas (mirrors the frontend scoring engine)
true_co2  = co2_base * weight * dist_factor * (1 + volume * 0.01) + np.random.normal(0, 0.005, N)
true_cost = cost_base * (1 + volume * 0.05) * (1 + weight * 0.02) + np.random.normal(0, 0.2, N)

X = np.column_stack([weight, volume, dist_factor, co2_base, cost_base])

# ── Train CO₂ model ───────────────────────────────────────────────────────────

X_tr, X_te, y_tr, y_te = train_test_split(X, true_co2, test_size=0.2, random_state=42)
co2_model = LinearRegression().fit(X_tr, y_tr)
co2_mae = mean_absolute_error(y_te, co2_model.predict(X_te))
print(f"CO₂ model MAE: {co2_mae:.4f} kg")

# ── Train cost model ──────────────────────────────────────────────────────────

X_tr, X_te, y_tr, y_te = train_test_split(X, true_cost, test_size=0.2, random_state=42)
cost_model = LinearRegression().fit(X_tr, y_tr)
cost_mae = mean_absolute_error(y_te, cost_model.predict(X_te))
print(f"Cost model MAE: ₹{cost_mae:.2f}")

# ── Save ──────────────────────────────────────────────────────────────────────

out_path = os.path.join(os.path.dirname(__file__), "model.pkl")
joblib.dump({"co2": co2_model, "cost": cost_model}, out_path)
print(f"Model saved → {out_path}")
