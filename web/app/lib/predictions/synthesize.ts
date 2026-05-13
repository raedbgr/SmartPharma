import type { Med } from "../types";
import type { Movement } from "./types";

const HISTORY_DAYS = 90;

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function syntheticHistory(med: Med, days = HISTORY_DAYS): Movement[] {
  const rand = seededRandom(hashId(med.id));

  const baseRate = med.min / 28;
  const trendBias =
    med.trend === "up" ? 1.15 : med.trend === "down" ? 0.85 : 1.0;
  const noisiness = med.cls === "Bronchodilatateur" ? 0.55 : 0.3;

  const out: Movement[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days; i >= 1; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const seasonality = 1 + Math.sin((i / days) * Math.PI * 2) * 0.18;
    const trendRamp = 1 + (1 - i / days) * (trendBias - 1);
    const noise = 1 - noisiness + rand() * noisiness * 2;
    const weekday = d.getDay();
    const weekend = weekday === 0 || weekday === 6 ? 0.6 : 1.0;

    const qty = Math.max(
      0,
      Math.round(baseRate * seasonality * trendRamp * noise * weekend),
    );
    out.push({ date: d.toISOString().slice(0, 10), qty });
  }
  return out;
}
