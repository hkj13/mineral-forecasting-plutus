"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface TradeChartProps {
  title: string;
  data: Array<{
    date: string;
    value?: number;
    imports?: number;
    exports?: number;
    forecast?: number;
    lower?: number;
    upper?: number;
  }>;
  type?: "line" | "area" | "bar" | "forecast";
  color?: string;
  showConfidence?: boolean;
}

export function TradeChart({
  title,
  data,
  type = "line",
  color = "#00f0ff",
  showConfidence = false,
}: TradeChartProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" });
  };

  const formatValue = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}B`;
    }
    return `$${value.toFixed(0)}M`;
  };

  // Futuristic tooltip style
  const tooltipStyle = {
    backgroundColor: "rgba(10, 14, 26, 0.95)",
    border: "1px solid rgba(0, 240, 255, 0.3)",
    borderRadius: "12px",
    color: "#F3F4F6",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 240, 255, 0.1)",
    backdropFilter: "blur(10px)",
  };

  if (type === "forecast" && showConfidence) {
    return (
      <Card className="glass-card rounded-xl border-cyan-500/20 overflow-hidden">
        <CardHeader className="pb-2 border-b border-cyan-500/10">
          <CardTitle className="text-lg text-cyan-400 flex items-center gap-2 font-tech tracking-wider">
            <Activity className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="rgba(0, 240, 255, 0.3)"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
                axisLine={{ stroke: "rgba(0, 240, 255, 0.2)" }}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="rgba(0, 240, 255, 0.3)"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
                axisLine={{ stroke: "rgba(0, 240, 255, 0.2)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "#00f0ff", fontFamily: "Rajdhani", fontWeight: 600 }}
                labelFormatter={formatDate}
                formatter={(value: number) => [formatValue(value), ""]}
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="transparent"
                fill="url(#confidenceGradient)"
                name="Upper Bound"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="transparent"
                fill="rgba(10, 14, 26, 0.8)"
                name="Lower Bound"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke={color}
                strokeWidth={3}
                dot={false}
                name="Forecast"
                filter="url(#glow)"
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2}
                dot={false}
                name="Historical"
                strokeDasharray="5 5"
              />
              <Legend 
                wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 12 }}
                iconType="circle"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (type === "bar") {
    return (
      <Card className="glass-card rounded-xl border-purple-500/20 overflow-hidden">
        <CardHeader className="pb-2 border-b border-purple-500/10">
          <CardTitle className="text-lg text-purple-400 flex items-center gap-2 font-tech tracking-wider">
            <Activity className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="importGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff6b9d" stopOpacity={1} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                </linearGradient>
                <linearGradient id="exportGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity={1} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0.8} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="rgba(168, 85, 247, 0.3)"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
                axisLine={{ stroke: "rgba(168, 85, 247, 0.2)" }}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="rgba(168, 85, 247, 0.3)"
                tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
                axisLine={{ stroke: "rgba(168, 85, 247, 0.2)" }}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                labelStyle={{ color: "#a855f7", fontFamily: "Rajdhani", fontWeight: 600 }}
                labelFormatter={formatDate}
                formatter={(value: number) => [formatValue(value), ""]}
              />
              <Bar dataKey="imports" fill="url(#importGradient)" name="Imports" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exports" fill="url(#exportGradient)" name="Exports" radius={[4, 4, 0, 0]} />
              <Legend 
                wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 12 }}
                iconType="circle"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card rounded-xl border-cyan-500/20 overflow-hidden">
      <CardHeader className="pb-2 border-b border-cyan-500/10">
        <CardTitle className="text-lg text-cyan-400 flex items-center gap-2 font-tech tracking-wider">
          <Activity className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineImportGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ff6b9d" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="lineExportGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#00f0ff" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>
              <filter id="glowLine">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 240, 255, 0.08)" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="rgba(0, 240, 255, 0.3)"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
              axisLine={{ stroke: "rgba(0, 240, 255, 0.2)" }}
            />
            <YAxis
              tickFormatter={formatValue}
              stroke="rgba(0, 240, 255, 0.3)"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
              axisLine={{ stroke: "rgba(0, 240, 255, 0.2)" }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#00f0ff", fontFamily: "Rajdhani", fontWeight: 600 }}
              labelFormatter={formatDate}
              formatter={(value: number) => [formatValue(value), ""]}
            />
            <Line
              type="monotone"
              dataKey="imports"
              stroke="url(#lineImportGradient)"
              strokeWidth={3}
              dot={{ fill: "#ff6b9d", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#ff6b9d", stroke: "#fff", strokeWidth: 2 }}
              name="Imports"
              filter="url(#glowLine)"
            />
            <Line
              type="monotone"
              dataKey="exports"
              stroke="url(#lineExportGradient)"
              strokeWidth={3}
              dot={{ fill: "#00f0ff", strokeWidth: 0, r: 4 }}
              activeDot={{ r: 6, fill: "#00f0ff", stroke: "#fff", strokeWidth: 2 }}
              name="Exports"
              filter="url(#glowLine)"
            />
            <Legend 
              wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 12 }}
              iconType="circle"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

interface SeasonalHeatmapProps {
  title: string;
  data: number[];
  mineral: string;
}

export function SeasonalHeatmap({ mineral }: SeasonalHeatmapProps) {
  const yoyData = [
    { year: "FY18", imports: 6063, exports: 2773, growth: 0 },
    { year: "FY19", imports: 4180, exports: 651, growth: -31 },
    { year: "FY20", imports: 3548, exports: 591, growth: -15 },
    { year: "FY21", imports: 2523, exports: 911, growth: -29 },
    { year: "FY22", imports: 5226, exports: 1393, growth: 107 },
    { year: "FY23", imports: 5829, exports: 750, growth: 12 },
    { year: "FY24", imports: 7379, exports: 1354, growth: 27 },
    { year: "FY25", imports: 7733, exports: 993, growth: 5 },
  ];

  const mineralMultiplier = mineral === "Copper" ? 1 : mineral === "Lithium" ? 0.05 : 0.025;
  const adjustedData = yoyData.map(d => ({
    ...d,
    imports: Math.round(d.imports * mineralMultiplier),
    exports: Math.round(d.exports * mineralMultiplier),
  }));

  const tooltipStyle = {
    backgroundColor: "rgba(10, 14, 26, 0.95)",
    border: "1px solid rgba(168, 85, 247, 0.3)",
    borderRadius: "12px",
    color: "#F3F4F6",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(168, 85, 247, 0.1)",
  };

  return (
    <Card className="glass-card rounded-xl border-purple-500/20 overflow-hidden">
      <CardHeader className="pb-2 border-b border-purple-500/10">
        <CardTitle className="text-lg text-purple-400 font-tech tracking-wider">
          YEAR-OVER-YEAR TRADE ANALYSIS — {mineral.toUpperCase()}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={adjustedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="yoyImportGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff6b9d" stopOpacity={1} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="yoyExportGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity={1} />
                <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(168, 85, 247, 0.08)" />
            <XAxis
              dataKey="year"
              stroke="rgba(168, 85, 247, 0.3)"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
              axisLine={{ stroke: "rgba(168, 85, 247, 0.2)" }}
            />
            <YAxis
              stroke="rgba(168, 85, 247, 0.3)"
              tick={{ fill: "#64748b", fontSize: 11, fontFamily: "Rajdhani" }}
              tickFormatter={(v) => `$${v}M`}
              axisLine={{ stroke: "rgba(168, 85, 247, 0.2)" }}
            />
            <Tooltip
              contentStyle={tooltipStyle}
              labelStyle={{ color: "#a855f7", fontFamily: "Rajdhani", fontWeight: 600 }}
              formatter={(value: number, name: string) => [`$${value}M`, name]}
            />
            <Bar dataKey="imports" fill="url(#yoyImportGradient)" name="Imports" radius={[6, 6, 0, 0]} />
            <Bar dataKey="exports" fill="url(#yoyExportGradient)" name="Exports" radius={[6, 6, 0, 0]} />
            <Legend 
              wrapperStyle={{ fontFamily: "Rajdhani", fontSize: 12 }}
              iconType="circle"
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Futuristic Stats Grid */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/20 group hover:border-cyan-400/40 transition-all">
            <p className="text-xs text-cyan-500/70 font-tech tracking-wider mb-1">8-YEAR CAGR</p>
            <p className="text-xl font-cyber text-cyan-400 text-glow-cyan">+3.2%</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20 group hover:border-pink-400/40 transition-all">
            <p className="text-xs text-pink-500/70 font-tech tracking-wider mb-1">PEAK YEAR</p>
            <p className="text-xl font-cyber text-pink-400">FY25</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-orange-500/10 to-orange-500/5 border border-orange-500/20 group hover:border-orange-400/40 transition-all">
            <p className="text-xs text-orange-500/70 font-tech tracking-wider mb-1">COVID DIP</p>
            <p className="text-xl font-cyber text-orange-400">-29%</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 group hover:border-emerald-400/40 transition-all">
            <p className="text-xs text-emerald-500/70 font-tech tracking-wider mb-1">RECOVERY</p>
            <p className="text-xl font-cyber text-emerald-400 text-glow-emerald">+107%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
