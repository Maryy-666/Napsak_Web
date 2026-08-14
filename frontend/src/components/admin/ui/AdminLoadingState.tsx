"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface AdminLoadingStateProps {
  title?: string;
  type?: "spinner" | "table" | "cards";
  rows?: number;
  className?: string;
}

export function AdminLoadingState({
  title = "Veriler yükleniyor...",
  type = "spinner",
  rows = 5,
  className = "",
}: AdminLoadingStateProps) {
  const { isDark } = useAdminTheme();

  if (type === "table") {
    return (
      <div className={`w-full p-4 space-y-3 font-sans ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className={`h-12 w-full rounded-xl animate-pulse ${
              isDark ? "bg-[#141C2E]" : "bg-slate-100"
            }`}
          />
        ))}
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 font-sans ${className}`}>
        {Array.from({ length: rows }).map((_, idx) => (
          <div
            key={idx}
            className={`h-36 rounded-2xl animate-pulse ${
              isDark ? "bg-[#141C2E] border border-slate-800" : "bg-slate-100 border border-slate-200"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`p-12 flex flex-col items-center justify-center text-center select-none font-sans ${className}`}
    >
      <Loader2
        className={`w-8 h-8 animate-spin mb-3 text-[#0A5C3A]`}
      />
      <p
        className={`text-xs font-semibold ${
          isDark ? "text-slate-400" : "text-[#5F6773]"
        }`}
      >
        {title}
      </p>
    </div>
  );
}
