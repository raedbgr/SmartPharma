"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar, Dots, Filter, Truck } from "../Icon";
import { StockBar } from "../widgets/StockBar";
import { subscribeStock } from "../../lib/stock";
import type { Med } from "../../lib/types";

type FilterKey = "all" | "crit" | "low" | "ok";

function statusFor(m: Med): { cls: "warn" | "amber" | "ok"; label: string } {
  if (m.stock < m.min) return { cls: "warn", label: "Critique" };
  if (m.stock < m.min * 1.5) return { cls: "amber", label: "Bas" };
  return { cls: "ok", label: "OK" };
}

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function StockView({ query }: { query: string }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selected, setSelected] = useState<string | null>(null);
  const [meds, setMeds] = useState<Med[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return subscribeStock(
      (data) => {
        setMeds(data);
        setError(null);
      },
      (err) => setError(err.message),
    );
  }, []);

  const rows = useMemo(() => {
    if (!meds) return [];
    let r = meds;
    if (filter === "low") r = r.filter((m) => m.stock < m.min * 1.5);
    if (filter === "crit") r = r.filter((m) => m.stock < m.min);
    if (filter === "ok") r = r.filter((m) => m.stock >= m.min * 1.5);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.cls.toLowerCase().includes(q) ||
          m.supplier.toLowerCase().includes(q),
      );
    }
    return r;
  }, [meds, filter, query]);

  const total = meds?.length ?? 0;

  return (
    <>
      <div className="page-hd">
        <div>
          <h1>
            Inventaire <em>complet</em>
          </h1>
          <p>
            1 248 références suivies en temps réel · Dernière synchronisation il y a 4 secondes
          </p>
        </div>
        <div className="page-meta">
          <div className="live">
            <span className="live-dot" /> Stock à jour
          </div>
        </div>
      </div>

      <div className="toolbar">
        <div className="seg">
          <button
            type="button"
            className={filter === "all" ? "on" : ""}
            onClick={() => setFilter("all")}
          >
            Tous · {total}
          </button>
          <button
            type="button"
            className={filter === "crit" ? "on" : ""}
            onClick={() => setFilter("crit")}
          >
            Critique
          </button>
          <button
            type="button"
            className={filter === "low" ? "on" : ""}
            onClick={() => setFilter("low")}
          >
            Bas
          </button>
          <button
            type="button"
            className={filter === "ok" ? "on" : ""}
            onClick={() => setFilter("ok")}
          >
            OK
          </button>
        </div>
        <span className="chip">
          <Filter size={12} />
          Classe thérapeutique
        </span>
        <span className="chip">
          <Truck size={12} />
          Fournisseur
        </span>
        <span className="chip">
          <Calendar size={12} />
          Péremption
        </span>
        <span className="count">{rows.length} résultats</span>
      </div>

      <div className="table-wrap">
        <div className="card">
          <table className="tbl">
            <thead>
              <tr>
                <th style={{ width: 30 }}>
                  <input type="checkbox" />
                </th>
                <th>Médicament</th>
                <th>Classe</th>
                <th>Stock / Seuil</th>
                <th>Péremption</th>
                <th>Fournisseur</th>
                <th>Emplacement</th>
                <th style={{ textAlign: "right" }}>Prix</th>
                <th style={{ width: 40 }} />
              </tr>
            </thead>
            <tbody>
              {rows.map((m) => {
                const s = statusFor(m);
                return (
                  <tr
                    key={m.id}
                    className={selected === m.id ? "sel" : ""}
                    onClick={() => setSelected(m.id)}
                  >
                    <td>
                      <input type="checkbox" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td>
                      <div className="name">{m.name}</div>
                      <div className="sku">{m.id}</div>
                    </td>
                    <td>{m.cls}</td>
                    <td>
                      <StockBar stock={m.stock} min={m.min} />
                    </td>
                    <td>
                      <span className="num">{dateFormatter.format(new Date(m.exp))}</span>
                      <span className={`pill ${s.cls}`} style={{ marginLeft: 8 }}>
                        {s.label}
                      </span>
                    </td>
                    <td>{m.supplier}</td>
                    <td>
                      <span className="loc">{m.loc}</span>
                    </td>
                    <td style={{ textAlign: "right" }} className="num">
                      {m.price.toFixed(2)} €
                    </td>
                    <td>
                      <button
                        className="iconbtn sm"
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Dots size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {meds && rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="empty-cell">
                    {error
                      ? `Erreur Firestore : ${error}`
                      : total === 0
                        ? "Initialisation du stock dans Firestore…"
                        : "Aucun résultat pour ces filtres."}
                  </td>
                </tr>
              )}
              {!meds && !error && (
                <tr>
                  <td colSpan={9} className="empty-cell">
                    Chargement du stock…
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
