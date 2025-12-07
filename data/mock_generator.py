"""
Mock Data Generator for Mineral Forecasting
Generates realistic synthetic EXIM trade data for Copper, Lithium, and Graphite
Based on real distributional properties from Indian trade statistics
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import json
import os

# Set random seed for reproducibility
np.random.seed(42)

# Configuration
MINERALS = ['Copper', 'Lithium', 'Graphite']
START_DATE = '2017-04-01'
END_DATE = '2024-12-31'

# Real-world inspired base parameters (derived from DGCI&S statistics)
MINERAL_PARAMS = {
    'Copper': {
        'base_import_value_usd_mn': 450,  # Monthly base
        'base_export_value_usd_mn': 85,
        'base_import_qty_mt': 45000,
        'base_export_qty_mt': 8500,
        'import_trend': 0.008,  # Monthly growth rate
        'export_trend': 0.003,
        'seasonality_amplitude': 0.15,
        'volatility': 0.12,
        'dependency_ratio': 0.85,
        'top_suppliers': {
            'Chile': 0.28,
            'Indonesia': 0.18,
            'Australia': 0.12,
            'Peru': 0.10,
            'Japan': 0.08,
            'South Korea': 0.06,
            'Philippines': 0.05,
            'Others': 0.13
        },
        'top_destinations': {
            'United Arab Emirates': 0.22,
            'China': 0.18,
            'Nepal': 0.12,
            'Bangladesh': 0.10,
            'United States': 0.08,
            'Others': 0.30
        },
        'hs_codes': ['26030010', '26030090', '74031100', '74031200', '74031300', '74010010', '74020010']
    },
    'Lithium': {
        'base_import_value_usd_mn': 85,
        'base_export_value_usd_mn': 2,
        'base_import_qty_mt': 2500,
        'base_export_qty_mt': 50,
        'import_trend': 0.025,  # High growth due to EV demand
        'export_trend': 0.005,
        'seasonality_amplitude': 0.08,
        'volatility': 0.20,
        'dependency_ratio': 0.99,
        'top_suppliers': {
            'China': 0.42,
            'Chile': 0.22,
            'Argentina': 0.12,
            'Australia': 0.10,
            'Belgium': 0.05,
            'Japan': 0.04,
            'Others': 0.05
        },
        'top_destinations': {
            'United Arab Emirates': 0.35,
            'Singapore': 0.20,
            'Nepal': 0.15,
            'Others': 0.30
        },
        'hs_codes': ['25309099', '28369100', '28252000', '28259010', '28273920']
    },
    'Graphite': {
        'base_import_value_usd_mn': 65,
        'base_export_value_usd_mn': 25,
        'base_import_qty_mt': 85000,
        'base_export_qty_mt': 32000,
        'import_trend': 0.012,
        'export_trend': 0.008,
        'seasonality_amplitude': 0.10,
        'volatility': 0.15,
        'dependency_ratio': 0.72,
        'top_suppliers': {
            'China': 0.58,
            'Mozambique': 0.12,
            'Madagascar': 0.08,
            'Sri Lanka': 0.06,
            'Japan': 0.05,
            'Germany': 0.04,
            'Others': 0.07
        },
        'top_destinations': {
            'United States': 0.18,
            'Japan': 0.15,
            'Germany': 0.12,
            'United Kingdom': 0.10,
            'Others': 0.45
        },
        'hs_codes': ['25041010', '25041020', '25041090', '38011000', '38012000']
    }
}

# Indian ports for trade
PORTS = ['JNPT Mumbai', 'Chennai', 'Mundra', 'Kolkata', 'Visakhapatnam', 'Kandla', 'Cochin', 'Tuticorin']

# Indian states (for GST mapping)
STATES = ['Maharashtra', 'Gujarat', 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'West Bengal', 'Odisha', 'Rajasthan']

def generate_date_range(start_date: str, end_date: str) -> pd.DatetimeIndex:
    """Generate monthly date range"""
    return pd.date_range(start=start_date, end=end_date, freq='MS')

def generate_seasonal_component(dates: pd.DatetimeIndex, amplitude: float) -> np.ndarray:
    """Generate seasonal pattern (fiscal year cycle in India)"""
    # Indian fiscal year starts April, peak activity in Q4 (Jan-Mar)
    month_factors = np.array([0.9, 0.85, 1.15, 1.1, 0.95, 0.9, 0.85, 0.9, 1.0, 1.05, 1.1, 1.2])
    seasonal = np.array([month_factors[d.month - 1] for d in dates])
    return 1 + amplitude * (seasonal - 1)

def generate_trend_component(n_periods: int, trend_rate: float) -> np.ndarray:
    """Generate exponential trend component"""
    return np.exp(np.arange(n_periods) * trend_rate)

def generate_noise(n_periods: int, volatility: float) -> np.ndarray:
    """Generate multiplicative noise with some autocorrelation"""
    noise = np.random.normal(0, volatility, n_periods)
    # Add autocorrelation
    for i in range(1, len(noise)):
        noise[i] = 0.3 * noise[i-1] + 0.7 * noise[i]
    return 1 + noise

def add_structural_breaks(series: np.ndarray, dates: pd.DatetimeIndex) -> np.ndarray:
    """Add structural breaks for known events (COVID, supply chain disruptions)"""
    result = series.copy()
    for i, date in enumerate(dates):
        # COVID impact (Apr 2020 - Jun 2020)
        if date >= pd.Timestamp('2020-04-01') and date <= pd.Timestamp('2020-06-01'):
            result[i] *= 0.65
        # Recovery and supply chain issues (late 2021)
        elif date >= pd.Timestamp('2021-09-01') and date <= pd.Timestamp('2022-03-01'):
            result[i] *= 1.15
        # Lithium price spike (2022)
        elif date >= pd.Timestamp('2022-03-01') and date <= pd.Timestamp('2022-12-01'):
            result[i] *= 1.08
    return result

def distribute_by_country(total_value: float, country_shares: dict) -> dict:
    """Distribute total value across countries"""
    return {country: total_value * share for country, share in country_shares.items()}

def generate_mineral_data(mineral: str, params: dict) -> pd.DataFrame:
    """Generate complete trade data for a single mineral"""
    dates = generate_date_range(START_DATE, END_DATE)
    n_periods = len(dates)
    
    records = []
    
    for flow in ['Import', 'Export']:
        if flow == 'Import':
            base_value = params['base_import_value_usd_mn']
            base_qty = params['base_import_qty_mt']
            trend_rate = params['import_trend']
            countries = params['top_suppliers']
        else:
            base_value = params['base_export_value_usd_mn']
            base_qty = params['base_export_qty_mt']
            trend_rate = params['export_trend']
            countries = params['top_destinations']
        
        # Generate base time series
        trend = generate_trend_component(n_periods, trend_rate)
        seasonal = generate_seasonal_component(dates, params['seasonality_amplitude'])
        noise = generate_noise(n_periods, params['volatility'])
        
        values = base_value * trend * seasonal * noise
        values = add_structural_breaks(values, dates)
        
        quantities = base_qty * trend * seasonal * generate_noise(n_periods, params['volatility'] * 0.8)
        quantities = add_structural_breaks(quantities, dates)
        
        for i, date in enumerate(dates):
            country_values = distribute_by_country(values[i], countries)
            country_qtys = distribute_by_country(quantities[i], countries)
            
            for country, value in country_values.items():
                # Add some per-country noise
                country_noise = np.random.uniform(0.85, 1.15)
                final_value = value * country_noise
                final_qty = country_qtys[country] * country_noise
                
                # Select random HS code and port
                hs_code = np.random.choice(params['hs_codes'])
                port = np.random.choice(PORTS)
                state = np.random.choice(STATES)
                
                records.append({
                    'date': date,
                    'year': date.year,
                    'month': date.month,
                    'fiscal_year': f"FY{date.year}-{str(date.year+1)[-2:]}" if date.month >= 4 else f"FY{date.year-1}-{str(date.year)[-2:]}",
                    'mineral': mineral,
                    'flow': flow,
                    'hs_code': hs_code,
                    'country': country,
                    'port': port,
                    'state': state,
                    'value_usd_mn': round(final_value, 3),
                    'value_inr_cr': round(final_value * 8.3, 3),  # Approximate USD to INR crore
                    'quantity_mt': round(final_qty, 2),
                    'unit_price_usd_mt': round((final_value * 1e6) / max(final_qty, 1), 2)
                })
    
    return pd.DataFrame(records)

def generate_global_prices() -> pd.DataFrame:
    """Generate global commodity price data"""
    dates = generate_date_range(START_DATE, END_DATE)
    
    base_prices = {
        'Copper': 6500,  # USD per MT (LME)
        'Lithium': 12000,  # USD per MT (Lithium Carbonate)
        'Graphite': 1200  # USD per MT
    }
    
    records = []
    for mineral, base_price in base_prices.items():
        n_periods = len(dates)
        trend = generate_trend_component(n_periods, 0.005)
        seasonal = generate_seasonal_component(dates, 0.08)
        noise = generate_noise(n_periods, 0.15)
        
        prices = base_price * trend * seasonal * noise
        
        # Add Lithium price spike in 2022
        if mineral == 'Lithium':
            for i, date in enumerate(dates):
                if date >= pd.Timestamp('2022-01-01') and date <= pd.Timestamp('2022-12-01'):
                    prices[i] *= 3.5  # Historic lithium price spike
                elif date >= pd.Timestamp('2023-01-01'):
                    prices[i] *= 1.5  # Normalized but higher
        
        for i, date in enumerate(dates):
            records.append({
                'date': date,
                'mineral': mineral,
                'price_usd_mt': round(prices[i], 2),
                'price_change_pct': round(np.random.uniform(-5, 5), 2)
            })
    
    return pd.DataFrame(records)

def generate_domestic_production() -> pd.DataFrame:
    """Generate domestic mineral production data"""
    dates = generate_date_range(START_DATE, END_DATE)
    
    # India has significant Graphite production, minimal Lithium, growing Copper
    base_production = {
        'Copper': {'base': 3500, 'trend': 0.002, 'states': ['Rajasthan', 'Madhya Pradesh', 'Jharkhand']},
        'Lithium': {'base': 0, 'trend': 0, 'states': ['Jammu & Kashmir']},  # Recently discovered
        'Graphite': {'base': 15000, 'trend': 0.005, 'states': ['Tamil Nadu', 'Odisha', 'Jharkhand', 'Rajasthan']}
    }
    
    records = []
    for mineral, params in base_production.items():
        n_periods = len(dates)
        if params['base'] > 0:
            trend = generate_trend_component(n_periods, params['trend'])
            seasonal = generate_seasonal_component(dates, 0.1)
            noise = generate_noise(n_periods, 0.1)
            production = params['base'] * trend * seasonal * noise
        else:
            production = np.zeros(n_periods)
            # Add Lithium production starting 2024 (J&K discovery)
            for i, date in enumerate(dates):
                if date >= pd.Timestamp('2024-06-01'):
                    production[i] = 50 * (1 + 0.1 * (i - n_periods + 7))
        
        for i, date in enumerate(dates):
            if production[i] > 0:
                state = np.random.choice(params['states']) if params['states'] else 'Unknown'
                records.append({
                    'date': date,
                    'mineral': mineral,
                    'state': state,
                    'production_mt': round(production[i], 2),
                    'value_inr_cr': round(production[i] * 0.05, 2)
                })
    
    return pd.DataFrame(records)

def calculate_dependency_metrics(trade_df: pd.DataFrame, production_df: pd.DataFrame) -> pd.DataFrame:
    """Calculate import dependency ratios and trade balance metrics"""
    # Aggregate by mineral and date
    imports = trade_df[trade_df['flow'] == 'Import'].groupby(['mineral', 'date']).agg({
        'value_usd_mn': 'sum',
        'quantity_mt': 'sum'
    }).reset_index()
    imports.columns = ['mineral', 'date', 'import_value', 'import_qty']
    
    exports = trade_df[trade_df['flow'] == 'Export'].groupby(['mineral', 'date']).agg({
        'value_usd_mn': 'sum',
        'quantity_mt': 'sum'
    }).reset_index()
    exports.columns = ['mineral', 'date', 'export_value', 'export_qty']
    
    production = production_df.groupby(['mineral', 'date']).agg({
        'production_mt': 'sum'
    }).reset_index()
    
    # Merge
    metrics = imports.merge(exports, on=['mineral', 'date'], how='outer').fillna(0)
    metrics = metrics.merge(production, on=['mineral', 'date'], how='left').fillna(0)
    
    # Calculate metrics
    metrics['trade_balance'] = metrics['export_value'] - metrics['import_value']
    metrics['total_supply'] = metrics['import_qty'] + metrics['production_mt']
    metrics['dependency_ratio'] = np.where(
        metrics['total_supply'] > 0,
        metrics['import_qty'] / metrics['total_supply'],
        1.0
    )
    metrics['hhi'] = 0.35  # Placeholder - would calculate from country concentration
    
    return metrics

def main():
    """Generate all mock data files"""
    print("Generating mock data for Mineral Forecasting...")
    
    # Create output directory
    output_dir = os.path.dirname(os.path.abspath(__file__))
    processed_dir = os.path.join(output_dir, 'processed')
    os.makedirs(processed_dir, exist_ok=True)
    
    # Generate trade data for each mineral
    all_trade_data = []
    for mineral in MINERALS:
        print(f"  Generating {mineral} trade data...")
        mineral_data = generate_mineral_data(mineral, MINERAL_PARAMS[mineral])
        all_trade_data.append(mineral_data)
    
    trade_df = pd.concat(all_trade_data, ignore_index=True)
    
    # Generate global prices
    print("  Generating global price data...")
    prices_df = generate_global_prices()
    
    # Generate domestic production
    print("  Generating domestic production data...")
    production_df = generate_domestic_production()
    
    # Calculate dependency metrics
    print("  Calculating dependency metrics...")
    metrics_df = calculate_dependency_metrics(trade_df, production_df)
    
    # Save all data
    trade_df.to_csv(os.path.join(processed_dir, 'trade_data.csv'), index=False)
    prices_df.to_csv(os.path.join(processed_dir, 'global_prices.csv'), index=False)
    production_df.to_csv(os.path.join(processed_dir, 'domestic_production.csv'), index=False)
    metrics_df.to_csv(os.path.join(processed_dir, 'dependency_metrics.csv'), index=False)
    
    # Create aggregated monthly data for modeling
    monthly_agg = trade_df.groupby(['mineral', 'date', 'flow']).agg({
        'value_usd_mn': 'sum',
        'quantity_mt': 'sum'
    }).reset_index()
    monthly_agg.to_csv(os.path.join(processed_dir, 'monthly_aggregated.csv'), index=False)
    
    # Create summary statistics
    summary = {
        'generated_at': datetime.now().isoformat(),
        'date_range': {'start': START_DATE, 'end': END_DATE},
        'minerals': MINERALS,
        'total_records': len(trade_df),
        'data_files': [
            'trade_data.csv',
            'global_prices.csv', 
            'domestic_production.csv',
            'dependency_metrics.csv',
            'monthly_aggregated.csv'
        ]
    }
    
    with open(os.path.join(processed_dir, 'data_summary.json'), 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"\nGenerated {len(trade_df):,} trade records")
    print(f"Data saved to: {processed_dir}")
    print("Files created:")
    for file in summary['data_files']:
        print(f"  - {file}")

if __name__ == '__main__':
    main()
