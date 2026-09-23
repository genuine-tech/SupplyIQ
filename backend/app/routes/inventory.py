"""Inventory and Summary routes."""

from fastapi import APIRouter, Request, HTTPException
from backend.app.services.risk_engine import RiskEngine

router = APIRouter()


@router.post("/inventory-risk")
def get_inventory_risk(request: Request, body: dict = None):
    """Calculate inventory risk for all SKUs or a specific one."""
    try:
        target_sku = None
        if body and 'sku_id' in body:
            target_sku = body['sku_id']

        risks = RiskEngine.calculate_inventory_risk(request.app.state, target_sku)
        return {"assessments": risks}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summary")
def get_summary(request: Request):
    """Dashboard KPI summary with real calculated values."""
    try:
        df = request.app.state.dataset
        metadata = request.app.state.model_metadata

        # Forecast accuracy from model metadata (use best model's R2)
        all_metrics = metadata.get('metrics', {}).get('all_models', [])
        best_model = metadata.get('best_model', '')
        forecast_accuracy = 0.0
        best_mae = 0.0
        best_rmse = 0.0

        for m in all_metrics:
            if m.get('model') == best_model:
                forecast_accuracy = round(m.get('r2', 0) * 100, 1)
                best_mae = m.get('mae', 0)
                best_rmse = m.get('rmse', 0)
                break

        # Calculate inventory risk summary
        risks = RiskEngine.calculate_inventory_risk(request.app.state)
        total_skus = len(risks)
        at_risk = sum(1 for r in risks if r['risk_level'] in ['HIGH', 'CRITICAL'])
        risk_counts = {}
        for r in risks:
            level = r['risk_level']
            risk_counts[level] = risk_counts.get(level, 0) + 1

        healthy = sum(1 for r in risks if r['risk_level'] == 'LOW')
        inventory_health_pct = round((healthy / total_skus) * 100, 1) if total_skus > 0 else 100

        # Delay risk from supplier data
        supplier_stats = df.groupby('supplier_id').agg(
            delay_rate=('on_time_delivery', lambda x: round((1 - x.mean()) * 100, 1))
        ).reset_index()
        avg_delay_risk = round(float(supplier_stats['delay_rate'].mean()), 1)

        # Additional stats
        total_records = len(df)
        date_range = f"{df['date'].min().strftime('%Y-%m-%d')} to {df['date'].max().strftime('%Y-%m-%d')}"

        return {
            "forecast_accuracy": forecast_accuracy,
            "forecast_mae": round(best_mae, 2),
            "forecast_rmse": round(best_rmse, 2),
            "best_model": best_model,
            "avg_delay_risk": avg_delay_risk,
            "inventory_health_pct": inventory_health_pct,
            "at_risk_sku_count": at_risk,
            "total_skus": total_skus,
            "risk_distribution": risk_counts,
            "total_records": total_records,
            "date_range": date_range,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
