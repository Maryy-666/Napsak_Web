"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, translations } from "../lib/translations";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  isMounted: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = "napsak_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("tr");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null;
      if (saved === "tr" || saved === "en") {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      } else {
        document.documentElement.lang = "tr";
      }
    } catch (e) {
      console.warn("Could not load language preference from localStorage:", e);
    }
  }, []);

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = newLang;
    }
    try {
      localStorage.setItem(LANGUAGE_STORAGE_KEY, newLang);
    } catch (e) {
      console.warn("Could not save language preference to localStorage:", e);
    }
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const langDict = translations[language] || translations.tr;
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      // Fallback to Turkish if key missing in English
      if (language !== "tr" && translations.tr && translations.tr[key]) {
        return translations.tr[key];
      }
      return fallback || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isMounted }}>
      {children}
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
