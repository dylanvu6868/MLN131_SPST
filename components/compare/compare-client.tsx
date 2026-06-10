"use client";

import { useMemo, useState } from "react";
import { GitCompare, Loader2, Plus, X } from "lucide-react";

import { FlagBadge } from "@/components/ui/flag-badge";
import {
  confidenceLabel,
  displayCountryName,
  displayLegislature,
  displayRegion,
  displayValue,
  regimeLabel,
  tr
} from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { ConfidenceLevel, CountryPoliticalProfile, RegimeCategory } from "@/lib/types";

type CompareResult = {
  comparisonTable: Record<string, unknown>[];
  notes: string[];
  sources: { name: string; url?: string; field?: string }[];
};

const fields = [
  "countryName",
  "region",
  "stateForm",
  "governmentSystem",
  "politicalModel",
  "officialIdeology",
  "regimeCategory",
  "rulingParty",
  "headOfState",
  "headOfGovernment",
  "legislature",
  "economicModel",
  "confidenceLevel"
];

const fieldLabels: Record<string, string> = {
  countryName: "Quốc gia",
  region: "Khu vực",
  stateForm: "Hình thức nhà nước",
  governmentSystem: "Mô hình chính phủ",
  politicalModel: "Mô hình chính trị",
  officialIdeology: "Hệ tư tưởng chính thức",
  regimeCategory: "Nhóm chế độ",
  rulingParty: "Đảng cầm quyền",
  headOfState: "Nguyên thủ quốc gia",
  headOfGovernment: "Người đứng đầu chính phủ",
  legislature: "Cơ quan lập pháp",
  economicModel: "Mô hình kinh tế",
  confidenceLevel: "Độ tin cậy"
};

export function CompareClient({ countries }: { countries: CountryPoliticalProfile[] }) {
  useLanguage();
  const [selected, setSelected] = useState<string[]>(countries.slice(0, 2).map((country) => country.iso3));
  const [result, setResult] = useState<CompareResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const available = useMemo(
    () => countries.filter((country) => !selected.includes(country.iso3)),
    [countries, selected]
  );

  async function runCompare() {
    if (selected.length < 2) {
      setError(tr("Vui lòng cung cấp từ 2 đến 4 tên quốc gia hoặc mã ISO."));
      return;
    }
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          countries: selected,
          fields
        })
      });

      // Read as text first so an HTML error page never crashes JSON parsing.
      const raw = await response.text();
      let data: (CompareResult & { error?: string }) | null = null;
      try {
        data = JSON.parse(raw) as CompareResult & { error?: string };
      } catch {
        data = null;
      }

      if (!response.ok || !data) {
        throw new Error(data?.error ?? tr("Không thể so sánh."));
      }
      setResult(data);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : tr("Không thể so sánh."));
    } finally {
      setIsLoading(false);
    }
  }

  function removeAt(index: number) {
    setSelected((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  return (
    <div className="space-y-5">
      <div className="atlas-surface rounded-lg p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {selected.map((iso3, index) => {
              const country = countries.find((entry) => entry.iso3 === iso3);
              return (
                <span
                  key={`${iso3}-${index}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-md border border-slate-600 bg-slate-950 px-3 text-sm text-slate-100"
                >
                  {country ? <FlagBadge country={country} variant="inline" /> : iso3}
                  {country ? displayCountryName(country) : iso3}
                  {selected.length > 1 ? (
                    <button
                      className="focus-ring grid h-6 w-6 place-items-center rounded-md text-slate-400 hover:text-white"
                      onClick={() => removeAt(index)}
                      aria-label={`${tr("Bỏ")} ${country ? displayCountryName(country) : iso3}`}
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                </span>
              );
            })}
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <label className="min-w-[220px]">
              <span className="sr-only">{tr("Thêm quốc gia")}</span>
              <select
                className="atlas-input w-full rounded-md px-3 py-2"
                value=""
                onChange={(event) => {
                  if (event.target.value && selected.length < 4) {
                    setSelected((current) => [...current, event.target.value]);
                  }
                }}
                disabled={selected.length >= 4}
              >
                <option value="">{tr("Thêm quốc gia")}</option>
                {available.map((country) => (
                  <option key={country.iso3} value={country.iso3}>
                    {displayCountryName(country)}
                  </option>
                ))}
              </select>
            </label>
            <button className="atlas-button focus-ring px-4" onClick={runCompare} disabled={isLoading || selected.length < 2}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <GitCompare className="h-4 w-4" aria-hidden="true" />}
              {tr("So sánh")}
            </button>
          </div>
        </div>
        {selected.length < 2 ? (
          <p className="mt-3 text-sm text-amber-200/90">{tr("Vui lòng cung cấp từ 2 đến 4 tên quốc gia hoặc mã ISO.")}</p>
        ) : null}
      </div>

      {error ? <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-100">{tr(error)}</p> : null}

      {!result ? (
        <button className="atlas-button focus-ring px-4" onClick={runCompare} disabled={isLoading || selected.length < 2}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {tr("Tải bảng so sánh")}
        </button>
      ) : null}

      {result ? (
        <div className="atlas-surface overflow-x-auto rounded-lg">
          <table className="min-w-full divide-y divide-slate-700 text-sm">
            <thead className="bg-slate-950/60">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">{tr("Trường dữ liệu")}</th>
                {result.comparisonTable.map((row) => (
                  <th key={String(row.iso3)} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-300">
                    {displayComparedHeader(row, countries)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {fields.slice(1).map((field) => (
                <tr key={field}>
                  <td className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">{tr(fieldLabels[field] ?? field)}</td>
                  {result.comparisonTable.map((row) => (
                    <td key={`${String(row.iso3)}-${field}`} className="max-w-[320px] px-4 py-3 text-slate-100">
                      {formatComparedValue(field, row[field])}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      {result?.notes?.length ? (
        <div className="atlas-surface rounded-lg p-4">
          <h2 className="text-base font-semibold text-white">{tr("Ghi chú")}</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-300">
            {result.notes.map((note) => (
              <li key={note}>{tr(note)}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function displayComparedHeader(row: Record<string, unknown>, countries: CountryPoliticalProfile[]) {
  const country = countries.find((entry) => entry.iso3 === row.iso3);
  if (!country) {
    return String(row.countryName ?? row.iso3);
  }

  return (
    <span className="inline-flex items-center gap-2">
      <FlagBadge country={country} variant="inline" />
      <span>{displayCountryName(country)}</span>
    </span>
  );
}

function formatComparedValue(field: string, value: unknown) {
  if (field === "region" && typeof value === "string") {
    return displayRegion(value);
  }
  if (field === "regimeCategory") {
    return regimeLabel(value as RegimeCategory);
  }
  if (field === "confidenceLevel") {
    return confidenceLabel(value as ConfidenceLevel);
  }
  if (field === "legislature" && typeof value === "string") {
    return displayLegislature(value);
  }

  if (typeof value === "string" || typeof value === "number") {
    return displayValue(value);
  }

  return displayValue(null);
}
