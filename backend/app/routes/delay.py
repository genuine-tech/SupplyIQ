"""Delay Risk route."""

from fastapi import APIRouter, Request, HTTPException

router = APIRouter()


@router.get("/delay-risk")
def get_delay_risk(request: Request):
    """
    Calculate supplier delay risk scores from historical data.
    This is a transparent heuristic score, NOT an ML probability.
    Labeled as 'Delay Risk Score' for clarity.
    """
    try:
        df = request.app.state.dataset

        suppliers = []
        for (sid, sname), group in df.groupby(['supplier_id', 'supplier_name']):
            region = group['supplier_region'].mode().iloc[0] if 'supplier_region' in group.columns else 'Unknown'

            avg_lead_time = round(float(group['expected_lead_time'].mean()), 1)
            avg_actual = round(float(group['actual_delivery_days'].mean()), 1)
            avg_delay = round(float(group['delivery_delay'].clip(lower=0).mean()), 2)
            on_time_rate = round(float(group['on_time_delivery'].mean()) * 100, 1)
            delay_rate = round(100 - on_time_rate, 1)
            reliability = round(on_time_rate, 1)
            avg_route_risk = round(float(group['route_risk_score'].mean()) * 100, 1)
            avg_fulfillment = round(float(group['fulfillment_rate'].mean()) * 100, 1)

            # Composite delay risk score (0-100, higher = worse)
            # Weighted: 40% delay rate + 30% avg_delay/avg_lead_time + 30% route risk
            delay_ratio = min(avg_delay / max(avg_lead_time, 1), 1.0)
            risk_score = round(
                delay_rate * 0.4 +
                delay_ratio * 100 * 0.3 +
                avg_route_risk * 0.3,
                1
            )

            # Risk level
            if risk_score >= 60:
                risk_level = "CRITICAL"
            elif risk_score >= 40:
                risk_level = "HIGH"
            elif risk_score >= 20:
                risk_level = "MEDIUM"
            else:
                risk_level = "LOW"

            suppliers.append({
                "supplier_id": sid,
                "supplier_name": sname,
                "region": region,
                "avg_lead_time": avg_lead_time,
                "avg_actual_delivery": avg_actual,
                "avg_delay": avg_delay,
                "delay_rate": delay_rate,
                "on_time_rate": on_time_rate,
                "reliability": reliability,
                "avg_route_risk": avg_route_risk,
                "avg_fulfillment": avg_fulfillment,
                "risk_score": risk_score,
                "risk_level": risk_level,
                "score_label": "Delay Risk Score (not probability)",
            })

        # Sort by risk score descending
        suppliers.sort(key=lambda x: x['risk_score'], reverse=True)

        return {"suppliers": suppliers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
