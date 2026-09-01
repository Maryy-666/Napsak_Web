"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Sparkles, ArrowRight, Newspaper } from "lucide-react";
import { FaaliyetItem } from "./types";
import { NEWS_DATA } from "../../data/news";
import { useLanguage } from "../../context/LanguageContext";

interface ActivityDetailModalProps {
  item: FaaliyetItem | null;
  onClose: () => void;
}

function getNewsUrlForFaaliyet(item: FaaliyetItem | null): string {
  if (!item) return "/haberler";
  const directMatch = NEWS_DATA.find(
    (n) => n.id === item.id || n.slug === item.id
  );
  if (directMatch) return `/haberler/${directMatch.slug}`;

  const titleLower = (item.title || "").toLowerCase();
  const matchByTitle = NEWS_DATA.find((n) => {
    const nTitleLower = n.title.toLowerCase();
    return (
      titleLower.includes(nTitleLower.slice(0, 6)) ||
      nTitleLower.includes(titleLower.slice(0, 6))
    );
  });

  if (matchByTitle) return `/haberler/${matchByTitle.slug}`;
  return "/haberler";
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  item,
  onClose,
}) => {
  const { language } = useLanguage();
  const isEn = language === "en";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (item) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const newsUrl = getNewsUrlForFaaliyet(item);

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
          {/* Ambient Modal Backdrop Click Handler */}
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={onClose}
            aria-label={isEn ? "Close dialog" : "Pencereyi kapat"}
          />

          {/* Expanded Polaroid Detail Modal Box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#FDFBF7] rounded-3xl p-5 sm:p-6 shadow-2xl border border-stone-200 text-stone-900 flex flex-col justify-between"
          >
            {/* Top Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-stone-200 text-stone-600 transition-colors shadow-sm cursor-pointer"
              aria-label={isEn ? "Close" : "Kapat"}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Photo Section */}
            <div className="relative w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-md mb-4">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#E0F2EC]/40">
                  <Sparkles className="w-10 h-10 text-[#2A9D8F]/60" />
                </div>
              )}
              {/* Soft Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Modal Body & Standard Site Font Memory Caption */}
            <div className="space-y-3 select-text">
              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-bold font-headings text-stone-900 leading-snug">
                {item.title}
              </h2>

              {/* Date & Quick Location Badges */}
              <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-stone-600">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs font-sans">
                  <Calendar className="w-3.5 h-3.5 text-[#07452C]" />
                  <span>{item.date}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-full border border-stone-200/80 shadow-2xs font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#2A9D8F]" />
                  <span>{isEn ? "N'apsak? Community Workshop" : "N'apsak? Topluluk Atölyesi"}</span>
                </div>
              </div>

              {/* Concise Standard Site Font Memory Story */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-stone-200/70 shadow-2xs">
                <p className="font-sans text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  {item.memoryCaption || item.description}
                </p>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="mt-5 pt-3.5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs font-medium text-stone-500 font-sans flex items-center gap-1.5">
                📸 <span>{isEn ? "N'apsak? Memory Board Entry" : "N'apsak? Anı Panosu Kaydı"}</span>
              </span>

              <div className="flex items-center gap-2.5">
                <Link
                  href={newsUrl}
                  onClick={onClose}
                  className="bg-[#07452C] hover:bg-[#0A5C3A] text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm font-sans inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Newspaper className="w-3.5 h-3.5" />
                  <span>{isEn ? "View Related News" : "İlgili Habere Git"}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </Link>

                <button
                  type="button"
                  onClick={onClose}
                  className="bg-stone-200/80 hover:bg-stone-300/80 text-stone-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all font-sans cursor-pointer"
                >
                  {isEn ? "Close" : "Kapat"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
