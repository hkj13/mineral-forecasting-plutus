# Data Dictionary

## Trade Data (`trade_data.csv`)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| date | datetime | Trade month start date | 2023-04-01 |
| year | int | Calendar year | 2023 |
| month | int | Calendar month (1-12) | 4 |
| fiscal_year | string | Indian fiscal year | FY2023-24 |
| mineral | string | Mineral name | Copper |
| flow | string | Trade direction | Import / Export |
| hs_code | string | 8-digit ITC-HS code | 26030010 |
| country | string | Trading partner country | Chile |
| port | string | Indian port of entry/exit | JNPT Mumbai |
| state | string | Indian state (if available) | Maharashtra |
| value_usd_mn | float | Trade value in USD million | 125.50 |
| value_inr_cr | float | Trade value in INR crore | 1041.65 |
| quantity_mt | float | Quantity in metric tonnes | 12500.00 |
| unit_price_usd_mt | float | Unit price USD per MT | 10040.00 |

## Global Prices (`global_prices.csv`)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| date | datetime | Price observation date | 2023-04-01 |
| mineral | string | Mineral name | Copper |
| price_usd_mt | float | Price in USD per MT | 8450.00 |
| price_change_pct | float | Monthly price change % | 2.5 |

## Domestic Production (`domestic_production.csv`)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| date | datetime | Production month | 2023-04-01 |
| mineral | string | Mineral name | Graphite |
| state | string | Producing state | Tamil Nadu |
| production_mt | float | Production in MT | 15000.00 |
| value_inr_cr | float | Production value in INR crore | 750.00 |

## Dependency Metrics (`dependency_metrics.csv`)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| mineral | string | Mineral name | Lithium |
| date | datetime | Calculation date | 2023-04-01 |
| import_value | float | Monthly import value | 85.00 |
| import_qty | float | Monthly import quantity | 2500.00 |
| export_value | float | Monthly export value | 2.00 |
| export_qty | float | Monthly export quantity | 50.00 |
| production_mt | float | Domestic production | 0.00 |
| trade_balance | float | Export - Import value | -83.00 |
| total_supply | float | Imports + Production | 2500.00 |
| dependency_ratio | float | Import / Total Supply | 1.00 |
| hhi | float | Herfindahl-Hirschman Index | 0.28 |

## HS Codes Mapping (`hs_codes_mapping.csv`)

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| mineral | string | Mineral name | Copper |
| form_of_trade | string | Trade form | Ores & Concentrates |
| hs_code_8digit | string | 8-digit ITC-HS code | 26030010 |
| hs_chapter | int | HS Chapter number | 26 |
| description | string | Code description | Copper ores primary |
| primary_applications | string | Main uses | Electrical, Electronics |

## Key HS Chapters for Critical Minerals

| Chapter | Description | Minerals Covered |
|---------|-------------|------------------|
| 25 | Salt, sulphur, earths, stones | Graphite, Potash, Strontium |
| 26 | Ores, slag and ash | Copper, Nickel, Cobalt, Titanium, Vanadium |
| 28 | Inorganic chemicals | Lithium, REE, Cobalt oxides |
| 38 | Miscellaneous chemicals | Artificial graphite |
| 71 | Precious metals | PGE, Gold compounds |
| 72-83 | Base metals | Ferro-alloys, refined metals |

## Data Quality Notes

1. **Missing Values**: Imputed using forward-fill for time series continuity
2. **Outliers**: Values beyond 3 standard deviations flagged for review
3. **Currency Conversion**: USD to INR using monthly average RBI reference rates
4. **Aggregation**: Raw data aggregated to monthly level for modeling
