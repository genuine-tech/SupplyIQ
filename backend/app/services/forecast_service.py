"""
SupplyChainIQ - Forecast Service
Generates demand forecasts using the trained ML model.
"""

import pandas as pd
import numpy as np
import calendar
from datetime import timedelta


class ForecastService:
    @staticmethod
    def generate_forecast(app_state, sku_id: str, horizon_days: int):
        """Generate demand forecast for a specific SKU and horizon."""
        df = app_state.dataset
        model = app_state.demand_model
        feature_engineer = app_state.feature_engineer
        metadata = app_state.model_metadata

        sku_data = df[df['sku_id'] == sku_id].sort_values('date').copy()
        if sku_data.empty:
            raise ValueError(f"SKU {sku_id} not found in dataset")

        product_name = sku_data['product_name'].iloc[0]

        # Get historical demand (last 60 days for chart context)
        hist = sku_data[['date', 'demand']].tail(60)
        historical_demand = [
            {"date": d.strftime('%Y-%m-%d'), "demand": float(v)}
            for d, v in zip(hist['date'], hist['demand'])
        ]

        # Get the feature columns used during training
        feature_cols = metadata.get('features', feature_engineer.get_feature_columns())

        # For forecasting, we use the last known data and generate predictions iteratively
        # We need to build the features from recent historical data
        predictions = []
        last_date = sku_data['date'].max()

        # Get recent demand history for feature calculation
        recent_demands = list(sku_data['demand'].tail(30).values)
        last_row = sku_data.iloc[-1]

        for day_offset in range(1, horizon_days + 1):
            forecast_date = last_date + timedelta(days=day_offset)

            # Build features for this prediction step
            features = {}

            # Lag features using recent_demands list
            lag_map = {1: 'lag_1', 3: 'lag_3', 7: 'lag_7', 14: 'lag_14', 28: 'lag_28'}
            for lag, col_name in lag_map.items():
                if col_name in feature_cols:
                    idx = len(recent_demands) - lag
                    features[col_name] = float(recent_demands[idx]) if idx >= 0 else float(np.mean(recent_demands))

            # Rolling features
            for window in [7, 14, 28]:
                mean_col = f'rolling_mean_{window}'
                std_col = f'rolling_std_{window}'
                recent_window = recent_demands[-window:] if len(recent_demands) >= window else recent_demands
                if mean_col in feature_cols:
                    features[mean_col] = float(np.mean(recent_window))
                if std_col in feature_cols:
                    features[std_col] = float(np.std(recent_window)) if len(recent_window) > 1 else 0.0

            # Calendar features
            if 'day_of_week' in feature_cols:
                features['day_of_week'] = forecast_date.weekday()
            if 'day_of_month' in feature_cols:
                features['day_of_month'] = forecast_date.day
            if 'month' in feature_cols:
                features['month'] = forecast_date.month
            if 'quarter' in feature_cols:
                features['quarter'] = (forecast_date.month - 1) // 3 + 1
            if 'week_of_year' in feature_cols:
                features['week_of_year'] = forecast_date.isocalendar()[1]
            if 'is_weekend' in feature_cols:
                features['is_weekend'] = 1 if forecast_date.weekday() >= 5 else 0
            if 'is_month_end' in feature_cols:
                last_day = calendar.monthrange(forecast_date.year, forecast_date.month)[1]
                features['is_month_end'] = 1 if forecast_date.day == last_day else 0

            # Supply chain features (use last known values)
            sc_cols = ['inventory_level', 'reorder_point', 'safety_stock',
                       'expected_lead_time', 'fulfillment_rate', 'route_risk_score', 'unit_price']
            for col in sc_cols:
                if col in feature_cols and col in last_row.index:
                    features[col] = float(last_row[col])

            # Encoded categorical features
            encoded_cols = [c for c in feature_cols if c.endswith('_encoded')]
            for col in encoded_cols:
                if col in last_row.index:
                    features[col] = float(last_row[col])

            # Derived features
            if 'lt_demand_estimate' in feature_cols:
                lag7 = features.get('lag_7', np.mean(recent_demands))
                lt = features.get('expected_lead_time', 7)
                features['lt_demand_estimate'] = lag7 * lt / 7

            if 'inventory_coverage_days' in feature_cols:
                inv = features.get('inventory_level', 0)
                lag7 = max(features.get('lag_7', 1), 1)
                features['inventory_coverage_days'] = inv / lag7

            if 'stock_demand_ratio' in feature_cols:
                inv = features.get('inventory_level', 0)
                lag1 = max(features.get('lag_1', 1), 1)
                features['stock_demand_ratio'] = inv / lag1

            if 'trend_short_long' in feature_cols:
                rm7 = features.get('rolling_mean_7', 0)
                rm28 = features.get('rolling_mean_28', 0)
                features['trend_short_long'] = rm7 - rm28

            if 'demand_change_rate' in feature_cols:
                features['demand_change_rate'] = 0.0  # Neutral for prediction

            # Build feature vector in correct order with NaN safety
            feature_vector = []
            for col in feature_cols:
                val = features.get(col, 0.0)
                safe_val = float(val) if val is not None and not (isinstance(val, (float, np.floating)) and np.isnan(val)) else 0.0
                feature_vector.append(safe_val)

            # Predict
            X = np.array([feature_vector])
            pred = float(model.predict(X)[0])
            pred = max(pred, 0)  # Demand can't be negative

            predictions.append({
                "date": forecast_date.strftime('%Y-%m-%d'),
                "predicted_demand": round(pred, 1)
            })

            # Add prediction to recent_demands for next iteration
            recent_demands.append(pred)

        # Calculate trend
        if len(predictions) >= 2:
            first_half = np.mean([p['predicted_demand'] for p in predictions[:len(predictions)//2]])
            second_half = np.mean([p['predicted_demand'] for p in predictions[len(predictions)//2:]])
            if second_half > first_half * 1.05:
                trend = "Increasing"
            elif second_half < first_half * 0.95:
                trend = "Decreasing"
            else:
                trend = "Stable"
        else:
            trend = "Stable"

        # Get metrics from metadata
        best_model_name = metadata.get('best_model', 'Trained Model')
        all_metrics = metadata.get('metrics', {}).get('all_models', [])
        # Find the best model's validation metrics
        model_metrics = {}
        for m in all_metrics:
            if m.get('model') == best_model_name:
                model_metrics = {"mae": m.get('mae'), "rmse": m.get('rmse'), "r2": m.get('r2')}
                break

        return {
            "sku_id": sku_id,
            "product_name": product_name,
            "horizon_days": horizon_days,
            "predictions": predictions,
            "historical_demand": historical_demand,
            "model_name": best_model_name,
            "metrics": model_metrics,
            "trend": trend,
            "total_predicted_demand": round(sum(p['predicted_demand'] for p in predictions), 1)
        }
