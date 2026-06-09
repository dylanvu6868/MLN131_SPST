"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDownWideNarrow, ArrowUpWideNarrow, BarChart3, ExternalLink, SlidersHorizontal } from "lucide-react";

import { ConfidenceBadge, RegimeBadge } from "@/components/ui/badges";
import { FlagBadge } from "@/components/ui/flag-badge";
import { formatPlainNumber } from "@/lib/format";
import { confidenceLabel, displayCountryName, displayRegion, displayValue, getDisplayLanguage, tr } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { ConfidenceLevel, CountryPoliticalProfile } from "@/lib/types";

type RankingMetric =
  | "profileCompleteness"
  | "confidenceLevel"
  | "sourceCount"
  | "population"
  | "areaKm2"
  | "gdp"
  | "gdpPerCapita"
  | "democracyScore"
  | "dataUpdatedAt";

type SortDirection = "desc" | "asc";

const profileFields: (keyof CountryPoliticalProfile)[] = [
  "officialName",
  "region",
  "subregion",
  "capital",
  "population",
  "areaKm2",
  "stateForm",
  "governmentSystem",
  "constitutionalIdentity",
  "officialIdeology",
  "ideologyFamily",
  "politicalRegime",
  "regimeCategory",
  "rulingParty",
  "partySystem",
  "headOfState",
  "headOfGovernment",
  "legislature",
  "legislatureStructure",
  "economicModel",
  "sources",
  "summary"
];

const metricLabels: Record<RankingMetric, string> = {
  profileCompleteness: "Độ đầy đủ hồ sơ",
  confidenceLevel: "Mức tin cậy",
  sourceCount: "Độ tham chiếu",
  population: "Dân số",
  areaKm2: "Diện tích",
  gdp: "GDP",
  gdpPerCapita: "GDP/người",
  democracyScore: "Điểm dân chủ",
  dataUpdatedAt: "Cập nhật gần đây"
};

const metricDescriptions: Record<RankingMetric, string> = {
  profileCompleteness: "Tỷ lệ thông tin chính trị, thiết chế và nhận diện quốc gia đã có trong hồ sơ.",
  confidenceLevel: "Quy đổi độ tin cậy của hồ sơ: cao, trung bình, thấp, chưa xác định.",
  sourceCount: "Mức độ phong phú của phần tham khảo trong hồ sơ quốc gia.",
  population: "Dân số của từng quốc gia.",
  areaKm2: "Diện tích lãnh thổ theo km2.",
  gdp: "Tổng sản phẩm quốc nội khi có số liệu.",
  gdpPerCapita: "GDP bình quân đầu người khi có số liệu.",
  democracyScore: "Điểm dân chủ khi có số liệu phù hợp.",
  dataUpdatedAt: "Hồ sơ có ngày cập nhật mới nhất đứng trước."
};

const confidenceScores: Record<ConfidenceLevel, number> = {
  high: 3,
  medium: 2,
  low: 1,
  unknown: 0
};

export function RankingClient({ countries }: { countries: CountryPoliticalProfile[] }) {
  useLanguage();
  const [metric, setMetric] = useState<RankingMetric>("profileCompleteness");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const [region, setRegion] = useState("all");
  const [onlyWithData, setOnlyWithData] = useState(false);

  const regions = useMemo(
    () => Array.from(new Set(countries.map((country) => country.region))).sort((a, b) => displayRegion(a).localeCompare(displayRegion(b), "vi")),
    [countries]
  );

  const rankedCountries = useMemo(() => {
    const filtered = countries
      .filter((country) => region === "all" || country.region === region)
      .filter((country) => !onlyWithData || hasMetricData(country, metric));

    return filtered
      .map((country) => ({
        country,
        score: getMetricScore(country, metric),
        hasData: hasMetricData(country, metric)
      }))
      .sort((a, b) => {
        if (a.hasData !== b.hasData) {
          return a.hasData ? -1 : 1;
        }

        const scoreA = a.score ?? Number.NEGATIVE_INFINITY;
        const scoreB = b.score ?? Number.NEGATIVE_INFINITY;
        return direction === "desc" ? scoreB - scoreA : scoreA - scoreB;
      });
  }, [countries, direction, metric, onlyWithData, region]);

  const topCountries = rankedCountries.slice(0, 3);

  return (
    <div className="space-y-6">
      <section className="atlas-surface rounded-lg p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-teal-100">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              {tr("Bộ tiêu chí")}
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{tr(metricDescriptions[metric])}</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[220px_180px_180px_auto]">
            <label>
              <span className="mb-1 block text-xs font-medium text-slate-400">{tr("Tiêu chí")}</span>
              <select
                className="atlas-input w-full rounded-md px-3 py-2"
                value={metric}
                onChange={(event) => setMetric(event.target.value as RankingMetric)}
              >
                {Object.entries(metricLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {tr(label)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium text-slate-400">{tr("Khu vực")}</span>
              <select className="atlas-input w-full rounded-md px-3 py-2" value={region} onChange={(event) => setRegion(event.target.value)}>
                <option value="all">{tr("Tất cả khu vực")}</option>
                {regions.map((item) => (
                  <option key={item} value={item}>
                    {displayRegion(item)}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className="mb-1 block text-xs font-medium text-slate-400">{tr("Thứ tự")}</span>
              <select
                className="atlas-input w-full rounded-md px-3 py-2"
                value={direction}
                onChange={(event) => setDirection(event.target.value as SortDirection)}
              >
                <option value="desc">{tr("Cao đến thấp")}</option>
                <option value="asc">{tr("Thấp đến cao")}</option>
              </select>
            </label>

            <label className="flex min-h-[42px] items-center gap-2 self-end rounded-md border border-slate-700 bg-slate-950/70 px-3 text-sm text-slate-200">
              <input
                type="checkbox"
                className="h-4 w-4 accent-teal-400"
                checked={onlyWithData}
                onChange={(event) => setOnlyWithData(event.target.checked)}
              />
              {tr("Chỉ hiện mục có số liệu")}
            </label>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {topCountries.map((item, index) => (
          <article key={item.country.iso3} className="atlas-surface rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-md border border-amber-300/40 bg-amber-400/10 text-lg font-semibold text-amber-100">
                {index + 1}
              </span>
              <FlagBadge country={item.country} variant="inline" />
            </div>
            <h2 className="mt-4 text-lg font-semibold text-white">{displayCountryName(item.country)}</h2>
            <p className="mt-1 text-sm text-slate-400">{displayRegion(item.country.region)}</p>
            <p className="mt-4 text-2xl font-semibold text-teal-100">{formatMetricValue(item.country, metric)}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <RegimeBadge value={item.country.regimeCategory !== "Unknown" && item.country.regimeCategory ? item.country.regimeCategory : (item.country.politicalRegime && item.country.politicalRegime !== "Needs verification" ? item.country.politicalRegime : "Unknown")} />
              <ConfidenceBadge value={item.country.confidenceLevel} />
            </div>
          </article>
        ))}
      </section>

      <section className="atlas-surface overflow-hidden rounded-lg">
        <div className="flex flex-col gap-2 border-b border-slate-700/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">{tr("Bảng xếp hạng")}</h2>
            <p className="mt-1 text-sm text-slate-400">{rankedCountries.length} {tr("quốc gia trong phạm vi hiện tại")}</p>
          </div>
          <div className="inline-flex items-center gap-2 text-sm text-slate-300">
            {direction === "desc" ? <ArrowDownWideNarrow className="h-4 w-4 text-teal-200" /> : <ArrowUpWideNarrow className="h-4 w-4 text-teal-200" />}
            {metricLabels[metric]}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[1180px] table-fixed divide-y divide-slate-800 text-sm">
            <colgroup>
              <col className="w-20" />
              <col className="w-[300px]" />
              <col className="w-[110px]" />
              <col className="w-[180px]" />
              <col className="w-[310px]" />
              <col className="w-[260px]" />
              <col className="w-20" />
            </colgroup>
            <thead className="bg-slate-950/70">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Hạng</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Quốc gia</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Giá trị</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Khu vực</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Nhóm chế độ</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Mô hình chính phủ</th>
                <th className="px-4 py-3 text-left font-medium text-slate-400">Hồ sơ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {rankedCountries.map((item, index) => (
                <tr key={item.country.iso3} className="hover:bg-slate-900/60">
                  <td className="px-4 py-3 font-semibold text-slate-200">#{index + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FlagBadge country={item.country} variant="inline" />
                      <div className="min-w-0">
                        <div className="truncate font-medium text-white">{displayCountryName(item.country)}</div>
                        <div className="text-xs text-slate-500">{item.country.iso3}</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-teal-100">{formatMetricValue(item.country, metric)}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">{displayRegion(item.country.region)}</td>
                  <td className="px-4 py-3">
                    <RegimeBadge value={item.country.regimeCategory !== "Unknown" && item.country.regimeCategory ? item.country.regimeCategory : (item.country.politicalRegime && item.country.politicalRegime !== "Needs verification" ? item.country.politicalRegime : "Unknown")} />
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    <span className="line-clamp-2 max-w-[240px] leading-6">{displayValue(item.country.governmentSystem)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/countries/${item.country.iso3}`}
                      className="focus-ring inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-700 bg-slate-950 text-slate-200 hover:border-teal-300/60 hover:text-teal-100"
                      aria-label={`Mở hồ sơ ${displayCountryName(item.country)}`}
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <RankingNote icon={<BarChart3 className="h-4 w-4" />} label="Tiêu chí tổng hợp" value="Độ đầy đủ hồ sơ dựa trên 22 nhóm thông tin chính của mỗi quốc gia." />
        <RankingNote label="Khi thiếu số liệu" value="Những quốc gia chưa có số liệu cho tiêu chí đang chọn sẽ được đưa xuống cuối bảng." />
        <RankingNote label="Độ tin cậy" value="Mỗi hồ sơ có mức tin cậy riêng để người xem cân nhắc khi so sánh." />
      </section>
    </div>
  );
}

function RankingNote({ icon, label, value }: { icon?: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-950/50 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
        {icon}
        {label}
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-400">{value}</p>
    </div>
  );
}

function hasMetricData(country: CountryPoliticalProfile, metric: RankingMetric) {
  switch (metric) {
    case "profileCompleteness":
    case "confidenceLevel":
    case "sourceCount":
    case "dataUpdatedAt":
      return true;
    case "population":
    case "areaKm2":
    case "gdp":
    case "gdpPerCapita":
    case "democracyScore":
      return typeof country[metric] === "number";
  }
}

function getMetricScore(country: CountryPoliticalProfile, metric: RankingMetric) {
  switch (metric) {
    case "profileCompleteness":
      return getProfileCompleteness(country);
    case "confidenceLevel":
      return confidenceScores[country.confidenceLevel ?? "unknown"];
    case "sourceCount":
      return country.sources.length;
    case "dataUpdatedAt":
      return new Date(country.dataUpdatedAt).getTime();
    case "population":
    case "areaKm2":
    case "gdp":
    case "gdpPerCapita":
    case "democracyScore":
      return typeof country[metric] === "number" ? country[metric] : undefined;
  }
}

function getProfileCompleteness(country: CountryPoliticalProfile) {
  const completed = profileFields.filter((field) => {
    const value = country[field];
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value !== undefined && value !== null && value !== "" && value !== "Unknown" && value !== "Data unavailable" && value !== "Needs verification";
  }).length;

  return Math.round((completed / profileFields.length) * 100);
}

function formatMetricValue(country: CountryPoliticalProfile, metric: RankingMetric) {
  if (!hasMetricData(country, metric)) {
    return "Chưa có dữ liệu";
  }

  switch (metric) {
    case "profileCompleteness":
      return `${getProfileCompleteness(country)}%`;
    case "confidenceLevel":
      return confidenceLabel(country.confidenceLevel);
    case "sourceCount":
      return `${country.sources.length} tham chiếu`;
    case "population":
      return formatPlainNumber(country.population);
    case "areaKm2":
      return `${formatPlainNumber(country.areaKm2)} km2`;
    case "gdp":
      return formatPlainNumber(country.gdp);
    case "gdpPerCapita":
      return formatPlainNumber(country.gdpPerCapita);
    case "democracyScore":
      return typeof country.democracyScore === "number" ? country.democracyScore.toFixed(2) : "Chưa có dữ liệu";
    case "dataUpdatedAt":
      return formatDate(country.dataUpdatedAt);
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "Chưa có dữ liệu";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium"
  }).format(date);
}
