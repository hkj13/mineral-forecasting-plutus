"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { TradeChart } from "@/components/charts/TradeChart";
import { MINERALS, TRADE_TIME_SERIES, generateForecast } from "@/lib/mock-data";
import {
  Diamond,
  TrendingUp,
  BarChart3,
  Download,
  LogOut,
  LineChart,
  Target,
  Play,
  Settings,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  ImageIcon,
  PieChart,
} from "lucide-react";

export default function ForecastingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMineral, setSelectedMineral] = useState("Copper");
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [modelType, setModelType] = useState("hybrid");
  const [confidenceLevel, setConfidenceLevel] = useState(90);
  const [forecastData, setForecastData] = useState<ReturnType<typeof generateForecast> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
    // Generate initial forecast
    handleGenerateForecast();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = generateForecast(selectedMineral, horizonMonths, modelType);
      setForecastData(result);
      setIsGenerating(false);
    }, 1000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Get historical data for chart
  const tradeData = TRADE_TIME_SERIES[selectedMineral as keyof typeof TRADE_TIME_SERIES];
  const historicalData = tradeData.imports.slice(-24).map((d) => ({
    date: d.date,
    value: d.value,
  }));

  // Combine historical with forecast
  const combinedChartData = forecastData
    ? [
        ...historicalData,
        ...forecastData.dates.map((date, i) => ({
          date,
          forecast: forecastData.forecast[i],
          lower: forecastData.lower[i],
          upper: forecastData.upper[i],
        })),
      ]
    : historicalData;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/dashboard">
                <div className="p-2 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors">
                  <Diamond className="w-6 h-6 text-blue-400" />
                </div>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">Forecasting Engine</h1>
                <p className="text-xs text-slate-400">ML-Powered Trade Predictions</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/forecasting">
                <Button variant="ghost" className="text-white hover:bg-slate-700">
                  <LineChart className="w-4 h-4 mr-2" />
                  Forecasting
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <Target className="w-4 h-4 mr-2" />
                  Scenarios
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
                  <PieChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="text-slate-300 border-slate-600">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Parameters */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Forecast Parameters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mineral Selection */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Mineral</label>
                  <Select value={selectedMineral} onValueChange={setSelectedMineral}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      {MINERALS.map((m) => (
                        <SelectItem key={m.name} value={m.name} className="text-white hover:bg-slate-700">
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Horizon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-400">Forecast Horizon</label>
                    <span className="text-sm font-medium text-white">{horizonMonths} months</span>
                  </div>
                  <Slider
                    value={[horizonMonths]}
                    onValueChange={(v) => setHorizonMonths(v[0])}
                    min={6}
                    max={36}
                    step={6}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>6mo</span>
                    <span>18mo</span>
                    <span>36mo</span>
                  </div>
                </div>

                {/* Model Type */}
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Model Type</label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="arima" className="text-white hover:bg-slate-700">
                        ARIMA (Classical)
                      </SelectItem>
                      <SelectItem value="lstm" className="text-white hover:bg-slate-700">
                        LSTM (Deep Learning)
                      </SelectItem>
                      <SelectItem value="hybrid" className="text-white hover:bg-slate-700">
                        Hybrid ARIMA-LSTM
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Confidence Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-400">Confidence Level</label>
                    <span className="text-sm font-medium text-white">{confidenceLevel}%</span>
                  </div>
                  <Slider
                    value={[confidenceLevel]}
                    onValueChange={(v) => setConfidenceLevel(v[0])}
                    min={80}
                    max={99}
                    step={5}
                    className="w-full"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateForecast}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Forecast
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white">Model Information</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-slate-400 space-y-2">
                <p>
                  <strong className="text-white">ARIMA:</strong> Auto-regressive Integrated Moving Average with seasonal components.
                </p>
                <p>
                  <strong className="text-white">LSTM:</strong> Long Short-Term Memory neural network with regularization.
                </p>
                <p>
                  <strong className="text-white">Hybrid:</strong> ARIMA base + LSTM residual modeling for optimal accuracy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Charts & Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Forecast Chart */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">
                      {selectedMineral} Import Forecast
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {modelType.toUpperCase()} model | {horizonMonths}-month horizon | {confidenceLevel}% confidence
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-green-400 border-green-400/50">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Model Ready
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TradeChart
                  title=""
                  data={combinedChartData}
                  type="forecast"
                  showConfidence={true}
                  color={MINERALS.find((m) => m.name === selectedMineral)?.color || "#3B82F6"}
                />
              </CardContent>
            </Card>

            {/* Metrics & Comparison */}
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="bg-slate-800 border border-slate-700">
                <TabsTrigger value="metrics" className="data-[state=active]:bg-slate-700">
                  Performance Metrics
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:bg-slate-700">
                  Model Comparison
                </TabsTrigger>
                <TabsTrigger value="residuals" className="data-[state=active]:bg-slate-700">
                  Residual Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="bg-slate-800/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-400 mb-1">MAE</p>
                      <p className="text-2xl font-bold text-white">
                        {forecastData?.metrics.mae.toFixed(1) || "--"}
                      </p>
                      <p className="text-xs text-slate-500">Mean Absolute Error</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-400 mb-1">MAPE</p>
                      <p className="text-2xl font-bold text-white">
                        {forecastData?.metrics.mape.toFixed(1) || "--"}%
                      </p>
                      <p className="text-xs text-slate-500">Mean Abs. % Error</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-400 mb-1">RMSE</p>
                      <p className="text-2xl font-bold text-white">
                        {forecastData?.metrics.rmse.toFixed(1) || "--"}
                      </p>
                      <p className="text-xs text-slate-500">Root Mean Sq. Error</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-slate-800/50">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-slate-400 mb-1">R² Score</p>
                      <p className="text-2xl font-bold text-green-400">
                        {forecastData?.metrics.r2.toFixed(2) || "--"}
                      </p>
                      <p className="text-xs text-slate-500">Coefficient of Determination</p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comparison" className="mt-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-4">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-3 px-4 text-slate-400 font-medium">Model</th>
                            <th className="text-center py-3 px-4 text-slate-400 font-medium">MAE</th>
                            <th className="text-center py-3 px-4 text-slate-400 font-medium">MAPE</th>
                            <th className="text-center py-3 px-4 text-slate-400 font-medium">RMSE</th>
                            <th className="text-center py-3 px-4 text-slate-400 font-medium">R²</th>
                            <th className="text-center py-3 px-4 text-slate-400 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-700/50">
                            <td className="py-3 px-4 text-white">ARIMA</td>
                            <td className="text-center py-3 px-4 text-slate-300">12.5</td>
                            <td className="text-center py-3 px-4 text-slate-300">4.2%</td>
                            <td className="text-center py-3 px-4 text-slate-300">18.3</td>
                            <td className="text-center py-3 px-4 text-slate-300">0.89</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="secondary">Good</Badge>
                            </td>
                          </tr>
                          <tr className="border-b border-slate-700/50">
                            <td className="py-3 px-4 text-white">LSTM</td>
                            <td className="text-center py-3 px-4 text-slate-300">10.8</td>
                            <td className="text-center py-3 px-4 text-slate-300">3.8%</td>
                            <td className="text-center py-3 px-4 text-slate-300">15.6</td>
                            <td className="text-center py-3 px-4 text-slate-300">0.91</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="secondary">Very Good</Badge>
                            </td>
                          </tr>
                          <tr className="bg-blue-500/10">
                            <td className="py-3 px-4 text-white font-medium">Hybrid (Selected)</td>
                            <td className="text-center py-3 px-4 text-green-400 font-medium">9.2</td>
                            <td className="text-center py-3 px-4 text-green-400 font-medium">3.2%</td>
                            <td className="text-center py-3 px-4 text-green-400 font-medium">13.4</td>
                            <td className="text-center py-3 px-4 text-green-400 font-medium">0.94</td>
                            <td className="text-center py-3 px-4">
                              <Badge variant="success">Best</Badge>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="residuals" className="mt-4">
                <Card className="bg-slate-800/50">
                  <CardContent className="p-6">
                    <div className="text-center text-slate-400">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Residual analysis charts will be generated after model training.</p>
                      <p className="text-sm mt-2">Includes: ACF, PACF, Q-Q Plot, and Residual Distribution</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {/* Export Options */}
            <Card className="bg-slate-800/50 border border-slate-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Export Forecast Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      if (!forecastData) return;
                      const csvContent = [
                        "Mineral,Model,Date,Forecast_Value_USD_Million,Lower_Bound,Upper_Bound",
                        ...forecastData.dates.map((date, i) => 
                          `${selectedMineral},${modelType.toUpperCase()},${date},${forecastData.forecast[i]},${forecastData.lower[i]},${forecastData.upper[i]}`
                        )
                      ].join("\n");
                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedMineral}_forecast_${horizonMonths}m_${modelType}.csv`;
                      a.click();
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download CSV
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      if (!forecastData) return;
                      const report = `MINERAL FORECASTING REPORT
============================
Generated: ${new Date().toLocaleString()}
Mineral: ${selectedMineral}
Model: ${modelType.toUpperCase()}
Horizon: ${horizonMonths} months
Confidence: ${confidenceLevel}%

MODEL PERFORMANCE METRICS
-------------------------
MAE: ${forecastData.metrics.mae}
MAPE: ${forecastData.metrics.mape}%
RMSE: ${forecastData.metrics.rmse}
R² Score: ${forecastData.metrics.r2}

FORECAST SUMMARY
----------------
Start Date: ${forecastData.dates[0]}
End Date: ${forecastData.dates[forecastData.dates.length - 1]}
Avg Forecast: $${(forecastData.forecast.reduce((a,b)=>a+b,0)/forecastData.forecast.length).toFixed(1)}M
Peak: $${Math.max(...forecastData.forecast).toFixed(1)}M
Min: $${Math.min(...forecastData.forecast).toFixed(1)}M

DETAILED FORECAST
-----------------
${forecastData.dates.map((d, i) => `${d}: $${forecastData.forecast[i].toFixed(1)}M (${forecastData.lower[i].toFixed(1)} - ${forecastData.upper[i].toFixed(1)})`).join("\n")}

---
Plutus Hackathon 2025 | TEXMiN Foundation | IIT(ISM) Dhanbad`;
                      const blob = new Blob([report], { type: "text/plain" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `${selectedMineral}_forecast_report.txt`;
                      a.click();
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
