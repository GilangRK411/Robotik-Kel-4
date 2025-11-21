import { NextResponse } from "next/server";
import type { WorkEntry, WorkSeriesResponse } from "@/lib/types/web";

export const revalidate = 0; // always fresh

function generateDummyEntries(): WorkEntry[] {
  const now = new Date();
  const entries: WorkEntry[] = [];
  const intervalMinutes = 10; // 10-minute resolution
  const totalIntervals = (24 * 60) / intervalMinutes; // last 24 hours

  for (let i = totalIntervals; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * intervalMinutes * 60 * 1000);
    const hour = ts.getHours();
    // bias: working hours more likely to be "work"
    const base = hour >= 8 && hour <= 18 ? 0.75 : 0.35;
    const noise = 0.15 * Math.sin(i * 0.35) + 0.1 * Math.random();
    const pWork = Math.min(0.95, Math.max(0.05, base + noise));
    const status = Math.random() < pWork ? "work" : "not_work";
    entries.push({ timestamp: ts.toISOString(), status });
  }
  return entries;
}

export async function GET() {
  // TODO: Replace with real DB query aggregating work/not_work events by time.
  const payload: WorkSeriesResponse = { entries: generateDummyEntries() };
  return NextResponse.json(payload, { headers: { "Cache-Control": "no-store" } });
}

