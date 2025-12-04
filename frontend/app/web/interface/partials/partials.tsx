import type { DashboardData, WorkSeriesResponse, WorkEntry } from "@/lib/types/web";

const dummyData: DashboardData = {
  summaries: [
    { id: "rbx-01", name: "Atlas", status: "active", batteryLevel: 82 },
    { id: "rbx-12", name: "Zephyr", status: "idle", batteryLevel: 56 },
    { id: "rbx-07", name: "Nimbus", status: "maintenance", batteryLevel: 34 },
  ],
  logs: [
    {
      id: "log-1",
      robotId: "rbx-01",
      message: "Atlas memasuki zona inspeksi.",
      timestamp: new Date().toISOString(),
    },
    {
      id: "log-2",
      robotId: "rbx-12",
      message: "Zephyr standby menunggu perintah.",
      timestamp: new Date().toISOString(),
    },
  ],
};

export async function fetchDashboardData(): Promise<DashboardData> {
  // simulasi fetch ke backend; sengaja diberi jeda untuk feel async
  await new Promise((resolve) => setTimeout(resolve, 150));
  return dummyData;
}

export async function fetchWorkPerformance(): Promise<WorkEntry[]> {
  // If NEXT_PUBLIC_BACKEND_URL is defined, use it; else call local API route
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");
  const url = base ? `${base}/api/productivity` : "/api/productivity";
  // console.log("url: ", url);
  try {
    const res = await fetch(url, { cache: "no-store" });
    // console.log(`response from ${url}:`, res.body);
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = (await res.json()) as WorkSeriesResponse;
    // console.log("Fetched work performance data:", json);
    return json.entries;
  } catch (err) {
    // console.error("Error fetching work performance data:", err);
    const now = new Date();
    const entries: WorkEntry[] = [];
    for (let i = 60; i >= 0; i--) {
      const ts = new Date(now.getTime() - i * 10 * 60 * 1000);
      const status = i % 3 === 0 ? "not_work" : "work";
      entries.push({ timestamp: ts.toISOString(), status });
    }
    return entries;
  }
}
