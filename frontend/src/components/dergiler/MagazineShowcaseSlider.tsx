"use client";

import React, { useState, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight, Eye, ArrowRight, BookOpen } from "lucide-react";
import { MagazineIssue } from "./DergilerContent";
import { Button } from "../ui/Button";

import { useLanguage } from "../../context/LanguageContext";

interface MagazineShowcaseSliderProps {
  magazines: MagazineIssue[];
  onSelectIssue: (issue: MagazineIssue) => void;
  onOpenReader?: (issue: MagazineIssue) => void;
}

export const MagazineShowcaseSlider: React.FC<MagazineShowcaseSliderProps> = ({
  magazines,
  onSelectIssue,
}) => {
  const { language } = useLanguage();
  const isEn = language === "en";
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [magazines]);

  if (!magazines || magazines.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#DDE7E1] bg-white p-12 text-center my-6">
        <BookOpen className="mx-auto h-10 w-10 text-[#5F6773] opacity-40 mb-3" />
        <p className="text-sm font-semibold text-[#5F6773]">
          {isEn ? "No magazines found matching your filter." : "Filtrenize uygun dergi bulunamadı."}
        </p>
      </div>
    );
  }


  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % magazines.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + magazines.length) % magazines.length);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.x < -40) {
      handleNext();
    } else if (info.offset.x > 40) {
      handlePrev();
    }
  };

  const currentMagazine = magazines[activeIndex] || magazines[0];

  return (
    <div className="w-full flex flex-col items-center select-none py-4 relative">
      {/* NAVIGATION ARROW BUTTONS (HIGH VISIBILITY FLOATING EDGE CONTROLS) */}
      <div className="absolute inset-y-0 left-1 sm:left-4 z-50 flex items-center pointer-events-none">
        <button
          type="button"
          onClick={handlePrev}
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-stone-200 bg-white text-stone-800 hover:bg-[#07452C] hover:text-white hover:border-[#07452C] transition-all duration-300 flex items-center justify-center shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="Önceki Dergi"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-1 sm:right-4 z-50 flex items-center pointer-events-none">
        <button
          type="button"
          onClick={handleNext}
          className="pointer-events-auto w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-stone-200 bg-white text-stone-800 hover:bg-[#07452C] hover:text-white hover:border-[#07452C] transition-all duration-300 flex items-center justify-center shadow-xl backdrop-blur-md cursor-pointer"
          aria-label="Sonraki Dergi"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>
      </div>

      {/* HORIZONTAL SHOWCASE STAGE */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        className="relative w-full max-w-5xl h-[450px] sm:h-[500px] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {magazines.map((mag, idx) => {
            // Calculate relative offset from active index
            let offset = idx - activeIndex;

            // Circular wrap for smooth continuous offset calculation
            const halfLength = Math.floor(magazines.length / 2);
            if (offset > halfLength) offset -= magazines.length;
            if (offset < -halfLength) offset += magazines.length;

            const isActive = offset === 0;

            // Only render visible items around active item (-2 to +2)
            if (Math.abs(offset) > 2) return null;

            // Clear visual separation positioning:
            // Active center card pops forward prominently, side cards recede and displace further out!
            let translateX = "0%";
            let scale = 1;
            let opacity = 1;
            let zIndex = 50;

            if (offset === 0) {
              translateX = "0%";
              scale = 1.06;
              opacity = 1.0;
              zIndex = 50;
            } else if (offset === 1) {
              translateX = "108%";
              scale = 0.78;
              opacity = 0.45;
              zIndex = 20;
            } else if (offset === -1) {
              translateX = "-108%";
              scale = 0.78;
              opacity = 0.45;
              zIndex = 20;
            } else if (offset === 2) {
              translateX = "210%";
              scale = 0.65;
              opacity = 0.15;
              zIndex = 10;
            } else if (offset === -2) {
              translateX = "-210%";
              scale = 0.65;
              opacity = 0.15;
              zIndex = 10;
            }

            return (
              <motion.div
                key={mag.id}
                initial={false}
                animate={{
                  x: translateX,
                  scale,
                  opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 280,
                  damping: 28,
                  mass: 0.85,
                }}
                onClick={() => {
                  if (isActive) {
                    onSelectIssue(mag);
                  } else {
                    setActiveIndex(idx);
                  }
                }}
                style={{ zIndex }}
                className={`absolute w-[270px] sm:w-[310px] h-[400px] sm:h-[440px] rounded-2xl bg-white p-3 flex flex-col justify-between cursor-pointer transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "border-2 border-[#07452C] ring-4 ring-[#07452C]/15 shadow-[0_30px_60px_-15px_rgba(7,69,44,0.35)]"
                    : "border border-stone-300/60 shadow-sm hover:border-[#07452C]/40"
                }`}
              >
                {/* Side Card Receding Wash Overlay */}
                {!isActive && (
                  <div className="absolute inset-0 bg-[#FAF8F5]/40 backdrop-blur-[1px] z-30 pointer-events-none transition-opacity" />
                )}

                {/* 1. MAGAZINE COVER PRINT WINDOW */}
                <div
                  className={`relative w-full h-[260px] sm:h-[295px] rounded-xl overflow-hidden bg-gradient-to-br ${mag.coverStyle.bgGradient} p-4 flex flex-col justify-between ${mag.coverStyle.textColor} shadow-md border-l-[6px] border-l-black/30 border-r-2 border-r-[#F4F1EA]`}
                >
                  {/* Spine Crease Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black/25 pointer-events-none" />

                  {/* Header Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span
                      className={`text-[8.5px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded backdrop-blur-md ${
                        mag.coverStyle.isLightCover
                          ? "bg-black/10 text-slate-900 border border-black/10"
                          : "bg-white/15 text-white border border-white/20"
                      }`}
                    >
                      NE YAPSAK?
                    </span>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs ${mag.coverStyle.badgeBg} ${mag.coverStyle.badgeText}`}
                    >
                      {mag.issueNumber}
                    </span>
                  </div>

                  {/* Magazine Cover Title & Category */}
                  <div className="relative z-10 space-y-1 my-auto">
                    <p
                      className={`text-[9.5px] font-bold uppercase tracking-wider ${mag.coverStyle.subtitleColor}`}
                    >
                      {mag.category}
                    </p>
                    <h3 className="font-headings text-sm sm:text-base font-extrabold leading-snug line-clamp-3">
                      {mag.title}
                    </h3>
                  </div>

                  {/* Cover Footer Date */}
                  <div className="relative z-10 pt-1.5 border-t border-current/20 flex items-center justify-between text-[10px] font-semibold opacity-90 font-sans">
                    <span>{mag.period}</span>
                    <span>{mag.publishDate}</span>
                  </div>
                </div>

                {/* 2. BOTTOM DETAILS AREA (Standard Site Fonts) */}
                <div className="pt-2 px-1 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-stone-500 font-semibold mb-0.5 font-sans">
                      <span className="text-[#07452C] font-bold">{mag.issueNumber}</span>
                      <span>{mag.pages} {isEn ? "Pages" : "Sayfa"}</span>
                    </div>
                    <h4 className="font-headings text-xs font-bold text-stone-900 line-clamp-1 group-hover:text-[#07452C]">
                      {mag.title}
                    </h4>
                  </div>

                  {/* CTA Action Button */}
                  <div className="pt-1.5 flex items-center justify-between border-t border-stone-100 mt-1 font-sans">
                    <span className="text-[10px] text-stone-500 font-medium">
                      {mag.fileSize}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isActive) {
                          onSelectIssue(mag);
                        } else {
                          setActiveIndex(idx);
                        }
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-[#07452C] hover:text-[#0A5C3A] transition-colors"
                    >
                      <span>{isActive ? (isEn ? "Preview" : "İncele") : (isEn ? "Select" : "Seç")}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ACTIVE MAGAZINE DETAILS BAR & POSITION INDICATOR */}
      <div className="mt-2 flex flex-col items-center gap-3">
        {/* Position Indicator Badge e.g. 03 / 05 */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold font-mono text-stone-600 bg-white/90 px-3.5 py-1 rounded-full border border-stone-200 shadow-2xs">
            {String(activeIndex + 1).padStart(2, "0")} / {String(magazines.length).padStart(2, "0")}
          </span>

          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5">
            {magazines.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Dergi ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-6 bg-[#07452C]"
                    : "w-2 bg-stone-300 hover:bg-stone-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quick Read Button for Active Center Magazine */}
        {currentMagazine && (
          <div className="flex items-center gap-3 pt-1">
            <Button
              type="button"
              variant="primary"
              size="sm"
              leftIcon={<Eye className="h-4 w-4" />}
              onClick={() => onSelectIssue(currentMagazine)}
              className="rounded-xl shadow-md !bg-[#07452C] hover:!bg-[#0A5C3A] text-white font-bold text-xs px-5 h-10"
            >
              {currentMagazine.issueNumber} - {isEn ? "Preview & Read Magazine" : "Dergiyi İncele & Oku"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
