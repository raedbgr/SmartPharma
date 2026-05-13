import { NextResponse } from "next/server";
import { forecastMed, rankByRisk } from "../../lib/predictions/forecast";
import {
  getOrSeedHistory,
  readAllStock,
} from "../../lib/predictions/movements";
import type {
  Forecast,
  PredictionsResponse,
} from "../../lib/predictions/types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const TOP_RISK_LIMIT = 4;
const FORECAST_WINDOW_DAYS = 30;

export async function GET(): Promise<NextResponse<PredictionsResponse | { error: string }>> {
  try {
    const meds = await readAllStock();
    if (meds.length === 0) {
      return NextResponse.json(
        {
          generatedAt: new Date().toISOString(),
          windowDays: FORECAST_WINDOW_DAYS,
          forecasts: [],
          topRisk: [],
        },
        { status: 200 },
      );
    }

    const forecasts: Forecast[] = await Promise.all(
      meds.map(async (med) => {
        const history = await getOrSeedHistory(med);
        return forecastMed(med, history);
      }),
    );

    const ranked = rankByRisk(forecasts);
    const topRisk = ranked
      .filter((f) => f.daysUntilBelowMin !== null && f.daysUntilBelowMin <= 30)
      .slice(0, TOP_RISK_LIMIT);

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      windowDays: FORECAST_WINDOW_DAYS,
      forecasts: ranked,
      topRisk,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
