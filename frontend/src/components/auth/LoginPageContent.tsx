"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import LoginCard from "./LoginCard";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";

export type TransitionPhase =
  | "idle"
  | "freeze"
  | "logo-move"
  | "success-title"
  | "success-line1"
  | "success-line2"
  | "success-progress"
  | "redirect";

export default function LoginPageContent() {
  const router = useRouter();
  const [phase, setPhase] = useState<TransitionPhase>("idle");
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

  // Timers and transitions based on the strict linear state machine
  useEffect(() => {
    if (phase === "freeze") {
      // Step 1: Freeze UI for 200ms
      const timer = setTimeout(() => {
        setPhase("logo-move");
      }, 200);
      return () => clearTimeout(timer);
    }

    if (phase === "logo-move") {
      // Step 2 & 4: Logo moves and card dissolves. Logo takes ~1200ms to settle
      const timer = setTimeout(() => {
        setPhase("success-title");
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === "success-title") {
      // Step 6: Hoş Geldiniz fades in. Wait 80ms before next line
      const timer = setTimeout(() => {
        setPhase("success-line1");
      }, 80 + 250); // wait for fade duration (250ms) + 80ms stagger
      return () => clearTimeout(timer);
    }

    if (phase === "success-line1") {
      // Step 6: Line 1 fades in. Wait 80ms before next line
      const timer = setTimeout(() => {
        setPhase("success-line2");
      }, 80 + 250);
      return () => clearTimeout(timer);
    }

    if (phase === "success-line2") {
      // Step 6: Line 2 fades in. Wait 80ms before progress bar
      const timer = setTimeout(() => {
        setPhase("success-progress");
      }, 80 + 250);
      return () => clearTimeout(timer);
    }

    if (phase === "success-progress") {
      // Step 6 & 7: Progress bar loads for 1000ms
      const timer = setTimeout(() => {
        setPhase("redirect");
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (phase === "redirect") {
      // Step 7: Wait 200ms and redirect to Admin Panel using router.replace
      const timer = setTimeout(() => {
        router.replace(ROUTES.ADMIN);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase, router]);

  // Spring transition config for the shared logo
  const springConfig = {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  };

  // Fade glows from 100% to 40% when transitioning past dissolve (from logo-move onwards)
  const glowOpacity =
    phase === "idle" || phase === "freeze" ? 1.0 : 0.4;

  return (
    <LayoutGroup id="login-layout-group">
      <div
        className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-center items-center bg-white px-4 py-12 overflow-hidden select-none"
        id="login-page-root"
      >
        {/* Fullscreen Interaction Blocker during transition */}
        {phase !== "idle" && (
          <div className="fixed inset-0 z-50 pointer-events-auto cursor-wait bg-transparent" />
        )}

        {/* Subtle Radial Gradient at Center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none z-0" />

        {/* Premium Line Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

        {/* Grid Dot Intersections */}
        <div className="absolute inset-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />

        {/* Subtle Noise Grain Layer */}
        <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-0" />

        {/* Two Corner Green Spotlights - Opacity fades from 100% to 40% */}
        <motion.div
          animate={{ opacity: glowOpacity }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 left-0 -translate-x-1/4 -translate-y-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none z-0"
          style={{ backgroundColor: "rgba(10, 92, 58, 0.28)" }}
        />
        <motion.div
          animate={{ opacity: glowOpacity }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-[550px] h-[550px] rounded-full blur-[130px] pointer-events-none z-0"
          style={{ backgroundColor: "rgba(10, 92, 58, 0.32)" }}
        />

        {/* 
          1. Hero Logo (Single DOM Element)
          - Animates scale, opacity, rotation, and position concurrently.
          - Never fades out or duplicates.
        */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {
                  width: phase === "idle" || phase === "freeze" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  height: phase === "idle" || phase === "freeze" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  x: phase === "idle" || phase === "freeze" ? (isMobile ? "25vw" : "28vw") : "0vw",
                  y: phase === "idle" || phase === "freeze" ? "-10vh" : (isMobile ? "-100px" : "-120px"),
                  rotate: phase === "idle" || phase === "freeze" ? -12 : 0,
                  opacity: phase === "idle" || phase === "freeze" ? 0.06 : 1.0,
                }
              : (phase === "idle" || phase === "freeze")
              ? {
                  width: isMobile ? 420 : 840,
                  height: isMobile ? 420 : 840,
                  x: isMobile ? "25vw" : "28vw",
                  y: "-10vh",
                  rotate: -12,
                  opacity: 0.06,
                }
              : {
                  width: isMobile ? 64 : 72,
                  height: isMobile ? 64 : 72,
                  x: "0vw",
                  y: isMobile ? "-100px" : "-120px",
                  rotate: 0,
                  opacity: 1.0,
                }
          }
          transition={shouldReduceMotion ? { duration: 0.3 } : springConfig}
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

        {/* Interactive Login Card Wrapper */}
        {(phase === "idle" || phase === "freeze" || phase === "logo-move") && (
          <div className="w-full max-w-[560px] px-4 sm:px-6 flex justify-center items-center z-20 -mt-8 sm:-mt-12">
            <LoginCard phase={phase} setPhase={setPhase} />
          </div>
        )}

        {/* Success Layout Centered directly on the page background */}
        {(phase !== "idle" && phase !== "freeze" && phase !== "logo-move") && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none px-6">
            <div className="mt-[100px] sm:mt-[120px] flex flex-col items-center text-center w-full max-w-[480px]">
              {/* "Hoş Geldiniz" */}
              <AnimatePresence>
                {(phase === "success-title" ||
                  phase === "success-line1" ||
                  phase === "success-line2" ||
                  phase === "success-progress" ||
                  phase === "redirect") && (
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col items-center w-full"
                  >
                    <h2 className="text-3xl sm:text-[40px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight sm:leading-none mb-4">
                      Hoş Geldiniz
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Başarıyla giriş yapıldı." */}
              <AnimatePresence>
                {(phase === "success-line1" ||
                  phase === "success-line2" ||
                  phase === "success-progress" ||
                  phase === "redirect") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full"
                  >
                    <p className="text-[#0A5C3A] font-semibold text-base">
                      Başarıyla giriş yapıldı.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* "Yönlendiriliyorsunuz..." */}
              <AnimatePresence>
                {(phase === "success-line2" ||
                  phase === "success-progress" ||
                  phase === "redirect") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full mt-1.5"
                  >
                    <p className="text-sm text-[#5F6773] font-medium font-sans">
                      Yönlendiriliyorsunuz...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar (Step 6) */}
              <AnimatePresence>
                {(phase === "success-progress" || phase === "redirect") && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="w-48 h-[2px] bg-[rgba(10,92,58,0.08)] rounded-full mt-6 overflow-hidden"
                  >
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        duration: 1.0,
                        ease: "easeInOut",
                      }}
                      className="h-full bg-[#0A5C3A] rounded-full"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}
