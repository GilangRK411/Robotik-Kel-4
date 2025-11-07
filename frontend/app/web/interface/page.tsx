import { routes } from "@/config/routes";
import { StatsCard } from "../../../components/stats-card";
import { fetchDashboardData } from "./data/page";

export default async function DashboardPage() {
  const data = await fetchDashboardData();
  const { summaries, logs } = data;
  const activeRobots = summaries.filter((robot) => robot.status === "active");

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-6 px-6 py-10">
      <section>
        <p className="text-xs uppercase tracking-wide text-slate-500">Rute aktif</p>
        <h1 className="text-3xl font-semibold text-slate-900">{routes[0].name}</h1>
        <p className="text-sm text-slate-500">{routes[0].description}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StatsCard title="Total Robot" value={`${summaries.length}`} helper="Unit terdaftar" />
        <StatsCard title="Robot Aktif" value={`${activeRobots.length}`} helper="Sedang menjalankan tugas" trend="up" />
        <StatsCard title="Perlu Perhatian" value={`${summaries.filter((robot) => robot.status !== "active").length}`} helper="Idle / Maintenance" trend="down" />
      </section>

      <section className="rounded-2xl border border-slate-100 bg-white/70 p-4">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Aktivitas Terbaru</h2>
            <p className="text-xs text-slate-500">Dummy log dari folder web/data</p>
          </div>
        </header>

        <ul className="mt-4 space-y-3">
          {logs.map((log) => (
            <li key={log.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-sm text-slate-800">{log.message}</p>
              <p className="text-xs text-slate-500">
                {log.robotId} • {new Date(log.timestamp).toLocaleTimeString("id-ID")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
