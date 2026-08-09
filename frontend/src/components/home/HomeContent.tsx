"use client";

import React, { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { Logo } from "../common/Logo";
import { Button } from "../ui/Button";
import { ROUTES } from "../../constants/routes";

export default function HomeContent() {
  const shouldReduceMotion = useReducedMotion();
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const isMobile = windowSize.width < 640;

  const springConfig = {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.15,
      },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };

  return (
    <div
      className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-center items-center bg-white px-4 py-16 sm:py-24 overflow-hidden pt-28"
      id="home-page-root"
    >
      {/* Subtle Radial Gradient at Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none z-0" />

      {/* Premium Line Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Grid Dot Intersections */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

      {/* Subtle Noise Grain Layer */}
      <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-0" />

      {/* Corner Green Spotlights */}
      <div
        className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0"
        style={{ backgroundColor: "rgba(10, 92, 58, 0.28)" }}
      />
      <div
        className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0"
        style={{ backgroundColor: "rgba(10, 92, 58, 0.32)" }}
      />

      {/* Background Decorative Watermark Logo */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {
                width: isMobile ? 420 : 840,
                height: isMobile ? 420 : 840,
                x: isMobile ? "25vw" : "28vw",
                y: "-10vh",
                rotate: -12,
                opacity: 0.06,
              }
            : {
                width: isMobile ? 420 : 840,
                height: isMobile ? 420 : 840,
                x: isMobile ? "25vw" : "28vw",
                y: "-10vh",
                rotate: -12,
                opacity: 0.06,
              }
        }
        transition={springConfig}
        style={{ translateX: "-50%", translateY: "-50%" }}
        className="fixed left-1/2 top-1/2 pointer-events-none z-0 flex items-center justify-center select-none"
      >
        <Logo
          variant="decorative"
          size={isMobile ? 420 : 840}
          opacity={1.0}
          priority
          className="w-full h-full select-none [&_img]:w-full [&_img]:h-full"
        />
      </motion.div>

      {/* HERO SECTION CONTENT */}
      <main className="w-full max-w-4xl mx-auto z-10 flex flex-col items-center justify-center text-center">
        <motion.div
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
          className="w-full flex flex-col items-center"
        >
          {/* Main Title */}
          <motion.h1
            variants={fadeUpVariants as any}
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#0F1115] font-headings select-none leading-tight mb-6"
          >
            N'apsak? Gençlik Topluluğu
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUpVariants as any}
            className="text-lg sm:text-xl text-[#5F6773] font-medium leading-relaxed max-w-2xl mx-auto mb-10 select-none font-sans"
          >
            Üreten, öğrenen ve birlikte gelişen gençlerin teknoloji topluluğu.
          </motion.p>

          {/* Two Action Buttons: Topluluğa Katıl & İletişime Geç */}
          <motion.div
            variants={fadeUpVariants as any}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Button
              href={ROUTES.BASVURU}
              variant="primary"
              size="lg"
              rightIcon={<ArrowRight className="w-4 h-4 stroke-[2]" />}
              className="w-full sm:w-56 font-semibold text-base"
            >
              Topluluğa Katıl
            </Button>
            <Button
              href={ROUTES.ILETISIM}
              variant="secondary"
              size="lg"
              leftIcon={<Mail className="w-4 h-4 stroke-[2]" />}
              className="w-full sm:w-56 font-semibold text-base"
            >
              İletişime Geç
            </Button>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
