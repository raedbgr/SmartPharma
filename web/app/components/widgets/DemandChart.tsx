import { SERIES } from "../../lib/data";

const W = 720;
const H = 230;
const P = { l: 36, r: 14, t: 16, b: 28 };
const CONFIDENCE_BAND = 60;

export function DemandChart({ accent = "oklch(0.42 0.06 175)" }: { accent?: string }) {
  const data = SERIES;
  const ys = data.flatMap((d) => [d.demand, d.pred]);
  const yMin = Math.min(...ys) - 60;
  const yMax = Math.max(...ys) + 60;

  const xs = (i: number) => P.l + (i / (data.length - 1)) * (W - P.l - P.r);
  const ysc = (v: number) => P.t + (1 - (v - yMin) / (yMax - yMin)) * (H - P.t - P.b);

  const demandPath = data
    .map((d, i) => `${i ? "L" : "M"} ${xs(i).toFixed(1)} ${ysc(d.demand).toFixed(1)}`)
    .join(" ");
  const predPath = data
    .map((d, i) => `${i ? "L" : "M"} ${xs(i).toFixed(1)} ${ysc(d.pred).toFixed(1)}`)
    .join(" ");

  const bandTop = data
    .map(
      (d, i) =>
        `${i ? "L" : "M"} ${xs(i).toFixed(1)} ${ysc(d.pred + CONFIDENCE_BAND).toFixed(1)}`,
    )
    .join(" ");
  const bandBot = [...data]
    .reverse()
    .map((d, i) => {
      const j = data.length - 1 - i;
      return `L ${xs(j).toFixed(1)} ${ysc(d.pred - CONFIDENCE_BAND).toFixed(1)}`;
    })
    .join(" ");

  const xLabels = [];
  for (let i = 0; i < data.length; i += 7) {
    xLabels.push({ i, label: `J-${27 - i}` });
  }

  const yTicks = 4;
  const grid = Array.from({ length: yTicks + 1 }, (_, k) => {
    const v = yMin + (yMax - yMin) * (k / yTicks);
    return { y: ysc(v), v: Math.round(v) };
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="chart" preserveAspectRatio="none">
      {grid.map((g, i) => (
        <g key={i}>
          <line x1={P.l} x2={W - P.r} y1={g.y} y2={g.y} stroke="rgba(20,20,15,0.06)" />
          <text
            x={P.l - 8}
            y={g.y + 3}
            textAnchor="end"
            fontFamily="var(--font-geist-mono), monospace"
            fontSize="9"
            fill="#A5A498"
          >
            {g.v}
          </text>
        </g>
      ))}
      {xLabels.map((l) => (
        <text
          key={l.i}
          x={xs(l.i)}
          y={H - 6}
          textAnchor="middle"
          fontFamily="var(--font-geist-mono), monospace"
          fontSize="9.5"
          fill="#A5A498"
        >
          {l.label}
        </text>
      ))}
      <path d={`${bandTop} ${bandBot} Z`} fill={accent} opacity="0.10" />
      <path d={predPath} fill="none" stroke={accent} strokeWidth="1.4" strokeDasharray="4 4" />
      <path
        d={demandPath}
        fill="none"
        stroke="#14140F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={xs(data.length - 1)}
        cy={ysc(data[data.length - 1].demand)}
        r="3.2"
        fill="#14140F"
      />
      <circle
        cx={xs(data.length - 1)}
        cy={ysc(data[data.length - 1].demand)}
        r="6"
        fill="#14140F"
        opacity="0.10"
      />
      <line
        x1={xs(20)}
        x2={xs(20)}
        y1={P.t}
        y2={H - P.b}
        stroke="rgba(20,20,15,0.18)"
        strokeDasharray="2 3"
      />
      <text
        x={xs(20)}
        y={P.t - 4}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono), monospace"
        fontSize="9"
        fill="#6E6E63"
      >
        AUJOURD&apos;HUI
      </text>
    </svg>
  );
}
