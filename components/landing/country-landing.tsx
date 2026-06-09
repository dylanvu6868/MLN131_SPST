"use client";

import { useMemo, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Camera,
  ChevronDown,
  Compass,
  Crown,
  ExternalLink,
  History,
  Landmark,
  Music2,
  Newspaper,
  Palette,
  Stamp,
  Shield,
  ScrollText,
  UserRound
} from "lucide-react";

import { generateCountryExperiences, type CountryExperience } from "@/lib/country-experience";
import { displayCountryName, displayValue, tr } from "@/lib/i18n";
import { useLanguage } from "@/lib/language-context";
import type { CountryPoliticalProfile } from "@/lib/types";

type CountrySection = CountryExperience["sections"][number];

export function CountryLandingExperience({ countries }: { countries: CountryPoliticalProfile[] }) {
  useLanguage();
  const experiences = useMemo(() => generateCountryExperiences(countries), [countries]);
  const [selectedSlug, setSelectedSlug] = useState(() => experiences[0]?.slug ?? "vnm");
  
  const selected = useMemo(
    () => experiences.find((country) => country.slug === selectedSlug) ?? experiences[0],
    [selectedSlug, experiences]
  );
  const profile = countries.find((country) => country.iso3 === selected?.iso3);

  if (!selected) return null;

  const themeStyle = {
    "--country-primary": selected.theme.primary,
    "--country-secondary": selected.theme.secondary,
    "--country-background": selected.theme.background,
    "--country-accent": selected.theme.accent,
    "--country-muted": selected.theme.muted
  } as CSSProperties;

  return (
    <section className="country-stage" style={themeStyle}>
      <div className="country-stage__texture" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 pb-10 pt-6 sm:px-6 lg:px-8">
        <div className="country-shell overflow-hidden rounded-lg">
          <div className="relative min-h-[620px]">
            <div
              key={selected.hero.image}
              className="absolute inset-0 animate-country-fade bg-cover bg-center"
              style={{ backgroundImage: `url("${selected.hero.image}")` }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(12,8,7,0.96),rgba(33,16,13,0.78)_42%,rgba(33,16,13,0.35)),linear-gradient(0deg,rgba(16,10,8,0.98),rgba(16,10,8,0.16)_48%,rgba(16,10,8,0.78))]" />

            <div className="relative z-10 flex min-h-[620px] flex-col justify-between p-5 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <Link href="/country-symbols" className="focus-ring inline-flex items-center gap-3 rounded-md">
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-[var(--country-secondary)]/70 bg-black/35 text-[var(--country-secondary)] shadow-[0_0_30px_rgba(218,165,32,0.18)]">
                    <Crown className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block font-serif text-lg font-semibold tracking-wide text-white">{tr("Biểu tượng quốc gia")}</span>
                    <span className="text-xs uppercase tracking-[0.22em] text-[var(--country-secondary)]">{tr("Di sản · Văn hóa · Bản sắc")}</span>
                  </span>
                </Link>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-sm text-stone-200 backdrop-blur md:flex">
                    <a href="#politics" className="rounded-full px-3 py-1.5 hover:bg-white/10">{tr("Chính trị")}</a>
                    <a href="#heritage" className="rounded-full px-3 py-1.5 hover:bg-white/10">{tr("Di sản")}</a>
                    <a href="#leaders" className="rounded-full px-3 py-1.5 hover:bg-white/10">{tr("Lãnh đạo")}</a>
                    <a href="#culture" className="rounded-full px-3 py-1.5 hover:bg-white/10">{tr("Văn hóa")}</a>
                    <Link href="/news" className="rounded-full px-3 py-1.5 hover:bg-white/10">{tr("Tin tức")}</Link>
                  </nav>

                  <label className="relative min-w-[220px]">
                    <span className="sr-only">{tr("Chọn quốc gia")}</span>
                    <select
                      className="focus-ring h-11 w-full appearance-none rounded-full border border-[var(--country-secondary)]/50 bg-black/45 px-4 pr-10 text-sm font-medium text-white outline-none backdrop-blur"
                      value={selectedSlug}
                      onChange={(event) => setSelectedSlug(event.target.value)}
                    >
                      {experiences.map((country) => (
                        <option key={country.slug} value={country.slug}>
                          {country.localName}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-3 top-3.5 h-4 w-4 text-[var(--country-secondary)]" aria-hidden="true" />
                  </label>
                </div>
              </div>

              <div className="grid gap-8 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
                <div className="max-w-3xl animate-country-rise">
                  <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-[var(--country-secondary)]/45 bg-black/35 px-3 py-2 text-sm text-[var(--country-secondary)] backdrop-blur">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--country-primary)]/65">
                      {profile?.flagEmoji ?? "◎"}
                    </span>
                    <span>{selected.localName}</span>
                  </div>

                  <h1 className="font-serif text-4xl font-semibold leading-[1.1] text-white sm:text-6xl lg:text-7xl text-balance">
                    {selected.name}
                  </h1>
                  <p className="mt-4 max-w-xl text-base leading-7 text-[var(--country-secondary)] sm:text-xl">
                    {selected.hero.subtitle}
                  </p>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-stone-200 sm:text-base">{selected.hero.description}</p>

                  <div className="mt-8 flex flex-wrap gap-3">
                    <a href="#heritage" className="heritage-button focus-ring px-5">
                      <Compass className="h-4 w-4" aria-hidden="true" />
                      {tr("Khám phá di sản")}
                    </a>
                    <Link href="/ranking" className="heritage-button heritage-button--ghost focus-ring px-5">
                      {tr("Xem xếp hạng")}
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {selected.insights.map((item, index) => (
                    <div
                      key={item.label}
                      className="animate-country-rise rounded-lg border border-white/10 bg-black/35 p-4 backdrop-blur"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--country-secondary)]">{item.label}</p>
                      <p className="mt-2 text-sm leading-6 text-stone-100">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[var(--country-secondary)]/60 bg-black/45 text-[var(--country-secondary)] shadow-[0_0_40px_rgba(218,165,32,0.18)] animate-pulse">
                <span className="text-[var(--country-secondary)] text-xs tracking-widest opacity-70">↓</span>
              </div>
            </div>
          </div>

          <div id="heritage" className="country-content px-5 py-8 sm:px-8 lg:px-10">
            <div className="mb-6 grid gap-3 rounded-lg border border-white/10 bg-black/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
              <MetaChip label={tr("Tên tiếng Anh")} value={selected.meta.countryNameEn} />
              <MetaChip label={tr("Mã ISO")} value={`${selected.meta.iso2} · ${selected.meta.iso3}`} />
              <MetaChip label={tr("Khu vực")} value={selected.meta.regionVi} />
              <MetaChip label={tr("Mức xác minh")} value={selected.meta.verificationLevel} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {selected.sections.map((section, index) => (
                <article
                  key={section.kind}
                  id={section.kind === "cultureIdentity" ? "culture" : undefined}
                  className="heritage-card animate-country-rise group flex min-h-[560px] flex-col overflow-hidden rounded-lg bg-black/40"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <HeritageCardVisual section={section} profile={profile} countryName={selected.localName} />
                  <div className="flex flex-1 flex-col p-5">
                    <h2 className="font-serif text-xl font-semibold text-white transition-colors duration-300 group-hover:text-[var(--country-secondary)]">
                      {section.title}
                    </h2>
                    {section.officialName ? (
                      <p className="mt-1 text-sm font-medium text-stone-200">{section.officialName}</p>
                    ) : null}
                    <p className="mt-3 text-sm leading-6 text-stone-300">{section.description}</p>

                    <div className="mt-auto pt-5">
                      {section.kind === "headResidence" && section.mapUrl ? (
                        <a
                          href={section.mapUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="focus-ring mb-4 inline-flex items-center gap-1 rounded-full border border-[var(--country-secondary)]/25 px-3 py-1.5 text-xs text-[var(--country-secondary)] transition-colors hover:bg-[var(--country-secondary)]/10"
                        >
                          {tr("Xem vị trí trên bản đồ")}
                          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      ) : null}
                      {section.kind === "anthem" ? (
                        section.audioUrl ? (
                          <audio
                            className="mb-4 h-10 w-full rounded-md opacity-80 mix-blend-screen"
                            controls
                            preload="none"
                            src={section.audioUrl}
                          >
                            {tr("Trình duyệt của bạn không hỗ trợ phát âm thanh.")}
                          </audio>
                        ) : (
                          <p className="mb-4 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-stone-400">
                            {tr("Chưa có file âm thanh quốc ca đã xác minh.")}
                          </p>
                        )
                      ) : null}

                      <div className="mb-4 grid gap-2">
                        {section.details.map((detail) => (
                          <div
                            key={`${section.kind}-${detail.label}`}
                            className="flex flex-col rounded-md border border-white/5 bg-white/[0.02] px-3 py-2"
                          >
                            <span className="text-[10px] uppercase tracking-widest text-[var(--country-secondary)] opacity-80">
                              {detail.label}
                            </span>
                            <span
                              className={`mt-1 text-sm font-medium ${detail.muted ? "text-stone-400 italic" : "text-stone-200"}`}
                            >
                              {detail.value}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs text-stone-400">
                        <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-stone-200 shadow-sm">
                          {section.verificationLevel}
                        </span>
                        {section.sourceUrl ? (
                          <a
                            href={section.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="focus-ring inline-flex items-center gap-1 rounded-full border border-[var(--country-secondary)]/25 px-3 py-1 text-[var(--country-secondary)] transition-colors hover:bg-[var(--country-secondary)]/10"
                          >
                            {section.sourceLabel ?? tr("Nguồn kiểm chứng")}
                            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        ) : (
                          <span className="px-1 italic opacity-70">{section.sourceLabel}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {selected.meta.notes ? (
              <p className="mt-4 rounded-lg border border-amber-300/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-100/90">
                {selected.meta.notes}
              </p>
            ) : null}

            {selected.leaders.length ? (
              <div id="leaders" className="mt-12">
                <div className="mb-5 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-[var(--country-secondary)]/35 bg-black/35 text-[var(--country-secondary)]">
                    <UserRound className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h2 className="font-serif text-2xl font-semibold text-white">{tr("Lãnh đạo quốc gia hiện nay")}</h2>
                    <p className="text-sm text-stone-400">{tr("Cập nhật từ Wikipedia — nguyên thủ, thủ tướng, quân chủ, lãnh tụ và các chức vụ lãnh đạo cao nhất")}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {selected.leaders.map((leader) => (
                    <article
                      key={`${leader.role}-${leader.name}`}
                      className="heritage-card animate-country-rise overflow-hidden rounded-lg border border-white/10 bg-black/35"
                    >
                      <div className="grid sm:grid-cols-[140px_1fr]">
                        <div className="relative h-44 bg-[linear-gradient(135deg,rgba(15,10,9,0.96),rgba(47,20,17,0.92))] sm:h-full sm:min-h-[180px]">
                          {leader.imageUrl ? (
                            <img
                              src={leader.imageUrl}
                              alt={`${leader.name} - ${leader.title}`}
                              className="h-full w-full object-cover object-top"
                              loading="lazy"
                            />
                          ) : (
                            <div className="grid h-full place-items-center text-[var(--country-secondary)]">
                              <UserRound className="h-12 w-12 opacity-70" aria-hidden="true" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col p-5">
                          <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--country-secondary)]">
                            {leader.role === "headOfState"
                              ? tr("Nguyên thủ / Lãnh tụ")
                              : leader.role === "headOfGovernment"
                                ? tr("Đứng đầu chính phủ")
                                : tr("Lãnh đạo nhà nước")}
                          </p>
                          <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-white">{leader.title}</h3>
                          <p className="mt-2 text-lg font-medium text-stone-100">{leader.name}</p>
                          {leader.titleEn && leader.titleEn !== leader.title ? (
                            <p className="mt-1 text-xs text-stone-400">{leader.titleEn}</p>
                          ) : null}
                          {leader.since ? (
                            <p className="mt-2 text-sm text-stone-400">{tr("Nhậm chức từ năm")} {leader.since}</p>
                          ) : null}
                          {leader.sourceUrl ? (
                            <a
                              href={leader.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="focus-ring mt-auto inline-flex items-center gap-1 pt-4 text-xs text-[var(--country-secondary)] hover:underline"
                            >
                              Wikipedia
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            ) : null}

            <div id="politics" className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
              <article
                className="animate-country-rise flex flex-col justify-between rounded-lg border border-[var(--country-secondary)]/20 bg-gradient-to-b from-black/40 to-black/20 p-6"
              >
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--country-secondary)]/30 bg-[var(--country-primary)]/20 text-[var(--country-secondary)] shadow-inner">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <h2 className="font-serif text-2xl font-semibold text-white tracking-tight">{selected.politics.title}</h2>
                </div>
                <p className="mt-6 text-sm leading-relaxed text-stone-300/90 prose-safe">{selected.politics.summary}</p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {selected.politics.facts.map((fact) => (
                    <div key={fact} className="flex items-center rounded-md border border-white/5 bg-white/[0.02] px-4 py-3 text-sm font-medium text-stone-200">
                      {fact}
                    </div>
                  ))}
                </div>
              </article>

              <article
                className="animate-country-rise flex flex-col justify-between rounded-lg border border-white/5 bg-black/30 p-6"
                style={{ animationDelay: "100ms" }}
              >
                <div className="grid gap-4 sm:grid-cols-3">
                  <MiniFact icon={<Building2 className="h-4 w-4" />} label={tr("Mô hình")} value={displayValue(profile?.governmentSystem)} />
                  <MiniFact icon={<Landmark className="h-4 w-4" />} label={tr("Thiết chế")} value={displayValue(profile?.legislature)} />
                  <MiniFact icon={<Camera className="h-4 w-4" />} label={tr("Thủ đô")} value={displayValue(profile?.capital)} />
                </div>
                <div className="mt-auto pt-6">
                  <div className="rounded-lg border border-[var(--country-secondary)]/20 bg-[var(--country-primary)]/10 p-5 backdrop-blur-md">
                    <p className="text-sm leading-relaxed text-stone-200/90">
                      {profile
                        ? `${displayCountryName(profile)} ${tr("được đặt trong bối cảnh chính trị, văn hóa và di sản để người xem hiểu quốc gia như một chỉnh thể sống động.")}`
                        : tr("Mỗi quốc gia được đặt trong bối cảnh chính trị, văn hóa và di sản để người xem hiểu quốc gia như một chỉnh thể sống động.")}
                    </p>
                  </div>
                </div>
              </article>
            </div>

            <div
              className="animate-country-rise relative mt-12 overflow-hidden rounded-lg border border-[var(--country-secondary)]/20 bg-gradient-to-r from-black/50 via-black/30 to-black/50 p-8"
            >
              <div className="absolute inset-0 bg-[var(--country-primary)]/5 mix-blend-overlay" aria-hidden="true" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-semibold tracking-tight text-white">{tr("Tiếp tục khám phá")} {selected.localName}</h2>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href={`/countries/${selected.iso3}`} className="heritage-button focus-ring px-5 py-2.5 shadow-lg transition-transform hover:scale-105 active:scale-95">
                    {tr("Hồ sơ chi tiết")}
                  </Link>
                  <Link href="/news" className="heritage-button heritage-button--ghost focus-ring px-5 py-2.5 transition-transform hover:scale-105 active:scale-95">
                    <Newspaper className="h-4 w-4" aria-hidden="true" />
                    {tr("Tin nóng")}
                  </Link>
                  <Link href="/#map" className="heritage-button heritage-button--ghost focus-ring px-5 py-2.5 transition-transform hover:scale-105 active:scale-95">
                    {tr("Bản đồ thế giới")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeritageCardVisual({
  section,
  profile,
  countryName
}: {
  section: CountrySection;
  profile?: CountryPoliticalProfile;
  countryName: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const Icon = getSectionIcon(section.kind);
  const containImage = section.kind === "emblem" || section.kind === "anthem" || section.kind === "seal";
  const coverImage = section.kind === "headResidence";
  const fallbackImage =
    section.kind === "emblem" || section.kind === "seal" || section.kind === "anthem"
      ? profile?.flagSvgUrl
      : undefined;
  const imageSrc = !imageFailed ? section.image ?? fallbackImage : fallbackImage;

  return (
    <div className="relative h-56 overflow-hidden bg-[radial-gradient(circle_at_34%_18%,rgba(218,165,32,0.20),transparent_35%),linear-gradient(135deg,rgba(15,10,9,0.96),rgba(47,20,17,0.92))]">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={section.imageAlt}
          className={
            containImage
              ? "h-full w-full object-contain p-8 opacity-95 transition duration-500 group-hover:scale-105"
              : coverImage
                ? "h-full w-full object-cover opacity-95 transition duration-500 group-hover:scale-105"
                : "h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
          }
          loading="lazy"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <GeneratedVisual section={section} profile={profile} countryName={countryName} />
      )}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.78))]" aria-hidden="true" />
      <div className="absolute left-4 top-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-[var(--country-secondary)]/35 bg-black/50 px-3 py-1.5 text-xs font-semibold text-[var(--country-secondary)] backdrop-blur">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="truncate">{section.title}</span>
      </div>
      {profile?.flagSvgUrl ? (
        <img
          src={profile.flagSvgUrl}
          alt={`Quốc kỳ ${countryName}`}
          className="absolute bottom-4 right-4 h-7 w-11 rounded-sm border border-white/25 object-cover shadow-lg"
          loading="lazy"
        />
      ) : null}
    </div>
  );
}

function GeneratedVisual({
  section,
  profile,
  countryName
}: {
  section: CountrySection;
  profile?: CountryPoliticalProfile;
  countryName: string;
}) {
  const Icon = getSectionIcon(section.kind);

  return (
    <div className="grid h-full place-items-center px-6 text-center">
      <div className="relative">
        <div className="absolute inset-[-38px] rounded-full bg-[var(--country-secondary)]/10 blur-2xl" aria-hidden="true" />
        <div className="relative mx-auto grid h-24 w-24 place-items-center rounded-full border border-[var(--country-secondary)]/45 bg-black/45 text-[var(--country-secondary)] shadow-[0_0_44px_rgba(218,165,32,0.14)]">
          {section.kind === "emblem" && profile?.flagSvgUrl ? (
            <img src={profile.flagSvgUrl} alt={`Biểu tượng ${countryName}`} className="h-12 w-16 rounded-sm object-cover" loading="lazy" />
          ) : (
            <Icon className="h-10 w-10" aria-hidden="true" />
          )}
        </div>
        <p className="relative mt-4 text-sm font-semibold text-stone-100">{countryName}</p>
        <p className="relative mt-1 text-xs uppercase tracking-[0.18em] text-[var(--country-secondary)]">{section.kicker}</p>
      </div>
    </div>
  );
}

function getSectionIcon(kind: CountrySection["kind"]) {
  switch (kind) {
    case "emblem":
      return Shield;
    case "anthem":
      return Music2;
    case "seal":
      return Stamp;
    case "headResidence":
      return Landmark;
    case "cultureIdentity":
      return Palette;
    case "historyDepth":
      return History;
    default:
      return ScrollText;
  }
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--country-secondary)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-stone-100">{value}</p>
    </div>
  );
}

function MiniFact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <div className="flex items-center gap-2 text-[var(--country-secondary)]">
        {icon}
        <span className="text-xs uppercase tracking-[0.16em]">{label}</span>
      </div>
      <p className="mt-3 text-sm leading-6 text-stone-100">{value}</p>
    </div>
  );
}
