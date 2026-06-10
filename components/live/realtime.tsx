"use client";

import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

import { getDisplayLanguage, tr } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import { projectGrowth, toEpoch } from "@/lib/live-projection";
import type { CountryPoliticalProfile } from "@/lib/types";
import { useTick, useWorldometersLive } from "@/components/live/use-worldometers-live";

/**
 * GDP and GDP-per-capita as live counters that tick upward in real time, the
 * way the Worldometers GDP clock does. Base figures come from the dataset
 * (synced from Worldometers); on mount they refresh from the live snapshot.
 */
export function RealtimeGdp({ country }: { country: CountryPoliticalProfile }) {
  useLanguage();
  const live = useWorldometersLive(country.iso3);

  const gdp = live?.data.gdp ?? country.gdp;
  const gdpPerCapita = live?.data.gdpPerCapita ?? country.gdpPerCapita;
  const gdpGrowthRate = live?.data.gdpGrowthRate ?? country.gdpGrowthRate;
  const populationGrowthRate = live?.data.populationGrowthRate ?? country.populationGrowthRate;
  const anchorMs = (live ? toEpoch(live.generatedAt) : toEpoch(country.gdpUpdatedAt)) ?? Date.now();

  const hasGdp = typeof gdp === "number" && gdp > 0;
  const ticking = hasGdp && Boolean(gdpGrowthRate);
  const now = useTick(ticking);

  const liveGdp = hasGdp ? projectGrowth(gdp as number, gdpGrowthRate, anchorMs, now) : undefined;
  // Real GDP per capita grows at GDP growth minus population growth.
  const perCapitaGrowth =
    typeof gdpGrowthRate === "number" ? gdpGrowthRate - (populationGrowthRate ?? 0) : undefined;
  const livePerCapita =
    typeof gdpPerCapita === "number" ? projectGrowth(gdpPerCapita, perCapitaGrowth, anchorMs, now) : undefined;

  return (
    <>
      <LiveFact
        label={tr("GDP")}
        value={liveGdp !== undefined ? `$${formatNumber(liveGdp, 0)}` : undefined}
        live={ticking}
        chip={typeof gdpGrowthRate === "number" ? <GrowthChip growth={gdpGrowthRate} /> : undefined}
      />
      <LiveFact
        label={tr("GDP bình quân đầu người")}
        value={livePerCapita !== undefined ? `$${formatNumber(livePerCapita, 2)}` : undefined}
        live={ticking}
      />
    </>
  );
}

/** Live population counter (Worldometers-style) for the country hero. */
export function RealtimePopulation({ country }: { country: CountryPoliticalProfile }) {
  useLanguage();
  const live = useWorldometersLive(country.iso3);

  const population = live?.data.population ?? country.population;
  const growthRate = live?.data.populationGrowthRate ?? country.populationGrowthRate;
  const anchorMs = (live ? toEpoch(live.generatedAt) : toEpoch(country.populationUpdatedAt)) ?? Date.now();

  const hasPopulation = typeof population === "number" && population > 0;
  const ticking = hasPopulation && Boolean(growthRate);
  const now = useTick(ticking);

  const livePopulation = hasPopulation ? projectGrowth(population as number, growthRate, anchorMs, now) : undefined;

  return (
    <LiveFact
      label={tr("Dân số")}
      value={livePopulation !== undefined ? formatNumber(livePopulation, 0) : undefined}
      live={ticking}
      chip={typeof growthRate === "number" ? <GrowthChip growth={growthRate} /> : undefined}
    />
  );
}

function LiveFact({
  label,
  value,
  live,
  chip
}: {
  label: string;
  value?: string;
  live?: boolean;
  chip?: ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
        {value && live ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-400/10 px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-teal-200">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" aria-hidden="true" />
            {tr("Trực tiếp")}
          </span>
        ) : null}
      </dt>
      <dd className="mt-1 font-mono text-sm leading-6 text-slate-100 tabular-nums prose-safe">
        {value ?? tr("Chưa có dữ liệu")}
        {value && chip ? chip : null}
      </dd>
    </div>
  );
}

function GrowthChip({ growth }: { growth: number }) {
  const positive = growth >= 0;
  return (
    <span
      className={`ml-2 inline-flex items-center gap-1 align-middle text-xs ${
        positive ? "text-emerald-300" : "text-rose-300"
      }`}
    >
      {positive ? (
        <TrendingUp className="h-3.5 w-3.5" aria-hidden="true" />
      ) : (
        <TrendingDown className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {growth.toFixed(2)}%/{tr("năm")}
    </span>
  );
}

function formatNumber(value: number, fractionDigits: number) {
  const locale = getDisplayLanguage() === "en" ? "en-US" : "vi-VN";
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(value);
}
