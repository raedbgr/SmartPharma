"use client";

import {
  Bell,
  Box,
  Calendar,
  Chart,
  Dashboard,
  Gear,
  Sparkles,
  Truck,
  Users,
} from "./Icon";
import type { IconComponent } from "./Icon";
import type { ViewId } from "../lib/types";

type NavItem = {
  id: ViewId;
  label: string;
  Icon: IconComponent;
  count?: number;
};

const NAV_TOP: NavItem[] = [
  { id: "dash", label: "Tableau de bord", Icon: Dashboard },
  { id: "stock", label: "Inventaire", Icon: Box },
  { id: "alerts", label: "Alertes", Icon: Bell, count: 3 },
  { id: "ai", label: "IA · Prédictions", Icon: Sparkles },
  { id: "expir", label: "Péremptions", Icon: Calendar },
];

const NAV_BOT: NavItem[] = [
  { id: "orders", label: "Commandes", Icon: Truck },
  { id: "analytics", label: "Analytique", Icon: Chart },
  { id: "team", label: "Équipe", Icon: Users },
  { id: "settings", label: "Paramètres", Icon: Gear },
];

type SidebarProps = {
  view: ViewId;
  onChange: (id: ViewId) => void;
};

export function Sidebar({ view, onChange }: SidebarProps) {
  const renderItem = (item: NavItem) => (
    <button
      key={item.id}
      className={`nav-item ${view === item.id ? "active" : ""}`}
      onClick={() => onChange(item.id)}
      type="button"
    >
      <item.Icon />
      <span>{item.label}</span>
      {item.count !== undefined && <span className="count">{item.count}</span>}
    </button>
  );

  return (
    <aside className="side">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">SmartPharma</div>
          <div className="brand-sub">Nerolina · AI Stock</div>
        </div>
      </div>
      <div className="nav-group">
        <div className="nav-label">Opérations</div>
        {NAV_TOP.map(renderItem)}
      </div>
      <div className="nav-group">
        <div className="nav-label">Gestion</div>
        {NAV_BOT.map(renderItem)}
      </div>
      <div className="side-foot">
        <div className="avatar">SH</div>
        <div>
          <div className="who">Dr. Sarah Hadid</div>
          <div className="role">Pharmacie Centrale</div>
        </div>
      </div>
    </aside>
  );
}
