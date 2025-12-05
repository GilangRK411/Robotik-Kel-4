import type { WorkSeriesResponse, WorkEntry, WorkStatus } from "@/lib/types/web";

type RawWorkEntry = Partial<WorkEntry> & { status?: WorkStatus };

const FALLBACK_BASE_URL = "http://localhost:5000";

function normalizeWorkEntries(entries: RawWorkEntry[]): WorkEntry[] {
  return entries
    .map((entry) => {
      const label = entry.label ?? entry.status;
      if (!entry.timestamp || !label) return null;
      return {
        timestamp: entry.timestamp,
        label,
        probability: typeof entry.probability === "number" ? entry.probability : 0,
      };
    })
    .filter((entry): entry is WorkEntry => Boolean(entry));
}

export type FetchWorkPerformanceResult = {
  entries: WorkEntry[];
  error?: string;
};

export async function fetchWorkPerformance(limit = 200): Promise<FetchWorkPerformanceResult> {
  // Default ke backend Flask (app.py); masih bisa di-override lewat NEXT_PUBLIC_BACKEND_URL.
  const base = (process.env.NEXT_PUBLIC_BACKEND_URL || FALLBACK_BASE_URL).replace(/\/$/, "");
  const search = limit ? `?limit=${limit}` : "";
  const url = `${base}/api/productivity${search}`;
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
    const json = (await res.json()) as WorkSeriesResponse | { entries?: RawWorkEntry[] };
    const normalized = normalizeWorkEntries(json.entries ?? []);
    return { entries: normalized };
  } catch (err) {
    return {
      entries: [],
      error: "Gagal mengambil data dari backend. Pastikan service Flask berjalan atau set NEXT_PUBLIC_BACKEND_URL.",
    };
  }
}
