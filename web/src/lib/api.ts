const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ForecastRequest {
  mineral: string;
  horizon_months: number;
  model_type: string;
  confidence_level: number;
  scenario?: string;
}

export interface ForecastResponse {
  mineral: string;
  model_type: string;
  horizon_months: number;
  forecast_dates: string[];
  forecast_values: number[];
  lower_bound: number[];
  upper_bound: number[];
  metrics: {
    mae: number;
    mape: number;
    rmse: number;
    r2: number;
  };
}

export interface ScenarioRequest {
  mineral: string;
  scenario_type: string;
  magnitude: number;
  affected_country?: string;
  duration_months: number;
}

export interface MineralInfo {
  name: string;
  symbol: string;
  hs_chapters: number[];
  primary_use: string;
  dependency_ratio: number;
}

export interface TradeData {
  date: string;
  flow: string;
  value_usd_mn: number;
  quantity_mt: number;
}

export interface DependencyMetrics {
  current_dependency_ratio: number;
  previous_year_ratio: number;
  trend: string;
  top_3_suppliers: string[];
  hhi_concentration: number;
  strategic_risk: string;
  domestic_reserves_mt: number;
  annual_consumption_mt: number;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth
  async login(email: string, password: string) {
    return this.fetch<{ success: boolean; user: { email: string; role: string }; token: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }
    );
  }

  // Minerals
  async getMinerals(): Promise<{ minerals: MineralInfo[] }> {
    return this.fetch("/minerals");
  }

  // Trade Data
  async getTradeData(
    mineral: string,
    options?: { flow?: string; start_date?: string; end_date?: string }
  ): Promise<{ mineral: string; data: TradeData[]; summary: Record<string, unknown> }> {
    const params = new URLSearchParams();
    if (options?.flow) params.append("flow", options.flow);
    if (options?.start_date) params.append("start_date", options.start_date);
    if (options?.end_date) params.append("end_date", options.end_date);

    const query = params.toString() ? `?${params.toString()}` : "";
    return this.fetch(`/trade/${mineral}${query}`);
  }

  // Forecasting
  async generateForecast(request: ForecastRequest): Promise<ForecastResponse> {
    return this.fetch("/forecast", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Scenarios
  async simulateScenario(request: ScenarioRequest) {
    return this.fetch("/scenarios/simulate", {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  // Metrics
  async getDependencyMetrics(mineral?: string): Promise<Record<string, DependencyMetrics>> {
    const endpoint = mineral ? `/metrics/dependency?mineral=${mineral}` : "/metrics/dependency";
    return this.fetch(endpoint);
  }

  async getTradeBalance(startYear: number = 2017, endYear: number = 2024) {
    return this.fetch(`/metrics/trade-balance?start_year=${startYear}&end_year=${endYear}`);
  }

  // Analytics
  async getAnovaAnalysis(groupBy: string = "mineral") {
    return this.fetch(`/analytics/anova?group_by=${groupBy}`);
  }

  async getSeasonalDecomposition(mineral: string) {
    return this.fetch(`/analytics/decomposition/${mineral}`);
  }

  async getTradeNetwork(mineral: string) {
    return this.fetch(`/analytics/network/${mineral}`);
  }

  // Policy
  async runPolicySimulator(
    mineral: string,
    targetRatio: number,
    annualIncrease: number
  ) {
    return this.fetch(
      `/policy/simulator?mineral=${mineral}&target_dependency_ratio=${targetRatio}&annual_production_increase_pct=${annualIncrease}`
    );
  }
}

export const api = new ApiClient();
