"use client";

import React, { useState } from "react";
import { AlertTriangle, Info, CheckCircle2, ShieldAlert, Loader2, LogOut, LucideIcon } from "lucide-react";
import { AdminModal } from "./AdminModal";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export type AdminConfirmVariant = "danger" | "warning" | "info" | "success" | "brand";

export interface AdminConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: AdminConfirmVariant;
  isLoading?: boolean;
  icon?: LucideIcon;
}

export function AdminConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText,
  cancelText = "Vazgeç",
  variant = "danger",
  isLoading = false,
  icon: CustomIcon,
}: AdminConfirmDialogProps) {
  const { isDark } = useAdminTheme();
  const [internalLoading, setInternalLoading] = useState(false);

  const activeLoading = isLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const getVariantDetails = () => {
    switch (variant) {
      case "brand":
        return {
          icon: CustomIcon || LogOut,
          iconBg: isDark
            ? "bg-[#0A5C3A]/25 text-emerald-400 border border-[#0A5C3A]/40"
            : "bg-emerald-50 text-[#0A5C3A] border border-emerald-200",
          buttonBg: "bg-[#0A5C3A] hover:bg-[#084A2F] text-white shadow-md shadow-[#0A5C3A]/20",
          defaultConfirmText: "Evet, Onayla",
        };
      case "danger":
        return {
          icon: CustomIcon || ShieldAlert,
          iconBg: isDark ? "bg-rose-500/20 text-rose-400 border border-rose-500/30" : "bg-rose-50 text-rose-600 border border-rose-200",
          buttonBg: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
          defaultConfirmText: "Evet, Sil / Pasifleştir",
        };
      case "warning":
        return {
          icon: CustomIcon || AlertTriangle,
          iconBg: isDark ? "bg-[#0A5C3A]/25 text-emerald-400 border border-[#0A5C3A]/40" : "bg-emerald-50 text-[#0A5C3A] border border-emerald-200",
          buttonBg: "bg-[#0A5C3A] hover:bg-[#084A2F] text-white shadow-[#0A5C3A]/20",
          defaultConfirmText: "Evet, Onayla",
        };
      case "success":
        return {
          icon: CustomIcon || CheckCircle2,
          iconBg: isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-emerald-50 text-emerald-600 border border-emerald-200",
          buttonBg: "bg-[#0A5C3A] hover:bg-[#084A2F] text-white shadow-[#0A5C3A]/20",
          defaultConfirmText: "Evet, Yayınla",
        };
      case "info":
      default:
        return {
          icon: CustomIcon || Info,
          iconBg: isDark ? "bg-sky-500/20 text-sky-400 border border-sky-500/30" : "bg-sky-50 text-sky-600 border border-sky-200",
          buttonBg: "bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20",
          defaultConfirmText: "Evet, Devam Et",
        };
    }
  };

  const { icon: IconComp, iconBg, buttonBg, defaultConfirmText } = getVariantDetails();

  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={activeLoading}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer disabled:opacity-50 ${
              isDark
                ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
                : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={activeLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 ${buttonBg}`}
          >
            {activeLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>{confirmText || defaultConfirmText}</span>
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <IconComp className="w-6 h-6 stroke-[2]" />
        </div>
        <div className="space-y-2 pt-0.5">
          <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDark ? "text-slate-300" : "text-[#5F6773]"}`}>
            {description}
          </p>
        </div>
      </div>
    </AdminModal>
  );
}
