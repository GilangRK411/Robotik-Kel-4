type Trend = "up" | "down" | "flat";

const trendStyles: Record<Trend, { label: string; color: string }> = {
  up: { label: "Naik", color: "text-green-500" },
  down: { label: "Turun", color: "text-red-500" },
  flat: { label: "Stabil", color: "text-slate-400" },
};

type StatsCardProps = {
  title: string;
  value: string;
  helper?: string;
  trend?: Trend;
};

export function StatsCard({
  title,
  value,
  helper,
  trend = "flat",
}: StatsCardProps) {
  const trendStyle = trendStyles[trend];

  return (
    <article className="rounded-xl border border-slate-200 bg-white/60 p-4 shadow-sm">
      <header className="text-sm text-slate-500">{title}</header>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      <footer className="mt-1 text-xs text-slate-500">
        {helper ?? trendStyle.label}
        <span className={`ml-2 font-medium ${trendStyle.color}`}>
          {trendStyle.label}
        </span>
      </footer>
    </article>
  );
}
