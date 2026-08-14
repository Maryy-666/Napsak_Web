"use client";

import React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";

export interface AdminPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export function AdminPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 20, 50, 100],
  className = "",
}: AdminPaginationProps) {
  const { isDark } = useAdminTheme();

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t select-none font-sans ${
        isDark ? "border-slate-800/80 text-slate-300" : "border-slate-200 text-[#5F6773]"
      } ${className}`}
    >
      {/* ITEMS RANGE & TOTAL COUNT */}
      <div className="flex items-center gap-3 text-xs font-medium">
        <span>
          <strong className={isDark ? "text-white" : "text-[#0F1115]"}>
            {startItem}-{endItem}
          </strong>{" "}
          / <strong className={isDark ? "text-white" : "text-[#0F1115]"}>{totalItems}</strong> kayıt gösteriliyor
        </span>

        {onItemsPerPageChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="hidden md:inline">Sayfa Başı:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className={`h-7 px-2 text-xs rounded-lg border outline-none font-medium appearance-none cursor-pointer ${
                isDark
                  ? "bg-[#141C2E] border-slate-800 text-slate-200"
                  : "bg-slate-50 border-slate-200 text-[#0F1115]"
              }`}
            >
              {itemsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* NAVIGATION CONTROLS */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0F1115]"
          }`}
          title="İlk Sayfa"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0F1115]"
          }`}
          title="Önceki Sayfa"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-xs font-bold px-3 py-1.5 rounded-lg border border-[#0A5C3A]/30 bg-[#0A5C3A]/10 text-[#0A5C3A]">
          {currentPage} / {Math.max(1, totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0F1115]"
          }`}
          title="Sonraki Sayfa"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isDark
              ? "border-slate-800 bg-[#141C2E] text-slate-300 hover:bg-slate-800 hover:text-white"
              : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-[#0F1115]"
          }`}
          title="Son Sayfa"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
