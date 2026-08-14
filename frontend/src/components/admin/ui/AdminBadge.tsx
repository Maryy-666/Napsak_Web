"use client";

import React from "react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export type AdminBadgeVariant =
  | "success"
  | "active"
  | "published"
  | "warning"
  | "pending"
  | "review"
  | "danger"
  | "rejected"
  | "passive"
  | "info"
  | "draft"
  | "neutral"
  | "soon";

export interface AdminBadgeProps {
  variant?: AdminBadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function AdminBadge({
  variant = "info",
  size = "sm",
  dot = false,
  children,
  className = "",
}: AdminBadgeProps) {
  const { isDark } = useAdminTheme();

  const getVariantStyles = (): { bg: string; dotColor: string } => {
    switch (variant) {
      case "success":
      case "active":
      case "published":
        return {
          bg: isDark
            ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200",
          dotColor: "bg-emerald-500",
        };
      case "warning":
      case "pending":
      case "review":
        return {
          bg: isDark
            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
            : "bg-amber-50 text-amber-700 border border-amber-200",
          dotColor: "bg-amber-500",
        };
      case "danger":
      case "rejected":
      case "passive":
        return {
          bg: isDark
            ? "bg-rose-500/15 text-rose-300 border border-rose-500/30"
            : "bg-rose-50 text-rose-700 border border-rose-200",
          dotColor: "bg-rose-500",
        };
      case "info":
      case "draft":
        return {
          bg: isDark
            ? "bg-sky-500/15 text-sky-300 border border-sky-500/30"
            : "bg-sky-50 text-sky-700 border border-sky-200",
          dotColor: "bg-sky-500",
        };
      case "neutral":
      case "soon":
      default:
        return {
          bg: isDark
            ? "bg-slate-800 text-slate-300 border border-slate-700"
            : "bg-slate-100 text-slate-600 border border-slate-200",
          dotColor: "bg-slate-400",
        };
    }
  };

  const { bg, dotColor } = getVariantStyles();

  const sizeClasses =
    size === "sm"
      ? "text-[10.5px] px-2.5 py-0.5 rounded-md font-bold"
      : "text-xs px-3 py-1 rounded-lg font-bold";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-sans transition-colors ${sizeClasses} ${bg} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shrink-0`} />}
      <span>{children}</span>
    </span>
  );
}
