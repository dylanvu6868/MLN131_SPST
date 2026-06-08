export type FirecrawlSourceType = "web" | "news";
export type FirecrawlSourceQuality = "high" | "medium" | "low" | "unknown";

export type FirecrawlResearchResult = {
  title: string;
  url: string;
  description?: string;
  publishedDate?: string;
  sourceType: FirecrawlSourceType;
  sourceHost?: string;
  sourceQuality: FirecrawlSourceQuality;
  qualityReason: string;
  markdownPreview?: string;
};

export type FirecrawlResearchResponse = {
  configured: boolean;
  query: string;
  generatedAt: string;
  creditsUsed?: number;
  warning?: string;
  results: FirecrawlResearchResult[];
};

type FirecrawlSearchOptions = {
  query: string;
  country?: string;
  limit?: number;
  sources?: FirecrawlSourceType[];
  includeDomains?: string[];
  excludeDomains?: string[];
  tbs?: string;
  scrapeMarkdown?: boolean;
};

type FirecrawlSearchItem = {
  title?: string;
  description?: string;
  snippet?: string;
  url?: string;
  date?: string;
  markdown?: string;
  metadata?: {
    title?: string;
    description?: string;
    sourceURL?: string;
    url?: string;
    statusCode?: number;
    error?: string;
  };
};

type FirecrawlSearchPayload = {
  success?: boolean;
  data?: {
    web?: FirecrawlSearchItem[];
    news?: FirecrawlSearchItem[];
  };
  warning?: string | null;
  creditsUsed?: number;
  error?: string;
};

const FIRECRAWL_SEARCH_URL = "https://api.firecrawl.dev/v2/search";

const HIGH_QUALITY_DOMAINS = [
  "cia.gov",
  "worldbank.org",
  "imf.org",
  "un.org",
  "undp.org",
  "oecd.org",
  "idea.int",
  "v-dem.net",
  "ourworldindata.org",
  "freedomhouse.org",
  "eiu.com",
  "ec.europa.eu",
  "europarl.europa.eu",
  "wto.org",
  "who.int",
  "ilo.org"
];

const MEDIUM_QUALITY_DOMAINS = [
  "wikipedia.org",
  "britannica.com",
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "dw.com",
  "france24.com",
  "aljazeera.com",
  "theguardian.com"
];

export async function searchFirecrawlResearch(options: FirecrawlSearchOptions): Promise<FirecrawlResearchResponse> {
  const apiKey = getFirecrawlKey();
  const query = options.query.trim();

  if (!apiKey) {
    return {
      configured: false,
      query,
      generatedAt: new Date().toISOString(),
      warning: "FIRECRAWL_API_KEY is not configured on the server.",
      results: []
    };
  }

  const sources = options.sources?.length ? Array.from(new Set(options.sources)) : ["web"];
  const body: Record<string, unknown> = {
    query,
    limit: Math.min(10, Math.max(1, options.limit ?? 5)),
    sources,
    timeout: 60000,
    ignoreInvalidURLs: true
  };

  if (options.country) {
    body.country = options.country.toUpperCase();
  }

  if (options.includeDomains?.length) {
    body.includeDomains = normalizeDomains(options.includeDomains);
  } else if (options.excludeDomains?.length) {
    body.excludeDomains = normalizeDomains(options.excludeDomains);
  }

  if (options.tbs) {
    body.tbs = options.tbs;
  }

  if (options.scrapeMarkdown ?? true) {
    body.scrapeOptions = {
      formats: [{ type: "markdown" }],
      onlyMainContent: true,
      maxAge: 86_400_000
    };
  }

  const response = await fetch(FIRECRAWL_SEARCH_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  const payload = (await response.json().catch(() => null)) as FirecrawlSearchPayload | null;
  if (!response.ok || payload?.success === false) {
    throw new FirecrawlError(payload?.error ?? payload?.warning ?? "Firecrawl search failed.", response.status || 502);
  }

  const data = payload?.data ?? {};
  const results = [
    ...mapFirecrawlItems(data.web ?? [], "web"),
    ...mapFirecrawlItems(data.news ?? [], "news")
  ].slice(0, Math.min(10, Math.max(1, options.limit ?? 5)));

  return {
    configured: true,
    query,
    generatedAt: new Date().toISOString(),
    creditsUsed: payload?.creditsUsed,
    warning: payload?.warning ?? undefined,
    results
  };
}

export function getFirecrawlKey() {
  return process.env.FIRECRAWL_API_KEY ?? process.env.FIRECRAWL_KEY ?? process.env.FIRECRAWL;
}

function mapFirecrawlItems(items: FirecrawlSearchItem[], sourceType: FirecrawlSourceType): FirecrawlResearchResult[] {
  return items.flatMap((item) => {
    const url = item.url ?? item.metadata?.sourceURL ?? item.metadata?.url;
    if (!url) {
      return [];
    }

    const sourceHost = getHost(url);
    const quality = assessSourceQuality(sourceHost);
    const result: FirecrawlResearchResult = {
      title: item.title ?? item.metadata?.title ?? sourceHost ?? url,
      url,
      sourceType,
      sourceHost,
      sourceQuality: quality.level,
      qualityReason: quality.reason
    };

    const description = item.description ?? item.snippet ?? item.metadata?.description;
    const markdownPreview = trimPreview(item.markdown);
    if (description) {
      result.description = description;
    }
    if (item.date) {
      result.publishedDate = item.date;
    }
    if (markdownPreview) {
      result.markdownPreview = markdownPreview;
    }

    return [result];
  });
}

function assessSourceQuality(host?: string): { level: FirecrawlSourceQuality; reason: string } {
  if (!host) {
    return { level: "unknown", reason: "No hostname available for source assessment." };
  }

  if (isOfficialGovernmentHost(host)) {
    return { level: "high", reason: "Official government or intergovernmental domain." };
  }

  if (matchesKnownDomain(host, HIGH_QUALITY_DOMAINS)) {
    return { level: "high", reason: "Known institutional dataset, international organization, or methodology source." };
  }

  if (isAcademicHost(host)) {
    return { level: "high", reason: "Academic or research publisher domain." };
  }

  if (matchesKnownDomain(host, MEDIUM_QUALITY_DOMAINS)) {
    return { level: "medium", reason: "Common reference or established news source; verify against primary data for classifications." };
  }

  return { level: "unknown", reason: "Unclassified source; use as lead material and verify before updating the dataset." };
}

function isOfficialGovernmentHost(host: string) {
  return (
    host.endsWith(".gov") ||
    host.includes(".gov.") ||
    host.endsWith(".gouv.fr") ||
    host.includes(".gouv.") ||
    host.includes(".govt.") ||
    host.startsWith("gov.") ||
    host.startsWith("parliament.") ||
    host.startsWith("president.") ||
    host.startsWith("presidency.")
  );
}

function isAcademicHost(host: string) {
  return (
    host.endsWith(".edu") ||
    host.includes(".edu.") ||
    host.endsWith(".ac.uk") ||
    host.includes(".edu.au") ||
    host.includes("cambridge.org") ||
    host.includes("oxfordacademic.com") ||
    host.includes("springer.com") ||
    host.includes("jstor.org") ||
    host.includes("tandfonline.com") ||
    host.includes("doi.org") ||
    host.includes("arxiv.org")
  );
}

function matchesKnownDomain(host: string, domains: string[]) {
  return domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
}

function normalizeDomains(domains: string[]) {
  return Array.from(new Set(domains.map((domain) => domain.trim().toLowerCase()).filter(Boolean))).slice(0, 10);
}

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return undefined;
  }
}

function trimPreview(value?: string) {
  if (!value) {
    return undefined;
  }

  return value.replace(/\s+/g, " ").trim().slice(0, 1200);
}

export class FirecrawlError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "FirecrawlError";
    this.status = status;
  }
}
