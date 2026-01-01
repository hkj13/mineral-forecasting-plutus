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
import { Slider } from "@/components/ui/slider";
import { MINERALS, SCENARIOS } from "@/lib/mock-data";
import {
  Diamond,
  BarChart3,
  Download,
  LogOut,
  LineChart,
  Target,
  Play,
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Globe,
  Zap,
  Factory,
  Share2,
  Check,
  PieChart,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function ScenariosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMineral, setSelectedMineral] = useState("Lithium");
  const [scenarioType, setScenarioType] = useState("import_ban");
  const [magnitude, setMagnitude] = useState(20);
  const [affectedCountry, setAffectedCountry] = useState("China");
  const [duration, setDuration] = useState(12);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [scenarioResult, setScenarioResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const runScenario = () => {
    setIsSimulating(true);
    setTimeout(() => {
      // Generate scenario results
      const baseValue = selectedMineral === "Copper" ? 450 : selectedMineral === "Lithium" ? 85 : 65;
      const impactFactor = scenarioType === "import_ban" ? -0.3 : scenarioType === "price_spike" ? 0.5 : -0.25;
      
      const baseline = Array.from({ length: duration }, (_, i) => 
        Math.round(baseValue * (1 + 0.01 * i) * (1 + Math.random() * 0.1 - 0.05))
      );
      
      const scenario = baseline.map((v, i) => 
        Math.round(v * (1 + impactFactor * (magnitude / 100) * (1 - i / duration / 2)))
      );

      setScenarioResult({
        baseline,
        scenario,
        totalBaselineValue: baseline.reduce((a, b) => a + b, 0),
        totalScenarioValue: scenario.reduce((a, b) => a + b, 0),
        percentChange: ((scenario.reduce((a, b) => a + b, 0) - baseline.reduce((a, b) => a + b, 0)) / baseline.reduce((a, b) => a + b, 0) * 100),
        policyImplications: getImplications(scenarioType),
      });
      setIsSimulating(false);
    }, 1500);
  };

  const getImplications = (type: string) => {
    const implications: Record<string, string[]> = {
      import_ban: [
        "Immediate supply disruption requiring alternative sourcing",
        "Price volatility expected in short-term markets",
        "Strategic reserves activation may be required",
        "Accelerate domestic exploration and recycling programs",
        "Negotiate emergency supply agreements with alternative partners",
      ],
      price_spike: [
        "Trade value increase impacting downstream industries",
        "Consider hedging strategies for price volatility",
        "Accelerate circular economy and recycling initiatives",
        "Review strategic reserve policies and stockpiling",
        "Evaluate long-term supply contracts for price stability",
      ],
      production_ramp: [
        "Reduced import dependency over forecast period",
        "Employment opportunities in domestic mining sector",
        "Environmental impact assessments required",
        "Skill development programs needed for workforce",
        "Infrastructure investments in mining regions",
      ],
    };
    return implications[type] || [];
  };

  const copyScenarioLink = () => {
    const params = new URLSearchParams({
      mineral: selectedMineral,
      type: scenarioType,
      magnitude: magnitude.toString(),
      country: affectedCountry,
      duration: duration.toString(),
    });
    navigator.clipboard.writeText(`${window.location.origin}/scenarios?${params.toString()}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center cyber-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500/30 rounded-full animate-spin border-t-emerald-400" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-cyan-500/20 rounded-full animate-spin border-b-cyan-400" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <span className="font-tech text-emerald-400 text-lg tracking-wider animate-pulse">LOADING SCENARIO ENGINE...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-bg relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
      </div>

      {/* Header - Futuristic */}
      <header className="sticky top-0 z-50 glass border-b border-emerald-500/20">
        <div className="max-w-[1600px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
              <Link href="/dashboard">
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 group-hover:border-emerald-400/50 transition-all">
                  <Diamond className="w-6 h-6 text-emerald-400" />
                </div>
              </Link>
              <div>
                <h1 className="font-cyber text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">SCENARIO BUILDER</h1>
                <p className="text-xs text-emerald-500/70 font-tech tracking-widest">WHAT-IF POLICY SIMULATIONS</p>
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
                <Button variant="ghost" className="text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 border border-transparent hover:border-purple-500/30 transition-all font-tech">
                  <LineChart className="w-4 h-4 mr-2" />
                  Forecasting
                </Button>
              </Link>
              <Link href="/scenarios">
                <Button variant="ghost" className="relative text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-500/30 transition-all font-tech">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Scenario Builder */}
          <div className="space-y-4">
            {/* Pre-built Scenarios */}
            <Card className="glass-card rounded-xl border-emerald-500/20">
              <CardHeader className="border-b border-emerald-500/10">
                <CardTitle className="text-lg text-emerald-400 font-tech tracking-wider">QUICK SCENARIOS</CardTitle>
                <CardDescription className="text-slate-400 font-tech">
                  Pre-configured policy scenarios
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 pt-4">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setScenarioType(s.type);
                      setMagnitude(s.magnitude * 100);
                      if (s.affected_mineral !== "all") setSelectedMineral(s.affected_mineral);
                    }}
                    className="w-full p-3 rounded-xl bg-gradient-to-r from-slate-800/50 to-slate-900/50 hover:from-emerald-500/10 hover:to-cyan-500/10 border border-slate-700/50 hover:border-emerald-500/30 text-left transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 group-hover:border-emerald-500/30">
                        {s.type === "import_ban" && <Globe className="w-4 h-4 text-red-400" />}
                        {s.type === "price_spike" && <Zap className="w-4 h-4 text-yellow-400" />}
                        {s.type === "production_ramp" && <Factory className="w-4 h-4 text-green-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-tech text-white">{s.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Custom Scenario Builder */}
            <Card className="glass-card rounded-xl border-cyan-500/20">
              <CardHeader className="border-b border-cyan-500/10">
                <CardTitle className="text-lg text-cyan-400 font-tech tracking-wider">CUSTOM SCENARIO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                {/* Mineral */}
                <div className="space-y-2">
                  <label className="text-xs text-cyan-500/70 font-tech tracking-wider">TARGET MINERAL</label>
                  <Select value={selectedMineral} onValueChange={setSelectedMineral}>
                    <SelectTrigger className="glass border-cyan-500/30 text-cyan-400 font-tech hover:border-cyan-400/50 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-cyan-500/30">
                      {MINERALS.map((m) => (
                        <SelectItem key={m.name} value={m.name} className="text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 font-tech">
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Scenario Type */}
                <div className="space-y-2">
                  <label className="text-xs text-purple-500/70 font-tech tracking-wider">SCENARIO TYPE</label>
                  <Select value={scenarioType} onValueChange={setScenarioType}>
                    <SelectTrigger className="glass border-purple-500/30 text-purple-400 font-tech hover:border-purple-400/50 transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-purple-500/30">
                      <SelectItem value="import_ban" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech">Import Ban/Restriction</SelectItem>
                      <SelectItem value="price_spike" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech">Global Price Spike</SelectItem>
                      <SelectItem value="production_ramp" className="text-slate-300 hover:text-purple-400 hover:bg-purple-500/10 font-tech">Domestic Production Ramp</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Affected Country (for import ban) */}
                {scenarioType === "import_ban" && (
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400">Affected Country</label>
                    <Select value={affectedCountry} onValueChange={setAffectedCountry}>
                      <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-700">
                        <SelectItem value="China" className="text-white">China</SelectItem>
                        <SelectItem value="Chile" className="text-white">Chile</SelectItem>
                        <SelectItem value="Australia" className="text-white">Australia</SelectItem>
                        <SelectItem value="Indonesia" className="text-white">Indonesia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Magnitude */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-400">
                      {scenarioType === "import_ban" ? "Restriction Level" : 
                       scenarioType === "price_spike" ? "Price Increase" : "Production Increase"}
                    </label>
                    <span className="text-sm font-medium text-white">{magnitude}%</span>
                  </div>
                  <Slider
                    value={[magnitude]}
                    onValueChange={(v) => setMagnitude(v[0])}
                    min={10}
                    max={100}
                    step={10}
                  />
                </div>

                {/* Duration */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-slate-400">Duration</label>
                    <span className="text-sm font-medium text-white">{duration} months</span>
                  </div>
                  <Slider
                    value={[duration]}
                    onValueChange={(v) => setDuration(v[0])}
                    min={6}
                    max={36}
                    step={6}
                  />
                </div>

                {/* Run Button */}
                <Button
                  onClick={runScenario}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSimulating}
                >
                  {isSimulating ? (
                    <>
                      <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Simulating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>

                {/* Share Link */}
                <Button
                  variant="outline"
                  onClick={copyScenarioLink}
                  className="w-full text-slate-300 border-slate-600"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Scenario
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:col-span-2 space-y-6">
            {scenarioResult ? (
              <>
                {/* Impact Summary */}
                <Card className="bg-slate-800/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl text-white">Scenario Impact Analysis</CardTitle>
                      <Badge 
                        variant={scenarioResult.percentChange < 0 ? "danger" : "success"}
                        className="text-sm"
                      >
                        {scenarioResult.percentChange >= 0 ? "+" : ""}
                        {scenarioResult.percentChange.toFixed(1)}% Impact
                      </Badge>
                    </div>
                    <CardDescription className="text-slate-400">
                      {selectedMineral} | {scenarioType.replace("_", " ").toUpperCase()} | {duration} months
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-slate-400 mb-1">Baseline Total</p>
                          <p className="text-2xl font-bold text-white">
                            ${(scenarioResult.totalBaselineValue).toLocaleString()}M
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-slate-700/50">
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-slate-400 mb-1">Scenario Total</p>
                          <p className="text-2xl font-bold text-white">
                            ${(scenarioResult.totalScenarioValue).toLocaleString()}M
                          </p>
                        </CardContent>
                      </Card>
                      <Card className={`${scenarioResult.percentChange < 0 ? "bg-red-500/20" : "bg-green-500/20"}`}>
                        <CardContent className="p-4 text-center">
                          <p className="text-sm text-slate-400 mb-1">Net Change</p>
                          <p className={`text-2xl font-bold ${scenarioResult.percentChange < 0 ? "text-red-400" : "text-green-400"}`}>
                            {scenarioResult.percentChange < 0 ? <TrendingDown className="inline w-6 h-6 mr-1" /> : <TrendingUp className="inline w-6 h-6 mr-1" />}
                            ${Math.abs(scenarioResult.totalScenarioValue - scenarioResult.totalBaselineValue).toLocaleString()}M
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Comparison Chart */}
                    <div className="h-64 flex items-end gap-1">
                      {scenarioResult.baseline.map((base: number, i: number) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full flex gap-0.5 h-48 items-end">
                            <div
                              className="flex-1 bg-blue-500/50 rounded-t"
                              style={{ height: `${(base / Math.max(...scenarioResult.baseline)) * 100}%` }}
                              title={`Baseline: $${base}M`}
                            />
                            <div
                              className={`flex-1 ${scenarioResult.scenario[i] < base ? "bg-red-500/70" : "bg-green-500/70"} rounded-t`}
                              style={{ height: `${(scenarioResult.scenario[i] / Math.max(...scenarioResult.baseline)) * 100}%` }}
                              title={`Scenario: $${scenarioResult.scenario[i]}M`}
                            />
                          </div>
                          <span className="text-xs text-slate-500">M{i + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-center gap-6 mt-4 text-sm">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-blue-500/50" /> Baseline
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-red-500/70" /> Scenario (Decrease)
                      </span>
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-green-500/70" /> Scenario (Increase)
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Policy Implications */}
                <Card className="bg-slate-800/50 border-yellow-500/30">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Policy Implications & Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {scenarioResult.policyImplications.map((imp: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-sm font-medium">
                            {i + 1}
                          </span>
                          <span className="text-slate-300">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card className="bg-slate-800/50 h-96 flex items-center justify-center">
                <CardContent className="text-center">
                  <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-white mb-2">No Scenario Selected</h3>
                  <p className="text-slate-400 max-w-md">
                    Configure a scenario using the builder on the left, or select a quick scenario to see the impact analysis.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
