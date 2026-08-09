"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Cpu,
  Palette,
  HeartPulse,
  BookOpen,
  Share2,
  MousePointerClick,
  Pause,
  Play,
} from "lucide-react";

// 5 Real Working Teams of N'apsak? Gençlik Topluluğu
// `gradient` approximates a photographic backdrop per team (no external image
// assets are available in this repo). Drop a real photo in /public and swap
// it in via a background-image on the card if/when assets are ready.
const TEAMS = [
  {
    id: "programlar",
    icon: BookOpen,
    title: "Programlar Ekibi",
    description:
      "Gençlerin kişisel, akademik ve mesleki gelişim yolculuklarına katkı sağlayan kapsayıcı eğitim ve gelişim programları kurgular.",
    gradient: "linear-gradient(160deg, #4a3521 0%, #2c2013 55%, #1a140c 100%)",
  },
  {
    id: "sanat",
    icon: Palette,
    title: "Sanat Ekibi",
    description:
      "Gençlerin sanatsal ve yaratıcı ifade becerilerini geliştirmelerini destekleyen atölyeler ve estetik projeler yürütür.",
    gradient: "linear-gradient(160deg, #4b2a52 0%, #7a3f57 45%, #b9713f 100%)",
  },
  {
    id: "teknoloji",
    icon: Cpu,
    title: "Teknoloji Ekibi",
    description:
      "Dijitalleşme, inovasyon, yazılım, yapay zeka ve sürdürülebilir teknoloji alanlarında eğitim içerikleri, projeler ve etkinlikler geliştirir.",
    gradient: "linear-gradient(160deg, #07452C 0%, #0A5C3A 100%)",
  },
  {
    id: "cevre-saglik",
    icon: HeartPulse,
    title: "Çevre ve Sağlık Ekibi",
    description:
      "Sürdürülebilirlik, çevre bilinci, sağlıklı yaşam ve toplumsal fayda odaklı sosyal sorumluluk projeleri gerçekleştirir.",
    gradient: "linear-gradient(160deg, #173822 0%, #1f5030 55%, #2c6b3e 100%)",
  },
  {
    id: "kurumsal-iletisim",
    icon: Share2,
    title: "Kurumsal İletişim Ekibi",
    description:
      "Topluluğun kurumsal kimliğini, medya stratejilerini, dijital mecralarını ve paydaş iş birliklerini yönetir.",
    gradient: "linear-gradient(160deg, #0d1b2a 0%, #16233d 55%, #1c2a4a 100%)",
  },
];

// Responsive card footprint tiers used to derive the ring radius.
// radius = (cardWidth / 2) / tan(PI / cardCount)  →  keeps neighbouring
// cards edge-to-edge on the circle regardless of how many teams exist.
const TIERS = {
  tablet: { cardWidth: 230, cardHeight: 300, stageHeight: 460 },
  desktop: { cardWidth: 300, cardHeight: 360, stageHeight: 560 },
} as const;

type Tier = keyof typeof TIERS;

// Camera tilt applied to the whole ring (not animated) so the cylinder is
// seen slightly from above — this is what makes the outer cards arc
// downward, matching the barrel look in the reference image.
const RING_TILT_DEG = 9;

interface TeamCardVisualProps {
  team: (typeof TEAMS)[number];
  isActive: boolean;
}

// Shared visual for the flat fallbacks (mobile swipe list + reduced-motion grid)
const TeamCardVisual: React.FC<TeamCardVisualProps> = ({ team, isActive }) => {
  const IconComp = team.icon;
  return (
    <div
      className="relative w-full h-full rounded-[24px] overflow-hidden flex flex-col items-center justify-center text-center px-6 py-8"
      style={{ backgroundImage: isActive ? undefined : team.gradient }}
    >
      {isActive && <div className="absolute inset-0" style={{ backgroundImage: TEAMS[2].gradient }} />}
      {!isActive && <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />}

      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/15 backdrop-blur-sm border border-white/20 mb-4">
          <IconComp className="w-7 h-7 text-white stroke-[2]" />
        </div>
        <h3 className="text-lg font-bold font-headings text-white mb-2">{team.title}</h3>
        <p className="text-xs font-sans leading-relaxed text-white/85">{team.description}</p>
        {isActive && (
          <div className="w-11 h-11 mt-5 rounded-full bg-white text-[#0A5C3A] flex items-center justify-center shadow-lg">
            <ArrowRight className="w-5 h-5 stroke-[2.5]" />
          </div>
        )}
      </div>
    </div>
  );
};

export const TeamCarousel: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [tier, setTier] = useState<Tier>("desktop");

  const requestRef = useRef<number | null>(null);
  const totalTeams = TEAMS.length;
  const angleStep = 360 / totalTeams; // 72 degrees per card

  // Determine breakpoint tier: <640 → mobile swipe fallback,
  // 640–1023 → tablet ring, ≥1024 → desktop ring.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkSize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
      setTier(w < 1024 ? "tablet" : "desktop");
    };
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Formula-driven radius: (cardWidth / 2) / tan(PI / cardCount)
  const { cardWidth, cardHeight, stageHeight } = TIERS[tier];
  const radius = cardWidth / 2 / Math.tan(Math.PI / totalTeams);

  // Continuous 360-degree smooth auto-rotation loop (~34s per revolution)
  useEffect(() => {
    if (shouldReduceMotion || isMobile) return;

    let lastTime = performance.now();

    const animateRotation = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (!isPaused && hoveredIndex === null) {
        setRotationAngle((prev) => (prev - delta * 0.0106) % 360);
      }

      requestRef.current = requestAnimationFrame(animateRotation);
    };

    requestRef.current = requestAnimationFrame(animateRotation);

    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isPaused, hoveredIndex, shouldReduceMotion, isMobile]);

  // Snap to specific card index as front center
  const snapToCard = useCallback(
    (targetIdx: number) => {
      const targetAngle = -targetIdx * angleStep;
      setRotationAngle((prev) => {
        let currentNorm = prev % 360;
        if (currentNorm > 180) currentNorm -= 360;
        if (currentNorm < -180) currentNorm += 360;

        let diff = targetAngle - currentNorm;
        if (diff > 180) diff -= 360;
        if (diff < -180) diff += 360;

        return prev + diff;
      });
    },
    [angleStep]
  );

  const handleNext = () => setRotationAngle((prev) => prev - angleStep);
  const handlePrev = () => setRotationAngle((prev) => prev + angleStep);

  // Identify front-most card index
  const getFrontCardIndex = () => {
    let normalized = -rotationAngle % 360;
    if (normalized < 0) normalized += 360;
    const rawIdx = Math.round(normalized / angleStep) % totalTeams;
    return (rawIdx + totalTeams) % totalTeams;
  };

  const frontIndex = getFrontCardIndex();

  // ---- Reduced motion: static grid, no rotation, no 3D transforms ----
  if (shouldReduceMotion) {
    return (
      <div className="w-full py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-6xl mx-auto px-4">
          {TEAMS.map((team, idx) => (
            <div key={team.id} className="h-[320px] rounded-[24px] overflow-hidden shadow-md">
              <TeamCardVisual team={team} isActive={idx === 2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ---- Mobile fallback: simple horizontal swipe carousel (<640px) ----
  if (isMobile) {
    return (
      <div className="w-full flex flex-col items-center select-none py-4">
        <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 px-4 pb-4 no-scrollbar">
          {TEAMS.map((team, idx) => {
            const isActive = idx === frontIndex;
            return (
              <div
                key={team.id}
                onClick={() => snapToCard(idx)}
                className="snap-center shrink-0 w-[280px] h-[340px] rounded-[24px] overflow-hidden shadow-md transition-transform duration-300"
              >
                <TeamCardVisual team={team} isActive={isActive} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-4">
          {TEAMS.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => snapToCard(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === frontIndex ? "w-6 bg-[#0A5C3A]" : "w-2 bg-[#EEF0F2]"
              }`}
              aria-label={`Ekip ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    );
  }

  // ---- Desktop/tablet: true 3D circular ring (barrel/cylinder) carousel ----
  return (
    <div
      className="w-full flex flex-col items-center select-none py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredIndex(null);
      }}
    >
      {/* 3D stage: perspective lives on the parent, ring rotates inside it */}
      <div
        className="relative w-full max-w-6xl flex items-center justify-center overflow-hidden"
        style={{
          height: stageHeight,
          perspective: "1300px",
          // Soft edge fade so the ring visually continues past the frame,
          // reinforcing the cylindrical / barrel illusion from the reference.
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-2 sm:left-4 z-50 w-12 h-12 rounded-full bg-white/90 border border-[#EEF0F2] text-[#0A5C3A] shadow-lg hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
          aria-label="Önceki Ekip"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="absolute right-2 sm:right-4 z-50 w-12 h-12 rounded-full bg-white/90 border border-[#EEF0F2] text-[#0A5C3A] shadow-lg hover:bg-[#0A5C3A] hover:text-white hover:border-[#0A5C3A] transition-all duration-200 flex items-center justify-center cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-[#0A5C3A]/20"
          aria-label="Sonraki Ekip"
        >
          <ChevronRight className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Ring wrapper: tilted slightly on X so the cylinder is viewed
            from above, then each card is placed with rotateY(angle) +
            translateZ(radius) around that tilted axis. */}
        <div
          className="relative w-full h-full flex items-center justify-center"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${RING_TILT_DEG}deg)`,
          }}
        >
          {TEAMS.map((team, idx) => {
            const IconComp = team.icon;

            const cardAngle = (rotationAngle + idx * angleStep) % 360;
            let normalizedAngle = cardAngle;
            if (normalizedAngle > 180) normalizedAngle -= 360;
            if (normalizedAngle < -180) normalizedAngle += 360;
            const normalizedFrac = normalizedAngle / 180; // -1 .. 1

            const rad = (cardAngle * Math.PI) / 180;

            // Position each card on the circle: angle = 360/n * index (+ live rotation)
            const x = Math.sin(rad) * radius;
            const z = Math.cos(rad) * radius - radius;

            const isFront = idx === frontIndex;
            const isHovered = hoveredIndex === idx;

            // Perspective + the ring's rotateX tilt already shrink and sink
            // the outer cards naturally; we only nudge scale/opacity a
            // little further so the front card reads as clearly emphasized.
            let scale = isFront ? 1.04 : Math.max(0.86, 1 - Math.abs(normalizedFrac) * 0.22);
            let opacity = Math.max(0.55, 1 - Math.abs(normalizedFrac) * 0.55);

            if (isHovered) {
              scale = Math.max(scale, 1.08);
              opacity = 1;
            }

            const zIndexVal = Math.round((z + radius * 2) * 10) + (isHovered ? 1000 : 0);
            const showFrontStyle = isFront;

            return (
              <motion.div
                key={team.id}
                initial={false}
                animate={{
                  x,
                  z: z + (isHovered ? 90 : 0),
                  rotateY: -cardAngle,
                  scale,
                  opacity,
                }}
                transition={{
                  duration: isHovered ? 0.25 : 0.35,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{
                  width: cardWidth,
                  height: cardHeight,
                  zIndex: zIndexVal,
                  transformStyle: "preserve-3d",
                }}
                onClick={() => snapToCard(idx)}
                onMouseEnter={() => {
                  setHoveredIndex(idx);
                  setIsPaused(true);
                }}
                onMouseLeave={() => setHoveredIndex(null)}
                className="absolute rounded-[24px] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(15,17,21,0.25)]"
              >
                <div className="relative w-full h-full" style={{ backgroundImage: team.gradient }}>
                  {/* Dark gradient overlay keeps text legible on every card */}
                  <div
                    className={`absolute inset-0 ${
                      showFrontStyle
                        ? "bg-black/5"
                        : "bg-gradient-to-t from-black/80 via-black/30 to-black/10"
                    }`}
                  />

                  <div className="relative z-10 w-full h-full flex flex-col items-center justify-center text-center px-6 sm:px-8 py-8">
                    <div
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mb-4 sm:mb-5 border ${
                        showFrontStyle
                          ? "bg-white/10 border-white/15 shadow-inner"
                          : "bg-white/15 border-white/20 backdrop-blur-sm"
                      }`}
                    >
                      <IconComp className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[2]" />
                    </div>

                    <h3 className="text-lg sm:text-2xl font-bold font-headings text-white mb-2 sm:mb-3 leading-snug">
                      {team.title}
                    </h3>

                    <p className="text-xs sm:text-sm font-sans leading-relaxed text-white/85 max-w-[85%]">
                      {team.description}
                    </p>

                    {showFrontStyle && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          snapToCard(idx);
                        }}
                        aria-label={`${team.title} detayına git`}
                        className="w-11 h-11 sm:w-12 sm:h-12 mt-5 sm:mt-6 rounded-full bg-white text-[#0A5C3A] flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      >
                        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
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

        <div className="flex items-center gap-2">
          {TEAMS.map((team, idx) => (
            <button
              key={team.id}
              type="button"
              onClick={() => snapToCard(idx)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === frontIndex ? "w-8 bg-[#0A5C3A]" : "w-2.5 bg-[#EEF0F2] hover:bg-[#0A5C3A]/40"
              }`}
              aria-label={`Ekip ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-1.5 mt-3 text-xs font-medium text-[#5F6773]">
        <MousePointerClick className="w-3.5 h-3.5 text-[#0A5C3A]" />
        <span>Keşfetmek için kartların üzerine gelin</span>
      </div>
    </div>
  );
};

TeamCarousel.displayName = "TeamCarousel";
