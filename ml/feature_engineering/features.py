"""
SupplyChainIQ - Feature Engineering Pipeline
Constructs auto-regressive lags, rolling window statistics, calendar signals,
and domain-specific supply chain ratios.
"""

import numpy as np
import pandas as pd
from typing import List


class FeatureEngineer:
    """Feature engineering pipeline for demand forecasting."""

    def __init__(self):
        self.lag_windows = [1, 3, 7, 14, 28]
        self.rolling_windows = [7, 14, 28]
        self.feature_columns: List[str] = []

    def get_feature_columns(self) -> List[str]:
        """Return list of engineered feature names used for model input."""
        return self.feature_columns

    def generate_features(self, df: pd.DataFrame, drop_na: bool = True) -> pd.DataFrame:
        """
        Generate temporal, rolling, lag, and supply-chain features.
        Calculations are performed per SKU to respect time series boundaries.
        """
        df_feat = df.copy()
        df_feat['date'] = pd.to_datetime(df_feat['date'])
        df_feat = df_feat.sort_values(['sku_id', 'date']).reset_index(drop=True)

        # 1. Calendar Features
        df_feat['day_of_week'] = df_feat['date'].dt.weekday
        df_feat['day_of_month'] = df_feat['date'].dt.day
        df_feat['month'] = df_feat['date'].dt.month
        df_feat['quarter'] = df_feat['date'].dt.quarter
        df_feat['week_of_year'] = df_feat['date'].dt.isocalendar().week.astype(int)
        df_feat['is_weekend'] = (df_feat['day_of_week'] >= 5).astype(int)
        df_feat['is_month_end'] = (df_feat['day_of_month'] >= 28).astype(int)

        # 2. Lag Features (grouped by sku_id)
        for lag in self.lag_windows:
            df_feat[f'lag_{lag}'] = df_feat.groupby('sku_id')['demand'].shift(lag)

        # 3. Rolling Window Statistics (grouped by sku_id, shifted by 1 to prevent data leakage)
        for window in self.rolling_windows:
            rolled = df_feat.groupby('sku_id')['demand'].shift(1).rolling(window=window)
            df_feat[f'rolling_mean_{window}'] = rolled.mean()
            df_feat[f'rolling_std_{window}'] = rolled.std().fillna(0)

        # 4. Supply Chain & Domain Specific Features
        lag_7_safe = df_feat['lag_7'].fillna(df_feat['demand'].mean())
        lag_1_safe = df_feat['lag_1'].fillna(df_feat['demand'].mean()).clip(lower=1)
        exp_lt = df_feat['expected_lead_time'].fillna(7)
        inv = df_feat['inventory_level'].fillna(0)

        # Lead time demand estimate
        df_feat['lt_demand_estimate'] = (lag_7_safe * exp_lt) / 7.0

        # Inventory coverage days & stock demand ratio
        df_feat['inventory_coverage_days'] = inv / lag_7_safe.clip(lower=1)
        df_feat['stock_demand_ratio'] = inv / lag_1_safe

        # Short-term vs long-term trend
        rm7 = df_feat['rolling_mean_7'].fillna(df_feat['demand'].mean())
        rm28 = df_feat['rolling_mean_28'].fillna(df_feat['demand'].mean())
        df_feat['trend_short_long'] = rm7 - rm28

        # Demand change rate
        lag3_safe = df_feat['lag_3'].fillna(df_feat['demand'].mean()).clip(lower=1)
        df_feat['demand_change_rate'] = (lag_1_safe - lag3_safe) / lag3_safe

        # Backfill initial window NaNs within each SKU
        numeric_cols = [c for c in df_feat.columns if c not in ['date', 'sku_id', 'product_name', 'category', 'warehouse', 'supplier_id', 'supplier_name', 'supplier_region']]
        df_feat[numeric_cols] = df_feat.groupby('sku_id')[numeric_cols].bfill().ffill()

        if drop_na:
            df_feat = df_feat.dropna(subset=[f'lag_{max(self.lag_windows)}']).reset_index(drop=True)

        # Define model feature columns list
        categorical_encoded = [c for c in df_feat.columns if c.endswith('_encoded')]
        feature_cols = [
            'lag_1', 'lag_3', 'lag_7', 'lag_14', 'lag_28',
            'rolling_mean_7', 'rolling_std_7',
            'rolling_mean_14', 'rolling_std_14',
            'rolling_mean_28', 'rolling_std_28',
            'day_of_week', 'day_of_month', 'month', 'quarter', 'week_of_year',
            'is_weekend', 'is_month_end',
            'inventory_level', 'reorder_point', 'safety_stock',
            'expected_lead_time', 'fulfillment_rate', 'route_risk_score', 'unit_price',
            'lt_demand_estimate', 'inventory_coverage_days', 'stock_demand_ratio',
            'trend_short_long', 'demand_change_rate'
        ] + sorted(categorical_encoded)

        self.feature_columns = [c for c in feature_cols if c in df_feat.columns]
        return df_feat
