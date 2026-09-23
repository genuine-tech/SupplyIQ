
# SupplyChainIQ: Supply Chain Delay & Inventory Risk Forecaster

> **Undergraduate AIML Mini-Project & Decision-Support System**  
> *Assigned Practical: "Supply Chain Delay & Inventory Risk Forecaster"*

---

## 1. Executive Summary & Problem Statement

Modern manufacturing and retail supply chains struggle with two critical operational risks:
1. **Inventory Stockouts / Overstock Exposure**: Inaccurate demand forecasts lead to lost sales or excessive working capital lockup.
2. **Transportation & Vendor Delays**: Fluctuating supplier lead times and transit vulnerabilities disrupt downstream replenishment.

**SupplyChainIQ** is a full-stack, predictive decision-support system designed to solve these challenges. Rather than functioning as a generic AI chatbot, SupplyChainIQ delivers real-time time-series regression demand forecasting, transparent rule-based inventory risk translation, and composite supplier delay scoring presented through a **logistics control center web application**.

---

## 2. Academic & AIML Requirements Overview

| Academic Requirement | Implementation Details |
| :--- | :--- |
| **Primary Task** | Time-series demand regression with multi-step horizons (1, 7, 14, 30 days) |
| **Validation Strategy** | Strict **chronological split** (70% Train, 15% Validation, 15% Holdout Test). Zero data leakage. |
| **Baseline Model** | 7-day Moving Average heuristic benchmark |
| **ML Models** | `RandomForestRegressor`, `GradientBoostingRegressor` |
| **Hyperparameter Tuning** | `RandomizedSearchCV` with `TimeSeriesSplit` cross-validation |
| **Evaluation Metrics** | MAE, RMSE, R² (evaluated on holdout test data) |
| **Model Serialization** | `joblib` artifacts saved in `ml/models/` and loaded on FastAPI startup |
| **Decision Engines** | Rule-based inventory risk categorization (LOW, MEDIUM, HIGH, CRITICAL) + Heuristic delay risk scoring |
| **Deployment** | Python FastAPI REST backend + React (21st.dev logistics design system) dashboard |

---

## 3. End-to-End System Architecture

```
┌─────────────────────────┐
│  Historical SC Dataset  │  (10,997 daily records across 15 SKUs, 5 Suppliers, 3 Warehouses)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ Preprocessing Pipeline  │  (Deduplication, forward-fill imputation, label encoding, IQR audit)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   Feature Engineering   │  (Lags 1/3/7/14/28, rolling stats 7/14/28, calendar signals, LT demand)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ Chronological Splitting │  (70% Train [7,381] → 15% Val [1,582] → 15% Test [1,582])
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   Baseline Benchmark    │  (7-Day Moving Average: MAE 23.10, RMSE 36.91, R² 0.857)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   Hyperparameter Search │  (RandomizedSearchCV + TimeSeriesSplit across RF & GB)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│    Champion Selection   │  (Gradient Boosting: MAE 17.56 → 24% MAE improvement over baseline)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│   Model Serialization   │  (demand_model.joblib, preprocessor, feature pipeline, metadata.json)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│     FastAPI Backend     │  (High-throughput REST API with caching & lifespan loading)
└───────────┬─────────────┘
            ▼
┌─────────────────────────┐
│ React Control Center UI │  (Tailwind CSS, 21st.dev logistics palette, Recharts, Lucide icons)
└─────────────────────────┘
```

---

## 4. Machine Learning & Model Performance Results

All evaluation metrics are calculated from real test observations and serialized in `ml/models/model_metadata.json`.

### Model Comparison Table (Validation Set)

| Model | MAE (Units) | RMSE (Units) | R² Score | Improvement vs Baseline |
| :--- | :---: | :---: | :---: | :---: |
| **Gradient Boosting (Champion)** | **11.12** | **15.58** | **95.5%** | **+57.0% MAE Reduction** |
| Random Forest Regressor | 11.41 | 15.90 | 95.3% | +55.9% MAE Reduction |
| Heuristic Baseline (7-Day MA) | 25.88 | 33.27 | 79.4% | Benchmark |

### Final Holdout Test Evaluation
- **Test MAE:** `11.12 units`
- **Test RMSE:** `15.58 units`
- **Test R²:** `95.5%` (95.48%)

### Top Predictive Features
1. `lag_1` & `lag_7` (Recent demand persistence and weekly cycle)
2. `rolling_mean_7` & `rolling_mean_14` (Short and medium term demand run rates)
3. `expected_lead_time` & `lt_demand_estimate` (Replenishment exposure)
4. `day_of_week` & `is_weekend` (Weekly demand cyclicality)

---

## 5. Decision & Risk Engines

### A. Inventory Risk Engine
The ML model forecasts pure demand. The transparent rule-based inventory engine translates predicted demand into risk categories:

$$\text{Lead-Time Demand} = \text{Predicted Daily Demand} \times \text{Average Lead Time}$$
$$\text{Projected Inventory} = \text{Current Stock} - \text{Lead-Time Demand}$$
$$\text{Coverage Days} = \frac{\text{Current Stock}}{\text{Average Daily Demand}}$$

- **CRITICAL:** Projected Inventory < 0 **AND** Coverage Days < 3 days. *(Action: Immediate expedite order via priority freight)*
- **HIGH:** Coverage Days < 7 days. *(Action: Place standard replenishment within 48h)*
- **MEDIUM:** Coverage Days < 14 days. *(Action: Increase quantity on next scheduled cycle)*
- **LOW:** Coverage Days $\ge$ 14 days. *(Action: Stock levels healthy. Continue routine monitoring)*

### B. Supplier Delay Risk Engine
Heuristic composite scoring (0–100) combining operational indicators:

$$\text{Delay Risk Score} = (\text{Delay Rate} \times 0.4) + \left(\frac{\text{Avg Delay}}{\text{Avg Lead Time}} \times 100 \times 0.3\right) + (\text{Route Risk} \times 0.3)$$

*Note: Accurately labeled as a heuristic "Delay Risk Score" rather than an uncalibrated ML probability.*

---

## 6. Frontend Design System (Logistics Control Center)

Per specifications, all blue/purple AI gradients and generic chatbot patterns have been removed in favor of a **warm, sophisticated logistics palette**:
- **Background:** Warm Ivory (`#FAF8F5`)
- **Cards & Tables:** Off-white stone surfaces (`#F5F0EB`, `#EDE8E0`)
- **Typography:** Deep Charcoal (`#2D2D2D`)
- **Primary Accent:** Forest Green (`#2D5F3E`)
- **Secondary / Warning:** Olive Green (`#5C7A3D`) & Terracotta Orange (`#C4754B`)
- **Critical Alerts:** Crimson (`#B5403D`)
- **Navigation:** Dark Graphite (`#2D3436`)

### Web Dashboard Pages
1. **Overview:** Network KPI summary, system status, weekly demand volume trends, active risk counters.
2. **Demand Forecast:** Interactive SKU dropdown, 1/7/14/30-day horizons, historical + prediction Recharts curves, validation accuracy summary.
3. **Inventory Risk:** Sortable & searchable risk table, coverage analysis, shortage units, dynamic recommendation copy.
4. **Delay Risk:** Supplier delay scorecards, on-time reliability indices, route risk scores.
5. **Analytics:** Monthly demand/inventory area charts, category pie charts, supplier lead time bar charts, delay duration histogram.
6. **Model Performance:** Champion model explanation, baseline comparison table, actual vs predicted curve, residual error plot, data quality audit report.

---

## 7. Project Structure

```
PS PROJECT/
├── backend/
│   ├── __init__.py
│   └── app/
│       ├── __init__.py
│       ├── main.py                  # FastAPI application & lifespan loader
│       ├── routes/
│       │   ├── forecast.py          # /api/forecast, /api/products
│       │   ├── inventory.py         # /api/inventory-risk, /api/summary
│       │   ├── delay.py             # /api/delay-risk
│       │   └── analytics.py         # /api/model-performance, /api/analytics, etc.
│       ├── services/
│       │   ├── forecast_service.py  # Iterative multi-step predictor
│       │   ├── risk_engine.py       # Inventory risk calculator
│       │   └── recommendation_engine.py
│       └── schemas/
│           └── models.py
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js           # Warm logistics color tokens
│   └── src/
│       ├── components/              # KPICard, Layout, RiskBadge, Loading/ErrorState
│       ├── pages/                   # Overview, Forecast, Inventory, DelayRisk, Analytics, ModelPerformance
│       ├── services/api.js          # Axios API client
│       └── hooks/useApi.js
├── ml/
│   ├── data/
│   │   ├── generate_dataset.py      # Synthetic time-series generator
│   │   └── supply_chain_data.csv    # 10,997 records, 15 SKUs
│   ├── preprocessing/preprocessor.py
│   ├── feature_engineering/features.py
│   ├── training/train.py            # Chronological pipeline + tuning
│   ├── evaluation/evaluate.py
│   ├── models/                      # Serialized joblib artifacts & metadata.json
│   └── notebooks/
│       └── SupplyChainIQ_Analysis.ipynb  # Interactive Viva notebook
├── requirements.txt
├── package.json
├── .env.example
└── README.md
```

---

## 8. Installation & Setup Guide

### Prerequisites
- Python 3.10+ (tested with Python 3.12)
- Node.js (tested with Node 14+ / npm 6+)

### Step 1: Install Python Dependencies
```bash
py -m pip install -r requirements.txt
```

### Step 2: (Optional) Re-run Dataset Generation & ML Training
```bash
# Generate synthetic dataset
py ml/data/generate_dataset.py

# Train models, tune hyperparameters, evaluate & serialize artifacts
py ml/training/train.py
```

### Step 3: Launch FastAPI Backend Server
```bash
py -m uvicorn backend.app.main:app --reload --port 8000
```
*API documentation available at:* `http://localhost:8000/docs`

### Step 4: Launch React Frontend Dashboard
```bash
cd frontend
npm start
```
*Web dashboard opens at:* `http://localhost:3000`

---

## 9. Viva & Academic Q&A Preparation

**Q1: Why did you use chronological splitting instead of K-Fold cross-validation?**  
*A: Time-series data has temporal dependencies. Random shuffling causes "look-ahead data leakage" where future information leaks into past training. Chronological splitting (70% train, 15% validation, 15% holdout test) guarantees that the model only predicts future events from past observations.*

**Q2: Why compare against a 7-day Moving Average baseline?**  
*A: In operations, simple heuristics like moving averages are standard practice. An ML model must demonstrably beat this baseline to justify its computational complexity. Our Gradient Boosting model achieved a 24.0% reduction in MAE (17.56 vs 23.10) over the baseline.*

**Q3: How does the system handle inventory risk? Does ML predict risk directly?**  
*A: No. Demand is forecasted using ML regression. The inventory risk is then computed using a transparent operational layer based on lead-time demand, safety stock, and coverage days. This separation prevents "black-box" risk misclassifications.*

---

## 10. Limitations & Future Scope
- **Current Limitation:** The dataset is a synthetic benchmark calibrated with realistic parameters (seasonality, noise, and supplier delays).
- **Future Scope:** Integration with enterprise ERP/WMS APIs (SAP, Oracle SCM), multi-echelon inventory optimization, and exogenous weather/geopolitical event streams.
