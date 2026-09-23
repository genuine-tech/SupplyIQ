"""Forecast and Products routes."""

from fastapi import APIRouter, Request, HTTPException
from pydantic import BaseModel, Field
from typing import Optional
from backend.app.services.forecast_service import ForecastService

router = APIRouter()


class ForecastRequest(BaseModel):
    sku_id: str = Field(..., min_length=1, description="Unique identifier of the SKU")
    horizon_days: int = Field(default=7, ge=1, le=90, description="Forecast horizon in days (1-90)")


@router.post("/forecast")
def get_forecast(req: ForecastRequest, request: Request):
    """Generate demand forecast for a specific SKU and horizon."""
    try:
        if not getattr(request.app.state, 'models_loaded', False):
            raise HTTPException(status_code=503, detail="Models not loaded")

        result = ForecastService.generate_forecast(
            request.app.state, req.sku_id, req.horizon_days
        )
        return result
    except ValueError as ve:
        raise HTTPException(status_code=404, detail=str(ve))
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/products")
def get_products(request: Request):
    """List all available products/SKUs."""
    try:
        df = request.app.state.dataset
        products = (
            df.groupby('sku_id')
            .agg(
                product_name=('product_name', 'first'),
                category=('category', 'first'),
                warehouse=('warehouse', 'first'),
                supplier_id=('supplier_id', 'first'),
            )
            .reset_index()
            .to_dict(orient='records')
        )
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
