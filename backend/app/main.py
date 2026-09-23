import os
import sys
import json
import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.app.routes import forecast, inventory, analytics, delay

@asynccontextmanager
async def lifespan(app: FastAPI):
    models_dir = os.path.join(PROJECT_ROOT, "ml", "models")
    data_dir = os.path.join(PROJECT_ROOT, "ml", "data")
    try:
        app.state.demand_model = joblib.load(os.path.join(models_dir, "demand_model.joblib"))
        app.state.preprocessor = joblib.load(os.path.join(models_dir, "preprocessing_pipeline.joblib"))
        app.state.feature_engineer = joblib.load(os.path.join(models_dir, "feature_pipeline.joblib"))
        with open(os.path.join(models_dir, "model_metadata.json"), "r") as f:
            app.state.model_metadata = json.load(f)
        dataset = pd.read_csv(os.path.join(data_dir, "supply_chain_data.csv"))
        dataset['date'] = pd.to_datetime(dataset['date'])
        dataset = dataset.sort_values('date')
        app.state.dataset = dataset
        app.state.models_loaded = True
        print("Successfully loaded ML models and dataset.")
    except Exception as e:
        print(f"Error loading models: {e}")
        app.state.models_loaded = False
        app.state.demand_model = None
        app.state.preprocessor = None
        app.state.feature_engineer = None
        app.state.model_metadata = None
        app.state.dataset = None
    yield

app = FastAPI(
    title="Supply Chain Delay & Inventory Risk Forecaster API",
    description="SupplyChainIQ — Time-series regression & simple heuristic baseline comparison for supply chain inventory & delay risk forecasting",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecast.router, prefix="/api", tags=["Forecast"])
app.include_router(inventory.router, prefix="/api", tags=["Inventory"])
app.include_router(analytics.router, prefix="/api", tags=["Analytics"])
app.include_router(delay.router, prefix="/api", tags=["Delay"])

@app.get("/api/health")
def health_check():
    return {
        "status": "operational",
        "models_loaded": getattr(app.state, "models_loaded", False),
        "project_title": "Supply Chain Delay & Inventory Risk Forecaster"
    }

@app.get("/api/system-info")
@app.get("/api/academic-info")
def system_info():
    return {
        "project_title": "Supply Chain Delay & Inventory Risk Forecaster",
        "key_modules_covered": "Time-series regression, heuristic baseline comparison, drift detection",
        "learning_outcomes": [
            "End-to-end Machine Learning project pipeline including data preprocessing, feature engineering, and model training.",
            "Evaluate model performance using standardized metrics and deploy the trained model as an interactive web application."
        ],
        "viva_questions": [
            {
                "question": "What are the key stages involved in building an end-to-end Machine Learning pipeline?",
                "summary": "1. Problem definition, 2. Data preprocessing & split, 3. Feature engineering & model development, 4. Baseline evaluation & metric tracking, 5. Serialization & web deployment."
            },
            {
                "question": "Why is model serialization (e.g., using pickle or joblib) necessary for production deployment?",
                "summary": "Freezes learned weights and tree structures into joblib binaries to serve instant real-time predictions without expensive re-training."
            },
            {
                "question": "How do you select the appropriate evaluation metric for supply chain forecasting?",
                "summary": "MAE reflects direct unit error in physical inventory, RMSE penalizes dangerous large errors, and R² measures explained variance vs heuristic moving average."
            }
        ]
    }


@app.get("/api/notebooks/{exp_id}")
async def get_experiment_notebook(exp_id: str):
    notebooks_dir = os.path.join(PROJECT_ROOT, "notebooks")
    if exp_id.lower() in ["exp05", "exp5", "experiment_05", "baseline"]:
        file_path = os.path.join(notebooks_dir, "Experiment_05_Baseline_Heuristics_vs_Complex_ML.ipynb")
        filename = "Baseline_Heuristics_vs_Complex_ML.ipynb"
    elif exp_id.lower() in ["exp07", "exp7", "experiment_07", "drift"]:
        file_path = os.path.join(notebooks_dir, "Experiment_07_Model_Performance_Monitoring_and_Drift.ipynb")
        filename = "Model_Performance_Monitoring_and_Drift.ipynb"
    else:
        raise HTTPException(status_code=404, detail="Notebook not found. Available: baseline, drift")

    if os.path.exists(file_path):
        from fastapi.responses import FileResponse
        return FileResponse(
            file_path,
            media_type="application/x-ipynb+json",
            filename=filename,
            headers={"Content-Disposition": f'attachment; filename="{filename}"'}
        )
    raise HTTPException(status_code=404, detail=f"File not found: {file_path}")

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

build_dir = os.path.join(PROJECT_ROOT, "frontend", "build")
static_dir = os.path.join(build_dir, "static")

if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

@app.api_route("/landing", methods=["GET", "HEAD"])
@app.api_route("/landing.html", methods=["GET", "HEAD"])
@app.api_route("/showcase", methods=["GET", "HEAD"])
@app.api_route("/kairo", methods=["GET", "HEAD"])
async def serve_landing():
    landing_src = os.path.join(PROJECT_ROOT, "index.html")
    if os.path.exists(landing_src):
        return FileResponse(landing_src)
    landing_file = os.path.join(build_dir, "landing.html")
    if os.path.exists(landing_file):
        return FileResponse(landing_file)
    raise HTTPException(status_code=404, detail="Landing page not found")


@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    if full_path.startswith("api/") or full_path == "api":
        raise HTTPException(status_code=404, detail="API route not found")
    file_path = os.path.join(build_dir, full_path)
    if os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    index_file = os.path.join(build_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "SupplyChainIQ API operational. Build frontend to view dashboard."}
