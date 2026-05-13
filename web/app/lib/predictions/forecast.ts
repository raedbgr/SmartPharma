import type { Med } from "../types";
import type { Forecast, Movement } from "./types";

const FORECAST_WINDOW = 30;
const MIN_CONFIDENCE = 0.4;
const MAX_CONFIDENCE = 0.97;

function average(values: number[]): number {
  if (!values.length) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[], mean: number): number {
  if (values.length < 2) return 0;
  const variance =
    values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function classifyRisk(daysToBelowMin: number | null): "warn" | "amber" | "ok" {
  if (daysToBelowMin === null) return "ok";
  if (daysToBelowMin <= 7) return "warn";
  if (daysToBelowMin <= 21) return "amber";
  return "ok";
}

export function forecastMed(med: Med, history: Movement[]): Forecast {
  const recent = history.slice(-FORECAST_WINDOW).map((m) => m.qty);
  const avg = average(recent);
  const sigma = stdDev(recent, avg);
  const cv = avg > 0 ? sigma / avg : 1;

  const confidence = Math.max(
    MIN_CONFIDENCE,
    Math.min(MAX_CONFIDENCE, 1 - cv * 0.5),
  );

  const daysUntilStockout = avg > 0 ? Math.round(med.stock / avg) : null;
  const daysUntilBelowMin =
    avg > 0
      ? med.stock <= med.min
        ? 0
        : Math.round((med.stock - med.min) / avg)
      : null;

  return {
    medId: med.id,
    name: med.name,
    cls: med.cls,
    currentStock: med.stock,
    min: med.min,
    avgDailyConsumption: Math.round(avg * 100) / 100,
    daysUntilStockout,
    daysUntilBelowMin,
    confidence: Math.round(confidence * 100) / 100,
    risk: classifyRisk(daysUntilBelowMin),
  };
}

export function rankByRisk(forecasts: Forecast[]): Forecast[] {
  return [...forecasts].sort((a, b) => {
    const ad = a.daysUntilBelowMin ?? Number.POSITIVE_INFINITY;
    const bd = b.daysUntilBelowMin ?? Number.POSITIVE_INFINITY;
    if (ad !== bd) return ad - bd;
    return b.confidence - a.confidence;
  });
}
