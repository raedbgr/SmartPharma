"use client";

import { Bell, Download, Plus, Search } from "./Icon";
import type { ViewId } from "../lib/types";

const VIEW_TITLES: Record<ViewId, string> = {
  dash: "Tableau de bord",
  stock: "Inventaire",
  alerts: "Alertes",
  ai: "Prédictions IA",
  expir: "Péremptions",
  orders: "Commandes",
  analytics: "Analytique",
  team: "Équipe",
  settings: "Paramètres",
};

type TopbarProps = {
  view: ViewId;
  query: string;
  onQueryChange: (q: string) => void;
  onAdd: () => void;
};

export function Topbar({ view, query, onQueryChange, onAdd }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="crumbs">
        SmartPharma <span className="sep">/</span> <b>{VIEW_TITLES[view]}</b>
      </div>
      <div className="search">
        <Search size={14} />
        <input
          placeholder="Rechercher un médicament, lot, fournisseur…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
        />
        <span className="kbd">⌘K</span>
      </div>
      <button className="iconbtn" title="Notifications" type="button">
        <Bell />
        <span className="dot" />
      </button>
      <button className="btn btn-ghost" type="button">
        <Download size={13} />
        Exporter
      </button>
      <button className="btn btn-primary" type="button" onClick={onAdd}>
        <Plus size={13} />
        Ajouter
      </button>
    </div>
  );
}
