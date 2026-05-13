"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AddMedModal } from "./AddMedModal";
import { DashView } from "./views/DashView";
import { StockView } from "./views/StockView";
import { AIView } from "./views/AIView";
import { GenericView } from "./views/GenericView";
import type { ViewId } from "../lib/types";

const PLACEHOLDER_COPY: Record<
  Exclude<ViewId, "dash" | "stock" | "ai">,
  { title: string; sub: string }
> = {
  alerts: {
    title: "Centre d'alertes",
    sub: "Toutes les alertes priorisées par criticité et impact patient.",
  },
  expir: {
    title: "Calendrier de péremption",
    sub: "Vue calendaire des lots à écouler par fenêtre de 30, 60 et 90 jours.",
  },
  orders: {
    title: "Commandes & approvisionnements",
    sub: "Bons de commande générés par l'IA, suivi des livraisons.",
  },
  analytics: {
    title: "Analytique avancée",
    sub: "Cohortes de médicaments, marge, rotation, classes ABC/XYZ.",
  },
  team: {
    title: "Équipe & rôles",
    sub: "Gestion des permissions pharmaciens, préparateurs, auditeurs.",
  },
  settings: {
    title: "Paramètres",
    sub: "Configuration de l'officine, intégrations et modèle Nerolina.",
  },
};

export function AppShell() {
  const [view, setView] = useState<ViewId>("dash");
  const [adding, setAdding] = useState(false);
  const [query, setQuery] = useState("");

  let body: React.ReactNode;
  if (view === "dash") body = <DashView />;
  else if (view === "stock") body = <StockView query={query} />;
  else if (view === "ai") body = <AIView />;
  else {
    const copy = PLACEHOLDER_COPY[view];
    body = <GenericView title={copy.title} sub={copy.sub} />;
  }

  return (
    <div className="app">
      <Sidebar view={view} onChange={setView} />
      <main className="main">
        <Topbar
          view={view}
          query={query}
          onQueryChange={setQuery}
          onAdd={() => setAdding(true)}
        />
        {body}
      </main>
      {adding && <AddMedModal onClose={() => setAdding(false)} />}
    </div>
  );
}
