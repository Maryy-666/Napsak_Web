"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { Card } from "../ui/Card";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";

const DEFAULT_GOOGLE_FORM_URL =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_URL ||
  "https://docs.google.com/forms/d/e/1FAIpQLSfdVNOuIb8ynpYORbOP6ujQstbsqDd7432nc-z31E3rTc3dxA/viewform?usp=dialog";

export default function BasvuruContent() {
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
    <LayoutGroup id="basvuru-layout-group">
      <div
        className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-center items-center bg-white px-4 py-12 overflow-hidden select-none"
        id="basvuru-page-root"
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

        {/* Application Card */}
        <div className="w-full max-w-[560px] px-4 sm:px-6 flex justify-center items-center z-20 -mt-8 sm:-mt-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full max-w-[520px] px-8 pt-8 pb-8 sm:px-12 sm:pt-10 sm:pb-8 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col text-left"
            >
              {/* Header layout matching Login page */}
              <div className="flex items-center gap-6 mb-8 select-none w-full">
                <motion.div
                  initial={{ scale: 0.75, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
                  className="shrink-0 flex items-center justify-center w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
                >
                  <Logo size={72} variant="default" priority />
                </motion.div>

                <div className="flex flex-col justify-center min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-[36px] font-bold tracking-tight text-[#0F1115] font-headings leading-none select-none">
                    Topluluğa Katıl
                  </h1>
                </div>
              </div>

              {/* Information Paragraphs */}
              <div className="flex flex-col gap-3 mb-8 select-none">
                <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                  N'apsak? topluluğuna katılmak için başvuru formunu doldurmanız gerekmektedir.
                </p>
                <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                  Başvurular ekibimiz tarafından incelenir ve uygun görülen adaylara e-posta yoluyla dönüş yapılır.
                </p>
              </div>

              {/* Primary Redirect Action Button */}
              <div className="w-full flex flex-col items-center">
                <a
                  href={DEFAULT_GOOGLE_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2.5 h-[56px] rounded-[14px] text-base font-semibold text-white bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150 cursor-pointer text-center"
                >
                  <span>Google Formu Aç</span>
                  <ExternalLink className="w-4.5 h-4.5 stroke-[2]" />
                </a>

                {/* Subtitle note below button */}
                <p className="text-xs text-[#9FA6B2] font-normal font-sans mt-3 text-center select-none">
                  Google Form yeni sekmede açılacaktır.
                </p>
              </div>

              {/* Secondary Link: Return to Login */}
              <div className="w-full text-center mt-8 flex justify-center select-none">
                <Link
                  href={ROUTES.LOGIN}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-all duration-150"
                >
                  <motion.span
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.15 }}
                    className="flex items-center gap-1.5"
                  >
                    <span>←</span> Girişe Dön
                  </motion.span>
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </LayoutGroup>
  );
}
