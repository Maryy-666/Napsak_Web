"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Scale,
  HeartHandshake,
  UserPlus,
  Lightbulb,
  LucideIcon,
} from "lucide-react";
import { Section, PageContainer } from "../ui";
import { useLanguage } from "../../context/LanguageContext";

interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const CORE_VALUES_TR: CoreValue[] = [
  {
    id: "cesitlilik",
    title: "Çeşitlilik",
    description:
      "Farklı şehirlerden, eğitim geçmişlerinden ve ilgi alanlarından gençleri bir araya getiriyoruz. Farklılıkları bir zenginlik olarak görüyor, herkesin kendisi olarak değer gördüğü kapsayıcı bir ortam sunuyoruz.",
    icon: Users,
  },
  {
    id: "tarafsizlik",
    title: "Tarafsızlık",
    description:
      "Faaliyetlerimizde siyasi, dini veya ideolojik yönlendirmelerden uzak duruyor; gençlerin gelişimine ve ortak faydaya odaklanıyoruz. Tarafsızlığı güven ortamımızın temel unsurlarından biri olarak görüyoruz.",
    icon: Scale,
  },
  {
    id: "yenilikcilik",
    title: "Yenilikçilik",
    description:
      "Değişen dünyaya uyum sağlamak için yeni fikirler üretmeyi ve gençlerin yaratıcılığını desteklemeyi önemsiyoruz. Yenilikçi yaklaşımlarla hem derneğimize hem de topluma katkı sunmayı amaçlıyoruz.",
    icon: Lightbulb,
  },
  {
    id: "birliktelik",
    title: "Birliktelik",
    description:
      "Birlikte üretmenin ve farklı fikirleri bir araya getirmenin gücüne inanıyoruz. Ortak projeler geliştiriyor, ekip ruhunu ön planda tutuyor ve her üyeyi derneğin önemli bir parçası olarak görüyoruz.",
    icon: HeartHandshake,
  },
  {
    id: "katilimcilik",
    title: "Katılımcılık",
    description:
      "Her gencin fikrinin değerli olduğuna inanıyoruz. Üyelerimizi karar alma ve üretim süreçlerine dahil ederek herkesin yalnızca katılımcı değil, aynı zamanda üretici olmasını destekliyoruz.",
    icon: UserPlus,
  },
];

const CORE_VALUES_EN: CoreValue[] = [
  {
    id: "cesitlilik",
    title: "Diversity",
    description:
      "We bring together youth from different cities, educational backgrounds, and interests. We see differences as a strength and foster an inclusive environment where everyone is valued.",
    icon: Users,
  },
  {
    id: "tarafsizlik",
    title: "Impartiality",
    description:
      "We stay free of political, religious, or ideological influences, focusing solely on youth growth and common good. Impartiality is a core pillar of our trust environment.",
    icon: Scale,
  },
  {
    id: "yenilikcilik",
    title: "Innovation",
    description:
      "We emphasize bringing new ideas to life and fostering youth creativity to adapt to a changing world. We aim to contribute to both our association and society through innovative approaches.",
    icon: Lightbulb,
  },
  {
    id: "birliktelik",
    title: "Togetherness",
    description:
      "We believe in the power of producing together and combining diverse perspectives. We build collaborative projects, prioritize team spirit, and value every member as a vital part of our association.",
    icon: HeartHandshake,
  },
  {
    id: "katilimcilik",
    title: "Participation",
    description:
      "We believe every young person's idea is valuable. By involving members in decision-making and creative processes, we empower everyone to be a producer, not just a participant.",
    icon: UserPlus,
  },
];


export function CoreValuesSection() {
  const { language } = useLanguage();
  const isEn = language === "en";
  const coreValuesData = isEn ? CORE_VALUES_EN : CORE_VALUES_TR;

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [lines, setLines] = useState<
    Array<{ x1: number; y1: number; x2: number; y2: number }>
  >([]);

  const updateLines = useCallback(() => {
    if (!containerRef.current || !centerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const centerRect = centerRef.current.getBoundingClientRect();

    const cX = centerRect.left + centerRect.width / 2 - containerRect.left;
    const cY = centerRect.top + centerRect.height / 2 - containerRect.top;

    const newLines = cardRefs.current.map((cardEl) => {
      if (!cardEl) return { x1: cX, y1: cY, x2: cX, y2: cY };
      const cardRect = cardEl.getBoundingClientRect();
      const cardX = cardRect.left + cardRect.width / 2 - containerRect.left;
      const cardY = cardRect.top + cardRect.height / 2 - containerRect.top;
      return { x1: cX, y1: cY, x2: cardX, y2: cardY };
    });

    setLines(newLines);
  }, []);

  useEffect(() => {
    updateLines();
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      updateLines();
    });
    resizeObserver.observe(container);
    window.addEventListener("resize", updateLines);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateLines);
    };
  }, [updateLines]);

  const getDesktopPositionStyle = (index: number) => {
    const cardDimensionClass = "w-[280px] lg:w-[300px] xl:w-[325px] min-h-[215px]";
    switch (index) {
      case 0:
        return `top-[13%] left-1/2 -translate-x-1/2 -translate-y-1/2 ${cardDimensionClass}`;
      case 1:
        return `top-[27%] left-[10%] lg:left-[11%] xl:left-[13%] -translate-x-1/2 -translate-y-1/2 ${cardDimensionClass}`;
      case 2:
        return `top-[27%] left-[90%] lg:left-[89%] xl:left-[87%] -translate-x-1/2 -translate-y-1/2 ${cardDimensionClass}`;
      case 3:
        return `top-[75%] left-[16%] lg:left-[17%] xl:left-[19%] -translate-x-1/2 -translate-y-1/2 ${cardDimensionClass}`;
      case 4:
        return `top-[75%] left-[84%] lg:left-[83%] xl:left-[81%] -translate-x-1/2 -translate-y-1/2 ${cardDimensionClass}`;
      default:
        return cardDimensionClass;
    }
  };

  return (
    <Section padding="lg" background="white" className="py-12 sm:py-16 border-b border-[#EEF0F2] overflow-hidden">
      <PageContainer className="max-w-[1400px]">
        {/* ================= DESKTOP RADIAL/STAR LAYOUT ================= */}
        <div
          ref={containerRef}
          className="hidden lg:block relative w-full mx-auto h-[780px] xl:h-[820px] select-none"
        >
          {/* Ambient Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full bg-[#0A5C3A]/[0.03] blur-3xl pointer-events-none z-0" />

          {/* SVG Connecting Lines Layer - Placed BEHIND Cards (z-0) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {lines.map((line, idx) => {
              const isHovered = hoveredIndex === idx;
              return (
                <g key={idx}>
                  {/* Line */}
                  <line
                    x1={line.x1}
                    y1={line.y1}
                    x2={line.x2}
                    y2={line.y2}
                    stroke="#0A5C3A"
                    strokeOpacity={isHovered ? 0.5 : 0.12}
                    strokeWidth={isHovered ? 2 : 1.25}
                    className="transition-all duration-300 ease-out"
                  />
                  {/* Node Dot on Card */}
                  <circle
                    cx={line.x2}
                    cy={line.y2}
                    r={isHovered ? 4 : 2.5}
                    fill="#0A5C3A"
                    opacity={isHovered ? 0.6 : 0.18}
                    className="transition-all duration-300 ease-out"
                  />
                  {/* Node Dot on Center Hub */}
                  <circle
                    cx={line.x1}
                    cy={line.y1}
                    r={isHovered ? 3.5 : 2}
                    fill="#0A5C3A"
                    opacity={isHovered ? 0.55 : 0.15}
                    className="transition-all duration-300 ease-out"
                  />
                </g>
              );
            })}
          </svg>

          {/* Center Capsule Hub Title (Full Capsule Radius 9999px) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-auto">
            <motion.div
              ref={centerRef}
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-[320px] sm:w-[355px] lg:w-[380px] h-[68px] sm:h-[72px] lg:h-[76px] rounded-full bg-white border-2 border-[#0A5C3A]/25 shadow-[0_14px_40px_rgba(10,92,58,0.14)] flex items-center justify-center transition-all duration-300 hover:border-[#0A5C3A]/70 hover:shadow-[0_20px_48px_rgba(10,92,58,0.20)]"
            >
              <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold font-headings text-[#0A5C3A] tracking-wider uppercase text-center leading-none select-none">
                {isEn ? "OUR CORE VALUES" : "TEMEL DEĞERLERİMİZ"}
              </h2>
            </motion.div>
          </div>

          {/* 5 Core Values Floating Cards */}
          {coreValuesData.map((item, index) => {
            const IconComp = item.icon;
            const isHovered = hoveredIndex === index;
            const positionClass = getDesktopPositionStyle(index);

            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className={`absolute ${positionClass} z-10 pointer-events-auto`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className={`group relative bg-white rounded-[24px] border p-5 sm:p-6 transition-all duration-300 ease-out cursor-default flex flex-col justify-start h-full ${
                    isHovered
                      ? "-translate-y-1.5 scale-[1.03] border-[#0A5C3A] shadow-[0_20px_44px_rgba(15,17,21,0.14)] z-30"
                      : "border-[#EEF0F2] shadow-[0_12px_36px_rgba(15,17,21,0.08)] hover:-translate-y-1.5 hover:scale-[1.03] hover:border-[#0A5C3A] hover:shadow-[0_20px_44px_rgba(15,17,21,0.14)]"
                  }`}
                >
                  {/* Icon Box */}
                  <div className="w-10 h-10 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center mb-3 group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 shrink-0">
                    <IconComp className="w-5 h-5 stroke-[2]" />
                  </div>

                  {/* Value Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-headings text-[#0F1115] mb-2 group-hover:text-[#0A5C3A] transition-colors duration-300 text-left">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-[#5F6773] font-sans leading-[1.6] text-left">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ================= MOBILE & TABLET RESPONSIVE LAYOUT ================= */}
        <div className="block lg:hidden w-full max-w-4xl mx-auto select-none">
          {/* Header Hub Badge */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-block px-6 py-3 sm:px-8 sm:py-3.5 rounded-full bg-white border-2 border-[#0A5C3A]/25 shadow-[0_14px_40px_rgba(10,92,58,0.14)]">
              <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold font-headings text-[#0A5C3A] tracking-wider uppercase leading-none">
                {isEn ? "OUR CORE VALUES" : "TEMEL DEĞERLERİMİZ"}
              </h2>
            </div>
          </div>

          {/* Cards Grid: 1 col on mobile (<768px), 2 cols on tablet (768px-1023px) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {coreValuesData.map((item, index) => {
              const IconComp = item.icon;
              const isFirst = index === 0;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className={`group bg-white rounded-[24px] border border-[#EEF0F2] p-6 sm:p-7 shadow-[0_12px_36px_rgba(15,17,21,0.08)] transition-all duration-300 hover:border-[#0A5C3A] hover:-translate-y-1 hover:shadow-[0_20px_44px_rgba(15,17,21,0.14)] active:scale-[0.99] flex flex-col ${
                    isFirst ? "md:col-span-2 md:max-w-xl md:mx-auto md:w-full" : "col-span-1"
                  }`}
                >
                  <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center mb-3.5 group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 shrink-0">
                    <IconComp className="w-5.5 h-5.5 stroke-[2]" />
                  </div>
                  <h3 className="text-xl sm:text-[22px] font-bold font-headings text-[#0F1115] mb-2.5 group-hover:text-[#0A5C3A] transition-colors duration-300 text-left">
                    {item.title}
                  </h3>
                  <p className="text-sm sm:text-base text-[#5F6773] font-sans leading-[1.6] text-left">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </PageContainer>
    </Section>
  );
}
