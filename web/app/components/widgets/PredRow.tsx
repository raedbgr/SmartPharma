import type { Prediction } from "../../lib/types";

export function PredRow({ p }: { p: Prediction }) {
  return (
    <div className="pred-row">
      <div>
        <div className="pn">{p.name}</div>
        <div className="pm">
          {p.cls} · confiance {Math.round(p.conf * 100)}%
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className={`when-tag ${p.kind === "amber" ? "amber" : ""}`}>
          rupture J+{p.etaDays}
        </div>
      </div>
    </div>
  );
}
