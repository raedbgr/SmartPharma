import { Fragment } from "react";
import { KPI } from "../widgets/KPI";
import { AI_RECOMMENDATIONS, MODEL_SIGNALS } from "../../lib/data";

export function AIView() {
  return (
    <>
      <div className="page-hd">
        <div>
          <h1>
            Prédictions <em>Nerolina AI</em>
          </h1>
          <p>
            Modèle entraîné sur 18 mois de données de ventes, saisonnalité, prescriptions et
            alertes sanitaires locales.
          </p>
        </div>
        <div className="page-meta">
          <div className="live">
            <span className="live-dot" /> Modèle v2.4 · recalculé il y a 3 min
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <KPI
          label="Précision moyenne"
          value="92,4"
          unit="%"
          delta="+1,8 pts"
          deltaDir="up"
          spark={[6, 7, 8, 7, 9, 10, 11, 10, 12, 11, 13, 12]}
        />
        <KPI
          label="Ruptures évitées (30j)"
          value="47"
          delta="+11"
          deltaDir="up"
          spark={[3, 4, 5, 6, 6, 7, 8, 9, 10, 11, 12, 13]}
        />
        <KPI
          label="Économies estimées"
          value="18 240"
          unit="€"
          delta="+22 %"
          deltaDir="up"
          spark={[4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]}
        />
        <KPI
          label="Stocks dormants détectés"
          value="9"
          delta="−3"
          deltaDir="up"
          spark={[12, 11, 10, 11, 9, 10, 8, 9, 7, 8, 6, 7]}
        />
      </div>

      <div className="grid-2">
        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Recommandations actives</h3>
              <div className="sub">Triées par impact financier estimé</div>
            </div>
            <span className="pill live">12 actions</span>
          </div>
          <div className="alert-list">
            {AI_RECOMMENDATIONS.map((r, i) => (
              <div key={i} className={`alert ${r.sev}`}>
                <div className="bar" />
                <div>
                  <div className="title">{r.title}</div>
                  <div className="meta">
                    {r.meta.map((m, j) => (
                      <Fragment key={j}>
                        <span>{m}</span>
                        {j < r.meta.length - 1 && <span className="dot" />}
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div className="when">conf. {r.confidence}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="card reveal">
          <div className="card-hd">
            <div>
              <h3>Signaux du modèle</h3>
              <div className="sub">Facteurs pondérés cette semaine</div>
            </div>
          </div>
          <div className="signals">
            {MODEL_SIGNALS.map((s, i) => (
              <div key={i} className="row">
                <div className="row-hd">
                  <span>{s.label}</span>
                  <span className="num v">{s.value}%</span>
                </div>
                <div className="track">
                  <div className="fill" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
