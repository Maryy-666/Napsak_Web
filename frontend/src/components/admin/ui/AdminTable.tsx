"use client";

import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { useAdminTheme } from "../../../context/AdminThemeContext";
import { AdminEmptyState } from "./AdminEmptyState";
import { AdminLoadingState } from "./AdminLoadingState";

export interface Column<T> {
  key: string;
  header: string | React.ReactNode;
  accessor?: (row: T, index: number) => React.ReactNode;
  className?: string;
  align?: "left" | "center" | "right";
  sortable?: boolean;
}

export interface AdminTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T, index: number) => string | number;
  isLoading?: boolean;
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (columnKey: string) => void;
  className?: string;
}

export function AdminTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyState,
  onRowClick,
  sortColumn,
  sortDirection,
  onSort,
  className = "",
}: AdminTableProps<T>) {
  const { isDark } = useAdminTheme();

  if (isLoading) {
    return <AdminLoadingState type="table" rows={6} className={className} />;
  }

  if (!data || data.length === 0) {
    return (
      <div className={`rounded-2xl border ${isDark ? "border-slate-800 bg-[#0F1623]" : "border-slate-200 bg-white"} ${className}`}>
        {emptyState || <AdminEmptyState />}
      </div>
    );
  }

  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "center":
        return "text-center justify-center";
      case "right":
        return "text-right justify-end";
      case "left":
      default:
        return "text-left justify-start";
    }
  };

  return (
    <div
      className={`rounded-2xl border overflow-hidden transition-colors select-none font-sans ${
        isDark ? "border-slate-800 bg-[#0F1623]" : "border-slate-200 bg-white shadow-xs"
      } ${className}`}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[640px]">
          {/* HEADER */}
          <thead>
            <tr
              className={`border-b text-xs font-extrabold uppercase tracking-wider ${
                isDark
                  ? "bg-[#141C2E] text-slate-400 border-slate-800"
                  : "bg-slate-100/90 text-[#5F6773] border-slate-200"
              }`}
            >
              {columns.map((col) => {
                const isSorted = sortColumn === col.key;
                const canSort = col.sortable && onSort;

                return (
                  <th
                    key={col.key}
                    onClick={() => canSort && onSort(col.key)}
                    className={`px-5 py-3.5 font-sans whitespace-nowrap ${getAlignClass(
                      col.align
                    )} ${col.className || ""} ${
                      canSort ? "cursor-pointer hover:text-emerald-500 transition-colors" : ""
                    }`}
                  >
                    <div className={`flex items-center gap-1.5 ${getAlignClass(col.align)}`}>
                      <span>{col.header}</span>
                      {canSort && (
                        <span className="shrink-0">
                          {isSorted ? (
                            sortDirection === "asc" ? (
                              <ArrowUp className="w-3.5 h-3.5 text-[#0A5C3A]" />
                            ) : (
                              <ArrowDown className="w-3.5 h-3.5 text-[#0A5C3A]" />
                            )
                          ) : (
                            <ArrowUpDown className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* BODY */}
          <tbody
            className={`divide-y text-xs sm:text-sm font-medium ${
              isDark ? "divide-slate-800/70 text-slate-200" : "divide-slate-100 text-[#0F1115]"
            }`}
          >
            {data.map((row, index) => (
              <tr
                key={keyExtractor(row, index)}
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors ${
                  onRowClick ? "cursor-pointer" : ""
                } ${
                  isDark
                    ? "hover:bg-[#141C2E]/60"
                    : "hover:bg-slate-50/80"
                }`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 whitespace-nowrap ${col.className || ""}`}
                  >
                    <div className={`flex items-center ${getAlignClass(col.align)}`}>
                      {col.accessor
                        ? col.accessor(row, index)
                        : (row as any)[col.key] ?? "-"}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
