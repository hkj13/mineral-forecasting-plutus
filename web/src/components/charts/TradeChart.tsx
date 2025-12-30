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
  color = "#3B82F6",
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

  if (type === "forecast" && showConfidence) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
                labelStyle={{ color: "#9CA3AF" }}
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
                fill="#1F2937"
                name="Lower Bound"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke={color}
                strokeWidth={2}
                dot={false}
                name="Forecast"
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
              <Legend />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  if (type === "bar") {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <YAxis
                tickFormatter={formatValue}
                stroke="#9CA3AF"
                tick={{ fill: "#9CA3AF", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                }}
                labelStyle={{ color: "#9CA3AF" }}
                labelFormatter={formatDate}
                formatter={(value: number) => [formatValue(value), ""]}
              />
              <Bar dataKey="imports" fill="#EF4444" name="Imports" />
              <Bar dataKey="exports" fill="#10B981" name="Exports" />
              <Legend />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={formatValue}
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
              labelStyle={{ color: "#9CA3AF" }}
              labelFormatter={formatDate}
              formatter={(value: number) => [formatValue(value), ""]}
            />
            <Line
              type="monotone"
              dataKey="imports"
              stroke="#EF4444"
              strokeWidth={2}
              dot={false}
              name="Imports"
            />
            <Line
              type="monotone"
              dataKey="exports"
              stroke="#10B981"
              strokeWidth={2}
              dot={false}
              name="Exports"
            />
            <Legend />
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
  // Year-over-Year import growth data
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

  // Adjust data based on mineral
  const mineralMultiplier = mineral === "Copper" ? 1 : mineral === "Lithium" ? 0.05 : 0.025;
  const adjustedData = yoyData.map(d => ({
    ...d,
    imports: Math.round(d.imports * mineralMultiplier),
    exports: Math.round(d.exports * mineralMultiplier),
  }));

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-white">Year-over-Year Trade Analysis - {mineral}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={adjustedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="year"
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
            />
            <YAxis
              stroke="#9CA3AF"
              tick={{ fill: "#9CA3AF", fontSize: 12 }}
              tickFormatter={(v) => `$${v}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1F2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#F3F4F6",
              }}
              labelStyle={{ color: "#9CA3AF" }}
              formatter={(value: number, name: string) => [`$${value}M`, name]}
            />
            <Bar dataKey="imports" fill="#EF4444" name="Imports" radius={[4, 4, 0, 0]} />
            <Bar dataKey="exports" fill="#10B981" name="Exports" radius={[4, 4, 0, 0]} />
            <Legend />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center p-2 bg-slate-700/50 rounded">
            <p className="text-xs text-slate-400">8-Year CAGR</p>
            <p className="text-lg font-bold text-blue-400">+3.2%</p>
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded">
            <p className="text-xs text-slate-400">Peak Year</p>
            <p className="text-lg font-bold text-red-400">FY25</p>
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded">
            <p className="text-xs text-slate-400">COVID Dip</p>
            <p className="text-lg font-bold text-yellow-400">-29%</p>
          </div>
          <div className="text-center p-2 bg-slate-700/50 rounded">
            <p className="text-xs text-slate-400">Recovery</p>
            <p className="text-lg font-bold text-green-400">+107%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
