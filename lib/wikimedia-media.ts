const USER_AGENT = "WorldIdeologyAtlas/1.0 (https://github.com/world-ideology-atlas; educational)";

export function extractCommonsFilename(urlOrName: string): string | null {
  const value = urlOrName.trim();
  if (!value) return null;

  if (!value.includes("/") && !value.startsWith("http")) {
    return value.replace(/^File:/i, "");
  }

  try {
    const parsed = new URL(value);
    const path = decodeURIComponent(parsed.pathname);

    if (path.includes("/Special:FilePath/")) {
      return decodeURIComponent(path.split("/Special:FilePath/")[1] ?? "");
    }

    if (path.includes("/wiki/File:")) {
      return decodeURIComponent(path.split("/wiki/File:")[1] ?? "");
    }
  } catch {
    return value.replace(/^File:/i, "");
  }

  return null;
}

export async function resolveCommonsDirectUrl(fileUrlOrName: string): Promise<string | null> {
  const filename = extractCommonsFilename(fileUrlOrName);
  if (!filename) return null;

  const params = new URLSearchParams({
    action: "query",
    titles: `File:${filename}`,
    prop: "imageinfo",
    iiprop: "url",
    format: "json",
    origin: "*"
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": USER_AGENT }
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: { pages?: Record<string, { missing?: boolean; imageinfo?: { url: string }[] }> };
  };

  const page = Object.values(data.query?.pages ?? {})[0];
  if (!page || page.missing) return null;

  return page.imageinfo?.[0]?.url ?? null;
}

export function toCommonsFilePathUrl(filename: string): string {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename.replace(/^File:/i, ""))}`;
}

export async function normalizeMediaUrl(url?: string): Promise<string | undefined> {
  if (!url) return undefined;

  if (url.includes("upload.wikimedia.org")) {
    return url;
  }

  const direct = await resolveCommonsDirectUrl(url);
  return direct ?? url;
}

export async function searchCommonsImage(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "5",
    prop: "imageinfo",
    iiprop: "url",
    format: "json",
    origin: "*"
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": USER_AGENT }
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: { pages?: Record<string, { title: string; imageinfo?: { url: string }[] }> };
  };

  const pages = Object.values(data.query?.pages ?? {});
  const preferred = pages.find((page) => /\.(jpg|jpeg|png|webp)$/i.test(page.title));
  const chosen = preferred ?? pages[0];
  return chosen?.imageinfo?.[0]?.url ?? null;
}

export async function searchCommonsAudio(query: string): Promise<string | null> {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|mime",
    format: "json",
    origin: "*"
  });

  const response = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": USER_AGENT }
  });

  if (!response.ok) return null;

  const data = (await response.json()) as {
    query?: { pages?: Record<string, { title: string; imageinfo?: { url: string; mime?: string }[] }> };
  };

  const pages = Object.values(data.query?.pages ?? {});
  const audio = pages.find((page) => {
    const mime = page.imageinfo?.[0]?.mime ?? "";
    const title = page.title.toLowerCase();
    return (
      (mime.startsWith("audio/") || title.endsWith(".ogg") || title.endsWith(".oga") || title.endsWith(".mp3")) &&
      (title.includes("anthem") || title.includes("quốc ca") || title.includes("hymn"))
    );
  });

  return audio?.imageinfo?.[0]?.url ?? pages[0]?.imageinfo?.[0]?.url ?? null;
}
