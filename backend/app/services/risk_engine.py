"""
SupplyChainIQ - Inventory Risk Engine
Calculates inventory risk assessments using ML forecasts + rule-based logic.
"""

import numpy as np


class RiskEngine:
    """
    Transparent rule-based inventory risk assessment.
    The ML model forecasts demand. This engine translates
    the forecast into operational inventory risk levels.

    Configurable thresholds:
    - CRITICAL: coverage < 3 days AND projected inventory < 0
    - HIGH: coverage < 7 days
    - MEDIUM: coverage < 14 days
    - LOW: coverage >= 14 days
    """

    RISK_THRESHOLDS = {
        "critical_coverage": 3,
        "high_coverage": 7,
        "medium_coverage": 14,
    }

    @staticmethod
    def calculate_inventory_risk(app_state, target_sku_id=None):
        """Calculate inventory risk for all SKUs or a specific SKU."""
        df = app_state.dataset
        model = app_state.demand_model
        metadata = app_state.model_metadata
        feature_cols = metadata.get('features', [])

        skus = df['sku_id'].unique()
        if target_sku_id:
            skus = [target_sku_id]

        results = []

        for sku_id in skus:
            sku_data = df[df['sku_id'] == sku_id].sort_values('date')
            if sku_data.empty:
                continue

            last_row = sku_data.iloc[-1]
            product_name = last_row['product_name']

            # Current inventory and safety stock from latest data
            current_inventory = float(last_row['inventory_level'])
            safety_stock = float(last_row['safety_stock'])
            reorder_point = float(last_row['reorder_point'])
            avg_lead_time = float(sku_data['expected_lead_time'].mean())

            # Generate demand predictions using trained ML model if loaded
            if getattr(app_state, 'models_loaded', False) and getattr(app_state, 'demand_model', None) is not None:
                try:
                    from backend.app.services.forecast_service import ForecastService
                    horizon_needed = max(int(np.ceil(avg_lead_time)), 14)
                    forecast_res = ForecastService.generate_forecast(app_state, sku_id, horizon_needed)
                    preds = [p['predicted_demand'] for p in forecast_res.get('predictions', [])]
                    lt_steps = min(int(np.ceil(avg_lead_time)), len(preds))
                    lead_time_demand = float(sum(preds[:lt_steps]))
                    forecast_demand_14d = float(sum(preds[:14]))
                    avg_daily_demand = forecast_demand_14d / 14.0 if forecast_demand_14d > 0 else 1.0
                except Exception:
                    recent_demand = sku_data['demand'].tail(7)
                    avg_daily_demand = float(recent_demand.mean()) if len(recent_demand) > 0 else 0
                    lead_time_demand = avg_daily_demand * avg_lead_time
                    forecast_demand_14d = avg_daily_demand * 14
            else:
                recent_demand = sku_data['demand'].tail(7)
                avg_daily_demand = float(recent_demand.mean()) if len(recent_demand) > 0 else 0
                lead_time_demand = avg_daily_demand * avg_lead_time
                forecast_demand_14d = avg_daily_demand * 14

            # Projected inventory after lead-time demand
            projected_inventory = current_inventory - lead_time_demand

            # Shortage quantity
            shortage_quantity = max(0, lead_time_demand - current_inventory)

            # Coverage days
            coverage_days = current_inventory / avg_daily_demand if avg_daily_demand > 0 else 999

            # Risk assessment
            thresholds = RiskEngine.RISK_THRESHOLDS
            if projected_inventory < 0 and coverage_days < thresholds["critical_coverage"]:
                risk_level = "CRITICAL"
            elif coverage_days < thresholds["high_coverage"]:
                risk_level = "HIGH"
            elif coverage_days < thresholds["medium_coverage"]:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"

            # Recommended reorder quantity
            if risk_level in ["CRITICAL", "HIGH"]:
                reorder_quantity = max(int(avg_daily_demand * 14 - current_inventory), int(avg_daily_demand * 7))
            elif risk_level == "MEDIUM":
                reorder_quantity = int(avg_daily_demand * 7)
            else:
                reorder_quantity = 0

            # Recommended action
            action = RiskEngine._get_recommendation(risk_level, shortage_quantity, product_name, reorder_quantity)

            results.append({
                "sku_id": sku_id,
                "product_name": product_name,
                "category": last_row.get('category', 'N/A'),
                "warehouse": last_row.get('warehouse', 'N/A'),
                "current_inventory": round(current_inventory),
                "forecast_demand": round(forecast_demand_14d, 1),
                "lead_time_demand": round(lead_time_demand, 1),
                "safety_stock": round(safety_stock),
                "projected_inventory": round(projected_inventory, 1),
                "shortage_quantity": round(shortage_quantity, 1),
                "coverage_days": round(coverage_days, 1),
                "avg_daily_demand": round(avg_daily_demand, 1),
                "avg_lead_time": round(avg_lead_time, 1),
                "risk_level": risk_level,
                "reorder_quantity": reorder_quantity,
                "recommended_action": action,
            })

        return results

    @staticmethod
    def _get_recommendation(risk_level, shortage, product_name, reorder_qty):
        """Generate a dynamic recommendation based on risk level."""
        if risk_level == "CRITICAL":
            return (
                f"High shortage exposure detected for {product_name}. "
                f"Prioritize immediate replenishment of {reorder_qty} units or contact an alternative supplier."
            )
        elif risk_level == "HIGH":
            return (
                f"Projected inventory for {product_name} may fall below demand during supplier lead time. "
                f"Consider early replenishment of {reorder_qty} units."
            )
        elif risk_level == "MEDIUM":
            return (
                f"Demand for {product_name} is moderate relative to stock. "
                f"Consider increasing the next replenishment by {reorder_qty} units."
            )
        else:
            return (
                f"Inventory for {product_name} is currently sufficient. Continue monitoring."
            )
