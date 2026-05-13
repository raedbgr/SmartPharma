type SparklineProps = {
  points: number[];
  stroke?: string;
  width?: number;
  height?: number;
};

export function Sparkline({
  points,
  stroke = "currentColor",
  width = 70,
  height = 26,
}: SparklineProps) {
  if (points.length < 2) return null;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const span = max - min || 1;
  const dx = width / (points.length - 1);
  const d = points
    .map((v, i) => {
      const x = (i * dx).toFixed(2);
      const y = (height - ((v - min) / span) * height).toFixed(2);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      className="spark"
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <path
        d={d}
        stroke={stroke}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
