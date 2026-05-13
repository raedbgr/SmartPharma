type ExpRowProps = {
  name: string;
  qty: number;
  daysLeft: number;
};

export function ExpRow({ name, qty, daysLeft }: ExpRowProps) {
  const pct = Math.max(0, Math.min(100, (daysLeft / 180) * 100));
  return (
    <div className="therm-row">
      <div>
        <div className="name">{name}</div>
        <div className="qty">
          {qty} unités · J-{daysLeft}
        </div>
      </div>
      <div className="therm-bar">
        <i className="seg-180" style={{ width: "100%" }} />
        <i className="seg-90" style={{ width: "50%" }} />
        <i className="seg-30" style={{ width: "17%" }} />
        <i className="mark" style={{ left: `calc(${pct}% - 1px)` }} />
      </div>
      <div className="days">{daysLeft}j</div>
    </div>
  );
}
