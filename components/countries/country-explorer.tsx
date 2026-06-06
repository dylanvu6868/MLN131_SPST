"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

import { CountryCard } from "@/components/countries/country-card";
import { displayRegion, regimeLabel } from "@/lib/i18n";
import type { CountryPoliticalProfile } from "@/lib/types";

export function CountryExplorer({ countries }: { countries: CountryPoliticalProfile[] }) {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("");
  const [regimeCategory, setRegimeCategory] = useState("");
  const [stateFlag, setStateFlag] = useState("");

  const regions = unique(countries.map((country) => country.region));
  const regimes = unique(countries.map((country) => country.regimeCategory ?? "Unknown"));

  const filtered = useMemo(() => {
    const needle = normalize(search);
    return countries
      .filter((country) => {
        const text = normalize(`${country.countryName} ${country.officialName} ${country.iso2} ${country.iso3}`);
        return !needle || text.includes(needle);
      })
      .filter((country) => !region || country.region === region)
      .filter((country) => !regimeCategory || (country.regimeCategory ?? "Unknown") === regimeCategory)
      .filter((country) => {
        if (stateFlag === "communist") {
          return country.hasCommunistRulingParty;
        }
        if (stateFlag === "monarchy") {
          return country.isMonarchy;
        }
        if (stateFlag === "federal") {
          return country.isFederal;
        }
        if (stateFlag === "unitary") {
          return country.isUnitary;
        }
        return true;
      });
  }, [countries, search, region, regimeCategory, stateFlag]);

  return (
    <div className="space-y-5">
      <div className="atlas-surface rounded-lg p-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_220px_190px]">
          <label className="relative block">
            <span className="sr-only">Tìm quốc gia</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="atlas-input w-full rounded-md py-2 pl-10 pr-3"
              placeholder="Tìm theo tên hoặc mã ISO"
            />
          </label>

          <label className="block">
            <span className="sr-only">Khu vực</span>
            <select value={region} onChange={(event) => setRegion(event.target.value)} className="atlas-input w-full rounded-md px-3 py-2">
              <option value="">Tất cả khu vực</option>
              {regions.map((item) => (
                <option key={item} value={item}>
                  {displayRegion(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Nhóm chế độ</span>
            <select
              value={regimeCategory}
              onChange={(event) => setRegimeCategory(event.target.value)}
              className="atlas-input w-full rounded-md px-3 py-2"
            >
              <option value="">Tất cả nhóm chế độ</option>
              {regimes.map((item) => (
                <option key={item} value={item}>
                  {regimeLabel(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="sr-only">Dấu hiệu nhà nước</span>
            <select
              value={stateFlag}
              onChange={(event) => setStateFlag(event.target.value)}
              className="atlas-input w-full rounded-md px-3 py-2"
            >
              <option value="">Tất cả dấu hiệu</option>
              <option value="communist">Đảng cộng sản cầm quyền</option>
              <option value="monarchy">Quân chủ</option>
              <option value="federal">Liên bang</option>
              <option value="unitary">Đơn nhất</option>
            </select>
          </label>
        </div>

        <div className="mt-4 flex items-center gap-2 text-sm text-slate-400">
          <Filter className="h-4 w-4" aria-hidden="true" />
          {filtered.length} / {countries.length} hồ sơ
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((country) => (
          <CountryCard key={country.iso3} country={country} />
        ))}
      </div>
    </div>
  );
}

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function unique(values: string[]) {
  return Array.from(new Set(values.filter(Boolean))).sort((a, b) => a.localeCompare(b));
}
