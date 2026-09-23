"""
SupplyChainIQ - Model Training Pipeline
Performs chronological train/validation/test split, trains benchmark baseline,
Random Forest, and Gradient Boosting regressors with TimeSeriesSplit tuning,
and serializes champion model artifacts.
"""

import os
import sys
import json
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.model_selection import TimeSeriesSplit, RandomizedSearchCV

# Ensure project root is in sys.path
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from ml.data.generate_dataset import generate_dataset, OUTPUT_FILE as DATASET_PATH
from ml.preprocessing.preprocessor import DataPreprocessor
from ml.feature_engineering.features import FeatureEngineer
from ml.evaluation.evaluate import ModelEvaluator

MODELS_DIR = os.path.join(PROJECT_ROOT, "ml", "models")


def main():
    print("=" * 70)
    print(" SupplyChainIQ - Machine Learning Pipeline Training")
    print("=" * 70)

    # 1. Dataset Generation / Loading
    if not os.path.exists(DATASET_PATH):
        print(f"Dataset not found. Generating new dataset at {DATASET_PATH}...")
        df_raw = generate_dataset(num_days=733, seed=42)
        os.makedirs(os.path.dirname(DATASET_PATH), exist_ok=True)
        df_raw.to_csv(DATASET_PATH, index=False)
    else:
        print(f"Loading existing dataset from {DATASET_PATH}...")
        df_raw = pd.read_csv(DATASET_PATH)

    print(f"Dataset loaded: {len(df_raw)} records across {df_raw['sku_id'].nunique()} SKUs.")

    # 2. Preprocessing & Quality Audit
    preprocessor = DataPreprocessor()
    quality_audit = preprocessor.audit_data_quality(df_raw)
    data_quality_summary = {
        "total_records": quality_audit["total_records"],
        "duplicate_rows": quality_audit["duplicate_records"],
        "missing_values": quality_audit["missing_values"],
        "outlier_count": quality_audit["outlier_count"],
        "outlier_pct": quality_audit["outlier_pct"],
        "status": quality_audit["status"]
    }
    print(f"Data Quality Audit: {data_quality_summary['status']} (Missing: {data_quality_summary['missing_values']}, Duplicates: {data_quality_summary['duplicate_rows']})")

    df_encoded = preprocessor.fit_transform(df_raw)

    # 3. Feature Engineering
    print("Engineering lag, rolling statistics, and calendar features...")
    feature_engineer = FeatureEngineer()
    df_featured = feature_engineer.generate_features(df_encoded, drop_na=True)
    feature_columns = feature_engineer.get_feature_columns()
    print(f"Extracted {len(feature_columns)} features for model training.")

    # 4. Strict Chronological Split (70% Train, 15% Validation, 15% Test)
    train_df, val_df, test_df = DataPreprocessor.split_chronologically(
        df_featured, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15
    )
    print(f"Split sizes - Train: {len(train_df)}, Val: {len(val_df)}, Test: {len(test_df)}")

    X_train = train_df[feature_columns].values
    y_train = train_df['demand'].values

    X_val = val_df[feature_columns].values
    y_val = val_df['demand'].values

    X_test = test_df[feature_columns].values
    y_test = test_df['demand'].values

    # 5. Baseline Evaluation (7-day moving average heuristic)
    print("\n--- Evaluating Operational Baseline ---")
    baseline_metrics = ModelEvaluator.evaluate_baseline_moving_average(val_df, window=7)
    print(f"Baseline (7-day MA) -> MAE: {baseline_metrics['mae']}, RMSE: {baseline_metrics['rmse']}, R2: {baseline_metrics['r2']}")

    # 6. Model Training & Comparison
    print("\n--- Training Candidate Models ---")

    # Candidate 1: Random Forest Regressor
    print("Training Random Forest Regressor...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=12,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    rf_model.fit(X_train, y_train)
    rf_val_preds = rf_model.predict(X_val)
    rf_metrics = ModelEvaluator.evaluate_predictions(y_val, rf_val_preds)
    rf_improvement = round(((baseline_metrics['mae'] - rf_metrics['mae']) / baseline_metrics['mae']) * 100, 1)
    print(f"Random Forest -> MAE: {rf_metrics['mae']}, RMSE: {rf_metrics['rmse']}, R2: {rf_metrics['r2']} (+{rf_improvement}% over baseline)")

    # Candidate 2: Gradient Boosting Regressor (Champion)
    print("Training Gradient Boosting Regressor with hyperparameter tuning...")
    gb_base = GradientBoostingRegressor(random_state=42)
    param_dist = {
        'n_estimators': [100, 150, 200],
        'learning_rate': [0.05, 0.08, 0.1],
        'max_depth': [4, 5, 6],
        'subsample': [0.85, 0.9, 1.0]
    }
    tscv = TimeSeriesSplit(n_splits=3)
    search = RandomizedSearchCV(
        gb_base,
        param_distributions=param_dist,
        n_iter=6,
        cv=tscv,
        scoring='neg_mean_absolute_error',
        random_state=42,
        n_jobs=-1
    )
    search.fit(X_train, y_train)
    gb_model = search.best_estimator_

    gb_val_preds = gb_model.predict(X_val)
    gb_metrics = ModelEvaluator.evaluate_predictions(y_val, gb_val_preds)
    gb_improvement = round(((baseline_metrics['mae'] - gb_metrics['mae']) / baseline_metrics['mae']) * 100, 1)
    print(f"Gradient Boosting -> MAE: {gb_metrics['mae']}, RMSE: {gb_metrics['rmse']}, R2: {gb_metrics['r2']} (+{gb_improvement}% over baseline)")

    # 7. Select Champion Model
    champion_name = "Gradient Boosting Regressor"
    champion_model = gb_model

    # 8. Final Holdout Test Evaluation
    print(f"\n--- Final Holdout Test Evaluation for Champion ({champion_name}) ---")
    y_test_pred = champion_model.predict(X_test)
    test_metrics = ModelEvaluator.evaluate_predictions(y_test, y_test_pred)
    print(f"Test MAE: {test_metrics['mae']} units")
    print(f"Test RMSE: {test_metrics['rmse']} units")
    print(f"Test R2 Score: {round(test_metrics['r2'] * 100, 2)}%")

    # Compile all models metrics comparison for display
    all_models_metrics = [
        {
            "model": "Gradient Boosting Regressor",
            "mae": gb_metrics["mae"],
            "rmse": gb_metrics["rmse"],
            "r2": gb_metrics["r2"],
            "improvement_pct": gb_improvement,
            "status": "DEPLOYED"
        },
        {
            "model": "Random Forest Regressor",
            "mae": rf_metrics["mae"],
            "rmse": rf_metrics["rmse"],
            "r2": rf_metrics["r2"],
            "improvement_pct": rf_improvement,
            "status": "Evaluated"
        },
        {
            "model": "7-Day Moving Average Baseline",
            "mae": baseline_metrics["mae"],
            "rmse": baseline_metrics["rmse"],
            "r2": baseline_metrics["r2"],
            "improvement_pct": 0.0,
            "status": "Benchmark"
        }
    ]

    # 9. Serialization
    os.makedirs(MODELS_DIR, exist_ok=True)
    model_path = os.path.join(MODELS_DIR, "demand_model.joblib")
    preproc_path = os.path.join(MODELS_DIR, "preprocessing_pipeline.joblib")
    feat_path = os.path.join(MODELS_DIR, "feature_pipeline.joblib")
    meta_path = os.path.join(MODELS_DIR, "model_metadata.json")

    joblib.dump(champion_model, model_path)
    joblib.dump(preprocessor, preproc_path)
    joblib.dump(feature_engineer, feat_path)

    metadata = ModelEvaluator.compile_metadata(
        champion_name=champion_name,
        champion_model=champion_model,
        feature_columns=feature_columns,
        baseline_metrics=baseline_metrics,
        all_models_metrics=all_models_metrics,
        y_test_true=y_test,
        y_test_pred=y_test_pred,
        test_dates=test_df['date'].astype(str).tolist(),
        data_quality=data_quality_summary
    )

    with open(meta_path, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\nArtifacts successfully serialized to {MODELS_DIR}:")
    print(f" - {os.path.basename(model_path)}")
    print(f" - {os.path.basename(preproc_path)}")
    print(f" - {os.path.basename(feat_path)}")
    print(f" - {os.path.basename(meta_path)}")
    print("\nTraining complete! SupplyChainIQ ML pipeline is ready.")


if __name__ == "__main__":
    main()
