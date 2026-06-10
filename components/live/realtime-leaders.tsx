"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

import { displayValue, getDisplayLanguage, tr } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { CountryPoliticalProfile } from "@/lib/types";

type LiveLeader = { name: string; title?: string; titleEn?: string };

type LeadersResponse = {
  generatedAt?: string;
  source?: string;
  headOfState?: LiveLeader | null;
  headOfGovernment?: LiveLeader | null;
};

/**
 * Pulls the current head of state / head of government live from Wikipedia on
 * every page view (cached 1h server-side). Leadership is politically sensitive,
 * so the displayed name always reflects the freshest Wikipedia infobox, falling
 * back to the stored profile value when the live fetch is unavailable.
 */
export function RealtimeLeaders({ country }: { country: CountryPoliticalProfile }) {
  useLanguage();
  const [live, setLive] = useState<LeadersResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/leaders/${country.iso3}`, { cache: "no-store" })
      .then((response) => (response.ok ? (response.json() as Promise<LeadersResponse>) : null))
      .then((data) => {
        if (!cancelled && data) {
          setLive(data);
        }
      })
      .catch(() => {
        /* keep the stored profile values */
      });
    return () => {
      cancelled = true;
    };
  }, [country.iso3]);

  const en = getDisplayLanguage() === "en";

  const hosTitle =
    leaderTitle(live?.headOfState, en) ??
    (country.headOfStateTitle ? String(displayValue(country.headOfStateTitle)) : tr("Nguyên thủ quốc gia"));
  const hosName = live?.headOfState?.name ?? valueOrDash(country.headOfState);
  const hosLive = Boolean(live?.headOfState?.name);

  const hogTitle =
    leaderTitle(live?.headOfGovernment, en) ??
    (country.headOfGovernmentTitle ? String(displayValue(country.headOfGovernmentTitle)) : tr("Người đứng đầu chính phủ"));
  const hogName = live?.headOfGovernment?.name ?? valueOrDash(country.headOfGovernment);
  const hogLive = Boolean(live?.headOfGovernment?.name);

  return (
    <>
      <LeaderFact label={hosTitle} name={hosName} live={hosLive} source={live?.source} generatedAt={live?.generatedAt} />
      <LeaderFact label={hogTitle} name={hogName} live={hogLive} source={live?.source} generatedAt={live?.generatedAt} />
    </>
  );
}

function LeaderFact({
  label,
  name,
  live,
  source,
  generatedAt
}: {
  label: string;
  name: string;
  live?: boolean;
  source?: string;
  generatedAt?: string;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-slate-500">
        {label}
        {live ? (
          <span
            title={generatedAt ? `${tr("Cập nhật từ Wikipedia")}: ${formatStamp(generatedAt)}` : tr("Cập nhật từ Wikipedia")}
            className="inline-flex items-center gap-1 rounded-full border border-teal-300/30 bg-teal-400/10 px-1.5 py-0.5 text-[10px] font-medium normal-case tracking-normal text-teal-200"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal-300" aria-hidden="true" />
            {tr("Trực tiếp")}
          </span>
        ) : null}
      </dt>
      <dd className="mt-1 flex items-center gap-2 text-sm leading-6 text-slate-100 prose-safe">
        <span>{name}</span>
        {live && source ? (
          <a
            href={source}
            target="_blank"
            rel="noreferrer"
            className="focus-ring inline-flex items-center text-slate-500 hover:text-teal-200"
            aria-label={tr("Nguồn Wikipedia")}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        ) : null}
      </dd>
    </div>
  );
}

function leaderTitle(leader: LiveLeader | null | undefined, en: boolean) {
  if (!leader) {
    return undefined;
  }
  const title = en ? leader.titleEn ?? leader.title : leader.title ?? leader.titleEn;
  return title?.trim() || undefined;
}

function valueOrDash(value?: string) {
  if (!value || value === "Needs verification" || value === "Data unavailable") {
    return getDisplayLanguage() === "en" ? "Data unavailable" : "Chưa có dữ liệu";
  }
  return value;
}

function formatStamp(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat(getDisplayLanguage() === "en" ? "en-US" : "vi-VN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}
