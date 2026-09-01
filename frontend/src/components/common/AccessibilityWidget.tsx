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
  Link as LinkIcon,
  Focus,
  EyeOff,
  Layout,
  MoveHorizontal,
  Crosshair,
  HelpCircle,
  VolumeX,
  Keyboard,
  MousePointer,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Maximize2,
  SlidersHorizontal,
  ShieldCheck,
  ZoomIn,
  Sparkles,
  Compass,
  Layers,
} from "lucide-react";

import { useLanguage } from "../../context/LanguageContext";

export type AccessibilityProfile = "none" | "dyslexia" | "vision" | "adhd" | "motor";


export type AccessibilitySettings = {
  widgetPosition: "right" | "left";
  profile: AccessibilityProfile;
  fontScale: "sm" | "normal" | "lg";
  bigUI: boolean;
  highContrast: boolean;
  saturation: "normal" | "high" | "low" | "monochrome";
  readableMode: boolean;
  textSpacing: "normal" | "wide";
  lineHeight: "normal" | "wide";
  textAlign: "default" | "left" | "center" | "right" | "justify";
  reduceMotion: boolean;
  highlightLinks: boolean;
  enhancedFocus: boolean;
  readingFocus: boolean;
  accessibleTooltips: boolean;
  pageStructure: boolean;
  hideImages: boolean;
  virtualKeyboard: boolean;
  muteMedia: boolean;
  customCursor: "default" | "big-black" | "big-white";
};

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  widgetPosition: "right",
  profile: "none",
  fontScale: "normal",
  bigUI: false,
  highContrast: false,
  saturation: "normal",
  readableMode: false,
  textSpacing: "normal",
  lineHeight: "normal",
  textAlign: "default",
  reduceMotion: false,
  highlightLinks: false,
  enhancedFocus: false,
  readingFocus: false,
  accessibleTooltips: false,
  pageStructure: false,
  hideImages: false,
  virtualKeyboard: false,
  muteMedia: false,
  customCursor: "default",
};

const STORAGE_KEY = "napsak_accessibility_settings";

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
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "profiles" | "display" | "reading" | "tools">("all");

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");

  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [isMounted, setIsMounted] = useState(false);
  const [readingFocusY, setReadingFocusY] = useState<number | null>(null);

  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Load saved settings
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      }
    } catch (e) {
      console.warn("Could not load accessibility settings from localStorage:", e);
    }
  }, []);

  // Synchronize CSS class modifiers on <html> root element & save to localStorage
  useEffect(() => {
    if (!isMounted) return;

    const root = document.documentElement;

    root.classList.remove("access-font-sm", "access-font-lg");
    if (settings.fontScale === "sm") root.classList.add("access-font-sm");
    if (settings.fontScale === "lg") root.classList.add("access-font-lg");

    root.classList.toggle("access-big-ui", settings.bigUI);
    root.classList.toggle("access-high-contrast", settings.highContrast);

    root.classList.remove("access-sat-high", "access-sat-low", "access-sat-mono");
    if (settings.saturation === "high") root.classList.add("access-sat-high");
    if (settings.saturation === "low") root.classList.add("access-sat-low");
    if (settings.saturation === "monochrome") root.classList.add("access-sat-mono");

    root.classList.toggle("access-readable-mode", settings.readableMode);
    root.classList.toggle("access-wide-spacing", settings.textSpacing === "wide");
    root.classList.toggle("access-wide-line-height", settings.lineHeight === "wide");

    root.classList.remove("access-text-left", "access-text-center", "access-text-right", "access-text-justify");
    if (settings.textAlign === "left") root.classList.add("access-text-left");
    if (settings.textAlign === "center") root.classList.add("access-text-center");
    if (settings.textAlign === "right") root.classList.add("access-text-right");
    if (settings.textAlign === "justify") root.classList.add("access-text-justify");

    root.classList.toggle("access-reduce-motion", settings.reduceMotion);
    root.classList.toggle("access-highlight-links", settings.highlightLinks);
    root.classList.toggle("access-enhanced-focus", settings.enhancedFocus);
    root.classList.toggle("access-show-tooltips", settings.accessibleTooltips);
    root.classList.toggle("access-page-structure", settings.pageStructure);
    root.classList.toggle("access-hide-images", settings.hideImages);

    root.classList.remove("access-cursor-big-black", "access-cursor-big-white");
    if (settings.customCursor === "big-black") root.classList.add("access-cursor-big-black");
    if (settings.customCursor === "big-white") root.classList.add("access-cursor-big-white");

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn("Could not save accessibility settings to localStorage:", e);
    }
  }, [settings, isMounted]);

  // Media Mute Handler
  useEffect(() => {
    if (!isMounted) return;
    const mediaElements = document.querySelectorAll<HTMLMediaElement>("audio, video");
    mediaElements.forEach((el) => {
      el.muted = settings.muteMedia;
    });
  }, [settings.muteMedia, isMounted]);

  // Reading Focus Tracker
  useEffect(() => {
    if (!settings.readingFocus) {
      setReadingFocusY(null);
      return;
    }

    if (readingFocusY === null && typeof window !== "undefined") {
      setReadingFocusY(window.innerHeight / 2);
    }

    const handleMouseMove = (e: MouseEvent) => {
      setReadingFocusY(e.clientY);
    };

    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && target.getBoundingClientRect) {
        const rect = target.getBoundingClientRect();
        if (rect.height > 0) {
          setReadingFocusY(rect.top + rect.height / 2);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("focusin", handleFocusIn);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("focusin", handleFocusIn);
    };
  }, [settings.readingFocus, readingFocusY]);

  // Focus Trap inside Drawer & ESC Key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }

      if (e.key === "Tab" && drawerRef.current) {
        const focusables = drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;

        const firstElement = focusables[0];
        const lastElement = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const applyProfile = (profile: AccessibilityProfile) => {
    if (profile === "none") {
      setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
      return;
    }

    if (profile === "dyslexia") {
      setSettings((prev) => ({
        ...prev,
        profile: "dyslexia",
        readableMode: true,
        textSpacing: "wide",
        lineHeight: "wide",
      }));
    } else if (profile === "vision") {
      setSettings((prev) => ({
        ...prev,
        profile: "vision",
        highContrast: true,
        fontScale: "lg",
        enhancedFocus: true,
        highlightLinks: true,
      }));
    } else if (profile === "adhd") {
      setSettings((prev) => ({
        ...prev,
        profile: "adhd",
        readingFocus: true,
        reduceMotion: true,
      }));
    } else if (profile === "motor") {
      setSettings((prev) => ({
        ...prev,
        profile: "motor",
        bigUI: true,
        enhancedFocus: true,
        virtualKeyboard: true,
      }));
    }
  };

  const handleReset = () => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn("Could not clear accessibility settings in localStorage:", e);
    }
  };

  const handleSkipNavigation = () => {
    const mainTarget = document.querySelector("main") || document.getElementById("main-content");
    if (mainTarget) {
      if (!mainTarget.hasAttribute("tabIndex")) {
        mainTarget.setAttribute("tabIndex", "-1");
      }
      mainTarget.focus({ preventScroll: false });
      mainTarget.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* READING FOCUS OVERLAY */}
      {settings.readingFocus && readingFocusY !== null && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-[350] pointer-events-none transition-opacity duration-300"
        >
          <div
            className="absolute top-0 left-0 right-0 bg-black/45 backdrop-blur-[1px] transition-all duration-75"
            style={{ height: Math.max(0, readingFocusY - 45) }}
          />
          <div
            className="absolute left-0 right-0 border-y-2 border-[#07452C] bg-[#07452C]/10 shadow-[0_0_25px_rgba(7,69,44,0.35)] transition-all duration-75"
            style={{
              top: Math.max(0, readingFocusY - 45),
              height: 90,
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-black/45 backdrop-blur-[1px] transition-all duration-75"
            style={{
              top: Math.max(0, readingFocusY + 45),
            }}
          />
        </div>
      )}

      {/* VIRTUAL KEYBOARD WIDGET */}
      {settings.virtualKeyboard && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[999995] bg-[#0F1115] text-white p-3.5 sm:p-5 rounded-3xl shadow-2xl border border-stone-700/80 max-w-lg w-[94vw] font-sans">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="text-xs font-bold text-[#EEF7F3] flex items-center gap-1.5 font-headings">
              <Keyboard className="w-4 h-4 text-[#0A5C3A]" />
              N'apsak? Sanal Klavye
            </span>
            <button
              type="button"
              onClick={() => updateSetting("virtualKeyboard", false)}
              className="text-stone-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-10 gap-1 text-center font-bold text-xs">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((key) => (
              <button key={key} type="button" className="bg-stone-800 hover:bg-[#07452C] py-2 rounded-xl transition-colors">
                {key}
              </button>
            ))}
            {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map((key) => (
              <button key={key} type="button" className="bg-stone-800 hover:bg-[#07452C] py-2 rounded-xl transition-colors">
                {key}
              </button>
            ))}
            {["A", "S", "D", "F", "G", "H", "J", "K", "L", "İ"].map((key) => (
              <button key={key} type="button" className="bg-stone-800 hover:bg-[#07452C] py-2 rounded-xl transition-colors">
                {key}
              </button>
            ))}
            {["Z", "X", "C", "V", "B", "N", "M", "Ö", "Ç", "⌫"].map((key) => (
              <button key={key} type="button" className="bg-stone-800 hover:bg-[#07452C] py-2 rounded-xl transition-colors">
                {key}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* N'APSAK FLOATING ACCESSIBILITY TRIGGER BUTTON */}
      <button
        ref={triggerRef}
        id="accessibility-trigger"
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Erişilebilirlik Ayarları Paneli"
        aria-expanded={isOpen}
        aria-controls="accessibility-drawer"
        data-a11y-tooltip="Erişilebilirlik Paneli"
        className={`fixed bottom-6 z-[999990] w-[56px] h-[56px] rounded-full bg-gradient-to-br from-[#07452C] to-[#0A5C3A] hover:from-[#0A5C3A] hover:to-[#0C7349] text-white flex items-center justify-center shadow-[0_12px_32px_rgba(7,69,44,0.35)] border-2 border-white/30 transition-all duration-300 ring-4 ring-[#07452C]/20 hover:ring-[#07452C]/40 hover:scale-105 active:scale-95 cursor-pointer ${
          settings.widgetPosition === "left" ? "left-6" : "right-6"
        }`}
      >
        <span className="sr-only">Erişilebilirlik Paneli</span>
        <AccessibilityHumanIcon className="w-6 h-6 text-white access-widget-icon drop-shadow-xs" />
      </button>

      {/* DRAWER / PANEL MODAL */}
      <AnimatePresence>
        {isOpen && (
          <div
            className={`fixed inset-0 z-[999999] flex items-end sm:items-stretch overflow-hidden select-none ${
              settings.widgetPosition === "left" ? "justify-start" : "justify-end"
            }`}
          >
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              className="absolute inset-0 bg-[#0F1115]/55 backdrop-blur-xs z-0"
            />

            {/* Side Drawer / Panel */}
            <motion.div
              ref={drawerRef}
              id="accessibility-drawer"
              role="dialog"
              aria-modal="true"
              aria-labelledby="accessibility-drawer-title"
              initial={{
                x: settings.reduceMotion
                  ? 0
                  : settings.widgetPosition === "left"
                  ? "-100%"
                  : "100%",
                opacity: 0,
              }}
              animate={{ x: 0, opacity: 1 }}
              exit={{
                x: settings.reduceMotion
                  ? 0
                  : settings.widgetPosition === "left"
                  ? "-100%"
                  : "100%",
                opacity: 0,
              }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className={`relative z-10 w-full max-w-[450px] h-[92vh] sm:h-full bg-white shadow-2xl rounded-t-3xl sm:rounded-t-none border-t sm:border-t-0 border-stone-200/90 flex flex-col justify-between overflow-hidden ${
                settings.widgetPosition === "left"
                  ? "sm:rounded-r-3xl sm:border-r"
                  : "sm:rounded-l-3xl sm:border-l"
              }`}
            >
              {/* N'APSAK BRANDED HEADER BANNER */}
              <div className="flex-none bg-gradient-to-br from-[#07452C] via-[#0A5C3A] to-[#0D7047] text-white p-5 px-6 relative overflow-hidden shadow-md">
                {/* Decorative background circles */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-48 h-48 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />

                <div className="relative z-10 flex items-start justify-between">
                  <div>
                    <h2
                      id="accessibility-drawer-title"
                      className="font-headings text-xl font-extrabold tracking-tight text-white"
                    >
                      {isEn ? "Accessibility Desk" : "Erişilebilirlik Masası"}
                    </h2>
                    <p className="text-xs text-white/85 font-sans mt-0.5 leading-snug">
                      {isEn
                        ? "Customize your reading and accessibility experience across the site."
                        : "Sitedeki tüm okuma ve erişim ayarlarınızı özelleştirin."}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      triggerRef.current?.focus();
                    }}
                    aria-label={isEn ? "Close Panel" : "Paneli Kapat"}
                    data-a11y-tooltip={isEn ? "Close Panel" : "Paneli Kapat"}
                    className="rounded-full p-2 bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* CATEGORY TABS SWITCHER */}
                <div className="relative z-10 flex items-center gap-1 mt-4 overflow-x-auto pb-0.5 no-scrollbar text-xs font-bold">
                  {[
                    { id: "all", label: isEn ? "All" : "Tümü", icon: Layers },
                    { id: "profiles", label: isEn ? "Profiles" : "Profiller", icon: SlidersHorizontal },
                    { id: "display", label: isEn ? "Display" : "Görünüm", icon: Palette },
                    { id: "reading", label: isEn ? "Reading" : "Okuma", icon: BookOpen },
                    { id: "tools", label: isEn ? "Tools" : "Araçlar", icon: Compass },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                          isActive
                            ? "bg-white text-[#07452C] shadow-sm font-extrabold"
                            : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SCROLLABLE FEATURES CONTENT */}
              <div className="flex-1 min-h-0 overflow-y-auto p-5 px-6 space-y-4 bg-[#FAF8F5]/50">
                {/* 1. PROFILES SECTION */}
                {(activeTab === "all" || activeTab === "profiles") && (
                  <div className="bg-white border border-[#07452C]/20 rounded-2xl p-4 shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-extrabold text-[#07452C] font-headings">
                        <SlidersHorizontal className="w-4 h-4" />
                        <span>{isEn ? "Pre-configured Profiles" : "Hazır Erişilebilirlik Profilleri"}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 font-semibold font-sans">
                        {isEn ? "Quick Selection" : "Hızlı Seçim"}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
                      <button
                        type="button"
                        onClick={() => applyProfile("none")}
                        className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                          settings.profile === "none"
                            ? "bg-[#07452C] text-white border-[#07452C] shadow-sm"
                            : "bg-[#FAF8F5] text-stone-700 border-stone-200/80 hover:bg-stone-100"
                        }`}
                      >
                        <span className="font-bold">{isEn ? "Default" : "Varsayılan"}</span>
                        <span className="text-[10px] opacity-80 font-sans font-normal">{isEn ? "Normal View" : "Normal Görünüm"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyProfile("dyslexia")}
                        className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                          settings.profile === "dyslexia"
                            ? "bg-[#07452C] text-white border-[#07452C] shadow-sm"
                            : "bg-[#FAF8F5] text-stone-700 border-stone-200/80 hover:bg-stone-100"
                        }`}
                      >
                        <span className="font-bold">{isEn ? "Dyslexia Friendly" : "Disleksi Dostu"}</span>
                        <span className="text-[10px] opacity-80 font-sans font-normal">{isEn ? "Clear Font & Spacing" : "Sade Font & Aralık"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyProfile("vision")}
                        className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                          settings.profile === "vision"
                            ? "bg-[#07452C] text-white border-[#07452C] shadow-sm"
                            : "bg-[#FAF8F5] text-stone-700 border-stone-200/80 hover:bg-stone-100"
                        }`}
                      >
                        <span className="font-bold">{isEn ? "Vision Friendly" : "Görme Dostu"}</span>
                        <span className="text-[10px] opacity-80 font-sans font-normal">{isEn ? "High Contrast & Large Text" : "Kontrast & Büyük Metin"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => applyProfile("adhd")}
                        className={`p-2.5 rounded-xl border transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                          settings.profile === "adhd"
                            ? "bg-[#07452C] text-white border-[#07452C] shadow-sm"
                            : "bg-[#FAF8F5] text-stone-700 border-stone-200/80 hover:bg-stone-100"
                        }`}
                      >
                        <span className="font-bold">{isEn ? "ADHD / Focus" : "DEHB / Odak"}</span>
                        <span className="text-[10px] opacity-80 font-sans font-normal">{isEn ? "Reading Focus & Reduced Motion" : "Okuma Odağı & Durgun"}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 2. FEATURE CARDS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* DISPLAY & COLOR CATEGORY CARDS */}
                  {(activeTab === "all" || activeTab === "display") && (
                    <>
                      {/* Kontrast Ayarı */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Sun className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Contrast Settings" : "Kontrast Ayarı"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Clarity & Saturation" : "Netlik ve doygunluk"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.highContrast}
                          onClick={() => updateSetting("highContrast", !settings.highContrast)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.highContrast
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.highContrast ? (isEn ? "High Contrast" : "Yüksek Kontrast") : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Doygunluk Ayarı */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Palette className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Saturation Settings" : "Doygunluk Ayarı"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Vibrance / Monochrome" : "Canlılık / Monokrom"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSetting(
                              "saturation",
                              settings.saturation === "normal"
                                ? "high"
                                : settings.saturation === "high"
                                ? "monochrome"
                                : "normal"
                            )
                          }
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.saturation !== "normal"
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.saturation === "high"
                            ? (isEn ? "High Saturation" : "Yüksek Doygunluk")
                            : settings.saturation === "monochrome"
                            ? (isEn ? "Monochrome" : "Monokrom")
                            : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Büyük Arayüz ve Düğmeler */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Maximize2 className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Large UI Buttons" : "Büyük Arayüz"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Expanded buttons" : "Geniş butonlar"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.bigUI}
                          onClick={() => updateSetting("bigUI", !settings.bigUI)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.bigUI
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.bigUI ? (isEn ? "Active" : "Aktif") : (isEn ? "Disabled" : "Pasif")}
                        </button>
                      </div>

                      {/* İmleç Özelleştirme */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <MousePointer className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Cursor Type" : "İmleç Tipi"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Large cursors" : "Büyük imleçler"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSetting(
                              "customCursor",
                              settings.customCursor === "default"
                                ? "big-black"
                                : settings.customCursor === "big-black"
                                ? "big-white"
                                : "default"
                            )
                          }
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.customCursor !== "default"
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.customCursor === "big-black"
                            ? (isEn ? "Large Black" : "Büyük Siyah")
                            : settings.customCursor === "big-white"
                            ? (isEn ? "Large White" : "Büyük Beyaz")
                            : (isEn ? "Standard" : "Standart")}
                        </button>
                      </div>
                    </>
                  )}

                  {/* READING & TYPOGRAPHY CATEGORY CARDS */}
                  {(activeTab === "all" || activeTab === "reading") && (
                    <>
                      {/* Daha Büyük Metin */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Type className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Font Size" : "Metin Boyutu"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Text scale" : "Yazı ölçeği"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateSetting("fontScale", "sm")}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                              settings.fontScale === "sm" ? "bg-[#07452C] text-white" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            A-
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSetting("fontScale", "normal")}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                              settings.fontScale === "normal" ? "bg-[#07452C] text-white" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            100%
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSetting("fontScale", "lg")}
                            className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                              settings.fontScale === "lg" ? "bg-[#07452C] text-white" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            A+
                          </button>
                        </div>
                      </div>

                      {/* Okunabilir Mod */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Readable Font" : "Okunabilir Mod"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Simple standard font" : "Sade standart font"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.readableMode}
                          onClick={() => updateSetting("readableMode", !settings.readableMode)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.readableMode
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.readableMode ? (isEn ? "Active" : "Aktif") : (isEn ? "Disabled" : "Pasif")}
                        </button>
                      </div>

                      {/* Metin Aralığı */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Space className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Text Spacing" : "Metin Aralığı"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Letter spacing" : "Harf mesafesi"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSetting("textSpacing", settings.textSpacing === "normal" ? "wide" : "normal")
                          }
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.textSpacing === "wide"
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.textSpacing === "wide" ? (isEn ? "Wide" : "Geniş") : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Satır Yüksekliği */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <AlignJustify className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Line Height" : "Satır Yüksekliği"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Vertical line space" : "Dikey okuma"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            updateSetting("lineHeight", settings.lineHeight === "normal" ? "wide" : "normal")
                          }
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.lineHeight === "wide"
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.lineHeight === "wide" ? (isEn ? "Wide Lines" : "Geniş Satır") : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Metin Hizalama */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all sm:col-span-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <AlignLeft className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Text Alignment" : "Metin Hizalama"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Paragraph direction" : "Paragraf yönü seçimi"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-stone-200 rounded-xl p-1">
                          <button
                            type="button"
                            onClick={() => updateSetting("textAlign", "left")}
                            className={`flex-1 py-1.5 flex justify-center items-center rounded-lg transition-colors font-bold text-xs ${
                              settings.textAlign === "left" ? "bg-[#07452C] text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            <AlignLeft className="w-4 h-4 mr-1" /> {isEn ? "Left" : "Sol"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSetting("textAlign", "center")}
                            className={`flex-1 py-1.5 flex justify-center items-center rounded-lg transition-colors font-bold text-xs ${
                              settings.textAlign === "center" ? "bg-[#07452C] text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            <AlignCenter className="w-4 h-4 mr-1" /> {isEn ? "Center" : "Orta"}
                          </button>
                          <button
                            type="button"
                            onClick={() => updateSetting("textAlign", "right")}
                            className={`flex-1 py-1.5 flex justify-center items-center rounded-lg transition-colors font-bold text-xs ${
                              settings.textAlign === "right" ? "bg-[#07452C] text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/60"
                            }`}
                          >
                            <AlignRight className="w-4 h-4 mr-1" /> {isEn ? "Right" : "Sağ"}
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* TOOLS & NAVIGATION CATEGORY CARDS */}
                  {(activeTab === "all" || activeTab === "tools") && (
                    <>
                      {/* Okuma Odağı */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Crosshair className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Reading Focus" : "Okuma Odağı"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Spotlight reading bar" : "Spotlight okuma şeridi"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.readingFocus}
                          onClick={() => updateSetting("readingFocus", !settings.readingFocus)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.readingFocus
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.readingFocus ? (isEn ? "Active" : "Aktif") : (isEn ? "Disabled" : "Pasif")}
                        </button>
                      </div>

                      {/* Sanal Klavye */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Keyboard className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Virtual Keyboard" : "Sanal Klavye"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "On-screen keyboard" : "Ekran klavyesi"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.virtualKeyboard}
                          onClick={() => updateSetting("virtualKeyboard", !settings.virtualKeyboard)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.virtualKeyboard
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.virtualKeyboard ? (isEn ? "On" : "Açık") : (isEn ? "Off" : "Kapalı")}
                        </button>
                      </div>

                      {/* Medya Sessize Al */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <VolumeX className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Mute Media" : "Medya Sessiz"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Mutes audio" : "Sesleri kapatır"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.muteMedia}
                          onClick={() => updateSetting("muteMedia", !settings.muteMedia)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.muteMedia
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.muteMedia ? (isEn ? "Muted" : "Sessiz") : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Araç İpuçları */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <HelpCircle className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Tooltips" : "Araç İpuçları"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Icon tooltips" : "Simge ipuçları"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.accessibleTooltips}
                          onClick={() => updateSetting("accessibleTooltips", !settings.accessibleTooltips)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.accessibleTooltips
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.accessibleTooltips ? (isEn ? "Active" : "Aktif") : (isEn ? "Disabled" : "Pasif")}
                        </button>
                      </div>

                      {/* Sayfa Yapısı */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Layout className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Page Structure" : "Sayfa Yapısı"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Semantic regions" : "Semantik bölge"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.pageStructure}
                          onClick={() => updateSetting("pageStructure", !settings.pageStructure)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.pageStructure
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.pageStructure ? (isEn ? "Show" : "Göster") : (isEn ? "Hide" : "Gizle")}
                        </button>
                      </div>

                      {/* Bağlantıları Vurgula */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <LinkIcon className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Highlight Links" : "Linkleri Vurgula"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Underline links" : "Net bağlantı"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.highlightLinks}
                          onClick={() => updateSetting("highlightLinks", !settings.highlightLinks)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.highlightLinks
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.highlightLinks ? (isEn ? "Active" : "Aktif") : (isEn ? "Disabled" : "Pasif")}
                        </button>
                      </div>

                      {/* Gezinmeyi Atla */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <Focus className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Skip Navigation" : "Gezinmeyi Atla"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Jump to content" : "Ana içerik"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleSkipNavigation}
                          className="w-full py-1.5 px-3 rounded-xl text-xs font-bold bg-[#FAF8F5] border border-stone-200 text-[#07452C] hover:bg-[#EEF7F3] transition-colors cursor-pointer"
                        >
                          {isEn ? "Skip to Content" : "İçeriğe Atla"}
                        </button>
                      </div>

                      {/* Animasyonları Duraklat */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <ZapOff className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Reduce Motion" : "Animasyon"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Pause motion" : "Hareketleri durdur"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.reduceMotion}
                          onClick={() => updateSetting("reduceMotion", !settings.reduceMotion)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.reduceMotion
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.reduceMotion ? (isEn ? "Paused" : "Durduruldu") : (isEn ? "Normal" : "Normal")}
                        </button>
                      </div>

                      {/* Görselleri Gizle */}
                      <div className="bg-white border border-stone-200/80 hover:border-[#07452C]/30 rounded-2xl p-3.5 flex flex-col justify-between gap-3 shadow-2xs transition-all">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#EEF7F3] text-[#07452C] flex items-center justify-center shrink-0">
                            <EyeOff className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Hide Images" : "Görselleri Gizle"}</span>
                            <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Text-only view" : "Metin görünümü"}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={settings.hideImages}
                          onClick={() => updateSetting("hideImages", !settings.hideImages)}
                          className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                            settings.hideImages
                              ? "bg-[#07452C] text-white shadow-xs"
                              : "bg-[#FAF8F5] border border-stone-200 text-stone-700 hover:bg-stone-100"
                          }`}
                        >
                          {settings.hideImages ? (isEn ? "Hidden" : "Gizli") : (isEn ? "Visible" : "Görünür")}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* WIDGET POSITION SWITCHER */}
                <div className="pt-2 flex items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs">
                  <div className="flex items-center gap-2.5">
                    <MoveHorizontal className="w-4 h-4 text-[#07452C]" />
                    <div>
                      <span className="text-xs font-bold text-[#0F1115] block">{isEn ? "Widget Position" : "Widget Konumu"}</span>
                      <span className="text-[10px] text-stone-500 font-sans">{isEn ? "Screen side" : "Ekran tarafı"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 bg-[#FAF8F5] border border-stone-200 rounded-xl p-1">
                    <button
                      type="button"
                      onClick={() => updateSetting("widgetPosition", "left")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        settings.widgetPosition === "left" ? "bg-[#07452C] text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      {isEn ? "Left" : "Sol"}
                    </button>
                    <button
                      type="button"
                      onClick={() => updateSetting("widgetPosition", "right")}
                      className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                        settings.widgetPosition === "right" ? "bg-[#07452C] text-white shadow-xs" : "text-stone-600 hover:bg-stone-200/60"
                      }`}
                    >
                      {isEn ? "Right" : "Sağ"}
                    </button>
                  </div>
                </div>

                {/* RESET BUTTON */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="w-full py-3 px-4 rounded-2xl bg-[#07452C] hover:bg-[#0A5C3A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{isEn ? "Reset All Accessibility Settings" : "Tüm Erişilebilirlik Ayarlarını Sıfırla"}</span>
                  </button>
                </div>
              </div>

              {/* FOOTER DECLARATION & REPORT ISSUE */}
              <div className="flex-none p-4 px-6 bg-[#FAF8F5] border-t border-stone-200/70 flex items-center justify-between text-[11px] font-bold text-stone-600">
                <button
                  type="button"
                  onClick={() => setShowFeedbackModal(true)}
                  className="hover:text-[#07452C] transition-colors cursor-pointer underline underline-offset-2"
                >
                  {isEn ? "Accessibility Statement | Report Issue" : "Erişilebilirlik Bildirimi | Sorun Bildir"}
                </button>
                <span className="text-[10px] text-stone-400 font-sans font-semibold">
                  N'apsak? A11y v3.5
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ACCESSIBILITY FEEDBACK / DECLARATION MODAL */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-stone-200 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 text-[#07452C] font-extrabold text-base font-headings">
                  <ShieldCheck className="w-5 h-5 text-[#07452C]" />
                  <span>{isEn ? "Accessibility Statement" : "Erişilebilirlik Bildirimi"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    setFeedbackSent(false);
                  }}
                  className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-medium">
                {isEn
                  ? "As N'apsak? Youth Community, we aim for our website to be barrier-free and accessible for all individuals. You can directly report any accessibility feedback to us."
                  : "N'apsak? Gençlik Topluluğu olarak web sitemizin tüm bireyler için engel tanımadan kullanılabilir olmasını amaçlıyoruz. Karşılaştığınız her türlü erişilebilirlik durumunu bize doğrudan bildirebilirsiniz."}
              </p>

              {feedbackSent ? (
                <div className="bg-[#EEF7F3] border border-[#07452C]/30 text-[#07452C] p-4 rounded-2xl text-xs font-bold text-center leading-relaxed">
                  {isEn
                    ? "Your feedback has been received! Our team will quickly review the issue."
                    : "Geri bildiriminiz başarıyla alındı! Ekibimiz konuyu hızla inceleyecektir."}
                </div>
              ) : (
                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={isEn ? "Describe the accessibility feedback or issue here..." : "Yaşadığınız erişilebilirlik bildirimini buraya yazabilirsiniz..."}
                    className="w-full p-3.5 rounded-2xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#07452C]/40 font-sans"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (feedbackText.trim()) setFeedbackSent(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#07452C] hover:bg-[#0A5C3A] text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    {isEn ? "Submit Feedback" : "Bildirimi Gönder"}
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

