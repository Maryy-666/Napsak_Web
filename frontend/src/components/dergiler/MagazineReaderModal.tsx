"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, BookOpen, Download, Sparkles } from "lucide-react";
import { MagazineIssue } from "./DergilerContent";
import { Button } from "../ui/Button";
import { useLanguage } from "../../context/LanguageContext";

interface MagazineReaderModalProps {
  issue: MagazineIssue | null;
  onClose: () => void;
  onDownloadPDF?: (issue: MagazineIssue) => void;
}

export const MagazineReaderModal: React.FC<MagazineReaderModalProps> = ({
  issue,
  onClose,
  onDownloadPDF,
}) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [currentPage, setCurrentPage] = useState(1);


  // ESC key & Arrow keys listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNextPage();
      } else if (e.key === "ArrowLeft") {
        handlePrevPage();
      }
    };

    if (issue) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [issue, currentPage]);

  if (!issue) return null;

  const totalPages = issue.pages || 48;

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 2));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 2));
  };

  const modal = (
    <AnimatePresence>
      {issue && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-5 overflow-hidden select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-950/85 backdrop-blur-md z-0"
          />

          {/* Reader Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-5xl h-[92vh] max-h-[850px] flex flex-col justify-between bg-[#0F1115] text-white rounded-3xl overflow-hidden shadow-2xl border border-stone-800"
          >
            {/* Top Toolbar */}
            <div className="flex-none flex items-center justify-between p-3.5 px-6 bg-stone-900/90 border-b border-stone-800 z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#07452C] flex items-center justify-center text-white shrink-0">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-headings text-xs sm:text-base font-bold text-white leading-tight line-clamp-1">
                    {issue.issueNumber} - {issue.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-stone-400 font-sans">
                    Ne Yapsak? 3D Dijital Okuma Modu (Klavyeden Ok Yönleri & Dikey Kaydırma Destekli)
                  </p>
                </div>
              </div>

              {/* Close & Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {onDownloadPDF && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    leftIcon={<Download className="w-4 h-4" />}
                    onClick={() => onDownloadPDF(issue)}
                    className="rounded-xl border-stone-700 text-stone-300 hover:text-white hover:bg-stone-800 text-xs hidden sm:flex"
                  >
                    {isEn ? "Download PDF" : "PDF İndir"}
                  </Button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors flex items-center justify-center cursor-pointer"
                  aria-label={isEn ? "Close" : "Kapat"}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 3D BOOK FLIPBOOK STAGE WITH SCROLLABLE PAGES */}
            <div className="flex-1 min-h-0 flex items-center justify-center p-3 sm:p-6 relative overflow-hidden bg-gradient-to-b from-stone-900 to-stone-950 z-10">
              {/* Left & Right Page Flip Stage */}
              <div
                className="relative w-full max-w-4xl h-full flex rounded-2xl shadow-2xl overflow-hidden border border-stone-800 bg-[#FAF8F5]"
                style={{ perspective: "1500px" }}
              >
                {/* Book Spine Center Divider */}
                <div className="absolute left-1/2 top-0 bottom-0 w-4 -translate-x-1/2 bg-gradient-to-r from-black/25 via-black/10 to-black/25 z-30 pointer-events-none" />

                {/* LEFT PAGE (SCROLLABLE VERTICALLY WITH overflow-y-auto) */}
                <div className="w-1/2 h-full p-4 sm:p-6 flex flex-col justify-between border-r border-stone-200 text-stone-900 bg-[#FDFBF7] overflow-y-auto min-h-0 select-text scrollbar-thin">
                  {currentPage === 1 ? (
                    /* Cover on Page 1 */
                    <div className={`w-full min-h-[360px] rounded-xl bg-gradient-to-br ${issue.coverStyle.bgGradient} p-6 flex flex-col justify-between ${issue.coverStyle.textColor} shadow-inner my-auto`}>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 rounded bg-black/10">
                          NE YAPSAK?
                        </span>
                        <span className="text-xs font-black px-3 py-1 rounded-full bg-white text-stone-900 shadow-sm">
                          {issue.issueNumber}
                        </span>
                      </div>
                      <div className="space-y-2 my-auto">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
                          {issue.category}
                        </p>
                        <h2 className="font-headings text-xl sm:text-2xl font-extrabold leading-snug">
                          {issue.title}
                        </h2>
                      </div>
                      <div className="pt-2 border-t border-current/20 text-xs font-medium">
                        {issue.publishDate}
                      </div>
                    </div>
                  ) : (
                    /* Article Content Left Page */
                    <div className="space-y-4 text-stone-800">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#07452C]">
                          {isEn ? "Page" : "Sayfa"} {currentPage - 1}
                        </span>
                        <span className="text-[11px] text-stone-500">{issue.issueNumber}</span>
                      </div>
                      <h4 className="font-headings text-base sm:text-lg font-bold text-stone-900 leading-snug">
                        {issue.articles[(currentPage - 2) % issue.articles.length] || (isEn ? "Featured Topics" : "Öne Çıkan Başlıklar")}
                      </h4>
                      <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                        {issue.summary}
                      </p>
                      <div className="p-3.5 rounded-2xl bg-stone-100/90 border border-stone-200/90 text-xs text-stone-700 space-y-1">
                        <span className="font-bold text-[#07452C] block">{isEn ? "Editor Note & Analysis:" : "Editör Notu & Analiz:"}</span>
                        <p className="leading-relaxed font-sans">{issue.editorialNote}</p>
                      </div>
                      <div className="space-y-2 pt-2 border-t border-stone-200">
                        <span className="text-xs font-bold text-[#07452C]">{isEn ? "Contributing Authors:" : "Katkıda Bulunan Yazarlar:"}</span>
                        <p className="text-xs font-medium text-stone-600">{issue.contributors.join(", ")}</p>
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] font-bold text-stone-400 pt-4 self-start">
                    {isEn ? "Page " : "Sayfa "}{currentPage === 1 ? (isEn ? "Cover" : "Kapak") : currentPage - 1}
                  </span>
                </div>

                {/* RIGHT PAGE (SCROLLABLE VERTICALLY WITH overflow-y-auto) */}
                <div className="w-1/2 h-full p-4 sm:p-6 flex flex-col justify-between text-stone-900 bg-[#FAF8F5] overflow-y-auto min-h-0 select-text scrollbar-thin">
                  <div className="space-y-4 text-stone-800">
                    <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                      <span className="text-[11px] text-stone-500 font-semibold">{issue.category}</span>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#07452C]">
                        {isEn ? "Page" : "Sayfa"} {currentPage}
                      </span>
                    </div>
                    <h4 className="font-headings text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {issue.articles[currentPage % issue.articles.length] || (isEn ? "Association File" : "Dernek Dosyası")}
                    </h4>
                    <p className="font-sans text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                      {isEn
                        ? "Digital content, open-source culture files, and independent publications prepared by Ne Yapsak? youth association are thoroughly analyzed in this issue."
                        : "Ne Yapsak? gençlik derneğinin hazırladığı dijital içerikler, açık kaynak kültür dosyaları ve genç sanatçıların bağımsız yayın çalışmaları bu sayıda detaylı olarak incelenmektedir."}
                    </p>

                    <div className="p-3.5 rounded-2xl bg-white border border-stone-200/80 space-y-2 text-xs">
                      <span className="font-bold text-[#07452C] block">{isEn ? "Table of Contents Guide:" : "Dergi İçindekiler Rehberi:"}</span>
                      <ul className="space-y-1 text-stone-600 font-medium">
                        {issue.articles.map((art, idx) => (
                          <li key={idx} className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#07452C]" />
                            <span>{art}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-2 border-t border-stone-200 text-xs font-medium text-stone-500">
                      {isEn ? "Publish Date: " : "Yayın Tarihi: "}{issue.publishDate} ({issue.period}) • {issue.pages} {isEn ? "Pages" : "Sayfa"}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-stone-400 pt-4 self-end">
                    {isEn ? "Page " : "Sayfa "}{currentPage}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Page Navigation Controls */}
            <div className="flex-none flex items-center justify-between p-3.5 px-6 bg-stone-900/90 border-t border-stone-800 z-20">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>{isEn ? "Previous Pages" : "Önceki Sayfalar"}</span>
              </button>

              <div className="flex items-center gap-2 text-xs font-bold text-stone-400">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>
                  {isEn ? "Page " : "Sayfa "}{currentPage} - {Math.min(totalPages, currentPage + 1)} / {totalPages}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                <span>{isEn ? "Next Pages" : "Sonraki Sayfalar"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modal, document.body) : null;
};
