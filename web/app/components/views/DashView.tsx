import { Fragment } from "react";
import { Bell, Calendar, Check, Dots, Plus, Sparkles } from "../Icon";
import { KPI } from "../widgets/KPI";
import { DemandChart } from "../widgets/DemandChart";
import { ExpRow } from "../widgets/ExpRow";
import { PredRow } from "../widgets/PredRow";
import { ACTIVITY, ALERTS, PREDICTIONS } from "../../lib/data";
import type { ActivityKind } from "../../lib/types";

function activityIcon(kind: ActivityKind) {
  switch (kind) {
    case "warn":
      return <Bell size={12} />;
    case "ok":
      return <Check size={12} />;
    case "amber":
      return <Calendar size={12} />;
    case "acc":
      return <Sparkles size={12} />;
    default:
      return <Plus size={12} />;
  }
}

export function DashView() {
  return (
    <>
      <div className="page-hd">
        <div>
          <h1 className="reveal">
            Bonjour Dr. Hadid, <em>tout est sous contrôle</em>
          </h1>
          <p>
            Aperçu en temps réel de votre stock pharmaceutique. L&apos;IA surveille
            1 248 références et anticipe les ruptures.
          </p>
        </div>
        <div className="page-meta">
          <div className="live">
            <span className="live-dot" /> Synchronisé à l&apos;instant
          </div>
          <div className="stamp">12 mai 2026 · 14:42</div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI
          label="Références actives"
          value="1 248"
          delta="+3,2 %"
          deltaDir="up"
          spark={[3, 5, 4, 6, 7, 6, 8, 9, 8, 10, 11, 12]}
        />
        <KPI
          label="Valeur du stock"
          value="284 920"
          unit="€"
          delta="+1,4 %"
          deltaDir="up"
          spark={[8, 7, 9, 8, 10, 11, 10, 12, 11, 13, 12, 14]}
        />
        <KPI
          label="Ruptures prévues 30j"
          value="12"
          delta="−4"
          deltaDir="up"
          spark={[14, 15, 12, 14, 13, 11, 12, 10, 9, 11, 10, 9]}
        />
        <KPI
          label="Lots proches péremption"
          value="38"
          delta="+6"
          deltaDir="down"
          spark={[6, 7, 6, 8, 9, 8, 10, 11, 12, 11, 13, 12]}
        />
      </div>

      <div className="grid-2">
        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Demande vs. prévision IA</h3>
              <div className="sub">28 derniers jours · projection à 7 jours</div>
            </div>
            <div className="tools">
              <span className="pill live">Nerolina v2.4</span>
              <button className="iconbtn sm" type="button">
                <Dots size={14} />
              </button>
            </div>
          </div>
          <div className="legend">
            <span>
              <span className="sw" style={{ background: "var(--ink)" }} />
              Demande réelle
            </span>
            <span>
              <span
                className="sw"
                style={{
                  background: "var(--accent)",
                  backgroundImage:
                    "repeating-linear-gradient(90deg, var(--accent) 0 4px, transparent 4px 8px)",
                }}
              />
              Prévision IA
            </span>
            <span>
              <span className="sw" style={{ background: "var(--accent-soft)" }} />
              Intervalle de confiance 95%
            </span>
          </div>
          <div className="chart-wrap">
            <DemandChart />
          </div>
        </section>

        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Alertes en cours</h3>
              <div className="sub">3 critiques · 2 à surveiller</div>
            </div>
            <span className="pill warn">Action requise</span>
          </div>
          <div className="alert-list">
            {ALERTS.map((a) => (
              <div key={a.id} className={`alert ${a.sev}`}>
                <div className="bar" />
                <div>
                  <div className="title">{a.title}</div>
                  <div className="meta">
                    {a.meta.map((m, i) => (
                      <Fragment key={i}>
                        <span>{m}</span>
                        {i < a.meta.length - 1 && <span className="dot" />}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className="when">{a.when}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="grid-3">
        <section className="pred reveal">
          <div className="pred-hd">
            <span className="ai-tag">
              <Sparkles size={11} />
              Nerolina prédit
            </span>
            <span className="pill">temps réel</span>
          </div>
          <div className="ask">
            <em>4 médicaments</em> risquent une rupture sous <em>3 semaines</em>.
            Réapprovisionnement recommandé aujourd&apos;hui.
          </div>
          <div className="pred-rows">
            {PREDICTIONS.map((p, i) => (
              <PredRow key={i} p={p} />
            ))}
          </div>
          <div className="pred-foot">
            <div className="conf">
              <span>Confiance modèle</span>
              <span className="bar">
                <i />
              </span>
              <span className="num val">88 %</span>
            </div>
            <button className="btn btn-primary" type="button">
              Générer commande
            </button>
          </div>
        </section>

        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Calendrier péremption</h3>
              <div className="sub">Top 5 lots prioritaires</div>
            </div>
            <span className="pill amber">60j</span>
          </div>
          <div className="therm">
            <ExpRow name="Insuline Lantus" qty={42} daysLeft={17} />
            <ExpRow name="Augmentin 1g" qty={64} daysLeft={38} />
            <ExpRow name="Smecta Orange" qty={96} daysLeft={60} />
            <ExpRow name="Ibuprofène 400mg" qty={312} daysLeft={82} />
            <ExpRow name="Amoxicilline 500mg" qty={412} daysLeft={125} />
            <div className="therm-axis">
              <span>J+0</span>
              <span>J+30</span>
              <span>J+90</span>
              <span>J+180</span>
            </div>
          </div>
        </section>

        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Activité de l&apos;équipe</h3>
              <div className="sub">Aujourd&apos;hui</div>
            </div>
            <button className="iconbtn sm" type="button">
              <Dots size={14} />
            </button>
          </div>
          <div className="feed">
            {ACTIVITY.map((a, i) => (
              <div className="feed-row" key={i}>
                <div className={`ic ${a.kind === "default" ? "" : a.kind}`}>
                  {activityIcon(a.kind)}
                </div>
                <div className="t">{a.t}</div>
                <div className="when">{a.when}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
