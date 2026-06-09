"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitCompare, Globe2, Languages, Map, Menu, Newspaper, Scale, Shield, Trophy, X } from "lucide-react";

import { useLanguage } from "@/lib/language-context";
import { tr } from "@/lib/i18n";

const links = [
  { href: "/", label: "Bản đồ", icon: Map },
  { href: "/country-symbols", label: "Biểu tượng", icon: Shield },
  { href: "/countries", label: "Quốc gia", icon: Globe2 },
  { href: "/compare", label: "So sánh", icon: GitCompare },
  { href: "/socialism", label: "Xã hội chủ nghĩa", icon: Scale },
  { href: "/news", label: "Tin tức", icon: Newspaper },
  { href: "/ranking", label: "Xếp hạng", icon: Trophy }
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { language, toggleLanguage } = useLanguage();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-teal-200/10 bg-[#081017]/92 shadow-[0_10px_36px_rgba(3,10,18,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-3 rounded-md" aria-label={tr("Trang chủ World Ideology Atlas")}>
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-teal-300/35 bg-teal-300/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
            <Globe2 className="h-5 w-5 text-teal-100" aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-sm font-semibold leading-tight text-white sm:text-base">
              World Ideology Atlas
            </span>
            <span className="hidden whitespace-nowrap text-[11px] leading-tight text-slate-400 sm:block">
              {tr("Bản đồ Chủ nghĩa & Bộ máy Nhà nước")}
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-0.5 xl:flex" aria-label={tr("Điều hướng chính")}>
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`focus-ring inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${active
                    ? "border-amber-300/30 bg-amber-300/[0.12] text-amber-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                    : "border-transparent text-slate-300 hover:border-teal-200/15 hover:bg-slate-800/60 hover:text-white"
                  }`}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {tr(link.label)}
              </Link>
            );
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLanguage}
            className="focus-ring inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-700 bg-slate-950/80 px-3 text-sm font-medium text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100"
            aria-label={language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
            title={language === "vi" ? "Switch to English" : "Chuyển sang tiếng Việt"}
          >
            <Languages className="h-4 w-4" aria-hidden="true" />
            {language === "vi" ? "VI" : "EN"}
          </button>
          <button
            className="focus-ring grid h-9 w-9 place-items-center rounded-md border border-slate-700 bg-slate-950/80 text-slate-200 transition hover:border-amber-300/40 hover:text-amber-100 xl:hidden"
            aria-label={mobileOpen ? tr("Đóng menu") : tr("Mở menu điều hướng")}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen && (
        <nav
          className="border-t border-teal-200/10 bg-[#081017]/97 px-4 pb-4 pt-2 shadow-2xl shadow-black/25 xl:hidden"
          aria-label={tr("Điều hướng di động")}
        >
          <ul className="flex flex-col gap-0.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`focus-ring flex items-center gap-2.5 rounded-md border px-3 py-2.5 text-sm font-medium transition-colors
                      ${active
                        ? "border-amber-300/25 bg-amber-400/10 text-amber-100"
                        : "border-transparent text-slate-300 hover:border-teal-200/15 hover:bg-slate-800/70 hover:text-white"
                      }`}
                    aria-current={active ? "page" : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {tr(link.label)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
