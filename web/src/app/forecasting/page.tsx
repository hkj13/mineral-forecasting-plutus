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
  PieChart,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ForecastingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMineral, setSelectedMineral] = useState("Copper");
  const [horizonMonths, setHorizonMonths] = useState(12);
  const [modelType, setModelType] = useState("hybrid");
  const [confidenceLevel, setConfidenceLevel] = useState(90);
  const [forecastData, setForecastData] = useState<ReturnType<typeof generateForecast> | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateForecast = () => {
    setIsGenerating(true);
    // Simulate API call delay
    setTimeout(() => {
      const result = generateForecast(selectedMineral, horizonMonths, modelType);
      setForecastData(result);
      setIsGenerating(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/login");
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      setIsLoading(false);
      handleGenerateForecast();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-400" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 rounded-full animate-spin border-b-cyan-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="font-tech text-purple-400 text-lg tracking-wider animate-pulse">INITIALIZING FORECAST ENGINE...</span>
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
    <div className="min-h-screen cyber-bg relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5" />
      </div>

      {/* Header - Futuristic */}
      <header className="sticky top-0 z-50 glass border-b border-purple-500/20">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <Link href="/dashboard">
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30 group-hover:border-purple-400/50 transition-all">
                  <Diamond className="w-6 h-6 text-purple-400" />
                </div>
              </Link>
              <div>
                <h1 className="font-cyber text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">FORECAST ENGINE</h1>
                <p className="text-xs text-purple-500/70 font-tech tracking-widest">ML-POWERED PREDICTIONS</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all font-tech">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/forecasting">
                <Button variant="ghost" className="relative text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all font-tech">
                  <LineChart className="w-4 h-4 mr-2" />
                  Forecasting
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent" />
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="ghost" className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all font-tech">
                  <Target className="w-4 h-4 mr-2" />
                  Scenarios
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all font-tech">
                  <PieChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="outline" size="sm" className="cyber-button rounded-lg px-4 py-2 font-tech">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-lg transition-all">
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Parameters */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="glass-card rounded-xl border-purple-500/20">
              <CardHeader className="pb-3 border-b border-purple-500/10">
                <CardTitle className="text-lg text-purple-400 flex items-center gap-2 font-tech tracking-wider">
                  <Settings className="w-5 h-5" />
                  FORECAST PARAMETERS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                {/* Mineral Selection */}
                <div className="space-y-2">
                  <label className="text-xs text-purple-500/70 font-tech tracking-wider">MINERAL</label>
                  <Select value={selectedMineral} onValueChange={setSelectedMineral}>
                    <SelectTrigger className="glass border-purple-500/30 text-purple-400 font-tech hover:border-purple-400/50 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-purple-500/30">
                      {MINERALS.map((m) => (
                        <SelectItem key={m.name} value={m.name} className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech">
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Horizon */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-cyan-500/70 font-tech tracking-wider">FORECAST HORIZON</label>
                    <span className="text-sm font-cyber text-cyan-400">{horizonMonths} MO</span>
                  </div>
                  <Slider
                    value={[horizonMonths]}
                    onValueChange={(v) => setHorizonMonths(v[0])}
                    min={6}
                    max={36}
                    step={6}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 font-tech">
                    <span>6mo</span>
                    <span>18mo</span>
                    <span>36mo</span>
                  </div>
                </div>

                {/* Model Type */}
                <div className="space-y-2">
                  <label className="text-xs text-emerald-500/70 font-tech tracking-wider">MODEL TYPE</label>
                  <Select value={modelType} onValueChange={setModelType}>
                    <SelectTrigger className="glass border-emerald-500/30 text-emerald-400 font-tech hover:border-emerald-400/50 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-emerald-500/30">
                      <SelectItem value="arima" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech">
                        ARIMA (Classical)
                      </SelectItem>
                      <SelectItem value="lstm" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech">
                        LSTM (Deep Learning)
                      </SelectItem>
                      <SelectItem value="hybrid" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech">
                        Hybrid ARIMA-LSTM
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Confidence Level */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs text-pink-500/70 font-tech tracking-wider">CONFIDENCE LEVEL</label>
                    <span className="text-sm font-cyber text-pink-400">{confidenceLevel}%</span>
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
                  className="w-full cyber-button rounded-xl py-5 font-tech tracking-wider"
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      <span className="text-cyan-400">COMPUTING...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      <span className="text-cyan-400">GENERATE FORECAST</span>
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Model Info */}
            <Card className="glass-card rounded-xl border-cyan-500/20">
              <CardHeader className="pb-2 border-b border-cyan-500/10">
                <CardTitle className="text-sm text-cyan-400 font-tech tracking-wider">MODEL INFORMATION</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3 pt-3">
                <p className="text-slate-400">
                  <strong className="text-purple-400 font-tech">ARIMA:</strong> Auto-regressive Integrated Moving Average with seasonal components.
                </p>
                <p className="text-slate-400">
                  <strong className="text-emerald-400 font-tech">LSTM:</strong> Long Short-Term Memory neural network with regularization.
                </p>
                <p className="text-slate-400">
                  <strong className="text-cyan-400 font-tech">HYBRID:</strong> ARIMA base + LSTM residual modeling for optimal accuracy.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Charts & Results */}
          <div className="lg:col-span-3 space-y-6">
            {/* Forecast Chart */}
            <Card className="glass-card rounded-xl border-cyan-500/20 overflow-hidden">
              <CardHeader className="border-b border-cyan-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-cyber">
                      {selectedMineral.toUpperCase()} IMPORT FORECAST
                    </CardTitle>
                    <CardDescription className="text-slate-400 font-tech tracking-wider">
                      {modelType.toUpperCase()} MODEL | {horizonMonths}-MONTH HORIZON | {confidenceLevel}% CONFIDENCE
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-tech flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      MODEL READY
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <TradeChart
                  title=""
                  data={combinedChartData}
                  type="forecast"
                  showConfidence={true}
                  color={MINERALS.find((m) => m.name === selectedMineral)?.color || "#00f0ff"}
                />
              </CardContent>
            </Card>

            {/* Metrics & Comparison */}
            <Tabs defaultValue="metrics" className="w-full">
              <TabsList className="glass border border-purple-500/20 p-1">
                <TabsTrigger value="metrics" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-tech">
                  Performance Metrics
                </TabsTrigger>
                <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-tech">
                  Model Comparison
                </TabsTrigger>
                <TabsTrigger value="residuals" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400 font-tech">
                  Residual Analysis
                </TabsTrigger>
              </TabsList>

              <TabsContent value="metrics" className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="glass-card rounded-xl border-l-2 border-l-cyan-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-cyan-500/70 font-tech tracking-wider mb-1">MAE</p>
                      <p className="text-2xl font-cyber text-white text-glow-cyan">
                        {forecastData?.metrics.mae.toFixed(1) || "--"}
                      </p>
                      <p className="text-xs text-slate-500 font-tech">Mean Absolute Error</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card rounded-xl border-l-2 border-l-purple-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-purple-500/70 font-tech tracking-wider mb-1">MAPE</p>
                      <p className="text-2xl font-cyber text-white text-glow-purple">
                        {forecastData?.metrics.mape.toFixed(1) || "--"}%
                      </p>
                      <p className="text-xs text-slate-500 font-tech">Mean Abs. % Error</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card rounded-xl border-l-2 border-l-pink-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-pink-500/70 font-tech tracking-wider mb-1">RMSE</p>
                      <p className="text-2xl font-cyber text-white">
                        {forecastData?.metrics.rmse.toFixed(1) || "--"}
                      </p>
                      <p className="text-xs text-slate-500 font-tech">Root Mean Sq. Error</p>
                    </CardContent>
                  </Card>
                  <Card className="glass-card rounded-xl border-l-2 border-l-emerald-500">
                    <CardContent className="p-4 text-center">
                      <p className="text-xs text-emerald-500/70 font-tech tracking-wider mb-1">R² SCORE</p>
                      <p className="text-2xl font-cyber text-emerald-400 text-glow-emerald">
                        {forecastData?.metrics.r2.toFixed(2) || "--"}
                      </p>
                      <p className="text-xs text-slate-500 font-tech">Coefficient of Determination</p>
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
