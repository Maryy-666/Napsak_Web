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

interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const CORE_VALUES_DATA: CoreValue[] = [
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
      "Değişen dünyaya uyum sağlamak için yeni fikirler üretmeyi ve gençlerin yaratıcılığını desteklemeyi önemsiyoruz. Yenilikçi yaklaşımlarla hem topluluğumuza hem de topluma katkı sunmayı amaçlıyoruz.",
    icon: Lightbulb,
  },
  {
    id: "birliktelik",
    title: "Birliktelik",
    description:
      "Birlikte üretmenin ve farklı fikirleri bir araya getirmenin gücüne inanıyoruz. Ortak projeler geliştiriyor, ekip ruhunu ön planda tutuyor ve her üyeyi topluluğun önemli bir parçası olarak görüyoruz.",
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

export function CoreValuesSection() {
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

  // Perfectly balanced orbital positioning mapping with generous clearance:
  // 0: Çeşitlilik (Top Center)
  // 1: Tarafsızlık (Middle Left)
  // 2: Yenilikçilik (Middle Right)
  // 3: Birliktelik (Bottom Left)
  // 4: Katılımcılık (Bottom Right)
  const getDesktopPositionStyle = (index: number) => {
    const cardDimensionClass = "w-[300px] lg:w-[335px] min-h-[220px]";
    switch (index) {
      case 0:
        return `top-[1%] left-1/2 -translate-x-1/2 ${cardDimensionClass}`;
      case 1:
        return `top-1/2 -translate-y-1/2 left-[0%] lg:left-[1%] ${cardDimensionClass}`;
      case 2:
        return `top-1/2 -translate-y-1/2 right-[0%] lg:right-[1%] ${cardDimensionClass}`;
      case 3:
        return `bottom-[1%] left-[6%] lg:left-[10%] ${cardDimensionClass}`;
      case 4:
        return `bottom-[1%] right-[6%] lg:right-[10%] ${cardDimensionClass}`;
      default:
        return cardDimensionClass;
    }
  };

  return (
    <Section padding="lg" background="white" className="py-20 sm:py-28 border-b border-[#EEF0F2] overflow-hidden">
      <PageContainer className="max-w-7xl">
        {/* ================= DESKTOP & TABLET RADIAL/STAR LAYOUT ================= */}
        <div
          ref={containerRef}
          className="hidden md:block relative w-full mx-auto min-h-[860px] pt-6 pb-6 select-none"
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
                    strokeOpacity={isHovered ? 0.75 : 0.2}
                    strokeWidth={isHovered ? 2.2 : 1.5}
                    className="transition-all duration-300 ease-out"
                  />
                  {/* Node Dot on Card */}
                  <circle
                    cx={line.x2}
                    cy={line.y2}
                    r={isHovered ? 4.5 : 3}
                    fill="#0A5C3A"
                    opacity={isHovered ? 0.9 : 0.35}
                    className="transition-all duration-300 ease-out"
                  />
                  {/* Node Dot on Center Hub */}
                  <circle
                    cx={line.x1}
                    cy={line.y1}
                    r={isHovered ? 4 : 2.5}
                    fill="#0A5C3A"
                    opacity={isHovered ? 0.85 : 0.3}
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
              className="w-[330px] sm:w-[370px] lg:w-[400px] h-[68px] sm:h-[76px] rounded-full bg-white border-2 border-[#0A5C3A]/25 shadow-[0_12px_36px_rgba(10,92,58,0.12)] flex items-center justify-center transition-all duration-300 hover:border-[#0A5C3A]/70 hover:shadow-[0_18px_44px_rgba(10,92,58,0.18)]"
            >
              <h2 className="text-lg sm:text-xl lg:text-[22px] font-extrabold font-headings text-[#0A5C3A] tracking-wider uppercase text-center leading-none select-none">
                TEMEL DEĞERLERİMİZ
              </h2>
            </motion.div>
          </div>

          {/* 5 Core Values Floating Cards */}
          {CORE_VALUES_DATA.map((item, index) => {
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
                  className={`group relative bg-white rounded-[24px] border p-6 sm:p-7 transition-all duration-300 ease-out cursor-default flex flex-col justify-start min-h-[220px] ${
                    isHovered
                      ? "-translate-y-1.5 scale-[1.03] border-[#0A5C3A] shadow-[0_18px_40px_rgba(15,17,21,0.10)] z-30"
                      : "border-[#EEF0F2] shadow-[0_10px_30px_rgba(15,17,21,0.06)] hover:-translate-y-1.5 hover:scale-[1.03] hover:border-[#0A5C3A] hover:shadow-[0_18px_40px_rgba(15,17,21,0.10)]"
                  }`}
                >
                  {/* Icon Box */}
                  <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center mb-3.5 group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 shrink-0">
                    <IconComp className="w-5.5 h-5.5 stroke-[2]" />
                  </div>

                  {/* Value Title */}
                  <h3 className="text-xl sm:text-[22px] font-bold font-headings text-[#0F1115] mb-2.5 group-hover:text-[#0A5C3A] transition-colors duration-300 text-left">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm sm:text-base text-[#5F6773] font-sans leading-[1.6] text-left">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>

        {/* ================= MOBILE VERTICAL STACK ================= */}
        <div className="block md:hidden w-full max-w-xl mx-auto select-none">
          {/* Mobile Center Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-headings text-[#0A5C3A] tracking-wider uppercase">
              TEMEL DEĞERLERİMİZ
            </h2>
          </div>

          {/* Vertical Cards Stack */}
          <div className="flex flex-col gap-5">
            {CORE_VALUES_DATA.map((item, index) => {
              const IconComp = item.icon;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: index * 0.06 }}
                  className="group bg-white rounded-[24px] border border-[#EEF0F2] p-6 sm:p-7 shadow-[0_10px_30px_rgba(15,17,21,0.06)] transition-all duration-300 hover:border-[#0A5C3A] hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,17,21,0.10)] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#0A5C3A]/8 text-[#0A5C3A] flex items-center justify-center group-hover:bg-[#0A5C3A] group-hover:text-white transition-colors duration-300 shrink-0">
                      <IconComp className="w-5.5 h-5.5 stroke-[2]" />
                    </div>
                    <h3 className="text-xl sm:text-[22px] font-bold font-headings text-[#0F1115] group-hover:text-[#0A5C3A] transition-colors duration-300">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-[#5F6773] font-sans leading-[1.6]">
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
