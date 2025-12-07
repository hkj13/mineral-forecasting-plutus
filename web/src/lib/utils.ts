import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number, currency: string = "USD"): string {
  if (currency === "USD") {
    return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  }
  return `₹${value.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Cr`;
}

export function formatNumber(value: number): string {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toFixed(0);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}

export function getColorForMineral(mineral: string): string {
  const colors: Record<string, string> = {
    Copper: "#B87333",
    Lithium: "#7C3AED",
    Graphite: "#374151",
  };
  return colors[mineral] || "#6B7280";
}

export function getRiskColor(risk: string): string {
  const colors: Record<string, string> = {
    low: "#10B981",
    medium: "#F59E0B",
    high: "#EF4444",
  };
  return colors[risk.toLowerCase()] || "#6B7280";
}