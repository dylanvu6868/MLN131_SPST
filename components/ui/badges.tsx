"use client";

import { getRegimeColorClass } from "@/lib/format";
import { confidenceLabel, regimeLabel, tr } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ConfidenceLevel, RegimeCategory } from "@/lib/types";

export function RegimeBadge({ value }: { value?: RegimeCategory | string }) {
  const label = value ?? "Unknown";
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-medium whitespace-nowrap",
        getRegimeColorClass(label)
      )}
    >
      {regimeLabel(label)}
    </span>
  );
}

export function ConfidenceBadge({ value }: { value?: ConfidenceLevel }) {
  const label = value ?? "unknown";
  const styles: Record<ConfidenceLevel, string> = {
    high: "border-emerald-400/40 bg-emerald-500/15 text-emerald-100",
    medium: "border-sky-400/40 bg-sky-500/15 text-sky-100",
    low: "border-amber-400/40 bg-amber-500/15 text-amber-100",
    unknown: "border-slate-400/30 bg-slate-500/15 text-slate-100"
  };

  return (
    <span className={cn("inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-medium", styles[label])}>
      {tr("Độ tin cậy")}: {confidenceLabel(label)}
    </span>
  );
}

export function SourceBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex min-h-7 items-center rounded-md border border-cyan-300/30 bg-cyan-400/10 px-2.5 py-1 text-xs text-cyan-100">
      {name}
    </span>
  );
}
