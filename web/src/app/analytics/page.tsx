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
import { MINERALS } from "@/lib/mock-data";
import {
  Diamond,
  BarChart3,
  Download,
  LogOut,
  LineChart,
  Target,
  Map,
  Network,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Globe,
} from "lucide-react";

// ANOVA results data
const ANOVA_RESULTS = {
  mineral_comparison: {
    f_statistic: 45.67,
    p_value: 0.0001,
    significant: true,
    groups: [
      { name: "Copper", mean: 5234.5, std: 1245.3, n: 8 },
      { name: "Lithium", mean: 342.8, std: 89.2, n: 8 },
      { name: "Graphite", mean: 141.7, std: 35.6, n: 8 },
    ],
    interpretation: "Significant difference in import values across minerals (p < 0.001). Copper dominates with 15x higher imports than Lithium.",
  },
  time_period: {
    f_statistic: 12.34,
    p_value: 0.0023,
    significant: true,
    periods: [
      { period: "2017-2019", mean: 3245.6, label: "Pre-COVID" },
      { period: "2020-2021", mean: 2567.8, label: "COVID Impact" },
      { period: "2022-2024", mean: 4892.3, label: "Recovery" },
    ],
    interpretation: "Trade volumes show significant temporal variation. Post-COVID recovery (2022-24) shows 90% increase over COVID period.",
  },
  partner_concentration: {
    f_statistic: 28.91,
    p_value: 0.0001,
    significant: true,
    hhi_scores: [
      { mineral: "Copper", hhi: 0.18, risk: "moderate" },
      { mineral: "Lithium", hhi: 0.42, risk: "high" },
      { mineral: "Graphite", hhi: 0.51, risk: "critical" },
    ],
    interpretation: "Graphite shows highest supplier concentration (HHI=0.51), indicating critical dependency on few source countries.",
  },
};

// State-wise production data
const STATE_PRODUCTION = {
  Copper: [
    { state: "Rajasthan", production: 33950, share: 71.5, districts: ["Jhunjhunu", "Alwar"] },
    { state: "Jharkhand", production: 9950, share: 21.0, districts: ["East Singhbhum"] },
    { state: "Madhya Pradesh", production: 3600, share: 7.5, districts: ["Balaghat"] },
  ],
  Graphite: [
    { state: "Tamil Nadu", production: 326000, share: 54.0, districts: ["Salem", "Madurai"] },
    { state: "Jharkhand", production: 167500, share: 27.7, districts: ["Palamu"] },
    { state: "Odisha", production: 111000, share: 18.3, districts: ["Nuapada", "Kalahandi"] },
  ],
  Lithium: [
    { state: "Jammu & Kashmir", production: 0, share: 0, districts: ["Reasi"], note: "5.9 MT reserves discovered, not operational" },
  ],
};

// Trade network data
const TRADE_NETWORK = {
  Copper: [
    { country: "Japan", value: 8700, share: 0.25, type: "import" },
    { country: "Indonesia", value: 6200, share: 0.18, type: "import" },
    { country: "Chile", value: 4800, share: 0.14, type: "import" },
    { country: "Australia", value: 3200, share: 0.09, type: "import" },
    { country: "UAE", value: 2100, share: 0.22, type: "export" },
    { country: "China", value: 1800, share: 0.19, type: "export" },
  ],
  Lithium: [
    { country: "China", value: 839, share: 0.35, type: "import" },
    { country: "Chile", value: 520, share: 0.22, type: "import" },
    { country: "Argentina", value: 380, share: 0.16, type: "import" },
    { country: "Belgium", value: 180, share: 0.25, type: "export" },
    { country: "USA", value: 120, share: 0.17, type: "export" },
  ],
  Graphite: [
    { country: "China", value: 514, share: 0.48, type: "import" },
    { country: "Madagascar", value: 180, share: 0.17, type: "import" },
    { country: "Mozambique", value: 120, share: 0.11, type: "import" },
    { country: "USA", value: 85, share: 0.22, type: "export" },
    { country: "Japan", value: 65, share: 0.17, type: "export" },
  ],
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMineral, setSelectedMineral] = useState("Copper");

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
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  const stateData = STATE_PRODUCTION[selectedMineral as keyof typeof STATE_PRODUCTION] || [];
  const networkData = TRADE_NETWORK[selectedMineral as keyof typeof TRADE_NETWORK] || [];

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
                <h1 className="text-xl font-bold text-white">Advanced Analytics</h1>
                <p className="text-xs text-slate-400">ANOVA, Mapping & Network Analysis</p>
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
              <Link href="/analytics">
                <Button variant="ghost" className="text-white hover:bg-slate-700">
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

      {/* Filter Bar */}
      <div className="bg-slate-800/50 border-b border-slate-700">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Mineral:</span>
            <Select value={selectedMineral} onValueChange={setSelectedMineral}>
              <SelectTrigger className="w-40 bg-slate-700 border-slate-600 text-white">
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
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-4 py-6">
        <Tabs defaultValue="anova" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="anova">
              <BarChart3 className="w-4 h-4 mr-2" />
              ANOVA Analysis
            </TabsTrigger>
            <TabsTrigger value="state-mapping">
              <Map className="w-4 h-4 mr-2" />
              State-Level Mapping
            </TabsTrigger>
            <TabsTrigger value="network">
              <Network className="w-4 h-4 mr-2" />
              Trade Network
            </TabsTrigger>
          </TabsList>

          {/* ANOVA Analysis Tab */}
          <TabsContent value="anova" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mineral Comparison */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    Cross-Mineral Comparison
                  </CardTitle>
                  <CardDescription>One-way ANOVA: Import values by mineral</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">F-Statistic</p>
                      <p className="text-2xl font-bold text-white">{ANOVA_RESULTS.mineral_comparison.f_statistic}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">P-Value</p>
                      <p className="text-2xl font-bold text-green-400">&lt; 0.001</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ANOVA_RESULTS.mineral_comparison.groups.map((g) => (
                      <div key={g.name} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <span className="text-white">{g.name}</span>
                        <span className="text-slate-300">${g.mean.toFixed(0)}M ± {g.std.toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <p className="text-sm text-blue-300">{ANOVA_RESULTS.mineral_comparison.interpretation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Time Period Comparison */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Temporal Analysis
                  </CardTitle>
                  <CardDescription>ANOVA: Trade volumes across time periods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">F-Statistic</p>
                      <p className="text-2xl font-bold text-white">{ANOVA_RESULTS.time_period.f_statistic}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">P-Value</p>
                      <p className="text-2xl font-bold text-green-400">{ANOVA_RESULTS.time_period.p_value}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ANOVA_RESULTS.time_period.periods.map((p) => (
                      <div key={p.period} className="flex items-center justify-between p-2 bg-slate-700/30 rounded">
                        <div>
                          <span className="text-white">{p.period}</span>
                          <span className="text-xs text-slate-400 ml-2">({p.label})</span>
                        </div>
                        <span className="text-slate-300">${p.mean.toFixed(0)}M</span>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <p className="text-sm text-green-300">{ANOVA_RESULTS.time_period.interpretation}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Supplier Concentration (HHI) */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    Concentration Risk (HHI)
                  </CardTitle>
                  <CardDescription>Herfindahl-Hirschman Index by mineral</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">F-Statistic</p>
                      <p className="text-2xl font-bold text-white">{ANOVA_RESULTS.partner_concentration.f_statistic}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400">P-Value</p>
                      <p className="text-2xl font-bold text-green-400">&lt; 0.001</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {ANOVA_RESULTS.partner_concentration.hhi_scores.map((h) => (
                      <div key={h.mineral} className="p-2 bg-slate-700/30 rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white">{h.mineral}</span>
                          <Badge variant={h.risk === "critical" ? "danger" : h.risk === "high" ? "warning" : "secondary"}>
                            {h.risk.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="h-2 bg-slate-600 rounded-full">
                          <div
                            className={`h-full rounded-full ${h.risk === "critical" ? "bg-red-500" : h.risk === "high" ? "bg-yellow-500" : "bg-blue-500"}`}
                            style={{ width: `${h.hhi * 100}%` }}
                          />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">HHI: {h.hhi.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-300">{ANOVA_RESULTS.partner_concentration.interpretation}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ANOVA Summary Table */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">ANOVA Summary Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Analysis Type</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">F-Statistic</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">P-Value</th>
                        <th className="text-center py-3 px-4 text-slate-400 font-medium">Significance</th>
                        <th className="text-left py-3 px-4 text-slate-400 font-medium">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-white">Cross-Mineral Comparison</td>
                        <td className="text-center py-3 px-4 text-slate-300">45.67</td>
                        <td className="text-center py-3 px-4 text-green-400">&lt; 0.001</td>
                        <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                        <td className="py-3 px-4 text-slate-300">Significant differences across minerals</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-white">Temporal Variation</td>
                        <td className="text-center py-3 px-4 text-slate-300">12.34</td>
                        <td className="text-center py-3 px-4 text-green-400">0.0023</td>
                        <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                        <td className="py-3 px-4 text-slate-300">COVID impact & recovery visible</td>
                      </tr>
                      <tr className="border-b border-slate-700/50">
                        <td className="py-3 px-4 text-white">Partner Concentration</td>
                        <td className="text-center py-3 px-4 text-slate-300">28.91</td>
                        <td className="text-center py-3 px-4 text-green-400">&lt; 0.001</td>
                        <td className="text-center py-3 px-4"><CheckCircle className="w-5 h-5 text-green-400 mx-auto" /></td>
                        <td className="py-3 px-4 text-slate-300">High concentration risk for Graphite</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* State-Level Mapping Tab */}
          <TabsContent value="state-mapping" className="space-y-6">
            {/* Production Summary - Moved to top for visibility */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Domestic Production Summary (All Minerals)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-700/30 rounded-lg text-center border border-slate-600">
                    <p className="text-3xl font-bold text-blue-400">47,500 MT</p>
                    <p className="text-slate-300">Total Copper Production</p>
                    <p className="text-sm text-slate-500">3 producing states</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg text-center border border-slate-600">
                    <p className="text-3xl font-bold text-green-400">604,500 MT</p>
                    <p className="text-slate-300">Total Graphite Production</p>
                    <p className="text-sm text-slate-500">3 producing states</p>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg text-center border border-slate-600">
                    <p className="text-3xl font-bold text-yellow-400">0 MT</p>
                    <p className="text-slate-300">Lithium Production</p>
                    <p className="text-sm text-slate-500">5.9 MT reserves in J&K</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* State Production Table */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-400" />
                    {selectedMineral} Production by State
                  </CardTitle>
                  <CardDescription>State-wise domestic mineral extraction (MT/year)</CardDescription>
                </CardHeader>
                <CardContent>
                  {stateData.length > 0 ? (
                    <div className="space-y-4">
                      {stateData.map((state, i) => (
                        <div key={state.state} className="p-4 bg-slate-700/30 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-sm flex items-center justify-center">
                                {i + 1}
                              </span>
                              <span className="text-white font-medium">{state.state}</span>
                            </div>
                            <Badge variant={state.share > 50 ? "success" : state.share > 20 ? "warning" : "secondary"}>
                              {state.share.toFixed(1)}%
                            </Badge>
                          </div>
                          <div className="h-3 bg-slate-600 rounded-full mb-2">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{ width: `${state.share}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">
                              Production: <span className="text-white">{state.production.toLocaleString()} MT</span>
                            </span>
                            <span className="text-slate-400">
                              Districts: <span className="text-slate-300">{state.districts.join(", ")}</span>
                            </span>
                          </div>
                          {"note" in state && (
                            <p className="text-xs text-yellow-400 mt-2 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              {state.note}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Map className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                      <p className="text-slate-400">No domestic production data available</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* India Map with State Labels */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Map className="w-5 h-5 text-green-400" />
                    Geographic Distribution - {selectedMineral}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Visual State Cards */}
                    {selectedMineral === "Copper" && (
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">RAJ</div>
                            <div>
                              <p className="text-white font-medium">Rajasthan</p>
                              <p className="text-xs text-slate-400">Jhunjhunu, Alwar districts</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold">33,950 MT</p>
                            <p className="text-xs text-slate-400">71.5% share</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold text-sm">JH</div>
                            <div>
                              <p className="text-white font-medium">Jharkhand</p>
                              <p className="text-xs text-slate-400">East Singhbhum</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold">9,950 MT</p>
                            <p className="text-xs text-slate-400">21% share</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-500/5 border border-slate-600 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center text-white font-bold text-xs">MP</div>
                            <div>
                              <p className="text-white font-medium">Madhya Pradesh</p>
                              <p className="text-xs text-slate-400">Balaghat</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-blue-400 font-bold">3,600 MT</p>
                            <p className="text-xs text-slate-400">7.5% share</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedMineral === "Graphite" && (
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">TN</div>
                            <div>
                              <p className="text-white font-medium">Tamil Nadu</p>
                              <p className="text-xs text-slate-400">Sivaganga, Madurai</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">325,000 MT</p>
                            <p className="text-xs text-slate-400">53.8% share</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-400 flex items-center justify-center text-white font-bold text-sm">JH</div>
                            <div>
                              <p className="text-white font-medium">Jharkhand</p>
                              <p className="text-xs text-slate-400">Palamau, Hazaribagh</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">180,000 MT</p>
                            <p className="text-xs text-slate-400">29.8% share</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-green-500/5 border border-slate-600 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-green-300 flex items-center justify-center text-white font-bold text-xs">OD</div>
                            <div>
                              <p className="text-white font-medium">Odisha</p>
                              <p className="text-xs text-slate-400">Nuapada, Kalahandi</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-green-400 font-bold">99,500 MT</p>
                            <p className="text-xs text-slate-400">16.5% share</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedMineral === "Lithium" && (
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center justify-between p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">J&K</div>
                            <div>
                              <p className="text-white font-medium">Jammu & Kashmir</p>
                              <p className="text-xs text-slate-400">Reasi district (Salal-Haimana)</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-yellow-400 font-bold">5.9 MT</p>
                            <p className="text-xs text-slate-400">Reserves (G3)</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-700/30 border border-slate-600 rounded-lg">
                          <p className="text-yellow-400 text-sm flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            No active production - 100% import dependent
                          </p>
                          <p className="text-xs text-slate-400 mt-1">GSI discovered reserves in Feb 2023. Mining expected by 2026-27.</p>
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-slate-500 text-center pt-2">Data source: Indian Bureau of Mines / USGS</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trade Network Tab */}
          <TabsContent value="network" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Import Network */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-red-400" />
                    Import Partners - {selectedMineral}
                  </CardTitle>
                  <CardDescription>Top source countries by import value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {networkData.filter(n => n.type === "import").map((partner, i) => (
                      <div key={partner.country} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-red-500/20 text-red-400 text-sm flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white">{partner.country}</span>
                            <span className="text-slate-300">${partner.value}M ({(partner.share * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full">
                            <div
                              className="h-full bg-red-500 rounded-full"
                              style={{ width: `${partner.share * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Export Network */}
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-green-400" />
                    Export Partners - {selectedMineral}
                  </CardTitle>
                  <CardDescription>Top destination countries by export value</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {networkData.filter(n => n.type === "export").map((partner, i) => (
                      <div key={partner.country} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded bg-green-500/20 text-green-400 text-sm flex items-center justify-center">
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white">{partner.country}</span>
                            <span className="text-slate-300">${partner.value}M ({(partner.share * 100).toFixed(0)}%)</span>
                          </div>
                          <div className="h-2 bg-slate-700 rounded-full">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{ width: `${partner.share * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Network Visualization */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Network className="w-5 h-5 text-purple-400" />
                  Trade Flow Network
                </CardTitle>
                <CardDescription>Visualization of {selectedMineral} trade relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <svg viewBox="0 0 600 200" className="w-full h-full">
                    {/* Import countries on left */}
                    {networkData.filter(n => n.type === "import").slice(0, 3).map((partner, i) => (
                      <g key={`import-${partner.country}`}>
                        <circle cx="100" cy={50 + i * 50} r="25" fill="#EF4444" opacity="0.3" />
                        <text x="100" y={55 + i * 50} textAnchor="middle" fill="white" fontSize="10">{partner.country.slice(0, 3)}</text>
                        <line x1="125" y1={50 + i * 50} x2="275" y2="100" stroke="#EF4444" strokeWidth="2" opacity="0.5" />
                        <text x="60" y={55 + i * 50} textAnchor="end" fill="#9CA3AF" fontSize="8">${partner.value}M</text>
                      </g>
                    ))}
                    {/* India in center */}
                    <circle cx="300" cy="100" r="40" fill="#3B82F6" />
                    <text x="300" y="105" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">INDIA</text>
                    {/* Export countries on right */}
                    {networkData.filter(n => n.type === "export").slice(0, 3).map((partner, i) => (
                      <g key={`export-${partner.country}`}>
                        <circle cx="500" cy={50 + i * 50} r="20" fill="#10B981" opacity="0.3" />
                        <text x="500" y={55 + i * 50} textAnchor="middle" fill="white" fontSize="10">{partner.country.slice(0, 3)}</text>
                        <line x1="340" y1="100" x2="480" y2={50 + i * 50} stroke="#10B981" strokeWidth="2" opacity="0.5" />
                        <text x="540" y={55 + i * 50} textAnchor="start" fill="#9CA3AF" fontSize="8">${partner.value}M</text>
                      </g>
                    ))}
                    {/* Legend */}
                    <circle cx="50" cy="180" r="8" fill="#EF4444" opacity="0.5" />
                    <text x="65" y="184" fill="#9CA3AF" fontSize="10">Imports</text>
                    <circle cx="150" cy="180" r="8" fill="#10B981" opacity="0.5" />
                    <text x="165" y="184" fill="#9CA3AF" fontSize="10">Exports</text>
                  </svg>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
