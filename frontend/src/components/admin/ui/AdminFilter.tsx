"use client";

import React from "react";
import { Filter, RotateCcw } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

export interface AdminFilterProps {
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  label?: string;
  onReset?: () => void;
  variant?: "select" | "pills";
  className?: string;
}

export function AdminFilter({
  options,
  selectedValue,
  onChange,
  label,
  onReset,
  variant = "pills",
  className = "",
}: AdminFilterProps) {
  const { isDark } = useAdminTheme();

  const isFiltered = options.length > 0 && selectedValue !== options[0].value;

  if (variant === "select") {
    return (
      <div className={`flex items-center gap-2 select-none font-sans ${className}`}>
        {label && (
          <span
            className={`text-xs font-semibold shrink-0 ${
              isDark ? "text-slate-400" : "text-[#5F6773]"
            }`}
          >
            {label}
          </span>
        )}
        <div className="relative flex items-center">
          <Filter
            className={`w-3.5 h-3.5 absolute left-3 pointer-events-none ${
              isDark ? "text-slate-400" : "text-slate-500"
            }`}
          />
          <select
            value={selectedValue}
            onChange={(e) => onChange(e.target.value)}
            className={`h-10 pl-8 pr-8 text-xs sm:text-sm rounded-xl border outline-none font-medium appearance-none cursor-pointer transition-all ${
              isDark
                ? "bg-[#141C2E] border-slate-800 text-slate-200 focus:border-[#0A5C3A]"
                : "bg-slate-50 border-slate-200 text-[#0F1115] focus:border-[#0A5C3A]"
            }`}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label} {opt.count !== undefined ? `(${opt.count})` : ""}
              </option>
            ))}
          </select>
        </div>
        {isFiltered && onReset && (
          <button
            type="button"
            onClick={onReset}
            className={`p-2 rounded-lg text-xs font-semibold transition-colors ${
              isDark
                ? "text-slate-400 hover:text-white hover:bg-slate-800"
                : "text-slate-600 hover:text-[#0F1115] hover:bg-slate-100"
            }`}
            title="Filtreyi Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 flex-wrap select-none font-sans ${className}`}>
      {label && (
        <span
          className={`text-xs font-semibold mr-1 ${
            isDark ? "text-slate-400" : "text-[#5F6773]"
          }`}
        >
          {label}
        </span>
      )}
      {options.map((opt) => {
        const isSelected = selectedValue === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
              isSelected
                ? "bg-[#0A5C3A] text-white border-[#0A5C3A] shadow-xs"
                : isDark
                ? "bg-[#141C2E] text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80"
                : "bg-slate-50 text-[#5F6773] border-slate-200 hover:border-slate-300 hover:bg-slate-100"
            }`}
          >
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  isSelected
                    ? "bg-white/20 text-white"
                    : isDark
                    ? "bg-slate-800 text-slate-400"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
      {isFiltered && onReset && (
        <button
          type="button"
          onClick={onReset}
          className={`p-1.5 rounded-lg text-xs font-medium transition-colors ml-1 ${
            isDark
              ? "text-slate-400 hover:text-white hover:bg-slate-800"
              : "text-slate-500 hover:text-[#0F1115] hover:bg-slate-200"
          }`}
          title="Sıfırla"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
