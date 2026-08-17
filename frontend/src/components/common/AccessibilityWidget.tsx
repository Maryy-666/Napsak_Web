"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCcw,
  Type,
  Sun,
  BookOpen,
  Space,
  AlignJustify,
  ZapOff,
  Link,
  Focus,
} from "lucide-react";

export type AccessibilitySettings = {
  fontScale: "sm" | "normal" | "lg";
  highContrast: boolean;
  readableMode: boolean;
  textSpacing: "normal" | "wide";
  lineHeight: "normal" | "wide";
  reduceMotion: boolean;
  highlightLinks: boolean;
  enhancedFocus: boolean;
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontScale: "normal",
  highContrast: false,
  readableMode: false,
  textSpacing: "normal",
  lineHeight: "normal",
  reduceMotion: false,
  highlightLinks: false,
  enhancedFocus: false,
};

const STORAGE_KEY = "napsak_accessibility_settings";

// Universal Human Accessibility Figure Icon (ISO / W3C Standard)
const AccessibilityHumanIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="5.3" r="1.9" fill="currentColor" stroke="none" />
    <path d="M5.7 9.4h12.6" />
    <path d="M12 9.4v5.1" />
    <path d="m8.7 20 3.3-5.5 3.3 5.5" />
  </svg>
);

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Load saved settings from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Could not load accessibility settings from localStorage:", e);
    }
  }, []);

  // Synchronize CSS class modifiers on <html> root element
  useEffect(() => {
    const root = document.documentElement;

    // Font Scale
    root.classList.remove("access-font-sm", "access-font-lg");
    if (settings.fontScale === "sm") root.classList.add("access-font-sm");
    if (settings.fontScale === "lg") root.classList.add("access-font-lg");

    // High Contrast
    root.classList.toggle("access-high-contrast", settings.highContrast);

    // Readable Mode
    root.classList.toggle("access-readable-mode", settings.readableMode);

    // Text Spacing
    root.classList.toggle("access-wide-spacing", settings.textSpacing === "wide");

    // Line Height
    root.classList.toggle("access-wide-line-height", settings.lineHeight === "wide");

    // Reduce Motion
    root.classList.toggle("access-reduce-motion", settings.reduceMotion);

    // Highlight Links
    root.classList.toggle("access-highlight-links", settings.highlightLinks);

    // Enhanced Focus
    root.classList.toggle("access-enhanced-focus", settings.enhancedFocus);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save accessibility settings to localStorage:", e);
    }
  }, [settings]);

  // Handle ESC key listener to close drawer & return focus to trigger button
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  };

  return (
    <>
      {/* FLOATING ACCESSIBILITY TRIGGER BUTTON (Fixed at Bottom Right) */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Erişilebilirlik Ayarları Paneli"
        aria-expanded={isOpen}
        aria-controls="accessibility-drawer"
        className="fixed bottom-6 right-6 z-[90] w-[54px] h-[54px] rounded-full bg-[#07452C] hover:bg-[#0A5C3A] text-white flex items-center justify-center shadow-xl border-2 border-white/20 transition-all duration-300 ring-4 ring-[#07452C]/20 hover:ring-[#07452C]/40 hover:scale-105 active:scale-95 cursor-pointer"
      >
        <span className="sr-only">Erişilebilirlik Paneli</span>
        <AccessibilityHumanIcon className="w-6 h-6 text-white" />
      </button>

      {/* DRAWER / PANEL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[400] flex items-end sm:items-stretch justify-end overflow-hidden select-none">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className="absolute inset-0 bg-[#0F1115]/50 backdrop-blur-xs z-0"
            />

            {/* Right Side Drawer / Mobile Bottom Sheet */}
            <motion.div
              ref={drawerRef}
              id="accessibility-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-drawer-title"
              initial={{ x: settings.reduceMotion ? 0 : "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: settings.reduceMotion ? 0 : "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 w-full max-w-[410px] h-[85vh] sm:h-full bg-white shadow-2xl rounded-t-3xl sm:rounded-t-none sm:rounded-l-3xl border-t sm:border-t-0 sm:border-l border-stone-200/80 flex flex-col justify-between overflow-hidden"
            >
              {/* Header */}
              <div className="flex-none flex items-start justify-between p-5 px-6 bg-[#FAF8F5] border-b border-stone-200/70">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#07452C] uppercase tracking-wider mb-0.5">
                    <AccessibilityHumanIcon className="w-4 h-4" />
                    <span>Erişilebilirlik</span>
                  </div>
                  <h2
                    id="accessibility-drawer-title"
                    className="font-headings text-lg font-extrabold text-[#0F1115]"
                  >
                    Erişilebilirlik Paneli
                  </h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5 leading-snug">
                    Görünümü ve okuma deneyimini ihtiyaçlarına göre ayarla.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    triggerRef.current?.focus();
                  }}
                  aria-label="Paneli Kapat"
                  className="rounded-full p-2 text-stone-500 hover:bg-stone-200/60 hover:text-stone-900 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Settings Rows List */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 px-6 space-y-4 divide-y divide-stone-100">
                {/* 1. METİN BOYUTU STEPPER */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <Type className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Metin Boyutu</span>
                      <span className="text-[11px] text-stone-500 font-sans">
                        {settings.fontScale === "sm" ? "Küçük" : settings.fontScale === "lg" ? "Büyük" : "Varsayılan"}
                      </span>
                    </div>
                  </div>

                  {/* Stepper Controls */}
                  <div className="flex items-center gap-1 bg-[#F8FAFC] border border-stone-200/80 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateSetting("fontScale", "sm")}
                      aria-label="Metni Küçült"
                      className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                        settings.fontScale === "sm"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      A-
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("fontScale", "normal")}
                      aria-label="Varsayılan Metin Boyutu"
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.fontScale === "normal"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      100%
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("fontScale", "lg")}
                      aria-label="Metni Büyüt"
                      className={`px-2.5 py-1 text-xs font-extrabold rounded-lg transition-colors cursor-pointer ${
                        settings.fontScale === "lg"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      A+
                    </button>
                  </div>
                </div>

                {/* 2. YÜKSEK KONTRAST TOGGLE */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <Sun className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Yüksek Kontrast</span>
                      <span className="text-[11px] text-stone-500 font-sans">Metin netliğini artırır</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.highContrast}
                    onClick={() => updateSetting("highContrast", !settings.highContrast)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      settings.highContrast ? "bg-[#07452C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        settings.highContrast ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 3. OKUNABİLİR MOD TOGGLE */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Okunabilir Mod</span>
                      <span className="text-[11px] text-stone-500 font-sans">Sade standart fonta geçer</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.readableMode}
                    onClick={() => updateSetting("readableMode", !settings.readableMode)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      settings.readableMode ? "bg-[#07452C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        settings.readableMode ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 4. METİN ARALIĞI SEGMENTED */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <Space className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Metin Aralığı</span>
                      <span className="text-[11px] text-stone-500 font-sans">Harf & kelime mesafesi</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F8FAFC] border border-stone-200/80 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateSetting("textSpacing", "normal")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.textSpacing === "normal"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("textSpacing", "wide")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.textSpacing === "wide"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      Geniş
                    </button>
                  </div>
                </div>

                {/* 5. SATIR ARALIĞI SEGMENTED */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <AlignJustify className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Satır Aralığı</span>
                      <span className="text-[11px] text-stone-500 font-sans">Dikey okuma yüksekliği</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-[#F8FAFC] border border-stone-200/80 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateSetting("lineHeight", "normal")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.lineHeight === "normal"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("lineHeight", "wide")}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                        settings.lineHeight === "wide"
                          ? "bg-[#07452C] text-white shadow-2xs"
                          : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      Geniş
                    </button>
                  </div>
                </div>

                {/* 6. ANİMASYONLARI AZALT TOGGLE */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <ZapOff className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Animasyonları Azalt</span>
                      <span className="text-[11px] text-stone-500 font-sans">Hareketli efektleri durdurur</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.reduceMotion}
                    onClick={() => updateSetting("reduceMotion", !settings.reduceMotion)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      settings.reduceMotion ? "bg-[#07452C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        settings.reduceMotion ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 7. LINKLERI BELIRGINLESTIR TOGGLE */}
                <div className="pt-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <Link className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Linkleri Belirginleştir</span>
                      <span className="text-[11px] text-stone-500 font-sans">Altını çizer ve belirginleştirir</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.highlightLinks}
                    onClick={() => updateSetting("highlightLinks", !settings.highlightLinks)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      settings.highlightLinks ? "bg-[#07452C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        settings.highlightLinks ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                {/* 8. KLAVYE ODAĞINI GÜÇLENDİR TOGGLE */}
                <div className="pt-3.5 flex items-center justify-between gap-3 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                      <Focus className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">Klavye Odağını Güçlendir</span>
                      <span className="text-[11px] text-stone-500 font-sans">Odak halkalarını daha net yapar</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={settings.enhancedFocus}
                    onClick={() => updateSetting("enhancedFocus", !settings.enhancedFocus)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
                      settings.enhancedFocus ? "bg-[#07452C]" : "bg-stone-300"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
                        settings.enhancedFocus ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Footer Reset Action */}
              <div className="flex-none p-4 px-6 bg-[#FAF8F5] border-t border-stone-200/70 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#07452C] transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Varsayılana Dön</span>
                </button>

                <span className="text-[10px] font-semibold text-stone-400 font-sans">
                  N'apsak? A11y System v1.0
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
