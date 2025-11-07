import type { DashboardData } from "@/lib/types/web";

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
