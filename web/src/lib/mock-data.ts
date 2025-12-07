// Mock data for frontend development and offline demo

export const MINERALS = [
  {
    name: "Copper",
    symbol: "Cu",
    color: "#B87333",
    dependency_ratio: 0.85,
    primary_use: "Electrical Wiring, Electronics, Construction",
    strategic_risk: "medium",
    trend: "increasing",
  },
  {
    name: "Lithium",
    symbol: "Li",
    color: "#7C3AED",
    dependency_ratio: 0.99,
    primary_use: "EV Batteries, Energy Storage",
    strategic_risk: "high",
    trend: "stable",
  },
  {
    name: "Graphite",
    symbol: "C",
    color: "#374151",
    dependency_ratio: 0.72,
    primary_use: "Battery Anodes, Lubricants, Refractories",
    strategic_risk: "high",
    trend: "increasing",
  },
];

export const TOP_SUPPLIERS = {
  Copper: [
    { country: "Chile", share: 0.28, value: 1260 },
    { country: "Indonesia", share: 0.18, value: 810 },
    { country: "Australia", share: 0.12, value: 540 },
    { country: "Peru", share: 0.1, value: 450 },
    { country: "Japan", share: 0.08, value: 360 },
  ],
  Lithium: [
    { country: "China", share: 0.42, value: 340 },
    { country: "Chile", share: 0.22, value: 180 },
    { country: "Argentina", share: 0.12, value: 98 },
    { country: "Australia", share: 0.1, value: 82 },
    { country: "Belgium", share: 0.05, value: 41 },
  ],
  Graphite: [
    { country: "China", share: 0.58, value: 380 },
    { country: "Mozambique", share: 0.12, value: 79 },
    { country: "Madagascar", share: 0.08, value: 52 },
    { country: "Sri Lanka", share: 0.06, value: 39 },
    { country: "Japan", share: 0.05, value: 33 },
  ],
};

export const KPI_DATA = {
  Copper: {
    import_value_bn: 5.4,
    export_value_bn: 1.02,
    trade_deficit_bn: 4.38,
    dependency_ratio: 0.85,
    yoy_change: 0.12,
    hhi: 0.18,
    forecast_deficit_12m: 4.85,
  },
  Lithium: {
    import_value_bn: 0.81,
    export_value_bn: 0.02,
    trade_deficit_bn: 0.79,
    dependency_ratio: 0.99,
    yoy_change: 0.35,
    hhi: 0.28,
    forecast_deficit_12m: 1.2,
  },
  Graphite: {
    import_value_bn: 0.65,
    export_value_bn: 0.25,
    trade_deficit_bn: 0.4,
    dependency_ratio: 0.72,
    yoy_change: 0.15,
    hhi: 0.38,
    forecast_deficit_12m: 0.52,
  },
};

// Generate time series data
function generateTimeSeries(
  startDate: Date,
  months: number,
  baseValue: number,
  trend: number,
  volatility: number
): { date: string; value: number }[] {
  const data = [];
  let value = baseValue;

  for (let i = 0; i < months; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Add trend and seasonality
    const seasonal = 1 + 0.1 * Math.sin((2 * Math.PI * (date.getMonth() + 1)) / 12);
    value = value * (1 + trend) * seasonal * (1 + (Math.random() - 0.5) * volatility);

    data.push({
      date: date.toISOString().split("T")[0],
      value: Math.round(value * 100) / 100,
    });
  }

  return data;
}

export const TRADE_TIME_SERIES = {
  Copper: {
    imports: generateTimeSeries(new Date("2017-04-01"), 93, 400, 0.008, 0.15),
    exports: generateTimeSeries(new Date("2017-04-01"), 93, 75, 0.003, 0.12),
  },
  Lithium: {
    imports: generateTimeSeries(new Date("2017-04-01"), 93, 60, 0.025, 0.2),
    exports: generateTimeSeries(new Date("2017-04-01"), 93, 1.5, 0.005, 0.15),
  },
  Graphite: {
    imports: generateTimeSeries(new Date("2017-04-01"), 93, 55, 0.012, 0.15),
    exports: generateTimeSeries(new Date("2017-04-01"), 93, 20, 0.008, 0.12),
  },
};

// Generate forecast data with confidence intervals
export function generateForecast(
  mineral: string,
  horizonMonths: number,
  modelType: string
): {
  dates: string[];
  forecast: number[];
  lower: number[];
  upper: number[];
  metrics: { mae: number; mape: number; rmse: number; r2: number };
} {
  const lastImport =
    TRADE_TIME_SERIES[mineral as keyof typeof TRADE_TIME_SERIES]?.imports.slice(-1)[0]?.value || 100;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() + 1);

  const dates: string[] = [];
  const forecast: number[] = [];
  const lower: number[] = [];
  const upper: number[] = [];

  let value = lastImport;
  const trend = mineral === "Lithium" ? 0.02 : 0.008;

  for (let i = 0; i < horizonMonths; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);
    dates.push(date.toISOString().split("T")[0]);

    const seasonal = 1 + 0.08 * Math.sin((2 * Math.PI * (date.getMonth() + 1)) / 12);
    value = value * (1 + trend) * seasonal;

    const uncertainty = 0.05 * Math.sqrt(i + 1);
    forecast.push(Math.round(value * 100) / 100);
    lower.push(Math.round(value * (1 - uncertainty) * 100) / 100);
    upper.push(Math.round(value * (1 + uncertainty) * 100) / 100);
  }

  const metricsMap: Record<string, { mae: number; mape: number; rmse: number; r2: number }> = {
    arima: { mae: 12.5, mape: 4.2, rmse: 18.3, r2: 0.89 },
    lstm: { mae: 10.8, mape: 3.8, rmse: 15.6, r2: 0.91 },
    hybrid: { mae: 9.2, mape: 3.2, rmse: 13.4, r2: 0.94 },
  };

  return {
    dates,
    forecast,
    lower,
    upper,
    metrics: metricsMap[modelType] || metricsMap.hybrid,
  };
}

export const SEASONAL_PATTERNS = {
  Copper: [0.92, 0.88, 1.12, 1.08, 0.96, 0.92, 0.88, 0.92, 1.0, 1.04, 1.08, 1.18],
  Lithium: [0.95, 0.92, 1.08, 1.05, 0.98, 0.95, 0.92, 0.95, 1.0, 1.02, 1.05, 1.12],
  Graphite: [0.94, 0.9, 1.1, 1.06, 0.97, 0.93, 0.9, 0.93, 1.0, 1.03, 1.06, 1.15],
};

export const INSIGHTS = {
  Copper: [
    "Import dependency increased 2.3% YoY, reaching 85%",
    "Chile remains top supplier with 28% market share",
    "Trade deficit widened to $4.38B in FY2024",
    "Seasonal peak expected in Q4 (Jan-Mar)",
  ],
  Lithium: [
    "Critical 99% import dependency requires urgent attention",
    "China dominates supply chain with 42% share",
    "EV demand driving 35% YoY import growth",
    "J&K lithium reserves discovery is promising for future",
  ],
  Graphite: [
    "High supplier concentration (HHI: 0.38) poses risk",
    "Battery-grade graphite demand surging 25% annually",
    "Domestic production meeting 28% of demand",
    "Price volatility linked to global EV production",
  ],
};

export const SCENARIOS = [
  {
    id: "import_ban_china",
    name: "China Import Ban",
    type: "import_ban",
    description: "Simulate complete ban on imports from China",
    affected_mineral: "Lithium",
    magnitude: 0.42,
  },
  {
    id: "price_spike_20",
    name: "20% Global Price Spike",
    type: "price_spike",
    description: "Simulate 20% increase in global commodity prices",
    affected_mineral: "all",
    magnitude: 0.2,
  },
  {
    id: "domestic_ramp",
    name: "Domestic Production Ramp",
    type: "production_ramp",
    description: "Accelerate domestic production by 30% annually",
    affected_mineral: "Graphite",
    magnitude: 0.3,
  },
];
