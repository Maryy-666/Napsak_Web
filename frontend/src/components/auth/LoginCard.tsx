"use client";

import React from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Card } from "../ui/Card";
import { LoginForm } from "./LoginForm";
import { Logo } from "../common/Logo";
import { TransitionPhase } from "./LoginPageContent";
import { AuthUser } from "../../lib/memberAuth";

interface LoginCardProps {
  phase: TransitionPhase;
  setPhase: (phase: TransitionPhase) => void;
  onLoginSuccess?: (user: AuthUser) => void;
  isMobile?: boolean;
  springConfig?: any;
}

export const LoginCard: React.FC<LoginCardProps> = ({
  phase,
  setPhase,
  onLoginSuccess,
  isMobile = false,
  springConfig,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // Success card mounts when the logo starts shrinking to its final position
  const showSuccessCard =
    (phase as string) === "logo-shrink" ||
    (phase as string) === "success-text" ||
    (phase as string) === "progress" ||
    phase === "logo-move" ||
    phase === "success-title" ||
    phase === "success-line1" ||
    phase === "success-line2" ||
    phase === "success-progress" ||
    phase === "redirect";

  return (
    <div className="relative flex items-center justify-center min-h-[440px] w-full">
      <AnimatePresence mode="wait">
        {phase === "idle" || phase === "freeze" || (phase as string) === "dissolve" ? (
          // View 1: Standard Active Card containing Login Form
          <motion.div
            key="login-form-card"
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={
              (phase as string) === "dissolve"
                ? { opacity: 0, scale: 0.97, filter: "blur(6px)", y: 8 }
                : { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 }
            }
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex justify-center z-20"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full max-w-[520px] px-8 pt-8 pb-6 sm:px-12 sm:pt-10 sm:pb-6 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)]"
            >
              <LoginForm
                onSubmitSuccess={(user) => {
                  onLoginSuccess?.(user);
                  setPhase("freeze");
                }}
                isFrozen={phase === "freeze" || (phase as string) === "dissolve"}
              />
            </Card>
          </motion.div>
        ) : showSuccessCard ? (
          // View 2: Success layout card (mounted when logo starts shrinking)
          <motion.div
            key="login-success-card"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full flex justify-center z-20"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full max-w-[520px] px-8 pt-8 pb-6 sm:px-12 sm:pt-10 sm:pb-6 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col items-center text-center justify-center min-h-[360px]"
            >
              {/* 
                Success Logo placeholder & layout target
                - Receives the hero-logo LayoutId animation from the center logo!
              */}
              <motion.div
                layoutId="hero-logo"
                transition={springConfig}
                className="relative mb-8 z-30 flex items-center justify-center pointer-events-none"
                style={{
                  width: isMobile ? 64 : 72,
                  height: isMobile ? 64 : 72,
                  rotate: 0,
                  opacity: 1.0,
                }}
              >
                <Logo variant="decorative-white" size={isMobile ? 64 : 72} priority />
              </motion.div>

              {/* Handoff Content Area (Success Text & Progress Bar) */}
              <div className="w-full min-h-[160px] flex flex-col items-center justify-center">
                {/* 
                  STEP 5: Success Text
                  Only fades in when phase is "success-text" or later
                */}
                <AnimatePresence>
                  {((phase as string) === "success-text" || (phase as string) === "progress" || phase === "redirect") && (
                    <div className="flex flex-col items-center w-full">
                      {/* "Hoş Geldiniz" title */}
                      <motion.h2
                        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="text-3xl sm:text-[40px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight sm:leading-none mb-4"
                      >
                        Hoş Geldiniz
                      </motion.h2>

                      {/* "Başarıyla giriş yapıldı." (80ms delay) */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: 0.08, ease: "easeOut" }}
                        className="text-[#0A5C3A] font-semibold text-base"
                      >
                        Başarıyla giriş yapıldı.
                      </motion.p>

                      {/* "Yönlendiriliyorsunuz..." (120ms delay) */}
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: 0.12, ease: "easeOut" }}
                        className="text-sm text-[#5F6773] mt-1 font-medium font-sans"
                      >
                        Yönlendiriliyorsunuz...
                      </motion.p>

                      {/* 
                        STEP 6: Progress Bar
                        Only animates width when phase is "progress" or later
                      */}
                      <div className="w-48 h-[2px] bg-[rgba(10,92,58,0.08)] rounded-full mt-6 overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={
                            (phase as string) === "progress" || phase === "redirect"
                              ? { width: "100%" }
                              : { width: "0%" }
                          }
                          transition={{
                            duration: 1.0,
                            ease: "easeInOut",
                          }}
                          className="h-full bg-[#0A5C3A] rounded-full"
                        />
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

LoginCard.displayName = "LoginCard";
export default LoginCard;
