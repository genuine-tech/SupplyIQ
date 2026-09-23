"""
SupplyChainIQ - Synthetic Dataset Generator
Generates realistic supply chain time-series data covering ~2 years of operations.
Total records: ~10,997 rows across 15 SKUs, 5 Suppliers, and 3 Warehouses.
"""

import os
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(DATA_DIR, "supply_chain_data.csv")

PRODUCTS = [
    {"sku_id": "SKU-001", "name": "Industrial Servo Motor", "category": "Mechanical", "base_demand": 140, "price": 280.0},
    {"sku_id": "SKU-002", "name": "Microcontroller Board MCU-32", "category": "Electronics", "base_demand": 210, "price": 45.0},
    {"sku_id": "SKU-003", "name": "High-Torque Stepper Motor", "category": "Mechanical", "base_demand": 95, "price": 120.0},
    {"sku_id": "SKU-004", "name": "Hydraulic Actuator Pump", "category": "Mechanical", "base_demand": 60, "price": 420.0},
    {"sku_id": "SKU-005", "name": "Thermal Sensor Probe", "category": "Electronics", "base_demand": 180, "price": 32.0},
    {"sku_id": "SKU-006", "name": "Lithium-Ion Power Cell 48V", "category": "Thermal & Power", "base_demand": 125, "price": 310.0},
    {"sku_id": "SKU-007", "name": "Optical Fiber Transceiver", "category": "Electronics", "base_demand": 160, "price": 85.0},
    {"sku_id": "SKU-008", "name": "Pneumatic Control Valve", "category": "Mechanical", "base_demand": 110, "price": 145.0},
    {"sku_id": "SKU-009", "name": "Precision Ball Bearing Set", "category": "Mechanical", "base_demand": 250, "price": 28.0},
    {"sku_id": "SKU-010", "name": "Solid State Relay SSR-40", "category": "Electronics", "base_demand": 175, "price": 55.0},
    {"sku_id": "SKU-011", "name": "Copper Heat Sink 120mm", "category": "Thermal & Power", "base_demand": 130, "price": 38.0},
    {"sku_id": "SKU-012", "name": "Polymer Gasket Seal Kit", "category": "Structural & Hardware", "base_demand": 220, "price": 18.0},
    {"sku_id": "SKU-013", "name": "Brushless DC Motor 24V", "category": "Mechanical", "base_demand": 85, "price": 195.0},
    {"sku_id": "SKU-014", "name": "Linear Motion Rail 500mm", "category": "Structural & Hardware", "base_demand": 70, "price": 165.0},
    {"sku_id": "SKU-015", "name": "Aluminum Extrusion Profile", "category": "Structural & Hardware", "base_demand": 190, "price": 62.0},
]

SUPPLIERS = [
    {"id": "SUP-001", "name": "Apex Global Logistics", "region": "North America", "base_lt": 5, "delay_prob": 0.12, "route_risk": 0.22},
    {"id": "SUP-002", "name": "Nexus Component Fab", "region": "East Asia", "base_lt": 12, "delay_prob": 0.28, "route_risk": 0.58},
    {"id": "SUP-003", "name": "Starlight Precision Ltd", "region": "Western Europe", "base_lt": 8, "delay_prob": 0.16, "route_risk": 0.35},
    {"id": "SUP-004", "name": "Vanguard Industrial Supply", "region": "Southeast Asia", "base_lt": 14, "delay_prob": 0.32, "route_risk": 0.65},
    {"id": "SUP-005", "name": "Pacific Freight Dynamics", "region": "South Asia", "base_lt": 10, "delay_prob": 0.22, "route_risk": 0.44},
]

WAREHOUSES = ["WH-North", "WH-Central", "WH-South"]

def generate_dataset(num_days: int = 733, seed: int = 42) -> pd.DataFrame:
    """Generate realistic daily supply chain time-series."""
    np.random.seed(seed)
    start_date = datetime(2024, 1, 1)
    records = []

    sku_configs = {}
    for idx, prod in enumerate(PRODUCTS):
        supplier = SUPPLIERS[idx % len(SUPPLIERS)]
        warehouse = WAREHOUSES[idx % len(WAREHOUSES)]
        sku_configs[prod["sku_id"]] = {
            "supplier": supplier,
            "warehouse": warehouse
        }

    for day in range(num_days):
        current_date = start_date + timedelta(days=day)
        day_of_week = current_date.weekday()
        day_of_year = current_date.timetuple().tm_yday
        is_weekend = 1 if day_of_week >= 5 else 0

        # Global annual and weekly seasonality
        annual_cycle = 1.0 + 0.15 * np.sin(2 * np.pi * (day_of_year - 60) / 365.25)
        weekday_weights = [1.12, 1.15, 1.10, 1.08, 0.98, 0.78, 0.72]
        dow_mult = weekday_weights[day_of_week]
        trend_mult = 1.0 + (day / num_days) * 0.12

        for prod in PRODUCTS:
            sku_id = prod["sku_id"]
            cfg = sku_configs[sku_id]
            sup = cfg["supplier"]
            wh = cfg["warehouse"]

            base = prod["base_demand"]
            noise = np.random.normal(0, base * 0.08)
            spike = np.random.uniform(base * 0.3, base * 0.5) if np.random.random() < 0.02 else 0.0

            raw_demand = (base * annual_cycle * dow_mult * trend_mult) + noise + spike
            demand = max(int(round(raw_demand)), 1)

            exp_lt = sup["base_lt"] + int(prod["sku_id"].split("-")[1]) % 3
            is_delayed = np.random.random() < sup["delay_prob"]
            delay_days = int(np.random.exponential(3) + 1) if is_delayed else 0
            actual_lt = exp_lt + delay_days
            on_time = 0 if delay_days > 0 else 1
            fulfillment = round(np.clip(np.random.normal(0.97 if on_time else 0.88, 0.03), 0.70, 1.0), 3)

            avg_daily = base
            safety_stock = int(round(avg_daily * np.sqrt(exp_lt) * 0.8))
            reorder_point = int(round(avg_daily * exp_lt + safety_stock))
            inv_noise = np.random.normal(0, avg_daily * 2)
            inventory_level = max(int(round(reorder_point * 1.2 + inv_noise)), int(avg_daily * 2))

            order_qty = int(round(avg_daily * 14 + np.random.normal(0, avg_daily * 2)))

            records.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "sku_id": sku_id,
                "product_name": prod["name"],
                "category": prod["category"],
                "warehouse": wh,
                "supplier_id": sup["id"],
                "supplier_name": sup["name"],
                "supplier_region": sup["region"],
                "demand": demand,
                "inventory_level": inventory_level,
                "reorder_point": reorder_point,
                "safety_stock": safety_stock,
                "expected_lead_time": exp_lt,
                "actual_delivery_days": actual_lt,
                "delivery_delay": delay_days,
                "on_time_delivery": on_time,
                "fulfillment_rate": fulfillment,
                "route_risk_score": sup["route_risk"],
                "order_quantity": max(order_qty, 50),
                "unit_price": prod["price"]
            })

    df = pd.DataFrame(records)
    return df

if __name__ == "__main__":
    os.makedirs(DATA_DIR, exist_ok=True)
    print(f"Generating supply chain dataset...")
    df = generate_dataset(num_days=733, seed=42)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Dataset successfully generated at {OUTPUT_FILE}")
    print(f"Total rows: {len(df)}, Columns: {len(df.columns)}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"SKUs: {df['sku_id'].nunique()}, Suppliers: {df['supplier_id'].nunique()}")
