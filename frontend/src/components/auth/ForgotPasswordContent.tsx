"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";
import { PageBackground } from "../common/PageBackground";
import { useLanguage } from "../../context/LanguageContext";

// Form validation schema
const schema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
});

type FormData = z.infer<typeof schema>;

export type ForgotPasswordPhase =
  | "idle"
  | "freeze"
  | "logo-move"
  | "success-title"
  | "success-line1"
  | "success-progress"
  | "success-complete";

/**
 * Intelligent helper to return the most appropriate Webmail URL or fallback to mailto:
 */
function getMailAppUrl(email: string): string {
  if (!email || typeof email !== "string") return "mailto:";
  const domain = email.trim().toLowerCase().split("@")[1];
  if (!domain) return "mailto:";

  if (domain === "gmail.com" || domain === "googlemail.com") {
    return "https://mail.google.com";
  }
  if (["outlook.com", "hotmail.com", "live.com", "msn.com"].includes(domain)) {
    return "https://outlook.live.com";
  }
  if (["yahoo.com", "ymail.com", "myyahoo.com"].includes(domain)) {
    return "https://mail.yahoo.com";
  }
  if (["icloud.com", "me.com", "mac.com"].includes(domain)) {
    return "https://www.icloud.com/mail";
  }
  return "mailto:";
}

const STORAGE_KEY = "forgot_password_resend_until";

export default function ForgotPasswordContent() {
  const { language, t } = useLanguage();
  const isEn = language === "en";

  const [phase, setPhase] = useState<ForgotPasswordPhase>("idle");
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [countdown, setCountdown] = useState(0);
  const [isResending, setIsResending] = useState(false);
  const [resetUrl, setResetUrl] = useState<string | null>(null);
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

  // Initialize and persist countdown in localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedUntil = localStorage.getItem(STORAGE_KEY);
    if (storedUntil) {
      const until = parseInt(storedUntil, 10);
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      if (remaining > 0) {
        setCountdown(remaining);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Countdown tick handler based on target timestamp
  useEffect(() => {
    if (countdown <= 0) return;

    const interval = setInterval(() => {
      const storedUntil = localStorage.getItem(STORAGE_KEY);
      if (!storedUntil) {
        setCountdown(0);
        return;
      }
      const until = parseInt(storedUntil, 10);
      const remaining = Math.max(0, Math.ceil((until - Date.now()) / 1000));
      setCountdown(remaining);
      if (remaining <= 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const startCountdown = (seconds: number = 60) => {
    const targetTimestamp = Date.now() + seconds * 1000;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
    }
    setCountdown(seconds);
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { email: "" },
    mode: "onBlur",
  });

  const emailValue = watch("email");

  // Form submission handler with guaranteed try/catch/finally cleanup
  const handleFormSubmit = async (data: FormData) => {
    if (phase !== "idle") return;

    setPhase("freeze");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const resData = await response.json().catch(() => ({}));

      if (response.ok) {
        if (resData.resetUrl) {
          setResetUrl(resData.resetUrl);
        }
        // Step 1: Wait 200ms on freeze state before transitioning
        setTimeout(() => {
          setPhase("logo-move");
          startCountdown(60);
        }, 200);
      } else {
        throw new Error(resData.error || "İstek başarısız oldu.");
      }
    } catch (err: any) {
      setPhase("idle");
      const { toast } = await import("sonner");
      toast.error(err.message || "Bir hata oluştu.");
    }
  };

  const handleResend = async () => {
    if (countdown > 0 || isResending) return;
    setIsResending(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailValue }),
      });

      const resData = await response.json().catch(() => ({}));
      if (resData.resetUrl) {
        setResetUrl(resData.resetUrl);
      }

      const { toast } = await import("sonner");
      if (response.ok) {
        toast.success("Şifre sıfırlama bağlantısı tekrar gönderildi.");
        startCountdown(60);
      } else {
        toast.error(resData.error || "İstek başarısız oldu.");
      }
    } catch {
      const { toast } = await import("sonner");
      toast.error("Bağlantı gönderilemedi.");
    } finally {
      setIsResending(false);
    }
  };

  // State machine phase timers
  useEffect(() => {
    if (phase === "logo-move") {
      const timer = setTimeout(() => {
        setPhase("success-title");
      }, 1200);
      return () => clearTimeout(timer);
    }

    if (phase === "success-title") {
      const timer = setTimeout(() => {
        setPhase("success-line1");
      }, 330);
      return () => clearTimeout(timer);
    }

    if (phase === "success-line1") {
      const timer = setTimeout(() => {
        setPhase("success-progress");
      }, 330);
      return () => clearTimeout(timer);
    }

    if (phase === "success-progress") {
      const timer = setTimeout(() => {
        setPhase("success-complete");
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const springConfig = {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  };

  const glowOpacity = phase === "idle" || phase === "freeze" ? 1.0 : 0.4;
  const isDissolving = phase !== "idle" && phase !== "freeze";
  const disabled = phase === "freeze" || isDissolving;

  return (
    <LayoutGroup id="forgot-password-layout-group">
      <PageBackground id="forgot-password-page-root" className="justify-center select-none" showWatermark={false} glowOpacity={glowOpacity}>
        {/* Fullscreen Interaction Blocker ONLY active during initial transition animation */}
        {(phase === "freeze" || phase === "logo-move") && (
          <div className="fixed inset-0 z-50 pointer-events-auto cursor-wait bg-transparent" />
        )}

        {/* Shared watermark / success logo */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {
                  width: phase === "idle" || phase === "freeze" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  height: phase === "idle" || phase === "freeze" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  x: phase === "idle" || phase === "freeze" ? (isMobile ? "25vw" : "28vw") : "0vw",
                  y: phase === "idle" || phase === "freeze" ? "-10vh" : (isMobile ? "-165px" : "-175px"),
                  rotate: phase === "idle" || phase === "freeze" ? -12 : 0,
                  opacity: phase === "idle" || phase === "freeze" ? 0.06 : 1.0,
                }
              : phase === "idle" || phase === "freeze"
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
                  y: isMobile ? "-165px" : "-175px",
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

        {/* Card containing Forgot Password Form */}
        <AnimatePresence>
          {!isDissolving && (
            <motion.div
              key="forgot-password-card"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{
                opacity: 0,
                scale: 0.97,
                filter: "blur(6px)",
                y: 8,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-[560px] px-4 sm:px-6 flex justify-center items-center z-20 -mt-8 sm:-mt-12"
            >
              <Card
                variant="auth"
                animate={false}
                className="w-full max-w-[520px] px-8 pt-8 pb-8 sm:px-12 sm:pt-10 sm:pb-8 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col text-left"
              >
                {/* Header layout */}
                <div className="flex items-center gap-6 mb-10 select-none w-full">
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
                    className="shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
                  >
                    <Logo size={64} variant="default" priority />
                  </motion.div>
                  <div className="flex flex-col justify-center min-w-0 flex-1">
                    <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F1115] font-headings leading-none mb-3 whitespace-nowrap select-none">
                      {isEn ? "Forgot Password?" : "Şifrenizi mi Unuttunuz?"}
                    </h1>
                    <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium">
                      {isEn
                        ? "Enter your email address. If an account exists, we'll send a password reset link."
                        : "E-posta adresinizi girin. Hesabınız varsa, güvenli bir şifre sıfırlama bağlantısı göndereceğiz."}
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col w-full" noValidate>
                  <div className="w-full mb-[36px]">
                    <Input
                      {...register("email")}
                      type="email"
                      label={isEn ? "Email" : "E-posta"}
                      placeholder={isEn ? "example@napsak.com" : "ornek@napsak.com"}
                      required
                      disabled={disabled}
                      errorText={errors.email?.message ? (isEn ? (errors.email.message.includes("zorunlu") ? "Email address is required." : "Enter a valid email address.") : errors.email.message) : undefined}
                      leftIcon={<Mail className="w-4.5 h-4.5" />}
                      showClearButton={!disabled}
                      onClear={() => setValue("email", "", { shouldValidate: true })}
                      value={emailValue}
                      autoComplete="email"
                      className="!h-[56px] !rounded-[14px] text-base focus:ring-[5px] focus:ring-[#0A5C3A]/14 focus:border-[#0A5C3A] transition-all duration-150 border-[#EEF0F2] hover:border-[#D1D5DB]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={phase === "freeze"}
                    disabled={disabled}
                    className="!h-[56px] !rounded-[14px] text-base font-semibold bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
                  >
                    {isEn ? "Send Reset Link" : "Bağlantıyı Gönder"}
                  </Button>
                </form>

                {/* Back to login trigger */}
                <div className="w-full text-center mt-10 flex justify-center select-none">
                  <Link
                    href={ROUTES.LOGIN}
                    className={`inline-flex items-center gap-1.5 text-sm font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-all duration-150 ${disabled ? "pointer-events-none opacity-50" : ""}`}
                  >
                    <motion.span
                      whileHover={{ x: -2 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-1.5"
                    >
                      <span>←</span> {isEn ? "Back to Sign In" : "Girişe Dön"}
                    </motion.span>
                  </Link>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Layout Centered directly on the page background */}
        {isDissolving && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-auto select-none px-6">
            <div className="flex flex-col items-center text-center w-full max-w-[480px]">
              
              {/* Logo Spacer */}
              <div className={`${isMobile ? "h-[64px]" : "h-[72px]"} shrink-0`} />
              <div className="h-6 shrink-0" />

              {/* "Bağlantı Gönderildi" */}
              <AnimatePresence>
                {phase !== "logo-move" && (
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="flex flex-col items-center w-full"
                  >
                    <h2 className="text-3xl sm:text-[40px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight sm:leading-none select-none">
                      {isEn ? "Link Sent" : "Bağlantı Gönderildi"}
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status instruction & Mail icon */}
              <AnimatePresence>
                {(phase === "success-line1" || phase === "success-progress" || phase === "success-complete") && (
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="w-full flex flex-col items-center"
                  >
                    <p className="text-[#0A5C3A] font-semibold text-base max-w-[340px] mt-4">
                      {isEn
                        ? "If an account exists for this email address, a password reset link will be sent."
                        : "Eğer bu e-posta adresine ait bir hesap varsa, şifre sıfırlama bağlantısı gönderilecektir."}
                    </p>

                    <div className="flex flex-col items-center gap-2 select-none mt-6">
                      <Mail className="w-8 h-8 text-[#9FA6B2] stroke-[1.5]" />
                      <span className="text-sm font-semibold text-[#5F6773] font-sans">
                        {isEn ? "Please check your inbox." : "Lütfen gelen kutunuzu kontrol edin."}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action buttons, countdown, and spam message */}
              <AnimatePresence>
                {(phase === "success-progress" || phase === "success-complete") && (
                  <motion.div
                    initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="w-full flex flex-col items-center pointer-events-auto"
                  >
                    {/* Open Mail Application Button */}
                    <div className="mt-6 w-full flex flex-col items-center gap-3">
                      <a
                        href={getMailAppUrl(emailValue)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center h-[50px] px-8 rounded-[12px] text-sm font-semibold text-white bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150 cursor-pointer"
                      >
                        {isEn ? "Open Mail App" : "Mail Uygulamasını Aç"}
                      </a>

                      {resetUrl && (
                        <a
                          href={resetUrl}
                          className="inline-flex items-center justify-center h-[46px] px-6 rounded-[12px] text-xs font-bold text-[#0A5C3A] bg-[#EAF5EF] hover:bg-[#D6EBE0] border border-[#0A5C3A]/30 transition-all duration-150 cursor-pointer"
                        >
                          🔗 {isEn ? "Open Password Reset Link Directly" : "Şifre Sıfırlama Bağlantısını Doğrudan Aç"}
                        </a>
                      )}
                    </div>

                    {/* Resend Countdown */}
                    <div className="h-6 flex items-center justify-center mt-6">
                      <AnimatePresence mode="wait">
                        {countdown > 0 ? (
                          <motion.span
                            key="countdown-text"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.6 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="text-xs text-[#5F6773] font-semibold font-sans select-none"
                          >
                            {isEn ? `You can resend in ${countdown} seconds` : `${countdown} saniye sonra tekrar gönderebilirsiniz`}
                          </motion.span>
                        ) : (
                          <motion.button
                            key="resend-btn"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-xs font-semibold text-[#5F6773] hover:text-[#0A5C3A] transition-colors cursor-pointer"
                          >
                            {isResending ? (isEn ? "Sending..." : "Gönderiliyor...") : (isEn ? "Resend" : "Tekrar Gönder")}
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Spam message */}
                    <p className="text-xs text-[#9FA6B2] font-normal font-sans mt-5 select-none pointer-events-none">
                      💡 {isEn ? "Don't forget to check your spam folder." : "Spam klasörünüzü de kontrol etmeyi unutmayın."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </PageBackground>
    </LayoutGroup>
  );
}
