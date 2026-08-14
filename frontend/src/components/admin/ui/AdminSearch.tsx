"use client";

import React from "react";
import { Search, X } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  className?: string;
}

export function AdminSearch({
  value,
  onChange,
  placeholder = "Arama yapın...",
  onClear,
  className = "",
}: AdminSearchProps) {
  const { isDark } = useAdminTheme();

  const handleClear = () => {
    onChange("");
    if (onClear) onClear();
  };

  return (
    <div className={`relative flex items-center select-none font-sans ${className}`}>
      <Search
        className={`w-4 h-4 absolute left-3.5 pointer-events-none transition-colors ${
          isDark ? "text-slate-400" : "text-slate-500"
        }`}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full h-10 pl-9 pr-9 text-xs sm:text-sm rounded-xl border outline-none font-medium transition-all ${
          isDark
            ? "bg-[#141C2E] border-slate-800 text-slate-100 placeholder-slate-500 focus:border-[#0A5C3A] focus:ring-1 focus:ring-[#0A5C3A]"
            : "bg-slate-50 border-slate-200 text-[#0F1115] placeholder-slate-400 focus:border-[#0A5C3A] focus:ring-1 focus:ring-[#0A5C3A]"
        }`}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className={`absolute right-3 p-0.5 rounded-md transition-colors ${
            isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800"
              : "text-slate-500 hover:text-[#0F1115] hover:bg-slate-200"
          }`}
          title="Temizle"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
