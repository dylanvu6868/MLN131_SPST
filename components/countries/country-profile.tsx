"use client";

import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";

import { ConfidenceBadge, RegimeBadge, SourceBadge } from "@/components/ui/badges";
import { FlagBadge } from "@/components/ui/flag-badge";
import { formatPlainNumber } from "@/lib/format";
import { displayCountryName, displayRegion, displayValue } from "@/lib/i18n";
import type { CountryPoliticalProfile } from "@/lib/types";

export function CountryProfile({ country }: { country: CountryPoliticalProfile }) {
  return (
    <div className="space-y-6">
      <section className="atlas-surface rounded-lg p-5">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-4">
            <FlagBadge country={country} variant="hero" />
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-teal-200">{country.iso3}</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">{displayCountryName(country)}</h1>
              <p className="mt-1 text-slate-300">{country.officialName}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <RegimeBadge value={country.regimeCategory} />
                <ConfidenceBadge value={country.confidenceLevel} />
              </div>
            </div>
          </div>
          <dl className="grid min-w-[240px] gap-3 text-sm">
            <Fact label="Thủ đô" value={country.capital} />
            <Fact label="Khu vực" value={`${displayRegion(country.region)}${country.subregion ? ` / ${country.subregion}` : ""}`} />
            <Fact label="Dân số" value={formatPlainNumber(country.population)} />
            <Fact label="Diện tích" value={country.areaKm2 ? `${formatPlainNumber(country.areaKm2)} km²` : undefined} />
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProfilePanel title="Bản sắc chính trị">
          <Fact label="Hệ tư tưởng chính thức" value={country.officialIdeology} />
          <Fact label="Bản sắc hiến định" value={country.constitutionalIdentity} />
          <Fact label="Mô hình chính phủ" value={country.governmentSystem} />
          <Fact label="Hình thức nhà nước" value={country.stateForm} />
          <Fact label="Chế độ chính trị" value={country.politicalRegime} />
          <Fact label="Cấu trúc quyền lực" value={country.powerStructure} />
        </ProfilePanel>

        <ProfilePanel title="Lãnh đạo">
          <Fact label="Đảng cầm quyền" value={country.rulingParty} />
          <Fact label="Hệ thống đảng" value={country.partySystem} />
          <Fact label={country.headOfStateTitle ? displayValue(country.headOfStateTitle) : "Nguyên thủ quốc gia"} value={country.headOfState} />
          <Fact
            label={country.headOfGovernmentTitle ? displayValue(country.headOfGovernmentTitle) : "Người đứng đầu chính phủ"}
            value={country.headOfGovernment}
          />
        </ProfilePanel>

        <ProfilePanel title="Thiết chế">
          <Fact label="Cơ quan lập pháp" value={country.legislature} />
          <Fact label="Cấu trúc lập pháp" value={country.legislatureStructure} />
          <Fact label="Tư pháp" value={country.judiciary} />
          <Fact label="Hiến pháp" value={country.constitution} />
          <Fact label="Bầu cử gần nhất" value={country.lastElection} />
          <Fact label="Bầu cử tiếp theo" value={country.nextElection} />
        </ProfilePanel>

        <ProfilePanel title="Kinh tế & dấu hiệu">
          <Fact label="Mô hình kinh tế" value={country.economicModel} />
          <Fact label="GDP" value={country.gdp ? formatPlainNumber(country.gdp) : undefined} />
          <Fact label="GDP bình quân đầu người" value={country.gdpPerCapita ? formatPlainNumber(country.gdpPerCapita) : undefined} />
          <Fact label="Đảng cộng sản cầm quyền" value={flagValue(country.hasCommunistRulingParty)} />
          <Fact label="Quân chủ / Cộng hòa" value={country.isMonarchy ? "Quân chủ" : country.isRepublic ? "Cộng hòa" : "Lãnh thổ/vùng tự trị hoặc cơ chế đặc thù"} />
          <Fact label="Liên bang / Đơn nhất" value={country.isFederal ? "Liên bang" : country.isUnitary ? "Đơn nhất" : "Không áp dụng trực tiếp với lãnh thổ/cơ chế đặc thù"} />
        </ProfilePanel>
      </div>

      {country.summary ? (
        <section className="atlas-surface rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Tóm tắt</h2>
          <p className="mt-3 leading-7 text-slate-300">{displayValue(country.summary)}</p>
        </section>
      ) : null}

      <section className="atlas-surface rounded-lg p-5">
        <h2 className="text-lg font-semibold text-white">Tài liệu tham khảo</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {country.sources.map((source, index) =>
            source.url ? (
              <a
                key={`${source.name}-${source.field ?? index}`}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="focus-ring inline-flex min-h-8 items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-400/10 px-3 text-sm text-cyan-100"
              >
                {source.name}
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            ) : (
              <SourceBadge key={`${source.name}-${source.field ?? index}`} name={source.name} />
            )
          )}
        </div>
        <p className="mt-4 text-sm text-slate-400">Cập nhật hồ sơ: {country.dataUpdatedAt}</p>
      </section>

      {country.notes?.length ? (
        <section className="atlas-surface rounded-lg p-5">
          <h2 className="text-lg font-semibold text-white">Ghi chú học thuật</h2>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
            {country.notes.map((note) => (
              <li key={note}>{displayValue(note)}</li>
            ))}
          </ul>
        </section>
      ) : null}
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
    return "Không áp dụng hoặc chưa có cờ dữ liệu riêng";
  }
  return value ? "Có" : "Không";
}
