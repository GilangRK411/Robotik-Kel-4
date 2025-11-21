type WorkBucket = {
  label: string;
  ratio: number;
};

export function WorkChart({ buckets, height = 128 }: { buckets: WorkBucket[]; height?: number }) {
  return (
    <div className="w-full">
      <div className="flex items-end gap-1" style={{ height }}>
        {buckets.map((b, idx) => {
          const pct = Math.round(b.ratio * 100);
          const color = pct >= 66 ? "bg-green-500" : pct >= 33 ? "bg-yellow-500" : "bg-red-500";
          return (
            <div key={idx} className="flex w-2 flex-col items-center" title={`${b.label} • ${pct}% kerja`}>
              <div className="h-full w-full rounded bg-slate-200">
                <div className={`w-full rounded-b ${color}`} style={{ height: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[10px] text-slate-500">
        <span>{buckets[0]?.label}</span>
        <span>{buckets[Math.max(0, buckets.length - 1)]?.label}</span>
      </div>
    </div>
  );
}

export type { WorkBucket };
