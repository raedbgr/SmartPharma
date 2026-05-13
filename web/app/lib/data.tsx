import type {
  Activity,
  Alert,
  Med,
  ModelSignal,
  Prediction,
  Recommendation,
  SeriesPoint,
} from "./types";

export const MEDS: Med[] = [
  { id: "MED-04812", name: "Amoxicilline 500mg", cls: "Antibiotique", stock: 412, min: 200, exp: "2026-09-14", supplier: "Sanofi", loc: "A-12", price: 4.2, trend: "up" },
  { id: "MED-02201", name: "Paracétamol 1g", cls: "Antalgique", stock: 1840, min: 500, exp: "2027-02-08", supplier: "UPSA", loc: "A-03", price: 2.1, trend: "up" },
  { id: "MED-07719", name: "Ventoline 100µg", cls: "Bronchodilatateur", stock: 18, min: 60, exp: "2026-11-22", supplier: "GSK", loc: "C-21", price: 6.8, trend: "down" },
  { id: "MED-03304", name: "Doliprane 500mg", cls: "Antalgique", stock: 928, min: 400, exp: "2027-05-30", supplier: "Sanofi", loc: "A-04", price: 2.4, trend: "flat" },
  { id: "MED-09112", name: "Augmentin 1g", cls: "Antibiotique", stock: 64, min: 80, exp: "2026-06-19", supplier: "GSK", loc: "A-14", price: 8.9, trend: "down" },
  { id: "MED-06650", name: "Ibuprofène 400mg", cls: "Anti-inflammatoire", stock: 312, min: 200, exp: "2026-08-02", supplier: "Mylan", loc: "B-07", price: 3.1, trend: "flat" },
  { id: "MED-01188", name: "Insuline Lantus", cls: "Antidiabétique", stock: 42, min: 30, exp: "2026-05-29", supplier: "Sanofi", loc: "F-01", price: 38.5, trend: "up" },
  { id: "MED-08023", name: "Ventoline Spray", cls: "Bronchodilatateur", stock: 7, min: 25, exp: "2027-01-12", supplier: "GSK", loc: "C-22", price: 5.9, trend: "down" },
  { id: "MED-05541", name: "Levothyrox 50µg", cls: "Thyroïdien", stock: 280, min: 150, exp: "2026-12-04", supplier: "Merck", loc: "D-09", price: 3.4, trend: "flat" },
  { id: "MED-02947", name: "Spasfon 80mg", cls: "Antispasmodique", stock: 510, min: 200, exp: "2027-03-18", supplier: "Teva", loc: "B-12", price: 2.8, trend: "up" },
  { id: "MED-04405", name: "Smecta Orange", cls: "Antidiarrhéique", stock: 96, min: 120, exp: "2026-07-11", supplier: "Ipsen", loc: "E-04", price: 4.1, trend: "down" },
  { id: "MED-00773", name: "Aspégic 1000", cls: "Antalgique", stock: 232, min: 150, exp: "2027-04-22", supplier: "Sanofi", loc: "A-08", price: 3.6, trend: "flat" },
];

export const ALERTS: Alert[] = [
  { id: "a1", sev: "warn", title: "Rupture imminente — Ventoline 100µg", meta: ["18 unités restantes", "Seuil: 60", "Stock épuisé sous 3 jours"], when: "il y a 4 min" },
  { id: "a2", sev: "warn", title: "Insuline Lantus expire dans 17 jours", meta: ["42 unités exposées", "Lot #IN-2024-091"], when: "il y a 22 min" },
  { id: "a3", sev: "amber", title: "Augmentin 1g — sous le seuil minimum", meta: ["64 / 80 unités", "Réappro recommandé"], when: "il y a 1 h" },
  { id: "a4", sev: "amber", title: "Smecta Orange — péremption Juillet 2026", meta: ["96 unités à écouler", "60 jours restants"], when: "il y a 2 h" },
  { id: "a5", sev: "ok", title: "Commande #PO-4419 reçue (Sanofi)", meta: ["Doliprane 500mg · +800 unités"], when: "il y a 3 h" },
];

export const PREDICTIONS: Prediction[] = [
  { name: "Ventoline 100µg", cls: "Bronchodilatateur", etaDays: 3, conf: 0.94, kind: "warn" },
  { name: "Insuline Lantus", cls: "Antidiabétique", etaDays: 11, conf: 0.88, kind: "warn" },
  { name: "Augmentin 1g", cls: "Antibiotique", etaDays: 14, conf: 0.81, kind: "amber" },
  { name: "Smecta Orange", cls: "Antidiarrhéique", etaDays: 22, conf: 0.76, kind: "amber" },
];

export const ACTIVITY: Activity[] = [
  { kind: "warn", t: (<><b>Alerte rupture</b> détectée par Nerolina AI sur <b>Ventoline 100µg</b></>), when: "14:42" },
  { kind: "ok", t: (<><b>Commande validée</b> · Sanofi · 800 boîtes Doliprane</>), when: "14:21" },
  { kind: "acc", t: (<><b>Prévision IA recalculée</b> sur 12 références sensibles</>), when: "13:58" },
  { kind: "amber", t: (<><b>Lot #IN-2024-091</b> marqué proche péremption</>), when: "13:30" },
  { kind: "ok", t: (<>Inventaire <b>A-12</b> vérifié par <b>Dr. Hadid</b></>), when: "12:14" },
  { kind: "default", t: (<>Nouveau médicament ajouté : <b>Spasfon Lyoc</b></>), when: "11:02" },
];

export const SERIES: SeriesPoint[] = Array.from({ length: 28 }, (_, i) => {
  const x = i / 27;
  const base = 540 + Math.sin(x * 6) * 80 + Math.sin(x * 13) * 30 + x * 40;
  const noise = (Math.sin(i * 1.7) + Math.cos(i * 2.3)) * 18;
  return {
    d: i,
    demand: Math.round(base + noise),
    pred: Math.round(base + Math.sin(x * 4) * 14),
  };
});

export const AI_RECOMMENDATIONS: Recommendation[] = [
  { sev: "warn", title: "Commander 200 doses Ventoline 100µg", meta: ["Évite rupture prévue J+3", "Économie : 1 240 €"], confidence: "94%" },
  { sev: "warn", title: "Réapprovisionner Insuline Lantus", meta: ["Stock + péremption à risque", "Lot suivant disponible J+5"], confidence: "88%" },
  { sev: "amber", title: "Réduire commande Doliprane 500mg", meta: ["Sur-stock détecté · +180 unités", "Recommandé : −400 unités"], confidence: "81%" },
  { sev: "amber", title: "Promouvoir Smecta Orange en officine", meta: ["96 unités à écouler avant J+60", "Suggestion : remise −15 %"], confidence: "76%" },
  { sev: "ok", title: "Programmer commande hebdo (Sanofi)", meta: ["Mardi 19 mai · 14 références"], confidence: "92%" },
];

export const MODEL_SIGNALS: ModelSignal[] = [
  { label: "Saisonnalité grippale", value: 84 },
  { label: "Historique ventes 12 sem.", value: 72 },
  { label: "Stock fournisseur (Sanofi)", value: 58 },
  { label: "Prescriptions zone locale", value: 46 },
  { label: "Alerte sanitaire DGS", value: 28 },
  { label: "Météo régionale", value: 17 },
];
