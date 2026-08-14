"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  className?: string;
}

export function AdminModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon: Icon,
  children,
  footer,
  size = "md",
  className = "",
}: AdminModalProps) {
  const { isDark } = useAdminTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  }[size];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto select-none font-sans">
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* DIALOG BOX */}
      <div
        className={`relative w-full ${sizeClasses} rounded-2xl border shadow-2xl overflow-hidden z-10 my-auto flex flex-col max-h-[90vh] transition-all ${
          isDark
            ? "bg-[#0F1623] border-slate-800 text-slate-100"
            : "bg-white border-slate-200 text-[#0F1115]"
        } ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* HEADER */}
        <div
          className={`px-6 py-5 border-b flex items-center justify-between shrink-0 ${
            isDark ? "border-slate-800/80 bg-[#141C2E]/60" : "border-slate-200 bg-slate-50/80"
          }`}
        >
          <div className="flex items-center gap-3 pr-4">
            {Icon && (
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                  isDark
                    ? "bg-[#0A5C3A]/20 border border-[#0A5C3A]/40 text-emerald-400"
                    : "bg-[#0A5C3A]/10 border border-[#0A5C3A]/20 text-[#0A5C3A]"
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2]" />
              </div>
            )}
            <div>
              <h2
                id="modal-title"
                className={`text-lg font-bold font-headings ${
                  isDark ? "text-white" : "text-[#0F1115]"
                }`}
              >
                {title}
              </h2>
              {subtitle && (
                <p
                  className={`text-xs font-medium mt-0.5 ${
                    isDark ? "text-slate-400" : "text-[#5F6773]"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-500 hover:text-[#0F1115] hover:bg-slate-200"
            }`}
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* FOOTER */}
        {footer && (
          <div
            className={`px-6 py-4 border-t flex items-center justify-end gap-3 shrink-0 ${
              isDark ? "border-slate-800/80 bg-[#141C2E]/60" : "border-slate-200 bg-slate-50/80"
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
