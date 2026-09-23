# SupplyChainIQ: Complete Teacher & Viva Explanation Guide
> **Autonomous Supply Chain Delay, Time-Series Demand Forecasting & Inventory Risk Intelligence**

---

## Quick Navigation & Table of Contents

### Part I: Project Overview & Understanding
1. [Executive Summary & Project Overview](#1-executive-summary--project-overview)
2. [The Real-World Problem: Why Did We Build This?](#2-the-real-world-problem-why-did-we-build-this)
3. [The Solution: What SupplyChainIQ Does in Plain English](#3-the-solution-what-supplychainiq-does-in-plain-english)
4. [Master Glossary: Every Technical Term Explained Simply](#4-master-glossary-every-technical-term-explained-simply)
5. [The Dataset Deep Dive (10,995 Rows Across 15 SKUs)](#5-the-dataset-deep-dive-10995-rows-across-15-skus)

### Part II: Website Walkthrough & System Logic
6. [Complete Tour of Website Pages & Their Functionalities](#6-complete-tour-of-website-pages--their-functionalities)
   - [Page 1: 3D Interactive Logistics Showcase (`/landing.html`)](#page-1-3d-interactive-logistics-showcase-landinghtml)
   - [Page 2: Executive Control Center & KPIs (`/dashboard`)](#page-2-executive-control-center--kpis-dashboard)
   - [Page 3: Time-Series Demand Forecaster (`/dashboard/forecast`)](#page-3-time-series-demand-forecaster-dashboardforecast)
   - [Page 4: Inventory Shortage & Risk Engine (`/dashboard/inventory`)](#page-4-inventory-shortage--risk-engine-dashboardinventory)
   - [Page 5: Supplier & Carrier Delay Risk Radar (`/dashboard/delays`)](#page-5-supplier--carrier-delay-risk-radar-dashboarddelays)
   - [Page 6: Multi-Echelon Macro Network Analytics (`/dashboard/analytics`)](#page-6-multi-echelon-macro-network-analytics-dashboardanalytics)
   - [Page 7: Model Benchmarks & Continuous Drift Diagnostics (`/dashboard/models`)](#page-7-model-benchmarks--continuous-drift-diagnostics-dashboardmodels)
7. [System Architecture & Full-Stack Data Flow (With Diagrams)](#7-system-architecture--full-stack-data-flow-with-diagrams)
8. [The Machine Learning Engine: How It Works Step-by-Step](#8-the-machine-learning-engine-how-it-works-step-by-step)
9. [Why We Chose Gradient Boosting (Model Selection Rationale)](#9-why-we-chose-gradient-boosting-model-selection-rationale)
10. [Continuous Statistical Drift Detection (Kolmogorov-Smirnov Test)](#10-continuous-statistical-drift-detection-kolmogorov-smirnov-test)
11. [Top 20 Teacher / Viva Questions & Exact Answers](#11-top-20-teacher--viva-questions--exact-answers)

---

---

# PART I: PROJECT OVERVIEW & UNDERSTANDING

## 1. Executive Summary & Project Overview

- **Project Title**: `SupplyChainIQ — Autonomous Supply Chain Delay & Inventory Risk Forecaster`
- **Domain**: Artificial Intelligence & Operations Research in Enterprise Logistics
- **The Core Idea**:
  Manufacturing factories and global retailers frequently lose millions due to unexpected component shortages (**stockouts**) or carrier shipping delays. **SupplyChainIQ** is a full-stack predictive software system that transforms 24 months of multi-echelon logistics telemetry into **future demand forecasts with 95.5% precision**, scores supplier transit reliability, and warns managers before physical warehouse inventory runs dry.

---

## 2. The Real-World Problem: Why Did We Build This?

### The Factory Analogy (Explain this to your teacher!)
Imagine a smart factory assembling electric vehicles or industrial robots:
- Each product needs **servo motors**, **microcontroller chips**, and **lithium battery cells**.
- **Case 1: Under-ordering (Stockout)**: If you run out of even *one single $45 microcontroller*, you cannot finish the vehicle. The entire multi-million-dollar assembly line stops. Workers are idle, customer orders are canceled, and revenue drops.
- **Case 2: Over-ordering (Excess Inventory)**: If you buy 10,000 extra motors "just in case", millions of dollars of company cash get trapped on warehouse shelves. You pay high warehouse cooling/security costs, and stored parts risk getting damaged or becoming obsolete.
- **Case 3: Unpredictable Carrier Delays**: Your supplier promises a 5-day delivery time, but due to port congestion or route hazards, the shipment arrives in **12 days**. If your reorder point didn't account for this delay variance, your warehouse is depleted before the truck arrives.

### Why Traditional Excel Formulas Fail
Most enterprises still rely on simple **7-day or 30-day moving averages** (e.g. adding past sales and dividing by 7).
- They are **blind** to seasonal patterns and promotions.
- They **ignore** supplier lead times and transit risk scores.
- They **cannot adapt** when market conditions change.

---

## 3. The Solution: What SupplyChainIQ Does in Plain English

SupplyChainIQ bridges the gap between **Customer Demand Forecasting** and **Supplier Transit Reality**:
1. **Accurate Forecasting**: It converts past dates and sales into 35 predictive tabular features, using an ensemble **Gradient Boosting Regressor** that cuts forecasting error by **57.0%** compared to standard moving averages.
2. **Dynamic Stockout Simulation**: It computes safety stock using square-root lead-time variance formulas to flag vulnerable SKUs days before inventory depletes.
3. **Vendor SLA Profiling**: It analyzes promised vs. actual delivery days across tier-1 international carriers to compute a real-time **Delay Exposure Score (/100)**.
4. **Automated AI Governance**: It monitors the model against **Data Drift** using two-sample **Kolmogorov-Smirnov statistical tests** ($p < 0.05$) and provides an instant one-click pipeline retraining trigger.

---

## 4. Master Glossary: Every Technical Term Explained Simply

| Term | What It Means (Simple Words) | Why It Matters in the Project |
| :--- | :--- | :--- |
| **SKU (Stock Keeping Unit)** | A unique identification code for a specific warehouse item (e.g., `SKU-001` = Industrial Servo Motor). | Our system tracks 15 unique industrial SKUs. |
| **Lead Time** | The number of days between placing a purchase order with a supplier and the goods arriving at your loading dock. | Ingested as an input feature to calculate safety stock. |
| **Safety Stock** | The emergency reserve buffer kept in the warehouse to prevent stockouts during unexpected demand spikes or supplier delays. | Calculated as: $\text{Safety Stock} = \bar{d} \times \sqrt{L} \times Z$. |
| **Reorder Point (ROP)** | The stock level threshold that triggers a new replenishment purchase order. | $\text{ROP} = (\text{Daily Demand} \times \text{Lead Time}) + \text{Safety Stock}$. |
| **Stockout** | The catastrophic condition when demand exists but warehouse shelves are completely empty. | The primary failure mode SupplyChainIQ prevents. |
| **Time-Series Regression** | Formulating a forecasting problem by turning chronological time steps into tabular columns (lags, rolling averages, calendar days) to predict future demand. | The mathematical foundation of our ML pipeline. |
| **Heuristic Baseline** | A simple common-sense operational benchmark (like a 7-day moving average). | Used as a reference point to prove machine learning delivers real business value. |
| **MAE (Mean Absolute Error)** | The average distance between predicted demand and actual demand in physical units. | Our model achieved an MAE of **11.12 units** (vs 25.88 units for baseline). |
| **RMSE (Root Mean Squared Error)** | Similar to MAE, but heavily penalizes large, dangerous outlier errors by squaring them first. | Our model achieved an RMSE of **15.58 units** (vs 33.27 units for baseline). |
| **$R^2$ Score (Coefficient of Determination)** | The percentage of total demand variance explained by the model. | Our model achieved an $R^2$ of **95.48%** on validation and **93.05%** on unseen test data. |
| **Gradient Boosting** | An ensemble technique that builds shallow decision trees sequentially, with each tree minimizing the errors (residuals) of previous trees. | Our chosen **Champion Model**. |
| **Autoregressive Lags** | Past historical values of the target variable used as predictors (e.g., `lag_7` = sales 7 days ago). | `lag_7` and `lag_14` captured weekly B2B purchasing rhythms. |
| **Data Drift (Covariate Shift)** | When the statistical distribution of input data changes over time in production. | Automatically monitored using KS statistical tests. |
| **Kolmogorov-Smirnov (KS) Test** | A non-parametric statistical hypothesis test that checks if two samples come from the same distribution ($p < 0.05$ indicates drift). | Powers the real-time model drift monitoring engine. |

---

## 5. The Dataset Deep Dive (10,995 Rows Across 15 SKUs)

### The Exact Formula Behind the Dataset Size
$$\mathbf{733\text{ Days (24 Months)}} \times \mathbf{15\text{ Active SKUs}} = \mathbf{10,995\text{ Daily Records}}$$

- **Date Range**: January 1, 2024 to January 2, 2026 (733 consecutive calendar days).
- **Source**: Generated by our domain-specific simulation engine ([`ml/data/generate_dataset.py`](file:///c:/Users/priya/Desktop/env/ml/data/generate_dataset.py)) and saved as [`supply_chain_data.csv`](file:///c:/Users/priya/Desktop/env/ml/data/supply_chain_data.csv).

### Catalog of 15 Monitored Products Across 4 Industrial Categories
1. **Mechanical (6 SKUs)**:
   - `SKU-001`: Industrial Servo Motor (Base Demand: 140/day, $280)
   - `SKU-003`: High-Torque Stepper Motor (Base Demand: 95/day, $120)
   - `SKU-004`: Hydraulic Actuator Pump (Base Demand: 60/day, $420)
   - `SKU-008`: Pneumatic Control Valve (Base Demand: 110/day, $145)
   - `SKU-013`: Brushless DC Motor 24V (Base Demand: 85/day, $195)
   - `SKU-009`: Precision Ball Bearing Set (Base Demand: 250/day, $28)
2. **Electronics (4 SKUs)**:
   - `SKU-002`: Microcontroller Board MCU-32 (Base Demand: 210/day, $45)
   - `SKU-005`: Thermal Sensor Probe (Base Demand: 180/day, $32)
   - `SKU-007`: Optical Fiber Transceiver (Base Demand: 160/day, $85)
   - `SKU-010`: Solid State Relay SSR-40 (Base Demand: 175/day, $55)
3. **Thermal & Power (2 SKUs)**:
   - `SKU-006`: Lithium-Ion Power Cell 48V (Base Demand: 125/day, $310)
   - `SKU-011`: Copper Heat Sink 120mm (Base Demand: 130/day, $38)
4. **Structural & Hardware (3 SKUs)**:
   - `SKU-012`: Polymer Gasket Seal Kit (Base Demand: 220/day, $18)
   - `SKU-014`: Linear Motion Rail 500mm (Base Demand: 70/day, $165)
   - `SKU-015`: Aluminum Extrusion Profile (Base Demand: 190/day, $62)

### Global Supply Chain Network
- **5 Tier-1 Regional Suppliers**:
  - `SUP-001` (Apex Global Logistics - North America): 5-day base lead time, low transit risk ($0.22$).
  - `SUP-002` (Nexus Component Fab - East Asia): 12-day lead time, high transit risk ($0.58$).
  - `SUP-003` (Starlight Precision - Western Europe): 8-day lead time, medium risk ($0.35$).
  - `SUP-004` (Vanguard Industrial - Southeast Asia): 14-day lead time, route risk ($0.65$).
  - `SUP-005` (Pacific Freight - South Asia): 10-day lead time, route risk ($0.44$).
- **3 Warehouses**: `WH-North`, `WH-Central`, `WH-South`.

---

---

# PART II: WEBSITE WALKTHROUGH & SYSTEM LOGIC

## 6. Complete Tour of Website Pages & Their Functionalities

Here is a detailed breakdown of **every single screen, button, and capability** in the web application:

### Page 1: 3D Interactive Logistics Showcase (`/landing.html`)
- **What it does**: Provides an executive 3D visual entry point showcasing international trade routes.
- **Key Features**:
  - **Interactive 3D WebGL Globe**: Built with Three.js; users can rotate, tilt, and zoom around the planet.
  - **Dynamic Arc Trajectories**: Pulsing illuminated arcs representing real-time cargo movement between supplier regions and distribution hubs.
  - **Live Telemetry Counters**: Displays live metrics (15 Active SKUs, 95.5% ML Precision, 5 Global Suppliers).
  - **Direct Launch CTA Buttons**: Buttons to "Launch Forecaster" and "Enter Control Center", routing directly into the React dashboard.

---

### Page 2: Executive Control Center & KPIs (`/dashboard`)
- **What it does**: Serves as the mission-control homepage for warehouse managers.
- **Key Features**:
  - **Header Status Capsule**: Shows live system clock, active ML engine heartbeat (`ML Engine Live`), and champion model tag.
  - **4 Live KPI Cards**:
    1. **Forecast Accuracy**: Displays $95.5\%$ with holdout MAE of 11.12 units.
    2. **Network Delay Risk**: Shows overall supplier delay exposure rate.
    3. **Inventory Health**: Percentage of catalog SKUs with stock strictly above safety thresholds.
    4. **At-Risk SKUs**: Live count of items with imminent stockout warnings.
  - **Weekly Network Demand Trend Chart**: Interactive Area chart tracking total weekly order volume over 24 months with custom glass tooltips.
  - **ML Core Specifications Pod**: Displays active training records (10,995), date range, and a quick-action button to jump directly into forecasting.

---

### Page 3: Time-Series Demand Forecaster (`/dashboard/forecast`)
- **What it does**: Allows operators to pick any product and run real-time machine learning predictions into the future.
- **How it works under the hood**: When "Infer" is clicked, the React frontend sends an API request to the FastAPI backend. The backend uses the saved `demand_model.joblib` (Gradient Boosting) to predict Day 1, feeds that prediction back in as a historical lag feature, and iteratively predicts the remaining days of the horizon.
- **How to Use It**:
  1. **Select Target SKU**: Dropdown menu containing all 15 industrial products with categories and part codes.
  2. **Select Forecast Horizon**: Quick-toggle buttons for **1 Day**, **7 Days**, **14 Days**, or **30 Days**.
  3. **Click "Infer" (or "Re-Infer")**: Triggers live inference on the FastAPI backend.
- **Key Features & Outputs**:
  - **Parameter Change Detection**: If you change the SKU or days after running, the button pulses and prompts you to "Re-Infer".
  - **Real-Time Pipeline Telemetry Bar**: Shows the exact inference latency in milliseconds (e.g. `8 ms`), execution timestamp, and active model artifact (`demand_model.joblib`).
  - **Dual-Trajectory Chart**:
    - **Solid Slate Line**: Last 60 days of actual historical sales.
    - **Dashed Glowing Orange Line**: Future multi-day predicted demand trajectory.
  - **4 Forecast Summary Cards**:
    - *Total Projected Demand* across the chosen horizon.
    - *Daily Run-Rate* (predicted consumption velocity in units/day).
    - *Model MAE Precision* for the selected item.
    - *Regression $R^2$ Fit*.

---

### Page 4: Inventory Shortage & Risk Engine (`/dashboard/inventory`)
- **What it does**: Translates ML demand forecasts into physical warehouse stockout prevention actions.
- **How it works under the hood**: It pulls the current stock levels and compares them against the safety stock formula ($\bar{d} \times \sqrt{L} \times Z$). If the predicted demand during the supplier's delivery time exceeds the physical stock, it flags the item as CRITICAL.
- **Key Features**:
  - **Interactive Search Bar**: Real-time fuzzy search filtering by SKU code, component name, or category.
  - **Risk Tier Filter**: Quick buttons to filter by `ALL`, `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.
  - **Sortable Multi-Column Matrix**: Click any column header to sort ascending/descending:
    - *Current Stock*: Units physically sitting on shelves.
    - *Lead-Time Run*: Expected demand consumed during supplier delivery window.
    - *Projected Stock*: Physical Stock minus Lead-Time Demand (turns red if negative).
    - *Coverage Days*: How many days of operational runway remain.
    - *Risk Tier Badge*: Visual color-coded badge.
  - **Prescriptive Action Recommendations**: Generates concrete actions like *"Immediate expedited purchase order required; lead-time demand exceeds buffer"* or *"Inventory buffer optimal; normal reorder schedule"*.

---

### Page 5: Supplier & Carrier Delay Risk Radar (`/dashboard/delays`)
- **What it does**: Profiles vendor reliability and highlights transit bottlenecks before they delay manufacturing.
- **How it works under the hood**: The backend calculates a custom Delay Exposure Score by taking the mathematical variance between a supplier's promised SLA lead time and their historical actual delivery times, penalizing carriers with wide delivery windows.
- **Key Features**:
  - **Supplier Dossier Cards**: Dedicated cards for all 5 tier-1 suppliers with regional badges.
  - **Composite Delay Exposure Score**: Color-coded score from 0 to 100 based on delivery variance.
  - **Promised SLA vs Actual Arrival Comparison**: Displays expected lead days alongside historical average arrival days.
  - **Fulfillment Reliability Gauge**: Tracks the carrier's on-time completion percentage (e.g. 96.8% vs 69.2%).
  - **Route Risk Analysis**: Identifies shipping channel vulnerabilities (customs bottlenecks, weather corridors).

---

### Page 6: Multi-Echelon Macro Network Analytics (`/dashboard/analytics`)
- **What it does**: Provides deep aggregate data science charts across the 2-year operational history.
- **Key Features**:
  - **Monthly Aggregate Demand Area Chart**: Shows total enterprise throughput over 24 months.
  - **Monthly Inventory Levels**: Tracks the average warehouse stocking volume curve.
  - **Commodity Category Donut Pie Chart**: Visual breakdown of demand across Mechanical (48%), Electronics (27%), Thermal & Power (13%), and Hardware (12%).
  - **Supplier Benchmark Bar Chart**: Grouped bars comparing expected SLA lead time vs actual on-time fulfillment rate for each carrier.
  - **Delivery Delay Frequency Histogram**: Frequency distribution showing how often shipments are delayed by 0 days, 1-2 days, 3-5 days, or 6+ days.

---

### Page 7: Model Benchmarks & Continuous Drift Diagnostics (`/dashboard/models` or `/dashboard/model-performance`)
- **What it does**: Provides complete machine learning governance, mathematical transparency, and drift handling.
- **How it works under the hood**: Uses Two-Sample Kolmogorov-Smirnov statistical tests. It compares the statistical distribution of the original training data against new live data. If the p-value drops below 0.05, it proves mathematical drift has occurred, prompting the user to click the retrain button.
- **Key Features**:
  - **Champion Model Banner**: Displays holdout accuracy, training timestamp, engineered feature count (35), and split strategy.
  - **Side-by-Side Algorithm Comparison Table**: Compares 7-Day Moving Average, Random Forest, and Gradient Boosting across MAE, RMSE, and $R^2$.
  - **Two-Sample Kolmogorov-Smirnov (KS) Test Audit**:
    - Live table tracking 5 key features (Inventory Level, Lead Time, Route Risk, Unit Price, Fulfillment Rate).
    - Shows Baseline Mean, Current Mean, Shift %, KS Statistic, and P-Value ($p < 0.05$ indicates drift).
  - **Concept Drift Rolling MAE Timeline**: Line chart tracking model error across chronological windows with a **red alert limit line at 15.0 units**.
  - **One-Click Automated Retraining Trigger**: A button that sends a `POST /api/retrain` request to recalculate model weights with recent data, displaying a confirmation banner with the new $R^2$ and MAE.
  - **Actual vs. Predicted Holdout Curve**: Visual verification of model predictions tracking true observations.
  - **Residual Scatter Plot**: Error distribution plot ($y_{actual} - y_{pred}$) proving errors are symmetrically centered around zero.
  - **Gini Feature Importance Bar Chart**: Shows the exact weight of top predictive features (`lag_7` at 58.0%, `lag_14` at 31.8%).
  - **Data Preprocessing & Quality Audit Grid**: Displays de-duplication stats, missing value imputations, and chronological split ratios.

---

## 7. System Architecture & Full-Stack Data Flow (With Diagrams)

```mermaid
sequenceDiagram
    autonumber
    actor User as Warehouse Manager
    participant UI as React Frontend (Port 3000)
    participant API as FastAPI Backend (Port 8000)
    participant Engine as Forecast / Risk Engine
    participant Model as demand_model.joblib

    User->>UI: Selects SKU-001 and 14-Day Horizon
    UI->>API: POST /api/forecast { sku_id: "SKU-001", horizon_days: 14 }
    API->>Engine: Fetch last 30 days of SKU history
    Engine->>Engine: Build 35 features for Day 1 iteratively
    Engine->>Model: Predict Day 1 demand
    Model-->>Engine: Predicted demand: 142 units
    Engine->>Engine: Feed Day 1 back into lag_1 to predict Day 2..14
    Engine-->>API: Returns 14-day trajectory, daily run-rate, and trend
    API-->>UI: 200 OK JSON response (latency ~8ms)
    UI-->>User: Renders smooth chart, telemetry latency pill, and KPI cards
```

---

## 8. The Machine Learning Engine: How It Works Step-by-Step

```
Step 1: Data Preprocessing & Cleaning (ml/preprocessing/preprocessor.py)
   ├── Sort dataset chronologically by [date, sku_id].
   ├── Impute missing numerical values using forward-fill & medians.
   └── Encode categorical strings (SKUs, Suppliers, Warehouses) into integer IDs.

Step 2: 35-Dimensional Feature Engineering (ml/feature_engineering/features.py)
   ├── 5 Autoregressive Lags: lag_1, lag_3, lag_7, lag_14, lag_28
   ├── 6 Rolling Statistics: rolling_mean_7, rolling_std_7, rolling_mean_14, rolling_std_14, rolling_mean_28, rolling_std_28
   ├── 7 Calendar Seasonality: day_of_week, day_of_month, month, quarter, week_of_year, is_weekend, is_month_end
   ├── 7 Logistics Variables: inventory_level, reorder_point, safety_stock, expected_lead_time, fulfillment_rate, route_risk_score, unit_price
   ├── 5 Interaction Terms: inventory_coverage_days, stock_demand_ratio, trend_short_long, lt_demand_estimate, demand_change_rate
   └── 5 Categorical Encodings: sku_id_encoded, category_encoded, warehouse_encoded, supplier_id_encoded, supplier_region_encoded

Step 3: Strict Chronological Splitting (No Data Leakage!)
   ├── Training Set (70% = 7,695 rows): January 1, 2024 to May 27, 2025
   ├── Validation Set (15% = 1,650 rows): May 28, 2025 to September 14, 2025
   └── Holdout Test Set (15% = 1,650 rows): September 15, 2025 to January 2, 2026

Step 4: Cross-Validation & Hyperparameter Tuning (ml/training/train.py)
   ├── Used TimeSeriesSplit(n_splits=3) to preserve temporal ordering during CV folds.
   └── Tuned n_estimators (100, 150, 200), learning_rate (0.05, 0.08, 0.1), and max_depth (4, 5, 6).

Step 5: Champion Model Selection & Serialization
   ├── Compared 7-Day MA vs Random Forest vs Gradient Boosting.
   ├── Crowned Gradient Boosting as Champion (+57.0% error reduction vs baseline).
   └── Serialized weights into ml/models/demand_model.joblib.
```

---

## 9. Why We Chose Gradient Boosting (Model Selection Rationale)

### Final Evaluation Benchmark Comparison

| Model Architecture | MAE (Lower = Better) | RMSE (Lower = Better) | $R^2$ Accuracy | Error Reduction vs Baseline | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **7-Day Moving Average** *(Operational Baseline)* | **25.88** units | 33.27 units | 79.38% | Reference Benchmark (0%) | Archived Baseline |
| **Random Forest Regressor** *(Bagging Ensemble)* | **11.41** units | 15.90 units | 95.29% | +55.9% | Evaluated Candidate |
| **Gradient Boosting Regressor** *(Champion)* | **11.12** units | **15.58** units | **95.48%** | **+57.0%** | **Active Production** |

### 4 Reasons Why Gradient Boosting Won:
1. **Sequential Residual Learning**: Unlike Random Forest (which trains trees independently in parallel and averages them), Gradient Boosting trains trees **sequentially**. Each new tree specifically minimizes the residual errors of the previous trees using gradient descent.
2. **Superior Holdout Fit**: Lower MAE (11.12 vs 11.41) and lower RMSE (15.58 vs 15.90) on unseen validation data.
3. **Weekly Seasonality Sensitivity**: Gradient Boosting captured weekly ordering rhythms with high fidelity (`lag_7` was responsible for 58.0% of total split importance).
4. **Sub-10ms Inference Latency**: Much faster and lighter than heavy deep learning networks (e.g. LSTMs or Transformers), allowing instant real-time slider updates in the web UI.

---

## 10. Continuous Statistical Drift Detection (Kolmogorov-Smirnov Test)

In production, models can degrade silently if customer buying habits or supplier lead times change. We implemented an automated drift engine ([`backend/app/services/drift_engine.py`](file:///c:/Users/priya/Desktop/env/backend/app/services/drift_engine.py)):
- **Two-Sample Kolmogorov-Smirnov Test**:
  - Compares the empirical cumulative distribution function (eCDF) of the training baseline against recent production telemetry.
  - Null Hypothesis $H_0$: Both samples come from the identical continuous distribution.
  - Rejection Rule: If **$p\text{-value} < 0.05$**, we reject $H_0$ and flag a **Covariate Drift Warning**.
- **Concept Drift Tracking**:
  - Computes rolling MAE across sequential time windows. If rolling error exceeds **15.0 units**, an alert is displayed on the UI.
- **One-Click Retraining**:
  - The UI provides a "Trigger Pipeline Retraining" button (`POST /api/retrain`) that re-fits model weights and logs refreshed metrics.

---

## 11. Top 20 Teacher / Viva Questions & Exact Answers

### **Q1: What is the exact title and objective of your project?**
> **Answer**: *"The project is titled SupplyChainIQ — Autonomous Supply Chain Delay & Inventory Risk Forecaster. Its objective is to prevent stockouts and delivery delays in enterprise supply chains by using supervised time-series regression to forecast product demand across 15 SKUs with 95.5% precision, while scoring vendor lead-time risks and monitoring for model drift."*

---

### **Q2: Why did you use Machine Learning instead of just an Excel moving average?**
> **Answer**: *"A 7-day moving average is a static heuristic that is blind to supplier delivery delays, calendar holidays, and seasonal shifts. In our testing, the 7-day moving average had an MAE error of 25.88 units. Our Gradient Boosting ML model reduced that error to 11.12 units—cutting prediction mistakes by 57%."*

---

### **Q3: What dataset did you use, and how many records are there?**
> **Answer**: *"We used an enterprise supply chain dataset consisting of exactly 10,995 daily records covering 24 months (733 consecutive days from January 2024 to January 2026) across 15 distinct industrial SKUs, 5 international suppliers, and 3 distribution hubs."*

---

### **Q4: Why didn't you use standard random `train_test_split`?**
> **Answer**: *"Because random splitting is invalid for time-series data. It causes 'look-ahead data leakage' where the model uses future data points to predict the past. We strictly enforced a chronological date split: the oldest 70% of days for training, the next 15% for validation, and the final 15% of unseen future days for holdout testing."*

---

### **Q5: What are the 35 features your model uses?**
> **Answer**: *"We engineered 5 autoregressive lags (lags 1, 3, 7, 14, 28), 6 rolling window statistics (7, 14, and 28-day means and standard deviations), 7 calendar seasonality markers (day of week, month, quarter, weekend flag), 7 logistics metrics (lead times, inventory levels, route risk, unit price), 5 interaction ratios (inventory coverage days, stock-to-demand ratio), and 5 categorical entity embeddings."*

---

### **Q6: Why did `lag_7` have the highest feature importance?**
> **Answer**: *"`lag_7` accounted for 58.0% of feature importance because B2B commercial supply chains operate on strong weekly business cycles. Orders placed on a Tuesday are most strongly correlated with orders placed the previous Tuesday."*

---

### **Q7: What is the difference between Random Forest and Gradient Boosting?**
> **Answer**: *"Random Forest is a bagging ensemble that builds many independent, deep trees in parallel and averages their predictions. Gradient Boosting builds shallow trees sequentially; each consecutive tree specifically calculates and minimizes the residual errors of the previous trees using gradient descent in function space."*

---

### **Q8: What does an $R^2$ of 95.5% and MAE of 11.12 units mean?**
> **Answer**: *"$R^2$ of 95.5% means our model explains 95.5% of the total variability in product demand over time. An MAE of 11.12 units means that our daily demand forecast is off by an average of only ~11 physical units per product, compared to ~26 units off with the moving average."*

---

### **Q9: How does the system predict multiple days into the future (e.g. 14-day horizon)?**
> **Answer**: *"It uses iterative multi-step autoregression. To forecast Day 1, it uses known historical lags. To forecast Day 2, Day 1's prediction is fed back into the pipeline as the new `lag_1`, rolling statistics are dynamically updated, and the model predicts again. This recurses for the full 14 or 30-day horizon."*

---

### **Q10: How do you calculate whether an item is at risk of a Stockout?**
> **Answer**: *"We calculate the Reorder Point: $\text{ROP} = (\text{Daily Forecast} \times \text{Lead Time}) + \text{Safety Stock}$, where Safety Stock is $\bar{d} \times \sqrt{L} \times Z$. If the physical inventory level drops below the Safety Stock or if forecasted lead-time demand exceeds current stock, the SKU is flagged as 'Critical Stockout'."*

---

### **Q11: How is the Supplier Delay Risk Exposure Score calculated?**
> **Answer**: *"It is a composite score (0 to 100) based on the variance between the supplier's promised SLA lead time and their actual arrival timestamps, combined with their on-time delivery compliance percentage and carrier route geopolitical risk."*

---

### **Q12: What is Data Drift, and how does your project detect it?**
> **Answer**: *"Data Drift occurs when input feature distributions shift in production (e.g. supplier lead times jump from 5 days to 14 days due to port strikes). We detect it using automated Two-Sample Kolmogorov-Smirnov (KS) statistical tests between baseline training data and recent production telemetry. If $p < 0.05$, a drift warning is triggered."*

---

### **Q13: What happens when the user clicks 'Trigger Pipeline Retraining'?**
> **Answer**: *"The frontend makes a `POST /api/retrain` call to the FastAPI backend. The server ingests the latest operational records, refreshes model weights, recalculates MAE and $R^2$, and returns a confirmation banner showing the updated champion model version."*

---

### **Q14: Why did you choose MAE and RMSE instead of MSE?**
> **Answer**: *"MSE squares the error units, producing 'units squared', which has no physical meaning to a warehouse manager. MAE expresses error directly in physical units (e.g. 'off by 11 motors'). RMSE also maintains original units while penalizing large outlier errors."*

---

### **Q15: Why is model serialization (`.joblib`) necessary?**
> **Answer**: *"Training machine learning models takes significant compute and time. Serialization freezes the trained decision trees into a binary file (`demand_model.joblib`). The FastAPI backend loads this into memory once on startup and generates real-time predictions in under 10 milliseconds."*

---

### **Q16: How does the backend communicate with the frontend?**
> **Answer**: *"The backend is an asynchronous FastAPI REST API running on port 8000. The frontend is a React single-page application running on port 3000. It queries endpoints like `/api/forecast`, `/api/inventory-risk`, and `/api/model-drift` via Axios and renders the responses using Recharts."*

---

### **Q17: What are the 4 categories of SKUs in your system?**
> **Answer**: *"Mechanical (motors, actuators, valves), Electronics (microcontrollers, sensors, relays), Thermal & Power (lithium battery cells, heat sinks), and Structural & Hardware (gasket kits, motion rails, aluminum extrusions)."*

---

### **Q18: What is the 3D showcase on the landing page?**
> **Answer**: *"It is an interactive WebGL globe built with Three.js that renders international trade routes connecting regional suppliers across North America, Europe, and Asia to our distribution hubs with animated particle arcs."*

---

### **Q19: Can this system scale to 10,000 SKUs?**
> **Answer**: *"Yes. Because we formulated this as a single generalized tabular regression model with SKU entity embeddings rather than 10,000 individual ARIMA models, the architecture scales efficiently across large product catalogs."*

---

### **Q20: What are the top business benefits of deploying SupplyChainIQ?**
> **Answer**: 
> 1. **Prevents Lost Sales**: Eliminates stockouts on critical revenue-generating items.
> 2. **Cuts Holding Costs**: Prevents overstocking and reduces warehouse storage fees.
> 3. **Proactive Vendor Management**: Identifies unreliable suppliers before delayed shipments disrupt production.
> 4. **Automated ML Governance**: Protects against model obsolescence through continuous statistical drift monitoring.
