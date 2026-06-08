"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { setDisplayLanguage, type DisplayLanguage } from "@/lib/i18n";

const STORAGE_KEY = "atlas-language";

type LanguageContextValue = {
  language: DisplayLanguage;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<DisplayLanguage>("vi");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "vi" || stored === "en") {
      setLanguage(stored);
      setDisplayLanguage(stored);
    }
  }, []);

  function toggleLanguage() {
    setLanguage((current) => {
      const next = current === "vi" ? "en" : "vi";
      setDisplayLanguage(next);
      window.localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <div key={language}>{children}</div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
