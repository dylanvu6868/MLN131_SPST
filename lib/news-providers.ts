import { getFirecrawlKey, searchFirecrawlResearch } from "@/lib/data-sync/firecrawl";
import type { CountryPoliticalProfile } from "@/lib/types";

export type NewsProvider = "auto" | "tavily" | "tavify" | "serpapi" | "firecrawl";

export type NewsArticle = {
  title: string;
  url: string;
  content: string;
  score?: number;
  publishedDate?: string;
  favicon?: string;
  image?: string;
  source?: string;
};

export type NewsSearchResult = {
  provider: Exclude<NewsProvider, "auto">;
  query: string;
  articles: NewsArticle[];
};

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
  published_date?: string;
  favicon?: string;
  images?: { url?: string; description?: string }[];
};

type TavilyResponse = {
  results?: TavilyResult[];
  query?: string;
};

type SerpApiNewsResult = {
  title?: string;
  link?: string;
  source?: string | { name?: string; icon?: string };
  date?: string;
  snippet?: string;
  thumbnail?: string;
};

type SerpApiResponse = {
  news_results?: SerpApiNewsResult[];
  organic_results?: SerpApiNewsResult[];
  search_metadata?: {
    status?: string;
  };
  error?: string;
};

export function getAvailableNewsProviders() {
  return {
    tavily: Boolean(getTavilyKey()),
    tavify: Boolean(getTavilyKey()),
    serpapi: Boolean(getSerpApiKey()),
    firecrawl: Boolean(getFirecrawlKey())
  };
}

export async function searchCountryNews({
  country,
  displayName,
  provider
}: {
  country: CountryPoliticalProfile;
  displayName: string;
  provider: NewsProvider;
}): Promise<NewsSearchResult> {
  const query = buildNewsQuery(country, displayName);

  if (provider === "auto") {
    return searchAutomaticNews(country, query);
  }

  const selectedProvider = chooseProvider(provider);
  return searchWithProvider(selectedProvider, country, query);
}

async function searchAutomaticNews(country: CountryPoliticalProfile, query: string): Promise<NewsSearchResult> {
  const providers = getAutomaticProviderOrder();
  if (!providers.length) {
    throw new NewsProviderError("Tin thời gian thực chưa được kết nối. Hãy cung cấp khóa Tavily/Tavify hoặc SerpAPI để hiển thị tin nổi bật trong ngày.", 503);
  }

  let emptyResult: NewsSearchResult | null = null;
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await searchWithProvider(provider, country, query);
      if (result.articles.length > 0) {
        return result;
      }
      emptyResult ??= result;
    } catch (error) {
      errors.push(error instanceof Error ? error.message : "Không thể tải tin từ một kênh tìm kiếm.");
    }
  }

  if (emptyResult) {
    return emptyResult;
  }

  throw new NewsProviderError(errors[0] ?? "Không thể tải tin nóng lúc này.", 502);
}

function getAutomaticProviderOrder(): Exclude<NewsProvider, "auto">[] {
  const preferred = normalizePreferredProvider(process.env.NEWS_SEARCH_PROVIDER);
  const order: Exclude<NewsProvider, "auto">[] = [];

  if (preferred) {
    order.push(preferred);
  }
  order.push("serpapi", "firecrawl", "tavily");

  return Array.from(new Set(order)).filter((provider) => {
    if (provider === "serpapi") {
      return Boolean(getSerpApiKey());
    }
    if (provider === "firecrawl") {
      return Boolean(getFirecrawlKey());
    }
    return Boolean(getTavilyKey());
  });
}

function normalizePreferredProvider(value?: string): Exclude<NewsProvider, "auto"> | null {
  if (value === "serpapi" || value === "tavily" || value === "tavify" || value === "firecrawl") {
    return value;
  }
  return null;
}

function searchWithProvider(
  selectedProvider: Exclude<NewsProvider, "auto">,
  country: CountryPoliticalProfile,
  query: string
) {
  if (selectedProvider === "serpapi") {
    return searchSerpApiNews(country, query);
  }

  if (selectedProvider === "firecrawl") {
    return searchFirecrawlNews(country, query);
  }

  return searchTavilyNews(query, selectedProvider);
}

function chooseProvider(provider: NewsProvider): Exclude<NewsProvider, "auto"> {
  const hasTavily = Boolean(getTavilyKey());
  const hasSerpApi = Boolean(getSerpApiKey());
  const hasFirecrawl = Boolean(getFirecrawlKey());

  if (provider === "tavily" || provider === "tavify") {
    if (!hasTavily) {
      throw new NewsProviderError("Tavily/Tavify chưa được kết nối. Hãy cung cấp khóa Tavily để dùng kênh này.", 503);
    }
    return provider;
  }

  if (provider === "serpapi") {
    if (!hasSerpApi) {
      throw new NewsProviderError("SerpAPI chưa được kết nối. Hãy cung cấp khóa SerpAPI để dùng kênh này.", 503);
    }
    return provider;
  }

  if (provider === "firecrawl") {
    if (!hasFirecrawl) {
      throw new NewsProviderError("Firecrawl chưa được kết nối. Hãy cung cấp FIRECRAWL_API_KEY để dùng kênh này.", 503);
    }
    return provider;
  }

  if (hasSerpApi) {
    return "serpapi";
  }

  if (hasFirecrawl) {
    return "firecrawl";
  }

  if (hasTavily) {
    return "tavily";
  }

  throw new NewsProviderError("Tin thời gian thực chưa được kết nối. Hãy cung cấp khóa Tavily/Tavify hoặc SerpAPI để hiển thị tin nổi bật trong ngày.", 503);
}

async function searchTavilyNews(query: string, provider: "tavily" | "tavify"): Promise<NewsSearchResult> {
  const apiKey = getTavilyKey();
  if (!apiKey) {
    throw new NewsProviderError("Tavily/Tavify chưa được kết nối.", 503);
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      query,
      topic: "news",
      search_depth: "basic",
      time_range: "day",
      max_results: 12,
      include_answer: false,
      include_images: true,
      include_image_descriptions: false,
      include_favicon: true,
      include_raw_content: false
    }),
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as TavilyResponse | { error?: string } | null;
  if (!response.ok) {
    throw new NewsProviderError(payload && "error" in payload && payload.error ? payload.error : "Không thể tải tin nóng từ Tavily lúc này.", response.status);
  }

  const tavilyPayload = payload as TavilyResponse;
  return {
    provider,
    query: tavilyPayload.query ?? query,
    articles: (tavilyPayload.results ?? [])
      .filter((result): result is Required<Pick<TavilyResult, "title" | "url">> & TavilyResult => Boolean(result.title && result.url))
      .map((result) => ({
        title: result.title,
        url: result.url,
        content: result.content ?? "",
        score: result.score,
        publishedDate: result.published_date,
        favicon: result.favicon,
        image: result.images?.find((image) => image.url)?.url,
        source: getHost(result.url)
      }))
  };
}

async function searchSerpApiNews(country: CountryPoliticalProfile, query: string): Promise<NewsSearchResult> {
  const apiKey = getSerpApiKey();
  if (!apiKey) {
    throw new NewsProviderError("SerpAPI chưa được kết nối.", 503);
  }

  const scopes = Array.from(new Set([country.iso2.toLowerCase(), "us"]));
  const responses = await Promise.allSettled(scopes.map((scope) => fetchSerpApiNews(apiKey, query, scope)));
  const fulfilled = responses
    .filter((response): response is PromiseFulfilledResult<SerpApiNewsResult[]> => response.status === "fulfilled")
    .map((response) => response.value);
  const rejected = responses.filter((response): response is PromiseRejectedResult => response.status === "rejected");

  if (!fulfilled.length) {
    const firstError = rejected[0]?.reason;
    throw firstError instanceof NewsProviderError
      ? firstError
      : new NewsProviderError("Không thể tải tin nóng từ SerpAPI lúc này.", 502);
  }

  const mergedResults = interleaveNewsResults(fulfilled);
  return {
    provider: "serpapi",
    query,
    articles: mergedResults.slice(0, 12).map((result, index) => mapSerpApiArticle(result, index, mergedResults.length))
  };
}

async function searchFirecrawlNews(country: CountryPoliticalProfile, query: string): Promise<NewsSearchResult> {
  const result = await searchFirecrawlResearch({
    query,
    country: country.iso2,
    sources: ["news"],
    tbs: "qdr:d",
    limit: 12,
    scrapeMarkdown: true
  });

  if (!result.configured) {
    throw new NewsProviderError("Firecrawl chưa được kết nối. Hãy cung cấp FIRECRAWL_API_KEY để dùng kênh này.", 503);
  }

  return {
    provider: "firecrawl",
    query: result.query,
    articles: result.results.map((item, index) => ({
      title: item.title,
      url: item.url,
      content: item.description ?? item.markdownPreview ?? "",
      publishedDate: item.publishedDate,
      source: item.sourceHost,
      score: 1 - index / Math.max(result.results.length, 1)
    }))
  };
}

async function fetchSerpApiNews(apiKey: string, query: string, gl: string): Promise<SerpApiNewsResult[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("tbm", "nws");
  url.searchParams.set("tbs", "qdr:d");
  url.searchParams.set("num", "12");
  url.searchParams.set("hl", "vi");
  url.searchParams.set("gl", gl);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, { cache: "no-store" });
  const payload = (await response.json().catch(() => null)) as SerpApiResponse | null;
  if (!response.ok || payload?.error) {
    throw new NewsProviderError(payload?.error ?? "Không thể tải tin nóng từ SerpAPI lúc này.", response.status || 502);
  }

  return (payload?.news_results ?? payload?.organic_results ?? []).filter(
    (result): result is Required<Pick<SerpApiNewsResult, "title" | "link">> & SerpApiNewsResult => Boolean(result.title && result.link)
  );
}

function interleaveNewsResults(resultGroups: SerpApiNewsResult[][]) {
  const seen = new Set<string>();
  const merged: SerpApiNewsResult[] = [];
  const maxLength = Math.max(...resultGroups.map((group) => group.length));

  for (let index = 0; index < maxLength; index++) {
    for (const group of resultGroups) {
      const result = group[index];
      if (!result?.link || seen.has(result.link)) {
        continue;
      }
      seen.add(result.link);
      merged.push(result);
    }
  }

  return merged;
}

function mapSerpApiArticle(result: SerpApiNewsResult, index: number, total: number): NewsArticle {
  const source = typeof result.source === "string" ? result.source : result.source?.name;
  const favicon = typeof result.source === "object" ? result.source.icon : undefined;

  return {
    title: result.title ?? "",
    url: result.link ?? "",
    content: result.snippet ?? "",
    publishedDate: result.date,
    favicon,
    image: result.thumbnail,
    source: source ?? (result.link ? getHost(result.link) : undefined),
    score: 1 - index / Math.max(total, 1)
  };
}

function buildNewsQuery(country: CountryPoliticalProfile, displayName: string) {
  const names = [displayName, country.englishName, country.officialName]
    .filter(Boolean)
    .filter((value, index, arr) => arr.indexOf(value) === index)
    .slice(0, 3)
    .map((value) => `"${value}"`);

  // The APIs (Tavily, SerpApi, Firecrawl) already filter by news categories.
  // Adding extra keywords like "tin nóng", "politics" causes them to return generic global news instead of country news.
  return names.join(" OR ");
}

function getTavilyKey() {
  return process.env.TAVILY_API_KEY ?? process.env.TAVIFY_API_KEY;
}

function getSerpApiKey() {
  return process.env.SERPAPI_API_KEY ?? process.env.SERP_API_KEY;
}

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return undefined;
  }
}

export class NewsProviderError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "NewsProviderError";
    this.status = status;
  }
}
