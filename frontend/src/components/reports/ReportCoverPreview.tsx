"use client";

import React from "react";
import { Report } from "./ReportsContent";
import { FileText } from "lucide-react";

interface ReportCoverPreviewProps {
  report: Report;
  className?: string;
}

export const ReportCoverPreview: React.FC<ReportCoverPreviewProps> = ({
  report,
  className = "",
}) => {
  // Theme color styles based on report ID or category
  const isDarkCover = report.id === "genclik-katilimi-2026" || report.id === "sayi-1-napsak";
  const isMintCover = report.id === "calisma-ekipleri-2026-q1";
  
  let bgStyle = "from-[#07452C] via-[#0A5C3A] to-[#053220] text-white";
  let badgeStyle = "bg-emerald-400/20 text-emerald-200 border border-emerald-400/30";
  let subtitleStyle = "text-emerald-300";

  if (isMintCover) {
    bgStyle = "from-[#EBF5F0] via-[#DCECE3] to-[#CCE2D5] text-[#0F1115]";
    badgeStyle = "bg-[#07452C] text-white";
    subtitleStyle = "text-[#07452C]";
  } else if (!isDarkCover) {
    bgStyle = "from-[#FAF8F5] via-[#F4F1EA] to-[#EBE7DF] text-[#0F1115]";
    badgeStyle = "bg-[#07452C] text-white";
    subtitleStyle = "text-[#07452C]";
  }

  return (
    <div className="relative group/cover">
      {/* Stacked Paper Page Backing Effect */}
      <div className="absolute -right-1 top-1.5 bottom-1.5 w-2 rounded-r bg-[#E5E2D9] border-r border-stone-300/80 shadow-2xs pointer-events-none" />
      
      {/* Primary Cover Window */}
      <div
        className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${bgStyle} p-3.5 flex flex-col justify-between shadow-[3px_6px_16px_rgba(0,0,0,0.16)] border-l-[5px] border-l-black/35 border-r border-r-stone-200/50 select-none transition-transform duration-300 group-hover/cover:translate-y-[-2px] ${className}`}
      >
        {/* Book Spine Crease Shadow */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/25 pointer-events-none" />

        {/* Background Watermark Document Lines */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden p-3 font-mono text-[7.5px] leading-tight">
          <div>NE YAPSAK? RESEARCH REPORT DATA GRID ARCHIVE</div>
          <div>METRIC INDEX: 0492-2026</div>
          <div className="mt-2">METHODOLOGY: QUANTITATIVE FIELD SURVEY</div>
          <div>SAMPLING: N=450 ACTIVE PARTICIPANTS</div>
        </div>

        {/* Header Row (Shortened Badge & Clean Gap Alignment) */}
        <div className="relative z-10 flex items-center justify-between gap-1 overflow-hidden">
          <span className="text-[8px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded bg-black/10 backdrop-blur-xs shrink-0">
            NE YAPSAK?
          </span>
          <span className={`text-[8.5px] font-black px-2 py-0.5 rounded-full shrink-0 ${badgeStyle}`}>
            {report.period}
          </span>
        </div>

        {/* Center Title & Category */}
        <div className="relative z-10 my-auto py-1.5 space-y-0.5">
          <p className={`text-[8px] font-bold uppercase tracking-wider ${subtitleStyle}`}>
            {report.category}
          </p>
          <h4 className="font-headings text-[11px] font-extrabold leading-snug line-clamp-3">
            {report.title}
          </h4>
        </div>

        {/* Footer Details */}
        <div className="relative z-10 pt-1.5 border-t border-current/15 flex items-center justify-between text-[8.5px] font-medium opacity-90">
          <span className="flex items-center gap-1 font-sans">
            <FileText className="w-2.5 h-2.5" />
            {report.pages} Sayfa
          </span>
          <span className="font-mono text-[8px] font-bold">PDF</span>
        </div>
      </div>
    </div>
  );
};
