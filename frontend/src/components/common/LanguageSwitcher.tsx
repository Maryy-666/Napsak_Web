"use client";

import React from "react";
import { useLanguage } from "../../context/LanguageContext";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language selection / Dil seçimi"
      className={`inline-flex items-center gap-0.5 p-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md select-none shrink-0 ${className}`}
    >
      {showIcon && (
        <Globe className="w-3.5 h-3.5 text-white/70 ml-1.5 mr-0.5 shrink-0" aria-hidden="true" />
      )}

      <button
        type="button"
        onClick={() => setLanguage("tr")}
        aria-label="Türkçe Dilini Seç"
        aria-pressed={language === "tr"}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
          language === "tr"
            ? "bg-[#0A5C3A] text-white shadow-xs scale-[1.02]"
            : "text-white/75 hover:text-white hover:bg-white/10"
        }`}
      >
        TR
      </button>

      <button
        type="button"
        onClick={() => setLanguage("en")}
        aria-label="Select English Language"
        aria-pressed={language === "en"}
        className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/50 ${
          language === "en"
            ? "bg-[#0A5C3A] text-white shadow-xs scale-[1.02]"
            : "text-white/75 hover:text-white hover:bg-white/10"
        }`}
      >
        EN
      </button>
    </div>
  );
};
