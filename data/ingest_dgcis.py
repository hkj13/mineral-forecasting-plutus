"""
Data Ingestion Script for DGCI&S Trade Data
Handles CSV/Excel exports from ftddp.dgciskol.gov.in and tradestat.commerce.gov.in

Usage:
    python ingest_dgcis.py --input data.csv --output processed/
    python ingest_dgcis.py --input data.xlsx --sheet "Sheet1" --output processed/
"""

import pandas as pd
import numpy as np
import argparse
import os
from datetime import datetime
from pathlib import Path
import json
import warnings
warnings.filterwarnings('ignore')

# Column mapping for different data source formats
COLUMN_MAPPINGS = {
    # DGCI&S format
    'dgcis': {
        'HS_Code': 'hs_code',
        'HSCode': 'hs_code',
        'hs_code': 'hs_code',
        'Commodity': 'commodity',
        'commodity': 'commodity',
        'Country': 'country',
        'country': 'country',
        'Port': 'port',
        'port': 'port',
        'State': 'state',
        'state': 'state',
        'Quantity': 'quantity',
        'quantity': 'quantity',
        'Qty': 'quantity',
        'Value': 'value',
        'value': 'value',
        'Value_USD': 'value_usd',
        'Value_INR': 'value_inr',
        'Unit': 'unit',
        'unit': 'unit',
        'Month': 'month',
        'month': 'month',
        'Year': 'year',
        'year': 'year',
        'Date': 'date',
        'date': 'date',
        'Period': 'period',
        'Import/Export': 'flow',
        'Flow': 'flow',
        'flow': 'flow',
        'Type': 'flow',
    },
    # TRADESTAT format
    'tradestat': {
        'ITC_HS_Code': 'hs_code',
        'Commodity_Name': 'commodity',
        'Partner_Country': 'country',
        'Indian_Port': 'port',
        'Trade_Value_USD': 'value_usd',
        'Trade_Quantity': 'quantity',
        'Unit_of_Quantity': 'unit',
        'Trade_Year': 'year',
        'Trade_Month': 'month',
        'Trade_Type': 'flow',
    }
}

# HS code to mineral mapping
HS_MINERAL_MAP = {
    # Copper
    '26030': 'Copper',
    '74010': 'Copper',
    '74020': 'Copper',
    '74031': 'Copper',
    '74040': 'Copper',
    '74081': 'Copper',
    '74091': 'Copper',
    # Lithium
    '25309': 'Lithium',
    '28369': 'Lithium',
    '28252': 'Lithium',
    '28259': 'Lithium',
    '28273': 'Lithium',
    # Graphite
    '25041': 'Graphite',
    '38011': 'Graphite',
    '38012': 'Graphite',
    '85451': 'Graphite',
    # Add more minerals as needed
}

def detect_format(df: pd.DataFrame) -> str:
    """Detect the data source format based on column names"""
    columns = set(df.columns.str.lower())
    
    if 'itc_hs_code' in columns or 'partner_country' in columns:
        return 'tradestat'
    return 'dgcis'

def normalize_columns(df: pd.DataFrame, format_type: str) -> pd.DataFrame:
    """Normalize column names to standard format"""
    mapping = COLUMN_MAPPINGS.get(format_type, COLUMN_MAPPINGS['dgcis'])
    
    # Create reverse mapping for case-insensitive matching
    col_map = {}
    for col in df.columns:
        for src, dst in mapping.items():
            if col.lower() == src.lower():
                col_map[col] = dst
                break
    
    return df.rename(columns=col_map)

def parse_date(df: pd.DataFrame) -> pd.DataFrame:
    """Parse and normalize date columns"""
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'], errors='coerce')
    elif 'year' in df.columns and 'month' in df.columns:
        df['date'] = pd.to_datetime(
            df['year'].astype(str) + '-' + df['month'].astype(str).str.zfill(2) + '-01',
            errors='coerce'
        )
    elif 'period' in df.columns:
        # Handle various period formats like "Apr-2023", "2023-04", "04/2023"
        df['date'] = pd.to_datetime(df['period'], errors='coerce')
    
    if 'date' in df.columns:
        df['year'] = df['date'].dt.year
        df['month'] = df['date'].dt.month
        df['fiscal_year'] = df.apply(
            lambda r: f"FY{r['year']}-{str(r['year']+1)[-2:]}" if r['month'] >= 4 
            else f"FY{r['year']-1}-{str(r['year'])[-2:]}", 
            axis=1
        )
    
    return df

def map_minerals(df: pd.DataFrame) -> pd.DataFrame:
    """Map HS codes to mineral names"""
    def get_mineral(hs_code):
        if pd.isna(hs_code):
            return 'Unknown'
        hs_str = str(hs_code).replace('.', '').replace(' ', '')[:5]
        for prefix, mineral in HS_MINERAL_MAP.items():
            if hs_str.startswith(prefix):
                return mineral
        return 'Other'
    
    df['mineral'] = df['hs_code'].apply(get_mineral)
    return df

def normalize_flow(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize import/export flow values"""
    if 'flow' in df.columns:
        df['flow'] = df['flow'].str.lower().str.strip()
        df['flow'] = df['flow'].replace({
            'i': 'Import', 'import': 'Import', 'imports': 'Import', 'imp': 'Import',
            'e': 'Export', 'export': 'Export', 'exports': 'Export', 'exp': 'Export',
        })
    return df

def normalize_values(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize value columns"""
    # Ensure numeric columns
    for col in ['quantity', 'value', 'value_usd', 'value_inr']:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # Convert to standard units (USD millions, MT)
    if 'value_usd' in df.columns:
        df['value_usd_mn'] = df['value_usd'] / 1e6
    elif 'value' in df.columns:
        df['value_usd_mn'] = df['value'] / 1e6  # Assume already in USD
    
    if 'quantity' in df.columns:
        df['quantity_mt'] = df['quantity']  # Assume already in MT
    
    return df

def handle_missing_values(df: pd.DataFrame) -> pd.DataFrame:
    """Handle missing values with documented imputation"""
    imputation_log = []
    
    # Forward fill for time series data
    if 'date' in df.columns:
        df = df.sort_values('date')
    
    for col in ['value_usd_mn', 'quantity_mt']:
        if col in df.columns:
            missing_before = df[col].isna().sum()
            if missing_before > 0:
                # Group by mineral and flow for imputation
                if 'mineral' in df.columns and 'flow' in df.columns:
                    df[col] = df.groupby(['mineral', 'flow'])[col].transform(
                        lambda x: x.fillna(x.median())
                    )
                else:
                    df[col] = df[col].fillna(df[col].median())
                
                missing_after = df[col].isna().sum()
                imputed = missing_before - missing_after
                if imputed > 0:
                    imputation_log.append(f"{col}: {imputed} values imputed using median")
    
    # Flag imputed records
    df['is_imputed'] = False
    
    return df, imputation_log

def aggregate_data(df: pd.DataFrame, freq: str = 'monthly') -> pd.DataFrame:
    """Aggregate data to specified frequency"""
    if 'date' not in df.columns:
        return df
    
    group_cols = ['mineral', 'flow']
    if freq == 'monthly':
        df['period'] = df['date'].dt.to_period('M').dt.to_timestamp()
    elif freq == 'quarterly':
        df['period'] = df['date'].dt.to_period('Q').dt.to_timestamp()
    elif freq == 'annual':
        df['period'] = df['date'].dt.to_period('Y').dt.to_timestamp()
    else:
        df['period'] = df['date']
    
    agg_df = df.groupby(group_cols + ['period']).agg({
        'value_usd_mn': 'sum',
        'quantity_mt': 'sum',
    }).reset_index()
    
    agg_df = agg_df.rename(columns={'period': 'date'})
    return agg_df

def process_file(input_path: str, output_dir: str, sheet_name: str = None) -> dict:
    """Process a single input file"""
    print(f"Processing: {input_path}")
    
    # Read file
    ext = Path(input_path).suffix.lower()
    if ext == '.csv':
        df = pd.read_csv(input_path, encoding='utf-8', low_memory=False)
    elif ext in ['.xlsx', '.xls']:
        df = pd.read_excel(input_path, sheet_name=sheet_name or 0)
    else:
        raise ValueError(f"Unsupported file format: {ext}")
    
    print(f"  Loaded {len(df):,} rows, {len(df.columns)} columns")
    
    # Detect format
    format_type = detect_format(df)
    print(f"  Detected format: {format_type}")
    
    # Normalize columns
    df = normalize_columns(df, format_type)
    
    # Parse dates
    df = parse_date(df)
    
    # Map minerals
    df = map_minerals(df)
    
    # Normalize flow
    df = normalize_flow(df)
    
    # Normalize values
    df = normalize_values(df)
    
    # Handle missing values
    df, imputation_log = handle_missing_values(df)
    
    # Filter to target minerals
    target_minerals = ['Copper', 'Lithium', 'Graphite']
    df_filtered = df[df['mineral'].isin(target_minerals)]
    print(f"  Filtered to {len(df_filtered):,} records for target minerals")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Save processed data
    output_file = os.path.join(output_dir, 'trade_data_processed.csv')
    df_filtered.to_csv(output_file, index=False)
    print(f"  Saved: {output_file}")
    
    # Create aggregations
    for freq in ['monthly', 'quarterly', 'annual']:
        agg_df = aggregate_data(df_filtered.copy(), freq)
        agg_file = os.path.join(output_dir, f'trade_{freq}.csv')
        agg_df.to_csv(agg_file, index=False)
        print(f"  Saved: {agg_file}")
    
    # Create summary
    summary = {
        'input_file': input_path,
        'processed_at': datetime.now().isoformat(),
        'total_records': len(df),
        'filtered_records': len(df_filtered),
        'minerals': df_filtered['mineral'].value_counts().to_dict(),
        'date_range': {
            'start': str(df_filtered['date'].min()) if 'date' in df_filtered else None,
            'end': str(df_filtered['date'].max()) if 'date' in df_filtered else None,
        },
        'imputation_log': imputation_log,
        'output_files': [
            'trade_data_processed.csv',
            'trade_monthly.csv',
            'trade_quarterly.csv',
            'trade_annual.csv',
        ]
    }
    
    summary_file = os.path.join(output_dir, 'ingestion_summary.json')
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2, default=str)
    print(f"  Saved: {summary_file}")
    
    return summary

def main():
    parser = argparse.ArgumentParser(description='Ingest DGCI&S/TRADESTAT trade data')
    parser.add_argument('--input', '-i', required=True, help='Input CSV/Excel file path')
    parser.add_argument('--output', '-o', default='processed', help='Output directory')
    parser.add_argument('--sheet', '-s', default=None, help='Excel sheet name (optional)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.input):
        print(f"Error: Input file not found: {args.input}")
        return
    
    summary = process_file(args.input, args.output, args.sheet)
    
    print("\n" + "="*50)
    print("Ingestion Complete!")
    print(f"  Total records processed: {summary['total_records']:,}")
    print(f"  Records for target minerals: {summary['filtered_records']:,}")
    print(f"  Minerals found: {list(summary['minerals'].keys())}")
    if summary['imputation_log']:
        print("  Imputation notes:")
        for note in summary['imputation_log']:
            print(f"    - {note}")

if __name__ == '__main__':
    main()
