"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// Badge import removed - using custom styling
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DependencyGauge, InsightCard } from "@/components/charts/KPICard";
import { TradeChart, SeasonalHeatmap } from "@/components/charts/TradeChart";
import {
  MINERALS,
  KPI_DATA,
  TRADE_TIME_SERIES,
  SEASONAL_PATTERNS,
  INSIGHTS,
  TOP_SUPPLIERS,
} from "@/lib/mock-data";
import {
  Diamond,
  TrendingUp,
  Globe,
  BarChart3,
  AlertTriangle,
  Download,
  LogOut,
  LineChart,
  Network,
  ChevronRight,
  DollarSign,
  Package,
  Target,
  PieChart,
  Zap,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedMineral, setSelectedMineral] = useState("Copper");
  const [dateRange, setDateRange] = useState("all");
  const [flowType, setFlowType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-cyan-500/30 rounded-full animate-spin border-t-cyan-400" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500/20 rounded-full animate-spin border-b-purple-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="font-tech text-cyan-400 text-lg tracking-wider animate-pulse">INITIALIZING NEURAL INTERFACE...</span>
        </div>
      </div>
    );
  }

  const mineralData = MINERALS.find((m) => m.name === selectedMineral)!;
  const kpiData = KPI_DATA[selectedMineral as keyof typeof KPI_DATA];
  const tradeData = TRADE_TIME_SERIES[selectedMineral as keyof typeof TRADE_TIME_SERIES];
  const seasonalData = SEASONAL_PATTERNS[selectedMineral as keyof typeof SEASONAL_PATTERNS];
  const insightsData = INSIGHTS[selectedMineral as keyof typeof INSIGHTS];
  const suppliersData = TOP_SUPPLIERS[selectedMineral as keyof typeof TOP_SUPPLIERS];

  const chartData = tradeData.imports.map((imp, i) => ({
    date: imp.date,
    imports: imp.value,
    exports: tradeData.exports[i]?.value || 0,
  }));

  return (
    <div className="min-h-screen cyber-bg relative">
      {/* Animated Background Grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />
      </div>

      {/* Header - Futuristic Glass Navigation */}
      <header className="sticky top-0 z-50 glass border-b border-cyan-500/20">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo with Holographic Effect */}
            <div className="flex items-center gap-3 group">
              <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 group-hover:border-cyan-400/50 transition-all duration-300">
                <Diamond className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="absolute inset-0 rounded-xl bg-cyan-400/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div>
                <h1 className="font-cyber text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                  MINERAL INTEL
                </h1>
                <p className="text-xs text-cyan-500/70 font-tech tracking-widest">STRATEGIC RESOURCE COMMAND</p>
              </div>
            </div>

            {/* Navigation with Glow Effects */}
            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="relative text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 border border-transparent hover:border-cyan-500/30 transition-all duration-300 font-tech">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                </Button>
              </Link>
              <Link href="/forecasting">
                <Button variant="ghost" className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all duration-300 font-tech">
                  <LineChart className="w-4 h-4 mr-2" />
                  Forecasting
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="ghost" className="text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all duration-300 font-tech">
                  <Target className="w-4 h-4 mr-2" />
                  Scenarios
                </Button>
              </Link>
              <Link href="/analytics">
                <Button variant="ghost" className="text-slate-400 hover:text-pink-400 hover:bg-pink-500/10 border border-transparent hover:border-pink-500/30 transition-all duration-300 font-tech">
                  <PieChart className="w-4 h-4 mr-2" />
                  Analytics
                </Button>
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="cyber-button rounded-lg px-4 py-2 font-tech"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout} 
                className="text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/30 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Filters Bar - Holographic Control Panel */}
      <div className="glass-card border-t-0 border-x-0 rounded-none border-b border-cyan-500/10">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Mineral Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-cyan-500/70 font-tech tracking-wider">MINERAL</span>
              <Select value={selectedMineral} onValueChange={setSelectedMineral}>
                <SelectTrigger className="w-44 glass border-cyan-500/30 text-cyan-400 font-tech hover:border-cyan-400/50 transition-all focus:ring-cyan-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-cyan-500/30">
                  {MINERALS.map((m) => (
                    <SelectItem key={m.name} value={m.name} className="text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-tech focus:bg-cyan-500/10 focus:text-cyan-400">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full ring-2 ring-offset-1 ring-offset-transparent"
                          style={{ backgroundColor: m.color, boxShadow: `0 0 10px ${m.color}50` }}
                        />
                        {m.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Period Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-purple-500/70 font-tech tracking-wider">PERIOD</span>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-36 glass border-purple-500/30 text-purple-400 font-tech hover:border-purple-400/50 transition-all focus:ring-purple-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-purple-500/30">
                  <SelectItem value="all" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech focus:bg-purple-500/10 focus:text-purple-400">All Time</SelectItem>
                  <SelectItem value="1y" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech focus:bg-purple-500/10 focus:text-purple-400">Last 1 Year</SelectItem>
                  <SelectItem value="3y" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech focus:bg-purple-500/10 focus:text-purple-400">Last 3 Years</SelectItem>
                  <SelectItem value="5y" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech focus:bg-purple-500/10 focus:text-purple-400">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Flow Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-emerald-500/70 font-tech tracking-wider">FLOW</span>
              <Select value={flowType} onValueChange={setFlowType}>
                <SelectTrigger className="w-32 glass border-emerald-500/30 text-emerald-400 font-tech hover:border-emerald-400/50 transition-all focus:ring-emerald-500/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass border-emerald-500/30">
                  <SelectItem value="all" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech focus:bg-emerald-500/10 focus:text-emerald-400">All</SelectItem>
                  <SelectItem value="import" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech focus:bg-emerald-500/10 focus:text-emerald-400">Imports</SelectItem>
                  <SelectItem value="export" className="text-slate-300 hover:text-emerald-400 hover:bg-emerald-500/10 font-tech focus:bg-emerald-500/10 focus:text-emerald-400">Exports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Badges */}
            <div className="ml-auto flex items-center gap-3">
              <div className={`px-4 py-1.5 rounded-lg font-tech text-sm tracking-wider border ${
                mineralData.strategic_risk === "high" 
                  ? "bg-red-500/10 border-red-500/50 text-red-400 badge-pulse" 
                  : mineralData.strategic_risk === "medium" 
                  ? "bg-orange-500/10 border-orange-500/50 text-orange-400" 
                  : "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
              }`}>
                <span className="flex items-center gap-2">
                  <Zap className="w-3 h-3" />
                  {mineralData.strategic_risk.toUpperCase()} RISK
                </span>
              </div>
              <div className="px-4 py-1.5 rounded-lg font-tech text-sm tracking-wider bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <span className="flex items-center gap-2">
                  <Activity className="w-3 h-3" />
                  {mineralData.primary_use}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6 relative z-10">
        {/* KPI Strip - Futuristic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass-card rounded-xl p-4 cyber-card group border-l-2 border-l-orange-500">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 group-hover:glow-orange transition-all">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
              </div>
              <span className={`text-xs font-tech px-2 py-1 rounded ${kpiData.dependency_ratio >= 0.9 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {kpiData.dependency_ratio >= 0.9 ? 'CRITICAL' : 'WARNING'}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-tech tracking-wider mb-1">IMPORT DEPENDENCY</p>
            <p className="font-cyber text-3xl text-white text-glow-cyan mb-1">{(kpiData.dependency_ratio * 100).toFixed(0)}%</p>
            <p className="text-emerald-400 text-sm font-tech flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2.3% vs last year
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 cyber-card group border-l-2 border-l-red-500">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:glow-red transition-all">
                <DollarSign className="w-5 h-5 text-red-400" />
              </div>
              <span className="text-xs font-tech px-2 py-1 rounded bg-red-500/20 text-red-400">DEFICIT</span>
            </div>
            <p className="text-slate-400 text-sm font-tech tracking-wider mb-1">TRADE DEFICIT (FY24)</p>
            <p className="font-cyber text-3xl text-white text-glow-cyan mb-1">${kpiData.trade_deficit_bn.toFixed(2)}B</p>
            <p className="text-red-400 text-sm font-tech flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> {(kpiData.yoy_change * 100).toFixed(1)}% YoY
            </p>
          </div>

          <div className="glass-card rounded-xl p-4 cyber-card group border-l-2 border-l-cyan-500">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:glow-cyan transition-all">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-xs font-tech px-2 py-1 rounded bg-cyan-500/20 text-cyan-400">FORECAST</span>
            </div>
            <p className="text-slate-400 text-sm font-tech tracking-wider mb-1">12M FORECAST DEFICIT</p>
            <p className="font-cyber text-3xl text-white text-glow-cyan mb-1">${kpiData.forecast_deficit_12m.toFixed(2)}B</p>
            <p className="text-slate-500 text-sm font-tech">Hybrid ML Model</p>
          </div>

          <div className="glass-card rounded-xl p-4 cyber-card group border-l-2 border-l-purple-500">
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:glow-purple transition-all">
                <Network className="w-5 h-5 text-purple-400" />
              </div>
              <span className={`text-xs font-tech px-2 py-1 rounded ${kpiData.hhi >= 0.25 ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'}`}>
                {kpiData.hhi >= 0.25 ? 'HIGH RISK' : 'MODERATE'}
              </span>
            </div>
            <p className="text-slate-400 text-sm font-tech tracking-wider mb-1">HHI CONCENTRATION</p>
            <p className="font-cyber text-3xl text-white text-glow-purple mb-1">{kpiData.hhi.toFixed(2)}</p>
            <p className="text-slate-500 text-sm font-tech">{kpiData.hhi >= 0.25 ? 'High concentration risk' : 'Moderate concentration'}</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            <TradeChart
              title={`${selectedMineral} Import/Export Trends (FY2017-24)`}
              data={chartData}
              type="line"
            />

            <SeasonalHeatmap
              title={`Seasonal Import Pattern - ${selectedMineral}`}
              data={seasonalData}
              mineral={selectedMineral}
            />

            <TradeChart
              title="Monthly Trade Volume"
              data={chartData.slice(-24)}
              type="bar"
            />
          </div>

          {/* Right Column - Insights & Analytics */}
          <div className="space-y-6">
            {/* Dependency Gauges */}
            <Card className="glass-card rounded-xl border-cyan-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-cyan-400 flex items-center gap-2 font-tech">
                  <Package className="w-5 h-5" />
                  DEPENDENCY MATRIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {MINERALS.map((m) => (
                  <DependencyGauge
                    key={m.name}
                    mineral={m.name}
                    ratio={m.dependency_ratio}
                    trend={m.trend as "increasing" | "decreasing" | "stable"}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Top Suppliers */}
            <Card className="glass-card rounded-xl border-purple-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-400 flex items-center gap-2 font-tech">
                  <Globe className="w-5 h-5" />
                  TOP IMPORT SOURCES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {suppliersData.map((supplier, i) => (
                    <div key={supplier.country} className="group">
                      <div className="flex items-center gap-3">
                        <span className="font-cyber text-cyan-400 text-lg w-6">{String(i + 1).padStart(2, '0')}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-white text-sm font-tech">{supplier.country}</span>
                            <span className="text-cyan-400 text-sm font-mono-tech">
                              ${supplier.value}M <span className="text-slate-500">({(supplier.share * 100).toFixed(0)}%)</span>
                            </span>
                          </div>
                          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500 group-hover:shadow-[0_0_10px_rgba(0,240,255,0.5)]"
                              style={{ 
                                width: `${supplier.share * 100}%`,
                                background: 'linear-gradient(90deg, #00f0ff 0%, #a855f7 100%)'
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights */}
            <InsightCard
              title={`${selectedMineral} Key Insights`}
              insights={insightsData}
              type={mineralData.strategic_risk === "high" ? "warning" : "info"}
            />

            {/* Quick Actions */}
            <Card className="glass-card rounded-xl border-emerald-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-emerald-400 font-tech">QUICK ACTIONS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/forecasting">
                  <Button variant="outline" className="w-full justify-between cyber-button rounded-lg py-5 hover:border-cyan-400/50">
                    <span className="flex items-center gap-2">
                      <LineChart className="w-4 h-4" />
                      Run Forecast for {selectedMineral}
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/scenarios">
                  <Button variant="outline" className="w-full justify-between cyber-button rounded-lg py-5 hover:border-purple-400/50 mt-2">
                    <span className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Simulate Policy Scenarios
                    </span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-between cyber-button rounded-lg py-5 hover:border-emerald-400/50 mt-2">
                  <span className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Full Report
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer - Futuristic */}
      <footer className="border-t border-cyan-500/10 mt-8 glass">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-cyan-500/50 font-tech tracking-wider">MINERAL INTEL PLATFORM | PLUTUS 2025</span>
            <span className="text-purple-500/50 font-tech tracking-wider">TEXMiN FOUNDATION | IIT(ISM) DHANBAD</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
