"use client";

import { Calendar, Clock, Landmark, ScrollText } from "lucide-react";
import type { ReactNode } from "react";

import { RealtimeGdp, RealtimePopulation } from "@/components/live/realtime";
import { RealtimeLeaders } from "@/components/live/realtime-leaders";
import { ConfidenceBadge, RegimeBadge } from "@/components/ui/badges";
import { FlagBadge } from "@/components/ui/flag-badge";
import { getCountrySymbolProfile } from "@/lib/country-symbols";
import { formatPlainNumber } from "@/lib/format";
import { displayCountryName, displayLegislature, displayOfficialName, displayRegion, displaySummary, displayValue, tr } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { CountryPoliticalProfile } from "@/lib/types";

export function CountryProfile({ country }: { country: CountryPoliticalProfile }) {
  useLanguage();
  const symbolProfile = getCountrySymbolProfile(country.iso3);
  const history = symbolProfile?.sections.historyDepth;

  return (
    <div className="space-y-6">
      <section className="atlas-surface rounded-lg p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <FlagBadge country={country} variant="hero" />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-teal-200">{country.iso3}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{displayCountryName(country)}</h1>
              <p className="mt-1 text-slate-300">{displayOfficialName(country)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <RegimeBadge value={country.regimeCategory} />
                <ConfidenceBadge value={country.confidenceLevel} />
              </div>
            </div>
          </div>
          <dl className="grid min-w-[240px] gap-3 text-sm">
            <Fact label={tr("Thủ đô")} value={country.capital} />
            <Fact label={tr("Khu vực")} value={`${displayRegion(country.region)}${country.subregion ? ` / ${country.subregion}` : ""}`} />
            <RealtimePopulation country={country} />
            <Fact label={tr("Diện tích")} value={country.areaKm2 ? `${formatPlainNumber(country.areaKm2)} km²` : undefined} />
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfilePanel title={tr("Bản sắc chính trị")}>
          <Fact label={tr("Hệ tư tưởng chính thức")} value={country.officialIdeology} />
          <Fact label={tr("Bản sắc hiến định")} value={country.constitutionalIdentity} />
          <Fact label={tr("Mô hình chính phủ")} value={country.governmentSystem} />
          <Fact label={tr("Hình thức nhà nước")} value={country.stateForm} />
          <Fact label={tr("Chế độ chính trị")} value={country.politicalRegime} />
          <Fact label={tr("Mô hình chính trị")} value={country.politicalModel} />
          <Fact label={tr("Cấu trúc quyền lực")} value={country.powerStructure} />
        </ProfilePanel>

        <ProfilePanel title={tr("Lãnh đạo")}>
          <Fact label={tr("Đảng cầm quyền")} value={country.rulingParty} />
          <Fact label={tr("Hệ thống đảng")} value={country.partySystem} />
          <RealtimeLeaders country={country} />
        </ProfilePanel>

        <ProfilePanel title={tr("Thiết chế")}>
          <Fact label={tr("Cơ quan lập pháp")} value={displayLegislature(country.legislature)} />
          <Fact label={tr("Cấu trúc lập pháp")} value={country.legislatureStructure} />
          <Fact label={tr("Tư pháp")} value={country.judiciary} />
          <Fact label={tr("Hiến pháp")} value={country.constitution} />
          <Fact label={tr("Bầu cử gần nhất")} value={country.lastElection} />
          <Fact label={tr("Bầu cử tiếp theo")} value={country.nextElection} />
        </ProfilePanel>

        <ProfilePanel title={tr("Kinh tế & dấu hiệu")}>
          <Fact label={tr("Mô hình kinh tế")} value={country.economicModel} />
          <RealtimeGdp country={country} />
          <Fact label={tr("Đảng cộng sản cầm quyền")} value={flagValue(country.hasCommunistRulingParty)} />
          <Fact
            label={tr("Quân chủ / Cộng hòa")}
            value={country.isMonarchy ? tr("Quân chủ") : country.isRepublic ? tr("Cộng hòa") : tr("Lãnh thổ/vùng tự trị hoặc cơ chế đặc thù")}
          />
          <Fact
            label={tr("Liên bang / Đơn nhất")}
            value={country.isFederal ? tr("Liên bang") : country.isUnitary ? tr("Đơn nhất") : tr("Không áp dụng trực tiếp với lãnh thổ/cơ chế đặc thù")}
          />
        </ProfilePanel>
      </div>

      <section className="atlas-surface rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">{tr("Tóm tắt")}</h2>
        <p className="mt-3 leading-7 text-slate-300">{displaySummary(country)}</p>
      </section>

      {/* Lịch sử hình thành nhà nước */}
      <section className="atlas-surface rounded-lg p-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15">
            <Landmark className="h-4.5 w-4.5 text-amber-400" aria-hidden="true" />
          </div>
          <h2 className="text-lg font-semibold text-white">{tr("Lịch sử hình thành")}</h2>
        </div>

        {history ? (
          <div className="mt-4 space-y-4">
            {/* Key stats row */}
            <div className="grid gap-3 sm:grid-cols-3">
              {history.modernFoundingYear && (
                <div className="flex items-start gap-3 rounded-lg border border-slate-700/60 bg-slate-800/40 p-3">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-teal-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{tr("Năm thành lập hiện đại")}</p>
                    <p className="mt-0.5 text-lg font-semibold text-white">{history.modernFoundingYear}</p>
                  </div>
                </div>
              )}
              {history.yearsCount && (
                <div className="flex items-start gap-3 rounded-lg border border-slate-700/60 bg-slate-800/40 p-3">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{tr("Tuổi nhà nước")}</p>
                    <p className="mt-0.5 text-lg font-semibold text-white">{history.yearsCount} {tr("năm")}</p>
                  </div>
                </div>
              )}
              {history.keyMilestone && (
                <div className="flex items-start gap-3 rounded-lg border border-slate-700/60 bg-slate-800/40 p-3 sm:col-span-1">
                  <ScrollText className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-slate-500">{tr("Mốc lịch sử")}</p>
                    <p className="mt-0.5 text-sm leading-6 text-slate-200">{history.keyMilestone}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Ancient depth */}
            {history.ancientDepth && (
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-amber-400/80">{tr("Chiều sâu văn minh")}</p>
                <p className="mt-1.5 text-sm leading-6 text-slate-300">{history.ancientDepth}</p>
              </div>
            )}

            {/* Description */}
            {history.description && (
              <p className="text-sm leading-7 text-slate-400">{history.description}</p>
            )}
          </div>
        ) : (
          <p className="mt-3 text-sm text-slate-500">{tr("Chưa có dữ liệu lịch sử hình thành cho quốc gia này.")}</p>
        )}

        <p className="mt-4 text-sm text-slate-500">{tr("Cập nhật hồ sơ:")} {country.dataUpdatedAt}</p>
      </section>
    </div>
  );
}

function ProfilePanel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="atlas-surface rounded-lg p-5">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <dl className="mt-4 space-y-3">{children}</dl>
    </section>
  );
}

function Fact({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-slate-100 prose-safe">{displayValue(value)}</dd>
    </div>
  );
}

function flagValue(value?: boolean) {
  if (typeof value !== "boolean") {
    return tr("Không áp dụng hoặc chưa có cờ dữ liệu riêng");
  }
  return value ? tr("Có") : tr("Không");
}
