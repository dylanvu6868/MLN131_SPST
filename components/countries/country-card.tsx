"use client";

import Link from "next/link";
import { ArrowRight, Building2, Landmark, Users } from "lucide-react";

import { ConfidenceBadge, RegimeBadge } from "@/components/ui/badges";
import { FlagBadge } from "@/components/ui/flag-badge";
import { formatNumber } from "@/lib/format";
import { displayCountryName, displayValue } from "@/lib/i18n";
import type { CountryPoliticalProfile } from "@/lib/types";

export function CountryCard({ country }: { country: CountryPoliticalProfile }) {
  return (
    <article className="atlas-surface flex h-full flex-col rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <FlagBadge country={country} variant="card" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold leading-tight text-white sm:text-base">{displayCountryName(country)}</h3>
            <p className="truncate text-xs text-slate-400 sm:text-sm">{country.officialName}</p>
          </div>
        </div>
        <Link
          href={`/countries/${country.iso3}`}
          className="focus-ring grid h-9 w-9 shrink-0 place-items-center rounded-md border border-slate-600 bg-slate-900 text-slate-200 hover:border-teal-300/60 hover:text-teal-100"
          aria-label={`Mở hồ sơ ${displayCountryName(country)}`}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <RegimeBadge value={country.regimeCategory} />
        <ConfidenceBadge value={country.confidenceLevel} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div className="flex items-start gap-2">
          <Landmark className="mt-0.5 h-4 w-4 shrink-0 text-teal-200" aria-hidden="true" />
          <div>
            <dt className="text-xs text-slate-500">Mô hình chính phủ</dt>
            <dd className="mt-0.5 text-sm leading-6 text-slate-200">{displayValue(country.governmentSystem)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" aria-hidden="true" />
          <div>
            <dt className="text-xs text-slate-500">Hình thức nhà nước</dt>
            <dd className="mt-0.5 text-sm leading-6 text-slate-200">{displayValue(country.stateForm)}</dd>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Users className="mt-0.5 h-4 w-4 shrink-0 text-amber-200" aria-hidden="true" />
          <div>
            <dt className="text-xs text-slate-500">Dân số</dt>
            <dd className="mt-0.5 text-sm leading-6 text-slate-200">{formatNumber(country.population)}</dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400 prose-safe">{displayValue(country.summary ?? country.powerStructure)}</p>
    </article>
  );
}
