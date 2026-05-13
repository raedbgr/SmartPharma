import type { ReactNode } from "react";

export type Severity = "warn" | "amber" | "ok";

export type Med = {
  id: string;
  name: string;
  cls: string;
  stock: number;
  min: number;
  exp: string;
  supplier: string;
  loc: string;
  price: number;
  trend: "up" | "down" | "flat";
};

export type Alert = {
  id: string;
  sev: Severity;
  title: string;
  meta: string[];
  when: string;
};

export type Prediction = {
  name: string;
  cls: string;
  etaDays: number;
  conf: number;
  kind: "warn" | "amber";
};

export type ActivityKind = "warn" | "ok" | "amber" | "acc" | "default";

export type Activity = {
  kind: ActivityKind;
  t: ReactNode;
  when: string;
};

export type SeriesPoint = { d: number; demand: number; pred: number };

export type Recommendation = {
  sev: Severity;
  title: string;
  meta: string[];
  confidence: string;
};

export type ModelSignal = { label: string; value: number };

export type ViewId =
  | "dash"
  | "stock"
  | "alerts"
  | "ai"
  | "expir"
  | "orders"
  | "analytics"
  | "team"
  | "settings";
