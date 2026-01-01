"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

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
        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
      ) : (
        <ArrowDownRight className="w-4 h-4 text-red-400" />
      );
    }
    if (trend === "up") return <TrendingUp className="w-4 h-4 text-emerald-400" />;
    if (trend === "down") return <TrendingDown className="w-4 h-4 text-red-400" />;
    return null;
  };

  const getStatusStyles = () => {
    switch (status) {
      case "success":
        return { border: "border-l-emerald-500", glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]" };
      case "warning":
        return { border: "border-l-orange-500", glow: "group-hover:shadow-[0_0_30px_rgba(255,107,53,0.2)]" };
      case "danger":
        return { border: "border-l-red-500", glow: "group-hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]" };
      default:
        return { border: "border-l-cyan-500", glow: "group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]" };
    }
  };

  const getChangeColor = () => {
    if (change === undefined) return "";
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  const styles = getStatusStyles();

  return (
    <Card className={`glass-card rounded-xl border-l-2 ${styles.border} group cyber-card transition-all duration-300 ${styles.glow}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm text-slate-400 font-tech tracking-wider uppercase">{title}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-cyber text-white text-glow-cyan">
                {typeof value === "number" ? value.toLocaleString() : value}
              </span>
              {unit && <span className="text-sm text-slate-500 font-tech">{unit}</span>}
            </div>
            {subtitle && <p className="text-xs text-slate-500 font-tech">{subtitle}</p>}
          </div>
          {icon && (
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 group-hover:border-cyan-400/40 transition-all">
              {icon}
            </div>
          )}
        </div>

        {change !== undefined && (
          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-700/50">
            {getTrendIcon()}
            <span className={`text-sm font-tech font-semibold ${getChangeColor()}`}>
              {change >= 0 ? "+" : ""}
              {change.toFixed(1)}%
            </span>
            {changeLabel && (
              <span className="text-xs text-slate-500 ml-1 font-tech">{changeLabel}</span>
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
  
  const getGradient = () => {
    if (percentage >= 90) return "from-red-500 to-pink-500";
    if (percentage >= 70) return "from-orange-500 to-yellow-500";
    return "from-emerald-500 to-cyan-500";
  };

  const getGlowColor = () => {
    if (percentage >= 90) return "rgba(239, 68, 68, 0.5)";
    if (percentage >= 70) return "rgba(255, 107, 53, 0.5)";
    return "rgba(16, 185, 129, 0.5)";
  };

  const getRiskLevel = () => {
    if (percentage >= 90) return { label: "CRITICAL", color: "text-red-400 bg-red-500/10 border-red-500/30" };
    if (percentage >= 70) return { label: "HIGH", color: "text-orange-400 bg-orange-500/10 border-orange-500/30" };
    return { label: "MODERATE", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30" };
  };

  const risk = getRiskLevel();

  return (
    <div className="p-3 rounded-lg bg-slate-900/50 border border-slate-700/50 hover:border-cyan-500/30 transition-all group">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-tech text-white tracking-wider">{mineral}</h3>
        <span className={`px-2 py-0.5 rounded text-xs font-tech border ${risk.color}`}>
          {risk.label}
        </span>
      </div>

      {/* Futuristic Gauge Bar */}
      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getGradient()} transition-all duration-700`}
          style={{
            width: `${percentage}%`,
            boxShadow: `0 0 10px ${getGlowColor()}`,
          }}
        />
      </div>

      <div className="flex items-center justify-between mt-2">
        <span className="text-lg font-cyber text-white">{percentage.toFixed(0)}%</span>
        <div className="flex items-center gap-1 text-xs font-tech">
          {trend === "increasing" ? (
            <>
              <TrendingUp className="w-3 h-3 text-red-400" />
              <span className="text-red-400">RISING</span>
            </>
          ) : trend === "decreasing" ? (
            <>
              <TrendingDown className="w-3 h-3 text-emerald-400" />
              <span className="text-emerald-400">FALLING</span>
            </>
          ) : (
            <span className="text-slate-500">STABLE</span>
          )}
        </div>
      </div>
    </div>
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
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      default:
        return <Zap className="w-5 h-5 text-cyan-400" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case "warning":
        return "border-orange-500/30 hover:border-orange-400/50";
      case "success":
        return "border-emerald-500/30 hover:border-emerald-400/50";
      default:
        return "border-cyan-500/30 hover:border-cyan-400/50";
    }
  };

  const getTitleColor = () => {
    switch (type) {
      case "warning":
        return "text-orange-400";
      case "success":
        return "text-emerald-400";
      default:
        return "text-cyan-400";
    }
  };

  return (
    <Card className={`glass-card rounded-xl ${getBorderColor()} transition-all`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700">
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className={`font-tech tracking-wider mb-3 ${getTitleColor()}`}>{title.toUpperCase()}</h3>
            <ul className="space-y-2">
              {insights.map((insight, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-start gap-2 font-display">
                  <span className="text-cyan-500 mt-1">▸</span>
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
