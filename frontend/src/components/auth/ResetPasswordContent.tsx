"use client";

import React, { useState, useEffect } from "react";
import { LayoutGroup, motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Check, AlertTriangle } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Logo } from "../common/Logo";
import { ROUTES } from "../../constants/routes";

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

// Password strength checklist rules
const checkMinLength = (val: string) => val.length >= 8;
const checkUpperCase = (val: string) => /[A-Z]/.test(val);
const checkLowerCase = (val: string) => /[a-z]/.test(val);
const checkDigit = (val: string) => /[0-9]/.test(val);
const checkSpecialChar = (val: string) => /[^A-Za-z0-9]/.test(val);

export type ResetPasswordPhase =
  | "checking"
  | "expired"
  | "idle"
  | "freeze"
  | "logo-move"
  | "success-title"
  | "success-line1"
  | "success-line2"
  | "success-progress"
  | "redirect";

interface ResetPasswordContentProps {
  token: string;
}

export default function ResetPasswordContent({ token }: ResetPasswordContentProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<ResetPasswordPhase>("checking");
  const [windowSize, setWindowSize] = useState({ width: 1200, height: 800 });
  const [tokenError, setTokenError] = useState<string | null>(null);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

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

  // Immediate token validation on page mount
  useEffect(() => {
    let isMounted = true;
    async function verifyToken() {
      if (!token) {
        if (isMounted) {
          setTokenError("Geçersiz doğrulama anahtarı.");
          setPhase("expired");
        }
        return;
      }

      try {
        const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
          method: "GET",
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          if (isMounted) {
            setTokenError(data.reason === "EXPIRED" ? "Bağlantının süresi dolmuş." : "Bağlantının süresi dolmuş.");
            setPhase("expired");
          }
        } else {
          if (isMounted) {
            setPhase("idle");
          }
        }
      } catch (err) {
        if (isMounted) {
          setTokenError("Doğrulama esnasında bir hata oluştu.");
          setPhase("expired");
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
    };
  }, [token]);

  // React Hook Form
  const {
    register,
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const passwordVal = watch("password") || "";
  const confirmPasswordVal = watch("confirmPassword") || "";

  // Real-time criteria checks
  const hasMinLength = checkMinLength(passwordVal);
  const hasUpperCase = checkUpperCase(passwordVal);
  const hasLowerCase = checkLowerCase(passwordVal);
  const hasDigit = checkDigit(passwordVal);
  const hasSpecial = checkSpecialChar(passwordVal);

  const criteria = [
    { label: "Minimum 8 karakter", satisfied: hasMinLength },
    { label: "Büyük harf", satisfied: hasUpperCase },
    { label: "Küçük harf", satisfied: hasLowerCase },
    { label: "Sayı", satisfied: hasDigit },
    { label: "Özel karakter", satisfied: hasSpecial },
  ];

  const satisfiedCount = criteria.filter((c) => c.satisfied).length;

  let strengthLabel = "Zayıf";
  let strengthPercent = "20%";

  if (satisfiedCount >= 5) {
    strengthLabel = "Çok Güçlü";
    strengthPercent = "100%";
  } else if (satisfiedCount === 4) {
    strengthLabel = "Güçlü";
    strengthPercent = "80%";
  } else if (satisfiedCount === 3) {
    strengthLabel = "Orta";
    strengthPercent = "60%";
  } else if (satisfiedCount === 2) {
    strengthLabel = "Zayıf";
    strengthPercent = "40%";
  }

  const handleFormSubmit = async (data: any) => {
    if (phase !== "idle") return;

    if (satisfiedCount < 5) {
      const { toast } = await import("sonner");
      toast.error("Lütfen şifre güvenlik kriterlerinin tamamını karşılayın.");
      return;
    }

    if (data.password !== data.confirmPassword) {
      const { toast } = await import("sonner");
      toast.error("Girdiğiniz şifreler uyuşmamaktadır.");
      return;
    }

    setPhase("freeze");

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          password: data.password,
          confirmPassword: data.confirmPassword,
        }),
      });

      if (response.ok) {
        setTimeout(() => {
          setPhase("logo-move");
        }, 200);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Şifre güncellenemedi.");
      }
    } catch (err: any) {
      setPhase("idle");
      const { toast } = await import("sonner");
      toast.error(err.message || "Bir hata oluştu.");
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
        setPhase("success-line2");
      }, 330);
      return () => clearTimeout(timer);
    }

    if (phase === "success-line2") {
      const timer = setTimeout(() => {
        setPhase("success-progress");
      }, 330);
      return () => clearTimeout(timer);
    }

    if (phase === "success-progress") {
      const timer = setTimeout(() => {
        setPhase("redirect");
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (phase === "redirect") {
      const timer = setTimeout(() => {
        router.replace(ROUTES.LOGIN);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [phase, router]);

  const springConfig = {
    type: "spring" as const,
    stiffness: 110,
    damping: 18,
    mass: 0.8,
  };

  const glowOpacity = phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? 1.0 : 0.4;
  const isDissolving = phase !== "idle" && phase !== "freeze" && phase !== "checking" && phase !== "expired";
  const disabled = phase === "freeze" || isDissolving;

  return (
    <LayoutGroup id="reset-password-layout-group">
      <div
        className="relative min-h-[calc(100vh-5rem)] w-full flex flex-col justify-center items-center bg-white px-4 py-12 overflow-hidden select-none"
        id="reset-password-page-root"
      >
        {/* Fullscreen Interaction Blocker ONLY active during initial transition animation */}
        {(phase === "freeze" || phase === "logo-move") && (
          <div className="fixed inset-0 z-50 pointer-events-auto cursor-wait bg-transparent" />
        )}

        {/* Background Visual Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(circle_at_center,rgba(10,92,58,0.04)_0%,transparent_75%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(rgba(10,92,58,0.14)_2px,transparent_2px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] pointer-events-none z-0" />
        <div className="absolute inset-0 bg-noise opacity-[0.015] pointer-events-none mix-blend-overlay z-0" />

        {/* Spotlight light glows */}
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

        {/* Shared watermark / success logo */}
        <motion.div
          animate={
            shouldReduceMotion
              ? {
                  width: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  height: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? (isMobile ? 420 : 840) : (isMobile ? 64 : 72),
                  x: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? (isMobile ? "25vw" : "28vw") : "0vw",
                  y: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? "-10vh" : (isMobile ? "-100px" : "-120px"),
                  rotate: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? -12 : 0,
                  opacity: phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired" ? 0.06 : 1.0,
                }
              : phase === "idle" || phase === "freeze" || phase === "checking" || phase === "expired"
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

        {/* State 1: Checking Token */}
        {phase === "checking" && (
          <div className="z-20 flex flex-col items-center justify-center py-12 text-center">
            <div className="w-8 h-8 border-3 border-[#0A5C3A] border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-sm font-semibold text-[#5F6773]">Bağlantı kontrol ediliyor...</p>
          </div>
        )}

        {/* State 2: Expired / Invalid Token View */}
        {phase === "expired" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-[560px] px-4 sm:px-6 flex justify-center items-center z-20 -mt-8 sm:-mt-12"
          >
            <Card
              variant="auth"
              animate={false}
              className="w-full max-w-[520px] px-8 pt-10 pb-10 sm:px-12 sm:pt-12 sm:pb-12 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 stroke-[2]" />
              </div>

              <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight mb-3 select-none">
                Bağlantının süresi dolmuş.
              </h1>

              <p className="text-base text-[#5F6773] leading-relaxed font-sans font-medium mb-8 max-w-[380px]">
                {tokenError || "Bu şifre sıfırlama bağlantısı artık geçerli değil veya daha önce kullanılmış."}
              </p>

              <Button
                onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}
                variant="primary"
                fullWidth
                className="!h-[56px] !rounded-[14px] text-base font-semibold bg-[#0A5C3A] hover:bg-[#0D7449] shadow-[0_1px_2px_rgba(10,92,58,0.18)] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
              >
                Yeni Bağlantı Oluştur
              </Button>
            </Card>
          </motion.div>
        )}

        {/* State 3: Card containing Reset Password Form */}
        <AnimatePresence>
          {!isDissolving && phase !== "checking" && phase !== "expired" && (
            <motion.div
              key="reset-password-card"
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
                className="w-full max-w-[520px] px-8 pt-8 pb-6 sm:px-12 sm:pt-10 sm:pb-6 rounded-[20px] sm:rounded-[24px] bg-white/84 backdrop-blur-[20px] border border-white/65 !shadow-[0_30px_80px_rgba(15,17,21,0.08)] flex flex-col text-left"
              >
                {/* Header layout */}
                <div className="flex items-center gap-6 mb-[36px] select-none">
                  <motion.div
                    initial={{ scale: 0.75, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
                    className="shrink-0 flex items-center justify-center w-16 h-16 rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
                  >
                    <Logo size={64} variant="default" priority />
                  </motion.div>
                  <div className="flex flex-col justify-center min-w-0">
                    <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[#0F1115] font-headings leading-tight mb-1 select-none">
                      Yeni Şifre Oluştur
                    </h1>
                    <p className="text-xs sm:text-[13px] text-[#5F6773] leading-normal font-sans font-medium">
                      Hesabınız için yeni bir güvenli şifre belirleyin.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col w-full" noValidate>
                  {/* Password Input */}
                  <div className="w-full mb-3 relative">
                    <Input
                      {...register("password")}
                      type={showPass ? "text" : "password"}
                      label="Yeni Şifre"
                      placeholder="Yeni şifrenizi girin"
                      required
                      disabled={disabled}
                      leftIcon={<Lock className="w-4.5 h-4.5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowPass(!showPass);
                          }}
                          className="p-1 rounded-full text-[#5F6773] hover:bg-[#F1F3F5] hover:text-[#0F1115] focus:outline-none transition-colors cursor-pointer select-none pointer-events-auto"
                          aria-label={showPass ? "Şifreyi gizle" : "Şifreyi göster"}
                          tabIndex={0}
                        >
                          {showPass ? <EyeOff className="w-4.5 h-4.5 stroke-[1.75px]" /> : <Eye className="w-4.5 h-4.5 stroke-[1.75px]" />}
                        </button>
                      }
                      className="!h-[56px] !rounded-[14px] text-base focus:ring-[5px] focus:ring-[#0A5C3A]/14 focus:border-[#0A5C3A] transition-all duration-150 border-[#EEF0F2] hover:border-[#D1D5DB]"
                    />
                  </div>

                  {/* Password Strength Indicator */}
                  {passwordVal && (
                    <div className="w-full mb-6 select-none">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs text-[#5F6773] font-medium font-sans">Şifre Gücü</span>
                        <span className="text-xs text-[#0A5C3A] font-bold font-sans">{strengthLabel}</span>
                      </div>
                      <div className="w-full h-1 bg-[rgba(10,92,58,0.08)] rounded-full overflow-hidden">
                        <motion.div
                          animate={{ width: strengthPercent }}
                          transition={{ duration: 0.3, ease: "easeOut" }}
                          className="h-full bg-[#0A5C3A]"
                        />
                      </div>

                      {/* Criteria checklist */}
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-3">
                        {criteria.map((c, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 select-none text-[#5F6773]">
                            <div
                              className={cn(
                                "w-4 h-4 rounded-full flex items-center justify-center transition-colors duration-150",
                                c.satisfied ? "bg-[#EEF7F3] text-[#0A5C3A]" : "bg-[#F1F3F5] text-[#9FA6B2]"
                              )}
                            >
                              <Check className="w-2.5 h-2.5 stroke-[3px]" />
                            </div>
                            <span className="text-xs font-semibold font-sans leading-none">{c.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Confirm Password Input */}
                  <div className="w-full mb-[24px]">
                    <Input
                      {...register("confirmPassword")}
                      type={showConfirmPass ? "text" : "password"}
                      label="Şifre Tekrar"
                      placeholder="Yeni şifrenizi tekrar girin"
                      required
                      disabled={disabled}
                      leftIcon={<Lock className="w-4.5 h-4.5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowConfirmPass(!showConfirmPass);
                          }}
                          className="p-1 rounded-full text-[#5F6773] hover:bg-[#F1F3F5] hover:text-[#0F1115] focus:outline-none transition-colors cursor-pointer select-none pointer-events-auto"
                          aria-label={showConfirmPass ? "Şifreyi gizle" : "Şifreyi göster"}
                          tabIndex={0}
                        >
                          {showConfirmPass ? <EyeOff className="w-4.5 h-4.5 stroke-[1.75px]" /> : <Eye className="w-4.5 h-4.5 stroke-[1.75px]" />}
                        </button>
                      }
                      className="!h-[56px] !rounded-[14px] text-base focus:ring-[5px] focus:ring-[#0A5C3A]/14 focus:border-[#0A5C3A] transition-all duration-150 border-[#EEF0F2] hover:border-[#D1D5DB]"
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    isLoading={phase === "freeze"}
                    disabled={disabled}
                    className="!h-[56px] !rounded-[14px] text-base font-semibold bg-[#0A5C3A] hover:bg-[#0D7449] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
                  >
                    Şifreyi Güncelle
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Layout Centered directly on the page background */}
        {isDissolving && (
          <div className="fixed inset-0 flex flex-col items-center justify-center z-20 pointer-events-none select-none px-6">
            <div className="mt-[100px] sm:mt-[120px] flex flex-col items-center text-center w-full max-w-[480px]">
              {/* "Şifreniz Güncellendi" */}
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
                      Şifreniz Güncellendi
                    </h2>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Status text */}
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
                      Yeni şifreniz başarıyla kaydedildi.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Direction prompt text */}
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
                      Giriş ekranına yönlendiriliyorsunuz...
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Progress Bar */}
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
