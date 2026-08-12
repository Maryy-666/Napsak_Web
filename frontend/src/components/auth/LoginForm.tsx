"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { PasswordInput } from "./PasswordInput";
import { Logo } from "../common/Logo";
import { AuthUser, saveCurrentUser } from "../../lib/memberAuth";
import { ROUTES } from "../../constants/routes";

// Zod Validation Schema for Login Credentials
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "E-posta adresi zorunludur.")
    .email("Geçerli bir e-posta adresi giriniz."),
  password: z
    .string()
    .min(1, "Şifre zorunludur."),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSubmitSuccess?: (user: AuthUser) => void;
  isFrozen?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmitSuccess,
  isFrozen = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [returnTo, setReturnTo] = useState<string | null>(null);
  const disabled = isSubmitting || isFrozen;
  const isLoading = isSubmitting || isFrozen;

  const customResolver = async (data: LoginFormData) => {
    try {
      const parsedData = loginSchema.parse(data);
      return { values: parsedData, errors: {} };
    } catch (err: any) {
      const issues = err.issues || err.errors || [];
      if (issues.length > 0) {
        const errors = issues.reduce((acc: any, current: any) => {
          const path = current.path[0];
          if (path) {
            acc[path] = {
              type: current.code,
              message: current.message,
            };
          }
          return acc;
        }, {});
        return { values: {}, errors };
      }
      return { values: {}, errors: {} };
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: customResolver as any,
    mode: "onBlur",
  });

  const emailValue = watch("email");
  const registerHref = returnTo
    ? `${ROUTES.KAYIT}?returnTo=${encodeURIComponent(returnTo)}`
    : ROUTES.KAYIT;

  useEffect(() => {
    setReturnTo(new URLSearchParams(window.location.search).get("returnTo"));
  }, []);

  const onSubmit = async (data: LoginFormData) => {
    if (disabled) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await response.json().catch(() => ({}));

      if (response.ok && responseData.success) {
        saveCurrentUser(responseData.user);
        if (onSubmitSuccess) {
          onSubmitSuccess(responseData.user);
        }
      } else {
        const { toast } = await import("sonner");
        toast.error(responseData.error || "Giriş başarısız oldu.");
      }
    } catch (err: any) {
      const { toast } = await import("sonner");
      toast.error(err.message || "Giriş yapılırken bir hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Horizontal Hero Header */}
      <div className="flex items-center gap-6 mb-[36px] text-left w-full select-none">
        <motion.div
          initial={{ scale: 0.75, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 14, delay: 0.05 }}
          className="shrink-0 flex items-center justify-center w-[72px] h-[72px] rounded-2xl overflow-hidden shadow-[0_2px_8px_rgba(15,17,21,0.04)] ring-1 ring-white/70"
        >
          <Logo size={72} variant="default" priority />
        </motion.div>
        <div className="flex flex-col justify-center min-w-0">
          <motion.h1
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-3xl sm:text-[44px] font-bold tracking-tight text-[#0F1115] font-headings leading-[1.1] select-none"
          >
            Hoş Geldiniz
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
            className="text-base sm:text-[17px] text-[#5F6773] mt-1.5 select-none font-medium font-sans leading-[1.5]"
          >
            Hesabınıza giriş yaparak devam edin.
          </motion.p>
        </div>
      </div>

      {/* Main Credentials Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col text-left" noValidate>
        {/* Email Input Field */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          className="w-full mb-[24px]"
        >
          <Input
            {...register("email")}
            type="email"
            label="E-posta"
            placeholder="ornek@gmail.com"
            required
            disabled={disabled}
            errorText={errors.email?.message}
            leftIcon={<Mail className="w-4.5 h-4.5" />}
            showClearButton={true}
            onClear={() => setValue("email", "", { shouldValidate: true })}
            value={emailValue}
            autoComplete="email"
            className="!h-[56px] sm:!h-[56px] !rounded-[14px] text-base focus:ring-[5px] focus:ring-[#0A5C3A]/14 focus:border-[#0A5C3A] transition-all duration-150 placeholder-[#9FA6B2] border-[#EEF0F2] hover:border-[#D1D5DB]"
          />
        </motion.div>

        {/* Password Input Field with Forgot Password */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.20 }}
          className="flex flex-col w-full relative mb-[24px]"
        >
          {/* Absolute Forgot Password Trigger */}
          <div className="absolute right-0 top-0.5 z-10">
            <Button
              variant="ghost"
              size="sm"
              href="/forgot-password"
              className="text-xs p-0 h-auto font-medium text-[#5F6773] hover:text-[#0A5C3A] hover:bg-transparent transition-colors duration-150"
              disabled={disabled}
              tabIndex={0}
            >
              Şifremi Unuttum
            </Button>
          </div>

          <PasswordInput
            {...register("password")}
            label="Şifre"
            placeholder="Şifrenizi girin"
            required
            disabled={disabled}
            errorText={errors.password?.message}
            leftIcon={<Lock className="w-4.5 h-4.5" />}
            autoComplete="current-password"
            className="!h-[56px] sm:!h-[56px] !rounded-[14px] text-base focus:ring-[5px] focus:ring-[#0A5C3A]/14 focus:border-[#0A5C3A] transition-all duration-150 placeholder-[#9FA6B2] border-[#EEF0F2] hover:border-[#D1D5DB]"
          />
        </motion.div>

        {/* Submit Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          className="w-full"
        >
          <Button
            type="submit"
            variant="primary"
            fullWidth
            isLoading={isLoading}
            disabled={disabled}
            className="!h-[56px] sm:!h-[56px] !rounded-[14px] text-base font-semibold bg-[#0A5C3A] hover:bg-[#0D7449] hover:shadow-[0_8px_20px_rgba(10,92,58,0.18)] hover:-translate-y-[1px] active:translate-y-0 transition-all duration-150"
            rightIcon={!isLoading && <span className="ml-1.5 text-lg leading-none">→</span>}
          >
            {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
          </Button>
        </motion.div>

        {/* Hairline Divider */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.28 }}
          className="w-full select-none pointer-events-none"
          style={{ height: "1px", backgroundColor: "#EEF0F2", marginTop: "28px", marginBottom: "28px" }}
        />

        {/* Registration CTA Area */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.30 }}
          className="w-full text-center flex flex-col items-center"
        >
          <p className="text-sm text-[#5F6773] select-none font-medium mb-[18px]">
            Henüz N'apsak? hesabın yok mu?
          </p>
          <Button
            href={registerHref}
            variant="ghost"
            disabled={disabled}
            className="text-base font-semibold text-[#0A5C3A] hover:text-[#0D7449] bg-transparent hover:bg-transparent p-0 h-auto transition-colors duration-150"
          >
            Ücretsiz Kayıt Ol →
          </Button>
        </motion.div>

        {/* Pin security caption message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.3, delay: 0.35 }}
          className="w-full flex items-center justify-center gap-1.5 select-none pointer-events-none text-[#5F6773] mt-[18px]"
        >
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs font-semibold tracking-wide font-sans">
            Güvenli bağlantı ile korunmaktadır.
          </span>
        </motion.div>

        {/* Subtle Brand Trust Caption */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 0.3, delay: 0.38 }}
          className="w-full text-center select-none pointer-events-none text-[#5F6773] mt-2"
        >
          <span className="text-[12px] font-normal leading-normal font-sans">
            N'apsak? Gençlik Topluluğu
          </span>
        </motion.div>
      </form>
    </div>
  );
};

LoginForm.displayName = "LoginForm";
