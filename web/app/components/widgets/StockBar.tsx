type StockBarProps = {
  stock: number;
  min: number;
};

export function StockBar({ stock, min }: StockBarProps) {
  const pct = Math.min(100, (stock / Math.max(min * 3, 1)) * 100);
  let cls: "low" | "med" | "ok" = "ok";
  if (stock < min) cls = "low";
  else if (stock < min * 1.5) cls = "med";

  return (
    <span>
      <span className="stockbar">
        <i className={cls} style={{ width: `${pct}%` }} />
      </span>
      <span className="num">{stock.toLocaleString("fr-FR")}</span>
      <span style={{ color: "var(--ink-4)", fontSize: 11, marginLeft: 6 }}>/ {min}</span>
    </span>
  );
}
