"use client";

import React from "react";
import { Inbox, LucideIcon } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface AdminEmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function AdminEmptyState({
  icon: Icon = Inbox,
  title = "Kayıt Bulunamadı",
  description = "Arama kriterlerinize uyan veya gösterilecek herhangi bir veri bulunamadı.",
  action,
  className = "",
}: AdminEmptyStateProps) {
  const { isDark } = useAdminTheme();

  return (
    <div
      className={`p-10 sm:p-14 flex flex-col items-center justify-center text-center select-none font-sans ${className}`}
    >
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
          isDark
            ? "bg-[#141C2E] border border-slate-800 text-slate-400"
            : "bg-slate-100 border border-slate-200 text-slate-500"
        }`}
      >
        <Icon className="w-7 h-7 stroke-[1.75]" />
      </div>

      <h3
        className={`text-base sm:text-lg font-bold font-headings mb-1 ${
          isDark ? "text-white" : "text-[#0F1115]"
        }`}
      >
        {title}
      </h3>

      <p
        className={`text-xs sm:text-sm max-w-md leading-relaxed font-medium mb-6 ${
          isDark ? "text-slate-400" : "text-[#5F6773]"
        }`}
      >
        {description}
      </p>

      {action && <div className="flex items-center gap-3">{action}</div>}
    </div>
  );
}
