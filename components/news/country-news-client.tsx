"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronDown, ExternalLink, Loader2, Newspaper, RefreshCcw, Search } from "lucide-react";

import { FlagBadge } from "@/components/ui/flag-badge";
import { displayCountryName, displayRegion } from "@/lib/i18n";
import type { CountryPoliticalProfile } from "@/lib/types";

type NewsArticle = {
  title: string;
  url: string;
  content: string;
  score?: number;
  publishedDate?: string;
  favicon?: string;
  image?: string;
  source?: string;
};

type NewsResponse = {
  country: {
    iso3: string;
    name: string;
  };
  generatedAt: string;
  provider?: "tavily" | "tavify" | "serpapi";
  articles: NewsArticle[];
  query?: string;
  message?: string;
  error?: string;
};

export function CountryNewsClient({ countries }: { countries: CountryPoliticalProfile[] }) {
  const defaultCountry = countries.find((country) => country.iso3 === "VNM") ?? countries[0];
  const [selectedIso3, setSelectedIso3] = useState(defaultCountry?.iso3 ?? "");
  const [data, setData] = useState<NewsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso3 === selectedIso3) ?? defaultCountry,
    [countries, defaultCountry, selectedIso3]
  );

  useEffect(() => {
    if (!selectedIso3) {
      return;
    }

    const controller = new AbortController();
    void loadNews(selectedIso3, controller);
    return () => controller.abort();
  }, [selectedIso3]);

  async function loadNews(iso3 = selectedIso3, controller?: AbortController) {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ iso3 });
      const response = await fetch(`/api/news?${params.toString()}`, {
        cache: "no-store",
        signal: controller?.signal
      });
      const payload = (await response.json()) as NewsResponse;
      if (!response.ok) {
        throw new Error(payload.error ?? payload.message ?? "Không thể tải tin tức lúc này.");
      }
      setData(payload);
    } catch (requestError) {
      if (requestError instanceof DOMException && requestError.name === "AbortError") {
        return;
      }
      setError(requestError instanceof Error ? requestError.message : "Không thể tải tin tức lúc này.");
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-7">
      <section className="news-hero overflow-hidden rounded-lg">
        <div className="relative min-h-[390px] p-5 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,24,30,0.96),rgba(16,18,24,0.98)_54%,rgba(28,22,16,0.94)),repeating-linear-gradient(90deg,rgba(255,255,255,0.05)_0_1px,transparent_1px_92px)]" aria-hidden="true" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" aria-hidden="true" />
          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_390px] lg:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-amber-300/35 bg-black/35 px-3 py-2 text-sm text-amber-100">
                <Newspaper className="h-4 w-4" aria-hidden="true" />
                Cập nhật trong ngày
              </div>
              <h1 className="mt-5 max-w-4xl font-serif text-3xl font-semibold leading-tight text-white text-balance sm:text-5xl">
                Tin nóng theo từng quốc gia
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-stone-300 sm:text-lg">
                Chọn quốc gia để xem các bài báo đáng chú ý nhất trong ngày hôm nay, gồm cả báo trong nước và báo quốc tế.
              </p>
            </div>

            <div className="rounded-lg border border-amber-300/25 bg-slate-950/55 p-4 shadow-2xl shadow-black/20">
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-stone-200">
                  <Search className="h-4 w-4 text-amber-200" aria-hidden="true" />
                  Chọn quốc gia
                </span>
                <span className="relative block">
                  <select
                    className="atlas-input h-12 w-full appearance-none rounded-md px-3 pr-10"
                    value={selectedIso3}
                    onChange={(event) => setSelectedIso3(event.target.value)}
                  >
                    {countries.map((country) => (
                      <option key={country.iso3} value={country.iso3}>
                        {displayCountryName(country)}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-4 h-4 w-4 text-amber-200" aria-hidden="true" />
                </span>
              </label>

              {selectedCountry ? (
                <div className="mt-4 flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.04] p-3">
                  <FlagBadge country={selectedCountry} variant="inline" />
                  <div>
                    <p className="font-medium text-white">{displayCountryName(selectedCountry)}</p>
                    <p className="text-sm text-stone-400">{displayRegion(selectedCountry.region)}</p>
                  </div>
                </div>
              ) : null}

              <button className="heritage-button focus-ring mt-4 w-full px-4" onClick={() => void loadNews(selectedIso3)} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <RefreshCcw className="h-4 w-4" aria-hidden="true" />}
                Làm mới tin hôm nay
              </button>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-lg border border-amber-300/30 bg-amber-400/10 p-4 text-amber-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">Tin thời gian thực chưa sẵn sàng</p>
              <p className="mt-1 text-sm leading-6 text-amber-100/85">{error}</p>
            </div>
          </div>
        </div>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => <NewsSkeleton key={index} />)
          : data?.articles.map((article, index) => <NewsCard key={`${article.url}-${index}`} article={article} index={index} />)}
      </section>

      {!isLoading && data?.articles.length === 0 ? (
        <div className="rounded-lg border border-slate-700 bg-slate-950/60 p-6 text-center text-slate-300">
          Chưa tìm thấy bài nổi bật trong ngày cho quốc gia này. Hãy thử làm mới sau ít phút.
        </div>
      ) : null}
    </div>
  );
}

function NewsCard({ article, index }: { article: NewsArticle; index: number }) {
  return (
    <article className="heritage-card animate-country-rise group flex h-full flex-col overflow-hidden rounded-lg">
      <a href={article.url} target="_blank" rel="noreferrer" className="block">
        <div className="relative h-48 overflow-hidden bg-slate-950">
          {article.image ? (
            <img src={article.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" />
          ) : (
            <div className="grid h-full place-items-center bg-[radial-gradient(circle_at_35%_20%,rgba(218,165,32,0.28),transparent_34%),linear-gradient(135deg,#2a1816,#121820)]">
              <Newspaper className="h-10 w-10 text-amber-100/70" aria-hidden="true" />
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-md border border-amber-300/40 bg-black/55 px-2 py-1 text-xs font-semibold text-amber-100">
            #{index + 1}
          </span>
        </div>
      </a>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-stone-400">
          {article.favicon ? <img src={article.favicon} alt="" className="h-4 w-4 rounded-sm" loading="lazy" /> : null}
          <span className="truncate">{article.source ?? getHost(article.url)}</span>
          {article.publishedDate ? <span className="shrink-0">· {formatDate(article.publishedDate)}</span> : null}
        </div>
        <h2 className="mt-3 line-clamp-3 text-lg font-semibold leading-6 text-white text-balance">{article.title}</h2>
        <p className="mt-3 line-clamp-4 text-sm leading-6 text-stone-400">{article.content}</p>
        <a href={article.url} target="_blank" rel="noreferrer" className="focus-ring mt-auto inline-flex items-center gap-2 rounded-md pt-5 text-sm font-medium text-amber-100 transition hover:text-amber-50">
          Đọc bài viết
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}

function NewsSkeleton() {
  return (
    <div className="heritage-card overflow-hidden rounded-lg">
      <div className="h-48 animate-pulse bg-slate-800/80" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-slate-800" />
        <div className="h-5 w-full animate-pulse rounded bg-slate-800" />
        <div className="h-5 w-4/5 animate-pulse rounded bg-slate-800" />
        <div className="h-16 w-full animate-pulse rounded bg-slate-800" />
      </div>
    </div>
  );
}

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "Báo quốc tế";
  }
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium"
  }).format(date);
}
