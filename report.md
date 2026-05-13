# SmartPharma — Project Report

**Product:** SmartPharma · Nerolina AI Stock
**Codebase:** `web/` (Next.js 16 App Router, React 19, TypeScript 5)
**Backend:** Firebase / Firestore
**Status:** Working prototype — UI complete, Firestore-backed inventory, AI prediction API live
**Date:** May 2026

---

## 1. Executive Summary

SmartPharma is an intelligent pharmacy stock-management dashboard aimed at officines (community pharmacies) and pharmacy chains. Its differentiator is **Nerolina**, an in-house demand-forecasting engine that anticipates stock-outs and expiry losses before they happen.

The current build delivers a fully designed French operator console with real-time inventory backed by Firestore, plus a server-side prediction route that computes per-SKU stock-out risk over a 30-day window. Remaining work is mostly data ingestion (replacing synthetic movement history with real sales data) and the supporting flows (alerts, expiry, orders, analytics) which are scaffolded as placeholder views.

---

## 2. Problem & Value Proposition

| Pain point in pharmacies                                | SmartPharma response                                 |
| ------------------------------------------------------- | ---------------------------------------------------- |
| Stock-outs of critical drugs (chronic patients at risk) | Per-SKU stock-out ETA + confidence, ranked daily     |
| Expiry losses (10–15% of perishable inventory)          | Expiry calendar with 30 / 60 / 90 / 180-day buckets  |
| Manual reordering based on intuition                    | AI-generated replenishment recommendations           |
| Fragmented tools (ERP + Excel + supplier portals)       | Single console: inventory, alerts, orders, analytics |
| No visibility on dormant stock / capital tied up        | "Stocks dormants" KPI + class ABC/XYZ rotation       |

UI-surfaced KPIs: active references, stock value (€), 30-day stock-out risk, expiring lots, avoided stock-outs, estimated savings (€), dormant stock, model accuracy.

---

## 3. Architecture Overview

### 3.1 Tech stack

- **Framework:** Next.js 16.2.6 (App Router, Server Components by default, Node runtime for API)
- **Language:** TypeScript 5 (strict)
- **UI:** React 19.2, Tailwind CSS v4 (via PostCSS plugin), custom CSS in `globals.css`
- **Typography:** Geist Sans/Mono + Instrument Serif (via `next/font`)
- **Data:** Firebase v12 — Firestore (client SDK) with `onSnapshot` real-time subscriptions
- **Lint/Build:** ESLint 9 with `eslint-config-next`

### 3.2 Folder structure

```
web/
├── app/
│   ├── layout.tsx              Root layout, fonts, metadata
│   ├── page.tsx                Mounts <AppShell />
│   ├── globals.css             Design tokens + component styles
│   ├── api/predictions/route.ts  GET /api/predictions (Node runtime)
│   ├── components/
│   │   ├── AppShell.tsx        Client shell: sidebar + topbar + view router
│   │   ├── Sidebar.tsx         Nav (dash / stock / alerts / ai / expir / …)
│   │   ├── Topbar.tsx          Search + add-med + current view title
│   │   ├── AddMedModal.tsx     Manual SKU creation
│   │   ├── Icon.tsx            Inline SVG icon set
│   │   ├── views/{Dash,Stock,AI,Generic}View.tsx
│   │   └── widgets/{KPI,DemandChart,Sparkline,StockBar,ExpRow,PredRow}.tsx
│   └── lib/
│       ├── firebase.ts         SDK init (env-driven config)
│       ├── stock.ts            Firestore CRUD + onSnapshot + seedIfEmpty
│       ├── data.tsx            Static demo data (alerts, predictions, …)
│       ├── types.ts            Med, Alert, Prediction, ViewId, …
│       └── predictions/{types,forecast,movements,synthesize}.ts
```

### 3.3 Data model (Firestore)

- `stock/{medId}` — `name, cls, stock, min, exp, supplier, loc, price, trend`
- `movements/{medId}` — `{ history: Movement[], seededAt }`, with `Movement = { date, qty }`

`stock` is seeded once from the in-memory `MEDS` demo set if the collection is empty (`stock.ts:38`). `movements` is lazily seeded per-SKU on first forecast call via `getOrSeedHistory` (`movements.ts:39`).

### 3.4 Runtime flow

1. Browser loads `/` → `RootLayout` mounts `<AppShell />` (client component).
2. `AppShell` routes between `DashView`, `StockView`, `AIView`, and placeholder generic views by `ViewId`.
3. `StockView` opens a Firestore `onSnapshot` on the `stock` collection — table streams live (`stock.ts:75`).
4. `/api/predictions` (Node runtime, `force-dynamic`) reads all stock, fetches/seeds 90-day movement history, runs `forecastMed` per SKU, returns a ranked forecast list + top-4 at-risk SKUs.

### 3.5 Forecast model (current)

Implemented in `app/lib/predictions/forecast.ts`:

- 30-day window of recent daily consumption from movement history.
- `avgDailyConsumption = mean(recent)`.
- Confidence = `clamp(1 − 0.5·CV, 0.40, 0.97)` where CV is coefficient of variation.
- `daysUntilStockout = round(stock / avg)`.
- `daysUntilBelowMin = round((stock − min) / avg)` (0 if already below min).
- Risk class: `≤7d → warn`, `≤21d → amber`, else `ok`.
- Ranking: ascending `daysUntilBelowMin`, ties broken by higher confidence.

Synthetic history (`synthesize.ts`) injects seasonality, weekday/weekend pattern, trend bias from `med.trend`, and class-specific noise — deterministic per `med.id`.

---

## 4. Feature Inventory

| View / Module          | Status      | Notes                                                                                   |
| ---------------------- | ----------- | --------------------------------------------------------------------------------------- |
| Tableau de bord (Dash) | UI complete | KPIs, demand-vs-forecast chart, live alerts, top predictions — fed by static `data.tsx` |
| Inventaire (Stock)     | Live        | Firestore-backed, real-time, filter (all/critique/bas/ok), search, status pills         |
| Ajout SKU              | Live        | Modal → `addMed()` writes to Firestore                                                  |
| IA · Prédictions       | UI + static | API route exists but not yet wired to view                                              |
| Alertes                | Placeholder | `GenericView` copy only                                                                 |
| Péremptions            | Placeholder | Same                                                                                    |
| Commandes              | Placeholder | Same                                                                                    |
| Analytique             | Placeholder | Same                                                                                    |
| Équipe / Paramètres    | Placeholder | Same                                                                                    |
| `/api/predictions`     | Live        | Returns forecasts + top risk for all SKUs                                               |

---

## 5. Security & Configuration

- Firebase config is **environment-driven** via `NEXT_PUBLIC_FIREBASE_*` (`firebase.ts:4`). A `firebase.example` file in the repo contains a real-looking config snapshot — **rotate keys and confirm referrer restrictions** before any public release.
- No auth layer yet — Firestore rules will be the first line of defense. Authenticated read/write (Firebase Auth) is a near-term requirement before non-demo use.
- API route is `force-dynamic` + Node runtime — fine for live data, no caching surprises.

---

## 6. Gaps & Risks

1. **Static dashboard data.** `DashView` and `AIView` render `ALERTS`, `PREDICTIONS`, `AI_RECOMMENDATIONS`, `MODEL_SIGNALS` from `lib/data.tsx`. They need to be wired to `/api/predictions` and to derived Firestore queries.
2. **Synthetic movement history.** Forecast quality is bounded by data quality — real sales/dispense events must replace `syntheticHistory`.
3. **No auth, no committed Firestore rules.** Public-read collections are fine in prototype; production requires roles (pharmacien / préparateur / auditeur, as already named in placeholders).
4. **Model is statistical, not ML.** The "Nerolina v2.4" branding in the UI is ahead of the implementation (moving average + CV-based confidence). Roadmap: proper time-series model (Prophet / seasonal ARIMA / lightweight gradient boosting per SKU cluster).
5. **No tests.** Forecast logic is the most testable piece and should be the first to gain coverage.
6. **`firebase.example` contains live-looking API keys** — verify HTTP-referrer restriction and Firestore rules before any commit/share.

---

## 7. Roadmap

**Short term (2–4 weeks)**
- Wire `/api/predictions` into `DashView` and `AIView`; remove static fallbacks.
- Implement the Alertes view from real risk + expiry data.
- Add Firebase Auth + Firestore security rules; gate writes behind pharmacist role.
- Unit tests around `forecastMed` and `rankByRisk`.

**Mid term (1–2 months)**
- Ingest real movement data (CSV import + supplier API connectors).
- Implement Péremptions calendar (FEFO logic, lot tracking).
- Implement Commandes view: AI-generated POs, supplier comparison, delivery tracking.
- Replace moving-average model with a per-SKU seasonal model; expose model signals from the model itself rather than static weights.

**Long term**
- Multi-site (chain) support with cross-store transfers.
- Anonymized prescription signal to refine demand forecasts for chronic-care SKUs.
- Regulatory reporting export (e.g. ANSM in France).

---

## 8. Key Files Reference

- App entry: `web/app/page.tsx`, `web/app/components/AppShell.tsx`
- Inventory: `web/app/components/views/StockView.tsx`, `web/app/lib/stock.ts`
- Forecasting: `web/app/lib/predictions/forecast.ts`, `web/app/api/predictions/route.ts`
- Data model: `web/app/lib/types.ts`, `web/app/lib/predictions/types.ts`
- Styling system: `web/app/globals.css`


Github link: https://github.com/raedbgr/SmartPharma