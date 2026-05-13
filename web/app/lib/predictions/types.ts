export type Movement = {
  date: string;
  qty: number;
};

export type MedHistory = {
  medId: string;
  history: Movement[];
};

export type Forecast = {
  medId: string;
  name: string;
  cls: string;
  currentStock: number;
  min: number;
  avgDailyConsumption: number;
  daysUntilStockout: number | null;
  daysUntilBelowMin: number | null;
  confidence: number;
  risk: "warn" | "amber" | "ok";
};

export type PredictionsResponse = {
  generatedAt: string;
  windowDays: number;
  forecasts: Forecast[];
  topRisk: Forecast[];
};
