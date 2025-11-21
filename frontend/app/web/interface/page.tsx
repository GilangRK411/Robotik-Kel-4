import { routes } from "@/config/routes";
import { StatsCard } from "../../../components/stats-card";
import { WorkChart } from "@/components/work-chart";
import { fetchWorkPerformance } from "./partials/partials";
import type { WorkEntry } from "@/lib/types/web";

function groupByHour(entries: WorkEntry[]) {
  const map = new Map<string, { ts: number; work: number; total: number }>();
  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:00`;
    const bucket = map.get(key) ?? { ts: new Date(d.getFullYear(), d.getMonth(), d.getDate(), d.getHours()).getTime(), work: 0, total: 0 };
    bucket.total += 1;
    if (e.status === "work") bucket.work += 1;
    map.set(key, bucket);
  }
  const arr = Array.from(map.entries())
    .map(([label, v]) => ({ label, ts: v.ts, ratio: v.total ? v.work / v.total : 0 }))
    .sort((a, b) => a.ts - b.ts);
  const last24 = arr.slice(-24);
  return last24.map((b) => ({ label: b.label.slice(-5), ratio: b.ratio }));
}

function computeDurations(entries: WorkEntry[]) {
  const sorted = [...entries].sort((a, b) => +new Date(a.timestamp) - +new Date(b.timestamp));
  let workMs = 0;
  let notWorkMs = 0;
  for (let i = 0; i < sorted.length - 1; i++) {
    const cur = sorted[i];
    const next = sorted[i + 1];
    const dt = +new Date(next.timestamp) - +new Date(cur.timestamp);
    if (cur.status === "work") workMs += dt;
    else notWorkMs += dt;
  }
  const totalMs = workMs + notWorkMs || 1;
  const ratio = Math.round((workMs / totalMs) * 100);
  return { workMs, notWorkMs, ratio };
}

function fmtDuration(ms: number) {
  const m = Math.round(ms / 60000);
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h > 0) return `${h}j ${mm}m`;
  return `${m}m`;
}

export default async function DashboardPage() {
  const entries = await fetchWorkPerformance();
  const buckets = groupByHour(entries);
  const { workMs, notWorkMs, ratio } = computeDurations(entries);

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <section>
        <p className="text-xs uppercase tracking-wide text-slate-500">Modul aktif</p>
        <h1 className="text-3xl font-semibold text-slate-900">{routes[0].name}</h1>
        <p className="text-sm text-slate-500">Deteksi aktivitas kerja manusia (kerja vs tidak kerja) dari backend.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Rasio Kerja" value={`${ratio}%`} helper="24 jam terakhir" trend={ratio >= 66 ? "up" : ratio >= 33 ? "flat" : "down"} />
        <StatsCard title="Durasi Kerja" value={fmtDuration(workMs)} helper="Estimasi berdasarkan log" />
        <StatsCard title="Durasi Tidak Kerja" value={fmtDuration(notWorkMs)} helper="Estimasi berdasarkan log" />
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/70 p-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Grafik Performa Kerja</h2>
            <p className="text-xs text-slate-500">Rasio kerja per jam (24 jam terakhir)</p>
          </div>
        </header>
        <div className="mt-4">
          <WorkChart buckets={buckets} />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/70 p-4">
        <header>
          <h2 className="text-lg font-semibold text-slate-900">Riwayat Status</h2>
          <p className="text-xs text-slate-500">Data disimpan dengan timestamp (kerja / tidak kerja)</p>
        </header>
        <ul className="mt-4 space-y-2">
          {entries.slice(-10).reverse().map((e) => (
            <li key={e.timestamp} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-4 py-2">
              <span className="text-sm text-slate-800">{new Date(e.timestamp).toLocaleString("id-ID")}</span>
              <span className={`text-xs font-medium ${e.status === "work" ? "text-green-600" : "text-red-600"}`}>
                {e.status === "work" ? "kerja" : "tidak kerja"}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
