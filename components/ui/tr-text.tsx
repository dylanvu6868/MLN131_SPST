"use client";

import { useLanguage } from "@/lib/language-context";
import { tr } from "@/lib/i18n";

// Renders a Vietnamese-authored string, translated to the active language.
// Use inside server-rendered pages for inline chrome so the text re-renders
// when the language toggles (this is a client component).
export function TrText({ vi }: { vi: string }) {
  useLanguage();
  return <>{tr(vi)}</>;
}
