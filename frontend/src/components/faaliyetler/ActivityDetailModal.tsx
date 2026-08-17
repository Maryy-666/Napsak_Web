"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, MapPin, Sparkles } from "lucide-react";
import { FaaliyetItem } from "./types";

interface ActivityDetailModalProps {
  item: FaaliyetItem | null;
  onClose: () => void;
}

export const ActivityDetailModal: React.FC<ActivityDetailModalProps> = ({
  item,
  onClose,
}) => {
  // ESC Key handler to close modal
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

  return (
    <AnimatePresence>
      {item && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop Blur Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-md"
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
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-stone-200 text-stone-600 transition-colors shadow-sm"
              aria-label="Kapat"
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
                  <span>N'apsak? Topluluk Atölyesi</span>
                </div>
              </div>

              {/* Concise Standard Site Font Memory Story */}
              <div className="p-3.5 rounded-2xl bg-white/90 border border-stone-200/70 shadow-2xs">
                <p className="font-sans text-sm sm:text-base text-stone-700 leading-relaxed font-normal">
                  {item.memoryCaption || item.description}
                </p>
              </div>
            </div>

            {/* Modal Footer Action */}
            <div className="mt-5 pt-3 border-t border-stone-200 flex items-center justify-between">
              <span className="text-xs font-medium text-stone-500 font-sans">
                📸 N'apsak? Anı Panosu Kaydı
              </span>
              <button
                type="button"
                onClick={onClose}
                className="bg-[#07452C] hover:bg-[#0A5C3A] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm font-sans"
              >
                Kapat
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
