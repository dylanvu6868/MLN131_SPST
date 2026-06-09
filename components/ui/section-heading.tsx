"use client";

import { useLanguage } from "@/lib/language-context";
import { tr } from "@/lib/i18n";

export function SectionHeading({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  // Subscribe to language so the (Vietnamese-authored) props re-translate on toggle.
  useLanguage();
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300">
          {tr(eyebrow)}
        </p>
      ) : null}
      <h2 className="mt-2 text-2xl font-semibold leading-tight text-white text-balance sm:text-3xl">
        {tr(title)}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">
          {tr(description)}
        </p>
      ) : null}
    </div>
  );
}
