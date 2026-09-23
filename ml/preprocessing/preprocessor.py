"""
SupplyChainIQ - Preprocessing Pipeline
Handles data cleaning, categorical encoding, quality audits, and chronological splitting.
"""

import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any


class DataPreprocessor:
    """Preprocessor for supply chain data."""

    def __init__(self):
        self.categorical_cols = ['sku_id', 'category', 'warehouse', 'supplier_id', 'supplier_region']
        self.label_encoders = {}
        self.fitted = False

    def audit_data_quality(self, df: pd.DataFrame) -> Dict[str, Any]:
        """Audit dataset quality, missing values, outliers, and duplicates."""
        total_records = len(df)
        missing_count = int(df.isnull().sum().sum())
        duplicates = int(df.duplicated(subset=['date', 'sku_id']).sum())

        # Outlier audit on demand using IQR
        q1 = df['demand'].quantile(0.25)
        q3 = df['demand'].quantile(0.75)
        iqr = q3 - q1
        outliers = df[(df['demand'] < (q1 - 1.5 * iqr)) | (df['demand'] > (q3 + 1.5 * iqr))]
        outlier_count = int(len(outliers))
        outlier_pct = round((outlier_count / total_records) * 100, 2) if total_records > 0 else 0.0

        return {
            "total_records": total_records,
            "missing_values": missing_count,
            "duplicate_records": duplicates,
            "outlier_count": outlier_count,
            "outlier_pct": outlier_pct,
            "date_range": {
                "start": str(df['date'].min()),
                "end": str(df['date'].max())
            },
            "skus_monitored": int(df['sku_id'].nunique()),
            "status": "PASSED" if missing_count == 0 and duplicates == 0 else "WARNING"
        }

    def clean(self, df: pd.DataFrame) -> pd.DataFrame:
        """Clean and sort dataframe."""
        df_clean = df.copy()
        df_clean['date'] = pd.to_datetime(df_clean['date'])
        # Sort chronologically by date and SKU
        df_clean = df_clean.sort_values(['date', 'sku_id']).reset_index(drop=True)
        # Forward-fill any missing numeric fields if present
        df_clean = df_clean.ffill().bfill()
        return df_clean

    def fit_transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Fit categorical encodings and transform dataset."""
        df_encoded = self.clean(df)

        for col in self.categorical_cols:
            if col in df_encoded.columns:
                unique_vals = sorted(df_encoded[col].unique().tolist())
                val_to_idx = {val: idx for idx, val in enumerate(unique_vals)}
                self.label_encoders[col] = val_to_idx
                df_encoded[f'{col}_encoded'] = df_encoded[col].map(val_to_idx).fillna(-1).astype(int)

        self.fitted = True
        return df_encoded

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transform new data using saved encodings."""
        if not self.fitted:
            raise ValueError("Preprocessor has not been fitted yet.")
        df_encoded = self.clean(df)

        for col, mapping in self.label_encoders.items():
            if col in df_encoded.columns:
                df_encoded[f'{col}_encoded'] = df_encoded[col].map(mapping).fillna(-1).astype(int)

        return df_encoded

    @staticmethod
    def split_chronologically(
        df: pd.DataFrame,
        train_ratio: float = 0.70,
        val_ratio: float = 0.15,
        test_ratio: float = 0.15
    ) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
        """
        Split time-series data chronologically to eliminate look-ahead leakage.
        Default: 70% Train, 15% Validation, 15% Holdout Test.
        """
        unique_dates = sorted(df['date'].unique())
        n_dates = len(unique_dates)

        train_cutoff = unique_dates[int(n_dates * train_ratio)]
        val_cutoff = unique_dates[int(n_dates * (train_ratio + val_ratio))]

        train_df = df[df['date'] < train_cutoff].copy()
        val_df = df[(df['date'] >= train_cutoff) & (df['date'] < val_cutoff)].copy()
        test_df = df[df['date'] >= val_cutoff].copy()

        return train_df, val_df, test_df
