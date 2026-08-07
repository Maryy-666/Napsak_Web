"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Logo } from "../common/Logo";
import { Button } from "../ui/Button";
import { ROUTES } from "../../constants/routes";

const STATS = [
  { value: "120+", label: "Gönüllü" },
  { value: "12+", label: "Çalışma Grubu" },
  { value: "40+", label: "Etkinlik" },
];

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Staggered Container Motion Variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  // Fade Up Content Motion Variants
  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1], // easeOutExpo
      },
    },
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 bg-white">
      {/* 
        Decorative Rotating Logo Watermark
        - 3% opacity to prevent contrast distraction
        - Pointer events and user selection disabled
        - Rotated -12 degrees matching v1.1 spec
      */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0"
        aria-hidden="true"
      >
        <Logo
          variant="decorative"
          size={580}
          rotation={-12}
          opacity={3}
          className="select-none"
        />
      </div>

      {/* Hero Content Container */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-4xl text-center flex flex-col items-center"
      >
        {/* Title */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-[#0F1115] font-headings select-none leading-none mb-6"
        >
          N'apsak?
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={fadeUpVariants}
          className="text-lg sm:text-xl md:text-2xl text-[#5F6773] font-medium leading-relaxed max-w-2xl mx-auto mb-10 select-none"
        >
          Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={fadeUpVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16"
        >
          <Button
            href={ROUTES.BASVURU}
            variant="primary"
            size="lg"
            className="w-full sm:w-48 font-semibold text-base"
          >
            Topluluğa Katıl
          </Button>
          <Button
            href={ROUTES.HAKKIMIZDA}
            variant="secondary"
            size="lg"
            className="w-full sm:w-48 font-medium text-base"
          >
            Hakkımızda
          </Button>
        </motion.div>

        {/* Semantic Statistics List */}
        <motion.div 
          variants={fadeUpVariants} 
          className="w-full max-w-xl border-t border-[#EEF0F2] pt-8"
        >
          <dl className="grid grid-cols-3 gap-6 sm:gap-12" id="hero-stats">
            {STATS.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center select-none"
              >
                {/* Description term rendered below value for readability but ordered properly for screen readers */}
                <dt className="order-2 text-xs sm:text-sm font-semibold text-[#5F6773] mt-1.5 uppercase tracking-wider">
                  {stat.label}
                </dt>
                {/* Description definition holds numerical value */}
                <dd className="order-1 text-3xl sm:text-4xl font-extrabold font-headings text-[#0A5C3A] leading-tight">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </div>
  );
};

HeroSection.displayName = "HeroSection";
export default HeroSection;
