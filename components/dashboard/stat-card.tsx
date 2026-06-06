import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  detail,
  icon: Icon
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
}) {
  return (
    <div className="atlas-surface rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-md border border-teal-300/30 bg-teal-400/10">
          <Icon className="h-5 w-5 text-teal-100" aria-hidden="true" />
        </span>
      </div>
      {detail ? <p className="mt-3 text-sm text-slate-400">{detail}</p> : null}
    </div>
  );
}

