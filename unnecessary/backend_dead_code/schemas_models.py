from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ForecastRequest(BaseModel):
    sku_id: str
    horizon_days: int = 30

class ForecastResponse(BaseModel):
    sku_id: str
    predictions: List[Dict[str, Any]]
    historical_demand: List[Dict[str, Any]]
    model_name: str
    metrics: Dict[str, Any]
