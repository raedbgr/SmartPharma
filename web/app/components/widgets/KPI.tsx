import { ArrowDown, ArrowUp } from "../Icon";
import { Sparkline } from "./Sparkline";

type KPIProps = {
  label: string;
  value: string;
  unit?: string;
  delta: string;
  deltaDir: "up" | "down";
  spark: number[];
};

const SPARK_DOWN = "oklch(0.62 0.18 30)";
const SPARK_UP = "oklch(0.42 0.06 175)";

export function KPI({ label, value, unit, delta, deltaDir, spark }: KPIProps) {
  return (
    <div className="kpi reveal">
      <div className="lbl">{label}</div>
      <div className="val num">
        {value}
        {unit && <span className="unit">{unit}</span>}
      </div>
      <div className={`delta ${deltaDir}`}>
        {deltaDir === "up" ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
        <b>{delta}</b> <span>vs. 30j</span>
      </div>
      <Sparkline points={spark} stroke={deltaDir === "down" ? SPARK_DOWN : SPARK_UP} />
    </div>
  );
}
