"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  unit?: string;
  trend?: "up" | "down" | "neutral";
  status?: "success" | "warning" | "danger" | "neutral";
  icon?: React.ReactNode;
  subtitle?: string;
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  unit,
  trend,
  status = "neutral",
  icon,
  subtitle,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (!trend && change !== undefined) {
      return change >= 0 ? (
        <ArrowUpRight className="w-4 h-4 text-green-400" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-400" />
      );
    }
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "danger":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getChangeColor = () => {
    if (change === undefined) return "";
    return change >= 0 ? "text-green-400" : "text-red-400";
  };

  return (
    <Card className={`border-l-4 border border-slate-700 ${getStatusColor()} bg-slate-800/50`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-400">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
              {unit && <span className="text-sm text-slate-400">{unit}</span>}
            </div>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-slate-700/50">{icon}</div>
          )}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-1 mt-2">
            {getTrendIcon()}
            <span className={`text-sm font-medium ${getChangeColor()}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            {changeLabel && (
              <span className="text-xs text-slate-500 ml-1">{changeLabel}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface DependencyGaugeProps {
  mineral: string;
  ratio: number;
  trend: "increasing" | "decreasing" | "stable";
}

export function DependencyGauge({ mineral, ratio, trend }: DependencyGaugeProps) {
  const percentage = ratio * 100;
  const getColor = () => {
    if (percentage >= 90) return "#EF4444";
    if (percentage >= 70) return "#F59E0B";
    return "#10B981";
  };

  const getRiskLevel = () => {
    if (percentage >= 90) return { label: "Critical", variant: "danger" as const };
    if (percentage >= 70) return { label: "High", variant: "warning" as const };
    return { label: "Moderate", variant: "success" as const };
  };

  const risk = getRiskLevel();

  return (
    <Card className="bg-slate-800/50 border border-slate-700">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-white">{mineral}</h3>
          <Badge variant={risk.variant}>{risk.label} Risk</Badge>
        </div>

        {/* Gauge bar */}
        <div className="relative h-4 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
            style={{
              width: `${percentage}%`,
              backgroundColor: getColor(),
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-2xl font-bold text-white">{percentage.toFixed(0)}%</span>
          <div className="flex items-center gap-1 text-sm text-slate-400">
            {trend === "increasing" ? (
              <>
                <TrendingUp className="w-4 h-4 text-red-400" />
                <span className="text-red-400">Increasing</span>
              </>
            ) : trend === "decreasing" ? (
              <>
                <TrendingDown className="w-4 h-4 text-green-400" />
                <span className="text-green-400">Decreasing</span>
              </>
            ) : (
              <span>Stable</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface InsightCardProps {
  title: string;
  insights: string[];
  type?: "info" | "warning" | "success";
}

export function InsightCard({ title, insights, type = "info" }: InsightCardProps) {
  const getIcon = () => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <TrendingUp className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "warning":
        return "border-yellow-500/50";
      case "success":
        return "border-green-500/50";
      default:
        return "border-blue-500/50";
    }
  };

  return (
    <Card className={`bg-slate-800/50 border ${getBorderColor()}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">{getIcon()}</div>
          <div>
            <h3 className="font-medium text-white mb-2">{title}</h3>
            <ul className="space-y-1.5">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                  <span className="text-slate-500 mt-1.5">•</span>
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
