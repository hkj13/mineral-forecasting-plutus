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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
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
                }}
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
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
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
                }}
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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
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
              }}
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

export function SeasonalHeatmap({ title, data, mineral }: SeasonalHeatmapProps) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const getColor = (value: number) => {
    if (value >= 1.1) return "bg-red-500";
    if (value >= 1.05) return "bg-orange-400";
    if (value >= 1.0) return "bg-yellow-400";
    if (value >= 0.95) return "bg-green-400";
    return "bg-blue-400";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-12 gap-1">
          {months.map((month, i) => (
            <div key={month} className="text-center">
              <div
                className={`h-12 rounded ${getColor(data[i])} flex items-center justify-center text-white text-sm font-medium`}
                title={`${month}: ${(data[i] * 100).toFixed(0)}%`}
              >
                {(data[i] * 100).toFixed(0)}%
              </div>
              <span className="text-xs text-slate-400 mt-1 block">{month}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-blue-400" /> Low
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-yellow-400" /> Average
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-red-500" /> High
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
