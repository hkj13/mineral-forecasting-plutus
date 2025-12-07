# API Specification

## Base URL

```
Development: http://localhost:8000
Production: https://api.mineral-forecast.example.com
```

## Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "judge@plutus.iitism.ac.in",
  "password": "Plutus2025!"
}
```

Response:
```json
{
  "success": true,
  "user": { "email": "judge@plutus.iitism.ac.in", "role": "judge" },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## Endpoints

### GET /minerals
Get list of supported minerals with metadata.

Response:
```json
{
  "minerals": [
    {
      "name": "Copper",
      "symbol": "Cu",
      "hs_chapters": [26, 74],
      "primary_use": "Electrical Wiring, Electronics, Construction",
      "dependency_ratio": 0.85
    }
  ]
}
```

### GET /trade/{mineral}
Get trade data for a specific mineral.

Parameters:
- `mineral` (path): Mineral name (Copper, Lithium, Graphite)
- `flow` (query, optional): "Import" or "Export"
- `start_date` (query, optional): ISO date string
- `end_date` (query, optional): ISO date string
- `country` (query, optional): Filter by trading partner
- `aggregation` (query, optional): "monthly" (default), "quarterly", "annual"

Response:
```json
{
  "mineral": "Copper",
  "data": [
    {
      "date": "2023-04-01T00:00:00",
      "flow": "Import",
      "value_usd_mn": 450.5,
      "quantity_mt": 45000
    }
  ],
  "summary": {
    "total_import_value_mn": 5400.0,
    "total_export_value_mn": 1020.0,
    "trade_balance_mn": -4380.0,
    "top_countries": { "Chile": 1260.0, "Indonesia": 810.0 },
    "date_range": { "start": "2017-04-01", "end": "2024-12-01" }
  }
}
```

### POST /forecast
Generate forecast for a mineral.

Request:
```json
{
  "mineral": "Copper",
  "horizon_months": 12,
  "model_type": "hybrid",
  "confidence_level": 0.90
}
```

Response:
```json
{
  "mineral": "Copper",
  "model_type": "hybrid",
  "horizon_months": 12,
  "confidence_level": 0.90,
  "forecast_dates": ["2025-01-01", "2025-02-01", ...],
  "forecast_values": [485.2, 492.1, ...],
  "lower_bound": [420.5, 425.8, ...],
  "upper_bound": [549.9, 558.4, ...],
  "metrics": {
    "mae": 9.2,
    "mape": 3.2,
    "rmse": 13.4,
    "r2": 0.94
  },
  "generated_at": "2025-01-07T12:00:00Z"
}
```

### POST /scenarios/simulate
Simulate what-if scenarios.

Request:
```json
{
  "mineral": "Lithium",
  "scenario_type": "import_ban",
  "magnitude": 0.42,
  "affected_country": "China",
  "duration_months": 12
}
```

Response:
```json
{
  "scenario_type": "import_ban",
  "mineral": "Lithium",
  "magnitude": 0.42,
  "affected_country": "China",
  "duration_months": 12,
  "baseline_forecast": [85.0, 86.5, ...],
  "scenario_forecast": [59.5, 60.5, ...],
  "forecast_dates": ["2025-01-01", ...],
  "impact_analysis": {
    "total_baseline_value_mn": 1020.0,
    "total_scenario_value_mn": 714.0,
    "absolute_change_mn": -306.0,
    "percent_change": -30.0,
    "policy_implications": [
      "Immediate supply disruption requiring alternative sourcing",
      "Price volatility expected in short-term"
    ]
  }
}
```

### GET /metrics/dependency
Get import dependency metrics.

Parameters:
- `mineral` (query, optional): Filter by mineral

Response:
```json
{
  "Copper": {
    "current_dependency_ratio": 0.85,
    "previous_year_ratio": 0.83,
    "trend": "increasing",
    "top_3_suppliers": ["Chile", "Indonesia", "Australia"],
    "hhi_concentration": 0.18,
    "strategic_risk": "medium",
    "domestic_reserves_mt": 1500000,
    "annual_consumption_mt": 650000
  }
}
```

### GET /metrics/trade-balance
Get trade balance trends.

Parameters:
- `start_year` (query): Start year (default: 2017)
- `end_year` (query): End year (default: 2024)

### GET /analytics/anova
Get ANOVA analysis results.

Parameters:
- `group_by` (query): "mineral", "year", "quarter", or "country"

Response:
```json
{
  "f_statistic": 45.67,
  "p_value": 0.0001,
  "effect_size_eta_squared": 0.34,
  "significant": true,
  "interpretation": "Statistically significant differences exist...",
  "post_hoc": {
    "Copper vs Lithium": { "mean_diff": 365.2, "p_adj": 0.001, "significant": true }
  }
}
```

### GET /analytics/decomposition/{mineral}
Get seasonal decomposition for a mineral.

### GET /analytics/network/{mineral}
Get trade partner network data.

### GET /policy/simulator
Run policy dependency reduction simulator.

Parameters:
- `mineral` (query): Target mineral
- `target_dependency_ratio` (query): Target ratio (0-1)
- `annual_production_increase_pct` (query): Annual increase %

---

## Error Responses

```json
{
  "detail": "Error message description"
}
```

Status Codes:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
