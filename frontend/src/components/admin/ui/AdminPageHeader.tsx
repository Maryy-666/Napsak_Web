"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import { AdminBadge, AdminBadgeVariant } from "./AdminBadge";

export interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: AdminBadgeVariant;
  };
  action?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function AdminPageHeader({
  title,
  subtitle,
  icon: Icon,
  badge,
  action,
  children,
  className = "",
}: AdminPageHeaderProps) {
  const { isDark } = useAdminTheme();

  return (
    <div
      className={`flex flex-col gap-4 select-none font-sans ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          {Icon && (
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 mt-0.5 ${
                isDark
                  ? "bg-[#0A5C3A]/20 border border-[#0A5C3A]/40 text-emerald-400"
                  : "bg-[#0A5C3A]/10 border border-[#0A5C3A]/20 text-[#0A5C3A]"
              }`}
            >
              <Icon className="w-5.5 h-5.5 stroke-[2]" />
            </div>
          )}

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1
                className={`text-2xl font-extrabold font-headings tracking-tight ${
                  isDark ? "text-white" : "text-[#0F1115]"
                }`}
              >
                {title}
              </h1>
              {badge && (
                <AdminBadge variant={badge.variant || "info"}>
                  {badge.text}
                </AdminBadge>
              )}
            </div>
            {subtitle && (
              <p
                className={`text-xs font-medium mt-1 leading-relaxed ${
                  isDark ? "text-slate-400" : "text-[#5F6773]"
                }`}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
      </div>

      {children && <div className="pt-2">{children}</div>}
    </div>
  );
}
