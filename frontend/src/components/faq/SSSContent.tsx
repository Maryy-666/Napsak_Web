"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { PageContainer } from "../ui/PageContainer";
import { PageHeader } from "../common/PageHeader";
import { FAQSection } from "./FAQSection";
import { Logo } from "../common/Logo";

export default function SSSContent() {
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <LayoutGroup id="sss-layout-group">
      <div
        className="relative min-h-[calc(100vh-80px)] w-full flex flex-col justify-start items-center bg-white px-4 py-8 sm:py-12 overflow-hidden select-none"
        id="sss-page-root"
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

        {/* Background Decorative Watermark Logo (Identical to İletişim and Başvuru pages) */}
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
          className="fixed left-1/2 top-1/2 pointer-events-none z-0 flex items-center justify-center select-none [&_*]:pointer-events-none"
        >
          <Logo
            variant="decorative"
            size={isMobile ? 420 : 840}
            opacity={1.0}
            priority
            className="w-full h-full select-none [&_img]:w-full [&_img]:h-full"
          />
        </motion.div>

        {/* Page Content Layout */}
        <div className="relative z-10 w-full flex flex-col items-center">
          <PageContainer>
            <PageHeader
              title="Sıkça Sorulan Sorular"
              description="Merak ettiğin tüm soruların cevaplarını burada bulabilirsin."
              badge="Destek & Bilgi"
              centered
            />
          </PageContainer>

          <FAQSection showHeader={false} background="transparent" />
        </div>
      </div>
    </LayoutGroup>
  );
}
