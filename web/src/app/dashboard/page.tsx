"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard, DependencyGauge, InsightCard } from "@/components/charts/KPICard";
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
  Map,
  Network,
  ChevronRight,
  DollarSign,
  Package,
  Target,
  Users,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [selectedMineral, setSelectedMineral] = useState("Copper");
  const [dateRange, setDateRange] = useState("all");
  const [flowType, setFlowType] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="flex items-center gap-3 text-white">
          <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Loading dashboard...</span>
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

  // Combine trade data for chart
  const chartData = tradeData.imports.map((imp, i) => ({
    date: imp.date,
    imports: imp.value,
    exports: tradeData.exports[i]?.value || 0,
  }));

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Diamond className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Mineral Forecasting</h1>
                <p className="text-xs text-slate-400">India&apos;s Critical Mineral Intelligence</p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-white hover:bg-slate-700">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/forecasting">
                <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-700">
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

      {/* Filters Bar */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Mineral:</span>
              <Select value={selectedMineral} onValueChange={setSelectedMineral}>
                <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  {MINERALS.map((m) => (
                    <SelectItem key={m.name} value={m.name} className="text-white hover:bg-slate-700">
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        {m.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Period:</span>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All Time</SelectItem>
                  <SelectItem value="1y" className="text-white">Last 1 Year</SelectItem>
                  <SelectItem value="3y" className="text-white">Last 3 Years</SelectItem>
                  <SelectItem value="5y" className="text-white">Last 5 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Flow:</span>
              <Select value={flowType} onValueChange={setFlowType}>
                <SelectTrigger className="w-32 bg-slate-700 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all" className="text-white">All</SelectItem>
                  <SelectItem value="import" className="text-white">Imports</SelectItem>
                  <SelectItem value="export" className="text-white">Exports</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <Badge
                variant={mineralData.strategic_risk === "high" ? "danger" : mineralData.strategic_risk === "medium" ? "warning" : "success"}
              >
                {mineralData.strategic_risk.toUpperCase()} RISK
              </Badge>
              <Badge variant="outline" className="text-slate-300 border-slate-600">
                {mineralData.primary_use}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPICard
            title="Import Dependency"
            value={`${(kpiData.dependency_ratio * 100).toFixed(0)}%`}
            change={2.3}
            changeLabel="vs last year"
            status={kpiData.dependency_ratio >= 0.9 ? "danger" : kpiData.dependency_ratio >= 0.7 ? "warning" : "success"}
            icon={<AlertTriangle className="w-5 h-5 text-yellow-400" />}
          />
          <KPICard
            title="Trade Deficit (FY24)"
            value={`$${kpiData.trade_deficit_bn.toFixed(2)}B`}
            change={kpiData.yoy_change * 100}
            changeLabel="YoY"
            status="warning"
            icon={<DollarSign className="w-5 h-5 text-red-400" />}
          />
          <KPICard
            title="12M Forecast Deficit"
            value={`$${kpiData.forecast_deficit_12m.toFixed(2)}B`}
            subtitle="Based on hybrid model"
            status="neutral"
            icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
          />
          <KPICard
            title="HHI Concentration"
            value={kpiData.hhi.toFixed(2)}
            subtitle={kpiData.hhi >= 0.25 ? "High concentration risk" : "Moderate concentration"}
            status={kpiData.hhi >= 0.25 ? "danger" : "warning"}
            icon={<Network className="w-5 h-5 text-purple-400" />}
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Trade Trends */}
            <TradeChart
              title={`${selectedMineral} Import/Export Trends (FY2017-24)`}
              data={chartData}
              type="line"
            />

            {/* Seasonal Heatmap */}
            <SeasonalHeatmap
              title={`Seasonal Import Pattern - ${selectedMineral}`}
              data={seasonalData}
              mineral={selectedMineral}
            />

            {/* Trade Balance Bar Chart */}
            <TradeChart
              title="Monthly Trade Volume"
              data={chartData.slice(-24)}
              type="bar"
            />
          </div>

          {/* Right Column - Insights & Analytics */}
          <div className="space-y-6">
            {/* Dependency Gauges */}
            <Card className="bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Import Dependency Matrix
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
            <Card className="bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Top Import Sources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suppliersData.map((supplier, i) => (
                    <div key={supplier.country} className="flex items-center gap-3">
                      <span className="text-slate-400 text-sm w-4">{i + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white text-sm">{supplier.country}</span>
                          <span className="text-slate-400 text-sm">
                            ${supplier.value}M ({(supplier.share * 100).toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${supplier.share * 100}%` }}
                          />
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
            <Card className="bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/forecasting">
                  <Button variant="outline" className="w-full justify-between text-slate-300 border-slate-600 hover:bg-slate-700">
                    Run Forecast for {selectedMineral}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/scenarios">
                  <Button variant="outline" className="w-full justify-between text-slate-300 border-slate-600 hover:bg-slate-700">
                    Simulate Policy Scenarios
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button variant="outline" className="w-full justify-between text-slate-300 border-slate-600 hover:bg-slate-700">
                  Download Full Report
                  <Download className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700 mt-8">
        <div className="max-w-[1600px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-slate-500">
            <span>Mineral Forecasting Platform | Plutus Hackathon 2025</span>
            <span>TEXMiN Foundation | IIT(ISM) Dhanbad</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
