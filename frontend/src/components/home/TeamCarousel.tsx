"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  MousePointerClick,
  Pause,
  Play,
} from "lucide-react";
import { TEAMS_DATA, TEAM_ICONS } from "../../data/teams";

export const TeamCarousel: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const requestRef = useRef<number | null>(null);
  const totalTeams = TEAMS_DATA.length;
  const angleStep = 360 / totalTeams; // 72 degrees per card

  // Check screen width for mobile fallback
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkMobile = () => setIsMobile(window.innerWidth < 640);
      checkMobile();
      window.addEventListener("resize", checkMobile);
      return () => window.removeEventListener("resize", checkMobile);
    }
  }, []);

  // Continuous 360-degree smooth auto-rotation loop
  useEffect(() => {
    if (shouldReduceMotion) return;

    let lastTime = performance.now();

    const animateRotation = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused) {
        // Rotate approx 10 degrees per second for smooth 36s full revolution
        setRotationAngle((prev) => (prev - (delta * 0.010)) % 360);
      }

      requestRef.current = requestAnimationFrame(animateRotation);
    };

    requestRef.current = requestAnimationFrame(animateRotation);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused, hoveredIndex, shouldReduceMotion]);

  // Snap to specific card index as front center
  const snapToCard = (targetIdx: number) => {
    const targetAngle = -targetIdx * angleStep;
    let currentNorm = rotationAngle % 360;
    if (currentNorm > 180) currentNorm -= 360;
    if (currentNorm < -180) currentNorm += 360;

    let diff = targetAngle - currentNorm;
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;

    setRotationAngle((prev) => prev + diff);
  };

  const handleNext = () => {
    setRotationAngle((prev) => prev - angleStep);
  };

  const handlePrev = () => {
    setRotationAngle((prev) => prev + angleStep);
  };

  // Identify front-most card index
  const getFrontCardIndex = () => {
    let normalized = (-rotationAngle) % 360;
    if (normalized < 0) normalized += 360;
    const rawIdx = Math.round(normalized / angleStep) % totalTeams;
    return (rawIdx + totalTeams) % totalTeams;
  };

  const frontIndex = getFrontCardIndex();

  // Mobile Fallback: Horizontal Swipeable List for <640px screens
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center select-none py-4">
        <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 no-scrollbar">
          {TEAMS_DATA.map((team, idx) => {
            const IconComp = TEAM_ICONS[team.iconName];
            const isActive = idx === frontIndex;

            return (
              <div
                key={team.id}
                onClick={() => snapToCard(idx)}
                className={`snap-center shrink-0 w-[280px] h-[340px] rounded-[24px] overflow-hidden p-6 flex flex-col justify-between transition-all duration-300 relative ${
                  isActive
                    ? "text-white border-2 border-[#0A5C3A] shadow-xl"
                    : "text-white border border-white/20 shadow-md"
                }`}
              >
                {/* Background Image & Gradient Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={team.bgImage}
                    alt={team.title}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 ${
                      isActive
                        ? "bg-gradient-to-t from-black/85 via-black/55 to-black/35"
                        : "bg-gradient-to-t from-black/95 via-black/80 to-black/60"
                    }`}
                  />
                </div>

                <div className="relative z-10 flex items-center justify-between w-full">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md ${
                      isActive ? "bg-white/20 text-white border border-white/20" : "bg-white/10 text-white/90 border border-white/10"
                    }`}
                  >
                    <IconComp className="w-6 h-6 stroke-[2]" />
                  </div>
                  {isActive && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#0A5C3A] text-white uppercase tracking-wider shadow-sm">
                      Aktif
                    </span>
                  )}
                </div>

                <div className="relative z-10 flex flex-col text-left mt-2">
                  <h3 className="text-xl font-bold font-headings mb-2 text-white drop-shadow-sm">
                    {team.title}
                  </h3>
                  <p className="text-xs font-sans leading-relaxed text-white/90">
                    {team.shortDescription}
                  </p>
                </div>

                <div className="relative z-10 w-full pt-3 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/90">N'apsak? Ekibi</span>
                  <Link
                    href={`/ekipler/${team.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isActive
                        ? "bg-white text-[#0A5C3A] shadow-md hover:bg-[#0A5C3A] hover:text-white"
                        : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
                    }`}
                    title={`${team.title} Detayına Git`}
                    aria-label={`${team.title} Detay Sayfası`}
                  >
                    →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Dots */}
        <div className="flex items-center gap-2 mt-4">
          {TEAMS_DATA.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => snapToCard(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === frontIndex ? "w-6 bg-[#0A5C3A]" : "w-2 bg-[#EEF0F2]"
              }`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center select-none py-6 overflow-hidden">
      {/* 360-Degree Cylindrical 3D Stage with perspective */}
      <div
        className="relative w-full max-w-6xl h-[440px] sm:h-[500px] flex items-center justify-center overflow-visible"
        style={{ perspective: "1200px" }}
      >
        {/* Navigation Left Arrow Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-50 w-12 h-12 rounded-full bg-white/90 border border-[#EEF0F2] text-[#0A5C3A] shadow-lg hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
          aria-label="Önceki Ekip"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Navigation Right Arrow Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-50 w-12 h-12 rounded-full bg-white/90 border border-[#EEF0F2] text-[#0A5C3A] shadow-lg hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
          aria-label="Sonraki Ekip"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* 360-Degree Cylinder Ring Wrapper */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
        >
          {TEAMS_DATA.map((team, idx) => {
            const IconComp = TEAM_ICONS[team.iconName];

            // Compute exact angle on 360-degree cylinder
            const cardAngle = (rotationAngle + idx * angleStep) % 360;
            let normalizedAngle = cardAngle;
            if (normalizedAngle > 180) normalizedAngle -= 360;
            if (normalizedAngle < -180) normalizedAngle += 360;

            const rad = (cardAngle * Math.PI) / 180;
            const radius = 350;

            // 3D positioning
            const x = Math.sin(rad) * radius;
            const z = Math.cos(rad) * radius - radius;

            const isFront = idx === frontIndex;
            const isHovered = hoveredIndex === idx;

            // Scale and opacity derived strictly from angle distance to front camera
            let scale = Math.max(0.72, 1 - Math.abs(normalizedAngle) / 180 * 0.28);
            let opacity = Math.max(0.35, 1 - Math.abs(normalizedAngle) / 180 * 0.65);

            if (isHovered) {
              scale = 1.12;
              opacity = 1;
            }

            const zIndexVal = Math.round((z + radius * 2) * 10) + (isHovered ? 1000 : 0);

            return (
              <motion.div
                key={team.id}
                initial={false}
                animate={{
                  x: x,
                  z: z + (isHovered ? 80 : 0),
                  rotateY: -cardAngle,
                  scale: scale,
                  opacity: opacity,
                }}
                transition={{
                  duration: isHovered ? 0.25 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  zIndex: zIndexVal,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => {
                  if (isFront) {
                    window.location.href = `/ekipler/${team.slug}`;
                  } else {
                    snapToCard(idx);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`group absolute w-[280px] sm:w-[320px] h-[350px] sm:h-[400px] rounded-[24px] overflow-hidden p-6 sm:p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                  isFront || isHovered
                    ? "border-2 border-[#0A5C3A] shadow-[0_20px_60px_rgba(10,92,58,0.4)]"
                    : "border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)] hover:border-[#0A5C3A]/70"
                }`}
              >
                {/* Full-Card Background Image & Gradient Overlay */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <img
                    src={team.bgImage}
                    alt={team.title}
                    className={`w-full h-full object-cover transition-transform duration-500 ease-out ${
                      isHovered ? "scale-105" : "scale-100"
                    }`}
                  />

                  {/* Dark Semi-Transparent Gradient Overlay for Text Readability */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      isFront || isHovered
                        ? "bg-gradient-to-t from-black/85 via-black/55 to-black/35"
                        : "bg-gradient-to-t from-black/95 via-black/80 to-black/60 opacity-90"
                    }`}
                  />
                </div>

                {/* Top Icon & Badge Header */}
                <div className="relative z-10 flex items-center justify-between w-full">
                  <div
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors backdrop-blur-md ${
                      isFront || isHovered
                        ? "bg-white/20 text-white shadow-inner border border-white/20"
                        : "bg-white/10 text-white/90 border border-white/10"
                    }`}
                  >
                    <IconComp className="w-6 h-6 sm:w-7 sm:h-7 stroke-[2]" />
                  </div>

                  {isFront && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#0A5C3A] text-white tracking-wider uppercase shadow-md">
                      Öne Çıkan
                    </span>
                  )}
                </div>

                {/* Team Title & Description */}
                <div className="relative z-10 flex flex-col text-left mt-3">
                  <h3 className="text-xl sm:text-2xl font-bold font-headings leading-snug mb-3 text-white drop-shadow-md">
                    {team.title}
                  </h3>

                  <p
                    className={`text-xs sm:text-sm font-sans leading-relaxed transition-opacity duration-200 ${
                      isFront || isHovered
                        ? "text-white/95 opacity-100 font-medium"
                        : "text-white/80 opacity-90"
                    }`}
                  >
                    {team.shortDescription}
                  </p>
                </div>

                {/* Bottom Card Footer Accent */}
                <div className="relative z-10 w-full pt-4 border-t border-white/20 flex items-center justify-between text-xs font-semibold">
                  <span className="text-white/90">
                    N'apsak? Ekibi
                  </span>
                  <Link
                    href={`/ekipler/${team.slug}`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                      isFront || isHovered
                        ? "bg-white text-[#0A5C3A] scale-110 shadow-md hover:bg-[#0A5C3A] hover:text-white"
                        : "bg-white/20 text-white backdrop-blur-sm hover:bg-white/40"
                    }`}
                    title={`${team.title} Detayına Git`}
                    aria-label={`${team.title} Detay Sayfası`}
                  >
                    →
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Control Toolbar: Play/Pause Toggle + Dots */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="p-2 rounded-full bg-[#F8F9FA] border border-[#EEF0F2] text-[#0A5C3A] hover:bg-[#0A5C3A] hover:text-white transition-all cursor-pointer"
          aria-label={isPaused ? "Döndürmeyi Başlat" : "Döndürmeyi Durdur"}
          title={isPaused ? "Döndürmeyi Başlat" : "Döndürmeyi Durdur"}
        >
          {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
        </button>

        {/* 5 Dots Indicator */}
        <div className="flex items-center gap-2">
          {TEAMS_DATA.map((team, idx) => (
            <button
              key={team.id}
              type="button"
              onClick={() => snapToCard(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === frontIndex
                  ? "w-8 bg-[#0A5C3A]"
                  : "w-2.5 bg-[#EEF0F2] hover:bg-[#0A5C3A]/40"
              }`}
              aria-label={`Ekip ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* User Helper Prompt */}
      <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-[#5F6773]">
        <MousePointerClick className="w-3.5 h-3.5 text-[#0A5C3A]" />
      </div>
    </div>
  );
};

TeamCarousel.displayName = "TeamCarousel";

