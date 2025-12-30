"""
Process TradeStat Excel files into a unified master dataset
Handles commodity-wise all countries export/import data
"""

import pandas as pd
import numpy as np
import os
from pathlib import Path
from datetime import datetime
import warnings
warnings.filterwarnings('ignore')

# HS Code to Mineral Mapping
HS_MINERAL_MAP = {
    '2504': {'mineral': 'Graphite', 'form': 'Natural Graphite'},
    '2603': {'mineral': 'Copper', 'form': 'Copper Ores & Concentrates'},
    '2825': {'mineral': 'Lithium', 'form': 'Lithium Oxide/Hydroxide'},
    '28369': {'mineral': 'Lithium', 'form': 'Lithium Carbonate'},
    '3801': {'mineral': 'Graphite', 'form': 'Artificial Graphite'},
    '7403': {'mineral': 'Copper', 'form': 'Refined Copper'},
    '7408': {'mineral': 'Copper', 'form': 'Copper Wire'},
}

def parse_tradestat_excel(filepath: str, flow: str) -> pd.DataFrame:
    """
    Parse a single TradeStat Excel file
    
    Args:
        filepath: Path to Excel file
        flow: 'Import' or 'Export'
    
    Returns:
        DataFrame with standardized columns
    """
    filename = os.path.basename(filepath)
    # Extract HS code and year from filename (e.g., "2603_2023-24.xlsx")
    parts = filename.replace('.xlsx', '').split('_')
    hs_code = parts[0]
    fiscal_year = parts[1] if len(parts) > 1 else 'Unknown'
    
    # Read Excel file
    df = pd.read_excel(filepath, header=None)
    
    # Find the header row (contains "Country" or "S.No.")
    header_row = None
    for idx, row in df.iterrows():
        row_str = ' '.join([str(x) for x in row.values])
        if 'Country' in row_str or 'S.No' in row_str:
            header_row = idx
            break
    
    if header_row is None:
        print(f"  Warning: Could not find header in {filename}")
        return pd.DataFrame()
    
    # Re-read with proper header
    df = pd.read_excel(filepath, header=header_row)
    
    # Clean column names
    df.columns = [str(col).strip() for col in df.columns]
    
    # Find country column
    country_col = None
    for col in df.columns:
        if 'Country' in col or 'Region' in col:
            country_col = col
            break
    
    if country_col is None:
        # Try second column (after S.No.)
        country_col = df.columns[1] if len(df.columns) > 1 else None
    
    if country_col is None:
        print(f"  Warning: Could not find country column in {filename}")
        return pd.DataFrame()
    
    # Find value columns (years like 2022-2023, 2023-2024)
    value_cols = []
    for col in df.columns:
        if '-' in str(col) and any(str(y) in str(col) for y in range(2017, 2030)):
            value_cols.append(col)
    
    if not value_cols:
        print(f"  Warning: Could not find value columns in {filename}")
        return pd.DataFrame()
    
    # Get mineral info
    mineral_info = HS_MINERAL_MAP.get(hs_code, {'mineral': 'Unknown', 'form': 'Unknown'})
    
    # Process data
    records = []
    for _, row in df.iterrows():
        country = row.get(country_col)
        if pd.isna(country) or str(country).strip() in ['', 'Total', 'TOTAL', 'Grand Total']:
            continue
        if 'S.No' in str(country) or 'Country' in str(country):
            continue
        
        country = str(country).strip().upper()
        
        for year_col in value_cols:
            value = row.get(year_col)
            if pd.notna(value):
                try:
                    value = float(value)
                    if value > 0:
                        records.append({
                            'hs_code': hs_code,
                            'mineral': mineral_info['mineral'],
                            'form': mineral_info['form'],
                            'flow': flow,
                            'country': country,
                            'fiscal_year': str(year_col).strip(),
                            'value_usd_mn': value,
                            'source_file': filename
                        })
                except (ValueError, TypeError):
                    pass
    
    return pd.DataFrame(records)


def process_all_files(export_dir: str, import_dir: str, output_dir: str) -> pd.DataFrame:
    """
    Process all TradeStat files and create master dataset
    """
    all_records = []
    
    # Process Exports
    print("\n📦 Processing EXPORT files...")
    export_files = list(Path(export_dir).glob('*.xlsx'))
    for filepath in sorted(export_files):
        print(f"  Processing: {filepath.name}")
        df = parse_tradestat_excel(str(filepath), 'Export')
        if not df.empty:
            all_records.append(df)
            print(f"    → {len(df)} records")
    
    # Process Imports
    print("\n📥 Processing IMPORT files...")
    import_files = list(Path(import_dir).glob('*.xlsx'))
    for filepath in sorted(import_files):
        if filepath.name == '.DS_Store':
            continue
        print(f"  Processing: {filepath.name}")
        df = parse_tradestat_excel(str(filepath), 'Import')
        if not df.empty:
            all_records.append(df)
            print(f"    → {len(df)} records")
    
    # Combine all records
    if not all_records:
        print("❌ No records found!")
        return pd.DataFrame()
    
    master_df = pd.concat(all_records, ignore_index=True)
    
    # Clean and standardize
    print("\n🧹 Cleaning data...")
    
    # Standardize country names
    country_mapping = {
        'U S A': 'USA',
        'UNITED STATES': 'USA',
        'U.S.A.': 'USA',
        'U K': 'UK',
        'UNITED KINGDOM': 'UK',
        'U.K.': 'UK',
        'U A E': 'UAE',
        'UNITED ARAB EMIRATES': 'UAE',
        'U.A.E.': 'UAE',
        'KOREA RP': 'SOUTH KOREA',
        'KOREA, REPUBLIC OF': 'SOUTH KOREA',
        'CHINA P RP': 'CHINA',
        "CHINA PEOPLE'S REPUBLIC": 'CHINA',
        'HONG KONG': 'HONG KONG',
        'TAIWAN': 'TAIWAN',
        'PAPUA N GNA': 'PAPUA NEW GUINEA',
        'TANZANIA REP': 'TANZANIA',
        'PANAMA REPUBLIC': 'PANAMA',
    }
    master_df['country'] = master_df['country'].replace(country_mapping)
    
    # Parse fiscal year to get start year
    def parse_fiscal_year(fy):
        try:
            # Handle formats like "2023-2024" or "2023-24"
            fy_str = str(fy).strip()
            if '-' in fy_str:
                start_year = int(fy_str.split('-')[0])
                return start_year
        except:
            pass
        return None
    
    master_df['year'] = master_df['fiscal_year'].apply(parse_fiscal_year)
    
    # Remove duplicates
    master_df = master_df.drop_duplicates(
        subset=['hs_code', 'flow', 'country', 'fiscal_year'],
        keep='first'
    )
    
    # Sort
    master_df = master_df.sort_values(
        ['mineral', 'flow', 'year', 'country']
    ).reset_index(drop=True)
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save master file
    master_path = os.path.join(output_dir, 'master_trade_data.csv')
    master_df.to_csv(master_path, index=False)
    print(f"\n✅ Master file saved: {master_path}")
    
    # Create summary statistics
    print("\n📊 Summary Statistics:")
    print(f"   Total records: {len(master_df):,}")
    print(f"   Date range: {master_df['fiscal_year'].min()} to {master_df['fiscal_year'].max()}")
    print(f"   Minerals: {master_df['mineral'].unique().tolist()}")
    print(f"   Countries: {master_df['country'].nunique()}")
    
    # Summary by mineral and flow
    summary = master_df.groupby(['mineral', 'flow']).agg({
        'value_usd_mn': ['sum', 'mean', 'count'],
        'country': 'nunique'
    }).round(2)
    summary.columns = ['total_value_mn', 'avg_value_mn', 'records', 'countries']
    print("\n📈 By Mineral & Flow:")
    print(summary.to_string())
    
    # Save summary
    summary_path = os.path.join(output_dir, 'trade_summary.csv')
    summary.to_csv(summary_path)
    
    # Create aggregated views
    # 1. By mineral, year, flow
    yearly_agg = master_df.groupby(['mineral', 'fiscal_year', 'flow']).agg({
        'value_usd_mn': 'sum',
        'country': 'nunique'
    }).reset_index()
    yearly_agg.columns = ['mineral', 'fiscal_year', 'flow', 'total_value_mn', 'num_countries']
    yearly_path = os.path.join(output_dir, 'yearly_aggregated.csv')
    yearly_agg.to_csv(yearly_path, index=False)
    print(f"\n✅ Yearly aggregated: {yearly_path}")
    
    # 2. Top trading partners by mineral
    top_partners = master_df.groupby(['mineral', 'flow', 'country']).agg({
        'value_usd_mn': 'sum'
    }).reset_index()
    top_partners = top_partners.sort_values(
        ['mineral', 'flow', 'value_usd_mn'], 
        ascending=[True, True, False]
    )
    partners_path = os.path.join(output_dir, 'trading_partners.csv')
    top_partners.to_csv(partners_path, index=False)
    print(f"✅ Trading partners: {partners_path}")
    
    # 3. Calculate trade balance by mineral and year
    pivot = master_df.pivot_table(
        index=['mineral', 'fiscal_year'],
        columns='flow',
        values='value_usd_mn',
        aggfunc='sum'
    ).reset_index()
    pivot.columns.name = None
    pivot = pivot.fillna(0)
    if 'Export' in pivot.columns and 'Import' in pivot.columns:
        pivot['trade_balance'] = pivot['Export'] - pivot['Import']
        pivot['import_dependency'] = pivot['Import'] / (pivot['Import'] + pivot['Export'] + 0.001)
    balance_path = os.path.join(output_dir, 'trade_balance.csv')
    pivot.to_csv(balance_path, index=False)
    print(f"✅ Trade balance: {balance_path}")
    
    return master_df


def main():
    """Main entry point"""
    print("=" * 60)
    print("🔄 TradeStat Data Processing")
    print("=" * 60)
    
    # Paths
    export_dir = '/Users/hk/Downloads/Commodity wise all Countries Export'
    import_dir = '/Users/hk/Downloads/Commodity wise all Countries Import'
    output_dir = '/Users/hk/CascadeProjects/mineral-forecasting-plutus/data/processed'
    
    # Process
    master_df = process_all_files(export_dir, import_dir, output_dir)
    
    if not master_df.empty:
        print("\n" + "=" * 60)
        print("✅ Processing Complete!")
        print("=" * 60)
        print(f"\nFiles created in: {output_dir}")
        print("  - master_trade_data.csv (all records)")
        print("  - trade_summary.csv (summary stats)")
        print("  - yearly_aggregated.csv (by year)")
        print("  - trading_partners.csv (by country)")
        print("  - trade_balance.csv (import/export balance)")
    
    return master_df


if __name__ == '__main__':
    main()
